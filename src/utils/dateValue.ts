/**
 * Conversions between the wire/form string format and JS `Date`.
 *
 * `DateField` (and every `*CalendarField` it dispatches to) stores date/time values
 * as the same local, timezone-naive strings the native inputs emit:
 *   - date:      `YYYY-MM-DD`
 *   - datetime:  `YYYY-MM-DDTHH:mm`   (no `Z`, no offset)
 *   - time:      `HH:mm`
 * Round-trip through these helpers rather than `Date.toISOString()` — the latter is UTC
 * and would shift the calendar day for anyone not on UTC.
 */

const pad = (n: number): string => String(n).padStart(2, '0');

/** Parse a `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm` string into a local `Date`. */
export function toDate(value: string | undefined | null): Date | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(value);
  if (!match) return undefined;
  const [, year, month, day, hour, minute] = match;
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    hour ? Number(hour) : 0,
    minute ? Number(minute) : 0,
    0,
    0
  );
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** Format a `Date` as `YYYY-MM-DD` in local time. */
export function toDateString(date: Date | undefined): string {
  if (!date) return '';
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Format a `Date`'s clock as `HH:mm` in local time. */
export function toTimeString(date: Date | undefined): string {
  if (!date) return '';
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Format a `Date` as `YYYY-MM-DDTHH:mm` in local time. */
export function toDateTimeString(date: Date | undefined): string {
  if (!date) return '';
  return `${toDateString(date)}T${toTimeString(date)}`;
}

/** Split a `YYYY-MM-DDTHH:mm` value into its date and time halves. */
export function splitDateTime(value: string): { date: string; time: string } {
  if (!value) return { date: '', time: '' };
  const [date = '', rest = ''] = value.split('T');
  return { date, time: rest.slice(0, 5) };
}

/** Join a date + time back into `YYYY-MM-DDTHH:mm`. Empty date → empty string. */
export function joinDateTime(date: string, time: string): string {
  if (!date) return '';
  return `${date}T${time || '00:00'}`;
}
