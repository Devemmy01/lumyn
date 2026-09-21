import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module1: GeneratedModule = {
  title: "Why TypeScript? Setup & Your First Typed Script",
  description:
    "Understand what TypeScript adds on top of JavaScript, run your first .ts file in the Academy workspace, and write your first explicit type annotations.",
  completionStatus: "locked",
  lessons: [
    {
      title: "What TypeScript Is and What It Adds to JavaScript",
      goal: "Understand what TypeScript is, how it relates to JavaScript, and what type checking actually catches.",
      videoTitle: "TypeScript for Beginners: What is TypeScript and Why Use It",
      videoSearchQuery: "what is typescript for beginners why use typescript explained",
      videoLearningGoal: "See a plain-language comparison between plain JavaScript and TypeScript, and what a type error looks like before code even runs.",
      recommendedChannels: ["Total TypeScript", "freeCodeCamp.org"],
      keyTakeaways: [
        "TypeScript is a superset of JavaScript: every valid JavaScript file is already valid TypeScript, plus it adds an optional type system on top.",
        "TypeScript code is checked for type errors before it runs, catching a whole class of bugs at write time instead of at runtime.",
        "TypeScript never runs directly in a browser or Node.js; it is compiled (or transpiled) down to plain JavaScript first.",
      ],
      notes:
        "TypeScript adds a type-checking layer over the JavaScript you already know. You still write functions, variables, arrays, and objects the same way; TypeScript just lets you describe what kind of values they should hold, and then checks your whole file against those descriptions before anything runs.",
      conceptExplanation:
        "Without types, a mistake like calling .toUpperCase() on a number only shows up when that exact line actually runs, maybe deep inside a real program. With TypeScript, the compiler reads your entire file ahead of time and flags that mistake immediately, underlining it as an error before you ever click run. This is the core value proposition: moving bug discovery from 'while the program is running' to 'while you are typing'.",
      whyItMatters:
        "Catching bugs while writing code, instead of after shipping it, is the single biggest reason TypeScript is used across most professional JavaScript codebases today. It also powers much better autocomplete, since your editor knows exactly what properties and methods a value actually has.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Declare a variable holding your name as text and one holding your age as a number, then log a sentence combining them with console.log(). Then, as an experiment, try reassigning the age variable to a text value like 'twenty' and observe the error the workspace shows, before removing that broken line so the file runs cleanly again.",
      challenge: "Add a third variable for a boolean fact about yourself and include it in the console.log() sentence.",
      expectedResult:
        "main.ts runs and logs one combined sentence using all your variables; the deliberate type mismatch you tried was caught before you removed it.",
      tests: [
        "main.ts runs without a type error",
        "console.log() output combines the name, age, and boolean variables into one readable sentence",
      ],
      hint: "Typing an age variable as a number, then trying to assign it a text value, is what triggers the error you are looking for.",
      lessonAssessment: [
        {
          question: "What is TypeScript, in relation to JavaScript?",
          options: [
            "A completely different language that cannot use JavaScript code",
            "A superset of JavaScript that adds an optional type system",
            "A replacement for JavaScript that runs directly in the browser",
            "A CSS framework for styling web pages",
          ],
          correctAnswerIndex: 1,
          explanation: "TypeScript builds on JavaScript rather than replacing it: valid JavaScript is already valid TypeScript, with an optional type system layered on top.",
        },
        {
          question: "Does TypeScript code run directly in a browser or Node.js?",
          options: [
            "Yes, natively, with no extra step",
            "No, it must be compiled to JavaScript first",
            "Only if the file ends in .js",
            "Only inside a terminal, never in a browser",
          ],
          correctAnswerIndex: 1,
          explanation: "TypeScript is compiled (transpiled) down to plain JavaScript before it actually executes anywhere.",
        },
      ],
      commonMistakes: [
        "Assuming TypeScript is a completely separate language from JavaScript instead of a typed layer on top of it.",
        "Expecting a .ts file to run directly with no compilation step involved.",
      ],
      deliverables: ["main.ts logging a sentence built from typed variables"],
      assessmentCriteria: ["Variables have appropriate types", "console.log() output reads as one coherent sentence"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "15-20 minutes",
      codeExample: {
        language: "typescript",
        code: 'let name: string = "Ada";\nlet age: number = 28;\nconsole.log(name + " is " + age + " years old.");',
        explanation: "name is annotated as string and age as number; TypeScript would flag an error if you tried to assign age a text value instead of a number.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Running a .ts File and How Type Inference Works",
      goal: "Run a TypeScript file in the Academy workspace and understand how TypeScript infers types automatically without annotations.",
      videoTitle: "TypeScript Type Inference Explained",
      videoSearchQuery: "typescript type inference explained for beginners",
      videoLearningGoal: "See TypeScript infer a variable's type from its initial value with no explicit annotation, and see the error that appears when you break that inferred type later.",
      recommendedChannels: ["Matt Pocock", "Web Dev Simplified"],
      keyTakeaways: [
        "TypeScript infers a variable's type from the value used to initialize it, so a variable started with a number is automatically treated as number.",
        "Once a type is inferred, TypeScript still enforces it: reassigning that variable to a value of a different type is an error, just as if you had annotated it explicitly.",
        "A variable declared without an initial value is treated differently from one initialized right away, since there is nothing yet to infer a type from.",
      ],
      notes:
        "You do not have to annotate every single variable for TypeScript to check it. When you write let score = 10, TypeScript looks at the value 10 and infers that score is a number, exactly as if you had written let score: number = 10 yourself.",
      conceptExplanation:
        "Inference works from the initial value at the moment of declaration. If you later try to reassign that variable to a value of a different type, TypeScript still reports an error, because the inferred type sticks around for the rest of the variable's life, just like an explicit annotation would. This lets you skip writing annotations for obvious cases while keeping full type safety.",
      whyItMatters: "Relying on inference for obvious cases keeps your code shorter and easier to read, without giving up any of the safety TypeScript provides.",
      practicalTask:
        "In main.ts, declare three variables with no type annotations at all, initializing each with a different kind of value: text, a number, and a boolean. Log all three with console.log(). Then add a comment above each line stating what type TypeScript inferred for it.",
      challenge:
        "Declare a fourth variable using just 'let total;' with no initial value, assign it a number on the next line, and console.log() it. In a comment, note what you observe about whether TypeScript still tracks it as a number afterward.",
      expectedResult: "main.ts logs three inferred-type variables correctly, with comments correctly identifying each inferred type.",
      tests: [
        "Three variables are declared without explicit type annotations",
        "Comments correctly state the inferred type for each variable",
      ],
      hint: "Whatever type of value you initialize a variable with is the type TypeScript infers for it.",
      lessonAssessment: [
        {
          question: "What type does TypeScript infer for 'let count = 5;'?",
          options: ["string", "number", "any", "boolean"],
          correctAnswerIndex: 1,
          explanation: "TypeScript infers the type from the initial value, and 5 is a number.",
        },
        {
          question: "After 'let city = \"Lagos\";', what happens if you later write 'city = 42;'?",
          options: [
            "Nothing, TypeScript allows it silently",
            "TypeScript reports a type error because city was inferred as string",
            "city becomes a string automatically",
            "It only errors at runtime, never before",
          ],
          correctAnswerIndex: 1,
          explanation: "city was inferred as string from its initial value, so reassigning it to a number is a compile-time type error.",
        },
      ],
      commonMistakes: [
        "Believing that skipping an explicit annotation means TypeScript performs no type checking at all.",
        "Not realizing that a variable declared with no initial value behaves differently from one initialized right away.",
      ],
      deliverables: ["main.ts with three inferred-type variables and accurate comments"],
      assessmentCriteria: ["Inferred types are correctly identified in comments", "File runs without type errors"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 minutes",
      codeExample: {
        language: "typescript",
        code: 'let username = "astra"; // inferred as string\nlet score = 100; // inferred as number\n\n// username = score; // Error: Type \'number\' is not assignable to type \'string\'.\nconsole.log(username, score);',
        explanation: "TypeScript infers username as string from its initial value, so reassigning it to a number later would be flagged as an error even without an explicit annotation.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Your First Explicit Type Annotations",
      goal: "Write explicit type annotations and understand when they are worth adding versus relying on inference.",
      videoTitle: "TypeScript Type Annotations Tutorial",
      videoSearchQuery: "typescript type annotations tutorial for beginners",
      videoLearningGoal: "See explicit string, number, and boolean annotations added to variables, and hear when to prefer inference instead.",
      recommendedChannels: ["Total TypeScript", "Ben Awad"],
      keyTakeaways: [
        "An explicit type annotation has the form 'let variableName: Type = value;', placed right after the variable name.",
        "Explicit annotations are most valuable when a variable's initial value does not make the intended type obvious, such as declaring a variable before giving it a value.",
        "Overusing explicit annotations on every variable when inference already gets it right adds noise without adding safety.",
      ],
      notes:
        "An annotation goes between the variable name and the equals sign: let count: number = 0;. This is the same shape you will use later for function parameters, so it is worth getting comfortable with the syntax now.",
      conceptExplanation:
        "When a variable has no initial value at the moment it is declared, TypeScript has nothing to infer a type from, so an explicit annotation is genuinely necessary. When a variable is declared with an obvious initial value, like let city = \"Lagos\", an explicit annotation is optional and often just adds extra text without changing the checking TypeScript already does.",
      whyItMatters: "Getting comfortable with explicit annotation syntax now sets up the exact same pattern you will use for typing function parameters, interfaces, and more in later modules.",
      practicalTask:
        "In main.ts, declare a variable 'let temperature: number;' with no initial value, then assign it a value on the next line and log it. Then declare a second variable 'let city: string = \"Lagos\";' using both an annotation and an initial value in one line, and log it too.",
      challenge: "Deliberately try to assign a string to the temperature variable and read the type error the workspace shows, then fix it back to a number before finishing.",
      expectedResult: "main.ts logs the temperature and city, and the file runs cleanly with no leftover type errors.",
      tests: [
        "temperature is declared with an explicit number annotation and no initial value",
        "city is declared with both an explicit string annotation and an initial value",
      ],
      hint: "The annotation goes between the variable name and the equals sign: let count: number = 0;",
      lessonAssessment: [
        {
          question: "Which line correctly annotates a variable as a number?",
          options: [
            "let age = number: 20;",
            "let age: number = 20;",
            "let number age = 20;",
            "let age<number> = 20;",
          ],
          correctAnswerIndex: 1,
          explanation: "The annotation belongs directly after the variable name, before the equals sign: let age: number = 20;",
        },
        {
          question: "When is an explicit type annotation most useful?",
          options: [
            "Never, TypeScript always infers correctly",
            "When a variable is declared without an initial value, since there is nothing to infer from",
            "Only inside comments",
            "Only for boolean variables",
          ],
          correctAnswerIndex: 1,
          explanation: "Without an initial value, TypeScript has no value to infer a type from, so an explicit annotation is the way to give it one.",
        },
      ],
      commonMistakes: [
        "Writing the annotation in the wrong position, such as putting the type name before the variable name.",
        "Adding an explicit annotation to every variable even when the initial value already makes the type obvious.",
      ],
      deliverables: ["main.ts with at least one explicitly annotated, uninitialized variable assigned afterward"],
      assessmentCriteria: ["Annotation syntax is correct", "File runs without type errors after the deliberate mistake is fixed"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 minutes",
      codeExample: {
        language: "typescript",
        code: 'let temperature: number;\ntemperature = 21;\n\nlet city: string = "Lagos";\nconsole.log(city + " is " + temperature + " degrees today.");',
        explanation: "temperature is annotated because it has no initial value to infer from; city combines an annotation with an initial value on one line.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Why TypeScript? Setup & Your First Typed Script Assessment",
    questions: [
      {
        question: "What best describes TypeScript's relationship to JavaScript?",
        options: [
          "It is an unrelated language",
          "It is a superset of JavaScript that adds an optional type system",
          "It replaces JavaScript entirely in the browser",
          "It is only used for styling",
        ],
        correctAnswerIndex: 1,
        explanation: "TypeScript builds directly on top of JavaScript syntax and adds optional static types.",
      },
      {
        question: "Before TypeScript code can run in a browser or Node.js, what must happen?",
        options: [
          "Nothing, it runs natively",
          "It must be compiled (transpiled) to JavaScript",
          "It must be renamed to .js with no other changes",
          "It must be converted to HTML",
        ],
        correctAnswerIndex: 1,
        explanation: "TypeScript is always compiled down to JavaScript before it actually executes.",
      },
      {
        question: "What does TypeScript's type checker do differently from plain JavaScript?",
        options: [
          "It only checks code while the program is running",
          "It checks your code against declared or inferred types before the program runs",
          "It removes the need to write functions",
          "It automatically deploys your code",
        ],
        correctAnswerIndex: 1,
        explanation: "Type checking happens at compile time, catching many mistakes before the program ever executes.",
      },
      {
        question: "What type does TypeScript infer for 'let isReady = true;'?",
        options: ["string", "number", "boolean", "any"],
        correctAnswerIndex: 2,
        explanation: "true is a boolean value, so isReady is inferred as boolean.",
      },
      {
        question: "Given 'let score = 10;' followed by 'score = \"high\";', what happens?",
        options: [
          "It runs fine, score just becomes text",
          "TypeScript reports a type error because score was inferred as number",
          "TypeScript deletes the second line automatically",
          "It only fails when compiled to JavaScript, never before",
        ],
        correctAnswerIndex: 1,
        explanation: "score's inferred type (number) is still enforced for later reassignments.",
      },
      {
        question: "Where does an explicit type annotation go in a variable declaration?",
        options: [
          "After the equals sign only",
          "Between the variable name and the equals sign",
          "Before the let keyword",
          "At the very end of the file",
        ],
        correctAnswerIndex: 1,
        explanation: "The annotation sits right after the variable name, like: let age: number = 20;",
      },
      {
        question: "Why is an explicit annotation necessary for 'let total;' with no initial value?",
        options: [
          "It is never necessary",
          "There is no initial value for TypeScript to infer a type from",
          "let always requires an annotation, even with a value",
          "Only const requires annotations",
        ],
        correctAnswerIndex: 1,
        explanation: "Without an initial value, there is nothing for TypeScript's inference to work from.",
      },
      {
        question: "What is one practical benefit of TypeScript's type checking mentioned as a reason it is widely used?",
        options: [
          "It makes code run faster in the browser",
          "It catches many bugs while writing code instead of after running it",
          "It removes the need for functions entirely",
          "It automatically writes your comments",
        ],
        correctAnswerIndex: 1,
        explanation: "Moving error discovery earlier, to write time instead of runtime, is a core benefit of TypeScript.",
      },
      {
        question: "Which of these is valid TypeScript syntax for annotating a string variable?",
        options: [
          "let city: string = \"Lagos\";",
          "let city = string(\"Lagos\");",
          "let city string = \"Lagos\";",
          "string city = \"Lagos\";",
          ],
        correctAnswerIndex: 0,
        explanation: "The colon-based annotation syntax, type after variable name, is how TypeScript expresses this.",
      },
      {
        question: "Is it necessary to add an explicit annotation to every variable in a TypeScript file?",
        options: [
          "Yes, always, or the file will not compile",
          "No, inference already covers many obvious cases correctly",
          "Only for variables holding numbers",
          "Only inside functions",
        ],
        correctAnswerIndex: 1,
        explanation: "TypeScript's inference handles many cases correctly on its own; annotations are most useful when inference has nothing to work from.",
      },
    ],
  },
  assignment:
    "Build a short 'About Me' typed script in the Academy workspace: declare at least five variables describing yourself with a mix of explicit annotations and inferred types (covering string, number, and boolean values), then use console.log() and comments to print a readable mini-profile, noting next to each variable whether its type was inferred or explicitly annotated.",
  assignmentDeliverables: [
    "main.ts with 5+ typed variables mixing inference and explicit annotations",
    "Comments identifying which variables are inferred versus explicitly annotated",
    "console.log() output forming readable sentences",
  ],
  assignmentAssessmentCriteria: [
    "Types correctly match each variable's value",
    "At least one variable uses inference and at least one uses an explicit annotation",
    "Comments correctly identify each approach",
  ],
  miniProject:
    "Extend your 'About Me' script into a 'Typed Profile Card': print a formatted block using multiple console.log() lines to form a small profile card, built from characters like - and | for borders and sections, with every displayed value coming from an explicitly typed variable rather than being hardcoded directly into the console.log() calls.",
  miniProjectDeliverables: ["profile_card.ts in the Academy workspace", "A brief note on which variables are explicitly typed and why"],
  miniProjectAssessmentCriteria: [
    "The card's content comes entirely from typed variables, not hardcoded strings",
    "Output is visually organized with clear lines or sections",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
