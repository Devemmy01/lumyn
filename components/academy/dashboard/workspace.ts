import type {
  GeneratedCourse,
  GeneratedLesson,
  GeneratedModule,
} from "@/lib/academy";

export type PracticeCodeFileSnapshot = {
  name: string;
  language: string;
  value: string;
};

export function detectWorkspaceLanguage(text: string) {
  const normalized = text.toLowerCase();
  if (normalized.trim() === "tsx" || normalized.trim() === "jsx") return "tsx";
  if (normalized.trim() === "ts") return "typescript";
  if (normalized.trim() === "js") return "html";
  if (normalized.trim() === "py") return "python";
  if (/\btsx\b|\.tsx\b|\bjsx\b|\.jsx\b|\breact\b|\bcomponent\b/.test(normalized)) {
    return "tsx";
  }
  if (
    /\btypescript\b|\.ts\b|\btype alias\b|\binterfaces?\b|\bgenerics?\b|\bunion types?\b|\bintersection types?\b|\bmapped types?\b|\bconditional types?\b|\butility types?\b|\bindexed access\b/.test(
      normalized,
    )
  ) {
    return "typescript";
  }
  if (/\bpython\b|\.py\b|django|flask|pandas|numpy/.test(normalized)) return "python";
  if (/\bsql\b|database|query|table|schema|postgres|mysql|sqlite/.test(normalized)) return "sql";
  if (/\bjavascript\b|\bjs\b|dom|browser|interactive|frontend|front-end/.test(normalized)) return "html";
  if (/\bjava\b|\.java\b/.test(normalized) && !normalized.includes("javascript")) return "java";
  if (/\bc\+\+\b|cpp|\.cpp\b/.test(normalized)) return "cpp";
  if (/\bc#\b|csharp|\.cs\b/.test(normalized)) return "csharp";
  if (/\bgolang\b|\bgo\b|\.go\b/.test(normalized)) return "go";
  if (/\brust\b|\.rs\b/.test(normalized)) return "rust";
  if (/\bphp\b|\.php\b/.test(normalized)) return "php";
  if (/\bruby\b|\.rb\b/.test(normalized)) return "ruby";
  if (/\bswift\b|\.swift\b/.test(normalized)) return "swift";
  if (/\bkotlin\b|\.kt\b/.test(normalized)) return "kotlin";
  if (/\bmarkdown\b|readme|documentation/.test(normalized)) return "markdown";
  return "html";
}

function workspaceFileName(language: string) {
  const names: Record<string, string> = {
    csharp: "Program.cs",
    cpp: "main.cpp",
    go: "main.go",
    java: "Main.java",
    kotlin: "Main.kt",
    markdown: "README.md",
    php: "index.php",
    python: "main.py",
    ruby: "main.rb",
    rust: "main.rs",
    sql: "query.sql",
    swift: "main.swift",
    tsx: "App.tsx",
    typescript: "main.ts",
  };
  return names[language] ?? "main.txt";
}

function workspaceStarterCode(language: string, title: string, brief: string) {
  const cleanTitle = title.replace(/[<>]/g, "");
  const cleanBrief = brief.replace(/--/g, "-");
  const starters: Record<string, string> = {
    csharp: `using System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine("${cleanTitle}");\n  }\n}`,
    cpp: `#include <iostream>\n\nint main() {\n  std::cout << "${cleanTitle}" << std::endl;\n  return 0;\n}`,
    go: `package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("${cleanTitle}")\n}`,
    java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("${cleanTitle}");\n  }\n}`,
    kotlin: `fun main() {\n  println("${cleanTitle}")\n}`,
    markdown: `# ${cleanTitle}\n\n${cleanBrief}\n`,
    php: `<?php\necho "${cleanTitle}";\n`,
    python: `"""${cleanBrief}"""\n\nprint("${cleanTitle}")\n`,
    ruby: `# ${cleanBrief}\n\nputs "${cleanTitle}"\n`,
    rust: `fn main() {\n    println!("${cleanTitle}");\n}`,
    sql: `-- ${cleanBrief}\n\nSELECT '${cleanTitle}' AS project_title;`,
    swift: `print("${cleanTitle}")`,
    tsx: `type ${cleanTitle.replace(/[^A-Za-z0-9_]/g, "") || "Learning"}Props = {\n  title: string;\n};\n\nexport function App({ title }: ${cleanTitle.replace(/[^A-Za-z0-9_]/g, "") || "Learning"}Props) {\n  return <main>{title}</main>;\n}\n\nconsole.log("${cleanTitle}");`,
    typescript: `type Nullable<T> = {\n  [K in keyof T]: T[K] | null;\n};\n\ntype Project = {\n  title: string;\n  complete: boolean;\n};\n\nconst project: Nullable<Project> = {\n  title: "${cleanTitle}",\n  complete: null,\n};\n\nconsole.log(project);`,
  };
  return starters[language] ?? `# ${cleanTitle}\n\n${cleanBrief}\n`;
}

