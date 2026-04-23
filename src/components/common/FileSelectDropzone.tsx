import { useCallback, useState, useRef, DragEvent } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/utils/cn';

// Map of common file extensions to MIME types
const EXTENSION_TO_MIME: Record<string, string[]> = {
  pdf: ['application/pdf'],
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  png: ['image/png'],
  gif: ['image/gif'],
  doc: ['application/msword'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  xls: ['application/vnd.ms-excel'],
  xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  zip: ['application/zip', 'application/x-zip-compressed'],
  mp4: ['video/mp4'],
  mp3: ['audio/mpeg'],
  wav: ['audio/wav'],
  webp: ['image/webp'],
  txt: ['text/plain'],
  csv: ['text/csv'],
};

interface FileSelectDropzoneProps {
  /** Called when a file is selected (locally, not uploaded) */
  onSelect: (file: File) => void;
  /** Called when the selected file is removed */
  onRemove: () => void;
  /** The currently selected file */
  selectedFile?: File | null;
  /** Accepted file types — can be extensions ('pdf') or MIME types ('application/pdf') */
  acceptedTypes?: string[];
  /** Max file size in MB */
  maxSizeMb?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * A drag-and-drop file selection zone that stores the file locally
 * (no upload). Used during form creation flows where upload happens later.
 */
export function FileSelectDropzone({
  onSelect,
  onRemove,
  selectedFile,
  acceptedTypes,
  maxSizeMb = 10,
  disabled = false,
  className,
}: FileSelectDropzoneProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): boolean => {
    // Validate file type
    if (acceptedTypes && acceptedTypes.length > 0) {
      const fileMimeType = file.type.toLowerCase();
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

      const isAllowed = acceptedTypes.some(acceptedType => {
        const normalizedType = acceptedType.toLowerCase();
        if (normalizedType.includes('/')) {
          return fileMimeType === normalizedType;
        }
        if (fileExtension === normalizedType) return true;
        const expectedMimes = EXTENSION_TO_MIME[normalizedType];
        return expectedMimes ? expectedMimes.includes(fileMimeType) : false;
      });

      if (!isAllowed) {
        const displayTypes = acceptedTypes
          .map(t => (t.includes('/') ? t.split('/').pop() : t))
          .join(', ')
          .toUpperCase();
        setError(`Invalid file type. Allowed: ${displayTypes}`);
        return false;
      }
    }

    // Validate file size
    const fileSizeMb = file.size / (1024 * 1024);
    if (fileSizeMb > maxSizeMb) {
      setError(`File size (${fileSizeMb.toFixed(1)}MB) exceeds maximum (${maxSizeMb}MB)`);
      return false;
    }

    setError(null);
    return true;
  }, [acceptedTypes, maxSizeMb]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onSelect(file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      onSelect(file);
    }
  };

  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Show selected file
  if (selectedFile) {
    return (
      <div className={cn(
        'flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-100)]',
        className,
      )}>
        <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate text-[var(--text-primary)]">
            {selectedFile.name}
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5">
            {formatFileSize(selectedFile.size)}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
            setError(null);
          }}
          className="hover:bg-red-500/10 hover:text-red-500"
          title="Remove file"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  // Show dropzone
  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'p-4 rounded-lg border-2 border-dashed transition-colors cursor-pointer',
        isDragActive
          ? 'border-blue-500 bg-blue-500/5'
          : 'border-[var(--border)] hover:border-blue-500/50',
        disabled && 'opacity-50 cursor-not-allowed',
        error && 'border-red-500 bg-red-500/5',
        className,
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept={acceptedTypes?.join(',')}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-2 text-center">
        <Upload className={cn(
          'w-8 h-8',
          isDragActive ? 'text-blue-500' : 'text-[var(--text-muted)]',
        )} />
        <div className="text-sm">
          {isDragActive ? (
            <span className="text-blue-500 font-medium">Drop file here</span>
          ) : (
            <>
              <span className="font-medium text-blue-500">Click to upload</span>
              <span className="text-[var(--text-muted)]"> or drag and drop</span>
            </>
          )}
        </div>
        <div className="text-xs text-[var(--text-muted)]">
          Max size: {maxSizeMb}MB
        </div>
        {error && (
          <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
