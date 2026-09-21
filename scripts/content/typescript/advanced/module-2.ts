import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module2: GeneratedModule = {
  title: "Conditional & Mapped Types",
  description:
    "Learn to compute types from other types: branch on a type with conditional types, transform every property of a type with mapped types, and extract nested types with infer.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Conditional Types",
      goal: "Write conditional types using T extends U ? X : Y, and understand how they automatically distribute over union types.",
      videoTitle: "TypeScript Conditional Types Explained",
      videoSearchQuery: "typescript conditional types extends tutorial",
      videoLearningGoal: "See a conditional type evaluated for different type arguments, then see the same conditional type distribute automatically across a union.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "A conditional type T extends U ? X : Y picks X or Y depending on whether T is assignable to U, resolved entirely at compile time with zero runtime cost.",
        "When T is a naked type parameter and the argument passed for it is a union, the conditional type distributes automatically: it evaluates the conditional for each union member and unions the results.",
        "Wrapping both sides in a tuple, like [T] extends [U] ? X : Y, disables distribution when you want to test the union as a single whole instead.",
      ],
      notes:
        "Conditional types let you compute a type based on another type, the same way an if/else expression computes a value based on a condition, except this branching happens entirely during type checking, before your code ever runs.",
      conceptExplanation:
        "type IsString<T> = T extends string ? true : false; then IsString<'hi'> evaluates to true and IsString<42> evaluates to false. The distributive behavior appears when the checked type is a union: type ToArray<T> = T extends any ? T[] : never; used as ToArray<string | number> doesn't produce (string | number)[], it produces string[] | number[], because TypeScript evaluates the conditional separately for string and for number, then unions the two results back together.",
      whyItMatters: "Conditional types are the mechanism behind many built-in utility types like Exclude, Extract, and NonNullable; understanding how they work means you can read their definitions and build your own instead of treating them as magic.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define type IsString<T> = T extends string ? true : false and create a few type aliases like type A = IsString<'hi'> and type B = IsString<42>, then use each as the type of a const variable (const a: A = true) to prove they resolved correctly. Then define type ToArray<T> = T extends any ? T[] : never, create type Result = ToArray<string | number>, and declare a variable typed as Result, assigning it an array of strings, to confirm the union distributed correctly.",
      challenge: "Write your own type NonNullableCustom<T> = T extends null | undefined ? never : T, then use it on a union type like string | null | undefined and confirm, using a variable declaration, that null and undefined were removed.",
      expectedResult: "IsString and ToArray both resolve correctly for their test cases, and ToArray<string | number> distributes into string[] | number[] rather than a single combined array type.",
      tests: [
        "IsString<T> correctly resolves to the literal type true or false depending on whether T extends string",
        "ToArray<string | number> demonstrates distribution by resolving to string[] | number[]",
      ],
      hint: "Distribution only happens when the type being checked is a bare, unwrapped type parameter on the left of extends; wrapping it in a tuple like [T] turns off distribution.",
      lessonAssessment: [
        {
          question: "What does the conditional type T extends U ? X : Y evaluate to?",
          options: [
            "It always evaluates to X",
            "X if T is assignable to U, otherwise Y, resolved at compile time",
            "A runtime boolean check",
            "It causes a compile error unless T equals U exactly",
          ],
          correctAnswerIndex: 1,
          explanation: "A conditional type behaves like an if/else at the type level: it resolves to X when T is assignable to U, and to Y otherwise, entirely during type checking.",
        },
        {
          question: "Why does type ToArray<T> = T extends any ? T[] : never used as ToArray<string | number> resolve to string[] | number[] instead of (string | number)[]?",
          options: [
            "It's a TypeScript bug",
            "Conditional types distribute over a union when the checked type is a naked type parameter, evaluating separately per member",
            "Arrays cannot hold union types, so TypeScript splits them automatically",
            "It doesn't; the result actually is (string | number)[]",
          ],
          correctAnswerIndex: 1,
          explanation: "Because T appears naked (not wrapped) on the left of extends, TypeScript distributes the conditional across each union member and unions the individual results.",
        },
      ],
      commonMistakes: [
        "Expecting a conditional type applied to a union to always produce a single combined type, without accounting for automatic distribution over naked type parameters.",
        "Forgetting that distribution only applies to naked type parameters, then being confused when [T] extends [U] ? X : Y behaves differently from T extends U ? X : Y on the same union.",
      ],
      deliverables: ["main.ts with an IsString conditional type and a ToArray conditional type demonstrating distribution"],
      assessmentCriteria: [
        "IsString correctly resolves true or false for at least two different test types",
        "ToArray<string | number> is shown to distribute into string[] | number[]",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code:
          'type IsString<T> = T extends string ? true : false;\n\ntype A = IsString<"hi">;\ntype B = IsString<42>;\n\nconst a: A = true;\nconst b: B = false;\nconsole.log(a, b);\n\ntype ToArray<T> = T extends any ? T[] : never;\ntype Result = ToArray<string | number>;\n\nconst mixed: Result = ["a", "b", "c"];\nconsole.log(mixed);',
        explanation: "IsString resolves to a literal true or false type per input, while ToArray<string | number> distributes into string[] | number[], so an array of strings alone satisfies the Result type.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Mapped Types: Building Your Own Partial",
      goal: "Build custom mapped types using [K in keyof T], including your own versions of Partial, Readonly, and Required, plus key remapping with as.",
      videoTitle: "TypeScript Mapped Types Explained",
      videoSearchQuery: "typescript mapped types keyof modifiers tutorial",
      videoLearningGoal: "See a mapped type built from scratch by looping over keyof T, then see modifiers added and removed, and a key remapped with as.",
      recommendedChannels: ["Total TypeScript", "Jack Herrington"],
      keyTakeaways: [
        "A mapped type { [K in keyof T]: T[K] } loops over every key of T and produces a new type with the same keys, letting you transform each property's type or modifiers.",
        "Adding ? or readonly in front of the mapped property makes every property optional or readonly; prefixing with - instead, like -readonly or -?, strips that modifier off every property.",
        "The as clause inside a mapped type, like [K in keyof T as NewKeyName], lets you rename or filter keys while building the new type, not just transform their values.",
      ],
      notes:
        "TypeScript's built-in Partial<T>, Readonly<T>, and Required<T> aren't special compiler magic, they're ordinary mapped types defined in the standard library. Once you can write { [K in keyof T]: ... } yourself, you can build your own variations that the built-ins don't cover.",
      conceptExplanation:
        "type MyPartial<T> = { [K in keyof T]?: T[K] } loops over every key K in T and makes each one optional while keeping its original type. type MyReadonly<T> = { readonly [K in keyof T]: T[K] } does the same but adds readonly instead. Removing a modifier uses a minus sign: type MyRequired<T> = { [K in keyof T]-?: T[K] } strips optionality from every property, turning T[K] | undefined-style optional properties back into required ones. Key remapping with the as clause, like { [K in keyof T as `get${string & K}`]: () => T[K] }, changes the property names themselves while building the new type; you'll go deeper on the string-building side of that pattern with template literal types in the next module.",
      whyItMatters: "Once you understand mapped types, Partial, Readonly, Required, and Pick stop being memorized built-ins and become patterns you can extend to solve problems those utilities don't cover.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define an interface Task with title: string, priority: number, and done: boolean. Write your own type MyPartial<T> = { [K in keyof T]?: T[K] } and use it to declare a variable of type MyPartial<Task> that only sets some of the fields. Then write type MyReadonly<T> = { readonly [K in keyof T]: T[K] }, declare a MyReadonly<Task> value, and add a comment confirming that reassigning one of its properties would fail to compile.",
      challenge: "Write type MyPick<T, K extends keyof T> = { [P in K]: T[P] }, mimicking the built-in Pick utility type, then use it to build a type containing only the title and done fields of Task.",
      expectedResult: "MyPartial<Task> allows a value with only some Task fields set, and MyReadonly<Task> correctly prevents reassigning any of its properties after creation.",
      tests: [
        "MyPartial<Task> correctly makes every property of Task optional while preserving each property's original type",
        "MyReadonly<Task> correctly makes every property of Task readonly",
      ],
      hint: "keyof T gives you the union of T's property names; [K in keyof T] loops over that union the same way a for...of loop iterates over an array.",
      lessonAssessment: [
        {
          question: "What does the mapped type { [K in keyof T]?: T[K] } produce?",
          options: [
            "A type identical to T with no changes",
            "A new type with the same keys as T, but every property made optional",
            "A type with only one property, K",
            "A runtime object copying T's default values",
          ],
          correctAnswerIndex: 1,
          explanation: "The mapped type loops over every key of T and marks each corresponding property optional with ?, while keeping each property's original type.",
        },
        {
          question: "What does the - prefix do in a mapped type like { [K in keyof T]-?: T[K] }?",
          options: [
            "It makes every property negative in value",
            "It removes the optional modifier from every property, making them required",
            "It deletes every property from the resulting type",
            "It has no effect; - is ignored by TypeScript",
          ],
          correctAnswerIndex: 1,
          explanation: "A minus sign in front of a modifier strips it off; -? removes optionality and -readonly removes the readonly modifier.",
        },
      ],
      commonMistakes: [
        "Writing { [K in keyof T]: T } instead of { [K in keyof T]: T[K] }, which loses each property's individual type and gives every property the type of the whole object.",
        "Forgetting that Partial-style mapped types only affect the outer level; nested object properties inside T are not recursively made optional.",
      ],
      deliverables: ["main.ts with hand-written MyPartial<T> and MyReadonly<T> mapped types used on a Task interface"],
      assessmentCriteria: [
        "MyPartial<T> correctly makes every property of the given type optional",
        "MyReadonly<T> correctly makes every property of the given type readonly",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "typescript",
        code:
          'interface Task {\n  title: string;\n  priority: number;\n  done: boolean;\n}\n\ntype MyPartial<T> = {\n  [K in keyof T]?: T[K];\n};\n\ntype MyReadonly<T> = {\n  readonly [K in keyof T]: T[K];\n};\n\nconst draft: MyPartial<Task> = { title: "Write report" };\nconsole.log(draft);\n\nconst locked: MyReadonly<Task> = { title: "Ship release", priority: 1, done: false };\nconsole.log(locked.title);\n// locked.title = "Changed"; // would fail to compile: title is readonly\n\ntype MyPick<T, K extends keyof T> = {\n  [P in K]: T[P];\n};\n\nconst summary: MyPick<Task, "title" | "done"> = { title: "Ship release", done: false };\nconsole.log(summary);',
        explanation: "MyPartial and MyReadonly each loop over Task's keys to transform every property's modifiers uniformly, while MyPick uses a second type parameter to select only specific keys.",
      },
      completionStatus: "not_started",
    },
    {
      title: "The infer Keyword: Extracting Types from Types",
      goal: "Use infer inside a conditional type to extract a nested type, such as unwrapping a Promise or getting a function's return type.",
      videoTitle: "TypeScript infer Keyword Explained",
      videoSearchQuery: "typescript infer keyword conditional types tutorial",
      videoLearningGoal: "See infer used inside a conditional type to pull a nested type out, including unwrapping a Promise and extracting a function's return type.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "infer, used only inside the extends clause of a conditional type, introduces a new type variable that TypeScript fills in by pattern-matching against the checked type.",
        "type UnwrapPromise<T> = T extends Promise<infer U> ? U : T extracts the type a Promise resolves to, falling back to T itself if it isn't a Promise.",
        "infer works the same way on function types, array types, or any other generic shape, wherever a piece of the type needs to be captured and reused on the result side.",
      ],
      notes:
        "Sometimes you don't just want to test a type, you want to pull a piece out of it, like getting the resolved type inside a Promise<T>, or the return type of a function. infer is the keyword that makes that possible inside a conditional type.",
      conceptExplanation:
        "type UnwrapPromise<T> = T extends Promise<infer U> ? U : T works by pattern-matching T against the shape Promise<infer U>; if T really is a Promise of something, TypeScript binds that something to U and returns it, otherwise it returns T unchanged. The same pattern extracts a function's return type: type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never. infer can also be used recursively: type UnwrapDeep<T> = T extends Promise<infer U> ? UnwrapDeep<U> : T keeps unwrapping nested Promises, like Promise<Promise<string>>, until it reaches a non-Promise type.",
      whyItMatters: "infer is what lets TypeScript's own Awaited, ReturnType, and Parameters utility types work; understanding it means you can extract exactly the type you need from any generic shape instead of writing it out by hand.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Write type UnwrapPromise<T> = T extends Promise<infer U> ? U : T, then declare a couple of type aliases testing it against a Promise<string> and against a plain number, assigning each to a variable of the resulting type to confirm it resolved correctly. Then write type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never, apply it to a sample function's type, and declare a variable of that resulting return type.",
      challenge: "Write a recursive type UnwrapDeep<T> = T extends Promise<infer U> ? UnwrapDeep<U> : T, and test it against a type like Promise<Promise<string>>, confirming it fully unwraps to string rather than stopping at the first Promise.",
      expectedResult: "UnwrapPromise and MyReturnType both correctly extract the expected inner types from their test cases, and UnwrapDeep fully unwraps a doubly nested Promise down to its innermost type.",
      tests: [
        "UnwrapPromise<Promise<string>> correctly resolves to string, and UnwrapPromise<number> falls back to number",
        "MyReturnType correctly extracts a sample function's actual return type",
      ],
      hint: "infer can only appear inside the extends clause of a conditional type; you can't use it as a standalone type parameter anywhere else.",
      lessonAssessment: [
        {
          question: "What does type UnwrapPromise<T> = T extends Promise<infer U> ? U : T do when T is Promise<string>?",
          options: [
            "It resolves to Promise<string> unchanged",
            "It resolves to string, the type the Promise resolves to",
            "It causes a compile error",
            "It resolves to never",
          ],
          correctAnswerIndex: 1,
          explanation: "infer U captures whatever type is inside Promise<...>, so when T is Promise<string>, U (and therefore the result) becomes string.",
        },
        {
          question: "Where is the infer keyword allowed to appear?",
          options: [
            "Anywhere a type is expected",
            "Only inside the extends clause of a conditional type",
            "Only inside interface declarations",
            "Only as a generic default value",
          ],
          correctAnswerIndex: 1,
          explanation: "infer introduces a type variable that TypeScript solves for by pattern matching, and that only makes sense within a conditional type's extends clause.",
        },
      ],
      commonMistakes: [
        "Trying to use infer outside of a conditional type's extends clause, which is not valid TypeScript syntax.",
        "Writing a single-level UnwrapPromise and expecting it to fully unwrap a doubly nested Promise<Promise<T>>, instead of recognizing that a recursive conditional type is needed for that.",
      ],
      deliverables: ["main.ts with UnwrapPromise<T> and MyReturnType<T> conditional types using infer"],
      assessmentCriteria: [
        "UnwrapPromise correctly extracts the resolved type from a Promise and falls back to the original type otherwise",
        "MyReturnType correctly extracts a sample function's actual return type using infer",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "typescript",
        code:
          'type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;\n\ntype A = UnwrapPromise<Promise<string>>;\ntype B = UnwrapPromise<number>;\n\nconst a: A = "resolved value";\nconst b: B = 42;\nconsole.log(a, b);\n\ntype MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;\n\nfunction createUser(name: string) {\n  return { id: 1, name };\n}\n\ntype CreatedUser = MyReturnType<typeof createUser>;\nconst user: CreatedUser = { id: 2, name: "Ada" };\nconsole.log(user);\n\ntype UnwrapDeep<T> = T extends Promise<infer U> ? UnwrapDeep<U> : T;\ntype Deep = UnwrapDeep<Promise<Promise<string>>>;\nconst deepValue: Deep = "fully unwrapped";\nconsole.log(deepValue);',
        explanation: "infer pulls a nested type out during pattern matching: U captures a Promise's resolved type, R captures a function's return type, and the recursive UnwrapDeep keeps applying itself until no Promise remains.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Conditional & Mapped Types Assessment",
    questions: [
      {
        question: "What does the conditional type T extends U ? X : Y evaluate to?",
        options: [
          "Always X",
          "X if T is assignable to U, otherwise Y",
          "A runtime boolean",
          "A compile error unless T equals U",
        ],
        correctAnswerIndex: 1,
        explanation: "A conditional type branches at compile time based on whether T is assignable to U.",
      },
      {
        question: "Why does a conditional type applied to a union type, like ToArray<string | number>, distribute across the union's members?",
        options: [
          "It doesn't; TypeScript treats the union as one type",
          "Because the checked type is a naked type parameter, TypeScript evaluates the conditional per member and unions the results",
          "Because arrays require distribution",
          "Only string unions distribute, not number unions",
        ],
        correctAnswerIndex: 1,
        explanation: "Distribution happens automatically for naked type parameters checked against a union, producing a union of the per-member results.",
      },
      {
        question: "How do you disable distribution in a conditional type when you want to test a union as a whole?",
        options: [
          "It cannot be disabled",
          "Wrap both sides in a tuple, like [T] extends [U] ? X : Y",
          "Add the keyword no-distribute before the conditional",
          "Use && instead of extends",
        ],
        correctAnswerIndex: 1,
        explanation: "Wrapping the checked type and the constraint in single-element tuples prevents the naked-type-parameter distribution behavior.",
      },
      {
        question: "What does the mapped type { [K in keyof T]?: T[K] } produce?",
        options: [
          "A copy of T with every property made optional",
          "A copy of T with every property removed",
          "A type with a single property named K",
          "The same type as T, unchanged",
        ],
        correctAnswerIndex: 0,
        explanation: "Looping over keyof T and adding ? to each mapped property makes every property of the resulting type optional.",
      },
      {
        question: "What does the - prefix do in a mapped type like { [K in keyof T]-readonly: T[K] }?",
        options: [
          "It has no effect",
          "It removes the readonly modifier from every property in the resulting type",
          "It deletes every property",
          "It makes every property readonly",
        ],
        correctAnswerIndex: 1,
        explanation: "A minus sign strips the named modifier from every mapped property instead of adding it.",
      },
      {
        question: "What does the as clause inside a mapped type, like [K in keyof T as NewName], allow you to do?",
        options: [
          "Nothing; as is not valid inside mapped types",
          "Rename or filter the keys of the resulting type, not just transform their values",
          "Cast the entire type to any",
          "Force every key to become optional",
        ],
        correctAnswerIndex: 1,
        explanation: "Key remapping with as lets a mapped type produce different property names than the source type, or drop keys entirely.",
      },
      {
        question: "In type UnwrapPromise<T> = T extends Promise<infer U> ? U : T, what does infer U do?",
        options: [
          "It declares U as a separate generic parameter of UnwrapPromise",
          "It introduces a new type variable that TypeScript fills in by matching the shape Promise<...> against T",
          "It forces T to become a Promise",
          "It has no effect on the resulting type",
        ],
        correctAnswerIndex: 1,
        explanation: "infer captures whatever type appears in that position during the pattern match, making it available on the result side of the conditional.",
      },
      {
        question: "Where can the infer keyword be used?",
        options: [
          "Anywhere a type annotation is allowed",
          "Only inside the extends clause of a conditional type",
          "Only in interface property definitions",
          "Only inside a mapped type's key position",
        ],
        correctAnswerIndex: 1,
        explanation: "infer only makes sense as part of the pattern-matching performed by a conditional type's extends clause.",
      },
      {
        question: "What does type UnwrapDeep<T> = T extends Promise<infer U> ? UnwrapDeep<U> : T achieve that a single, non-recursive UnwrapPromise does not?",
        options: [
          "Nothing extra",
          "It fully unwraps nested Promises, like Promise<Promise<string>>, down to the innermost non-Promise type",
          "It converts every type to a Promise",
          "It only works on arrays, not Promises",
        ],
        correctAnswerIndex: 1,
        explanation: "By calling itself recursively inside the conditional, UnwrapDeep keeps unwrapping until it reaches a type that is no longer a Promise.",
      },
      {
        question: "Are TypeScript's built-in utility types like Partial<T> and ReturnType<T> special compiler features?",
        options: [
          "Yes, they cannot be reproduced with ordinary TypeScript syntax",
          "No, they are ordinary mapped types and conditional types with infer, defined in the standard library",
          "Yes, but only Partial is; ReturnType is a compiler built-in",
          "No, but they only work on classes, not interfaces",
        ],
        correctAnswerIndex: 1,
        explanation: "Partial, Readonly, Required, ReturnType, and similar utilities are ordinary mapped and conditional types you could write yourself, as this module demonstrates.",
      },
    ],
  },
  assignment:
    "Build a 'Type Utility Toolkit': write your own type NonNullableCustom<T> = T extends null | undefined ? never : T, your own type MyReadonly<T> = { readonly [K in keyof T]: T[K] }, and your own type UnwrapPromise<T> = T extends Promise<infer U> ? U : T. For each one, declare at least one type alias that exercises it against a realistic test case (a union with null, an object interface, and a Promise type), and declare a variable typed with the result to prove each utility type resolves correctly.",
  assignmentDeliverables: [
    "main.ts with NonNullableCustom<T>, MyReadonly<T>, and UnwrapPromise<T> type definitions",
    "At least one test case per utility type, proven with a correctly typed variable declaration",
  ],
  assignmentAssessmentCriteria: [
    "Each custom utility type is defined correctly using conditional or mapped type syntax",
    "Each utility type is exercised with a realistic test case that proves it resolves as intended",
  ],
  miniProject:
    "Build a 'Safe API Result Mapper': define a Task interface with title: string, priority: number, and optional notes?: string. Write type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] } that recursively makes nested objects readonly, not just the top level. Write type ExtractArrayElement<T> = T extends (infer U)[] ? U : never using infer on an array type. Apply DeepReadonly to a Task type that has a nested object field you add (such as an assignee: { name: string; id: number } field), and apply ExtractArrayElement to a Task[] type, printing a value typed with each result to confirm both utilities resolved correctly.",
  miniProjectDeliverables: [
    "main.ts with a recursive DeepReadonly<T> mapped type and an ExtractArrayElement<T> conditional type using infer",
    "A Task interface with a nested object field, used to test DeepReadonly",
    "Printed output demonstrating both utility types resolved to the correct types",
  ],
  miniProjectAssessmentCriteria: [
    "DeepReadonly correctly applies readonly recursively to nested object properties, not only the top level",
    "ExtractArrayElement correctly uses infer to pull the element type out of an array type",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
