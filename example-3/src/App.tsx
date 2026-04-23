import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import {
  AppShell,
  Breadcrumbs,
  NotificationBell,
  SearchTriggerButton,
  SidebarFooterActions,
  SidebarNavItem,
  SidebarSection,
  SidebarShell,
  ThemeToggleButton,
  TopbarShell,
} from '@nextleap/admin-ui';
import {
  Boxes,
  Database,
  Grid3x3,
  Home,
  LayoutList,
  MousePointerClick,
  PanelsTopLeft,
  Sparkles,
  SquareStack,
  TextCursorInput,
  Zap,
} from 'lucide-react';

import OverviewPage from './pages/OverviewPage';
import ActionsPage from './pages/ActionsPage';
import FormPage from './pages/FormPage';
import DisplayPage from './pages/DisplayPage';
import OverlayPage from './pages/OverlayPage';
import DataPage from './pages/DataPage';
import InteractionPage from './pages/InteractionPage';
import HooksPage from './pages/HooksPage';

type NavEntry = {
  to: string;
  label: string;
  icon: React.ReactNode;
  section: 'Explore' | 'Building blocks' | 'Advanced';
};

const NAV: NavEntry[] = [
  { to: '/overview', label: 'Overview', icon: <Home className="w-5 h-5" />, section: 'Explore' },
  { to: '/actions', label: 'Actions', icon: <MousePointerClick className="w-5 h-5" />, section: 'Building blocks' },
  { to: '/forms', label: 'Form', icon: <TextCursorInput className="w-5 h-5" />, section: 'Building blocks' },
  { to: '/display', label: 'Display', icon: <Sparkles className="w-5 h-5" />, section: 'Building blocks' },
  { to: '/overlay', label: 'Overlay', icon: <SquareStack className="w-5 h-5" />, section: 'Building blocks' },
  { to: '/data', label: 'Data', icon: <Database className="w-5 h-5" />, section: 'Advanced' },
  { to: '/interaction', label: 'Interaction', icon: <LayoutList className="w-5 h-5" />, section: 'Advanced' },
  { to: '/hooks', label: 'Hooks', icon: <Zap className="w-5 h-5" />, section: 'Advanced' },
];

function useTheme() {
  const [isDark, setIsDark] = useState(
    () => typeof window !== 'undefined' && document.documentElement.classList.contains('dark'),
  );
  useEffect(() => {
    const el = document.documentElement;
    if (isDark) {
      el.classList.add('dark');
      el.setAttribute('data-theme', 'dark');
    } else {
      el.classList.remove('dark');
      el.removeAttribute('data-theme');
    }
  }, [isDark]);
  return { isDark, toggle: () => setIsDark((d) => !d) };
}

function buildCrumbs(pathname: string) {
  const entry = NAV.find((n) => pathname.startsWith(n.to));
  return [
    { label: 'Library', href: '/overview' },
    { label: entry ? entry.label : 'Home' },
  ];
}

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggle } = useTheme();
  const location = useLocation();

  const sections: NavEntry['section'][] = ['Explore', 'Building blocks', 'Advanced'];

  return (
    <AppShell
      sidebarCollapsed={collapsed}
      sidebar={
        <SidebarShell
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          header={
            <Link
              to="/overview"
              className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-[var(--surface-100)] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center text-white shadow-sm">
                <Boxes className="w-5 h-5" />
              </div>
              {!collapsed && (
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-[var(--text-primary)]">NextUI</div>
                  <div className="text-xs text-[var(--text-tertiary)]">Example 3</div>
                </div>
              )}
            </Link>
          }
          footer={
            <SidebarFooterActions
              collapsed={collapsed}
              onCollapse={() => setCollapsed((c) => !c)}
              onLogout={() => alert('Logged out (demo)')}
            />
          }
        >
          {sections.map((section) => (
            <SidebarSection key={section} label={section} collapsed={collapsed}>
              {NAV.filter((n) => n.section === section).map((item) => (
                <SidebarNavItem
                  key={item.to}
                  icon={item.icon}
                  label={item.label}
                  href={item.to}
                  active={location.pathname.startsWith(item.to)}
                  collapsed={collapsed}
                  LinkComponent={NavLink as any}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </SidebarSection>
          ))}
        </SidebarShell>
      }
      topbar={
        <TopbarShell
          onMenuClick={() => setMobileOpen(true)}
          left={
            <div className="flex items-center gap-3">
              <PanelsTopLeft className="w-4 h-4 text-[var(--text-tertiary)] hidden sm:block" />
              <Breadcrumbs items={buildCrumbs(location.pathname)} LinkComponent={Link as any} />
            </div>
          }
          right={
            <>
              <SearchTriggerButton onClick={() => alert('Search (demo)')} />
              <ThemeToggleButton isDark={isDark} onToggle={toggle} />
              <NotificationBell count={3} onClick={() => alert('Notifications (demo)')} />
            </>
          }
        />
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/actions" element={<ActionsPage />} />
        <Route path="/forms" element={<FormPage />} />
        <Route path="/display" element={<DisplayPage />} />
        <Route path="/overlay" element={<OverlayPage />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/interaction" element={<InteractionPage />} />
        <Route path="/hooks" element={<HooksPage />} />
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes>
    </AppShell>
  );
}
