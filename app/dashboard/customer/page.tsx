import { createClient } from '@/utils/supabase/server';
import AdminDashboardClient from '@/components/AdminDashboardClient';
import { redirect } from 'next/navigation';

export default async function CustomerPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/');
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('maury_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/');
  }

  // Get all profiles, excluding admins
  const { data: profiles } = await supabase
    .from('maury_profiles')
    .select('*')
    .neq('role', 'admin') // Exclude admins
    .order('created_at', { ascending: false });

  return <AdminDashboardClient initialProfiles={profiles || []} />;
}
