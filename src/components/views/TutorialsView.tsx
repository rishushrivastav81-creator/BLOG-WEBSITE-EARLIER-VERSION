import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Terminal,
  Database,
  Code2,
  Sparkles,
  BookOpen,
  Clock,
  ArrowRight,
  Brain,
  Cpu,
  Workflow,
  Search,
  Server,
  Layers,
  GraduationCap,
  PlayCircle,
  Award,
  CheckCircle2,
  Compass,
} from 'lucide-react';

interface TutorialsViewProps {
  initialSubject?: string;
}

const allSubjectsList = [
  { id: 'all', label: 'All Curricula', icon: Layers, group: 'all' },
  { id: 'python', label: '1. Python Programming', icon: Terminal, group: 'foundations' },
  { id: 'sql', label: '2. SQL & Databases', icon: Database, group: 'data' },
  { id: 'dsa', label: '3. Data Structures & Algo', icon: Code2, group: 'foundations' },
  { id: 'data-analytics', label: '4. Data Analytics & Viz', icon: Layers, group: 'data' },
  { id: 'math-stats', label: '5. Mathematics for ML', icon: Cpu, group: 'ai' },
  { id: 'ml', label: '6. Machine Learning', icon: Cpu, group: 'ai' },
  { id: 'deep-learning', label: '7. Deep Learning', icon: Brain, group: 'ai' },
  { id: 'nlp', label: '8. Natural Language Proc.', icon: BookOpen, group: 'ai' },
  { id: 'llms', label: '9. Large Language Models', icon: Sparkles, group: 'frontier' },
  { id: 'generative-ai', label: '10. Generative AI', icon: Sparkles, group: 'frontier' },
  { id: 'rag', label: '11. Retrieval-Augmented Gen', icon: Database, group: 'frontier' },
  { id: 'agentic-ai', label: '12. AI Agents & Cognitive', icon: Workflow, group: 'frontier' },
  { id: 'ai-deployment', label: '13. AI APIs & Deployment', icon: Server, group: 'frontier' },
];

