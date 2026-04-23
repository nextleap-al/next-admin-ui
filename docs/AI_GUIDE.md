# AI Guide — `@nextleap-al/admin-ui`

This document is written for AI agents that generate UI code. It is compact,
exhaustive, and copy-paste-safe.

## Ground rules

1. **All components are imported from the package root**, e.g.
   `import { Button, Card, Input } from '@nextleap-al/admin-ui'`. Do not deep-import
   from `@nextleap-al/admin-ui/components/...`.
2. **Never hardcode colors or spacing in custom Tailwind classes.** Use the
   component variants or the CSS variables listed in `THEMING.md`.
3. **Styling extension**: every visual component accepts `className` which is
   merged with `tailwind-merge` — safe to override single utilities.
4. **Link integration**: `Breadcrumbs`, `Logo`, and `SidebarNavItem` accept an
   optional `LinkComponent` prop. Pass `react-router-dom`'s `NavLink`/`Link`
   (or `next/link` wrapper) if you need client-side navigation. Otherwise a
   plain `<a>` is used.
5. **Controlled vs uncontrolled**: native inputs (`Input`, `Textarea`,
   `Checkbox`) forward all native props, so they work as either.
6. **Icons**: the library uses `lucide-react`. Import icons from there for
   consistent sizing (`<Icon className="w-4 h-4" />`). `ActionMenu` expects
   the Lucide icon *component* (not an element).

---

## Component index

Categories:

- **Actions** — `Button`
- **Form** — `Input`, `Textarea`, `Checkbox`, `Switch`, `StatusSwitch`,
  `SimpleDropdown`, `SearchDropdown`, `MultiSelectDropdown`,
  `MultiSelectSimple`, `DatePicker`, `DateRangePicker`,
  `DateRangePickerWithTimeInput`, `Calendar`
- **Display** — `Card`, `Badge`, `StatusBadge`, `Avatar`, `AvatarGroup`,
  `Tooltip`, `Skeleton`, `EmptyState`, `PageHeader`, `Breadcrumbs`, `Logo`
- **Overlay** — `Modal`, `ConfirmModal`, `Dropdown`, `ActionMenu`
- **Data** — `DataTable`, `EditableCell`, `RowActions`, `Tabs`, `TabList`,
  `TabTrigger`, `TabContent`
- **Interaction** — `SortableList`, `SortableItem`, `FileUploadDropzone`,
  `FileSelectDropzone`
- **Layout (app shell)** — `AppShell`, `SidebarShell`, `SidebarSection`,
  `SidebarNavItem`, `SidebarFooterActions`, `TopbarShell`,
  `ThemeToggleButton`, `SearchTriggerButton`, `NotificationBell`
- **Hooks** — `useDebounce`, `useDebouncedCallback`, `useInlineEdit`,
  `useRowInlineEdit`, `useQueryParams`
- **Utils** — `cn`

---

## Actions

### `Button`

```ts
Button(props: {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'; // default 'primary'
  size?: 'sm' | 'md' | 'lg' | 'icon';                                  // default 'md'
  isLoading?: boolean;                                                  // disables and shows spinner
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  // + all standard <button> props (onClick, type, disabled, aria-*, …)
}): JSX.Element
```

Example:

```tsx
<Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>Create</Button>
<Button variant="danger" onClick={confirmDelete}>Delete</Button>
<Button size="icon" variant="ghost" leftIcon={<Settings className="w-4 h-4" />} />
```

`isLoading` replaces `leftIcon` with a spinner and disables the button.

---

## Form

### `Input`

```ts
Input(props: {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg'; // default 'md'
  // + all standard <input> props (value, onChange, type, placeholder, …)
}): JSX.Element
```

`type="password"` automatically renders a show/hide eye toggle on the right.
`error` overrides `hint` visually and turns the border red.

### `Textarea`

```ts
Textarea(props: {
  label?: string;
  error?: string;
  hint?: string;
  // + standard <textarea> props
}): JSX.Element
```

### `Checkbox`

