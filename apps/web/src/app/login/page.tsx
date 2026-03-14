import { AuthLoginForm } from '@/components/auth-login-form';
import { TopNav } from '@/components/top-nav';

export default function LoginPage() {
  return (
    <main>
      <TopNav />
      <section className="shell py-16">
        <AuthLoginForm />
      </section>
    </main>
  );
}
