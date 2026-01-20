'use client';

import { useState } from 'react';
import { Profile } from '@/types';
import { Alert, AlertVariant } from './Alert';
import { inviteUser } from '@/app/actions/invite-user';
import {
  Users,
  UserPlus,
  Search,
  ExternalLink,
  Mail,
  Building2,
  Loader2,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardClient({ initialProfiles }: { initialProfiles: Profile[]; }) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<{ type: AlertVariant, text: string; } | null>(null);

  const filteredProfiles = profiles.filter(profile =>
    profile.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    setInviteMessage(null);

    const formData = new FormData();
    formData.append('email', inviteEmail);

    const result = await inviteUser(formData);

    if (result.error) {
      setInviteMessage({ type: 'error', text: result.error });
    } else {
      setInviteMessage({ type: 'success', text: result.message || 'Invito inviato!' });
      setInviteEmail('');
      setTimeout(() => {
        setIsInviteOpen(false);
        setInviteMessage(null);
      }, 2000);
    }
    setIsInviting(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 italic">Clienti</h2>
          <p className="text-slate-500 font-medium">Gestisci l'accesso dei clienti al portale HM Management.</p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="btn-premium flex items-center gap-2 group"
        >
          <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          + INVITA NUOVO CLIENTE
        </button>
      </div>

      {/* Main Table / List Area */}
      <div className="card-premium p-0 overflow-hidden">
        {/* Search & Stats Bar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full md:w-96 group">
            <input
              type="text"
              placeholder="Cerca per nome azienda o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-premium pl-14 h-14"
            />
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors absolute left-5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-6 px-4">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Totale</p>
              <p className="text-xl font-black text-slate-900 leading-none">{profiles.length}</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Filtrati</p>
              <p className="text-xl font-black text-primary leading-none">{filteredProfiles.length}</p>
            </div>
          </div>
        </div>

        {/* List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Azienda / Email</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ruolo</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProfiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-bold shadow-sm group-hover:bg-primary/10 transition-colors">
                        {profile.company_name?.[0] || profile.email?.[0] || '?'}
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          {profile.company_name || 'N/A'}
                        </div>
                        <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-300" />
                          {profile.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-100">
                      Cliente
                    </span>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <Link
                      href={`/dashboard/customer/${profile.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary transition-all shadow-sm active:scale-[0.97]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Gestisci
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredProfiles.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="w-12 h-12 text-slate-200" />
                      <p className="text-slate-400 font-medium">Nessun cliente trovato per la ricerca "{searchTerm}"</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl p-12 border border-slate-100 animate-in zoom-in-95 duration-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsInviteOpen(false)}
              className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-5 mb-10">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm shadow-primary/5">
                <UserPlus className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight italic leading-tight">Invita Cliente</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">Invia un link di registrazione a un nuovo cliente.</p>
              </div>
            </div>

            {inviteMessage && (
              <div className={`p-5 mb-10 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${inviteMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                <p className="text-sm font-bold">{inviteMessage.text}</p>
              </div>
            )}

            <form onSubmit={handleInvite} className="space-y-10">
              <div className="space-y-4">
                <label className="label-premium">Email dell'invitato</label>
                <div className="relative group">
                  <input
                    type="email"
                    required
                    placeholder="email@esempio.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="input-premium pl-16 py-5"
                  />
                  <Mail className="w-6 h-6 text-slate-300 group-focus-within:text-primary transition-all duration-300 absolute left-6 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-4 ml-1 leading-relaxed opacity-70">
                  IL CLIENTE RICEVERÀ UN'EMAIL PER IMPOSTARE LA PASSWORD.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-slate-50">
                <button
                  type="button"
                  className="flex-1 px-8 py-5 bg-slate-50 text-slate-500 font-bold text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-100 hover:text-slate-700 transition-all active:scale-[0.97]"
                  onClick={() => setIsInviteOpen(false)}
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-premium py-5 !rounded-2xl shadow-xl shadow-primary/10"
                  disabled={isInviting}
                >
                  {isInviting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      INVIO...
                    </>
                  ) : 'INVIA INVITO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
