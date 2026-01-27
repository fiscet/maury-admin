'use client';

import { useState } from 'react';
import Link from 'next/link';
import NotesModal from './NotesModal';
import { Profile, Document } from '@/types';
import {
  ArrowLeft,
  FileText,
  Download,
  MessageSquare,
  Calendar,
  HardDrive,
  Building2,
  Mail,
  UserCheck,
  Trash2
} from 'lucide-react';
import { deleteDocument } from '@/app/actions/delete-document';
import { createClient } from '@/utils/supabase/client';

interface CustomerDetailClientProps {
  profile: Profile;
  documents: Document[];
}

export default function CustomerDetailClient({
  profile,
  documents
}: CustomerDetailClientProps) {
  const [selectedNoteDoc, setSelectedNoteDoc] = useState<Document | null>(null);

  const handleDownload = async (doc: Document) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(doc.file_path, 60);

      if (error) throw error;

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (e) {
      console.error(e);
      alert('Errore download');
    }
  };

  const handleDelete = async (doc: Document) => {
    if (!confirm('Sei sicuro di voler eliminare questo documento?')) return;

    try {
      const result = await deleteDocument(doc.id, doc.file_path);
      if (result.error) {
        alert(result.error);
      }
    } catch (e) {
      console.error(e);
      alert("Errore durante l'eliminazione");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Torna alla lista clienti
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 italic flex items-center gap-3">
              <Building2 className="w-8 h-8 text-primary not-italic" />
              {profile.company_name || 'Nome Azienda N/D'}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                {profile.email}
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-slate-400" />
                Iscritto il{' '}
                {new Date(profile.created_at).toLocaleDateString('it-IT')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedNoteDoc && (
        <NotesModal
          documentId={selectedNoteDoc.id}
          documentName={selectedNoteDoc.name}
          onClose={() => setSelectedNoteDoc(null)}
        />
      )}

      {/* Documents Section */}
      <div className="card-premium p-0 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm shadow-primary/5">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight italic">
                Documenti Caricati
              </h3>
              <p className="text-sm font-medium text-slate-500">
                Visualizza e gestisci i file caricati dal cliente.
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">
            <span className="text-xl font-black text-slate-900">
              {documents.length}
            </span>
            <span className="ml-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              File
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 border-b border-slate-100">
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                  Tipo
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Nome File
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Periodo
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Caricato
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Peso
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-8 py-8 text-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors mx-auto">
                      <FileText className="w-6 h-6" />
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {doc.name}
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {doc.month}/{doc.year}
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="text-sm font-medium text-slate-500">
                      {new Date(doc.created_at).toLocaleDateString('it-IT')}
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <HardDrive className="w-4 h-4" />
                      {doc.size}
                    </div>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => setSelectedNoteDoc(doc)}
                        className="p-3 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                        title="Visualizza Note"
                      >
                        <MessageSquare className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc)}
                        className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        title="Elimina Documento"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary transition-all shadow-sm active:scale-[0.97] flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Scarica
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="w-12 h-12 text-slate-200" />
                      <p className="text-slate-400 font-medium italic">
                        Nessun documento è stato ancora caricato da questo
                        cliente.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
