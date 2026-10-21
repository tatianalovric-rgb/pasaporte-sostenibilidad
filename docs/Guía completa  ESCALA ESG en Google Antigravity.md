# Guía completa: llevar ESCALA ESG a Google Antigravity

De cero a la aplicación corriendo en tu máquina, con base de datos persistente y desplegada.
Documento preparado para Tatiana Lovric · 23 de septiembre de 2026

---

## Índice

1. [Qué vas a necesitar](#1-qué-vas-a-necesitar)
2. [Archivos que subes y para qué sirve cada uno](#2-archivos-que-subes-y-para-qué-sirve-cada-uno)
3. [Instalar Antigravity](#3-instalar-antigravity)
4. [Preparar tu máquina](#4-preparar-tu-máquina)
5. [Abrir el proyecto y arrancarlo](#5-abrir-el-proyecto-y-arrancarlo)
6. [Cómo hablarle al agente: los prompts exactos](#6-cómo-hablarle-al-agente-los-prompts-exactos)
7. [Conectar Supabase sin ceder permisos de gestión](#7-conectar-supabase-sin-ceder-permisos-de-gestión)
8. [Desplegar a internet](#8-desplegar-a-internet)
9. [Cuando algo falla](#9-cuando-algo-falla)
10. [Biblioteca de prompts para seguir creciendo](#10-biblioteca-de-prompts-para-seguir-creciendo)
11. [Fuentes](#11-fuentes)

---

## 1. Qué vas a necesitar

| Elemento | Detalle | Coste |
|---|---|---|
| Antigravity IDE | macOS, Windows o Linux | Gratis en el plan individual |
| Cuenta de Google | Una cuenta de Gmail personal basta | Gratis |
| Navegador Chrome | Requisito del entorno | Gratis |
| Node.js 20 o superior | Motor que ejecuta la aplicación | Gratis |
| El archivo `escala-esg-codigo.zip` | Ya te lo entregué en la conversación | — |
| Cuenta de Supabase | Solo si quieres base de datos compartida | Plan gratuito suficiente |

El plan individual de Antigravity cuesta cero y da acceso a Gemini 3.8 Flash, Gemini 3.7 Flash, Gemini 3.6 Flash, Gemini 3.1 Pro, Claude Sonnet y Opus 4.6, y gpt-oss-120b, con completaciones de Tab ilimitadas y límites de uso semanales básicos ([Google Antigravity — Pricing](https://antigravity.google/pricing/)).

---

## 2. Archivos que subes y para qué sirve cada uno

Todo va dentro del ZIP que descargaste. No tienes que subir nada archivo por archivo: descomprimes la carpeta y abres esa carpeta en Antigravity. Esto es lo que contiene y por qué importa.

### Archivos que tú vas a tocar

| Archivo | Para qué sirve | ¿Lo editas tú? |
|---|---|---|
| `README.md` | Manual del proyecto. El agente lo lee para entender qué construyó | No |
| `.env.example` | Plantilla de las dos variables de Supabase | Lo copias a `.env` y rellenas |
| `supabase/migration.sql` | El esquema de la base de datos, comentado línea por línea | Lo pegas en el panel de Supabase |
| `package.json` | Lista de dependencias y comandos disponibles | No |

### El corazón de la lógica ESG

Si más adelante quieres ampliar el contenido normativo, estos son los archivos que importan:

| Archivo | Contenido |
|---|---|
| `client/src/lib/vsme.ts` | El catálogo VSME completo: los seis niveles, las veinte divulgaciones, los ~71 datapoints, el mapeo SFDR del Apéndice C, los requisitos técnicos y los patrones de diseño |
| `client/src/lib/engine.ts` | Las reglas: progreso, prerrequisitos entre niveles, desbloqueos y el bloqueo de coherencia que impide declarar objetivos sin inventario |
| `shared/schema.ts` | El modelo de datos que comparten cliente y servidor |

### Interfaz y servidor

| Carpeta | Contenido |
|---|---|
| `client/src/pages/` | Las cuatro pantallas: ruta de niveles, formulario de nivel, informe VSME y método |
| `client/src/components/shell.tsx` | Logotipo, tema claro/oscuro y estructura general |
| `server/` | La API REST, la capa SQLite y la capa Supabase |

### Lo que NO va en el ZIP, a propósito

`node_modules` (se instala con un comando), `dist` (se genera al compilar), `data.db` (tu base local, se crea sola) y `.env` (nunca se comparte un archivo con claves).

---

## 3. Instalar Antigravity

### Paso 1 — Descargar

Entra en [antigravity.google/download](https://antigravity.google/download) y descarga la versión de tu sistema operativo. Está disponible para macOS, Windows y distribuciones concretas de Linux ([codelab oficial de Google](https://codelabs.developers.google.com/getting-started-google-antigravity)).

### Paso 2 — Ejecutar el instalador

En la pantalla inicial verás dos opciones: **Continue with Google** y **Use business account**.

Elige **Continue with Google** e inicia sesión con tu cuenta de Gmail personal. La opción de cuenta empresarial es para organizaciones con un proyecto de Google Cloud y licencias compradas; no es tu caso ([codelab oficial de Google](https://codelabs.developers.google.com/getting-started-google-antigravity)).

### Paso 3 — Configuración inicial

Eliges un tema, opcionalmente algunos plugins de Google, aceptas los términos y pulsas **Finish**.

### Paso 4 — Entender las dos superficies

Antigravity tiene dos formas de trabajar y conviene que las distingas desde el principio ([Antigravity IDE Overview](https://antigravity.google/docs/ide/overview/)):

**Editor.** El IDE clásico, con autocompletado y edición de archivos. Aquí trabajas tú codo a codo con un agente.

**Agentes.** La modalidad principal. Son agentes locales y asíncronos que operan de forma autónoma en el editor, el terminal y el navegador, y que pueden planificar y ejecutar tareas completas. Puedes lanzar varios en paralelo.

Te resultará útil saber que los agentes producen **artifacts**: entregables estructurados como planes en Markdown, vistas de diferencias de código, diagramas de arquitectura y grabaciones del navegador. Es su manera de rendir cuentas de lo que hicieron, y te sirve para verificar antes de aceptar cambios.

Una advertencia relevante: los agentes pueden ejecutar comandos en el terminal por su cuenta. Revisa lo que proponen antes de aprobarlo, sobre todo si toca archivos de configuración o credenciales.

---

## 4. Preparar tu máquina

### Instalar Node.js

Descarga la versión LTS desde [nodejs.org](https://nodejs.org). Necesitas la 20 o superior.

Para comprobar que quedó bien, abre una terminal y escribe:

```bash
node --version
npm --version
```

Si el primer comando responde algo como `v20.x.x` o mayor, vas bien.

### Descomprimir el proyecto

Coloca la carpeta en un sitio estable y sin acentos ni espacios en la ruta. Por ejemplo:

- **Windows:** `C:\proyectos\escala-esg`
- **macOS o Linux:** `~/proyectos/escala-esg`

Dentro de esa carpeta debes ver `package.json`, `README.md` y las carpetas `client`, `server` y `shared`. Si en cambio ves una sola carpeta llamada `escala-esg`, entra en ella: ese es el nivel correcto.

---

## 5. Abrir el proyecto y arrancarlo

### Paso 1 — Abrir la carpeta

En Antigravity: **File → Open Folder** y seleccionas la carpeta del proyecto.

### Paso 2 — Instalar dependencias

Abre la terminal integrada y ejecuta:

```bash
npm install
```

Tarda uno o dos minutos y descarga unas 290 dependencias. Es normal que muestre avisos; lo que importa es que termine sin la palabra `error`.

### Paso 3 — Arrancar

```bash
npm run dev
```

Abre [http://localhost:5000](http://localhost:5000) en Chrome. Deberías ver la ruta de seis niveles con el Nivel 0 disponible y los demás bloqueados.

### Los comandos que vas a usar siempre

| Comando | Qué hace |
|---|---|
| `npm run dev` | Arranca en modo desarrollo, recarga sola al guardar cambios |
| `npm run check` | Verifica los tipos. Úsalo antes de dar por bueno cualquier cambio |
| `npm run build` | Compila la versión de producción |
| `npm start` | Sirve la versión compilada |

Sin configuración adicional, la aplicación crea un archivo `data.db` en la raíz del proyecto y guarda ahí todo. Funciona de inmediato, sin cuentas ni claves.

---

## 6. Cómo hablarle al agente: los prompts exactos

Aquí está la diferencia entre un agente que te ayuda y uno que te rompe el proyecto. Copia estos textos tal cual.

### Prompt 1 — Que entienda el proyecto antes de tocarlo

Este es el primero que debes enviar, siempre. Sin contexto, el agente reescribe cosas que ya funcionan.

```
Antes de modificar nada, lee estos archivos y hazme un resumen de la
arquitectura: README.md, client/src/lib/vsme.ts, client/src/lib/engine.ts,
shared/schema.ts, server/routes.ts y server/storage.ts.

Contexto: es una app de reporte de sostenibilidad basada en el VSME Standard
de EFRAG. Seis niveles de madurez llevan del Módulo Básico (B1-B11) al Módulo
Completo (C1-C9) con mapeo a indicadores SFDR. Stack: React + Vite en el
cliente, Express en el servidor, y una capa de datos que conmuta entre SQLite
y Supabase según las variables de entorno.

No cambies el sistema de diseño ni la paleta. No toques la lógica de
desbloqueo de niveles sin explicarme antes qué vas a cambiar y por qué.
```

### Prompt 2 — Verificar que todo arranca

```
Ejecuta npm install, luego npm run check y npm run dev. Si algo falla,
diagnostícalo y corrígelo, pero explícame cada corrección antes de aplicarla.
Cuando esté corriendo, abre localhost:5000 con el agente de navegador,
recorre las cuatro pantallas (ruta de niveles, un nivel, informe y método),
y dime si encuentras defectos visuales o errores en la consola.
```

### Prompt 3 — Conectar Supabase

Úsalo después de haber creado tu proyecto en Supabase y aplicado la migración (sección 7).

```
Ya creé un proyecto en Supabase y ejecuté supabase/migration.sql en el
editor SQL. Copia .env.example a .env, ayúdame a rellenar SUPABASE_URL y
SUPABASE_ANON_KEY, y reinicia el servidor.

Después verifica que está usando Supabase y no SQLite: haz una escritura de
prueba con un X-Visitor-Id, comprueba que otro X-Visitor-Id distinto no ve
esos datos, y confirma que la fila aparece en la tabla entries de Supabase.
Borra los datos de prueba al terminar.

No pongas las claves en ningún archivo del cliente ni les añadas el prefijo
VITE_. El cliente de Supabase debe vivir solo en server/.
```

### Reglas de oro al trabajar con el agente

**Una tarea por vez.** Pedir cinco cosas a la vez produce cinco cosas a medias.

**Exige `npm run check` después de cada cambio.** Es la red de seguridad más barata que tienes.

**Usa Git desde el primer día.** El proyecto ya viene con historial iniciado. Pídele al agente: `Haz un commit con un mensaje descriptivo antes de empezar este cambio`. Si algo sale mal, vuelves atrás.

**Revisa los artifacts.** Cuando el agente te presenta un plan o una vista de diferencias, léela. Ahí se detectan los cambios que no pediste.

**Desconfía de los borrados.** Si propone eliminar archivos o dependencias, pregunta por qué antes de aceptar.

---

## 7. Conectar Supabase sin ceder permisos de gestión

Esta ruta existe precisamente para no autorizar una app OAuth con permisos de escritura sobre toda tu cuenta. Tú haces los tres pasos sensibles; nadie más entra.

### Paso 1 — Crear el proyecto

En [supabase.com](https://supabase.com) creas una cuenta y un proyecto nuevo. El plan gratuito sirve. Anota la contraseña de la base de datos que te pide al crearlo.

### Paso 2 — Aplicar el esquema, leyéndolo primero

Abre **SQL Editor → New query**, pega el contenido completo de `supabase/migration.sql`, lee los comentarios y pulsa **Run**.

Ese archivo crea una sola tabla, `entries`, con una restricción de unicidad por `(user_id, key)` y activa Row Level Security sin políticas. No borra ni modifica nada preexistente.

### Paso 3 — Elegir la clave correcta

Esto es lo más importante de toda la sección.

La migración deja la tabla cerrada con Row Level Security y sin políticas, así que la clave `anon` por sí sola no puede leer ni escribir nada. Como el cliente de Supabase vive exclusivamente en el servidor y nunca llega al navegador, lo correcto es usar la clave `service_role`, que ignora RLS.

En **Project Settings → API** encuentras la URL y las claves. Copia `.env.example` a `.env` y rellena:

```
SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_ANON_KEY=<aquí va la clave service_role>
```

El nombre de la variable dice `ANON` por compatibilidad, pero el valor que pones es la `service_role`. La app no la expone nunca al navegador.

Si prefieres usar la clave `anon` de verdad, descomenta la política de prototipo incluida al final de la migración. Sábelo: eso abre la tabla a cualquiera que tenga la URL y la clave. La documentación de Supabase es explícita en que la clave publicable está diseñada para exponerse y su alcance depende enteramente de las políticas de Row Level Security ([API keys — Supabase](https://supabase.com/docs/guides/getting-started/api-keys)).

### Paso 4 — Reiniciar

```bash
npm run dev
```

La aplicación detecta las variables y conmuta a Supabase sola. No hay que cambiar una línea de código.

### Lo que esto todavía no es

El aislamiento por `X-Visitor-Id` separa los datos de cada visitante, pero **no es autenticación**: nadie verifica la identidad de quien envía ese encabezado. Para acceso real con inicio de sesión hay que añadir Supabase Auth y la verificación de sesión en `server/routes.ts`. Hasta entonces, no cargues datos reales de un cliente en una instancia accesible desde internet.

---

## 8. Desplegar a internet

### Opción A — Un servidor Node propio

La más directa y la que respeta la arquitectura actual.

```bash
npm ci
npm run build
NODE_ENV=production node dist/index.cjs
```

Escucha en el puerto 5000. Pon delante un proxy inverso con HTTPS y define las variables de Supabase en el entorno del servidor, no en un archivo subido al repositorio.

### Opción B — Vercel

El proyecto ya incluye `vercel.json`, pero hay una limitación que debes conocer: Vercel no ejecuta este servidor Express tal cual. Para un despliegue serverless completo hay que trasladar las rutas de `server/routes.ts` a funciones en una carpeta `api/` y usar obligatoriamente Supabase, porque el sistema de archivos serverless no conserva SQLite entre invocaciones.

Prompt para que el agente haga esa conversión:

```
Convierte este proyecto para desplegar en Vercel como funciones serverless.
Mueve las rutas de server/routes.ts a funciones en api/, manteniendo el
mismo contrato de la API (GET, PUT y DELETE /api/entries) y el filtrado por
el encabezado X-Visitor-Id. Usa exclusivamente la capa de Supabase, porque
SQLite no persiste en serverless. Actualiza vercel.json y el README. No
cambies nada del cliente salvo lo estrictamente necesario.
```

Después, desde la terminal:

```bash
npm i -g vercel
vercel login
vercel --prod
```

Al autenticarte tú misma con `vercel login` evitas el conector que falló en nuestra sesión.

### Opción C — El agente de Antigravity con la CLI del proveedor

El patrón habitual en Antigravity es que te autentiques tú en la terminal con la CLI del proveedor y luego le pidas al agente que la use para desplegar. Funciona igual con Vercel, Render o Google Cloud.

---

## 9. Cuando algo falla

| Síntoma | Causa probable | Solución |
|---|---|---|
| `npm install` se queda colgado o deja `node_modules` vacío | Instalación interrumpida | `rm -rf node_modules package-lock.json` y repetir en primer plano, sin cerrar la terminal |
| `EADDRINUSE` al arrancar | El puerto 5000 está ocupado | Cierra el proceso anterior, o cambia el puerto en `server/index.ts` |
| La pantalla carga en blanco | Error de JavaScript | Abre las herramientas de desarrollo de Chrome, pestaña Console, y pasa el error al agente |
| Los datos no se guardan | El servidor no responde | Revisa la terminal donde corre `npm run dev`; la app avisa y mantiene la sesión en memoria |
| Errores de tipos tras un cambio del agente | Cambio incompleto | `npm run check` y pásale la salida completa al agente |
| Supabase responde `permission denied for table entries` | RLS activo y estás usando la clave `anon` | Cambia a la clave `service_role`, o descomenta la política de prototipo |
| `relation "entries" does not exist` | La migración no se ejecutó | Vuelve al editor SQL de Supabase y ejecuta `supabase/migration.sql` |

---

## 10. Biblioteca de prompts para seguir creciendo

Estas son las ampliaciones que más sentido tienen para tu práctica profesional. Copia el prompt correspondiente cuando quieras abordar una.

### Exportar el informe a Word y PDF

```
Añade exportación del informe VSME a .docx y .pdf, además del Markdown
actual. Debe respetar la estructura de divulgaciones B1-B11 y C1-C9, incluir
el registro de omisiones y la tabla de mapeo SFDR, y llevar pie de página
con la fuente del VSME Standard de EFRAG y la fecha de generación. Genera
los archivos en el servidor, no en el navegador.
```

### Varias empresas en la misma instancia

```
Añade soporte multiempresa: una entidad "empresa" con nombre y ejercicio
fiscal, de modo que una consultora pueda llevar varios clientes en la misma
instancia. Cada empresa con su propia ruta de niveles y su propio informe.
Añade un selector en la cabecera. Mantén el aislamiento por X-Visitor-Id
por encima del de empresa, y actualiza la migración de Supabase con la
nueva tabla y sus claves foráneas.
```

### Autenticación real

```
Implementa autenticación con Supabase Auth: registro, inicio de sesión y
recuperación de contraseña. Sustituye el aislamiento por X-Visitor-Id por
el identificador de usuario autenticado, y protege todas las rutas de la
API verificando la sesión en el servidor. Documenta en el README qué pasos
debo hacer yo en el panel de Supabase.
```

### Comparación entre ejercicios

```
Añade comparación interanual: para cada datapoint numérico, mostrar el valor
del ejercicio anterior junto al actual, con la variación porcentual. En el
informe, una sección de evolución con los indicadores de B3 (energía y GEI),
B6 (agua) y B7 (residuos).
```

### Adjuntar evidencia documental

```
Añade la posibilidad de adjuntar archivos como evidencia en cada datapoint:
facturas, mediciones, certificados. Guárdalos en Supabase Storage. En el
informe, una tabla de trazabilidad que liste cada dato con su evidencia
asociada. Limita los tipos a PDF, imágenes y hojas de cálculo, con un
máximo de 10 MB por archivo.
```

### Adaptación a la normativa venezolana

```
Añade una capa opcional de requisitos venezolanos junto a los del VSME:
campos para el Registro de Actividades Susceptibles de Degradar el Ambiente,
el manejo de desechos peligrosos según la normativa nacional, y los permisos
ambientales vigentes. Debe quedar claramente separada del contenido VSME de
EFRAG, como módulo adicional y no como parte del estándar europeo.
```

---

## 11. Fuentes

- [EFRAG — VSME Standard (PDF)](https://www.efrag.org/sites/default/files/sites/webpublishing/SiteAssets/VSME%20Standard.pdf) — estructura de divulgaciones B1–B11 y C1–C9, y el mapeo SFDR del Apéndice C
- [Google Antigravity](https://antigravity.google/) — plataforma de desarrollo agéntico
- [Google Antigravity — Pricing](https://antigravity.google/pricing/) — plan individual sin coste, modelos disponibles y límites
- [Antigravity IDE Overview](https://antigravity.google/docs/ide/overview/) — Editor, agentes, agente de navegador y artifacts
- [Getting Started with Google Antigravity — Google Codelabs](https://codelabs.developers.google.com/getting-started-google-antigravity) — descarga, instalación e inicio de sesión
- [API keys — Supabase](https://supabase.com/docs/guides/getting-started/api-keys) — claves publicables, `anon` y `service_role`
- [Supabase MCP Server](https://supabase.com/docs/guides/ai-tools/mcp) — ámbitos obligatorios de la app OAuth y recomendaciones de seguridad
- [Scopes for your OAuth App — Supabase](https://supabase.com/docs/guides/integrations/build-a-supabase-oauth-integration/oauth-scopes) — permisos que concede cada ámbito
- [Node.js](https://nodejs.org) — descarga del entorno de ejecución

---

Herramienta de preparación de información. No sustituye el criterio profesional ni un aseguramiento externo.
