# SaaS Multi-tenant (Campanhas Promocionais e Sorteios)

Fundação inicial de um monorepo SaaS multi-tenant, preparada para expansão.

## Stack

- **Frontend:** Next.js + TypeScript + Tailwind + base shadcn/ui
- **Backend:** NestJS + Prisma + PostgreSQL + JWT
- **Infra:** Docker Compose

## Estrutura

```txt
/apps
  /frontend
  /backend
/packages
  /shared
```

## Multi-tenant (tenant_id)

A estrutura inicial já usa `tenant_id` nas entidades centrais do banco (`User` e `Campaign`) com índices para isolamento lógico por tenant.

## Pré-requisitos

- Docker
- Docker Compose

## Como subir

1. Copie as variáveis de ambiente:

```bash
cp .env.example .env
```

2. Suba todos os serviços:

```bash
docker compose up --build
```

3. Serviços esperados:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api
- PostgreSQL: localhost:5432

## Autenticação JWT (base)

Endpoint inicial:

- `POST /api/auth/login`

Body:

```json
{
  "userId": "user_123",
  "tenantId": "tenant_123"
}
```

Resposta:

```json
{
  "access_token": "<jwt>"
}
```

## Observações

- Não há regras de negócio implementadas nesta fase.
- Projeto focado somente em fundação arquitetural limpa para evolução.
