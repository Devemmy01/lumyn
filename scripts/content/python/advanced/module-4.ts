import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace. Only read or write files you created yourself inside the workspace.";

export const module4: GeneratedModule = {
  title: "Context Managers",
  description:
    "Master the with statement by building your own context managers, so setup and cleanup code, like timing a block or managing a resource, always runs reliably, even when errors occur.",
  completionStatus: "locked",
  lessons: [
    {
      title: "The with Statement and Custom Context Manager Classes",
      goal: "Understand what the with statement does and write a custom context manager class using __enter__ and __exit__.",
      videoTitle: "Python Context Managers: __enter__ and __exit__ Explained",
      videoSearchQuery: "python context manager enter exit class tutorial",
      videoLearningGoal: "See a custom context manager class control setup and guaranteed cleanup around a with block.",
      recommendedChannels: ["Corey Schafer", "ArjanCodes"],
      keyTakeaways: [
        "with expr as name: calls __enter__ on expr's result, binds it to name, runs the block, then always calls __exit__, even if an error occurred.",
        "__enter__(self) runs setup logic and returns the value bound after as.",
        "__exit__(self, exc_type, exc_value, traceback) runs cleanup logic and receives details about any exception raised inside the block.",
      ],
      notes:
        "You've already used with when opening files. A context manager formalizes the pattern of setting something up, then always cleaning it up afterward, even if something goes wrong inside the block. Writing your own context manager class means implementing two methods: __enter__ and __exit__.",
      conceptExplanation:
        "class Timer: def __enter__(self): self.start = time.time(); return self is called when the with block begins. def __exit__(self, exc_type, exc_value, traceback): self.elapsed = time.time() - self.start runs no matter how the block ends, even if it raised an exception. Returning True from __exit__ suppresses the exception; returning None or False, the usual choice, lets it propagate normally after cleanup runs.",
      whyItMatters: "Context managers guarantee cleanup code always runs, which is exactly the guarantee you want for closing files, releasing locks, or measuring how long a block of code took.",
      practicalTask:
        "In the Academy workspace, main.py is already open for you. Write a context manager class called Timer that records the start time in __enter__ and calculates the elapsed time in __exit__ using the time module, storing it as self.elapsed. Use it in a with block around a small loop that does some repeated work, like appending to a list many times, then print the elapsed time after the with block ends.",
      challenge: "Deliberately raise an exception inside the with block (for example 1/0) and confirm, using a comment or a try/except around the whole with block, that __exit__ still ran and self.elapsed was still set despite the error.",
      expectedResult: "After the with block finishes, printing timer.elapsed shows a small positive number of seconds representing how long the block took to run.",
      tests: [
        "Timer implements both __enter__ and __exit__",
        "self.elapsed is correctly calculated and accessible after the with block ends",
      ],
      hint: "time.time() returns the current time in seconds as a float; subtracting an earlier reading from a later one gives elapsed seconds.",
      lessonAssessment: [
        {
          question: "What always happens when a with block finishes, even if an exception occurred inside it?",
          options: ["Nothing extra happens", "The context manager's __exit__ method runs", "The program crashes", "__enter__ runs again"],
          correctAnswerIndex: 1,
          explanation: "Python guarantees __exit__ runs when a with block ends, whether it finished normally or raised an exception.",
        },
        {
          question: "What does returning True from __exit__ do?",
          options: ["Nothing different from returning False", "It suppresses the exception raised inside the with block", "It re-raises the exception a second time", "It re-runs the with block"],
          correctAnswerIndex: 1,
          explanation: "Returning a truthy value from __exit__ tells Python to swallow the exception instead of letting it propagate.",
        },
      ],
      commonMistakes: [
        "Forgetting that __exit__ receives exception details as parameters, and needing to check exc_type to decide how to respond.",
        "Accidentally suppressing real errors by returning True from __exit__ without meaning to.",
      ],
      deliverables: ["main.py with a Timer context manager class used around a block of code"],
      assessmentCriteria: ["__enter__ and __exit__ are both correctly implemented", "Elapsed time is correctly calculated and accessible after the with block"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'import time\n\nclass Timer:\n    def __enter__(self):\n        self.start = time.time()\n        return self\n\n    def __exit__(self, exc_type, exc_value, traceback):\n        self.elapsed = time.time() - self.start\n        return False\n\nwith Timer() as timer:\n    total = sum(range(1000000))\n\nprint(f"Elapsed: {timer.elapsed:.4f}s")',
        explanation: "__exit__ always runs when the with block ends, so timer.elapsed is set whether or not an error occurred inside the block.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Simpler Context Managers with contextlib.contextmanager",
      goal: "Use the @contextlib.contextmanager decorator to write a context manager as a single generator function.",
      videoTitle: "Python contextlib.contextmanager Explained",
      videoSearchQuery: "python contextlib contextmanager decorator tutorial",
      videoLearningGoal: "See a generator function turned into a context manager with @contextlib.contextmanager, using yield to mark the with block's boundary.",
      recommendedChannels: ["ArjanCodes", "Tech With Tim"],
      keyTakeaways: [
        "@contextlib.contextmanager turns a generator function into a context manager without writing a full class.",
        "Code before yield runs as setup, like __enter__; code after yield runs as cleanup, like __exit__, and runs even if an exception occurs.",
        "The value passed to yield becomes the value bound by as in the with statement.",
      ],
      notes:
        "Writing a full class with __enter__ and __exit__ is sometimes more ceremony than a simple context manager needs. contextlib.contextmanager lets you write the same behavior as a single generator function: setup code, then yield, then cleanup code.",
      conceptExplanation:
        "from contextlib import contextmanager; @contextmanager def timer(): start = time.time(); yield; print(f'Elapsed: {time.time() - start:.4f}s') turns timer into something usable as with timer():. Everything before yield is setup, the value yielded (if any) is what as binds to, and everything after yield is cleanup, which is guaranteed to run even if the with block raises an exception, as long as you wrap the yield in a try/finally.",
      whyItMatters: "Being able to write a context manager as a short function instead of a class keeps simple setup and cleanup logic concise and easy to read.",
      practicalTask:
        "Using @contextlib.contextmanager, rewrite your Timer class from the previous lesson as a generator function called timer() that prints the elapsed time directly after the yield, wrapped in try/finally so it prints even if the block raises an error. Use it in a with block around the same kind of repeated work as before.",
      challenge: "Modify your timer() generator function to accept a label parameter (used as with timer('data processing'):) and include that label in the printed elapsed-time message.",
      expectedResult: "Using with timer():, the elapsed time prints automatically right after the block finishes, without needing a separate class.",
      tests: [
        "timer() is decorated with @contextlib.contextmanager and uses yield exactly once",
        "The cleanup code, printing elapsed time, is wrapped in try/finally so it runs even if the block raises an error",
      ],
      hint: "A generator-based context manager must yield exactly once; more than one yield raises a RuntimeError when used in a with statement.",
      lessonAssessment: [
        {
          question: "In a function decorated with @contextlib.contextmanager, what does the code before yield correspond to?",
          options: ["__exit__ logic", "__enter__ (setup) logic", "Nothing, it never runs", "The with block's own body"],
          correctAnswerIndex: 1,
          explanation: "Code before the yield statement plays the same role as __enter__: it runs when the with block begins.",
        },
        {
          question: "How many times must a @contextlib.contextmanager generator function yield?",
          options: ["Exactly once", "Zero or more times", "Exactly twice", "As many times as needed"],
          correctAnswerIndex: 0,
          explanation: "A generator used as a context manager must yield exactly one value; yielding more than once raises a RuntimeError when used in a with statement.",
        },
      ],
      commonMistakes: [
        "Yielding more than once inside a @contextlib.contextmanager function, which raises a RuntimeError when used in a with statement.",
        "Forgetting try/finally around the yield, so cleanup code is skipped if the with block raises an exception.",
      ],
      deliverables: ["main.py with a timer() context manager built using @contextlib.contextmanager"],
      assessmentCriteria: ["Decorator and yield are used correctly to define setup and cleanup", "Cleanup code runs reliably, including when the block raises an exception"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'import time\nfrom contextlib import contextmanager\n\n@contextmanager\ndef timer(label):\n    start = time.time()\n    try:\n        yield\n    finally:\n        print(f"{label}: {time.time() - start:.4f}s")\n\nwith timer("sum loop"):\n    total = sum(range(1000000))',
        explanation: "Everything before yield is setup, and the finally block after it is cleanup, guaranteed to run even if the with block raises an exception.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Practical Resource Management: Files and Timed Blocks",
      goal: "Apply context managers to real resource-management situations, including combining multiple context managers.",
      videoTitle: "Python Context Managers in Practice: Files and Resource Cleanup",
      videoSearchQuery: "python context managers practical file handling resource cleanup tutorial",
      videoLearningGoal: "See multiple context managers combined and a custom context manager used alongside a built-in file context manager.",
      recommendedChannels: ["Corey Schafer", "freeCodeCamp.org"],
      keyTakeaways: [
        "You can open multiple context managers in a single with statement, separated by commas.",
        "Combining a custom context manager, like a timer, with a built-in one, like open(), is a common real-world pattern.",
        "Context managers make cleanup guarantees explicit and readable, instead of relying on manually remembering to close things.",
      ],
      notes:
        "Context managers really shine when combined: timing how long a file operation takes, or managing multiple resources at once, all while guaranteeing cleanup happens regardless of errors. This lesson combines everything from the previous two lessons into a realistic use case.",
      conceptExplanation:
        "with timer('file write'), open('run_log.txt', 'w') as f: f.write('some data') opens two context managers at once, in order, and closes them in reverse order once the block ends. This pattern is common when you want to measure and log the time taken by an I/O operation, without separating the timing logic from the operation itself into confusing extra code.",
      whyItMatters: "Real programs constantly juggle multiple things that need cleanup: files, timers, connections. Combining context managers keeps that cleanup logic centralized, readable, and reliable.",
      practicalTask:
        "Using your timer() context manager from the previous lesson combined with open(), write to a file called run_log.txt inside a single with statement that opens both the timer and the file together, writing several lines of text. After the with block, reopen and read run_log.txt to confirm its contents, and confirm the elapsed time was printed.",
      challenge: "Write a second custom context manager called suppress_and_log(*exception_types) using @contextlib.contextmanager that catches any of the given exception types inside its block, prints a message about what was caught, and lets the program continue instead of crashing. Demonstrate it around code that raises one of the given exception types.",
      expectedResult: "The program writes to run_log.txt, prints the elapsed time for the write operation, and then successfully reads back the file's contents.",
      tests: [
        "A single with statement combines the timer context manager and open() together",
        "The file's contents are correctly read back after the with block completes",
      ],
      hint: "Multiple context managers in one with statement are separated by commas: with cm_one() as a, cm_two() as b:",
      lessonAssessment: [
        {
          question: "In what order are multiple context managers in a single with statement cleaned up?",
          options: ["In the same order they were opened", "In reverse order from how they were opened", "In a random order", "Only the first one is cleaned up"],
          correctAnswerIndex: 1,
          explanation: "Context managers close in reverse order from how they were entered, the same way nested blocks unwind.",
        },
        {
          question: "What is a practical benefit of combining a timer context manager with a file-writing context manager in one with statement?",
          options: [
            "It makes the file write faster",
            "It keeps the timing and the operation being timed together and readable, with guaranteed cleanup for both",
            "It is required by Python syntax",
            "It prevents the file from ever being closed",
          ],
          correctAnswerIndex: 1,
          explanation: "Combining them keeps related setup and cleanup logic in one readable place, while each context manager's own guarantees still apply.",
        },
      ],
      commonMistakes: [
        "Nesting context managers unnecessarily instead of combining them with commas in a single with statement, when both truly are independent resources.",
        "Forgetting that reading a file after writing to it with 'w' mode requires reopening it; a single file handle cannot switch modes.",
      ],
      deliverables: ["main.py combining a timer context manager and file writing in one with statement, with the file contents read back afterward"],
      assessmentCriteria: ["Timer and file context managers are combined correctly in one with statement", "File contents are correctly written and then read back"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'from contextlib import contextmanager\nimport time\n\n@contextmanager\ndef timer(label):\n    start = time.time()\n    try:\n        yield\n    finally:\n        print(f"{label}: {time.time() - start:.4f}s")\n\nwith timer("write log"), open("run_log.txt", "w") as f:\n    f.write("Job started\\n")\n    f.write("Job finished\\n")\n\nwith open("run_log.txt", "r") as f:\n    print(f.read())',
        explanation: "Both context managers open together in one with statement and close in reverse order once the block ends, after the log file has been fully written.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Context Managers Assessment",
    questions: [
      {
        question: "What does the with statement guarantee?",
        options: [
          "Nothing extra beyond a normal function call",
          "That the context manager's cleanup code runs when the block ends, even if an exception occurred",
          "That the code inside never raises an exception",
          "That the block runs exactly twice",
        ],
        correctAnswerIndex: 1,
        explanation: "The core guarantee of with is that __exit__ (or the cleanup after yield) always runs, regardless of how the block ends.",
      },
      {
        question: "Which two methods does a class-based context manager need to implement?",
        options: ["__init__ and __del__", "__enter__ and __exit__", "__get__ and __set__", "__call__ and __repr__"],
        correctAnswerIndex: 1,
        explanation: "__enter__ handles setup and __exit__ handles cleanup for a class-based context manager.",
      },
      {
        question: "What does returning True from __exit__ do?",
        options: ["Nothing different from returning False", "It suppresses any exception raised inside the with block", "It re-runs the with block", "It raises a new exception"],
        correctAnswerIndex: 1,
        explanation: "A truthy return value from __exit__ tells Python to swallow the exception instead of propagating it further.",
      },
      {
        question: "What decorator turns a generator function into a context manager without writing a full class?",
        options: ["@staticmethod", "@contextlib.contextmanager", "@property", "@functools.wraps"],
        correctAnswerIndex: 1,
        explanation: "@contextlib.contextmanager wraps a generator function so it can be used with the with statement.",
      },
      {
        question: "In a @contextlib.contextmanager function, what does the code after yield correspond to?",
        options: ["__enter__ setup logic", "__exit__ cleanup logic", "Nothing, it never runs", "The with block's own body"],
        correctAnswerIndex: 1,
        explanation: "Code after the yield acts as cleanup, equivalent to __exit__ in a class-based context manager.",
      },
      {
        question: "Why should cleanup code in a @contextlib.contextmanager function typically be wrapped in try/finally around the yield?",
        options: [
          "It isn't necessary; cleanup always runs regardless",
          "So the cleanup still runs even if the with block raises an exception",
          "To make the function run faster",
          "Because Python requires it syntactically",
        ],
        correctAnswerIndex: 1,
        explanation: "Without try/finally, an exception raised inside the with block would skip the cleanup code that follows yield.",
      },
      {
        question: "In what order are multiple context managers in one with statement (with a() as x, b() as y:) cleaned up?",
        options: ["The same order they were opened", "The reverse order from how they were opened", "A random order", "Only the last one is cleaned up"],
        correctAnswerIndex: 1,
        explanation: "Context managers unwind in reverse order, closing the most recently opened one first.",
      },
      {
        question: "What is a practical example of when a custom context manager is useful?",
        options: ["Declaring a constant", "Timing how long a block of code takes to run, with guaranteed cleanup", "Importing the os module", "Defining a function's docstring"],
        correctAnswerIndex: 1,
        explanation: "Timing blocks, and other setup/cleanup pairs, are classic use cases for a context manager.",
      },
      {
        question: "What value does __enter__ typically return?",
        options: ["Always None", "The object that should be bound after the 'as' keyword in the with statement", "The exception type", "The class itself, always"],
        correctAnswerIndex: 1,
        explanation: "Whatever __enter__ returns becomes the value bound by 'as' inside the with block.",
      },
      {
        question: "What happens if a generator-based context manager yields more than once?",
        options: ["Nothing unusual", "It raises a RuntimeError when used in a with statement", "It runs the with block twice", "Python automatically ignores the extra yield"],
        correctAnswerIndex: 1,
        explanation: "A @contextlib.contextmanager function must yield exactly once; a second yield triggers a RuntimeError.",
      },
    ],
  },
  assignment:
    "Build a 'Resource Guard' toolkit: a context manager class ManagedResource that prints 'Resource opened' inside __enter__ and 'Resource closed' inside __exit__, simulating a resource that needs guaranteed cleanup. Use it in a with block that raises an exception partway through, such as dividing by zero, wrapped in an outer try/except so the program doesn't crash, and confirm through the printed output that 'Resource closed' still appeared even though an error occurred.",
  assignmentDeliverables: [
    "main.py with a ManagedResource context manager class",
    "Printed output confirming 'Resource closed' printed even when an exception occurred inside the with block",
  ],
  assignmentAssessmentCriteria: ["__enter__ and __exit__ are both implemented correctly", "Cleanup output appears even when the with block raises an exception"],
  miniProject:
    "Build a 'Logged File Writer': using @contextlib.contextmanager, write a context manager logged_write(filename) that opens the given file for writing, yields the file handle for the with block to use, and after the block completes, prints a message stating how many characters were written in total. Use it to write several lines of text to a file, then reopen and read that file back to confirm its contents match what was written.",
  miniProjectDeliverables: [
    "main.py with a logged_write(filename) context manager built using @contextlib.contextmanager",
    "Printed output showing the character count message and the file's contents read back successfully",
  ],
  miniProjectAssessmentCriteria: [
    "logged_write correctly yields a usable file handle and reports an accurate character count afterward",
    "The file's contents are correctly written and then verified by reading them back",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
