import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Flame, Menu, X, Shield, Terminal } from 'lucide-react';

export const Header: React.FC = () => {
  const { view, navigate, user, searchFilter, setSearchFilter } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchFilter.trim()) {
      navigate({ type: 'search', query: searchFilter.trim() });
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate({ type: 'home' })}
              className="text-xl font-bold tracking-tight text-slate-950 hover:text-slate-800 transition-colors flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-mono font-extrabold text-base shadow-sm group-hover:bg-amber-400 transition-colors">
                M
              </div>
              <span className="font-bold tracking-tight">Meridian</span>
            </button>
            <span className="hidden lg:inline text-xs font-mono text-slate-400 tracking-wider">
              TECH · LEARN · EXPEDITIONS
            </span>
          </div>

          {/* Zone 2: Concise Nav Links (Single-line text links with subtle hover states) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => navigate({ type: 'blog' })}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap cursor-pointer ${
                view.type === 'blog' || view.type === 'article' ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              Journal
            </button>
            <button
              onClick={() => navigate({ type: 'tutorials' })}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap cursor-pointer ${
                view.type === 'tutorials' || view.type === 'course' || view.type === 'lesson'
                  ? 'text-slate-950 font-semibold'
                  : ''
              }`}
            >
              Academy
            </button>
            <button
              onClick={() => navigate({ type: 'practice' })}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap cursor-pointer ${
                view.type === 'practice' ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              Practice Arena
            </button>
            <button
              onClick={() => navigate({ type: 'quizzes' })}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap cursor-pointer ${
                view.type === 'quizzes' ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              Quizzes
            </button>
            <button
              onClick={() => navigate({ type: 'architecture' })}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap cursor-pointer ${
                view.type === 'architecture' ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              100k Architecture
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Quick Utilities */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Quick Launcher */}
            <form onSubmit={handleSearchSubmit} className="relative hidden xl:block">
              <input
                type="text"
                placeholder="Search articles, algorithms, SQL..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-56 pl-8 pr-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-slate-900 border border-transparent focus:border-slate-300 rounded-lg outline-none transition-all placeholder:text-slate-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </form>

            {/* Quick search button for tablets/mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="xl:hidden p-2 text-slate-600 hover:text-slate-950 rounded-lg transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Streak & XP Telemetry */}
            <div className="hidden sm:flex items-center gap-3 px-2.5 py-1 text-xs text-slate-600 bg-slate-100/80 rounded-lg font-mono tabular-nums">
              <span className="flex items-center gap-1 text-amber-600 font-semibold" title="Daily Streak">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                <span>{user.streakDays}d</span>
              </span>
              <span className="text-slate-300">|</span>
              <span className="font-semibold text-slate-800">{user.xp} XP</span>
            </div>

            {/* User Dashboard / Admin Portal */}
            <button
              onClick={() => navigate({ type: 'dashboard' })}
              className="flex items-center gap-2 p-1 text-slate-700 hover:text-slate-950 rounded-lg transition-colors cursor-pointer"
              title="User Dashboard"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                referrerPolicy="no-referrer"
              />
            </button>

            {/* Admin CMS Access */}
            <button
              onClick={() => navigate({ type: 'admin' })}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="CMS Admin Dashboard"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-950 cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expandable search bar on mobile/tablet */}
        {searchOpen && (
          <div className="py-2.5 border-t border-slate-100 xl:hidden">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search articles, SQL queries, lessons..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 focus:bg-white text-slate-900 border border-slate-200 rounded-lg outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 space-y-2">
            <button
              onClick={() => { navigate({ type: 'blog' }); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 rounded-lg"
            >
              Journal (Tech & Travel)
            </button>
            <button
              onClick={() => { navigate({ type: 'tutorials' }); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 rounded-lg"
            >
              Academy (Courses & Paths)
            </button>
            <button
              onClick={() => { navigate({ type: 'practice' }); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 rounded-lg"
            >
              Practice Arena (Python & SQL)
            </button>
            <button
              onClick={() => { navigate({ type: 'quizzes' }); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 rounded-lg"
            >
              Quizzes & Challenges
            </button>
            <button
              onClick={() => { navigate({ type: 'architecture' }); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 rounded-lg"
            >
              100k Concurrent Users Blueprint
            </button>
            <button
              onClick={() => { navigate({ type: 'dashboard' }); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 rounded-lg"
            >
              My Dashboard
            </button>
            <button
              onClick={() => { navigate({ type: 'admin' }); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 rounded-lg"
            >
              CMS Admin Studio
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
