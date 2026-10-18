import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Article, ArticleCategory } from '../../types';
import { authors } from '../../data/seedData';
import {
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  FileText,
  Clock,
  Globe,
  Eye,
  Shield,
  Search,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { articles, createArticle, updateArticle, deleteArticle, navigate, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'articles' | 'new-article' | 'settings'>('articles');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Form state for creating / editing
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('engineering');
  const [tags, setTags] = useState('Go, Distributed Systems, Performance');
  const [coverImage, setCoverImage] = useState('/src/assets/images/article_distributed_systems_1792296527506.jpg');
  const [imageAlt, setImageAlt] = useState('High performance server infrastructure');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [readTimeMinutes, setReadTimeMinutes] = useState(6);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [authorId, setAuthorId] = useState(authors[0].id);

  // Auto-generate slug from title
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!editingArticleId) {
      setSlug(
        newTitle
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
      );
    }
  };

  const handleEditClick = (art: Article) => {
    setEditingArticleId(art.id);
    setTitle(art.title);
    setSlug(art.slug);
    setExcerpt(art.excerpt);
    setBody(art.body);
    setCategory(art.category);
    setTags(art.tags.join(', '));
    setCoverImage(art.coverImage);
    setImageAlt(art.imageAlt);
    setStatus(art.status);
    setReadTimeMinutes(art.readTimeMinutes);
    setSeoTitle(art.seoTitle || '');
    setSeoDescription(art.seoDescription || '');
    setAuthorId(art.author.id);
    setActiveTab('new-article');
  };

  const resetForm = () => {
    setEditingArticleId(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setBody('');
    setCategory('engineering');
    setTags('');
    setCoverImage('/src/assets/images/article_distributed_systems_1792296527506.jpg');
    setImageAlt('');
    setStatus('published');
    setReadTimeMinutes(5);
    setSeoTitle('');
    setSeoDescription('');
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      showToast('Title and body are required', 'info');
      return;
    }

    const selectedAuthor = authors.find((a) => a.id === authorId) || authors[0];
    const parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingArticleId) {
      updateArticle(editingArticleId, {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        excerpt,
        body,
        category,
        tags: parsedTags,
        coverImage,
        imageAlt: imageAlt || title,
        status,
        readTimeMinutes,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt,
        author: selectedAuthor,
      });
    } else {
      createArticle({
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        excerpt,
        body,
        category,
        tags: parsedTags,
        coverImage,
        imageAlt: imageAlt || title,
        status,
        readTimeMinutes,
        publishedAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        author: selectedAuthor,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt,
        canonicalUrl: `https://meridian-pub.dev/blog/${slug}`,
      });
    }

    resetForm();
    setActiveTab('articles');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* CMS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500">
            <Shield className="w-3.5 h-3.5 text-slate-700" />
            <span>PadhoWithUs Editorial CMS Studio</span>
            <span>·</span>
            <span>Role-Based Access Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
            Content Management & Publishing
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { resetForm(); setActiveTab('new-article'); }}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Compose New Dispatch</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('articles')}
          className={`pb-3 px-3 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'articles'
              ? 'border-slate-950 text-slate-950'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Manage Dispatches ({articles.length})
        </button>
        <button
          onClick={() => setActiveTab('new-article')}
          className={`pb-3 px-3 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'new-article'
              ? 'border-slate-950 text-slate-950'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          {editingArticleId ? 'Edit Dispatch' : 'Article Composer'}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-3 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'settings'
              ? 'border-slate-950 text-slate-950'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Editorial Governance & Audit
        </button>
      </div>

      {/* Tab 1: Articles Table */}
      {activeTab === 'articles' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold uppercase">Title</th>
                  <th className="px-4 py-3 font-semibold uppercase">Category</th>
                  <th className="px-4 py-3 font-semibold uppercase">Author</th>
                  <th className="px-4 py-3 font-semibold uppercase">Status</th>
                  <th className="px-4 py-3 font-semibold uppercase">Date</th>
                  <th className="px-4 py-3 font-semibold uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-sans font-semibold text-slate-900 max-w-xs truncate">
                      {art.title}
                    </td>
                    <td className="px-4 py-3 capitalize text-slate-600">{art.category}</td>
                    <td className="px-4 py-3 text-slate-600 font-sans">{art.author.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          art.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {art.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{art.publishedAt}</td>
                    <td className="px-4 py-3 text-right space-x-2 font-sans">
                      <button
                        onClick={() => navigate({ type: 'article', slug: art.slug })}
                        className="text-slate-500 hover:text-slate-900 cursor-pointer"
                        title="View live"
                      >
                        <Eye className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleEditClick(art)}
                        className="text-slate-700 hover:text-slate-900 cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => deleteArticle(art.id)}
                        className="text-rose-600 hover:text-rose-800 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: New / Edit Article Form */}
      {activeTab === 'new-article' && (
        <form onSubmit={handleSaveArticle} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content inputs */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-slate-700">Dispatch Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Zero-Allocation High-Throughput Microservices..."
                  className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-slate-700">Permanent URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full p-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-slate-700">Editorial Excerpt</label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A concise summary of key findings and architectural lessons..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-slate-700">
                  Markdown Body Content (Supports ### Headings, ```code blocks)
                </label>
                <textarea
                  rows={14}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none leading-relaxed"
                  required
                />
              </div>
            </div>

            {/* Sidebar metadata & SEO */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  Publishing Controls
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg capitalize"
                  >
                    <option value="engineering">Engineering</option>
                    <option value="travel">Travel & Nomad</option>
                    <option value="ai">AI & Systems</option>
                    <option value="architecture">Architecture</option>
                    <option value="career">Career & Life</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-700">Author</label>
                  <select
                    value={authorId}
                    onChange={(e) => setAuthorId(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {authors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-700">Publication State</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg capitalize"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Private)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-700">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-700">Est. Read Time (Minutes)</label>
                  <input
                    type="number"
                    min={1}
                    value={readTimeMinutes}
                    onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* SEO Metadata Box */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  Technical SEO Overrides
                </h3>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-600">Meta Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Defaults to Title"
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-600">Meta Description</label>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Defaults to Excerpt"
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg cursor-pointer shadow-sm"
                >
                  {editingArticleId ? 'Save Changes' : 'Publish Dispatch'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Tab 3: Editorial Settings & Compliance */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-6 shadow-xs max-w-3xl">
          <h2 className="text-lg font-bold text-slate-950">
            Editorial Protocol & Environment Configuration
          </h2>
          <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-mono">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong>Admin Bootstrap Protocol:</strong> Initial administrator credentials are instantiated via secure CLI seed command (<code className="text-slate-900">npm run db:seed-admin</code>) without committing passwords to version control.
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong>Draft Indexing Shield:</strong> Search engine crawlers (Googlebot, Bingbot) receive <code className="text-slate-900">X-Robots-Tag: noindex, nofollow</code> headers for all non-published states.
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong>XSS Sanitization:</strong> All user-authored markdown content is validated and escaped before DOM rendering to prevent script injection.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
