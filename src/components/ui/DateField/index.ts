// Unified auto-commit date/time field (string in / string out) — an Apply-free alternative to the
// Date-object DatePicker/DateRangePicker.

export {
  DateField,
  type DateFieldProps,
  type DateRangeValue,
  type SingleMode,
  type RangeMode,
} from './DateField';

export {
  FormDateField,
  FormDateRangeField,
  type FormDateFieldProps,
  type FormDateRangeFieldProps,
} from './FormDateField';

// The individual controls DateField dispatches to — usable directly for bespoke layouts.
export { DateCalendarField, type DateCalendarFieldProps } from './DateCalendarField';
export { DateTimeCalendarField, type DateTimeCalendarFieldProps } from './DateTimeCalendarField';
export { RangeCalendarField, type RangeCalendarFieldProps } from './RangeCalendarField';
export {
  DateTimeRangeCalendarField,
  type DateTimeRangeCalendarFieldProps,
} from './DateTimeRangeCalendarField';
export { TimeSelectField, type TimeSelectFieldProps } from './TimeSelectField';

// Preset factories (computed relative to "now") + the time-preset shape.
export {
  makeAheadDatePresets,
  makeAheadDateRangePresets,
  makeRecentDateRangePresets,
  type TimePreset,
} from './datePresets';
