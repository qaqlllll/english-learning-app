-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  
  constraint profiles_pkey primary key (id)
);

-- Set up Row Level Security (RLS) for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create vocabulary_sets table
create table public.vocabulary_sets (
  id uuid not null default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  created_at timestamp with time zone default now(),
  
  constraint vocabulary_sets_pkey primary key (id)
);

-- Set up RLS for vocabulary_sets
alter table public.vocabulary_sets enable row level security;

create policy "Users can view their own vocabulary sets." on public.vocabulary_sets
  for select using (auth.uid() = user_id);

create policy "Users can create their own vocabulary sets." on public.vocabulary_sets
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own vocabulary sets." on public.vocabulary_sets
  for update using (auth.uid() = user_id);

create policy "Users can delete their own vocabulary sets." on public.vocabulary_sets
  for delete using (auth.uid() = user_id);

-- Create words table
create table public.words (
  id uuid not null default uuid_generate_v4(),
  set_id uuid not null references public.vocabulary_sets(id) on delete cascade,
  word text not null,
  definition text,
  example text,
  mastered boolean default false,
  created_at timestamp with time zone default now(),
  
  constraint words_pkey primary key (id)
);

-- Set up RLS for words
alter table public.words enable row level security;

create policy "Users can view words in their sets." on public.words
  for select using (
    exists (
      select 1 from public.vocabulary_sets
      where vocabulary_sets.id = words.set_id
      and vocabulary_sets.user_id = auth.uid()
    )
  );

create policy "Users can insert words into their sets." on public.words
  for insert with check (
    exists (
      select 1 from public.vocabulary_sets
      where vocabulary_sets.id = set_id
      and vocabulary_sets.user_id = auth.uid()
    )
  );

create policy "Users can update words in their sets." on public.words
  for update using (
    exists (
      select 1 from public.vocabulary_sets
      where vocabulary_sets.id = set_id
      and vocabulary_sets.user_id = auth.uid()
    )
  );

create policy "Users can delete words in their sets." on public.words
  for delete using (
    exists (
      select 1 from public.vocabulary_sets
      where vocabulary_sets.id = set_id
      and vocabulary_sets.user_id = auth.uid()
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
