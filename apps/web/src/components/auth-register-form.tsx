'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiRequest } from '@/lib/api';

const schema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
  role: z.enum(['CANDIDATE', 'INSTRUCTOR', 'SCHOOL_MANAGER']),
});

type FormValues = z.infer<typeof schema>;

export function AuthRegisterForm() {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'CANDIDATE' },
  });

  const onSubmit = async (values: FormValues) => {
    await apiRequest('/auth/register', { method: 'POST', body: values });
    router.push('/login');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="panel mx-auto w-full max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Criar conta</h1>
      <input placeholder="Email" className="w-full rounded-xl border px-3 py-2" {...register('email')} />
      <input placeholder="Telefone" className="w-full rounded-xl border px-3 py-2" {...register('phone')} />
      <input
        type="password"
        placeholder="Senha"
        className="w-full rounded-xl border px-3 py-2"
        {...register('password')}
      />
      <select className="w-full rounded-xl border px-3 py-2" {...register('role')}>
        <option value="CANDIDATE">Candidato</option>
        <option value="INSTRUCTOR">Instrutor</option>
        <option value="SCHOOL_MANAGER">Gestor de Autoescola</option>
      </select>
      <button
        disabled={formState.isSubmitting}
        className="w-full rounded-xl bg-ink px-4 py-2 font-semibold text-white"
      >
        {formState.isSubmitting ? 'Criando...' : 'Criar conta'}
      </button>
      <p className="text-sm text-slate-500">
        Ja possui conta? <Link href="/login" className="text-accent">Entrar</Link>
      </p>
    </form>
  );
}
