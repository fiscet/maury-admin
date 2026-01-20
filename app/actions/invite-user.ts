'use server';

import { createAdminClient } from '@/utils/supabase/admin-client';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function inviteUser(formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
    return { error: 'Email is required' };
  }

  try {
    // 1. Verify current user is an admin
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: 'Unauthorized: No active session' };
    }

    // Check profile role
    const { data: profile, error: profileError } = await supabase
      .from('maury_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return { error: 'Unauthorized: User is not an admin' };
    }

    // 2. Invite user using Admin Client
    const adminClient = createAdminClient();
    const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email);

    if (error) {
      console.error('Invite Error:', error);
      return { error: error.message };
    }

    // 3. Revalidate the users list page
    revalidatePath('/users');

    return { success: true, message: `Invite sent to ${email}` };
  } catch (err: any) {
    console.error('Unexpected Error:', err);
    return { error: err.message || 'An unexpected error occurred' };
  }
}
