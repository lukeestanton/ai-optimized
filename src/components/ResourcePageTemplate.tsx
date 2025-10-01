"use client";

import type { JSX } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";

// -------------------- Types (backward compatible + safe extensions) --------------------

export type ResourceAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

export type ResourceHighlight = {
  label: string;
  value: string;
};

export type ResourceIconName =
  | "compass"
  | "workflow"
  | "shield"
  | "spark"
  | "play"
  | "calendar"
  | "document"
  | "chat"
  | "growth"
  | "checklist"
  | "analytics";

export type ResourceAccent =
  | "blueOrange"
  | "greenBlue"
  | "purplePink"
  | "slate"
  | "amber"
  | "cyan";

export type ResourceCard = {
  title: string;
  description: string;
  icon: ResourceIconName;
  accent: ResourceAccent;
  badge?: string;
  items?: string[];
  metrics?: { label: string; value: string }[];
  link?: ResourceAction;
  // Potential quality-of-life fields?:
  href?: string;           // make the whole card clickable
  tags?: string[];         // enables filtering UX
  image?: string;          // small decorative image (optional)
};

export type ResourceSection = {
  id: string;              // used as anchor + ToC target
  eyebrow?: string;
  title: string;
  description: string;
  cards: ResourceCard[];
};

export type ResourceQuickLink = {
  label: string;
  href: string;
  description?: string;
};

export type ResourceBreadcrumb = {
  label: string;
  href?: string;
};

export type ResourcePageContent = {
  hero: {
    eyebrow?: string;
    title: string;
    description: string;
    actions?: ResourceAction[];
    highlights?: ResourceHighlight[];
    overview?: string[];
    updatedAt?: string;
    readTime?: string;
    category?: string;
  };
  sections: ResourceSection[];
  article?: {
    blocks: Array<
      | { type: "heading"; level?: 2 | 3 | 4; text: string }
      | { type: "paragraph"; text: string }
      | { type: "list"; ordered?: boolean; items: string[] }
      | { type: "quote"; text: string; cite?: string }
      | { type: "callout"; title?: string; text: string }
      | { type: "image"; src: string; alt?: string; caption?: string }
      | { type: "divider" }
    >;
  };
  quickLinks?: {
    title: string;
    description?: string;
    items: ResourceQuickLink[];
  };
  bottomCta?: {
    title: string;
    description: string;
    primary: ResourceAction;
    secondary?: ResourceAction;
  };
  breadcrumbs?: ResourceBreadcrumb[];
  enableToc?: boolean;
  enableSearch?: boolean;
  jsonLd?: Record<string, unknown>;
};

// UI Constants

const accentClasses: Record<ResourceAccent, string> = {
  blueOrange: "from-blue-500 to-orange-500",
  greenBlue: "from-green-500 to-blue-500",
  purplePink: "from-purple-500 to-pink-500",
  slate: "from-slate-500 to-slate-700",
  amber: "from-amber-500 to-orange-500",
  cyan: "from-cyan-500 to-blue-500",
};

