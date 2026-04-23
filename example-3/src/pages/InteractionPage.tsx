import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  FileSelectDropzone,
  FileUploadDropzone,
  PageHeader,
  SortableList,
} from '@nextleap/admin-ui';
import { Section } from '../components/Section';

interface Task {
  id: number;
  sortOrder: number;
  title: string;
  owner: string;
  priority: 'Low' | 'Medium' | 'High';
}

const INITIAL_TASKS: Task[] = [
  { id: 1, sortOrder: 1, title: 'Draft the onboarding email', owner: 'Ada', priority: 'High' },
  { id: 2, sortOrder: 2, title: 'Review design tokens', owner: 'Grace', priority: 'Medium' },
  { id: 3, sortOrder: 3, title: 'Ship DataTable pagination', owner: 'Linus', priority: 'High' },
  { id: 4, sortOrder: 4, title: 'Write release notes', owner: 'Margaret', priority: 'Low' },
  { id: 5, sortOrder: 5, title: 'QA the Modal component', owner: 'Rich', priority: 'Medium' },
];

export default function InteractionPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [existing, setExisting] = useState<
    { name: string; status: 'PENDING' | 'APPROVED' | 'REJECTED' } | undefined
  >(undefined);
  const [queued, setQueued] = useState<File | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Interaction"
        description="Drag-to-reorder lists and two flavors of file drop zones."
      />

      <Section
        title="SortableList"
        description="SortableList renders its own grip handle, wraps each row, and rewrites sortOrder before calling onReorder."
      >
        <SortableList<Task>
          items={tasks}
          emptyMessage="No tasks yet"
          renderItem={(task, isOverlay) => (
            <div
              className={
                'flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] ' +
                (isOverlay ? 'shadow-xl ring-1 ring-primary-500/30' : '')
              }
            >
              <div className="flex-1 leading-tight">
                <div className="text-sm font-medium text-[var(--text-primary)]">{task.title}</div>
                <div className="text-xs text-[var(--text-tertiary)]">
                  #{task.sortOrder} · Owner · {task.owner}
                </div>
              </div>
              <Badge
                variant={
                  task.priority === 'High'
                    ? 'error'
                    : task.priority === 'Medium'
                      ? 'warning'
                      : 'info'
                }
              >
                {task.priority}
              </Badge>
            </div>
          )}
          onReorder={async (reordered) => {
            await new Promise((r) => setTimeout(r, 500));
            setTasks(reordered);
          }}
        />
      </Section>

      <div className="section-grid section-grid-2">
        <Card>
          <CardHeader
            title="FileUploadDropzone"
            description="Uploads immediately — shows progress and the current file."
          />
          <CardContent>
            <FileUploadDropzone
              acceptedTypes={['pdf', 'png', 'jpg']}
              maxSizeMb={10}
              existingFile={existing}
              onUpload={async (file) => {
                await new Promise((r) => setTimeout(r, 900));
                setExisting({ name: file.name, status: 'APPROVED' });
              }}
              onDelete={async () => {
                await new Promise((r) => setTimeout(r, 400));
                setExisting(undefined);
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="FileSelectDropzone"
            description="Queues the file locally until you submit."
          />
          <CardContent>
            <FileSelectDropzone
              selectedFile={queued}
              onSelect={setQueued}
              onRemove={() => setQueued(null)}
              acceptedTypes={['pdf']}
              maxSizeMb={5}
            />
            <div className="mt-4 flex justify-end">
              <Button disabled={!queued} onClick={() => alert('Submit (demo)')}>
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