export const TutorialsView: React.FC<TutorialsViewProps> = ({ initialSubject }) => {
  const { courses, navigate, user } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'roadmap'>('cards');

  const filteredCourses = courses.filter((c) => {
    if (selectedSubject !== 'all' && c.subject !== selectedSubject) return false;
    if (selectedDifficulty !== 'all' && c.difficulty !== selectedDifficulty) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchTag = c.tagline.toLowerCase().includes(q);
      const matchSubject = String(c.subject).toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTag && !matchSubject) return false;
    }
    return true;
  });

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Academy Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-8 sm:p-10 text-white relative overflow-hidden border border-slate-800 shadow-lg">
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
          <GraduationCap className="w-96 h-96 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            <span className="px-2.5 py-1 bg-amber-400 text-slate-950 font-bold rounded">
              Meridian Code Academy
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-300">Inspired by GeeksforGeeks & freeCodeCamp</span>
            <span className="text-slate-400">·</span>
            <span className="text-amber-400">13 Complete Industry Roadmaps</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Curated Engineering Syllabi & Interactive Roadmaps
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            From Python primitives and SQL relational queries to transformer self-attention, RAG architectures, and autonomous cognitive agents. Each track includes stage progression, sandboxed runnable code, exercises with test cases, and knowledge quizzes.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Free & Public Syllabi</span>
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>In-Browser Sandboxed Runners</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-400" />
              <span>XP & Badges Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="space-y-4 pb-6 border-b border-slate-200">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search within courses */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search across all 13 subjects, concepts, or tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 focus:bg-white text-slate-900 border border-slate-200 rounded-lg outline-none transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>

          {/* Difficulty Dropdown & View Mode Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-500">Level:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="p-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-xs focus:outline-none"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Curriculum Cards
              </button>
              <button
                onClick={() => setViewMode('roadmap')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  viewMode === 'roadmap' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Roadmap Matrix
              </button>
            </div>
          </div>
        </div>

        {/* 13 Subject Track Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          {allSubjectsList.map((subj) => {
            const Icon = subj.icon;
            const isSelected = selectedSubject === subj.id;
            return (
              <button
                key={subj.id}
                onClick={() => setSelectedSubject(subj.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{subj.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Count summary */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-500">
        <span>Showing {filteredCourses.length} of {courses.length} technology curricula</span>
        {user.completedLessonIds.length > 0 && (
          <span className="text-emerald-700 font-semibold">
            {user.completedLessonIds.length} lessons completed across tracks
          </span>
        )}
      </div>

      {/* View Mode: Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCourses.map((course) => {
            const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
            const completedCount = course.modules
              .flatMap((m) => m.lessons)
              .filter((l) => user.completedLessonIds.includes(l.id)).length;
            const progressPercent = Math.round((completedCount / (totalLessons || 1)) * 100);
            const firstLesson = course.modules[0]?.lessons[0];

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all group"
              >
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      {getSubjectIcon(String(course.subject))}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                      <span className="capitalize font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                        {course.difficulty}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.estimatedHours}h Total</span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2
                      onClick={() => navigate({ type: 'course', courseSlug: course.slug })}
                      className="text-xl sm:text-2xl font-bold text-slate-950 group-hover:text-amber-600 transition-colors cursor-pointer"
                    >
                      {course.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  {/* Stages Quick Badge */}
                  {course.stages && course.stages.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                        Roadmap Stage Milestones
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {course.stages.map((stage, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] text-slate-700 space-y-0.5"
                          >
                            <span className="font-bold text-slate-900 block truncate">
                              Stage {idx + 1}
                            </span>
                            <span className="text-[10px] text-slate-500 capitalize block truncate">
                              {stage.level}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* What You Will Learn Bullets */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                      Key Competencies
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {course.whatYouWillLearn?.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* User Progress Bar */}
                  {completedCount > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-mono text-slate-500">
                        <span>Personal Progress</span>
                        <span className="font-semibold text-slate-800">
                          {progressPercent}% ({completedCount}/{totalLessons} lessons)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-900 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Strip: Roadmap Button & Quick Start */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-xs font-mono text-slate-500">
                    {course.modules.length} Modules · {totalLessons} Lessons
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {firstLesson && (
                      <button
                        onClick={() =>
                          navigate({
                            type: 'lesson',
                            courseSlug: course.slug,
                            lessonSlug: firstLesson.slug,
                          })
                        }
                        className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-200/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Jump directly into Lesson 1"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Start Lesson 1</span>
                      </button>
                    )}

                    <button
                      onClick={() => navigate({ type: 'course', courseSlug: course.slug })}
                      className="px-4 py-2 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Explore Roadmap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Mode: Roadmap Matrix View */}
      {viewMode === 'roadmap' && (
        <div className="space-y-8">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-center gap-2 font-mono">
            <Compass className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Interactive Roadmap Matrix: Ordered stages from beginner foundations to production mastery across all 13 domains.</span>
          </div>

          <div className="space-y-6">
            {filteredCourses.map((course, idx) => (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 hover:border-slate-300 transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center shrink-0">
                      {getSubjectIcon(String(course.subject))}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-600 uppercase">
                          Track #{idx + 1}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs font-mono capitalize text-slate-500">{course.difficulty}</span>
                      </div>
                      <h3
                        onClick={() => navigate({ type: 'course', courseSlug: course.slug })}
                        className="text-lg font-bold text-slate-950 hover:text-amber-600 cursor-pointer"
                      >
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate({ type: 'course', courseSlug: course.slug })}
                    className="px-4 py-2 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <span>View Roadmap & Syllabus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Stage Progression Pipeline */}
                {course.stages && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    {course.stages.map((stage, sIdx) => (
                      <div
                        key={sIdx}
                        className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 space-y-1 relative"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-semibold">
                          <span>Stage {sIdx + 1}</span>
                          <span className="capitalize text-slate-400">{stage.level}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{stage.name}</h4>
                        <p className="text-[11px] text-slate-600 line-clamp-2">{stage.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
