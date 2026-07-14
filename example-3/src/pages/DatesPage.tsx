import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Calendar,
  DateCalendarField,
  DateField,
  DateTimeCalendarField,
  DateTimeRangeCalendarField,
  FormDateField,
  FormDateRangeField,
  PageHeader,
  RangeCalendarField,
  TimeSelectField,
  makeAheadDatePresets,
  makeAheadDateRangePresets,
  makeRecentDateRangePresets,
  type DateRange,
  type DateRangeValue,
  type TimePreset,
} from '@nextleap-al/admin-ui';
import { Section, DemoRow } from '../components/Section';

const TIME_PRESETS: TimePreset[] = [
  { label: 'Morning', from: '08:00', to: '12:00' },
  { label: 'Afternoon', from: '13:00', to: '17:00' },
  { label: 'Full day', from: '08:00', to: '18:00' },
];

/** A labelled read-out of the raw string value a field emits — the whole point of DateField is the string. */
function ValueTag({ value }: { value: string }) {
  return (
    <code className="rounded-md bg-[var(--surface-100)] px-2 py-1 text-xs text-[var(--text-secondary)]">
      {value ? value : '—'}
    </code>
  );
}

export default function DatesPage() {
  const [date, setDate] = useState('');
  const [datetime, setDatetime] = useState('');
  const [time, setTime] = useState('');
  const [range, setRange] = useState<DateRangeValue>({ from: '', to: '' });
  const [dtRange, setDtRange] = useState<DateRangeValue>({ from: '', to: '' });
  const [deadline, setDeadline] = useState('');
  const [reportRange, setReportRange] = useState<DateRangeValue>({ from: '', to: '' });
  const [errored, setErrored] = useState('');

  const [calDay, setCalDay] = useState<Date | undefined>(undefined);
  const [calRange, setCalRange] = useState<DateRange | undefined>(undefined);

  // Lower-level controls (what DateField dispatches to), driven directly.
  const [llDate, setLlDate] = useState('');
  const [llDatetime, setLlDatetime] = useState('');
  const [llTime, setLlTime] = useState('');
  const [llRange, setLlRange] = useState<DateRangeValue>({ from: '', to: '' });
  const [llDtRange, setLlDtRange] = useState<DateRangeValue>({ from: '', to: '' });

  // react-hook-form binding demo (string fields, same as the native inputs emit).
  const { control, handleSubmit } = useForm<{ due: string; from: string; to: string }>({
    defaultValues: { due: '', from: '', to: '' },
  });
  const [submitted, setSubmitted] = useState('');

  return (
    <div>
      <PageHeader
        title="Dates & times"
        description="DateField — one auto-committing, string in / string out picker for every date/time need. No Apply button: it commits and pop-closes the instant the selection is complete."
      />

      <div className="space-y-6">
        <Section
          title="The five modes"
          description="Pick a mode; each emits a plain local string (YYYY-MM-DD · YYYY-MM-DDTHH:mm · HH:mm). Ranges emit { from, to }."
        >
          <div className="section-grid section-grid-2">
            <div className="space-y-1.5">
              <DateField mode="date" label="Date" value={date} onChange={setDate} placeholder="Pick a day" />
              <ValueTag value={date} />
            </div>
            <div className="space-y-1.5">
              <DateField
                mode="datetime"
                label="Date & time"
                value={datetime}
                onChange={setDatetime}
                placeholder="Pick a day & time"
              />
              <ValueTag value={datetime} />
            </div>
            <div className="space-y-1.5">
              <DateField mode="time" label="Time" value={time} onChange={setTime} placeholder="Pick a time" />
              <ValueTag value={time} />
            </div>
            <div className="space-y-1.5">
              <DateField
                mode="date-range"
                label="Date range"
                value={range}
                onChange={setRange}
                placeholder="Pick a range"
              />
              <ValueTag value={range.from ? `${range.from} → ${range.to}` : ''} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <DateField
                mode="datetime-range"
                label="Date & time range"
                value={dtRange}
                onChange={setDtRange}
                timePresets={TIME_PRESETS}
                placeholder="Pick a range with times"
              />
              <ValueTag value={dtRange.from ? `${dtRange.from} → ${dtRange.to}` : ''} />
            </div>
          </div>
        </Section>

        <Section
          title="Presets"
          description="Pass presets={true} for the built-in forward-looking shortcuts, or hand in your own from the preset factories."
        >
          <div className="section-grid section-grid-2">
            <div className="space-y-1.5">
              <DateField
                mode="date"
                label="Deadline (built-in ahead presets)"
                value={deadline}
                onChange={setDeadline}
                presets
              />
              <ValueTag value={deadline} />
            </div>
            <div className="space-y-1.5">
              <DateField
                mode="date-range"
                label="Report window (makeRecentDateRangePresets)"
                value={reportRange}
                onChange={setReportRange}
                presets={makeRecentDateRangePresets()}
              />
              <ValueTag value={reportRange.from ? `${reportRange.from} → ${reportRange.to}` : ''} />
            </div>
          </div>
        </Section>

        <Section title="States" description="Errors, hints, required markers, disabled, and min/max bounds are all first-class.">
          <div className="section-grid section-grid-2">
            <DateField
              mode="date"
              label="With an error"
              required
              value={errored}
              onChange={setErrored}
              error={errored ? undefined : 'Please choose a date'}
              hint="Cleared while an error is showing"
            />
            <DateField mode="date" label="Disabled" value="2026-01-15" onChange={() => {}} disabled />
            <DateField
              mode="date"
              label="Bounded (this month only)"
              value=""
              onChange={() => {}}
              min="2026-07-01"
              max="2026-07-31"
              hint="Days outside July 2026 are unselectable"
            />
          </div>
        </Section>

        <Section
          title="Bound to react-hook-form"
          description="FormDateField / FormDateRangeField wire DateField to RHF — string values, validation messages surfaced automatically."
        >
          <form onSubmit={handleSubmit((v) => setSubmitted(JSON.stringify(v)))} className="max-w-md space-y-4">
            <FormDateField control={control} name="due" label="Due date" presets />
            <FormDateRangeField control={control} fromName="from" toName="to" label="Active window" />
            <div className="flex items-center gap-3">
              <Button type="submit" size="sm">
                Submit
              </Button>
              {submitted ? <ValueTag value={submitted} /> : null}
            </div>
          </form>
        </Section>

        <Section
          title="Calendar (standalone)"
          description="The bare react-day-picker calendar the pickers build on — drive it directly for custom popovers."
        >
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--text-tertiary)]">
                Single
              </p>
              <Calendar mode="single" selected={calDay} onSelect={setCalDay} />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--text-tertiary)]">
                Range · 2 months
              </p>
              <Calendar mode="range" numberOfMonths={2} selected={calRange} onSelect={setCalRange} />
            </div>
          </div>
        </Section>

        <Section
          title="Lower-level controls"
          description="The individual popover controls DateField dispatches to — drive one directly for a custom field layout."
        >
          <div className="section-grid section-grid-2">
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-[var(--text-tertiary)]">DateCalendarField</span>
              <DateCalendarField value={llDate} onChange={setLlDate} presets={makeAheadDatePresets()} />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-[var(--text-tertiary)]">DateTimeCalendarField</span>
              <DateTimeCalendarField value={llDatetime} onChange={setLlDatetime} />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-[var(--text-tertiary)]">TimeSelectField</span>
              <TimeSelectField value={llTime} onChange={setLlTime} />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-[var(--text-tertiary)]">RangeCalendarField</span>
              <RangeCalendarField value={llRange} onChange={setLlRange} presets={makeAheadDateRangePresets()} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-medium text-[var(--text-tertiary)]">DateTimeRangeCalendarField</span>
              <DateTimeRangeCalendarField value={llDtRange} onChange={setLlDtRange} />
            </div>
          </div>
        </Section>

        <DemoRow label="Note">
          <p className="text-sm text-[var(--text-secondary)]">
            Bind to react-hook-form with <code className="text-xs">FormDateField</code> /{' '}
            <code className="text-xs">FormDateRangeField</code>. For an Apply-gated, Date-object picker,
            use <code className="text-xs">DatePicker</code> / <code className="text-xs">DateRangePicker</code> instead.
          </p>
        </DemoRow>
      </div>
    </div>
  );
}
