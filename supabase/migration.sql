-- ESCALA ESG — esquema para Supabase (PostgreSQL)
-- Aplícalo en el panel de Supabase: SQL Editor → New query → pegar → Run.
-- Revisa cada línea antes de ejecutar. No borra ni modifica nada existente.

create table if not exists public.entries (
  id        bigint generated always as identity primary key,
  user_id   text        not null default 'local',
  key       text        not null,
  value     text        not null default '',
  status    text        not null default 'pending'
              check (status in ('pending', 'done', 'na')),
  note      text        not null default '',
  evidence  text        not null default '',
  owner     text        not null default '',
  updated_at timestamptz not null default now(),
  unique (user_id, key)
);

create index if not exists entries_user_idx on public.entries (user_id);

-- Row Level Security: sin políticas, la clave anon no puede leer ni escribir nada
-- directamente desde el navegador. El acceso pasa siempre por el backend Express,
-- que filtra por user_id. Esta es la configuración más restrictiva y la recomendada.
alter table public.entries enable row level security;

-- ────────────────────────────────────────────────────────────────────────────
-- IMPORTANTE con RLS activado:
-- La clave anon queda bloqueada por RLS. Para que el backend funcione tienes
-- dos opciones:
--
--   OPCIÓN 1 (recomendada, más segura)
--   Usar la clave service_role en el servidor, que ignora RLS y NUNCA se expone
--   al navegador. En tu .env:
--       SUPABASE_URL=https://<ref>.supabase.co
--       SUPABASE_ANON_KEY=<service_role key>
--   El cliente de Supabase solo vive en server/, jamás en client/.
--
--   OPCIÓN 2 (prototipo rápido, menos segura)
--   Permitir acceso a la clave anon descomentando la política de abajo.
--   Cualquiera con la URL y la clave anon podría leer y escribir la tabla.
--
-- create policy "acceso_anon_prototipo" on public.entries
--   for all to anon using (true) with check (true);
-- ────────────────────────────────────────────────────────────────────────────

-- Marca de tiempo automática en cada actualización
create or replace function public.entries_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists entries_touch_trigger on public.entries;
create trigger entries_touch_trigger
  before update on public.entries
  for each row execute function public.entries_touch();
