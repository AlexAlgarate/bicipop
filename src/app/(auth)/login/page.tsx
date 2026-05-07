import type { Metadata } from 'next';

import { loginAction } from '@/features/auth/actions';
import { AuthFooter } from '@/features/auth/components/AuthFooter';
import { AuthForm } from '@/features/auth/components/AuthForm';
import { routes } from '@/config/routes';

export const metadata: Metadata = {
  title: 'Login — BiciPop',
  description: 'Log in to your BiciPop account',
};

const LoginPage = () => {
  return (
    <div className="min-h-[calc(75vh-64px)] px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Log in to BiciPop</h1>
        </div>
        <AuthForm
          action={loginAction}
          submitText="Iniciar sesión"
          redirectTo="/"
          fields={[
            {
              name: 'email',
              label: 'Email',
              type: 'email',
              placeholder: 'Enter your email',
            },
            {
              name: 'password',
              label: 'Password',
              type: 'password',
              placeholder: 'Enter your password',
            },
          ]}
          footer={
            <AuthFooter
              footerText="Don't you have an account? "
              href={routes.auth.register}
              linkText="Signup here"
            />
          }
        />
      </div>
    </div>
  );
};

export default LoginPage;
