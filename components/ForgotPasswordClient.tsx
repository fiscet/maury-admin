'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { Mail, Loader2, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/dashboard/profile`
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text:
          'Controlla la tua email. Ti abbiamo inviato un link per reimpostare la password.'
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Si è verificato un errore imprevisto';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary shadow-sm shadow-primary/5 mx-auto mb-6">
            <KeyRound className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic mb-2">
            Recupera Accesso
          </h1>
          <p className="text-slate-500 font-medium">
            Inserisci la tua email per reimpostare la password
          </p>
        </div>

        <div className="card-premium">
          {message && (
            <div
              className={`p-5 mb-10 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}
            >
              <p className="text-sm font-bold">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-10">
            <div className="space-y-4">
              <label htmlFor="email" className="label-premium">
                Email Amministratore
              </label>
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="admin@hm-management.it"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium pl-16 py-5"
                />
                <Mail className="w-6 h-6 text-slate-300 group-focus-within:text-primary transition-all duration-300 absolute left-6 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full py-5 flex items-center justify-center gap-3 !rounded-2xl group shadow-xl shadow-primary/10"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Invio in corso...</span>
                </>
              ) : (
                <>
                  <span>Invia Link di Recupero</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-50 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Torna al Login
            </Link>
          </div>
        </div>

        <p className="text-center mt-12 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} HM Management. PROCESSO SICURO.
        </p>
      </div>
    </div>
  );
}
