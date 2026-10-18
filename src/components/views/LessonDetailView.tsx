import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { executePythonCode } from '../../utils/pythonRunner';
import { executeRestrictedSql } from '../../utils/sqlRunner';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Play,
  RotateCcw,
  Eye,
  EyeOff,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Info,
  Terminal,
  ExternalLink,
  Code2,
} from 'lucide-react';

interface LessonDetailViewProps {
  courseSlug: string;
  lessonSlug: string;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({ courseSlug, lessonSlug }) => {
  const { courses, navigate, user, completeLesson } = useApp();

  const course = courses.find((c) => c.slug === courseSlug) || courses[0];
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
  const lesson = currentIndex >= 0 ? allLessons[currentIndex] : allLessons[0];

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Interactive sandbox state for runnable example
  const [sandboxCode, setSandboxCode] = useState(lesson.runnableExample.code);
  const [sandboxOutput, setSandboxOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Exercise state
  const [exerciseCode, setExerciseCode] = useState(lesson.exercise.starterCode);
  const [showSolution, setShowSolution] = useState(false);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(-1);
  const [exerciseFeedback, setExerciseFeedback] = useState<string | null>(null);

  // Lesson Quiz state
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Synchronize state whenever lesson changes
  useEffect(() => {
    setSandboxCode(lesson.runnableExample.code);
    setSandboxOutput(null);
    setExerciseCode(lesson.exercise.starterCode);
    setShowSolution(false);
    setActiveHintIndex(-1);
    setExerciseFeedback(null);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lesson.id, lesson.slug]);

  const isCompleted = user.completedLessonIds.includes(lesson.id);

  // Run the in-lesson code example
  const handleRunExample = () => {
    setIsExecuting(true);
    setTimeout(() => {
      if (lesson.runnableExample.language === 'python') {
        const res = executePythonCode(sandboxCode);
        setSandboxOutput(res.stdout || res.stderr);
      } else {
        const res = executeRestrictedSql(sandboxCode);
        if (res.success) {
          const header = res.columns.join(' | ');
          const rows = res.rows.map((r) => r.join(' | ')).join('\n');
          setSandboxOutput(
            `${header}\n${'-'.repeat(header.length)}\n${rows}\n(${res.rowCount} rows in ${res.executionTimeMs}ms)`
          );
        } else {
          setSandboxOutput(res.error || 'SQL Execution Error');
        }
      }
      setIsExecuting(false);
    }, 150);
  };

  const handleRunExercise = () => {
    if (exerciseCode.includes('pass') && !exerciseCode.includes('yield') && !exerciseCode.includes('return')) {
      setExerciseFeedback('Implementation incomplete. Replace "pass" with working logic!');
      return;
    }
    const res = executePythonCode(exerciseCode, lesson.exercise.testCases);
    if (res.success) {
      setExerciseFeedback('✓ Excellent! All test cases passed for this exercise.');
    } else {
      setExerciseFeedback('Some test cases did not pass. Check the hints or try running your code again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
        <button
          onClick={() => navigate({ type: 'course', courseSlug: course.slug })}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {course.title} Syllabus</span>
        </button>
        <div className="flex items-center gap-2">
          <span>{course.title}</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-[200px]">{lesson.title}</span>
        </div>
      </div>

      {/* Lesson Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider">
          <span>Lesson {lesson.order}</span>
          <span>·</span>
          <span>Estimated: {lesson.estimatedMinutes} Minutes</span>
          <span>·</span>
          <span>+50 XP upon completion</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
          {lesson.title}
        </h1>

        {/* Quick Jump Table of Contents Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none pt-2 border-t border-slate-200">
          <span className="text-slate-400 font-semibold whitespace-nowrap mr-1">Jump to:</span>
          <a href="#section-objectives" className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 whitespace-nowrap transition-colors">01. Objectives</a>
          <a href="#section-concept" className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 whitespace-nowrap transition-colors">02. Theory</a>
          <a href="#section-syntax" className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 whitespace-nowrap transition-colors">05. Syntax</a>
          <a href="#section-sandbox" className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 rounded text-amber-900 font-semibold whitespace-nowrap transition-colors">08. Sandbox</a>
          <a href="#section-pitfalls" className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 rounded text-rose-800 whitespace-nowrap transition-colors">12. Pitfalls</a>
          <a href="#section-exercise" className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 rounded text-emerald-900 font-semibold whitespace-nowrap transition-colors">13. Exercise</a>
          <a href="#section-quiz" className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 rounded text-purple-900 font-semibold whitespace-nowrap transition-colors">15. Quiz</a>
        </div>
      </div>

      {/* 1. Learning Objectives */}
      <section id="section-objectives" className="bg-slate-50 rounded-xl p-6 border border-slate-200/80 space-y-3 shadow-xs scroll-mt-20">
        <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-700" />
          <span>01. Lesson Title & Learning Objectives</span>
        </h2>
        <ul className="space-y-2 text-sm text-slate-700">
          {lesson.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="text-amber-500 font-bold font-mono text-xs mt-0.5">•</span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 2. Simple Beginner-Friendly Explanation */}
      <section id="section-concept" className="space-y-3 scroll-mt-20">
        <h2 className="text-xl font-bold text-slate-950">02. Beginner-Friendly Explanation</h2>
        <div className="text-slate-700 leading-relaxed text-sm sm:text-base space-y-3 whitespace-pre-line">
          {lesson.conceptExplanation}
        </div>
      </section>

      {/* 3. Real-World Analogy */}
      {lesson.analogy && (
        <section className="bg-amber-50/50 rounded-xl p-6 border border-amber-200/70 space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-amber-900 flex items-center gap-2 font-bold">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>03. Real-World Analogy</span>
          </h3>
          <p className="text-sm text-amber-950 leading-relaxed italic">
            "{lesson.analogy}"
          </p>
        </section>
      )}

      {/* 4. Why the Concept Matters */}
      {lesson.whyItMatters && (
        <section className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-900 font-bold flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-700" />
            <span>04. Why the Concept Matters in Production</span>
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {lesson.whyItMatters}
          </p>
        </section>
      )}

      {/* 5. Syntax and Important Terminology */}
      <section id="section-syntax" className="space-y-3 scroll-mt-20">
        <h2 className="text-lg font-bold text-slate-950">05. Syntax & Important Terminology</h2>
        <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs border border-slate-800 leading-relaxed whitespace-pre-wrap">
          {lesson.syntaxGuide}
        </div>
      </section>

      {/* 6. Basic Example */}
      {lesson.basicExample && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-950">06. Basic Example</h2>
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <p className="text-xs text-slate-600 leading-relaxed">{lesson.basicExample.explanation}</p>
            <pre className="p-3 bg-slate-950 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto">
              {lesson.basicExample.code}
            </pre>
            <div className="text-xs font-mono text-slate-500">
              Output: <span className="text-slate-800 font-bold">{lesson.basicExample.output}</span>
            </div>
          </div>
        </section>
      )}

      {/* 7. Practical Example */}
      {lesson.practicalExample && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-950">07. Practical Production Example</h2>
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <p className="text-xs text-slate-600 leading-relaxed">{lesson.practicalExample.explanation}</p>
            <pre className="p-3 bg-slate-950 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto">
              {lesson.practicalExample.code}
            </pre>
            <div className="text-xs font-mono text-slate-500 whitespace-pre-wrap">
              Output: <span className="text-slate-800 font-bold">{lesson.practicalExample.output}</span>
            </div>
          </div>
        </section>
      )}

      {/* 8. Code with Syntax Highlighting & Sandbox */}
      {/* 9. Line-by-Line Explanation */}
      {/* 10. Expected Output */}
      {/* 11. How to Run */}
      <section id="section-sandbox" className="space-y-4 scroll-mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-950">
            08-11. Interactive Runnable Example & Line-by-Line Mechanics
          </h2>
          <span className="text-xs font-mono text-slate-500 uppercase">Live Sandbox</span>
        </div>

        {/* 8 & 10. Sandbox Editor & Output */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden font-mono text-xs">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider">
              {lesson.runnableExample.language.toUpperCase()} ENGINE
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSandboxCode(lesson.runnableExample.code);
                  setSandboxOutput(null);
                }}
                className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded transition-colors cursor-pointer text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleRunExample}
                disabled={isExecuting}
                className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1 font-semibold rounded transition-colors cursor-pointer text-[11px]"
              >
                <Play className="w-3 h-3 fill-slate-950" />
                <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
              </button>
            </div>
          </div>

          <textarea
            rows={10}
            value={sandboxCode}
            onChange={(e) => setSandboxCode(e.target.value)}
            className="w-full p-4 bg-transparent text-slate-200 focus:outline-none resize-y font-mono text-xs leading-relaxed"
          />

          {/* 10. Expected / Actual Output */}
          <div className="border-t border-slate-800 bg-slate-900/90 p-4 space-y-1">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              {sandboxOutput ? 'Console Output (Actual):' : 'Expected Standard Output:'}
            </div>
            <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
              {sandboxOutput || lesson.runnableExample.expectedOutput}
            </pre>
          </div>
        </div>

        {/* 9. Line-by-Line Breakdown */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-mono uppercase tracking-wider text-slate-500 font-semibold">
            09. Line-by-Line Walkthrough
          </h3>
          {lesson.stepByStepCode.map((step) => (
            <div key={step.step} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-900">
                Step {step.step}: {step.description}
              </div>
              <pre className="bg-slate-950 text-slate-200 p-2.5 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed">
                {step.code}
              </pre>
            </div>
          ))}
        </div>

        {/* 11. How to Run */}
        {lesson.howToRun && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono">
            <strong>11. How to Run:</strong> {lesson.howToRun}
          </div>
        )}
      </section>

      {/* 12. Common Errors and Debugging Tips */}
      <section id="section-pitfalls" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span>12. Common Errors & Debugging Tips</span>
        </h2>
        <div className="space-y-3">
          {lesson.commonMistakes.map((cm, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 shadow-xs">
              <div className="text-xs font-semibold text-rose-700">Common Pitfall: {cm.mistake}</div>
              <div className="text-xs text-slate-700 leading-relaxed font-mono bg-slate-50 p-2.5 rounded border border-slate-100">
                Debugging Fix: {cm.fix}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 13 & 14. Practice Questions, Progressive Hints & Hidden Solutions */}
      <section id="section-exercise" className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-xs scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              13. Hands-On Practice Exercise ({lesson.exercise.difficulty} level)
            </div>
            <h2 className="text-xl font-bold text-slate-950">{lesson.exercise.title}</h2>
          </div>

          <button
            onClick={() => navigate({ type: 'practice' })}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-600 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer self-start sm:self-auto transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Open Practice Arena</span>
          </button>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{lesson.exercise.instructions}</p>

        {/* Exercise Editor */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden font-mono text-xs">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px]">
            <span className="text-slate-400">exercise_solution.py</span>
            <button
              onClick={handleRunExercise}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1 font-semibold rounded cursor-pointer"
            >
              Verify Solution
            </button>
          </div>
          <textarea
            rows={8}
            value={exerciseCode}
            onChange={(e) => setExerciseCode(e.target.value)}
            className="w-full p-4 bg-transparent text-slate-200 focus:outline-none font-mono text-xs resize-y"
          />
        </div>

        {exerciseFeedback && (
          <div
            className={`p-3 rounded-lg text-xs font-mono ${
              exerciseFeedback.startsWith('✓')
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {exerciseFeedback}
          </div>
        )}

        {/* 14. Progressive Hints & Hidden Solution */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 mr-1">14. Hints:</span>
            {lesson.exercise.hints.map((_, hIdx) => (
              <button
                key={hIdx}
                onClick={() => setActiveHintIndex(activeHintIndex === hIdx ? -1 : hIdx)}
                className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
                  activeHintIndex === hIdx
                    ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Hint {hIdx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-950 font-mono cursor-pointer"
          >
            {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showSolution ? 'Hide Solution' : 'Reveal Solution (Hidden)'}</span>
          </button>
        </div>

        {activeHintIndex >= 0 && (
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 font-mono">
            <strong>Hint {activeHintIndex + 1}:</strong> {lesson.exercise.hints[activeHintIndex]}
          </div>
        )}

        {showSolution && (
          <div className="space-y-2 pt-2">
            <div className="text-xs font-mono text-slate-500 uppercase">Author's Reference Solution:</div>
            <pre className="p-4 bg-slate-900 text-emerald-300 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
              {lesson.exercise.solutionCode}
            </pre>
          </div>
        )}
      </section>

      {/* 15. Quiz with Answer Explanations */}
      <section id="section-quiz" className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-4 scroll-mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-slate-700" />
            <span>15. Verification Quiz & Explanation</span>
          </h2>
          <span className="text-xs font-mono text-slate-500">+25 XP</span>
        </div>

        <p className="text-sm font-semibold text-slate-800">{lesson.quiz.question}</p>

        <div className="space-y-2">
          {lesson.quiz.options.map((option, optIdx) => {
            let style = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';
            if (quizSubmitted) {
              if (optIdx === lesson.quiz.correctIndex) {
                style = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold';
              } else if (selectedQuizAnswer === optIdx) {
                style = 'bg-rose-50 border-rose-400 text-rose-950';
              }
            } else if (selectedQuizAnswer === optIdx) {
              style = 'bg-slate-950 text-white border-slate-950';
            }

            return (
              <button
                key={optIdx}
                disabled={quizSubmitted}
                onClick={() => setSelectedQuizAnswer(optIdx)}
                className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-colors cursor-pointer ${style}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {!quizSubmitted ? (
          <button
            disabled={selectedQuizAnswer === null}
            onClick={() => setQuizSubmitted(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 disabled:opacity-40 rounded-lg transition-colors cursor-pointer"
          >
            Check Answer
          </button>
        ) : (
          <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
            <div className="font-semibold text-slate-900">
              {selectedQuizAnswer === lesson.quiz.correctIndex ? '✓ Correct!' : 'Incorrect.'}
            </div>
            <div className="text-slate-600 leading-relaxed">{lesson.quiz.explanation}</div>
          </div>
        )}
      </section>

      {/* 16. Summary & Key Takeaways */}
      {lesson.summaryKeyTakeaways && lesson.summaryKeyTakeaways.length > 0 && (
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <h2 className="text-base font-bold text-slate-950">16. Summary & Key Takeaways</h2>
          <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
            {lesson.summaryKeyTakeaways.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 18. Related Lessons & Further Reading */}
      {(lesson.relatedLessons || lesson.furtherReading) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lesson.relatedLessons && lesson.relatedLessons.length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 shadow-xs">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                18. Related Lessons
              </h3>
              <div className="space-y-1.5">
                {lesson.relatedLessons.map((rel, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      navigate({
                        type: 'lesson',
                        courseSlug: rel.courseSlug,
                        lessonSlug: rel.lessonSlug,
                      })
                    }
                    className="block text-left text-xs text-slate-800 hover:text-amber-600 font-medium transition-colors cursor-pointer"
                  >
                    → {rel.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {lesson.furtherReading && lesson.furtherReading.length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 shadow-xs">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Further Reading & Official Standards
              </h3>
              <div className="space-y-1.5">
                {lesson.furtherReading.map((fr, idx) => (
                  <a
                    key={idx}
                    href={fr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-slate-700 hover:text-slate-950 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                    <span>{fr.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 17 & 19. Previous/Next Lesson Navigation & Mark as Complete */}
      <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* 19. Mark as Complete Button */}
        <button
          onClick={() => completeLesson(lesson.id, 50)}
          className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-sm ${
            isCompleted
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-slate-950 hover:bg-slate-800 text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{isCompleted ? '19. Completed (+50 XP Awarded)' : '19. Mark Lesson Complete (+50 XP)'}</span>
        </button>

        {/* 17. Prev / Next Navigation */}
        <div className="flex items-center gap-3">
          {prevLesson && (
            <button
              onClick={() =>
                navigate({
                  type: 'lesson',
                  courseSlug: course.slug,
                  lessonSlug: prevLesson.slug,
                })
              }
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>17. Previous</span>
            </button>
          )}

          {nextLesson && (
            <button
              onClick={() =>
                navigate({
                  type: 'lesson',
                  courseSlug: course.slug,
                  lessonSlug: nextLesson.slug,
                })
              }
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              <span>Next Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
