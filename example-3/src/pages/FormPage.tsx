import { useState } from 'react';
import {
  Button,
  Checkbox,
  DatePicker,
  DateRangePicker,
  DEFAULT_DATE_PRESETS,
  DEFAULT_DATE_RANGE_PRESETS,
  Input,
  MultiSelectDropdown,
  MultiSelectSimple,
  PageHeader,
  SearchDropdown,
  SimpleDropdown,
  StatusSwitch,
  Switch,
  Textarea,
} from '@nextleap/admin-ui';

type DropdownOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
  divider?: boolean;
  searchText?: string;
};
import { Mail, Search, User as UserIcon } from 'lucide-react';
import { DemoRow, Section } from '../components/Section';

const STATUS_OPTIONS: DropdownOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'archived', label: 'Archived', disabled: true },
];

const USER_OPTIONS: DropdownOption[] = [
  { value: 1, label: 'Ada Lovelace', searchText: '[email protected]' },
  { value: 2, label: 'Grace Hopper', searchText: '[email protected]' },
  { value: 3, label: 'Linus Torvalds', searchText: '[email protected]' },
  { value: 4, label: 'Rich Hickey', searchText: '[email protected]' },
  { value: 5, label: 'Margaret Hamilton', searchText: '[email protected]' },
];

const TAG_OPTIONS: DropdownOption[] = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'design', label: 'Design' },
  { value: 'devops', label: 'DevOps' },
  { value: 'data', label: 'Data' },
  { value: 'ml', label: 'Machine Learning' },
];

const PRIORITY_OPTIONS: DropdownOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'med', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function FormPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [agree, setAgree] = useState(false);
  const [notify, setNotify] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const [status, setStatus] = useState<string | number>('active');
  const [userId, setUserId] = useState<string | number | null>(null);
  const [tags, setTags] = useState<Array<string | number>>(['frontend']);
  const [priorities, setPriorities] = useState<Array<string | number>>([]);

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [range, setRange] = useState<{ from: Date | undefined; to?: Date | undefined } | undefined>(
    undefined,
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Form"
        description="Inputs, selections, toggles and date pickers — fully controlled."
      />

      <Section
        title="Text inputs"
        description="Input with label, hint, error, icons and a password toggle."
      >
        <div className="section-grid section-grid-2">
          <Input
            label="Email"
            type="email"
            placeholder="[email protected]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            hint="We'll never share your email."
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={password && password.length < 8 ? 'Must be at least 8 characters' : undefined}
          />
          <Input label="Search" placeholder="Search…" leftIcon={<Search className="w-4 h-4" />} />
          <Input label="Disabled" value="Read only" disabled />
        </div>
        <div className="mt-4">
          <Textarea
            label="Bio"
            placeholder="Tell us a bit about yourself"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            hint={`${bio.length}/280`}
            rows={3}
          />
        </div>
      </Section>

      <Section title="Checkbox & Switch" description="Native change events — async Switch support.">
        <div className="section-grid section-grid-2">
          <div className="flex flex-col gap-3">
            <Checkbox
              label="I agree to the terms"
              description="You can revoke this anytime in settings."
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <Checkbox label="Subscribe to the weekly digest" />
            <Checkbox label="Indeterminate example" indeterminate />
            <Checkbox label="Disabled" disabled />
          </div>
          <div className="flex flex-col gap-3">
            <Switch
              checked={notify}
              onChange={setNotify}
              label="Email notifications"
              description="Daily summary of activity."
            />
            <Switch
              checked={false}
              onChange={async () => {
                await new Promise((r) => setTimeout(r, 900));
              }}
              label="Async toggle (simulated)"
              description="Shows the loading pulse while the promise is pending."
            />
            <StatusSwitch isActive={isActive} onToggle={setIsActive} showLabel />
          </div>
        </div>
      </Section>

      <Section title="Dropdowns" description="Simple, searchable, and multi-select variants.">
        <div className="section-grid section-grid-2">
          <SimpleDropdown
            label="Status"
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
            placeholder="Select status"
          />
          <SearchDropdown
            label="Assignee"
            value={userId}
            onChange={setUserId}
            options={USER_OPTIONS as any}
            searchPlaceholder="Search users…"
            placeholder="Choose a user"
          />
          <MultiSelectDropdown
            label="Tags"
            value={tags}
            onChange={setTags}
            options={TAG_OPTIONS}
            placeholder="Select tags"
            showSelectAll
            selectAllLabel="All tags"
          />
          <MultiSelectSimple
            label="Priorities"
            value={priorities}
            onChange={setPriorities}
            options={PRIORITY_OPTIONS}
            placeholder="Pick one or more"
          />
        </div>
      </Section>

      <Section title="Dates" description="DatePicker and DateRangePicker with built-in presets.">
        <DemoRow label="Single date">
          <DatePicker
            value={date}
            onChange={setDate}
            presets={DEFAULT_DATE_PRESETS}
            placeholder="Pick a date"
          />
          {date && (
            <span className="text-sm text-[var(--text-secondary)]">
              Selected: {date.toLocaleDateString()}
            </span>
          )}
        </DemoRow>
        <div className="mt-4">
          <DemoRow label="Date range">
            <DateRangePicker
              value={range}
              onChange={setRange}
              presets={DEFAULT_DATE_RANGE_PRESETS}
              placeholder="Pick a range"
            />
            {range?.from && range.to && (
              <span className="text-sm text-[var(--text-secondary)]">
                {range.from.toLocaleDateString()} → {range.to.toLocaleDateString()}
              </span>
            )}
          </DemoRow>
        </div>
      </Section>

      <div className="flex justify-end">
        <Button leftIcon={<UserIcon className="w-4 h-4" />}>Save profile (demo)</Button>
      </div>
    </div>
  );
}
