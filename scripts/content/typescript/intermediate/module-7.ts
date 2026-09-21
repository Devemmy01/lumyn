import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module7: GeneratedModule = {
  title: "Testing & Code Quality in TypeScript",
  description:
    "Write typed assertion helpers to check your own code's correctness, understand the tsconfig strictness flags that catch entire categories of bugs before code ever runs, and see concretely why any quietly undermines all of it in a real codebase.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Typed Test Patterns: Writing Assertion Helpers",
      goal: "Write small, typed assertion helper functions that check a function's actual output against its expected output, and use them to build a simple, readable test suite.",
      videoTitle: "TypeScript Testing Patterns: Writing Your Own Assertion Helpers",
      videoSearchQuery: "typescript testing patterns assertion helper functions tutorial",
      videoLearningGoal: "See a generic assertEquals helper compare actual and expected values of the same type, reporting a clear pass or fail for each test case.",
      recommendedChannels: ["Matt Pocock", "Web Dev Simplified"],
      keyTakeaways: [
        "A typed assertion helper, like function assertEquals<T>(actual: T, expected: T, label: string): void, uses a generic so actual and expected are always compared as the same type.",
        "Structuring tests as small, named functions that each call one or more assertions makes it clear exactly what each test is checking and why it failed.",
        "A test runner pattern (looping over test functions, catching thrown assertion errors, and printing a pass/fail summary) gives you real feedback about your code's correctness without needing a separate testing library.",
      ],
      notes:
        "Manually eyeballing console.log output to check if code works doesn't scale past a few lines. A typed assertion helper formalizes that check: it compares an actual result to an expected one, and either does nothing (a pass) or throws a clear, descriptive error (a fail).",
      conceptExplanation:
        "function assertEquals<T>(actual: T, expected: T, label: string): void { if (actual !== expected) { throw new Error(`${label}: expected ${expected}, got ${actual}`); } } uses a single type parameter T so TypeScript enforces that actual and expected are the same type, catching a mistake like comparing a number to a string at compile time, before the test even runs. Wrapping a group of assertions in a named function, function testAdd(): void { assertEquals(add(2, 3), 5, \"add(2, 3)\"); assertEquals(add(-1, 1), 0, \"add(-1, 1)\"); }, documents exactly what add() is expected to do. A tiny test runner loops over an array of these test functions, running each inside a try/catch: a caught error means that test failed, and the error's message already explains why, while no error means it passed, letting you print a clear PASS or FAIL line with a running count for every test in the file.",
      whyItMatters: "Writing your own typed assertion helpers teaches exactly what a testing library like Jest or Vitest is doing under the hood, and gives you a lightweight, dependency-free way to verify your code's correctness directly inside the Academy workspace.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Write a generic function assertEquals<T>(actual: T, expected: T, label: string): void that throws a new Error with a clear message if actual !== expected. Write a simple function add(a: number, b: number): number to test. Write a test function testAdd(): void containing at least three assertEquals() calls covering different cases (including at least one negative number and one that sums to zero). Write a small test runner: an array of test functions with their names, a loop that calls each one inside a try/catch, and console.log() lines printing \"PASS: name\" or \"FAIL: name - message\" for each one, plus a final summary line with the total passed and failed count.",
      challenge: "Add a second generic assertion helper, assertDeepEqual<T>(actual: T, expected: T, label: string): void, that compares two objects or arrays using JSON.stringify() on both sides instead of ===, and write a second test function testing a function that returns an array or object, adding it to your test runner's list.",
      expectedResult: "The program prints a PASS or FAIL line for every test case run, correctly identifying any intentionally broken assertion you included, followed by an accurate final summary count of passed and failed tests.",
      tests: ["assertEquals<T> is generic, ensuring actual and expected must be the same type at compile time", "The test runner correctly catches a thrown assertion failure and reports it as FAIL rather than crashing the whole script"],
      hint: "Wrapping each test function's call in its own try/catch inside the runner loop is what lets one failing test report cleanly instead of stopping every other test from running.",
      lessonAssessment: [
        {
          question: "Why is assertEquals<T>(actual: T, expected: T, label: string) written as a generic function rather than using any for actual and expected?",
          options: [
            "Generics run faster than any at runtime",
            "The generic ensures actual and expected are required to be the same type, catching a type mismatch between them at compile time",
            "any cannot be used as a parameter type",
            "There is no real difference between the two approaches",
          ],
          correctAnswerIndex: 1,
          explanation: "Using a single type parameter T for both actual and expected means TypeScript enforces they're the same type, catching an accidental type mismatch before the test even runs.",
        },
        {
          question: "In a test runner that calls each test function inside its own try/catch, what is the purpose of the try/catch?",
          options: [
            "To make the tests run faster",
            "To catch a thrown assertion failure from one test so it can be reported as FAIL without stopping the remaining tests from running",
            "try/catch has no effect on how the test runner behaves",
            "To prevent any test from ever failing",
          ],
          correctAnswerIndex: 1,
          explanation: "Wrapping each test call in try/catch isolates failures: a thrown assertion error is caught and reported for that one test, while the runner continues on to the remaining tests instead of crashing entirely.",
        },
      ],
      commonMistakes: ["Writing assertEquals with actual: any, expected: any instead of a generic <T>, which allows comparing values of completely unrelated types without any compile-time warning.", "Running every test call directly in sequence with no try/catch around each one, so the very first failing assertion crashes the whole script and hides the results of every test after it."],
      deliverables: ["A script with a generic assertEquals<T> helper, at least one test function using it, and a runner that reports pass/fail for each test"],
      assessmentCriteria: ["assertEquals correctly uses a generic type parameter shared by actual and expected", "The test runner correctly isolates and reports each test's pass or fail status individually, with an accurate summary count"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "typescript",
        code: 'function assertEquals<T>(actual: T, expected: T, label: string): void {\n  if (actual !== expected) {\n    throw new Error(`${label}: expected ${expected}, got ${actual}`);\n  }\n}\n\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n\nfunction testAdd(): void {\n  assertEquals(add(2, 3), 5, "add(2, 3)");\n  assertEquals(add(-1, 1), 0, "add(-1, 1)");\n  assertEquals(add(-2, -3), -5, "add(-2, -3)");\n}\n\nconst tests: Array<{ name: string; run: () => void }> = [\n  { name: "testAdd", run: testAdd },\n];\n\nlet passed = 0;\nlet failed = 0;\n\nfor (const test of tests) {\n  try {\n    test.run();\n    console.log(`PASS: ${test.name}`);\n    passed++;\n  } catch (error) {\n    const message = error instanceof Error ? error.message : String(error);\n    console.log(`FAIL: ${test.name} - ${message}`);\n    failed++;\n  }\n}\n\nconsole.log(`${passed} passed, ${failed} failed`);',
        explanation: "assertEquals<T> keeps actual and expected type-locked together, and the runner's try/catch means testAdd's three assertions all run and report cleanly, whether or not any of them fail.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Useful tsconfig Strictness Flags",
      goal: "Understand what key tsconfig strictness flags actually enforce, and recognize the specific category of bug each one is designed to catch.",
      videoTitle: "TypeScript tsconfig Strictness Flags Explained",
      videoSearchQuery: "typescript tsconfig strict mode flags explained noImplicitAny",
      videoLearningGoal: "See the same small piece of code compile under a loose tsconfig and fail to compile under a stricter one, showing exactly what each flag catches.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "strict: true in tsconfig.json turns on a bundle of individual strictness flags at once, including strictNullChecks and noImplicitAny, and is the standard starting point for a real project.",
        "noImplicitAny requires every parameter and variable to either have an inferable type or an explicit annotation, instead of silently falling back to any when TypeScript can't infer one.",
        "noUncheckedIndexedAccess makes array and index-signature lookups include | undefined in their result type, correctly reflecting that an out-of-range index or missing key really can happen.",
      ],
      notes:
        "The Academy workspace runs a single main.ts file rather than a project with its own tsconfig.json to edit directly, so this lesson focuses on understanding exactly what each strictness flag catches conceptually, and demonstrating that same protection through explicit types and checks in your own code.",
      conceptExplanation:
        "A project's tsconfig.json commonly includes \"strict\": true, which bundles together several individual flags, including noImplicitAny and strictNullChecks (from the previous module). function double(x) { return x * 2; }, with no annotation on x, would silently be treated as (x: any) => any with noImplicitAny turned off; with it turned on, TypeScript requires you to either write (x: number) or let inference determine the type from context, catching an accidentally untyped parameter immediately. noUncheckedIndexedAccess changes what type you get back from an index access: without it, const item = items[10] on a 3-item array is typed as if it's guaranteed to exist; with it enabled, TypeScript correctly types item as T | undefined, forcing a check before you use it, since an out-of-range index in JavaScript actually returns undefined at runtime rather than throwing. Both flags exist to close a gap between what TypeScript assumes and what can actually happen when the code runs, which is exactly the kind of mismatch that causes a working-looking program to crash unexpectedly.",
      whyItMatters: "Knowing what these flags actually enforce lets you write code that would pass a strict tsconfig even before you have one configured, and helps you recognize exactly which category of bug a stricter setting is designed to catch when you see it enabled in a real project.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Write a comment block labeled // ==== tsconfig.json (relevant flags) ==== containing, as a comment, a small JSON-like snippet showing \"strict\": true, \"noImplicitAny\": true, and \"noUncheckedIndexedAccess\": true. Below it, write a function double(x: number): number with an explicit parameter type, and a one-line comment explaining what would happen if the parameter had no type annotation and noImplicitAny were enabled. Then create an array of exactly three numbers, and write a function safeGet(items: number[], index: number): number | undefined that returns items[index] typed to correctly include | undefined, matching what noUncheckedIndexedAccess would enforce, and demonstrate it by calling safeGet() once with a valid index and once with an out-of-range index, printing both results.",
      challenge: "Write a function sumIfPresent(items: number[], index: number): number that calls safeGet(), and uses an if check (or ?? 0) to safely handle the case where the result is undefined, returning either the found number or 0, then call it with the same valid and out-of-range indexes as before, printing both results.",
      expectedResult: "The program prints the correct number for the valid index and undefined for the out-of-range index from safeGet(), then two safely handled numeric results from sumIfPresent(), with no runtime crash from the out-of-range access.",
      tests: ["double(x: number) uses an explicit type annotation, matching what noImplicitAny would require if inference could not determine it", "safeGet() is typed to return number | undefined, correctly reflecting that an out-of-range index access can produce undefined at runtime"],
      hint: "In real JavaScript, accessing an array index that doesn't exist, like a 3-item array's index 10, does not throw; it simply evaluates to undefined, which is exactly what noUncheckedIndexedAccess makes the type system reflect honestly.",
      lessonAssessment: [
        {
          question: "What does noImplicitAny require?",
          options: [
            "Every variable must be explicitly typed as any",
            "Every parameter or variable must have either an inferable type or an explicit annotation, instead of silently falling back to any",
            "Functions can no longer have parameters",
            "It disables type checking entirely",
          ],
          correctAnswerIndex: 1,
          explanation: "noImplicitAny prevents TypeScript from silently treating an untyped parameter or variable as any, requiring either type inference or an explicit annotation instead.",
        },
        {
          question: "What does noUncheckedIndexedAccess change about the type of items[10] on a number[] array?",
          options: [
            "Nothing changes",
            "It makes the result type include | undefined, correctly reflecting that an out-of-range index returns undefined at runtime",
            "It makes index access throw a compile-time error on every access",
            "It converts every array to a Record type",
          ],
          correctAnswerIndex: 1,
          explanation: "noUncheckedIndexedAccess makes an indexed lookup's result type honestly include | undefined, since an out-of-range index really can produce undefined at runtime in JavaScript.",
        },
      ],
      commonMistakes: ["Leaving a function parameter without a type annotation and assuming TypeScript will always infer something useful, when noImplicitAny would flag it as an error if inference can't determine a real type.", "Treating an array index access as always safe and guaranteed to return a real value, without considering that the index could be out of range and actually return undefined at runtime."],
      deliverables: ["A script with a tsconfig comment block, an explicitly typed function, and a safeGet() function correctly typed to include | undefined"],
      assessmentCriteria: ["The explanation of noImplicitAny correctly matches what an untyped parameter would trigger", "safeGet() is correctly typed to reflect that an out-of-range index can produce undefined"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code: '// ==== tsconfig.json (relevant flags) ====\n// {\n//   "compilerOptions": {\n//     "strict": true,\n//     "noImplicitAny": true,\n//     "noUncheckedIndexedAccess": true\n//   }\n// }\n\nfunction double(x: number): number {\n  // Without an explicit type on x, and with noImplicitAny enabled,\n  // this parameter would be a compile-time error instead of silently any.\n  return x * 2;\n}\n\nconst items: number[] = [10, 20, 30];\n\nfunction safeGet(list: number[], index: number): number | undefined {\n  return list[index];\n}\n\nconsole.log(double(4));\nconsole.log(safeGet(items, 1));\nconsole.log(safeGet(items, 10));',
        explanation: "double(x: number) satisfies what noImplicitAny would require, and safeGet()'s return type honestly reflects that list[10] on a 3-item array evaluates to undefined at runtime, exactly as noUncheckedIndexedAccess enforces.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Why any Should Be Avoided in Real Codebases",
      goal: "Understand precisely how any disables type checking, how it silently spreads through connected code, and refactor an any-typed function into a properly typed one.",
      videoTitle: "TypeScript: Why any Is Dangerous in Real Codebases",
      videoSearchQuery: "typescript why avoid any type danger explained",
      videoLearningGoal: "See a typo or wrong-type mistake slip through completely undetected on an any-typed value, then get caught immediately once the same code is properly typed.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "any disables type checking entirely for that value: any property access, method call, or assignment on it is allowed, with zero compile-time verification.",
        "any is contagious: once an any value flows into another variable, parameter, or return type without an explicit annotation, that new location often silently becomes any too.",
        "unknown, generics, and proper interfaces each solve the same 'I don't know the exact type yet' problem any is often reached for, without giving up type checking altogether.",
      ],
      notes:
        "any looks like a convenient escape hatch when a type is unclear or annoying to write out, but it isn't a neutral, harmless default: it turns off type checking for that value completely, and that loss of checking can spread silently to every place that value touches.",
      conceptExplanation:
        "function getTotal(order: any): number { return order.total; } compiles with no complaints at all, even if order.total is misspelled as order.totall, even if order is actually a string, and even if order is missing entirely and is undefined; none of these real mistakes are caught until, or unless, the code actually runs and crashes. Worse, any spreads: const total = getTotal(order); leaves total implicitly typed any too, since TypeScript has nothing to infer it from, and every place total is later used inherits that same lack of checking, often far away from where the original any was introduced. The fix is rarely 'never use any under any circumstance'; it's choosing the right, more precise tool for what any was being used to avoid: interface Order { total: number } if the shape is actually knowable, unknown plus a type guard (from an earlier module) if the shape genuinely isn't known ahead of time and needs runtime validation, or a generic <T> if the function is meant to work correctly across many different types while preserving the connection between them.",
      whyItMatters: "any silently removes the exact safety net TypeScript exists to provide, and because it spreads to connected code, a single any in one place can quietly erase type checking across a much larger part of a codebase than it first appears to.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Write a function getTotal(order: any): number that returns order.total. Call it with an object that has a total property spelled correctly, and print the result. Then, in a comment directly below, write a second call using an object with total misspelled as totall, and explain in one line why TypeScript does not catch this mistake at compile time even though it would produce an incorrect result (NaN or undefined) if actually run. Finally, refactor getTotal into a properly typed version: define interface Order { total: number }, rewrite the function as getTotalSafe(order: Order): number, and show, in a second comment, that passing an object with total misspelled as totall to getTotalSafe would now correctly fail to compile.",
      challenge: "Write a small function processOrders(orders: unknown[]): number that safely sums the total of every valid order in the array, using a type guard function isOrder(value: unknown): value is Order (from the JSON validation pattern in an earlier module) to skip any entries that don't match the Order shape, and call it with an array mixing valid Order objects and at least one invalid entry, printing the correctly computed total.",
      expectedResult: "The program prints the correct total from the properly spelled call to getTotal(), and the accompanying comments correctly demonstrate both why the any version hides the misspelling mistake and why the properly typed getTotalSafe version would catch it at compile time.",
      tests: ["getTotal(order: any) is shown accepting a misspelled property with no compile-time error, demonstrated through a comment", "getTotalSafe(order: Order) uses a real interface instead of any, and the comment correctly explains why the same misspelling would fail to compile against it"],
      hint: "The core difference to demonstrate is not that the any version behaves differently at runtime, it's that TypeScript itself gives you zero warning about the mistake until you actually run the code.",
      lessonAssessment: [
        {
          question: "What does typing a parameter as any actually do to type checking for that value?",
          options: [
            "It makes type checking stricter",
            "It disables type checking entirely for that value, allowing any property access or operation with no compile-time verification",
            "It has no effect at all",
            "It automatically infers the most likely real type",
          ],
          correctAnswerIndex: 1,
          explanation: "any completely opts a value out of TypeScript's type checking, so mistakes like a misspelled property or wrong assumed shape produce no compile-time warning at all.",
        },
        {
          question: "What does it mean for any to be 'contagious' in a codebase?",
          options: [
            "any causes the program to run slower over time",
            "A value typed any can flow into other variables or return types with no explicit annotation, silently making those locations any as well",
            "any automatically converts every other type in the file to any",
            "any cannot be assigned to any other variable at all",
          ],
          correctAnswerIndex: 1,
          explanation: "Once an any value flows into another location without an explicit type, TypeScript often has nothing precise to infer, so the lack of checking silently spreads to that new location too." ,
        },
      ],
      commonMistakes: ["Reaching for any as a quick fix whenever a type is inconvenient or unclear to write, instead of using unknown with a type guard, a proper interface, or a generic depending on the actual situation.", "Not realizing that an any value assigned to an unannotated variable or returned from an unannotated function silently spreads the same lack of type checking to that new location too."],
      deliverables: ["A script comparing an any-typed getTotal() with a properly typed getTotalSafe(order: Order), with comments demonstrating the difference in compile-time safety"],
      assessmentCriteria: ["The any version is shown accepting a mistaken property name with no compile-time warning", "getTotalSafe() correctly replaces any with a real Order interface, and the explanation correctly identifies why it would now catch the same mistake"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "typescript",
        code: 'function getTotal(order: any): number {\n  return order.total;\n}\n\nconsole.log(getTotal({ total: 42 })); // works, prints 42\n\n// console.log(getTotal({ totall: 42 }));\n// This compiles with no error at all, because order is any, so\n// order.total is also any and completely unchecked. At runtime it\n// would evaluate to undefined instead of 42, silently.\n\ninterface Order {\n  total: number;\n}\n\nfunction getTotalSafe(order: Order): number {\n  return order.total;\n}\n\nconsole.log(getTotalSafe({ total: 42 })); // works, prints 42\n\n// getTotalSafe({ totall: 42 });\n// This line would now fail to compile: Order requires a real "total"\n// property, so the misspelled "totall" is caught immediately instead\n// of silently slipping through the way it did with any.',
        explanation: "getTotal accepts the misspelled property with zero warning because any disables checking entirely, while getTotalSafe's Order interface catches the exact same mistake at compile time instead of letting it reach runtime.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Testing & Code Quality in TypeScript Assessment",
    questions: [
      { question: "Why is assertEquals<T>(actual: T, expected: T, label: string) written as a generic instead of using any?", options: ["any is not allowed as a function parameter type", "The generic ensures actual and expected must be the same type, catching a mismatch at compile time", "Generics make the function run faster", "There is no real difference"], correctAnswerIndex: 1, explanation: "A shared type parameter T forces actual and expected to be the same type, which any would not enforce at all." },
      { question: "In a test runner, what is the purpose of wrapping each test function call in its own try/catch?", options: ["To make tests run in a random order", "To catch a thrown assertion failure from one test so it reports as FAIL without stopping the rest of the tests from running", "try/catch has no real effect here", "To automatically fix failing tests"], correctAnswerIndex: 1, explanation: "Isolating each test call in try/catch means one failure is reported individually while the remaining tests still get a chance to run." },
      { question: "What does noImplicitAny require in a TypeScript project?", options: ["Every variable must explicitly be any", "Every parameter or variable must have an inferable type or an explicit annotation, instead of silently defaulting to any", "It disables all type checking", "It only applies to function return types"], correctAnswerIndex: 1, explanation: "noImplicitAny prevents TypeScript from silently falling back to any when it cannot infer a type, requiring an explicit annotation instead." },
      { question: "What does noUncheckedIndexedAccess change about accessing items[10] on a number[] array?", options: ["Nothing changes", "The result type includes | undefined, correctly reflecting that an out-of-range index returns undefined at runtime", "It throws a compile-time error on every array access", "It converts the array into a tuple"], correctAnswerIndex: 1, explanation: "noUncheckedIndexedAccess makes an index lookup's type honestly reflect that the value might not exist, adding | undefined to the result type." },
      { question: "What does strict: true in tsconfig.json do?", options: ["It only affects code comments", "It bundles together several individual strictness flags, including noImplicitAny and strictNullChecks", "It disables all type errors", "It only works with .js files, not .ts files"], correctAnswerIndex: 1, explanation: "strict: true is a bundle setting that turns on several individual stricter checks together, rather than a single standalone flag." },
      { question: "What does typing a parameter as any do to type checking for that value?", options: ["Makes checking stricter", "Disables type checking entirely for that value, allowing any operation with no compile-time verification", "Has no real effect", "Automatically infers the correct type"], correctAnswerIndex: 1, explanation: "any turns off type checking completely for that value, so mistakes like a misspelled property produce no compile-time warning." },
      { question: "Why is any described as 'contagious' in a codebase?", options: [
          "It makes the program crash immediately",
          "A value typed any can flow into other unannotated variables or return types, silently making those locations any as well",
          "It automatically converts strings into numbers",
          "any cannot be passed into any function",
        ], correctAnswerIndex: 1, explanation: "Without an explicit annotation, TypeScript often cannot infer a precise type for a location that received an any value, so the lack of checking spreads." },
      { question: "In function getTotal(order: any): number { return order.total; }, what happens if the caller passes { totall: 42 } (misspelled)?", options: [
          "TypeScript reports a compile-time error immediately",
          "It compiles with no warning at all, since order is any, and the mistake would only surface as incorrect behavior at runtime",
          "TypeScript automatically corrects the spelling",
          "The function refuses to run",
        ], correctAnswerIndex: 1, explanation: "Because order is any, order.total is unchecked, so a misspelled property like totall produces no compile-time warning and the mistake is only visible at runtime." },
      { question: "What is the typical fix for a function that reaches for any because the exact shape of its input is unclear at compile time?", options: [
          "There is no fix; any must be used whenever a shape is unclear",
          "Use a proper interface if the shape is actually known, or unknown with a type guard if it needs runtime validation, or a generic if the function must work across multiple types",
          "Always convert the value to a string first",
          "Always wrap the function in a try/catch instead of typing it",
        ], correctAnswerIndex: 1, explanation: "The right replacement for any depends on the actual situation: a known shape calls for an interface, an unverified shape calls for unknown plus a type guard, and multi-type support calls for a generic." },
      { question: "Why does replacing any with interface Order { total: number } in getTotalSafe(order: Order) catch a misspelled totall property that any would not?", options: [
          "Because interfaces run a spell-check on property names automatically",
          "Because Order specifies exactly which properties are allowed and required, so an object missing the real total property fails to satisfy that type at compile time",
          "Because Order converts every property name to lowercase automatically",
          "There is no real difference between Order and any here",
        ], correctAnswerIndex: 1, explanation: "A real interface defines exactly what properties are required, so an object that doesn't actually have a total property (only a misspelled totall) fails to satisfy Order and is caught at compile time." },
    ],
  },
  assignment:
    "Build a small 'Typed Test Suite for a Calculator': write functions add(a: number, b: number): number, subtract(a: number, b: number): number, and multiply(a: number, b: number): number. Write a generic assertEquals<T>(actual: T, expected: T, label: string): void helper. Write three test functions, testAdd(), testSubtract(), and testMultiply(), each containing at least two assertEquals() calls covering typical and edge cases (such as zero or negative numbers). Build a small test runner that loops over all three test functions, catches any thrown assertion failures, and prints a PASS or FAIL line for each test plus a final summary count. Intentionally include one incorrect assertion in one test function to prove your runner correctly reports a FAIL without crashing the rest of the suite, then fix it and show the corrected, fully passing output as well.",
  assignmentDeliverables: [
    "A script defining add, subtract, multiply, a generic assertEquals<T>, three test functions, and a test runner",
    "Printed output showing an intentional FAIL case handled correctly, followed by a corrected run where every test passes",
  ],
  assignmentAssessmentCriteria: [
    "assertEquals<T> is correctly generic and used consistently across all three test functions",
    "The test runner correctly isolates and reports each test's pass/fail status individually with an accurate summary count",
  ],
  miniProject:
    "Build a 'Type-Safety Refactor Report' script: write a function summarizeInvoice(invoice: any): string using any, along with a comment demonstrating a realistic misspelled or missing property that any allows through undetected. Refactor it into a properly typed version: define interface Invoice { id: number; client: string; amount: number }, write summarizeInvoiceSafe(invoice: Invoice): string, and add a comment showing the same mistake now correctly failing to compile. Then write a generic assertEquals<T> helper and a small test suite (at least two test functions) verifying summarizeInvoiceSafe() produces the correct summary string for at least two different valid Invoice objects, using your own test runner from earlier in this module to print PASS/FAIL results and a summary count. Finish with a short comment listing the specific category of bug each of noImplicitAny and noUncheckedIndexedAccess would have caught in this file, if either had been introduced.",
  miniProjectDeliverables: [
    "A script with an any-typed summarizeInvoice(), a properly typed summarizeInvoiceSafe() using interface Invoice, and comments demonstrating the compile-time difference between them",
    "A small typed test suite with a working test runner verifying summarizeInvoiceSafe(), plus a closing comment naming what noImplicitAny and noUncheckedIndexedAccess each would have caught",
  ],
  miniProjectAssessmentCriteria: [
    "The any and properly typed versions clearly and correctly demonstrate the difference in compile-time safety through accurate comments",
    "The test suite and runner correctly verify summarizeInvoiceSafe() across at least two cases and report accurate PASS/FAIL results with a summary count",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
