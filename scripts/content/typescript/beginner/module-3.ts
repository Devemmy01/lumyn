import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module3: GeneratedModule = {
  title: "Functions with Types",
  description:
    "Annotate function parameters and return values, use optional and default parameters, and describe a function's shape with a standalone function type.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Typing Function Parameters and Return Values",
      goal: "Annotate function parameters and return values so TypeScript checks how a function is called and used.",
      videoTitle: "TypeScript Functions: Parameter and Return Types",
      videoSearchQuery: "typescript function parameter types return types tutorial",
      videoLearningGoal: "See a function's parameters and return value annotated, and the error that appears when it is called with the wrong argument type.",
      recommendedChannels: ["Total TypeScript", "Web Dev Simplified"],
      keyTakeaways: [
        "Parameter types go right after each parameter name, like function add(a: number, b: number), and TypeScript checks every call against them.",
        "A return type goes after the closing parenthesis, like function add(a: number, b: number): number, describing what the function hands back.",
        "TypeScript flags a call site error immediately if you pass the wrong type of argument or the wrong number of arguments, before the function ever runs.",
      ],
      notes:
        "Typing a function is really two separate decisions: what types come in (the parameters) and what type goes out (the return value). Both are checked independently every time the function is called.",
      conceptExplanation:
        "function calculateArea(width: number, height: number): number declares that calculateArea only accepts two numbers and always hands back a number. If you call calculateArea(\"5\", 3), TypeScript reports the mismatch immediately at that call site, pointing at the exact argument that does not match, without ever running the function.",
      whyItMatters: "Typed function signatures are effectively a contract: anyone calling your function, including future you, gets an immediate, precise error if they use it incorrectly.",
      practicalTask:
        "In main.ts, write a function calculateArea(width: number, height: number): number that returns the product of its two parameters. Call it twice with different numbers, store each result in a variable, and log both.",
      challenge: "Try calling calculateArea() with a string as one of the arguments and read the error the workspace reports, then remove that broken call.",
      expectedResult: "main.ts logs two correctly calculated areas, and the deliberate mismatched call was caught and removed.",
      tests: [
        "calculateArea has explicit parameter types and a return type",
        "The function is called at least twice with valid number arguments",
      ],
      hint: "The return type comes after the parameter list: function name(param: type): returnType { ... }",
      lessonAssessment: [
        {
          question: "Where does a function's return type annotation go?",
          options: [
            "Before the function keyword",
            "Immediately after each parameter",
            "After the closing parenthesis of the parameter list",
            "Inside the function body only",
          ],
          correctAnswerIndex: 2,
          explanation: "The return type is written after the parameter list's closing parenthesis, before the opening brace.",
        },
        {
          question: "What does TypeScript do if you call a function with a string argument where a parameter is typed number?",
          options: [
            "Automatically converts the string to a number",
            "Reports a type error at the call site",
            "Ignores the mismatch and runs it anyway",
            "Only warns during production builds",
          ],
          correctAnswerIndex: 1,
          explanation: "Mismatched argument types are reported immediately at the call site, before the function runs.",
        },
      ],
      commonMistakes: [
        "Forgetting the return type entirely, missing a chance for TypeScript to check the function's output.",
        "Placing the return type before the function name instead of after the parameter list.",
      ],
      deliverables: ["main.ts with a fully typed function called at least twice"],
      assessmentCriteria: ["Parameter and return types are correct", "Function is reused with different arguments"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "typescript",
        code: 'function calculateArea(width: number, height: number): number {\n  return width * height;\n}\n\nconst area1 = calculateArea(5, 3);\nconst area2 = calculateArea(10, 2);\nconsole.log(area1, area2);',
        explanation: 'Both parameters and the return value are typed as number, so calling calculateArea("5", 3) would be flagged as an error before the code ever runs.',
      },
      completionStatus: "not_started",
    },
    {
      title: "Optional Parameters, Default Parameters, and void",
      goal: "Use optional and default parameters, and understand the void return type.",
      videoTitle: "TypeScript Optional and Default Parameters",
      videoSearchQuery: "typescript optional parameters default parameters void tutorial",
      videoLearningGoal: "See a function with an optional parameter marked with ?, a default parameter value, and a function that returns void because it only logs output.",
      recommendedChannels: ["Matt Pocock", "freeCodeCamp.org"],
      keyTakeaways: [
        "Adding a ? after a parameter name, like greeting?: string, makes it optional: callers may omit it entirely.",
        "A default parameter, like greeting: string = \"Hello\", supplies a fallback value automatically when the caller omits the argument, and also makes the parameter optional.",
        "void is the return type for a function that does not return a usable value, such as one that only calls console.log().",
      ],
      notes:
        "Optional and default parameters both let a caller skip an argument, but they behave differently inside the function body: an optional parameter can be undefined, while a default parameter is guaranteed to have a real value.",
      conceptExplanation:
        "A required parameter must always come before any optional or default parameter in the parameter list, because TypeScript needs to know, in order, which arguments a caller is allowed to skip from the end. void differs from a function that explicitly returns the value undefined on purpose: void simply signals 'this function is called for its side effects, not for its return value'.",
      whyItMatters: "Optional and default parameters let a single function handle both common and uncommon calling patterns cleanly, without forcing every caller to pass every argument.",
      practicalTask:
        'In main.ts, write a function greetUser(name: string, greeting: string = "Hello"): void that logs a greeting combining both parameters. Call it once with both arguments and once with only the name, relying on the default.',
      challenge: "Change the greeting parameter from a default value to an optional parameter (greeting?: string) instead, and adjust the function body to handle the case where greeting is undefined.",
      expectedResult: "main.ts logs two different greetings: one using a custom greeting and one using the default (or handled optional) value.",
      tests: [
        "greetUser has a default or optional parameter for greeting",
        "The function is called both with and without the greeting argument",
      ],
      hint: 'A default parameter looks like: function greetUser(name: string, greeting: string = "Hello"): void',
      lessonAssessment: [
        {
          question: "What does adding a ? after a parameter name do, like greeting?: string?",
          options: [
            "Makes the parameter required",
            "Makes the parameter optional, allowing callers to omit it",
            "Turns the parameter into a boolean",
            "Removes the parameter's type entirely",
          ],
          correctAnswerIndex: 1,
          explanation: "The ? marks a parameter as optional, so calls that omit it are still valid.",
        },
        {
          question: "What does the void return type indicate about a function?",
          options: [
            "The function always returns null",
            "The function does not return a usable value",
            "The function returns any type",
            "The function cannot have parameters",
          ],
          correctAnswerIndex: 1,
          explanation: "void signals that a function is used for its side effects rather than for a returned value.",
        },
      ],
      commonMistakes: [
        "Placing an optional or default parameter before a required parameter, which TypeScript does not allow.",
        "Confusing void (no meaningful return) with explicitly returning the value undefined on purpose.",
      ],
      deliverables: ["main.ts with a function using an optional or default parameter, called both ways"],
      assessmentCriteria: ["Optional/default parameter used correctly", "Both call variations produce correct, different output"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "typescript",
        code: 'function greetUser(name: string, greeting: string = "Hello"): void {\n  console.log(`${greeting}, ${name}!`);\n}\n\ngreetUser("Ada", "Welcome back");\ngreetUser("Sam");',
        explanation: 'The second call omits greeting entirely, so the default value "Hello" is used automatically; the function returns void because it only logs output.',
      },
      completionStatus: "not_started",
    },
    {
      title: "Writing a Function Type",
      goal: "Describe a function's shape using a standalone function type, separate from any specific implementation.",
      videoTitle: "TypeScript Function Types Explained",
      videoSearchQuery: "typescript function type alias explained tutorial",
      videoLearningGoal: "See a function type written with a type alias, like a MathOperation type, and a variable annotated with it.",
      recommendedChannels: ["Total TypeScript", "Ben Awad"],
      keyTakeaways: [
        "A function type describes the shape of a function, its parameter types and return type, without providing an implementation, written like (a: number, b: number) => number.",
        "A type alias, created with the type keyword, gives a function type a reusable name, such as type MathOperation = (a: number, b: number) => number.",
        "Any function assigned to a variable annotated with that function type must match its parameter and return types exactly.",
      ],
      notes:
        "Instead of repeating the same parameter and return types on every function that should behave the same way, a function type lets you name that shape once and reuse it.",
      conceptExplanation:
        "type MathOperation = (a: number, b: number) => number; defines a reusable shape: any value assigned to a MathOperation-typed variable must be a function taking two numbers and returning a number. This is especially useful when you plan to swap in different functions that all need to fit the same shape, like passing different callback functions around.",
      whyItMatters: "Function types are the building block for passing functions around safely, such as callbacks, which becomes increasingly common as your programs grow.",
      practicalTask:
        "In main.ts, define a function type named MathOperation for a function that takes two numbers and returns a number. Declare a variable typed as MathOperation and assign it an arrow function that adds its two parameters. Call it and log the result.",
      challenge: "Declare a second variable, also typed MathOperation, assigned to a different arrow function such as one that multiplies, and log its result too.",
      expectedResult: "main.ts logs the results of at least two different functions, both matching the same MathOperation function type.",
      tests: [
        "A function type named MathOperation is defined with type",
        "At least one variable typed as MathOperation is assigned a matching arrow function and called",
      ],
      hint: "A function type alias looks like: type MathOperation = (a: number, b: number) => number;",
      lessonAssessment: [
        {
          question: "What does the function type (a: number, b: number) => number describe?",
          options: [
            "A variable holding two numbers",
            "A function that takes two number parameters and returns a number",
            "An array of two numbers",
            "A tuple of two numbers",
          ],
          correctAnswerIndex: 1,
          explanation: "This syntax describes a function's shape: its parameter types on the left of =>, and its return type on the right.",
        },
        {
          question: "What keyword creates a reusable name for a function type in TypeScript?",
          options: ["interface", "function", "type", "class"],
          correctAnswerIndex: 2,
          explanation: "The type keyword creates a type alias, which can name a function type for reuse.",
        },
      ],
      commonMistakes: [
        "Confusing a function type, which describes a shape, with an actual function implementation.",
        "Assigning a function with mismatched parameter or return types to a variable typed with a specific function type.",
      ],
      deliverables: ["main.ts defining a MathOperation function type and at least two matching functions"],
      assessmentCriteria: ["Function type alias is defined correctly", "Both assigned functions match the declared function type"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "typescript",
        code: 'type MathOperation = (a: number, b: number) => number;\n\nconst add: MathOperation = (a, b) => a + b;\nconst multiply: MathOperation = (a, b) => a * b;\n\nconsole.log(add(4, 5), multiply(4, 5));',
        explanation: "MathOperation describes any function taking two numbers and returning a number; both add and multiply match that shape and TypeScript infers their parameter types from it.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Functions with Types Assessment",
    questions: [
      {
        question: "In function add(a: number, b: number): number, what does the final ': number' describe?",
        options: ["A parameter type", "The function's return type", "A variable name", "A default value"],
        correctAnswerIndex: 1,
        explanation: "The final annotation, after the parameter list, is the function's return type.",
      },
      {
        question: "What happens if you call a function with fewer arguments than its required parameters?",
        options: [
          "TypeScript fills in default values automatically",
          "TypeScript reports a type error at the call site",
          "The missing parameters become undefined silently with no error",
          "The function runs but skips the missing logic",
        ],
        correctAnswerIndex: 1,
        explanation: "Missing required arguments are flagged as an error at the point of the call.",
      },
      {
        question: "Which parameter declaration marks greeting as optional?",
        options: ["greeting: string!", "greeting?: string", "greeting: string*", "optional greeting: string"],
        correctAnswerIndex: 1,
        explanation: "A ? after the parameter name marks it optional.",
      },
      {
        question: "What does 'greeting: string = \"Hello\"' provide when a caller omits the argument?",
        options: ["undefined", "An empty string", "The default value \"Hello\"", "A type error"],
        correctAnswerIndex: 2,
        explanation: "Default parameters supply a fallback value automatically when the caller omits the argument.",
      },
      {
        question: "Which return type indicates a function is used only for its side effects, like logging, not for a returned value?",
        options: ["any", "unknown", "void", "never"],
        correctAnswerIndex: 2,
        explanation: "void is the conventional return type for functions that do not return a usable value.",
      },
      {
        question: "Where must required parameters be positioned relative to optional or default parameters?",
        options: [
          "Required parameters must come after optional ones",
          "Required parameters must come before optional or default ones",
          "Order does not matter at all",
          "Required parameters cannot be combined with optional ones",
        ],
        correctAnswerIndex: 1,
        explanation: "Optional and default parameters must follow required ones so TypeScript can tell which trailing arguments may be omitted.",
      },
      {
        question: "What does the function type (a: number, b: number) => number describe?",
        options: [
          "A specific function implementation",
          "The shape of a function: its parameter types and return type",
          "An interface for an object",
          "A tuple containing two numbers",
        ],
        correctAnswerIndex: 1,
        explanation: "A function type describes shape only, with no implementation of its own.",
      },
      {
        question: "Which keyword is used to create a reusable name for a function type?",
        options: ["function", "type", "interface", "class"],
        correctAnswerIndex: 1,
        explanation: "type creates a type alias that can name a function type, like type MathOperation = ...",
      },
      {
        question: "If MathOperation is typed as (a: number, b: number) => number, which function can be assigned to a MathOperation variable?",
        options: [
          "(a: string, b: string) => string",
          "(a: number, b: number) => number",
          "(a: number) => number",
          "(a: number, b: number) => string",
        ],
        correctAnswerIndex: 1,
        explanation: "Only a function whose parameter and return types match the MathOperation shape exactly can be assigned to it.",
      },
      {
        question: "Why is typing a function's parameters and return value useful, beyond documentation?",
        options: [
          "It makes the function run faster",
          "TypeScript checks every call site against the declared types, catching mismatches immediately",
          "It removes the need to call the function",
          "It automatically generates test cases",
        ],
        correctAnswerIndex: 1,
        explanation: "Typed signatures act as an enforced contract that TypeScript checks at every call site.",
      },
    ],
  },
  assignment:
    "Write a 'Temperature Converter' toolkit in the Academy workspace: define two fully typed functions, celsiusToFahrenheit(celsius: number): number and fahrenheitToCelsius(fahrenheit: number): number, each using return to send back the converted value. Call each function with at least two different test values and log the results in readable sentences.",
  assignmentDeliverables: ["main.ts with two fully typed functions", "At least 4 total function calls with logged, readable results"],
  assignmentAssessmentCriteria: [
    "Both conversion formulas are correct",
    "Parameter and return types are correctly annotated on both functions",
  ],
  miniProject:
    "Build a 'Grade Calculator Toolkit': write a function averageScore(scores: number[]): number that returns the average of a numeric array, and a function letterGrade(average: number): string that returns the corresponding letter grade. Combine them by passing a typed array of test scores through both functions and logging the final letter grade.",
  miniProjectDeliverables: ["grade_calculator.ts in the Academy workspace", "Output showing the average and final letter grade for at least 2 different score arrays"],
  miniProjectAssessmentCriteria: [
    "averageScore() correctly calculates the mean with correct types",
    "letterGrade() correctly returns the right grade with a correct return type",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
