import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module3: GeneratedModule = {
  title: "Making Decisions with Conditionals",
  description:
    "Learn to branch your code's behavior using if, else if, and else, the switch statement for multi-way choices, and how truthy/falsy values shape every condition you write.",
  completionStatus: "locked",
  lessons: [
    {
      title: "if, else if, and else",
      goal: "Write conditional logic that runs different code depending on whether an expression is true or false.",
      videoTitle: "JavaScript if else Statements Explained",
      videoSearchQuery: "javascript if else if statement tutorial for beginners",
      videoLearningGoal: "See if, else if, and else chains handling multiple possible conditions in order.",
      recommendedChannels: ["freeCodeCamp.org", "The Net Ninja"],
      keyTakeaways: [
        "if (condition) { } runs its block only when the condition is true.",
        "else if lets you check additional conditions in order if the previous ones were false.",
        "else runs as a fallback when none of the preceding conditions were true.",
      ],
      notes:
        "An if statement evaluates a condition in parentheses; if it's true, the code inside the curly braces runs, and if it's false, that block is skipped. Chaining else if after an if lets you test additional conditions only if the earlier ones were false, and a final else catches anything not matched by any condition above it.",
      conceptExplanation:
        "JavaScript checks conditions top to bottom and stops at the first one that's true, running only that block. For example, if (score >= 90) { ... } else if (score >= 70) { ... } else { ... } only ever runs one of the three blocks, even if a lower condition would also technically be true, because the engine stops checking once it finds a match. The condition itself must evaluate to something that behaves like true or false, which is exactly what comparison and logical operators from the previous module produce.",
      whyItMatters: "Conditionals let your program react differently to different data, which is the core of nearly every real program: validating input, controlling game logic, or displaying different messages.",
      practicalTask:
        "Declare a variable for a test score (0-100). Write an if / else if / else chain that prints \"Grade: A\" for 90 and above, \"Grade: B\" for 80-89, \"Grade: C\" for 70-79, and \"Grade: F\" otherwise. Test it by changing the score variable and rerunning.",
      challenge: "Add an else if branch for a 'Grade: D' range (60-69) between the C and F branches, keeping the ordering logically correct.",
      expectedResult: "Changing the score variable and rerunning the script prints the correct grade for each range you test.",
      tests: ["The chain includes if, at least one else if, and a final else", "Testing scores in each range prints the correct grade"],
      hint: "Order your conditions from highest to lowest (or lowest to highest) consistently so no range is skipped or double-counted.",
      lessonAssessment: [
        {
          question: "In an if / else if / else chain, how many blocks run for a single evaluation?",
          options: ["All blocks whose condition is true", "Only the first block whose condition is true", "Only the last block, always", "Every block runs regardless of the condition"],
          correctAnswerIndex: 1,
          explanation: "JavaScript stops at the first true condition in the chain and runs only that block, skipping the rest.",
        },
        {
          question: "When does the else block in an if/else chain run?",
          options: ["Always, in addition to the if block", "Only when every preceding condition was false", "Only when the if condition is true", "Never, it is optional and unused"],
          correctAnswerIndex: 1,
          explanation: "else is the fallback that runs only when none of the preceding if/else if conditions were true.",
        },
      ],
      commonMistakes: ["Ordering else if conditions incorrectly so a range gets skipped or matched too early.", "Forgetting curly braces on multi-line blocks, causing only the first line to be conditional."],
      deliverables: ["A script with an if/else if/else grading chain"],
      assessmentCriteria: ["All grade boundaries produce the correct output", "Chain uses else if correctly rather than separate unrelated if statements"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "javascript",
        code: 'let score = 84;\n\nif (score >= 90) {\n  console.log("Grade: A");\n} else if (score >= 80) {\n  console.log("Grade: B");\n} else if (score >= 70) {\n  console.log("Grade: C");\n} else {\n  console.log("Grade: F");\n}',
        explanation: "The engine checks each condition in order and runs only the first matching block; for 84 that's the \"Grade: B\" branch.",
      },
      completionStatus: "not_started",
    },
    {
      title: "switch Statements",
      goal: "Use a switch statement to handle several specific values of the same variable cleanly.",
      videoTitle: "JavaScript switch Statement Explained",
      videoSearchQuery: "javascript switch statement tutorial for beginners",
      videoLearningGoal: "See a switch statement with multiple case labels, break, and a default branch.",
      recommendedChannels: ["Web Dev Simplified", "Programming with Mosh"],
      keyTakeaways: [
        "switch (value) compares value against each case label using strict equality (===).",
        "break stops the switch from 'falling through' into the next case.",
        "default runs when no case label matches, similar to an else in an if chain.",
      ],
      notes:
        "A switch statement is often clearer than a long else if chain when you're comparing one variable against several specific, known values, like a day name or a menu option. Each case checks the switch value using strict equality, and break prevents execution from continuing into the next case after a match.",
      conceptExplanation:
        "Without break, JavaScript keeps executing every case below the matched one until it hits a break or the end of the switch, a behavior called 'fall-through'. This is occasionally used intentionally (stacking multiple case labels to share one block), but for beginners it's usually a bug, so always add break unless you have a specific reason not to. default acts as the catch-all, similar to else, and is conventionally placed last.",
      whyItMatters: "switch keeps multi-value comparisons against a single variable readable, avoiding a long, repetitive chain of else if === checks.",
      practicalTask:
        "Declare a variable holding a day abbreviation like \"Mon\". Write a switch statement that prints a specific message for \"Mon\" through \"Fri\" (e.g. \"Weekday\") and a different message for \"Sat\" and \"Sun\" (e.g. \"Weekend\"), including a default case for unrecognized input.",
      challenge: "Stack two case labels together intentionally (e.g. case \"Sat\": case \"Sun\":) sharing one block, and explain in a comment why no break is needed between them.",
      expectedResult: "Changing the day variable and rerunning prints \"Weekday\" for Mon-Fri, \"Weekend\" for Sat/Sun, and the default message otherwise.",
      tests: ["The switch includes at least 5 case labels plus a default", "break is used correctly to prevent unwanted fall-through"],
      hint: "Forgetting break after a case is the most common switch bug: execution silently continues into the next case.",
      lessonAssessment: [
        {
          question: "What does break do inside a switch statement's case block?",
          options: ["Ends the entire program", "Prevents execution from falling through into the next case", "Skips to the default case", "Restarts the switch from the top"],
          correctAnswerIndex: 1,
          explanation: "break exits the switch statement immediately, preventing the code from continuing into subsequent case blocks.",
        },
        {
          question: "What comparison does a switch case label use to match the switch value?",
          options: ["Loose equality (==)", "Strict equality (===)", "A greater-than comparison", "No comparison; it matches by position"],
          correctAnswerIndex: 1,
          explanation: "switch compares the value against each case label using strict equality, the same as ===.",
        },
      ],
      commonMistakes: ["Forgetting break, causing execution to fall through into unrelated cases.", "Relying on switch for range checks (like scores) instead of exact value matches, where if/else fits better."],
      deliverables: ["A script with a switch statement covering at least 5 cases and a default"],
      assessmentCriteria: ["Each case produces the correct output", "break is placed correctly to avoid unintended fall-through"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "javascript",
        code: 'let day = "Sat";\n\nswitch (day) {\n  case "Mon":\n  case "Tue":\n  case "Wed":\n  case "Thu":\n  case "Fri":\n    console.log("Weekday");\n    break;\n  case "Sat":\n  case "Sun":\n    console.log("Weekend");\n    break;\n  default:\n    console.log("Not a recognized day");\n}',
        explanation: "Stacked case labels share the same block, and break after each group stops fall-through into the next group.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Truthy/Falsy Values and Comparison Chains",
      goal: "Understand which values JavaScript treats as truthy or falsy, and write clear comparison chains without confusing conditions.",
      videoTitle: "JavaScript Truthy and Falsy Values Explained",
      videoSearchQuery: "javascript truthy falsy values tutorial for beginners",
      videoLearningGoal: "See exactly which values are falsy in JavaScript and how they behave inside an if condition.",
      recommendedChannels: ["Fireship", "freeCodeCamp.org"],
      keyTakeaways: [
        "JavaScript has exactly six falsy values: false, 0, \"\" (empty string), null, undefined, and NaN.",
        "Every other value, including any non-empty string and any object, is truthy.",
        "A condition doesn't need to be an explicit boolean; if(value) coerces value to true or false automatically.",
      ],
      notes:
        "When you write if (value), JavaScript doesn't require value to already be true or false: it coerces the value to a boolean first. Only six values are falsy in JavaScript; everything else, no matter how it looks, is truthy. This includes surprising cases like \"0\" (a non-empty string) being truthy, even though the number 0 is falsy.",
      conceptExplanation:
        "A common pattern is checking if (name) { ... } to see whether a string variable has content, since an empty string \"\" is falsy but any non-empty string is truthy. Combining comparisons into a chain, like age >= 13 && age <= 19, is safer and clearer than writing something like 13 <= age <= 19, which does not work the way it does in math class because JavaScript evaluates it left to right as two separate comparisons.",
      whyItMatters: "Understanding truthy/falsy values prevents subtle bugs where a condition doesn't behave the way you expect, especially when checking user input or optional values.",
      practicalTask:
        "Create a list of individual variables covering each falsy value (false, 0, \"\", null, undefined, NaN) and one truthy example of your choice. Write an if/else for each one that prints whether it is \"truthy\" or \"falsy\", confirming your prediction before running.",
      challenge: "Write a correct comparison chain using && that checks whether a number is between 1 and 100 inclusive, and test it with a value inside and outside that range.",
      expectedResult: "The script correctly labels all six falsy values as \"falsy\" and your extra example as \"truthy\".",
      tests: ["All six falsy values are tested with an if/else", "At least one correct && comparison chain is demonstrated"],
      hint: "if (0) is falsy, but if (\"0\") is truthy, because \"0\" is a non-empty string.",
      lessonAssessment: [
        {
          question: "Which of the following is a falsy value in JavaScript?",
          options: ["\"0\" (a string containing zero)", "[] (an empty array)", "0 (the number zero)", "\"false\" (a string containing the word false)"],
          correctAnswerIndex: 2,
          explanation: "The number 0 is one of JavaScript's six falsy values; the string \"0\" and an empty array are both truthy.",
        },
        {
          question: "What does if (\"\") { console.log(\"yes\"); } print?",
          options: ["yes", "Nothing, the block is skipped", "An error", "undefined"],
          correctAnswerIndex: 1,
          explanation: "An empty string is falsy, so the condition is false and the block inside the if never runs.",
        },
      ],
      commonMistakes: ["Writing 13 <= age <= 19 expecting a math-style range check instead of using age >= 13 && age <= 19.", "Assuming every string is truthy without realizing an empty string \"\" is falsy."],
      deliverables: ["A script testing all six falsy values plus one truthy example"],
      assessmentCriteria: ["Every falsy value is correctly identified", "A correct && range comparison is demonstrated"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 minutes",
      codeExample: {
        language: "javascript",
        code: 'let values = [false, 0, "", null, undefined, NaN, "hello"];\n\nif (values[0]) {\n  console.log("truthy");\n} else {\n  console.log("falsy");\n}\n\nlet num = 42;\nif (num >= 1 && num <= 100) {\n  console.log("In range");\n}',
        explanation: "The first block checks a falsy value from the list, and the second shows a correct comparison chain using &&.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Making Decisions with Conditionals Assessment",
    questions: [
      { question: "In an if / else if / else chain, how many blocks execute for one evaluation?", options: ["All that are true", "Only the first true one", "Only the last one", "None unless else runs"], correctAnswerIndex: 1, explanation: "The engine stops at the first true condition and runs only that block." },
      { question: "What does the switch statement use to compare its value against each case label?", options: ["Loose equality (==)", "Strict equality (===)", "typeof comparison", "No comparison"], correctAnswerIndex: 1, explanation: "switch uses strict equality (===) to match the value against case labels." },
      { question: "What happens if you omit break after a matched case in a switch statement?", options: ["The switch exits immediately", "Execution falls through into the next case", "A syntax error occurs", "The default case runs instead"], correctAnswerIndex: 1, explanation: "Without break, execution continues into the following case block regardless of whether it matches." },
      { question: "Which of these values is truthy?", options: ["0", "\"\"", "null", "\"0\""], correctAnswerIndex: 3, explanation: "\"0\" is a non-empty string, so it is truthy, unlike the number 0 or an empty string." },
      { question: "How many falsy values does JavaScript have?", options: ["Three", "Five", "Six", "Unlimited"], correctAnswerIndex: 2, explanation: "JavaScript has exactly six falsy values: false, 0, \"\", null, undefined, and NaN." },
      { question: "What does if (value) do when value is not already a boolean?", options: ["Throws an error", "Coerces value to true or false before checking", "Always treats it as false", "Always treats it as true"], correctAnswerIndex: 1, explanation: "JavaScript automatically coerces the condition to a boolean before deciding which branch to run." },
      { question: "What is wrong with writing 13 <= age <= 19 to check a range?", options: [
          "It is perfectly correct JavaScript",
          "It evaluates left to right as two separate comparisons and does not check a range correctly",
          "It only works with the switch statement",
          "It causes a syntax error",
        ], correctAnswerIndex: 1, explanation: "JavaScript evaluates 13 <= age first (producing true or false), then compares that boolean to 19, which does not check a numeric range." },
      { question: "Where should the default case be placed for readability in a switch statement?", options: ["Always first", "Anywhere in the middle", "Conventionally last", "It cannot be used with break"], correctAnswerIndex: 2, explanation: "While technically default can appear anywhere, convention places it last as the catch-all case." },
      { question: "What does typeof NaN return?", options: ["\"NaN\"", "\"undefined\"", "\"number\"", "\"object\""], correctAnswerIndex: 2, explanation: "NaN stands for 'Not a Number' but its type is still \"number\"." },
      { question: "Which comparison chain correctly checks if age is between 13 and 19 inclusive?", options: ["age >= 13 || age <= 19", "age >= 13 && age <= 19", "age == 13 && age == 19", "13 <= age <= 19"], correctAnswerIndex: 1, explanation: "&& requires both bounds to hold true at once, correctly expressing an inclusive range." },
    ],
  },
  assignment:
    "Build a 'Ticket Pricing' script in the Academy workspace: declare a variable for a customer's age, and use an if / else if / else chain to print the correct ticket price category (Child, Teen, Adult, Senior) based on age ranges you define, testing at least four different age values by changing the variable and rerunning.",
  assignmentDeliverables: [
    "A single JavaScript file with a complete if/else if/else pricing chain",
    "Console output showing all four age categories tested correctly",
  ],
  assignmentAssessmentCriteria: [
    "All age ranges are handled without gaps or overlaps",
    "The chain uses else if correctly rather than unrelated separate if statements",
    "Testing different ages produces the correct category each time",
  ],
  miniProject:
    "Build a 'Menu Selector' program that declares a variable holding a menu choice like \"pizza\", \"burger\", \"salad\", or \"pasta\", uses a switch statement to print a description and price for each option with correct break usage, includes a default case for unrecognized choices, and also demonstrates one truthy/falsy check on a separate variable before the switch runs.",
  miniProjectDeliverables: ["A menuSelector.js file in the Academy workspace", "Console output showing at least three different menu choices tested"],
  miniProjectAssessmentCriteria: [
    "The switch statement covers every listed menu option plus a default case",
    "break is used correctly throughout to prevent fall-through",
    "The truthy/falsy check behaves correctly for both a truthy and falsy input",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
