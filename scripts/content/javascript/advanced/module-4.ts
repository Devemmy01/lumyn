import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace. Use small delay values so runs finish quickly.";

export const module4: GeneratedModule = {
  title: "Asynchronous JavaScript: Promises & Async/Await",
  description:
    "Build a solid, practical grasp of asynchronous JavaScript: constructing and chaining Promises by hand, coordinating multiple Promises with Promise.all and Promise.race, and writing that same logic as clean, linear async/await code with proper try/catch error handling.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Building and Chaining Promises",
      goal: "Understand the three states of a Promise, construct one with the Promise constructor, and chain .then()/.catch() calls correctly.",
      videoTitle: "JavaScript Promises Explained",
      videoSearchQuery: "javascript promises explained construct then catch tutorial",
      videoLearningGoal: "See a Promise constructed with resolve and reject, and a chain of .then() calls each transforming the result of the previous one.",
      recommendedChannels: ["Fireship", "Web Dev Simplified"],
      keyTakeaways: [
        "A Promise represents a value that may not be available yet; it is always in one of three states: pending, fulfilled, or rejected.",
        "new Promise((resolve, reject) => { ... }) lets you wrap asynchronous work, like a setTimeout-based delay, so calling code can react to its eventual result with .then() and .catch().",
        "Each .then() returns a brand new Promise, which is what makes chaining reliable: returning a plain value or another Promise from inside a .then() callback correctly passes it along to the next .then() in the chain.",
      ],
      notes:
        "setTimeout alone gives you a callback-based way to delay work, but no clean way to react to success versus failure, or to chain multiple delayed steps together. Promises solve exactly that problem.",
      conceptExplanation:
        "function delay(ms, value) { return new Promise((resolve) => { setTimeout(() => resolve(value), ms); }); } delay(500, 'first').then((result) => { console.log(result); return delay(500, 'second'); }).then((result) => { console.log(result); }).catch((error) => { console.log('Something failed:', error); }); Each .then() callback's return value becomes what the next .then() receives; returning another Promise, like the second delay() call, makes the chain wait for it to settle before continuing.",
      whyItMatters:
        "Promises are the foundation every other async tool in JavaScript, including async/await, is built on top of; understanding construction and chaining makes every later async pattern make sense instead of feeling like magic.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Write a delay(ms, value) helper function using new Promise and setTimeout that resolves with value after ms milliseconds. Chain at least three .then() calls: the first two logging a message and returning another delay() call, and the final one logging a completion message. Add a .catch() at the end. Then write a second Promise chain, using new Promise((resolve, reject) => ...) with a reject(...) call inside a setTimeout, wire a .catch() to log the rejection reason, and confirm none of that chain's .then() callbacks run.",
      challenge:
        "Add a .finally() to one of your chains that logs a message regardless of whether the Promise resolved or rejected, and confirm it runs in both the success and the failure case.",
      expectedResult:
        "The success chain logs each step in order with a delay between them, and the failure chain's .catch() correctly logs the rejection reason without running any of that chain's .then() callbacks.",
      tests: [
        "delay() correctly returns a Promise that resolves with the given value after the specified delay",
        "A chain of at least three .then() calls executes in the correct order, and a rejected Promise is correctly caught by .catch()",
      ],
      hint: "Returning a Promise from inside a .then() callback makes the next .then() in the chain wait for that returned Promise to settle before running; returning a plain value passes it along immediately instead.",
      lessonAssessment: [
        {
          question: "What are the three possible states of a Promise?",
          options: ["Started, running, finished", "Pending, fulfilled, rejected", "Waiting, success, failure", "Open, closed, cancelled"],
          correctAnswerIndex: 1,
          explanation: "A Promise is always pending, fulfilled (resolved), or rejected; once fulfilled or rejected, it can never change state again.",
        },
        {
          question: "What happens when a .then() callback returns another Promise?",
          options: [
            "The chain immediately continues without waiting for it",
            "The next .then() in the chain waits for that returned Promise to settle before running, then receives its resolved value",
            "It causes an error, since .then() callbacks must return plain values",
            "The returned Promise is silently ignored",
          ],
          correctAnswerIndex: 1,
          explanation: "Returning a Promise from inside a .then() callback makes the chain flatten into it, waiting for it to settle before continuing.",
        },
      ],
      commonMistakes: [
        "Forgetting to return the value or Promise inside a .then() callback, which causes the next .then() in the chain to receive undefined instead of the intended result.",
        "Placing .catch() in the middle of a chain and assuming the chain stops there entirely, when in fact once .catch() handles an error, execution continues normally into whatever .then() comes right after it.",
      ],
      deliverables: ["script.js with a delay() Promise helper, a chained success example, and a chained rejection example handled with .catch()"],
      assessmentCriteria: [
        "delay() correctly wraps setTimeout in a Promise that resolves with the given value",
        "The chained .then() calls execute in the correct order, and the rejection example is correctly caught",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: "function delay(ms, value) {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve(value), ms);\n  });\n}\n\ndelay(200, 'first')\n  .then((result) => {\n    console.log(result);\n    return delay(200, 'second');\n  })\n  .then((result) => {\n    console.log(result);\n    return 'done';\n  })\n  .then((result) => console.log(result))\n  .catch((error) => console.log('Failed:', error));",
        explanation: "Each .then() returns a value or a Promise that the next .then() waits for, chaining three sequential delayed steps together in order.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Promise.all and Promise.race for Coordinating Multiple Promises",
      goal: "Use Promise.all() to run multiple promises concurrently and wait for all of them, and Promise.race() to react to whichever settles first, including implementing a timeout.",
      videoTitle: "JavaScript Promise.all and Promise.race Explained",
      videoSearchQuery: "javascript promise.all promise.race tutorial",
      videoLearningGoal: "See Promise.all() run several delayed operations concurrently and resolve once all finish, and Promise.race() settle based on whichever of several promises finishes first, including a timeout example.",
      recommendedChannels: ["Web Dev Simplified", "Theo - t3.gg"],
      keyTakeaways: [
        "Promise.all(promises) takes an array of promises, runs them concurrently, and resolves with an array of all their results, in the original order, once every one of them has resolved.",
        "If any promise passed to Promise.all() rejects, the whole Promise.all() immediately rejects with that reason, even if other promises in the array are still pending.",
        "Promise.race(promises) settles as soon as the first of the given promises settles, whether it resolves or rejects, which makes it useful for implementing a timeout against a slower operation.",
      ],
      notes:
        "Awaiting several independent async operations one after another wastes time when they could run concurrently instead. Promise.all() and Promise.race() coordinate multiple promises at once, each in a different way.",
      conceptExplanation:
        "const results = await Promise.all([delay(300, 'a'), delay(100, 'b'), delay(200, 'c')]); results is ['a', 'b', 'c'], in the original order, even though 'b' actually finishes first internally, because Promise.all() preserves order based on position in the input array, not completion order. For a timeout, Promise.race([actualWork(), delay(2000, 'TIMEOUT')]) resolves with whichever finishes first: the real result, or the timeout marker after 2 seconds, letting you detect and react to slow operations.",
      whyItMatters:
        "Promise.all() is how real programs fetch multiple independent pieces of data concurrently instead of wastefully waiting for each one in turn, and Promise.race() is the standard building block for implementing timeouts around slow or unreliable async work.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Using your delay(ms, value) helper from the previous lesson, create three delayed promises with different delays and values, pass them to Promise.all(), and log the resulting array, confirming the results come back in the original order regardless of which delay was shortest. Then build a simulated timeout using Promise.race([delay(1500, 'RESULT'), delay(500, 'TIMEOUT')]), log the result, and confirm 'TIMEOUT' wins because its delay is shorter.",
      challenge:
        "Add a fourth promise to your Promise.all() array that calls reject instead of resolve, and confirm with a .catch() that the entire Promise.all() call rejects immediately with that reason, rather than waiting for the other promises to finish.",
      expectedResult:
        "Promise.all() logs an array of all three results in their original order, and the Promise.race() timeout example logs 'TIMEOUT' since its delay was shorter than the simulated real work.",
      tests: [
        "Promise.all() correctly combines multiple delayed promises into a single array of results, in original order",
        "Promise.race() correctly settles based on whichever promise finishes first, demonstrated with a timeout example",
      ],
      hint: "Promise.all() and Promise.race() both accept a plain array of promises; the order of the resulting array from Promise.all() always matches the order of the input array, not the order the promises actually finished in.",
      lessonAssessment: [
        {
          question: "What does Promise.all() do if any one of its promises rejects?",
          options: [
            "It waits for every other promise to finish before doing anything",
            "The whole Promise.all() call immediately rejects with that rejection reason",
            "It silently skips the rejected promise and continues",
            "It retries the rejected promise automatically",
          ],
          correctAnswerIndex: 1,
          explanation: "A single rejection anywhere in the array causes Promise.all() to reject immediately, without waiting for the remaining promises.",
        },
        {
          question: "What determines the order of the array Promise.all() resolves with?",
          options: [
            "The order the promises actually finished in",
            "The order they appear in the original input array, regardless of completion order",
            "Alphabetical order of their resolved values",
            "A random order each time it runs",
          ],
          correctAnswerIndex: 1,
          explanation: "Promise.all() always preserves the original input array's order in its resolved results array, no matter which promise actually settles first.",
        },
      ],
      commonMistakes: [
        "Awaiting several promises one at a time with separate await statements when they could run concurrently with Promise.all(), unnecessarily slowing the program down.",
        "Assuming Promise.all() resolves with results in the order the promises finished, when it actually always preserves the original order of the input array.",
      ],
      deliverables: ["script.js demonstrating Promise.all() combining three delayed results and Promise.race() implementing a timeout"],
      assessmentCriteria: [
        "Promise.all() correctly returns results in the original input order",
        "Promise.race() correctly demonstrates a timeout scenario where the shorter delay wins",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: "function delay(ms, value) {\n  return new Promise((resolve) => setTimeout(() => resolve(value), ms));\n}\n\nPromise.all([delay(300, 'a'), delay(100, 'b'), delay(200, 'c')]).then((results) => {\n  console.log(results);\n});\n\nPromise.race([delay(1500, 'RESULT'), delay(500, 'TIMEOUT')]).then((winner) => {\n  console.log(winner);\n});",
        explanation: "Promise.all() logs ['a', 'b', 'c'] in original order despite 'b' finishing first internally; Promise.race() logs 'TIMEOUT' since its 500ms delay beats the 1500ms simulated work.",
      },
      completionStatus: "not_started",
    },
    {
      title: "async/await and Error Handling with try/catch",
      goal: "Rewrite Promise chains using async/await syntax, and correctly handle errors with try/catch around await expressions.",
      videoTitle: "JavaScript async/await and try/catch Error Handling",
      videoSearchQuery: "javascript async await try catch error handling tutorial",
      videoLearningGoal: "See a Promise chain rewritten as a linear-looking async function using await, and see try/catch correctly catch a rejected awaited promise.",
      recommendedChannels: ["Fireship", "Web Dev Simplified"],
      keyTakeaways: [
        "An async function always returns a Promise; the await keyword, usable only inside an async function, pauses that function until the awaited Promise settles, then unwraps its resolved value.",
        "Wrapping one or more await expressions in a try/catch block catches a rejected promise the same way it would catch a thrown error, letting async code use familiar synchronous-looking error handling.",
        "async/await doesn't replace Promises, it's built directly on top of them; understanding the underlying Promise chain from earlier lessons is what makes async/await's behavior predictable rather than mysterious.",
      ],
      notes:
        "async/await is syntax sugar over Promises that lets asynchronous code read top-to-bottom like ordinary synchronous code, without changing anything about how Promises actually behave underneath.",
      conceptExplanation:
        "async function loadProfile() { try { const user = await delay(300, { id: 1, name: 'Amara' }); const posts = await delay(300, [`${user.name}'s first post`]); return { user, posts }; } catch (error) { console.log('Failed to load profile:', error.message); throw error; } } is the exact same logic as a chained .then()/.catch() version, just written linearly. Each await pauses loadProfile() until that specific Promise settles; if it rejects, control jumps immediately to the catch block, skipping any remaining code in the try block.",
      whyItMatters:
        "async/await is how the overwhelming majority of real-world asynchronous JavaScript is written today, since it's dramatically easier to read, debug, and reason about than long .then() chains, especially once multiple sequential steps are involved.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Using your delay(ms, value) helper, write an async function loadProfile() that awaits a simulated user object and then a simulated list of posts, each behind a separate delay() call, wrapped in a try/catch, returning a combined object on success and logging a clear message on failure. Call loadProfile() from inside another async function (or with .then()) and log its resolved result. Then modify the posts delay so it calls Promise.reject() instead of resolving, and confirm your catch block correctly logs the failure without crashing the script.",
      challenge:
        "Rewrite the entire loadProfile() function as a plain Promise chain, without async/await, producing identical behavior, and compare both versions with a comment noting which one reads more clearly to you and why.",
      expectedResult:
        "The success case logs a correctly combined profile object, and the failure case's catch block correctly logs the error message instead of letting an unhandled rejection crash the script.",
      tests: [
        "loadProfile() correctly uses async/await with sequential await calls",
        "A rejected awaited Promise is correctly caught by a try/catch block inside the async function",
      ],
      hint: "await only works inside a function declared async; wrapping your async logic in an async function and calling it is the most reliable pattern across script contexts.",
      lessonAssessment: [
        {
          question: "What does an async function always return?",
          options: ["The raw value computed inside it", "A Promise", "undefined unless it has an explicit return", "An array of every awaited value"],
          correctAnswerIndex: 1,
          explanation: "Every async function implicitly wraps its result in a Promise, even if the function body returns a plain value.",
        },
        {
          question: "What happens to code inside a try block after an awaited Promise inside it rejects?",
          options: [
            "The remaining code in the try block continues running normally",
            "Control jumps immediately to the catch block, skipping the remaining code in the try block",
            "The whole script stops executing",
            "The rejection is silently ignored",
          ],
          correctAnswerIndex: 1,
          explanation: "A rejected awaited Promise behaves like a thrown error, immediately transferring control to the matching catch block.",
        },
      ],
      commonMistakes: [
        "Using await outside of a function declared async, which is a syntax error in most script contexts.",
        "Forgetting to wrap await expressions in try/catch, which lets a rejected Promise become an unhandled rejection instead of being handled gracefully.",
      ],
      deliverables: ["script.js with an async loadProfile() function using await and try/catch, demonstrated in both a success and a failure case"],
      assessmentCriteria: [
        "loadProfile() correctly uses sequential await expressions to simulate loading related data",
        "The failure case is correctly caught with try/catch instead of crashing the script",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "javascript",
        code: "function delay(ms, value, shouldReject = false) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => (shouldReject ? reject(new Error(value)) : resolve(value)), ms);\n  });\n}\n\nasync function loadProfile() {\n  try {\n    const user = await delay(200, { id: 1, name: 'Amara' });\n    const posts = await delay(200, [`${user.name}'s first post`]);\n    return { user, posts };\n  } catch (error) {\n    console.log('Failed to load profile:', error.message);\n    throw error;\n  }\n}\n\nasync function run() {\n  const profile = await loadProfile();\n  console.log(profile);\n}\n\nrun();",
        explanation: "loadProfile() reads top-to-bottom like synchronous code; each await pauses until its Promise settles, and the try/catch handles a rejection exactly like a thrown error.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Asynchronous JavaScript: Promises & Async/Await Assessment",
    questions: [
      {
        question: "What are the three possible states of a Promise?",
        options: ["Started, running, finished", "Pending, fulfilled, rejected", "Waiting, success, failure", "Open, closed, cancelled"],
        correctAnswerIndex: 1,
        explanation: "A Promise is always pending, fulfilled, or rejected, and once fulfilled or rejected it cannot change state again.",
      },
      {
        question: "What do the resolve and reject functions passed into a Promise constructor's executor do?",
        options: [
          "They log messages to the console",
          "They settle the Promise as fulfilled (resolve) or rejected (reject) with a given value or reason",
          "They pause the Promise indefinitely",
          "They are only used for debugging and have no real effect",
        ],
        correctAnswerIndex: 1,
        explanation: "Calling resolve or reject inside the executor function is what transitions the Promise out of the pending state.",
      },
      {
        question: "What happens when a .then() callback returns another Promise?",
        options: [
          "The chain ignores it and continues immediately",
          "The next .then() in the chain waits for that returned Promise to settle, then receives its resolved value",
          "It causes a syntax error",
          "The Promise is discarded silently",
        ],
        correctAnswerIndex: 1,
        explanation: "Returning a Promise from a .then() callback makes the chain wait for it to settle before continuing to the next step.",
      },
      {
        question: "What does Promise.all() do if any promise in its input array rejects?",
        options: [
          "It waits for every other promise before doing anything",
          "It immediately rejects with that reason, without waiting for the remaining promises",
          "It silently ignores the rejected promise",
          "It automatically retries the rejected promise",
        ],
        correctAnswerIndex: 1,
        explanation: "A single rejection anywhere in the array causes the whole Promise.all() call to reject immediately.",
      },
      {
        question: "In what order does Promise.all() return its results?",
        options: [
          "In the order the promises actually finished",
          "In the same order as the original input array, regardless of completion order",
          "In a random order",
          "Sorted by value",
        ],
        correctAnswerIndex: 1,
        explanation: "Promise.all() always preserves the input array's order in the results array it resolves with.",
      },
      {
        question: "What does Promise.race() do?",
        options: [
          "It runs promises one after another, never concurrently",
          "It settles as soon as the first of the given promises settles, whether it resolves or rejects",
          "It only works with exactly two promises",
          "It waits for every promise to finish before settling",
        ],
        correctAnswerIndex: 1,
        explanation: "Promise.race() settles based on whichever input promise finishes first, which is why it's commonly used to implement timeouts.",
      },
      {
        question: "What does an async function always return?",
        options: ["The raw computed value", "A Promise", "undefined, always", "An array"],
        correctAnswerIndex: 1,
        explanation: "Every async function implicitly returns a Promise, even when its body returns a plain value directly.",
      },
      {
        question: "Where can the await keyword be used?",
        options: ["Anywhere in any function", "Only inside a function declared async", "Only inside a .then() callback", "Only at the very top of a file"],
        correctAnswerIndex: 1,
        explanation: "await is only valid inside functions declared with the async keyword (with limited top-level exceptions in some environments).",
      },
      {
        question: "What happens when an awaited Promise inside a try block rejects?",
        options: [
          "The rest of the try block continues running normally",
          "Control jumps immediately to the matching catch block",
          "The whole program crashes immediately with no way to catch it",
          "It is silently ignored",
        ],
        correctAnswerIndex: 1,
        explanation: "A rejected awaited Promise behaves like a thrown error, transferring control to the catch block right away.",
      },
      {
        question: "What is the relationship between async/await and Promises?",
        options: [
          "They are unrelated, separate features",
          "async/await is syntax built directly on top of Promises, not a replacement for them",
          "async/await replaces Promises entirely and Promises are deprecated",
          "Promises can only be used inside async functions",
        ],
        correctAnswerIndex: 1,
        explanation: "async/await is syntactic sugar over Promises; every async function still returns a Promise, and await still works by waiting on Promise settlement.",
      },
    ],
  },
  assignment:
    "Build a 'Simulated API Client' using Promises and a delay() helper: write a function fetchUser(id) that returns a Promise resolving with a fake user object after a short delay, and a function fetchOrders(userId) that returns a Promise resolving with an array of fake order objects after a short delay. Chain fetchUser() and fetchOrders() together with .then() so the user's id from the first call is used to fetch their orders, logging a combined summary object at the end, and add a .catch() that logs a clear message if either step fails.",
  assignmentDeliverables: [
    "script.js with fetchUser() and fetchOrders() Promise-returning functions chained together with .then()",
    "Printed output showing the combined user and orders summary, plus a demonstrated .catch() handling a failure",
  ],
  assignmentAssessmentCriteria: [
    "fetchUser() and fetchOrders() are correctly implemented as Promise-returning functions using delay()-style simulated async work",
    "The chain correctly passes data from one step to the next and handles a rejection with .catch()",
  ],
  miniProject:
    "Rebuild the same simulated API client from this module's assignment using async/await instead of .then() chaining: an async function loadUserOrders(id) that awaits fetchUser(id) and then awaits fetchOrders() using the returned user's id, wrapped in try/catch, returning a combined summary object. Then write two more independent delay()-based functions, fetchNotifications() and fetchSettings(), and use Promise.all() to await both of them concurrently rather than one after another, logging the combined final result and a comment estimating how much longer it would have taken if they had been awaited sequentially instead.",
  miniProjectDeliverables: [
    "script.js with an async loadUserOrders(id) function using await and try/catch, matching the assignment's chained version's behavior",
    "script.js with a Promise.all()-based concurrent fetch of two independent simulated resources, plus a comment estimating the time saved versus sequential awaiting",
  ],
  miniProjectAssessmentCriteria: [
    "loadUserOrders() correctly uses async/await and try/catch to reproduce the assignment's chained logic",
    "Promise.all() is correctly used to run two independent simulated fetches concurrently rather than sequentially",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
