import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TopicQuiz, QuizQuestion } from '../../types';
import {
  Timer,
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface QuizViewProps {
  initialQuizId?: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ initialQuizId }) => {
  const { quizzes, user, submitQuizScore, navigate } = useApp();

  const [activeQuizId, setActiveQuizId] = useState<string>(initialQuizId || quizzes[0].id);
  const activeQuiz = quizzes.find((q) => q.id === activeQuizId) || quizzes[0];

  // Active quiz session state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number[]>>({});
  const [timeLeft, setTimeLeft] = useState(activeQuiz.timeLimitSeconds);
  const [quizFinished, setQuizFinished] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && !quizFinished && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, quizFinished, timeLeft]);

  const handleStartQuiz = (quiz: TopicQuiz) => {
    setActiveQuizId(quiz.id);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeft(quiz.timeLimitSeconds);
    setQuizFinished(false);
    setIsPlaying(true);
  };

  const handleToggleAnswer = (questionId: string, optionIndex: number, isMultiSelect: boolean) => {
    setSelectedAnswers((prev) => {
      const current = prev[questionId] || [];
      if (isMultiSelect) {
        if (current.includes(optionIndex)) {
          return { ...prev, [questionId]: current.filter((i) => i !== optionIndex) };
        } else {
          return { ...prev, [questionId]: [...current, optionIndex] };
        }
      } else {
        return { ...prev, [questionId]: [optionIndex] };
      }
    });
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    activeQuiz.questions.forEach((q) => {
      maxScore += q.points;
      const userSelected = (selectedAnswers[q.id] || []).sort();
      const correct = [...q.correctAnswers].sort();

      const isExactMatch =
        userSelected.length === correct.length &&
        userSelected.every((val, idx) => val === correct[idx]);

      if (isExactMatch) {
        totalScore += q.points;
      }
    });

    return { totalScore, maxScore };
  };

  const handleFinishQuiz = () => {
    setIsPlaying(false);
    setQuizFinished(true);

    const { totalScore, maxScore } = calculateScore();
    const percent = Math.round((totalScore / (maxScore || 1)) * 100);
    const xpGain = percent >= 70 ? activeQuiz.xpReward : Math.round(activeQuiz.xpReward * 0.4);

    submitQuizScore(activeQuiz.id, totalScore, maxScore, xpGain, activeQuiz.badgeName ? 'badge-quiz-ace' : undefined);
  };

  const currentQ: QuizQuestion | undefined = activeQuiz.questions[currentQuestionIndex];
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500">
          <span>Skill Verification & Gamification</span>
          <span>·</span>
          <span>Adaptive Engineering Quizzes</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
          Engineering Knowledge Assessments
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Prove your mastery across systems architecture, Postgres optimization, and Python memory internals. Earn verified XP, unlock community badges, and maintain your daily learning streak.
        </p>
      </div>

      {/* Quiz Catalog or Active Quiz Stage */}
      {!isPlaying && !quizFinished ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-950">Available Assessments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => {
              const previousScore = user.quizScores.find((s) => s.quizId === quiz.id);

              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-6 hover:border-slate-300 transition-all shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                      <span className="uppercase">{quiz.category}</span>
                      <span className="flex items-center gap-1">
                        <Timer className="w-3.5 h-3.5" />
                        <span>{formatTime(quiz.timeLimitSeconds)}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-950">{quiz.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{quiz.description}</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-600 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>+{quiz.xpReward} XP Reward</span>
                      </span>
                      {previousScore && (
                        <span className="text-slate-500">
                          Best: {previousScore.score}/{previousScore.maxScore}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Award className="w-4 h-4" />
                      <span>{previousScore ? 'Retake Assessment' : 'Start Timed Quiz'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : isPlaying && currentQ ? (
        /* Active In-Progress Quiz Stage */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-sm">
          {/* Top Bar: Progress & Live Timer */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="text-xs font-mono text-slate-500">
              Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
            </span>

            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs font-bold tabular-nums ${
              timeLeft < 30 ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-slate-100 text-slate-800'
            }`}>
              <Timer className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Question Text & Code Snippet */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
              <span>{currentQ.type}</span>
              <span>·</span>
              <span>{currentQ.points} Points</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 leading-snug">
              {currentQ.question}
            </h2>

            {currentQ.codeSnippet && (
              <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                {currentQ.codeSnippet}
              </pre>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = (selectedAnswers[currentQ.id] || []).includes(optIdx);
              return (
                <button
                  key={optIdx}
                  onClick={() =>
                    handleToggleAnswer(currentQ.id, optIdx, currentQ.type === 'multi-select')
                  }
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-950 text-white border-slate-950 font-medium'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>{option}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Bottom Controls */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-30 rounded-lg cursor-pointer"
            >
              Previous
            </button>

            {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinishQuiz}
                className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm cursor-pointer"
              >
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Completed & Detailed Results Breakdown */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-8 shadow-sm">
          {(() => {
            const { totalScore, maxScore } = calculateScore();
            const pct = Math.round((totalScore / (maxScore || 1)) * 100);

            return (
              <>
                <div className="text-center space-y-3 py-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                    <Award className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                    Assessment Completed
                  </h2>
                  <div className="text-3xl font-mono font-bold text-slate-900 tabular-nums">
                    {totalScore} / {maxScore} Points ({pct}%)
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {pct >= 70
                      ? 'Exceptional systems architecture grasp. Points and verified badge added to your profile.'
                      : 'Good attempt. Review the step-by-step explanations below to address knowledge gaps.'}
                  </p>
                </div>

                {/* Explanations Matrix */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400">
                    Question Analysis & Explanations
                  </h3>
                  <div className="space-y-4">
                    {activeQuiz.questions.map((q, idx) => {
                      const userChoices = (selectedAnswers[q.id] || []).sort();
                      const correctChoices = [...q.correctAnswers].sort();
                      const isCorrect =
                        userChoices.length === correctChoices.length &&
                        userChoices.every((val, i) => val === correctChoices[i]);

                      return (
                        <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">Q{idx + 1}: {q.question}</span>
                            <span className={`font-mono font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {isCorrect ? '✓ Correct' : '✗ Missed'}
                            </span>
                          </div>
                          <div className="text-slate-600 bg-white p-3 rounded-lg border border-slate-100 leading-relaxed">
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center gap-4 pt-4">
                  <button
                    onClick={() => {
                      setQuizFinished(false);
                      setIsPlaying(false);
                    }}
                    className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Back to All Quizzes
                  </button>
                  <button
                    onClick={() => handleStartQuiz(activeQuiz)}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
