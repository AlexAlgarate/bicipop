import { User } from 'lucide-react';

interface VendorProp {
  username: string;
}

export const SellerCard = ({ username }: VendorProp) => {
  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 border border-gray-300">
          <User className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Vendedor</p>
          <p className="font-bold text-foreground">{username}</p>
        </div>
      </div>
      <button className="text-sm font-semibold text-primary hover:underline">
        Ver perfil
      </button>
    </div>
  );
};
