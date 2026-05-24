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
  "zh/index.html",
  "zh/publications.html",
  "zh/commentaries.html",
  "zh/media.html",
  "zh/academic.html",
  "assets/site.css",
  "assets/site.js",
  "src/data/site-data.mjs",
];

for (const rel of requiredFiles) {
  assert.ok(fs.existsSync(path.join(root, rel)), `Missing required file: ${rel}`);
}

const data = await import(pathToFileURL(path.join(root, "src/data/site-data.mjs")).href);

assert.equal(data.researchTopics.length, 7, "Expected exactly seven research topics");
assert.ok(data.researchTopics.every((topic) => topic.title?.en && topic.title?.zh), "Research topics must be bilingual");
assert.ok(data.researchTopics.every((topic) => topic.href?.startsWith("https://")), "Research topic URLs must be HTTPS");
assert.ok(
  data.researchTopics.some((topic) => topic.id === "gba" && topic.status === "verify"),
  "GBA topic must be flagged for final verification",
);

const profileNames = data.profileLinks.map((link) => link.label.en);
assert.deepEqual(profileNames, ["CityUHK Profile", "CityUHK Scholar", "Google Scholar", "SSRN"], "Only verified profile links should be included");
assert.ok(data.profileMetrics.length >= 4, "Homepage should include profile metrics");
assert.ok(data.expertiseAreas.length >= 7, "Homepage should include expertise areas");
assert.ok(data.academicHighlights.length >= 6, "Homepage should include academic and professional highlights");

assert.ok(Array.isArray(data.academicActivities), "Academic activities data must be exported");
assert.ok(data.academicActivities.length >= 29, "Academic page should include an expanded activity set");
assert.ok(
  data.academicActivities.every((item) => item.id && item.date && item.title?.en && item.title?.zh && item.summary?.en && item.summary?.zh && item.url),
  "Academic activity records must be bilingual and source-linked",
);
const recentAcademicActivities = data.academicActivities.filter((item) => item.date >= "2024-05-24");
assert.ok(recentAcademicActivities.length >= 19, "Academic page should prioritize a substantial past-two-years activity set");
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
]) {
  assert.ok(data.academicActivities.some((item) => item.id === id), `Missing prioritized academic activity: ${id}`);
}

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
assert.ok(index.includes('href="media.html"') && index.includes(">Media<"), "English navigation should label Media as Media");
assert.ok(!index.includes(">Media Commentaries<"), "English navigation should not use Media Commentaries");
assert.ok(zhIndex.includes("学术与专业职务"), "Chinese homepage should include leadership detail");
assert.ok(publicationsPage.includes('data-filter-criterion="topic"'), "Publications page should filter by topic");
assert.ok(publicationsPage.includes('data-filter-criterion="language"'), "Publications page should filter by language");
assert.ok(zhIndex.includes('href="commentaries.html"') && zhIndex.includes("\u65f6\u653f\u8bc4\u8bba"), "Chinese navigation should include Commentaries");
assert.ok(zhIndex.includes('href="academic.html"') && zhIndex.includes("\u5b66\u672f\u6d3b\u52a8"), "Chinese navigation should include Academic activities");
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
assert.ok(zhAcademicPage.includes("\u570b\u969b\u6cd5\u9032\u6821\u5712"), "Chinese Academic page should include the International Law on Campus report");
assert.ok(zhAcademicPage.includes("\u738b\u6c5f\u96e8\u6559\u6388\u53d7\u9080\u53c3\u52a0\u7b2c\u516b\u5c46\u7d72\u535a\u6703\u671f\u9593\u4e3b\u8fa6\u7684\u570b\u969b\u5546\u4e8b\u6cd5\u5f8b\u670d\u52d9\u8207\u7d93\u8cbf\u5408\u4f5c\u5c0d\u63a5\u6703"), "Chinese Academic page should include the Silk Road Expo legal services report");
assert.ok(zhAcademicPage.includes("\u7b2c\u516b\u5c4a\u7ca4\u6e2f\u6fb3\u6cd5\u5b66\u7814\u8ba8\u4f1a"), "Chinese Academic page should include the Sun Yat-sen / GBA legal symposium");
assert.ok(zhAcademicPage.includes("\u7b2c\u4e09\u5c4a\u5168\u56fd\u4f18\u79c0\u9752\u5e74\u5b66\u8005\u8bba\u575b"), "Chinese Academic page should include the IPP young scholars forum");

const siteJs = fs.readFileSync(path.join(root, "assets/site.js"), "utf8");
assert.ok(siteJs.includes("activeFilters"), "Filter script should combine active filters");

const siteCss = fs.readFileSync(path.join(root, "assets/site.css"), "utf8");
assert.ok(siteCss.includes("overflow-x: auto"), "Mobile filter rows should remain compact with horizontal scrolling");

console.log("Website validation passed");
