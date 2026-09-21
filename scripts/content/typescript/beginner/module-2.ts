import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module2: GeneratedModule = {
  title: "Basic Types & Type Annotations",
  description:
    "Work confidently with TypeScript's core primitive and array types, and understand why any is dangerous compared to the safer unknown.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Primitive Types: string, number, and boolean",
      goal: "Confidently annotate and work with TypeScript's three core primitive types.",
      videoTitle: "TypeScript Primitive Types: string, number, boolean",
      videoSearchQuery: "typescript primitive types string number boolean tutorial",
      videoLearningGoal: "See string, number, and boolean values annotated and used together, including what happens when they are mixed incorrectly.",
      recommendedChannels: ["Total TypeScript", "freeCodeCamp.org"],
      keyTakeaways: [
        "TypeScript's three basic primitive types are string (text), number (all numbers), and boolean (true or false).",
        "TypeScript does not distinguish integers from decimals: both 5 and 5.5 are typed as number.",
        "Combining mismatched primitive types incorrectly, like treating a boolean as a number, is flagged by the type checker.",
      ],
      notes:
        "These three primitive types cover most simple values you will work with: string for text, number for any numeric value, and boolean for true/false flags. Getting comfortable annotating them is the foundation for everything else in this course.",
      conceptExplanation:
        "Unlike some languages, TypeScript has no separate int, float, or double type: every numeric value, whole or decimal, is simply number. Template literals (backtick strings using ${}) are the cleanest way to combine typed values of different kinds into one readable string, and they work exactly the same as in plain JavaScript.",
      whyItMatters: "These three types appear constantly, in variables, function parameters, and object properties, so fluency here makes every later module easier.",
      practicalTask:
        "In main.ts, declare a string variable holding a product name, a number variable holding its price, and a boolean variable indicating whether it is in stock, all with explicit annotations. Log a single sentence combining all three using a template literal (backticks with ${}).",
      challenge: "If you used string concatenation with + for the console.log() line, rewrite it using a template literal instead, and compare the readability.",
      expectedResult: "main.ts logs one readable sentence describing the product, built from correctly typed string, number, and boolean variables.",
      tests: [
        "All three variables have explicit type annotations matching their values",
        "The final console.log() uses a template literal",
      ],
      hint: "A template literal looks like this, using backticks instead of quotes: `${productName} costs $${price}`",
      lessonAssessment: [
        {
          question: "Which TypeScript type represents both 5 and 5.5?",
          options: ["int", "float", "number", "decimal"],
          correctAnswerIndex: 2,
          explanation: "TypeScript has one numeric type, number, covering both whole numbers and decimals.",
        },
        {
          question: "What is the TypeScript type of true and false values?",
          options: ["bool", "boolean", "bit", "flag"],
          correctAnswerIndex: 1,
          explanation: "boolean is the TypeScript type name for true/false values.",
        },
      ],
      commonMistakes: [
        "Trying to use separate int/float types that do not exist in TypeScript.",
        "Mixing string concatenation and template literals inconsistently in the same file.",
      ],
      deliverables: ["main.ts with three explicitly typed primitive variables and one template literal log"],
      assessmentCriteria: ["Types match values correctly", "Output reads as one clear sentence"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 minutes",
      codeExample: {
        language: "typescript",
        code: 'let productName: string = "Wireless Mouse";\nlet price: number = 19.99;\nlet inStock: boolean = true;\n\nconsole.log(`${productName} costs $${price} and is ${inStock ? "in stock" : "out of stock"}.`);',
        explanation: "Each variable is explicitly typed, and the template literal combines all three into one readable sentence using backticks and ${}.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Typing Arrays and a First Look at Tuples",
      goal: "Annotate arrays of a single type and understand how a tuple differs from a regular array.",
      videoTitle: "TypeScript Arrays and Tuples Explained",
      videoSearchQuery: "typescript arrays and tuples for beginners explained",
      videoLearningGoal: "See array types written as Type[] and a fixed-length tuple type written with square brackets containing specific types in order.",
      recommendedChannels: ["Web Dev Simplified", "Matt Pocock"],
      keyTakeaways: [
        "An array of a single type is annotated as Type[], such as string[] for an array of strings or number[] for an array of numbers.",
        "A tuple is a fixed-length array where each position has its own specific type, written like [string, number].",
        "TypeScript enforces both the length and the type of each position in a tuple, unlike a regular array which can grow or shrink freely.",
      ],
      notes:
        "Most of the time you will type arrays with Type[]. Tuples are a more specific tool: use them when you have a small, fixed, ordered group of values where position carries meaning, like a name paired with a score.",
      conceptExplanation:
        "string[] means 'zero or more strings, in any quantity'. A tuple like [string, number] means 'exactly two values, a string first, then a number', and TypeScript checks the type of each position independently rather than treating the tuple as one big pool of allowed types.",
      whyItMatters: "Choosing the right shape, a flexible array versus a fixed tuple, communicates intent clearly and catches mistakes like forgetting an element or swapping the order.",
      practicalTask:
        "In main.ts, declare a string[] array of at least three favorite foods and a number[] array of at least three lucky numbers. Log both arrays. Then declare a tuple named player typed as [string, number] holding a player's name and score, and log it.",
      challenge: "Try pushing a number into your string[] favorite foods array and read the error the workspace reports, then remove that broken line.",
      expectedResult: "main.ts logs the two arrays and the tuple, and runs without leftover type errors.",
      tests: [
        "A string[] array and a number[] array are both declared and logged",
        "A tuple typed as [string, number] is declared and logged",
      ],
      hint: 'A tuple annotation looks like: let player: [string, number] = ["Ada", 100];',
      lessonAssessment: [
        {
          question: "How do you annotate an array of numbers in TypeScript?",
          options: ["Array<string>", "number[]", "[number]", "numbers[]"],
          correctAnswerIndex: 1,
          explanation: "number[] is the standard shorthand for an array whose elements are all of type number.",
        },
        {
          question: "What makes a tuple different from a regular typed array like string[]?",
          options: [
            "Tuples can only hold numbers",
            "A tuple has a fixed length with a specific type for each position",
            "Tuples cannot be logged with console.log()",
            "There is no difference",
          ],
          correctAnswerIndex: 1,
          explanation: "A tuple type checks each position's type individually and enforces a fixed length, unlike a flexible array of a single type.",
        },
      ],
      commonMistakes: [
        "Writing the brackets before the type name instead of after, like []string instead of string[].",
        "Treating a tuple like a regular array and expecting to push extra items onto it freely.",
      ],
      deliverables: ["main.ts with a string[] array, a number[] array, and a [string, number] tuple"],
      assessmentCriteria: ["Array types correctly match their contents", "Tuple has exactly two elements in the correct order and types"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "typescript",
        code: 'let favoriteFoods: string[] = ["jollof rice", "suya", "plantain"];\nlet luckyNumbers: number[] = [7, 14, 21];\nlet player: [string, number] = ["Ada", 100];\n\nconsole.log(favoriteFoods, luckyNumbers, player);',
        explanation: "favoriteFoods and luckyNumbers are typed arrays of a single type, while player is a tuple with exactly two positions: a string first, then a number.",
      },
      completionStatus: "not_started",
    },
    {
      title: "any vs unknown and Why any Is Dangerous",
      goal: "Understand what any and unknown mean, and why relying on any defeats the purpose of using TypeScript.",
      videoTitle: "TypeScript any vs unknown Explained",
      videoSearchQuery: "typescript any vs unknown explained for beginners",
      videoLearningGoal: "See a value typed as any accept anything with zero checking, versus a value typed as unknown that must be narrowed before use.",
      recommendedChannels: ["Total TypeScript", "Ben Awad"],
      keyTakeaways: [
        "A variable typed any turns off type checking completely for that value: you can assign anything to it and call any method on it with no error, even if it is wrong.",
        "A variable typed unknown can also hold any value, but TypeScript forces you to check (narrow) its actual type before you are allowed to use it in most ways.",
        "unknown is the safer choice whenever a value's type genuinely is not known ahead of time, because it keeps the type checker involved instead of disabling it.",
      ],
      notes:
        "any and unknown can both initially hold any kind of value, but they behave very differently once you try to use that value. any is the escape hatch of last resort; unknown is the responsible version of that same idea.",
      conceptExplanation:
        "If a variable is typed any, calling a method that does not actually exist on the real value at runtime, like calling .toUpperCase() on something that turns out to be a number, compiles with no warning at all, and only fails when the program actually runs. If the same variable is typed unknown instead, TypeScript refuses to let you call .toUpperCase() on it until you first prove what it is, usually with a typeof check, which prevents that exact mistake from slipping through unchecked.",
      whyItMatters: "Reaching for any might feel like it 'fixes' a type error, but it actually just hides the problem instead of solving it, silently removing TypeScript's safety net for that value.",
      practicalTask:
        "In main.ts, declare a variable typed any holding a number, then call a string method on it like .toUpperCase() and notice that the workspace allows this without complaint, even though it would fail if actually run against a number. Then declare a second variable typed unknown holding the same kind of value, and try calling .toUpperCase() on it directly, observing that TypeScript blocks it until you add a typeof check.",
      challenge: 'Add an if (typeof value === "string") check around the unknown variable\'s usage so the method call is now allowed, and log the result.',
      expectedResult: "main.ts demonstrates that any accepts an incorrect method call silently, while unknown requires a typeof check before the same call is allowed.",
      tests: [
        "A variable typed any is shown accepting a mismatched method call without a type error",
        "A variable typed unknown only allows the method call after a typeof narrowing check",
      ],
      hint: 'Narrowing an unknown value looks like: if (typeof value === "string") { value.toUpperCase(); }',
      lessonAssessment: [
        {
          question: "What happens when you call a method that does not actually match the runtime value on a variable typed any?",
          options: [
            "TypeScript blocks it immediately",
            "TypeScript allows it with no compile-time error, even if it is wrong",
            "It is automatically converted to the correct type",
            "any cannot hold that kind of value",
          ],
          correctAnswerIndex: 1,
          explanation: "any turns off type checking entirely for that value, so mismatched method calls compile without any warning.",
        },
        {
          question: "What must you do before using a value typed unknown as a specific type, like calling a string method on it?",
          options: [
            "Nothing, unknown works exactly like any",
            "Narrow its type first, such as with a typeof check",
            "Convert it to any first",
            "Wrap it in an array",
          ],
          correctAnswerIndex: 1,
          explanation: "unknown requires a narrowing check before you can use type-specific methods or properties on it.",
        },
      ],
      commonMistakes: [
        "Reaching for any whenever a type is unclear instead of taking a moment to model it correctly.",
        "Assuming unknown behaves the same as any because both can initially hold any value.",
      ],
      deliverables: ["main.ts demonstrating both an any variable and a narrowed unknown variable"],
      assessmentCriteria: ["Difference between any and unknown is clearly demonstrated", "unknown value is properly narrowed with typeof before use"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 minutes",
      codeExample: {
        language: "typescript",
        code: 'let valueA: any = 42;\nconsole.log(valueA.toUpperCase()); // No compile error here, but this would crash at runtime\n\nlet valueB: unknown = 42;\nif (typeof valueB === "string") {\n  console.log(valueB.toUpperCase()); // Only allowed after narrowing, so this branch never even runs for a number\n} else {\n  console.log("valueB is not a string");\n}',
        explanation: "any lets the incorrect .toUpperCase() call through with no warning, while unknown forces a typeof check first, preventing the same mistake from compiling unchecked.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Basic Types & Type Annotations Assessment",
    questions: [
      {
        question: "What TypeScript type represents text values like \"hello\"?",
        options: ["text", "string", "char", "str"],
        correctAnswerIndex: 1,
        explanation: "string is the TypeScript type for text values.",
      },
      {
        question: "How many distinct numeric types does TypeScript provide for whole numbers versus decimals?",
        options: ["Two: int and float", "Three: int, float, and double", "One: number, covering both", "None, numbers must be strings"],
        correctAnswerIndex: 2,
        explanation: "TypeScript uses a single number type for all numeric values, whole or decimal.",
      },
      {
        question: "Which annotation correctly types an array of strings?",
        options: ["string[]", "[string]", "Array(string)", "string{}"],
        correctAnswerIndex: 0,
        explanation: "string[] is the shorthand syntax for an array whose elements are all strings.",
      },
      {
        question: "What does the tuple type [string, number] require?",
        options: [
          "Any number of strings followed by any number of numbers",
          "Exactly two elements: a string first, then a number",
          "Exactly two numbers",
          "A string or a number, but only one value total",
        ],
        correctAnswerIndex: 1,
        explanation: "A tuple checks each position's type individually and expects an exact length matching the declared positions.",
      },
      {
        question: "What does typing a variable as any do to type checking for that value?",
        options: [
          "It makes checking stricter",
          "It turns off type checking for that value entirely",
          "It restricts the value to numbers only",
          "It has no effect at all",
        ],
        correctAnswerIndex: 1,
        explanation: "any disables TypeScript's type checking for that value, allowing any operation without a compile-time error.",
      },
      {
        question: "What is required before using an unknown-typed value as a specific type?",
        options: [
          "Nothing, it can be used immediately",
          "Narrowing it first, such as with a typeof check",
          "Converting it to any",
          "Declaring it with const instead of let",
        ],
        correctAnswerIndex: 1,
        explanation: "unknown forces you to narrow the value's type before treating it as anything more specific.",
      },
      {
        question: "Which type is generally considered the safer choice for a value whose type is not known ahead of time?",
        options: ["any", "unknown", "void", "never"],
        correctAnswerIndex: 1,
        explanation: "unknown keeps the type checker involved by requiring narrowing, unlike any which disables checking.",
      },
      {
        question: "What would TypeScript report if you tried to push a number into an already-declared string[] array?",
        options: [
          "Nothing, arrays accept any type",
          "A type error, since the array is typed to hold only strings",
          "The number is automatically converted to a string",
          "The array is automatically retyped",
        ],
        correctAnswerIndex: 1,
        explanation: "A string[] array only accepts strings; pushing a number is a type error.",
      },
      {
        question: "What is the purpose of a template literal, like `${name} is here`?",
        options: [
          "To declare a new type",
          "To combine typed values into a single readable string using backticks and ${}",
          "To create a tuple",
          "To disable type checking",
        ],
        correctAnswerIndex: 1,
        explanation: "Template literals let you embed variables directly inside a backtick-delimited string using ${}.",
      },
      {
        question: "Why is overusing any across a codebase considered risky?",
        options: [
          "It makes the code run slower",
          "It quietly removes TypeScript's safety checks wherever it is used, hiding potential bugs",
          "It is not valid TypeScript syntax",
          "It only works for numbers",
        ],
        correctAnswerIndex: 1,
        explanation: "Every any effectively creates a blind spot where the type checker stops protecting you.",
      },
    ],
  },
  assignment:
    "Build a 'Typed Inventory List' script in the Academy workspace: declare a string[] array of at least four product names and a number[] array of matching prices in the same order and length, then use a loop to log each product paired with its price using a template literal.",
  assignmentDeliverables: [
    "main.ts with a string[] array and a matching number[] array",
    "A loop that logs each product-price pair using a template literal",
  ],
  assignmentAssessmentCriteria: [
    "Arrays are correctly typed and the same length",
    "Loop output pairs each product with the correct price",
  ],
  miniProject:
    "Extend the inventory script into a 'Typed Catalog Report': add a tuple array typed as [string, number][] (an array of tuples) representing the same product-price pairs in a single structure instead of two separate arrays, then loop through it to log a formatted report line for each entry plus a total of all prices at the end.",
  miniProjectDeliverables: ["catalog_report.ts in the Academy workspace", "Output showing each formatted report line and a correct total"],
  miniProjectAssessmentCriteria: [
    "The tuple array is typed and structured correctly",
    "The total price is calculated correctly from the tuple array",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
