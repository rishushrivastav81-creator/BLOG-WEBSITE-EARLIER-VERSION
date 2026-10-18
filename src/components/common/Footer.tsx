import React from 'react';
import { useApp } from '../../context/AppContext';
import { Terminal, Shield, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-amber-500 text-slate-950 font-mono font-extrabold flex items-center justify-center text-sm">
                M
              </div>
              <span className="text-lg font-bold tracking-tight text-white">Meridian</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              A comprehensive technical publication and interactive learning academy. Master Python, SQL, DSA, ML, RAG, and Agentic AI while discovering global developer travel guides.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pt-2">
              <span>ZERO TRACKING ADS</span>
              <span>·</span>
              <span>INDEPENDENT EDITORIAL</span>
              <span>·</span>
              <span>OPEN STANDARDS</span>
            </div>
          </div>

          {/* Journal Topics */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 mb-4">Journal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate({ type: 'blog', category: 'engineering' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Systems & Performance
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'blog', category: 'ai' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  AI & Cognitive Systems
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'blog', category: 'travel' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Nomad Field Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'blog' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  All Articles
                </button>
              </li>
            </ul>
          </div>

          {/* Code Academy & Practice */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 mb-4">Academy</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate({ type: 'tutorials', subject: 'python' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Python for Systems
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'tutorials', subject: 'sql' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Mastering Relational SQL
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'tutorials', subject: 'dsa' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Data Structures at Scale
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'practice' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Interactive Practice Arena
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'quizzes' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Skill Assessments
                </button>
              </li>
            </ul>
          </div>

          {/* Technical Architecture & Compliance */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 mb-4">Specifications</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate({ type: 'architecture' })}
                  className="hover:text-white transition-colors cursor-pointer text-left text-amber-400 font-medium"
                >
                  100k Concurrency Blueprint
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'static', page: 'sitemap' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  XML Sitemap & Robots.txt
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'static', page: 'seo-checklist' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Technical SEO Audit
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'static', page: 'editorial' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Editorial Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'static', page: 'privacy' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privacy & Data Retention
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'static', page: 'terms' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PadhoWithUs Education & Engineering Publication. Built with clean craftsmanship.</p>
          <div className="flex items-center gap-6">
            <span className="font-mono">WCAG 2.1 AA Compliant</span>
            <span>·</span>
            <span className="font-mono">Schema.org JSON-LD</span>
            <span>·</span>
            <span className="font-mono">Sub-100ms Core Web Vitals</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
