# Component Reference — `@nextleap/next-ui`

Complete prop reference for every exported component. Props marked with `?`
are optional. All components accept a `className` that is merged with the
component's internal classes via `tailwind-merge`.

All components are imported from the package root:

```ts
import { Button, Card, Input, DataTable, /* etc. */ } from '@nextleap/next-ui';
```

---

## Table of contents

- [Actions](#actions)
  - [`Button`](#button)
- [Form](#form)
  - [`Input`](#input)
  - [`Textarea`](#textarea)
  - [`Checkbox`](#checkbox)
  - [`Switch` / `StatusSwitch`](#switch--statusswitch)
  - [`SimpleDropdown`](#simpledropdown)
  - [`SearchDropdown`](#searchdropdown)
  - [`MultiSelectDropdown`](#multiselectdropdown)
  - [`MultiSelectSimple`](#multiselectsimple)
  - [`ActionMenu`](#actionmenu)
  - [`Calendar`](#calendar)
  - [`DatePicker`](#datepicker)
  - [`DateRangePicker`](#daterangepicker)
  - [`DateRangePickerWithTimeInput`](#daterangepickerwithtimeinput)
- [Display](#display)
  - [`Card`, `CardHeader`, `CardContent`, `CardFooter`](#card)
  - [`Badge` / `StatusBadge`](#badge--statusbadge)
  - [`Avatar` / `AvatarGroup`](#avatar--avatargroup)
  - [`Tooltip`](#tooltip)
  - [`Skeleton` + variants](#skeleton--variants)
  - [`EmptyState` + presets](#emptystate--presets)
  - [`PageHeader`](#pageheader)
  - [`Breadcrumbs`](#breadcrumbs)
  - [`Logo`](#logo)
- [Overlay](#overlay)
  - [`Modal`](#modal)
  - [`ConfirmModal`](#confirmmodal)
  - [`Dropdown` (low-level menu)](#dropdown-low-level-menu)
- [Data](#data)
  - [`DataTable`](#datatable)
  - [`EditableCell`](#editablecell)
  - [`RowActions`](#rowactions)
  - [`Tabs`, `TabList`, `TabTrigger`, `TabContent`](#tabs)
- [Interaction](#interaction)
  - [`SortableList` / `SortableItem`](#sortablelist--sortableitem)
  - [`FileUploadDropzone`](#fileuploaddropzone)
  - [`FileSelectDropzone`](#fileselectdropzone)
- [Layout (app shell)](#layout-app-shell)
  - [`AppShell`](#appshell)
  - [`SidebarShell`](#sidebarshell)
  - [`SidebarSection`](#sidebarsection)
  - [`SidebarNavItem`](#sidebarnavitem)
  - [`SidebarFooterActions`](#sidebarfooteractions)
  - [`TopbarShell`](#topbarshell)
  - [`ThemeToggleButton`](#themetogglebutton)
  - [`SearchTriggerButton`](#searchtriggerbutton)
  - [`NotificationBell`](#notificationbell)

---

## Actions

### `Button`

```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'; // default 'primary'
  size?: 'sm' | 'md' | 'lg' | 'icon';                                  // default 'md'
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}
```

When `isLoading` is true the button is disabled and a spinner replaces
`leftIcon`. `size="icon"` renders a square icon-only button (use `leftIcon`
for the glyph).

---

## Form

### `Input`

```ts
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg'; // default 'md'
}
```

- `type="password"` automatically renders an eye/eye-off toggle as the
  right icon.
- `error` overrides `hint` visually and turns the border red.

### `Textarea`

```ts
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}
```

### `Checkbox`

```ts
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg'; // default 'md'
  // checked, onChange, name, value, ... are the native React change events
}
```

> `onChange` is the native input change event — read `e.target.checked`.

### `Switch` / `StatusSwitch`

```ts
interface SwitchProps {
  checked: boolean;
  /**
   * Sync or async handler. If the returned promise rejects the switch
   * reverts the optimistic update.
   */
  onChange: (checked: boolean) => void | Promise<void>;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';   // default 'md'
  disabled?: boolean;
  loading?: boolean;           // external loading flag (prefer async onChange)
  className?: string;
}

interface StatusSwitchProps extends Omit<SwitchProps, 'checked' | 'onChange'> {
  isActive: boolean;
  onToggle: (isActive: boolean) => void | Promise<void>;
  activeLabel?: string;    // default 'Active'
  inactiveLabel?: string;  // default 'Inactive'
  showLabel?: boolean;     // default false
}
```

### `SimpleDropdown`

```ts
interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  divider?: boolean;
  /** Extra text matched by SearchDropdown's internal filter. */
  searchText?: string;
}

interface SimpleDropdownProps {
  options: DropdownOption[];
  value?: string | number | null;
  onChange: (value: string | number) => void;
  placeholder?: string;        // default 'Select'
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';   // default 'md'
  className?: string;
  required?: boolean;
  id?: string;
  name?: string;
}
```

### `SearchDropdown`

```ts
interface SearchDropdownProps extends Omit<SimpleDropdownProps, 'onChange'> {
  onChange: (value: string | number) => void;
  searchPlaceholder?: string;              // default 'Search...'
  loading?: boolean;
  /** Custom filter (default: matches label + searchText, case-insensitive). */
  filterFn?: (option: DropdownOption, query: string) => boolean;
  /** Optional callback invoked as the user types (for external analytics). */
  onSearchChange?: (query: string) => void;
}
```

> **Server-side search**: there is no dedicated `asyncSearch` mode.
> Pre-filter the `options` array yourself (with `useDebounce` + fetch) and
> pass `loading` to show a spinner.

### `MultiSelectDropdown`

```ts
interface MultiSelectDropdownProps {
  options: DropdownOption[];
  value: Array<string | number>;
  onChange: (value: Array<string | number>) => void;
  placeholder?: string;                  // default 'Select'
  searchPlaceholder?: string;            // default 'Search...'
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';             // default 'md'
  className?: string;
  showSelectAll?: boolean;               // default false
  selectAllLabel?: string;               // default 'Select all'
  /** Max items to show in the trigger label before collapsing to "N selected". */
  maxDisplayItems?: number;              // default 2
  /** Custom label renderer for the trigger. */
  renderLabel?: (selectedOptions: DropdownOption[]) => ReactNode;
  filterFn?: (option: DropdownOption, query: string) => boolean;
  required?: boolean;
  id?: string;
  name?: string;
}
```

### `MultiSelectSimple`

Same shape as `MultiSelectDropdown` but without the search input:

```ts
interface MultiSelectSimpleProps extends Omit<MultiSelectDropdownProps,
  'searchPlaceholder' | 'filterFn'
> {}
```

### `ActionMenu`

```ts
import type { LucideIcon } from 'lucide-react';

interface ActionMenuItem {
  key: string;
  label: string;
  icon?: LucideIcon;              // the icon *component*, not a JSX element
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;          // red styling
  divider?: boolean;              // render as a divider (label can be empty)
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  align?: 'left' | 'right';       // default 'right'
  /**
   * When true renders the default three-dot trigger button. Pass a ReactNode
   * to use a fully custom trigger.
   */
  moreIcon?: boolean | ReactNode;
  className?: string;
}
```

### `Calendar`

Low-level calendar (built on `react-day-picker`). Most apps should use
`DatePicker` / `DateRangePicker`. Exported as `Calendar`, re-exports the
`Matcher` type from `react-day-picker`.

### `DatePicker`

```ts
interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;
  presets?: DatePreset[];                 // use DEFAULT_DATE_PRESETS for a standard set
  disabled?: boolean;
  disabledDays?: Matcher | Matcher[];
  disableNavigation?: boolean;
  enableYearNavigation?: boolean;         // default false
  placeholder?: string;                   // default 'Select date'
  hasError?: boolean;
  locale?: Locale;                        // date-fns locale, default enUS
  translations?: { cancel?: string; apply?: string };
  align?: 'center' | 'end' | 'start';     // default 'center'
  fromDate?: Date;
  toDate?: Date;
  fromYear?: number;
  toYear?: number;
  required?: boolean;
  id?: string;
  className?: string;
  'aria-invalid'?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-required'?: boolean;
}

interface DatePreset { label: string; date: Date }
```

### `DateRangePicker`

```ts
interface DateRange { from: Date | undefined; to?: Date | undefined }
interface DateRangePreset { label: string; dateRange: DateRange }

interface DateRangePickerProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  presets?: DateRangePreset[];            // or DEFAULT_DATE_RANGE_PRESETS
  disabled?: boolean;
  disabledDays?: Matcher | Matcher[];
  disableNavigation?: boolean;
  enableYearNavigation?: boolean;
  placeholder?: string;                   // default 'Select date range'
  hasError?: boolean;
  locale?: Locale;
  translations?: {
    cancel?: string;
    apply?: string;
    range?: string;
    start?: string;
    end?: string;
  };
  align?: 'center' | 'end' | 'start';
  fromDate?: Date;
  toDate?: Date;
  fromYear?: number;
  toYear?: number;
  required?: boolean;
  id?: string;
  className?: string;
}
```

### `DateRangePickerWithTimeInput`

Same shape as `DateRangePickerProps` with identical props. Adds hour/minute
inputs inside the calendar popover for both the `from` and `to` dates, so
the resulting `Date` objects include a time component.

---

## Display

### `Card`

```ts
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'outline'; // default 'default'
  padding?: 'none' | 'sm' | 'md' | 'lg';     // default 'md'
  hover?: boolean;
}
```

`CardHeader` accepts either standard `children` **or** the shorthand props:

```ts
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}
```

`CardContent` and `CardFooter` are plain `<div>` wrappers with padding +
the `border-t` divider on the footer.

### `Badge` / `StatusBadge`

```ts
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';  // default 'md'
  dot?: boolean;
}

interface StatusBadgeProps {
  status?: string | null;
}
```

`StatusBadge` normalizes status strings (`draft`, `pending`, `approved`,
`confirmed`, `rejected`, `cancelled`, `active`, `inactive`, `completed`,
`in_progress`, `submission_open`, `submission_closed`, `paid`, `unpaid`,
`present`, `absent`, `late`, and `pending_*` variants) into the right
Badge color and label.

### `Avatar` / `AvatarGroup`

```ts
interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // default 'md'
  className?: string;
}

interface AvatarGroupProps {
  users: { name: string; src?: string }[];
  max?: number;                             // default 4
  size?: AvatarProps['size'];
  className?: string;
}
```

When `src` is missing or fails to load, Avatar falls back to the initials of
`name` with a deterministic background color derived from `name`.

### `Tooltip`

```ts
interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left'; // default 'top'
  delay?: number;                                  // default 300ms
  className?: string;
}
```

### `Skeleton` + variants

```ts
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'; // default 'text'
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';                      // default 'wave'
}

SkeletonText({ lines?: number; className?: string })
SkeletonCard({ className?: string })
SkeletonTable({ rows?: number; cols?: number; className?: string })
SkeletonList({ items?: number; className?: string })
```

### `EmptyState` + presets

```ts
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  variant?: 'default' | 'compact';
  className?: string;
}
```

Preset components (all return an `EmptyState` with sensible defaults):

| Component         | Props                                                 |
| ----------------- | ----------------------------------------------------- |
| `NoResults`       | `{ onClear?: () => void }`                            |
| `NoData`          | `{ entity?: string; onCreate?: () => void }`          |
| `NoUsers`         | `{ onInvite?: () => void }`                           |
| `NoNotifications` | `{}`                                                  |
| `NoEvents`        | `{ onAdd?: () => void }`                              |
| `NoCompetitions`  | `{ onAdd?: () => void }`                              |
| `ErrorState`      | `{ message?: string; onRetry?: () => void }`          |
| `FileNotFound`    | `{}`                                                  |

### `PageHeader`

```ts
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}
```

### `Breadcrumbs`

```ts
interface BreadcrumbsItem { label: string; href?: string }

interface BreadcrumbsProps {
  items: BreadcrumbsItem[];
  LinkComponent?: React.ComponentType<{
    to: string;
    className?: string;
    children?: ReactNode;
  }>;
  className?: string;
}
```

### `Logo`

```ts
interface LogoSources {
  mark?: string;
  horizontal?: string;
  horizontalDark?: string;
  stacked?: string;
  stackedDark?: string;
}

interface LogoProps {
  sources: LogoSources;
  isDark?: boolean;
  collapsed?: boolean;                          // when true renders only the mark
  variant?: 'horizontal' | 'stacked';           // default 'horizontal'
  href?: string;
  LinkComponent?: React.ComponentType<{ to: string; className?: string; children?: ReactNode }>;
  className?: string;
  alt?: string;
}
```

---

## Overlay

### `Modal`

```ts
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'; // default 'md'
  showClose?: boolean;                         // default true
  className?: string;
}
```

> Modal does not provide a dedicated `footer` slot — compose buttons in
> `children`. Overlay click and Escape both call `onClose`.

### `ConfirmModal`

```ts
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;           // required
  message: string;         // required
  confirmLabel?: string;   // default 'Confirm'
  cancelLabel?: string;    // default 'Cancel'
  variant?: 'danger' | 'warning' | 'default';
  isLoading?: boolean;
}
```

### `Dropdown` (low-level menu)

```ts
interface DropdownItem {
  label: string;
  value?: string;
  icon?: ReactNode;                 // JSX element (unlike ActionMenu which takes a component)
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';         // default 'right'
  className?: string;
}
```

---

## Data

### `DataTable`

Generic over `TData`; columns are TanStack Table `ColumnDef<TData>`.

```ts
interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];

  // Pagination (server-side)
  pagination?: PaginationMeta;                // { page, pageSize, total, totalPages }
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  // Sorting (pass both props for controlled sorting)
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;

  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;                 // default 'Search...'

  // Row selection
  enableSelection?: boolean;
  selectedRows?: RowSelectionState;
  onSelectionChange?: (selection: RowSelectionState) => void;

  // Column visibility toggle
  enableColumnVisibility?: boolean;

  // Async states
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;

  // Row actions rendered in a trailing column
  rowActions?: (row: TData) => ReactNode;

  // Inline editing
  enableInlineEdit?: boolean;
  editableColumns?: string[];                 // if omitted, every column is editable
  onInlineEditSave?: (params: {
    row: TData;
    rowIndex: number;
    columnId: string;
    value: string;
  }) => void | Promise<void>;

  // Inline create (adds a "create" button to the toolbar)
  enableInlineCreate?: boolean;
  onInlineCreate?: () => void;
  createLabel?: string;                       // default 'Add new'

  // Custom toolbar content (rendered next to the search input)
  toolbar?: ReactNode;

  // Styling
  compact?: boolean;
  className?: string;

  // Empty state overrides (optional, reserved for future use)
  emptyTitle?: string;                        // default 'No data found'
  emptyDescription?: string;

  // Row interactions
  onRowClick?: (row: TData) => void;
  getRowClassName?: (row: TData) => string | undefined;
}
```

Tip: you can trigger row-level inline edit from `rowActions` (e.g., an Edit menu item) by managing local row edit/create draft state in your page and rendering `Input` cells conditionally for that row.

`PaginationMeta` is exported from `@nextleap/next-ui`:

```ts
interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
```

### `EditableCell`

```ts
interface EditableCellProps {
  value: string;
  isEditing: boolean;
  isSaving?: boolean;
  error?: string | null;
  onStartEdit: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  type?: 'text' | 'number' | 'date';   // default 'text'
}
```

### `RowActions`

```ts
interface RowActionsProps {
  items: Array<{
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    danger?: boolean;
    divider?: boolean;
  }>;
}
```

Renders a three-dot trigger that opens the low-level `Dropdown`. Use this
when you want the classic kebab-menu row actions; use `ActionMenu` when
you want the same thing with Lucide icon components as the icon shape.

### `Tabs`

```ts
interface TabsProps {
  defaultValue: string;
  value?: string;                       // controlled
  onChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

interface TabListProps {
  children: ReactNode;
  variant?: 'default' | 'pills' | 'underline';  // default 'default'
  className?: string;
}

interface TabTriggerProps {
  value: string;
  children: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

interface TabContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}
```

---

## Interaction

### `SortableList` / `SortableItem`

Vertical drag-and-drop list with optimistic reorder, automatic rollback on
error, and a "grip" drag handle rendered for you. Built on `@dnd-kit/core`
+ `@dnd-kit/sortable` (both are bundled — no peer deps to install).

```ts
interface SortableListProps<T extends { id: number; sortOrder: number }> {
  items: T[];
  /**
   * Called once per item to render its row. `isOverlay` is `true` only
   * for the floating preview drawn under the user's cursor while dragging.
   */
  renderItem: (item: T, isOverlay?: boolean) => ReactNode;
  /**
   * Called with the reordered list (each item's `sortOrder` is rewritten
   * to its new 1-based index before the callback fires). If the returned
   * promise rejects the list automatically reverts to the previous order
   * and a `react-hot-toast` error is shown ("Failed to update order").
   */
  onReorder: (items: T[]) => Promise<void>;
  disabled?: boolean;
  /** Shown when `items` is empty. Default: `'No items'`. */
  emptyMessage?: string;
}

interface SortableItemProps {
  id: number;
  children: ReactNode;
  disabled?: boolean;
}
```

#### Behaviour notes

- **Items must have** `{ id: number; sortOrder: number }`. Ordering is
  tracked by `id`; `sortOrder` is rewritten for you before `onReorder` is
  called (items are assigned `sortOrder = index + 1` in the new order).
- **Drag handle is automatic.** `SortableItem` renders a `GripVertical`
  drag handle on the left and places `children` next to it — you do
  **not** need to render or wire a handle yourself.
- **Optimistic UI.** The new order appears immediately; while `onReorder`
  is in flight the list is semi-transparent with a centered "Updating
  order…" spinner overlay and pointer events are blocked.
- **Rollback on error.** If `onReorder` throws, the list snaps back to the
  last confirmed order and a toast is shown.
- **Server sync.** If the parent passes new `items` while a reorder is
  pending (or right after a successful reorder), the list keeps its local
  order until the server's data actually matches — this prevents a "snap
  back" from a stale React Query refetch. As soon as the incoming order
  matches the local order, local state is synced.
- **Activation distance.** Dragging only starts after ~8px of pointer
  movement, so simple clicks on buttons/links inside the row still fire.
- **Toasts.** The error toast is rendered via `react-hot-toast` — make
  sure your app mounts a `<Toaster />` (usually in the root layout) or
  you'll see the toast API work without visible UI.

#### Minimal example

```tsx
import { SortableList } from '@nextleap/next-ui';

type Question = { id: number; sortOrder: number; text: string };

<SortableList<Question>
  items={questions}
  emptyMessage="No questions yet"
  renderItem={(q, isOverlay) => (
    <div className={isOverlay ? 'shadow-2xl' : ''}>
      <QuestionCard question={q} />
    </div>
  )}
  onReorder={async (reordered) => {
    await api.reorderQuestions(
      reordered.map((q) => ({ id: q.id, sortOrder: q.sortOrder })),
    );
  }}
/>
```

#### Using `SortableItem` on its own

You only need `SortableItem` directly when you want to compose your own
`DndContext`/`SortableContext` (for horizontal layouts, grids, multi-list
DnD, etc.). For a plain vertical list always prefer `SortableList`.

### `FileUploadDropzone`

```ts
interface FileUploadDropzoneProps {
  onUpload: (file: File) => Promise<void>;
  onDelete?: () => Promise<void>;
  /** File types to accept. Extensions ('pdf') OR MIME types ('image/png'). */
  acceptedTypes?: string[];                         // default all
  maxSizeMb?: number;                               // default 10
  existingFile?: { name: string; url?: string; status?: string } | null;
  isUploading?: boolean;
  isDeleting?: boolean;
  disabled?: boolean;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
}
```

### `FileSelectDropzone`

Used when the file is queued locally and uploaded later:

```ts
interface FileSelectDropzoneProps {
  selectedFile: File | null;
  onSelect: (file: File) => void;
  onRemove?: () => void;
  acceptedTypes?: string[];
  maxSizeMb?: number;
  disabled?: boolean;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
}
```

---

## Layout (app shell)

### `AppShell`

```ts
interface AppShellProps {
  sidebar?: ReactNode;
  topbar?: ReactNode;
  children: ReactNode;
  sidebarCollapsedWidth?: number;     // default 72
  sidebarExpandedWidth?: number;      // default 260
  sidebarCollapsed?: boolean;         // default false
  contentClassName?: string;          // default 'p-6'
  className?: string;
}
```

### `SidebarShell`

```ts
interface SidebarShellProps {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;                // default false
  collapsedWidth?: number;            // default 72
  expandedWidth?: number;             // default 260
  /** Mobile-only off-canvas state */
  mobileOpen?: boolean;               // default false
  onMobileClose?: () => void;
  /** Optional extra content above the nav on mobile (e.g. user card) */
  mobileHeaderExtra?: ReactNode;
  className?: string;
}
```

### `SidebarSection`

```ts
interface SidebarSectionProps {
  label?: string;
  collapsed?: boolean;
  defaultExpanded?: boolean;          // default true
  expanded?: boolean;                 // controlled
  onExpandedChange?: (expanded: boolean) => void;
  collapsible?: boolean;              // default true
  children: ReactNode;
  className?: string;
}
```

### `SidebarNavItem`

```ts
interface SidebarNavItemProps {
  icon?: ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  trailing?: ReactNode;
  LinkComponent?: React.ComponentType<{
    to: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    children?: ReactNode;
  }>;
  className?: string;
}
```

Automatically wraps in a `Tooltip` (positioned right) when `collapsed`.

### `SidebarFooterActions`

```ts
interface SidebarFooterActionsProps {
  collapsed?: boolean;
  showCollapseToggle?: boolean;  // default true
  onCollapse?: () => void;
  onLogout?: () => void;
  logoutLabel?: string;          // default 'Log out'
  collapseLabel?: string;        // default 'Collapse'
  extra?: ReactNode;
  className?: string;
}
```

### `TopbarShell`

```ts
interface TopbarShellProps {
  left?: ReactNode;
  right?: ReactNode;
  center?: ReactNode;
  onMenuClick?: () => void;
  hideMenuButton?: boolean;      // default false
  className?: string;
}
```

The mobile menu button is rendered automatically on `lg-` breakpoints when
`onMenuClick` is provided and `hideMenuButton` is false.

### `ThemeToggleButton`

```ts
interface ThemeToggleButtonProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}
```

### `SearchTriggerButton`

```ts
interface SearchTriggerButtonProps {
  onClick: () => void;
  label?: string;      // default 'Search'
  shortcut?: string;   // default '⌘K' — rendered as a <kbd> on md+
  className?: string;
}
```

### `NotificationBell`

```ts
interface NotificationBellProps {
  count?: number;      // default 0 — hides badge when <= 0, renders "99+" when > 99
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}
```
