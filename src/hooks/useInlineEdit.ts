import { useState, useCallback, useRef, useEffect } from 'react';

interface UseInlineEditOptions<T> {
  initialValue: T;
  onSave: (value: T) => Promise<void>;
  onCancel?: () => void;
  validateOnBlur?: boolean;
  saveOnBlur?: boolean;
}

interface UseInlineEditReturn<T> {
  value: T;
  isEditing: boolean;
  isSaving: boolean;
  error: string | null;
  startEdit: () => void;
  cancelEdit: () => void;
  setValue: (value: T) => void;
  save: () => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleBlur: () => void;
}

export function useInlineEdit<T>({
  initialValue,
  onSave,
  onCancel,
  saveOnBlur = true,
}: UseInlineEditOptions<T>): UseInlineEditReturn<T> {
  const [value, setValueState] = useState<T>(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const originalValue = useRef<T>(initialValue);

  useEffect(() => {
    setValueState(initialValue);
    originalValue.current = initialValue;
  }, [initialValue]);

  const startEdit = useCallback(() => {
    setIsEditing(true);
    setError(null);
    originalValue.current = value;
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  }, [value]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setValueState(originalValue.current);
    setError(null);
    onCancel?.();
  }, [onCancel]);

  const setValue = useCallback((newValue: T) => {
    setValueState(newValue);
    setError(null);
  }, []);

  const save = useCallback(async () => {
    if (value === originalValue.current) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(value);
      setIsEditing(false);
      originalValue.current = value;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  }, [value, onSave]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        save();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
      }
    },
    [save, cancelEdit]
  );

  const handleBlur = useCallback(() => {
    if (saveOnBlur && isEditing && !isSaving) {
      save();
    }
  }, [saveOnBlur, isEditing, isSaving, save]);

  return {
    value,
    isEditing,
    isSaving,
    error,
    startEdit,
    cancelEdit,
    setValue,
    save,
    inputRef,
    handleKeyDown,
    handleBlur,
  };
}

export function useRowInlineEdit<T extends Record<string, unknown>>(
  row: T,
  onSave: (updates: Partial<T>) => Promise<void>
) {
  const [editingField, setEditingField] = useState<keyof T | null>(null);
  const [pendingValues, setPendingValues] = useState<Partial<T>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEdit = useCallback((field: keyof T) => {
    setEditingField(field);
    setPendingValues({ [field]: row[field] } as Partial<T>);
    setError(null);
  }, [row]);

  const cancelEdit = useCallback(() => {
    setEditingField(null);
    setPendingValues({});
    setError(null);
  }, []);

  const updateValue = useCallback((field: keyof T, value: unknown) => {
    setPendingValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const save = useCallback(async () => {
    if (!editingField || pendingValues[editingField] === row[editingField]) {
      setEditingField(null);
      setPendingValues({});
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(pendingValues);
      setEditingField(null);
      setPendingValues({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  }, [editingField, pendingValues, row, onSave]);

  const getFieldProps = useCallback(
    (field: keyof T) => ({
      value: editingField === field ? pendingValues[field] : row[field],
      isEditing: editingField === field,
      onStartEdit: () => startEdit(field),
      onCancel: cancelEdit,
      onChange: (value: unknown) => updateValue(field, value),
      onSave: save,
    }),
    [editingField, pendingValues, row, startEdit, cancelEdit, updateValue, save]
  );

  return {
    editingField,
    isSaving,
    error,
    startEdit,
    cancelEdit,
    save,
    getFieldProps,
  };
}
