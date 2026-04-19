import { DeleteUserButton } from '@/features/auth/components/DeleteUserButton';

const SettingsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-12">Configuración</h1>

      <div className="max-w-md mx-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Seguridad</h2>
            <DeleteUserButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
