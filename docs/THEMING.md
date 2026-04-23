# Theming

Every visual property in `@nextleap/admin-ui` is backed by a CSS custom property.
You can re-theme the library at runtime — no rebuild, no tailwind config
changes — by overriding the variables in your app's stylesheet.

## Where to override

Put overrides **after** you import the library styles:

```css
@import '@nextleap/admin-ui/styles.css';

:root {
  --nl-primary-500: #3b82f6;
  --bg-primary: #fafafa;
}

[data-theme="dark"] {
  --bg-primary: #0b0f1a;
  --surface-100: #111827;
}
```

Dark mode is driven by either `[data-theme="dark"]` on `<html>` **or** the
`.dark` class (the Tailwind preset registers both strategies).

## Token catalogue

All tokens are declared at `:root` in
[`src/styles/tokens.css`](../src/styles/tokens.css). The same file sets sensible
defaults for `[data-theme="dark"]`.

### Brand color scales

The Tailwind preset maps `primary-50…950` and `gold-50…950` to CSS variables
named `--nl-primary-*` / `--nl-gold-*`. Override them to rebrand:

```css
:root {
  --nl-primary-50:  #eff6ff;
  --nl-primary-100: #dbeafe;
  --nl-primary-200: #bfdbfe;
  --nl-primary-300: #93c5fd;
  --nl-primary-400: #60a5fa;
  --nl-primary-500: #3b82f6; /* the main brand shade */
  --nl-primary-600: #2563eb;
  --nl-primary-700: #1d4ed8;
  --nl-primary-800: #1e40af;
  --nl-primary-900: #1e3a8a;
  --nl-primary-950: #172554;
}
```

Result: every `bg-primary-500`, `text-primary-600`, `hover:bg-primary-700`, etc.
used anywhere in the library (and in your app, if you use the preset) switches.

### Semantic tokens

| Variable              | Meaning                                             |
| --------------------- | --------------------------------------------------- |
| `--primary`           | Main brand color (used for success states, toggles) |
| `--primary-hover`     | Hover shade                                         |
| `--primary-active`    | Pressed shade                                       |
| `--primary-light`     | Transparent tint (e.g. selected row background)     |
| `--primary-glow`      | Glow shadow color (`shadow-glow`)                   |
| `--gold`              | Accent color (focus rings, highlighted links)       |
| `--gold-*`            | Variants (`-hover`, `-active`, `-light`, `-glow`)   |
| `--bg-primary`        | Page background                                     |
| `--bg-secondary`      | Panel background                                    |
| `--bg-tertiary`       | Nested panel background                             |
| `--bg-elevated`       | Floating surfaces (cards, dropdowns, modals)        |
| `--bg-glass`          | Glassmorphism background                            |
| `--bg-overlay`        | Modal/dialog overlay                                |
| `--surface-50…900`    | Neutral ramp (backgrounds & subtle fills)           |
| `--text-primary`      | Default text                                        |
| `--text-secondary`    | Secondary text                                      |
| `--text-tertiary`     | Tertiary text                                       |
| `--text-muted`        | Disabled / placeholder text                         |
| `--text-inverse`      | Text on primary-colored surfaces                    |
| `--border-light`      | Subtle divider                                      |
| `--border-default`    | Inputs, cards                                       |
| `--border-strong`     | Hover / emphasized border                           |
| `--border-focus`      | Focus ring color (defaults to gold)                 |
| `--success`, `--warning`, `--error`, `--info` | status tokens (each also has a `-light` variant) |
| `--bg-nested-elevated` | Background for cards inside `bg-elevated` surfaces |

### Dimensions & motion

| Variable                     | Default      | Purpose                            |
| ---------------------------- | ------------ | ---------------------------------- |
| `--radius-sm`                | `0.375rem`   | Small radius                       |
| `--radius-md`                | `0.5rem`     | Inputs, buttons                    |
| `--radius-lg`                | `0.75rem`    | Cards                              |
| `--radius-xl`                | `1rem`       | Dialogs                            |
| `--radius-2xl`               | `1.5rem`     | Large surfaces                     |
| `--radius-full`              | `9999px`     | Pills, circles                     |
| `--shadow-sm`                |              | Subtle elevation                   |
| `--shadow-md`                |              | Default elevation                  |
| `--shadow-lg`                |              | Dropdowns                          |
| `--shadow-xl`                |              | Modals                             |
| `--shadow-glass`             |              | Glassmorphic surfaces              |
| `--transition-fast`          | `150ms ease` | Buttons, links                     |
| `--transition-normal`        | `250ms ease` | Inputs, dropdowns                  |
| `--transition-slow`          | `350ms ease` | Sidebar collapse                   |

### Spacing, layout & misc

| Variable                     | Default   | Purpose                                  |
| ---------------------------- | --------- | ---------------------------------------- |
| `--spacing-xs`               | `0.25rem` | Tiny gap                                 |
| `--spacing-sm`               | `0.5rem`  | Small gap                                |
| `--spacing-md`               | `1rem`    | Default gap                              |
| `--spacing-lg`               | `1.5rem`  | Large gap                                |
| `--spacing-xl`               | `2rem`    | Extra-large gap                          |
| `--sidebar-width`            | `260px`   | Expanded sidebar width                   |
| `--sidebar-collapsed-width`  | `72px`    | Collapsed sidebar width                  |
| `--topbar-height`            | `64px`    | Topbar height                            |
| `--content-max-width`        | `1440px`  | Max content width                        |
| `--progress-track`           |           | Progress bar track color                 |
| `--progress-fill`            | `var(--primary)` | Progress bar fill color           |

### Fonts

The preset uses `Chillax` for `font-sans` / `font-display` and
`JetBrains Mono` for `font-mono` by default (with `system-ui` fallbacks).
Override the font stack without rebuilding:

```css
:root {
  --nl-font-sans: 'Inter';
  --nl-font-display: 'Inter';
  --nl-font-mono: 'Fira Code';
}
```

## Dark mode

The library responds to **both** strategies out of the box:

```html
<html data-theme="dark">…</html>
<!-- or -->
<html class="dark">…</html>
```

The bundled `tokens.css` already provides dark overrides for `[data-theme="dark"]`.
If you use `.dark` instead, mirror the same rules.

## Stripping the library's defaults

If you want to own the entire palette, import only the token shell:

```css
@import '@nextleap/admin-ui/tokens.css';
/* then define your own values — the import gives you the names + dark support */
```

Or import nothing from the library and define all `--*` variables yourself.
The components do not depend on any specific shade, only on the variable names.
