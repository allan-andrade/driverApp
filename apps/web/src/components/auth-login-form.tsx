'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiRequest } from '@/lib/api';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

type LoginResponse = {
  user: { role: 'ADMIN' | 'CANDIDATE' | 'INSTRUCTOR' | 'SCHOOL_MANAGER' };
  tokens: { accessToken: string; refreshToken: string };
};

export function AuthLoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const data = await apiRequest<LoginResponse>('/auth/login', { method: 'POST', body: values });
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);

    if (data.user.role === 'CANDIDATE') router.push('/candidate/dashboard');
    if (data.user.role === 'INSTRUCTOR') router.push('/instructor/dashboard');
    if (data.user.role === 'SCHOOL_MANAGER') router.push('/school/dashboard');
    if (data.user.role === 'ADMIN') router.push('/admin/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="panel mx-auto w-full max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Entrar</h1>
      <div>
        <input placeholder="Email" className="w-full rounded-xl border px-3 py-2" {...register('email')} />
        {errors.email && <p className="mt-1 text-xs text-red-600">Email invalido</p>}
      </div>
      <div>
        <input
          type="password"
          placeholder="Senha"
          className="w-full rounded-xl border px-3 py-2"
          {...register('password')}
        />
        {errors.password && <p className="mt-1 text-xs text-red-600">Senha invalida</p>}
      </div>
      <button disabled={isSubmitting} className="w-full rounded-xl bg-ink px-4 py-2 font-semibold text-white">
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
