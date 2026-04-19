'use client';

import { useState } from 'react';
import { deleteUserAccount } from '../actions';
import { Button } from '@/components/ui/Button';

export const DeleteUserButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = async () => {
    setIsLoading(true);
    try {
      await deleteUserAccount();
    } catch (error) {
      // NEXT_REDIRECT is a normal error thrown by Next.js for redirects, ignore it
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        return;
      }
      
      console.error('Error deleting user account:', error);
      setIsLoading(false);
      setShowConfirm(false);
      alert('Error: ' + (error instanceof Error ? error.message : 'No se pudo borrar la cuenta'));
    }
  };

  if (showConfirm) {
    return (
      <div className="p-6 bg-destructive/10 border border-destructive rounded-lg">
        <h3 className="text-lg font-semibold text-destructive mb-2">
          Confirmar eliminación de cuenta
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Esta acción es permanente. Se eliminarán todos tus datos y no podrás recuperar
          tu cuenta.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={handleDeleteClick}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            {isLoading ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
          </Button>
          <Button onClick={() => setShowConfirm(false)} disabled={isLoading}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={() => setShowConfirm(true)}
      className="bg-destructive hover:bg-destructive/90 text-white"
    >
      Eliminar mi cuenta
    </Button>
  );
};
