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

-- ============================================================================
-- FROG AI - ANALYSIS HISTORY
-- Persistent storage for user analyses
-- ============================================================================

-- 1. Create analyses table
create table if not exists analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  image_thumbnail text,
  signal text,
  trend text,
  trade_grade text,
  pattern text,
  risk_reward text,
  confidence integer default 3,
  result jsonb not null,
  created_at timestamptz default now()
);

-- 2. Enable RLS
alter table analyses enable row level security;

-- 3. Users can only read their own analyses
create policy "Users can read own analyses"
  on analyses
  for select
  using ( auth.uid() = user_id );

-- 4. Users can insert their own analyses
create policy "Users can insert own analyses"
  on analyses
  for insert
  with check ( auth.uid() = user_id );

-- 5. Users can delete their own analyses
create policy "Users can delete own analyses"
  on analyses
  for delete
  using ( auth.uid() = user_id );

-- 6. Index for fast user lookups
create index if not exists analyses_user_id_idx on analyses (user_id);
create index if not exists analyses_created_at_idx on analyses (created_at desc);
