'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen transition-all duration-300">
        {/* Top Header */}
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-100 flex items-center sticky top-0 z-40 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:text-primary transition-colors hover:bg-slate-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="hidden sm:flex items-center gap-2">
                <span className="text-slate-400 font-medium text-sm">Dashboard</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-800 font-bold text-sm">Panoramica</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </div>

        {/* Footer */}
        <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-100 mt-10">
          <p className="text-slate-400 text-xs font-medium">
            &copy; {new Date().getFullYear()} HM Management. Tutti i diritti riservati.
          </p>
        </footer>
      </main>
    </div>
  );
}
