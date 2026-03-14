# DriveSchool Platform - FASE 1

Fundacao funcional do produto com monorepo, auth completa, RBAC, banco, seed e frontend base por papel.

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

## Prisma FASE 1

Schema principal: `apps/api/prisma/schema.prisma`

Entidades base da fase 1:

- User
- CandidateProfile
- InstructorProfile
- School
- AuditLog
- StatePolicy

Enums base da fase 1:

- UserRole
- UserStatus
- VerificationStatus
- InstructorType
- BookingStatus
- LessonStatus
- TransmissionType
- CnhCategory

## Endpoints implementados na FASE 1

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

### Admin

- GET /admin/users
- GET /admin/instructors
- GET /admin/schools

## Seed inicial

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

## Frontend entregue na FASE 1

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

## Status de validacao

- lint: OK
- build: OK
- migrate + seed: pronto para execucao com scripts