```ts
Checkbox(props: {
  checked?: boolean;
  indeterminate?: boolean;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg'; // default 'md'
  // + standard <input type="checkbox"> props (onChange, name, value, …)
}): JSX.Element
```

`onChange` is the **native** change handler: `(e) => void`. Use
`e.target.checked` to read the new value.

### `Switch` / `StatusSwitch`

```ts
Switch(props: {
  checked: boolean;
  /**
   * Sync or async handler. If it returns a Promise, the switch toggles
   * optimistically, shows a loading pulse on the thumb, and reverts on error.
   */
  onChange: (checked: boolean) => void | Promise<void>;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;  // external loading flag (legacy). Prefer async onChange.
  className?: string;
}): JSX.Element

StatusSwitch(props: {
  isActive: boolean;
  onToggle: (isActive: boolean) => void;
  activeLabel?: string;    // default 'Active'
  inactiveLabel?: string;  // default 'Inactive'
  showLabel?: boolean;     // default false — render a text label next to the switch
  // + inherits Switch props except `checked` and `onChange`
}): JSX.Element
```

Examples:

```tsx
<Switch checked={isOn} onChange={setIsOn} label="Email notifications" />

<Switch
  checked={rule.isActive}
  onChange={async (next) => { await api.updateRule(rule.id, { isActive: next }); }}
/>

<StatusSwitch isActive={user.isActive} onToggle={toggleUser} showLabel />
```

### Dropdowns

Four form-oriented dropdowns + one action menu:

| Component             | Use when                                   |
| --------------------- | ------------------------------------------ |
| `SimpleDropdown`      | Static options, < 10 items, no search      |
| `SearchDropdown`      | Large list, client-side searchable         |
| `MultiSelectDropdown` | Multi-select with checkboxes + search      |
| `MultiSelectSimple`   | Multi-select with checkboxes, no search    |
| `ActionMenu`          | Row/item actions (edit, delete, duplicate) |

`DropdownOption` is the shared shape for form dropdowns:

```ts
type DropdownOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
  divider?: boolean;        // render a divider row instead of an option
  searchText?: string;      // extra text matched by SearchDropdown's default filter
}
```

Examples:

```tsx
<SimpleDropdown
  label="Status"
  value={status}
  onChange={setStatus}
  options={[
    { value: 'A', label: 'Active' },
    { value: 'I', label: 'Inactive' },
  ]}
  placeholder="Select status"
/>

<SearchDropdown
  label="User"
  value={userId}
  onChange={setUserId}
  options={users.map(u => ({ value: u.id, label: u.fullName, searchText: u.email }))}
  searchPlaceholder="Search users…"
  loading={isFetchingUsers}
/>

<MultiSelectDropdown
  label="Tags"
  value={selectedTagIds}
  onChange={setSelectedTagIds}
  options={tags}
  showSelectAll
  selectAllLabel="All tags"
/>

<MultiSelectSimple
  label="Statuses"
  value={selectedStatuses}
  onChange={setSelectedStatuses}
  options={[
    { value: 'pending',  label: 'Pending'  },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ]}
/>

<ActionMenu
  items={[
    { key: 'edit',   label: 'Edit',   icon: Pencil, onClick: onEdit },
    { key: 'div',    label: '',       onClick: () => {}, divider: true },
    { key: 'delete', label: 'Delete', icon: Trash,  onClick: onDelete, destructive: true },
  ]}
  moreIcon
/>
```

> **Note:** `SearchDropdown` filters options **client-side** using the
> option's `label` (and `searchText` if provided). If you need server-side
> search, pass a custom `filterFn` or pre-filter the `options` array yourself.

### `DatePicker`

```ts
DatePicker(props: {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;
  presets?: DatePreset[];                 // see DEFAULT_DATE_PRESETS
  disabled?: boolean;
  disabledDays?: Matcher | Matcher[];
  disableNavigation?: boolean;
  enableYearNavigation?: boolean;
  placeholder?: string;                   // default 'Select date'
  hasError?: boolean;
  locale?: Locale;                        // date-fns locale
  translations?: { cancel?: string; apply?: string };
  align?: 'start' | 'center' | 'end';     // default 'center'
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
}): JSX.Element

type DatePreset = { label: string; date: Date };
```

