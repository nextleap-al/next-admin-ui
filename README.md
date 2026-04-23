# @nextleap/next-ui

Shared design-system primitives, hooks, and layout building blocks used across
the NextLeap ecosystem. Tailwind-based, theme-overridable, and designed to be
consumed by AI agents to compose new UIs quickly.

> **AI agents:** start at [`docs/AI_GUIDE.md`](./docs/AI_GUIDE.md). It contains
> a compact machine-readable catalogue of every component, its props, and ready
> to paste examples.

---

## Install

```bash
npm i @nextleap/next-ui
# peer deps (if you don't already have them)
npm i react react-dom tailwindcss
# optional: only if you use <Breadcrumbs>/<Logo>/<SidebarNavItem> with a Link
npm i react-router-dom
```

## Setup

### 1. Tailwind preset

In your `tailwind.config.{js,ts}`:

```ts
import type { Config } from 'tailwindcss';
import nextleapPreset from '@nextleap/next-ui/tailwind-preset';

export default {
  presets: [nextleapPreset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    // IMPORTANT: include the library so its class names are detected
    './node_modules/@nextleap/next-ui/dist/**/*.{js,cjs}',
  ],
} satisfies Config;
```

### 2. Styles

Import the library's default tokens + utilities once (typically in `main.tsx`
or your root CSS file) **after** Tailwind's base/components/utilities:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import '@nextleap/next-ui/styles.css';
```

If you only want the design tokens (not the base/utilities):

```css
@import '@nextleap/next-ui/tokens.css';
```

### 3. Use components

```tsx
import { Button, Card, Input, AppShell, SidebarShell } from '@nextleap/next-ui';

export default function Page() {
  return (
    <Card>
      <Input label="Email" />
      <Button variant="primary">Continue</Button>
    </Card>
  );
}
```

---

## Theming

Everything visual is driven by CSS variables. Override them at `:root` (or on
any scope, e.g. `[data-theme="dark"]`) to re-theme the library. See
[`docs/THEMING.md`](./docs/THEMING.md) for the full token reference.

Quick example (rebrand the primary color):

```css
:root {
  --nl-primary-500: #3b82f6;
  --nl-primary-600: #2563eb;
  --nl-primary-700: #1d4ed8;
}
```

---

## What's inside

| Area      | Modules |
| --------- | ------- |
| UI        | `Button`, `Input`, `Textarea`, `Checkbox`, `Switch`, `StatusSwitch`, `Card` (+ `CardHeader`, `CardContent`, `CardFooter`), `Badge`, `StatusBadge`, `Avatar`, `AvatarGroup`, `Modal`, `ConfirmModal`, `Dropdown`, `SimpleDropdown`, `SearchDropdown`, `MultiSelectDropdown`, `MultiSelectSimple`, `ActionMenu`, `DataTable` (+ `EditableCell`, `RowActions`), `DatePicker`, `DateRangePicker`, `DateRangePickerWithTimeInput`, `Calendar`, `Tabs` (+ `TabList`, `TabTrigger`, `TabContent`), `Tooltip`, `Skeleton` (+ `SkeletonText`, `SkeletonCard`, `SkeletonTable`, `SkeletonList`), `EmptyState` (+ `NoResults`, `NoData`, `NoUsers`, `NoNotifications`, `NoEvents`, `NoCompetitions`, `ErrorState`, `FileNotFound`) |
| Common    | `Breadcrumbs`, `Logo`, `PageHeader`, `FileUploadDropzone`, `FileSelectDropzone`, `SortableList`, `SortableItem` |
| Layout    | `AppShell`, `SidebarShell`, `SidebarSection`, `SidebarNavItem`, `SidebarFooterActions`, `TopbarShell`, `ThemeToggleButton`, `SearchTriggerButton`, `NotificationBell` |
| Hooks     | `useDebounce`, `useDebouncedCallback`, `useInlineEdit`, `useRowInlineEdit`, `useQueryParams` |
| Utils     | `cn` |
| Types     | `PaginationMeta`, `PaginatedResponse`, `PaginationParams`, `SortParams`, `FilterParams`, `QueryParams` |
| Presets   | `DEFAULT_DATE_PRESETS`, `DEFAULT_DATE_RANGE_PRESETS` |

---

## Docs

- [`docs/AI_GUIDE.md`](./docs/AI_GUIDE.md) — AI-friendly component catalogue (start here)
- [`docs/COMPONENTS.md`](./docs/COMPONENTS.md) — detailed props + examples
- [`docs/THEMING.md`](./docs/THEMING.md) — tokens & theme overrides
- [`docs/LAYOUT.md`](./docs/LAYOUT.md) — building app shells (sidebar/topbar)
- [`docs/HOOKS.md`](./docs/HOOKS.md) — hook reference

---

## Philosophy

1. **No hardcoded colors or spacing.** Every surface/border/text color is a CSS
   variable that consumers can override.
2. **Stable APIs.** Components are ported 1:1 from a production app; we don't
   change how they behave, only how they're packaged.
3. **Framework-agnostic where possible.** Components that need a router accept
   a `LinkComponent` prop so you can plug in `react-router`, `next/link`, or
   any custom Link.
4. **AI-first docs.** Every component page lists its props as a typed contract
   plus a minimal usable example so code-generating agents can get it right on
   the first try.
