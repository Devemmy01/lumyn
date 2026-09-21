import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module5: GeneratedModule = {
  title: "Working with JSON & Asynchronous Basics",
  description:
    "Convert deeply nested data with JSON.stringify() and JSON.parse(), pass functions as callbacks to control order of execution, and take your first steps into asynchronous JavaScript with Promises, .then(), and .catch().",
  completionStatus: "locked",
  lessons: [
    {
      title: "JSON.stringify and JSON.parse: Deep Conversion with Nested Data",
      goal: "Convert between JavaScript objects or arrays and JSON text, including deeply nested structures, using JSON.stringify() and JSON.parse().",
      videoTitle: "JavaScript JSON.stringify and JSON.parse Tutorial",
      videoSearchQuery: "javascript json stringify parse tutorial nested objects",
      videoLearningGoal: "See a nested JavaScript object converted to a JSON string and back, including arrays inside objects.",
      recommendedChannels: ["freeCodeCamp.org", "Web Dev Simplified"],
      keyTakeaways: [
        "JSON.stringify(value) converts a JavaScript object or array into a JSON-formatted string.",
        "JSON.parse(jsonString) converts a JSON-formatted string back into a usable JavaScript object or array.",
        "Both functions work recursively, so an object containing nested objects and arrays converts correctly in a single call.",
      ],
      notes:
        "JSON (JavaScript Object Notation) is a plain text format that looks almost identical to JavaScript's own object and array literals. JSON.stringify() and JSON.parse() convert between the two, and both handle nested data automatically, without needing to process each level manually.",
      conceptExplanation:
        "JSON.stringify({ user: { name: \"Ada\", tags: [\"dev\", \"mentor\"] } }) produces one JSON string with the nested object and array fully preserved inside it. JSON.parse() reverses that exact process, rebuilding the original nested structure so it can be accessed again with chained access like parsed.user.tags[0]. Passing a third argument, JSON.stringify(value, null, 2), adds two-space indentation, producing readable, multi-line output instead of one dense line.",
      whyItMatters: "JSON is the standard format for exchanging structured data in modern JavaScript applications, and real data is almost always nested, so converting it correctly in both directions is a core practical skill.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Create an object representing a user profile with a nested address object (containing street and city) and an array of hobbies. Convert it to a JSON string with JSON.stringify() and print it. Print it again using JSON.stringify(profile, null, 2) to compare the formatted, multi-line version. Then use JSON.parse() to convert the JSON string back into an object, and print one nested value (like the city) and one array element (the first hobby) from the parsed result.",
      challenge: "Add a nested array of order objects (each with id and total) inside the profile. After round-tripping the whole profile through JSON.stringify() and JSON.parse(), use reduce() on the re-parsed orders array to calculate and print the total amount spent across all orders.",
      expectedResult: "The program prints a single-line JSON string, a readable indented version, and then successfully parses it back, correctly printing both a nested object value and an array element from the result.",
      tests: ["JSON.stringify() correctly converts the nested profile object into a JSON string", "JSON.parse() correctly parses that string back into an object with accessible nested values"],
      hint: "JSON.stringify() always returns a string, so you must JSON.parse() it again before you can access any of its properties with dot or bracket notation.",
      lessonAssessment: [
        {
          question: "What does JSON.stringify({ a: { b: 1 } }) return?",
          options: ["A JavaScript object", "A JSON-formatted string representing the nested object", "An array", "undefined"],
          correctAnswerIndex: 1,
          explanation: "JSON.stringify() converts a JavaScript value, including nested objects, into its JSON text representation, always returned as a string.",
        },
        {
          question: "After const parsed = JSON.parse(jsonString);, what type of value is parsed if jsonString represents a nested object?",
          options: ["It stays a string", "A regular JavaScript object with all of its nested structure restored", "A number", "An error is always thrown"],
          correctAnswerIndex: 1,
          explanation: "JSON.parse() rebuilds the original JavaScript object or array structure, including any nested objects or arrays it contained.",
        },
      ],
      commonMistakes: ["Trying to access a property directly on the result of JSON.stringify(), forgetting that it returns a string, not an object, until it is parsed again.", "Assuming JSON.stringify() preserves everything in an object, when values like functions and undefined are silently dropped during conversion since JSON has no equivalent for them."],
      deliverables: ["A script demonstrating JSON.stringify() and JSON.parse() on a nested object with an array"],
      assessmentCriteria: ["stringify() and parse() are both used correctly on nested data", "A nested value and an array element are both correctly read from the parsed result"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'const profile = {\n  username: "ada_dev",\n  address: { street: "12 Palm Ave", city: "Lagos" },\n  hobbies: ["reading", "chess"],\n};\n\nconst jsonText = JSON.stringify(profile);\nconsole.log(jsonText);\nconsole.log(JSON.stringify(profile, null, 2));\n\nconst parsed = JSON.parse(jsonText);\nconsole.log(parsed.address.city, parsed.hobbies[0]);',
        explanation: "stringify() converts the nested profile object into JSON text in two formats, and parse() converts that text back into an object whose nested address and hobbies remain fully accessible.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Callbacks: Functions Passed as Arguments",
      goal: "Write and use callback functions, and use setTimeout() to see JavaScript's non-blocking, callback-driven behavior in action.",
      videoTitle: "JavaScript Callback Functions Explained",
      videoSearchQuery: "javascript callback functions tutorial for beginners",
      videoLearningGoal: "See a custom function accept and call a callback, and setTimeout() schedule a callback to run later without pausing the script.",
      recommendedChannels: ["The Net Ninja", "Programming with Mosh"],
      keyTakeaways: [
        "A callback is a function passed as an argument to another function, to be called later by that function.",
        "Callbacks let a function's caller customize what happens with its result, without the function needing to know those details in advance.",
        "setTimeout(callback, delay) schedules a callback to run after at least delay milliseconds, while the rest of the program keeps running immediately without waiting.",
      ],
      notes:
        "You have already used callbacks without necessarily naming them: the function passed to map(), filter(), and forEach() is a callback. This lesson focuses on writing your own functions that accept a callback, and on setTimeout(), which reveals that JavaScript does not pause and wait for delayed work to finish.",
      conceptExplanation:
        "function processOrder(order, onComplete) { const result = `Order for ${order} processed`; onComplete(result); } lets processOrder(\"desk\", result => console.log(result)) pass in an arrow function as onComplete, which processOrder calls once its own work is done. setTimeout(() => console.log(\"done\"), 1000) schedules that arrow function to run after roughly 1000 milliseconds, but any code written after the setTimeout() call still runs immediately, before the delayed callback fires. This non-blocking behavior is central to how JavaScript handles anything that takes time.",
      whyItMatters: "Callbacks are the foundation of asynchronous JavaScript and appear everywhere, from array methods and event handling to timers, making them a required stepping stone to understanding Promises.",
      practicalTask:
        "Write a function greetUser(name, callback) that builds a greeting string and passes it to callback instead of returning it directly. Call greetUser with an arrow function callback that prints the greeting. Then call setTimeout() to print a message after a 1000 millisecond delay, and print a different message immediately after that setTimeout() call, so you can observe that the immediate message appears in the console before the delayed one, even though the delayed one was scheduled first in the code.",
      challenge: "Write a function processItems(items, callback) that loops through an array with a for loop and calls callback(item, index) for each element, simulating how forEach() works internally. Use it to print every item in an array along with its index.",
      expectedResult: "The program prints the greeting produced through the callback, then the immediate message, and finally, after roughly a second, the delayed setTimeout message.",
      tests: ["A custom function accepts a callback parameter and calls it instead of returning a value directly", "setTimeout() is used with a callback that runs after a delay, while later code runs immediately"],
      hint: "Code written after a setTimeout() call keeps running right away; only the scheduled callback itself waits for the delay before running.",
      lessonAssessment: [
        {
          question: "What is a callback function?",
          options: [
            "A function that can never accept arguments",
            "A function passed as an argument to another function, to be called later",
            "A built-in JavaScript keyword",
            "A function that always runs immediately and blocks everything else",
          ],
          correctAnswerIndex: 1,
          explanation: "A callback is simply a function value passed into another function, which calls it at some point, often after finishing its own work.",
        },
        {
          question: "If setTimeout(() => console.log(\"A\"), 1000) is followed immediately by console.log(\"B\"), what prints first?",
          options: ["\"A\", then \"B\"", "\"B\", then \"A\" about a second later", "Both print at exactly the same time", "Only \"A\" prints"],
          correctAnswerIndex: 1,
          explanation: "setTimeout() does not pause the program; \"B\" runs immediately, and the scheduled callback printing \"A\" only runs after the delay has passed." },
      ],
      commonMistakes: ["Writing callback() with parentheses when passing it as an argument, which calls the function immediately instead of passing the function itself to be called later.", "Expecting setTimeout()'s callback to pause the rest of the script while it waits, when in fact the rest of the program keeps running immediately."],
      deliverables: ["A script defining a function that accepts and calls a callback, plus a setTimeout() example"],
      assessmentCriteria: ["The callback function correctly runs and produces the expected output", "setTimeout()'s non-blocking order of execution is correctly demonstrated"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'function greetUser(name, callback) {\n  const greeting = `Hello, ${name}!`;\n  callback(greeting);\n}\n\ngreetUser("Ada", (message) => console.log(message));\n\nsetTimeout(() => console.log("This prints after 1 second"), 1000);\nconsole.log("This prints immediately");',
        explanation: "greetUser() calls the passed-in callback with its result instead of returning it directly, and the immediate console.log() runs before the setTimeout() callback, which only fires after its delay.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Introducing Promises: .then() and .catch()",
      goal: "Understand what a Promise represents, and use .then() and .catch() to handle its eventual success or failure.",
      videoTitle: "JavaScript Promises Explained: .then and .catch",
      videoSearchQuery: "javascript promises then catch tutorial for beginners",
      videoLearningGoal: "See a Promise resolve successfully and reject with an error, and .then()/.catch() handle each case separately.",
      recommendedChannels: ["Web Dev Simplified", "Fireship"],
      keyTakeaways: [
        "A Promise represents a value that is not available yet, but will eventually resolve (succeed) or reject (fail).",
        ".then(callback) runs its callback with the resolved value once a Promise succeeds.",
        ".catch(callback) runs its callback with the error if a Promise rejects, letting the program handle the failure instead of crashing.",
      ],
      notes:
        "Promises are JavaScript's structured way of representing an operation that finishes at some point in the future, success or failure, without needing deeply nested callback functions to track what happens next.",
      conceptExplanation:
        "new Promise((resolve, reject) => { ... }) creates a Promise, and the function passed to it (the executor) decides the outcome: calling resolve(value) marks the Promise as succeeded with that value, while calling reject(error) marks it as failed. Chaining .then(value => ...) runs only if resolve() was called, receiving that value, and .catch(error => ...) runs only if reject() was called instead, receiving the error. This lets success and failure be handled in two separate, clearly labeled places.",
      whyItMatters: "Promises are the modern standard for representing operations that complete at an unknown future time, and they are the foundation that async/await, covered later, builds directly on top of.",
      practicalTask:
        "Write a function checkAge(age) that returns new Promise((resolve, reject) => { ... }): inside the executor, if age is 18 or older, call resolve() with a success message string; otherwise call reject() with an error message string. Call checkAge(20).then(message => console.log(message)).catch(error => console.log(error)) to observe the resolved case, and call checkAge(10) the same way to observe the rejected case being caught and printed instead of crashing the program.",
      challenge: "Wrap the resolve() and reject() calls inside a setTimeout(() => { ... }, 500) so the Promise settles asynchronously after a short delay instead of immediately, and print a message right after calling checkAge() (before its .then() runs) to confirm that the .then() callback only runs after the delay.",
      expectedResult: "The program prints the resolved success message for age 20, and prints the caught error message for age 10, without the program stopping or crashing.",
      tests: ["checkAge returns a Promise that resolves for an age 18 or older", "checkAge returns a Promise that rejects for an age under 18, and .catch() handles it without crashing the program"],
      hint: "resolve(value) and reject(error) are the two functions the Promise executor receives as arguments; calling one of them determines whether .then() or .catch() runs afterward.",
      lessonAssessment: [
        {
          question: "What does a Promise represent in JavaScript?",
          options: [
            "A value that is always available immediately",
            "A value that is not available yet, but will eventually resolve or reject",
            "A special kind of array",
            "A synonym for a callback function",
          ],
          correctAnswerIndex: 1,
          explanation: "A Promise stands in for a result that will become available later, either successfully (resolved) or unsuccessfully (rejected).",
        },
        {
          question: "If a Promise's executor calls reject(\"failed\"), which handler runs?",
          options: [".then()", ".catch()", "Both .then() and .catch() run together", "Neither runs"],
          correctAnswerIndex: 1,
          explanation: "Calling reject() marks the Promise as failed, so any attached .catch() handler runs with that error, while .then() is skipped." },
      ],
      commonMistakes: ["Forgetting to call resolve() or reject() inside the Promise executor, leaving the Promise permanently pending so neither .then() nor .catch() ever runs.", "Leaving off a .catch() entirely, so a rejected Promise's error goes unhandled instead of being caught and dealt with cleanly."],
      deliverables: ["A script defining a Promise-returning function and handling both its resolved and rejected cases"],
      assessmentCriteria: ["The Promise correctly resolves for the success case and rejects for the failure case", ".then() and .catch() correctly handle each outcome without crashing the program"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'function checkAge(age) {\n  return new Promise((resolve, reject) => {\n    if (age >= 18) {\n      resolve(`Age ${age} is allowed.`);\n    } else {\n      reject(`Age ${age} is not allowed.`);\n    }\n  });\n}\n\ncheckAge(20)\n  .then((message) => console.log(message))\n  .catch((error) => console.log(error));\n\ncheckAge(10)\n  .then((message) => console.log(message))\n  .catch((error) => console.log(error));',
        explanation: "The first call resolves and runs .then(), while the second call rejects and runs .catch() instead, both without stopping the rest of the program.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Working with JSON & Asynchronous Basics Assessment",
    questions: [
      { question: "What does JSON.stringify({ a: { b: 1 } }) return?", options: ["A JavaScript object", "A JSON-formatted string", "An array", "undefined"], correctAnswerIndex: 1, explanation: "JSON.stringify() converts a JavaScript value, including nested data, into a JSON text string." },
      { question: "What does JSON.parse() do to a JSON string?", options: ["Converts a JavaScript object into a string", "Parses the string back into a usable JavaScript object or array", "Deletes the string", "Runs the string as code"], correctAnswerIndex: 1, explanation: "JSON.parse() converts a JSON-formatted string back into the equivalent JavaScript data." },
      { question: "What does the third argument in JSON.stringify(value, null, 2) control?", options: ["Which properties to include", "Readable indentation with 2-space formatting", "The number of nested levels allowed", "Whether functions are included"], correctAnswerIndex: 1, explanation: "The third argument to JSON.stringify() sets the indentation used for readable, multi-line output." },
      { question: "What is a callback function?", options: ["A function that runs before the program starts", "A function passed as an argument to another function, to be called later", "A synonym for a Promise", "A function that can only be used with arrays"], correctAnswerIndex: 1, explanation: "A callback is a function value handed to another function, which calls it, often after finishing some work." },
      { question: "If setTimeout(() => console.log(\"A\"), 1000) is followed by console.log(\"B\"), what prints first?", options: ["\"A\"", "\"B\"", "They print at the same time", "Neither prints"], correctAnswerIndex: 1, explanation: "setTimeout() does not block execution, so \"B\" runs immediately while \"A\" only prints after the delay." },
      { question: "What does a Promise represent?", options: ["A value that is always available immediately", "A value that is not available yet but will eventually resolve or reject", "A special array type", "A type of callback that runs twice"], correctAnswerIndex: 1, explanation: "A Promise represents an eventual result, success (resolved) or failure (rejected), of an operation." },
      { question: "What does calling resolve(value) inside a Promise executor do?", options: ["Marks the Promise as failed with that value as the error", "Marks the Promise as successfully completed, making value available to .then()", "Cancels the Promise", "Does nothing unless .catch() is also called"], correctAnswerIndex: 1, explanation: "resolve(value) marks the Promise as fulfilled, and any attached .then() handler receives that value." },
      { question: "What handler runs if a Promise's executor calls reject(\"error message\")?", options: [".then()", ".catch()", "Both, at the same time", "Neither"], correctAnswerIndex: 1, explanation: "reject() marks the Promise as failed, so a .catch() handler runs with the given error, while .then() is skipped." },
      { question: "What happens if a Promise executor never calls resolve() or reject()?", options: ["The Promise resolves automatically with undefined", "The Promise stays pending forever, so neither .then() nor .catch() ever runs", "It throws a syntax error immediately", "JavaScript calls resolve() for you after 1 second"], correctAnswerIndex: 1, explanation: "A Promise only settles when resolve() or reject() is explicitly called; otherwise it remains pending indefinitely." },
      { question: "Why are callbacks considered a foundation for understanding Promises?", options: [
          "Promises do not actually use functions at all",
          "Promises are JavaScript's more structured way of handling the same kind of \"do this later\" behavior that callbacks provide",
          "Callbacks and Promises are unrelated concepts",
          "Callbacks were removed from JavaScript once Promises were introduced",
        ], correctAnswerIndex: 1, explanation: "Promises formalize and clean up the same underlying idea callbacks express, handling eventual results without deeply nested callback functions." },
    ],
  },
  assignment:
    "Build a 'Nested Inventory Report': create an object representing a warehouse with a nested array of at least 4 category objects, each containing a name and a nested array of at least 2 item objects (name and quantity). Convert the entire structure to a JSON string using JSON.stringify(value, null, 2) and print the readable, indented result. Parse it back using JSON.parse(), then loop through the parsed categories and print the total quantity of items in each one.",
  assignmentDeliverables: [
    "A script building a nested warehouse object and converting it with JSON.stringify() and JSON.parse()",
    "Printed indented JSON output, plus each category's correctly calculated total quantity after re-parsing",
  ],
  assignmentAssessmentCriteria: [
    "The warehouse object's nested categories and items are correctly structured",
    "JSON.stringify() and JSON.parse() are both used correctly on the nested data",
    "Each category's total quantity is calculated correctly from the re-parsed data",
  ],
  miniProject:
    "Build a 'Delayed Task Runner': write a function runTask(taskName, delay, callback) that uses setTimeout() to wait the given delay in milliseconds, then calls callback with a message announcing that the task finished. Call runTask() for at least 3 different tasks with different delays, and print a message immediately after starting all three calls to demonstrate that the program does not pause waiting for them. Then write a second function runTaskAsPromise(taskName, delay) that wraps the same waiting logic in a Promise instead of a callback, and demonstrate calling it with .then() to print its completion message once it resolves.",
  miniProjectDeliverables: [
    "A script defining runTask() using a callback and setTimeout()",
    "A script defining runTaskAsPromise() using a Promise wrapping the same delayed logic",
    "Printed output showing the immediate message appearing before any of the delayed task messages",
  ],
  miniProjectAssessmentCriteria: [
    "runTask() correctly calls its callback only after the specified delay",
    "runTaskAsPromise() correctly resolves with a completion message that is handled with .then()",
    "Output clearly demonstrates that the program continues running immediately instead of waiting for the delayed tasks",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
