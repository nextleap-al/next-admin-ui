// Core UI Components
export { Button, type ButtonProps } from './Button';
export { Input, type InputProps } from './Input';
export { Checkbox, type CheckboxProps } from './Checkbox';
export { Textarea, type TextareaProps } from './Textarea';
export { Card, CardHeader, CardContent, CardFooter, type CardProps } from './Card';
export { Badge, StatusBadge, type BadgeProps } from './Badge';
export { Modal, ConfirmModal, type ModalProps, type ConfirmModalProps } from './Modal';
export { Dropdown, type DropdownProps, type DropdownItem } from './Dropdown';
export { Tabs, TabList, TabTrigger, TabContent, type TabsProps, type TabListProps, type TabTriggerProps, type TabContentProps } from './Tabs';
export { Tooltip, type TooltipProps } from './Tooltip';
export { Skeleton, SkeletonText, SkeletonCard, SkeletonTable, SkeletonList, type SkeletonProps } from './Skeleton';
export { EmptyState, NoResults, NoData, NoUsers, NoNotifications, NoEvents, NoCompetitions, ErrorState, FileNotFound, type EmptyStateProps } from './EmptyState';
export { Avatar, AvatarGroup, type AvatarProps, type AvatarGroupProps } from './Avatar';
export { DataTable, EditableCell, RowActions, type DataTableProps, type EditableCellProps, type RowActionsProps } from './DataTable';
export { Switch, StatusSwitch, type SwitchProps, type StatusSwitchProps } from './Switch';

// Unified Dropdown Components
export {
  SimpleDropdown,
  SearchDropdown,
  MultiSelectDropdown,
  MultiSelectSimple,
  ActionMenu,
  InlineSelect,
  type SimpleDropdownProps,
  type SearchDropdownProps,
  type MultiSelectDropdownProps,
  type MultiSelectSimpleProps,
  type ActionMenuProps,
  type ActionMenuItem,
  type InlineSelectProps,
  type DropdownOption,
} from './Dropdown/index';

// Form composition helpers
export { FormBanner, type FormBannerProps } from './FormBanner';
export { FormModal, type FormModalProps } from './FormModal';

// Unified auto-commit date/time field (string in / string out) — an Apply-free alternative to
// the Date-object DatePicker/DateRangePicker below.
export {
  DateField,
  FormDateField,
  FormDateRangeField,
  DateCalendarField,
  DateTimeCalendarField,
  RangeCalendarField,
  DateTimeRangeCalendarField,
  TimeSelectField,
  makeAheadDatePresets,
  makeAheadDateRangePresets,
  makeRecentDateRangePresets,
  type DateFieldProps,
  type DateRangeValue,
  type SingleMode,
  type RangeMode,
  type FormDateFieldProps,
  type FormDateRangeFieldProps,
  type DateCalendarFieldProps,
  type DateTimeCalendarFieldProps,
  type RangeCalendarFieldProps,
  type DateTimeRangeCalendarFieldProps,
  type TimeSelectFieldProps,
  type TimePreset,
} from './DateField';

// Date Picker Components
export {
  Calendar,
  DatePicker,
  DateRangePicker,
  DateRangePickerWithTimeInput,
  DEFAULT_DATE_PRESETS,
  DEFAULT_DATE_RANGE_PRESETS,
  type DatePickerProps,
  type DateRangePickerProps,
  type DateRangePickerWithTimeInputProps,
  type DatePreset,
  type DateRange,
  type DateRangePreset,
  type Matcher,
} from './DatePicker';
