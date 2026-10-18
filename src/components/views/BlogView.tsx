import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArticleCategory } from '../../types';
import { Search, Compass, Cpu, Layers, Bookmark, ArrowUpRight } from 'lucide-react';

interface BlogViewProps {
  initialCategory?: ArticleCategory;
  initialTag?: string;
}

export const BlogView: React.FC<BlogViewProps> = ({ initialCategory, initialTag }) => {
  const { articles, navigate, toggleBookmark, user } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>(
    initialCategory || 'all'
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag || null);
  const [search, setSearch] = useState('');

  // Collect all unique tags
  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags)));

  // Filter articles
  const filteredArticles = articles.filter((a) => {
    if (a.status !== 'published') return false;
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    if (selectedTag && !a.tags.includes(selectedTag)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchExcerpt = a.excerpt.toLowerCase().includes(q);
      const matchBody = a.body.toLowerCase().includes(q);
      const matchAuthor = a.author.name.toLowerCase().includes(q);
      if (!matchTitle && !matchExcerpt && !matchBody && !matchAuthor) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Category Intro */}
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500">
          <span>The PadhoWithUs Journal</span>
          <span>·</span>
          <span>Technical Dispatches & Nomad Guides</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
          Engineering Craftsmanship & Global Expeditions
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Deep architectural investigations, database internals, and hands-on travel guides for engineers building systems across borders.
        </p>
      </div>

      {/* Filter Bar: Segmented controls (Buttons with active states allowed as per zero-pill rules) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setSelectedCategory('all'); setSelectedTag(null); }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              selectedCategory === 'all' && !selectedTag
                ? 'bg-slate-950 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            All Dispatches ({articles.filter((a) => a.status === 'published').length})
          </button>
          <button
            onClick={() => { setSelectedCategory('engineering'); setSelectedTag(null); }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'engineering'
                ? 'bg-slate-950 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Systems & Backend</span>
          </button>
          <button
            onClick={() => { setSelectedCategory('travel'); setSelectedTag(null); }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'travel'
                ? 'bg-slate-950 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Nomad Travel Guides</span>
          </button>
          <button
            onClick={() => { setSelectedCategory('ai'); setSelectedTag(null); }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'ai'
                ? 'bg-slate-950 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI & LLM Architecture</span>
          </button>
        </div>

        {/* Local Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 focus:bg-white text-slate-900 border border-slate-200 rounded-lg outline-none transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Tag Ribbon */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <span className="text-slate-400 font-mono uppercase tracking-wider text-[11px] mr-1">Topics:</span>
        {allTags.slice(0, 10).map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
              selectedTag === tag
                ? 'bg-slate-800 text-white font-medium'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            #{tag}
          </button>
        ))}
        {selectedTag && (
          <button
            onClick={() => setSelectedTag(null)}
            className="text-xs text-amber-600 hover:underline ml-2"
          >
            Clear tag filter
          </button>
        )}
      </div>

      {/* Articles Listing */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-base font-semibold text-slate-900">No matching articles found</p>
          <p className="text-xs text-slate-500">
            Try adjusting your search keywords or clearing active category filters.
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSelectedTag(null); setSearch(''); }}
            className="mt-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="h-52 overflow-hidden relative group">
                <img
                  src={art.coverImage}
                  alt={art.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(art.id);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition-colors ${
                    user.bookmarkedArticleIds.includes(art.id)
                      ? 'bg-slate-950 text-amber-400'
                      : 'bg-white/80 text-slate-700 hover:bg-white'
                  }`}
                  title={user.bookmarkedArticleIds.includes(art.id) ? 'Saved' : 'Save article'}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  {/* Zero-Pill metadata: clean unboxed text with · separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span className="capitalize">{art.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{art.readTimeMinutes} min read</span>
                    <span aria-hidden="true">·</span>
                    <span>{art.publishedAt}</span>
                  </div>

                  <h2
                    onClick={() => navigate({ type: 'article', slug: art.slug })}
                    className="text-lg font-bold text-slate-950 hover:text-slate-700 cursor-pointer leading-snug transition-colors line-clamp-2"
                  >
                    {art.title}
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <img
                      src={art.author.avatar}
                      alt={art.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-medium truncate max-w-[130px]">{art.author.name}</span>
                  </div>

                  <button
                    onClick={() => navigate({ type: 'article', slug: art.slug })}
                    className="text-xs font-semibold text-slate-900 hover:text-slate-600 cursor-pointer flex items-center gap-1"
                  >
                    <span>Read Dispatch</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
