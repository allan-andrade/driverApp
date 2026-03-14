import { AuthRegisterForm } from '@/components/auth-register-form';
import { TopNav } from '@/components/top-nav';

export default function RegisterPage() {
  return (
    <main>
      <TopNav />
      <section className="shell py-16">
        <AuthRegisterForm />
      </section>
    </main>
  );
}
