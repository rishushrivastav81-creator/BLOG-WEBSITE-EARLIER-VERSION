import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Filter, BookOpen, FileText, Terminal, ArrowRight } from 'lucide-react';

interface SearchViewProps {
  initialQuery?: string;
}

export const SearchView: React.FC<SearchViewProps> = ({ initialQuery = '' }) => {
  const { articles, courses, practiceProblems, navigate } = useApp();
  const [query, setQuery] = useState(initialQuery);
  const [filterType, setFilterType] = useState<'all' | 'articles' | 'tutorials' | 'practice'>('all');

  const q = query.toLowerCase().trim();

  // Search articles
  const matchedArticles = articles.filter((a) => {
    if (!q) return true;
    return (
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q)) ||
      a.author.name.toLowerCase().includes(q)
    );
  });

  // Search courses & lessons
  const matchedCourses = courses.filter((c) => {
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      c.modules.some((m) =>
        m.lessons.some((l) => l.title.toLowerCase().includes(q) || l.objectives.some((o) => o.toLowerCase().includes(q)))
      )
    );
  });

  // Search practice problems
  const matchedProblems = practiceProblems.filter((p) => {
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const totalResults =
    (filterType === 'all' || filterType === 'articles' ? matchedArticles.length : 0) +
    (filterType === 'all' || filterType === 'tutorials' ? matchedCourses.length : 0) +
    (filterType === 'all' || filterType === 'practice' ? matchedProblems.length : 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Input Bar */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
          Knowledge Base & Index Search
        </h1>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, e.g. 'Postgres', 'Asyncio', 'Kyoto', 'Generators'..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-sans focus:border-slate-400 focus:outline-none shadow-xs"
            autoFocus
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4 text-xs font-semibold">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
            filterType === 'all' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Results ({totalResults})
        </button>
        <button
          onClick={() => setFilterType('articles')}
          className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
            filterType === 'articles' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Dispatches ({matchedArticles.length})
        </button>
        <button
          onClick={() => setFilterType('tutorials')}
          className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
            filterType === 'tutorials' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Courses & Lessons ({matchedCourses.length})
        </button>
        <button
          onClick={() => setFilterType('practice')}
          className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
            filterType === 'practice' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Practice Problems ({matchedProblems.length})
        </button>
      </div>

      {/* Results Matrix */}
      <div className="space-y-6">
        {totalResults === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-2">
            <p className="text-base font-bold text-slate-900">No results found for "{query}"</p>
            <p className="text-xs text-slate-500">
              Try searching for "Go", "Python", "SQL", "LRU Cache", or "Lisbon".
            </p>
          </div>
        ) : (
          <>
            {/* Articles */}
            {(filterType === 'all' || filterType === 'articles') && matchedArticles.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Journal Dispatches
                </h2>
                <div className="divide-y divide-slate-100 bg-white rounded-xl border border-slate-200 overflow-hidden">
                  {matchedArticles.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => navigate({ type: 'article', slug: art.slug })}
                      className="p-4 sm:p-5 hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-4 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                          <span className="capitalize text-slate-900 font-semibold">{art.category}</span>
                          <span>·</span>
                          <span>{art.readTimeMinutes} min read</span>
                          <span>·</span>
                          <span>By {art.author.name}</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">{art.title}</h3>
                        <p className="text-xs text-slate-600 line-clamp-1">{art.excerpt}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Courses */}
            {(filterType === 'all' || filterType === 'tutorials') && matchedCourses.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Curricula & Lessons
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchedCourses.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => navigate({ type: 'course', courseSlug: c.slug })}
                      className="p-5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm cursor-pointer space-y-2 transition-all"
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                        <span className="uppercase font-semibold text-slate-900">{c.subject}</span>
                        <span className="capitalize">{c.difficulty}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-950">{c.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{c.tagline}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Practice Problems */}
            {(filterType === 'all' || filterType === 'practice') && matchedProblems.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Interactive Practice Challenges
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchedProblems.map((prob) => (
                    <div
                      key={prob.id}
                      onClick={() => navigate({ type: 'practice', problemSlug: prob.slug, mode: prob.category })}
                      className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 cursor-pointer space-y-2 transition-all"
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                        <span className="uppercase text-amber-600 font-bold">{prob.category}</span>
                        <span className="capitalize">{prob.difficulty}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{prob.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{prob.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
