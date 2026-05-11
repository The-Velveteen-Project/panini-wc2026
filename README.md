# Panini WC2026 ⚽

Aplicación web para llevar el control del álbum Panini del **FIFA World Cup 2026**.  
Diseñada para dos usuarios: **Carlos** y **Camila**.

## Stack

- **Next.js 14** (App Router + TypeScript)
- **Supabase** — Auth, Base de datos, Realtime
- **Tailwind CSS** — Diseño mobile-first
- **PWA** — Instalable en móvil

## Configuración

### 1. Clonar e instalar

```bash
cd panini-wc2026
npm install
```

### 2. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto nuevo.
2. En el Dashboard → **SQL Editor**, ejecuta el contenido de `supabase/schema.sql`.
3. En **Authentication → Users**, crea dos usuarios:
   - `carlos@panini.app` / (tu contraseña)
   - `camila@panini.app` / (tu contraseña)

### 3. Variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase  
(Dashboard → **Settings → API**):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 4. Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 5. Build para producción

```bash
npm run build
npm start
```

## Funcionalidades

| Feature | Descripción |
|---------|-------------|
| 🔐 Auth | Login con email/password via Supabase |
| 📗 Álbum | Vista de todas las láminas por sección |
| ✓/✓✓/✗ | Tap para ciclar: falta → tengo → repetida |
| 🔄 Intercambios | Qué láminas puedo dar / recibir |
| 📊 Progreso | Barra de progreso y stats por sección |
| ⚡ Realtime | Sync instantáneo entre los dos usuarios |
| 📱 PWA | Instalable en iOS/Android como app nativa |

## Instalar como PWA

**iOS:** Safari → Compartir → "Añadir a pantalla de inicio"  
**Android:** Chrome → Menú → "Instalar aplicación"

## Agregar el catálogo real

Cuando tengas el catálogo completo del álbum, reemplaza los  
datos de ejemplo en `supabase/schema.sql` (sección "Sample Data")  
con todos los equipos y jugadores reales, y ejecuta el INSERT  
en el SQL Editor de Supabase.

## Estructura del proyecto

```
app/
  (app)/
    album/       # Vista principal del álbum
    exchanges/   # Vista de intercambios
    progress/    # Estadísticas y progreso
  login/         # Página de login
components/
  AlbumClient    # Álbum interactivo con realtime
  StickerCard    # Tarjeta individual de lámina
  ExchangesClient
  ProgressClient
  Navbar
lib/
  supabase/      # Cliente browser + server
  types.ts       # Tipos TypeScript
supabase/
  schema.sql     # Esquema completo de BD + datos de ejemplo
```
