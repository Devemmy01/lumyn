import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module1: GeneratedModule = {
  title: "Closures & the Module Pattern",
  description:
    "Understand how JavaScript functions capture their surrounding scope, use that mechanism to build private, persistent state with closures and IIFEs, then combine both into the module pattern developers relied on for encapsulation before ES6 classes existed.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Closures Deeply: How Functions Remember Their Scope",
      goal: "Understand what a closure is, how JavaScript functions capture variables from their enclosing scope, and use that to build a function factory with independent, persistent state.",
      videoTitle: "JavaScript Closures Explained",
      videoSearchQuery: "javascript closures explained deep dive tutorial",
      videoLearningGoal: "See a function defined inside another function keep access to that outer function's variables long after the outer function has finished running, and watch separate calls produce independent closures.",
      recommendedChannels: ["Fireship", "Web Dev Simplified"],
      keyTakeaways: [
        "A closure forms whenever a function is defined inside another function and references variables from that outer function's scope; the inner function keeps a live link to those variables even after the outer function returns.",
        "Each call to the outer function creates a brand new scope, so closures created from separate calls never share state with each other.",
        "Closures are what let a factory function like makeCounter() hand out functions that each track their own private, persistent value between calls.",
      ],
      notes:
        "JavaScript functions don't just carry around their code; they carry a live link to the scope they were defined in. That combination is called a closure, and it's the mechanism behind private state, callback configuration, and memoization throughout the language.",
      conceptExplanation:
        "function makeCounter() { let count = 0; return function () { count += 1; return count; }; } const counterA = makeCounter(); const counterB = makeCounter(); calling counterA() twice and counterB() once shows they never interfere: each call to makeCounter() creates a fresh count variable and a fresh inner function bound to it. The inner function doesn't copy count's value when it's returned; it keeps a live reference, so later calls see updates made by earlier calls through that same closure.",
      whyItMatters:
        "Closures are the mechanism behind private counters, memoized calculations, configured event handlers, and once-only initialization; recognizing this pattern turns what looks like unpredictable behavior into a simple, consistent rule about scope.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Write a function makeCounter() that declares a local count variable starting at 0 and returns a function which increments count by 1 and returns the new value each time it's called. Create two separate counters, counterA and counterB, by calling makeCounter() twice. Call counterA three times and counterB once, logging each result with console.log(), and confirm the two counters track completely independent values.",
      challenge:
        "Modify makeCounter() to accept a starting value as a parameter, defaulting to 0, and add a second returned function, reset, that sets count back to that starting value. Return both functions from makeCounter() as an object with increment and reset keys, and demonstrate resetting a counter partway through a sequence of increments.",
      expectedResult:
        "counterA's logged sequence shows 1, 2, 3 in order, while counterB's logged sequence independently shows 1, proving the two closures never share the count variable.",
      tests: [
        "makeCounter() returns a function that increments and returns a count starting from 1",
        "Two separately created counters maintain independent counts that do not affect each other",
      ],
      hint: "Each call to makeCounter() runs the function body again, which creates a brand new count variable in a brand new scope; the returned function is permanently linked to that specific scope, not to any other call's scope.",
      lessonAssessment: [
        {
          question: "What is required for a closure to form in JavaScript?",
          options: [
            "A function must be declared with the function keyword",
            "A function must be defined inside another function and reference a variable from that outer function's scope",
            "A function must be called immediately after it is defined",
            "A function must return a number",
          ],
          correctAnswerIndex: 1,
          explanation: "A closure forms when an inner function references variables from its enclosing function's scope, keeping access to them after the outer function finishes.",
        },
        {
          question: "If makeCounter() is called twice to create counterA and counterB, why do they track separate counts?",
          options: [
            "Because JavaScript copies the count value into each returned function",
            "Because each call to makeCounter() creates its own new scope with its own count variable",
            "Because counters are automatically reset after every call",
            "Because count is a global variable shared by convention",
          ],
          correctAnswerIndex: 1,
          explanation: "Every call to makeCounter() executes the function body again, creating a fresh, independent scope and its own count variable for that call's returned closure.",
        },
      ],
      commonMistakes: [
        "Assuming a variable captured by a closure is copied at the moment the inner function is created, when it's actually a live reference that reflects later changes.",
        "Declaring the counter variable outside any function, at the top level, which makes it a shared value instead of giving each factory call independent state.",
      ],
      deliverables: ["script.js defining a makeCounter() closure and demonstrating at least two independent counters"],
      assessmentCriteria: [
        "makeCounter() correctly returns a function that increments and returns a persistent count",
        "Two separately created counters are shown to maintain independent state",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'function makeCounter() {\n  let count = 0;\n  return function () {\n    count += 1;\n    return count;\n  };\n}\n\nconst counterA = makeCounter();\nconst counterB = makeCounter();\n\nconsole.log(counterA()); // 1\nconsole.log(counterA()); // 2\nconsole.log(counterB()); // 1',
        explanation: "counterA and counterB each close over their own separate count variable created by a separate call to makeCounter(), so incrementing one never affects the other.",
      },
      completionStatus: "not_started",
    },
    {
      title: "IIFEs: Immediately Invoked Function Expressions",
      goal: "Understand what an IIFE is, why it was used to avoid polluting the shared scope, and write one that returns a value from a self-contained block of setup code.",
      videoTitle: "JavaScript IIFE (Immediately Invoked Function Expressions) Explained",
      videoSearchQuery: "javascript iife immediately invoked function expression tutorial",
      videoLearningGoal: "See a function expression wrapped in parentheses and called immediately, and understand why this pattern was the standard way to create an isolated scope before block-scoped let and const, and before ES modules.",
      recommendedChannels: ["Web Dev Simplified", "Fireship"],
      keyTakeaways: [
        "An IIFE (Immediately Invoked Function Expression) is a function that is defined and called in the same statement, usually written as (function () { ... })().",
        "Wrapping code in an IIFE creates a private scope, so any variables declared inside it never leak into the surrounding scope.",
        "IIFEs were the standard way to isolate setup code and avoid naming collisions before block-scoped let/const and ES modules existed, and the pattern still appears in bundler output and some library code today.",
      ],
      notes:
        "Before let and const gave JavaScript real block scoping, and before ES modules gave files their own private scope, wrapping code in a function was the only reliable way to keep variables from leaking into the shared scope. Calling that function immediately, right where it's defined, is the IIFE pattern.",
      conceptExplanation:
        "(function () { const secret = 'hidden'; console.log(secret); })(); runs immediately, and secret never exists outside those parentheses. The outer parentheses around the function are necessary because JavaScript would otherwise try to parse a leading function keyword as a function declaration, which requires a name and can't be called inline; wrapping it in parentheses turns it into a function expression instead, which can be invoked immediately with a trailing pair of call parentheses. An IIFE can also hand its result straight to a variable: const result = (function () { return 2 + 2; })();",
      whyItMatters:
        "IIFEs demonstrate that scope isolation in JavaScript has always been solvable with plain functions, which is exactly the tool the module pattern in the next lesson builds on to simulate private state.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Write an IIFE that declares a few local variables representing configuration values (for example apiRetries and timeoutMs), computes a single summary object from them, and immediately logs that summary with console.log(). Then attempt to log one of the variables declared inside the IIFE from outside it, wrapped in a try/catch, and log the caught error's message to confirm the variable is not accessible outside the IIFE.",
      challenge:
        "Rewrite your IIFE using arrow function syntax, (() => { ... })(), and in a comment note any difference in behavior you'd need to be careful about if the IIFE's body used the this keyword.",
      expectedResult:
        "The summary object logs correctly from inside the IIFE, and the attempt to access a variable declared inside it from the outer scope throws a ReferenceError that your catch block reports.",
      tests: [
        "An IIFE is written using the (function () { ... })() pattern and executes immediately without a separate call",
        "A variable declared inside the IIFE is confirmed inaccessible from the surrounding scope",
      ],
      hint: "The parentheses wrapping the function are what turn it into an expression instead of a declaration; without them, function () { ... }() is a syntax error.",
      lessonAssessment: [
        {
          question: "What does IIFE stand for, and what does it describe?",
          options: [
            "Internal Interface Function Expression; a function that exposes internal state",
            "Immediately Invoked Function Expression; a function that is defined and called in the same statement",
            "Isolated Instance Function Element; a class instantiation shortcut",
            "Inline Iterator Function Expression; a special kind of loop",
          ],
          correctAnswerIndex: 1,
          explanation: "IIFE stands for Immediately Invoked Function Expression, describing a function expression that runs the moment it is defined.",
        },
        {
          question: "Why are the outer parentheses required around (function () { ... })()?",
          options: [
            "They are purely stylistic and have no effect",
            "They turn what would otherwise be parsed as a function declaration into a function expression, which can be invoked immediately",
            "They make the function run faster",
            "They are required syntax for every function in JavaScript",
          ],
          correctAnswerIndex: 1,
          explanation: "Without the wrapping parentheses, JavaScript parses a leading function keyword as a declaration, which cannot be called inline; the parentheses force it to be treated as an expression instead.",
        },
      ],
      commonMistakes: [
        "Forgetting the parentheses around the function keyword, causing a syntax error because JavaScript tries to parse it as a named function declaration.",
        "Assuming variables declared inside an IIFE are still available afterward, when the whole point of the pattern is that they are scoped only to the IIFE itself.",
      ],
      deliverables: ["script.js containing an IIFE that computes and logs a summary value, plus a demonstrated ReferenceError for a variable scoped inside it"],
      assessmentCriteria: [
        "The IIFE executes immediately using the correct syntax",
        "A variable declared inside the IIFE is correctly shown to be inaccessible outside it",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "15 to 20 minutes",
      codeExample: {
        language: "javascript",
        code: "const summary = (function () {\n  const apiRetries = 3;\n  const timeoutMs = 5000;\n  return { apiRetries, timeoutMs, label: `${apiRetries} retries, ${timeoutMs}ms timeout` };\n})();\n\nconsole.log(summary);\n\ntry {\n  console.log(apiRetries);\n} catch (error) {\n  console.log('Caught:', error.message);\n}",
        explanation: "The IIFE runs immediately and returns a summary object; apiRetries itself never escapes the IIFE's scope, so referencing it afterward throws a ReferenceError.",
      },
      completionStatus: "not_started",
    },
    {
      title: "The Module Pattern: Simulating Private State Before Classes",
      goal: "Combine closures and an IIFE into the module pattern, exposing a controlled public interface while keeping internal state genuinely private.",
      videoTitle: "JavaScript Module Pattern Explained",
      videoSearchQuery: "javascript module pattern private state tutorial",
      videoLearningGoal: "See an IIFE return an object of public methods that close over private variables no outside code can reach directly, the technique developers used for private state before ES6 classes and native private class fields existed.",
      recommendedChannels: ["Fireship", "Jack Herrington"],
      keyTakeaways: [
        "The module pattern wraps related state and behavior in an IIFE, keeping variables private and returning only the specific functions meant to be public.",
        "Because the returned public functions are closures, they can still read and modify the private variables even though outside code cannot reach those variables directly.",
        "This pattern was how JavaScript simulated private fields and encapsulation before ES6 classes, and later true private class fields, existed natively.",
      ],
      notes:
        "Combine what you've learned: wrap state-holding variables and the functions that manage them inside an IIFE, then return only the functions meant to be used from outside. Everything not returned stays completely inaccessible, a deliberate form of encapsulation built entirely from scope rules.",
      conceptExplanation:
        "const bankAccount = (function () { let balance = 0; function deposit(amount) { balance += amount; return balance; } function withdraw(amount) { if (amount > balance) throw new Error('Insufficient funds'); balance -= amount; return balance; } function getBalance() { return balance; } return { deposit, withdraw, getBalance }; })(); balance itself is never returned or exposed; only deposit, withdraw, and getBalance are, and each of those closures can read and modify balance because they were defined in the same scope. Calling code can never reach in and overwrite balance directly, because there is no such property on the returned object; it can only interact through the methods the module chose to expose.",
      whyItMatters:
        "This is the same encapsulation idea behind private class fields, just built from first principles with closures and scope, and recognizing the module pattern helps you read a lot of pre-ES6 and even some modern library source code.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Build a bankAccount module using the pattern shown: a private balance variable, and public deposit(amount), withdraw(amount), and getBalance() functions returned from an IIFE. withdraw should throw an Error if the requested amount is greater than the current balance. Demonstrate depositing and withdrawing several amounts, logging the balance after each operation, and attempt to withdraw more than the balance, catching and logging the resulting error.",
      challenge:
        "Extend the module to also return a getHistory() function that returns a copy, not the live array, of every transaction as objects like { type: 'deposit', amount: 50 }, recorded privately inside the module every time deposit or withdraw succeeds.",
      expectedResult:
        "Each deposit and withdrawal logs the correct updated balance, and attempting to overdraw the account is caught and logged as an error rather than allowed to silently succeed or crash the script.",
      tests: [
        "The module's private balance variable cannot be accessed or modified directly from outside the returned object",
        "withdraw() correctly throws an Error when the requested amount exceeds the current balance",
      ],
      hint: "Only include the functions you want to be public in the object literal you return from the IIFE; anything not returned effectively becomes private.",
      lessonAssessment: [
        {
          question: "In the module pattern, how is a variable made 'private'?",
          options: [
            "By naming it with an underscore prefix",
            "By declaring it inside the IIFE's scope and never including it in the object the IIFE returns",
            "By marking it with the private keyword",
            "By declaring it with const instead of let",
          ],
          correctAnswerIndex: 1,
          explanation: "A variable becomes effectively private simply by never being exposed on the returned object; outside code has no way to reference it directly.",
        },
        {
          question: "Why can the returned deposit and withdraw functions still modify the private balance variable, even though outside code cannot?",
          options: [
            "Because balance is secretly still a global variable",
            "Because deposit and withdraw are closures defined in the same scope as balance, so they retain access to it",
            "Because JavaScript grants special access to functions returned from an IIFE",
            "They cannot actually modify it; each call creates a new balance",
          ],
          correctAnswerIndex: 1,
          explanation: "deposit and withdraw are closures formed in the same scope as balance, so they keep a live reference to it, while code outside the module never gets that reference.",
        },
      ],
      commonMistakes: [
        "Accidentally returning the private variable itself, or a direct reference to it, from the module, which defeats the whole purpose of encapsulation.",
        "Forgetting that a module built this way is typically a singleton, unlike a class, which can be instantiated many times; needing multiple independent instances calls for a factory function instead.",
      ],
      deliverables: ["script.js implementing a bankAccount module pattern with private balance and public deposit/withdraw/getBalance functions"],
      assessmentCriteria: [
        "Private state is genuinely inaccessible from outside the module",
        "withdraw() correctly rejects overdrafts by throwing a caught Error",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "javascript",
        code: "const bankAccount = (function () {\n  let balance = 0;\n\n  function deposit(amount) {\n    balance += amount;\n    return balance;\n  }\n\n  function withdraw(amount) {\n    if (amount > balance) throw new Error('Insufficient funds');\n    balance -= amount;\n    return balance;\n  }\n\n  function getBalance() {\n    return balance;\n  }\n\n  return { deposit, withdraw, getBalance };\n})();\n\nconsole.log(bankAccount.deposit(100));\nconsole.log(bankAccount.withdraw(30));\nconsole.log(bankAccount.balance);",
        explanation: "deposit and withdraw can read and change balance because they closed over it, but bankAccount.balance is undefined since balance was never returned from the IIFE.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Closures & the Module Pattern Assessment",
    questions: [
      {
        question: "What is a closure in JavaScript?",
        options: [
          "A function that has finished running and can no longer be called",
          "The combination of a function and the lexical scope it was defined in, which it keeps access to even after that scope has finished executing",
          "A special kind of loop for iterating over arrays",
          "A syntax error caused by an unclosed bracket",
        ],
        correctAnswerIndex: 1,
        explanation: "A closure is a function bundled with a live reference to the scope it was created in, which it can still access after that outer scope returns.",
      },
      {
        question: "Why do counterA and counterB from two separate calls to makeCounter() track independent counts?",
        options: [
          "Because count is declared with const",
          "Because each call to makeCounter() creates a new, separate scope with its own count variable",
          "Because JavaScript automatically resets shared variables between function calls",
          "They don't; they actually share the same count",
        ],
        correctAnswerIndex: 1,
        explanation: "Each invocation of the outer function produces a fresh scope, so closures from separate calls never share state.",
      },
      {
        question: "What does IIFE stand for?",
        options: ["Internal Interface Function Expression", "Immediately Invoked Function Expression", "Isolated Instance Function Element", "Inline Iterator Function Expression"],
        correctAnswerIndex: 1,
        explanation: "IIFE stands for Immediately Invoked Function Expression: a function defined and called in the same statement.",
      },
      {
        question: "Why must (function () { ... })() be wrapped in parentheses?",
        options: [
          "It's purely stylistic",
          "Without them, JavaScript parses the leading function keyword as a declaration, which cannot be invoked inline",
          "Parentheses make the function execute faster",
          "It's required by every function definition in JavaScript",
        ],
        correctAnswerIndex: 1,
        explanation: "The parentheses convert what would be a function declaration into a function expression, which can then be called immediately.",
      },
      {
        question: "What problem did IIFEs primarily solve before block-scoped let/const and ES modules existed?",
        options: [
          "They made code run in parallel",
          "They created a private scope, preventing variables from leaking into and colliding with the shared surrounding scope",
          "They allowed classes to inherit from multiple parents",
          "They replaced the need for functions entirely",
        ],
        correctAnswerIndex: 1,
        explanation: "IIFEs isolated variables inside their own scope, avoiding naming collisions in the shared scope that was otherwise available.",
      },
      {
        question: "In the module pattern, how is a variable made effectively private?",
        options: [
          "By prefixing its name with an underscore",
          "By declaring it inside the IIFE's scope and never including it in the returned object",
          "By using the private keyword",
          "By declaring it with var instead of let",
        ],
        correctAnswerIndex: 1,
        explanation: "A variable is private simply because it is never exposed on the object the module returns; there's no other way for outside code to reach it.",
      },
      {
        question: "Why can public functions returned from a module still read and modify a private variable that outside code cannot access?",
        options: [
          "Because the private variable is secretly global",
          "Because those functions are closures formed in the same scope as the private variable",
          "Because JavaScript grants special permissions to IIFE return values",
          "They cannot; each call creates an entirely new private variable",
        ],
        correctAnswerIndex: 1,
        explanation: "The public functions close over the same scope as the private variable, keeping a live reference to it that outside code never receives.",
      },
      {
        question: "What is a common mistake that breaks encapsulation in the module pattern?",
        options: [
          "Only returning the functions meant to be public",
          "Accidentally returning the private variable itself, or a direct reference to it, from the module",
          "Declaring private state with let inside the IIFE",
          "Throwing an Error for invalid input inside a public method",
        ],
        correctAnswerIndex: 1,
        explanation: "Exposing the private variable directly, even by accident, defeats the purpose of wrapping it in a module in the first place.",
      },
      {
        question: "A module built with the IIFE pattern shown in this module's lessons is typically what kind of structure?",
        options: [
          "A reusable class that can be instantiated many times",
          "A singleton: a single, shared object created once when the IIFE runs",
          "A generator function",
          "An array of independent private variables",
        ],
        correctAnswerIndex: 1,
        explanation: "Because the IIFE only runs once, the module pattern as shown produces one shared object rather than something you can instantiate repeatedly like a class.",
      },
      {
        question: "What does a closure keep a reference to: a copy of a variable's value, or the variable itself?",
        options: [
          "A copy of the value at the moment the closure was created",
          "The variable itself, so later changes to it are visible the next time the closure runs",
          "Neither; closures cannot reference outer variables at all",
          "A copy that updates once per second automatically",
        ],
        correctAnswerIndex: 1,
        explanation: "A closure holds a live reference to the actual variable, not a snapshot, which is why repeated calls can see updates made by earlier calls.",
      },
    ],
  },
  assignment:
    "Build a 'Settings Manager' module using the module pattern: private variables for at least three settings (for example theme, volume, and notificationsEnabled), plus public functions getSetting(key), updateSetting(key, value) that validates the new value against a reasonable rule you choose for each setting (for example volume must be a number between 0 and 100), and getAllSettings() that returns a fresh plain object copy of all current settings. Demonstrate reading settings, making at least two valid updates, and attempting one invalid update that updateSetting() rejects, caught and logged rather than silently accepted.",
  assignmentDeliverables: [
    "script.js implementing a Settings Manager module using the module pattern with private state",
    "Printed output showing successful setting reads, valid updates, and one caught invalid update",
  ],
  assignmentAssessmentCriteria: [
    "Settings are stored as private state, inaccessible directly from outside the module",
    "updateSetting() correctly validates input and rejects invalid values with a clear error",
  ],
  miniProject:
    "Build a 'Todo List' module using the module pattern: a private array of todo objects, each with id, text, and done fields, plus public functions addTodo(text), completeTodo(id), removeTodo(id), and getTodos() that returns a fresh copy of the current list rather than the live private array. Demonstrate adding at least four todos, completing two, removing one, and logging the final list, then confirm that mutating the array returned by getTodos() does not affect the module's internal state.",
  miniProjectDeliverables: [
    "script.js implementing a Todo List module using the module pattern with private state",
    "Printed output demonstrating adding, completing, and removing todos, plus proof that the returned list is a copy rather than the live internal array",
  ],
  miniProjectAssessmentCriteria: [
    "Todos are stored as private state and only modified through the module's public functions",
    "getTodos() returns a copy, verified by showing that mutating the returned array does not change the module's internal state",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
