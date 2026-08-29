
-- =========================================================
-- ADMIN CONTROL CENTER SCHEMA
-- =========================================================

-- helpers -------------------------------------------------
create or replace function public.is_admin(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = 'admin')
$$;

-- profiles: account status --------------------------------
alter table public.profiles
  add column if not exists status text not null default 'active',
  add column if not exists notes text,
  add column if not exists last_seen_at timestamptz,
  add column if not exists created_source text not null default 'web';

drop policy if exists "profiles readable by owner or staff" on public.profiles;
create policy "profiles readable by owner or staff" on public.profiles
  for select to authenticated using ((id = auth.uid()) or public.is_staff(auth.uid()));
create policy "profiles admin update" on public.profiles
  for update to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "profiles admin delete" on public.profiles
  for delete to authenticated using (public.is_admin(auth.uid()));

-- user_roles: allow admins to manage roles ----------------
create policy "roles admin insert" on public.user_roles
  for insert to authenticated with check (public.is_admin(auth.uid()));
create policy "roles admin update" on public.user_roles
  for update to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "roles admin delete" on public.user_roles
  for delete to authenticated using (public.is_admin(auth.uid()));
grant insert, update, delete on public.user_roles to authenticated;

-- ai_knowledge: richer -----------------------------------
alter table public.ai_knowledge
  add column if not exists category text not null default 'general',
  add column if not exists sort_order integer not null default 0,
  add column if not exists updated_at timestamptz not null default now();
create trigger ai_knowledge_touch before update on public.ai_knowledge
  for each row execute function public.touch_updated_at();

-- =========================================================
-- SECURITY / AUTH
-- =========================================================
create table public.login_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text,
  success boolean not null default true,
  ip_address text,
  user_agent text,
  location text,
  created_at timestamptz not null default now()
);
grant select, insert on public.login_activity to authenticated;
grant all on public.login_activity to service_role;
alter table public.login_activity enable row level security;
create policy "login activity staff read" on public.login_activity
  for select to authenticated using (public.is_staff(auth.uid()) or user_id = auth.uid());
create policy "login activity insert" on public.login_activity
  for insert to authenticated with check (true);

create table public.account_lockouts (
  email text primary key,
  failed_attempts integer not null default 0,
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);
grant select on public.account_lockouts to authenticated;
grant all on public.account_lockouts to service_role;
alter table public.account_lockouts enable row level security;
create policy "lockouts staff read" on public.account_lockouts
  for select to authenticated using (public.is_staff(auth.uid()));

