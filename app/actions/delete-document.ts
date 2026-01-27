'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteDocument(documentId: string, filePath: string) {
  const supabase = await createClient();

  // 1. Check Auth & Admin Role
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  const { data: profile } = await supabase
    .from('maury_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Forbidden' };
  }

  // 2. Delete from Storage
  const { error: storageError } = await supabase
    .storage
    .from('documents')
    .remove([filePath]);

  if (storageError) {
    console.error('Storage delete error:', storageError);
    return { error: 'Failed to delete file from storage' };
  }

  // 3. Delete from Database
  const { error: dbError } = await supabase
    .from('maury_documents')
    .delete()
    .eq('id', documentId);

  if (dbError) {
    console.error('DB delete error:', dbError);
    return { error: 'Failed to delete document record' };
  }

  // 4. Revalidate
  // Since we don't know the exact customer ID here easily without passing it, 
  // we can revalidate the specific path if we pass it, or just revalidate the layout/page.
  // Ideally we should pass the customerId to revalidate the specific page, 
  // but revalidatePath with 'page' type works if we are on that page.
  // However, since this is a server action called from a client component, 
  // we might want to be more specific or just return success and let client router refresh.
  // But revalidatePath is good practice.
  // Let's assume the client will trigger a router.refresh() or we revalidate the dashboard.
  revalidatePath('/dashboard/customer/[id]');

  return { success: true };
}