const iconMap: Record<ResourceIconName, JSX.Element> = {
  compass: (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.707l-2 5a1 1 0 01-.6.6l-5 2a1 1 0 01-1.3-1.3l2-5a1 1 0 01.6-.6l5-2a1 1 0 011.3 1.3z" />
    </svg>
  ),
  workflow: (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6 3a2 2 0 00-2 2v2H3a1 1 0 000 2h1v2H3a1 1 0 000 2h1v2a2 2 0 002 2h2v1a1 1 0 002 0v-1h2a2 2 0 002-2v-2h1a1 1 0 000-2h-1V9h1a1 1 0 000-2h-1V5a2 2 0 00-2-2H6z" />
    </svg>
  ),
  shield: (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fillRule="evenodd" d="M10.29 2.21a1 1 0 00-.58 0l-6 2A1 1 0 003 5.17v4.58c0 4.28 2.4 6.72 6.4 8.54a1 1 0 00.82 0c4-1.82 6.4-4.26 6.4-8.54V5.17a1 1 0 00-.71-.96l-6-2z" clipRule="evenodd" />
    </svg>
  ),
  spark: (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M11 3a1 1 0 10-2 0v3.382l-2.447-.815a1 1 0 10-.632 1.898l2.447.815-1.516 4.548a1 1 0 001.898.632L10 9.382l1.25 3.75a1 1 0 001.898-.632l-1.516-4.548 2.447-.815a1 1 0 10-.632-1.898L11 6.382V3z" />
    </svg>
  ),
  play: (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4.5 3.5a1 1 0 011.5-.866l9 5.5a1 1 0 010 1.732l-9 5.5A1 1 0 014 14.5v-11a1 1 0 01.5-.866z" />
    </svg>
  ),
  calendar: (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6 2a1 1 0 000 2h8a1 1 0 100-2h-1V1a1 1 0 10-2 0v1H9V1a1 1 0 10-2 0v1H6z" />
      <path fillRule="evenodd" d="M3 6a2 2 0 012-2h10a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V6zm11 3a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
    </svg>
  ),
  document: (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V9h-3a1 1 0 01-1-1V5H6z" />
      <path d="M11 4.414V8h3.586L11 4.414z" />
    </svg>
  ),
  chat: (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M18 10c0 3.866-3.582 7-8 7a8.96 8.96 0 01-3.905-.868L2 17l.868-4.095A8.96 8.96 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" />
    </svg>
  ),
  growth: (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 3a1 1 0 000 2h1v11a1 1 0 102 0V5h1a1 1 0 100-2H3zm9 4a1 1 0 00-1 1v8a1 1 0 102 0V9h1a1 1 0 100-2h-2zm5 4a1 1 0 00-1 1v4a1 1 0 102 0v-4h1a1 1 0 000-2h-2z" />
    </svg>
  ),
  checklist: (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 3a1 1 0 000 2h12a1 1 0 100-2H4zm0 4a1 1 0 000 2h6a1 1 0 100-2H4zm0 4a1 1 0 100 2h12a1 1 0 100-2H4zm0 4a1 1 0 100 2h6a1 1 0 100-2H4z" />
      <path d="M16.707 6.293a1 1 0 00-1.414 0L13 8.586l-.293-.293a1 1 0 00-1.414 1.414l1 1a1 1 0 001.414 0l3-3a1 1 0 000-1.414z" />
    </svg>
  ),
  analytics: (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 3a1 1 0 011-1h1a1 1 0 011 1v14a1 1 0 01-2 0V4H4a1 1 0 01-1-1zm6 4a1 1 0 011-1h1a1 1 0 011 1v10a1 1 0 11-2 0V8H9a1 1 0 01-1-1zm7 4a1 1 0 011-1h1a1 1 0 011 1v6a1 1 0 11-2 0v-5h-1a1 1 0 01-1-1z" />
    </svg>
  ),
};

function renderIcon(name: ResourceIconName) {
  return iconMap[name];
}

function actionClasses(variant: ResourceAction["variant"] = "primary") {
  if (variant === "secondary") {
    return "inline-flex items-center justify-center rounded-lg border border-blue-500 text-blue-600 font-semibold py-2.5 px-5 bg-white hover:bg-blue-50 transition-all duration-200 text-sm md:text-base";
  }
  return "inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-orange-500 text-white font-semibold py-2.5 px-5 hover:from-blue-600 hover:to-orange-600 transition-all duration-200 text-sm md:text-base shadow-lg shadow-blue-500/20";
}

// Helpers

function toKebab(str: string) {
  return str.toLowerCase().replace(/[^\w]+/g, "-").replace(/(^-|-$)/g, "");
}

// Component

