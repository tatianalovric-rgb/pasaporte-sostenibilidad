# ESCALA ESG

Aplicación de madurez en reporte de sostenibilidad basada en el **VSME Standard de EFRAG**: seis niveles que llevan a una empresa del Módulo Básico (B1–B11) al Módulo Completo (C1–C9) con su mapeo a los indicadores SFDR que solicitan bancos e inversores.

Fuente normativa: [EFRAG — VSME Standard (PDF)](https://www.efrag.org/sites/default/files/sites/webpublishing/SiteAssets/VSME%20Standard.pdf).

---

## Qué hace

- **Ruta de seis niveles con desbloqueo real.** Cada nivel tiene una puerta de salida; el Nivel 2 avanza en paralelo al Nivel 1 porque depende de nómina y no de facturas.
- **Detección de sector de alto impacto climático** a partir del código NACE declarado en B1 (Secciones A–H y L del Anexo I del Reglamento (CE) 1893/2006), que preactiva el plan de transición de C3.
- **Preguntas filtro** que colapsan bloques completos en lugar de mostrar campos que no aplican.
- **Tres estados por campo:** valor, no aplica con motivo, o pendiente. Los «no aplica» alimentan el registro de omisiones que se declara en B1.
- **Bloqueo de coherencia:** los objetivos de reducción de C3 no se validan sin el inventario del Nivel 1 cerrado.
- **Informe VSME** exportable en Markdown, con registro de omisiones y la tabla de correspondencias SFDR del Apéndice C.
- **Método y requisitos:** tabla técnica por nivel, patrones de recolección progresiva y anti-patrones, dentro de la propia app.

---

## Requisitos

- Node.js 20 o superior
- npm

---

## Arrancar en local

```bash
npm install
npm run dev          # http://localhost:5000
```

Sin configuración adicional la app crea una base SQLite `data.db` en la raíz del proyecto. Es suficiente para uso individual y demostraciones.

Otros comandos:

```bash
npm run check        # verificación de tipos (TypeScript)
npm run build        # compila cliente (dist/public) y servidor (dist/index.cjs)
npm start            # sirve la compilación de producción
```

---

## Conectar Supabase (persistencia compartida)

La app conmuta de base automáticamente: si encuentra `SUPABASE_URL` y `SUPABASE_ANON_KEY`, usa Supabase; si no, SQLite. No hay que cambiar ni una línea de código.

1. Crea un proyecto en [supabase.com](https://supabase.com) (el plan gratuito basta).
2. Abre **SQL Editor → New query**, pega el contenido de `supabase/migration.sql`, revísalo y ejecútalo.
3. Copia `.env.example` a `.env` y rellena las dos variables. En **Project Settings → API** encontrarás la URL y las claves.
4. Reinicia: `npm run dev`.

### Sobre las claves

La migración activa Row Level Security sin políticas, de modo que la tabla queda cerrada a cualquier acceso directo desde el navegador. El cliente de Supabase vive solo en `server/`, nunca en `client/`, así que lo correcto es poner la clave `service_role` en `SUPABASE_ANON_KEY` y no exponerla jamás en el frontend. Si prefieres usar la clave `anon`, descomenta la política de prototipo incluida en el archivo de migración, sabiendo que eso abre la tabla a quien tenga URL y clave.

Nunca uses el prefijo `VITE_` en estas variables: eso las incrustaría en el paquete que descarga el navegador.

---

## Aislamiento de datos

El backend identifica a cada usuario por el encabezado `X-Visitor-Id` y filtra todas las consultas por `user_id`. Cada visitante ve únicamente sus propias filas, tanto en SQLite como en Supabase.

Esto **no es autenticación**. Para acceso real con inicio de sesión hay que añadir Supabase Auth o un proveedor equivalente, e introducir la verificación de sesión en `server/routes.ts`. Hasta entonces, no cargues datos reales de un cliente en una instancia accesible desde internet.

---

## Desplegar

### Vercel

El repositorio incluye `vercel.json`. Ten en cuenta que Vercel no ejecuta el servidor Express de este proyecto tal cual: para un despliegue completo hay que mover las rutas de `server/routes.ts` a funciones serverless en `api/` y usar Supabase como base, ya que el sistema de archivos serverless no conserva SQLite.

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Cualquier servidor Node

```bash
npm ci
npm run build
NODE_ENV=production node dist/index.cjs    # escucha en el puerto 5000
```

Configura un proxy inverso con HTTPS delante y define las variables de Supabase en el entorno.

---

## Estructura

```
client/src/
  lib/vsme.ts        catálogo VSME: niveles, divulgaciones, datapoints, mapeo SFDR
  lib/engine.ts      progreso, prerrequisitos, desbloqueos y bloqueos de coherencia
  pages/panel.tsx    ruta de madurez
  pages/nivel.tsx    formulario por nivel, en sesiones cortas
  pages/informe.tsx  informe VSME, omisiones y tabla SFDR
  pages/metodo.tsx   requisitos técnicos y patrones de diseño
  components/shell.tsx  logotipo, tema y estructura general
server/
  routes.ts          API REST: GET, PUT y DELETE /api/entries
  storage.ts         selector de backend y capa SQLite
  supabase-storage.ts capa Supabase
shared/schema.ts     modelo de datos compartido entre cliente y servidor
supabase/migration.sql esquema PostgreSQL
```

---

## Aviso

Herramienta de preparación de información. No sustituye el criterio profesional ni un aseguramiento externo.
