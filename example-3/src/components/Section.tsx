import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@nextleap-al/admin-ui';

interface SectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function Section({ title, description, action, children }: SectionProps) {
  return (
    <Card>
      <CardHeader title={title} description={description} action={action} />
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface DemoRowProps {
  label?: string;
  children: ReactNode;
}

export function DemoRow({ label, children }: DemoRowProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-tertiary)]">
          {label}
        </span>
      )}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
