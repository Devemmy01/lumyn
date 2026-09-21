import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module6: GeneratedModule = {
  title: "Functions: Reusable Blocks of Code",
  description:
    "Learn to package logic into reusable functions using function declarations, function expressions, and arrow functions, along with parameters, default values, return values, and basic scope.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Function Declarations, Parameters, and Return Values",
      goal: "Write a function declaration that accepts parameters and returns a computed value.",
      videoTitle: "JavaScript Functions Explained: parameters and return values",
      videoSearchQuery: "javascript function declaration parameters return value tutorial",
      videoLearningGoal: "See a function declaration defined, called with arguments, and its returned value used.",
      recommendedChannels: ["freeCodeCamp.org", "Programming with Mosh"],
      keyTakeaways: [
        "function name(parameters) { } defines a reusable block of code you can call by name.",
        "Parameters are placeholders for values the function needs; arguments are the actual values passed in when calling it.",
        "return sends a value back out of the function and immediately stops the function's execution.",
      ],
      notes:
        "A function groups a block of code under a name so you can run it whenever you need it, instead of copying and pasting the same logic repeatedly. function greet(name) { return \"Hello, \" + name; } defines a function with one parameter, name, and calling greet(\"Ada\") runs the block with name set to \"Ada\", producing the return value \"Hello, Ada\".",
      conceptExplanation:
        "A function can take zero, one, or several parameters, separated by commas: function add(a, b) { return a + b; }. Calling add(3, 4) passes 3 as a and 4 as b, and the function returns 7. If a function has no return statement, calling it produces undefined. Once return runs, the function exits immediately, so any code written after a return statement inside the same block never executes.",
      whyItMatters: "Functions let you avoid repeating the same logic throughout your code, and organizing a program into small, well-named functions makes it far easier to read, test, and fix.",
      practicalTask:
        "Write a function declaration called square that takes one number parameter and returns its square (the number multiplied by itself). Call it with three different numbers and print each result. Then write a second function, average, that takes two numbers and returns their average.",
      challenge: "Write a function isEven that takes one number and returns true or false depending on whether it's even, using the % operator.",
      expectedResult: "The script prints three squared results and at least one averaged result, all computed by calling your functions.",
      tests: ["square() correctly returns the square of its input for at least 3 calls", "average() correctly returns the average of two numbers"],
      hint: "return a * a; computes and returns the square of a in one line.",
      lessonAssessment: [
        {
          question: "What is the difference between a parameter and an argument?",
          options: [
            "There is no difference; they mean the same thing",
            "A parameter is the placeholder in the function definition; an argument is the actual value passed when calling it",
            "An argument is the placeholder; a parameter is the actual value passed",
            "Parameters are only used in arrow functions",
          ],
          correctAnswerIndex: 1,
          explanation: "Parameters are named in the function's definition; arguments are the concrete values supplied at the call site.",
        },
        {
          question: "What does calling a function with no return statement produce?",
          options: ["An error", "undefined", "null", "0"],
          correctAnswerIndex: 1,
          explanation: "If a function never hits a return statement, calling it evaluates to undefined.",
        },
      ],
      commonMistakes: ["Forgetting the return keyword and expecting console.log inside the function to send a value back to the caller.", "Writing code after a return statement in the same block, which never executes."],
      deliverables: ["A script with square() and average() functions, each called and printed at least once"],
      assessmentCriteria: ["Functions return correct computed values", "Functions are called with multiple different arguments"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 minutes",
      codeExample: {
        language: "javascript",
        code: 'function square(number) {\n  return number * number;\n}\n\nfunction average(a, b) {\n  return (a + b) / 2;\n}\n\nconsole.log(square(4));\nconsole.log(square(7));\nconsole.log(average(10, 20));',
        explanation: "Each function is defined once with parameters, then called multiple times with different arguments, and its return value is printed.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Function Expressions and Default Parameters",
      goal: "Write a function expression stored in a variable, and give a parameter a default value.",
      videoTitle: "JavaScript Function Expressions and Default Parameters Explained",
      videoSearchQuery: "javascript function expression default parameters tutorial",
      videoLearningGoal: "See a function expression assigned to a variable and a default parameter value in action.",
      recommendedChannels: ["Web Dev Simplified", "The Net Ninja"],
      keyTakeaways: [
        "A function expression stores an anonymous (or named) function directly in a variable, like const greet = function(name) { ... };.",
        "A default parameter value is used automatically when the caller omits that argument, written as function(name = \"friend\") { }.",
        "Unlike a function declaration, a function expression is not usable before the line where it's defined.",
      ],
      notes:
        "A function expression looks like a variable assignment where the value happens to be a function: const multiply = function(a, b) { return a * b; };. You call it the same way as a declared function, using multiply(3, 4). The main practical difference from a function declaration is that a function expression can only be called after the line where it's assigned, since it doesn't exist until that assignment runs.",
      conceptExplanation:
        "Default parameters let a function work sensibly even when the caller doesn't supply every argument: function greet(name = \"friend\") { return \"Hello, \" + name; }. Calling greet() with no arguments uses the default and returns \"Hello, friend\", while greet(\"Ada\") overrides the default and returns \"Hello, Ada\". Default values are only used when an argument is omitted entirely or explicitly passed as undefined, not for other falsy values like 0 or \"\".",
      whyItMatters: "Function expressions are common when passing a function as a value (for example, to be run later), and default parameters make functions more forgiving and flexible to call.",
      practicalTask:
        "Write a function expression called formatPrice that takes an amount and an optional currency parameter defaulting to \"USD\", returning a formatted string like \"42 USD\". Call it once with both arguments and once with just the amount, printing both results.",
      challenge: "Add a second default parameter, taxRate, defaulting to 0, and update the function to add the tax to the amount before formatting.",
      expectedResult: "The script prints two different formatted price strings: one using the default currency and one using a specified one.",
      tests: ["formatPrice is written as a function expression", "Calling formatPrice without the currency argument correctly uses the default value"],
      hint: "A default parameter is written directly in the parameter list: function formatPrice(amount, currency = \"USD\") { }.",
      lessonAssessment: [
        {
          question: "What happens when you call a function and omit an argument for a parameter that has a default value?",
          options: ["An error is thrown", "The parameter becomes undefined", "The parameter uses its default value", "The function call is ignored entirely"],
          correctAnswerIndex: 2,
          explanation: "A default parameter value is automatically used whenever the corresponding argument is omitted (or explicitly undefined).",
        },
        {
          question: "What is a key difference between a function expression and a function declaration?",
          options: [
            "Function expressions cannot take parameters",
            "A function expression cannot be called before the line where it is assigned",
            "Function declarations cannot return a value",
            "There is no difference at all",
          ],
          correctAnswerIndex: 1,
          explanation: "A function expression is assigned to a variable, so it only exists (and can only be called) once that assignment has run.",
        },
      ],
      commonMistakes: ["Assuming a default parameter also applies when 0 or \"\" is explicitly passed, when it only applies to omitted or undefined arguments.", "Trying to call a function expression before the line where it's defined, causing an error."],
      deliverables: ["A script with a formatPrice function expression using a default parameter"],
      assessmentCriteria: ["Function expression syntax is used correctly", "Default parameter behaves correctly when the argument is omitted"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 minutes",
      codeExample: {
        language: "javascript",
        code: 'const formatPrice = function(amount, currency = "USD") {\n  return amount + " " + currency;\n};\n\nconsole.log(formatPrice(42));\nconsole.log(formatPrice(99, "EUR"));',
        explanation: "The first call omits currency, so the default \"USD\" is used; the second call explicitly overrides it with \"EUR\".",
      },
      completionStatus: "not_started",
    },
    {
      title: "Arrow Functions and Basic Scope",
      goal: "Write arrow functions using shorthand syntax and understand how variable scope limits where a variable is accessible.",
      videoTitle: "JavaScript Arrow Functions and Scope Explained",
      videoSearchQuery: "javascript arrow functions scope tutorial for beginners",
      videoLearningGoal: "See arrow function syntax in both its full and shorthand forms, plus a demonstration of block scope.",
      recommendedChannels: ["Fireship", "freeCodeCamp.org"],
      keyTakeaways: [
        "An arrow function is a shorter way to write a function expression: const add = (a, b) => { return a + b; };.",
        "When an arrow function's body is a single expression, you can omit the curly braces and return keyword entirely.",
        "A variable declared with let or const inside a block ({ }) only exists within that block; this is called block scope.",
      ],
      notes:
        "Arrow functions provide a more compact syntax for writing function expressions: const add = (a, b) => { return a + b; }; behaves the same as the equivalent function expression. When the function body is just one expression, you can drop the braces and return keyword: const add = (a, b) => a + b; automatically returns the result of a + b.",
      conceptExplanation:
        "With exactly one parameter, the parentheses around it are optional: const double = n => n * 2; is valid. With zero or multiple parameters, parentheses are required: const greet = () => \"Hi\"; and const add = (a, b) => a + b;. Separately, scope determines where a variable can be used: a variable declared with let or const inside a function or an if/for block only exists inside that block, and trying to use it outside causes an error, which is why a variable declared inside a function's body is not accessible from outside that function.",
      whyItMatters: "Arrow functions are extremely common in modern JavaScript code you'll read and write, and understanding scope prevents confusing 'variable is not defined' errors as your programs grow.",
      practicalTask:
        "Rewrite your square and average functions from an earlier lesson as arrow functions, using shorthand (no braces/return) where the body is a single expression. Then write a function containing a let variable declared inside it, and demonstrate (with a comment) that the variable cannot be accessed outside that function.",
      challenge: "Write an arrow function isPositive that takes one number and returns true or false using shorthand syntax with a comparison expression.",
      expectedResult: "The script prints results from your arrow-function versions of square and average, matching the earlier lesson's outputs.",
      tests: ["At least one arrow function uses shorthand syntax with an implicit return", "A comment or demonstration shows a variable scoped inside a function is inaccessible outside it"],
      hint: "n => n * n is a complete shorthand arrow function: no braces, no return keyword, no parentheses needed for a single parameter.",
      lessonAssessment: [
        {
          question: "Which arrow function correctly doubles a number using shorthand syntax?",
          options: ["const double = (n) { return n * 2; }", "const double = n => n * 2;", "const double = n -> n * 2;", "function double => n * 2;"],
          correctAnswerIndex: 1,
          explanation: "n => n * 2 is valid shorthand: single parameter without parentheses, and the expression after => is returned implicitly.",
        },
        {
          question: "A variable declared with let inside a function's body is accessible:",
          options: ["Everywhere in the file", "Only inside that function", "Only inside the file's global scope", "Only inside other functions defined after it"],
          correctAnswerIndex: 1,
          explanation: "Variables declared inside a function are scoped to that function and are not accessible from outside it.",
        },
      ],
      commonMistakes: ["Forgetting that shorthand arrow functions with a single expression body return that expression automatically, and adding an unnecessary return keyword alongside braces incorrectly.", "Trying to access a variable outside the function or block where it was declared with let or const."],
      deliverables: ["A script rewriting earlier functions as arrow functions plus a scope demonstration"],
      assessmentCriteria: ["Arrow function shorthand syntax is used correctly at least once", "Scope behavior is correctly demonstrated or explained"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25-30 minutes",
      codeExample: {
        language: "javascript",
        code: 'const square = n => n * n;\nconst average = (a, b) => (a + b) / 2;\n\nconsole.log(square(6));\nconsole.log(average(10, 20));\n\nfunction demoScope() {\n  let secret = "only visible in here";\n  console.log(secret);\n}\ndemoScope();\n// console.log(secret); would throw an error here, outside the function',
        explanation: "Both arrow functions use shorthand syntax, and demoScope() shows that secret only exists inside the function where it was declared.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Functions Assessment",
    questions: [
      { question: "What keyword sends a value back out of a function?", options: ["send", "output", "return", "yield"], correctAnswerIndex: 2, explanation: "return sends a value back to the caller and immediately ends the function's execution." },
      { question: "What does calling a function with no return statement produce?", options: ["null", "undefined", "0", "An error"], correctAnswerIndex: 1, explanation: "Without a return statement, calling the function evaluates to undefined." },
      { question: "Given function add(a, b) { return a + b; }, what does add(2, 3) return?", options: ["23", "5", "\"2, 3\"", "undefined"], correctAnswerIndex: 1, explanation: "The function returns a + b, which for 2 and 3 is 5." },
      { question: "What is a function expression?", options: [
          "A function defined with the function keyword and assigned to a variable",
          "A function that never returns a value",
          "A function that can only take one parameter",
          "A loop that behaves like a function",
        ], correctAnswerIndex: 0, explanation: "A function expression stores a function directly in a variable, e.g. const greet = function() { ... };." },
      { question: "When is a default parameter value used?", options: ["Always, regardless of arguments passed", "Only when the corresponding argument is omitted or undefined", "Only when the value is 0", "Never in modern JavaScript"], correctAnswerIndex: 1, explanation: "Default parameter values apply when the caller omits the argument or explicitly passes undefined." },
      { question: "Which is valid shorthand arrow function syntax for doubling a number?", options: ["n => n * 2", "n -> n * 2", "=> n * 2", "arrow n * 2"], correctAnswerIndex: 0, explanation: "n => n * 2 is correct shorthand: single parameter, implicit return of the expression." },
      { question: "Where is a variable declared with let inside a function accessible?", options: ["Everywhere in the file", "Only inside that function", "Only in the global scope", "In every function defined afterward"], correctAnswerIndex: 1, explanation: "Variables declared inside a function are scoped to that function only." },
      { question: "What must an arrow function with zero or multiple parameters include?", options: ["No parentheses at all", "Parentheses around the parameter list", "A return keyword always", "The function keyword"], correctAnswerIndex: 1, explanation: "Parentheses around the parameters are required unless there is exactly one parameter." },
      { question: "What happens to code written after a return statement in the same block?", options: ["It runs first", "It never executes", "It runs after the function completes", "It causes a syntax error"], correctAnswerIndex: 1, explanation: "return exits the function immediately, so any following code in that block is unreachable." },
      { question: "Given const greet = (name = \"friend\") => \"Hi \" + name;, what does greet() return?", options: ["\"Hi undefined\"", "\"Hi friend\"", "An error", "\"Hi \""], correctAnswerIndex: 1, explanation: "Calling greet() with no argument triggers the default parameter, producing \"Hi friend\"." },
    ],
  },
  assignment:
    "Build a 'Math Toolkit' script in the Academy workspace: write four functions (using any mix of function declarations, function expressions, or arrow functions) named add, subtract, multiply, and divide, each taking two number parameters and returning the correct result, then call each function with at least two different pairs of numbers and print every result with a clear label.",
  assignmentDeliverables: [
    "A single JavaScript file with add, subtract, multiply, and divide functions",
    "Labeled console output showing each function called with two different input pairs",
  ],
  assignmentAssessmentCriteria: [
    "All four functions return mathematically correct results",
    "Each function is called with at least two different sets of arguments",
    "Output is clearly labeled so each result is identifiable",
  ],
  miniProject:
    "Build a 'Temperature Converter Toolkit' with an arrow function celsiusToFahrenheit(celsius) and an arrow function fahrenheitToCelsius(fahrenheit) that correctly convert between the two scales, plus a function expression formatTemperature(value, unit = \"C\") that returns a readable string like \"20 C\", then call all three functions with several sample values and print clearly labeled results.",
  miniProjectDeliverables: ["A temperatureConverter.js file in the Academy workspace", "Console output showing several converted and formatted temperature values"],
  miniProjectAssessmentCriteria: [
    "Both conversion functions produce mathematically correct results",
    "formatTemperature correctly applies its default parameter when unit is omitted",
    "All three functions are demonstrated with multiple sample inputs",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
