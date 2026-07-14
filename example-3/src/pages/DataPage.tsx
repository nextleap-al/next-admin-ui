import { useMemo, useState } from 'react';
import {
  ActionMenu,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  DataTable,
  Input,
  ListView,
  PageHeader,
  RowActions,
  StatusBadge,
  TabContent,
  TabList,
  TabTrigger,
  Tabs,
  useListParams,
  type PaginationMeta,
} from '@nextleap-al/admin-ui';
import type { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table';
import { Ban, Check, Mail, Pencil, Plus, Trash2, X } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Member' | 'Viewer';
  status: 'active' | 'pending' | 'inactive';
  team: 'Frontend' | 'Backend' | 'Design' | 'Data';
}

const ALL_USERS: User[] = [
  { id: 1, name: 'Ada Lovelace', email: '[email protected]', role: 'Admin', status: 'active', team: 'Frontend' },
  { id: 2, name: 'Grace Hopper', email: '[email protected]', role: 'Admin', status: 'active', team: 'Backend' },
  { id: 3, name: 'Linus Torvalds', email: '[email protected]', role: 'Member', status: 'active', team: 'Backend' },
  { id: 4, name: 'Margaret Hamilton', email: '[email protected]', role: 'Member', status: 'pending', team: 'Data' },
  { id: 5, name: 'Donald Knuth', email: '[email protected]', role: 'Viewer', status: 'inactive', team: 'Backend' },
  { id: 6, name: 'Tim Berners-Lee', email: '[email protected]', role: 'Admin', status: 'active', team: 'Frontend' },
  { id: 7, name: 'Rich Hickey', email: '[email protected]', role: 'Member', status: 'active', team: 'Data' },
  { id: 8, name: 'Alan Turing', email: '[email protected]', role: 'Admin', status: 'active', team: 'Backend' },
  { id: 9, name: 'Hedy Lamarr', email: '[email protected]', role: 'Member', status: 'pending', team: 'Design' },
  { id: 10, name: 'Edsger Dijkstra', email: '[email protected]', role: 'Viewer', status: 'active', team: 'Backend' },
  { id: 11, name: 'Barbara Liskov', email: '[email protected]', role: 'Admin', status: 'active', team: 'Backend' },
  { id: 12, name: 'John Carmack', email: '[email protected]', role: 'Member', status: 'inactive', team: 'Frontend' },
];

