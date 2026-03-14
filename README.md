# DriveSchool Platform - FASES 1, 2 e 3

Fundacao funcional do produto com monorepo, auth completa, RBAC, banco, seed, marketplace e operacao real de aulas/financeiro/compliance.

## Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, React Hook Form, Zod, TanStack Query, base shadcn/ui
- Backend: NestJS, TypeScript, Prisma, PostgreSQL, Redis, BullMQ
- Auth: JWT access token + JWT refresh token
- Infra local: Docker Compose
- Qualidade: ESLint, Prettier, env examples

## Estrutura do monorepo

```txt
apps/
  api/
  web/
packages/
  config/
  types/
  ui/
infrastructure/
  docker-compose.yml
```

## Scripts principais

- instalar dependencias: `npm install`
- backend dev: `npm run dev:api`
- frontend dev: `npm run dev:web`
- build: `npm run build`
- lint: `npm run lint`
- db generate: `npm run db:generate`
- db migrate: `npm run db:migrate`
- db seed: `npm run db:seed`

## Configuracao de ambiente

### API

Copie `apps/api/.env.example` para `apps/api/.env`.

### WEB

Copie `apps/web/.env.example` para `apps/web/.env.local`.

## Subir infraestrutura local

```bash
cd infrastructure
docker compose up -d
```

## Rodar localmente

Em dois terminais:

```bash
npm run dev:api
npm run dev:web
```

- API: http://localhost:4000/api
- WEB: http://localhost:3000

## Prisma (atualizado ate FASE 3)

Schema principal: `apps/api/prisma/schema.prisma`

Entidades principais:

- User
- CandidateProfile
- InstructorProfile
- School
- AuditLog
- StatePolicy
- Booking
- Lesson
- Payment
- Payout
- Dispute
- IncidentReport
- DocumentSubmission

Enums principais:

- UserRole
- UserStatus
- VerificationStatus
- InstructorType
- BookingStatus
- LessonStatus
- PaymentStatus
- PaymentMethod
- PayoutStatus
- DisputeStatus
- IncidentType
- IncidentSeverity
- TransmissionType
- CnhCategory

## Endpoints implementados (FASE 1 -> FASE 3)

### Auth

- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET /auth/me

### Users

- GET /users/me
- GET /users/:id

### Candidates

- GET /candidates/me
- PATCH /candidates/me

### Instructors

- GET /instructors/me
- PATCH /instructors/me

### Marketplace (FASE 2 - backend)

- GET /marketplace/instructors
- GET /marketplace/instructors/:id
- GET /marketplace/instructors/:id/availability
- GET /marketplace/instructors/:id/reviews
- GET /marketplace/instructors/:id/packages

### Instructors me (FASE 2 - backend)

- POST /instructors/me/vehicles
- GET /instructors/me/vehicles
- PATCH /instructors/me/vehicles/:id
- DELETE /instructors/me/vehicles/:id
- POST /instructors/me/availability
- GET /instructors/me/availability
- PATCH /instructors/me/availability/:id
- DELETE /instructors/me/availability/:id
- POST /instructors/me/packages
- GET /instructors/me/packages
- PATCH /instructors/me/packages/:id
- DELETE /instructors/me/packages/:id
- GET /instructors/me/bookings

### Schools

- GET /schools/my-school
- PATCH /schools/my-school

### Compliance

- GET /state-policies
- GET /state-policies/:stateCode
- POST /compliance/state-policies (ADMIN)
- GET /compliance/state-policies (ADMIN)
- POST /compliance/document-requirements (ADMIN)
- GET /compliance/document-requirements (ADMIN)
- POST /compliance/submissions (CANDIDATE/INSTRUCTOR/SCHOOL_MANAGER)
- GET /compliance/submissions (CANDIDATE/INSTRUCTOR/SCHOOL_MANAGER/ADMIN)
- PATCH /compliance/submissions/:id/review (ADMIN)

### Bookings (operacional)

- POST /bookings
- GET /bookings
- GET /bookings/me
- GET /bookings/:id
- PATCH /bookings/:id/cancel
- PATCH /bookings/:id/reschedule

### Lessons (operacional FASE 3)

- GET /lessons
- GET /lessons/me
- GET /lessons/:id
- PATCH /lessons/:id/check-in
- PATCH /lessons/:id/start
- PATCH /lessons/:id/finish
- PATCH /lessons/:id/no-show
- PATCH /lessons/:id/cancel

### Payments / Payouts

- GET /payments/me
- GET /payments/admin (ADMIN)
- PATCH /payments/:id/status (ADMIN)
- GET /payouts/me
- GET /payouts/admin (ADMIN)
- PATCH /payouts/:id/status (ADMIN)

### Disputes / Incidents

- POST /disputes
- GET /disputes/me
- GET /disputes/admin (ADMIN)
- PATCH /disputes/:id/status (ADMIN)
- POST /incidents
- GET /incidents/me
- GET /incidents/admin (ADMIN)
- PATCH /incidents/:id/status (ADMIN)

### Admin

- GET /admin/users
- GET /admin/instructors
- GET /admin/schools

## Seed (fase 3)

Arquivo: `apps/api/prisma/seed.ts`

Usuarios criados:

- admin@driverschool.local
- candidate@driverschool.local
- instructor@driverschool.local
- manager@driverschool.local

Senha para todos no seed:

- Admin@123456

Dados adicionais no seed:

- 1 autoescola vinculada ao school manager
- state policies para SP e RJ
- bookings em estados confirmado e concluido
- lessons com pin/check-in/conclusao
- payments com fee/currency/metodo
- payout pago de exemplo
- dispute aberta de exemplo
- incident report de no-show
- document submission pendente

## Frontend entregue (FASE 1 -> FASE 3)

Publico:

- landing
- login
- cadastro

Autenticado (por papel):

- dashboard base candidate
- dashboard base instructor
- dashboard base school manager
- dashboard base admin
- perfil candidate
- perfil instructor

Com:

- layout base com navegacao lateral
- protecao de rotas por papel
- persistencia de sessao com token no cliente
- redirecionamento por papel apos login

Novas telas FASE 3:

- /candidate/operations: fluxo operacional do candidato (disputa, incidente, compliance, pagamentos/aulas)
- /instructor/lessons: execucao operacional de aula (check-in, start, finish, no-show, cancel)
- /admin/operations: triagem operacional admin (status de payment/payout/dispute/incident e review documental)

## Fluxo operacional resumido (FASE 3)

1. booking confirmado cria lesson SCHEDULED e payment PENDING
2. instrutor valida PIN em check-in
3. instrutor inicia e finaliza aula
4. ao finalizar aula, booking vira COMPLETED e payment e capturado
5. captura de payment gera payout ON_HOLD
6. admin pode atualizar payout/disputes/incidents/submissions

## Backlog sugerido para FASE 4

1. Integracao real com gateway de pagamento e webhooks
2. SLA de disputa/incidente com automacoes e notificacoes
3. Evidencias de compliance em storage seguro (S3/GCS) e antivirus scan
4. Regras antifraude e score de risco operacional
5. Dashboards analiticos com filtros e exportacao

## Status de validacao

- lint: OK
- build: OK
- migrate + seed: pronto para execucao com scripts
- validacao local executada nesta entrega:
  - `npm run prisma:generate`
  - `npm run build -w @driver-school/api`
  - `npm run lint -w @driver-school/api`
  - `npm run lint -w @driver-school/web`
  - `npm run build -w @driver-school/web`
