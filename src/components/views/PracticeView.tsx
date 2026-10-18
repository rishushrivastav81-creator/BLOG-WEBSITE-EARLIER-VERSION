import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { executeRestrictedSql, SqlQueryResult } from '../../utils/sqlRunner';
import { executePythonCode, PythonExecutionResult } from '../../utils/pythonRunner';
import { sampleSqlTables } from '../../data/practiceData';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Database,
  Terminal,
  Clock,
  Eye,
  EyeOff,
  Table,
  Lightbulb,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface PracticeViewProps {
  initialProblemSlug?: string;
  initialMode?: 'python' | 'sql';
}

export const PracticeView: React.FC<PracticeViewProps> = ({ initialProblemSlug, initialMode = 'sql' }) => {
  const { practiceProblems, user, solveProblem, showToast } = useApp();

  const [activeCategory, setActiveCategory] = useState<'sql' | 'python'>(initialMode);
  const filteredProblems = practiceProblems.filter((p) => p.category === activeCategory);

  const [selectedProblemId, setSelectedProblemId] = useState<string>(() => {
    if (initialProblemSlug) {
      const match = practiceProblems.find((p) => p.slug === initialProblemSlug);
      if (match) return match.id;
    }
    return filteredProblems[0]?.id || practiceProblems[0].id;
  });

  const activeProblem = practiceProblems.find((p) => p.id === selectedProblemId) || practiceProblems[0];

  // Editor code state
  const [code, setCode] = useState(activeProblem.starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [sqlResult, setSqlResult] = useState<SqlQueryResult | null>(null);
  const [pythonResult, setPythonResult] = useState<PythonExecutionResult | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showSchemaDrawer, setShowSchemaDrawer] = useState(false);

  // When problem changes
  const handleSelectProblem = (id: string) => {
    setSelectedProblemId(id);
    const p = practiceProblems.find((item) => item.id === id);
    if (p) {
      setCode(p.starterCode);
      setSqlResult(null);
      setPythonResult(null);
      setShowHints(false);
      setShowSolution(false);
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      if (activeProblem.category === 'sql') {
        const res = executeRestrictedSql(code);
        setSqlResult(res);

        // Check if query solved problem criteria
        if (res.success && res.rowCount > 0 && !res.error) {
          solveProblem(activeProblem.id, 75);
        }
      } else {
        const res = executePythonCode(code, activeProblem.testCases);
        setPythonResult(res);

        if (res.success && res.testResults.every((t) => t.passed)) {
          solveProblem(activeProblem.id, 75);
        }
      }
      setIsRunning(false);
    }, 200);
  };

  const isSolved = user.solvedProblemIds.includes(activeProblem.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Track Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500">
            <span>Sandboxed Practice Arena</span>
            <span>·</span>
            <span>Isolated Runtime</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
            Interactive Code Execution Environment
          </h1>
        </div>

        {/* Category Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => {
              setActiveCategory('sql');
              const firstSql = practiceProblems.find((p) => p.category === 'sql');
              if (firstSql) handleSelectProblem(firstSql.id);
            }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 cursor-pointer ${
              activeCategory === 'sql' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Relational SQL</span>
          </button>
          <button
            onClick={() => {
              setActiveCategory('python');
              const firstPy = practiceProblems.find((p) => p.category === 'python');
              if (firstPy) handleSelectProblem(firstPy.id);
            }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 cursor-pointer ${
              activeCategory === 'python' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Python 3.12</span>
          </button>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem Description & Test Specifications */}
        <div className="lg:col-span-5 space-y-6">
          {/* Problem Selector Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-500">Active Challenge</label>
            <div className="space-y-1">
              {filteredProblems.map((prob) => {
                const solved = user.solvedProblemIds.includes(prob.id);
                return (
                  <button
                    key={prob.id}
                    onClick={() => handleSelectProblem(prob.id)}
                    className={`w-full text-left p-3 rounded-lg border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      prob.id === activeProblem.id
                        ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      {solved ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full border border-slate-400 shrink-0" />
                      )}
                      <span className="truncate">{prob.title}</span>
                    </div>
                    <span className="font-mono text-[11px] capitalize opacity-80 shrink-0">{prob.difficulty}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Problem Overview Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-mono text-slate-500 capitalize">Level: {activeProblem.difficulty}</span>
              {isSolved && (
                <span className="text-xs font-mono text-emerald-600 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Solved (+75 XP)</span>
                </span>
              )}
            </div>

            <h2 className="text-lg font-bold text-slate-950">{activeProblem.title}</h2>

            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
              {activeProblem.description}
            </div>

            {/* Sample Expected Output */}
            <div className="space-y-1.5 pt-2">
              <div className="text-xs font-mono text-slate-500 uppercase">Expected Output Format:</div>
              <pre className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 overflow-x-auto">
                {activeProblem.sampleOutput}
              </pre>
            </div>

            {/* SQL Schema Inspector Button */}
            {activeProblem.category === 'sql' && (
              <button
                onClick={() => setShowSchemaDrawer(!showSchemaDrawer)}
                className="w-full py-2 px-3 text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Table className="w-3.5 h-3.5" />
                <span>{showSchemaDrawer ? 'Hide Seeded Schema' : 'Inspect Seeded Database Schema'}</span>
              </button>
            )}

            {showSchemaDrawer && (
              <div className="p-3 bg-slate-950 text-slate-300 rounded-lg font-mono text-[11px] space-y-2 border border-slate-800">
                <div className="text-amber-400 font-semibold">Available Relational Tables:</div>
                <div>• departments (id, name, location, budget)</div>
                <div>• employees (id, name, role, salary, department_id, hire_date)</div>
                <div>• projects (id, title, status, budget_spent, department_id)</div>
              </div>
            )}

            {/* Hints & Solution Toggles */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-slate-600 hover:text-slate-950 font-mono flex items-center gap-1 cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{showHints ? 'Hide Hints' : 'View Hints'}</span>
              </button>

              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-slate-600 hover:text-slate-950 font-mono flex items-center gap-1 cursor-pointer"
              >
                {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showSolution ? 'Hide Solution' : 'View Solution'}</span>
              </button>
            </div>

            {showHints && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
                <div className="font-semibold font-mono uppercase text-[11px]">Architectural Hints:</div>
                <ul className="list-disc pl-4 space-y-1">
                  {activeProblem.hints.map((hint, i) => (
                    <li key={i}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}

            {showSolution && (
              <div className="space-y-1 pt-1">
                <div className="text-xs font-mono text-slate-500 uppercase">Reference Solution:</div>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-lg text-xs font-mono overflow-x-auto">
                  {activeProblem.solutionCode}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Sandboxed Console */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden font-mono text-xs shadow-md">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <span className="text-slate-400 text-[11px]">
                  {activeProblem.category === 'sql' ? 'playground_query.sql' : 'solution.py'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCode(activeProblem.starterCode);
                    setSqlResult(null);
                    setPythonResult(null);
                  }}
                  className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded cursor-pointer text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-1.5 rounded transition-colors cursor-pointer text-xs"
                >
                  <Play className="w-3 h-3 fill-slate-950" />
                  <span>{isRunning ? 'Executing...' : 'Run Query & Verify'}</span>
                </button>
              </div>
            </div>

            {/* Code Input Area */}
            <textarea
              rows={12}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-4 bg-transparent text-slate-200 focus:outline-none font-mono text-xs resize-y leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* SQL Results View */}
          {activeProblem.category === 'sql' && sqlResult && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-slate-900">Query Execution Output</span>
                <span className="text-slate-500 tabular-nums">
                  {sqlResult.rowCount} rows · {sqlResult.executionTimeMs}ms
                </span>
              </div>

              {sqlResult.error ? (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-mono flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>{sqlResult.error}</div>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-xs font-mono text-left">
                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                      <tr>
                        {sqlResult.columns.map((col, i) => (
                          <th key={i} className="px-3 py-2 font-semibold uppercase tracking-wider">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sqlResult.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50">
                          {row.map((val, cIdx) => (
                            <td key={cIdx} className="px-3 py-2 text-slate-800 tabular-nums">
                              {val !== null ? String(val) : 'NULL'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Python Results View */}
          {activeProblem.category === 'python' && pythonResult && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Console Logs & Test Cases</span>
                <span className="text-slate-500 tabular-nums">{pythonResult.executionTimeMs}ms</span>
              </div>

              {/* Console stdout */}
              {pythonResult.stdout && (
                <pre className="p-3 bg-slate-950 text-slate-200 rounded-lg overflow-x-auto">
                  {pythonResult.stdout}
                </pre>
              )}

              {pythonResult.stderr && (
                <pre className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg overflow-x-auto">
                  {pythonResult.stderr}
                </pre>
              )}

              {/* Unit Test Matrix */}
              {pythonResult.testResults.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="font-semibold text-slate-700">Test Case Validations:</div>
                  {pythonResult.testResults.map((tr, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded border flex items-center justify-between ${
                        tr.passed
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <span>Input: {tr.input}</span>
                      <span className="font-bold">{tr.passed ? '✓ PASSED' : '✗ FAILED'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
