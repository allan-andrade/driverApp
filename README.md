# DriveSchool Market MVP - Monorepo

Plataforma marketplace para formacao de condutores no Brasil, conectando candidatos a CNH, instrutores autonomos e autoescolas.

## Stack

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS, React Hook Form, Zod, TanStack Query, base shadcn/ui
- Backend: NestJS, TypeScript, Prisma, PostgreSQL, Redis, BullMQ
- Auth: JWT access + refresh token, RBAC por papel
- Infra local: Docker Compose para PostgreSQL e Redis

## Estrutura do Projeto

```txt
apps/
	api/            # NestJS modular monolith + Prisma
	web/            # Next.js App Router
packages/
	config/         # shared config placeholder
	types/          # tipos compartilhados
	ui/             # componentes compartilhados base
infrastructure/
	docker-compose.yml
```

## Modulos Backend Implementados

- auth: register, login, refresh, logout, session
- users: listagem admin
- candidates: perfil candidato
- instructors: perfil instrutor + busca publica com filtros + ranking simples
- schools: perfil autoescola + vinculo de instrutores
- vehicles: cadastro/listagem
- availability: slots de agenda
- packages: pacote de aulas
- bookings: reserva, cancelamento, remarcacao, detalhe
- lessons: check-in por PIN, iniciar/finalizar aula
- reviews: avaliacao estruturada por criterio
- compliance: state policies + document requirements
- audit: trilha de auditoria
- dashboard: candidato, instrutor, escola, admin
- payments: base/stub para integracao futura com split
- queue: base BullMQ com worker stub

## Modelagem Prisma

Schema criado em `apps/api/prisma/schema.prisma` com entidades:

- User
- CandidateProfile
- InstructorProfile
- School
- InstructorSchoolLink
- Vehicle
- AvailabilitySlot
- Package
- Booking
- Lesson
- Review
- StatePolicy
- DocumentRequirement
- AuditLog
- Payment

Com enums para roles, status, tipo de instrutor, transmissao, categorias CNH, status de reserva/aula/pagamento, etc.

## Seed Inicial

Seed implementado em `apps/api/prisma/seed.ts` com:

- 1 admin
- 3 instrutores
- 1 autoescola + 1 gestor
- 3 candidatos
- veiculos
- slots de disponibilidade
- reservas + aulas
- avaliacao
- state policies (SP, RJ)
- document requirements
- audit log inicial

Credencial de seed para todos os usuarios:

- senha: `12345678`

## Frontend Implementado

### Publico

- landing page
- listagem de instrutores
- detalhe do instrutor

### Auth

- login
- cadastro com selecao de papel

### Candidato

- dashboard
- perfil
- reservas
- detalhe de reserva
- busca

### Instrutor

- dashboard
- perfil
- veiculos
- agenda
- reservas

### Autoescola

- dashboard
- perfil
- instrutores vinculados
- reservas

### Admin

- dashboard
- usuarios
- instrutores
- autoescolas
- state policies

## Execucao Local

### 1) Dependencias

```bash
npm install
```

### 2) Infra local (opcional se ja tiver Postgres/Redis locais)

```bash
cd infrastructure
docker compose up -d
```

### 3) Variaveis de ambiente

```bash
copy apps\api\.env.example apps\api\.env
copy apps\web\.env.example apps\web\.env.local
```

### 4) Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5) Rodar API e Web

Em terminais separados:

```bash
npm run dev:api
npm run dev:web
```

API: `http://localhost:4000/api`
Web: `http://localhost:3000`

## Validacoes Executadas Nesta Entrega

- Prisma generate: OK
- Prisma migrate dev + seed: OK
- Lint workspaces: OK
- Build (api + web): OK

## O que ja esta funcional

- Fundacao monorepo pronta para evolucao
- Arquitetura modular monolito no backend
- RBAC com guard global + decorator de roles
- Fluxos principais de marketplace (descoberta, reservas, aula, avaliacao)
- Dashboards por papel
- Fundacao compliance, auditoria, fila e pagamentos

## Backlog Recomendado - Proxima Fase

1. Middleware de autenticacao no frontend para proteger rotas por papel.
2. Formularios completos de CRUD (nao apenas paines de leitura JSON).
3. Pagamentos reais (Stripe/Pagar.me/Asaas) com split e webhooks.
4. Matching score avancado (distancia, no-show risk, conversao, SLA).
5. Calendario visual com disponibilidade real e bloqueio transacional de slots.
6. Trilhas de auditoria automatica por evento de dominio.
7. Upload/verificacao documental com storage e workflow de aprovacao.
8. Cobertura de testes (unitarios, integracao e e2e).
9. Observabilidade (logs estruturados, tracing e metricas).
10. Regras regulatorias por estado com engine configuravel.
