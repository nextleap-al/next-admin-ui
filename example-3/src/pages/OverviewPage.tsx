import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  PageHeader,
} from '@nextleap-al/admin-ui';
import {
  ArrowRight,
  Database,
  LayoutList,
  MousePointerClick,
  Sparkles,
  SquareStack,
  TextCursorInput,
  Zap,
} from 'lucide-react';

const TILES = [
  {
    to: '/actions',
    title: 'Actions',
    description: 'Buttons in every variant, size, and state.',
    icon: <MousePointerClick className="w-5 h-5" />,
    count: 'Button',
  },
  {
    to: '/forms',
    title: 'Form',
    description: 'Inputs, textareas, dropdowns, switches & date pickers.',
    icon: <TextCursorInput className="w-5 h-5" />,
    count: '12 components',
  },
  {
    to: '/display',
    title: 'Display',
    description: 'Cards, badges, avatars, skeletons and empty states.',
    icon: <Sparkles className="w-5 h-5" />,
    count: '10 components',
  },
  {
    to: '/overlay',
    title: 'Overlay',
    description: 'Modal, ConfirmModal and low-level Dropdown menus.',
    icon: <SquareStack className="w-5 h-5" />,
    count: '3 components',
  },
  {
    to: '/data',
    title: 'Data',
    description: 'DataTable with server pagination, search and tabs.',
    icon: <Database className="w-5 h-5" />,
    count: 'DataTable + Tabs',
  },
  {
    to: '/interaction',
    title: 'Interaction',
    description: 'Sortable lists and file-drop zones.',
    icon: <LayoutList className="w-5 h-5" />,
    count: '3 components',
  },
  {
    to: '/hooks',
    title: 'Hooks',
    description: 'useDebounce, useInlineEdit and useQueryParams.',
    icon: <Zap className="w-5 h-5" />,
    count: '5 hooks',
  },
];

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="NextUI — Example 3"
        description="A guided tour of @nextleap-al/admin-ui components, built entirely from the docs."
        actions={
          <a
            href="https://www.npmjs.com/package/@nextleap-al/admin-ui"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View package
            </Button>
          </a>
        }
      />

      <Card variant="glass">
        <CardHeader
          title="What's inside?"
          description="Each page showcases a category from the library's component index."
        />
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">Actions</Badge>
            <Badge variant="info">Form</Badge>
            <Badge variant="success">Display</Badge>
            <Badge variant="warning">Overlay</Badge>
            <Badge variant="error">Data</Badge>
            <Badge variant="outline">Interaction</Badge>
            <Badge>Hooks</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {TILES.map((tile) => (
          <Link key={tile.to} to={tile.to} className="group">
            <Card hover className="h-full">
              <CardHeader
                title={
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-primary-500/15 text-primary-600 flex items-center justify-center">
                      {tile.icon}
                    </div>
                    <span>{tile.title}</span>
                  </div>
                }
                description={tile.description}
              />
              <CardFooter>
                <span className="text-xs text-[var(--text-tertiary)]">{tile.count}</span>
                <span className="ml-auto flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:translate-x-0.5 transition-transform">
                  Explore
                  <ArrowRight className="w-4 h-4" />
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
