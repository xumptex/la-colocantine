-- Donne le rôle admin aux 4 colocs.
-- Chacun doit d'abord avoir créé son compte sur le site (email ou Google),
-- puis exécuter ce script dans l'éditeur SQL de Supabase avec les vrais emails.

update public.profils
set role = 'admin'
where email in (
  'xumptex@gmail.com',
  'email-de-gabriel@exemple.fr',
  'email-de-yahya@exemple.fr',
  'email-de-erwan@exemple.fr'
);

-- Vérification
select prenom, email, role from public.profils order by role, prenom;
