import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const requiredFiles = [
  "index.html",
  "publications.html",
  "commentaries.html",
  "media.html",
  "academic.html",
  "cv.html",
  "zh/index.html",
  "zh/publications.html",
  "zh/commentaries.html",
  "zh/media.html",
  "zh/academic.html",
  "zh/cv.html",
  "assets/site.css",
  "assets/site.js",
  "src/data/site-data.mjs",
];

for (const rel of requiredFiles) {
  assert.ok(fs.existsSync(path.join(root, rel)), `Missing required file: ${rel}`);
}

const data = await import(pathToFileURL(path.join(root, "src/data/site-data.mjs")).href);

assert.equal(data.researchTopics.length, 11, "Expected exactly eleven research topics");
assert.ok(data.researchTopics.every((topic) => topic.title?.en && topic.title?.zh), "Research topics must be bilingual");
assert.ok(data.researchTopics.every((topic) => /^https?:\/\//.test(topic.href || "")), "Research topic URLs must be complete HTTP(S) URLs");
assert.ok(
  data.researchTopics.some((topic) => topic.id === "gba" && topic.status === "verify"),
  "GBA topic must be flagged for final verification",
);
for (const expectedTopicId of [
  "lw6134-company-law-china",
  "great-powers-rule-making",
  "ai-geopolitics-law-teaching",
  "legal-research-methodology",
]) {
  assert.ok(data.researchTopics.some((topic) => topic.id === expectedTopicId), `Missing research topic: ${expectedTopicId}`);
}

const profileNames = data.profileLinks.map((link) => link.label.en);
assert.deepEqual(profileNames, ["CityUHK Profile", "CityUHK Scholar", "Google Scholar", "SSRN"], "Only verified profile links should be included");
assert.ok(data.profileMetrics.length >= 4, "Homepage should include profile metrics");
assert.ok(data.expertiseAreas.length >= 7, "Homepage should include expertise areas");
assert.ok(data.academicHighlights.length >= 6, "Homepage should include academic and professional highlights");

assert.ok(Array.isArray(data.academicActivities), "Academic activities data must be exported");
assert.ok(data.academicActivities.length >= 52, "Academic page should include an expanded activity set");
assert.ok(
  data.academicActivities.every(
    (item) =>
      item.id &&
      item.date &&
      item.title?.en &&
      item.title?.zh &&
      item.summary?.en &&
      item.summary?.zh &&
      (item.url || (item.sourceNote?.en && item.sourceNote?.zh) || item.attachments?.length),
  ),
  "Academic activity records must be bilingual and have either a public URL, an on-file source note, or a supporting attachment",
);
const recentAcademicActivities = data.academicActivities.filter((item) => item.date >= "2024-05-24");
assert.ok(recentAcademicActivities.length >= 42, "Academic page should prioritize a substantial past-two-years activity set");
assert.ok(
  data.academicActivities.every((item) => item.date >= "2021-05-24"),
  "Academic activity records should focus on the past five years",
);
for (const id of [
  "must-cross-border-legal-review-forum-2026",
  "nwupul-hk-legal-services-forum-2025",
  "multilateralism-international-rule-law-2025",
  "foreign-related-rule-of-law-forum-2025",
  "reimagining-international-economic-law-2025",
  "unescap-regional-trade-agreements-2024",
  "ip-judicial-protection-gba-2024",
  "guangzhou-forum-2024",
  "aclf-annual-conference-2024",
  "gba-legal-institutional-cooperation-2024",
  "histories-international-law-china-conference-2023",
  "east-asia-forum-2023",
  "climate-change-post-pandemic-2022",
  "china-judicial-reform-workshop-2022",
  "research-retreat-2021",
  "gig-guangzhou-forum-2025",
  "cologne-east-asian-studies-mou-2025",
  "wiselaw-ai-teaching-assistant-2025",
  "international-law-on-campus-2025",
  "durham-gpi-mou-2025",
  "zjgsu-national-security-seminar-2025",
  "silk-road-expo-commercial-legal-services-2024",
  "sensetime-global-ai-summit-2024",
  "foreign-related-legal-construction-seminar-2024",
  "hku-alsa-young-scholars-conference-2025",
  "he-xin-hku-book-talk-2025",
  "eighth-gba-legal-symposium-2024",
  "ipp-young-scholars-forum-2024",
  "histories-international-law-lecture-series-2022",
  "might-right-global-power-rivalry-2026",
  "histories-international-law-book-publication-2026",
  "cybersecurity-law-society-2025",
  "qualitative-research-sociology-law-2025",
  "corporate-legal-core-capacity-training-2026",
  "gig-rules-linkage-regional-integration-2025",
  "shaanxi-ccpit-foreign-related-rule-law-lecture-2025",
  "sysu-geopolitics-international-economic-order-2025",
  "fudan-us-national-security-strategy-2026",
  "fudan-international-economic-law-future-2025",
  "silk-road-institute-international-rule-making-lecture-2025",
  "iia-apec-lecture-training-2026",
  "cass-gba-rule-of-law-forum-2025",
  "hku-sustainability-antitrust-fiduciary-duties-workshop-2025",
  "tsinghua-world-rule-of-law-forum-2025",
  "uncitral-rcap-um-digital-trade-legal-harmonization-2025",
  "hkcml-sustainability-iel-reform-2025",
  "hkiltta-common-law-dialogue-2025",
  "china-eu-common-ground-xian-2026",
  "eurasia-economic-forum-bri-commercial-legal-services-2025",
  "cccl-chinese-comparative-law-junior-scholars-forum-2026",
  "hkipa-gba-cross-border-legal-rules-training-2026",
  "hkmacao-institute-hainan-free-trade-port-seminar-2026",
]) {
  assert.ok(data.academicActivities.some((item) => item.id === id), `Missing prioritized academic activity: ${id}`);
}
for (const id of [
  "hku-sustainability-antitrust-fiduciary-duties-workshop-2025",
  "tsinghua-world-rule-of-law-forum-2025",
  "hkcml-sustainability-iel-reform-2025",
  "hkiltta-common-law-dialogue-2025",
  "fudan-international-economic-law-future-2025",
  "eurasia-economic-forum-bri-commercial-legal-services-2025",
  "cccl-chinese-comparative-law-junior-scholars-forum-2026",
  "hkipa-gba-cross-border-legal-rules-training-2026",
  "hkmacao-institute-hainan-free-trade-port-seminar-2026",
]) {
  const activity = data.academicActivities.find((item) => item.id === id);
  assert.ok(activity?.sourceNote?.en && activity?.sourceNote?.zh, `On-file academic activity should include a bilingual source note: ${id}`);
}
const requiredAcademicAttachments = new Map([
  [
    "cccl-chinese-comparative-law-junior-scholars-forum-2026",
    [
      "assets/academic/2026-cccl-junior-scholars-forum-poster.pdf",
      "assets/academic/2026-cccl-junior-scholars-forum-programme.pdf",
    ],
  ],
  [
    "china-eu-common-ground-xian-2026",
    ["assets/academic/2026-xian-china-eu-conference-handbook.pdf"],
  ],
  [
    "hkiltta-common-law-dialogue-2025",
    [
      "assets/academic/2026-hkiltta-common-law-training-invitation.pdf",
      "assets/academic/2026-hkiltta-common-law-training-programme.pdf",
    ],
  ],
  [
    "hkcml-sustainability-iel-reform-2025",
    [
      "assets/academic/2025-hkcml-sustainability-iel-reform-agenda.pdf",
      "assets/academic/2025-hkcml-sustainability-iel-reform-poster.pdf",
    ],
  ],
  [
    "uncitral-rcap-um-digital-trade-legal-harmonization-2025",
    ["assets/academic/2025-uncitral-rcap-um-joint-conference-program.pdf"],
  ],
  [
    "tsinghua-world-rule-of-law-forum-2025",
    ["assets/academic/2025-tsinghua-world-rule-of-law-forum-agenda.pdf"],
  ],
  [
    "hku-sustainability-antitrust-fiduciary-duties-workshop-2025",
    ["assets/academic/2025-hku-sustainability-workshop-programme.pdf"],
  ],
  [
    "cass-gba-rule-of-law-forum-2025",
    ["assets/academic/2025-cass-gba-rule-of-law-forum-programme.pdf"],
  ],
  [
    "fudan-international-economic-law-future-2025",
    ["assets/academic/2025-fudan-international-economic-law-future-invitation.pdf"],
  ],
  [
    "multilateralism-international-rule-law-2025",
    ["assets/academic/2025-world-international-law-congress-invitation.docx"],
  ],
  [
    "eurasia-economic-forum-bri-commercial-legal-services-2025",
    ["assets/academic/2025-eurasia-economic-forum-bri-commercial-legal-services-invitation.pdf"],
  ],
  [
    "hkipa-gba-cross-border-legal-rules-training-2026",
    [
      "assets/academic/2026-hkipa-gba-cross-border-legal-rules-training-invitation.pdf",
      "assets/academic/2026-hkipa-gba-cross-border-legal-rules-training-invitation-hkipa.pdf",
    ],
  ],
  [
    "hkmacao-institute-hainan-free-trade-port-seminar-2026",
    [
      "assets/academic/2026-hkmacao-institute-hainan-free-trade-port-invitation.pdf",
      "assets/academic/2026-hkmacao-institute-hainan-free-trade-port-invitation-alt.pdf",
      "assets/academic/2026-hkmacao-institute-hainan-free-trade-port-invitation-drc.pdf",
    ],
  ],
]);
for (const [id, hrefs] of requiredAcademicAttachments) {
  const activity = data.academicActivities.find((item) => item.id === id);
  assert.ok(activity?.attachments?.length >= hrefs.length, `Academic activity should include supporting PDF attachments: ${id}`);
  assert.ok(
    activity.attachments.every((attachment) => attachment.label?.en && attachment.label?.zh && attachment.href),
    `Academic activity attachments must be bilingual and linkable: ${id}`,
  );
  for (const href of hrefs) {
    assert.ok(activity.attachments.some((attachment) => attachment.href === href), `Missing attachment ${href} on ${id}`);
    assert.ok(fs.existsSync(path.join(root, href)), `Missing academic attachment file: ${href}`);
  }
}
for (const [id, phrase] of [
  ["cccl-chinese-comparative-law-junior-scholars-forum-2026", "opening remarks"],
  ["china-eu-common-ground-xian-2026", "panel speaker"],
  ["hkiltta-common-law-dialogue-2025", "moderator"],
  ["eurasia-economic-forum-bri-commercial-legal-services-2025", "roundtable"],
  ["hkipa-gba-cross-border-legal-rules-training-2026", "lecturer"],
  ["hkmacao-institute-hainan-free-trade-port-seminar-2026", "20-minute presentation"],
]) {
  const activity = data.academicActivities.find((item) => item.id === id);
  assert.ok(activity?.roleNote?.en.toLowerCase().includes(phrase), `Academic activity should highlight Professor Wang's role: ${id}`);
}
const academicActivityUrls = new Set(data.academicActivities.map((item) => item.url));
assert.ok(
  academicActivityUrls.has("https://mp.weixin.qq.com/s/LwWc8YQq__zlqNJDDpTXyQ"),
  "Academic activities should include the GIG post-event recap",
);
assert.ok(
  !academicActivityUrls.has("https://mp.weixin.qq.com/s/vxDN2QkIimoKTCLRU_IhHQ"),
  "Academic activities should avoid adding the duplicate GIG preview",
);
assert.ok(
  !academicActivityUrls.has("https://mp.weixin.qq.com/s/TfQdJV7hCP0AIsqAsJFzzQ"),
  "Academic activities should avoid duplicating the existing Zhejiang Gongshang University seminar record",
);
assert.ok(
  !academicActivityUrls.has("https://mp.weixin.qq.com/s/RMmLnDxwrskz-moU-G5Gow"),
  "Academic activities should keep media-commentary items out of the Academic page",
);

assert.ok(Array.isArray(data.cvSections), "CV sections data must be exported");
assert.deepEqual(
  data.cvSections.map((section) => section.id),
  [
    "education",
    "work-experience",
    "editorial-membership",
    "bar-qualifications",
    "honours-awards",
    "academic-appointments",
    "professional-appointments",
    "teaching",
    "research-administration-services",
  ],
  "CV page should use the requested section order",
);
assert.ok(
  data.cvSections.every((section) => section.title?.en && section.title?.zh && Array.isArray(section.items) && section.items.length > 0),
  "Every CV section should be bilingual and contain entries",
);
assert.ok(
  data.cvSections.reduce((total, section) => total + section.items.length, 0) >= 42,
  "CV page should include the full 2026 CV section detail, not only a short legacy summary",
);

assert.ok(data.publications.length >= 40, "Expected a substantial CV-derived publications list");
assert.ok(data.publications.filter((item) => item.featured).length >= 5, "Homepage needs at least five featured publications");
for (const category of ["Book", "Journal Article", "Book Chapter", "Shorter Commentary", "Working Paper", "Report / Policy Paper"]) {
  assert.ok(data.publications.some((item) => item.category === category), `Missing publication category: ${category}`);
}
for (const item of data.publications) {
  assert.ok(item.id && item.title?.en && item.year && item.category && item.venue, `Publication record is incomplete: ${item.id}`);
  assert.ok(Array.isArray(item.topicIds), `Publication topicIds must be an array: ${item.id}`);
}

assert.ok(data.mediaRecords.length >= 158, "Expected expanded CV-derived media/commentary records");
assert.ok(data.mediaRecords.filter((item) => item.language === "Chinese").length >= 123, "Expected Chinese-language media to be prioritized");
assert.ok(
  data.mediaRecords.filter((item) => item.type === "exposure" && item.date >= "2021-01-01").length >= 46,
  "Expected a substantial set of recent media interviews and quoted coverage",
);
assert.ok(
  data.mediaRecords.filter((item) => item.language === "Chinese" && item.summary?.en && item.summary?.zh).length >= 30,
  "Chinese media records should include English and Chinese short summaries",
);
assert.ok(data.mediaRecords.some((item) => item.type === "commentary"), "Missing media commentaries");
assert.ok(data.mediaRecords.some((item) => item.type === "exposure"), "Missing media exposure records");
assert.ok(data.mediaRecords.filter((item) => item.type === "commentary").length >= 56, "Commentaries page needs expanded authored and text-interview records");
assert.ok(data.mediaRecords.filter((item) => item.type === "commentary" && item.outlet === "Ming Pao").length >= 11, "Expected multiple Ming Pao commentaries");
assert.ok(data.mediaRecords.filter((item) => item.type === "exposure").length >= 102, "Media commentaries page should retain interview and coverage records");
assert.ok(data.mediaRecords.filter((item) => item.type === "exposure" && item.outlet === "Lianhe Zaobao").length >= 45, "Expected expanded Lianhe Zaobao media exposure records");
for (const id of [
  "armored-vehicle-detention",
  "south-china-sea-politics-law-interests",
  "dw-thaad-interlude",
  "initium-g20-interview",
  "phoenix-mainland-qa-international-order-2026",
  "cgtn-point-macao-25-2024",
  "zaobao-taiwan-strait-us-china-2022",
  "ifeng-talk-lee-hsien-loong-2022",
  "zaobao-asian-forward-summit-taiwan-2023",
  "zaobao-dongtanxilun-xi-russia-2023",
  "zaobao-russia-ukraine-global-order-2022",
  "zaobao-trump-second-term-us-china-2024",
  "zaobao-iran-us-strike-international-law-2025",
  "zaobao-taiwan-legal-war-jurisdiction-2025",
  "zaobao-china-iran-us-middle-east-balance-2026",
  "zaobao-venezuela-taiwan-us-force-2026",
  "zaobao-prince-group-cambodia-extradition-2026",
  "zaobao-shangri-la-us-philippines-treaty-2024",
  "zaobao-shangri-la-us-china-rhetorical-war-2024",
  "zaobao-lee-hsien-loong-diplomacy-2024",
  "zaobao-taiwan-election-war-game-2024",
  "mingpao-new-era-gentry-2025",
  "mingpao-trump-tariff-policy-2025",
  "mingpao-us-china-trade-talks-order-2025",
  "mingpao-ma-ying-jeou-values-2025",
  "mingpao-talking-us-china-relations-2024",
  "mingpao-russia-ukraine-rule-of-law-2022",
  "mingpao-foreign-judges-commercial-centre-2022",
  "mingpao-us-gun-violence-2022",
  "mingpao-singapore-approach-homosexuality-2022",
  "mingpao-hk-international-financial-centre-2022",
  "mingpao-power-authority-2022",
  "ipp-reciprocal-tariffs-2025",
  "ipp-us-china-competition-strength-through-struggle-2026",
  "ipp-us-national-security-strategy-2026",
  "phoenix-international-thinktank-singapore-diplomacy-2017",
  "phoenix-century-lecture-south-china-sea-arbitration-2016",
  "scmp-foreign-related-rule-law-talent-2024",
  "scmp-domestic-law-abroad-2025",
  "hk01-legal-education-reform-2021",
]) {
  assert.ok(data.mediaRecords.some((item) => item.id === id), `Missing newly prioritized Chinese media record: ${id}`);
}
assert.ok(data.mediaRecords.filter((item) => item.featured).length >= 6, "Homepage needs featured media records");
for (const item of data.mediaRecords) {
  assert.ok(item.id && item.title?.en && item.date && item.outlet && item.language && item.type, `Media record is incomplete: ${item.id}`);
  assert.ok(Array.isArray(item.topicIds), `Media topicIds must be an array: ${item.id}`);
}

const htmlFiles = requiredFiles.filter((rel) => rel.endsWith(".html"));
for (const rel of htmlFiles) {
  const html = fs.readFileSync(path.join(root, rel), "utf8");
  assert.ok(html.includes("Professor Wang Jiangyu and Research") || html.includes("王江雨教授及其研究"), `${rel} missing site title`);
  assert.ok(!html.includes('href="/') && !html.includes('src="/'), `${rel} contains root-relative paths`);
  assert.ok(!html.includes("ResearchGate"), `${rel} should not include unverified ResearchGate link`);
}

const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const zhIndex = fs.readFileSync(path.join(root, "zh/index.html"), "utf8");
const publicationsPage = fs.readFileSync(path.join(root, "publications.html"), "utf8");
const commentariesPage = fs.readFileSync(path.join(root, "commentaries.html"), "utf8");
const zhCommentariesPage = fs.readFileSync(path.join(root, "zh/commentaries.html"), "utf8");
const mediaPage = fs.readFileSync(path.join(root, "media.html"), "utf8");
const zhMediaPage = fs.readFileSync(path.join(root, "zh/media.html"), "utf8");
const academicPage = fs.readFileSync(path.join(root, "academic.html"), "utf8");
const zhAcademicPage = fs.readFileSync(path.join(root, "zh/academic.html"), "utf8");
const cvPage = fs.readFileSync(path.join(root, "cv.html"), "utf8");
const zhCvPage = fs.readFileSync(path.join(root, "zh/cv.html"), "utf8");
for (const expected of [
  "https://scholars.cityu.edu.hk/en/persons/jwang623",
  "https://scholar.google.com/citations?user=3xl2kbAAAAAJ",
  "https://papers.ssrn.com/sol3/cf_dev/AbsByAuth.cfm?per_id=372334",
  "https://int.eastlaw.wang",
  "https://gba.eastlaw.wang",
]) {
  assert.ok(index.includes(expected), `Homepage missing expected link: ${expected}`);
}

assert.ok(zhIndex.includes("王江雨教授及其研究"), "Chinese homepage title should be 王江雨教授及其研究");
assert.ok(index.includes("Academic Leadership and Professional Engagement"), "Homepage should include leadership detail");
assert.ok(index.includes("Research Expertise"), "Homepage should include expertise detail");
assert.ok(index.includes('href="commentaries.html"') && index.includes("Commentaries"), "English navigation should include Commentaries");
assert.ok(index.includes('href="academic.html"') && index.includes("Academic"), "English navigation should include Academic");
assert.ok(index.includes('href="cv.html"') && index.includes("C.V."), "English navigation should include C.V.");
assert.ok(index.includes('href="media.html"') && index.includes(">Media<"), "English navigation should label Media as Media");
assert.ok(!index.includes(">Media Commentaries<"), "English navigation should not use Media Commentaries");
assert.ok(zhIndex.includes("学术与专业职务"), "Chinese homepage should include leadership detail");
assert.ok(publicationsPage.includes('data-filter-criterion="topic"'), "Publications page should filter by topic");
assert.ok(publicationsPage.includes('data-filter-criterion="language"'), "Publications page should filter by language");
assert.ok(zhIndex.includes('href="commentaries.html"') && zhIndex.includes("\u65f6\u653f\u8bc4\u8bba"), "Chinese navigation should include Commentaries");
assert.ok(zhIndex.includes('href="academic.html"') && zhIndex.includes("\u5b66\u672f\u6d3b\u52a8"), "Chinese navigation should include Academic activities");
assert.ok(zhIndex.includes('href="cv.html"') && zhIndex.includes("\u7b80\u5386"), "Chinese navigation should include CV");
assert.ok(zhIndex.includes("\u5a92\u4f53\u8bc4\u8bba"), "Chinese navigation should rename Media to Media Commentaries");
assert.ok(commentariesPage.includes('data-record-container="commentaries"'), "Commentaries page should have a dedicated record container");
assert.ok(commentariesPage.includes('data-type="commentary"'), "Commentaries page should include authored commentaries");
assert.ok(!commentariesPage.includes('data-type="exposure"'), "Commentaries page should not include media exposure records");
assert.ok(commentariesPage.includes("Huawei's Meng Wanzhou: Can Canada rectify a bad start?"), "Authored commentaries should move to the Commentaries page");
assert.ok(commentariesPage.includes("Chinese originals use concise English translations"), "English Commentaries page should explain translated Chinese commentaries");
assert.ok(zhCommentariesPage.includes("\u738b\u6c5f\u96e8\uff1a\u7279\u6717\u666e\u7b2c\u4e8c\u4efb\u671f\u7684\u4e2d\u7f8e\u5173\u7cfb"), "Chinese Commentaries page should keep original Chinese commentary titles");
assert.ok(zhCommentariesPage.includes("\u660e\u62a5") || zhCommentariesPage.includes("Ming Pao"), "Chinese Commentaries page should include Ming Pao additions");
assert.ok(zhCommentariesPage.includes("\u7279\u6717\u666e\u7684\u95dc\u7a05\u653f\u7b56"), "Chinese Commentaries page should include the added Ming Pao tariff commentary");
assert.ok(zhCommentariesPage.includes("\u4e2d\u7f8e\u8cbf\u6613\u8ac7\u5224\u7684\u570b\u969b\u683c\u5c40\u610f\u7fa9"), "Chinese Commentaries page should include the added Ming Pao trade-talks commentary");
assert.ok(zhCommentariesPage.includes("\u99ac\u82f1\u4e5d\u7684\u50f9\u503c\u89c0\u8207\u50f9\u503c"), "Chinese Commentaries page should include the added Ming Pao Ma Ying-jeou commentary");
assert.ok(zhCommentariesPage.includes("\u570b\u969b\u5546\u696d\u4e2d\u5fc3\u8207\u5916\u7c4d\u6cd5\u5b98"), "Chinese Commentaries page should include the added Ming Pao foreign-judges commentary");
assert.ok(zhCommentariesPage.includes("IPP\u4e13\u8bbf"), "Chinese Commentaries page should include IPP text interviews");
assert.ok(zhCommentariesPage.includes("\u51e4\u51f0"), "Chinese Commentaries page should include Phoenix text commentary/interview records");
assert.ok(mediaPage.includes('data-filter-criterion="year"'), "Media page should filter by year");
assert.ok(mediaPage.includes('data-filter-criterion="outlet"'), "Media page should filter by outlet");
assert.ok(mediaPage.includes("interviews, quoted analysis, broadcast appearances, and news coverage"), "English media page should explain the media-commentary scope");
assert.ok(!mediaPage.includes('data-type="commentary"'), "Media page should not include authored commentaries after migration");
assert.ok(mediaPage.includes('data-type="exposure"'), "Media page should keep media exposure records");
assert.ok(!mediaPage.includes("Huawei's Meng Wanzhou: Can Canada rectify a bad start?"), "Authored commentaries should be absent from Media Commentaries");
assert.ok(zhMediaPage.includes("\u5a92\u4f53\u8bc4\u8bba"), "Chinese media page should use the renamed heading");
assert.ok(academicPage.includes('data-record-container="academic"'), "Academic page should have a dedicated record container");
assert.ok(academicPage.includes("Academic Activities"), "English Academic page should use the Academic Activities heading");
assert.ok(
  academicPage.includes("Professor Wang was invited to speak at the international symposium on multilateralism"),
  "English Academic page should include descriptive translations",
);
assert.ok(
  academicPage.includes("Professor Wang joined the fifth Mainland-Hong Kong-Macao legal education deans forum"),
  "English Academic page should include the 2026 forum translation",
);
assert.ok(zhAcademicPage.includes("\u5b66\u672f\u6d3b\u52a8"), "Chinese Academic page should use the Chinese heading");
assert.ok(
  zhAcademicPage.includes("\u738b\u6c5f\u96e8\u6559\u6388\u53d7\u9080\u51fa\u5e2d\u300c\u591a\u908a\u4e3b\u7fa9\u8207\u570b\u969b\u6cd5\u6cbb\u5efa\u8a2d\u300d\u570b\u969b\u7814\u8a0e\u6703\u4e26\u767c\u8868\u4e3b\u984c\u6f14\u8b1b"),
  "Chinese Academic page should preserve original conference report titles",
);
assert.ok(
  zhAcademicPage.includes("\u540d\u6821\u6cd5\u5b66\u6559\u80b2\u5bb6\u4e91\u96c6 \u6fb3\u79d1\u5927\u6cd5\u5b66\u9662\u6210\u529f\u4e3e\u529e\u7b2c\u4e94\u5c4a\u300c\u5185\u5730\u4e0e\u6e2f\u6fb3\u6cd5\u5b66\u6559\u80b2\u9662\u957f\u8bba\u575b\u300d\u66a8\u300a\u8de8\u57df\u6cd5\u5f8b\u8bc4\u8bba\u300b\u521b\u520a\u53f7\u53d1\u5e03\u4eea\u5f0f"),
  "Chinese Academic page should preserve the 2026 forum report title",
);
assert.ok(academicPage.includes("International Law on Campus"), "English Academic page should include the 2025 international law campus activity");
assert.ok(academicPage.includes("AI-Tutor Agent"), "English Academic page should include the WiseLaw AI teaching assistant launch");
assert.ok(academicPage.includes("HKU-ALSA Young Scholars Conference"), "English Academic page should include the HKU-ALSA conference");
assert.ok(academicPage.includes("The Judicial System of China"), "English Academic page should include the HKU book talk");
assert.ok(academicPage.includes("Fudan University Law School"), "English Academic page should include Fudan-linked activities");
assert.ok(academicPage.includes("Might vs. Right: Global Power Rivalry and the Future of International Law"), "English Academic page should include the CCCL / HKCML seminar");
assert.ok(academicPage.includes("Cybersecurity and Its Role in Law and Society"), "English Academic page should include the CCCL cybersecurity lecture");
assert.ok(academicPage.includes("Qualitative Research in the Sociology of Law"), "English Academic page should include the CCCL research-methods lecture");
assert.ok(academicPage.includes("2026 Enterprise Legal Affairs Core Capacity High-End Training"), "English Academic page should include the enterprise legal affairs training");
assert.ok(academicPage.includes("Rules Linkage and Regional Integration"), "English Academic page should include the GIG rules-linkage seminar");
assert.ok(academicPage.includes("China and International Rule-making"), "English Academic page should include the Silk Road Institute lecture");
assert.ok(academicPage.includes("First Guangdong-Hong Kong-Macao Greater Bay Area Rule of Law Forum"), "English Academic page should include the CASS GBA rule-of-law forum");
assert.ok(academicPage.includes("Workshop on Legal Frameworks for Sustainability Considerations in Antitrust"), "English Academic page should include the HKU sustainability-law workshop");
assert.ok(academicPage.includes("The Impact of Geopolitics on the International Economic Order"), "English Academic page should include the Tsinghua World Forum keynote");
assert.ok(academicPage.includes("Navigating Regulatory Plurality"), "English Academic page should include the UNCITRAL RCAP-UM digital-trade presentation");
assert.ok(academicPage.includes("Weaponizing Green"), "English Academic page should include the HKCML sustainability and IEL reform presentation");
assert.ok(academicPage.includes("HKILTTA dialogue"), "English Academic page should include the HKILTTA common-law dialogue");
assert.ok(academicPage.includes("In Search of Common Ground: China-EU Economic Relations"), "English Academic page should include the China-EU economic relations conference");
assert.ok(academicPage.includes("2026 CCCL Chinese and Comparative Law Junior Scholars Forum"), "English Academic page should include the CCCL junior scholars forum");
assert.ok(academicPage.includes("GBA cross-border legal rules linkage training"), "English Academic page should include the HKIPA cross-border legal training");
assert.ok(academicPage.includes("Hong Kong and Macau experience for Hainan Free Trade Port construction"), "English Academic page should include the Hainan Free Trade Port seminar");
assert.ok(academicPage.includes("Eurasia Economic Forum"), "English Academic page should include the 2025 Eurasia Economic Forum event");
assert.ok(academicPage.includes("Role:"), "English Academic page should visibly highlight Professor Wang's role");
assert.ok(academicPage.includes("Supporting files"), "English Academic page should label attached programme and invitation files");
assert.ok(academicPage.includes("2026-hkiltta-common-law-training-invitation.pdf"), "English Academic page should link the HKILTTA/SPC invitation PDF");
assert.ok(academicPage.includes("2026-hkiltta-common-law-training-programme.pdf"), "English Academic page should link the HKILTTA/SPC programme PDF");
assert.ok(academicPage.includes("2025-hkcml-sustainability-iel-reform-agenda.pdf"), "English Academic page should link the HKCML sustainability agenda PDF");
assert.ok(academicPage.includes("2025-uncitral-rcap-um-joint-conference-program.pdf"), "English Academic page should link the UNCITRAL RCAP-UM programme PDF");
assert.ok(academicPage.includes("2025-tsinghua-world-rule-of-law-forum-agenda.pdf"), "English Academic page should link the Tsinghua agenda PDF");
assert.ok(academicPage.includes("2025-hku-sustainability-workshop-programme.pdf"), "English Academic page should link the HKU workshop programme PDF");
assert.ok(academicPage.includes("2025-cass-gba-rule-of-law-forum-programme.pdf"), "English Academic page should link the CASS GBA forum programme PDF");
assert.ok(academicPage.includes("2025-fudan-international-economic-law-future-invitation.pdf"), "English Academic page should link the Fudan invitation PDF");
assert.ok(academicPage.includes("2025-world-international-law-congress-invitation.docx"), "English Academic page should link the World International Law Congress invitation Word file");
assert.ok(
  academicPage.includes("2025-eurasia-economic-forum-bri-commercial-legal-services-invitation.pdf"),
  "English Academic page should link the Eurasia Economic Forum invitation PDF",
);
assert.ok(academicPage.includes("2026-cccl-junior-scholars-forum-programme.pdf"), "English Academic page should link the CCCL forum programme PDF");
assert.ok(academicPage.includes("2026-xian-china-eu-conference-handbook.pdf"), "English Academic page should link the Xi'an conference handbook PDF");
assert.ok(academicPage.includes("2026-hkipa-gba-cross-border-legal-rules-training-invitation.pdf"), "English Academic page should link the HKIPA invitation PDF");
assert.ok(academicPage.includes("2026-hkmacao-institute-hainan-free-trade-port-invitation.pdf"), "English Academic page should link the Hong Kong-Macao Institute invitation PDF");
assert.ok(academicPage.includes("Programme or invitation materials on file"), "English Academic page should disclose on-file sources for non-public programmes");
assert.ok(zhAcademicPage.includes("\u570b\u969b\u6cd5\u9032\u6821\u5712"), "Chinese Academic page should include the International Law on Campus report");
assert.ok(zhAcademicPage.includes("\u738b\u6c5f\u96e8\u6559\u6388\u53d7\u9080\u53c3\u52a0\u7b2c\u516b\u5c46\u7d72\u535a\u6703\u671f\u9593\u4e3b\u8fa6\u7684\u570b\u969b\u5546\u4e8b\u6cd5\u5f8b\u670d\u52d9\u8207\u7d93\u8cbf\u5408\u4f5c\u5c0d\u63a5\u6703"), "Chinese Academic page should include the Silk Road Expo legal services report");
assert.ok(zhAcademicPage.includes("\u7b2c\u516b\u5c4a\u7ca4\u6e2f\u6fb3\u6cd5\u5b66\u7814\u8ba8\u4f1a"), "Chinese Academic page should include the Sun Yat-sen / GBA legal symposium");
assert.ok(zhAcademicPage.includes("\u7b2c\u4e09\u5c4a\u5168\u56fd\u4f18\u79c0\u9752\u5e74\u5b66\u8005\u8bba\u575b"), "Chinese Academic page should include the IPP young scholars forum");
assert.ok(zhAcademicPage.includes("\u5f37\u6b0a\u8207\u516c\u7406\uff1a\u5168\u7403\u6b0a\u529b\u7af6\u722d\u8207\u570b\u969b\u6cd5\u7684\u672a\u4f86"), "Chinese Academic page should include the CCCL / HKCML seminar");
assert.ok(zhAcademicPage.includes("\u7f51\u7edc\u5b89\u5168\u4e0e\u6cd5\u5f8b\u793e\u4f1a"), "Chinese Academic page should include the CCCL cybersecurity lecture");
assert.ok(zhAcademicPage.includes("谋篇布局，2026企业法务核心能力高端培训"), "Chinese Academic page should include the enterprise legal affairs training");
assert.ok(zhAcademicPage.includes("我院成功举办“规则衔接与区域融合：世界级湾区创新展望”学术研讨会"), "Chinese Academic page should include only the GIG recap activity");
assert.ok(zhAcademicPage.includes("陕西省贸促会举办“陕西贸促大讲堂”暨习近平法治思想专题辅导"), "Chinese Academic page should include the Shaanxi CCPIT lecture");
assert.ok(zhAcademicPage.includes("社科学术活动预告｜地缘政治对国际经济秩序的挑战"), "Chinese Academic page should include the Sun Yat-sen lecture");
assert.ok(zhAcademicPage.includes("会议回顾 | “《美国国家安全战略（2025）》与国际法律秩序——正在发生和可能（不）会发生”跨学科研讨会"), "Chinese Academic page should include the Fudan national-security seminar");
assert.ok(zhAcademicPage.includes("IIA培训｜第二期APEC大讲堂结业，提升干部服务保障APEC会议能力本领"), "Chinese Academic page should include the APEC training activity");
assert.ok(zhAcademicPage.includes("首届粤港澳大湾区法治论坛"), "Chinese Academic page should include the CASS GBA rule-of-law forum");
assert.ok(zhAcademicPage.includes("重新概念化可持续性"), "Chinese Academic page should include the HKCML sustainability and IEL reform programme");
assert.ok(zhAcademicPage.includes("寻找共同点：全球失序时代的中欧经济关系"), "Chinese Academic page should include the China-EU economic relations conference");
assert.ok(zhAcademicPage.includes("2026 CCCL中国法与比较法青年学者论坛"), "Chinese Academic page should include the CCCL junior scholars forum");
assert.ok(zhAcademicPage.includes("粤港澳大湾区跨境法律规则衔接机制对接专题培训班"), "Chinese Academic page should include the HKIPA cross-border legal training");
assert.ok(zhAcademicPage.includes("香港、澳门经验对海南自由贸易港建设的借鉴与启示"), "Chinese Academic page should include the Hainan Free Trade Port seminar");
assert.ok(zhAcademicPage.includes("2025欧亚经济论坛"), "Chinese Academic page should include the Eurasia Economic Forum event");
assert.ok(zhAcademicPage.includes("身份："), "Chinese Academic page should visibly highlight Professor Wang's role");
assert.ok(zhAcademicPage.includes("附件"), "Chinese Academic page should label attached programme and invitation files");
assert.ok(zhAcademicPage.includes("../assets/academic/2025-eurasia-economic-forum-bri-commercial-legal-services-invitation.pdf"), "Chinese Academic page should link the Eurasia Economic Forum invitation PDF");
assert.ok(zhAcademicPage.includes("会议或邀请材料存档"), "Chinese Academic page should disclose on-file sources for non-public programmes");
assert.ok(cvPage.includes("C.V."), "English CV page should use the C.V. heading");
for (const expected of [
  "Education",
  "Work Experience",
  "Editorial Membership",
  "Bar Qualifications",
  "Honours and Awards",
  "Academic Appointments",
  "Professional Appointments",
  "Teaching",
  "Research Administration and Related Services",
  "University of Pennsylvania Law School",
  "State Bar of New York",
  "Young Researcher Award 2007-08",
  "New Century Excellent Talents Award",
  "Best Paper for Comparative Law in 2020",
  "Asia Pacific Law Review",
  "Subject Editor, Asian Journal of Comparative Law",
  "Guest Professor, National Institute for South China Sea Studies",
  "Member of UNESCAP\u2019s Expert Group Meeting, 2025",
  "Hong Kong Company Law",
  "External reviewer, Oxford University Press",
  "Faculty Curriculum Committee",
  "Appointed by the Academic Degree Centre of the PRC Ministry of Education",
]) {
  assert.ok(cvPage.includes(expected), `English CV page missing expected content: ${expected}`);
}
for (const expected of [
  "\u7b80\u5386",
  "\u6559\u80b2\u80cc\u666f",
  "\u5de5\u4f5c\u7ecf\u5386",
  "\u7f16\u8f91\u804c\u52a1",
  "\u5f8b\u5e08\u8d44\u683c",
  "\u8363\u8a89\u4e0e\u5956\u9879",
  "\u6559\u5b66",
  "\u7814\u7a76\u884c\u653f\u4e0e\u76f8\u5173\u670d\u52a1",
  "\u5bbe\u5915\u6cd5\u5c3c\u4e9a\u5927\u5b66\u6cd5\u5b66\u9662",
  "\u4e2d\u56fd\u56fd\u9645\u8d38\u6613\u4fc3\u8fdb\u59d4\u5458\u4f1a\u9655\u897f\u7701\u5206\u4f1a\u5546\u4e8b\u6cd5\u5f8b\u4e13\u5bb6\u54a8\u8be2\u59d4\u5458\u4f1a\u59d4\u5458",
  "\u5357\u4eac\u56fd\u9645\u5546\u4e8b\u6cd5\u5ead\u4e13\u5bb6\u987e\u95ee",
  "\u6df1\u5733\u56fd\u9645\u4ef2\u88c1\u9662\u4ef2\u88c1\u5458",
  "\u9999\u6e2f\u516c\u53f8\u6cd5",
  "\u6cd5\u5b66\u9662\u6559\u804c\u5458\u59d4\u5458\u4f1a\u6210\u5458",
]) {
  assert.ok(zhCvPage.includes(expected), `Chinese CV page missing expected content: ${expected}`);
}

const siteJs = fs.readFileSync(path.join(root, "assets/site.js"), "utf8");
assert.ok(siteJs.includes("activeFilters"), "Filter script should combine active filters");

const siteCss = fs.readFileSync(path.join(root, "assets/site.css"), "utf8");
assert.ok(siteCss.includes("overflow-x: auto"), "Mobile filter rows should remain compact with horizontal scrolling");
for (const expectedDesignToken of [
  "--accent",
  "--surface-raised",
  "--shadow-soft",
  "--radius-sm",
]) {
  assert.ok(siteCss.includes(expectedDesignToken), `Site stylesheet should include the modern design token ${expectedDesignToken}`);
}
for (const expectedSelector of [
  ".hero-shell",
  ".page-hero-inner",
  ".record-card::before",
  ".filter-panel",
]) {
  assert.ok(siteCss.includes(expectedSelector), `Site stylesheet should include redesigned selector ${expectedSelector}`);
}
assert.ok(index.includes("hero-shell"), "Homepage should use the redesigned hero shell");
assert.ok(academicPage.includes("page-hero-inner"), "Interior pages should use the redesigned page hero wrapper");

console.log("Website validation passed");
