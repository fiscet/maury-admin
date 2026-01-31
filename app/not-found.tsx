import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 selection:bg-primary/20 selection:text-primary">
      <div className="w-full max-w-lg text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-24 h-24 bg-rose-100 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-rose-500/20 mx-auto mb-8 transform hover:rotate-12 transition-transform duration-300">
          <AlertTriangle className="w-12 h-12 text-rose-500" />
        </div>

        <h1 className="text-6xl font-black text-slate-900 tracking-tight italic mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Pagina non trovata
        </h2>
        <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto">
          Ops! Sembra che la pagina che stai cercando non esista o sia stata
          spostata.
        </p>

        <Link
          href="/dashboard"
          className="btn-premium inline-flex items-center gap-3 px-8 py-4 !rounded-2xl group shadow-xl shadow-primary/10 hover:shadow-primary/20"
        >
          <Home className="w-5 h-5" />
          <span>Torna alla Dashboard</span>
        </Link>

        <p className="text-center mt-12 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} HM Management
        </p>
      </div>
    </div>
  );
}
