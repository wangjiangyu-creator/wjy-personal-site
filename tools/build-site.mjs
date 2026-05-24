import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  academicActivities,
  academicHighlights,
  cvSections,
  expertiseAreas,
  mediaRecords,
  profile,
  profileLinks,
  profileMetrics,
  publications,
  researchTopics,
  site,
  sources,
} from "../src/data/site-data.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const labels = {
  en: {
    nav: ["Home", "Publications", "Commentaries", "Media", "Academic", "C.V.", "中文"],
    home: "index.html",
    publications: "publications.html",
    commentaries: "commentaries.html",
    media: "media.html",
    academic: "academic.html",
    cv: "cv.html",
    langHref: "zh/index.html",
    langName: "中文",
    bio: "Short Bio",
    profileLinks: "Scholar Profiles",
    atAGlance: "At a Glance",
    expertise: "Research Expertise",
    leadership: "Academic Leadership and Professional Engagement",
    research: "Recent Research Topics and Resources",
    featuredPublications: "Recent Publications",
    allPublications: "View all publications",
    politicalCommentaries: "Commentaries",
    allCommentaries: "View commentaries",
    mediaCommentaries: "Media",
    academicActivities: "Academic Activities",
    allAcademic: "View academic activities",
    cvTitle: "C.V.",
    cvSource: "Structured from the supplied curriculum vitae and profile source data.",
    academicFilters: "Academic Activity Filters",
    mediaExposure: "Interviews and Media Exposure",
    allMedia: "View media",
    verified: "Verified profile links only",
    verify: "Requires final publication check",
    sourceNote: "Sources",
    filterAll: "All",
    categories: "Publication Categories",
    commentaryFilters: "Commentary Filters",
    mediaFilters: "Media Filters",
    updated: "Generated from the supplied CV and verified public profile sources.",
    noChinese: "Chinese title not supplied in the CV",
  },
  zh: {
    nav: ["首页", "出版物", "时政评论", "媒体评论", "学术活动", "简历", "English"],
    home: "index.html",
    publications: "publications.html",
    commentaries: "commentaries.html",
    media: "media.html",
    academic: "academic.html",
    cv: "cv.html",
    langHref: "../index.html",
    langName: "English",
    bio: "简介",
    profileLinks: "学术主页",
    atAGlance: "概览",
    expertise: "研究专长",
    leadership: "学术与专业职务",
    research: "近期研究主题与资源",
    featuredPublications: "近期出版物",
    allPublications: "查看全部出版物",
    politicalCommentaries: "时政评论",
    allCommentaries: "查看时政评论",
    mediaCommentaries: "媒体评论",
    academicActivities: "学术活动",
    allAcademic: "查看学术活动",
    cvTitle: "简历",
    cvSource: "根据所提供简历及个人主页资料结构化整理。",
    academicFilters: "学术活动筛选",
    mediaExposure: "媒体报道与采访",
    allMedia: "查看媒体评论",
    verified: "仅列入已核实主页",
    verify: "发布前需再次核验",
    sourceNote: "资料来源",
    filterAll: "全部",
    categories: "出版物类别",
    commentaryFilters: "时政评论筛选",
    mediaFilters: "媒体筛选",
    updated: "根据所提供履历和已核实公开主页生成。",
    noChinese: "履历未提供中文题名",
  },
};

const categoryZh = new Map([
  ["Book", "著作"],
  ["Journal Article", "期刊论文"],
  ["Book Chapter", "书章"],
  ["Shorter Commentary", "短文与评论"],
  ["Working Paper", "工作论文"],
  ["Report / Policy Paper", "报告与政策论文"],
]);

const mediaTypeZh = new Map([
  ["commentary", "时政评论"],
  ["exposure", "媒体报道与采访"],
]);

const activityRoleLabels = {
  speaker: { en: "Speaker", zh: "发言人" },
  host: { en: "Host", zh: "主持人" },
  participant: { en: "Participant", zh: "与会嘉宾" },
  organizer: { en: "Organizer", zh: "组织者" },
  editor: { en: "Editor / speaker", zh: "主编／发言人" },
};

