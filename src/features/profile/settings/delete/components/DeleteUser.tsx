'use client';

import { useState } from 'react';

import { deleteUserAction } from '@/features/profile/settings/delete/actions';

export const DeleteUserButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await deleteUserAction();
    } catch (error) {
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        return;
      }

      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) setShowConfirm(false);
  };
  if (showConfirm) {
    return (
      <div className="p-6 bg-destructive/10 border border-destructive rounded-lg">
        <h3 className="text-lg font-semibold text-destructive mb-2">
          Confirm account deletion
        </h3>

        <p className="text-sm text-muted-foreground mb-4">
          This action is permanent. All your data will be deleted and your account cannot
          be recovered.
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="btn bg-destructive hover:bg-destructive/90 text-white"
          >
            {isLoading ? 'Deleting...' : 'Yes, delete my account'}
          </button>

          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="btn bg-destructive hover:bg-destructive/90 text-white"
    >
      Delete my account
    </button>
  );
};
