import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-start justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">SaaS Multi-tenant - Fundação Inicial</h1>
      <p className="text-zinc-600">Frontend Next.js + Tailwind + shadcn/ui pronto para expansão.</p>
      <Button>Ambiente inicial pronto</Button>
    </main>
  );
}
