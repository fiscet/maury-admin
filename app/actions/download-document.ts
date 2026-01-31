'use server';

import { createAdminClient } from '@/utils/supabase/admin-client';
import { createClient } from '@/utils/supabase/server';

export async function getDocumentDownloadUrl(filePath: string) {
  try {
    // 1. Check Auth & Admin Role
    const supabaseUser = await createClient();
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    const { data: profile } = await supabaseUser
      .from('maury_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return { error: 'Forbidden' };
    }

    // 2. Generate Signed URL using Admin Client
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin.storage
      .from('documents')
      .createSignedUrl(filePath, 60);

    if (error) {
      console.error('Error creating signed URL:', error);
      return { error: 'Errore nella generazione del link di download' };
    }

    return { signedUrl: data.signedUrl };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'Errore imprevisto' };
  }
}
