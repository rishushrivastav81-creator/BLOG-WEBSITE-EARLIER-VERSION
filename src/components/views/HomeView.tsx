import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Code2, Database, BookOpen, Terminal, Sparkles, Compass } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { articles, courses, practiceProblems, quizzes, navigate, toggleBookmark, user } = useApp();

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const recentArticles = articles.filter((a) => a.id !== featuredArticle.id).slice(0, 4);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section: 2-Column Split Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col justify-between py-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                <span>Featured Technical Dispatch</span>
                <span aria-hidden="true">·</span>
                <span>{featuredArticle.category.toUpperCase()}</span>
                <span aria-hidden="true">·</span>
                <span>{featuredArticle.readTimeMinutes} MIN READ</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15] text-balance">
                {featuredArticle.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {featuredArticle.excerpt}
              </p>
            </div>

            {/* Author Attribution & Primary CTA */}
            <div className="pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
              <div className="flex items-center gap-3">
                <img
                  src={featuredArticle.author.avatar}
                  alt={featuredArticle.author.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{featuredArticle.author.name}</div>
                  <div className="text-xs text-slate-500">{featuredArticle.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleBookmark(featuredArticle.id)}
                  className="px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
                >
                  {user.bookmarkedArticleIds.includes(featuredArticle.id) ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={() => navigate({ type: 'article', slug: featuredArticle.slug })}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 h-[360px] lg:h-auto min-h-[360px] relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
            <img
              src="/src/assets/images/hero_nomad_coding_1792296527037.jpg"
              alt="Engineer coding on terrace overlooking Mediterranean coast"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
              <span className="text-xs font-mono text-amber-300 uppercase tracking-wider mb-1">Dispatch from Amalfi & Kyoto</span>
              <p className="text-sm font-medium text-white/90">
                Field notes on autonomous engineering routines, fiber availability, and deep work setups.
              </p>
            </div>
          </div>
        </div>

        {/* 4-Column KPI Trust Strip below hero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 mt-10 border-y border-slate-200/80">
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">120,000+</div>
            <div className="text-xs text-slate-500">Monthly Engineers & Readers</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">13 Tracks</div>
            <div className="text-xs text-slate-500">Python, SQL, ML, RAG & Agents</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">O(1) Practice</div>
            <div className="text-xs text-slate-500">In-Browser Sandboxed Runners</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">100% Real</div>
            <div className="text-xs text-slate-500">Verified Relational Schemas</div>
          </div>
        </div>
      </section>

      {/* Structured Tutorials & Courses (GeeksforGeeks / freeCodeCamp inspired) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-600 mb-1 font-bold">
              Meridian Technology Roadmaps
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              Structured Engineering Curricula
            </h2>
          </div>
          <button
            onClick={() => navigate({ type: 'tutorials' })}
            className="text-xs font-semibold text-slate-900 hover:text-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Browse All 13 Syllabi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.slice(0, 4).map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900">
                  {course.subject === 'python' && <Terminal className="w-5 h-5 text-amber-600" />}
                  {course.subject === 'sql' && <Database className="w-5 h-5 text-sky-600" />}
                  {course.subject === 'dsa' && <Code2 className="w-5 h-5 text-emerald-600" />}
                  {course.subject !== 'python' && course.subject !== 'sql' && course.subject !== 'dsa' && <Sparkles className="w-5 h-5 text-purple-600" />}
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-mono">
                    <span className="capitalize">{course.difficulty}</span>
                    <span>·</span>
                    <span>{course.estimatedHours}h total</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-950 leading-snug">
                    {course.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {course.tagline}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">
                  {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons
                </span>
                <button
                  onClick={() => navigate({ type: 'course', courseSlug: course.slug })}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  Start Track →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Technical Dispatches & Nomad Travel Guides Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
              Editorial Dispatches
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              Systems Engineering & Travel Guides
            </h2>
          </div>
          <button
            onClick={() => navigate({ type: 'blog' })}
            className="text-xs font-semibold text-slate-900 hover:text-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentArticles.map((art) => (
            <article
              key={art.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={art.coverImage}
                  alt={art.imageAlt}
                  className="w-full h-full object-cover hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span className="capitalize">{art.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{art.readTimeMinutes} min read</span>
                    <span aria-hidden="true">·</span>
                    <span>{art.publishedAt}</span>
                  </div>

                  <h3
                    onClick={() => navigate({ type: 'article', slug: art.slug })}
                    className="text-lg font-bold text-slate-950 hover:text-slate-700 cursor-pointer leading-snug transition-colors line-clamp-2"
                  >
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
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
                    <span className="font-medium truncate max-w-[120px]">{art.author.name}</span>
                  </div>

                  <button
                    onClick={() => navigate({ type: 'article', slug: art.slug })}
                    className="text-xs font-semibold text-slate-900 hover:text-slate-600 cursor-pointer flex items-center gap-1"
                  >
                    Read →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive Practice Arena Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-8 lg:p-12 border border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
                <Code2 className="w-4 h-4" />
                <span>Interactive Sandboxed Practice Arena</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Write Code. Execute SQL. Pass Verified Unit Tests.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                Test your algorithmic logic in Python or run live analytical queries on our seeded relational database. No mock data or fake counters: real schema evaluation in your browser.
              </p>
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate({ type: 'practice', mode: 'sql' })}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  Try SQL Challenge
                </button>
                <button
                  onClick={() => navigate({ type: 'practice', mode: 'python' })}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-700"
                >
                  Solve Python Challenge
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-800 text-[11px]">
                <span>query_editor.sql</span>
                <span>Postgres 16.2 Runtime</span>
              </div>
              <div className="text-amber-300">SELECT d.name, SUM(e.salary) AS payroll</div>
              <div>FROM departments d</div>
              <div>JOIN employees e ON e.dept_id = d.id</div>
              <div>GROUP BY d.name ORDER BY payroll DESC;</div>
              <div className="pt-2 text-emerald-400 text-[11px]">
                ✓ 4 rows returned in 1.4ms (Memory: 64 KB)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gamified Quiz Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Skill Verification & Gamification</span>
            </div>
            <h3 className="text-xl font-bold text-slate-950">
              Ready to test your systems & SQL architecture knowledge?
            </h3>
            <p className="text-sm text-slate-600 max-w-xl">
              Take timed topic assessments, analyze query plans, earn XP, and unlock verified engineering badges for your portfolio.
            </p>
          </div>

          <button
            onClick={() => navigate({ type: 'quizzes' })}
            className="px-6 py-3 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors shrink-0 cursor-pointer shadow-sm"
          >
            Launch Topic Quiz (+150 XP)
          </button>
        </div>
      </section>
    </div>
  );
};
