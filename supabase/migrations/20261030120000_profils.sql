-- Profils des utilisateurs : un profil par compte Supabase (auth.users), avec un rôle.
-- À exécuter une fois dans l'éditeur SQL de Supabase (voir docs/SUPABASE.md).

create type public.role_utilisateur as enum ('membre', 'admin');

create table public.profils (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  prenom text,
  nom text,
  avatar_url text,
  role public.role_utilisateur not null default 'membre',
  cree_le timestamptz not null default now()
);

alter table public.profils enable row level security;

-- Vrai si l'utilisateur connecté est admin.
-- "security definer" : lit la table sans repasser par les règles RLS (évite une boucle).
create function public.est_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profils
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- Lecture : chacun voit son profil, les admins voient tout le monde
create policy "Lire son profil ou tous si admin"
  on public.profils for select
  to authenticated
  using ((select auth.uid()) = id or (select public.est_admin()));

-- Modification : chacun modifie son propre profil...
create policy "Modifier son profil"
  on public.profils for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ... mais seulement ces colonnes : impossible de changer son rôle ou son email soi-même
revoke update on public.profils from anon, authenticated;
grant update (prenom, nom, avatar_url) on public.profils to authenticated;

-- Création automatique du profil à l'inscription (email ou Google)
create function public.creer_profil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profils (id, email, prenom, nom, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'prenom',
      new.raw_user_meta_data ->> 'given_name',
      split_part(new.raw_user_meta_data ->> 'full_name', ' ', 1)
    ),
    coalesce(new.raw_user_meta_data ->> 'nom', new.raw_user_meta_data ->> 'family_name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger a_la_creation_d_un_compte
  after insert on auth.users
  for each row execute function public.creer_profil();
