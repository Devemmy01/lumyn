import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module1: GeneratedModule = {
  title: "Python Basics & Your First Program",
  description:
    "Get comfortable with what Python is, how it runs your code, and how to write and read simple statements: the building blocks every later module depends on.",
  completionStatus: "locked",
  lessons: [
    {
      title: "What Python Is and How It Runs Your Code",
      goal: "Understand what Python is used for and how a Python file gets executed line by line.",
      videoTitle: "Python for Beginners: What is Python and How Does It Work",
      videoSearchQuery: "what is python programming language for beginners explained",
      videoLearningGoal: "See a plain-language overview of what Python is and how a script runs top to bottom.",
      recommendedChannels: ["freeCodeCamp.org", "Programming with Mosh"],
      keyTakeaways: [
        "Python is an interpreter-based language: it reads and runs your code one line at a time, top to bottom.",
        "A '.py' file is just a plain text file containing Python instructions.",
        "Indentation (spaces at the start of a line) is part of Python's syntax, not just style.",
      ],
      notes:
        "Python is a general-purpose programming language used for web apps, data analysis, automation, and more. Unlike some languages, Python doesn't need a separate compile step before running: the Python interpreter reads your file and executes it directly, statement by statement, from top to bottom.",
      conceptExplanation:
        "When you run a Python file, the interpreter starts at the first line and executes each statement in order. If it hits an error, it stops right there and shows you a traceback pointing at the line that failed. This top-to-bottom execution model is the mental model you'll use for everything else in this course: code runs in the order it's written, unless you tell it to branch, loop, or jump into a function.",
      whyItMatters: "Knowing that Python runs top-to-bottom helps you read error messages and predict what your program will do before you even run it.",
      practicalTask:
        "In the Academy workspace, main.py is already open for you. Write three separate lines, each printing a different short fact about yourself using print(). Run the file and confirm the three lines appear in the same order you wrote them.",
      challenge: "Add a fourth print() statement between two of the existing ones and predict where its output will appear before running the file.",
      expectedResult: "Running main.py prints your three (or four) facts in the exact top-to-bottom order they appear in the file.",
      tests: [
        "main.py runs without any error messages.",
        "The printed lines appear in the same order as the print() statements in the file.",
      ],
      hint: "print() displays whatever text is inside the parentheses, wrapped in quotes, exactly as written.",
      lessonAssessment: [
        {
          question: "In what order does the Python interpreter execute the statements in a script by default?",
          options: [
            "Top to bottom, one statement at a time",
            "Bottom to top",
            "In a random order each run",
            "All statements run at exactly the same time",
          ],
          correctAnswerIndex: 0,
          explanation: "Python executes statements sequentially, starting at the top of the file and moving downward, unless control flow changes that order.",
        },
        {
          question: "What happens when the Python interpreter encounters an error while running a script?",
          options: [
            "It skips the broken line and keeps going",
            "It stops execution and shows a traceback pointing at the failing line",
            "It automatically fixes the error",
            "It restarts the script from the beginning",
          ],
          correctAnswerIndex: 1,
          explanation: "Python stops at the first unhandled error and prints a traceback that shows where and why it failed.",
        },
      ],
      commonMistakes: ["Assuming code 'runs all at once' instead of one line after another.", "Ignoring the line number in an error traceback."],
      deliverables: ["main.py with three or more print() statements"],
      assessmentCriteria: ["Program runs without errors", "Output order matches the code order"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "15-20 minutes",
      codeExample: {
        language: "python",
        code: 'print("Hello, I am learning Python.")\nprint("This is my second line.")\nprint("And this is my third.")',
        explanation: "Each print() call runs in order, so the three lines appear in the same sequence they were written.",
      },
      completionStatus: "not_started",
    },
    {
      title: "print() and Writing Comments",
      goal: "Use print() confidently and write comments that explain your code without affecting how it runs.",
      videoTitle: "Python print() Function and Comments Explained",
      videoSearchQuery: "python print function and comments tutorial for beginners",
      videoLearningGoal: "See several examples of print() with different kinds of values and how # comments are written.",
      recommendedChannels: ["Corey Schafer", "freeCodeCamp.org"],
      keyTakeaways: [
        "print() sends text (or values) to the output so you can see what your program is doing.",
        "Anything after a # on a line is a comment and is ignored by Python.",
        "You can print multiple values in one call by separating them with commas.",
      ],
      notes:
        "print() is the most common way to see what a Python program is doing while you're learning. Text you want printed literally goes inside quotes (a 'string'). Comments start with # and are notes for humans: Python ignores everything after the # on that line.",
      conceptExplanation:
        "print() accepts one or more arguments separated by commas: print(\"Score:\", 10) prints Score: 10 with a space automatically inserted between the arguments. Comments are used to explain *why* code does something, not to restate *what* it obviously does, a good habit to build early.",
      whyItMatters: "print() is your main debugging tool for the rest of this course. You'll use it constantly to check what a variable holds.",
      practicalTask:
        "Write a program that prints your name, your favorite hobby, and one goal for learning Python, using at least one comment above each print() line explaining what it does.",
      challenge: "Combine two pieces of information into a single print() call using a comma, e.g. print(\"Name:\", your_name_here).",
      expectedResult: "The program prints three lines of personal information, each preceded by a short comment in the source code.",
      tests: ["File contains at least 3 print() statements", "File contains at least 3 comment lines starting with #"],
      hint: "A comment on its own line looks like: # this explains the next line",
      lessonAssessment: [
        {
          question: "What symbol starts a single-line comment in Python?",
          options: ["//", "#", "<!--", "/*"],
          correctAnswerIndex: 1,
          explanation: "Python uses # to start a comment; everything after it on that line is ignored by the interpreter.",
        },
        {
          question: "What does print(\"Age:\", 25) output?",
          options: ["Age:25", "Age: 25", "Age, 25", "An error, because you cannot mix text and numbers"],
          correctAnswerIndex: 1,
          explanation: "print() automatically separates multiple arguments with a single space, producing 'Age: 25'.",
        },
      ],
      commonMistakes: ["Forgetting the closing quote on a string, causing a syntax error.", "Writing comments that just repeat the code instead of explaining intent."],
      deliverables: ["A script with 3+ print() statements and 3+ comments"],
      assessmentCriteria: ["Comments are present and relevant", "Output is correct and readable"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "15-20 minutes",
      codeExample: {
        language: "python",
        code: '# Print a short intro\nprint("My name is Ada.")\n# Combine two values in one call\nprint("Favorite language:", "Python")',
        explanation: "The comment explains the purpose of the line below it; the second print() shows two values combined with a comma.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Variables and Naming Your Data",
      goal: "Store values in variables and follow Python's naming conventions.",
      videoTitle: "Python Variables Tutorial for Beginners",
      videoSearchQuery: "python variables tutorial for beginners naming conventions",
      videoLearningGoal: "See how to create variables, reassign them, and follow snake_case naming.",
      recommendedChannels: ["Programming with Mosh", "Corey Schafer"],
      keyTakeaways: [
        "A variable is a name that points to a value stored in memory.",
        "Python variable names conventionally use snake_case (lowercase words separated by underscores).",
        "Variables can be reassigned to a new value at any time.",
      ],
      notes:
        "You create a variable by writing a name, an equals sign, and a value: age = 25. From then on, using 'age' anywhere in your code refers to that value. You can change what a variable points to later by assigning it again.",
      conceptExplanation:
        "Variable names must start with a letter or underscore, can contain letters, numbers, and underscores, and are case-sensitive (age and Age are different variables). Python's style convention (PEP 8) recommends snake_case for variable names, like first_name or total_score, rather than camelCase or PascalCase.",
      whyItMatters: "Clear variable names make code readable months later, both for you and for anyone reviewing your work.",
      practicalTask:
        "Create variables for your name, your age, and your favorite number. Print a sentence that uses all three variables. Then reassign your favorite number to a new value and print the sentence again to show it changed.",
      challenge: "Add a fourth variable that stores whether you've written Python before (True or False) and print it.",
      expectedResult: "The program prints a personalized sentence twice, with the number changing between the two prints.",
      tests: ["At least 3 variables are created", "The favorite number variable is reassigned and reprinted"],
      hint: "Reassigning is just writing the variable name again with a new value: favorite_number = 8",
      lessonAssessment: [
        {
          question: "Which of these is a valid, conventional Python variable name?",
          options: ["2total", "total_score", "total-score", "Total Score"],
          correctAnswerIndex: 1,
          explanation: "Variable names must not start with a digit and can't contain spaces or hyphens; snake_case like total_score is the Python convention.",
        },
        {
          question: "After running: x = 5\\nx = 10\\nprint(x). What is printed?",
          options: ["5", "10", "5 10", "An error"],
          correctAnswerIndex: 1,
          explanation: "The second assignment overwrites the first, so x holds 10 by the time print() runs.",
        },
      ],
      commonMistakes: ["Using a Python keyword like 'print' or 'class' as a variable name.", "Mixing naming styles (camelCase and snake_case) in the same file."],
      deliverables: ["A script with at least 4 variables and 2 print statements"],
      assessmentCriteria: ["Variable names follow snake_case", "Reassignment is demonstrated correctly"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 minutes",
      codeExample: {
        language: "python",
        code: 'name = "Ada"\nfavorite_number = 7\nprint(name, "likes the number", favorite_number)\nfavorite_number = 42\nprint(name, "now likes the number", favorite_number)',
        explanation: "The variable favorite_number is reassigned from 7 to 42, and the second print() reflects the new value.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Python Basics & Your First Program Assessment",
    questions: [
      {
        question: "What type of language is Python, in terms of how it executes code?",
        options: ["A compiled-only language", "An interpreted language", "A markup language", "A query language"],
        correctAnswerIndex: 1,
        explanation: "Python is interpreted: the interpreter reads and executes source code directly, without a separate manual compile step.",
      },
      {
        question: "What does the following code print?\nprint(\"A\")\nprint(\"B\")",
        options: ["AB on one line", "A then B on two separate lines", "B then A", "A syntax error"],
        correctAnswerIndex: 1,
        explanation: "Each print() call outputs its own line by default, and statements run top to bottom.",
      },
      {
        question: "Which line is a valid Python comment?",
        options: ["// this is a comment", "# this is a comment", "<!-- this is a comment -->", "-- this is a comment"],
        correctAnswerIndex: 1,
        explanation: "Python uses # for single-line comments.",
      },
      {
        question: "What is the output of print(\"Score:\", 10, \"points\")?",
        options: ["Score:10points", "Score: 10 points", "Score, 10, points", "An error, mixing text and numbers"],
        correctAnswerIndex: 1,
        explanation: "print() joins multiple arguments with a single space between each.",
      },
      {
        question: "Which of the following is the conventional Python style for variable names?",
        options: ["camelCase", "PascalCase", "snake_case", "kebab-case"],
        correctAnswerIndex: 2,
        explanation: "PEP 8, Python's style guide, recommends snake_case for variable and function names.",
      },
      {
        question: "What happens to the value of x after this code runs?\nx = 3\nx = x + 1",
        options: ["x is 3", "x is 4", "x is 1", "This causes an error"],
        correctAnswerIndex: 1,
        explanation: "x + 1 evaluates using the current value of x (3), producing 4, which is then stored back into x.",
      },
      {
        question: "Why does Python execution stop when it hits an error partway through a script?",
        options: [
          "Python always finishes the whole file first, then reports errors",
          "The interpreter halts at the failing statement and reports a traceback",
          "Python ignores errors by default",
          "Python restarts the script automatically",
        ],
        correctAnswerIndex: 1,
        explanation: "Unless the error is caught, Python stops executing at the line that raised it and shows a traceback.",
      },
      {
        question: "Which variable name is invalid in Python?",
        options: ["_hidden", "total2", "2total", "my_total"],
        correctAnswerIndex: 2,
        explanation: "Variable names cannot start with a digit; 2total is invalid Python syntax.",
      },
      {
        question: "Are Python variable names case-sensitive?",
        options: ["Yes, age and Age are different variables", "No, they are treated the same", "Only for the first letter", "Only inside functions"],
        correctAnswerIndex: 0,
        explanation: "Python is case-sensitive, so age, Age, and AGE are three distinct variable names.",
      },
      {
        question: "What is the purpose of a comment in Python?",
        options: [
          "It runs as extra code the user cannot see",
          "It explains code to humans and is ignored by the interpreter",
          "It speeds up the program",
          "It is required before every print statement",
        ],
        correctAnswerIndex: 1,
        explanation: "Comments exist purely for human readers; the Python interpreter skips anything after # on a line.",
      },
    ],
  },
  assignment:
    "Build a short 'About Me' script in the Academy workspace: create at least five variables describing yourself (name, age, city, hobby, and one more of your choice), then use print() statements and comments to display a readable mini-profile combining those variables into full sentences.",
  assignmentDeliverables: [
    "A single Python file with 5+ variables, several print statements, and comments",
    "A short note (2-3 sentences) explaining which variables you used and why",
  ],
  assignmentAssessmentCriteria: [
    "All variables follow snake_case naming",
    "Output reads as coherent sentences, not just raw variable dumps",
    "Comments are present and explain intent, not just restate code",
  ],
  miniProject:
    "Extend your 'About Me' script into a 'Profile Card' generator: print a formatted block that looks like a small profile card (using multiple print() lines to form borders/sections with characters like - and |), pulling every piece of text from variables rather than hardcoding it directly into the print calls.",
  miniProjectDeliverables: ["profile_card.py in the Academy workspace", "A brief note on how the layout is built from variables"],
  miniProjectAssessmentCriteria: [
    "The card's content comes entirely from variables, not hardcoded strings",
    "Output is visually organized (clear lines/sections)",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
