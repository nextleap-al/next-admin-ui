# NextUI Example 3

A guided tour of every component in [`@nextleap/next-ui`](../), built from the
library's own `docs/` folder.

## Run it

```bash
cd nextui/example-3
npm install
npm run dev
```

Then open http://localhost:5175.

## What's in here

| Page          | Shows                                                                 |
| ------------- | --------------------------------------------------------------------- |
| Overview      | `PageHeader`, `Card`, `Badge`, and entry tiles to every other page    |
| Actions       | `Button` variants, sizes, icons, and loading states                   |
| Form          | `Input`, `Textarea`, `Checkbox`, `Switch`, dropdowns, date pickers    |
| Display       | `Card`, `Badge`, `Avatar`, `Tooltip`, `Skeleton`, `EmptyState`        |
| Overlay       | `Modal`, `ConfirmModal`, low-level `Dropdown`                         |
| Data          | `DataTable` + `Tabs` + `ActionMenu`                                   |
| Interaction   | `SortableList`, `FileUploadDropzone`, `FileSelectDropzone`            |
| Hooks         | `useDebounce`, `useDebouncedCallback`, `useInlineEdit`, `useQueryParams` |

The app shell (sidebar + topbar) uses `AppShell`, `SidebarShell`,
`SidebarSection`, `SidebarNavItem`, `SidebarFooterActions`, `TopbarShell`,
`Breadcrumbs`, `SearchTriggerButton`, `ThemeToggleButton`, and
`NotificationBell`. Dark mode toggles `[data-theme="dark"]` + `.dark` on
`<html>`.
