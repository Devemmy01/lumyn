import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module2: GeneratedModule = {
  title: "Data Types & Operators",
  description:
    "Learn Python's core built-in types (numbers, strings, booleans), how to convert between them, and how to combine values with arithmetic and comparison operators.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Core Data Types: Numbers, Strings, and Booleans",
      goal: "Recognize and create Python's core built-in types: int, float, str, and bool.",
      videoTitle: "Python Data Types Explained (int, float, str, bool)",
      videoSearchQuery: "python data types int float string bool tutorial",
      videoLearningGoal: "See concrete examples of each core data type and how to check a value's type with type().",
      recommendedChannels: ["Corey Schafer", "Programming with Mosh"],
      keyTakeaways: [
        "int stores whole numbers, float stores decimal numbers, str stores text, bool stores True/False.",
        "You can check any value's type using the built-in type() function.",
        "Strings are written with either single or double quotes.",
      ],
      notes:
        "Every value in Python has a type. Whole numbers like 5 are int. Decimal numbers like 5.5 are float. Text wrapped in quotes like \"hello\" is str. True/False values are bool. Understanding a value's type tells you what operations make sense on it.",
      conceptExplanation:
        "You rarely need to declare a type explicitly in Python: it's inferred from the value you assign. age = 25 makes age an int; price = 9.99 makes price a float; is_active = True makes is_active a bool. Calling type(age) at any point tells you exactly what Python thinks the variable currently is, which is useful when debugging unexpected behavior.",
      whyItMatters: "Knowing a variable's type prevents confusing bugs later, like accidentally trying to do math on a string.",
      practicalTask:
        "Create one variable of each core type (int, float, str, bool) and print each variable together with its type using type(). For example: print(age, type(age)).",
      challenge: "Add a fifth variable that intentionally holds the string \"25\" instead of the number 25, print its type, and explain in a comment why it's different from an int.",
      expectedResult: "The program prints four values and their types, clearly showing int, float, str, and bool.",
      tests: ["Each of the 4 core types is represented by at least one variable", "type() is used for each variable"],
      hint: "type(some_variable) returns the type; wrap it in print() to see it.",
      lessonAssessment: [
        {
          question: "What is the type of the value 3.14 in Python?",
          options: ["int", "float", "str", "bool"],
          correctAnswerIndex: 1,
          explanation: "Numbers written with a decimal point are floats in Python.",
        },
        {
          question: "What does type(\"5\") return?",
          options: ["<class 'int'>", "<class 'str'>", "<class 'float'>", "<class 'bool'>"],
          correctAnswerIndex: 1,
          explanation: "Because \"5\" is wrapped in quotes, Python treats it as text (str), not a number.",
        },
      ],
      commonMistakes: ["Confusing \"5\" (a string) with 5 (an integer) because they look similar when printed.", "Forgetting that True/False must be capitalized in Python."],
      deliverables: ["A script demonstrating all 4 core types with type() checks"],
      assessmentCriteria: ["All 4 types are correctly represented", "type() output matches expectations"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 minutes",
      codeExample: {
        language: "python",
        code: 'age = 25\nprice = 9.99\nname = "Ada"\nis_student = True\nprint(age, type(age))\nprint(price, type(price))',
        explanation: "type() reveals the underlying type of each variable, printed alongside its value.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Converting Between Types",
      goal: "Convert values between int, float, and str using int(), float(), and str().",
      videoTitle: "Python Type Conversion (Casting) Tutorial",
      videoSearchQuery: "python type conversion casting int float str tutorial",
      videoLearningGoal: "See how int(), float(), and str() convert values and what happens when a conversion is invalid.",
      recommendedChannels: ["freeCodeCamp.org", "Corey Schafer"],
      keyTakeaways: [
        "int(\"5\") converts the string \"5\" into the integer 5.",
        "str(5) converts the integer 5 into the string \"5\".",
        "Converting a non-numeric string to a number (like int(\"hello\")) raises an error.",
      ],
      notes:
        "Type conversion (also called casting) lets you move a value from one type to another when it makes sense. This is especially important when combining numbers with text, since Python won't automatically convert them for you.",
      conceptExplanation:
        "You'll often get user input as a string even when it represents a number (input() always returns a str). To do math with it, you must convert it first: age = int(input(\"Age: \")). Going the other direction, str() turns any value into its text representation so it can be joined with other strings.",
      whyItMatters: "Type conversion is essential for handling user input, which always arrives as text.",
      practicalTask:
        "Create a string variable holding \"10\" and another holding \"5\". Convert both to integers, add them together, and print the result as a full sentence using str() to build the message.",
      challenge: "Try converting a non-numeric string like \"abc\" using int() inside your workspace notes, and record the exact error message you get.",
      expectedResult: "The program correctly adds the two converted numbers and prints a readable sentence with the result.",
      tests: ["Both string values are converted with int() before adding", "The final message is built using str() or an f-string"],
      hint: "int(\"10\") + int(\"5\") gives you the number 15, not the text \"105\".",
      lessonAssessment: [
        {
          question: "What does int(\"7\") + int(\"3\") evaluate to?",
          options: ["\"73\"", "10", "\"10\"", "73"],
          correctAnswerIndex: 1,
          explanation: "Both strings are converted to integers first, so 7 + 3 correctly evaluates to the number 10.",
        },
        {
          question: "What happens when you run int(\"hello\")?",
          options: ["It returns 0", "It returns the string unchanged", "It raises a ValueError", "It returns None"],
          correctAnswerIndex: 2,
          explanation: "int() can only convert strings that represent valid numbers; \"hello\" raises a ValueError.",
        },
      ],
      commonMistakes: ["Trying to add a string and an int directly, e.g. \"Age: \" + 25, which raises a TypeError.", "Forgetting that input() always returns a string, even for numeric input."],
      deliverables: ["A script converting and adding two numeric strings"],
      assessmentCriteria: ["Conversion functions used correctly", "Final output is a readable sentence"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 minutes",
      codeExample: {
        language: "python",
        code: 'a = "10"\nb = "5"\ntotal = int(a) + int(b)\nprint("The total is " + str(total))',
        explanation: "Both string values are converted to integers before adding, then the numeric result is converted back to a string to build the final message.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Arithmetic and Comparison Operators",
      goal: "Use arithmetic operators to calculate values and comparison operators to compare them.",
      videoTitle: "Python Operators: Arithmetic and Comparison",
      videoSearchQuery: "python arithmetic and comparison operators tutorial",
      videoLearningGoal: "See +, -, *, /, //, %, ** in action alongside ==, !=, <, >, <=, >=.",
      recommendedChannels: ["Programming with Mosh", "Traversy Media"],
      keyTakeaways: [
        "Arithmetic operators: + - * / (division) // (floor division) % (remainder) ** (power).",
        "Comparison operators return a bool: == != < > <= >=.",
        "== checks equality; a single = is assignment, not comparison.",
      ],
      notes:
        "Arithmetic operators work as you'd expect from math class, with two exceptions worth remembering: // discards any decimal remainder (floor division), and % returns just the remainder of a division. Comparison operators always produce a bool (True or False), which becomes essential in the next module on decision-making.",
      conceptExplanation:
        "17 // 5 evaluates to 3 (how many whole times 5 fits into 17), while 17 % 5 evaluates to 2 (what's left over). This pair is extremely useful: for example, % is the standard way to check if a number is even (n % 2 == 0). Comparison operators like 8 > 5 evaluate immediately to True or False; they don't change any variable, they just produce a bool value you can print, store, or use later.",
      whyItMatters: "The % operator and comparison operators are the foundation for the conditional logic you'll build in the next module.",
      practicalTask:
        "Create two number variables. Print the result of adding, subtracting, multiplying, dividing, floor-dividing, and taking the remainder of the two numbers, each on its own labeled line. Then print the result of comparing them with ==, <, and >.",
      challenge: "Use the % operator to check whether your first number is even or odd, and print a sentence stating which it is.",
      expectedResult: "The program prints six arithmetic results and three comparison results, each clearly labeled.",
      tests: ["All 6 arithmetic operators are demonstrated", "At least 3 comparison operators are demonstrated"],
      hint: "n % 2 gives 0 for even numbers and 1 for odd numbers.",
      lessonAssessment: [
        {
          question: "What does 17 // 5 evaluate to?",
          options: ["3.4", "3", "2", "5"],
          correctAnswerIndex: 1,
          explanation: "Floor division (//) discards the decimal part, so 17 divided by 5 becomes 3.",
        },
        {
          question: "What does the expression 5 == 5.0 evaluate to in Python?",
          options: ["True", "False", "An error", "\"5\""],
          correctAnswerIndex: 0,
          explanation: "Python compares values, not types, for equality here, and 5 and 5.0 represent the same numeric value, so == returns True.",
        },
      ],
      commonMistakes: ["Confusing = (assignment) with == (comparison), especially in conditions.", "Expecting / to floor-divide like // does."],
      deliverables: ["A script demonstrating all arithmetic and comparison operators"],
      assessmentCriteria: ["Correct use of each operator", "Output clearly labeled and accurate"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "python",
        code: 'a = 17\nb = 5\nprint(a // b)   # 3\nprint(a % b)    # 2\nprint(a > b)    # True',
        explanation: "// gives the whole-number result of division, % gives the remainder, and > returns a bool comparison result.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Data Types & Operators Assessment",
    questions: [
      { question: "What type does the value True have in Python?", options: ["int", "str", "bool", "NoneType"], correctAnswerIndex: 2, explanation: "True and False are the two values of the bool type." },
      { question: "What does str(42) return?", options: ["42", "\"42\"", "42.0", "An error"], correctAnswerIndex: 1, explanation: "str() converts the integer 42 into the text string \"42\"." },
      { question: "What does int(\"3.5\") do?", options: ["Returns 3", "Returns 3.5", "Raises a ValueError", "Returns \"3.5\""], correctAnswerIndex: 2, explanation: "int() cannot directly parse a decimal-formatted string; you'd need float(\"3.5\") first, then int() if truncation is wanted." },
      { question: "What is 10 % 3?", options: ["3", "1", "3.33", "0"], correctAnswerIndex: 1, explanation: "10 divided by 3 is 3 with a remainder of 1, and % returns that remainder." },
      { question: "What does 2 ** 3 evaluate to?", options: ["6", "8", "5", "9"], correctAnswerIndex: 1, explanation: "** is the exponentiation operator: 2 to the power of 3 is 8." },
      { question: "Which operator checks equality between two values?", options: ["=", "==", "!=", "=="], correctAnswerIndex: 1, explanation: "== checks whether two values are equal; a single = performs assignment instead." },
      { question: "What does 7 / 2 evaluate to in Python 3?", options: ["3", "3.5", "3.0", "An error"], correctAnswerIndex: 1, explanation: "The / operator always performs true (decimal) division in Python 3, giving 3.5." },
      { question: "What does 5 != 5 evaluate to?", options: ["True", "False", "5", "An error"], correctAnswerIndex: 1, explanation: "!= checks inequality; since 5 equals 5, the inequality check returns False." },
      { question: "Why does \"Age: \" + 25 raise a TypeError?", options: ["Because + cannot be used with strings", "Because Python cannot implicitly combine a str and an int with +", "Because 25 is not a valid number", "It does not raise an error"], correctAnswerIndex: 1, explanation: "Python requires explicit conversion (e.g. str(25)) before combining a number with a string using +." },
      { question: "Which expression correctly checks if a number n is even?", options: ["n % 2 == 0", "n // 2 == 0", "n / 2", "n == 2"], correctAnswerIndex: 0, explanation: "A number is even if dividing it by 2 leaves no remainder, which n % 2 == 0 checks directly." },
    ],
  },
  assignment:
    "Write a small 'unit price calculator' script: define variables for an item's total price and quantity (as strings, to simulate user input), convert them to numbers, calculate the price per unit using division, and print a clearly formatted result sentence.",
  assignmentDeliverables: ["A script that converts string inputs to numbers and performs a division calculation", "Clearly labeled printed output"],
  assignmentAssessmentCriteria: ["Correct use of type conversion", "Correct arithmetic result", "Readable output formatting"],
  miniProject:
    "Build a 'Number Facts' script: given a single number variable, print whether it is even or odd, its square, its cube, and how many times 7 divides into it evenly (using // and %), each on its own labeled line.",
  miniProjectDeliverables: ["number_facts.py in the Academy workspace", "Output showing all four facts clearly labeled"],
  miniProjectAssessmentCriteria: ["All four facts are calculated correctly", "Even/odd check uses the % operator"],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
