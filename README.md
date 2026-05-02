# Promo SaaS MVP

## Login de teste
- Email: `admin@demo.com`
- Senha: `admin123`

## Subir projeto
```bash
npm install
npm --workspace @apps/backend run prisma:generate
npm --workspace @apps/backend run prisma:migrate
npm --workspace @apps/backend run prisma:seed
docker compose up --build
```

## URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Módulos implementados
- Auth (`POST /api/auth/login`)
- Consumers
- Campaigns
- Purchases (com geração automática de cupons)
- Coupons

## Fluxo de teste
1. Fazer login com admin demo.
2. Criar campanha com valor mínimo por cupom.
3. Lançar compra informando CPF, nome, telefone, campanha e valor.
4. Verificar cupons gerados na listagem de cupons.

## Pix (MVP) e integração futura
- O fluxo atual de Pix é manual (MVP), sem confirmação automática bancária.
- A confirmação automática será implementada futuramente com integração PSP/banco.
- Provedores possíveis: Gerencianet/Efi, Mercado Pago, Asaas, Banco do Brasil e cooperativas com API (Sicoob/Sicredi/Cresol).

## QA E2E mínimo (v0.1.8)

Pré-requisitos:
- Dependências instaladas no monorepo.
- Navegadores do Playwright instalados localmente.
- Backend e frontend buildados.

Comandos:
```bash
npm install
npx playwright install
npm --workspace @apps/frontend run test:e2e
```

Observações:
- O teste E2E está em `apps/frontend/tests/e2e/qa-v018.spec.ts`.
- O setup do Playwright está em `apps/frontend/playwright.config.ts`.
- As credenciais demo usadas pelo E2E são:
  - admin: `admin@demo.com` / `admin123`
  - loja: `store@demo.com` / `store123`
- Essas credenciais são criadas apenas pelo seed de desenvolvimento (`apps/backend/prisma/seed.ts`).
- Em ambiente sem Playwright instalado, o build do frontend não quebra porque arquivos de E2E estão fora do typecheck do Next (`apps/frontend/tsconfig.json`).
