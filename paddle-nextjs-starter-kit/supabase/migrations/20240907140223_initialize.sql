-- Create customers table to map Paddle customer_id to email
create table
  public.customers (
    customer_id text not null,
    email text not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint customers_pkey primary key (customer_id)
  ) tablespace pg_default;

-- Create subscription table to store webhook events sent by Paddle
create table
  public.subscriptions (
    subscription_id text not null,
    subscription_status text not null,
    price_id text null,
    product_id text null,
    scheduled_change text null,
    customer_id text not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint subscriptions_pkey primary key (subscription_id),
    constraint public_subscriptions_customer_id_fkey foreign key (customer_id) references customers (customer_id)
  ) tablespace pg_default;

-- Enable RLS
alter table public.customers enable row level security;
alter table public.subscriptions enable row level security;

-- Grant access to authenticated users to read the customers table
create policy "Enable read access for authenticated users to customers" 
  on public.customers 
  for select 
  to authenticated 
  using (true);

-- Grant access to authenticated users to read the subscriptions table
create policy "Enable read access for authenticated users to subscriptions" 
  on public.subscriptions 
  for select 
  to authenticated 
  using (true);

-- Grant access to service role to insert/update customers
create policy "Enable service role to insert customers" 
  on public.customers 
  for insert 
  to service_role 
  with check (true);

create policy "Enable service role to update customers" 
  on public.customers 
  for update 
  to service_role 
  using (true);

-- Grant access to service role to insert/update subscriptions
create policy "Enable service role to insert subscriptions" 
  on public.subscriptions 
  for insert 
  to service_role 
  with check (true);

create policy "Enable service role to update subscriptions" 
  on public.subscriptions 
  for update 
  to service_role 
  using (true);

  

import { supabase } from './supabaseClient';

export async function uploadImage(file: File, userId: string) {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `uploads/${userId}/${fileName}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('images') // your bucket name
      .upload(filePath, file);

    if (error) {
      console.error('Upload failed:', error.message);
      throw new Error('Image upload failed');
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || '';
  } catch (err: any) {
    throw new Error(err.message || 'Unknown error');
  }
}
