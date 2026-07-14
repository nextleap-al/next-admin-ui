# NextUI Example 3

A guided tour of **every** export in [`@nextleap-al/admin-ui`](../). It consumes
the library **directly from `../src`** (via the Vite alias + tsconfig paths), so
it always runs against the latest library — edit a component and it hot-reloads
here, no rebuild or republish needed.

## Run it

```bash
cd nextui/example-3
npm install
npm run dev     # http://localhost:5175
npm run build   # tsc -b && vite build — both pass clean
```

## What's in here

Every component, hook, and util the library exports is demonstrated on one of
these pages (see the coverage note below).

| Page          | Shows                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------- |
| Overview      | `PageHeader`, `Card`, `Badge`, and entry tiles to every other page                              |
| Actions       | `Button` variants, sizes, icons, and loading states                                            |
| Form          | `Input`, `Textarea`, `Checkbox`, `Switch`/`StatusSwitch`, all dropdowns + `InlineSelect`, `DatePicker`/`DateRangePicker`/`DateRangePickerWithTimeInput` |
| Dates         | `DateField` (all 5 modes) + presets/states, `FormDateField`/`FormDateRangeField` (react-hook-form), the lower-level `*CalendarField` controls, and standalone `Calendar` |
| Display       | `Card`, `Badge`/`StatusBadge`, `Avatar`, `Tooltip`, `Skeleton`s, `EmptyState` + every preset, `Logo`, `CollapsibleSection`, `Spinner`/`FullPageSpinner`/`FullPageError`, `FormBanner` |
| Overlay       | `Modal`, `ConfirmModal`, `FormModal`, low-level `Dropdown`                                      |
| Data          | `DataTable` (+ `EditableCell` via the Hooks page, `RowActions`), `Tabs`, `ActionMenu`, `ListView` (+ `useListParams`) |
| Interaction   | `SortableList`, standalone `SortableItem`, `FileUploadDropzone`, `FileSelectDropzone`           |
| Hooks         | `useDebounce`, `useDebouncedCallback`, `useInlineEdit`, `useRowInlineEdit`, `useQueryParams`, `useListParams`, plus the `cn` / `dateValue` utils |

The app shell (sidebar + topbar) uses `AppShell`, `SidebarShell`,
`SidebarSection`, `SidebarNavItem`, `SidebarFooterActions`, `TopbarShell`,
`Breadcrumbs`, `SearchTriggerButton`, `ThemeToggleButton`, and
`NotificationBell`. Dark mode toggles `[data-theme="dark"]` + `.dark` on
`<html>`.

> **Coverage:** this example references all 96 of the library's exports. It also
> pins the same `@types/react` (19) and `lucide-react` (1.x) the library uses, so
> `npm run build` typechecks cleanly against the library source.
