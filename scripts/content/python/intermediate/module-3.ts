import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module3: GeneratedModule = {
  title: "Modules, Packages & the Standard Library",
  description:
    "Learn the different ways to import code, understand how Python code is organized into modules and packages, and put real standard library tools to work: math, random, datetime, os.path, and json.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Import Styles: import, from...import, and Aliases",
      goal: "Use the three common import styles correctly and know when to reach for each one.",
      videoTitle: "Python import Statement Explained: import, from, as",
      videoSearchQuery: "python import statement tutorial from import as alias",
      videoLearningGoal: "See import x, from x import y, and import x as y used side by side with the same module.",
      recommendedChannels: ["Corey Schafer", "freeCodeCamp.org"],
      keyTakeaways: [
        "import module_name gives you access to everything in that module through module_name.thing.",
        "from module_name import thing brings a specific name in directly, so you use it without the module prefix.",
        "import module_name as alias renames a module for convenience, commonly used for long or frequently typed names.",
      ],
      notes:
        "A module is just a Python file full of reusable code, and the standard library ships dozens of them ready to use. import math gives you the whole module, accessed as math.sqrt(16). from math import sqrt brings only sqrt in directly, so you call sqrt(16) without the prefix. import math as m renames the module to a shorter alias, m.sqrt(16).",
      conceptExplanation:
        "Each style has a tradeoff. import module_name keeps your code's origin obvious, since every call is prefixed (math.sqrt), which helps readability in larger files. from module_name import thing is more concise for a name you use constantly, but it can create naming collisions if two modules export something with the same name. import module_name as alias is common for modules with long conventional names, and is mostly a matter of established convention rather than necessity in your own scripts.",
      whyItMatters: "Every non-trivial Python program relies on importing code, either from the standard library or your own other files, so choosing the right import style keeps code both correct and readable.",
      practicalTask:
        "In the Academy workspace, main.py is already open for you. Import the math module using all three styles in separate, clearly commented sections: import math and call math.sqrt(64), then from math import pow and call pow(2, 5), then import math as m and call m.floor(9.7). Print the result of each call.",
      challenge: "Add a fourth import, from math import sqrt, pow (importing two names at once with a comma), and use both without any prefix in a new print statement.",
      expectedResult: "The program prints 8.0, 32.0, and 9 (or equivalent), one result for each of the three import styles demonstrated.",
      tests: ["All three import styles (import x, from x import y, import x as y) are used at least once", "Each import style's function call produces correct output"],
      hint: "math.floor() rounds a decimal number down to the nearest whole number, discarding anything after the decimal point.",
      lessonAssessment: [
        {
          question: "After writing import math, how do you call the sqrt function?",
          options: ["sqrt(16)", "math.sqrt(16)", "math->sqrt(16)", "import.sqrt(16)"],
          correctAnswerIndex: 1,
          explanation: "import math brings in the whole module, so its contents are accessed with the module name as a prefix, math.sqrt(16).",
        },
        {
          question: "What does from math import sqrt let you do differently from import math?",
          options: [
            "Nothing, they behave identically",
            "Call sqrt(16) directly without the math. prefix",
            "It imports every function in math automatically",
            "It renames the math module",
          ],
          correctAnswerIndex: 1,
          explanation: "from math import sqrt brings only the sqrt name into your file directly, so it can be called without the module prefix.",
        },
      ],
      commonMistakes: ["Using from module import * to import everything at once, which makes it unclear where each name actually came from.", "Forgetting the module prefix after using import math instead of from math import sqrt."],
      deliverables: ["A script demonstrating all three import styles with the math module"],
      assessmentCriteria: ["Each import style is used correctly and produces the correct result", "Comments clarify which style is being demonstrated in each section"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'import math\nprint(math.sqrt(64))\n\nfrom math import pow\nprint(pow(2, 5))\n\nimport math as m\nprint(m.floor(9.7))',
        explanation: "The same math module is accessed three different ways: with a full prefix, with a directly imported name, and through a short alias.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Practical Standard Library Tools: math, random, and datetime",
      goal: "Use math for calculations, random for randomness, and datetime for working with dates and times.",
      videoTitle: "Python Standard Library Tour: math, random, datetime",
      videoSearchQuery: "python standard library math random datetime tutorial",
      videoLearningGoal: "See practical, real examples of math, random, and datetime functions used in short scripts.",
      recommendedChannels: ["Programming with Mosh", "Tech With Tim"],
      keyTakeaways: [
        "The math module provides functions like sqrt(), floor(), ceil(), and constants like math.pi.",
        "The random module provides random.randint(a, b) for a random whole number and random.choice(sequence) for a random item from a list.",
        "The datetime module's datetime.now() gives the current date and time, which you can format into readable text.",
      ],
      notes:
        "The standard library is code that ships with every Python installation, ready to import with no extra setup. math covers common numeric operations you would otherwise write yourself. random generates pseudo-random values, useful for anything from simulations to picking a random item. datetime represents and formats calendar dates and times.",
      conceptExplanation:
        "math.ceil(4.1) rounds up to 5, while math.floor(4.9) rounds down to 4; math.pi gives you an accurate value of pi for geometry calculations. random.randint(1, 6) simulates rolling a six sided die, inclusive of both 1 and 6, while random.choice([\"rock\", \"paper\", \"scissors\"]) picks one item from a list at random. datetime.now() returns a datetime object representing the current moment, and calling .strftime(\"%Y-%m-%d\") on it formats it into a readable string like \"2026-08-17\".",
      whyItMatters: "These three modules cover an enormous range of everyday programming needs, from calculations to simulations to timestamps, without writing any of that logic from scratch.",
      practicalTask:
        "Import math, random, and datetime. Use math to print the square root and ceiling of a number of your choice. Use random.randint() to simulate rolling two six sided dice and print both results. Use datetime.now() to print the current date and time, then use .strftime(\"%Y-%m-%d\") to print just the date in that format.",
      challenge: "Use random.choice() on a list of at least 4 items to simulate picking a random winner, and print the result along with a short congratulatory message using an f-string.",
      expectedResult: "The program prints a square root and ceiling result, two simulated dice rolls between 1 and 6, and the current date formatted as YYYY-MM-DD.",
      tests: ["math is used for at least 2 different calculations", "random.randint() is used to simulate at least one dice roll, and datetime.now() with strftime() prints a formatted date"],
      hint: "datetime.now() comes from the datetime module, so you typically write from datetime import datetime to use it as datetime.now() without a repeated prefix.",
      lessonAssessment: [
        {
          question: "What does random.randint(1, 6) return?",
          options: ["A random float between 1 and 6", "A random whole number between 1 and 6, including both 1 and 6", "Always the number 6", "A list of 6 random numbers"],
          correctAnswerIndex: 1,
          explanation: "randint(a, b) returns a random integer where both endpoints, a and b, are possible results.",
        },
        {
          question: "What does calling .strftime(\"%Y-%m-%d\") on a datetime object do?",
          options: [
            "Deletes the time information",
            "Formats the date into a string using the given pattern, like 2026-08-17",
            "Converts the datetime to a random value",
            "Raises an error, since strftime requires no arguments",
          ],
          correctAnswerIndex: 1,
          explanation: "strftime() formats a datetime object into a string according to the format codes you provide, such as %Y for a 4 digit year.",
        },
      ],
      commonMistakes: ["Confusing math.floor() (always rounds down) with normal rounding, which rounds to the nearest value.", "Forgetting that random.randint(a, b) includes both endpoints, unlike range(), which excludes the stop value."],
      deliverables: ["A script demonstrating math, random, and datetime each doing something useful"],
      assessmentCriteria: ["Each module is imported and used correctly", "Output values are printed clearly and are plausible for each operation"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'import math\nimport random\nfrom datetime import datetime\n\nprint(math.sqrt(50), math.ceil(4.1))\n\ndie1 = random.randint(1, 6)\ndie2 = random.randint(1, 6)\nprint("Rolled:", die1, die2)\n\nnow = datetime.now()\nprint(now.strftime("%Y-%m-%d"))',
        explanation: "math handles the calculations, random simulates two dice rolls between 1 and 6, and datetime.now() paired with strftime() prints today's date in a clean format.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Inspecting Paths and Files Safely with os.path",
      goal: "Use os.path to check whether a file exists and inspect its name and extension without modifying anything.",
      videoTitle: "Python os.path Tutorial: Checking Files and Paths",
      videoSearchQuery: "python os.path tutorial check file exists basename",
      videoLearningGoal: "See os.path.exists(), os.path.basename(), and os.path.splitext() used to inspect files safely.",
      recommendedChannels: ["freeCodeCamp.org", "Corey Schafer"],
      keyTakeaways: [
        "os.path.exists(path) returns True or False depending on whether a file or folder exists at that path.",
        "os.path.basename(path) returns just the filename portion of a path, without the surrounding folders.",
        "os.path.splitext(path) splits a filename into its name and extension, returned as a tuple.",
      ],
      notes:
        "The os.path module lets you inspect files and paths safely: checking whether something exists, pulling out a filename, or reading its extension, all without opening, changing, or deleting anything. This is the kind of read-only inspection you will often do before deciding what to do with a file.",
      conceptExplanation:
        "os.path.exists(\"notes.txt\") returns False before the file has been created and True after, which is useful for checking before you try to read a file that might not exist yet. os.path.basename(\"data/notes.txt\") returns \"notes.txt\", stripping away any folder path. os.path.splitext(\"notes.txt\") returns (\"notes\", \".txt\") as a tuple, letting you check a file's extension without manually slicing the string.",
      whyItMatters: "Checking whether a file exists before reading it, and inspecting filenames and extensions, prevents crashes and lets your programs make smart decisions about the files they work with.",
      practicalTask:
        "Import os. Use os.path.exists(\"main.py\") to check if the current file exists and print the result. Then use os.path.basename(\"main.py\") and os.path.splitext(\"main.py\") and print both results, labeling what each one represents.",
      challenge: "Check os.path.exists() on a filename you know does not exist yet, like \"missing.txt\", and print a message confirming it correctly returns False.",
      expectedResult: "The program prints True for the existing file check, the correct basename, and a correct (name, extension) tuple from splitext().",
      tests: ["os.path.exists() correctly reports whether a file exists", "os.path.basename() and os.path.splitext() both return correct, clearly labeled results"],
      hint: "os.path.splitext() always returns a tuple with two items, even if the second one (the extension) is an empty string for a file with no extension.",
      lessonAssessment: [
        {
          question: "What does os.path.exists(\"data.json\") return if that file has not been created yet?",
          options: ["True", "False", "None", "It raises an error"],
          correctAnswerIndex: 1,
          explanation: "os.path.exists() safely returns False for a path that does not currently exist, rather than raising an error.",
        },
        {
          question: "What does os.path.splitext(\"report.txt\") return?",
          options: ["\"report.txt\"", "(\"report\", \".txt\")", "[\"report\", \"txt\"]", "\"txt\""],
          correctAnswerIndex: 1,
          explanation: "splitext() splits the filename into a (name, extension) tuple, here (\"report\", \".txt\").",
        },
      ],
      commonMistakes: ["Trying to read or open a file before checking whether it exists, causing an avoidable crash.", "Assuming os.path.basename() removes the file extension too, when it only strips the folder path."],
      deliverables: ["A script demonstrating os.path.exists(), os.path.basename(), and os.path.splitext()"],
      assessmentCriteria: ["Each os.path function is used correctly", "Output correctly and clearly reflects each function's real result"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'import os\n\nprint(os.path.exists("main.py"))\nprint(os.path.basename("data/notes.txt"))\nprint(os.path.splitext("notes.txt"))',
        explanation: "exists() checks presence without touching the file, basename() strips the folder portion of the path, and splitext() separates the filename from its extension.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Modules, Packages & the Standard Library Assessment",
    questions: [
      { question: "After import math, how do you call the sqrt function?", options: ["sqrt(16)", "math.sqrt(16)", "math::sqrt(16)", "import.sqrt(16)"], correctAnswerIndex: 1, explanation: "A plain import gives you the whole module, so its members are accessed with the module name as a prefix." },
      { question: "What does from math import sqrt let you write?", options: ["math.sqrt(16)", "sqrt(16), without a prefix", "It imports nothing", "It renames sqrt"], correctAnswerIndex: 1, explanation: "from module import name brings that specific name in directly, usable without the module prefix." },
      { question: "What is the purpose of import module_name as alias?", options: ["It deletes the module", "It gives the module a shorter or more convenient name to use in your code", "It imports every function inside it automatically", "It is required syntax for every import"], correctAnswerIndex: 1, explanation: "The as keyword renames the imported module for convenience, commonly seen with long or frequently typed module names." },
      { question: "What does math.floor(4.9) return?", options: ["5", "4", "4.9", "5.0"], correctAnswerIndex: 1, explanation: "floor() always rounds down to the nearest whole number, so 4.9 becomes 4." },
      { question: "What values can random.randint(1, 6) return?", options: ["Only 1 through 5", "1 through 6, including both endpoints", "Any number, unrestricted", "Only even numbers"], correctAnswerIndex: 1, explanation: "randint(a, b) is inclusive of both a and b, unlike range(), which excludes the stop value." },
      { question: "What does random.choice([\"a\", \"b\", \"c\"]) do?", options: ["Returns all three items in a random order", "Returns one randomly selected item from the list", "Always returns the first item", "Raises an error if the list has more than 2 items"], correctAnswerIndex: 1, explanation: "random.choice() picks a single random element from the given sequence." },
      { question: "What does datetime.now() return?", options: ["Only today's date as text", "A datetime object representing the current date and time", "A random date", "The date the program was first written"], correctAnswerIndex: 1, explanation: "datetime.now() returns a datetime object representing the current moment, which can then be formatted with strftime()." },
      { question: "What does os.path.exists(\"file.txt\") return if the file is not present?", options: ["Raises an error", "True", "False", "None"], correctAnswerIndex: 2, explanation: "os.path.exists() safely returns False rather than raising an error when the path does not exist." },
      { question: "What does os.path.basename(\"data/notes.txt\") return?", options: ["\"data\"", "\"data/notes.txt\"", "\"notes.txt\"", "\"notes\""], correctAnswerIndex: 2, explanation: "basename() returns only the filename portion, stripping away any leading folder path." },
      { question: "What does os.path.splitext(\"notes.txt\") return?", options: ["\"notes.txt\"", "(\"notes\", \".txt\")", "[\"notes\", \"txt\"]", "\".txt\""], correctAnswerIndex: 1, explanation: "splitext() separates the base filename from its extension, returning both as a tuple." },
    ],
  },
  assignment:
    "Build a 'Random Report Generator': import random, math, and datetime. Generate 5 random integers between 1 and 100 using random.randint() and store them in a list. Use math to print the average and the square root of the highest number in the list. Use datetime.now() and strftime() to print a formatted timestamp labeling when the report was generated.",
  assignmentDeliverables: [
    "A script combining random, math, and datetime to generate and label a small report",
    "Printed output showing the 5 random numbers, calculated statistics, and a formatted timestamp",
  ],
  assignmentAssessmentCriteria: [
    "random.randint() correctly generates 5 numbers within the specified range",
    "math is used correctly to calculate at least 2 statistics from the list",
    "datetime.now() with strftime() produces a correctly formatted timestamp",
  ],
  miniProject:
    "Build a 'File Inventory Checker': create a list of at least 5 filenames as strings (some with different extensions, at least one that does not actually exist in the workspace, like \"missing.log\"). Loop through the list and, for each filename, use os.path.exists() to check if it is present, os.path.splitext() to report its extension, and print a clearly formatted summary line for every file showing its name, extension, and whether it currently exists.",
  miniProjectDeliverables: [
    "file_inventory.py in the Academy workspace",
    "Output showing a formatted summary line for every filename in the list",
  ],
  miniProjectAssessmentCriteria: [
    "os.path.exists() and os.path.splitext() are both used correctly inside the loop",
    "Output is clearly labeled and correctly reflects each file's real status",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
