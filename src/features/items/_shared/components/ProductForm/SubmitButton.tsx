import { Loader2 } from 'lucide-react';

const SUBMIT_LABELS = {
  create: { idle: 'Publish Product', pending: 'Publishing...' },
  edit: { idle: 'Update Product', pending: 'Updating...' },
};

interface SubmitButtonProps {
  isPending: boolean;
  mode: 'create' | 'edit';
}

export const SubmitButton = ({ isPending, mode }: SubmitButtonProps) => {
  const labels = SUBMIT_LABELS[mode];

  return (
    <button type="submit" disabled={isPending} className="btn btn-primary w-full py-3">
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {labels.pending}
        </>
      ) : (
        labels.idle
      )}
    </button>
  );
};
