import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module1: GeneratedModule = {
  title: "Generics Basics",
  description:
    "Write functions and interfaces that work correctly across many types without losing type safety, using generic type parameters and the extends keyword to constrain what a generic is allowed to accept.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Generic Functions: Reusable Code Without Losing Type Safety",
      goal: "Write a generic function using a type parameter so it works with many types while TypeScript still checks and infers the correct type at each call site.",
      videoTitle: "TypeScript Generics Tutorial: Generic Functions Explained",
      videoSearchQuery: "typescript generics tutorial generic functions explained",
      videoLearningGoal: "See a single generic function handle different argument types correctly, with TypeScript inferring the type parameter automatically at each call.",
      recommendedChannels: ["Matt Pocock", "Web Dev Simplified"],
      keyTakeaways: [
        "A generic function uses a type parameter, written as <T>, as a placeholder for whatever type is actually passed in when the function is called.",
        "TypeScript infers T automatically from the argument you pass, so you rarely have to write the type parameter explicitly at the call site.",
        "Generics keep the type safety that any throws away: the return type stays connected to the input type instead of becoming untyped.",
      ],
      notes:
        "You already know functions with fixed parameter types, like function double(value: number): number. That works for one type only. A generic function uses a type parameter, written in angle brackets like <T>, so the same function body can work correctly with numbers, strings, objects, or anything else, while TypeScript still tracks exactly which type was used on each call.",
      conceptExplanation:
        "function identity<T>(value: T): T { return value; } declares a type parameter T right after the function name. Calling identity(5) makes TypeScript infer T as number, so the return type is number. Calling identity(\"hi\") infers T as string instead. This is completely different from function identity(value: any): any, where the connection between input and output type is lost entirely and TypeScript can no longer catch mistakes on the result. A generic function can also take more than one type parameter, such as function pair<A, B>(first: A, second: B): [A, B], letting two independent types be tracked in the same function.",
      whyItMatters: "Generics let you write one function instead of many near-duplicate ones for each type, without falling back to any and losing the type checking that makes TypeScript useful in the first place.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Write a generic function wrapInArray<T>(value: T): T[] that returns a one-item array containing value. Call it three times, once each with a number, a string, and a boolean, printing every result with console.log(). Then write a second generic function firstElement<T>(items: T[]): T | undefined that returns the first item of an array, or undefined if the array is empty. Call it once with an array of strings and once with an empty array of numbers, printing both results.",
      challenge: "Add a third generic function pairValues<A, B>(first: A, second: B): [A, B] that returns a tuple combining two values of potentially different types. Call it with a string and a number, and print the resulting tuple.",
      expectedResult: "The program prints [5], [\"hi\"], and [true] from wrapInArray, then \"apple\" (the first string) and undefined (from the empty array) from firstElement, each with the correct inferred type and no type errors.",
      tests: ["wrapInArray<T> and firstElement<T> are both declared with an explicit type parameter, not any", "Calling each function with different argument types produces correctly typed results without a type error"],
      hint: "You do not need to write wrapInArray<number>(5); TypeScript infers T as number automatically from the argument you pass.",
      lessonAssessment: [
        {
          question: "In function identity<T>(value: T): T { return value; }, what does <T> represent?",
          options: [
            "A fixed type that must always be number",
            "A type parameter that acts as a placeholder for whatever type is passed in at the call site",
            "A comment that TypeScript ignores",
            "An array type",
          ],
          correctAnswerIndex: 1,
          explanation: "<T> declares a type parameter: a placeholder type that TypeScript fills in based on the argument actually passed when the generic function is called.",
        },
        {
          question: "Why is a generic function usually a better choice than typing a parameter as any?",
          options: [
            "Generics run faster at runtime",
            "any keeps the connection between input and output types, while generics remove it",
            "Generics preserve the connection between the input type and the return type, while any discards type checking entirely",
            "There is no real difference between the two",
          ],
          correctAnswerIndex: 2,
          explanation: "A generic function like identity<T>(value: T): T keeps the return type tied to whatever type was passed in, while any gives up type checking on that value completely.",
        },
      ],
      commonMistakes: ["Typing a parameter as any to make a function 'work with everything', which silently disables type checking instead of preserving it like a generic does.", "Writing out the type parameter explicitly on every call, such as identity<number>(5), when TypeScript can already infer it from the argument."],
      deliverables: ["A script defining wrapInArray<T> and firstElement<T> and calling each with more than one type"],
      assessmentCriteria: ["Both functions use a real type parameter instead of any", "Each call site shows correct type inference for the argument type used"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code: 'function wrapInArray<T>(value: T): T[] {\n  return [value];\n}\n\nfunction firstElement<T>(items: T[]): T | undefined {\n  return items[0];\n}\n\nconsole.log(wrapInArray(5));\nconsole.log(wrapInArray("hi"));\nconsole.log(firstElement(["apple", "banana"]));\nconsole.log(firstElement<number>([]));',
        explanation: "T is inferred separately at every call: number for wrapInArray(5), string for wrapInArray(\"hi\"), and string again for the array of fruit, while the empty array call shows T can also be given explicitly when there is nothing to infer from.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Generic Interfaces: Typing Reusable Shapes",
      goal: "Define a generic interface so the same shape can describe data of different types without duplicating the interface for each one.",
      videoTitle: "TypeScript Generic Interfaces Tutorial",
      videoSearchQuery: "typescript generic interfaces tutorial",
      videoLearningGoal: "See one generic interface reused to describe several different concrete shapes, each filled in with a different type argument.",
      recommendedChannels: ["Total TypeScript", "Jack Herrington"],
      keyTakeaways: [
        "A generic interface, like interface Box<T> { value: T }, uses a type parameter the same way a generic function does.",
        "You fill in the type parameter when you use the interface, such as Box<string> or Box<number>, producing a specific shape from the general one.",
        "Generic interfaces are the standard way to type reusable wrapper shapes, like API responses or containers, without writing one interface per data type.",
      ],
      notes:
        "An interface like interface Box { value: string } only describes a box holding a string. A generic interface, interface Box<T> { value: T }, describes the general shape of 'a box holding something', and you decide what that something is each time you use it: Box<string>, Box<number>, or Box<User>, all from the same declaration.",
      conceptExplanation:
        "interface ApiResponse<T> { data: T; success: boolean; } is a shape you will see constantly in real code: it always has a success flag, but the shape of data depends on the endpoint. const userResponse: ApiResponse<{ id: number; name: string }> = { data: { id: 1, name: \"Ada\" }, success: true } fills T with a specific object shape. The same interface reused as ApiResponse<string[]> would instead expect data to be an array of strings. Generic interfaces can also constrain how their own methods behave: interface Container<T> { value: T; update: (next: T) => void } ties the parameter type of update to the same T as value, so you cannot accidentally pass the wrong type into update.",
      whyItMatters: "Generic interfaces let you define one reusable shape for patterns like API responses, containers, and caches instead of writing a near-identical interface for every different type of data you handle.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define a generic interface Box<T> with a single property value: T. Create two Box objects: one Box<number> holding a number, and one Box<string> holding a string, then print both values. Next, define a generic interface ApiResponse<T> with a data: T property and a success: boolean property. Create one ApiResponse<string[]> representing a list of usernames, and one ApiResponse<{ id: number; total: number }> representing an order summary, then print both.",
      challenge: "Add a generic function unwrap<T>(box: Box<T>): T that accepts a Box<T> and returns its value, then call it with your number and string boxes from earlier, printing both unwrapped results.",
      expectedResult: "The program prints the number and string stored in each Box, then prints both ApiResponse objects showing their correct, distinct data shapes, all without any type errors.",
      tests: ["Box<T> and ApiResponse<T> are both declared as generic interfaces with a type parameter", "At least two different type arguments are used with each generic interface"],
      hint: "Filling in the type parameter looks like Box<number> or ApiResponse<string[]>, the same way Array<string> works.",
      lessonAssessment: [
        {
          question: "What does interface Box<T> { value: T } describe?",
          options: [
            "A box that can only ever hold a number",
            "A general, reusable shape whose value property's type is decided when the interface is used, such as Box<string>",
            "An error type",
            "A function that returns a box",
          ],
          correctAnswerIndex: 1,
          explanation: "Box<T> is a generic interface: T is a placeholder filled in at the point of use, so Box<string> and Box<number> both come from the same declaration.",
        },
        {
          question: "In interface ApiResponse<T> { data: T; success: boolean }, what changes between ApiResponse<string[]> and ApiResponse<number>?",
          options: [
            "Nothing changes, they are identical",
            "The success property's type changes",
            "The data property's type changes to match the type argument, while success stays boolean in both",
            "The interface itself changes name",
          ],
          correctAnswerIndex: 2,
          explanation: "The type parameter only controls the parts of the interface that reference it, so data becomes string[] or number depending on the type argument, while success remains boolean.",
        },
      ],
      commonMistakes: ["Defining a separate interface for every data shape (UserResponse, OrderResponse, and so on) instead of reusing one generic interface with a type parameter.", "Forgetting to supply a type argument, leaving TypeScript to infer an overly broad or incorrect type for T from the object literal alone."],
      deliverables: ["A script defining Box<T> and ApiResponse<T> and using each with at least two different type arguments"],
      assessmentCriteria: ["Both interfaces are generic and correctly reused with different concrete types", "Printed output matches the shape and type argument used for each instance"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code: 'interface Box<T> {\n  value: T;\n}\n\ninterface ApiResponse<T> {\n  data: T;\n  success: boolean;\n}\n\nconst numberBox: Box<number> = { value: 42 };\nconst stringBox: Box<string> = { value: "hello" };\n\nconst userList: ApiResponse<string[]> = {\n  data: ["ada", "grace"],\n  success: true,\n};\n\nconsole.log(numberBox.value, stringBox.value);\nconsole.log(userList.data, userList.success);',
        explanation: "The same Box<T> and ApiResponse<T> declarations are reused with different type arguments, and TypeScript enforces that each value property matches the type argument supplied at that usage site.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Constraining Generics with extends",
      goal: "Restrict what a generic type parameter is allowed to be using extends, so the compiler enforces required properties on every type argument.",
      videoTitle: "TypeScript Generic Constraints with extends Explained",
      videoSearchQuery: "typescript generic constraints extends keyword tutorial",
      videoLearningGoal: "See a generic function reject an argument at compile time because it fails a required extends constraint.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "T extends { length: number } restricts T to only types that have a length property, so the compiler enforces it before the function ever runs.",
        "A constrained generic can safely use the properties named in its constraint, since TypeScript now guarantees they exist on T.",
        "Constraints make a generic function stricter and safer than an unconstrained <T>, which allows literally anything, including values with no usable shape at all.",
      ],
      notes:
        "An unconstrained generic, <T>, accepts absolutely any type, which means the function body cannot safely assume T has any particular property. Writing <T extends SomeShape> narrows that down: T can still be many different types, but every one of them is required to at least match SomeShape, so the function body can safely use whatever the constraint guarantees.",
      conceptExplanation:
        "function logLength<T extends { length: number }>(item: T): number { return item.length; } only accepts values that have a length property, such as strings and arrays, both of which naturally have one. Calling logLength(\"hello\") or logLength([1, 2, 3]) works, because both types satisfy the constraint, but logLength(42) is a compile-time error, since number has no length property. Constraints are not limited to object shapes: function getProperty<T, K extends keyof T>(obj: T, key: K) constrains K to only the actual property names of T, so getProperty(user, \"nickname\") fails to compile if user has no nickname property, catching a typo before the code ever runs.",
      whyItMatters: "Constraints let a generic stay flexible across many types while still guaranteeing the properties or behavior the function body actually depends on, catching invalid calls at compile time instead of producing a runtime error.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Write a generic function logLength<T extends { length: number }>(item: T): number that returns item.length. Call it once with a string and once with an array of numbers, printing both results. Then write a second generic function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] that returns obj[key]. Create a small object with at least three properties, and call getProperty() twice with two different valid keys of that object, printing both results.",
      challenge: "Try calling logLength() with a plain number as an argument in a comment, and write a one-line note above it explaining, in your own words, exactly why TypeScript rejects that call at compile time.",
      expectedResult: "The program prints the length of the string and the array from logLength, then prints the two property values retrieved through getProperty, all without type errors, since every call satisfies its generic constraint.",
      tests: ["logLength<T> is constrained with extends { length: number }", "getProperty<T, K extends keyof T> only accepts key values that are real keys of the object passed as T"],
      hint: "keyof T produces a union of T's own property names, so constraining K with extends keyof T means only real property names of that specific object are allowed as key.",
      lessonAssessment: [
        {
          question: "What does function logLength<T extends { length: number }>(item: T) guarantee inside the function body?",
          options: [
            "Nothing, extends has no effect on what is allowed inside the body",
            "That item is always a string",
            "That item has a length property, since only types matching that shape are allowed as T",
            "That item is always an array",
          ],
          correctAnswerIndex: 2,
          explanation: "The constraint extends { length: number } restricts T to types that include a length property, so the function body can safely rely on item.length existing.",
        },
        {
          question: "In function getProperty<T, K extends keyof T>(obj: T, key: K), what does K extends keyof T ensure?",
          options: [
            "K can be any string at all",
            "K must be one of the actual property names that exist on the specific object type T",
            "K must always be the string \"key\"",
            "T must be a number",
          ],
          correctAnswerIndex: 1,
          explanation: "keyof T is a union of T's own property names, so constraining K with extends keyof T means only a real, valid property name of that particular T is accepted, catching typos at compile time.",
        },
      ],
      commonMistakes: ["Leaving a generic completely unconstrained (<T>) and then trying to access a specific property on it, which TypeScript correctly rejects because plain T guarantees nothing.", "Writing extends keyof T incorrectly as a fixed string union rather than keyof T, losing the connection to the actual object's real property names."],
      deliverables: ["A script with logLength<T extends { length: number }> and getProperty<T, K extends keyof T> both correctly constrained and called"],
      assessmentCriteria: ["Both generic functions use extends to constrain their type parameters correctly", "Every call site respects the constraint and produces correct output"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code: 'function logLength<T extends { length: number }>(item: T): number {\n  return item.length;\n}\n\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\nconsole.log(logLength("hello"));\nconsole.log(logLength([1, 2, 3, 4]));\n\nconst user = { id: 1, nickname: "Ada", active: true };\nconsole.log(getProperty(user, "nickname"));\nconsole.log(getProperty(user, "active"));',
        explanation: "logLength only accepts types with a length property because of its extends constraint, and getProperty only accepts real keys of user because K is constrained with extends keyof T.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Generics Basics Assessment",
    questions: [
      { question: "In function identity<T>(value: T): T, what is T?", options: ["A fixed type equal to number", "A type parameter acting as a placeholder for the argument's actual type", "A runtime variable", "An array of types"], correctAnswerIndex: 1, explanation: "<T> is a type parameter: TypeScript fills it in with the actual type of the argument passed at each call site." },
      { question: "Why does identity(\"hello\") infer T as string automatically?", options: ["It doesn't, you must always write identity<string>(\"hello\")", "TypeScript infers T from the type of the argument passed to the function", "string is the default type for every generic", "TypeScript cannot infer generic type parameters"], correctAnswerIndex: 1, explanation: "TypeScript performs type inference on generic calls, matching T to the type of the argument actually supplied." },
      { question: "What is the main problem with typing a parameter as any instead of using a generic <T>?", options: ["any makes code run slower", "any disables type checking on that value, while a generic keeps the input and output types connected", "any and generics behave identically", "any is only allowed on function return types"], correctAnswerIndex: 1, explanation: "any opts a value out of type checking entirely, while a generic preserves a real, checked relationship between input and output types." },
      { question: "What does interface Box<T> { value: T } represent?", options: ["An interface that only works with numbers", "A generic, reusable shape whose value type is decided by the type argument used at each usage site", "A function type", "A type that can never be reused"], correctAnswerIndex: 1, explanation: "Box<T> is a generic interface: the same declaration produces Box<string>, Box<number>, or any other Box<...> depending on the type argument supplied." },
      { question: "Given interface ApiResponse<T> { data: T; success: boolean }, what type is data in ApiResponse<string[]>?", options: ["boolean", "string[]", "any", "It has no type"], correctAnswerIndex: 1, explanation: "Substituting T with string[] makes the data property's type string[], while success stays boolean regardless of the type argument." },
      { question: "What does function logLength<T extends { length: number }>(item: T) allow as an argument?", options: ["Only strings", "Only arrays", "Any type that includes a length property, such as strings or arrays", "Any type at all, including numbers"], correctAnswerIndex: 2, explanation: "The extends constraint restricts T to types that match the required shape, in this case anything with a numeric length property." },
      { question: "Why does logLength(42) fail to compile if logLength is declared as <T extends { length: number }>?", options: ["Numbers are not allowed as function arguments in TypeScript", "number does not have a length property, so it fails the generic constraint", "42 is too large a number", "logLength requires exactly one argument"], correctAnswerIndex: 1, explanation: "The constraint requires a length property, and the primitive type number does not have one, so TypeScript rejects the call at compile time." },
      { question: "In function getProperty<T, K extends keyof T>(obj: T, key: K): T[K], what does K extends keyof T restrict K to?", options: ["Any string value", "Only property names that actually exist on the specific object type T", "Only numeric indexes", "Nothing, keyof T has no effect"], correctAnswerIndex: 1, explanation: "keyof T produces a union of T's real property names, and constraining K to extend it means only a valid key of that object is accepted." },
      { question: "What is a key advantage of a constrained generic over an unconstrained one?", options: [
          "Constrained generics run in a separate compiler",
          "The function body can safely rely on properties the constraint guarantees, while an unconstrained T guarantees nothing",
          "Constrained generics no longer require a type parameter at all",
          "There is no difference between constrained and unconstrained generics",
        ], correctAnswerIndex: 1, explanation: "A constraint like extends { length: number } guarantees a shape, so the function body can safely use that shape, unlike a bare <T> which could be anything." },
      { question: "Which call correctly matches function pair<A, B>(first: A, second: B): [A, B]?", options: [
          "pair(1, 2, 3), passing three arguments",
          "pair(\"id\", 42), letting TypeScript infer A as string and B as number",
          "pair<A, B>() with no arguments at all",
          "pair([1, 2]), passing only one array argument",
        ], correctAnswerIndex: 1, explanation: "pair takes exactly two arguments of independently inferred types A and B, so passing a string and a number infers A as string and B as number correctly." },
    ],
  },
  assignment:
    "Build a small 'Generic Toolkit': write a generic function last<T>(items: T[]): T | undefined that returns the final item of an array or undefined if it is empty. Write a generic interface Pair<A, B> with properties first: A and second: B, and a generic function makePair<A, B>(first: A, second: B): Pair<A, B> that returns a Pair built from its two arguments. Finally, write a generic function assertHasId<T extends { id: number }>(item: T): number that returns item.id. Call all three with at least two different type combinations each, printing every result.",
  assignmentDeliverables: [
    "A script defining last<T>, Pair<A, B> with makePair<A, B>, and assertHasId<T extends { id: number }>",
    "Printed output showing each function called with more than one type combination",
  ],
  assignmentAssessmentCriteria: [
    "All three generics use real type parameters, not any, and the extends constraint on assertHasId is enforced correctly",
    "Each function is called with at least two different, correctly inferred type combinations",
  ],
  miniProject:
    "Build a small 'Generic Inventory Store': define a generic interface StoreItem<T> with properties id: number and payload: T. Write a generic class-free function addItem<T>(store: StoreItem<T>[], item: StoreItem<T>): StoreItem<T>[] that returns a new array with item appended. Write a generic function findById<T>(store: StoreItem<T>[], id: number): StoreItem<T> | undefined that returns the matching item or undefined. Create one store of StoreItem<string> (product names) and one store of StoreItem<{ quantity: number }> (stock counts), add at least two items to each using addItem, then look up one existing and one missing id from each store using findById, printing every result.",
  miniProjectDeliverables: [
    "A script defining StoreItem<T>, addItem<T>, and findById<T> and using them with at least two different payload types",
    "Printed output showing successful lookups and a correctly returned undefined for a missing id",
  ],
  miniProjectAssessmentCriteria: [
    "StoreItem<T>, addItem<T>, and findById<T> are all correctly generic rather than hardcoded to one payload type",
    "Both stores are exercised with add and lookup operations, including at least one lookup that correctly returns undefined",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
