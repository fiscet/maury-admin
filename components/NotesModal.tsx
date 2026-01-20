'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Admin Client Utils
import { Note } from '@/types';
import { NotesModalUI } from './NotesModalUI';

interface NotesModalProps {
  documentId: string;
  documentName: string;
  onClose: () => void;
}

export default function NotesModal({ documentId, documentName, onClose }: NotesModalProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchNotes();

    // Realtime Subscription
    const channel = supabase
      .channel('realtime-notes-admin')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'maury_document_notes',
          filter: `document_id=eq.${documentId}`
        },
        (payload) => {
          const newMsg = payload.new as Note;
          setNotes((currentNotes) => [...currentNotes, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId]);

  const fetchNotes = async () => {
    if (notes.length === 0) setLoading(true);
    const { data, error } = await supabase
      .from('maury_document_notes')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: true });

    if (data) {
      setNotes(data);
    }
    setLoading(false);
  };

  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('maury_document_notes')
      .insert({
        document_id: documentId,
        content: content,
        author_id: user.id
      });

    if (!error) {
      fetchNotes();
    } else {
      console.error(error);
      alert('Errore invio nota');
    }
  };

  return (
    <NotesModalUI
      documentName={documentName}
      onClose={onClose}
      notes={notes}
      onSend={(content) => handleSend(content)}
      loading={loading}
    />
  );
};
