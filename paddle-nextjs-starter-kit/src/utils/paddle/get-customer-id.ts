import { createClient } from '@/utils/supabase/server';

export async function getCustomerId() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  console.log('Current user email:', user.data.user?.email);
  
  if (user.data.user?.email) {
    const customersData = await supabase
      .from('customers')
      .select('customer_id,email')
      .eq('email', user.data.user?.email)
      .single();
    
    console.log('Customer data from Supabase:', customersData);
    
    if (customersData?.data?.customer_id) {
      console.log('Found customer ID:', customersData.data.customer_id);
      return customersData.data.customer_id as string;
    } else {
      console.log('No customer ID found for email:', user.data.user.email);
    }
  } else {
    console.log('No user email found');
  }
  return '';
}
