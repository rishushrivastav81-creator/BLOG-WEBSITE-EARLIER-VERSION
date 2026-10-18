import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  Clock,
  BookOpen,
  ArrowRight,
  Award,
  Layers,
  Wrench,
  Check,
  FolderGit2,
  Sparkles,
  Terminal,
  Database,
  Code2,
  Cpu,
  Brain,
  Workflow,
  Server,
  HelpCircle,
} from 'lucide-react';

interface CourseOverviewProps {
  courseSlug: string;
}

export const CourseOverviewView: React.FC<CourseOverviewProps> = ({ courseSlug }) => {
  const { courses, navigate, user } = useApp();

  const course = courses.find((c) => c.slug === courseSlug) || courses[0];
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completedLessons = allLessons.filter((l) => user.completedLessonIds.includes(l.id));

  // Determine the next uncompleted lesson or first lesson
  const nextLesson = allLessons.find((l) => !user.completedLessonIds.includes(l.id)) || allLessons[0];
  const progressPercent = Math.round((completedLessons.length / (allLessons.length || 1)) * 100);

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'python':
        return <Terminal className="w-5 h-5 text-amber-500" />;
      case 'sql':
        return <Database className="w-5 h-5 text-sky-500" />;
      case 'dsa':
        return <Code2 className="w-5 h-5 text-emerald-500" />;
      case 'data-analytics':
        return <Layers className="w-5 h-5 text-indigo-500" />;
      case 'math-stats':
        return <Cpu className="w-5 h-5 text-violet-500" />;
      case 'ml':
        return <Cpu className="w-5 h-5 text-cyan-500" />;
      case 'deep-learning':
        return <Brain className="w-5 h-5 text-purple-500" />;
      case 'nlp':
        return <BookOpen className="w-5 h-5 text-teal-500" />;
      case 'llms':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'generative-ai':
        return <Sparkles className="w-5 h-5 text-pink-500" />;
      case 'rag':
        return <Database className="w-5 h-5 text-blue-500" />;
      case 'agentic-ai':
        return <Workflow className="w-5 h-5 text-rose-500" />;
      case 'ai-deployment':
        return <Server className="w-5 h-5 text-emerald-500" />;
      default:
        return <Brain className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button & Subject Switcher Strip */}
      <div className="space-y-4">
        <button
          onClick={() => navigate({ type: 'tutorials' })}
          className="flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All 13 Roadmaps</span>
        </button>

        {/* Quick track switcher pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {courses.map((c) => {
            const isActive = c.slug === course.slug;
            return (
              <button
                key={c.id}
                onClick={() => navigate({ type: 'course', courseSlug: c.slug })}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-950 text-white font-bold shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{c.title.split(' ')[0]}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Roadmap Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 space-y-8 shadow-xs">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500">
            <span className="uppercase text-amber-600 font-bold bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 flex items-center gap-1.5">
              {getSubjectIcon(String(course.subject))}
              <span>{course.subject}</span>
            </span>
            <span>·</span>
            <span className="capitalize font-medium text-slate-700">{course.difficulty} Track</span>
            <span>·</span>
            <span>{course.estimatedHours} Hours Estimated</span>
            <span>·</span>
            <span>{allLessons.length} Comprehensive Lessons</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950">
            {course.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            {course.description}
          </p>
        </div>

        {/* Progress & Quick Action CTAs */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 flex-1 max-w-md">
            <div className="flex justify-between text-xs font-mono text-slate-600">
              <span>Overall Track Progress</span>
              <span className="font-bold text-slate-900">
                {progressPercent}% ({completedLessons.length}/{allLessons.length} lessons completed)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {completedLessons.length > 0 && nextLesson ? (
              <button
                onClick={() =>
                  navigate({
                    type: 'lesson',
                    courseSlug: course.slug,
                    lessonSlug: nextLesson.slug,
                  })
                }
                className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Continue Learning ({nextLesson.title.slice(0, 25)}...)</span>
              </button>
            ) : (
              <button
                onClick={() =>
                  navigate({
                    type: 'lesson',
                    courseSlug: course.slug,
                    lessonSlug: allLessons[0]?.slug || '',
                  })
                }
                className="px-5 py-2.5 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Start Learning Track</span>
              </button>
            )}

            <button
              onClick={() => navigate({ type: 'practice' })}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Practice Arena
            </button>
          </div>
        </div>
      </div>

      {/* What You Will Learn & Prerequisites Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* What You Will Learn */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>What You Will Be Able to Do</span>
          </h2>
          <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
            {course.whatYouWillLearn?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prerequisites & Required Tools */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Prerequisites</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {course.prerequisites?.map((pre, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>{pre}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-slate-500" />
              <span>Required Tools & Environment</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {course.requiredTools?.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-mono bg-slate-100 text-slate-800 rounded-md border border-slate-200"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Stages Roadmap Timeline */}
      {course.stages && course.stages.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-950">Milestone Progression Stages</h2>
            <span className="text-xs font-mono text-slate-500">Ordered Learning Pipeline</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {course.stages.map((stage, sIdx) => (
              <div
                key={sIdx}
                className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 relative overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-amber-600 font-bold">
                    Stage {sIdx + 1}
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono capitalize bg-slate-100 rounded text-slate-600 font-semibold">
                    {stage.level}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{stage.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{stage.description}</p>
                <div className="pt-2 text-[11px] font-mono text-slate-500 border-t border-slate-100">
                  <span className="text-slate-400 font-semibold">Focus: </span>
                  {stage.focusModules.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Complete Ordered Syllabus with Module Hours */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Complete Ordered Syllabus</h2>
            <p className="text-xs text-slate-500 mt-0.5">Click any lesson to read concepts, run code in the sandbox, and take the quiz.</p>
          </div>
          <span className="text-xs font-mono text-slate-500 whitespace-nowrap">
            {course.modules.length} Modules · {allLessons.length} Lessons
          </span>
        </div>

        <div className="space-y-6">
          {course.modules.map((mod, modIdx) => (
            <div key={mod.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-5 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-950">{mod.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{mod.description}</p>
                </div>
                <span className="text-xs font-mono text-slate-500 whitespace-nowrap">
                  {mod.estimatedHours || 5}h study time · {mod.lessons.length} lessons
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {mod.lessons.map((les) => {
                  const isDone = user.completedLessonIds.includes(les.id);
                  return (
                    <div
                      key={les.id}
                      onClick={() =>
                        navigate({
                          type: 'lesson',
                          courseSlug: course.slug,
                          lessonSlug: les.slug,
                        })
                      }
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-6 h-6 flex items-center justify-center shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-300 group-hover:border-slate-500 transition-colors" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                            {les.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                            <span>{les.estimatedMinutes} min</span>
                            <span>·</span>
                            <span>Runnable Sandbox, Debugging & Quiz</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 group-hover:text-slate-950">
                        <span>Launch Lesson</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Projects */}
      {course.recommendedProjects && course.recommendedProjects.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-slate-700" />
            <span>Recommended Real-World Projects</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {course.recommendedProjects.map((proj, pIdx) => (
              <div key={pIdx} className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-900">{proj.title}</span>
                  <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-slate-600">{proj.difficulty}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.technologies.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-[10px] font-mono bg-slate-100 text-slate-700 rounded border border-slate-200/50">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Topic Quiz & Practice Banner */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-lg">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Award className="w-4 h-4" />
            <span>Skill Verification</span>
          </div>
          <h3 className="text-xl font-bold">Ready to test your mastery?</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Earn experience points (XP) and unlock exclusive badges by taking the timed topic challenge or solving coding problems in the practice arena.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ type: 'quizzes' })}
            className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-xs"
          >
            Take Topic Quiz
          </button>
          <button
            onClick={() => navigate({ type: 'practice' })}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Open Practice Arena
          </button>
        </div>
      </section>
    </div>
  );
};
