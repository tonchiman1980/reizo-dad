
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-orange-50/30 flex flex-col shadow-xl">
      <header className="bg-white border-b border-orange-100 p-4 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 text-white p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M9 10h1"/><path d="M14 10h1"/><path d="M6 2h12a2 2 0 0 1 2 2v16H4V4a2 2 0 0 1 2-2Z"/><path d="M12 2v18"/></svg>
          </div>
          <h1 className="font-accent text-xl font-bold text-orange-900">れいぞーパパ</h1>
        </div>
        <div className="text-xs text-orange-400 font-bold uppercase tracking-tighter">Kitchen Hero</div>
      </header>
      <main className="flex-1 p-4 overflow-y-auto">
        {children}
      </main>
      <footer className="p-4 bg-white/50 text-center text-xs text-orange-300">
        © 2024 Reizo-Dad App
      </footer>
    </div>
  );
};
