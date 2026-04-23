# Hooks Reference — `@nextleap-al/admin-ui`

All hooks are importable from the package root:

```ts
import {
  useDebounce,
  useDebouncedCallback,
  useInlineEdit,
  useRowInlineEdit,
  useQueryParams,
} from '@nextleap-al/admin-ui';
```

---

## `useDebounce(value, delay)`

Returns a debounced copy of the value — only updates `delay` ms after the
last change.

```ts
function useDebounce<T>(value: T, delay: number): T;
```

```tsx
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

useEffect(() => {
  if (!debouncedSearch) return;
  fetchResults(debouncedSearch);
}, [debouncedSearch]);
```

## `useDebouncedCallback(fn, delay)`

Returns a stable callback that debounces `fn`.

```ts
function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void;
```

```tsx
const debouncedSave = useDebouncedCallback((value: string) => {
  api.save(value);
}, 500);

<Input onChange={(e) => debouncedSave(e.target.value)} />
```

---

## `useInlineEdit`

Manages the state for a single inline-editable field (name, description,
count, etc.). Handles async save, optimistic UI, `Enter`/`Escape`
shortcuts, and save-on-blur.

```ts
interface UseInlineEditOptions<T> {
  initialValue: T;
  onSave: (value: T) => Promise<void>;
  onCancel?: () => void;
  validateOnBlur?: boolean;
  saveOnBlur?: boolean;    // default true
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

function useInlineEdit<T>(options: UseInlineEditOptions<T>): UseInlineEditReturn<T>;
```

- `Enter` triggers `save()` (unless `Shift` is held).
- `Escape` triggers `cancelEdit()`.
- Blurring the input saves automatically when `saveOnBlur` is `true`.
- `save()` no-ops when the value hasn't changed.

```tsx
function EditableName({ user }: { user: User }) {
  const edit = useInlineEdit({
    initialValue: user.name,
    onSave: async (v) => { await api.updateUser(user.id, { name: v }); },
  });

  if (!edit.isEditing) {
    return <button onClick={edit.startEdit}>{edit.value || '—'}</button>;
  }

  return (
    <div>
      <input
        ref={edit.inputRef as React.RefObject<HTMLInputElement>}
        value={edit.value}
        onChange={(e) => edit.setValue(e.target.value)}
        onKeyDown={edit.handleKeyDown}
        onBlur={edit.handleBlur}
        disabled={edit.isSaving}
      />
      {edit.error && <p className="text-red-500 text-xs">{edit.error}</p>}
    </div>
  );
}
```

---

## `useRowInlineEdit`

Same idea as `useInlineEdit` but scoped to a whole row, allowing multiple
fields to share editing state (one field edited at a time). Positional
args: `(row, onSave)`.

```ts
function useRowInlineEdit<T extends Record<string, unknown>>(
  row: T,
  onSave: (updates: Partial<T>) => Promise<void>,
): {
  editingField: keyof T | null;
  isSaving: boolean;
  error: string | null;
  startEdit: (field: keyof T) => void;
  cancelEdit: () => void;
  save: () => Promise<void>;
  /**
   * Returns a bundle you can spread onto an EditableCell (or pass to any
   * component exposing the same shape).
   */
  getFieldProps: (field: keyof T) => {
    value: unknown;
    isEditing: boolean;
    onStartEdit: () => void;
    onCancel: () => void;
    onChange: (value: unknown) => void;
    onSave: () => void;
  };
};
```

Example with `EditableCell`:

```tsx
const row = useRowInlineEdit(user, async (updates) => { await api.update(user.id, updates); });

<EditableCell type="text" {...row.getFieldProps('name') as any} isSaving={row.isSaving} />
<EditableCell type="number" {...row.getFieldProps('age') as any} isSaving={row.isSaving} />
```

---

## `useQueryParams` *(requires `react-router-dom`)*

Thin wrapper around `useSearchParams` that typedly exposes the common
table/listing params (`page`, `pageSize`, `search`, `sort`) and provides
ergonomic setters.

```ts
function useQueryParams(): {
  params: QueryParams;        // Record<string, string | number | undefined>
  setParams: (
    newParams: Partial<QueryParams>,
    replace?: boolean,
  ) => void;
  setParam: (
    key: string,
    value: string | number | boolean | undefined,
  ) => void;
  removeParam: (key: string) => void;
  clearParams: () => void;

  // Convenience getters
  page: number;               // parsed int, default 1
  pageSize: number;           // parsed int, default 20
  search: string;             // default ''
  sort: string;               // default ''
};
```

- `page` and `pageSize` are automatically parsed to numbers.
- Passing `undefined`, `null`, or `''` to `setParam` / `setParams` removes
  the key from the URL.
- `setParams(newParams, true)` **replaces** the entire query string
  instead of merging.

```tsx
const { page, pageSize, search, setParam, setParams } = useQueryParams();

<DataTable
  pagination={{ ...meta }}
  onPageChange={(next) => setParam('page', next)}
  onPageSizeChange={(size) => setParams({ pageSize: size, page: 1 })}
  searchValue={search}
  onSearchChange={(v) => setParams({ search: v, page: 1 })}
/>
```

> **Requirement:** the app must be wrapped in a `<BrowserRouter>` (or
> equivalent `react-router-dom` provider). If you use a different router,
> build your own equivalent hook — the rest of the library does not depend
> on this one.
