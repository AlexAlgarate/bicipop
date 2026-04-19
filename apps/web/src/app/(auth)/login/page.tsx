import { loginAction } from '@/features/auth/actions';
import { AuthFooter } from '@/features/auth/components/AuthFooter';
import { AuthForm } from '@/features/auth/components/AuthForm';

const LoginPage = () => {
  return (
    <div className="min-h-[calc(75vh-64px)] px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Inicia sesión en BiciPop
          </h1>
        </div>
        <AuthForm
          action={loginAction}
          submitText="Iniciar sesión"
          fields={[
            {
              name: 'email',
              label: 'Email',
              type: 'email',
              placeholder: 'Ej: juanperez@email.com',
            },
            {
              name: 'password',
              label: 'Contraseña',
              type: 'password',
              placeholder: 'Mín 8 caracteres, una mayúscula y un número',
            },
          ]}
          footer={
            <AuthFooter
              footerText="¿No tienes una cuenta? "
              href="/register"
              linkText="Regístrate aquí"
            />
          }
        />
      </div>
    </div>
  );
};

export default LoginPage;
