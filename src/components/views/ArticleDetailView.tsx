import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bookmark, Share2, ArrowLeft, Clock, Calendar, Check, Copy } from 'lucide-react';

interface ArticleDetailViewProps {
  slug: string;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({ slug }) => {
  const { articles, navigate, toggleBookmark, user, showToast } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{ author: string; date: string; text: string }[]>([
    {
      author: 'David Lindqvist',
      date: '2026-10-14',
      text: 'The analysis on cache-line invalidation matches what we saw when benchmarking our financial matching engine. Moving to contiguous ring buffers dropped our p99 dramatically.',
    },
    {
      author: 'Mei Ling',
      date: '2026-10-16',
      text: 'Great details on Kyoto coworking spaces. Can confirm Kamigyo has fantastic fiber lines. Highly recommend visiting the local sento afterwards.',
    },
  ]);

  const article = articles.find((a) => a.slug === slug) || articles[0];
  const relatedArticles = articles
    .filter((a) => a.id !== article.id && (a.category === article.category || a.author.id === article.author.id))
    .slice(0, 3);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast('Code snippet copied to clipboard', 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Article URL copied to clipboard', 'info');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments((prev) => [
      {
        author: user.name,
        date: new Date().toISOString().split('T')[0],
        text: commentText.trim(),
      },
      ...prev,
    ]);
    setCommentText('');
    showToast('Comment published', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumbs & Back Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
        <button
          onClick={() => navigate({ type: 'blog' })}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dispatches</span>
        </button>
        <div className="flex items-center gap-2">
          <span>Journal</span>
          <span>/</span>
          <span className="capitalize">{article.category}</span>
          <span>/</span>
          <span className="text-slate-800 truncate max-w-[150px]">{article.slug}</span>
        </div>
      </div>

      {/* Article Header */}
      <div className="space-y-6">
        {/* Zero-Pill Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
          <span className="capitalize text-slate-900 font-semibold">{article.category}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{article.publishedAt}</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTimeMinutes} min read</span>
          </span>
          <span>·</span>
          <span>{article.views.toLocaleString()} Views</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.18] text-balance">
          {article.title}
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed font-normal">
          {article.excerpt}
        </p>

        {/* Author Bio & Action Strip */}
        <div className="pt-6 border-y border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover ring-1 ring-slate-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="text-sm font-bold text-slate-900">{article.author.name}</div>
              <div className="text-xs text-slate-500">{article.author.role} · {article.author.location}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleBookmark(article.id)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Bookmark className={`w-3.5 h-3.5 ${user.bookmarkedArticleIds.includes(article.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{user.bookmarkedArticleIds.includes(article.id) ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Cover Image */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <img
          src={article.coverImage}
          alt={article.imageAlt}
          className="w-full h-[400px] object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 italic text-center">
          {article.imageAlt}
        </div>
      </div>

      {/* Article Body Content */}
      <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-base space-y-6">
        {article.body.split('\n\n').map((paragraph, index) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h2 key={index} className="text-2xl font-bold text-slate-950 pt-4 pb-2 border-b border-slate-200">
                {paragraph.replace('### ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('#### ')) {
            return (
              <h3 key={index} className="text-lg font-bold text-slate-900 pt-3">
                {paragraph.replace('#### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('```')) {
            const lines = paragraph.split('\n');
            const lang = lines[0].replace('```', '') || 'code';
            const code = lines.slice(1, -1).join('\n');
            return (
              <div key={index} className="my-6 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-200 font-mono text-xs">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                  <span className="uppercase">{lang}</span>
                  <button
                    onClick={() => handleCopyCode(code)}
                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedCode === code ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy snippet</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto leading-relaxed">{code}</pre>
              </div>
            );
          }
          return (
            <p key={index} className="leading-relaxed text-slate-700">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Tag Ribbon */}
      <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mr-2">Filed under:</span>
        {article.tags.map((tag) => (
          <button
            key={tag}
            onClick={() => navigate({ type: 'blog', tag })}
            className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors cursor-pointer font-mono"
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Comments & Discussion */}
      <section className="pt-8 border-t border-slate-200 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-950">
            Discussion ({comments.length})
          </h3>
          <span className="text-xs font-mono text-slate-400">Peer-Reviewed Engineering Forum</span>
        </div>

        {/* Comment Input */}
        <form onSubmit={handleAddComment} className="space-y-3">
          <textarea
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share technical observations, benchmarks, or field experiences..."
            className="w-full p-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-slate-400 focus:outline-none transition-colors"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
            >
              Post Comment
            </button>
          </div>
        </form>

        {/* Comment List */}
        <div className="space-y-4 pt-2">
          {comments.map((c, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span className="font-semibold text-slate-900">{c.author}</span>
                <span>{c.date}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Dispatches */}
      {relatedArticles.length > 0 && (
        <section className="pt-8 border-t border-slate-200 space-y-6">
          <h3 className="text-xl font-bold text-slate-950">
            Related Dispatches
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate({ type: 'article', slug: rel.slug })}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm cursor-pointer space-y-2 transition-all"
              >
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">{rel.category}</div>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{rel.title}</h4>
                <div className="text-xs text-slate-500 font-mono">{rel.readTimeMinutes} min read</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
