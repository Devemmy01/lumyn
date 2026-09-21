import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module7: GeneratedModule = {
  title: "Testing & Code Quality",
  description:
    "Write assertion-style checks with console.assert and manual comparisons, adopt the describe/it mental model used by testing frameworks like Jest, and apply naming and readability practices that make code easier to test and maintain.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Assertion-Style Checks: console.assert and Manual Comparisons",
      goal: "Write simple assertion-style checks using console.assert() and manual comparisons to verify that a function's output matches what is expected.",
      videoTitle: "JavaScript Testing Basics: console.assert and Manual Checks",
      videoSearchQuery: "javascript console.assert testing basics tutorial",
      videoLearningGoal: "See console.assert() and manual comparison checks confirm whether a function's output matches the expected result.",
      recommendedChannels: ["freeCodeCamp.org", "Web Dev Simplified"],
      keyTakeaways: [
        "console.assert(condition, message) prints message only when condition is false, and does nothing when the condition is true.",
        "A manual comparison check, like if (actual !== expected) { console.error(...); }, verifies a function's output without needing any testing library.",
        "Testing a function well means calling it with several different known inputs, including edge cases, and checking that each output matches what is expected.",
      ],
      notes:
        "Testing does not require an installed framework to get started. Calling a function with a known input and checking that its output matches what you expect, repeated across several cases, is the core idea behind every testing tool, and console.assert() plus manual comparisons let you practice that idea directly.",
      conceptExplanation:
        "console.assert(add(2, 3) === 5, \"add(2,3) should equal 5\") prints nothing at all if the condition is true, but if add() had a bug and returned 6 instead, it would print an assertion failure including the given message. A more informative pattern is a small helper: function assertEqual(actual, expected, testName) { if (actual === expected) { console.log(`PASS: ${testName}`); } else { console.error(`FAIL: ${testName} — expected ${expected}, got ${actual}`); } }, which gives a clear PASS or FAIL line for every check instead of only reporting failures.",
      whyItMatters: "Even simple assertion-style checks catch bugs before they reach real users, and they give you confidence that changing or refactoring code later has not broken behavior that used to work correctly.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Write a function add(a, b) and a function isEven(n). Use console.assert() to check at least 3 cases total across both functions, including at least one edge case (like isEven(0)). Then write a helper function assertEqual(actual, expected, testName) that prints PASS or FAIL messages as described above, and use it to check the same two functions with at least 3 more cases.",
      challenge: "Add one deliberately incorrect assertEqual check (for example, checking that add(2, 2) equals 5) to see the FAIL output printed correctly, then fix the expected value and rerun to see it pass. Add a simple counter that tracks how many of your assertEqual checks passed out of the total, and print that summary at the end.",
      expectedResult: "The program prints assertion results for every check, correctly distinguishing passing cases from failing ones, including the edge case for isEven(0).",
      tests: ["console.assert() is used with at least one real, meaningful condition being checked", "assertEqual() correctly reports PASS or FAIL based on comparing actual and expected values"],
      hint: "A test is only useful if it could actually fail given a bug; testing a function against a value that is always trivially true does not verify anything meaningful.",
      lessonAssessment: [
        {
          question: "What does console.assert(false, \"message\") do?",
          options: [
            "Prints nothing, since the condition is false",
            "Prints the given message to the console, since the condition is false",
            "Throws an error and stops the program",
            "Always prints the message regardless of the condition",
          ],
          correctAnswerIndex: 1,
          explanation: "console.assert() prints its message only when the given condition is false; a true condition produces no output at all.",
        },
        {
          question: "Why is it important to test a function like isEven() with the edge case 0, not just typical numbers like 4 or 7?",
          options: [
            "0 is not actually a valid input to test",
            "Edge cases like 0 often reveal bugs that typical inputs do not",
            "isEven(0) always throws an error in JavaScript",
            "Testing edge cases is optional and rarely useful",
          ],
          correctAnswerIndex: 1,
          explanation: "Edge cases, like 0, negative numbers, or empty values, are where bugs most often hide, so testing only typical inputs can miss real problems.",
        },
      ],
      commonMistakes: ["Writing assertions that can never actually fail, like comparing a function's result to itself, which verifies nothing meaningful about the code's correctness.", "Only testing typical, expected inputs and skipping edge cases like 0, negative numbers, or empty arrays, where many real bugs actually occur."],
      deliverables: ["A script with console.assert() checks and an assertEqual() helper function used on at least two functions"],
      assessmentCriteria: ["Assertions correctly verify real, meaningful conditions rather than trivial ones", "At least one edge case is included among the tested inputs"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'function add(a, b) {\n  return a + b;\n}\n\nfunction isEven(n) {\n  return n % 2 === 0;\n}\n\nconsole.assert(add(2, 3) === 5, "add(2,3) should equal 5");\nconsole.assert(isEven(0) === true, "isEven(0) should be true");\n\nfunction assertEqual(actual, expected, testName) {\n  if (actual === expected) {\n    console.log(`PASS: ${testName}`);\n  } else {\n    console.error(`FAIL: ${testName} — expected ${expected}, got ${actual}`);\n  }\n}\n\nassertEqual(add(-2, -3), -5, "add handles negative numbers");\nassertEqual(isEven(7), false, "isEven correctly identifies odd numbers");',
        explanation: "console.assert() silently passes when its condition is true and only reports failures, while assertEqual() prints an explicit PASS or FAIL line for every check, including the isEven(0) edge case.",
      },
      completionStatus: "not_started",
    },
    {
      title: "The describe/it Mental Model: Thinking Like Jest",
      goal: "Understand the describe/it structure used by testing frameworks like Jest conceptually, and organize your own checks using that same mental model.",
      videoTitle: "Jest describe and it Explained: Thinking Like a Test Framework",
      videoSearchQuery: "jest describe it testing tutorial explained beginners",
      videoLearningGoal: "See how describe groups related tests and it defines one individual, clearly named test case.",
      recommendedChannels: ["The Net Ninja", "Traversy Media"],
      keyTakeaways: [
        "In frameworks like Jest, describe(\"group name\", callback) groups related tests together under one readable label.",
        "it(\"should do something\", callback) (sometimes written as test(...)) defines one individual test case with a clear, descriptive name.",
        "Structuring your own checks with the same grouped, descriptively named pattern makes them far easier to read and maintain, even without an installed framework.",
      ],
      notes:
        "The Academy workspace runs plain JavaScript rather than an installed Jest environment, so this lesson teaches the describe/it mental model conceptually and has you simulate the same structure yourself using plain functions, which is exactly how the real pattern works underneath.",
      conceptExplanation:
        "In real Jest code, describe(\"add()\", () => { it(\"adds two positive numbers\", () => { expect(add(2, 3)).toBe(5); }); it(\"handles negative numbers\", () => { expect(add(-2, -3)).toBe(-5); }); }); groups every test about add() under one label, and each it() names exactly one specific behavior being checked. You can simulate the same organization with plain functions: a describe(name, callback) helper that prints the group name and then calls callback(), and an it(name, callback) helper that runs callback() inside a try/catch, printing PASS if it completes and FAIL with the caught error's message if it throws, giving the same readable, grouped structure without needing an installed framework.",
      whyItMatters: "Nearly every professional JavaScript codebase using Jest or a similar framework organizes its tests with describe/it, so recognizing and thinking in this structure is essential even before you use the framework itself.",
      practicalTask:
        "In script.js, write two helper functions: describe(name, callback) that prints the group name and calls callback(), and it(name, callback) that calls callback() inside a try/catch, printing \"PASS: name\" if no error is thrown, or \"FAIL: name — \" plus the error's message if one is. Inside an it() test body, use throw new Error(\"...\") when a check fails, instead of a separate expect() library. Use describe/it to organize at least 4 test cases across 2 groups, testing two different functions (for example, add() and isEven() from the previous lesson).",
      challenge: "Make one of your it() test bodies intentionally throw (a failing check), and confirm your it() helper correctly reports FAIL with a useful message instead of crashing the script, so every other test after it still runs and reports its own result.",
      expectedResult: "The output prints each describe group's name followed by a PASS or FAIL line for every it() test case inside it, and a deliberately failing test does not stop the remaining tests from running and reporting.",
      tests: ["describe() and it() helper functions are defined and used to organize test cases into at least 2 named groups", "it() correctly catches a thrown error from a failing test and reports FAIL without stopping the rest of the tests"],
      hint: "Wrapping each it() test body's execution in its own try/catch inside the it() helper is what lets one failing test report FAIL without crashing every test that runs after it.",
      lessonAssessment: [
        {
          question: "What is the role of describe(\"group name\", callback) in the Jest mental model?",
          options: [
            "It runs a single specific test case",
            "It groups related individual test cases together under one readable label",
            "It replaces the need for individual it() test cases entirely",
            "It only works for testing numbers",
          ],
          correctAnswerIndex: 1,
          explanation: "describe() organizes a set of related it() test cases under one shared, descriptive group name.",
        },
        {
          question: "In a simulated it(name, callback) helper using try/catch, what happens if callback() throws an error?",
          options: [
            "The whole script stops immediately",
            "The helper catches the error and reports that specific test as FAIL, without stopping other tests",
            "The error is silently ignored with no output",
            "It automatically retries the test",
          ],
          correctAnswerIndex: 1,
          explanation: "Catching the error inside the it() helper lets it report that one test as failed while allowing every other test to still run afterward.",
        },
      ],
      commonMistakes: ["Writing all assertions as one long flat list with no grouping or descriptive test names, making it hard to tell what each check is actually verifying.", "Letting a failing test's thrown error crash the entire script instead of catching it inside the test runner helper, which stops every test after it from ever running."],
      deliverables: ["A script defining describe() and it() helper functions, used to organize at least 4 test cases across 2 groups"],
      assessmentCriteria: ["describe() and it() are used correctly to group and name test cases", "A failing test is correctly caught and reported without stopping the remaining tests"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'function describe(name, callback) {\n  console.log(`\\n${name}`);\n  callback();\n}\n\nfunction it(name, callback) {\n  try {\n    callback();\n    console.log(`  PASS: ${name}`);\n  } catch (error) {\n    console.log(`  FAIL: ${name} — ${error.message}`);\n  }\n}\n\nfunction add(a, b) {\n  return a + b;\n}\n\ndescribe("add()", () => {\n  it("adds two positive numbers", () => {\n    if (add(2, 3) !== 5) throw new Error("expected 5");\n  });\n  it("handles negative numbers", () => {\n    if (add(-2, -3) !== -5) throw new Error("expected -5");\n  });\n});',
        explanation: "describe() prints the group label and runs its callback; it() runs each test body inside try/catch, reporting PASS or FAIL for that individual test without stopping the others.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Naming, Readability, and Code Quality Practices",
      goal: "Apply naming, readability, and code-quality practices that make JavaScript code easier to test, debug, and maintain.",
      videoTitle: "JavaScript Clean Code Tutorial: Naming and Readability",
      videoSearchQuery: "javascript clean code naming readability best practices tutorial",
      videoLearningGoal: "See poorly named, hard-to-read code refactored into clear, descriptive, well-organized functions.",
      recommendedChannels: ["Fireship", "Programming with Mosh"],
      keyTakeaways: [
        "Descriptive names, like calculateDiscount instead of calc or fn1, make code self-documenting and easier for both testers and future readers to understand.",
        "Small, single-purpose functions are easier to test individually and easier to name accurately than large functions handling several unrelated jobs at once.",
        "Avoiding duplicated logic by extracting it into one well-named helper function keeps code easier to maintain, since a fix only needs to happen in one place.",
      ],
      notes:
        "Code quality is not just about appearance, it directly affects how easy code is to test, debug, and safely change later. Well-named, small functions are also the easiest functions to write clear, focused it() tests for, tying this lesson directly to the previous two.",
      conceptExplanation:
        "A function named fn1(x, y) { return x * y * 0.1; } tells a reader nothing about what it computes, while calculateDiscount(price, quantity) { return price * quantity * 0.1; } states exactly what it does and what its parameters represent. A function that validates input, calculates a result, and formats it for display all at once is really doing three separate jobs; splitting it into three small, well-named functions makes each one individually testable with its own focused it() checks, and easier to reuse elsewhere in the program. Repeating the same calculation in several different places, instead of writing one well-named helper function called wherever it is needed, means a future bug fix has to be found and applied in every duplicated location instead of just one.",
      whyItMatters: "Code quality directly affects how easy a codebase is to test, debug, and safely change, which is exactly why professional teams treat naming and structure as seriously as functionality itself.",
      practicalTask:
        "Start from this unclear function: function calc(a, b, c) { return a * b - (a * b * c); }, which calculates a discounted total but gives no indication of what a, b, or c mean. Refactor it into a small set of clearly named functions: calculateSubtotal(price, quantity) returning price * quantity, applyDiscount(subtotal, discountRate) returning subtotal - (subtotal * discountRate), and calculateOrderTotal(price, quantity, discountRate) that combines the two. Write at least 3 assertEqual-style checks (from the first lesson in this module) confirming your refactored functions produce the same correct results the original calc() would have.",
      challenge: "Identify a piece of duplicated logic in your own code (for example, if you compute price * quantity in more than one place) and extract it into its own well-named helper function used everywhere that calculation is needed, then add a test confirming that helper function works correctly on its own.",
      expectedResult: "The refactored functions produce identical, correct results to the original unclear calc() function, confirmed by passing assertion checks, while being individually named, readable, and testable.",
      tests: ["The refactored code uses descriptive function and parameter names instead of the original unclear ones", "At least 3 assertion-style checks confirm the refactored functions produce correct results"],
      hint: "A good readability test: could someone else correctly guess what a function does just from its name and parameter names, without reading its body?",
      lessonAssessment: [
        {
          question: "Why is calculateDiscount(price, quantity) considered better than fn1(x, y) for the same logic?",
          options: [
            "It runs faster in JavaScript",
            "Its name and parameters describe what the function actually does, making the code self-documenting",
            "It uses fewer characters",
            "There is no real difference between the two",
          ],
          correctAnswerIndex: 1,
          explanation: "Descriptive names make code easier to understand without needing to read through the full implementation, which also makes it easier to test correctly.",
        },
        {
          question: "What is the main benefit of splitting a large, multi-purpose function into several small, single-purpose functions?",
          options: [
            "It always makes the code run faster",
            "Each small function becomes individually easier to name accurately and to test on its own",
            "It removes the need for any function names at all",
            "It prevents the code from ever having bugs",
          ],
          correctAnswerIndex: 1,
          explanation: "Small, focused functions are easier to name precisely and easier to write clear, targeted tests for, compared to one large function handling several responsibilities at once.",
        },
      ],
      commonMistakes: ["Choosing vague names that describe how a value is stored, like data or temp, instead of what it actually represents, like discountedTotal.", "Writing one large function that handles several unrelated responsibilities at once, making it difficult to name accurately and difficult to test each part in isolation."],
      deliverables: ["A refactored, clearly named version of the original calc() function, with passing assertion checks confirming correctness"],
      assessmentCriteria: ["Function and parameter names clearly describe their purpose", "The refactored functions produce results verified as correct by assertion checks"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'function calculateSubtotal(price, quantity) {\n  return price * quantity;\n}\n\nfunction applyDiscount(subtotal, discountRate) {\n  return subtotal - subtotal * discountRate;\n}\n\nfunction calculateOrderTotal(price, quantity, discountRate) {\n  const subtotal = calculateSubtotal(price, quantity);\n  return applyDiscount(subtotal, discountRate);\n}\n\nfunction assertEqual(actual, expected, testName) {\n  if (actual === expected) {\n    console.log(`PASS: ${testName}`);\n  } else {\n    console.error(`FAIL: ${testName} — expected ${expected}, got ${actual}`);\n  }\n}\n\nassertEqual(calculateOrderTotal(10, 5, 0.1), 45, "order total applies a 10% discount correctly");',
        explanation: "Splitting the original unclear calc() logic into calculateSubtotal, applyDiscount, and calculateOrderTotal makes each step individually readable and testable, and the assertion confirms the refactor still produces the correct result.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Testing & Code Quality Assessment",
    questions: [
      { question: "What does console.assert(condition, message) do when condition is true?", options: ["Prints the message anyway", "Prints nothing at all", "Throws an error", "Stops the program"], correctAnswerIndex: 1, explanation: "console.assert() only prints its message when the condition is false; a true condition produces no output." },
      { question: "Why is testing a function with an edge case like 0 or an empty array important?", options: ["Edge cases are not real inputs and can be skipped", "Edge cases often reveal bugs that typical inputs do not", "JavaScript automatically tests edge cases for you", "Edge cases always cause errors regardless of the code"], correctAnswerIndex: 1, explanation: "Edge cases frequently expose bugs that testing only with typical, expected inputs would miss." },
      { question: "In the Jest mental model, what does describe(\"group name\", callback) do?", options: ["Runs one individual test case", "Groups related test cases together under one readable label", "Deletes previously defined tests", "Only works with numeric values"], correctAnswerIndex: 1, explanation: "describe() organizes related it() test cases together under a shared, descriptive label." },
      { question: "What does it(\"should do something\", callback) represent in the Jest mental model?", options: ["An entire test suite", "One individual, clearly named test case", "A configuration setting", "A type of error"], correctAnswerIndex: 1, explanation: "it() (or test()) defines a single test case describing one specific expected behavior." },
      { question: "In a simulated it() helper using try/catch, what happens if the test body throws an error?", options: ["The whole script crashes immediately", "That specific test is reported as FAIL, without stopping the remaining tests", "The error is silently ignored", "The test automatically passes"], correctAnswerIndex: 1, explanation: "Catching the thrown error inside the it() helper lets it report just that test as failed while every other test still runs afterward." },
      { question: "Why is calculateDiscount(price, quantity) a better function name than fn1(x, y) for the same logic?", options: ["It runs faster", "It clearly describes what the function does and what its parameters mean", "It uses fewer characters to type", "There is no meaningful difference"], correctAnswerIndex: 1, explanation: "Descriptive names make code self-documenting, which improves both readability and how easily the function can be tested correctly." },
      { question: "What is the main benefit of splitting a large function into several small, single-purpose functions?", options: ["It guarantees the code has no bugs", "Each small function becomes easier to name accurately and to test individually", "It always makes the program run faster", "It removes the need for testing entirely"], correctAnswerIndex: 1, explanation: "Small, focused functions are easier to name precisely and to test on their own, compared to one large function handling multiple responsibilities." },
      { question: "What problem does extracting duplicated logic into one well-named helper function solve?", options: [
          "It makes the code run in a different order",
          "A future bug fix only needs to be applied in one place instead of every duplicated location",
          "It removes the need for function names",
          "It prevents the function from ever being tested",
        ], correctAnswerIndex: 1, explanation: "Removing duplication means a change or fix only needs to happen once, in the shared helper function, instead of in every place the logic was copied." },
      { question: "What does an assertEqual(actual, expected, testName) helper function typically do?", options: [
          "Always throws an error regardless of the values",
          "Compares actual to expected and prints a PASS or FAIL message labeled with testName",
          "Deletes the actual value if it is wrong",
          "Only works with string values",
        ], correctAnswerIndex: 1, explanation: "An assertEqual helper compares the actual and expected values and clearly reports whether that specific named check passed or failed." },
      { question: "Why does professional JavaScript code commonly organize tests with describe/it instead of one long flat list of checks?", options: [
          "JavaScript requires this structure to run any code",
          "Grouped, descriptively named tests are far easier to read, navigate, and maintain than an unorganized flat list",
          "describe/it makes the code run faster",
          "It removes the need for functions to have parameters",
        ], correctAnswerIndex: 1, explanation: "Organizing tests into named groups with clearly described individual cases makes a growing test suite much easier to read and maintain over time." },
    ],
  },
  assignment:
    "Build a 'Tested Utility Library': write at least 3 small, clearly named utility functions, for example capitalize(str), isPalindrome(str), and sumArray(numbers). For each function, use the describe/it pattern from this module to write at least 2 test cases per function (at least 6 total), including at least one edge case per function (like an empty string or an empty array). Print a final summary counting how many tests passed and how many failed out of the total.",
  assignmentDeliverables: [
    "A script defining at least 3 utility functions and describe/it helper functions",
    "At least 6 test cases organized with describe/it, including at least one edge case per function",
    "A printed final summary showing the total number of tests that passed and failed",
  ],
  assignmentAssessmentCriteria: [
    "Each utility function is correctly implemented and clearly named",
    "Tests are organized with describe/it and include meaningful edge cases",
    "The final pass/fail summary accurately reflects the individual test results",
  ],
  miniProject:
    "Refactor and test a 'Messy Checkout Calculator': start from a single unclear function that computes a subtotal, tax, and shipping cost together with unclear parameter names, and refactor it into small, well-named functions: calculateSubtotal(price, quantity), calculateTax(subtotal, taxRate), and calculateShipping(subtotal) (for example, free shipping above a threshold and a flat rate below it), combined by one calculateOrderTotal(price, quantity, taxRate) function. Organize describe/it test groups for each function, covering at least 6 test cases total including at least one edge case (like quantity 0 or a subtotal exactly at the shipping threshold), and print a final pass/fail summary count.",
  miniProjectDeliverables: [
    "A script with the refactored calculateSubtotal, calculateTax, calculateShipping, and calculateOrderTotal functions",
    "describe/it test groups covering at least 6 test cases across the refactored functions",
    "A printed final summary showing the total number of tests that passed and failed",
  ],
  miniProjectAssessmentCriteria: [
    "The refactored functions are clearly named and each handles one specific responsibility",
    "Tests are correctly organized with describe/it and include at least one meaningful edge case",
    "The final summary accurately reflects how many of the organized tests passed and failed",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
