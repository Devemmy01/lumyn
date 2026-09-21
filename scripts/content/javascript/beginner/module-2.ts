import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module2: GeneratedModule = {
  title: "Data Types & Operators",
  description:
    "Learn JavaScript's primitive data types, how typeof reveals what you're working with, and how arithmetic, comparison, and logical operators combine values, including the difference between === and ==.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Primitive Data Types and typeof",
      goal: "Identify JavaScript's primitive types and use typeof to check what kind of value a variable holds.",
      videoTitle: "JavaScript Data Types Explained: string, number, boolean, undefined, null",
      videoSearchQuery: "javascript primitive data types typeof tutorial for beginners",
      videoLearningGoal: "See examples of each primitive type and how the typeof operator reports them.",
      recommendedChannels: ["freeCodeCamp.org", "Web Dev Simplified"],
      keyTakeaways: [
        "JavaScript's core primitive types are string, number, boolean, undefined, and null.",
        "typeof value returns a string naming the type, like \"string\" or \"number\".",
        "A variable declared but not yet assigned a value automatically holds undefined.",
      ],
      notes:
        "Every value in JavaScript has a type. Text lives in strings (wrapped in quotes), numbers cover both whole and decimal values in one type, booleans are true or false, undefined means a variable exists but has no value yet, and null is an intentional 'no value' that you assign yourself. The typeof operator lets you check a value's type at any point in your code.",
      conceptExplanation:
        "typeof \"hello\" returns \"string\", typeof 42 returns \"number\", typeof true returns \"boolean\", and typeof undefined returns \"undefined\". Oddly, typeof null returns \"object\", a long-standing quirk in JavaScript that you should just remember rather than rely on logically. Unlike some languages, JavaScript does not require you to declare a variable's type in advance: a variable can hold a string today and a number tomorrow, since JavaScript is dynamically typed.",
      whyItMatters: "Knowing a value's type explains why some operations work and others produce unexpected results, especially once you start comparing or combining values.",
      practicalTask:
        "Create one variable for each primitive type covered in this lesson: a string, a number, a boolean, one left undefined, and one set to null. Print each variable together with its typeof result using console.log().",
      challenge: "Print typeof null and explain in a comment why it says \"object\" even though null is not really an object.",
      expectedResult: "The script prints five lines, each showing a value alongside the type that typeof reports for it.",
      tests: ["Five variables are declared covering string, number, boolean, undefined, and null", "typeof is used to print the type of each variable"],
      hint: "typeof is used like an operator, not a function call: typeof myVariable, no parentheses required.",
      lessonAssessment: [
        {
          question: "What does typeof \"hello\" return?",
          options: ["\"text\"", "\"string\"", "\"char\"", "\"word\""],
          correctAnswerIndex: 1,
          explanation: "typeof reports text values as \"string\".",
        },
        {
          question: "What does typeof null return?",
          options: ["\"null\"", "\"undefined\"", "\"object\"", "\"boolean\""],
          correctAnswerIndex: 2,
          explanation: "This is a well-known quirk in JavaScript: typeof null returns \"object\", even though null is its own primitive type.",
        },
      ],
      commonMistakes: ["Confusing undefined (no value assigned yet) with null (intentionally no value).", "Expecting typeof null to return \"null\"."],
      deliverables: ["A script declaring all five primitive types with typeof output for each"],
      assessmentCriteria: ["All five primitive types are demonstrated", "typeof output is printed correctly for each value"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 minutes",
      codeExample: {
        language: "javascript",
        code: 'let city = "Lagos";\nlet age = 25;\nlet isStudent = true;\nlet nickname;\nlet middleName = null;\n\nconsole.log(typeof city, typeof age, typeof isStudent, typeof nickname, typeof middleName);',
        explanation: "typeof reports \"string\", \"number\", \"boolean\", \"undefined\", and \"object\" respectively for these five variables.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Arithmetic and Assignment Operators",
      goal: "Use arithmetic operators to calculate values and assignment operators to update variables efficiently.",
      videoTitle: "JavaScript Arithmetic and Assignment Operators Explained",
      videoSearchQuery: "javascript arithmetic operators plus minus modulo tutorial",
      videoLearningGoal: "See +, -, *, /, and % used in expressions, plus shorthand assignment operators like += and *=.",
      recommendedChannels: ["Programming with Mosh", "The Net Ninja"],
      keyTakeaways: [
        "JavaScript's arithmetic operators are + (add), - (subtract), * (multiply), / (divide), and % (remainder).",
        "The % operator returns the remainder of a division, which is useful for checking even/odd or wrapping values.",
        "Shorthand assignment operators like += and *= update a variable using its current value in one step.",
      ],
      notes:
        "Arithmetic operators work on numbers the way you'd expect from math class, with one addition: % (the modulo or remainder operator), which returns what's left over after dividing. For example, 7 % 2 is 1, because 7 divided by 2 leaves a remainder of 1. Assignment operators like +=, -=, *=, and /= combine an operation with an assignment in one step.",
      conceptExplanation:
        "score += 5; is shorthand for score = score + 5;, and the same pattern applies to -=, *=, /=, and %=. The % operator is especially useful for checking whether a number is even (number % 2 === 0) or for cycling a value through a fixed range. The + operator also works on strings to join them together, which is called concatenation, so \"5\" + 1 produces the string \"51\" rather than the number 6, a common source of bugs worth watching for.",
      whyItMatters: "Arithmetic and assignment operators are the foundation of counters, totals, and calculations you'll use throughout every later module.",
      practicalTask:
        "Declare two number variables. Print the result of adding, subtracting, multiplying, dividing, and taking the remainder of them, each with a labeled console.log() line. Then use += to increase one of the variables and print its new value.",
      challenge: "Write an expression using % that checks whether a chosen number is even, and print \"even\" or \"odd\" based on the result using a comment explaining your logic (conditionals are covered next module, so just print the remainder for now).",
      expectedResult: "The script prints five labeled arithmetic results followed by the updated value after using +=.",
      tests: ["All five arithmetic operators (+, -, *, /, %) are demonstrated", "At least one shorthand assignment operator is used"],
      hint: "Label your output like console.log(\"Sum:\", a + b); so each result is easy to read.",
      lessonAssessment: [
        {
          question: "What does 7 % 2 evaluate to?",
          options: ["3.5", "0", "1", "14"],
          correctAnswerIndex: 2,
          explanation: "% returns the remainder after division; 7 divided by 2 is 3 with a remainder of 1.",
        },
        {
          question: "What is the value of score after this code runs?\nlet score = 10;\nscore += 5;",
          options: ["10", "5", "15", "105"],
          correctAnswerIndex: 2,
          explanation: "score += 5 is shorthand for score = score + 5, which sets score to 15.",
        },
      ],
      commonMistakes: ["Using + on a string and a number and expecting a numeric result instead of concatenation.", "Confusing / (division) with % (remainder)."],
      deliverables: ["A script demonstrating all five arithmetic operators and one shorthand assignment"],
      assessmentCriteria: ["Arithmetic results are correct", "Shorthand assignment operator is used and labeled clearly"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "javascript",
        code: 'let a = 12;\nlet b = 5;\nconsole.log("Sum:", a + b);\nconsole.log("Difference:", a - b);\nconsole.log("Remainder:", a % b);\na += 3;\nconsole.log("a after += 3:", a);',
        explanation: "Each arithmetic operator is applied to a and b, and the final line shows a updated in place using +=.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Comparison, Logical Operators, and Type Coercion",
      goal: "Compare values correctly with === and !==, combine conditions with logical operators, and understand why === is safer than ==.",
      videoTitle: "JavaScript === vs == and Logical Operators Explained",
      videoSearchQuery: "javascript strict equality vs loose equality type coercion tutorial",
      videoLearningGoal: "See side-by-side comparisons of === versus == and how && and || combine boolean expressions.",
      recommendedChannels: ["Fireship", "freeCodeCamp.org"],
      keyTakeaways: [
        "=== checks value and type together (strict equality); == converts types before comparing (loose equality).",
        "&& is true only when both sides are true; || is true when at least one side is true; ! flips a boolean.",
        "Type coercion is JavaScript automatically converting a value from one type to another, which == relies on and which often causes surprising bugs.",
      ],
      notes:
        "=== compares both the value and the type, so 5 === \"5\" is false because a number and a string are different types. == first coerces (converts) one or both values to a matching type before comparing, so 5 == \"5\" is true. Because coercion rules can be surprising, the strong convention in modern JavaScript is to always use === and !== unless you have a specific, well-understood reason to use == or !=.",
      conceptExplanation:
        "Logical operators combine or invert boolean expressions: age >= 13 && age <= 19 is true only when both comparisons are true (a teenager's age range), isAdmin || isOwner is true if either is true, and !isLoggedIn flips a false to true. Comparison operators (<, >, <=, >=, ===, !==) always produce a boolean (true or false), which is exactly what conditionals in the next module will check.",
      whyItMatters: "Reliable comparisons are the foundation of every conditional and loop condition you'll write from here on; getting == versus === wrong is one of the most common sources of JavaScript bugs.",
      practicalTask:
        "Declare two variables: one number and one string that look similar, like let num = 5; and let text = \"5\";. Print the result of comparing them with == and with ===, and explain in a comment why the results differ. Then write two console.log() lines combining comparisons with && and ||.",
      challenge: "Write an expression using ! that flips a boolean variable's value and print the result.",
      expectedResult: "The script prints differing results for == and === on the same two values, plus two lines demonstrating && and ||.",
      tests: ["Both == and === are demonstrated on the same pair of values", "At least one && expression and one || expression are printed"],
      hint: "5 === \"5\" is false because the types differ (number vs string), even though the values look the same.",
      lessonAssessment: [
        {
          question: "What does 5 === \"5\" evaluate to?",
          options: ["true", "false", "\"5\"", "undefined"],
          correctAnswerIndex: 1,
          explanation: "=== requires both value and type to match; a number and a string are different types, so this is false.",
        },
        {
          question: "What does true && false evaluate to?",
          options: ["true", "false", "undefined", "An error"],
          correctAnswerIndex: 1,
          explanation: "&& only produces true when both sides are true; since one side is false, the whole expression is false.",
        },
      ],
      commonMistakes: ["Using == instead of === and getting an unexpected true from type coercion.", "Forgetting that comparison operators return a boolean, not the compared values themselves."],
      deliverables: ["A script comparing values with == and === and combining conditions with && and ||"],
      assessmentCriteria: ["The difference between == and === is demonstrated correctly", "&& and || are each used at least once"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 minutes",
      codeExample: {
        language: "javascript",
        code: 'let num = 5;\nlet text = "5";\nconsole.log(num == text);\nconsole.log(num === text);\nconsole.log(num > 0 && num < 10);\nconsole.log(num === 1 || num === 5);',
        explanation: "== coerces types before comparing (true), while === requires matching types (false); the last two lines show && and || combining comparisons.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Data Types & Operators Assessment",
    questions: [
      { question: "What does typeof 42 return?", options: ["\"int\"", "\"number\"", "\"float\"", "\"integer\""], correctAnswerIndex: 1, explanation: "JavaScript has a single number type for both whole and decimal values, so typeof 42 is \"number\"." },
      { question: "What does typeof undefined return?", options: ["\"null\"", "\"undefined\"", "\"object\"", "\"empty\""], correctAnswerIndex: 1, explanation: "A variable with no assigned value has the type \"undefined\"." },
      { question: "What is the result of 10 % 3?", options: ["3.33", "0", "1", "3"], correctAnswerIndex: 2, explanation: "10 divided by 3 is 3 with a remainder of 1, so 10 % 3 is 1." },
      { question: "What does \"5\" + 1 produce in JavaScript?", options: ["6", "\"51\"", "\"6\"", "An error"], correctAnswerIndex: 1, explanation: "When + is used with a string and a number, JavaScript concatenates them into the string \"51\"." },
      { question: "What is the key difference between === and ==?", options: [
          "=== checks value and type; == converts types before comparing",
          "== checks value and type; === converts types before comparing",
          "They behave identically",
          "=== only works on numbers",
        ], correctAnswerIndex: 0, explanation: "=== (strict equality) requires matching type and value, while == (loose equality) coerces types first." },
      { question: "What does score += 5 do if score currently holds 20?", options: ["Sets score to 5", "Sets score to 25", "Compares score to 5", "Throws an error"], correctAnswerIndex: 1, explanation: "+= adds the right-hand value to the current value and reassigns it, so 20 + 5 becomes 25." },
      { question: "What does true || false evaluate to?", options: ["true", "false", "undefined", "An error"], correctAnswerIndex: 0, explanation: "|| is true when at least one side is true, so this evaluates to true." },
      { question: "What does !true evaluate to?", options: ["true", "false", "undefined", "\"!true\""], correctAnswerIndex: 1, explanation: "! inverts a boolean value, so !true becomes false." },
      { question: "Which value is considered the primitive type but has typeof return \"object\"?", options: ["undefined", "null", "NaN", "0"], correctAnswerIndex: 1, explanation: "typeof null famously returns \"object\", a long-standing quirk of JavaScript." },
      { question: "Why is === generally preferred over == in modern JavaScript code?", options: [
          "=== runs faster in every case",
          "== is deprecated and no longer works",
          "=== avoids surprising bugs caused by automatic type coercion",
          "=== is the only operator that works with strings",
        ], correctAnswerIndex: 2, explanation: "=== avoids the sometimes-surprising automatic type conversion that == performs, making comparisons more predictable." },
    ],
  },
  assignment:
    "Build a 'Type Explorer' script in the Academy workspace: declare one variable for each primitive type (string, number, boolean, undefined, null), print each one's value alongside its typeof result, then declare two number variables and print the results of every arithmetic operator applied to them with clearly labeled console.log() output.",
  assignmentDeliverables: [
    "A single JavaScript file demonstrating all five primitive types with typeof output",
    "Labeled console.log() output for +, -, *, /, and % applied to two numbers",
  ],
  assignmentAssessmentCriteria: [
    "Every primitive type is correctly represented and labeled",
    "Arithmetic results are mathematically correct",
    "Output is clearly labeled so each result is easy to identify",
  ],
  miniProject:
    "Build a 'Comparison Report' script that declares several pairs of values of different types, prints the result of comparing each pair with both == and === alongside a comment explaining any difference, then combines at least three of those comparisons using && and || to print two compound boolean results.",
  miniProjectDeliverables: ["A comparisonReport.js file in the Academy workspace", "Comments explaining every case where == and === produce different results"],
  miniProjectAssessmentCriteria: [
    "At least three value pairs are compared with both == and ===",
    "Compound conditions using && and || are demonstrated and produce correct results",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
