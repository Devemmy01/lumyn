import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module7: GeneratedModule = {
  title: "Writing Production-Quality JavaScript",
  description:
    "Pick up the habits that separate a working script from production-quality JavaScript: organizing larger scripts into clear, single-responsibility functions, a consistent defensive error handling strategy, everyday performance habits like avoiding wasted loop work and memoization, and a short bridging note on why teams often add TypeScript once code reaches this level of structure.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Organizing Larger Scripts: Structure and Single Responsibility",
      goal: "Structure a larger script into logical, single-responsibility functions and a clear top-level flow instead of one long, flat sequence of statements.",
      videoTitle: "Organizing JavaScript Code for Readability",
      videoSearchQuery: "javascript code organization structure large scripts tutorial",
      videoLearningGoal: "See a single long, flat script refactored into named functions with clear single responsibilities and a clear top-level flow.",
      recommendedChannels: ["Web Dev Simplified", "ArjanCodes"],
      keyTakeaways: [
        "A script that mixes data setup, business logic, and output together in one long flat sequence becomes hard to read, test, and change as it grows.",
        "Splitting logic into small, named functions, each responsible for one clear task, makes a script's top-level flow read almost like a table of contents.",
        "Grouping related functions together and keeping a single, clearly-named entry point function, often called main(), called exactly once at the bottom, makes even a long script easy to follow.",
      ],
      notes:
        "Structure isn't about writing more code; it's about giving each piece of logic a name and a clear boundary, so the script's intent is visible at a glance instead of buried in a wall of statements.",
      conceptExplanation:
        "Compare a flat script that generates data, filters it, formats it, and logs it all inline with the same logic split into loadOrders(), filterPendingOrders(orders), formatOrderSummary(order), and a single function main() { const orders = loadOrders(); const pending = filterPendingOrders(orders); pending.forEach((order) => console.log(formatOrderSummary(order))); } main(); Reading main() alone tells you the whole story of what the script does, and each smaller function can be tested, reused, or fixed independently of the others.",
      whyItMatters:
        "Every real JavaScript codebase grows past a single small script; the habit of splitting logic into small, clearly-named, single-responsibility functions is what keeps a growing script manageable instead of turning into something no one, including you in six months, wants to touch.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Take a scenario with at least three distinct processing steps, for example generating a list of sample order objects, filtering to only pending ones, and formatting each into a readable summary string, and organize it into separate, clearly-named functions, one per responsibility, plus a single main() function that calls them in order and logs the results. Call main() exactly once, at the very bottom of the file.",
      challenge:
        "Extract one piece of logic used in two different places in your script, for example a currency-formatting calculation, into its own small named helper function, and update both places to call it instead of duplicating the logic.",
      expectedResult:
        "main() clearly reads as an ordered sequence of well-named steps, and running the script produces correct output, but the code is organized into small, focused, individually understandable functions rather than one flat sequence.",
      tests: [
        "The script is organized into at least three single-responsibility functions rather than one long flat sequence of statements",
        "A single main() function calls the other functions in order and is itself called exactly once",
      ],
      hint: "A good test for whether a function has a single responsibility is whether you can summarize what it does in one short sentence without using the word 'and'.",
      lessonAssessment: [
        {
          question: "What is a sign that a script needs better organization?",
          options: [
            "It defines more than one function",
            "It mixes multiple unrelated responsibilities together in one long, flat sequence that's hard to follow",
            "It has a main() function at the bottom",
            "It uses const instead of var",
          ],
          correctAnswerIndex: 1,
          explanation: "A script that tangles unrelated concerns together in one flat block of statements is a clear sign it needs to be split into focused functions.",
        },
        {
          question: "What is the benefit of a single main() (entry point) function calling smaller functions in order?",
          options: [
            "It makes the script run faster",
            "The top-level flow becomes easy to read at a glance, like a summary of the script's steps",
            "It prevents the script from ever throwing an error",
            "It is required by JavaScript syntax",
          ],
          correctAnswerIndex: 1,
          explanation: "Reading main() alone tells you the overall shape of what the script does, without needing to read every line of implementation detail.",
        },
      ],
      commonMistakes: [
        "Writing one long flat script with no named functions, making it hard to test, reuse, or safely change any individual piece of logic.",
        "Giving a function multiple unrelated responsibilities, for example loading data and also formatting and also logging all in one function, which makes it harder to reuse or test that function on its own.",
      ],
      deliverables: ["script.js organized into at least three single-responsibility functions plus a single main() entry point"],
      assessmentCriteria: [
        "Logic is correctly split into small, clearly-named, single-responsibility functions",
        "main() correctly calls the other functions in order and is called exactly once",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: "function loadOrders() {\n  return [\n    { id: 1, status: 'pending', total: 42.5 },\n    { id: 2, status: 'shipped', total: 18 },\n  ];\n}\n\nfunction filterPendingOrders(orders) {\n  return orders.filter((order) => order.status === 'pending');\n}\n\nfunction formatOrderSummary(order) {\n  return `Order #${order.id}: $${order.total.toFixed(2)}`;\n}\n\nfunction main() {\n  const orders = loadOrders();\n  const pending = filterPendingOrders(orders);\n  pending.forEach((order) => console.log(formatOrderSummary(order)));\n}\n\nmain();",
        explanation: "Each function has one clear responsibility, and main() reads as a short, ordered summary of the whole script's behavior.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Defensive Error Handling: Custom Errors, Fail Fast, and Guard Clauses",
      goal: "Apply a consistent defensive error handling strategy: validating inputs early with guard clauses, and throwing custom Error subclasses with clear, distinguishable messages.",
      videoTitle: "JavaScript Defensive Error Handling: Guard Clauses and Custom Errors",
      videoSearchQuery: "javascript defensive programming guard clauses custom error class tutorial",
      videoLearningGoal: "See a function guarded with early validation checks that fail fast with a custom Error subclass, instead of letting bad input cause a confusing failure somewhere else later.",
      recommendedChannels: ["ArjanCodes", "Theo - t3.gg"],
      keyTakeaways: [
        "A guard clause checks for an invalid or unexpected condition at the very top of a function and returns or throws immediately, avoiding deeply nested if/else blocks.",
        "Extending the built-in Error class with class ValidationError extends Error { ... } lets calling code distinguish specific kinds of failure with instanceof, rather than parsing error message strings.",
        "Failing fast, throwing a clear error the moment invalid data is detected, turns a confusing bug discovered far downstream into an immediate, easy-to-diagnose failure at its actual source.",
      ],
      notes:
        "Defensive coding isn't about wrapping everything in try/catch; it's a strategy: validate at the boundary, fail loudly and immediately with a clear message, and give calling code a way to distinguish expected failure types from unexpected ones.",
      conceptExplanation:
        "class ValidationError extends Error { constructor(message) { super(message); this.name = 'ValidationError'; } } function setPriority(priority) { if (typeof priority !== 'number' || priority < 1 || priority > 5) { throw new ValidationError(`priority must be a number from 1 to 5, got ${JSON.stringify(priority)}`); } return priority; } is a guard clause: it checks the problem condition immediately and throws before any other logic runs, rather than letting a bad priority value silently flow deeper into the program. Calling code can then write try { setPriority(userInput); } catch (error) { if (error instanceof ValidationError) { /* handle the expected validation failure distinctly */ } else { throw error; } } to react specifically to validation failures while still letting genuinely unexpected errors propagate.",
      whyItMatters:
        "Precise, custom error types paired with fail-fast validation turn silent data corruption and mysterious downstream crashes into clear, immediate, traceable failures right at their source, which is a habit that separates production-quality code from a fragile first draft.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Write a custom class ValidationError extends Error, setting this.name = 'ValidationError' in its constructor. Write a function setPriority(priority) that uses a guard clause to validate priority is a number between 1 and 5, throwing a ValidationError with a clear message if not. Write a second function, createTask(title, priority), that itself guards against an empty or non-string title, throwing ValidationError, before calling setPriority(priority) internally. Demonstrate one valid call to createTask() and two invalid calls, one with a bad title and one with a bad priority, each caught with try/catch that checks error instanceof ValidationError and logs a clear message.",
      challenge:
        "Add a second custom error class, NotFoundError extends Error, write a function findTaskById(tasks, id) that throws it when no matching task exists, and demonstrate catching both ValidationError and NotFoundError from the same try/catch block, branching your handling based on which specific error type was actually thrown.",
      expectedResult:
        "The valid call to createTask() succeeds and logs the created task, and both invalid calls are correctly caught and identified as ValidationError instances rather than generic, unidentifiable errors.",
      tests: [
        "ValidationError correctly extends Error and can be distinguished from a generic Error using instanceof",
        "setPriority() and createTask() both use guard clauses that fail fast with a clear ValidationError for invalid input",
      ],
      hint: "Always call super(message) as the very first line inside a custom Error subclass's constructor, or the built-in Error machinery, like the message and stack trace, won't be set up correctly.",
      lessonAssessment: [
        {
          question: "What is a guard clause?",
          options: [
            "A comment explaining a function's purpose",
            "A check at the top of a function that returns or throws immediately for an invalid condition, avoiding deep nesting",
            "A special kind of loop",
            "A way to permanently disable error handling",
          ],
          correctAnswerIndex: 1,
          explanation: "A guard clause handles an invalid case immediately at the top of a function, keeping the rest of the function focused on the valid case.",
        },
        {
          question: "Why extend the built-in Error class with a custom error type like ValidationError?",
          options: [
            "It makes the code run faster",
            "It lets calling code distinguish specific kinds of failure with instanceof, instead of parsing error message strings",
            "It is required for throw to work at all",
            "It automatically fixes the invalid input instead of throwing",
          ],
          correctAnswerIndex: 1,
          explanation: "A custom Error subclass gives calling code a reliable way to check exactly which kind of failure occurred, using instanceof.",
        },
      ],
      commonMistakes: [
        "Forgetting to call super(message) as the first line of a custom Error subclass's constructor, which leaves the resulting error missing its proper message and stack trace.",
        "Validating input deep inside a program instead of at the point it first enters a function, making it much harder to trace exactly where invalid data actually came from.",
      ],
      deliverables: ["script.js with a ValidationError class, guard-clause validation in setPriority() and createTask(), and both a valid and invalid demonstration"],
      assessmentCriteria: [
        "ValidationError correctly extends Error and is distinguishable with instanceof",
        "Invalid input is correctly rejected immediately via guard clauses rather than allowed to propagate further into the program",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "javascript",
        code: "class ValidationError extends Error {\n  constructor(message) {\n    super(message);\n    this.name = 'ValidationError';\n  }\n}\n\nfunction setPriority(priority) {\n  if (typeof priority !== 'number' || priority < 1 || priority > 5) {\n    throw new ValidationError(`priority must be a number from 1 to 5, got ${JSON.stringify(priority)}`);\n  }\n  return priority;\n}\n\ntry {\n  setPriority(9);\n} catch (error) {\n  if (error instanceof ValidationError) {\n    console.log('Validation failed:', error.message);\n  } else {\n    throw error;\n  }\n}",
        explanation: "setPriority() fails fast with a clear ValidationError the moment invalid input is detected, and the catch block distinguishes it from any other kind of error using instanceof.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Performance Basics: Avoiding Wasted Work, Memoization, and Why TypeScript Comes Next",
      goal: "Recognize and avoid common sources of unnecessary work inside loops, apply memoization to cache expensive repeated calculations, and understand why teams often add TypeScript on top of well-organized, defensively-written JavaScript.",
      videoTitle: "JavaScript Performance Basics: Avoiding Wasted Work and Memoization",
      videoSearchQuery: "javascript performance loops memoization typescript tutorial",
      videoLearningGoal: "See a common performance mistake, repeating expensive work inside a loop unnecessarily, fixed by moving it outside the loop, plus a repeated function call fixed with memoization.",
      recommendedChannels: ["Fireship", "Theo - t3.gg"],
      keyTakeaways: [
        "A common source of wasted work is recomputing the same value repeatedly inside a loop when it never changes between iterations and could be computed once, outside the loop.",
        "Memoization caches a function's result for a given set of arguments, so calling it again with the same arguments returns the cached result instantly instead of recomputing it.",
        "TypeScript adds a static type layer on top of exactly the organized, defensively-validated JavaScript from this module, catching many of the same input mistakes at compile time instead of only at runtime; it's a natural next step once these JavaScript foundations feel solid.",
      ],
      notes:
        "Two of the most common, easy-to-fix performance mistakes in JavaScript are repeating work inside a loop that doesn't change between iterations, and recomputing an expensive function's result for inputs you've already seen before.",
      conceptExplanation:
        "for (let i = 0; i < items.length; i++) { const total = items.reduce((sum, item) => sum + item.price, 0); /* ... */ } recomputes total on every single iteration even though it never changes; moving const total = items.reduce(...) above the loop computes it exactly once. Memoization looks like: function memoize(fn) { const cache = new Map(); return function (arg) { if (cache.has(arg)) { return cache.get(arg); } const result = fn(arg); cache.set(arg, result); return result; }; } calling a memoized function twice with the same argument only actually runs the original logic on the first call; the second call returns the cached result from the Map immediately. As scripts grow with more functions, more parameters, and more validation logic like the previous lesson's guard clauses, TypeScript layers static type checking on top, catching a wrong argument type or a missing property before the code ever runs, which is exactly why many teams adopt it once a JavaScript codebase reaches this level of structure and care.",
      whyItMatters:
        "Avoiding needless repeated work inside loops and caching expensive, repeated calculations are two of the highest-value, lowest-effort performance habits in everyday JavaScript, and understanding what TypeScript actually adds, rather than treating it as an unrelated separate language, makes it far easier to learn next, since it builds directly on everything in this course.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Write a function that deliberately recomputes an unchanging derived value, such as a total, inside a loop on every iteration, time it with performance.now() before and after, then refactor it to compute that value once outside the loop, time the refactored version, and log both timings clearly labeled. Separately, write a memoize(fn) helper function using a Map, wrap a function that logs a message every time it actually runs its 'expensive' logic, and call the memoized version with the same argument multiple times, confirming the expensive logic message only logs once for that argument.",
      challenge:
        "Call your memoized function with at least three different arguments, then repeat two of those same arguments again, and log the cache's size to confirm it holds exactly one entry per distinct argument seen, not one entry per call.",
      expectedResult:
        "The refactored loop-hoisting version performs clearly less redundant work than the original, and the memoized function's 'expensive' logic message logs exactly once per distinct argument, no matter how many times that same argument is requested afterward.",
      tests: [
        "A version of the loop that recomputes an unchanging value is compared against a refactored version that computes it once outside the loop",
        "memoize() correctly caches results per argument, demonstrated by the wrapped function's expensive logic running only once per distinct argument",
      ],
      hint: "A Map is a natural cache for memoization because it can use any value, not just strings, as a key, and has() lets you check for a cached entry before falling back to actually calling the original function.",
      lessonAssessment: [
        {
          question: "What is a common performance mistake involving loops?",
          options: [
            "Using const instead of let for loop variables",
            "Recomputing an unchanging value on every iteration instead of computing it once outside the loop",
            "Using a for...of loop instead of a for loop",
            "Declaring a function inside a loop body",
          ],
          correctAnswerIndex: 1,
          explanation: "Recomputing a value that never changes between iterations wastes repeated work that could have been done once, outside the loop.",
        },
        {
          question: "What does memoization do?",
          options: [
            "It permanently deletes a function after it runs once",
            "It caches a function's result for a given argument so a repeated call with the same argument returns instantly instead of recomputing",
            "It converts a function into an async function",
            "It prevents a function from ever being called twice",
          ],
          correctAnswerIndex: 1,
          explanation: "Memoization stores previously computed results keyed by argument, skipping redundant recomputation on repeated calls with the same input.",
        },
      ],
      commonMistakes: [
        "Recomputing a value inside a loop on every iteration even though it never changes between iterations, wasting repeated work that could have been done once.",
        "Memoizing a function whose result depends on more than just its arguments, for example current time or external mutable state, which produces incorrect cached results since the cache assumes the same arguments always produce the same output.",
      ],
      deliverables: ["script.js comparing a loop-hoisted optimization against the original, plus a memoize(fn) helper demonstrated on a repeated call"],
      assessmentCriteria: [
        "The loop-hoisting comparison correctly demonstrates avoiding unnecessary recomputation",
        "memoize() correctly caches results so the wrapped function's underlying logic runs once per distinct argument",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "javascript",
        code: "function memoize(fn) {\n  const cache = new Map();\n  return function (arg) {\n    if (cache.has(arg)) {\n      return cache.get(arg);\n    }\n    const result = fn(arg);\n    cache.set(arg, result);\n    return result;\n  };\n}\n\nfunction expensiveSquare(n) {\n  console.log('computing for', n);\n  return n * n;\n}\n\nconst fastSquare = memoize(expensiveSquare);\nconsole.log(fastSquare(5));\nconsole.log(fastSquare(5));\nconsole.log(fastSquare(6));",
        explanation: "'computing for 5' logs only once even though fastSquare(5) is called twice; the second call returns the cached result from the Map immediately.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Writing Production-Quality JavaScript Assessment",
    questions: [
      {
        question: "What is a sign that a script needs better organization?",
        options: [
          "It has more than one function",
          "It mixes multiple unrelated responsibilities together in one long, flat sequence of statements",
          "It has a main() function",
          "It uses arrow functions",
        ],
        correctAnswerIndex: 1,
        explanation: "Tangling unrelated concerns together in one flat block of code is a clear sign a script needs to be split into focused, named functions.",
      },
      {
        question: "What is the benefit of a single main() entry-point function calling smaller functions in order?",
        options: [
          "It makes the script run in a separate thread",
          "The top-level flow becomes easy to read at a glance, like a summary of the script's steps",
          "It is required by JavaScript syntax",
          "It prevents any errors from occurring",
        ],
        correctAnswerIndex: 1,
        explanation: "Reading main() alone communicates the overall shape of the script without requiring the reader to dig through every implementation detail.",
      },
      {
        question: "What is a guard clause?",
        options: [
          "A type of loop",
          "A check at the top of a function that returns or throws immediately for an invalid condition, avoiding deep nesting",
          "A comment describing a function",
          "A way to disable error handling",
        ],
        correctAnswerIndex: 1,
        explanation: "A guard clause handles the invalid case immediately, keeping the rest of the function focused on the valid case.",
      },
      {
        question: "Why extend the built-in Error class with a custom error type?",
        options: [
          "It makes the code run faster",
          "It lets calling code distinguish specific kinds of failure with instanceof, instead of parsing error message strings",
          "It is required for throw statements to work",
          "It hides the error from being logged",
        ],
        correctAnswerIndex: 1,
        explanation: "A custom Error subclass gives calling code a reliable, structured way to check exactly which kind of failure occurred.",
      },
      {
        question: "What must be called as the first line inside a custom Error subclass's constructor?",
        options: ["this.message = message", "super(message)", "Error.init(message)", "new Error(message)"],
        correctAnswerIndex: 1,
        explanation: "super(message) must run first to correctly initialize the built-in Error behavior, including the message and stack trace.",
      },
      {
        question: "What does 'failing fast' mean in defensive error handling?",
        options: [
          "Making the whole program run faster",
          "Validating inputs early and throwing a clear error immediately, instead of letting bad data cause a confusing failure later",
          "Catching every possible error with one generic catch block",
          "Avoiding all error handling entirely",
        ],
        correctAnswerIndex: 1,
        explanation: "Failing fast rejects invalid input right at the boundary, with a clear error, rather than letting it silently propagate deeper into the program.",
      },
      {
        question: "What is a common performance mistake involving loops?",
        options: [
          "Declaring loop variables with let",
          "Recomputing an unchanging value on every iteration instead of computing it once outside the loop",
          "Using array methods like map() and filter()",
          "Logging inside a loop",
        ],
        correctAnswerIndex: 1,
        explanation: "Recomputing a value that doesn't change between iterations wastes repeated work that could have been done once, outside the loop.",
      },
      {
        question: "What does memoization do?",
        options: [
          "It deletes a function's cache after every call",
          "It caches a function's result for a given argument so a repeated call with that same argument returns instantly instead of recomputing",
          "It converts synchronous code into asynchronous code",
          "It prevents a function from accepting arguments",
        ],
        correctAnswerIndex: 1,
        explanation: "Memoization stores previously computed results keyed by argument, avoiding redundant recomputation on repeated calls with the same input.",
      },
      {
        question: "Why is memoizing a function that depends on external, changing state (like the current time) risky?",
        options: [
          "It isn't risky at all",
          "The cache assumes the same arguments always produce the same output, so it can return stale or incorrect results if the output also depends on something that changes",
          "Memoization only works on functions with no arguments",
          "It permanently disables the function",
        ],
        correctAnswerIndex: 1,
        explanation: "Memoization only makes sense for functions whose output depends solely on their arguments; caching a function influenced by external state can return outdated results.",
      },
      {
        question: "What does TypeScript add on top of well-organized, defensively-written JavaScript?",
        options: [
          "A completely different runtime unrelated to JavaScript",
          "A static type layer that catches many input and usage mistakes at compile time instead of only at runtime",
          "Automatic performance optimization with no code changes required",
          "A replacement for guard clauses and custom error classes, making them unnecessary",
        ],
        correctAnswerIndex: 1,
        explanation: "TypeScript layers static type checking on top of JavaScript, catching many of the same kinds of mistakes this module's guard clauses handle, but before the code ever runs.",
      },
    ],
  },
  assignment:
    "Build a 'Validated Order Processor': organize a script with clearly separated functions, one that generates a list of sample order objects, one that validates a single order, checking it has a positive numeric amount and a non-empty customerName, throwing a custom ValidationError extends Error with a clear message if not, and one that formats a valid order into a readable summary string. Write a single main() function that processes an array of sample orders, including at least one deliberately invalid order, using try/catch around each order to log either its formatted summary or a caught validation error message, and call main() exactly once at the bottom of the file.",
  assignmentDeliverables: [
    "script.js organized into single-responsibility functions plus a ValidationError class and a single main() entry point",
    "Printed output showing successfully processed orders and at least one caught validation error, each clearly labeled",
  ],
  assignmentAssessmentCriteria: [
    "The script is organized into clearly separated, single-responsibility functions rather than one flat sequence",
    "Invalid orders are caught using a custom ValidationError distinguished with instanceof, not a generic, unidentified error",
  ],
  miniProject:
    "Build a 'Performance Toolkit Report' combining this module's ideas: a memoize(fn) helper used to cache an expensive-looking calculation function, a before-and-after performance.now() comparison showing a loop refactored to avoid recomputing an unchanging value, and a custom error class used with a guard clause in at least one validation function, all organized into clearly named functions with a single main() entry point that runs everything in order and prints a short labeled summary report combining the results of all three techniques. Add a short code comment at the end explaining, in your own words, one specific thing TypeScript would have caught earlier than this JavaScript version could.",
  miniProjectDeliverables: [
    "script.js combining memoization, a loop performance comparison, and guard-clause validation with a custom error class, run from a single main() entry point",
    "Printed summary report showing the results of all three techniques, plus a closing comment about what TypeScript would add",
  ],
  miniProjectAssessmentCriteria: [
    "memoize() correctly caches results and the loop comparison correctly demonstrates reduced redundant work",
    "The script is organized into single-responsibility functions run from one main() entry point, and correctly uses a custom error class with a guard clause",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
