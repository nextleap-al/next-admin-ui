import type { ReactElement } from 'react';
import {
  Controller,
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { DateField, type DateFieldProps, type RangeMode, type SingleMode } from './DateField';

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

type SingleProps = Extract<DateFieldProps, { mode?: SingleMode }>;
type RangeProps = Extract<DateFieldProps, { mode: RangeMode }>;

export type FormDateFieldProps<T extends FieldValues> = Omit<
  SingleProps,
  'value' | 'onChange' | 'error'
> & {
  control: Control<T>;
  name: FieldPath<T>;
  /** Override the RHF field error (defaults to the field's own validation message). */
  error?: string;
};

/**
 * `DateField` bound to a single react-hook-form string field (`date` / `datetime` / `time` modes).
 * The field's validation message is surfaced automatically.
 *
 * Requires `react-hook-form` (an optional peer dependency).
 */
export function FormDateField<T extends FieldValues>({
  control,
  name,
  error,
  id,
  ...rest
}: FormDateFieldProps<T>): ReactElement {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <DateField
          {...rest}
          value={asString(field.value)}
          onChange={field.onChange}
          error={error ?? fieldState.error?.message}
          id={id ?? name}
        />
      )}
    />
  );
}

export type FormDateRangeFieldProps<T extends FieldValues> = Omit<
  RangeProps,
  'value' | 'onChange' | 'error' | 'mode'
> & {
  control: Control<T>;
  /** Form field holding the start, `YYYY-MM-DD` (or `…THH:mm` for `datetime-range`). */
  fromName: FieldPath<T>;
  /** Form field holding the end. */
  toName: FieldPath<T>;
  mode?: RangeMode;
  error?: string;
};

/**
 * `DateField` range bound to two react-hook-form string fields — one popover writes both `from`/`to`,
 * matching how forms model start/end as separate fields (e.g. `dateFrom` / `dateTo`).
 *
 * Requires `react-hook-form` (an optional peer dependency).
 */
export function FormDateRangeField<T extends FieldValues>({
  control,
  fromName,
  toName,
  mode = 'date-range',
  error,
  id,
  ...rest
}: FormDateRangeFieldProps<T>): ReactElement {
  const from = useController({ control, name: fromName });
  const to = useController({ control, name: toName });

  return (
    <DateField
      {...rest}
      mode={mode}
      value={{ from: asString(from.field.value), to: asString(to.field.value) }}
      onChange={(next) => {
        from.field.onChange(next.from);
        to.field.onChange(next.to);
      }}
      error={error ?? from.fieldState.error?.message ?? to.fieldState.error?.message}
      id={id ?? fromName}
    />
  );
}