### `DateRangePicker`

```ts
interface DateRange { from: Date | undefined; to?: Date | undefined }

DateRangePicker(props: {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  presets?: DateRangePreset[];            // see DEFAULT_DATE_RANGE_PRESETS
  disabled?: boolean;
  disabledDays?: Matcher | Matcher[];
  disableNavigation?: boolean;
  enableYearNavigation?: boolean;
  placeholder?: string;                   // default 'Select date range'
  hasError?: boolean;
  locale?: Locale;
  translations?: { cancel?: string; apply?: string; range?: string; start?: string; end?: string };
  align?: 'start' | 'center' | 'end';
  fromDate?: Date;
  toDate?: Date;
  fromYear?: number;
  toYear?: number;
  required?: boolean;
  id?: string;
  className?: string;
}): JSX.Element

type DateRangePreset = { label: string; dateRange: DateRange };
```

Exported constants: `DEFAULT_DATE_PRESETS`, `DEFAULT_DATE_RANGE_PRESETS`.
`DateRangePickerWithTimeInput` adds hour/minute inputs — see
[`COMPONENTS.md`](./COMPONENTS.md) for the full props.

---

## Display

### `Card` + sub-components

```tsx
<Card variant="default" padding="md" hover>
  <CardHeader title="Users" description="Manage access" action={<Button size="sm">+ Invite</Button>} />
  <CardContent>Body</CardContent>
  <CardFooter>
    <Button variant="ghost">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

```ts
Card(props: {
  variant?: 'default' | 'glass' | 'outline'; // default 'default'
  padding?: 'none' | 'sm' | 'md' | 'lg';     // default 'md'
  hover?: boolean;                            // adds subtle lift + pointer on hover
  // + standard <div> props
}): JSX.Element
```

`CardHeader` accepts either custom `children` **or** the shorthand props
`title`, `description`, and `action`.

### `Badge` / `StatusBadge`

```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning" size="sm" dot>Pending</Badge>
<StatusBadge status="APPROVED" />
```

```ts
Badge(props: {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';  // default 'md'
  dot?: boolean;               // renders a colored dot before the label
  // + standard <span> props
}): JSX.Element

StatusBadge(props: { status?: string | null }): JSX.Element
```

`StatusBadge` matches (case-insensitive) values like `draft`, `pending`,
`submitted`, `approved`, `confirmed`, `rejected`, `cancelled`, `active`,
`inactive`, `completed`, `in_progress`, `submission_open`,
`submission_closed`, `paid`, `unpaid`, `present`, `absent`, `late`, and
their `pending_approval`/`pending_payment`/`pending_school_approval` variants.

### `Avatar` / `AvatarGroup`

```tsx
<Avatar src={user.photoUrl} name={user.fullName} size="md" />
<AvatarGroup
  users={team.map(u => ({ name: u.fullName, src: u.photo }))}
  max={4}
  size="sm"
/>
```

```ts
Avatar(props: {
  src?: string | null;
  alt?: string;
  name?: string;            // used for initials fallback + deterministic color
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // default 'md'
  className?: string;
}): JSX.Element

AvatarGroup(props: {
  users: { name: string; src?: string }[];
  max?: number;             // default 4
  size?: AvatarProps['size'];
  className?: string;
}): JSX.Element
```

### `Tooltip`

```tsx
<Tooltip content="Copy to clipboard" position="top" delay={300}>
  <button><Copy className="w-4 h-4" /></button>
</Tooltip>
```

```ts
Tooltip(props: {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left'; // default 'top'
  delay?: number;                                  // default 300ms
  className?: string;
}): JSX.Element
```

### `Skeleton` and variants

```tsx
<Skeleton variant="text" className="w-40" />
<Skeleton variant="circular" width={40} height={40} />
<SkeletonText lines={3} />
<SkeletonCard />
<SkeletonTable rows={5} cols={4} />
<SkeletonList items={4} />
```

```ts
Skeleton(props: {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'; // default 'text'
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';                      // default 'wave'
  className?: string;
}): JSX.Element
```

### `EmptyState` and presets

```tsx
<EmptyState
  icon={<Inbox className="w-7 h-7" />}
  title="No messages"
  description="You'll see new messages here."
  action={{ label: 'Compose', onClick: openCompose }}
  secondaryAction={{ label: 'Learn more', onClick: openDocs }}
