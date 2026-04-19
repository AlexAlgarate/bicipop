'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { deleteAdAction } from '../../actions';

interface Props {
  adId: string;
}

export const DeleteAdButton = ({ adId }: Props) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="
        flex-1 flex items-center justify-center gap-2 border
      text-white bg-red-600 hover:bg-red-700 hover:text-white
      dark:border-red-800 dark:hover:bg-red-700 dark:hover:text-white
        font-medium py-2.5 rounded-lg
        "
      >
        <Trash2 className="w-4 h-4" />
        Eliminar
      </Button>

      {showModal && (
        <div className=" fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 shadow-lg"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="relative z-10 bg-card border border-border rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Eliminar anuncio</h2>
            <p className=" text-sm text-muted-foreground mb-6">
              ¿Estás seguro de que quieres eliminar el anuncio? Esta acción no se puede
              deshacer.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowModal(false)}
                className="
                flex-1 flex items-center justify-center gap-2
                border border-gary-200 hover:bg-gray-200 hover:border-gray-400
                text-gay-700 font-medium py-2.5 rounded-lg
              dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800
                "
              >
                Cancelar
              </Button>
              <form action={deleteAdAction} className="flex-1">
                <input type="hidden" name="adId" value={adId} />
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg"
                >
                  Sí, eliminar
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
