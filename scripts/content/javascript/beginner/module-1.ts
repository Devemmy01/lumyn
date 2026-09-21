import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module1: GeneratedModule = {
  title: "JavaScript Basics & Your First Script",
  description:
    "Get comfortable with what JavaScript is, how a script executes from top to bottom, and how to write and read simple statements: the building blocks every later module depends on.",
  completionStatus: "locked",
  lessons: [
    {
      title: "What JavaScript Is and How a Script Runs",
      goal: "Understand what JavaScript is used for and how a JavaScript file gets executed statement by statement.",
      videoTitle: "JavaScript for Beginners: What is JavaScript and How Does It Work",
      videoSearchQuery: "what is javascript programming language for beginners explained",
      videoLearningGoal: "See a plain-language overview of what JavaScript is and how a script executes from the first line to the last.",
      recommendedChannels: ["freeCodeCamp.org", "Programming with Mosh"],
      keyTakeaways: [
        "JavaScript is a scripting language whose engine reads and runs your code one statement at a time, top to bottom.",
        "A '.js' file is just a plain text file containing JavaScript statements.",
        "Each instruction in a script is called a statement, and statements normally run in the order they are written.",
      ],
      notes:
        "JavaScript is a general-purpose programming language originally built for web pages but now used for servers, scripts, and tools of every kind. The JavaScript engine reads your file and executes it directly, statement by statement, from the top of the file to the bottom, unless something tells it to branch, loop, or jump elsewhere.",
      conceptExplanation:
        "When the JavaScript engine runs a file, it starts at the first statement and executes each one in order before moving to the next. If it hits an error, it stops right there and reports the problem, pointing at the line that failed. This top-to-bottom execution model is the mental model you'll use for everything else in this course: code runs in the order it's written, unless you tell it to branch with a conditional, repeat with a loop, or jump into a function.",
      whyItMatters: "Knowing that JavaScript runs top-to-bottom helps you read error messages and predict what your script will do before you even run it.",
      practicalTask:
        "In the Academy workspace, a JavaScript file is already open for you. Write three separate lines, each printing a different short fact about yourself using console.log(). Run the file and confirm the three lines appear in the same order you wrote them.",
      challenge: "Add a fourth console.log() statement between two of the existing ones and predict where its output will appear before running the file.",
      expectedResult: "Running the script prints your three (or four) facts in the exact top-to-bottom order they appear in the file.",
      tests: [
        "The script runs without any error messages.",
        "The printed lines appear in the same order as the console.log() statements in the file.",
      ],
      hint: "console.log() displays whatever is inside its parentheses, exactly as you passed it.",
      lessonAssessment: [
        {
          question: "In what order does the JavaScript engine execute the statements in a script by default?",
          options: [
            "Top to bottom, one statement at a time",
            "Bottom to top",
            "In a random order each run",
            "All statements run at exactly the same time",
          ],
          correctAnswerIndex: 0,
          explanation: "JavaScript executes statements sequentially, starting at the top of the file and moving downward, unless control flow changes that order.",
        },
        {
          question: "What happens when the JavaScript engine encounters an error while running a script?",
          options: [
            "It skips the broken line and keeps going",
            "It stops execution and reports an error pointing at the failing line",
            "It automatically fixes the error",
            "It restarts the script from the beginning",
          ],
          correctAnswerIndex: 1,
          explanation: "JavaScript stops at the first unhandled error and reports where and why it failed.",
        },
      ],
      commonMistakes: ["Assuming code 'runs all at once' instead of one statement after another.", "Ignoring the line number an error message points to."],
      deliverables: ["A JavaScript file with three or more console.log() statements"],
      assessmentCriteria: ["Script runs without errors", "Output order matches the code order"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "15-20 minutes",
      codeExample: {
        language: "javascript",
        code: 'console.log("Hello, I am learning JavaScript.");\nconsole.log("This is my second line.");\nconsole.log("And this is my third.");',
        explanation: "Each console.log() call runs in order, so the three lines appear in the same sequence they were written.",
      },
      completionStatus: "not_started",
    },
    {
      title: "console.log() and Writing Comments",
      goal: "Use console.log() confidently and write comments that explain your code without affecting how it runs.",
      videoTitle: "JavaScript console.log() and Comments Explained",
      videoSearchQuery: "javascript console log function and comments tutorial for beginners",
      videoLearningGoal: "See several examples of console.log() with different kinds of values and how // and /* */ comments are written.",
      recommendedChannels: ["Web Dev Simplified", "freeCodeCamp.org"],
      keyTakeaways: [
        "console.log() prints values to the console so you can see what your script is doing.",
        "A single-line comment starts with // and everything after it on that line is ignored.",
        "A multi-line comment is wrapped in /* and */ and can span several lines.",
      ],
      notes:
        "console.log() is the most common way to see what a JavaScript program is doing while you're learning. You can pass it text in quotes, numbers, or several values separated by commas. Comments start with // (single line) or /* ... */ (multi-line) and are notes for humans: the engine ignores them completely.",
      conceptExplanation:
        "console.log() accepts one or more arguments separated by commas: console.log(\"Score:\", 10) prints Score: 10 with a space automatically inserted between the arguments. Comments are used to explain *why* code does something, not to restate *what* it obviously does, a good habit to build early. Use // for a short note on one line and /* */ when you need to explain something across multiple lines.",
      whyItMatters: "console.log() is your main debugging tool for the rest of this course. You'll use it constantly to check what a variable holds.",
      practicalTask:
        "Write a script that prints your name, your favorite hobby, and one goal for learning JavaScript, using at least one // comment above each console.log() line explaining what it does.",
      challenge: "Combine two pieces of information into a single console.log() call using a comma, e.g. console.log(\"Name:\", yourNameHere).",
      expectedResult: "The script prints three lines of personal information, each preceded by a short comment in the source code.",
      tests: ["File contains at least 3 console.log() statements", "File contains at least 3 comment lines starting with //"],
      hint: "A comment on its own line looks like: // this explains the next line",
      lessonAssessment: [
        {
          question: "What symbol starts a single-line comment in JavaScript?",
          options: ["#", "//", "<!--", "'''"],
          correctAnswerIndex: 1,
          explanation: "JavaScript uses // to start a single-line comment; everything after it on that line is ignored by the engine.",
        },
        {
          question: "What does console.log(\"Age:\", 25) output?",
          options: ["Age:25", "Age: 25", "Age, 25", "An error, because you cannot mix text and numbers"],
          correctAnswerIndex: 1,
          explanation: "console.log() automatically separates multiple arguments with a single space, producing 'Age: 25'.",
        },
      ],
      commonMistakes: ["Forgetting the closing quote on a string, causing a syntax error.", "Writing comments that just repeat the code instead of explaining intent."],
      deliverables: ["A script with 3+ console.log() statements and 3+ comments"],
      assessmentCriteria: ["Comments are present and relevant", "Output is correct and readable"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "15-20 minutes",
      codeExample: {
        language: "javascript",
        code: '// Print a short intro\nconsole.log("My name is Ada.");\n/* Combine two values\n   in one call */\nconsole.log("Favorite language:", "JavaScript");',
        explanation: "The // comment explains the line below it, and the /* */ comment spans two lines before the second console.log() combines two values with a comma.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Statements, Semicolons, and Declaring Variables with let and const",
      goal: "Write clean statements ending in semicolons and store values using let and const.",
      videoTitle: "JavaScript Variables: let vs const Explained",
      videoSearchQuery: "javascript let const variables tutorial for beginners",
      videoLearningGoal: "See how to declare variables with let and const, reassign them, and understand why semicolons matter.",
      recommendedChannels: ["The Net Ninja", "Programming with Mosh"],
      keyTakeaways: [
        "A statement is one instruction, and JavaScript convention ends most statements with a semicolon (;).",
        "let declares a variable that can be reassigned later; const declares one that cannot be reassigned.",
        "Variable names are case-sensitive and conventionally use camelCase, like favoriteNumber.",
      ],
      notes:
        "You create a variable with let name = value; or const name = value;. From then on, using the name anywhere in your code refers to that value. Use const by default, and only switch to let when you know the value needs to change later. Each statement typically ends with a semicolon, which marks where one instruction stops and the next begins.",
      conceptExplanation:
        "Variable names must start with a letter, underscore, or dollar sign, can contain letters, numbers, underscores, and dollar signs, and are case-sensitive (age and Age are different variables). JavaScript's common style convention is camelCase for variable names, like firstName or totalScore, rather than snake_case or PascalCase. Trying to reassign a const variable, like age = 26; after const age = 25;, causes an error, which is exactly why const is useful: it signals a value is not meant to change.",
      whyItMatters: "Choosing let vs const correctly, and ending statements consistently, makes code readable and prevents accidental reassignment bugs.",
      practicalTask:
        "Create variables for your name, your age, and your favorite number using let and const appropriately. Print a sentence that uses all three variables. Then reassign your favorite number to a new value and print the sentence again to show it changed.",
      challenge: "Add a fourth variable declared with const that stores whether you've written JavaScript before (true or false) and print it.",
      expectedResult: "The script prints a personalized sentence twice, with the number changing between the two prints.",
      tests: ["At least 3 variables are declared using let or const", "The favorite number variable is reassigned and reprinted"],
      hint: "Reassigning a let variable is just writing the variable name again with a new value: favoriteNumber = 8;",
      lessonAssessment: [
        {
          question: "Which declaration lets you reassign the variable later?",
          options: ["const total = 5;", "let total = 5;", "Both behave identically", "Neither can ever be reassigned"],
          correctAnswerIndex: 1,
          explanation: "let allows reassignment after declaration, while const does not allow the variable to be reassigned.",
        },
        {
          question: "What happens if you try to reassign a variable declared with const?",
          options: ["It reassigns normally", "JavaScript throws an error", "It silently ignores the new value", "It converts the variable to let automatically"],
          correctAnswerIndex: 1,
          explanation: "const variables cannot be reassigned; attempting to do so raises a TypeError.",
        },
      ],
      commonMistakes: ["Using const for a value that needs to change later, causing an error on reassignment.", "Mixing naming styles (camelCase and snake_case) in the same file."],
      deliverables: ["A script with at least 4 variables and 2 console.log statements"],
      assessmentCriteria: ["Variable names follow camelCase", "let and const are each used appropriately"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 minutes",
      codeExample: {
        language: "javascript",
        code: 'const name = "Ada";\nlet favoriteNumber = 7;\nconsole.log(name, "likes the number", favoriteNumber);\nfavoriteNumber = 42;\nconsole.log(name, "now likes the number", favoriteNumber);',
        explanation: "name is declared with const because it never changes, while favoriteNumber uses let so it can be reassigned from 7 to 42.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "JavaScript Basics & Your First Script Assessment",
    questions: [
      {
        question: "How does the JavaScript engine execute the statements in a script by default?",
        options: ["Bottom to top", "Top to bottom, one statement at a time", "In a random order each run", "All statements run at exactly the same time"],
        correctAnswerIndex: 1,
        explanation: "JavaScript executes statements sequentially, starting at the top of the file and moving downward.",
      },
      {
        question: "What does the following code print?\nconsole.log(\"A\");\nconsole.log(\"B\");",
        options: ["AB on one line", "A then B on two separate lines", "B then A", "A syntax error"],
        correctAnswerIndex: 1,
        explanation: "Each console.log() call outputs its own line by default, and statements run top to bottom.",
      },
      {
        question: "Which line is a valid single-line JavaScript comment?",
        options: ["# this is a comment", "// this is a comment", "<!-- this is a comment -->", "-- this is a comment"],
        correctAnswerIndex: 1,
        explanation: "JavaScript uses // for single-line comments.",
      },
      {
        question: "What is the output of console.log(\"Score:\", 10, \"points\")?",
        options: ["Score:10points", "Score: 10 points", "Score, 10, points", "An error, mixing text and numbers"],
        correctAnswerIndex: 1,
        explanation: "console.log() joins multiple arguments with a single space between each.",
      },
      {
        question: "Which keyword declares a variable that cannot be reassigned?",
        options: ["let", "var", "const", "static"],
        correctAnswerIndex: 2,
        explanation: "const declares a variable whose binding cannot be reassigned after it is set.",
      },
      {
        question: "What is the value of x after this code runs?\nlet x = 3;\nx = x + 1;",
        options: ["3", "4", "1", "This causes an error"],
        correctAnswerIndex: 1,
        explanation: "x + 1 evaluates using the current value of x (3), producing 4, which is then stored back into x.",
      },
      {
        question: "Why does a JavaScript script stop when it hits an unhandled error partway through?",
        options: [
          "JavaScript always finishes the whole file first, then reports errors",
          "The engine halts at the failing statement and reports the error",
          "JavaScript ignores errors by default",
          "JavaScript restarts the script automatically",
        ],
        correctAnswerIndex: 1,
        explanation: "Unless the error is caught, JavaScript stops executing at the statement that raised it and reports the failure.",
      },
      {
        question: "Which variable declaration is invalid in JavaScript?",
        options: ["let _hidden = 1;", "let total2 = 1;", "let 2total = 1;", "let myTotal = 1;"],
        correctAnswerIndex: 2,
        explanation: "Variable names cannot start with a digit; 2total is invalid JavaScript syntax.",
      },
      {
        question: "Are JavaScript variable names case-sensitive?",
        options: ["Yes, age and Age are different variables", "No, they are treated the same", "Only for the first letter", "Only inside functions"],
        correctAnswerIndex: 0,
        explanation: "JavaScript is case-sensitive, so age, Age, and AGE are three distinct variable names.",
      },
      {
        question: "What is the purpose of a comment in JavaScript?",
        options: [
          "It runs as extra code the user cannot see",
          "It explains code to humans and is ignored by the engine",
          "It speeds up the program",
          "It is required before every console.log statement",
        ],
        correctAnswerIndex: 1,
        explanation: "Comments exist purely for human readers; the JavaScript engine skips anything marked as a comment.",
      },
    ],
  },
  assignment:
    "Build a short 'About Me' script in the Academy workspace: declare at least five variables describing yourself (name, age, city, hobby, and one more of your choice) using let and const appropriately, then use console.log() statements and comments to display a readable mini-profile combining those variables into full sentences.",
  assignmentDeliverables: [
    "A single JavaScript file with 5+ variables, several console.log statements, and comments",
    "A short note (2-3 sentences) describing which variables you declared with let versus const and why",
  ],
  assignmentAssessmentCriteria: [
    "All variables follow camelCase naming",
    "Output reads as coherent sentences, not just raw variable dumps",
    "Comments are present and explain intent, not just restate code",
  ],
  miniProject:
    "Extend your 'About Me' script into a 'Profile Card' generator: print a formatted block that looks like a small profile card using multiple console.log() lines to form borders and sections with characters like - and |, pulling every piece of text from variables rather than typing it directly into the console.log calls.",
  miniProjectDeliverables: ["A profileCard.js file in the Academy workspace", "A short note on how the layout is built entirely from variables"],
  miniProjectAssessmentCriteria: [
    "The card's content comes entirely from variables, not values typed directly into console.log calls",
    "Output is visually organized with clear lines and sections",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