function nonBrowserWorkspaceFiles(
  language: string,
  title: string,
  brief: string,
  readmeTitle = title,
): PracticeCodeFileSnapshot[] {
  return [
    {
      name: workspaceFileName(language),
      language,
      value: workspaceStarterCode(language, title, brief),
    },
    {
      name: "README.md",
      language: "markdown",
      value: `# ${readmeTitle}\n\n${brief}\n\n## How to run or test\n\nExplain the command, inputs, expected output, and evidence for your submission.`,
    },
  ];
}

export function buildLessonWorkspaceFiles(
  lesson: GeneratedLesson,
  moduleTitle: string,
  courseTitle: string,
): PracticeCodeFileSnapshot[] | undefined {
  const lessonCodeLanguage = lesson.codeExample?.language;
  const detectedLanguage = detectWorkspaceLanguage(
    [
      courseTitle,
      moduleTitle,
      lesson.title,
      lesson.goal,
      lesson.videoLearningGoal,
      lesson.notes,
      lesson.conceptExplanation,
      lesson.practicalTask,
      lesson.challenge,
      lesson.starterCode,
      lesson.codeExample?.language,
      lesson.codeExample?.code,
      lesson.deliverables?.join(" "),
      lesson.assessmentCriteria?.join(" "),
    ]
      .filter(Boolean)
      .join(" "),
  );
  const language = lessonCodeLanguage
    ? detectWorkspaceLanguage(lessonCodeLanguage)
    : detectedLanguage;

  if (language === "html") return undefined;

  const title = lesson.title.replace(/[<>]/g, "");
  const brief = `Practice: ${lesson.practicalTask}${
    lesson.challenge ? `\nChallenge: ${lesson.challenge}` : ""
  }`;
  const starter = lesson.starterCode || lesson.codeExample?.code;

  return [
    {
      name: workspaceFileName(language),
      language,
      value: starter?.trim() || workspaceStarterCode(language, title, brief),
    },
  ];
}

export function buildAssignmentWorkspaceFiles(
  module: GeneratedModule,
): PracticeCodeFileSnapshot[] {
  const title = module.title.replace(/[<>]/g, "");
  const brief = `Assignment: ${module.assignment}\nMini project: ${module.miniProject}`;
  const language = detectWorkspaceLanguage(
    `${module.title} ${module.description} ${module.assignment} ${module.miniProject} ${module.labEnvironment ?? ""}`,
  );
  if (language !== "html") {
    return nonBrowserWorkspaceFiles(language, title, brief);
  }

  return [
    {
      name: "index.html",
      language: "html",
      value: `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} Project</title>
  <link rel="stylesheet" href="style.css">
  <script src="script.js" defer></script>
</head>
<body>
  <!-- Assignment: ${module.assignment} -->
  <!-- Mini project: ${module.miniProject} -->

  <main>
    <h1>${title} Project</h1>
    <p>Replace this text with your completed assignment and mini project.</p>
  </main>
</body>
</html>`,
    },
    {
      name: "style.css",
      language: "css",
      value: "body { margin: 0; font-family: system-ui, sans-serif; padding: 2rem; }",
    },
    {
      name: "script.js",
      language: "javascript",
      value: "// Add interactions here.",
    },
  ];
}

