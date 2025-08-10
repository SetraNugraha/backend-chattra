## Tech Stack

**Frontend:** NextJS, Typescript, TailwindCSS, Shadcn

**Backend:** NestJS, Typescript, Prisma, PostgreSQL

## Run Locally

Clone the project

```bash
  git clone https://github.com/SetraNugraha/backend-chattra
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Environtment

```bash
  copy .env.example to .env, set the value as needed
```

### Setup DB/Prisma

Generate Prisma (Make sure you have alredy create a database on Postgesql)

```bash
  npx prisma generate
```

Create Table on PostgreSQL

```bash
  npx prisma db push
```

### Run project

```bash
  npm run start:dev
```

## 🔗 Frontend Repository

https://github.com/SetraNugraha/frontend-chattra
