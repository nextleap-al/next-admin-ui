import { useState } from 'react';
import {
  Badge,
  Button,
  ConfirmModal,
  Dropdown,
  Input,
  Modal,
  PageHeader,
  Textarea,
} from '@nextleap/next-ui';
import { Copy, Edit3, Mail, MoreVertical, Share2, Trash2 } from 'lucide-react';
import { DemoRow, Section } from '../components/Section';

export default function OverlayPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setDeleting(false);
    setConfirmOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Overlay"
        description="Modals, confirmation dialogs, and low-level dropdown menus."
      />

      <Section title="Modal sizes" description="Small, medium, large, extra-large, and full-screen.">
        <DemoRow>
          <Button onClick={() => setInviteOpen(true)}>Open invite modal</Button>
          <Button variant="outline" onClick={() => setDetailsOpen(true)}>
            Open details modal
          </Button>
        </DemoRow>
      </Section>

      <Section title="ConfirmModal" description="Destructive action with async confirmation.">
        <DemoRow>
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            Delete account
          </Button>
          <Badge variant="warning" dot>
            Cannot be undone
          </Badge>
        </DemoRow>
      </Section>

      <Section title="Dropdown (low-level)" description="Custom trigger + items with dividers and danger.">
        <DemoRow>
          <Dropdown
            trigger={<Button variant="outline">Options</Button>}
            items={[
              { label: 'Edit', icon: <Edit3 className="w-4 h-4" />, onClick: () => alert('Edit') },
              { label: 'Duplicate', icon: <Copy className="w-4 h-4" />, onClick: () => alert('Duplicate') },
              { label: 'Share', icon: <Share2 className="w-4 h-4" />, onClick: () => alert('Share') },
              { label: '', divider: true },
              {
                label: 'Delete',
                icon: <Trash2 className="w-4 h-4" />,
                onClick: () => alert('Delete'),
                danger: true,
              },
            ]}
          />
          <Dropdown
            align="left"
            trigger={
              <Button variant="ghost" size="icon" leftIcon={<MoreVertical className="w-4 h-4" />} />
            }
            items={[
              { label: 'View profile', onClick: () => alert('Profile') },
              { label: 'Settings', onClick: () => alert('Settings') },
              { label: '', divider: true },
              { label: 'Sign out', onClick: () => alert('Bye'), danger: true },
            ]}
          />
        </DemoRow>
      </Section>

      <Modal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite a teammate"
        description="They'll get an email with a link to join your workspace."
        size="md"
      >
        <div className="flex flex-col gap-4">
          <Input label="Email" placeholder="[email protected]" leftIcon={<Mail className="w-4 h-4" />} />
          <Textarea label="Personal note (optional)" placeholder="Can't wait to work with you!" rows={3} />
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                alert('Invite sent (demo)');
                setInviteOpen(false);
              }}
            >
              Send invite
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title="Feature details"
        size="lg"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Modals receive children directly — compose any layout you like. The overlay click and{' '}
            <kbd className="px-1 py-0.5 rounded border text-xs">Esc</kbd> both call{' '}
            <code>onClose</code>.
          </p>
          <div className="rounded-lg bg-[var(--surface-100)] p-4 text-sm text-[var(--text-secondary)]">
            <strong>Tip:</strong> use <code>size="full"</code> for full-screen flows.
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete account?"
        message="This will permanently delete your account and all associated data. This action cannot be undone."
        confirmLabel="Yes, delete"
        cancelLabel="Keep account"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}
