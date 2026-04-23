import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  EmptyState,
  ErrorState,
  NoData,
  NoNotifications,
  NoResults,
  PageHeader,
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SkeletonTable,
  SkeletonText,
  StatusBadge,
  Tooltip,
} from '@nextleap/admin-ui';
import { Bell, Copy, Info, Plus, RefreshCw } from 'lucide-react';
import { DemoRow, Section } from '../components/Section';

const TEAM = [
  { name: 'Ada Lovelace' },
  { name: 'Grace Hopper' },
  { name: 'Linus Torvalds' },
  { name: 'Margaret Hamilton' },
  { name: 'Donald Knuth' },
  { name: 'Tim Berners-Lee' },
];

export default function DisplayPage() {
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
          <Card className="md:col-span-2">
            <ErrorState
              message="We couldn't load your dashboard."
              onRetry={() => alert('Retrying… (demo)')}
            />
          </Card>
        </div>
      </Section>

      <div className="flex justify-end">
        <Button variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />}>
          Refresh
        </Button>
      </div>
    </div>
  );
}
