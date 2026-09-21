import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module7: GeneratedModule = {
  title: "Strings, Errors & JSON",
  description:
    "Sharpen your string skills with template literals and common string methods, learn to handle runtime errors safely with try/catch, and convert data to and from JSON text with JSON.stringify and JSON.parse.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Template Literals and String Methods",
      goal: "Build readable strings with template literals and transform text using common string methods.",
      videoTitle: "JavaScript Template Literals and String Methods Explained",
      videoSearchQuery: "javascript template literals string methods tutorial for beginners",
      videoLearningGoal: "See template literals combine variables into a string, and common string methods transform text.",
      recommendedChannels: ["freeCodeCamp.org", "Web Dev Simplified"],
      keyTakeaways: [
        "A template literal is wrapped in backticks (`) and lets you embed variables directly using ${expression}.",
        "Common string methods include slice(), includes(), split(), toUpperCase(), and toLowerCase().",
        "Strings are immutable: a string method returns a new string rather than changing the original.",
      ],
      notes:
        "Template literals use backticks instead of quotes, and let you drop variables directly into the text with ${ }: `Hello, ${name}!` inserts the value of name right into the string, without needing + to concatenate pieces together. This is usually cleaner than building strings with repeated + operators.",
      conceptExplanation:
        "slice(start, end) returns a portion of a string between two indexes: \"hello\".slice(1, 3) returns \"el\". includes(text) returns true or false depending on whether text appears anywhere inside the string. split(separator) breaks a string into an array of pieces wherever separator appears: \"a,b,c\".split(\",\") returns [\"a\", \"b\", \"c\"]. toUpperCase() and toLowerCase() return a new string with the case changed. Because strings are immutable, none of these methods change the original string; they always return a brand-new one, so you typically need to store the result in a variable to use it.",
      whyItMatters: "Template literals and string methods are used constantly for formatting output, validating input, and processing text data throughout real programs.",
      practicalTask:
        "Declare a variable holding your full name as a string. Use a template literal to print a greeting sentence combining it with your age. Then use slice() to print just the first three characters of your name, includes() to check whether your name contains a specific letter, and toUpperCase() to print your name in all caps.",
      challenge: "Use split() on a sentence string to break it into an array of words, then print how many words the sentence contains using the resulting array's length.",
      expectedResult: "The script prints a template-literal greeting, a sliced substring, an includes() boolean result, and an uppercase version of your name.",
      tests: ["A template literal combining at least 2 variables is used", "At least 3 different string methods are demonstrated"],
      hint: "Template literals use backticks (`), not single or double quotes, and expressions go inside ${ }.",
      lessonAssessment: [
        {
          question: "What does `Hi, ${name}!` produce if name is \"Ada\"?",
          options: ["\"Hi, ${name}!\"", "\"Hi, Ada!\"", "\"Hi, name!\"", "An error"],
          correctAnswerIndex: 1,
          explanation: "A template literal evaluates the expression inside ${ } and inserts its value directly into the resulting string.",
        },
        {
          question: "What does \"hello\".slice(0, 2) return?",
          options: ["\"he\"", "\"hel\"", "\"ello\"", "\"h\""],
          correctAnswerIndex: 0,
          explanation: "slice(0, 2) returns characters from index 0 up to (but not including) index 2, which is \"he\".",
        },
      ],
      commonMistakes: ["Using regular quotes instead of backticks and expecting ${ } to still work.", "Forgetting that string methods return a new string and don't modify the original variable in place."],
      deliverables: ["A script demonstrating a template literal and at least 3 string methods"],
      assessmentCriteria: ["Template literal correctly embeds variable values", "String methods produce correct results"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "javascript",
        code: 'const name = "Ada Lovelace";\nconst age = 30;\nconsole.log(`Hi, I am ${name} and I am ${age} years old.`);\nconsole.log(name.slice(0, 3));\nconsole.log(name.includes("Love"));\nconsole.log(name.toUpperCase());',
        explanation: "The template literal embeds both variables directly, and each string method returns a new value derived from name.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Handling Errors with try/catch",
      goal: "Catch runtime errors gracefully with try/catch instead of letting them crash your script.",
      videoTitle: "JavaScript try catch Error Handling Explained",
      videoSearchQuery: "javascript try catch error handling tutorial for beginners",
      videoLearningGoal: "See a try/catch block catch a thrown error and keep the script running afterward.",
      recommendedChannels: ["The Net Ninja", "Programming with Mosh"],
      keyTakeaways: [
        "try { } wraps code that might fail; catch (error) { } runs only if something inside try throws an error.",
        "When an error is caught, the script keeps running instead of crashing at that point.",
        "You can create your own error deliberately with throw new Error(\"message\"), which catch can then handle.",
      ],
      notes:
        "Normally, an uncaught error stops your script immediately at the line that failed. Wrapping risky code in try { ... } catch (error) { ... } lets you handle that failure yourself: if anything inside try throws an error, execution jumps straight to catch, and the script continues running after the whole try/catch block instead of stopping.",
      conceptExplanation:
        "A common source of runtime errors is converting invalid text to a number: JSON.parse(\"not valid json\") throws an error, for example. Inside catch (error), the parameter (commonly named error) holds details about what went wrong, and error.message gives a readable description you can print or log. You can also intentionally throw your own errors with throw new Error(\"Invalid input\"); when your own code detects a problem, and a surrounding try/catch will catch that just like a built-in error.",
      whyItMatters: "try/catch lets your programs handle unexpected or invalid input gracefully instead of crashing, which is essential for any code that processes data it doesn't fully control.",
      practicalTask:
        "Write a function parseAge(text) that uses try/catch around a call to JSON.parse(text), printing the parsed value if it succeeds, or a friendly error message using error.message if it fails. Call it once with valid JSON text like \"25\" and once with invalid text like \"twenty-five\".",
      challenge: "Write a function that uses throw new Error(\"message\") to reject a negative number, then call it inside a try/catch to handle that thrown error.",
      expectedResult: "The script prints the successfully parsed value for valid input, and a caught error message for invalid input, without crashing either time.",
      tests: ["try/catch successfully catches an error from invalid input", "The script continues running normally after the catch block"],
      hint: "error.message contains a short, readable description of what went wrong inside the catch block.",
      lessonAssessment: [
        {
          question: "What happens to code inside a try block if no error occurs?",
          options: ["It is skipped entirely", "It runs normally, and the catch block is skipped", "It runs twice", "It throws a warning"],
          correctAnswerIndex: 1,
          explanation: "If no error occurs inside try, that code runs normally and the catch block never executes.",
        },
        {
          question: "What does throw new Error(\"message\") do?",
          options: [
            "Prints \"message\" to the console and continues normally",
            "Creates and immediately raises an error that a surrounding try/catch can catch",
            "Silently ignores the error",
            "Only works inside a catch block",
          ],
          correctAnswerIndex: 1,
          explanation: "throw raises an error immediately; if it's inside a try block, the matching catch block handles it.",
        },
      ],
      commonMistakes: ["Wrapping code in try/catch but not actually using the error information in catch to handle the problem meaningfully.", "Expecting try/catch to fix the error automatically instead of just catching and handling it."],
      deliverables: ["A script with a try/catch block that handles both valid and invalid input"],
      assessmentCriteria: ["try/catch correctly catches the error from invalid input", "Script continues executing normally after the catch block runs"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 minutes",
      codeExample: {
        language: "javascript",
        code: 'function parseAge(text) {\n  try {\n    const value = JSON.parse(text);\n    console.log("Parsed age:", value);\n  } catch (error) {\n    console.log("Could not parse age:", error.message);\n  }\n}\n\nparseAge("25");\nparseAge("twenty-five");',
        explanation: "The first call parses successfully; the second throws inside try, and catch handles it without crashing the script.",
      },
      completionStatus: "not_started",
    },
    {
      title: "JSON.stringify() and JSON.parse()",
      goal: "Convert JavaScript values to JSON text with JSON.stringify() and back with JSON.parse().",
      videoTitle: "JavaScript JSON.stringify and JSON.parse Explained",
      videoSearchQuery: "javascript json stringify parse tutorial for beginners",
      videoLearningGoal: "See an object converted to a JSON string and then parsed back into an object.",
      recommendedChannels: ["Fireship", "freeCodeCamp.org"],
      keyTakeaways: [
        "JSON.stringify(value) converts a JavaScript value, like an object or array, into a JSON-formatted string.",
        "JSON.parse(text) converts a JSON-formatted string back into a JavaScript value.",
        "JSON is a text format, so JSON.stringify() is commonly combined with try/catch around JSON.parse() since invalid JSON text throws an error.",
      ],
      notes:
        "JSON (JavaScript Object Notation) is a plain-text format for representing structured data, built from the same shapes as JavaScript objects and arrays. JSON.stringify(value) turns a JavaScript object or array into a JSON string you could store or print, and JSON.parse(text) reverses that, turning a JSON string back into a real JavaScript object or array you can work with using dot notation and array methods again.",
      conceptExplanation:
        "const data = { name: \"Ada\", age: 30 }; JSON.stringify(data) produces the string '{\"name\":\"Ada\",\"age\":30}', which looks similar to an object literal but is actually just text. Passing a third argument, like JSON.stringify(data, null, 2), adds indentation, making the output easier to read. JSON.parse('{\"name\":\"Ada\"}') converts that text back into a real object where parsed.name is \"Ada\". Since JSON.parse() throws an error on invalid JSON text, it's commonly wrapped in try/catch, connecting directly to the previous lesson.",
      whyItMatters: "JSON is the standard way structured data is represented as text, so converting between JavaScript values and JSON strings comes up constantly whenever your program needs to save, print, or work with structured data.",
      practicalTask:
        "Create an object representing a task with title, done, and priority properties. Convert it to a JSON string with JSON.stringify() and print it. Then use JSON.parse() to convert that string back into an object, and print one property from the parsed result to prove the round trip worked.",
      challenge: "Use JSON.stringify(data, null, 2) to print an indented, more readable version of the same object, and compare it to the non-indented version.",
      expectedResult: "The script prints a JSON string version of your task object, then prints a property read from the object after parsing that string back.",
      tests: ["JSON.stringify() is used to convert an object to a string", "JSON.parse() is used to convert that string back into a usable object"],
      hint: "JSON.stringify() always returns a string, even though it might look like an object when printed.",
      lessonAssessment: [
        {
          question: "What does JSON.stringify({ x: 1 }) return?",
          options: ["The object { x: 1 } unchanged", "The string '{\"x\":1}'", "The number 1", "undefined"],
          correctAnswerIndex: 1,
          explanation: "JSON.stringify() converts the object into its JSON text representation, returned as a string.",
        },
        {
          question: "What does JSON.parse('{\"age\":25}').age evaluate to?",
          options: ["\"25\" (a string)", "25 (a number)", "undefined", "An error"],
          correctAnswerIndex: 1,
          explanation: "JSON.parse() reconstructs the real JavaScript value, so age becomes the number 25, not a string.",
        },
      ],
      commonMistakes: ["Treating the result of JSON.stringify() as still being an object instead of a plain string.", "Calling JSON.parse() on text that isn't valid JSON without wrapping it in try/catch."],
      deliverables: ["A script demonstrating a full JSON.stringify() and JSON.parse() round trip"],
      assessmentCriteria: ["JSON.stringify() correctly converts an object to a string", "JSON.parse() correctly reconstructs a usable object from that string"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 minutes",
      codeExample: {
        language: "javascript",
        code: 'const task = { title: "Write notes", done: false, priority: "high" };\nconst jsonText = JSON.stringify(task);\nconsole.log(jsonText);\n\nconst parsedTask = JSON.parse(jsonText);\nconsole.log(parsedTask.title, parsedTask.priority);',
        explanation: "JSON.stringify() turns the object into text, and JSON.parse() turns that text back into a usable object with the same properties.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Strings, Errors & JSON Assessment",
    questions: [
      { question: "What symbol wraps a template literal in JavaScript?", options: ["Single quotes ('')", "Double quotes (\"\")", "Backticks (``)", "Square brackets ([])"], correctAnswerIndex: 2, explanation: "Template literals are wrapped in backticks, which enable ${ } expression embedding." },
      { question: "What does `Score: ${10 + 5}` evaluate to?", options: ["\"Score: 10 + 5\"", "\"Score: 15\"", "\"Score: ${10 + 5}\"", "An error"], correctAnswerIndex: 1, explanation: "The expression inside ${ } is evaluated first (10 + 5 = 15), then inserted into the string." },
      { question: "What does \"javascript\".includes(\"script\") return?", options: ["true", "false", "\"script\"", "undefined"], correctAnswerIndex: 0, explanation: "includes() returns true because \"script\" appears within \"javascript\"." },
      { question: "What does \"a,b,c\".split(\",\") return?", options: ["\"a,b,c\"", "[\"a\", \"b\", \"c\"]", "3", "[\"a,b,c\"]"], correctAnswerIndex: 1, explanation: "split(\",\") breaks the string apart wherever a comma appears, producing an array of the pieces." },
      { question: "What happens to code inside a try block that runs without errors?", options: ["It is skipped", "It runs normally and catch is skipped", "catch also runs afterward", "It throws a warning"], correctAnswerIndex: 1, explanation: "If no error occurs, the try block completes normally and the catch block never executes." },
      { question: "What does the catch block receive when an error occurs inside try?", options: ["Nothing", "An error object describing what went wrong", "The original input unchanged", "A boolean true"], correctAnswerIndex: 1, explanation: "catch(error) receives an error object, typically including a message property describing the failure." },
      { question: "What does JSON.stringify({ a: 1, b: 2 }) return?", options: ["The object unchanged", "A JSON-formatted string", "An array", "undefined"], correctAnswerIndex: 1, explanation: "JSON.stringify() converts a JavaScript value into its JSON string representation." },
      { question: "What does JSON.parse() do?", options: [
          "Converts a JavaScript value into a JSON string",
          "Converts a JSON string back into a JavaScript value",
          "Deletes invalid JSON text",
          "Formats a string in uppercase",
        ], correctAnswerIndex: 1, explanation: "JSON.parse() is the reverse of JSON.stringify(): it turns JSON text back into a usable JavaScript value." },
      { question: "Why is JSON.parse() commonly wrapped in try/catch?", options: [
          "It always throws an error",
          "It can throw an error when given invalid JSON text",
          "It runs slowly without try/catch",
          "It is required by JavaScript syntax",
        ], correctAnswerIndex: 1, explanation: "JSON.parse() throws an error if its input isn't valid JSON, so try/catch handles that gracefully." },
      { question: "What does throw new Error(\"Invalid input\") do when used inside a try block?", options: [
          "Prints the message and continues normally",
          "Raises an error that the matching catch block can handle",
          "Does nothing unless console.log wraps it",
          "Immediately ends the entire program with no way to recover",
        ], correctAnswerIndex: 1, explanation: "throw raises an error immediately, which a surrounding try/catch can intercept in its catch block." },
    ],
  },
  assignment:
    "Build a 'Text Toolkit' script in the Academy workspace: declare a sentence string of your choice, then use a template literal to print a labeled summary of it, and demonstrate slice(), includes(), split(), and toUpperCase() on that sentence, printing each result with a clear label describing what it shows.",
  assignmentDeliverables: [
    "A single JavaScript file demonstrating a template literal and all four required string methods",
    "Labeled console output for each transformation applied to the sentence",
  ],
  assignmentAssessmentCriteria: [
    "The template literal correctly embeds at least one variable",
    "All four string methods (slice, includes, split, toUpperCase) produce correct results",
    "Output is clearly labeled so each result is identifiable",
  ],
  miniProject:
    "Build a 'Safe Data Loader' program that defines an object representing a user profile, converts it to a JSON string with JSON.stringify(), then writes a loadProfile(jsonText) function that uses try/catch around JSON.parse() to safely reconstruct the object, printing the parsed profile on success or a friendly error message on failure, tested once with the valid JSON string and once with a deliberately broken JSON string.",
  miniProjectDeliverables: ["A safeDataLoader.js file in the Academy workspace", "Console output showing both the successful parse and the handled failure case"],
  miniProjectAssessmentCriteria: [
    "JSON.stringify() correctly converts the profile object into a JSON string",
    "loadProfile() correctly parses valid JSON and returns a usable object",
    "Invalid JSON text is caught by try/catch and reported without crashing the script",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
