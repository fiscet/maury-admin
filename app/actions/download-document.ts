'use server';

import { createAdminClient } from '@/utils/supabase/admin-client';

export async function getDocumentDownloadUrl(filePath: string) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.storage
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
