import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  Award,
  Sparkles,
  Bookmark,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  Database,
  Terminal,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { user, articles, courses, practiceProblems, quizzes, navigate, toggleBookmark } = useApp();

  const bookmarkedArticles = articles.filter((a) => user.bookmarkedArticleIds.includes(a.id));
  const completedLessons = courses
    .flatMap((c) => c.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, courseSlug: c.slug }))))
    .filter((l) => user.completedLessonIds.includes(l.id));

  const solvedProblems = practiceProblems.filter((p) => user.solvedProblemIds.includes(p.id));

  const xpForNextLevel = user.level * 200;
  const xpCurrentLevel = user.xp % 200;
  const levelProgress = Math.min(100, Math.round((xpCurrentLevel / 200) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* User Header Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-950">{user.name}</h1>
              <span className="text-[11px] font-mono uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">{user.email}</p>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-600 pt-1">
              <span className="flex items-center gap-1 text-amber-600 font-bold">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>{user.streakDays}-Day Learning Streak</span>
              </span>
              <span>·</span>
              <span>Level {user.level} Member</span>
            </div>
          </div>
        </div>

        {/* XP Progress Capsule */}
        <div className="w-full md:w-64 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-500">Mastery Progress</span>
            <span className="font-bold text-slate-900">{user.xp} Total XP</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-900 rounded-full transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <div className="text-[11px] font-mono text-slate-400 text-right">
            {200 - xpCurrentLevel} XP until Level {user.level + 1}
          </div>
        </div>
      </div>

      {/* Badges & Achievements Ribbon */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          <span>Earned Accreditations & Badges ({user.badges.length})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {user.badges.map((badge) => (
            <div
              key={badge.id}
              className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3 shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-slate-900">{badge.name}</h3>
                <p className="text-[11px] text-slate-500 leading-snug">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grid: Saved Articles & Curriculum Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Reading List */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-slate-700" />
              <span>Bookmarked Dispatches ({bookmarkedArticles.length})</span>
            </h2>
            <button
              onClick={() => navigate({ type: 'blog' })}
              className="text-xs font-mono text-slate-500 hover:text-slate-900"
            >
              Explore more →
            </button>
          </div>

          {bookmarkedArticles.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No bookmarked articles yet. Click Save on any dispatch!</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {bookmarkedArticles.map((art) => (
                <div key={art.id} className="py-3 flex items-center justify-between gap-4">
                  <div
                    onClick={() => navigate({ type: 'article', slug: art.slug })}
                    className="cursor-pointer group space-y-0.5 flex-1"
                  >
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{art.category}</div>
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-slate-600 transition-colors line-clamp-1">
                      {art.title}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBookmark(art.id)}
                    className="text-xs text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Lessons & Exercises */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Completed Lessons ({completedLessons.length})</span>
            </h2>
            <button
              onClick={() => navigate({ type: 'tutorials' })}
              className="text-xs font-mono text-slate-500 hover:text-slate-900"
            >
              All tracks →
            </button>
          </div>

          {completedLessons.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">You have not completed any curriculum lessons yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {completedLessons.map((l) => (
                <div
                  key={l.id}
                  onClick={() =>
                    navigate({
                      type: 'lesson',
                      courseSlug: l.courseSlug,
                      lessonSlug: l.slug,
                    })
                  }
                  className="py-3 flex items-center justify-between cursor-pointer group"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-slate-600 transition-colors">
                      {l.title}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">{l.estimatedMinutes} min completed</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Solved Problems in Arena */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-700" />
          <span>Solved Practice Arena Challenges ({solvedProblems.length})</span>
        </h2>

        {solvedProblems.length === 0 ? (
          <p className="text-xs text-slate-500">Visit the Practice Arena to write and verify Python & SQL solutions.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {solvedProblems.map((sp) => (
              <div
                key={sp.id}
                onClick={() => navigate({ type: 'practice', problemSlug: sp.slug, mode: sp.category })}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900">{sp.title}</div>
                  <div className="text-[11px] font-mono text-slate-500 uppercase">{sp.category} · {sp.difficulty}</div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600">✓ PASSED</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
