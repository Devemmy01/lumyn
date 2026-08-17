import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module7: GeneratedModule = {
  title: "Testing & Code Quality",
  description:
    "Learn to verify your own code with assert statements and the unittest module, document functions clearly with docstrings, and make function signatures self-documenting with type hints.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Writing Simple Tests with assert and Docstrings",
      goal: "Use assert to verify a function behaves correctly, and write clear docstrings that document what a function does.",
      videoTitle: "Python assert Statement and Docstrings Tutorial",
      videoSearchQuery: "python assert statement docstrings tutorial for beginners",
      videoLearningGoal: "See assert statements check a function's output against expected values, and docstrings written directly under a function definition.",
      recommendedChannels: ["Corey Schafer", "freeCodeCamp.org"],
      keyTakeaways: [
        "assert condition, \"message\" raises an AssertionError with that message if the condition is False, and does nothing if it's True.",
        "assert statements are a simple way to check that a function's actual result matches its expected result.",
        "A docstring is a string literal placed immediately under a def line, describing what the function does.",
      ],
      notes:
        "Before reaching for a full testing framework, assert is the simplest tool for checking that your code does what you think it does. assert add(2, 3) == 5 does nothing if the condition is True, but raises an AssertionError immediately if it's False, pinpointing exactly which expectation failed. A docstring, written as a string right under the def line, documents what a function does for anyone reading the code, including future you.",
      conceptExplanation:
        "def add(a, b): \"\"\"Return the sum of a and b.\"\"\"; return a + b attaches a docstring that explains the function's purpose in one line, accessible later through add.__doc__ or help(add). Writing a batch of assert statements right after defining a function, like assert add(2, 3) == 5 and assert add(-1, 1) == 0, is a lightweight but genuinely useful way to catch bugs immediately after writing new code, before moving on to the next piece.",
      whyItMatters: "assert statements and docstrings are the foundation of testing and documentation habits that scale up naturally into the more structured unittest approach in the next lesson.",
      practicalTask:
        "In the Academy workspace, main.py is already open for you. Write a function called is_palindrome(text) with a one-line docstring explaining what it does, that returns True if text reads the same forwards and backwards, and False otherwise. Add at least 4 assert statements testing it against different inputs, including at least one that should return True and one that should return False.",
      challenge: "Update is_palindrome() to ignore case differences (so \"Racecar\" is still recognized as a palindrome), and add an assert statement specifically testing that case-insensitive behavior.",
      expectedResult: "The script runs with no output and no errors, meaning every assert statement passed; if you temporarily break the function, at least one assert should raise an AssertionError.",
      tests: ["is_palindrome() includes a docstring describing its purpose", "At least 4 assert statements test the function against different inputs, covering both True and False cases"],
      hint: "Reversing a string in Python is often done with slicing: text[::-1].",
      lessonAssessment: [
        {
          question: "What happens when assert 2 + 2 == 5 runs?",
          options: ["Nothing, since the condition is False", "It raises an AssertionError, since the condition is False", "It prints False and continues", "It fixes the calculation automatically"],
          correctAnswerIndex: 1,
          explanation: "assert raises an AssertionError whenever its condition evaluates to False; a True condition causes no visible effect at all.",
        },
        {
          question: "Where is a docstring placed relative to a function definition?",
          options: [
            "Anywhere in the file",
            "As a string literal immediately under the def line",
            "Only as a comment above the def line",
            "At the very end of the file",
          ],
          correctAnswerIndex: 1,
          explanation: "A docstring is the first statement inside a function's body, written as a string literal directly under the def line.",
        },
      ],
      commonMistakes: ["Writing assert statements that only test the happy path, never checking an input that should return False or fail.", "Forgetting the docstring is a real string (with quotes), not just a regular comment starting with #."],
      deliverables: ["A script with a documented function and at least 4 assert statements testing it"],
      assessmentCriteria: ["Docstring clearly explains the function's purpose", "assert statements correctly cover both expected outcomes (True and False cases)"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'def is_palindrome(text):\n    """Return True if text reads the same forwards and backwards."""\n    cleaned = text.lower()\n    return cleaned == cleaned[::-1]\n\nassert is_palindrome("racecar") is True\nassert is_palindrome("Racecar") is True\nassert is_palindrome("python") is False\nassert is_palindrome("level") is True\nprint("All assertions passed.")',
        explanation: "Each assert checks one expected outcome; since every condition is True, the script runs silently until the final print confirms all checks passed.",
      },
      completionStatus: "not_started",
    },
    {
      title: "The unittest Module: TestCase and Test Methods",
      goal: "Write a proper test file using the unittest module's TestCase class and run it from the command line.",
      videoTitle: "Python unittest Module Tutorial for Beginners",
      videoSearchQuery: "python unittest module tutorial testcase for beginners",
      videoLearningGoal: "See a TestCase class with several test methods and assertEqual calls, run using python -m unittest.",
      recommendedChannels: ["Programming with Mosh", "Tech With Tim"],
      keyTakeaways: [
        "unittest.TestCase is a base class you subclass to group related tests together.",
        "Each method inside a TestCase subclass whose name starts with test_ is automatically discovered and run as a test.",
        "self.assertEqual(actual, expected) is the unittest equivalent of assert actual == expected, with a clearer failure report.",
      ],
      notes:
        "unittest is Python's built-in testing framework, more structured than scattered assert statements. You define a class that inherits from unittest.TestCase, and write one method per test case, each named starting with test_ so the framework automatically finds and runs it. Running python -m unittest your_file.py in the terminal executes every discovered test and reports pass/fail results.",
      conceptExplanation:
        "class TestMathHelpers(unittest.TestCase): def test_add(self): self.assertEqual(add(2, 3), 5) defines one test method. unittest.TestCase provides several assert-style methods: assertEqual(a, b) checks equality, assertTrue(x) checks that x is truthy, assertRaises(ExceptionType) checks that a specific exception is raised. Adding if __name__ == \"__main__\": unittest.main() at the bottom of the file lets you run the tests directly, and running python -m unittest from the terminal is the standard way to execute a whole test file and see a clear pass or fail summary.",
      whyItMatters: "unittest is the standard, professional way to organize and run tests in Python, and its clear pass/fail reporting scales far better than a growing pile of unlabeled assert statements.",
      practicalTask:
        "Write a function multiply(a, b) that returns a times b. Below it, import unittest and define a TestCase subclass with at least 3 test methods, each starting with test_, using self.assertEqual() to check multiply() against different input pairs, including at least one negative number case. Add the if __name__ == \"__main__\": unittest.main() block at the bottom, and run the file with python -m unittest to see the results in the terminal's evidence output.",
      challenge: "Add a test method that uses self.assertRaises(TypeError) to confirm that calling multiply(\"a\", 2) raises a TypeError, since Python cannot multiply an incompatible string and int in that way.",
      expectedResult: "Running python -m unittest reports that all defined tests passed (typically shown as OK with a count of tests run).",
      tests: ["A TestCase subclass is defined with at least 3 methods starting with test_", "At least one test uses self.assertEqual() correctly to verify multiply()'s result"],
      hint: "Test method names must start with test_ exactly, or unittest will not discover and run them automatically.",
      lessonAssessment: [
        {
          question: "What must a class inherit from to be recognized as a unittest test case?",
          options: ["object", "unittest.TestCase", "Exception", "dict"],
          correctAnswerIndex: 1,
          explanation: "Subclassing unittest.TestCase gives your class access to assertion methods and makes it discoverable by the unittest runner.",
        },
        {
          question: "What naming convention must a method follow to be automatically run as a test?",
          options: ["It must start with check_", "It must start with test_", "It must end with _test", "Any name works"],
          correctAnswerIndex: 1,
          explanation: "unittest automatically discovers and runs any method whose name starts with test_ inside a TestCase subclass.",
        },
      ],
      commonMistakes: ["Naming a test method something other than test_..., which causes unittest to silently skip it.", "Using plain assert inside a TestCase method instead of self.assertEqual(), which still works but loses unittest's clearer failure reporting."],
      deliverables: ["A test file with a TestCase subclass containing at least 3 test_ methods"],
      assessmentCriteria: ["Test methods are correctly named and use self.assertEqual() or another TestCase assertion method", "Running the file with python -m unittest reports all tests passing"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'import unittest\n\ndef multiply(a, b):\n    return a * b\n\nclass TestMultiply(unittest.TestCase):\n    def test_positive_numbers(self):\n        self.assertEqual(multiply(3, 4), 12)\n\n    def test_negative_number(self):\n        self.assertEqual(multiply(-2, 5), -10)\n\n    def test_zero(self):\n        self.assertEqual(multiply(0, 9), 0)\n\nif __name__ == "__main__":\n    unittest.main()',
        explanation: "Each test_ method checks multiply() against a different scenario; running python -m unittest discovers and runs all three automatically.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Type Hints: Writing Self-Documenting Function Signatures",
      goal: "Add type hints to function parameters and return values to make code clearer and easier to reason about.",
      videoTitle: "Python Type Hints Tutorial for Beginners",
      videoSearchQuery: "python type hints tutorial function annotations for beginners",
      videoLearningGoal: "See type hints added to function parameters and return types, and understand that Python does not enforce them at runtime.",
      recommendedChannels: ["freeCodeCamp.org", "Corey Schafer"],
      keyTakeaways: [
        "Type hints, like def greet(name: str) -> str:, document the expected parameter and return types directly in the function signature.",
        "Python does not enforce type hints at runtime; they are for readability and external tooling, not automatic validation.",
        "Common hint types include str, int, float, bool, list[str], dict[str, int], and Optional types for values that might be None.",
      ],
      notes:
        "Type hints let you write def calculate_total(prices: list[float]) -> float: instead of just def calculate_total(prices):, making the expected input and output obvious without reading the whole function body. They are optional and Python will not stop you from calling the function incorrectly, but they make code dramatically easier to understand and let editors catch likely mistakes before you even run the code.",
      conceptExplanation:
        "def add(a: int, b: int) -> int: return a + b documents that add expects two integers and returns an integer, all directly in the signature. Collection types can be hinted too: def get_names(users: list[dict]) -> list[str]: describes a function taking a list of dictionaries and returning a list of strings. Because Python does not check these hints while running, calling add(\"2\", \"3\") would not raise an error from the hint itself, it would just concatenate the strings; type hints are a documentation and tooling aid, not a runtime guarantee, which is an important distinction from statically typed languages.",
      whyItMatters: "Type hints make function signatures self-documenting, which becomes increasingly valuable as programs and teams grow, since anyone reading a hinted function immediately understands what it expects and returns without digging through its implementation.",
      practicalTask:
        "Take your multiply(a, b) function from the previous lesson (or write a similar one) and rewrite its signature with type hints: def multiply(a: int, b: int) -> int:. Write two more small functions with type hints of your own: one that takes a list[str] and returns the number of items as an int, and one that takes a str and returns a bool. Call all three and print their results.",
      challenge: "Write a docstring for each of your three hinted functions, combining what you learned about docstrings with type hints in the same function.",
      expectedResult: "The program runs correctly and prints the results of all three type-hinted functions, with signatures clearly showing expected parameter and return types.",
      tests: ["At least 3 functions use type hints on their parameters and return type", "All hinted functions run correctly and produce the expected results"],
      hint: "The arrow -> before the colon in a function definition specifies the return type: def f(x: int) -> str:.",
      lessonAssessment: [
        {
          question: "What does def greet(name: str) -> str: tell you about the function?",
          options: [
            "It will crash if name is not a string",
            "It documents that name is expected to be a str and the function returns a str, without enforcing it at runtime",
            "It converts any input into a string automatically",
            "It requires exactly one argument named str",
          ],
          correctAnswerIndex: 1,
          explanation: "Type hints document expected types for readability and tooling; Python itself does not check or enforce them while running the code.",
        },
        {
          question: "Does Python raise an error at runtime if you call a type-hinted function with the wrong type?",
          options: [
            "Yes, always",
            "No, type hints are not enforced at runtime by Python itself",
            "Only for int and str hints",
            "Only inside a class",
          ],
          correctAnswerIndex: 1,
          explanation: "Type hints are purely documentation and tooling aids in standard Python; they do not cause runtime errors on their own if violated.",
        },
      ],
      commonMistakes: ["Assuming type hints will stop incorrect calls at runtime, when they are only documentation unless checked by external tooling.", "Leaving off the -> return type hint while still hinting the parameters, making the signature only half self-documenting."],
      deliverables: ["A script with at least 3 functions using parameter and return type hints"],
      assessmentCriteria: ["Type hints are correctly placed on both parameters and return types", "Hinted functions run correctly and produce expected output"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'def multiply(a: int, b: int) -> int:\n    """Return the product of a and b."""\n    return a * b\n\ndef count_items(items: list[str]) -> int:\n    """Return how many items are in the list."""\n    return len(items)\n\ndef is_valid_username(name: str) -> bool:\n    """Return True if name is non-empty and has no spaces."""\n    return len(name) > 0 and " " not in name\n\nprint(multiply(6, 7))\nprint(count_items(["a", "b", "c"]))\nprint(is_valid_username("ada_dev"))',
        explanation: "Each function's signature documents its expected parameter and return types directly, making the code self-explanatory without needing to read every line of the body.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Testing & Code Quality Assessment",
    questions: [
      { question: "What happens when assert 2 + 2 == 5 runs?", options: ["Nothing", "It raises an AssertionError", "It prints True", "It fixes the math automatically"], correctAnswerIndex: 1, explanation: "assert raises an AssertionError whenever its condition is False." },
      { question: "Where does a docstring go relative to a function's def line?", options: ["Above it, as a comment", "As the first statement inside the function body", "At the end of the file", "Docstrings are not related to functions"], correctAnswerIndex: 1, explanation: "A docstring is a string literal placed as the very first statement inside a function's body." },
      { question: "What must a class inherit from to become a unittest test case?", options: ["object", "unittest.TestCase", "Exception", "dict"], correctAnswerIndex: 1, explanation: "Subclassing unittest.TestCase provides the assertion methods and test discovery behavior needed for a test class." },
      { question: "What naming rule must a test method follow to be automatically discovered by unittest?", options: ["It must start with check_", "It must start with test_", "It can have any name", "It must be named main"], correctAnswerIndex: 1, explanation: "unittest automatically runs any method inside a TestCase subclass whose name begins with test_." },
      { question: "What does self.assertEqual(actual, expected) do inside a unittest test method?", options: [
          "Prints both values without comparing them",
          "Checks that actual equals expected, and reports a clear failure if they don't match",
          "Converts actual into expected automatically",
          "Deletes the test if it fails",
        ], correctAnswerIndex: 1, explanation: "assertEqual compares the two values and produces a clear, labeled failure message if they differ." },
      { question: "How do you run all the tests in a file called test_math.py from the terminal?", options: ["python test_math.py --run", "python -m unittest test_math.py", "unittest test_math.py", "run test_math.py"], correctAnswerIndex: 1, explanation: "python -m unittest is the standard command for discovering and running tests in a file using the unittest module." },
      { question: "What does def add(a: int, b: int) -> int: tell a reader about the function?", options: [
          "It will crash if given non-integer arguments",
          "It documents that a and b are expected to be ints and the function returns an int",
          "It requires exactly the argument names a and b",
          "It automatically converts inputs to integers",
        ], correctAnswerIndex: 1, explanation: "Type hints describe expected parameter and return types for readability, without changing runtime behavior on their own." },
      { question: "Does Python enforce type hints at runtime by itself?", options: ["Yes, always", "No, they are documentation and tooling aids only", "Only for built-in types", "Only inside classes"], correctAnswerIndex: 1, explanation: "Standard Python does not check type hints while running code; they exist for readability and for external tools like editors and type checkers." },
      { question: "What is the main advantage of unittest over scattered assert statements?", options: [
          "unittest runs code faster",
          "unittest organizes tests into discoverable, clearly reported test cases with structured assertion methods",
          "assert cannot be used inside functions",
          "There is no real advantage",
        ], correctAnswerIndex: 1, explanation: "unittest provides structure, automatic test discovery, and clear pass/fail reporting that a loose collection of assert statements does not." },
      { question: "Why are docstrings and type hints both considered good code quality practices?", options: [
          "They make code run faster",
          "They make a function's purpose and expected inputs and outputs clear to any reader without needing to trace through the implementation",
          "They are required by the Python interpreter to run the file",
          "They replace the need for testing entirely",
        ], correctAnswerIndex: 1, explanation: "Both docstrings and type hints improve readability by documenting intent and expectations directly at the point where a function is defined." },
    ],
  },
  assignment:
    "Build a 'Tested Utilities' module: write 3 small, type-hinted functions of your choice (for example, a temperature converter, a string reverser, and a list averager), each with a docstring. Below them, write a unittest.TestCase subclass with at least 2 test methods per function (6 or more total), using self.assertEqual() to verify correct behavior, including at least one edge case per function (like an empty list or a zero value). Add the if __name__ == \"__main__\": unittest.main() block and confirm all tests pass when run with python -m unittest.",
  assignmentDeliverables: [
    "A script with 3 type-hinted, documented functions",
    "A TestCase subclass with at least 6 test methods covering normal and edge cases",
    "Confirmation (from running python -m unittest) that every test passes",
  ],
  assignmentAssessmentCriteria: [
    "All 3 functions use type hints and include a docstring",
    "Each function has at least 2 test methods, including one edge case",
    "All tests pass when run with python -m unittest",
  ],
  miniProject:
    "Build a 'Validated Calculator Library': write type-hinted functions add(a: float, b: float) -> float, subtract(a: float, b: float) -> float, and safe_divide(a: float, b: float) -> float, where safe_divide raises a custom exception DivisionByZeroInCalculatorError (inheriting from Exception) instead of letting a raw ZeroDivisionError escape. Each function needs a docstring. Write a unittest.TestCase with test methods covering normal cases for all three functions, plus a test using self.assertRaises(DivisionByZeroInCalculatorError) to confirm safe_divide(5, 0) raises the custom exception correctly.",
  miniProjectDeliverables: [
    "calculator_library.py in the Academy workspace with 3 type-hinted, documented functions and a custom exception",
    "A TestCase subclass with tests for normal behavior and the custom exception case",
    "Confirmation that all tests pass when run with python -m unittest",
  ],
  miniProjectAssessmentCriteria: [
    "All functions use correct type hints and docstrings",
    "safe_divide() correctly raises the custom exception instead of a raw ZeroDivisionError",
    "self.assertRaises() correctly verifies the custom exception is raised",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
