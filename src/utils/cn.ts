import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class names.
 *
 * - `clsx` handles conditional class composition.
 * - `twMerge` resolves Tailwind conflicts so later classes win
 *   (e.g. `cn('p-2', 'p-4')` => `p-4`).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
