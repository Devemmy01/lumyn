import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module3: GeneratedModule = {
  title: "Modules & the JavaScript Ecosystem",
  description:
    "Learn how real JavaScript projects organize code across files using export and import, understand default versus named exports, and use built-in objects like Math and Date that every project relies on.",
  completionStatus: "locked",
  lessons: [
    {
      title: "export and import: Sharing Code Between Files",
      goal: "Understand ES module named export and import syntax, and how real JavaScript projects share code across multiple files.",
      videoTitle: "JavaScript ES Modules Tutorial: export and import",
      videoSearchQuery: "javascript es6 modules export import tutorial named exports",
      videoLearningGoal: "See named exports and imports used to share functions and values between separate JavaScript files.",
      recommendedChannels: ["Web Dev Simplified", "The Net Ninja"],
      keyTakeaways: [
        "export makes a function, variable, or class defined in one file available to be imported elsewhere.",
        "import { name } from \"./file.js\" brings a named export into another file, using the exact name it was exported with.",
        "Splitting related code into separate files connected by export and import keeps larger projects organized and reusable.",
      ],
      notes:
        "Real JavaScript projects are almost never written in one giant file. Code is split into modules, files each responsible for one thing, connected through export and import statements. The Academy workspace runs script.js as a single file, so in this lesson you will document how the syntax would look across separate files using comments, and then write the equivalent working logic directly in script.js.",
      conceptExplanation:
        "In a file called mathUtils.js, writing export function add(a, b) { return a + b; } and export const PI = 3.14159; makes both add and PI available elsewhere. Another file imports them with import { add, PI } from \"./mathUtils.js\";, listing exactly the names that were exported, separated by commas if there is more than one. The name inside the curly braces must match the exported name exactly; import { addNumbers } from \"./mathUtils.js\" would fail if the file only exports add.",
      whyItMatters: "Almost every real JavaScript codebase is organized across many files connected by export and import, so reading and writing that syntax is essential to working on any modern project.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. At the top of the file, write a comment block showing how you would create a separate file called mathUtils.js that uses export to share a named function add(a, b) and a named constant PI. Below that, write a second comment showing the import statement script.js would use to bring both of them in. Then, directly below the comments, write the actual add(a, b) function and PI constant in script.js, call add(2, 3), and print the result alongside PI.",
      challenge: "Add a second named export to your comment block, a subtract(a, b) function, and update the comment's import statement to bring in add, subtract, and PI together in one import line. Then add the real subtract function to script.js and print its result too.",
      expectedResult: "The comments accurately document a two-file export and import structure, and script.js prints the correct results of calling add() and, for the challenge, subtract(), along with PI.",
      tests: ["Comments correctly show export syntax for at least one named function and one named constant", "The equivalent function logic actually runs and prints correct results directly in script.js"],
      hint: "The name inside the curly braces of an import statement must exactly match the name used after export in the original file, including capitalization.",
      lessonAssessment: [
        {
          question: "What must the name inside import { name } from \"./file.js\" match?",
          options: [
            "Any name the importing file prefers",
            "The exact name that was exported from file.js",
            "The name of the file itself",
            "Nothing, any name always works",
          ],
          correctAnswerIndex: 1,
          explanation: "A named import must exactly match the name that was written after export in the original file, or the import fails to find it.",
        },
        {
          question: "What does export function add(a, b) { return a + b; } allow another file to do?",
          options: [
            "Nothing, export has no effect on other files",
            "Import add using import { add } from \"./thatFile.js\"",
            "Automatically run add() in every file in the project",
            "Delete the add function from the original file",
          ],
          correctAnswerIndex: 1,
          explanation: "export makes add available to be imported by name in another file using the matching import syntax.",
        },
      ],
      commonMistakes: ["Importing a name that does not exactly match the spelling or capitalization used after export in the original file.", "Forgetting the ./ relative path prefix when importing a local project file, which is required to distinguish it from an installed package."],
      deliverables: ["script.js with comments documenting a two-file export/import structure, plus working equivalent code"],
      assessmentCriteria: ["Comments correctly demonstrate named export and import syntax", "The real, running code produces correct printed results"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: '// ---- mathUtils.js (conceptual file) ----\n// export function add(a, b) {\n//   return a + b;\n// }\n// export const PI = 3.14159;\n\n// ---- script.js (conceptual import) ----\n// import { add, PI } from "./mathUtils.js";\n\nfunction add(a, b) {\n  return a + b;\n}\nconst PI = 3.14159;\n\nconsole.log(add(2, 3));\nconsole.log(PI);',
        explanation: "The comments document how add and PI would be exported from mathUtils.js and imported into script.js; the real code below runs the equivalent logic directly, since the workspace executes a single file.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Default Exports and Organizing a Small Project",
      goal: "Understand default exports and imports, and how a small project's files are typically organized around one main responsibility per file.",
      videoTitle: "JavaScript Default Exports vs Named Exports Explained",
      videoSearchQuery: "javascript default export vs named export tutorial",
      videoLearningGoal: "See the difference between a file's one default export and its multiple possible named exports.",
      recommendedChannels: ["Fireship", "freeCodeCamp.org"],
      keyTakeaways: [
        "A file can have at most one default export, written as export default, for its single main piece of functionality.",
        "Importing a default export does not use curly braces, and the importing file can choose any local name for it.",
        "Well-organized projects typically give each file one clear responsibility, like a single class, a group of related helper functions, or shared configuration values.",
      ],
      notes:
        "Named exports are useful when a file shares several related things, but many files are really built around one central piece: a single class or a single main function. export default marks that one main thing, and importing it works a little differently from a named import.",
      conceptExplanation:
        "In cart.js, export default class ShoppingCart { ... } marks ShoppingCart as that file's default export. Another file imports it with import ShoppingCart from \"./cart.js\";, no curly braces, and could even name it something else locally, like import Cart from \"./cart.js\";, since a default import is positional, not name-matched. A file can still have named exports alongside its one default export, for example export const TAX_RATE = 0.08; living in the same cart.js file next to the default class.",
      whyItMatters: "Knowing when to reach for a default export versus a named export, and organizing files by responsibility, is core to reading and contributing to real JavaScript codebases.",
      practicalTask:
        "In script.js, write a comment block showing a conceptual cart.js file that uses export default for a ShoppingCart class (constructor storing an empty items array, method addItem(name, price), and method total() that sums every item's price). Add a second comment showing script.js's import ShoppingCart from \"./cart.js\"; line. Then, directly in script.js, define the real ShoppingCart class, create an object, add at least 2 items, and print the total.",
      challenge: "Add a named export living alongside the default export in your comment block, export const TAX_RATE = 0.08;, and use an equivalent real constant in script.js to print the cart's total with tax added.",
      expectedResult: "The comments correctly show default export and import syntax, and script.js prints the correct cart total (and, for the challenge, the tax-adjusted total).",
      tests: ["Comments correctly show export default syntax for a class and its corresponding import without curly braces", "The equivalent ShoppingCart class runs correctly and calculates the right total"],
      hint: "A default import never uses curly braces around the imported name, unlike a named import.",
      lessonAssessment: [
        {
          question: "How many default exports can a single JavaScript file have?",
          options: ["As many as needed", "At most one", "Exactly two", "Zero, default exports are invalid"],
          correctAnswerIndex: 1,
          explanation: "A file can only have one export default; if it needs to share more than one main thing, it should use named exports instead.",
        },
        {
          question: "What is different about importing a default export compared to a named export?",
          options: [
            "Default imports also require curly braces",
            "Default imports do not use curly braces, and the local name can be chosen freely",
            "Default exports cannot be imported at all",
            "There is no difference",
          ],
          correctAnswerIndex: 1,
          explanation: "A default import is written without curly braces, and since it is positional rather than name-matched, the importing file can call it whatever it wants.",
        },
      ],
      commonMistakes: ["Wrapping a default import in curly braces, like import { ShoppingCart } from \"./cart.js\", which is the syntax for a named import, not a default one.", "Trying to write two export default statements in the same file, which is invalid since a file can only have one default export."],
      deliverables: ["script.js with comments documenting a default export/import structure, plus a working ShoppingCart class"],
      assessmentCriteria: ["Comments correctly demonstrate default export and import syntax", "The real ShoppingCart class correctly tracks items and calculates the total"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: '// ---- cart.js (conceptual file) ----\n// export default class ShoppingCart {\n//   constructor() {\n//     this.items = [];\n//   }\n//   addItem(name, price) {\n//     this.items.push({ name, price });\n//   }\n//   total() {\n//     return this.items.reduce((sum, item) => sum + item.price, 0);\n//   }\n// }\n\n// ---- script.js (conceptual import) ----\n// import ShoppingCart from "./cart.js";\n\nclass ShoppingCart {\n  constructor() {\n    this.items = [];\n  }\n  addItem(name, price) {\n    this.items.push({ name, price });\n  }\n  total() {\n    return this.items.reduce((sum, item) => sum + item.price, 0);\n  }\n}\n\nconst cart = new ShoppingCart();\ncart.addItem("Notebook", 4.5);\ncart.addItem("Pen", 1.25);\nconsole.log(cart.total());',
        explanation: "The comments document cart.js exporting ShoppingCart as its default export and script.js importing it without curly braces; the real class below runs the same logic directly in the single-file workspace.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Built-in Objects: Math and Date",
      goal: "Use JavaScript's built-in Math and Date objects for common numeric calculations and date and time information.",
      videoTitle: "JavaScript Math and Date Objects Tutorial",
      videoSearchQuery: "javascript math object date object tutorial methods",
      videoLearningGoal: "See Math methods used for rounding, comparing, and random numbers, and Date methods used to read the current date.",
      recommendedChannels: ["freeCodeCamp.org", "Programming with Mosh"],
      keyTakeaways: [
        "Math provides ready-to-use methods like Math.round(), Math.max(), Math.min(), Math.floor(), and Math.random() for common numeric operations.",
        "new Date() creates an object representing the current date and time, with methods like getFullYear(), getMonth(), and getDate() to read its parts.",
        "Math.random() returns a decimal between 0 (inclusive) and 1 (exclusive), commonly scaled and floored to generate a random whole number in a chosen range.",
      ],
      notes:
        "Math and Date are two of JavaScript's most-used built-in objects, and unlike your own classes, they are always available without any export or import. Math groups together numeric helper methods, while Date represents a single point in time and provides methods to read or calculate from it.",
      conceptExplanation:
        "Math.max(4, 9, 2) returns 9, Math.min(4, 9, 2) returns 2, and Math.round(4.6) returns 5, rounding to the nearest whole number. To generate a random whole number between min and max inclusive, the standard formula is Math.floor(Math.random() * (max - min + 1)) + min. For dates, const now = new Date(); creates an object for the current moment, and now.getFullYear() returns the four-digit year, while now.getMonth() returns the month as a number from 0 to 11, where 0 means January, not 1.",
      whyItMatters: "Math and Date are used constantly in real applications, from calculating totals and generating random values to displaying timestamps, scheduling, and measuring time between events.",
      practicalTask:
        "In script.js, use Math.max() and Math.min() on at least 5 individual numbers passed directly as arguments to find and print the highest and lowest. Use Math.round() to round a decimal price to the nearest whole number and print it. Then write a function rollDie() that returns a random whole number between 1 and 6 using Math.random() and Math.floor(), call it, and print the result. Finally, create a new Date() and print the current year using getFullYear().",
      challenge: "Write a function randomInt(min, max) that generalizes your dice roll to any range using the same Math.floor(Math.random() * (max - min + 1)) + min formula, call it with a few different ranges, and use an array of month names indexed by a Date object's getMonth() to print the current month's name instead of its number.",
      expectedResult: "The program prints the correct max and min from the given numbers, a rounded price, a dice roll between 1 and 6, and the current year read from a Date object.",
      tests: ["Math.max() and Math.min() are both used correctly on numeric arguments", "A random whole number is generated using Math.random() combined with Math.floor()"],
      hint: "Math.random() alone only ever returns a decimal between 0 and 1; multiplying by a range and then flooring the result is required to land on a whole number.",
      lessonAssessment: [
        {
          question: "What does Math.floor(Math.random() * 6) + 1 produce?",
          options: [
            "A decimal number between 0 and 6",
            "A random whole number between 1 and 6",
            "Always the number 6",
            "A random whole number between 0 and 5",
          ],
          correctAnswerIndex: 1,
          explanation: "Math.random() gives a decimal from 0 up to (but not including) 1; multiplying by 6 and flooring gives a whole number from 0 to 5, and adding 1 shifts that range to 1 through 6.",
        },
        {
          question: "What does now.getMonth() return for a Date object representing January?",
          options: ["1", "0", "\"January\"", "12"],
          correctAnswerIndex: 1,
          explanation: "getMonth() is zero-indexed, so January returns 0, February returns 1, and so on, unlike the way humans normally count months.",
        },
      ],
      commonMistakes: ["Forgetting that Math.random() must be multiplied and floored to produce a whole number in a specific range, rather than used on its own.", "Assuming getMonth() returns 1 for January like everyday counting, when it actually returns 0 because months are zero-indexed."],
      deliverables: ["A script using Math.max, Math.min, Math.round, Math.random with Math.floor, and Date's getFullYear()"],
      assessmentCriteria: ["Math methods are used correctly and produce the expected results", "A random whole number is correctly generated within the intended range"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'console.log(Math.max(12, 45, 3, 78, 20));\nconsole.log(Math.min(12, 45, 3, 78, 20));\nconsole.log(Math.round(19.6));\n\nfunction rollDie() {\n  return Math.floor(Math.random() * 6) + 1;\n}\nconsole.log(rollDie());\n\nconst now = new Date();\nconsole.log(now.getFullYear());',
        explanation: "Math.max/min compare the given numbers directly, Math.round rounds to the nearest whole number, rollDie() uses the standard random-integer formula, and getFullYear() reads the current year from a new Date object.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Modules & the JavaScript Ecosystem Assessment",
    questions: [
      { question: "What does export do to a function defined in a file?", options: ["Deletes it from the file", "Makes it available to be imported by other files", "Runs it immediately", "Converts it into a class"], correctAnswerIndex: 1, explanation: "export marks a function, variable, or class as available for other files to import." },
      { question: "What must the name inside import { name } from \"./file.js\" match?", options: ["Any name the importing file chooses", "The exact name that was exported from file.js", "The filename itself", "Nothing in particular"], correctAnswerIndex: 1, explanation: "A named import must exactly match the exported name, including capitalization." },
      { question: "How many default exports can one file have?", options: ["Unlimited", "At most one", "Exactly two", "Zero"], correctAnswerIndex: 1, explanation: "A file can have only one export default; additional shared values need named exports instead." },
      { question: "How is importing a default export different from importing a named export?", options: [
          "Default imports also require curly braces",
          "Default imports skip curly braces and can use any local name",
          "Default exports cannot be imported",
          "There is no difference at all",
        ], correctAnswerIndex: 1, explanation: "A default import is written without curly braces and, being positional rather than name-matched, can be renamed freely by the importing file." },
      { question: "What does Math.max(4, 9, 2) return?", options: ["4", "9", "2", "15"], correctAnswerIndex: 1, explanation: "Math.max() returns the largest of the numbers passed to it, which is 9 here." },
      { question: "What range of values does Math.random() return?", options: ["A whole number from 1 to 10", "A decimal from 0 (inclusive) up to but not including 1", "A decimal from -1 to 1", "Always exactly 0.5"], correctAnswerIndex: 1, explanation: "Math.random() always returns a decimal greater than or equal to 0 and strictly less than 1." },
      { question: "What formula generates a random whole number between 1 and 6, inclusive?", options: [
          "Math.random() * 6",
          "Math.floor(Math.random() * 6) + 1",
          "Math.ceil(Math.random())",
          "Math.round(Math.random() * 6) - 1",
        ], correctAnswerIndex: 1, explanation: "Multiplying by the range size, flooring, and then adding the minimum value is the standard formula for a random whole number in a range." },
      { question: "What does now.getMonth() return for a Date representing January?", options: ["1", "0", "\"Jan\"", "12"], correctAnswerIndex: 1, explanation: "getMonth() is zero-indexed, so January is 0 and December is 11." },
      { question: "What does now.getFullYear() return for a Date object?", options: ["The current month", "The current four-digit year", "The current day of the week", "A timestamp in milliseconds"], correctAnswerIndex: 1, explanation: "getFullYear() reads the four-digit year from a Date object." },
      { question: "Why do real JavaScript projects typically split code across multiple files using export and import instead of writing one large file?", options: [
          "JavaScript requires at least two files to run",
          "It keeps related code organized by responsibility and makes pieces reusable across the project",
          "It makes the code run faster automatically",
          "Single-file projects are not allowed by the language",
        ], correctAnswerIndex: 1, explanation: "Splitting code into focused modules connected by export and import keeps larger projects organized, readable, and reusable." },
    ],
  },
  assignment:
    "Build a 'Temperature Converter' utility: in script.js, write a comment block documenting how you would organize this as a separate file called converters.js using named exports for celsiusToFahrenheit(celsius) and fahrenheitToCelsius(fahrenheit) functions, plus the corresponding import statement script.js would use. Then implement both functions directly in script.js, call each at least twice with different values, and print the results with clear labels.",
  assignmentDeliverables: [
    "script.js with comments documenting a converters.js file's export syntax and the matching import statement",
    "Working celsiusToFahrenheit and fahrenheitToCelsius functions called and printed with labeled output",
  ],
  assignmentAssessmentCriteria: [
    "Comments accurately demonstrate named export and import syntax for two functions",
    "Both conversion functions calculate and print correct results",
  ],
  miniProject:
    "Build a 'Dice and Date Report': write a function rollDice() using Math.random() and Math.floor() that returns a random whole number between 1 and 6, and a function daysUntilEndOfMonth() that uses a Date object together with new Date(year, month + 1, 0).getDate() to find the last day of the current month, then calculates how many days remain by subtracting the current day of the month. Call rollDice() at least 3 times, printing each result, and print the result of daysUntilEndOfMonth() with a clear label.",
  miniProjectDeliverables: [
    "A script defining rollDice() and daysUntilEndOfMonth() functions",
    "Printed output showing at least 3 dice rolls and the calculated days remaining in the current month",
  ],
  miniProjectAssessmentCriteria: [
    "rollDice() always returns a whole number between 1 and 6 inclusive",
    "daysUntilEndOfMonth() correctly uses Date methods to calculate a real day count",
    "Output clearly labels each printed result",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
