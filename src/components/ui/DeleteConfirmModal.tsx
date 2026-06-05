'use client';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isPending?: boolean;
}

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isPending = false,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 bg-card border border-border rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 border border-border hover:bg-secondary font-medium py-2.5 rounded-lg"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg"
            id="delete-confirm-modal"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};
