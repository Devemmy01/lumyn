import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module6: GeneratedModule = {
  title: "Error Handling & Debugging",
  description:
    "Handle errors gracefully with try/catch/finally, define and throw custom Error subclasses for meaningful failure types, and use console.table(), console.error(), and stack traces to debug JavaScript effectively.",
  completionStatus: "locked",
  lessons: [
    {
      title: "try/catch/finally: Handling Errors Gracefully",
      goal: "Use try/catch/finally to catch errors, prevent crashes, and run cleanup code regardless of whether an error occurred.",
      videoTitle: "JavaScript try catch finally Tutorial",
      videoSearchQuery: "javascript try catch finally error handling tutorial",
      videoLearningGoal: "See a try block's error caught by catch instead of crashing the program, and finally run in both cases.",
      recommendedChannels: ["freeCodeCamp.org", "Web Dev Simplified"],
      keyTakeaways: [
        "Code placed inside a try block runs normally until it throws an error, at which point control jumps immediately to the matching catch block.",
        "catch (error) { ... } receives the thrown error object and lets the program respond instead of crashing.",
        "The finally block always runs after try/catch, whether or not an error was thrown or caught, making it ideal for cleanup steps.",
      ],
      notes:
        "Without error handling, a single thrown error stops the entire script. try/catch lets you run risky code, like parsing data or calling a function with unpredictable input, and respond to failures instead of letting them crash everything.",
      conceptExplanation:
        "try { const data = JSON.parse(invalidJson); } catch (error) { console.log(\"Failed to parse:\", error.message); } runs the parsing attempt, and if JSON.parse() throws because the text is not valid JSON, control immediately jumps into the catch block instead of continuing in try or halting the program. Adding finally { console.log(\"Parse attempt finished\"); } guarantees that block runs after try/catch completes, regardless of whether an error happened, which is useful for steps that must always happen, like logging that an operation finished.",
      whyItMatters: "Real programs constantly work with unpredictable input, from user data to parsed text, and try/catch/finally is the standard way to keep a program running and informative instead of crashing on the first unexpected value.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Write a function safeDivide(a, b) that uses try/catch: inside try, if b is 0, throw new Error(\"Cannot divide by zero\"); otherwise return a / b. In the catch block, print a friendly message using error.message instead of letting the program crash. Add a finally block that always prints \"Division attempt complete\". Call safeDivide() with values that succeed and with values that trigger the thrown error.",
      challenge: "Add a second check inside safeDivide() that throws a different error message if either argument is not a number (using typeof), and demonstrate all three cases: a successful division, a divide-by-zero error, and a non-number error, each caught and printed clearly.",
      expectedResult: "The program prints correct results for valid division, a friendly caught error message for division by zero, and \"Division attempt complete\" after every call regardless of the outcome.",
      tests: ["try/catch correctly catches a thrown error instead of crashing the program", "finally runs after both the successful and the error-triggering calls"],
      hint: "throw new Error(\"message\") immediately stops the try block and jumps to catch; anything after the throw statement inside try never runs.",
      lessonAssessment: [
        {
          question: "What happens when code inside a try block throws an error?",
          options: [
            "The program crashes immediately with no way to recover",
            "Control immediately jumps to the matching catch block instead of crashing",
            "The rest of the try block keeps running as if nothing happened",
            "The error is silently ignored",
          ],
          correctAnswerIndex: 1,
          explanation: "As soon as an error is thrown inside try, execution jumps straight to catch, skipping any remaining code in the try block.",
        },
        {
          question: "When does the code inside a finally block run?",
          options: [
            "Only if no error was thrown",
            "Only if an error was thrown and caught",
            "Always, whether or not an error was thrown or caught",
            "Only if the catch block itself throws another error",
          ],
          correctAnswerIndex: 2,
          explanation: "finally always runs after try/catch finishes, regardless of whether an error occurred, making it reliable for cleanup steps." },
      ],
      commonMistakes: ["Writing code that could fail without wrapping it in try/catch, letting one bad input crash the entire program instead of being handled gracefully.", "Assuming code after a throw statement inside the same try block still runs, when execution actually jumps to catch immediately."],
      deliverables: ["A script with a function using try/catch/finally to handle a thrown error"],
      assessmentCriteria: ["An error is correctly thrown and caught without crashing the program", "finally correctly runs after both successful and failed attempts"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'function safeDivide(a, b) {\n  try {\n    if (b === 0) {\n      throw new Error("Cannot divide by zero");\n    }\n    return a / b;\n  } catch (error) {\n    console.log("Error:", error.message);\n    return null;\n  } finally {\n    console.log("Division attempt complete");\n  }\n}\n\nconsole.log(safeDivide(10, 2));\nconsole.log(safeDivide(10, 0));',
        explanation: "The first call completes successfully and returns 5, while the second call throws inside try, is caught and logged, and finally still runs after both calls.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Custom Errors: Extending the Error Class",
      goal: "Define custom error types by extending the built-in Error class, and throw and catch them to represent specific failure cases clearly.",
      videoTitle: "JavaScript Custom Error Classes Tutorial",
      videoSearchQuery: "javascript custom error class extends error tutorial",
      videoLearningGoal: "See a custom error class extend Error, and a catch block distinguish it from other errors.",
      recommendedChannels: ["The Net Ninja", "Traversy Media"],
      keyTakeaways: [
        "A custom error class is created with class CustomError extends Error, inheriting Error's message and stack trace behavior.",
        "Calling super(message) inside a custom error's constructor passes the message up to the built-in Error class correctly.",
        "instanceof can check inside a catch block whether the caught error is a specific custom error type, letting different failures be handled differently.",
      ],
      notes:
        "A plain Error works, but real programs often have several distinct kinds of failure, like invalid input versus a missing item versus a permission problem. Extending Error to create named custom error classes makes each kind of failure identifiable and easier to handle correctly.",
      conceptExplanation:
        "class ValidationError extends Error { constructor(message) { super(message); this.name = \"ValidationError\"; } } creates a distinct error type: throwing new ValidationError(\"Invalid input\") still has a working .message property, thanks to super(message), plus a .name of \"ValidationError\" instead of the generic \"Error\". Inside a catch block, if (error instanceof ValidationError) { ... } can respond specifically to that error type, while a different check could handle other custom error classes differently.",
      whyItMatters: "Custom errors make failure cases self-documenting and let catch blocks respond differently depending on exactly what went wrong, instead of treating every error identically.",
      practicalTask:
        "Define a custom error class InvalidAgeError that extends Error, with a constructor accepting a message, calling super(message), and setting this.name to \"InvalidAgeError\". Write a function registerUser(age) that throws new InvalidAgeError(\"Age must be at least 13\") if age is under 13, and otherwise returns a success message. Call registerUser() with both a valid and an invalid age inside a try/catch, and in the catch block, use instanceof to confirm the caught error is an InvalidAgeError before printing its message.",
      challenge: "Define a second custom error class, DuplicateUserError, extending Error the same way. Update registerUser() to accept an array of existing usernames and throw DuplicateUserError if the given username is already taken. In your catch block, use two instanceof checks to print a different message depending on which of the two custom error types was caught.",
      expectedResult: "The program prints a success message for a valid registration, and correctly identifies and prints a friendly message for an InvalidAgeError using instanceof, without crashing.",
      tests: ["A custom error class is defined extending Error and calling super(message) in its constructor", "instanceof is used inside a catch block to correctly identify the custom error type"],
      hint: "Forgetting super(message) in a custom error's constructor means the error's .message property will not be set correctly.",
      lessonAssessment: [
        {
          question: "What does class InvalidAgeError extends Error do?",
          options: [
            "Creates an unrelated class that happens to share a name with Error",
            "Creates a custom error type that inherits Error's behavior, like the .message property",
            "Overwrites the built-in Error class permanently",
            "Is invalid syntax, since Error cannot be extended",
          ],
          correctAnswerIndex: 1,
          explanation: "Extending Error creates a new, distinct error type that still inherits the standard Error behavior, like storing a message.",
        },
        {
          question: "Why call super(message) inside a custom error class's constructor?",
          options: [
            "It is optional and has no effect",
            "It passes the message up to Error's own constructor so .message is set correctly",
            "It prevents the error from ever being thrown",
            "It automatically logs the error to the console",
          ],
          correctAnswerIndex: 1,
          explanation: "super(message) runs Error's constructor with the given message, which is what makes error.message work correctly on the custom error." },
      ],
      commonMistakes: ["Forgetting to call super(message) in a custom error class's constructor, which leaves the inherited .message property unset.", "Checking error.message with exact string matching to identify an error's type, instead of using the more reliable instanceof check against the custom error class."],
      deliverables: ["A script defining at least one custom error class extending Error, thrown and caught with instanceof"],
      assessmentCriteria: ["The custom error class correctly extends Error and calls super(message)", "instanceof correctly identifies the custom error type inside a catch block"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'class InvalidAgeError extends Error {\n  constructor(message) {\n    super(message);\n    this.name = "InvalidAgeError";\n  }\n}\n\nfunction registerUser(age) {\n  if (age < 13) {\n    throw new InvalidAgeError("Age must be at least 13");\n  }\n  return "User registered successfully";\n}\n\ntry {\n  console.log(registerUser(10));\n} catch (error) {\n  if (error instanceof InvalidAgeError) {\n    console.log("Registration failed:", error.message);\n  } else {\n    throw error;\n  }\n}',
        explanation: "InvalidAgeError extends Error and correctly passes its message through super(); the catch block uses instanceof to confirm it caught that specific custom error before handling it.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Debugging Tools: console.table, console.error, and Reading Stack Traces",
      goal: "Use console.table() and console.error() to inspect data and report failures clearly, and read a stack trace to locate where an error occurred.",
      videoTitle: "JavaScript Debugging Tutorial: console.table, console.error, Stack Traces",
      videoSearchQuery: "javascript console table console error stack trace debugging tutorial",
      videoLearningGoal: "See console.table() display array data in a readable grid, and a stack trace point to the exact source of an error.",
      recommendedChannels: ["Fireship", "Programming with Mosh"],
      keyTakeaways: [
        "console.table(data) displays an array of objects as a readable grid, with one row per object and one column per property.",
        "console.error(...) prints a message specifically flagged as an error, which is visually distinct from a normal console.log() message.",
        "A stack trace lists the chain of function calls that led to an error, with the most recent call (where the error was thrown) listed first.",
      ],
      notes:
        "console.log() is not the only debugging tool available. console.table() is far more readable than console.log() for arrays of similar objects, console.error() clearly marks a message as a failure rather than routine output, and reading a stack trace is a core debugging skill for tracking down exactly where and why an error happened.",
      conceptExplanation:
        "console.table([{ name: \"Ada\", score: 92 }, { name: \"Sam\", score: 78 }]) prints a grid with name and score as columns and one row per object, far easier to scan than individually logged objects. console.error(\"Failed to load user:\", error) prints the same way as console.log() but is flagged as an error message. When an uncaught error occurs, its stack trace lists each function call involved, starting with the exact line where the error was thrown, then the function that called that function, and so on, which is how you trace an error back to its real cause instead of just where it was noticed.",
      whyItMatters: "Reaching for the right debugging tool, a table for structured data, console.error() for failures, and reading stack traces carefully, makes finding and fixing bugs dramatically faster than relying on console.log() alone.",
      practicalTask:
        "Create an array of at least 4 objects representing students with name and score properties, and print it using console.table(). Write a function loadUser(id) that throws new Error(\"User not found\") if id is not a positive number, wrap a call to it with an invalid id in a try/catch, and in the catch block use console.error() (not console.log()) to print the failure along with the id that caused it.",
      challenge: "Write a function outer() that calls a function middle(), which calls a function inner(), where inner() throws an error. Let the error go uncaught once (without try/catch) to observe its full stack trace in the console, then wrap the outermost call in try/catch and use console.error(error.stack) to print the same stack trace intentionally.",
      expectedResult: "console.table() displays the student data in a readable grid, and console.error() clearly reports the loadUser() failure along with the invalid id that triggered it.",
      tests: ["console.table() is used to display an array of similarly structured objects", "console.error() is used specifically to report a caught error, separately from regular console.log() output"],
      hint: "console.table() only produces a useful grid for an array of objects that share similar property names; a plain array of numbers or strings will not benefit from it the same way.",
      lessonAssessment: [
        {
          question: "What does console.table() do with an array of objects that share the same properties?",
          options: [
            "Prints each object as raw text, identical to console.log()",
            "Displays the array as a readable grid with one row per object and one column per property",
            "Throws an error unless every object is identical",
            "Deletes duplicate objects from the array",
          ],
          correctAnswerIndex: 1,
          explanation: "console.table() formats an array of similarly shaped objects into a grid, which is much easier to scan than individually logged objects.",
        },
        {
          question: "In a stack trace, which function call is typically listed first?",
          options: [
            "The very first function that ran when the program started",
            "The exact location where the error was thrown, followed by the chain of functions that called it",
            "A random function chosen by the JavaScript engine",
            "Only the outermost function in the program",
          ],
          correctAnswerIndex: 1,
          explanation: "A stack trace lists the most recent call, where the error actually occurred, first, followed by each calling function further up the chain." },
      ],
      commonMistakes: ["Using console.log() for every message, including failures, making it harder to visually distinguish real errors from routine output in the console.", "Reading a stack trace from the bottom up instead of the top down, missing that the exact error location is listed first, not last."],
      deliverables: ["A script using console.table() on an array of objects, and console.error() to report a caught error"],
      assessmentCriteria: ["console.table() correctly displays structured array data in a grid", "console.error() is correctly used to report a failure distinctly from normal output"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'const students = [\n  { name: "Ada", score: 92 },\n  { name: "Sam", score: 78 },\n  { name: "Lee", score: 85 },\n];\nconsole.table(students);\n\nfunction loadUser(id) {\n  if (typeof id !== "number" || id <= 0) {\n    throw new Error("User not found");\n  }\n  return { id, name: "Ada" };\n}\n\ntry {\n  loadUser(-1);\n} catch (error) {\n  console.error("Failed to load user with id -1:", error.message);\n}',
        explanation: "console.table() displays the student array as a readable grid, and console.error() clearly flags the loadUser() failure as an error rather than routine output.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Error Handling & Debugging Assessment",
    questions: [
      { question: "What happens when code inside a try block throws an error?", options: ["The program crashes with no recovery", "Control jumps immediately to the matching catch block", "The rest of the try block keeps running", "The error is silently ignored"], correctAnswerIndex: 1, explanation: "Throwing an error inside try immediately transfers control to catch, skipping any remaining code in try." },
      { question: "When does a finally block run?", options: ["Only if no error occurred", "Only if an error was caught", "Always, whether or not an error occurred", "Only if catch itself throws"], correctAnswerIndex: 2, explanation: "finally always runs after try/catch completes, regardless of whether an error was thrown or caught." },
      { question: "What does throw new Error(\"message\") do inside a try block?", options: ["Prints the message and continues normally", "Immediately stops the try block and transfers control to catch", "Only works inside a function", "Silently does nothing"], correctAnswerIndex: 1, explanation: "throw immediately stops normal execution and hands control to the matching catch block." },
      { question: "What does class ValidationError extends Error do?", options: ["Creates an unrelated class with a similar name", "Creates a custom error type that inherits Error's behavior", "Deletes the built-in Error class", "Is invalid, since Error cannot be extended"], correctAnswerIndex: 1, explanation: "Extending Error creates a distinct custom error class that still inherits standard Error behavior like storing a message." },
      { question: "Why is super(message) called inside a custom error class's constructor?", options: ["It is optional and has no real effect", "It passes the message to Error's own constructor so .message is set correctly", "It prevents the custom error from being thrown", "It logs the error automatically"], correctAnswerIndex: 1, explanation: "super(message) runs the built-in Error constructor with the given message, correctly setting the error's .message property." },
      { question: "What does error instanceof ValidationError check inside a catch block?", options: ["Whether error.message equals \"ValidationError\"", "Whether the caught error object was created from the ValidationError class", "Whether ValidationError has ever been thrown before", "Nothing, instanceof does not work on errors"], correctAnswerIndex: 1, explanation: "instanceof checks whether the caught error was actually created from that specific custom error class, which is more reliable than comparing messages." },
      { question: "What does console.table() do with an array of objects that share the same properties?", options: ["Prints raw text identical to console.log()", "Displays the data as a readable grid with rows and columns", "Throws an error", "Sorts the array alphabetically"], correctAnswerIndex: 1, explanation: "console.table() formats an array of similarly structured objects into a readable grid." },
      { question: "How is console.error() different from console.log()?", options: ["There is no difference", "console.error() flags the message as an error, visually distinct from normal output", "console.error() can only print numbers", "console.error() stops the program"], correctAnswerIndex: 1, explanation: "console.error() prints a message the same way console.log() does, but visually marks it as an error rather than routine output." },
      { question: "In a stack trace, what is typically listed first?", options: ["The very first function the program ran", "The exact location where the error was thrown", "A random function", "Only the file name"], correctAnswerIndex: 1, explanation: "Stack traces list the most recent call, the exact point where the error occurred, first, followed by the chain of calling functions." },
      { question: "Why might a program define multiple custom error classes instead of always throwing a plain Error?", options: [
          "JavaScript requires at least two error types per program",
          "Distinct error types make different failure cases identifiable and let catch blocks respond to each one differently",
          "Plain Error objects cannot be caught",
          "Custom error classes run faster than plain errors",
        ], correctAnswerIndex: 1, explanation: "Custom error classes make failure cases self-documenting and let catch blocks use instanceof to respond differently depending on what actually went wrong." },
    ],
  },
  assignment:
    "Build a 'Safe Bank Withdrawal' function: define a custom error class InsufficientFundsError extending Error. Write a function withdraw(balance, amount) that throws InsufficientFundsError if amount is greater than balance, otherwise returns the new balance after subtracting amount. Call withdraw() inside a try/catch with both a valid and an invalid amount, use instanceof in the catch block to confirm the InsufficientFundsError type before printing a friendly message, and add a finally block that always prints \"Withdrawal attempt finished\".",
  assignmentDeliverables: [
    "A script defining InsufficientFundsError extending Error, and a withdraw() function that throws it when appropriate",
    "Printed output showing a successful withdrawal, a caught InsufficientFundsError, and finally running after both",
  ],
  assignmentAssessmentCriteria: [
    "InsufficientFundsError correctly extends Error and calls super(message)",
    "withdraw() correctly throws the custom error only when the amount exceeds the balance",
    "The catch block correctly uses instanceof, and finally runs after every call",
  ],
  miniProject:
    "Build an 'Order Validator with Debug Logging': create an array of at least 5 order objects, each with id, amount, and status. Define two custom error classes, InvalidAmountError and UnknownStatusError, both extending Error. Write a function validateOrder(order) that throws InvalidAmountError if amount is 0 or negative, and UnknownStatusError if status is not one of \"pending\", \"shipped\", or \"delivered\". Loop through every order, validating each inside a try/catch, using console.error() to report any caught error along with the order's id, and use console.table() at the end to display only the orders that passed validation successfully.",
  miniProjectDeliverables: [
    "A script defining InvalidAmountError and UnknownStatusError, both extending Error",
    "A validateOrder() function correctly throwing each custom error under the right condition",
    "Printed console.error() output for invalid orders and a console.table() grid of the valid ones",
  ],
  miniProjectAssessmentCriteria: [
    "Both custom error classes are correctly defined and thrown under the right conditions",
    "Every order is validated inside a try/catch without crashing the program on an invalid order",
    "console.error() and console.table() are both used correctly for their intended purpose",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
