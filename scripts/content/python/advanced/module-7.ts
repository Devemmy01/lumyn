import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module7: GeneratedModule = {
  title: "Writing Production-Quality Python",
  description:
    "Pick up the habits that separate a working script from production-quality Python: sensible project structure, performance measurement, PEP 8 style, expressive type hints, and defensive coding.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Project Structure and if __name__ == \"__main__\":",
      goal: "Understand the if __name__ == \"__main__\": idiom and organize a script so it can be safely imported or run directly.",
      videoTitle: "Python if __name__ == '__main__' Explained",
      videoSearchQuery: "python if name main idiom explained tutorial",
      videoLearningGoal: "See how a script's top-level code runs differently when imported versus run directly, and how the __main__ guard controls that.",
      recommendedChannels: ["Corey Schafer", "ArjanCodes"],
      keyTakeaways: [
        "Every Python module has a __name__ variable; it's '__main__' when the file is run directly, and the module's own name when it's imported.",
        "Wrapping a script's entry-point logic in if __name__ == \"__main__\": prevents that code from running automatically when the file is imported elsewhere.",
        "This idiom lets a single file be both a reusable module of functions and classes, and a runnable script.",
      ],
      notes:
        "When Python runs a file directly, it sets that file's built-in __name__ variable to the string '__main__'. When the same file is instead imported by another file, __name__ is set to the module's actual name instead. Checking if __name__ == \"__main__\": lets you write code that only runs when the file is executed directly, not when it's imported for its functions and classes.",
      conceptExplanation:
        "Placing your script's main logic, the calls that actually do something, like main(), inside if __name__ == \"__main__\": main() means another file can safely import functions and classes from your module without accidentally triggering that logic. This is standard practice in any Python file with more than a handful of lines: define your reusable pieces, functions and classes, at the top level, then guard the code that actually runs them behind the __name__ check at the bottom.",
      whyItMatters: "This idiom is in nearly every well-structured Python file you'll encounter professionally; skipping it means your reusable code accidentally runs side effects the moment someone else imports it.",
      practicalTask:
        "In the Academy workspace, main.py is already open for you. Organize the file so all your logic lives inside functions: define at least two functions, one that does some calculation, and a main() function that calls it and prints a result. Only call main() inside an if __name__ == \"__main__\": block at the bottom of the file. Print __name__ itself right before the check to confirm it shows '__main__' when the file runs directly.",
      challenge: "Add a docstring at the very top of the file, before any code, describing what the script does, and explain in a comment why a docstring at the top of a module is useful even though it isn't required.",
      expectedResult: "Running the file prints the value of __name__, showing '__main__', followed by the result of main()'s logic.",
      tests: [
        "All logic is organized into functions rather than loose top-level statements",
        "main() is only called inside an if __name__ == \"__main__\": guard",
      ],
      hint: "__name__ is a built-in variable available in every Python file automatically; you don't need to define or import it.",
      lessonAssessment: [
        {
          question: "What is the value of __name__ when a Python file is run directly, not imported?",
          options: ["The file's own filename without the extension", "The string '__main__'", "None", "'run'"],
          correctAnswerIndex: 1,
          explanation: "Python sets __name__ to '__main__' specifically for the file that was executed directly.",
        },
        {
          question: "Why is it good practice to put a script's entry-point logic inside if __name__ == \"__main__\": ?",
          options: ["It makes the code run faster", "It prevents that logic from running automatically if the file is imported elsewhere as a module", "It is required for the file to be valid Python", "It hides the code from anyone reading the file"],
          correctAnswerIndex: 1,
          explanation: "The guard ensures the script's side-effecting logic only runs when the file itself is executed, not when it's imported.",
        },
      ],
      commonMistakes: [
        "Writing calculation and side-effect code directly at the top level of a file with no functions, making it impossible to reuse or import safely.",
        "Forgetting the __main__ guard, so importing the file elsewhere unexpectedly runs its script logic immediately.",
      ],
      deliverables: ["main.py organized into functions with a properly guarded if __name__ == \"__main__\": entry point"],
      assessmentCriteria: ["Logic is organized into reusable functions rather than loose top-level statements", "Entry-point logic runs only inside the __main__ guard"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'def calculate_total(prices):\n    return sum(prices)\n\ndef main():\n    prices = [19.99, 5.50, 12.00]\n    total = calculate_total(prices)\n    print(f"Total: {total}")\n\nif __name__ == "__main__":\n    print(__name__)\n    main()',
        explanation: "main() only runs when this file is executed directly; another file could import calculate_total() without triggering main().",
      },
      completionStatus: "not_started",
    },
    {
      title: "Measuring Performance and Writing Readable, PEP 8 Code",
      goal: "Use the time module to measure how long code takes, and apply PEP 8 conventions for readable code.",
      videoTitle: "Python Performance Measurement and PEP 8 Style Guide",
      videoSearchQuery: "python time module performance measurement pep8 style tutorial",
      videoLearningGoal: "See time.perf_counter() used to benchmark two different implementations of the same task, and PEP 8 conventions applied to messy code.",
      recommendedChannels: ["Corey Schafer", "ArjanCodes"],
      keyTakeaways: [
        "time.perf_counter() gives a high-resolution timestamp ideal for measuring how long a block of code takes, more reliable for benchmarking than time.time().",
        "PEP 8 is Python's official style guide: snake_case for functions and variables, PascalCase for classes, 4-space indentation, and reasonable line lengths.",
        "Readable code follows consistent naming and spacing conventions so anyone, including future you, can understand it quickly.",
      ],
      notes:
        "Measuring performance and following consistent style aren't just cosmetic concerns: they're what separates code you can trust and maintain from code that's a liability months later. time.perf_counter() is the standard tool for timing; PEP 8 is the standard style guide nearly every Python codebase follows.",
      conceptExplanation:
        "start = time.perf_counter(); do_the_work(); elapsed = time.perf_counter() - start gives you a precise duration in seconds, useful for comparing two different implementations of the same logic to see which is actually faster. PEP 8 conventions you've likely already been following include snake_case names, 4-space indentation, and two blank lines between top-level function or class definitions; PascalCase, like TaskManager, is reserved specifically for class names, distinguishing them visually from functions and variables at a glance.",
      whyItMatters: "Consistent style removes a whole category of unnecessary friction when reading or reviewing code, and knowing how to measure performance means you can back up claims like 'this is faster' with actual numbers instead of guesses.",
      practicalTask:
        "Write two different implementations of the same task, for example summing the squares of numbers 1 to 200000 using a plain for loop versus using a generator expression passed to sum(). Time each implementation with time.perf_counter(), print both durations clearly labeled, and print which one was faster. Make sure all your function and variable names follow PEP 8's snake_case convention.",
      challenge: "Take a deliberately messy snippet you write yourself with inconsistent naming, like mixing camelCase and snake_case, and rewrite it to follow PEP 8 consistently, keeping both versions in comments so the before and after is visible.",
      expectedResult: "Both implementations produce the identical numeric result, and their timings are printed clearly, showing which approach was faster on this run.",
      tests: [
        "time.perf_counter() is used to measure both implementations",
        "All variable and function names in the final code follow snake_case consistently",
      ],
      hint: "Run the timing block a few times in your head or notes; small workloads can have noisy timings, so the general pattern of which one tends to be faster matters more than one single run.",
      lessonAssessment: [
        {
          question: "Why is time.perf_counter() generally preferred over time.time() for benchmarking short code blocks?",
          options: ["It measures in different units", "It provides a higher-resolution, more precise timestamp suited for measuring short durations", "It is the only timing function available in Python", "It automatically prints the result"],
          correctAnswerIndex: 1,
          explanation: "time.perf_counter() offers higher resolution than time.time(), making it better suited to timing short-running code.",
        },
        {
          question: "According to PEP 8, what naming convention is used for class names, as opposed to functions and variables?",
          options: ["snake_case, same as everything else", "PascalCase (also called CapWords), like TaskManager", "ALL_CAPS", "camelCase"],
          correctAnswerIndex: 1,
          explanation: "PEP 8 specifies PascalCase for class names, distinguishing them from the snake_case used for functions and variables.",
        },
      ],
      commonMistakes: [
        "Using time.time() and treating tiny differences as meaningful, when its resolution is lower and less suited to short benchmarks than time.perf_counter().",
        "Mixing naming conventions, such as snake_case and camelCase, within the same file, which PEP 8 discourages for consistency.",
      ],
      deliverables: ["main.py comparing two timed implementations of the same task, written with consistent PEP 8 naming"],
      assessmentCriteria: ["Both implementations are correctly timed and compared", "Code follows PEP 8 naming conventions consistently"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'import time\n\ndef sum_of_squares_loop(limit):\n    total = 0\n    for number in range(1, limit):\n        total += number * number\n    return total\n\ndef sum_of_squares_generator(limit):\n    return sum(number * number for number in range(1, limit))\n\nstart = time.perf_counter()\nsum_of_squares_loop(200000)\nloop_time = time.perf_counter() - start\n\nstart = time.perf_counter()\nsum_of_squares_generator(200000)\ngenerator_time = time.perf_counter() - start\n\nprint(f"Loop: {loop_time:.4f}s")\nprint(f"Generator: {generator_time:.4f}s")',
        explanation: "Both functions compute the identical result; timing each with time.perf_counter() shows which approach was actually faster on this run, rather than guessing.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Type Hints with Generics and Optional, and Defensive Coding",
      goal: "Write more expressive type hints using generics and Optional, and apply defensive coding practices like input validation and fail-fast checks.",
      videoTitle: "Python Type Hints: Generics, Optional, and Defensive Coding",
      videoSearchQuery: "python type hints generics optional defensive programming tutorial",
      videoLearningGoal: "See list[int], dict[str, int], and Optional[str] type hints applied to a function, alongside input validation that fails fast with a clear error.",
      recommendedChannels: ["ArjanCodes", "Tech With Tim"],
      keyTakeaways: [
        "Generic type hints like list[int] or dict[str, float] describe not just the container type but what it contains.",
        "Optional[str], equivalent to str | None, documents that a value might legitimately be None, prompting callers to handle that case.",
        "Defensive coding means validating inputs early and raising a clear error immediately, rather than letting bad data silently cause confusing failures later.",
      ],
      notes:
        "Basic type hints like def add(a: int, b: int) -> int: only tell you the top-level type. Generic hints go further: list[int] says 'a list specifically containing integers,' and Optional[str] says 'a string, or possibly None,' both of which are common and important details that plain type hints miss.",
      conceptExplanation:
        "def find_task(tasks: list[dict], title: str) -> Optional[dict]: describes a function that takes a list of dictionaries and a string, and returns either a dictionary or None if nothing matched, which strongly signals to anyone calling it that they need to check for None before using the result. Defensive coding pairs naturally with this: def set_priority(priority: int) -> int: if not isinstance(priority, int) or priority < 1: raise ValueError(f'priority must be a positive integer, got {priority!r}') fails immediately with a clear message rather than letting bad data quietly propagate and cause a confusing error somewhere else entirely later in the program.",
      whyItMatters: "Precise type hints make functions self-documenting for anyone reading or calling them, and failing fast on bad input turns mysterious downstream bugs into clear, immediate, easy-to-fix errors.",
      practicalTask:
        "Write a function find_task(tasks, title) with a full type hint signature using list[dict] and Optional[dict] (or dict | None) for the parameters and return type, that searches a list of task dictionaries for one matching the given title and returns it, or returns None if nothing matches. Then write a second function set_priority(priority) that validates its input is an integer between 1 and 5 inclusive, raising a ValueError with a clear message immediately if not, and returning the validated value if it passes. Demonstrate both functions with at least one valid case and one case that correctly triggers the ValueError, caught with try/except.",
      challenge: "Add type hints to a function with a dict[str, list[int]] parameter, a dictionary mapping strings to lists of integers, and demonstrate calling it correctly, explaining in a comment what the hint communicates.",
      expectedResult: "find_task() correctly returns a matching dictionary or None, and set_priority() correctly validates its input, raising and catching a clear ValueError for invalid values.",
      tests: [
        "find_task() uses generic type hints (list[dict] and Optional[dict] or equivalent) in its signature",
        "set_priority() validates its input and raises a ValueError immediately for invalid values, demonstrated with try/except",
      ],
      hint: "You can write Optional[dict] after from typing import Optional, or use the newer dict | None syntax directly without an import, depending on your Python version.",
      lessonAssessment: [
        {
          question: "What does the type hint list[dict] communicate that plain list does not?",
          options: ["Nothing extra; they're identical", "That the list specifically contains dictionaries, not just any items", "That the list must be empty", "That the list is read-only"],
          correctAnswerIndex: 1,
          explanation: "A generic hint like list[dict] documents what the list actually contains, not just that it's a list.",
        },
        {
          question: "What is the core idea behind 'failing fast' in defensive coding?",
          options: ["Making the whole program run faster", "Validating inputs early and raising a clear error immediately, instead of letting bad data cause confusing failures later", "Catching every possible exception with a bare except", "Avoiding all error handling entirely"],
          correctAnswerIndex: 1,
          explanation: "Failing fast means rejecting bad input as early as possible with a clear error, rather than letting it silently propagate.",
        },
      ],
      commonMistakes: [
        "Using a plain list or dict type hint when a generic hint like list[int] or dict[str, float] would communicate much more useful information to readers and tools.",
        "Validating input deep inside a program instead of at the point it first enters a function, making it harder to trace where invalid data actually came from.",
      ],
      deliverables: ["main.py with find_task() using generic type hints and set_priority() using fail-fast input validation"],
      assessmentCriteria: [
        "Type hints correctly use generics and Optional (or equivalent) to describe the data precisely",
        "Invalid input is rejected immediately with a clear, caught ValueError",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'from typing import Optional\n\ndef find_task(tasks: list[dict], title: str) -> Optional[dict]:\n    for task in tasks:\n        if task["title"] == title:\n            return task\n    return None\n\ndef set_priority(priority: int) -> int:\n    if not isinstance(priority, int) or priority < 1 or priority > 5:\n        raise ValueError(f"priority must be an integer from 1 to 5, got {priority!r}")\n    return priority\n\ntasks = [{"title": "Fix bug", "priority": 1}]\nprint(find_task(tasks, "Fix bug"))\nprint(find_task(tasks, "Missing"))\nprint(set_priority(3))',
        explanation: "The Optional[dict] return type documents that find_task() might return None, and set_priority() fails immediately with a clear message instead of accepting bad data silently.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Writing Production-Quality Python Assessment",
    questions: [
      {
        question: "What is the value of __name__ when a Python file is run directly?",
        options: ["The filename without extension", "The string '__main__'", "None", "'run'"],
        correctAnswerIndex: 1,
        explanation: "Python sets __name__ to '__main__' for the file that is executed directly.",
      },
      {
        question: "Why is it good practice to guard entry-point logic with if __name__ == \"__main__\": ?",
        options: ["It makes code run faster", "It prevents that logic from running automatically if the file is imported elsewhere as a module", "It is required for the file to be valid Python", "It hides the code from readers"],
        correctAnswerIndex: 1,
        explanation: "The guard keeps a script's side-effecting logic from running automatically when the file is imported rather than executed.",
      },
      {
        question: "Why is time.perf_counter() generally preferred over time.time() for benchmarking short code blocks?",
        options: ["It uses different units entirely", "It provides a higher-resolution timestamp better suited to measuring short durations", "It is the only timing function in Python", "It prints automatically"],
        correctAnswerIndex: 1,
        explanation: "time.perf_counter() offers finer resolution, making it more reliable for short-duration benchmarks.",
      },
      {
        question: "According to PEP 8, what naming convention is used for class names?",
        options: ["snake_case", "PascalCase (CapWords), like TaskManager", "ALL_CAPS", "camelCase"],
        correctAnswerIndex: 1,
        explanation: "PEP 8 recommends PascalCase specifically for class names.",
      },
      {
        question: "What does the type hint list[dict] communicate that plain list does not?",
        options: ["Nothing extra", "That the list specifically contains dictionaries", "That the list must be empty", "That the list is read-only"],
        correctAnswerIndex: 1,
        explanation: "Generic hints like list[dict] specify the contents of the container, not just its outer type.",
      },
      {
        question: "What does Optional[str] (or str | None) communicate about a value?",
        options: ["That it is always a string", "That it might legitimately be a string or None, and callers should handle both", "That it must never be None", "That it is a list of strings"],
        correctAnswerIndex: 1,
        explanation: "Optional[str] documents that the value can be either a string or None, prompting the caller to handle both cases.",
      },
      {
        question: "What is the core idea behind 'failing fast' in defensive coding?",
        options: ["Making the program run faster overall", "Validating inputs early and raising a clear error immediately instead of letting bad data cause confusing failures later", "Catching every exception with a bare except", "Skipping all input validation"],
        correctAnswerIndex: 1,
        explanation: "Failing fast means catching invalid input at the boundary and raising a clear error right away.",
      },
      {
        question: "Why is organizing code into functions, rather than loose top-level statements, considered good practice for production-quality scripts?",
        options: ["Functions are required by Python syntax", "It makes code reusable, testable, and safe to import without unwanted side effects", "It prevents any errors from occurring", "It removes the need for comments"],
        correctAnswerIndex: 1,
        explanation: "Functions organize logic into reusable, testable units and, combined with the __main__ guard, make a file safe to import.",
      },
      {
        question: "What is a defensive coding practice for a function that receives a priority value expected to be between 1 and 5?",
        options: ["Silently clamp any invalid value without telling the caller", "Validate the value and raise a clear ValueError immediately if it's out of range", "Ignore invalid values and continue anyway", "Only check the value in a separate part of the program much later"],
        correctAnswerIndex: 1,
        explanation: "Raising a clear error immediately when a value is out of range is the fail-fast approach defensive coding recommends.",
      },
      {
        question: "Which combination of practices best describes 'production-quality' Python, as covered in this module?",
        options: [
          "Clever one-liners with no comments",
          "Clear structure with functions, a __main__ guard, precise type hints, consistent PEP 8 style, and fail-fast validation",
          "The shortest possible code regardless of readability",
          "Avoiding all use of the standard library",
        ],
        correctAnswerIndex: 1,
        explanation: "Production-quality Python combines clear structure, expressive typing, consistent style, and defensive input handling.",
      },
    ],
  },
  assignment:
    "Build a 'Validated Config Loader': write a function load_config(data: dict) -> dict with a type hint signature, that checks a fixed set of required keys are present in a dictionary you construct directly in code, simulating a loaded configuration, raising a clear ValueError immediately if any required key is missing, and returning the dictionary unchanged if validation passes. Organize the script with functions and a final if __name__ == \"__main__\": block, and use time.perf_counter() to measure and print how long validation took across at least three different test dictionaries, including at least one that is missing a required key and correctly triggers the ValueError.",
  assignmentDeliverables: [
    "main.py with a type-hinted, fail-fast load_config() function guarded by if __name__ == \"__main__\":",
    "Printed output showing successful validations, one caught ValueError, and timing measurements",
  ],
  assignmentAssessmentCriteria: [
    "load_config() correctly validates required keys and fails fast with a clear ValueError",
    "Script is organized into functions with a properly guarded __main__ entry point",
  ],
  miniProject:
    "Build a 'Toolkit Report' script that combines this module's ideas into one program: at least one function using generic type hints and an Optional (or | None) return type, a validation function that fails fast with a clear ValueError for bad input, a time.perf_counter() comparison between two different implementations of the same small calculation, and a properly guarded if __name__ == \"__main__\": block that runs everything in order and prints a short labeled summary report at the end.",
  miniProjectDeliverables: [
    "main.py combining type hints, fail-fast validation, a timing comparison, and a __main__-guarded summary report",
    "Printed summary report showing the results of each combined feature",
  ],
  miniProjectAssessmentCriteria: [
    "Type hints correctly use generics and Optional (or equivalent) where appropriate",
    "The script runs end to end from a single if __name__ == \"__main__\": block and produces a clear summary",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
