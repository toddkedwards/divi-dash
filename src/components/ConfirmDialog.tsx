import React, { useEffect, useRef, memo } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  open,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Trap focus
  useEffect(() => {
    if (!open) return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Tab' && focusable && focusable.length > 1) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40" onClick={onCancel}>
      <div
        ref={dialogRef}
        className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-xl p-6 w-full max-w-xs mx-4 flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
      >
        <div className="text-lg font-bold text-gray-900 dark:text-gray-100" id="confirm-dialog-title">{title}</div>
        <div className="text-gray-700 dark:text-gray-300 text-sm" id="confirm-dialog-desc">{description}</div>
        <div className="flex gap-2 mt-2 justify-end">
          <button
            className="px-4 py-2 rounded bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-zinc-600 font-semibold"
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold"
            onClick={onConfirm}
            type="button"
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ConfirmDialog); 