# BiciPop

Plataforma de compra y venta de bicicletas construida con Next.js

## Despliegue

La aplicación está desplegada en un servidor EC2 de AWS y puede visitarse en:

🔗 **https://bicipop.duckdns.org**

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS 4
- **Backend:** Next.js Server Actions, Prisma
- **Database:** PostgreSQL
- **Auth:** JWT (jose), bcryptjs
- **Storage:** Supabase
- **Validation:** Zod

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL
- pnpm

### Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# Generar cliente de Prisma
pnpm prisma:generate

# Ejecutar migraciones
pnpm prisma:migrate

# (Opcional) Semillar la base de datos
pnpm prisma:seed

# Iniciar servidor de desarrollo
pnpm dev
```

El proyecto estará disponible en `http://localhost:3000`.

## Scripts

| Comando              | Descripción            |
| -------------------- | ---------------------- |
| `pnpm dev`           | Servidor de desarrollo |
| `pnpm build`         | Build de producción    |
| `pnpm start`         | Servidor de producción |
| `pnpm lint`          | Linting con ESLint     |
| `pnpm prisma:studio` | GUI de Prisma          |
| `pnpm prisma:reset`  | Resetear base de datos |

## Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/          # Rutas de autenticación
│   ├── (items)/        # Rutas de productos
│   ├── (public)/      # Páginas públicas
│   ├── profile/       # Panel de usuario
│   ├── messages/      # Sistema de mensajes
│   └── search/       # Búsqueda
├── components/           # Componentes React
│   ├── layout/        # Layout (Navbar, Sidebar, Footer)
│   └── ui/           # Componentes UI reutilizables
├── domain/            # Capa de dominio
│   ├── products/
│   ├── user/
│   ├── category/
│   └── message/
├── features/          # Funcionalidades
│   ├── auth/
│   ├── items/
│   ├── messages/
│   └── profile/
├── generated/          # Código generado (Prisma)
├── infrastructure/     # Infraestructura
│   ├── auth/
│   └── db/
└── utils/             # Utilidades
```

## Funcionalidades

- [x] Registro e inicio de sesión
- [x] Gestión de productos (CRUD)
- [x] Categorías de productos
- [x] Sistema de favoritos
- [x] Sistema de mensajería
- [x] Perfil de usuario
- [x] Dashboard de ventas
- [x] Búsqueda de productos

## Seguridad

- Cookies httpOnly y secure
- Verificación de sesión en Server Actions
- Validación de esquemas con Zod
- Password hashing con bcrypt

## Licencia

MIT
