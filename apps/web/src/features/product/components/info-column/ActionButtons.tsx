import { getSession } from '@/lib/auth';
import { DeleteAdButton } from './DeleteProductButton';
import { EditAdButton } from './EditProductButton';
import { Button } from '@/components/ui/Button';
import { ContactSellerButton } from './ContactSellerButton';

interface Props {
  adId: string;
  ownerId: string;
}

export const AdManagementPanel = async ({ adId, ownerId }: Props) => {
  const session = await getSession();

  const isOwner = session?.userId === ownerId;

  if (!session) return null;

  if (!isOwner) {
    return (
      <div className="p-6 flex flex-col gap-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 text-center">
          Contacta con el vendedor o Compra tu nueva bici
        </h4>
        <div className="flex gap-2">
          <ContactSellerButton />
          <Button
            className="
              flex-1 flex items-center justify-center gap-2 
            text-white bg-primary hover:bg-primary/60 hover:text-white
              dark:hover:bg-primary/80 dark:hover:text-white
              font-medium py-2.5 rounded-lg
            "
          >
            {' '}
            COMPRAR
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          * Al contactar aceptas nuestras condiciones de uso y privacidad.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-3">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 text-center">
        Administrar Anuncio
      </h4>
      <div className="flex gap-3">
        <EditAdButton />
        <DeleteAdButton adId={adId} />
      </div>
    </div>
  );
};
