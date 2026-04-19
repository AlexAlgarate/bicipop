import { Button } from '@/components/ui/Button';

interface CreateProductButtonProps {
  isPending: boolean;
}

export const CreateProductButton = ({ isPending }: CreateProductButtonProps) => {
  return (
    <Button
      type="submit"
      className="bg-primary text-white font-semibold rounded-lg disabled:opacity-50 px-4 py-2 hover:bg-primary/90"
      disabled={isPending}
    >
      {isPending ? 'Creando producto...' : 'Crear producto'}
    </Button>
  );
};
