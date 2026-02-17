-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create food_items table
create table if not exists public.food_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  expiration_date timestamptz not null,
  location text not null check (location in ('fridge', 'freezer')),
  finished_at timestamptz,
  created_at timestamptz default now()
);

alter table public.food_items enable row level security;

create policy "food_items_select_own" on public.food_items for select using (auth.uid() = user_id);
create policy "food_items_insert_own" on public.food_items for insert with check (auth.uid() = user_id);
create policy "food_items_update_own" on public.food_items for update using (auth.uid() = user_id);
create policy "food_items_delete_own" on public.food_items for delete using (auth.uid() = user_id);
