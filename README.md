# Final Project API (Phase 2)

REST API for a simple e-commerce backend built with Node.js, Express, PostgreSQL, and Prisma.

## Features

- JWT authentication (`signup`, `login`)
- Role-based authorization (`ADMIN` for product management)
- Ownership-based authorization (orders/reviews)
- Full CRUD for Products, Orders, Reviews
- OpenAPI Swagger docs at `/api-docs`
- Seed script with known credentials for grading

## Tech Stack

- Node.js + Express
- PostgreSQL
- Prisma ORM
- bcrypt + jsonwebtoken
- Zod validation
- Swagger UI

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

3. Update `DATABASE_URL` in `.env` for your local PostgreSQL database.

4. Create DB schema + generate client:

```bash
npm run prisma:migrate -- --name init
npm run prisma:generate
```

5. Seed sample data:

```bash
npm run prisma:seed
```

6. Run locally:

```bash
npm run dev
```

## Known Seed Credentials

- Admin: `admin@example.com` / `Password123!`
- User (owner): `user@example.com` / `Password123!`
- User (not owner): `not-owner@example.com` / `Password123!`

## API URLs

- API base: `http://localhost:3000/api`
- Swagger docs: `http://localhost:3000/api-docs`
- Health: `GET /api/health`

## Render Deployment

Set these environment variables in Render:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PORT`

Use this build command:

```bash
npm run render-build
```

Use this start command:

```bash
npm run start
```