/>

<NoResults onClear={() => setSearch('')} />
<NoData entity="users" onCreate={openInvite} />
<NoUsers onInvite={openInvite} />
<NoNotifications />
<NoEvents onAdd={openCreate} />
<NoCompetitions onAdd={openCreate} />
<ErrorState message="Something went wrong" onRetry={refetch} />
<FileNotFound />
```

```ts
EmptyState(props: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  variant?: 'default' | 'compact';
  className?: string;
}): JSX.Element
```

### `PageHeader`

```tsx
<PageHeader
  title="Users"
  description="Manage people who can access the app."
  actions={<Button leftIcon={<Plus className="w-4 h-4" />}>Invite</Button>}
/>
```

### `Breadcrumbs`

```tsx
import { Link } from 'react-router-dom';

<Breadcrumbs
  items={[
    { label: 'Users', href: '/users' },
    { label: 'John Smith' },
  ]}
  LinkComponent={Link as any}
/>
```

### `Logo`

```tsx
<Logo
  sources={{
    mark: '/logo_mark.png',
    horizontal: '/horizontal_logo.png',
    horizontalDark: '/horizontal_logo_dark.png',
    stacked: '/stacked_logo.png',
    stackedDark: '/stacked_logo_dark.png',
  }}
  isDark={isDark}
  collapsed={sidebarCollapsed}
  variant="horizontal" // or "stacked"
  href="/"
  LinkComponent={Link as any}
/>
```

---

## Overlay

### `Modal`

```tsx
<Modal
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Invite user"
  description="They'll receive an email with a sign-up link."
  size="md"       // 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showClose       // default true
>
  <Input label="Email" />
  <div className="flex justify-end gap-3 mt-6">
    <Button variant="ghost" onClick={close}>Cancel</Button>
    <Button onClick={submit}>Send invite</Button>
  </div>
</Modal>
```

```ts
Modal(props: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'; // default 'md'
  showClose?: boolean;                        // default true
  className?: string;
}): JSX.Element
```

`Modal` does not render a footer slot — compose your action buttons inside
`children`.

### `ConfirmModal`

```tsx
<ConfirmModal
  isOpen={open}
  onClose={() => setOpen(false)}
  onConfirm={handleDelete}
  title="Delete user?"
  message="This action cannot be undone."
  variant="danger"        // 'danger' | 'warning' | 'default'
  confirmLabel="Delete"
  cancelLabel="Cancel"
  isLoading={isDeleting}
/>
```

```ts
ConfirmModal(props: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;              // required
  message: string;            // required
  confirmLabel?: string;      // default 'Confirm'
  cancelLabel?: string;       // default 'Cancel'
  variant?: 'danger' | 'warning' | 'default';
  isLoading?: boolean;
}): JSX.Element
```

### `Dropdown` (low-level menu)

```tsx
<Dropdown
  align="right"
  trigger={<Button variant="ghost">Options</Button>}
  items={[
    { label: 'Edit',   icon: <Pencil className="w-4 h-4" />, onClick: onEdit },
    { label: '',       divider: true },
    { label: 'Delete', icon: <Trash className="w-4 h-4" />,  onClick: onDelete, danger: true },
  ]}
/>
```

```ts
type DropdownItem = {
  label: string;
  value?: string;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
};

