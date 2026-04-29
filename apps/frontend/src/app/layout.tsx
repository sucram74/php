import './globals.css';

export const metadata = {
  title: 'Promo SaaS',
  description: 'Fundação SaaS multi-tenant para campanhas e sorteios'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