create table public.admin_security (
  user_id uuid primary key references auth.users(id) on delete cascade,
  two_factor_enabled boolean not null default false,
  two_factor_method text not null default 'totp',
  two_factor_secret text,
  recovery_codes text[] not null default '{}',
  session_timeout_minutes integer not null default 480,
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.admin_security to authenticated;
grant all on public.admin_security to service_role;
alter table public.admin_security enable row level security;
create policy "security own or admin" on public.admin_security
  for select to authenticated using (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy "security own insert" on public.admin_security
  for insert to authenticated with check (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy "security own update" on public.admin_security
  for update to authenticated using (user_id = auth.uid() or public.is_admin(auth.uid()))
  with check (user_id = auth.uid() or public.is_admin(auth.uid()));

-- =========================================================
-- SUPPORT
-- =========================================================
create table public.conversation_notes (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  author_name text,
  body text not null,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.conversation_notes to authenticated;
grant all on public.conversation_notes to service_role;
alter table public.conversation_notes enable row level security;
create policy "notes staff all" on public.conversation_notes
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.canned_replies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  shortcut text,
  category text not null default 'general',
  usage_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.canned_replies to authenticated;
grant all on public.canned_replies to service_role;
alter table public.canned_replies enable row level security;
create policy "canned staff all" on public.canned_replies
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger canned_touch before update on public.canned_replies
  for each row execute function public.touch_updated_at();

alter table public.agent_presence
  add column if not exists permissions text[] not null default '{}',
  add column if not exists avg_response_seconds integer not null default 0,
  add column if not exists total_chats integer not null default 0,
  add column if not exists created_at timestamptz not null default now();
create policy "presence admin manage" on public.agent_presence
  for insert to authenticated with check (public.is_admin(auth.uid()));
create policy "presence admin delete" on public.agent_presence
  for delete to authenticated using (public.is_admin(auth.uid()));
grant delete on public.agent_presence to authenticated;

-- =========================================================
-- CMS / CONTENT
-- =========================================================
create table public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  section text not null default 'general',
  label text not null,
  kind text not null default 'richtext',
  data jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.content_blocks to anon;
grant select, insert, update, delete on public.content_blocks to authenticated;
grant all on public.content_blocks to service_role;
alter table public.content_blocks enable row level security;
create policy "content public read" on public.content_blocks for select using (is_published or public.is_staff(auth.uid()));
create policy "content admin write" on public.content_blocks
  for all to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create trigger content_blocks_touch before update on public.content_blocks
  for each row execute function public.touch_updated_at();

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon;
grant select, insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "settings public read" on public.site_settings for select using (true);
create policy "settings admin write" on public.site_settings
  for all to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- =========================================================
-- SERVICES
-- =========================================================
create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  icon text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.service_categories to anon;
grant select, insert, update, delete on public.service_categories to authenticated;
grant all on public.service_categories to service_role;
alter table public.service_categories enable row level security;
create policy "categories public read" on public.service_categories for select using (is_visible or public.is_staff(auth.uid()));
create policy "categories admin write" on public.service_categories
  for all to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create trigger service_categories_touch before update on public.service_categories
  for each row execute function public.touch_updated_at();

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category_id uuid references public.service_categories(id) on delete set null,
  summary text,
  description text,
  price_from numeric(10,2),
  price_to numeric(10,2),
  price_unit text not null default 'job',
  pricing_guide jsonb not null default '[]'::jsonb,
  image_url text,
  icon text,
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.services to anon;
grant select, insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "services public read" on public.services for select using (is_visible or public.is_staff(auth.uid()));
create policy "services admin write" on public.services
  for all to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create trigger services_touch before update on public.services
  for each row execute function public.touch_updated_at();

-- =========================================================
-- MEDIA LIBRARY
-- =========================================================
create table public.media_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  parent_id uuid references public.media_folders(id) on delete cascade,
  created_at timestamptz not null default now()
);
grant select on public.media_folders to anon;
grant select, insert, update, delete on public.media_folders to authenticated;
grant all on public.media_folders to service_role;
alter table public.media_folders enable row level security;
create policy "folders public read" on public.media_folders for select using (true);
create policy "folders staff write" on public.media_folders
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid references public.media_folders(id) on delete set null,
  name text not null,
  url text not null,
  storage_path text,
  type text not null default 'image',
  mime_type text,
  size_bytes bigint not null default 0,
  width integer,
  height integer,
  alt_text text,
  tags text[] not null default '{}',
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.media_assets to anon;
grant select, insert, update, delete on public.media_assets to authenticated;
grant all on public.media_assets to service_role;
alter table public.media_assets enable row level security;
create policy "media public read" on public.media_assets for select using (true);
create policy "media staff write" on public.media_assets
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger media_assets_touch before update on public.media_assets
  for each row execute function public.touch_updated_at();

-- =========================================================
-- BOOKINGS
-- =========================================================
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('BK-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  customer_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  address text,
  city text,
  service_slug text,
  service_name text,
  details text,
  photos jsonb not null default '[]'::jsonb,
  preferred_date date,
  preferred_window text,
  scheduled_at timestamptz,
  status text not null default 'pending',
  priority text not null default 'normal',
  assigned_technician text,
  estimate_low numeric(10,2),
  estimate_high numeric(10,2),
  admin_notes text,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.bookings to authenticated;
grant insert on public.bookings to anon;
grant all on public.bookings to service_role;
alter table public.bookings enable row level security;
create policy "bookings anon create" on public.bookings for insert to anon with check (customer_id is null);
create policy "bookings owner create" on public.bookings for insert to authenticated
  with check (customer_id = auth.uid() or customer_id is null or public.is_staff(auth.uid()));
create policy "bookings owner or staff read" on public.bookings for select to authenticated
  using (customer_id = auth.uid() or public.is_staff(auth.uid()));
create policy "bookings staff update" on public.bookings for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "bookings admin delete" on public.bookings for delete to authenticated
  using (public.is_admin(auth.uid()));
create trigger bookings_touch before update on public.bookings
  for each row execute function public.touch_updated_at();

-- =========================================================
-- QUOTES
-- =========================================================
create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('QT-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  booking_id uuid references public.bookings(id) on delete set null,
  customer_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  service_slug text,
  service_name text,
  details text,
  line_items jsonb not null default '[]'::jsonb,
  subtotal numeric(10,2) not null default 0,
  tax numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status text not null default 'pending',
  valid_until date,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.quotes to authenticated;
grant insert on public.quotes to anon;
grant all on public.quotes to service_role;
alter table public.quotes enable row level security;
create policy "quotes anon create" on public.quotes for insert to anon with check (customer_id is null);
create policy "quotes owner create" on public.quotes for insert to authenticated
  with check (customer_id = auth.uid() or customer_id is null or public.is_staff(auth.uid()));
create policy "quotes owner or staff read" on public.quotes for select to authenticated
  using (customer_id = auth.uid() or public.is_staff(auth.uid()));
create policy "quotes staff update" on public.quotes for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "quotes admin delete" on public.quotes for delete to authenticated
  using (public.is_admin(auth.uid()));
create trigger quotes_touch before update on public.quotes
  for each row execute function public.touch_updated_at();

-- =========================================================
-- REVIEWS
-- =========================================================
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  author_location text,
  avatar_url text,
  rating integer not null default 5,
  title text,
  body text not null,
  service_name text,
  source text not null default 'website',
  status text not null default 'pending',
  is_pinned boolean not null default false,
  is_hidden boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.reviews to anon;
grant select, insert, update, delete on public.reviews to authenticated;
grant insert on public.reviews to anon;
grant all on public.reviews to service_role;
alter table public.reviews enable row level security;
create policy "reviews public read" on public.reviews for select
  using ((status = 'approved' and not is_hidden) or public.is_staff(auth.uid()));
create policy "reviews anon create" on public.reviews for insert to anon with check (status = 'pending');
create policy "reviews user create" on public.reviews for insert to authenticated with check (true);
create policy "reviews staff write" on public.reviews for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "reviews admin delete" on public.reviews for delete to authenticated
  using (public.is_admin(auth.uid()));
create trigger reviews_touch before update on public.reviews
  for each row execute function public.touch_updated_at();

-- =========================================================
-- GALLERY / PROJECTS
-- =========================================================
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default 'general',
  property_type text not null default 'residential',
  location text,
  description text,
  cover_url text,
  related_services text[] not null default '{}',
  completed_on date,
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  popularity integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.projects to anon;
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "projects public read" on public.projects for select using (is_visible or public.is_staff(auth.uid()));
create policy "projects staff write" on public.projects for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();

create table public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  kind text not null default 'image',
  url text not null,
  poster_url text,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.project_media to anon;
grant select, insert, update, delete on public.project_media to authenticated;
grant all on public.project_media to service_role;
alter table public.project_media enable row level security;
create policy "project media public read" on public.project_media for select using (true);
create policy "project media staff write" on public.project_media for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.before_after (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  service_name text,
  category text not null default 'general',
  location text,
  description text,
  before_url text not null,
  after_url text not null,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.before_after to anon;
grant select, insert, update, delete on public.before_after to authenticated;
grant all on public.before_after to service_role;
alter table public.before_after enable row level security;
create policy "before after public read" on public.before_after for select using (is_visible or public.is_staff(auth.uid()));
create policy "before after staff write" on public.before_after for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger before_after_touch before update on public.before_after
  for each row execute function public.touch_updated_at();

-- =========================================================
-- MARKETING
-- =========================================================
create table public.promo_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  cta_label text,
  cta_href text,
  theme text not null default 'primary',
  placement text not null default 'top',
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.promo_banners to anon;
grant select, insert, update, delete on public.promo_banners to authenticated;
grant all on public.promo_banners to service_role;
alter table public.promo_banners enable row level security;
create policy "banners public read" on public.promo_banners for select using (is_active or public.is_staff(auth.uid()));
create policy "banners admin write" on public.promo_banners for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create trigger promo_banners_touch before update on public.promo_banners
  for each row execute function public.touch_updated_at();

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type text not null default 'percent',
  discount_value numeric(10,2) not null default 0,
  max_redemptions integer,
  redemptions integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.coupons to anon;
grant select, insert, update, delete on public.coupons to authenticated;
grant all on public.coupons to service_role;
alter table public.coupons enable row level security;
create policy "coupons public read" on public.coupons for select using (is_active or public.is_staff(auth.uid()));
create policy "coupons admin write" on public.coupons for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create trigger coupons_touch before update on public.coupons
  for each row execute function public.touch_updated_at();

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  source text not null default 'website',
  is_subscribed boolean not null default true,
  created_at timestamptz not null default now()
);
grant insert on public.newsletter_subscribers to anon;
grant select, insert, update, delete on public.newsletter_subscribers to authenticated;
grant all on public.newsletter_subscribers to service_role;
alter table public.newsletter_subscribers enable row level security;
create policy "subscribers anon join" on public.newsletter_subscribers for insert to anon with check (true);
create policy "subscribers user join" on public.newsletter_subscribers for insert to authenticated with check (true);
create policy "subscribers staff read" on public.newsletter_subscribers for select to authenticated
  using (public.is_staff(auth.uid()));
create policy "subscribers admin write" on public.newsletter_subscribers for update to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "subscribers admin delete" on public.newsletter_subscribers for delete to authenticated
  using (public.is_admin(auth.uid()));

create table public.popup_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  headline text not null,
  body text,
  image_url text,
  cta_label text,
  cta_href text,
  trigger_type text not null default 'delay',
  trigger_value integer not null default 10,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default false,
  impressions integer not null default 0,
  conversions integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.popup_campaigns to anon;
grant select, insert, update, delete on public.popup_campaigns to authenticated;
grant all on public.popup_campaigns to service_role;
alter table public.popup_campaigns enable row level security;
create policy "popups public read" on public.popup_campaigns for select using (is_active or public.is_staff(auth.uid()));
create policy "popups admin write" on public.popup_campaigns for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create trigger popup_campaigns_touch before update on public.popup_campaigns
  for each row execute function public.touch_updated_at();

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_name text not null,
  referrer_email text,
  referred_name text,
  referred_email text,
  code text not null,
  reward text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.referrals to authenticated;
grant all on public.referrals to service_role;
alter table public.referrals enable row level security;
create policy "referrals staff read" on public.referrals for select to authenticated using (public.is_staff(auth.uid()));
create policy "referrals staff write" on public.referrals for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- =========================================================
-- SYSTEM
-- =========================================================
create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  actor_name text,
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
grant select, insert on public.activity_logs to authenticated;
grant all on public.activity_logs to service_role;
alter table public.activity_logs enable row level security;
create policy "activity staff read" on public.activity_logs for select to authenticated using (public.is_staff(auth.uid()));
create policy "activity staff insert" on public.activity_logs for insert to authenticated with check (public.is_staff(auth.uid()));

create table public.error_logs (
  id uuid primary key default gen_random_uuid(),
  level text not null default 'error',
  message text not null,
  stack text,
  path text,
  user_agent text,
  user_id uuid references auth.users(id) on delete set null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.error_logs to authenticated;
grant insert on public.error_logs to anon;
grant all on public.error_logs to service_role;
alter table public.error_logs enable row level security;
create policy "errors anon insert" on public.error_logs for insert to anon with check (true);
create policy "errors user insert" on public.error_logs for insert to authenticated with check (true);
create policy "errors staff read" on public.error_logs for select to authenticated using (public.is_staff(auth.uid()));
create policy "errors staff update" on public.error_logs for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "errors admin delete" on public.error_logs for delete to authenticated using (public.is_admin(auth.uid()));

create table public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  body text,
  href text,
  severity text not null default 'info',
  is_read boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.admin_notifications to authenticated;
grant insert on public.admin_notifications to anon;
grant all on public.admin_notifications to service_role;
alter table public.admin_notifications enable row level security;
create policy "notif anon insert" on public.admin_notifications for insert to anon with check (true);
create policy "notif user insert" on public.admin_notifications for insert to authenticated with check (true);
create policy "notif staff read" on public.admin_notifications for select to authenticated using (public.is_staff(auth.uid()));
create policy "notif staff update" on public.admin_notifications for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "notif staff delete" on public.admin_notifications for delete to authenticated using (public.is_staff(auth.uid()));

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null default 'pageview',
  path text,
  referrer text,
  source text,
  device text,
  country text,
  region text,
  city text,
  session_id text,
  user_id uuid references auth.users(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
grant insert on public.analytics_events to anon;
grant select, insert on public.analytics_events to authenticated;
grant all on public.analytics_events to service_role;
alter table public.analytics_events enable row level security;
create policy "analytics anon insert" on public.analytics_events for insert to anon with check (true);
create policy "analytics user insert" on public.analytics_events for insert to authenticated with check (true);
create policy "analytics staff read" on public.analytics_events for select to authenticated using (public.is_staff(auth.uid()));
create index analytics_events_created_idx on public.analytics_events (created_at desc);
create index bookings_status_idx on public.bookings (status, created_at desc);
create index quotes_status_idx on public.quotes (status, created_at desc);

-- realtime
alter publication supabase_realtime add table public.admin_notifications;
alter publication supabase_realtime add table public.bookings;
alter publication supabase_realtime add table public.quotes;