Dropdown(props: {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';   // default 'right'
  className?: string;
}): JSX.Element
```

---

## Data

### `DataTable`

```tsx
<DataTable
  data={rows}
  columns={columns}
  // pagination
  pagination={meta}                 // { page, pageSize, total, totalPages }
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
  // sorting (uncontrolled if omitted)
  sorting={sorting}
  onSortingChange={setSorting}
  // search
  searchValue={search}
  onSearchChange={setSearch}
  searchPlaceholder="Search users…"
  // selection
  enableSelection
  selectedRows={selection}
  onSelectionChange={setSelection}
  // loading / error
  isLoading={isLoading}
  error={errorMessage}
  onRetry={refetch}
  // row actions — renders whatever ReactNode you return in a trailing column
  rowActions={(row) => (
    <ActionMenu
      moreIcon
      items={[
        { key: 'edit',   label: 'Edit',   icon: Pencil, onClick: () => edit(row) },
        { key: 'delete', label: 'Delete', icon: Trash,  onClick: () => remove(row), destructive: true },
      ]}
    />
  )}
  // inline editing (optional)
  enableInlineEdit
  editableColumns={['name', 'email']}
  onInlineEditSave={async ({ row, columnId, value }) => { await api.update(row.id, { [columnId]: value }); }}
  // create button in toolbar (optional)
  enableInlineCreate
  onInlineCreate={openCreateModal}
  createLabel="Add user"
  // other
  compact
  toolbar={<MyExtraFilters />}
  onRowClick={(row) => navigate(`/users/${row.id}`)}
  getRowClassName={(row) => row.isArchived ? 'opacity-60' : undefined}
/>
```

See [`COMPONENTS.md`](./COMPONENTS.md#datatable) for the full prop matrix.

Helpers:

```tsx
<EditableCell
  value={val}
  isEditing={isEditing}
  isSaving={isSaving}
  onStartEdit={start}
  onChange={setVal}
  onSave={save}
  onCancel={cancel}
  type="text"   // 'text' | 'number' | 'date'
/>

<RowActions
  items={[
    { label: 'Edit',   onClick: onEdit },
    { label: 'Delete', onClick: onDelete, danger: true },
  ]}
/>
```

### `Tabs`

```tsx
<Tabs defaultValue="overview" value={tab} onChange={setTab}>
  <TabList variant="default"> {/* 'default' | 'pills' | 'underline' */}
    <TabTrigger value="overview" icon={<Home className="w-4 h-4" />}>Overview</TabTrigger>
    <TabTrigger value="members">Members</TabTrigger>
  </TabList>
  <TabContent value="overview">…</TabContent>
  <TabContent value="members">…</TabContent>
</Tabs>
```

```ts
Tabs(props: {
  defaultValue: string;         // required
  value?: string;               // controlled
  onChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}): JSX.Element

TabList(props: {
  children: ReactNode;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}): JSX.Element

TabTrigger(props: {
  value: string;
  children: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}): JSX.Element

TabContent(props: {
  value: string;
  children: ReactNode;
  className?: string;
}): JSX.Element
```

---

## Interaction

### `SortableList<T>` + `SortableItem`

Vertical drag-and-drop list. Items must have `{ id: number; sortOrder: number }`.
The list handles drag state, optimistic reorder, the "Updating order…" overlay,
and rollback (with a `react-hot-toast` error) on failure. The grip drag handle
is rendered for you by the internal `SortableItem` — do **not** add your own.

```tsx
<SortableList
  items={questions}
  renderItem={(q) => <QuestionCard question={q} />}
  onReorder={async (reordered) => { await api.reorderQuestions(reordered); }}
  emptyMessage="No questions yet"
/>
```

```ts
SortableList<T extends { id: number; sortOrder: number }>(props: {
  items: T[];
  renderItem: (item: T, isOverlay?: boolean) => ReactNode;
  /**
   * Receives items with `sortOrder` already rewritten to their new 1-based
   * index. If the promise rejects the list reverts and a toast is shown.
   */
  onReorder: (items: T[]) => Promise<void>;
  disabled?: boolean;
  emptyMessage?: string; // default 'No items'
}): JSX.Element

