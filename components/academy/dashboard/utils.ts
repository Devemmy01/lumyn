import type { DashboardCertificate } from "@/components/academy/dashboard/types";

export type CertificateRecord = {
  courseTitle?: string;
  certificate?: DashboardCertificate;
};

export function lastSevenDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return { key: date.toISOString().slice(0, 10), label: date.toLocaleDateString(undefined, { weekday: "narrow" }) };
  });
}

export function learningStreak(activityDates: string[], now = new Date()) {
  const activeDays = new Set(activityDates.map((date) => date.slice(0, 10)));
  const cursor = new Date(now);
  cursor.setHours(12, 0, 0, 0);

  const todayKey = cursor.toISOString().slice(0, 10);
  if (!activeDays.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (activeDays.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function hasLearningActivityToday(activityDates: string[], now = new Date()) {
  return activityDates.some((date) => date.slice(0, 10) === now.toISOString().slice(0, 10));
}

export function buildYouTubeLearningUrl(...topics: Array<string | undefined>) {
  const query = [
    ...topics.filter((topic): topic is string => Boolean(topic?.trim())),
    "visual explanation tutorial",
    "freeCodeCamp IBM Technology Simplilearn NetworkChuck CrashCourse",
  ].join(" ");

  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export async function openCertificate(studentName: string, record: CertificateRecord) {
  if (!record.certificate) return;

  const escape = (value: string) =>
    value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;" }[character] ?? character));

  const certificateWindow = window.open("", "_blank", "width=1200,height=850");
  if (!certificateWindow) return;

  const origin = window.location.origin;
  const certificateName = record.certificate.certificateName?.trim() || studentName.trim() || "Lumyn Academy Student";
  const issuedAt = new Date(record.certificate.issuedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  const astraSignature = `<img class="signatureImg astraSignature" src="${escape(`${origin}/lumyn-signature-emmanuel.png`)}" alt="Astra signature" />`;
  const emmanuelSignature = `<img class="signatureImg emmanuelSignature" src="${escape(`${origin}/lumyn-signature-astra.png`)}" alt="Emmanuel Balogun signature" />`;

  certificateWindow.document.write(`<!doctype html><html><head><title>${escape(record.certificate.certificateId)}</title><style>
    *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    html{background:#0a0712}
    body{margin:0;background:#0a0712;font-family:"Trebuchet MS",Verdana,sans-serif;color:#f7f4ff;padding:18px}
    .toolbar{display:flex;justify-content:center;margin-bottom:14px}
    .toolbar button{border:1px solid rgba(255,255,255,.14);border-radius:999px;background:#7c6cf6;color:white;padding:12px 22px;font-weight:800;box-shadow:0 16px 40px rgba(124,108,246,.28);cursor:pointer}
    .certificate{position:relative;width:min(1120px,calc(100vw - 36px));aspect-ratio:1120/680;margin:auto;overflow:hidden;background:#08070d;box-shadow:0 30px 100px rgba(0,0,0,.5)}
    .certificate:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 17% 13%,rgba(124,108,246,.22),transparent 28%),radial-gradient(circle at 82% 18%,rgba(31,184,255,.12),transparent 24%),linear-gradient(135deg,#090712 0%,#121329 47%,#062237 100%)}
    .certificate:after{content:"";position:absolute;inset:18px;border:1px solid rgba(255,255,255,.2);clip-path:polygon(0 0,92% 0,100% 12%,100% 100%,8% 100%,0 88%)}
    .corner{position:absolute;z-index:2;background:#7c4dff}
    .corner.tl{left:0;top:0;width:190px;height:78px;clip-path:polygon(0 0,100% 0,70% 100%,0 100%)}
    .corner.br{right:0;bottom:0;width:250px;height:88px;clip-path:polygon(30% 0,100% 0,100% 100%,0 100%);background:linear-gradient(90deg,#5f7cff,#7c6cf6)}
    .content{position:relative;z-index:3;display:grid;height:100%;grid-template-columns:minmax(0,1fr) 210px;gap:42px;padding:56px 66px 46px}
    .logoRow{display:flex;align-items:center;gap:14px}
    .wordmark{height:auto;width:168px;display:block}
    .brandCopy{display:flex;flex-direction:column;justify-content:center}
    .brandSub{margin-top:4px;color:#b9b1ff;font-size:10px;font-weight:900;letter-spacing:.3em;text-transform:uppercase}
    .title{max-width:700px;margin:22px 0 0;font-size:44px;line-height:1.02;font-weight:900;letter-spacing:-.025em;white-space:nowrap}
    .presented{margin-top:28px;color:#c8c2df;font-size:14px;letter-spacing:.06em}
    .name{display:inline-block;max-width:100%;margin-top:10px;padding:0 12px 10px 0;border-bottom:2px solid #16d7a8;color:#18d7a4;font-size:42px;line-height:1.05;font-weight:900;letter-spacing:-.04em;text-shadow:none}
    .copy{margin-top:24px;max-width:720px;color:#d8d2eb;font-size:14px;line-height:1.65}
    .course{margin-top:8px;color:#b9b1ff;font-size:22px;font-weight:900;line-height:1.2}
    .metaGrid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:34px;max-width:610px}
    .meta{padding-top:0}
    .signatureWrap{display:flex;align-items:flex-end;min-height:58px;border-bottom:1px solid rgba(255,255,255,.26);padding:0 0 7px}
    .signatureImg{display:block;width:174px;max-height:48px;object-fit:contain;object-position:left bottom;filter:invert(1) brightness(2.25) contrast(1.05);opacity:.96}
    .astraSignature{width:182px}
    .emmanuelSignature{width:168px}
    .role{margin-top:6px;color:#ede9ff;font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}
    .role span{display:block;margin-top:4px;color:#9d96b5;font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:none}
    .side{position:relative;padding-left:28px}
    .chevrons{position:absolute;inset:38px -90px auto auto;width:270px;height:270px;opacity:.75}
    .chevrons:before,.chevrons:after{content:"";position:absolute;inset:0;border:13px solid #5f7cff;border-left:0;border-bottom:0;transform:rotate(45deg)}
    .chevrons:after{inset:46px;border-color:#7c6cf6;opacity:.75}
    .date{position:absolute;right:66px;bottom:44px;padding:11px 13px;border:1px solid rgba(255,255,255,.16);border-radius:12px;background:rgba(8,10,19,.46);backdrop-filter:blur(6px);text-align:right;color:#f7f4ff;font-size:13px;font-weight:900}
    .date span{display:block;margin-top:5px;color:#b9b1ff;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
    .gridFloor{position:absolute;left:80px;right:410px;bottom:46px;height:95px;opacity:.16;background:linear-gradient(rgba(255,255,255,.28) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.28) 1px,transparent 1px);background-size:42px 22px;transform:perspective(320px) rotateX(58deg);transform-origin:bottom}
    @page{size:A4 landscape;margin:0}
    @media print{
      html,body{padding:0;background:#0a0712}
      .toolbar{display:none}
      .certificate{width:297mm;height:210mm;max-width:none;min-height:0;box-shadow:none}
      .content{min-height:210mm;padding:16mm 18mm;grid-template-columns:minmax(0,1fr) 60mm;gap:10mm}
      .title{font-size:15mm}
      .name{font-size:12mm}
      .date{right:18mm;bottom:14mm}
      .gridFloor{left:20mm;right:105mm;bottom:14mm}
    }
  </style></head><body><div class="toolbar"><button onclick="window.print()">Print or save as PDF</button></div><main class="certificate"><div class="corner tl"></div><div class="corner br"></div><div class="gridFloor"></div><div class="content"><section><div class="logoRow"><div class="brandCopy"><img class="wordmark" src="${escape(`${origin}/logomain.png`)}" alt="Lumyn wordmark"/><div class="brandSub">Academy Credential</div></div></div><h1 class="title">Certificate of Completion</h1><p class="presented">Proudly presented to</p><div class="name">${escape(certificateName)}</div><p class="copy">for completing Lumyn Academy's required lessons, quizzes, practical assignments, and final project for</p><div class="course">${escape(record.courseTitle ?? "a Lumyn Academy course")}</div><div class="metaGrid"><div class="meta"><div class="signatureWrap">${astraSignature}</div><div class="role">Astra<span>AI Learning Guide</span></div></div><div class="meta"><div class="signatureWrap">${emmanuelSignature}</div><div class="role">Emmanuel Balogun<span>Founder, Lumyn</span></div></div></div></section><aside class="side"><div class="chevrons"></div></aside><div class="date">${escape(issuedAt)}<span>Date issued</span></div></div></main></body></html>`);
  certificateWindow.document.close();
}
