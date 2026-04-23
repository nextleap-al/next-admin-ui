# Building an App Shell

`@nextleap/next-ui` ships layout **building blocks**, not a full application shell.
Each app is expected to provide its own menu structure, permissions, and
integrations — but the library gives you the generic scaffolding so every
NextLeap app looks and behaves the same.

## Pieces

| Component              | Role                                                         |
| ---------------------- | ------------------------------------------------------------ |
| `AppShell`             | Outer layout: renders sidebar + topbar + main content        |
| `SidebarShell`         | Desktop + mobile off-canvas sidebar container                |
| `SidebarSection`       | Labeled, collapsible group of nav items                      |
| `SidebarNavItem`       | Single nav row (icon + label + optional trailing content)    |
| `SidebarFooterActions` | Standard collapse toggle + logout                            |
| `TopbarShell`          | Sticky topbar with left/center/right slots + mobile menu btn |
| `ThemeToggleButton`    | Sun/moon button                                              |
| `SearchTriggerButton`  | `⌘K`-style search trigger                                    |
| `NotificationBell`     | Bell with unread count badge                                 |

## Minimal example

```tsx
import { useState } from 'react';
import {
  AppShell,
  SidebarShell,
  SidebarSection,
  SidebarNavItem,
  SidebarFooterActions,
  TopbarShell,
  ThemeToggleButton,
  NotificationBell,
  Logo,
  Breadcrumbs,
} from '@nextleap/next-ui';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Users, Settings } from 'lucide-react';

const logoSources = {
  mark: '/logo_mark.png',
  horizontal: '/horizontal_logo.png',
  horizontalDark: '/horizontal_logo_dark.png',
};

export function Shell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  const active = (path: string) => location.pathname.startsWith(path);

  return (
    <AppShell
      sidebarCollapsed={collapsed}
      sidebar={
        <SidebarShell
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          header={
            <Logo
              sources={logoSources}
              collapsed={collapsed}
              isDark={isDark}
              href="/dashboard"
              LinkComponent={Link as any}
            />
          }
          footer={
            <SidebarFooterActions
              collapsed={collapsed}
              onCollapse={() => setCollapsed(c => !c)}
              onLogout={() => {/* your logout */}}
            />
          }
        >
          <SidebarSection label="Main" collapsed={collapsed}>
            <SidebarNavItem
              icon={<Home className="w-5 h-5" />}
              label="Dashboard"
              href="/dashboard"
              active={active('/dashboard')}
              collapsed={collapsed}
              LinkComponent={NavLink as any}
            />
            <SidebarNavItem
              icon={<Users className="w-5 h-5" />}
              label="Users"
              href="/users"
              active={active('/users')}
              collapsed={collapsed}
              LinkComponent={NavLink as any}
            />
          </SidebarSection>

          <SidebarSection label="System" collapsed={collapsed}>
            <SidebarNavItem
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              href="/settings"
              active={active('/settings')}
              collapsed={collapsed}
              LinkComponent={NavLink as any}
            />
          </SidebarSection>
        </SidebarShell>
      }
      topbar={
        <TopbarShell
          onMenuClick={() => setMobileOpen(true)}
          left={<Breadcrumbs items={/* your crumbs */ []} LinkComponent={Link as any} />}
          right={
            <>
              <ThemeToggleButton isDark={isDark} onToggle={() => setIsDark(!isDark)} />
              <NotificationBell count={0} onClick={() => {/* open panel */}} />
            </>
          }
        />
      }
    >
      <Outlet />
    </AppShell>
  );
}
```

## Design principles

- **The library never decides your menu.** You pass `<SidebarNavItem>`
  children; add/remove them based on your permissions, feature flags, roles,
  etc.
- **Controlled collapse.** The sidebar's `collapsed` state is owned by the
  app; the library only renders it. Persist it to `localStorage` yourself if
  you want.
- **LinkComponent for every link.** Pass your router's `Link`/`NavLink` via
  the `LinkComponent` prop so navigation is client-side. The library's default
  is a plain `<a>`.
- **Topbar extensions.** `TopbarShell` has `left`, `center`, and `right`
  slots — put whatever you want there. Use the library's `ThemeToggleButton`,
  `NotificationBell`, and `SearchTriggerButton` for consistency.

## Mobile behavior

- On `lg:` and up the desktop sidebar is fixed and the main content has a
  left padding equal to the sidebar width (handled by `AppShell`).
- Below `lg:` the desktop sidebar is hidden; the mobile sidebar is off-canvas
  and opened/closed via `mobileOpen` + `onMobileClose`. Wire the topbar's
  menu button to `setMobileOpen(true)`.
