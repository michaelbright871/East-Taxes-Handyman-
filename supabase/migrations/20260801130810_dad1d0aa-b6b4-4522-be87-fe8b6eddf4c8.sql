
create type public.app_role as enum ('admin','agent','customer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  favorite_services text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','agent'))
$$;

create policy "profiles readable by owner or staff" on public.profiles
for select to authenticated using (id = auth.uid() or public.is_staff(auth.uid()));
create policy "profiles insert own" on public.profiles
for insert to authenticated with check (id = auth.uid());
create policy "profiles update own" on public.profiles
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "roles readable by owner or staff" on public.user_roles
for select to authenticated using (user_id = auth.uid() or public.is_staff(auth.uid()));

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New conversation',
  mode text not null default 'ai' check (mode in ('ai','queued','live','closed')),
  status text not null default 'open' check (status in ('open','closed')),
  assigned_agent_id uuid references auth.users(id) on delete set null,
  queue_position int,
  customer_unread int not null default 0,
  agent_unread int not null default 0,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.conversations to authenticated;
grant all on public.conversations to service_role;
alter table public.conversations enable row level security;

create policy "conversations owner or staff read" on public.conversations
for select to authenticated using (customer_id = auth.uid() or public.is_staff(auth.uid()));
create policy "conversations owner insert" on public.conversations
for insert to authenticated with check (customer_id = auth.uid());
create policy "conversations owner or staff update" on public.conversations
for update to authenticated using (customer_id = auth.uid() or public.is_staff(auth.uid()))
with check (customer_id = auth.uid() or public.is_staff(auth.uid()));
create policy "conversations owner delete" on public.conversations
for delete to authenticated using (customer_id = auth.uid());

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  sender_role text not null check (sender_role in ('customer','assistant','agent','system')),
  sender_name text,
  content text not null default '',
  attachments jsonb not null default '[]'::jsonb,
  reactions jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index messages_conversation_idx on public.messages (conversation_id, created_at);
grant select, insert, update on public.messages to authenticated;
grant all on public.messages to service_role;
alter table public.messages enable row level security;

create or replace function public.can_access_conversation(_conversation_id uuid, _user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.conversations c
    where c.id = _conversation_id
      and (c.customer_id = _user_id or public.is_staff(_user_id))
  )
$$;

create policy "messages read for participants" on public.messages
for select to authenticated using (public.can_access_conversation(conversation_id, auth.uid()));
create policy "messages insert for participants" on public.messages
for insert to authenticated with check (public.can_access_conversation(conversation_id, auth.uid()));
create policy "messages update for participants" on public.messages
for update to authenticated using (public.can_access_conversation(conversation_id, auth.uid()))
with check (public.can_access_conversation(conversation_id, auth.uid()));

create table public.agent_presence (
  agent_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  is_online boolean not null default false,
  max_chats int not null default 5,
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.agent_presence to authenticated;
grant all on public.agent_presence to service_role;
alter table public.agent_presence enable row level security;
create policy "presence readable by authenticated" on public.agent_presence
for select to authenticated using (true);
create policy "agents manage own presence" on public.agent_presence
for insert to authenticated with check (agent_id = auth.uid() and public.is_staff(auth.uid()));
create policy "agents update own presence" on public.agent_presence
for update to authenticated using (agent_id = auth.uid() or public.has_role(auth.uid(),'admin'))
with check (agent_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create table public.chat_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
grant select on public.chat_settings to anon, authenticated;
grant all on public.chat_settings to service_role;
alter table public.chat_settings enable row level security;
create policy "settings public read" on public.chat_settings for select using (true);
create policy "settings admin write" on public.chat_settings for all to authenticated
using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.ai_knowledge (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  content text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.ai_knowledge to anon, authenticated;
grant all on public.ai_knowledge to service_role;
alter table public.ai_knowledge enable row level security;
create policy "knowledge public read" on public.ai_knowledge for select using (is_active);
create policy "knowledge admin write" on public.ai_knowledge for all to authenticated
using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

insert into public.chat_settings (key, value) values
  ('business_hours', '{"weekdays":"Mon – Sat: 7:00 AM – 6:00 PM","sunday":"Closed","emergency":"24/7 emergency callouts"}'::jsonb),
  ('auto_replies', '{"welcome":"Hi! I''m Ranger, the East Texas Handyman assistant. How can I help with your home today?","offline":"Our agents are offline right now — leave a message and we''ll reply first thing."}'::jsonb);

insert into public.ai_knowledge (topic, content) values
  ('Company','East Texas Handyman Services, 2505 Clinton St, Longview, TX 75604. Phone +1 (469) 678-6244. Family-run, licensed and insured, free estimates, 1-year workmanship guarantee.'),
  ('Hours','Mon–Sat 7:00 AM – 6:00 PM. Closed Sunday except emergency callouts.'),
  ('Service areas','Longview, Kilgore, Gladewater, White Oak, Hallsville, Marshall, Tyler, Henderson, Big Sandy, Lakeport, Judson, Diana.'),
  ('Pricing guidance','Typical service call $89. Handyman rate $65–$95/hr. Drywall patch $150–$400. Interior door install $180–$350. Deck repair $400–$2,500. Pressure washing $180–$500. Exact pricing after a free on-site estimate.');

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();
create trigger conversations_touch before update on public.conversations
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'customer')
  on conflict do nothing;
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.bump_conversation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.conversations
    set last_message_at = new.created_at,
        customer_unread = case when new.sender_role in ('agent','assistant','system') then customer_unread + 1 else customer_unread end,
        agent_unread = case when new.sender_role = 'customer' then agent_unread + 1 else agent_unread end
  where id = new.conversation_id;
  return new;
end; $$;

create trigger messages_bump after insert on public.messages
for each row execute function public.bump_conversation();

alter table public.messages replica identity full;
alter table public.conversations replica identity full;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;

create policy "chat attachments read" on storage.objects
for select to authenticated using (bucket_id = 'chat-attachments');
create policy "chat attachments upload own" on storage.objects
for insert to authenticated with check (bucket_id = 'chat-attachments' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "chat attachments delete own" on storage.objects
for delete to authenticated using (bucket_id = 'chat-attachments' and (storage.foldername(name))[1] = auth.uid()::text);
