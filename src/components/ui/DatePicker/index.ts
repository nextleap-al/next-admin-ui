// DatePicker Components - Re-export all date picker related components

export { Calendar, type Matcher } from './Calendar';
export { DatePicker, type DatePickerProps, type DatePreset } from './DatePicker';
export { DateRangePicker, type DateRangePickerProps, type DateRange, type DateRangePreset } from './DateRangePicker';
export { DateRangePickerWithTimeInput, type DateRangePickerWithTimeInputProps } from './DateRangePickerWithTimeInput';

// Default presets for single date picker
export const DEFAULT_DATE_PRESETS = [
  {
    label: 'Today',
    date: new Date(),
  },
  {
    label: 'Tomorrow',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
  },
  {
    label: 'A week from now',
    date: new Date(new Date().setDate(new Date().getDate() + 7)),
  },
  {
    label: 'A month from now',
    date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  },
  {
    label: '6 months from now',
    date: new Date(new Date().setMonth(new Date().getMonth() + 6)),
  },
  {
    label: 'A year from now',
    date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  },
];

// Default presets for date range picker
export const DEFAULT_DATE_RANGE_PRESETS = [
  {
    label: 'Today',
    dateRange: {
      from: new Date(),
      to: new Date(),
    },
  },
  {
    label: 'Tomorrow',
    dateRange: {
      from: new Date(),
      to: new Date(new Date().setDate(new Date().getDate() + 1)),
    },
  },
  {
    label: 'A week from now',
    dateRange: {
      from: new Date(),
      to: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
  },
  {
    label: 'A month from now',
    dateRange: {
      from: new Date(),
      to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  },
  {
    label: '3 months from now',
    dateRange: {
      from: new Date(),
      to: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    },
  },
  {
    label: '6 months from now',
    dateRange: {
      from: new Date(),
      to: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    },
  },
  {
    label: 'A year from now',
    dateRange: {
      from: new Date(),
      to: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
  },
];