function esc(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function localized(value, lang) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.en || value.zh || "";
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function rootPrefix(lang) {
  return lang === "zh" ? "../" : "";
}

function internalHref(page, lang) {
  return lang === "zh" ? page : page;
}

function counterpartHref(page, lang) {
  if (lang === "zh") return `../${page}`;
  return `zh/${page}`;
}

function topicLookup(id, lang) {
  const topic = researchTopics.find((item) => item.id === id);
  return topic ? localized(topic.title, lang) : id;
}

function displayCategory(category, lang) {
  return lang === "zh" ? categoryZh.get(category) || category : category;
}

function displayMediaType(type, lang) {
  if (lang === "zh") return mediaTypeZh.get(type) || type;
  return type === "commentary" ? "Commentary" : "Media coverage / interview";
}

function displayActivityRole(role, lang) {
  return localized(activityRoleLabels[role], lang) || role;
}

function nav(page, lang) {
  const l = labels[lang];
  const links = [
    [l.nav[0], internalHref("index.html", lang), page === "home"],
    [l.nav[1], internalHref("publications.html", lang), page === "publications"],
    [l.nav[2], internalHref("commentaries.html", lang), page === "commentaries"],
    [l.nav[3], internalHref("media.html", lang), page === "media"],
    [l.nav[4], internalHref("academic.html", lang), page === "academic"],
    [l.nav[5], internalHref("cv.html", lang), page === "cv"],
    [l.nav[6], counterpartHref(page === "home" ? "index.html" : `${page}.html`, lang), false],
  ];
  return links
    .map(([text, href, active]) => `<a class="${active ? "active" : ""}" href="${href}">${esc(text)}</a>`)
    .join("");
}

function layout({ lang, page, title, description, body }) {
  const prefix = rootPrefix(lang);
  const l = labels[lang];
  return `<!doctype html>
<html lang="${lang === "zh" ? "zh-Hant" : "en"}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} | ${esc(localized(site.title, lang))}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="stylesheet" href="${prefix}assets/site.css">
  <script defer src="${prefix}assets/site.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="${internalHref("index.html", lang)}" aria-label="${esc(localized(site.title, lang))}">
        <span class="brand-mark">WJY</span>
        <span>${esc(localized(site.title, lang))}</span>
      </a>
      <nav aria-label="Primary navigation">${nav(page, lang)}</nav>
    </div>
  </header>
  <main id="main">${body}</main>
  <footer class="site-footer">
    <div class="wrap footer-grid">
      <div>
        <strong>${esc(localized(site.title, lang))}</strong>
        <p>${esc(l.updated)}</p>
      </div>
      <div>
        <strong>${esc(l.sourceNote)}</strong>
        <ul>
          ${sources
            .map((source) =>
              source.href
                ? `<li><a href="${esc(source.href)}">${esc(localized(source.label, lang))}</a></li>`
                : `<li>${esc(localized(source.label, lang))}</li>`,
            )
            .join("")}
        </ul>
      </div>
    </div>
  </footer>
</body>
</html>`;
}

function externalLink(record, text, classes = "text-link") {
  if (!record.url) return esc(text);
  return `<a class="${classes}" href="${esc(record.url)}">${esc(text)}</a>`;
}

function profileButtons(lang) {
  return `<div class="profile-links" aria-label="${esc(labels[lang].profileLinks)}">
    ${profileLinks
      .map(
        (link) => `<a class="profile-link" href="${esc(link.href)}">
          <span>${esc(localized(link.label, lang))}</span>
          <span aria-hidden="true">↗</span>
        </a>`,
      )
      .join("")}
  </div>`;
}

function metricsGrid(lang) {
  return `<div class="metrics-grid" aria-label="${esc(labels[lang].atAGlance)}">
    ${profileMetrics
      .map(
        (metric) => `<article class="metric-card">
          <strong>${esc(metric.value)}</strong>
          <span>${esc(localized(metric.label, lang))}</span>
          <p>${esc(localized(metric.note, lang))}</p>
        </article>`,
      )
      .join("")}
  </div>`;
}

function expertiseList(lang) {
  return `<div class="pill-grid">
    ${expertiseAreas
      .map((area) => {
        const topic = researchTopics.find((item) => item.id === area.topicId);
        const href = topic?.href || "#";
        return `<a class="expertise-pill" href="${esc(href)}">${esc(localized(area.label, lang))}</a>`;
      })
      .join("")}
  </div>`;
}

function highlightList(lang) {
  return `<div class="highlight-list">
    ${academicHighlights
      .map(
        (item) => `<article class="highlight-item">
          <h3>${esc(localized(item.title, lang))}</h3>
          <p>${esc(localized(item.detail, lang))}</p>
        </article>`,
      )
      .join("")}
  </div>`;
}

function researchCards(lang) {
  return `<div class="research-grid">
    ${researchTopics
      .map(
        (topic) => `<article class="research-card">
          <div class="card-topline">
            <span>${esc(topic.id.replaceAll("-", " "))}</span>
            ${topic.status === "verify" ? `<span class="status">${esc(labels[lang].verify)}</span>` : ""}
          </div>
          <h3><a href="${esc(topic.href)}">${esc(localized(topic.title, lang))}</a></h3>
          <p>${esc(localized(topic.description, lang))}</p>
        </article>`,
      )
      .join("")}
  </div>`;
}

function publicationCard(item, lang, compact = false) {
  const title = localized(item.title, lang) || localized(item.title, "en");
  const fallback = lang === "zh" && !item.title.zh ? `<p class="record-note">${esc(labels.zh.noChinese)}</p>` : "";
  const topics = item.topicIds.map((id) => `<span>${esc(topicLookup(id, lang))}</span>`).join("");
  return `<article class="record-card" data-record data-category="${esc(item.category)}" data-language="${esc(item.language)}" data-topic="${esc(item.topicIds.join(" "))}" data-year="${esc(item.year)}">
    <div class="record-meta">
      <span>${esc(item.year)}</span>
      <span>${esc(displayCategory(item.category, lang))}</span>
      <span>${esc(item.language)}</span>
    </div>
    <h3>${externalLink(item, title)}</h3>
    ${fallback}
    <p>${esc(item.venue)}</p>
    ${compact ? "" : `<div class="tags">${topics}</div>`}
  </article>`;
}

function mediaCard(item, lang, compact = false) {
  const title = localized(item.title, lang) || localized(item.title, "en");
  const summary = localized(item.summary, lang);
  const topics = item.topicIds.map((id) => `<span>${esc(topicLookup(id, lang))}</span>`).join("");
  return `<article class="record-card" data-record data-type="${esc(item.type)}" data-language="${esc(item.language)}" data-topic="${esc(item.topicIds.join(" "))}" data-year="${esc(item.date.slice(0, 4))}" data-outlet="${esc(slug(item.outlet))}">
    <div class="record-meta">
      <span>${esc(item.date)}</span>
      <span>${esc(displayMediaType(item.type, lang))}</span>
      <span>${esc(item.language)}</span>
    </div>
    <h3>${externalLink(item, title)}</h3>
    <p>${esc(item.outlet)}</p>
    ${summary && !compact ? `<p class="record-summary">${esc(summary)}</p>` : ""}
    ${compact ? "" : `<div class="tags">${topics}</div>`}
  </article>`;
}

function academicCard(item, lang) {
  const title = localized(item.title, lang) || localized(item.title, "en");
  const summary = localized(item.summary, lang);
  const topics = item.topicIds.map((id) => `<span>${esc(topicLookup(id, lang))}</span>`).join("");
  return `<article class="record-card" data-record data-role="${esc(item.role)}" data-topic="${esc(item.topicIds.join(" "))}" data-year="${esc(item.date.slice(0, 4))}">
    <div class="record-meta">
      <span>${esc(item.date)}</span>
      <span>${esc(displayActivityRole(item.role, lang))}</span>
      <span>${esc(item.organizer)}</span>
    </div>
    <h3>${externalLink(item, title)}</h3>
    <p>${esc(summary)}</p>
    <div class="tags">${topics}</div>
  </article>`;
}

function cvItem(item, lang) {
  const details = (item.details || [])
    .map((detail) => `<li>${esc(localized(detail, lang))}</li>`)
    .join("");
  return `<article class="cv-item">
    <div class="cv-meta">
      <span>${esc(item.period)}</span>
      <span>${esc(localized(item.institution, lang))}</span>
    </div>
    <h3>${esc(localized(item.title, lang))}</h3>
    ${details ? `<ul>${details}</ul>` : ""}
  </article>`;
}

function filterButtons(values, scope, criterion, lang, formatter = (value) => value) {
  return `<div class="filter-row" data-filter-scope="${esc(scope)}" aria-label="${esc(labels[lang].categories)}">
    <button type="button" class="filter-button active" data-filter-criterion="${esc(criterion)}" data-filter-value="all">${esc(labels[lang].filterAll)}</button>
    ${values
      .map((value) => {
        const option = typeof value === "object" ? value : { value, label: formatter(value) };
        return `<button type="button" class="filter-button" data-filter-criterion="${esc(criterion)}" data-filter-value="${esc(option.value)}">${esc(option.label)}</button>`;
      })
      .join("")}
  </div>`;
}

function homePage(lang) {
  const l = labels[lang];
  const featuredPubs = publications
    .filter((item) => item.featured)
    .sort((a, b) => b.year - a.year)
    .slice(0, 6);
  const featuredCommentary = mediaRecords
    .filter((item) => item.type === "commentary" && item.featured)
    .slice(0, 4);
  const featuredExposure = mediaRecords
    .filter((item) => item.type === "exposure" && item.featured)
    .slice(0, 4);

  const body = `
  <section class="hero">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">${esc(localized(profile.role, lang))}</p>
        <h1>${esc(localized(site.title, lang))}</h1>
        <p class="lead">${esc(localized(site.subtitle, lang))}</p>
        <p class="credentials">${esc(localized(profile.credentials, lang))}</p>
        ${profileButtons(lang)}
        <p class="verified-note">${esc(l.verified)}</p>
      </div>
      <aside class="portrait-panel" aria-label="${esc(localized(site.portrait.alt, lang))}">
        <img src="${esc(site.portrait.src)}" alt="${esc(localized(site.portrait.alt, lang))}" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';">
        <div class="portrait-fallback" aria-hidden="true">WJY</div>
      </aside>
    </div>
  </section>

  <section class="section-tight">
    <div class="wrap">
      <p class="section-kicker">${esc(l.atAGlance)}</p>
      ${metricsGrid(lang)}
    </div>
  </section>

  <section class="section">
    <div class="wrap two-column">
      <div>
        <p class="section-kicker">${esc(l.bio)}</p>
        <h2>${esc(localized(profile.name, lang))}</h2>
      </div>
      <div class="body-copy">
        ${profile.bio.map((para) => `<p>${esc(localized(para, lang))}</p>`).join("")}
      </div>
    </div>
  </section>

  <section class="section section-muted">
    <div class="wrap detail-grid">
      <div>
        <p class="section-kicker">${esc(l.expertise)}</p>
        <h2>${esc(l.expertise)}</h2>
        ${expertiseList(lang)}
      </div>
      <div>
        <p class="section-kicker">${esc(l.leadership)}</p>
        <h2>${esc(l.leadership)}</h2>
        ${highlightList(lang)}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-heading">
        <p class="section-kicker">${esc(l.research)}</p>
        <h2>${esc(l.research)}</h2>
      </div>
      ${researchCards(lang)}
    </div>
  </section>

  <section class="section">
    <div class="wrap split-sections">
      <div>
        <div class="section-heading compact">
          <p class="section-kicker">${esc(l.featuredPublications)}</p>
          <h2>${esc(l.featuredPublications)}</h2>
          <a class="button-link" href="${internalHref("publications.html", lang)}">${esc(l.allPublications)}</a>
        </div>
        <div class="record-list compact-list">${featuredPubs.map((item) => publicationCard(item, lang, true)).join("")}</div>
      </div>
      <div>
        <div class="section-heading compact">
          <p class="section-kicker">${esc(l.politicalCommentaries)}</p>
          <h2>${esc(l.politicalCommentaries)}</h2>
          <a class="button-link" href="${internalHref("commentaries.html", lang)}">${esc(l.allCommentaries)}</a>
        </div>
        <div class="record-list compact-list">${featuredCommentary.map((item) => mediaCard(item, lang, true)).join("")}</div>
      </div>
    </div>
  </section>

  <section class="section section-muted">
    <div class="wrap">
      <div class="section-heading compact">
        <p class="section-kicker">${esc(l.mediaCommentaries)}</p>
        <h2>${esc(l.mediaCommentaries)}</h2>
        <a class="button-link" href="${internalHref("media.html", lang)}">${esc(l.allMedia)}</a>
      </div>
      <div class="record-grid">${featuredExposure.map((item) => mediaCard(item, lang, true)).join("")}</div>
    </div>
  </section>`;

  return layout({
    lang,
    page: "home",
    title: localized(site.title, lang),
    description: localized(site.subtitle, lang),
    body,
  });
}

function publicationsPage(lang) {
  const l = labels[lang];
  const categories = ["Book", "Journal Article", "Book Chapter", "Shorter Commentary", "Working Paper", "Report / Policy Paper"];
  const languageValues = ["English", "Chinese"];
  const topicOptions = researchTopics.map((topic) => ({ value: topic.id, label: localized(topic.title, lang) }));
  const body = `
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow">${esc(l.featuredPublications)}</p>
      <h1>${esc(l.allPublications)}</h1>
      <p class="lead">${esc(lang === "zh" ? "按类别整理的履历出版物列表，涵盖著作、期刊论文、书章、短文评论、工作论文和政策报告。" : "A CV-derived bibliography grouped by books, journal articles, chapters, commentaries, working papers, and policy papers.")}</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="filter-panel">
        ${filterButtons(categories, "pubs", "category", lang, (value) => displayCategory(value, lang))}
        ${filterButtons(languageValues, "pubs", "language", lang, (value) => value)}
        ${filterButtons(topicOptions, "pubs", "topic", lang)}
      </div>
      <div class="record-list" data-record-container="pubs">
        ${publications
          .slice()
          .sort((a, b) => b.year - a.year || a.category.localeCompare(b.category))
          .map((item) => publicationCard(item, lang))
          .join("")}
      </div>
    </div>
  </section>`;
  return layout({
    lang,
    page: "publications",
    title: l.allPublications,
    description: "Publications by Professor Wang Jiangyu",
    body,
  });
}

function commentariesPage(lang) {
  const l = labels[lang];
  const records = mediaRecords.filter((item) => item.type === "commentary");
  const languageValues = ["English", "Chinese"];
  const yearValues = [...new Set(records.map((item) => item.date.slice(0, 4)))].sort((a, b) => b.localeCompare(a));
  const outletOptions = [...new Map(records.map((item) => [slug(item.outlet), item.outlet])).entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const topicOptions = researchTopics.map((topic) => ({ value: topic.id, label: localized(topic.title, lang) }));
  const body = `
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow">${esc(l.politicalCommentaries)}</p>
      <h1>${esc(l.politicalCommentaries)}</h1>
      <p class="lead">${esc(lang === "zh" ? "收录王江雨教授本人撰写的时政、国际关系、国际法与政治经济评论；中文文章优先保留原题名，英文版提供简介性翻译。" : "Authored commentaries by Professor Wang on current affairs, international law, economic relations, and Hong Kong. Chinese originals use concise English translations for orientation.")}</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="filter-panel">
        ${filterButtons(languageValues, "commentaries", "language", lang, (value) => value)}
        ${filterButtons(yearValues, "commentaries", "year", lang, (value) => value)}
        ${filterButtons(outletOptions, "commentaries", "outlet", lang)}
        ${filterButtons(topicOptions, "commentaries", "topic", lang)}
      </div>
      <div class="record-list" data-record-container="commentaries">
        ${records
          .slice()
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((item) => mediaCard(item, lang))
          .join("")}
      </div>
    </div>
  </section>`;
  return layout({
    lang,
    page: "commentaries",
    title: l.politicalCommentaries,
    description: "Authored commentaries by Professor Wang Jiangyu",
    body,
  });
}

function mediaPage(lang) {
  const l = labels[lang];
  const records = mediaRecords.filter((item) => item.type === "exposure");
  const languageValues = ["English", "Chinese"];
  const yearValues = [...new Set(records.map((item) => item.date.slice(0, 4)))].sort((a, b) => b.localeCompare(a));
  const outletOptions = [...new Map(records.map((item) => [slug(item.outlet), item.outlet])).entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const topicOptions = researchTopics.map((topic) => ({ value: topic.id, label: localized(topic.title, lang) }));
  const body = `
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow">${esc(l.mediaCommentaries)}</p>
      <h1>${esc(l.mediaCommentaries)}</h1>
      <p class="lead">${esc(lang === "zh" ? "收录报刊、通讯社、电视、网络媒体和机构新闻中的采访、引用、报道与视频节目；王江雨教授本人撰写的评论文章已移至“时政评论”栏目。" : "A focused archive of interviews, quoted analysis, broadcast appearances, and news coverage. Authored opinion articles have moved to the parallel Commentaries section.")}</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="filter-panel">
        ${filterButtons(languageValues, "media", "language", lang, (value) => value)}
        ${filterButtons(yearValues, "media", "year", lang, (value) => value)}
        ${filterButtons(outletOptions, "media", "outlet", lang)}
        ${filterButtons(topicOptions, "media", "topic", lang)}
      </div>
      <div class="record-list" data-record-container="media">
        ${records
          .slice()
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((item) => mediaCard(item, lang))
          .join("")}
      </div>
    </div>
  </section>`;
  return layout({
    lang,
    page: "media",
    title: l.mediaCommentaries,
    description: "Media interviews, commentary, and coverage featuring Professor Wang Jiangyu",
    body,
  });
}

function academicPage(lang) {
  const l = labels[lang];
  const records = academicActivities.slice().sort((a, b) => b.date.localeCompare(a.date));
  const yearValues = [...new Set(records.map((item) => item.date.slice(0, 4)))].sort((a, b) => b.localeCompare(a));
  const roleOptions = [...new Set(records.map((item) => item.role))].map((role) => ({ value: role, label: displayActivityRole(role, lang) }));
  const topicOptions = researchTopics.map((topic) => ({ value: topic.id, label: localized(topic.title, lang) }));
  const body = `
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow">${esc(l.academicActivities)}</p>
      <h1>${esc(l.academicActivities)}</h1>
      <p class="lead">${esc(lang === "zh" ? "近五年会议、论坛、讲座和学术交流记录；中文页保留会议报道原题，并提供中文简介。" : "A recent record of conferences, forums, lectures, and scholarly exchanges. Chinese-source reports are presented here with concise English translations for orientation.")}</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="filter-panel">
        ${filterButtons(yearValues, "academic", "year", lang, (value) => value)}
        ${filterButtons(roleOptions, "academic", "role", lang)}
        ${filterButtons(topicOptions, "academic", "topic", lang)}
      </div>
      <div class="record-list" data-record-container="academic">
        ${records.map((item) => academicCard(item, lang)).join("")}
      </div>
    </div>
  </section>`;
  return layout({
    lang,
    page: "academic",
    title: l.academicActivities,
    description: "Academic activities by Professor Wang Jiangyu",
    body,
  });
}

function cvPage(lang) {
  const l = labels[lang];
  const body = `
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow">${esc(l.cvTitle)}</p>
      <h1>${esc(l.cvTitle)}</h1>
      <p class="lead">${esc(l.cvSource)}</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap cv-layout">
      <nav class="cv-section-nav" aria-label="${esc(l.cvTitle)}">
        ${cvSections.map((section) => `<a href="#${esc(section.id)}">${esc(localized(section.title, lang))}</a>`).join("")}
      </nav>
      <div class="cv-sections">
        ${cvSections
          .map(
            (section) => `<section class="cv-section" id="${esc(section.id)}">
              <div class="section-heading compact">
                <p class="section-kicker">${esc(l.cvTitle)}</p>
                <h2>${esc(localized(section.title, lang))}</h2>
              </div>
              <div class="cv-item-list">${section.items.map((item) => cvItem(item, lang)).join("")}</div>
            </section>`,
          )
          .join("")}
      </div>
    </div>
  </section>`;
  return layout({
    lang,
    page: "cv",
    title: l.cvTitle,
    description: "Curriculum vitae of Professor Wang Jiangyu",
    body,
  });
}

const outputs = new Map([
  ["index.html", homePage("en")],
  ["publications.html", publicationsPage("en")],
  ["commentaries.html", commentariesPage("en")],
  ["media.html", mediaPage("en")],
  ["academic.html", academicPage("en")],
  ["cv.html", cvPage("en")],
  ["zh/index.html", homePage("zh")],
  ["zh/publications.html", publicationsPage("zh")],
  ["zh/commentaries.html", commentariesPage("zh")],
  ["zh/media.html", mediaPage("zh")],
  ["zh/academic.html", academicPage("zh")],
  ["zh/cv.html", cvPage("zh")],
]);

for (const [rel, html] of outputs) {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, "utf8");
}

console.log(`Generated ${outputs.size} pages`);
