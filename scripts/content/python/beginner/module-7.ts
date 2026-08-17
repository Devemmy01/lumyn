import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace. Only read or write files you created yourself inside the workspace.";

export const module7: GeneratedModule = {
  title: "Strings, Errors & Files",
  description:
    "Round out your fundamentals: format text cleanly with f-strings and string methods, handle errors gracefully instead of crashing, and read and write files.",
  completionStatus: "locked",
  lessons: [
    {
      title: "String Methods and f-strings",
      goal: "Use common string methods and f-strings to build and clean up text.",
      videoTitle: "Python String Methods and f-strings Tutorial",
      videoSearchQuery: "python string methods f-strings tutorial for beginners",
      videoLearningGoal: "See upper(), lower(), strip(), split(), and f-string formatting used together.",
      recommendedChannels: ["Corey Schafer", "Programming with Mosh"],
      keyTakeaways: [
        "f-strings (f\"Hello, {name}!\") embed variables directly inside a string.",
        "Common string methods: .upper(), .lower(), .strip(), .replace(), .split().",
        "Strings are immutable: methods like .upper() return a new string rather than changing the original.",
      ],
      notes:
        "f-strings are the modern, readable way to build strings from variables: just put an f before the opening quote and wrap any variable in curly braces. String methods let you clean and transform text: .strip() removes extra whitespace, .split() breaks a string into a list of pieces, and .replace() swaps out substrings.",
      conceptExplanation:
        "Because strings are immutable, name.upper() doesn't change name itself. It returns a brand-new uppercase string that you must capture if you want to keep it: name = name.upper(). \"a,b,c\".split(\",\") returns [\"a\", \"b\", \"c\"], a list you can then loop over or index into. This is a very common pattern for parsing simple text data.",
      whyItMatters: "f-strings and string methods are used in nearly every real Python program, from formatting output to parsing user input and files.",
      practicalTask:
        "Create a variable holding a sentence with extra spaces and mixed case, like \"  Hello WORLD  \". Use .strip() and .lower() to clean it up, then use an f-string to print a formatted message that includes the cleaned text and its length using len().",
      challenge: "Use .split() on a comma-separated string of three items and print each item on its own line using a loop.",
      expectedResult: "The program prints a cleaned-up, properly cased version of the messy string, embedded in a formatted f-string message.",
      tests: ["Both .strip() and .lower() (or .upper()) are used", "An f-string is used to build the final printed message"],
      hint: "You can chain string methods: text.strip().lower() runs strip first, then lower on the result.",
      lessonAssessment: [
        {
          question: "What does \"  hello  \".strip() return?",
          options: ["\"hello\"", "\"  hello  \"", "\"HELLO\"", "An error"],
          correctAnswerIndex: 0,
          explanation: ".strip() removes leading and trailing whitespace, returning \"hello\" without the surrounding spaces.",
        },
        {
          question: "What does the f-string f\"Score: {score}\" do when score = 90?",
          options: ["Prints the literal text \"Score: {score}\"", "Embeds the value of score directly into the string, producing \"Score: 90\"", "Raises an error", "Only works with string variables, not numbers"],
          correctAnswerIndex: 1,
          explanation: "f-strings evaluate the expression inside {} and insert its value directly into the resulting string.",
        },
      ],
      commonMistakes: ["Forgetting the f before the opening quote, so {name} prints literally instead of substituting.", "Assuming .upper() changes the original string in place instead of returning a new one."],
      deliverables: ["A script using f-strings and at least two string methods"],
      assessmentCriteria: ["f-string correctly embeds a variable", "String methods correctly clean/transform the text"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "python",
        code: 'raw = "  Hello WORLD  "\ncleaned = raw.strip().lower()\nprint(f"Cleaned text: \'{cleaned}\' ({len(cleaned)} characters)")',
        explanation: "strip() and lower() are chained to clean the text, then an f-string embeds both the cleaned value and its length into one message.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Handling Errors with try/except",
      goal: "Catch and handle runtime errors gracefully instead of letting the program crash.",
      videoTitle: "Python try except Error Handling Tutorial",
      videoSearchQuery: "python try except error handling tutorial for beginners",
      videoLearningGoal: "See a try/except block catch a specific error type and print a friendly message instead of crashing.",
      recommendedChannels: ["freeCodeCamp.org", "Corey Schafer"],
      keyTakeaways: [
        "try: wraps code that might fail; except: catches the error if it happens and lets the program keep running.",
        "You can catch specific error types, like except ValueError:, to handle different problems differently.",
        "Code in the try block stops running the instant an error occurs, jumping straight to except.",
      ],
      notes:
        "Without error handling, an error anywhere in your program crashes the whole thing. Wrapping risky code (like converting user input to a number) in a try/except block lets you catch the problem and respond sensibly instead: printing a helpful message, using a default value, or asking again.",
      conceptExplanation:
        "try:\\n    age = int(input(\"Age: \"))\\nexcept ValueError:\\n    print(\"That's not a valid number.\"). If the user types \"abc\", int() raises a ValueError, and instead of crashing, the except block runs and the program continues. You can catch multiple specific error types with separate except clauses, or use a bare except: to catch anything (generally discouraged, since it can hide bugs you didn't anticipate).",
      whyItMatters: "Real programs deal with unpredictable input and unreliable resources. Error handling is what keeps them running instead of crashing at the first problem.",
      practicalTask:
        "Write a function safe_divide(a, b) that returns a divided by b, but uses try/except to catch a ZeroDivisionError and return None with a printed message instead of crashing. Test it with both a valid division and a division by zero.",
      challenge: "Add a second except clause that also catches a TypeError, in case non-numeric values are passed in.",
      expectedResult: "Calling safe_divide(10, 2) prints the correct result; calling safe_divide(10, 0) prints a friendly error message instead of crashing the program.",
      tests: ["try/except wraps the division operation", "ZeroDivisionError is specifically caught and handled"],
      hint: "Dividing by zero in Python raises a ZeroDivisionError. Catch it by name: except ZeroDivisionError:",
      lessonAssessment: [
        {
          question: "What is the purpose of a try/except block?",
          options: [
            "To make code run faster",
            "To catch and handle an error so the program doesn't crash",
            "To repeat code multiple times",
            "To define a function",
          ],
          correctAnswerIndex: 1,
          explanation: "try/except lets you catch a runtime error and respond to it instead of letting it crash the program.",
        },
        {
          question: "What happens to the rest of the code inside a try block after an error occurs partway through it?",
          options: ["It keeps running normally", "It is skipped, and control jumps to the matching except block", "The whole program restarts", "Python ignores the error and continues silently"],
          correctAnswerIndex: 1,
          explanation: "As soon as an error is raised inside try, execution jumps immediately to the matching except block, skipping any remaining try code.",
        },
      ],
      commonMistakes: ["Using a bare except: that silently swallows every error, making bugs hard to find.", "Wrapping too much code in one try block, making it unclear which line actually failed."],
      deliverables: ["A script with a function that safely handles a runtime error using try/except"],
      assessmentCriteria: ["Specific error type is caught (not a bare except)", "Program continues running after the error instead of crashing"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "python",
        code: 'def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        print("Cannot divide by zero.")\n        return None\n\nprint(safe_divide(10, 2))\nprint(safe_divide(10, 0))',
        explanation: "The division by zero raises a ZeroDivisionError, which is caught by except, letting the program print a friendly message and continue instead of crashing.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Reading and Writing Files",
      goal: "Open a file, write text to it, and read its contents back.",
      videoTitle: "Python File Handling: Reading and Writing Files",
      videoSearchQuery: "python read write files open tutorial for beginners",
      videoLearningGoal: "See open() used with the with statement to write to a file and then read its contents back.",
      recommendedChannels: ["Programming with Mosh", "Traversy Media"],
      keyTakeaways: [
        "with open(\"file.txt\", \"w\") as f: opens a file for writing and automatically closes it afterward.",
        "\"w\" mode overwrites a file; \"a\" mode appends to the end; \"r\" mode reads.",
        "f.write(text) writes to a file; f.read() reads the whole file as one string.",
      ],
      notes:
        "The with statement is the standard, safe way to work with files in Python: it automatically closes the file when you're done, even if an error occurs. open(\"notes.txt\", \"w\") opens (or creates) a file for writing; open(\"notes.txt\", \"r\") opens it for reading.",
      conceptExplanation:
        "Opening in \"w\" mode erases any existing content in the file before writing new content. If you want to add to a file without erasing it, use \"a\" (append) mode instead. f.read() returns the entire file as one string; f.readlines() returns a list of lines instead, which is often more convenient for processing line by line.",
      whyItMatters: "Reading and writing files is how programs save data between runs. Without it, everything a program does disappears the moment it stops.",
      practicalTask:
        "Write a script that opens a file called notes.txt in write mode, writes three lines of text to it (using \\n between lines, or three separate write() calls), then reopens the file in read mode and prints its full contents.",
      challenge: "Reopen the file in append mode, add one more line without erasing the existing content, then read and print the file again to confirm all four lines are present.",
      expectedResult: "The program creates notes.txt, writes content to it, and then successfully reads and prints that same content back.",
      tests: ["File is opened in write mode using with", "File is reopened in read mode and its contents are printed"],
      hint: "Use \\n inside a string to create a line break when writing multiple lines in one write() call.",
      lessonAssessment: [
        {
          question: "What does opening a file in \"w\" mode do if the file already has content?",
          options: ["Adds new content to the end", "Erases the existing content before writing", "Raises an error", "Opens the file as read-only"],
          correctAnswerIndex: 1,
          explanation: "\"w\" (write) mode overwrites the file, erasing any existing content before the new content is written.",
        },
        {
          question: "Why is the with statement recommended when working with files?",
          options: [
            "It makes the file read faster",
            "It automatically closes the file when done, even if an error occurs",
            "It is required by Python syntax",
            "It converts the file to a string automatically",
          ],
          correctAnswerIndex: 1,
          explanation: "with ensures the file is properly closed afterward, which prevents resource leaks and data not being saved.",
        },
      ],
      commonMistakes: ["Opening a file in \"w\" mode when \"a\" (append) was intended, accidentally erasing existing data.", "Forgetting to close a file when not using with (risking unsaved or corrupted data)."],
      deliverables: ["A script that writes to and then reads from a file in the Academy workspace"],
      assessmentCriteria: ["File is written correctly", "File is read back and its contents match what was written"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "python",
        code: 'with open("notes.txt", "w") as f:\n    f.write("Line one\\n")\n    f.write("Line two\\n")\n\nwith open("notes.txt", "r") as f:\n    contents = f.read()\n    print(contents)',
        explanation: "The first with block writes two lines to notes.txt and closes it automatically; the second opens it again for reading and prints the full contents.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Strings, Errors & Files Assessment",
    questions: [
      { question: "What character starts an f-string?", options: ["s", "f", "%", "$"], correctAnswerIndex: 1, explanation: "f-strings are written with an f immediately before the opening quote, e.g. f\"Hello {name}\"." },
      { question: "Does .upper() change the original string?", options: ["Yes, it modifies it directly", "No, it returns a new string", "Only for numbers", "It raises an error"], correctAnswerIndex: 1, explanation: "Strings are immutable in Python, so .upper() returns a new uppercase string rather than modifying the original." },
      { question: "What does \"a,b,c\".split(\",\") return?", options: ["\"abc\"", "[\"a\", \"b\", \"c\"]", "(\"a\", \"b\", \"c\")", "An error"], correctAnswerIndex: 1, explanation: ".split(\",\") breaks the string apart at each comma and returns a list of the resulting pieces." },
      { question: "What is the purpose of try/except?", options: ["To repeat code", "To catch and handle a runtime error", "To define a function", "To format strings"], correctAnswerIndex: 1, explanation: "try/except lets a program catch an error and respond instead of crashing." },
      { question: "What error does dividing by zero raise in Python?", options: ["ValueError", "TypeError", "ZeroDivisionError", "IndexError"], correctAnswerIndex: 2, explanation: "Python raises a ZeroDivisionError specifically when a number is divided by zero." },
      { question: "What happens to code after the point where an error occurs inside a try block?", options: ["It keeps running", "It's skipped; control jumps to except", "The program restarts", "Nothing happens"], correctAnswerIndex: 1, explanation: "Once an error occurs, the rest of the try block is skipped and control moves to the matching except." },
      { question: "What does opening a file in \"w\" mode do to existing content?", options: ["Appends to it", "Erases it before writing", "Leaves it unchanged", "Makes the file read-only"], correctAnswerIndex: 1, explanation: "\"w\" mode overwrites the file, erasing prior content." },
      { question: "Which file mode adds content without erasing what's already there?", options: ["\"w\"", "\"r\"", "\"a\"", "\"x\""], correctAnswerIndex: 2, explanation: "\"a\" (append) mode adds new content to the end of the file without erasing existing content." },
      { question: "Why is the with statement recommended for file handling?", options: [
          "It's required by Python's syntax rules",
          "It automatically closes the file, even if an error occurs",
          "It reads files faster than open() alone",
          "It only works with .txt files",
        ], correctAnswerIndex: 1, explanation: "with ensures proper cleanup (closing the file) automatically, which prevents lost or corrupted data." },
      { question: "What does f.read() return when reading a file?", options: ["A list of lines", "The entire file contents as one string", "Only the first line", "The file's name"], correctAnswerIndex: 1, explanation: "f.read() returns the full contents of the file as a single string." },
    ],
  },
  assignment:
    "Build a 'Safe Note Saver': write a function save_note(filename, text) that writes text to the given filename using try/except to catch any error during the write and print a friendly message if it fails. Call it to save at least two different notes to two different files, then read and print both files back to confirm they saved correctly.",
  assignmentDeliverables: ["A script with a save_note() function using try/except around the file write", "Output showing both saved notes read back successfully"],
  assignmentAssessmentCriteria: ["File writing and reading both work correctly", "try/except is used around the risky file operation"],
  miniProject:
    "Build a 'Journal Logger': write a program that appends a new dated entry (use a hardcoded date string, since this is before you've learned Python's date tools) to a journal.txt file each time it runs, using \"a\" mode so previous entries are preserved. After appending, read and print the entire journal file so all entries are visible. Use an f-string to format each entry and try/except to handle any file errors gracefully.",
  miniProjectDeliverables: ["journal_logger.py in the Academy workspace", "journal.txt showing at least 2 accumulated entries after running the script twice"],
  miniProjectAssessmentCriteria: ["Entries are appended, not overwritten, across runs", "f-strings and try/except are both used correctly"],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
