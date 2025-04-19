create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  renderId text not null,
  imageUrl text not null,
  roomType text not null,
  style text not null,
  status text not null default 'processing',
  resultUrl text,
  error text,
  hasFurniture boolean,
  furniturePercentage numeric,
  removeFurniture boolean default false,
  createdAt timestamp with time zone default timezone('utc'::text, now()) not null,
  updatedAt timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.projects enable row level security;

create policy "Users can view their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert their own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = user_id); 