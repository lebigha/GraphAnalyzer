-- ============================================================================
-- FROG AI - PREMIUM USER TRACKING
-- Exécute ce script dans le "SQL Editor" de ton dashboard Supabase
-- ============================================================================

-- 1. Créer la table des profils (basée sur l'email pour l'instant)
create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  is_premium boolean default false,
  premium_since timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Activer la sécurité (RLS)
alter table profiles enable row level security;

-- 3. Créer une politique pour que le backend (service role) puisse tout faire
create policy "Service role can manage all profiles"
  on profiles
  using ( true )
  with check ( true );

-- 4. (Optionnel) Créer une politique pour que l'utilisateur puisse lire son propre statut
-- Cette policy suppose que l'utilisateur est connecté via Supabase Auth
-- et que son email correspond.
create policy "Users can read own profile"
  on profiles
  for select
  using ( auth.jwt() ->> 'email' = email );

-- 5. Créer un index sur l'email pour les performances
create index if not exists profiles_email_idx on profiles (email);

-- ============================================================================
-- NOTE: Une fois la table créée, le Webhook Stripe pourra insérer/updater
-- les utilisateurs premium automatiquement.
-- ============================================================================
