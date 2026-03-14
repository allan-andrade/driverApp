'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { CnhCategory, InstructorType } from '@driver-school/types';
import { clientApiRequest } from '@/lib/client-api';

type InstructorMe = {
  id: string;
  instructorType: InstructorType;
  bio: string | null;
  yearsExperience: number | null;
  serviceRadiusKm: number | null;
  basePrice: number | null;
  isActive: boolean;
  categories: CnhCategory[];
  city: string | null;
  state: string | null;
  verificationStatus: string;
  user: {
    email: string;
  };
};

type InstructorPackage = {
  id: string;
  title: string;
  lessonCount: number;
  durationMinutes: number;
  category: CnhCategory;
  price: number;
  usesInstructorVehicle: boolean;
};

const categories: CnhCategory[] = ['A', 'B', 'AB', 'C', 'D', 'E'];

export function InstructorProfileManager() {
  const queryClient = useQueryClient();
  const [selectedCategories, setSelectedCategories] = useState<CnhCategory[]>([]);
  const [packageForm, setPackageForm] = useState({
    title: '',
    lessonCount: 5,
    durationMinutes: 50,
    category: 'B' as CnhCategory,
    price: 450,
    usesInstructorVehicle: true,
  });

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['instructor-me-profile'],
    queryFn: () => clientApiRequest<InstructorMe>('/instructors/me'),
  });

  const { data: packages = [] } = useQuery({
    queryKey: ['instructor-me-packages'],
    queryFn: () => clientApiRequest<InstructorPackage[]>('/instructors/me/packages'),
  });

  const upsertMutation = useMutation({
    mutationFn: (payload: Partial<InstructorMe> & { categories: CnhCategory[]; instructorType: InstructorType }) =>
      clientApiRequest('/instructors/me', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['instructor-me-profile'] });
    },
  });

  const createPackageMutation = useMutation({
    mutationFn: () =>
      clientApiRequest('/instructors/me/packages', {
        method: 'POST',
        body: JSON.stringify({
          ...packageForm,
          lessonCount: Number(packageForm.lessonCount),
          durationMinutes: Number(packageForm.durationMinutes),
          price: Number(packageForm.price),
        }),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['instructor-me-packages'] });
      setPackageForm({
        title: '',
        lessonCount: 5,
        durationMinutes: 50,
        category: 'B',
        price: 450,
        usesInstructorVehicle: true,
      });
    },
  });

  const deletePackageMutation = useMutation({
    mutationFn: (id: string) =>
      clientApiRequest(`/instructors/me/packages/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['instructor-me-packages'] });
    },
  });

  if (isLoading) {
    return <div className="panel text-sm text-slate-500">Carregando perfil...</div>;
  }

  if (isError || !profile) {
    return <div className="panel text-sm text-red-600">Nao foi possivel carregar o perfil do instrutor.</div>;
  }

  const currentCategories = selectedCategories.length > 0 ? selectedCategories : profile.categories;

  return (
    <div className="space-y-6">
      <article className="panel">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Dados principais</h2>
            <p className="text-sm text-slate-500">Conta: {profile.user.email}</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {profile.verificationStatus}
          </span>
        </div>

        <form
          className="mt-4 grid gap-3 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            upsertMutation.mutate({
              instructorType: String(form.get('instructorType')) as InstructorType,
              bio: String(form.get('bio') || ''),
              yearsExperience: Number(form.get('yearsExperience') || 0),
              serviceRadiusKm: Number(form.get('serviceRadiusKm') || 0),
              basePrice: Number(form.get('basePrice') || 0),
              city: String(form.get('city') || ''),
              state: String(form.get('state') || ''),
              isActive: String(form.get('isActive')) === 'on',
              categories: currentCategories,
            });
          }}
        >
          <label className="space-y-1 text-sm">
            <span>Tipo</span>
            <select name="instructorType" defaultValue={profile.instructorType} className="w-full rounded-xl border px-3 py-2">
              <option value="AUTONOMO">Autonomo</option>
              <option value="SCHOOL_LINKED">Vinculado a autoescola</option>
            </select>
          </label>

          <label className="space-y-1 text-sm md:col-span-2">
            <span>Bio</span>
            <textarea name="bio" defaultValue={profile.bio ?? ''} className="h-24 w-full rounded-xl border px-3 py-2" />
          </label>

          <label className="space-y-1 text-sm">
            <span>Anos de experiencia</span>
            <input name="yearsExperience" type="number" min={0} defaultValue={profile.yearsExperience ?? 0} className="w-full rounded-xl border px-3 py-2" />
          </label>

          <label className="space-y-1 text-sm">
            <span>Raio de atendimento (km)</span>
            <input name="serviceRadiusKm" type="number" min={1} defaultValue={profile.serviceRadiusKm ?? 20} className="w-full rounded-xl border px-3 py-2" />
          </label>

          <label className="space-y-1 text-sm">
            <span>Preco base (R$)</span>
            <input name="basePrice" type="number" min={1} step="0.01" defaultValue={profile.basePrice ?? 120} className="w-full rounded-xl border px-3 py-2" />
          </label>

          <label className="space-y-1 text-sm">
            <span>Cidade</span>
            <input name="city" defaultValue={profile.city ?? ''} className="w-full rounded-xl border px-3 py-2" />
          </label>

          <label className="space-y-1 text-sm">
            <span>Estado</span>
            <input name="state" defaultValue={profile.state ?? ''} className="w-full rounded-xl border px-3 py-2" />
          </label>

          <label className="mt-5 flex items-center gap-2 text-sm">
            <input name="isActive" type="checkbox" defaultChecked={profile.isActive} />
            <span>Perfil ativo para marketplace</span>
          </label>

          <div className="md:col-span-2">
            <p className="mb-2 text-sm font-medium">Categorias atendidas</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isChecked = currentCategories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setSelectedCategories((previous) => {
                        const base = previous.length > 0 ? previous : profile.categories;
                        return base.includes(category)
                          ? base.filter((item) => item !== category)
                          : [...base, category];
                      });
                    }}
                    className={`rounded-full px-3 py-1 text-sm ${isChecked ? 'bg-ink text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white md:col-span-2">
            {upsertMutation.isPending ? 'Salvando...' : 'Salvar perfil'}
          </button>
        </form>
      </article>

      <article className="panel">
        <h3 className="text-lg font-semibold">Pacotes de aulas</h3>
        <form
          className="mt-4 grid gap-3 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            createPackageMutation.mutate();
          }}
        >
          <label className="space-y-1 text-sm md:col-span-2">
            <span>Titulo</span>
            <input
              value={packageForm.title}
              onChange={(event) => setPackageForm((previous) => ({ ...previous, title: event.target.value }))}
              className="w-full rounded-xl border px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Quantidade de aulas</span>
            <input
              type="number"
              min={1}
              value={packageForm.lessonCount}
              onChange={(event) => setPackageForm((previous) => ({ ...previous, lessonCount: Number(event.target.value) }))}
              className="w-full rounded-xl border px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Duracao por aula (min)</span>
            <input
              type="number"
              min={30}
              value={packageForm.durationMinutes}
              onChange={(event) => setPackageForm((previous) => ({ ...previous, durationMinutes: Number(event.target.value) }))}
              className="w-full rounded-xl border px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Categoria</span>
            <select
              value={packageForm.category}
              onChange={(event) => setPackageForm((previous) => ({ ...previous, category: event.target.value as CnhCategory }))}
              className="w-full rounded-xl border px-3 py-2"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span>Preco (R$)</span>
            <input
              type="number"
              min={1}
              step="0.01"
              value={packageForm.price}
              onChange={(event) => setPackageForm((previous) => ({ ...previous, price: Number(event.target.value) }))}
              className="w-full rounded-xl border px-3 py-2"
            />
          </label>

          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input
              type="checkbox"
              checked={packageForm.usesInstructorVehicle}
              onChange={(event) =>
                setPackageForm((previous) => ({ ...previous, usesInstructorVehicle: event.target.checked }))
              }
            />
            <span>Usa veiculo do instrutor</span>
          </label>

          <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white md:col-span-2">
            {createPackageMutation.isPending ? 'Criando pacote...' : 'Adicionar pacote'}
          </button>
        </form>

        <div className="mt-4 space-y-2">
          {packages.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-slate-500">
                  {item.lessonCount} aulas • {item.durationMinutes} min • Categoria {item.category}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">R$ {Number(item.price).toFixed(2)}</p>
                <button
                  type="button"
                  onClick={() => deletePackageMutation.mutate(item.id)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
          {packages.length === 0 && <p className="text-sm text-slate-500">Nenhum pacote criado ainda.</p>}
        </div>
      </article>
    </div>
  );
}
