import { registerAction } from '@/features/auth/actions';
import { AuthFooter } from '@/features/auth/components/AuthFooter';
import { AuthForm } from '@/features/auth/components/AuthForm';

const RegisterPage = () => {
  return (
    <div className="min-h-[calc(75vh-64px)] px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Regístrate en la plataforma
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Únete a BiciPop y publica tu primera bici
          </p>
        </div>
        <AuthForm
          action={registerAction}
          submitText="Registrarse"
          fields={[
            {
              name: 'username',
              label: 'Nombre de usuario',
              placeholder: 'Ej: Juanperez23',
              type: 'text',
            },
            {
              name: 'email',
              label: 'Email',
              type: 'email',
              placeholder: 'Ej: juanperez@email.com',
            },
            {
              name: 'location',
              label: 'Localidad',
              placeholder: 'Ej: Guadalajara',
            },
            {
              name: 'password',
              label: 'Introduce tu contraseña',
              type: 'password',
              placeholder: 'Mín 8 caracteres, una mayúscula y un número',
              showPasswordRules: true,
            },
          ]}
          footer={
            <AuthFooter
              footerText="¿Ya tienes una cuenta? "
              href="/login"
              linkText="Inicia sesión"
            />
          }
        />
      </div>
    </div>
  );
};

export default RegisterPage;
