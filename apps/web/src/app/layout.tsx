import type { Metadata } from 'next';
import '../app/globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'DriveSchool Market',
  description: 'Marketplace de formacao de condutores com compliance e agendamento',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
