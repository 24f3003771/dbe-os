-- Create users table
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text,
  pincode text,
  state text,
  city text,
  zone text,
  batch text,
  phone text,
  type integer default 1 not null, -- 0 = disabled, 1/2/3 = active
  role text default 'USER' not null, -- 'USER', 'MODERATOR', 'SUPER_ADMIN'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- App Settings Table
create table public.app_settings (
  id integer primary key default 1,
  restrict_emails boolean default true not null,
  constraint app_settings_singleton check (id = 1)
);

-- Insert default row
insert into public.app_settings (id, restrict_emails) values (1, true) on conflict (id) do nothing;

-- Enable RLS for settings
alter table public.app_settings enable row level security;

-- Anyone can view settings
create policy "Anyone can view settings" on public.app_settings
  for select using (true);

-- Only Super Admins can update settings
create policy "Super admins can update settings" on public.app_settings
  for update using (
    get_user_role() = 'SUPER_ADMIN'
  );

-- Enable RLS
alter table public.users enable row level security;

-- Create policies
create policy "Users can view their own profile." on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own profile." on public.users
  for update using (auth.uid() = id);

-- Function to get user role without triggering recursive RLS
create or replace function get_user_role()
returns text
language sql security definer
set search_path = public
as $$
  select role from public.users where id = auth.uid();
$$;

-- Super Admin can do everything
create policy "Super admins have full access" on public.users
  for all using (
    get_user_role() = 'SUPER_ADMIN'
  );

-- Handle automatic profile creation on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, role, type, pincode, state, city, zone, batch, phone)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    'USER', 
    case when new.email ilike '%@iimb.ac.in' then 1 else 2 end,
    new.raw_user_meta_data->>'pincode',
    new.raw_user_meta_data->>'state',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'zone',
    new.raw_user_meta_data->>'batch',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
