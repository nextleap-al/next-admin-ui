import { useState } from 'react';
import { Button, PageHeader } from '@nextleap/admin-ui';
import { Download, Heart, Plus, Save, Settings, Sparkles, Trash2 } from 'lucide-react';
import { DemoRow, Section } from '../components/Section';

export default function ActionsPage() {
  const [saving, setSaving] = useState(false);

  const simulateSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Actions"
        description="The Button primitive — variants, sizes, icons, and loading states."
      />

      <Section title="Variants" description="Five visual variants for different intents.">
        <DemoRow>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </DemoRow>
      </Section>

      <Section title="Sizes" description="Small, medium, large and square icon.">
        <DemoRow>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" variant="outline" leftIcon={<Settings className="w-4 h-4" />} />
          <Button size="icon" variant="ghost" leftIcon={<Heart className="w-4 h-4" />} />
        </DemoRow>
      </Section>

      <Section title="With icons" description="Compose with leftIcon / rightIcon (any ReactNode).">
        <DemoRow>
          <Button leftIcon={<Plus className="w-4 h-4" />}>Create</Button>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Download
          </Button>
          <Button variant="secondary" rightIcon={<Sparkles className="w-4 h-4" />}>
            Generate
          </Button>
          <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />}>
            Delete
          </Button>
        </DemoRow>
      </Section>

      <Section
        title="Loading & disabled"
        description="isLoading disables the button and replaces leftIcon with a spinner."
      >
        <DemoRow>
          <Button isLoading={saving} onClick={simulateSave} leftIcon={<Save className="w-4 h-4" />}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
          <Button variant="outline" disabled>
            Disabled
          </Button>
          <Button variant="danger" isLoading>
            Deleting…
          </Button>
        </DemoRow>
      </Section>
    </div>
  );
}
