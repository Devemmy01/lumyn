import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module6: GeneratedModule = {
  title: "Functions: Reusable Blocks of Code",
  description:
    "Package logic into reusable functions with parameters and return values, and understand how variable scope works inside them.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Defining Functions and Using Parameters",
      goal: "Define a function with def, accept parameters, and call it with arguments.",
      videoTitle: "Python Functions Tutorial for Beginners",
      videoSearchQuery: "python functions def parameters tutorial for beginners",
      videoLearningGoal: "See how to define a function with def, give it parameters, and call it multiple times with different arguments.",
      recommendedChannels: ["Corey Schafer", "freeCodeCamp.org"],
      keyTakeaways: [
        "def function_name(parameters): starts a function definition; the indented block is its body.",
        "Parameters are placeholders in the definition; arguments are the actual values passed when calling.",
        "A function's code doesn't run until it's called, no matter where it's defined in the file.",
      ],
      notes:
        "A function is a named, reusable block of code. You define it once with def, and call it as many times as needed. Parameters let a function work with different input each time it's called, instead of being hardcoded.",
      conceptExplanation:
        "def greet(name): defines a function named greet that expects one parameter, name. Calling greet(\"Ada\") runs the function's body with name set to \"Ada\" for that call only. You can call the same function many times with different arguments, like greet(\"Ada\") and greet(\"Sam\"), and each call is independent.",
      whyItMatters: "Functions let you write logic once and reuse it everywhere, instead of copy-pasting the same code repeatedly. This is the single biggest readability and maintainability win in programming.",
      practicalTask:
        "Define a function called greet_user that takes one parameter, name, and prints a personalized greeting. Call it three times with three different names.",
      challenge: "Add a second parameter, language, and print the greeting in a different phrase depending on its value (e.g. \"Hello\" vs \"Hola\").",
      expectedResult: "The program prints three different personalized greetings, one for each name passed in.",
      tests: ["Function is defined using def with at least one parameter", "Function is called at least 3 times with different arguments"],
      hint: "Parameters go inside the parentheses in the def line: def greet_user(name):",
      lessonAssessment: [
        {
          question: "What keyword is used to define a function in Python?",
          options: ["func", "def", "function", "define"],
          correctAnswerIndex: 1,
          explanation: "Python functions are defined using the def keyword, followed by the function name and parentheses.",
        },
        {
          question: "When does the code inside a function's body actually run?",
          options: ["Immediately when the def line is reached", "Only when the function is called", "Only once, automatically, at the end of the file", "Never, unless imported"],
          correctAnswerIndex: 1,
          explanation: "Defining a function only creates it; the body only executes each time the function is called.",
        },
      ],
      commonMistakes: ["Forgetting the colon at the end of the def line.", "Defining a function but never actually calling it."],
      deliverables: ["A script with a function taking at least one parameter, called multiple times"],
      assessmentCriteria: ["Function correctly defined and reused", "Different arguments produce different output"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "python",
        code: 'def greet_user(name):\n    print("Hello,", name + "!")\n\ngreet_user("Ada")\ngreet_user("Sam")',
        explanation: "The function is defined once and called twice, each time with a different name argument producing a different greeting.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Return Values and Default Arguments",
      goal: "Use return to send a value back from a function and set default values for parameters.",
      videoTitle: "Python return Statement and Default Parameters",
      videoSearchQuery: "python return statement default parameters tutorial",
      videoLearningGoal: "See functions that calculate and return a value, and parameters with default values used when an argument is omitted.",
      recommendedChannels: ["Programming with Mosh", "Corey Schafer"],
      keyTakeaways: [
        "return sends a value back to wherever the function was called, ending the function immediately.",
        "A function without an explicit return sends back None.",
        "Default arguments (def greet(name=\"friend\"):) let a parameter be optional.",
      ],
      notes:
        "Unlike print(), which just displays a value, return actually hands a value back so you can store it in a variable or use it in further calculations. This is what makes functions genuinely reusable building blocks rather than just organized print statements.",
      conceptExplanation:
        "def add(a, b): return a + b lets you write total = add(3, 4), storing 7 in total for later use. A function can have a default value for a parameter: def greet(name=\"friend\"): means greet() (with no argument) uses \"friend\" automatically, while greet(\"Ada\") overrides it with \"Ada\". Default parameters must come after any parameters without defaults.",
      whyItMatters: "return is what lets functions plug into the rest of your program: calculating a value once and using it in several places, rather than only printing it.",
      practicalTask:
        "Write a function calculate_area(width, height) that returns the area of a rectangle. Call it with two different sets of dimensions, storing each result in a variable, then print both results.",
      challenge: "Add a default value of 1 for height, so calculate_area(5) works and returns 5 without requiring a second argument.",
      expectedResult: "The program prints two different calculated areas, each stored from a returned value rather than printed inside the function.",
      tests: ["Function uses return, not just print, to produce its result", "Function is called at least twice with different arguments and the results are stored"],
      hint: "return a * b immediately ends the function and sends that value back to the caller.",
      lessonAssessment: [
        {
          question: "What does a function return if it has no explicit return statement?",
          options: ["0", "An empty string", "None", "It raises an error"],
          correctAnswerIndex: 2,
          explanation: "A function without a return statement implicitly returns None.",
        },
        {
          question: "Given def greet(name=\"friend\"): ..., what happens when you call greet()?",
          options: ["It raises an error because no argument was given", "It runs using \"friend\" as the value of name", "It runs with name set to None", "It does nothing"],
          correctAnswerIndex: 1,
          explanation: "Since name has a default value, omitting the argument causes Python to use \"friend\" automatically.",
        },
      ],
      commonMistakes: ["Using print() inside a function instead of return, then trying to store the (missing) result in a variable.", "Putting a parameter without a default after one that has a default, which is a SyntaxError."],
      deliverables: ["A script with a function that returns a calculated value, called multiple times"],
      assessmentCriteria: ["return used correctly to produce a usable value", "Default argument demonstrated correctly"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "python",
        code: 'def calculate_area(width, height=1):\n    return width * height\n\narea1 = calculate_area(5, 3)\narea2 = calculate_area(5)\nprint(area1, area2)',
        explanation: "The function returns a value instead of printing it directly; the second call relies on the default height of 1.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Variable Scope: Local vs Global",
      goal: "Understand the difference between variables defined inside a function and outside it.",
      videoTitle: "Python Variable Scope: Local vs Global Explained",
      videoSearchQuery: "python local vs global variable scope tutorial",
      videoLearningGoal: "See a local variable that only exists inside a function and a global variable accessible everywhere.",
      recommendedChannels: ["freeCodeCamp.org", "Traversy Media"],
      keyTakeaways: [
        "A variable created inside a function is local: it only exists while that function is running and can't be accessed outside it.",
        "A variable created outside any function is global: it can be read from inside functions.",
        "Modifying a global variable from inside a function requires the global keyword (a specific, less common case).",
      ],
      notes:
        "Scope determines where in your code a variable can be seen and used. Parameters and variables created inside a function only exist during that function's execution. Once the function returns, they're gone. This keeps functions self-contained and prevents them from accidentally interfering with each other.",
      conceptExplanation:
        "If you try to print a variable that was only created inside a function, from outside that function, Python raises a NameError because that name simply doesn't exist in the outer scope. Global variables, defined at the top level of your script, can be read (but not directly modified) from inside any function without any special syntax. Needing to modify a global from inside a function is possible with the global keyword but is generally avoided in well-structured code: passing values in as parameters and getting results back via return is the clearer pattern you've already been practicing.",
      whyItMatters: "Understanding scope prevents a whole category of confusing bugs where a variable seems to 'disappear' or hold an unexpected value.",
      practicalTask:
        "Write a function that creates a local variable and prints it inside the function. Then, outside the function (after calling it), try to print that same variable name and observe the NameError in your notes. Explain in a comment why the error happens.",
      challenge: "Create a global variable before the function, read it from inside the function (without modifying it), and print it both inside and outside to show it's accessible in both places.",
      expectedResult: "The program successfully prints the local variable inside the function, and demonstrates (in notes or a caught scenario) that it isn't accessible outside.",
      tests: ["A local variable is created inside a function and used only there", "A global variable is read successfully from inside a function"],
      hint: "A NameError with a message like \"name 'x' is not defined\" is expected and correct here: it's demonstrating the concept, not a bug to fix.",
      lessonAssessment: [
        {
          question: "Where can a variable defined inside a function be accessed?",
          options: ["Anywhere in the program", "Only inside that function while it runs", "Only in functions defined after it", "Nowhere, it's immediately deleted"],
          correctAnswerIndex: 1,
          explanation: "Local variables exist only during the execution of the function that created them.",
        },
        {
          question: "Can a global variable (defined outside any function) be read from inside a function without special syntax?",
          options: ["No, never", "Yes, it can be read directly", "Only if it's a number", "Only if passed as a parameter"],
          correctAnswerIndex: 1,
          explanation: "Global variables are readable from inside functions by default; only modifying them requires the global keyword.",
        },
      ],
      commonMistakes: ["Expecting a variable created inside a function to still exist after the function finishes.", "Relying on global variables for values that should be passed as parameters instead."],
      deliverables: ["A script demonstrating both local and global variable scope"],
      assessmentCriteria: ["Correctly distinguishes local vs global behavior", "Explanation of the NameError is accurate"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 minutes",
      codeExample: {
        language: "python",
        code: 'app_name = "Lumyn Academy"  # global variable\n\ndef show_local():\n    message = "Loading..."  # local variable\n    print(app_name)  # reading the global is fine\n    print(message)\n\nshow_local()\n# print(message) here would raise a NameError, because message is local to show_local()',
        explanation: "app_name is global and readable inside the function; message is local and only exists while show_local() is running.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Functions Assessment",
    questions: [
      { question: "What keyword defines a function in Python?", options: ["function", "def", "func", "lambda"], correctAnswerIndex: 1, explanation: "Functions are defined with the def keyword." },
      { question: "In def greet(name): ..., what is 'name'?", options: ["An argument", "A parameter", "A return value", "A global variable"], correctAnswerIndex: 1, explanation: "'name' is a parameter: a placeholder defined in the function signature. The actual value passed when calling is the argument." },
      { question: "What does a function return if there is no explicit return statement?", options: ["0", "An empty string", "None", "The last printed value"], correctAnswerIndex: 2, explanation: "Without an explicit return, Python functions implicitly return None." },
      { question: "Given def add(a, b): return a + b, what does total = add(2, 3) store in total?", options: ["\"23\"", "5", "None", "An error"], correctAnswerIndex: 1, explanation: "return sends the calculated value (5) back, which gets stored in total." },
      { question: "What happens when you call greet() for def greet(name=\"friend\"):?", options: ["A TypeError, because no argument was given", "It runs using \"friend\" for name", "It runs with name as None", "It prints nothing"], correctAnswerIndex: 1, explanation: "The default value \"friend\" is used automatically when no argument is provided." },
      { question: "Where can a local variable be accessed?", options: ["Anywhere in the file", "Only inside the function where it was created", "Only in the main program, not functions", "In every function"], correctAnswerIndex: 1, explanation: "Local variables are scoped to the function that creates them and don't exist outside it." },
      { question: "Can you read a global variable from inside a function without special syntax?", options: ["No, it's always inaccessible", "Yes, reading works by default", "Only inside the same file", "Only using the return keyword"], correctAnswerIndex: 1, explanation: "Global variables can be read inside any function without needing the global keyword; that keyword is only needed to modify them." },
      { question: "What is the difference between print() and return inside a function?", options: [
          "They do exactly the same thing",
          "print() displays a value; return sends a value back so it can be stored or reused",
          "return displays a value; print() sends it back",
          "print() can only be used outside functions",
        ], correctAnswerIndex: 1, explanation: "print() is for displaying output; return hands a value back to the caller so it can be captured in a variable." },
      { question: "Why must default parameters come after non-default parameters in a function definition?", options: [
          "It's just a style preference with no real effect",
          "Python requires it, or a SyntaxError occurs",
          "It only matters for functions with more than 3 parameters",
          "It doesn't matter at all",
        ], correctAnswerIndex: 1, explanation: "Python enforces that parameters without defaults must come first; violating this order raises a SyntaxError." },
      { question: "What is the main benefit of writing a function instead of repeating code inline?", options: [
          "Functions run faster automatically",
          "Logic is written once and reused, improving readability and maintainability",
          "Functions are required by Python for any calculation",
          "It reduces the number of variables you can use",
        ], correctAnswerIndex: 1, explanation: "Functions let you define logic once and call it wherever needed, avoiding duplicated code." },
    ],
  },
  assignment:
    "Write a small 'Temperature Converter' toolkit: define two functions, celsius_to_fahrenheit(celsius) and fahrenheit_to_celsius(fahrenheit), each using return to send back the converted value. Call each function with at least two different test values and print the results in readable sentences.",
  assignmentDeliverables: ["A script with two functions, each using return", "At least 4 total function calls with printed, readable results"],
  assignmentAssessmentCriteria: ["Both conversion formulas are correct", "return is used correctly instead of printing inside the functions"],
  miniProject:
    "Build a 'Grade Calculator Toolkit': write a function average_score(scores_list) that takes a list of numbers and returns the average, and a function letter_grade(average) that takes a number and returns the corresponding letter grade (reusing your if/elif/else logic from Module 3). Combine them: pass a list of test scores through both functions and print the final letter grade.",
  miniProjectDeliverables: ["grade_calculator.py in the Academy workspace", "Output showing the average and final letter grade for at least 2 different score lists"],
  miniProjectAssessmentCriteria: ["average_score() correctly calculates the mean", "letter_grade() correctly reuses conditional logic and returns the right grade"],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
