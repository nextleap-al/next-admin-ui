import type { BaseSyntheticEvent, ReactNode } from 'react';

import { Button } from './Button';
import { Modal } from './Modal';
import { FormBanner } from './FormBanner';

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Called on submit; the wrapper already `preventDefault`s the native event. */
  onSubmit: (e?: BaseSyntheticEvent) => void;
  isSubmitting: boolean;
  /** Top-level (non-field) error — rendered as a `FormBanner` above the fields. */
  error?: string | null;
  submitLabel?: string;
  /** Extra classes for the submit button (e.g. a branded create-action color). */
  submitClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
}

/**
 * A `Modal` wrapping a `<form>` with a standard Cancel/Submit footer and an optional top-level error
 * banner. Drop your fields in as `children`; wire `onSubmit`/`isSubmitting`/`error` to your form state
 * (e.g. react-hook-form). The submit button is the library's primary variant by default — pass
 * `submitClassName` to recolor it (a create/confirm action) or `variant`-style overrides via the class.
 */
export function FormModal({
  isOpen,
  onClose,
  title,
  description,
  onSubmit,
  isSubmitting,
  error,
  submitLabel = 'Save',
  submitClassName = '',
  size = 'md',
  children,
}: FormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description={description} size={size}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
        className="space-y-4"
        noValidate
      >
        {error ? <FormBanner kind="error">{error}</FormBanner> : null}
        {children}
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting} className={submitClassName}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
