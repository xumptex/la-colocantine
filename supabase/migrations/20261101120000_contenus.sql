-- Contenu modifiable du site (mode édition des admins) et stockage des photos.
-- À exécuter une fois dans l'éditeur SQL de Supabase, après 20261030120000_profils.sql.

-- Une ligne par zone modifiable : "page:accueil", "page:events", "footer", "reglages"...
-- "donnees" contient le contenu en JSON (liste de blocs, infos du pied de page, polices).
create table public.contenus (
  cle text primary key,
  donnees jsonb not null,
  modifie_le timestamptz not null default now(),
  modifie_par uuid references auth.users (id) on delete set null
);

alter table public.contenus enable row level security;

-- Tout le monde lit le contenu (c'est ce qui s'affiche sur le site)
create policy "Tout le monde lit les contenus"
  on public.contenus for select
  to anon, authenticated
  using (true);

-- Seuls les admins créent ou modifient le contenu
create policy "Les admins ajoutent du contenu"
  on public.contenus for insert
  to authenticated
  with check ((select public.est_admin()));

create policy "Les admins modifient le contenu"
  on public.contenus for update
  to authenticated
  using ((select public.est_admin()))
  with check ((select public.est_admin()));

-- Photos envoyées depuis le mode édition : dossier public "images"
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "Les admins envoient des images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'images' and (select public.est_admin()));

create policy "Les admins remplacent des images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'images' and (select public.est_admin()));

create policy "Les admins suppriment des images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'images' and (select public.est_admin()));
