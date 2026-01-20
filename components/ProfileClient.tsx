'use client';

import { useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { Mail, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ProfileClient({ user }: { user: SupabaseUser | null; }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string; } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Le password non coincidono.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Password aggiornata con successo!' });
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p className="font-medium">Caricamento profilo...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 italic">Il mio Profilo</h2>
          <p className="text-slate-500 font-medium">Gestisci le tue credenziali e le impostazioni di sicurezza.</p>
        </div>
        <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Amministratore</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Account Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-premium h-full">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Info Account
            </h3>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email registrata</p>
              <p className="text-lg font-bold text-slate-800 break-all">{user.email}</p>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-100 italic text-slate-400 text-xs">
              L'email dell'account admin non può essere modificata direttamente per motivi di sicurezza.
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="lg:col-span-2">
          <div className="card-premium">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Sicurezza Account
            </h3>

            {message && (
              <div className={`p-4 mb-8 rounded-xl flex items-start gap-3 animate-in zoom-in-95 duration-200 ${message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <p className="text-sm font-semibold">{message.text}</p>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="label-premium">Nuova Password</label>
                  <div className="relative group">
                    <input
                      type="password"
                      required
                      minLength={6}
                      className="input-premium pl-14"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <Lock className="w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors absolute left-5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="label-premium">Conferma Password</label>
                  <div className="relative group">
                    <input
                      type="password"
                      required
                      minLength={6}
                      className="input-premium pl-14"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <Lock className="w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors absolute left-5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-10 border-t border-slate-50">
                <button
                  type="submit"
                  className="btn-premium min-w-[240px]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Aggiornamento...
                    </>
                  ) : 'Aggiorna Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div >
  );
}
