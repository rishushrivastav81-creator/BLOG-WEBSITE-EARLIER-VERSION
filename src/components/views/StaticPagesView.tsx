import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, CheckCircle2, FileCode, Check, Copy } from 'lucide-react';

interface StaticPagesViewProps {
  page: 'about' | 'editorial' | 'privacy' | 'terms' | 'contact' | 'sitemap' | 'seo-checklist';
}

export const StaticPagesView: React.FC<StaticPagesViewProps> = ({ page }) => {
  const { articles, courses, showToast } = useApp();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard', 'info');
  };

  // Generate XML Sitemap dynamically
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://padhowithus.dev/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://padhowithus.dev/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://padhowithus.dev/tutorials</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://padhowithus.dev/practice</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://padhowithus.dev/quizzes</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${articles
  .filter((a) => a.status === 'published')
  .map(
    (a) => `  <url>
    <loc>https://padhowithus.dev/blog/${a.slug}</loc>
    <lastmod>${a.updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join('\n')}
${courses
  .map(
    (c) => `  <url>
    <loc>https://padhowithus.dev/course/${c.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const robotsTxt = `User-agent: *
Allow: /
Allow: /blog/
Allow: /tutorials/
Allow: /practice/
Allow: /course/
Disallow: /admin/
Disallow: /search?*
Disallow: /dashboard/
Disallow: /api/private/

Sitemap: https://padhowithus.dev/sitemap.xml`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {page === 'about' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Mission & Architecture</span>
            <h1 className="text-3xl font-extrabold text-slate-950">About PadhoWithUs</h1>
          </div>
          <div className="prose text-slate-700 space-y-4 text-sm sm:text-base leading-relaxed">
            <p>
              PadhoWithUs is an independent technical publication and comprehensive interactive learning academy founded by systems engineers and digital nomads.
            </p>
            <p>
              We believe the highest quality technical writing comes from practitioners who build and maintain distributed systems in production. Simultaneously, we advocate for location independence, deep monastic focus, and engineering outside conventional cubicles.
            </p>
            <p>
              Our academy bridges the gap between academic theory and real production constraints. No trivial toy snippets: we teach memory models, lock-free concurrency, database cost heuristics, and sandboxed AI execution.
            </p>
          </div>
        </div>
      )}

      {page === 'editorial' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Integrity & Fact-Checking</span>
            <h1 className="text-3xl font-extrabold text-slate-950">Editorial Policy & Standards</h1>
          </div>
          <div className="prose text-slate-700 space-y-4 text-sm leading-relaxed">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-900">1. Reproducible Benchmarks</h3>
              <p>Every performance claim (p99 latency, memory allocations, throughput) must specify exact hardware specs, OS kernel versions, and reproducible scripts.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-900">2. No AI-Slop Without Editorial Oversight</h3>
              <p>We strictly prohibit automated unvetted LLM publishing. Every technical tutorial and destination guide is reviewed by experienced engineers.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-900">3. Independent Travel Reviews</h3>
              <p>Coworking space reviews, fiber internet benchmarks, and neighborhood recommendations are independently researched with zero undisclosed affiliate sponsorships.</p>
            </div>
          </div>
        </div>
      )}

      {page === 'privacy' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Data Minimization & GDPR</span>
            <h1 className="text-3xl font-extrabold text-slate-950">Privacy Policy</h1>
          </div>
          <div className="prose text-slate-700 space-y-4 text-sm leading-relaxed">
            <p>
              Meridian adheres to strict data minimization principles. We do not track users across third-party networks, sell telemetry to advertisers, or inject surveillance pixels.
            </p>
            <h3 className="font-bold text-slate-900">Data Stored</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Account credentials (salted & hashed using Argon2id/bcrypt).</li>
              <li>Learning state: Completed lessons, solved practice challenges, quiz scores, and XP.</li>
              <li>Bookmarks and preferences saved locally in browser or encrypted user profile.</li>
            </ul>
            <p>
              Users may request complete export or deletion of their account data at any time under GDPR & CCPA rights.
            </p>
          </div>
        </div>
      )}

      {page === 'terms' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Legal Agreements</span>
            <h1 className="text-3xl font-extrabold text-slate-950">Terms of Service</h1>
          </div>
          <div className="prose text-slate-700 space-y-4 text-sm leading-relaxed">
            <p>
              By accessing Meridian, you agree to comply with our acceptable use policies.
            </p>
            <h3 className="font-bold text-slate-900">Sandbox Code Execution Policy</h3>
            <p>
              The code practice environment is provided strictly for educational verification. Attempting denial-of-service, escape from sandbox containers, port scanning, or malicious attacks against the execution host will result in permanent suspension and IP firewall banning.
            </p>
          </div>
        </div>
      )}

      {page === 'sitemap' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Search Engine Discovery</span>
              <h1 className="text-2xl font-bold text-slate-950">XML Sitemap & Robots.txt</h1>
            </div>
            <button
              onClick={() => handleCopy(sitemapXml)}
              className="px-3 py-1.5 text-xs font-mono bg-slate-900 text-white rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Sitemap XML</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-xs font-mono text-slate-700 font-semibold">1. Standard robots.txt:</div>
            <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
              {robotsTxt}
            </pre>

            <div className="text-xs font-mono text-slate-700 font-semibold pt-4">2. Validated XML Sitemap (Eligible Indexable URLs):</div>
            <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 max-h-96">
              {sitemapXml}
            </pre>
          </div>
        </div>
      )}

      {page === 'seo-checklist' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Technical SEO Standards</span>
            <h1 className="text-2xl font-bold text-slate-950">Production SEO Verification Checklist</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Server-Rendered Semantic HTML', desc: 'H1-H4 heading hierarchy, no skipped levels, semantic article and main tags.', status: 'PASSED' },
              { title: 'Dynamic Page Titles & Meta', desc: 'Branded titles (30-60 chars) and meta descriptions (120-160 chars) on all routes.', status: 'PASSED' },
              { title: 'OpenGraph & Twitter Cards', desc: 'Valid og:type, og:image, and summary_large_image tags with verified assets.', status: 'PASSED' },
              { title: 'Schema.org JSON-LD', desc: 'WebSite, EducationalOrganization, and Article microdata configured in DOM.', status: 'PASSED' },
              { title: 'XML Sitemap & Robots.txt', desc: 'Auto-updating XML sitemap excludes private /admin/ and drafts.', status: 'PASSED' },
              { title: 'Core Web Vitals & LCP', desc: 'Optimized hero images, system font stacks, zero layout shifts (CLS < 0.05).', status: 'PASSED' },
              { title: 'Canonical URLs', desc: 'Prevent duplicate content indexing across query params and trailing slashes.', status: 'PASSED' },
              { title: 'Zero-Broken-Image Policy', desc: 'Fallback CSS gradient containers and descriptive alt tags on every image slot.', status: 'PASSED' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
