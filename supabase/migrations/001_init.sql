-- SCGP Climate (Flooding) — snapshot store for /api/climate
create table if not exists public.climate_snapshots (
  id bigserial primary key,
  fetched_at timestamptz not null default now(),
  payload jsonb not null
);
create index if not exists climate_snapshots_fetched_at_idx on public.climate_snapshots (fetched_at desc);
create table if not exists public.app_secrets (name text primary key, value text not null);
alter table public.climate_snapshots enable row level security;
alter table public.app_secrets enable row level security;
revoke all on public.climate_snapshots, public.app_secrets from anon, authenticated;

-- Write path: only with the ingest key (kept in Vercel env CLIMATE_INGEST_KEY); at most one row per 30 min, keep 180 days
create or replace function public.climate_ingest(p_key text, p_payload jsonb)
returns text language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from app_secrets where name = 'ingest_key' and value = p_key) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if exists (select 1 from climate_snapshots where fetched_at > now() - interval '30 minutes') then
    return 'skipped';
  end if;
  insert into climate_snapshots (payload) values (p_payload);
  delete from climate_snapshots where fetched_at < now() - interval '180 days';
  return 'stored';
end $$;
revoke execute on function public.climate_ingest(text, jsonb) from public;
grant execute on function public.climate_ingest(text, jsonb) to anon, authenticated;

-- Read path: latest snapshot only (public open data), for fallback when sources are down
create or replace function public.climate_latest()
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object('storedAt', fetched_at, 'payload', payload) from climate_snapshots order by fetched_at desc limit 1
$$;
revoke execute on function public.climate_latest() from public;
grant execute on function public.climate_latest() to anon, authenticated;

-- 002: store only the SHA-256 of the ingest key
create or replace function public.climate_ingest(p_key text, p_payload jsonb)
returns text language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from app_secrets where name = 'ingest_key_sha256' and value = encode(sha256(convert_to(coalesce(p_key,''), 'UTF8')), 'hex')) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if exists (select 1 from climate_snapshots where fetched_at > now() - interval '30 minutes') then
    return 'skipped';
  end if;
  insert into climate_snapshots (payload) values (p_payload);
  delete from climate_snapshots where fetched_at < now() - interval '180 days';
  return 'stored';
end $$;
-- insert into app_secrets(name, value) values ('ingest_key_sha256', '<sha256 of CLIMATE_INGEST_KEY>');