function capstoneNeedsMultiPageStarter(course: GeneratedCourse) {
  const text = [
    course.finalProject,
    course.finalProjectPlan?.overview,
    course.finalProjectPlan?.deliverables.join(" "),
    course.finalProjectPlan?.phases
      .map((phase) => `${phase.title} ${phase.instructions}`)
      .join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return (
    text.includes("multi-page") ||
    text.includes("multiple pages") ||
    (text.includes("home") && text.includes("about") && text.includes("projects"))
  );
}

export function buildFinalProjectWorkspaceFiles(
  course: GeneratedCourse,
): PracticeCodeFileSnapshot[] {
  const title = course.courseTitle.replace(/[<>]/g, "");
  const phases =
    course.finalProjectPlan?.phases
      .map(
        (phase, index) =>
          `  <!-- ${index + 1}. ${phase.title}: ${phase.instructions} -->`,
      )
      .join("\n") ?? "";
  const projectBrief = course.finalProject.replace(/--/g, "-");

  if (capstoneNeedsMultiPageStarter(course)) {
    const navigation = `<header class="site-header">
  <a class="brand" href="index.html">${title}</a>
  <nav aria-label="Primary navigation">
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="projects.html">Projects</a>
  </nav>
</header>`;
    return [
      {
        name: "index.html",
        language: "html",
        value: `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Home | ${title}</title>
  <link rel="stylesheet" href="style.css">
  <script src="script.js" defer></script>
</head>
<body>
  <!-- Final project: ${projectBrief} -->
${phases}
  ${navigation}

  <main>
    <section class="hero" aria-labelledby="home-title">
      <p class="eyebrow">Portfolio home</p>
      <h1 id="home-title">Hi, I am building with HTML, CSS, and JavaScript.</h1>
      <p>Replace this intro with your own positioning, skills, and the kind of work you want to do.</p>
      <a class="button" href="projects.html">View projects</a>
    </section>

    <section aria-labelledby="skills-title">
      <h2 id="skills-title">Skills snapshot</h2>
      <ul class="skill-list">
        <li>Semantic HTML structure</li>
        <li>Responsive CSS layouts</li>
        <li>JavaScript interactions</li>
      </ul>
    </section>
  </main>
</body>
</html>`,
      },
      {
        name: "about.html",
        language: "html",
        value: `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About | ${title}</title>
  <link rel="stylesheet" href="style.css">
  <script src="script.js" defer></script>
</head>
<body>
  ${navigation}

  <main>
    <article class="page-card" aria-labelledby="about-title">
      <p class="eyebrow">About</p>
      <h1 id="about-title">About me</h1>
      <p>Write a short story about your learning journey, strengths, and the problems you enjoy solving.</p>
    </article>

    <section aria-labelledby="experience-title">
      <h2 id="experience-title">Learning highlights</h2>
      <ul>
        <li>Built responsive pages using semantic sections.</li>
        <li>Practiced styling with reusable CSS classes.</li>
        <li>Added simple JavaScript behavior for interactivity.</li>
      </ul>
    </section>
  </main>
</body>
</html>`,
      },
      {
        name: "projects.html",
        language: "html",
        value: `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Projects | ${title}</title>
  <link rel="stylesheet" href="style.css">
  <script src="script.js" defer></script>
</head>
<body>
  ${navigation}

  <main>
    <section aria-labelledby="projects-title">
      <p class="eyebrow">Projects</p>
      <h1 id="projects-title">Featured projects</h1>
      <div class="project-grid">
        <article>
          <h2>Responsive landing page</h2>
          <p>Describe what you built, the tools used, and what you learned.</p>
        </article>
        <article>
          <h2>Interactive widget</h2>
          <p>Explain the JavaScript behavior and how users interact with it.</p>
        </article>
        <article>
          <h2>Portfolio improvement</h2>
          <p>Share a before/after or one decision that made the design stronger.</p>
        </article>
      </div>
    </section>
  </main>
</body>
</html>`,
      },
      {
        name: "style.css",
        language: "css",
        value: `:root {
  color-scheme: light;
  --bg: #f8fafc;
  --panel: #ffffff;
  --text: #111827;
  --muted: #64748b;
  --accent: #7c6cf6;
  --border: #e5e7eb;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.6;
}

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem clamp(1rem, 4vw, 3rem);
  border-bottom: 1px solid var(--border);
  background: var(--panel);
}

.brand,
nav a,
.button {
  color: var(--text);
  font-weight: 800;
  text-decoration: none;
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

nav a:hover {
  color: var(--accent);
}

main {
  width: min(980px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 3rem 0;
}

.hero,
.page-card,
section {
  margin-bottom: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 1rem;
  background: var(--panel);
  padding: clamp(1rem, 4vw, 2rem);
}

.hero h1,
.page-card h1 {
  max-width: 720px;
  margin: 0;
  font-size: clamp(2rem, 7vw, 4rem);
  line-height: 1;
}

.eyebrow {
  margin: 0 0 0.75rem;
  color: var(--accent);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.button {
  display: inline-flex;
  margin-top: 1rem;
  border-radius: 999px;
  background: var(--accent);
  color: white;
  padding: 0.75rem 1rem;
}

.skill-list,
.project-grid {
  display: grid;
  gap: 1rem;
}

.project-grid {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.project-grid article,
.skill-list li {
  border: 1px solid var(--border);
  border-radius: 0.85rem;
  background: #f8fafc;
  padding: 1rem;
}

@media (max-width: 640px) {
  .site-header {
    align-items: flex-start;
    flex-direction: column;
  }
}`,
      },
      {
        name: "script.js",
        language: "javascript",
        value: `const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll("nav a").forEach((link) => {
  const target = link.getAttribute("href");
  if (target === currentPage) {
    link.setAttribute("aria-current", "page");
  }
});`,
      },
    ];
  }

  const language = detectWorkspaceLanguage(
    [
      course.courseTitle,
      course.finalProject,
      course.finalProjectPlan?.overview,
      course.finalProjectPlan?.labEnvironment,
      course.finalProjectPlan?.deliverables.join(" "),
      course.finalProjectPlan?.phases
        .map((phase) => `${phase.title} ${phase.instructions}`)
        .join(" "),
    ]
      .filter(Boolean)
      .join(" "),
  );
  if (language !== "html") {
    return nonBrowserWorkspaceFiles(language, title, projectBrief, `${title} Capstone`);
  }

  return [
    {
      name: "index.html",
      language: "html",
      value: `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} Capstone</title>
  <link rel="stylesheet" href="style.css">
  <script src="script.js" defer></script>
</head>
<body>
  <!-- Final project: ${projectBrief} -->
${phases}

  <main>
    <h1>${title} Capstone</h1>
    <p>Build your final project inside this workspace.</p>
  </main>
</body>
</html>`,
    },
    {
      name: "style.css",
      language: "css",
      value: "body { margin: 0; font-family: system-ui, sans-serif; padding: 2rem; }",
    },
    {
      name: "script.js",
      language: "javascript",
      value: "// Add small interactions here.",
    },
  ];
}

export function formatWorkspaceFilesForSubmission(
  files: PracticeCodeFileSnapshot[],
) {
  const nonEmptyFiles = files.filter((file) => file.value.trim());
  if (!nonEmptyFiles.length) return "";

  return nonEmptyFiles
    .map((file) => {
      const language =
        file.language === "javascript" ? "js" : file.language || "text";
      return `File: ${file.name}\n\`\`\`${language}\n${file.value.trim()}\n\`\`\``;
    })
    .join("\n\n");
}
