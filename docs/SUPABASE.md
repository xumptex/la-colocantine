# Mettre en place Supabase (comptes, contenu, livre d'or)

Les comptes du site reposent sur [Supabase](https://supabase.com) : connexion par email / mot de passe ou avec Google, et un rôle `membre` ou `admin` par compte. À faire une seule fois, par la personne qui crée le projet Supabase.

## 1. Créer le projet Supabase

1. Sur [supabase.com](https://supabase.com), créer un projet (région conseillée : **West EU (Paris)**).
2. Copier `.env.example` en `.env.local` à la racine du repo.
3. Dans Supabase, **Project Settings > API Keys** : copier l'URL du projet et la clé *publishable* dans `.env.local`.
4. Relancer `npm run dev`.

Chaque coloc qui lance le site en local a besoin de son propre `.env.local` (il n'est pas versionné) : se partager les deux valeurs.

## 2. Créer la base

Dans **SQL Editor**, coller le contenu de `supabase/migrations/20261030120000_profils.sql` et cliquer sur **Run**.

Ça crée la table `profils` (prénom, nom, photo, rôle), le profil automatique à chaque inscription, et les règles de sécurité :

- chacun ne voit et ne modifie que son propre profil ;
- personne ne peut changer son propre rôle depuis le site ;
- les admins voient tous les profils (page `/admin`).

Ensuite, toujours dans **SQL Editor**, exécuter `supabase/migrations/20261101120000_contenus.sql`. Ça crée :

- la table `contenus` : le contenu des pages, du pied de page et les polices, modifiés depuis le **mode édition** du site. Tout le monde peut le lire, seuls les admins peuvent le modifier ;
- le dossier de stockage `images` : les photos envoyées depuis le mode édition.

Tant que rien n'a été enregistré depuis le mode édition, le site affiche son contenu d'origine (`lib/contenu/defaut.ts`).

Enfin, exécuter `supabase/migrations/20261102120000_inscriptions_commentaires.sql`. Ça crée :

- la table `inscriptions` : les inscriptions aux repas (avec un compte, ou juste prénom + email). Seuls les admins les voient ;
- la table `commentaires` : le livre d'or. Tout le monde le lit, seuls les convives d'un repas **passé** peuvent le commenter (une fois par repas), seuls les admins peuvent supprimer ;
- le dossier de stockage `commentaires` : les photos jointes aux commentaires (3 max, 5 Mo chacune).

## 3. Adresses autorisées

**Authentication > URL Configuration** :

- **Site URL** : `http://localhost:3000` (à remplacer par l'URL Vercel une fois en ligne)
- **Redirect URLs** : ajouter `http://localhost:3000/**`, puis plus tard `https://<url-vercel>/**`

## 4. Connexion Google

Dans la [console Google Cloud](https://console.cloud.google.com) :

1. Créer un projet (ex. « La Colocantine »).
2. **APIs & Services > OAuth consent screen** : type *External*, nom de l'app « La Colocantine », email de contact.
3. **APIs & Services > Credentials > Create credentials > OAuth client ID** :
   - type : *Web application*
   - **Authorized JavaScript origins** : `http://localhost:3000` (et l'URL Vercel plus tard)
   - **Authorized redirect URIs** : l'URL de callback indiquée dans Supabase, de la forme `https://<id-du-projet>.supabase.co/auth/v1/callback`
4. Copier le *Client ID* et le *Client secret*.

Puis dans Supabase, **Authentication > Sign In / Providers > Google** : activer, coller le Client ID et le Client secret, enregistrer.

## 5. Passer les 4 colocs en admin

1. Chacun crée son compte sur le site (`/login`), par email ou avec Google.
2. Mettre les 4 emails dans `supabase/admins.sql`, puis l'exécuter dans **SQL Editor**.
3. Se déconnecter / reconnecter : le badge « Admin » et le lien « Espace admin » apparaissent sur `/compte`.

## 6. Liens magiques (commentaires des inscrits sans compte)

Après un repas, depuis **Espace admin > Inscriptions aux repas**, le bouton **« Envoyer les liens magiques »** envoie un email aux inscrits qui n'ont pas de compte. Le lien les connecte directement (sans mot de passe, le compte est créé au premier clic) et les amène sur le livre d'or. Deux réglages sont nécessaires.

### Un vrai service d'envoi d'emails (Resend, gratuit)

Le service d'email intégré à Supabase n'envoie que 2 emails par heure : insuffisant pour les confirmations d'inscription et une tablée de liens magiques.

1. Créer un compte sur [resend.com](https://resend.com) (gratuit jusqu'à 3 000 emails par mois).
2. **API Keys > Create API Key** : copier la clé (`re_...`).
3. Dans Supabase, **Authentication > Emails > SMTP Settings** : activer **Enable custom SMTP** et remplir :
   - Sender email : `onboarding@resend.dev` pour tester (seuls les emails vers ton adresse Resend passeront), puis une adresse de votre domaine une fois le domaine ajouté dans Resend ;
   - Sender name : `La Colocantine` ;
   - Host : `smtp.resend.com`, Port : `465` ;
   - Username : `resend`, Password : la clé `re_...`.
4. Dans **Authentication > Rate Limits**, monter « emails envoyés par heure » (ex. 50).

### Les modèles d'email

Dans **Authentication > Emails > Templates**, remplacer le contenu de deux modèles. Les liens pointent vers `/auth/confirm` du site, qui fonctionne même si l'email est ouvert sur un autre appareil, puis renvoie au bon endroit (`{{ .RedirectTo }}` : `/compte` après une inscription, le livre d'or après un lien magique).

Onglet **Confirm signup** (création de compte, et lien magique quand le compte n'existe pas encore) :

```html
<h2>Bienvenue à La Colocantine !</h2>
<p>Clique sur le lien pour confirmer ton adresse :</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}">Confirmer mon adresse</a></p>
```

Onglet **Magic Link** :

```html
<h2>Merci d'être venu à La Colocantine !</h2>
<p>Laisse-nous un petit mot dans le livre d'or :</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}">Laisser un mot</a></p>
```

Le **Site URL** (étape 3) doit être la bonne adresse du site.

## Bon à savoir

- **Confirmation par email** : activée (**Authentication > Sign In / Providers > Email > Confirm email**). Un compte créé par email / mot de passe ne s'active qu'après le clic sur le lien reçu. Ça demande le service d'envoi d'emails de l'étape 6. Les comptes Google n'en ont pas besoin.
- **Mots de passe** : gérés par Supabase Auth, hachés avec bcrypt dans `auth.users`. Ils ne sont jamais stockés dans nos tables.
- **Sans `.env.local`**, le site s'affiche normalement mais les comptes ne fonctionnent pas.
