import { registerAction } from '@/features/auth/actions';
import { AuthFooter } from '@/features/auth/components/AuthFooter';
import { AuthForm } from '@/features/auth/components/AuthForm';

const RegisterPage = () => {
  return (
    <div className="min-h-[calc(75vh-64px)] px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Register on the platform</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Join BiciPop and post your first bike
          </p>
        </div>
        <AuthForm
          action={registerAction}
          submitText="Registrarse"
          fields={[
            {
              name: 'username',
              label: 'Name',
              placeholder: 'Enter your name',
              type: 'text',
            },
            {
              name: 'email',
              label: 'Email',
              type: 'email',
              placeholder: 'Enter your email',
            },
            {
              name: 'password',
              label: 'Enter your password',
              type: 'password',
              placeholder: 'Enter your password',
            },
            {
              name: 'confirmPassword',
              label: 'Confirm your password',
              type: 'password',
              placeholder: 'Confirm your password',
              showPasswordRules: true,
            },
          ]}
          footer={
            <AuthFooter
              footerText="Do you have an account? "
              href="/login"
              linkText="Log in"
            />
          }
        />
      </div>
    </div>
  );
};

export default RegisterPage;