SortableItem(props: {
  id: number;
  children: ReactNode;
  disabled?: boolean;
}): JSX.Element
```

Gotchas:

- Every item needs a **numeric** `id` (the list keys by it).
- Make sure the app root has a `<Toaster />` from `react-hot-toast`, otherwise
  the failure toast won't show.
- Use `SortableItem` directly only when building your own `DndContext`
  (horizontal lists, grids, multi-list DnD). For plain vertical lists always
  use `SortableList`.

### `FileUploadDropzone`

For flows that upload immediately:

```tsx
<FileUploadDropzone
  onUpload={async (file) => { await api.upload(file); }}
  acceptedTypes={['pdf', 'jpg', 'png']} // extensions OR mime types
  maxSizeMb={10}
  existingFile={{ name: 'resume.pdf', status: 'PENDING' }}
  onDelete={remove}
  isDeleting={isDeleting}
/>
```

### `FileSelectDropzone`

For flows where the file is queued locally and uploaded later:

```tsx
<FileSelectDropzone
  selectedFile={file}
  onSelect={setFile}
  onRemove={() => setFile(null)}
  acceptedTypes={['pdf']}
  maxSizeMb={5}
/>
```

---

## Layout (app shell)

See [`docs/LAYOUT.md`](./LAYOUT.md) for the complete sidebar/topbar recipe.
Short version:

```tsx
<AppShell
  sidebarCollapsed={collapsed}
  sidebar={
    <SidebarShell
      collapsed={collapsed}
      mobileOpen={mobileOpen}
      onMobileClose={() => setMobileOpen(false)}
      header={<Logo sources={logos} collapsed={collapsed} href="/dashboard" />}
      footer={
        <SidebarFooterActions
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          onLogout={logout}
        />
      }
    >
      <SidebarSection label="Main" collapsed={collapsed}>
        <SidebarNavItem icon={<Home />}  label="Dashboard" href="/dashboard" active />
        <SidebarNavItem icon={<Users />} label="Users"     href="/users" />
      </SidebarSection>
    </SidebarShell>
  }
  topbar={
    <TopbarShell
      onMenuClick={() => setMobileOpen(true)}
      left={<Breadcrumbs items={crumbs} />}
      right={
        <>
          <SearchTriggerButton onClick={openSearch} />
          <ThemeToggleButton isDark={isDark} onToggle={toggleTheme} />
          <NotificationBell count={unread} onClick={openNotifications} />
        </>
      }
    />
  }
>
  <Outlet />
</AppShell>
```

---

## Hooks

### `useDebounce(value, delay)`

```ts
const debounced = useDebounce(search, 300);
```

### `useDebouncedCallback(fn, delay)`

```ts
const debouncedSearch = useDebouncedCallback((q: string) => doSearch(q), 300);
```

### `useInlineEdit({ initialValue, onSave, onCancel?, validateOnBlur?, saveOnBlur? })`

```ts
const edit = useInlineEdit({
  initialValue: user.name,
  onSave: async (val) => { await api.updateUser({ name: val }); },
});
// edit.value, edit.isEditing, edit.isSaving, edit.error, edit.inputRef
// edit.startEdit(), edit.cancelEdit(), edit.setValue(v), edit.save()
// edit.handleKeyDown(e), edit.handleBlur()
```

`saveOnBlur` defaults to `true` — blurring the input commits the value.

### `useRowInlineEdit<T>(row, onSave)`

Manages multiple fields on the same row. Positional arguments:

```ts
const row = useRowInlineEdit(user, async (updates) => { await api.update(user.id, updates); });
const nameProps = row.getFieldProps('name');
// { value, isEditing, onStartEdit, onCancel, onChange, onSave }
```

### `useQueryParams()` *(requires `react-router-dom`)*

```ts
const {
  params,        // Record parsed with `page`/`pageSize` as numbers
  setParams,     // (partial, replace?) => void
  setParam,      // (key, value) => void
  removeParam,   // (key) => void
  clearParams,   // () => void
  page,          // number (default 1)
  pageSize,      // number (default 20)
  search,        // string (default '')
  sort,          // string (default '')
} = useQueryParams();
```

Convenience setters (`setPage`, `setSearch`, …) are not included — use
`setParam('page', 2)` etc.

---

## Utils

### `cn(...inputs)`

Tailwind-safe class composition — combines `clsx` + `tailwind-merge`.

```ts
cn('p-2', isActive && 'bg-primary-500', className);
```
