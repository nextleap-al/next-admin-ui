# @nextleap-al/admin-ui

Shared design-system primitives, hooks, and layout building blocks used across
the NextLeap ecosystem. Tailwind-based, theme-overridable, and designed to be
consumed by AI agents to compose new UIs quickly.

> **Live demo:** [next-admin-ui.web.app](https://next-admin-ui.web.app) — the
> [`example-3`](./example-3) app running on Firebase Hosting.

> **AI agents:** start at [`docs/AI_GUIDE.md`](./docs/AI_GUIDE.md). It contains
> a compact machine-readable catalogue of every component, its props, and ready
> to paste examples.

---

## Install

```bash
npm i @nextleap-al/admin-ui
```

### Peer dependencies (you must install these)

The consumer app is expected to provide React, ReactDOM, and Tailwind itself.
This library targets **Tailwind CSS v4** (`tailwindcss@>=4`). Any modern React +
Tailwind v4 project already has them:

```bash
npm i react react-dom tailwindcss@^4
# + the Tailwind v4 build integration for your bundler:
npm i -D @tailwindcss/vite     # Vite
# or
npm i -D @tailwindcss/postcss  # Next.js / PostCSS-based setups
```

Optional peers — install only if you use the features that need them:

```bash
# useQueryParams / useListParams, and the default Link for <Breadcrumbs>, <Logo>,
# <SidebarNavItem> (you can otherwise pass your own via the `LinkComponent` prop):
npm i react-router-dom

# FormDateField / FormDateRangeField (the react-hook-form bindings for DateField).
# The plain <DateField> is uncontrolled and needs nothing extra.
npm i react-hook-form
```

### Runtime dependencies (installed automatically)

These are pulled in by `npm i @nextleap-al/admin-ui` — **you do not need to install
them manually**. Listed here so AI agents and debuggers know what's present in
the dependency graph when consuming the lib:

```
@dnd-kit/core          # sortable lists (SortableList, SortableItem)
@dnd-kit/sortable
@dnd-kit/utilities
@headlessui/react      # Modal, Dropdown, Switch
@radix-ui/react-popover # DatePicker, DateRangePicker popovers
@remixicon/react       # icon set used by some layout components
@tanstack/react-table  # DataTable
clsx                   # class merging (used by `cn`)
date-fns               # date formatting for DatePicker family
lucide-react           # primary icon set across components
react-day-picker       # Calendar, DatePicker
react-hot-toast        # Toaster singleton
tailwind-merge         # class deduping (used by `cn`)
```

> **AI note:** if `npm ls` shows any of the above as missing after installing
> `@nextleap-al/admin-ui`, the install was incomplete — rerun `npm install` rather
> than adding them manually, so the version ranges stay aligned with the
> library's lockfile.

## Setup (Tailwind CSS v4)

Tailwind v4 is **CSS-first** — there is no `@tailwind base/components/utilities`
and no PostCSS `tailwindcss` plugin. You wire everything up from your root
stylesheet. See [`example-3`](./example-3) for a complete working reference.

### 1. Enable the Tailwind v4 build plugin

**Vite** — add the official plugin to `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**Next.js / PostCSS** — use `@tailwindcss/postcss` in `postcss.config.mjs`:

```js
export default { plugins: { '@tailwindcss/postcss': {} } };
```

### 2. Root stylesheet

In your entry CSS (e.g. `src/styles.css`, imported once from `main.tsx`):

```css
@import 'tailwindcss';
@import '@nextleap-al/admin-ui/styles.css';

/* v4 auto-detection skips node_modules, so point Tailwind at the library dist
   so its class names are generated. Path is relative to THIS css file. */
@source '../node_modules/@nextleap-al/admin-ui/dist';
```

`@import '@nextleap-al/admin-ui/styles.css'` pulls in the design tokens, base
reset, utility classes, **and** the Tailwind v4 `@theme` registration (the
`primary`/`gold`/`surface` color scales, fonts, shadows, animations, and dark
mode on **both** `.dark` and `[data-theme="dark"]`). If you only want the tokens
(no base reset), swap it for `@import '@nextleap-al/admin-ui/tokens.css'`.

### 3. No JS config needed

This is a **CSS-first** setup: there is no `tailwind.config.ts`, no JS preset,
and no `@config` — importing `styles.css` above is all Tailwind needs. Every
value resolves to a runtime CSS variable, so you re-theme at runtime (see
[Theming](#theming)) without a rebuild. See [`example-3`](./example-3) for a
complete working reference.

### 4. Use components

```tsx
import { Button, Card, Input, AppShell, SidebarShell } from '@nextleap-al/admin-ui';

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
| UI        | `Button`, `Input`, `Textarea`, `Checkbox`, `Switch`, `StatusSwitch`, `Card` (+ `CardHeader`, `CardContent`, `CardFooter`), `Badge`, `StatusBadge`, `Avatar`, `AvatarGroup`, `Modal`, `ConfirmModal`, `FormModal`, `FormBanner`, `Dropdown`, `SimpleDropdown`, `SearchDropdown`, `MultiSelectDropdown`, `MultiSelectSimple`, `InlineSelect`, `ActionMenu`, `DataTable` (+ `EditableCell`, `RowActions`), `DatePicker`, `DateRangePicker`, `DateRangePickerWithTimeInput`, `Calendar`, `DateField` (+ `FormDateField`, `FormDateRangeField`, `DateCalendarField`, `DateTimeCalendarField`, `RangeCalendarField`, `DateTimeRangeCalendarField`, `TimeSelectField`), `Tabs` (+ `TabList`, `TabTrigger`, `TabContent`), `Tooltip`, `Skeleton` (+ `SkeletonText`, `SkeletonCard`, `SkeletonTable`, `SkeletonList`), `EmptyState` (+ `NoResults`, `NoData`, `NoUsers`, `NoNotifications`, `NoEvents`, `NoCompetitions`, `ErrorState`, `FileNotFound`) |
| Common    | `Breadcrumbs`, `Logo`, `PageHeader`, `ListView`, `CollapsibleSection`, `Spinner`, `FullPageSpinner`, `FullPageError`, `FileUploadDropzone`, `FileSelectDropzone`, `SortableList`, `SortableItem` |
| Layout    | `AppShell`, `SidebarShell`, `SidebarSection`, `SidebarNavItem`, `SidebarFooterActions`, `TopbarShell`, `ThemeToggleButton`, `SearchTriggerButton`, `NotificationBell` |
| Hooks     | `useDebounce`, `useDebouncedCallback`, `useInlineEdit`, `useRowInlineEdit`, `useQueryParams`, `useListParams` |
| Utils     | `cn`, `toDate`, `toDateString`, `toTimeString`, `toDateTimeString`, `splitDateTime`, `joinDateTime` |
| Types     | `PaginationMeta`, `PaginatedResponse`, `PaginationParams`, `SortParams`, `FilterParams`, `QueryParams` |
| Presets   | `DEFAULT_DATE_PRESETS`, `DEFAULT_DATE_RANGE_PRESETS`, `makeAheadDatePresets`, `makeAheadDateRangePresets`, `makeRecentDateRangePresets` |

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
