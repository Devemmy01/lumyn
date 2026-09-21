import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module5: GeneratedModule = {
  title: "Union Types, Literal Types & Narrowing",
  description:
    "Combine multiple types with unions and literals, and safely narrow them with typeof, instanceof, and a first discriminated union.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Union Types: Allowing More Than One Type",
      goal: "Declare a union type allowing a value to be one of several specific types, and understand why TypeScript restricts what you can do with it before narrowing.",
      videoTitle: "TypeScript Union Types Explained",
      videoSearchQuery: "typescript union types explained for beginners",
      videoLearningGoal: "See a union type written with the | symbol, and the error that appears when you try to use a method that is not valid for every type in the union.",
      recommendedChannels: ["Total TypeScript", "Matt Pocock"],
      keyTakeaways: [
        "A union type, written with |, like string | number, means a value can be either type, but only from that set of types.",
        "Without narrowing first, TypeScript only allows operations that are valid for every type in the union, not just one of them.",
        "Union types are commonly used for function parameters that legitimately accept more than one kind of value, such as an id that might be a number or a string.",
      ],
      notes:
        "A union type is TypeScript's way of saying 'this could be more than one type', which is common in real programs: an id might come in as a number from a database or a string from a URL.",
      conceptExplanation:
        "function printId(id: string | number): void accepts either a string or a number for id. Inside the function body, before doing any narrowing, TypeScript only lets you use operations that work for both possibilities, since it cannot yet know which one id actually is on any given call.",
      whyItMatters: "Union types let a single function or variable model realistic data shapes accurately, instead of forcing everything into one overly broad type like any.",
      practicalTask:
        "In main.ts, write a function printId(id: string | number): void that logs the id. Call it once with a number argument and once with a string argument.",
      challenge: "Inside printId, try calling a string-only method like .toUpperCase() directly on id without narrowing first, and read the error the workspace reports, then remove that line so the file runs cleanly.",
      expectedResult: "main.ts logs the id twice, once as a number and once as a string, using the same union-typed function both times.",
      tests: [
        "printId has a parameter typed string | number",
        "The function is called once with a number and once with a string",
      ],
      hint: "A union type is written by placing | between the allowed types: id: string | number",
      lessonAssessment: [
        {
          question: "What does the type 'string | number' mean for a parameter?",
          options: [
            "The parameter must be both a string and a number at once",
            "The parameter can be either a string or a number",
            "The parameter is always converted to a string",
            "The parameter type is invalid syntax",
          ],
          correctAnswerIndex: 1,
          explanation: "A union type allows a value to be any one of the listed types, not all of them simultaneously.",
        },
        {
          question: "Why does TypeScript block calling a string-only method directly on a value typed string | number without narrowing?",
          options: [
            "Because union types cannot have methods at all",
            "Because the value might actually be a number at runtime, which has no such method",
            "Because | is only valid for arrays",
            "It does not block this; it is always allowed",
          ],
          correctAnswerIndex: 1,
          explanation: "TypeScript only allows operations valid for every type in the union until the value is narrowed to a specific one.",
        },
      ],
      commonMistakes: [
        "Assuming a union-typed value can immediately use every method available on any of its possible types.",
        "Writing 'string, number' instead of 'string | number', which is invalid union syntax.",
      ],
      deliverables: ["main.ts with a function using a string | number union parameter, called both ways"],
      assessmentCriteria: ["Union type syntax is correct", "Function is correctly called with both valid types"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "typescript",
        code: 'function printId(id: string | number): void {\n  console.log(`Id: ${id}`);\n}\n\nprintId(101);\nprintId("ORD-101");',
        explanation: "id can legally be either a number or a string because of the string | number union, and printId works correctly for both.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Literal Types and Combining Them With Unions",
      goal: "Restrict a value to specific literal values and combine literal types into a union.",
      videoTitle: "TypeScript Literal Types Explained",
      videoSearchQuery: "typescript literal types union tutorial for beginners",
      videoLearningGoal: "See a variable restricted to a small set of exact string values using a literal type union, and the error that appears when an invalid value is assigned.",
      recommendedChannels: ["Web Dev Simplified", "Total TypeScript"],
      keyTakeaways: [
        "A literal type restricts a value to one exact value, such as the literal type \"pending\", rather than the general string type.",
        "Combining literal types with a union, like \"pending\" | \"shipped\" | \"delivered\", restricts a value to only those specific options.",
        "Assigning any value outside the listed literals to a literal-type union is a compile-time error, unlike the general string type which accepts any text.",
      ],
      notes:
        "Literal types turn specific values into their own tiny types. Combined with a union, they describe a fixed, closed set of valid options, which the general string type cannot express on its own.",
      conceptExplanation:
        'type Status = "pending" | "shipped" | "delivered"; means a Status-typed value must be exactly one of those three strings, nothing else. This catches typos like "shippped" immediately, something a plain string type would happily allow through.',
      whyItMatters: "Literal unions are how TypeScript models a fixed set of valid states or options, catching invalid values at compile time instead of letting a typo slip into production.",
      practicalTask:
        'In main.ts, define a variable named orderStatus typed as "pending" | "shipped" | "delivered" and assign it one of those three values. Log it. Then write a function updateStatus(status: "pending" | "shipped" | "delivered"): void that logs a message describing the new status, and call it with each of the three valid values.',
      challenge: 'Try assigning orderStatus a value outside the three allowed literals, like "cancelled", and read the error the workspace reports, then remove that line.',
      expectedResult: "main.ts logs the order status and three calls to updateStatus(), one for each valid literal value.",
      tests: [
        "orderStatus is typed with a union of exactly three string literals",
        "updateStatus is called once with each of the three valid literal values",
      ],
      hint: 'A literal type union looks like: type Status = "pending" | "shipped" | "delivered";',
      lessonAssessment: [
        {
          question: 'What does the type "pending" | "shipped" | "delivered" allow?',
          options: [
            "Any string value at all",
            "Only one of those three exact string values",
            'Only the word "pending"',
            "Any number between 1 and 3",
          ],
          correctAnswerIndex: 1,
          explanation: "A literal type union restricts a value to exactly the listed literal options, nothing more.",
        },
        {
          question: 'What happens if you assign "cancelled" to a variable typed "pending" | "shipped" | "delivered"?',
          options: [
            "It is allowed since it is still a string",
            'TypeScript reports a type error, since "cancelled" is not one of the listed literals',
            'It is automatically converted to "pending"',
            "It only fails at runtime, never at compile time",
          ],
          correctAnswerIndex: 1,
          explanation: "Any value outside the listed literals is a compile-time type error for a literal union.",
        },
      ],
      commonMistakes: [
        "Using the general string type when a small, fixed set of literal values would catch typos at compile time.",
        "Forgetting quotes around each literal in the union, which changes the meaning entirely.",
      ],
      deliverables: ["main.ts with a literal type union variable and a function using the same union type"],
      assessmentCriteria: ["Literal type union is defined correctly", "All usages stay within the allowed literal values"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "typescript",
        code: 'type Status = "pending" | "shipped" | "delivered";\n\nfunction updateStatus(status: Status): void {\n  console.log(`Order status is now: ${status}`);\n}\n\nupdateStatus("pending");\nupdateStatus("shipped");\nupdateStatus("delivered");',
        explanation: 'Status only allows the three listed literal strings; calling updateStatus("cancelled") would be a compile-time error since it is not one of them.',
      },
      completionStatus: "not_started",
    },
    {
      title: "Narrowing With typeof and instanceof, and a First Taste of Discriminated Unions",
      goal: "Narrow a union type using typeof and instanceof checks, and see a basic discriminated union pattern.",
      videoTitle: "TypeScript Narrowing and Discriminated Unions Introduction",
      videoSearchQuery: "typescript narrowing typeof instanceof discriminated union basics",
      videoLearningGoal: "See a union type narrowed with typeof and instanceof checks inside an if statement, and a simple object union narrowed by a shared kind property.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "Narrowing means using a runtime check, like typeof value === \"string\", so TypeScript knows exactly which type in a union you are working with inside that branch.",
        "instanceof narrows a union between class instances, checking whether a value was created from a specific class.",
        "A discriminated union uses a shared literal property, often called kind, across several object shapes, letting you narrow with a single check on that property instead of checking every field.",
      ],
      notes:
        "Narrowing is what lets you safely 'unlock' the specific behavior of one member of a union, once you have proven at runtime which one you actually have.",
      conceptExplanation:
        'Given interface Circle { kind: "circle"; radius: number; } and interface Square { kind: "square"; side: number; }, a function accepting Circle | Square can check shape.kind === "circle" once, and inside that branch TypeScript narrows shape to Circle specifically, exposing radius safely. This shared literal property pattern is called a discriminated union.',
      whyItMatters: "Discriminated unions are one of the most common and powerful patterns in real TypeScript code, letting you model several related shapes and handle each one safely and distinctly.",
      practicalTask:
        'In main.ts, write a function describeValue(value: string | number): void that uses typeof to check whether value is a string or a number, and logs a different message for each case, using .toUpperCase() only in the string branch and .toFixed(2) only in the number branch. Call it once with a string and once with a number.',
      challenge: 'Define two interfaces, Circle { kind: "circle"; radius: number } and Square { kind: "square"; side: number }, then write a function area(shape: Circle | Square): number that checks shape.kind to decide which formula to use, and call it with one of each shape.',
      expectedResult: "main.ts logs correctly narrowed output for describeValue() with both a string and a number, plus a correctly calculated area for both a Circle and a Square using the discriminated union pattern.",
      tests: [
        "describeValue uses typeof to narrow between string and number before calling a type-specific method",
        "area uses shape.kind to narrow between Circle and Square before calculating",
      ],
      hint: 'Narrowing with typeof looks like: if (typeof value === "string") { ... } else { ... }. Narrowing a discriminated union checks the shared literal property, like if (shape.kind === "circle") { ... }',
      lessonAssessment: [
        {
          question: 'What does narrowing a union type with typeof value === "string" allow you to do inside that branch?',
          options: [
            "Nothing changes; TypeScript still treats value as the full union",
            "Safely use string-only methods, since TypeScript now knows value is a string there",
            "Convert value into a number automatically",
            "Remove the type annotation entirely",
          ],
          correctAnswerIndex: 1,
          explanation: "Once narrowed, TypeScript restricts the value's type to just the branch that was proven true, unlocking type-specific operations.",
        },
        {
          question: "In a discriminated union like Circle | Square, each with its own kind literal property, what does checking shape.kind === \"circle\" let TypeScript do?",
          options: [
            "Nothing useful; kind is ignored by the type checker",
            "Narrow shape to the Circle branch specifically, exposing Circle's own properties like radius",
            "Delete the Square branch permanently",
            "Convert shape into a string",
          ],
          correctAnswerIndex: 1,
          explanation: "Checking the shared literal property narrows the union to the matching interface, exposing its specific properties safely.",
        },
      ],
      commonMistakes: [
        "Trying to access a type-specific property or method on a union value before narrowing it with a check.",
        "Forgetting to give each interface in a discriminated union its own distinct literal value for the shared property.",
      ],
      deliverables: ["main.ts with a typeof-narrowed function and a kind-narrowed discriminated union function"],
      assessmentCriteria: ["typeof narrowing correctly restricts behavior per branch", "Discriminated union narrowing correctly selects the right formula per shape"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25-30 minutes",
      codeExample: {
        language: "typescript",
        code: 'interface Circle {\n  kind: "circle";\n  radius: number;\n}\ninterface Square {\n  kind: "square";\n  side: number;\n}\n\nfunction area(shape: Circle | Square): number {\n  if (shape.kind === "circle") {\n    return Math.PI * shape.radius * shape.radius;\n  }\n  return shape.side * shape.side;\n}\n\nconsole.log(area({ kind: "circle", radius: 3 }));\nconsole.log(area({ kind: "square", side: 4 }));',
        explanation: "Checking shape.kind narrows shape to Circle inside the if branch (exposing radius) and to Square afterward (exposing side), which is the discriminated union pattern.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Union Types, Literal Types & Narrowing Assessment",
    questions: [
      {
        question: "What symbol combines multiple types into a union type?",
        options: ["&", "|", "+", "::"],
        correctAnswerIndex: 1,
        explanation: "The | symbol separates the allowed types in a union type, like string | number.",
      },
      {
        question: "What can a value typed string | number legally hold?",
        options: ["Only a string", "Only a number", "Either a string or a number", "Both a string and a number simultaneously"],
        correctAnswerIndex: 2,
        explanation: "A union type allows the value to be any one of the listed types.",
      },
      {
        question: "Before narrowing, what operations does TypeScript allow on a string | number value?",
        options: [
          "Any string-only method",
          "Any number-only method",
          "Only operations valid for both string and number",
          "No operations at all",
        ],
        correctAnswerIndex: 2,
        explanation: "TypeScript restricts unnarrowed union values to operations valid across every member of the union.",
      },
      {
        question: 'What is "pending" as a type, rather than as a value?',
        options: ["A string array", "A literal type matching only that exact string", "A boolean", "An enum"],
        correctAnswerIndex: 1,
        explanation: 'Used as a type, "pending" is a literal type: it matches only that exact string value.',
      },
      {
        question: 'What happens when a value outside "pending" | "shipped" | "delivered" is assigned to a variable with that type?',
        options: [
          "It is allowed since all three are strings",
          "TypeScript reports a compile-time type error",
          "It becomes undefined automatically",
          "It is silently converted to one of the three values",
        ],
        correctAnswerIndex: 1,
        explanation: "Literal unions restrict a value to exactly the listed options; anything else is a type error.",
      },
      {
        question: 'What does the check typeof value === "string" do inside an if statement?',
        options: [
          "Converts value into a string",
          "Narrows value to the string branch of a union for the rest of that block",
          "Deletes value if it is not a string",
          "Has no effect on typing",
        ],
        correctAnswerIndex: 1,
        explanation: "typeof checks are a standard way to narrow a union type inside a conditional branch.",
      },
      {
        question: "What does instanceof check for narrowing purposes?",
        options: [
          "Whether a value is a string",
          "Whether a value was created from a specific class",
          "Whether a value is an array",
          "Whether a value is undefined",
        ],
        correctAnswerIndex: 1,
        explanation: "instanceof narrows a union between different class instances by checking which class created the value.",
      },
      {
        question: "In a discriminated union, what role does the shared kind property play?",
        options: [
          "It has no special role; it is just a normal property",
          "Checking it in a condition narrows the union to the matching specific shape",
          "It must always be a number",
          "It removes the need for an interface",
        ],
        correctAnswerIndex: 1,
        explanation: "The shared literal property is what a discriminated union checks to narrow between its member shapes.",
      },
      {
        question: 'Given Circle { kind: "circle"; radius: number } and Square { kind: "square"; side: number }, what does shape.kind === "circle" let you safely access inside that branch?',
        options: ["shape.side", "shape.radius", "Neither property", "Both properties equally"],
        correctAnswerIndex: 1,
        explanation: "Narrowing to the circle branch exposes Circle's own property, radius, safely.",
      },
      {
        question: "Why are literal type unions useful for values like an order's status?",
        options: [
          "They allow any text at all, which is more flexible",
          "They restrict the value to a fixed, valid set of options and catch typos at compile time",
          "They make the code run faster",
          "They remove the need for functions",
        ],
        correctAnswerIndex: 1,
        explanation: "Literal unions model a closed set of valid states, catching invalid or misspelled values before the program runs.",
      },
    ],
  },
  assignment:
    "Write a function formatValue(value: string | number | boolean): string in the Academy workspace that uses typeof narrowing to return a different formatted message depending on whether value is a string, number, or boolean. Call it with one of each type and log every result.",
  assignmentDeliverables: [
    "main.ts with a formatValue function narrowing all three types",
    "Three calls to formatValue, one per type, with logged results",
  ],
  assignmentAssessmentCriteria: [
    "typeof narrowing correctly handles all three branches",
    "Each branch produces a distinct, correct message",
  ],
  miniProject:
    "Build a 'Notification Center' mini project: define a discriminated union of three interfaces, InfoNotification, WarningNotification, and ErrorNotification, each with a shared kind literal property and its own extra property such as message, warningCode, or errorCode. Write a function displayNotification(notification: InfoNotification | WarningNotification | ErrorNotification): void that narrows on kind and logs a differently formatted message per notification type, then call it with one example of each kind.",
  miniProjectDeliverables: ["notification_center.ts in the Academy workspace", "Output showing a distinctly formatted message for each of the three notification kinds"],
  miniProjectAssessmentCriteria: [
    "All three interfaces share a correctly typed literal kind property",
    "displayNotification correctly narrows and formats each kind",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
