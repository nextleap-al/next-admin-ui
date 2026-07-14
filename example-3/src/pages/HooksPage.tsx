import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  EditableCell,
  Input,
  PageHeader,
  cn,
  joinDateTime,
  splitDateTime,
  toDate,
  toDateString,
  toDateTimeString,
  toTimeString,
  useDebounce,
  useDebouncedCallback,
  useInlineEdit,
  useQueryParams,
  useRowInlineEdit,
} from '@nextleap-al/admin-ui';
import { Check, Edit3, Loader2, Search, X } from 'lucide-react';
import { Section } from '../components/Section';

function UseDebounceDemo() {
  const [value, setValue] = useState('');
  const debounced = useDebounce(value, 400);

  return (
    <Card>
      <CardHeader
        title="useDebounce"
        description="Debounces a value. Typing below: left updates instantly, right lags 400ms."
      />
      <CardContent>
        <Input
          label="Search query"
          placeholder="Start typing…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
        <div className="mt-4 flex gap-3 flex-wrap">
          <Badge variant="info">Live: {value || '—'}</Badge>
          <Badge variant="primary">Debounced: {debounced || '—'}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function UseDebouncedCallbackDemo() {
  const [log, setLog] = useState<string[]>([]);
  const save = useDebouncedCallback((val: string) => {
    setLog((l) => [`saved "${val}" at ${new Date().toLocaleTimeString()}`, ...l].slice(0, 5));
  }, 600);

  return (
    <Card>
      <CardHeader
        title="useDebouncedCallback"
        description="Calls a stable callback 600ms after the last change — simulates autosave."
      />
      <CardContent>
        <Input
          label="Document title"
          placeholder="Type to autosave…"
          onChange={(e) => save(e.target.value)}
        />
        <ul className="mt-4 text-sm text-[var(--text-secondary)] flex flex-col gap-1">
          {log.length === 0 && <li>— waiting for typing —</li>}
          {log.map((line, i) => (
            <li key={i}>· {line}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function UseInlineEditDemo() {
  const [name, setName] = useState('Ada Lovelace');
  const edit = useInlineEdit<string>({
    initialValue: name,
    onSave: async (val) => {
      await new Promise((r) => setTimeout(r, 600));
      setName(val);
    },
  });

  return (
    <Card>
      <CardHeader
        title="useInlineEdit"
        description="Enter saves, Escape cancels, blur commits. Async-aware."
      />
      <CardContent>
        {!edit.isEditing ? (
          <div className="flex items-center gap-2">
            <span className="text-base font-medium">{name}</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={edit.startEdit}
              leftIcon={<Edit3 className="w-4 h-4" />}
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              ref={edit.inputRef as React.RefObject<HTMLInputElement>}
              value={edit.value}
              onChange={(e) => edit.setValue(e.target.value)}
              onKeyDown={edit.handleKeyDown}
              onBlur={edit.handleBlur}
              disabled={edit.isSaving}
              className="px-3 py-1.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] text-sm outline-none focus:border-primary-500"
            />
            <Button
              size="icon"
              variant="primary"
              onClick={edit.save}
              isLoading={edit.isSaving}
              leftIcon={<Check className="w-4 h-4" />}
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={edit.cancelEdit}
              leftIcon={<X className="w-4 h-4" />}
            />
          </div>
        )}
        {edit.error && <p className="mt-2 text-xs text-red-500">{edit.error}</p>}
      </CardContent>
    </Card>
  );
}

function UseQueryParamsDemo() {
  const { params, setParam, setParams, removeParam, clearParams, page, pageSize, search } =
    useQueryParams();

  return (
    <Card>
      <CardHeader
        title="useQueryParams"
        description="Typed wrapper around URL search params. Watch the URL change as you click."
      />
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">page = {page}</Badge>
            <Badge variant="info">pageSize = {pageSize}</Badge>
            <Badge variant="success">search = {search || '—'}</Badge>
          </div>

          <Input
            label="Search (synced to URL)"
            value={search}
            onChange={(e) => setParams({ search: e.target.value || undefined, page: 1 })}
            leftIcon={<Search className="w-4 h-4" />}
          />

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setParam('page', page + 1)}>
              page +1
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setParam('page', Math.max(1, page - 1))}
            >
              page -1
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setParams({ pageSize: pageSize === 20 ? 50 : 20, page: 1 })}
            >
              toggle pageSize
            </Button>
            <Button size="sm" variant="ghost" onClick={() => removeParam('search')}>
              remove search
            </Button>
            <Button size="sm" variant="danger" onClick={clearParams}>
              clear all
            </Button>
          </div>

          <pre className="mt-2 p-3 rounded-md bg-[var(--surface-100)] text-xs overflow-x-auto">
            {JSON.stringify(params, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}

function UseRowInlineEditDemo() {
  const [person, setPerson] = useState({ name: 'Grace Hopper', title: 'Rear Admiral' });
  const row = useRowInlineEdit(person, async (updates) => {
    await new Promise((r) => setTimeout(r, 500));
    setPerson((p) => ({ ...p, ...updates }));
  });

  return (
    <Card>
      <CardHeader
        title="useRowInlineEdit"
        description="One row, several editable fields (one at a time). Pairs with EditableCell."
      />
      <CardContent>
        <div className="grid grid-cols-[70px_1fr] items-center gap-x-3 gap-y-2">
          <span className="text-sm text-[var(--text-tertiary)]">Name</span>
          <EditableCell {...(row.getFieldProps('name') as any)} isSaving={row.isSaving} error={row.error} />
          <span className="text-sm text-[var(--text-tertiary)]">Title</span>
          <EditableCell {...(row.getFieldProps('title') as any)} isSaving={row.isSaving} error={row.error} />
        </div>
        <p className="mt-3 text-xs text-[var(--text-tertiary)]">
          Click a value to edit · Enter saves · Escape cancels
        </p>
      </CardContent>
    </Card>
  );
}

function UtilsDemo() {
  const sample = new Date(2026, 6, 14, 9, 30); // 14 Jul 2026, 09:30 local
  const split = splitDateTime('2026-07-14T09:30');
  const rows: Array<[string, string]> = [
    ["cn('px-2 py-1 rounded', 'px-4')", cn('px-2 py-1 rounded', 'px-4', false && 'hidden')],
    ['toDateString(sample)', toDateString(sample)],
    ['toTimeString(sample)', toTimeString(sample)],
    ['toDateTimeString(sample)', toDateTimeString(sample)],
    ["toDate('2026-07-14T09:30')", toDate('2026-07-14T09:30')?.toString().slice(0, 24) + '…'],
    ["splitDateTime('2026-07-14T09:30')", `{ date: '${split.date}', time: '${split.time}' }`],
    ["joinDateTime('2026-07-14', '09:30')", joinDateTime('2026-07-14', '09:30')],
  ];

  return (
    <Card>
      <CardHeader
        title="Utils — cn & dateValue"
        description="cn merges Tailwind classes (later wins); the dateValue helpers convert local strings ↔ Date."
      />
      <CardContent>
        <ul className="flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
          {rows.map(([call, result]) => (
            <li key={call}>
              <code className="text-xs">{call}</code> → “{result}”
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function HooksPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Hooks"
        description="Every hook exported by @nextleap-al/admin-ui in action."
      />

      <Section
        title="At a glance"
        description="Five hooks cover debouncing, inline editing, and URL state."
      >
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="primary">useDebounce</Badge>
          <Badge variant="primary">useDebouncedCallback</Badge>
          <Badge variant="primary">useInlineEdit</Badge>
          <Badge variant="primary">useRowInlineEdit</Badge>
          <Badge variant="primary">useQueryParams</Badge>
          {!mounted && <Loader2 className="w-4 h-4 animate-spin text-[var(--text-tertiary)]" />}
        </div>
      </Section>

      <div className="section-grid section-grid-2">
        <UseDebounceDemo />
        <UseDebouncedCallbackDemo />
        <UseInlineEditDemo />
        <UseRowInlineEditDemo />
        <UseQueryParamsDemo />
        <UtilsDemo />
      </div>
    </div>
  );
}