export default function ResourcePageTemplate({ content }: { content: ResourcePageContent }) {
  const [query, setQuery] = useState("");
  const allTags = useMemo(() => {
    const s = new Set<string>();
    content.sections.forEach((sec) =>
      sec.cards.forEach((c) => (c.tags || []).forEach((t) => s.add(t)))
    );
    return Array.from(s).sort();
  }, [content.sections]);

  const [activeTag, setActiveTag] = useState<string>("");

  // Basic card search
  const filterCards = (cards: ResourceCard[]) => {
    const q = query.trim().toLowerCase();
    return cards.filter((card) => {
      const baseMatch =
        !q ||
        card.title.toLowerCase().includes(q) ||
        card.description.toLowerCase().includes(q) ||
        (card.items || []).some((i) => i.toLowerCase().includes(q)) ||
        (card.tags || []).some((t) => t.toLowerCase().includes(q));
      const tagMatch = !activeTag || (card.tags || []).includes(activeTag);
      return baseMatch && tagMatch;
    });
  };

  // JSON-LD injection 
  const jsonLd = content.jsonLd ? JSON.stringify(content.jsonLd) : null;

  return (
    <div className="bg-white">
      {/* JSON-LD SEO */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-orange-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          {content.breadcrumbs && content.breadcrumbs.length > 0 && (
            <nav className="mb-4 text-sm text-blue-700/80" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1">
                {content.breadcrumbs.map((bc, i) => (
                  <li key={bc.label} className="flex items-center gap-1">
                    {bc.href ? (
                      <Link className="hover:underline" href={bc.href}>
                        {bc.label}
                      </Link>
                    ) : (
                      <span className="text-slate-600">{bc.label}</span>
                    )}
                    {i < content.breadcrumbs!.length - 1 && <span className="text-slate-400">/</span>}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {content.hero.eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3">
              {content.hero.eyebrow}
            </p>
          )}
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-century-gothic-black text-gray-900 leading-tight">
              {content.hero.title}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-700 leading-relaxed">{content.hero.description}</p>

            {(content.hero.updatedAt || content.hero.readTime || content.hero.category) && (
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                {content.hero.category && (
                  <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 font-semibold text-slate-700 border border-white/60">
                    {content.hero.category}
                  </span>
                )}
                {content.hero.updatedAt && <span>Updated {content.hero.updatedAt}</span>}
                {content.hero.readTime && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>{content.hero.readTime}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {content.hero.actions && content.hero.actions.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-4">
              {content.hero.actions.map((action) => (
                <Link key={action.href + action.label} href={action.href} className={actionClasses(action.variant)}>
                  {action.label}
                </Link>
              ))}
            </div>
          )}

          {content.hero.overview && content.hero.overview.length > 0 && (
            <ul className="mt-10 grid gap-4 md:grid-cols-2">
              {content.hero.overview.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-500 to-orange-500" />
                  <p className="text-base text-gray-700 leading-relaxed">{point}</p>
                </li>
              ))}
            </ul>
          )}

          {content.hero.highlights && content.hero.highlights.length > 0 && (
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {content.hero.highlights.map((h) => (
                <div
                  key={h.label}
                  className="bg-white/70 backdrop-blur rounded-2xl p-6 border border-white/60 shadow-sm"
                >
                  <p className="text-3xl font-century-gothic-black text-gray-900">{h.value}</p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-gray-500">{h.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Article content*/}
      {content.article && content.article.blocks && content.article.blocks.length > 0 && (
        <section className="bg-white py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-slate max-w-none">
              {content.article.blocks.map((block, idx) => {
                if (block.type === "heading") {
                  const level = block.level || 2;
                  const base = "font-century-gothic-black text-gray-900 mt-10 first:mt-0";
                  if (level === 2) {
                    return (
                      <h2 key={idx} className={`text-3xl md:text-4xl ${base}`}>
                        {block.text}
                      </h2>
                    );
                  }
                  if (level === 3) {
                    return (
                      <h3 key={idx} className={`text-2xl md:text-3xl ${base}`}>
                        {block.text}
                      </h3>
                    );
                  }
                  return (
                    <h4 key={idx} className={`text-xl md:text-2xl ${base}`}>
                      {block.text}
                    </h4>
                  );
                }
                if (block.type === "paragraph") {
                  return (
                    <p key={idx} className="text-lg text-gray-700 leading-relaxed mt-6">
                      {block.text}
                    </p>
                  );
                }
                if (block.type === "list") {
                  const ListTag = block.ordered ? "ol" : "ul";
                  return (
                    <ListTag key={idx} className="mt-6 ml-6 grid gap-2 text-gray-700 text-base list-disc marker:text-blue-500">
                      {block.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ListTag>
                  );
                }
                if (block.type === "quote") {
                  return (
                    <blockquote key={idx} className="mt-8 border-l-4 border-blue-400 pl-4 italic text-slate-700">
                      <p>“{block.text}”</p>
                      {block.cite && <cite className="mt-2 block not-italic text-slate-500">{block.cite}</cite>}
                    </blockquote>
                  );
                }
                if (block.type === "callout") {
                  return (
                    <div key={idx} className="mt-8 rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50 to-orange-50 p-6 shadow-sm">
                      {block.title && (
                        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-2">{block.title}</p>
                      )}
                      <p className="text-gray-800 leading-relaxed">{block.text}</p>
                    </div>
                  );
                }
                if (block.type === "image") {
                  return (
                    <figure key={idx} className="mt-8">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={block.src} alt={block.alt || ""} className="w-full rounded-2xl border border-slate-100" />
                      {block.caption && (
                        <figcaption className="mt-2 text-sm text-slate-500">{block.caption}</figcaption>
                      )}
                    </figure>
                  );
                }
                if (block.type === "divider") {
                  return <hr key={idx} className="my-10 border-t border-slate-200" />;
                }
                return null;
              })}
            </div>
          </div>
        </section>
      )}

      {/* Utility bar: Search + ToC + Tag filter */}
      {(content.enableSearch || content.enableToc || allTags.length > 0) && (
        <section className="bg-white border-y border-slate-100 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center gap-4">
            {content.enableSearch && (
              <div className="relative md:flex-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search resources on this page…"
                  aria-label="Search resources on this page"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {content.enableToc && content.sections.length > 1 && (
              <div className="text-sm text-slate-600 md:ml-auto">
                <span className="font-semibold mr-2">Jump to:</span>
                <div className="inline-flex flex-wrap gap-2">
                  {content.sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${toKebab(s.id)}`}
                      className="rounded-full border border-slate-200 px-3 py-1 hover:bg-slate-50"
                    >
                      {s.title}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {allTags.length > 0 && (
              <div className="flex items-center gap-2 md:ml-4">
                <span className="text-sm text-slate-500">Filter:</span>
                <select
                  value={activeTag}
                  onChange={(e) => setActiveTag(e.target.value)}
                  className="text-sm rounded-lg border border-slate-200 px-2.5 py-2 bg-white"
                  aria-label="Filter by tag"
                >
                  <option value="">All</option>
                  {allTags.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Sections */}
      {content.sections.map((section, index) => {
        const filteredCards = filterCards(section.cards);
        const anchorId = toKebab(section.id);

        return (
          <section
            key={section.id}
            id={anchorId}
            className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50"} py-16 md:py-20`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {section.eyebrow && (
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3">
                  {section.eyebrow}
                </p>
              )}

              <div className="max-w-3xl">
                <div className="group flex items-baseline gap-2">
                  <h2 className="text-3xl md:text-4xl font-century-gothic-black text-gray-900 leading-tight">
                    {section.title}
                  </h2>
                  {/* copy link button */}
                  <button
                    className="opacity-0 group-hover:opacity-100 text-xs text-slate-500 hover:text-slate-700 transition"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        const url = `${window.location.origin}${window.location.pathname}#${anchorId}`;
                        navigator.clipboard?.writeText(url);
                      }
                    }}
                    aria-label={`Copy link to ${section.title}`}
                    title="Copy link"
                  >
                    # copy
                  </button>
                </div>
                <p className="mt-4 text-lg text-gray-600 leading-relaxed">{section.description}</p>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredCards.length === 0 ? (
                  <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                    No matches here. Try a different search or filter.
                  </div>
                ) : (
                  filteredCards.map((card) => {
                    const CardBody = (
                      <div className="h-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                        <div className="flex items-start gap-4">
                          <div
                            className={`rounded-2xl bg-gradient-to-br ${accentClasses[card.accent]} p-3 shadow-inner shadow-black/10`}
                            aria-hidden="true"
                          >
                            {renderIcon(card.icon)}
                          </div>
                          <div className="flex-1">
                            {card.badge && (
                              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                                {card.badge}
                              </span>
                            )}
                            <h3 className="mt-3 text-xl font-semibold text-gray-900">{card.title}</h3>
                          </div>
                        </div>

                        {card.image && (
                          <div className="mt-4 overflow-hidden rounded-xl border border-slate-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={card.image} alt="" className="w-full h-32 object-cover" />
                          </div>
                        )}

                        <p className="mt-4 text-base text-gray-600 leading-relaxed">{card.description}</p>

                        {card.items && card.items.length > 0 && (
                          <ul className="mt-4 space-y-2 text-sm text-gray-600">
                            {card.items.map((item) => (
                              <li key={item} className="flex gap-2">
                                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-orange-500" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {card.metrics && card.metrics.length > 0 && (
                          <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {card.metrics.map((metric) => (
                              <div key={metric.label} className="rounded-xl bg-blue-50/60 px-4 py-3">
                                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                                  {metric.label}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-gray-900">{metric.value}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {(card.link || card.href) && (
                          <div className="mt-6">
                            <span className="inline-flex items-center text-sm font-semibold text-blue-600 group/link hover:text-blue-700">
                              {(card.link && card.link.label) || "Learn more"}
                              <svg
                                className="ml-2 h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </span>
                          </div>
                        )}

                        {card.tags && card.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {card.tags.map((t) => (
                              <button
                                key={t}
                                className={`rounded-full border px-2.5 py-1 text-xs ${
                                  activeTag === t
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                                onClick={() => setActiveTag(activeTag === t ? "" : t)}
                                aria-label={`Filter by ${t}`}
                              >
                                #{t}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );

                    // Make entire card clickable if href present
                    return card.href ? (
                      <Link key={card.title} href={card.href} className="block focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-3xl">
                        {CardBody}
                      </Link>
                    ) : (
                      <div key={card.title}>{CardBody}</div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* Quick Links */}
      {content.quickLinks && (
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-blue-50 to-orange-50 p-10 shadow-lg">
              <div className="max-w-3xl">
                <h3 className="text-3xl font-century-gothic-black text-gray-900">
                  {content.quickLinks.title}
                </h3>
                {content.quickLinks.description && (
                  <p className="mt-4 text-lg text-gray-700 leading-relaxed">
                    {content.quickLinks.description}
                  </p>
                )}
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {content.quickLinks.items.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className="group rounded-2xl bg-white/80 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                      {item.label}
                    </p>
                    {item.description && (
                      <p className="mt-3 text-base text-gray-700 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600">
                      Explore
                      <svg
                        className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      {content.bottomCta && (
        <section className="bg-slate-900 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[2fr,1fr] items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">Next Steps</p>
                <h3 className="mt-4 text-3xl md:text-4xl font-century-gothic-black text-white leading-tight">
                  {content.bottomCta.title}
                </h3>
                <p className="mt-4 text-lg text-slate-200 leading-relaxed">
                  {content.bottomCta.description}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <Link href={content.bottomCta.primary.href} className={actionClasses("primary")}>
                  {content.bottomCta.primary.label}
                </Link>
                {content.bottomCta.secondary && (
                  <Link href={content.bottomCta.secondary.href} className={actionClasses("secondary")}>
                    {content.bottomCta.secondary.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
