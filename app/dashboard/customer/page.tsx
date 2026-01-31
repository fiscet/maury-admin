import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin-client';
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

  // Fetch email confirmation status for each profile from auth.users using admin client
  const adminClient = createAdminClient();
  const processedProfiles = await Promise.all(
    (profiles || []).map(async (profile) => {
      const {
        data: { user },
        error
      } = await adminClient.auth.admin.getUserById(profile.id);

      if (error) {
        console.error(`Error fetching user ${profile.id}:`, error);
      }

      return {
        ...profile,
        email_confirmed_at: user?.email_confirmed_at
      };
    })
  );

  return <AdminDashboardClient initialProfiles={processedProfiles} />;
}
