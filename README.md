# 🌐 Frontend Web — SOA

Interfaz web construida con **Next.js 16 + React 19 + TypeScript** que consume el API Gateway para mostrar datos de 3 servicios externos.

## Páginas

| Ruta         | Descripción                                       |
| ------------ | ------------------------------------------------- |
| `/`          | Landing page con acceso a los 3 servicios         |
| `/images`    | Generador de imágenes con inteligencia artificial |
| `/asteroids` | Explorador de asteroides cercanos a la Tierra     |
| `/stocks`    | Consulta de precios del mercado bursátil          |

## Requisitos

- Node.js 20+
- El servicio **API Gateway** corriendo en el puerto 3001

## Configuración

Crear archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Ejecución local

```bash
npm install
npm run dev      # Desarrollo en http://localhost:3000
```

## Ejecución con Docker

Este servicio se levanta junto con los demás desde el `docker-compose.yml` del repo **infra**. Ver instrucciones en ese repositorio.

## Estructura

```
src/
├── app/                  # Pages (orquestadores delgados)
│   ├── page.tsx          # Landing page
│   ├── images/           # Generador de imágenes IA
│   ├── asteroids/        # Asteroides NASA
│   └── stocks/           # Mercado de valores
├── components/           # Componentes presentacionales
│   ├── ImageGeneratorView.tsx
│   ├── AsteroidsView.tsx
│   ├── StocksView.tsx
│   ├── Navbar.tsx
│   ├── LoadingState.tsx
│   └── ErrorState.tsx
├── hooks/                # Hooks personalizados
│   └── useApi.ts         # Hook genérico para llamadas API
├── services/             # Cliente HTTP (Axios)
│   └── api.ts
└── types/                # Interfaces TypeScript
    ├── stocks.types.ts
    ├── asteroids.types.ts
    └── images.types.ts
```

## Tecnologías

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Recharts · Lucide React · Axios

## Repositorios relacionados

| Repo                                                                 | Descripción                      |
| -------------------------------------------------------------------- | -------------------------------- |
| [awos-act6-c2-api](https://github.com/ArturoYJ/awos-act6-c2-api)     | API Gateway Express + TypeScript |
| [awos-act6-c2-infra](https://github.com/ArturoYJ/awos-act6-c2-infra) | Infraestructura + Docker Compose |
