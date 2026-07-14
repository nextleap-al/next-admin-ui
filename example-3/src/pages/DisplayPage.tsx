import { useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CollapsibleSection,
  EmptyState,
  ErrorState,
  FileNotFound,
  FormBanner,
  FullPageError,
  FullPageSpinner,
  Logo,
  NoCompetitions,
  NoData,
  NoEvents,
  NoNotifications,
  NoResults,
  NoUsers,
  PageHeader,
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SkeletonTable,
  SkeletonText,
  Spinner,
  StatusBadge,
  Tooltip,
} from '@nextleap-al/admin-ui';
import { Bell, Copy, Info, Plus, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { DemoRow, Section } from '../components/Section';

// Inline placeholder brand assets (the Logo component is asset-driven — a real app passes real image URLs).
const svg = (w: number, h: number, body: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`,
  );
const glyph = (x: number) =>
  `<rect x="${x}" width="40" height="40" rx="9" fill="#3b82f6"/><path d="M${x + 12} 28V12h3l7 9V12h3v16h-3l-7-9v9z" fill="#fff"/>`;
const word = (x: number, y: number, fill: string, anchor = 'start') =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="system-ui,sans-serif" font-size="17" font-weight="700" fill="${fill}">NextUI</text>`;
const logoSources = {
  mark: svg(44, 44, `<rect width="44" height="44" rx="10" fill="#3b82f6"/><path d="M14 30V14h4l8 10V14h4v16h-4l-8-10v10z" fill="#fff"/>`),
  horizontal: svg(150, 40, glyph(0) + word(52, 26, '#111827')),
  horizontalDark: svg(150, 40, glyph(0) + word(52, 26, '#ffffff')),
  stacked: svg(120, 74, glyph(40) + word(60, 66, '#111827', 'middle')),
  stackedDark: svg(120, 74, glyph(40) + word(60, 66, '#ffffff', 'middle')),
};

const TEAM = [
  { name: 'Ada Lovelace' },
  { name: 'Grace Hopper' },
  { name: 'Linus Torvalds' },
  { name: 'Margaret Hamilton' },
  { name: 'Donald Knuth' },
  { name: 'Tim Berners-Lee' },
];

export default function DisplayPage() {
  const [fullState, setFullState] = useState<null | 'spinner' | 'error'>(null);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Display"
        description="Cards, badges, avatars, tooltips, skeletons and empty states."
      />

      <Section title="Cards" description="Three visual variants with optional hover.">
        <div className="section-grid section-grid-3">
          <Card variant="default">
            <CardHeader title="Default" description="Solid surface card." />
            <CardContent>
              Cards compose <code>CardHeader</code>, <code>CardContent</code>, and{' '}
              <code>CardFooter</code>.
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
              <Button size="sm">Save</Button>
            </CardFooter>
          </Card>

          <Card variant="glass">
            <CardHeader title="Glass" description="Soft translucent surface." />
            <CardContent>Great for hero sections and dashboards.</CardContent>
          </Card>

          <Card variant="outline" hover>
            <CardHeader title="Outline (hover)" description="Lifts subtly on hover." />
            <CardContent>Combine with onClick for interactive tiles.</CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Badges & StatusBadge" description="Color variants, sizes, dots and presets.">
        <DemoRow label="Variants">
          <Badge>Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="outline">Outline</Badge>
        </DemoRow>
        <div className="mt-4">
          <DemoRow label="With dots">
            <Badge variant="success" dot>
              Active
            </Badge>
            <Badge variant="warning" dot>
              Pending
            </Badge>
            <Badge variant="error" dot>
              Failed
            </Badge>
          </DemoRow>
        </div>
        <div className="mt-4">
          <DemoRow label="StatusBadge (normalized)">
            <StatusBadge status="draft" />
            <StatusBadge status="pending" />
            <StatusBadge status="approved" />
            <StatusBadge status="rejected" />
            <StatusBadge status="in_progress" />
            <StatusBadge status="paid" />
          </DemoRow>
        </div>
      </Section>

      <Section title="Avatars" description="Initials fallback + deterministic color from name.">
        <DemoRow label="Sizes">
          <Avatar name="Ada Lovelace" size="xs" />
          <Avatar name="Grace Hopper" size="sm" />
          <Avatar name="Linus Torvalds" size="md" />
          <Avatar name="Rich Hickey" size="lg" />
          <Avatar name="Margaret Hamilton" size="xl" />
        </DemoRow>
        <div className="mt-4">
          <DemoRow label="Avatar group">
            <AvatarGroup users={TEAM} max={4} />
            <AvatarGroup users={TEAM} max={3} size="sm" />
          </DemoRow>
        </div>
      </Section>

      <Section
        title="Logo"
        description="Asset-driven brand slot — horizontal/stacked variants, a dark-asset swap, and a collapsed mark."
      >
        <div className="flex flex-wrap items-center gap-8">
          <Logo sources={logoSources} variant="horizontal" />
          <div className="rounded-lg bg-[#111827] p-3">
            <Logo sources={logoSources} variant="horizontal" isDark />
          </div>
          <Logo sources={logoSources} variant="stacked" />
          <Logo sources={logoSources} collapsed />
        </div>
      </Section>

      <Section title="Tooltip" description="Hover any element to reveal a tooltip.">
        <DemoRow>
          <Tooltip content="Copy to clipboard" position="top">
            <Button variant="outline" size="icon" leftIcon={<Copy className="w-4 h-4" />} />
          </Tooltip>
          <Tooltip content="You have 3 unread notifications" position="right">
            <Button variant="ghost" leftIcon={<Bell className="w-4 h-4" />}>
              Inbox
            </Button>
          </Tooltip>
          <Tooltip content="This is informational only" position="bottom">
            <span className="inline-flex items-center gap-1 text-[var(--text-secondary)]">
              <Info className="w-4 h-4" />
              Hover me
            </span>
          </Tooltip>
        </DemoRow>
      </Section>

      <Section title="Skeletons" description="Loading placeholders — text, circles, cards, tables.">
        <div className="section-grid section-grid-2">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="flex-1">
                <Skeleton variant="text" className="w-40" />
                <Skeleton variant="text" className="w-24 mt-2" />
              </div>
            </div>
            <SkeletonText lines={3} />
            <SkeletonList items={3} />
          </div>
          <div className="flex flex-col gap-3">
            <SkeletonCard />
            <SkeletonTable rows={3} cols={4} />
          </div>
        </div>
      </Section>

      <Section title="Empty states" description="Generic EmptyState + domain presets.">
        <div className="section-grid section-grid-2">
          <Card>
            <EmptyState
              icon={<Plus className="w-7 h-7" />}
              title="Start your first project"
              description="Projects keep everything organized — members, files, and permissions."
              action={{ label: 'Create project', onClick: () => alert('Create project (demo)') }}
              secondaryAction={{ label: 'Learn more', onClick: () => alert('Docs (demo)') }}
            />
          </Card>
          <Card>
            <NoResults onClear={() => alert('Clear search (demo)')} />
          </Card>
          <Card>
            <NoData entity="users" onCreate={() => alert('Invite user (demo)')} />
          </Card>
          <Card>
            <NoNotifications />
          </Card>
          <Card>
            <NoUsers onInvite={() => alert('Invite user (demo)')} />
          </Card>
          <Card>
            <NoEvents onAdd={() => alert('Create event (demo)')} />
          </Card>
          <Card>
            <NoCompetitions onAdd={() => alert('Create competition (demo)')} />
          </Card>
          <Card>
            <FileNotFound />
          </Card>
          <Card className="md:col-span-2">
            <ErrorState
              message="We couldn't load your dashboard."
              onRetry={() => alert('Retrying… (demo)')}
            />
          </Card>
        </div>
      </Section>

      <Section title="Spinner & FormBanner" description="A minimal loading ring and the form-level message banner.">
        <DemoRow label="Spinner (sizes)">
          <Spinner className="h-4 w-4" />
          <Spinner />
          <Spinner className="h-8 w-8" />
          <span className="text-sm text-[var(--text-secondary)]">
            FullPageSpinner / FullPageError center these for whole-page states.
          </span>
        </DemoRow>
        <div className="mt-4 flex flex-col gap-2">
          <FormBanner kind="error">Something went wrong — please check the fields below.</FormBanner>
          <FormBanner kind="success">Your changes were saved.</FormBanner>
        </div>
      </Section>

      <Section
        title="Full-page states"
        description="FullPageSpinner and FullPageError fill the viewport — for route-level loading / error boundaries."
      >
        <DemoRow>
          <Button variant="outline" onClick={() => setFullState('spinner')}>
            Show FullPageSpinner
          </Button>
          <Button variant="outline" onClick={() => setFullState('error')}>
            Show FullPageError
          </Button>
        </DemoRow>
      </Section>

      <CollapsibleSection
        title="Advanced settings"
        description="A flat, collapsible section card. The header toggles; the action button doesn't."
        icon={<SlidersHorizontal className="h-5 w-5" />}
        action={
          <Button size="sm" variant="outline">
            Add rule
          </Button>
        }
      >
        <p className="text-sm text-[var(--text-secondary)]">
          The body mounts only while open. Stack several of these to build a settings panel that reads as
          one surface.
        </p>
      </CollapsibleSection>

      <div className="flex justify-end">
        <Button variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />}>
          Refresh
        </Button>
      </div>

      {fullState && (
        <div className="fixed inset-0 z-[100]">
          {fullState === 'spinner' ? (
            <FullPageSpinner />
          ) : (
            <FullPageError
              message="We couldn't load your workspace."
              onRetry={() => setFullState(null)}
            />
          )}
          <button
            type="button"
            onClick={() => setFullState(null)}
            className="fixed right-4 top-4 z-[101] rounded-lg bg-[var(--surface-200)] px-3 py-1.5 text-sm text-[var(--text-primary)] shadow-md hover:bg-[var(--surface-300)]"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
