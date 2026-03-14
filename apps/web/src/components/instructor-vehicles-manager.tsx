'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { CnhCategory, TransmissionType } from '@driver-school/types';
import { clientApiRequest } from '@/lib/client-api';

type Vehicle = {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  transmissionType: TransmissionType;
  categorySupported: CnhCategory;
  verificationStatus: string;
};

export function InstructorVehiclesManager() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    transmissionType: 'MANUAL' as TransmissionType,
    categorySupported: 'B' as CnhCategory,
  });

  const { data: vehicles = [], isLoading, isError } = useQuery({
    queryKey: ['instructor-me-vehicles'],
    queryFn: () => clientApiRequest<Vehicle[]>('/instructors/me/vehicles'),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      clientApiRequest('/instructors/me/vehicles', {
        method: 'POST',
        body: JSON.stringify(form),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['instructor-me-vehicles'] });
      setForm({
        plate: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        transmissionType: 'MANUAL',
        categorySupported: 'B',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (vehicleId: string) =>
      clientApiRequest(`/instructors/me/vehicles/${vehicleId}`, {
        method: 'DELETE',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['instructor-me-vehicles'] });
    },
  });

  return (
    <div className="space-y-4">
      <article className="panel">
        <h2 className="text-lg font-semibold">Cadastrar veiculo</h2>
        <form
          className="mt-4 grid gap-3 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            createMutation.mutate();
          }}
        >
          <input
            placeholder="Placa"
            value={form.plate}
            onChange={(event) => setForm((previous) => ({ ...previous, plate: event.target.value }))}
            className="rounded-xl border px-3 py-2"
          />
          <input
            placeholder="Marca"
            value={form.brand}
            onChange={(event) => setForm((previous) => ({ ...previous, brand: event.target.value }))}
            className="rounded-xl border px-3 py-2"
          />
          <input
            placeholder="Modelo"
            value={form.model}
            onChange={(event) => setForm((previous) => ({ ...previous, model: event.target.value }))}
            className="rounded-xl border px-3 py-2"
          />
          <input
            placeholder="Ano"
            type="number"
            min={1990}
            value={form.year}
            onChange={(event) => setForm((previous) => ({ ...previous, year: Number(event.target.value) }))}
            className="rounded-xl border px-3 py-2"
          />
          <select
            value={form.transmissionType}
            onChange={(event) => setForm((previous) => ({ ...previous, transmissionType: event.target.value as TransmissionType }))}
            className="rounded-xl border px-3 py-2"
          >
            <option value="MANUAL">Manual</option>
            <option value="AUTOMATIC">Automatico</option>
          </select>
          <select
            value={form.categorySupported}
            onChange={(event) => setForm((previous) => ({ ...previous, categorySupported: event.target.value as CnhCategory }))}
            className="rounded-xl border px-3 py-2"
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="AB">AB</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
          </select>
          <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white md:col-span-2">
            {createMutation.isPending ? 'Salvando...' : 'Adicionar veiculo'}
          </button>
        </form>
      </article>

      {isLoading && <div className="panel text-sm text-slate-500">Carregando veiculos...</div>}
      {isError && <div className="panel text-sm text-red-600">Falha ao carregar veiculos.</div>}

      {vehicles.map((vehicle) => (
        <article key={vehicle.id} className="panel">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold">{vehicle.brand} {vehicle.model}</h3>
              <p className="text-sm text-slate-600">{vehicle.plate} • {vehicle.year} • {vehicle.transmissionType}</p>
              <p className="text-sm text-slate-500">Categoria {vehicle.categorySupported} • {vehicle.verificationStatus}</p>
            </div>
            <button
              type="button"
              onClick={() => deleteMutation.mutate(vehicle.id)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
            >
              Remover
            </button>
          </div>
        </article>
      ))}

      {vehicles.length === 0 && !isLoading && <div className="panel text-sm text-slate-500">Nenhum veiculo cadastrado.</div>}
    </div>
  );
}
