-- Inscriptions aux repas et commentaires du livre d'or.
-- À exécuter une fois dans l'éditeur SQL de Supabase, après les migrations précédentes.

-- ============ Inscriptions ============
-- Un repas est identifié par l'id de son annonce (champ repas.id dans le contenu de la page).
-- On garde une copie du titre et de la date : l'annonce peut être modifiée ou supprimée ensuite.
create table public.inscriptions (
  id uuid primary key default gen_random_uuid(),
  repas_id text not null,
  repas_titre text not null,
  repas_date date,
  utilisateur_id uuid references auth.users (id) on delete set null, -- null : inscrit sans compte
  prenom text not null check (char_length(prenom) between 1 and 60),
  email text not null check (char_length(email) between 3 and 200),
  convives int not null check (convives between 1 and 4),
  remarques text check (char_length(remarques) <= 500),
  lien_envoye_le timestamptz, -- lien magique envoyé (inscrits sans compte)
  cree_le timestamptz not null default now()
);

-- Une seule inscription par email et par repas
create unique index inscriptions_un_email_par_repas on public.inscriptions (repas_id, lower(email));

alter table public.inscriptions enable row level security;

-- S'inscrire : connecté (à son nom) ou non (sans compte)
create policy "S'inscrire à un repas"
  on public.inscriptions for insert
  to anon, authenticated
  with check (
    (utilisateur_id is null and (select auth.uid()) is null)
    or utilisateur_id = (select auth.uid())
  );

-- Les admins voient, mettent à jour (lien envoyé) et suppriment les inscriptions
create policy "Les admins voient les inscriptions"
  on public.inscriptions for select
  to authenticated
  using ((select public.est_admin()));

create policy "Les admins modifient les inscriptions"
  on public.inscriptions for update
  to authenticated
  using ((select public.est_admin()))
  with check ((select public.est_admin()));

create policy "Les admins suppriment les inscriptions"
  on public.inscriptions for delete
  to authenticated
  using ((select public.est_admin()));

-- Nombre de places prises pour un repas (public, sans exposer qui est inscrit)
create function public.places_prises(p_repas_id text)
returns int
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(sum(convives), 0)::int from public.inscriptions where repas_id = p_repas_id;
$$;

-- ============ Commentaires (livre d'or) ============
create table public.commentaires (
  id uuid primary key default gen_random_uuid(),
  repas_id text not null,
  repas_titre text not null,
  auteur_id uuid not null references auth.users (id) on delete cascade,
  prenom text not null,
  message text not null check (char_length(message) between 1 and 2000),
  note int not null check (note between 1 and 5),
  photos text[] not null default '{}' check (cardinality(photos) <= 3),
  cree_le timestamptz not null default now(),
  unique (repas_id, auteur_id) -- un mot par personne et par repas
);

alter table public.commentaires enable row level security;

-- Repas que l'utilisateur connecté peut commenter : il y était inscrit (par son compte
-- ou par son email), le repas a eu lieu, et il n'a pas encore laissé de mot.
create function public.repas_commentables()
returns table (repas_id text, repas_titre text, repas_date date, prenom text)
language sql
stable
security definer
set search_path = ''
as $$
  select distinct on (i.repas_id) i.repas_id, i.repas_titre, i.repas_date, i.prenom
  from public.inscriptions i
  where (select auth.uid()) is not null
    and (i.utilisateur_id = (select auth.uid()) or lower(i.email) = lower((select auth.jwt() ->> 'email')))
    and i.repas_date <= current_date
    and not exists (
      select 1 from public.commentaires c
      where c.repas_id = i.repas_id and c.auteur_id = (select auth.uid())
    )
  order by i.repas_id, i.cree_le;
$$;

-- Tout le monde lit le livre d'or
create policy "Tout le monde lit les commentaires"
  on public.commentaires for select
  to anon, authenticated
  using (true);

-- Seuls les convives d'un repas passé peuvent commenter ce repas
create policy "Les convives commentent"
  on public.commentaires for insert
  to authenticated
  with check (
    auteur_id = (select auth.uid())
    and exists (select 1 from public.repas_commentables() r where r.repas_id = commentaires.repas_id)
  );

-- Seuls les admins suppriment
create policy "Les admins suppriment les commentaires"
  on public.commentaires for delete
  to authenticated
  using ((select public.est_admin()));

-- ============ Photos des commentaires ============
-- Dossier public "commentaires", un sous-dossier par utilisateur (5 Mo max, images seulement)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('commentaires', 'commentaires', true, 5242880, array['image/*'])
on conflict (id) do nothing;

create policy "Chacun envoie ses photos de commentaire"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'commentaires' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Les admins suppriment les photos de commentaire"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'commentaires' and (select public.est_admin()));
