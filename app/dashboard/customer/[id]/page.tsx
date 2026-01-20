import { createClient } from '@/utils/supabase/server';
import CustomerDetailClient from '@/components/CustomerDetailClient';
import { notFound } from 'next/navigation';

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string; }>; }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch Profile
  const { data: profile } = await supabase
    .from('maury_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (!profile) {
    notFound();
  }

  // Fetch Documents
  const { data: documents } = await supabase
    .from('maury_documents')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false });

  return (
    <CustomerDetailClient
      profile={profile}
      documents={documents || []}
    />
  );
}