export default function DataPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selection, setSelection] = useState<RowSelectionState>({});
  const [users, setUsers] = useState<User[]>(ALL_USERS);
  const [nextId, setNextId] = useState(13);
  const [creatingUserId, setCreatingUserId] = useState<number | null>(null);
  const [createDraft, setCreateDraft] = useState({ name: '', email: '' });
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState({ name: '', email: '' });

  // ListView's URL-bound list state (page / pageSize / search live in the query string).
  const list = useListParams({ defaultPageSize: 10 });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.team.toLowerCase().includes(q),
    );
  }, [search, users]);

  const sorted = useMemo(() => {
    if (!sorting.length) return filtered;
    const [{ id, desc }] = sorting;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = String((a as any)[id] ?? '').toLowerCase();
      const bv = String((b as any)[id] ?? '').toLowerCase();
      if (av < bv) return desc ? 1 : -1;
      if (av > bv) return desc ? -1 : 1;
      return 0;
    });
    return copy;
  }, [filtered, sorting]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageData = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const pagination: PaginationMeta = { page: safePage, pageSize, total, totalPages };

  // Derived state for the ListView demo — a server-style page over the same users, driven by the URL.
  const listFiltered = useMemo(() => {
    const q = list.search.trim().toLowerCase();
    if (!q) return ALL_USERS;
    return ALL_USERS.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [list.search]);
  const listStart = (list.page - 1) * list.pageSize;
  const listPage = listFiltered.slice(listStart, listStart + list.pageSize);

  const removeUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (creatingUserId === id) {
      setCreatingUserId(null);
      setCreateDraft({ name: '', email: '' });
    }
    if (editingUserId === id) {
      setEditingUserId(null);
      setEditDraft({ name: '', email: '' });
    }
  };

  const createUser = () => {
    const id = nextId;
    setNextId((prev) => prev + 1);
    setCreateDraft({ name: '', email: '' });
    setCreatingUserId(id);
    setSearch('');
    setPage(1);
    setUsers((prev) => [
      {
        id,
        name: '',
        email: '',
        role: 'Member',
        status: 'pending',
        team: 'Design',
      },
      ...prev,
    ]);
  };

  const saveCreatedUser = () => {
    if (creatingUserId == null) return;
    const name = createDraft.name.trim();
    const email = createDraft.email.trim().toLowerCase();
    if (!name || !email) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === creatingUserId
          ? {
              ...u,
              name,
              email,
            }
          : u,
      ),
    );
    setCreatingUserId(null);
    setCreateDraft({ name: '', email: '' });
  };

  const cancelCreatedUser = () => {
    if (creatingUserId == null) return;
    setUsers((prev) => prev.filter((u) => u.id !== creatingUserId));
    setCreatingUserId(null);
    setCreateDraft({ name: '', email: '' });
  };

  const startInlineRowEdit = (row: User) => {
    setEditingUserId(row.id);
    setEditDraft({ name: row.name, email: row.email });
  };

  const saveEditedUser = () => {
    if (editingUserId == null) return;
    const name = editDraft.name.trim();
    const email = editDraft.email.trim().toLowerCase();
    if (!name || !email) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUserId
          ? {
              ...u,
              name,
              email,
            }
          : u,
      ),
    );
    setEditingUserId(null);
    setEditDraft({ name: '', email: '' });
  };

  const cancelEditedUser = () => {
    setEditingUserId(null);
    setEditDraft({ name: '', email: '' });
  };

  const saveInlineEdit = async ({
    row,
    columnId,
    value,
  }: {
    row: User;
    rowIndex: number;
    columnId: string;
    value: string;
  }) => {
    const normalized = value.trim();
    if (!normalized) return;
    await new Promise((resolve) => setTimeout(resolve, 500));

    setUsers((prev) =>
      prev.map((u) =>
        u.id !== row.id
          ? u
          : {
              ...u,
              [columnId]:
                columnId === 'email'
                  ? normalized.toLowerCase()
                  : columnId === 'name'
                    ? normalized
                    : (u as any)[columnId],
            },
      ),
    );
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const isCreatingRow = row.original.id === creatingUserId;
        const isEditingRow = row.original.id === editingUserId;
        if (isCreatingRow) {
          return (
            <Input
              size="sm"
              value={createDraft.name}
              onChange={(e) => setCreateDraft((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Full name"
              autoFocus
            />
          );
        }
        if (isEditingRow) {
          return (
            <Input
              size="sm"
              value={editDraft.name}
              onChange={(e) => setEditDraft((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Full name"
              autoFocus
            />
          );
        }
        return (
          <div className="flex items-center gap-2">
            <Avatar name={row.original.name} size="sm" />
            <div className="text-sm font-medium text-[var(--text-primary)]">{row.original.name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => {
        const isCreatingRow = row.original.id === creatingUserId;
        const isEditingRow = row.original.id === editingUserId;
        if (isCreatingRow) {
          return (
            <Input
              size="sm"
              value={createDraft.email}
              onChange={(e) => setCreateDraft((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Email address"
              type="email"
            />
          );
        }
        if (isEditingRow) {
          return (
            <Input
              size="sm"
              value={editDraft.email}
              onChange={(e) => setEditDraft((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Email address"
              type="email"
            />
          );
        }
        return row.original.email;
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const r = row.original.role;
        return (
          <Badge variant={r === 'Admin' ? 'primary' : r === 'Member' ? 'info' : 'outline'}>{r}</Badge>
        );
      },
    },
    {
      accessorKey: 'team',
      header: 'Team',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];
  const DataTableWithInline = DataTable as any;

  const listColumns: ColumnDef<User, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.original.name} size="sm" />
          <span className="text-sm font-medium text-[var(--text-primary)]">{row.original.name}</span>
        </div>
      ),
    },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const r = row.original.role;
        return (
          <Badge variant={r === 'Admin' ? 'primary' : r === 'Member' ? 'info' : 'outline'}>{r}</Badge>
        );
      },
    },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Data"
        description="DataTable with pagination, sorting, search, row selection, actions — and Tabs."
      />

      <Tabs defaultValue="users">
        <TabList variant="underline">
          <TabTrigger value="users">Users</TabTrigger>
          <TabTrigger value="activity">Activity</TabTrigger>
          <TabTrigger value="billing">Billing</TabTrigger>
        </TabList>

        <TabContent value="users">
          <div className="mt-4">
            <DataTableWithInline
              data={pageData}
              columns={columns as any}
              pagination={pagination}
              onPageChange={setPage}
              onPageSizeChange={(s: number) => {
                setPageSize(s);
                setPage(1);
              }}
              sorting={sorting}
              onSortingChange={setSorting}
              searchValue={search}
              onSearchChange={(v: string) => {
                setSearch(v);
                setPage(1);
              }}
              searchPlaceholder="Search users…"
              enableSelection
              selectedRows={selection}
              onSelectionChange={setSelection}
              enableInlineEdit
              editableColumns={['name', 'email']}
              onInlineEditSave={saveInlineEdit}
              enableInlineCreate
              onInlineCreate={createUser}
              createLabel={creatingUserId == null ? 'Invite user' : 'Creating...'}
              rowActions={(row: User) => (
                row.id === creatingUserId ? (
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<Check className="w-4 h-4" />}
                      onClick={saveCreatedUser}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<X className="w-4 h-4" />}
                      onClick={cancelCreatedUser}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : row.id === editingUserId ? (
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<Check className="w-4 h-4" />}
                      onClick={saveEditedUser}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<X className="w-4 h-4" />}
                      onClick={cancelEditedUser}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <ActionMenu
                    moreIcon
                    items={[
                      { key: 'edit', label: 'Edit', icon: Pencil, onClick: () => startInlineRowEdit(row) },
                      { key: 'email', label: 'Send email', icon: Mail, onClick: () => alert(`Email ${row.email}`) },
                      { key: 'div', label: '', onClick: () => {}, divider: true },
                      { key: 'suspend', label: 'Suspend', icon: Ban, onClick: () => alert(`Suspend ${row.name}`) },
                      {
                        key: 'delete',
                        label: 'Delete',
                        icon: Trash2,
                        destructive: true,
                        onClick: () => removeUser(row.id),
                      },
                    ]}
                  />
                )
              )}
            />
          </div>
        </TabContent>

        <TabContent value="activity">
          <Card className="mt-4">
            <CardHeader title="Recent activity" description="Placeholder tab content." />
            <CardContent>
              <ul className="flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
                <li>Ada invited Grace to the workspace</li>
                <li>Linus merged PR #1482</li>
                <li>Margaret created a new dataset</li>
              </ul>
            </CardContent>
          </Card>
        </TabContent>

        <TabContent value="billing">
          <Card className="mt-4">
            <CardHeader
              title="Billing"
              description="Placeholder tab content."
              action={<Button leftIcon={<Plus className="w-4 h-4" />}>Add method</Button>}
            />
            <CardContent>
              <p className="text-sm text-[var(--text-secondary)]">
                Manage subscriptions, invoices, and payment methods here.
              </p>
            </CardContent>
          </Card>
        </TabContent>
      </Tabs>

      <div className="border-t border-[var(--border-light)] pt-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--text-tertiary)]">
          ListView — a full list-page pattern (PageHeader + DataTable + URL-bound paging, with an “All” page size)
        </p>
        <ListView
          title="Team members"
          description="Page, size, and search live in the URL via useListParams — reload or share the link and the view is preserved."
          columns={listColumns}
          items={listPage}
          total={listFiltered.length}
          page={list.page}
          pageSize={list.pageSize}
          onPageChange={list.setPage}
          onPageSizeChange={list.setPageSize}
          isLoading={false}
          search={list.search}
          onSearchChange={list.setSearch}
          searchPlaceholder="Search members…"
        />
      </div>

      <div className="border-t border-[var(--border-light)] pt-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--text-tertiary)]">
          RowActions — a compact row-level “⋯” menu (used in a cell's actions column)
        </p>
        <div className="flex items-center justify-between rounded-lg border border-[var(--border-light)] bg-[var(--bg-elevated)] px-4 py-3">
          <div className="flex items-center gap-2">
            <Avatar name="Ada Lovelace" size="sm" />
            <span className="text-sm font-medium text-[var(--text-primary)]">Ada Lovelace</span>
          </div>
          <RowActions
            items={[
              { label: 'Edit', icon: <Pencil className="w-4 h-4" />, onClick: () => alert('Edit (demo)') },
              { label: 'Send email', icon: <Mail className="w-4 h-4" />, onClick: () => alert('Email (demo)') },
              { label: '', divider: true },
              { label: 'Delete', icon: <Trash2 className="w-4 h-4" />, danger: true, onClick: () => alert('Delete (demo)') },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
