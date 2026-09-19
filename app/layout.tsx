import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GamingOS | AI Operational Intelligence for iGaming',
  description: 'Sistema operativo impulsado por IA para operadores de iGaming. Gestiona riesgo, tesorería, compliance y analítica sin custodiar fondos.',
  keywords: 'iGaming, AI, risk management, treasury, compliance, casino software, operational intelligence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}