import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module6: GeneratedModule = {
  title: "Exception Handling & Debugging",
  description:
    "Go beyond basic try/except: understand Python's exception hierarchy, raise exceptions deliberately, build your own custom exception classes, and debug with finally and the logging module.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Exception Hierarchies and Raising Exceptions Deliberately",
      goal: "Understand how Python's built-in exceptions relate to each other, and use raise to trigger an exception on purpose.",
      videoTitle: "Python Exception Hierarchy and raise Statement Explained",
      videoSearchQuery: "python exception hierarchy raise statement tutorial",
      videoLearningGoal: "See how built-in exceptions like ValueError and TypeError relate to the base Exception class, and how raise triggers one deliberately.",
      recommendedChannels: ["Corey Schafer", "freeCodeCamp.org"],
      keyTakeaways: [
        "Every built-in Python exception (ValueError, TypeError, KeyError, and more) is a subclass of the base Exception class.",
        "raise ExceptionType(\"message\") triggers an exception deliberately, stopping normal execution at that point.",
        "Raising exceptions early, before invalid data spreads further into a program, makes bugs easier to trace.",
      ],
      notes:
        "You have already caught exceptions with try/except. Now you will trigger them yourself, on purpose, whenever your own code detects a problem it cannot sensibly continue past. Python's exceptions are organized in a hierarchy: ValueError, TypeError, and every other built-in exception are all subclasses of the base Exception class, which is why except Exception: (used sparingly) can catch nearly anything.",
      conceptExplanation:
        "if age < 0: raise ValueError(\"Age cannot be negative\") immediately stops the function and signals exactly what went wrong, using an exception type that already communicates the kind of problem. Because ValueError is a subclass of Exception, code that catches except Exception: would catch it too, though catching the most specific exception type you can, like ValueError, is almost always better than a broad Exception catch, since it avoids accidentally hiding unrelated bugs. Deliberately raising an exception the moment invalid data is detected is called failing fast, and it prevents a bad value from silently causing confusing problems somewhere else in the program.",
      whyItMatters: "Raising exceptions deliberately is how you enforce the assumptions your own code depends on, turning silent, hard-to-trace bugs into clear, immediate, and readable errors.",
      practicalTask:
        "In the Academy workspace, main.py is already open for you. Write a function set_age(age) that raises a ValueError with a clear message if age is negative, and otherwise prints a confirmation message. Call it once with a valid age and once with a negative age wrapped in a try/except block that catches the ValueError and prints its message instead of crashing the program.",
      challenge: "Add a second check in set_age() that raises a TypeError if age is not an int, and add a second except clause to handle that case with its own message.",
      expectedResult: "The program prints a success message for the valid call, and cleanly prints the caught ValueError's message for the negative age instead of crashing.",
      tests: ["set_age() uses raise ValueError(...) for invalid input", "The negative age call is caught by a try/except and does not crash the program"],
      hint: "The message you pass to raise ValueError(\"message\") becomes accessible in the except block through str(e) if you catch it as except ValueError as e:.",
      lessonAssessment: [
        {
          question: "What is the relationship between ValueError and the base Exception class?",
          options: [
            "They are unrelated",
            "ValueError is a subclass of Exception",
            "Exception is a subclass of ValueError",
            "ValueError replaces Exception entirely",
          ],
          correctAnswerIndex: 1,
          explanation: "Nearly all built-in exceptions, including ValueError, are subclasses of the base Exception class, which is why broad except Exception: catches them too.",
        },
        {
          question: "What does raise ValueError(\"Age cannot be negative\") do?",
          options: [
            "Prints the message and continues normally",
            "Deliberately triggers a ValueError with that message, stopping normal execution at that point",
            "Logs the message silently with no effect on execution",
            "Creates a new function called ValueError",
          ],
          correctAnswerIndex: 1,
          explanation: "raise deliberately triggers the given exception, immediately interrupting normal flow unless something catches it.",
        },
      ],
      commonMistakes: ["Raising a generic Exception instead of a more specific, descriptive type like ValueError or TypeError.", "Continuing to run code after a condition that should have raised an exception, letting bad data silently propagate further."],
      deliverables: ["A script with a function that raises a specific exception for invalid input, caught by try/except"],
      assessmentCriteria: ["raise is used with a specific, appropriate exception type and a clear message", "The exception is correctly caught and handled without crashing the program"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'def set_age(age):\n    if age < 0:\n        raise ValueError("Age cannot be negative")\n    print(f"Age set to {age}")\n\nset_age(30)\ntry:\n    set_age(-5)\nexcept ValueError as e:\n    print("Could not set age:", e)',
        explanation: "set_age(-5) triggers the deliberate ValueError, which is caught by the except block instead of crashing the program, and its message is printed through the variable e.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Custom Exception Classes and Multiple except Blocks",
      goal: "Define a custom exception class and handle several different exception types with separate except blocks.",
      videoTitle: "Python Custom Exceptions and Multiple except Blocks",
      videoSearchQuery: "python custom exception class multiple except blocks tutorial",
      videoLearningGoal: "See a custom exception class defined by subclassing Exception, and multiple except blocks each catching a different error type.",
      recommendedChannels: ["Programming with Mosh", "Tech With Tim"],
      keyTakeaways: [
        "A custom exception is a class that inherits from Exception (or a more specific built-in exception).",
        "A try block can be followed by multiple except blocks, each catching a different specific exception type.",
        "Python checks except blocks top to bottom and runs the first one whose type matches the raised exception.",
      ],
      notes:
        "Built-in exceptions cover generic problems, but your own programs often have domain-specific errors that deserve their own name: InsufficientFundsError, DuplicateContactError, or InvalidOrderError describe exactly what went wrong far better than a generic ValueError does. Defining one is as simple as creating a class that inherits from Exception.",
      conceptExplanation:
        "class InsufficientFundsError(Exception): pass creates a brand new exception type; raise InsufficientFundsError(\"Not enough balance\") raises it exactly like any built-in exception, and except InsufficientFundsError: catches it specifically. When a function might fail in more than one distinct way, you can stack multiple except blocks after one try: try: ... except InsufficientFundsError: ... except ValueError: ... except Exception: .... Python checks them top to bottom and runs only the first matching block, so more specific exception types should generally be listed before more general ones like the base Exception.",
      whyItMatters: "Custom exceptions make error handling self-documenting: catching InsufficientFundsError tells you exactly what kind of business rule was violated, which a generic ValueError never could.",
      practicalTask:
        "Define a custom exception class called InsufficientFundsError that inherits from Exception. Write a function withdraw(balance, amount) that raises InsufficientFundsError with a clear message if amount is greater than balance, and otherwise returns balance minus amount. Call it inside a try block with two except blocks: one specifically catching InsufficientFundsError, and one catching TypeError (in case a non-number is passed in). Test both a valid and an over-limit withdrawal.",
      challenge: "Add a second custom exception, NegativeAmountError, raised when amount is negative, with its own dedicated except block, and test it with a negative withdrawal amount.",
      expectedResult: "A valid withdrawal correctly returns the new balance, and an over-limit withdrawal is caught specifically by the InsufficientFundsError except block with a clear message.",
      tests: ["A custom exception class inheriting from Exception is defined and raised", "At least 2 separate except blocks catch different exception types correctly"],
      hint: "class InsufficientFundsError(Exception): pass is enough to create a fully working custom exception; you don't need to add anything else to the class body.",
      lessonAssessment: [
        {
          question: "What must a custom exception class inherit from to work correctly with try/except?",
          options: ["object only", "Exception (or a subclass of it)", "Nothing, it works automatically", "list"],
          correctAnswerIndex: 1,
          explanation: "A custom exception needs to inherit from Exception (or one of its subclasses) so Python's exception handling machinery recognizes and can catch it.",
        },
        {
          question: "When a try block has multiple except clauses, how many run for a single raised exception?",
          options: ["All of them, in order", "Only the first except clause whose type matches the exception", "None, unless it's an Exception", "Only the last one"],
          correctAnswerIndex: 1,
          explanation: "Python checks except clauses top to bottom and executes only the first one whose exception type matches, then stops checking the rest.",
        },
      ],
      commonMistakes: ["Placing a broad except Exception: block before a more specific one, which silently swallows the specific exception since it also matches Exception.", "Forgetting the (Exception) parent when defining a custom exception class, which prevents it from working with try/except properly."],
      deliverables: ["A script with a custom exception class and at least 2 distinct except blocks"],
      assessmentCriteria: ["Custom exception is correctly defined and raised for the intended condition", "Multiple except blocks correctly catch and distinguish different error types"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'class InsufficientFundsError(Exception):\n    pass\n\ndef withdraw(balance, amount):\n    if amount > balance:\n        raise InsufficientFundsError("Not enough balance for this withdrawal")\n    return balance - amount\n\ntry:\n    print(withdraw(100, 40))\n    print(withdraw(100, 500))\nexcept InsufficientFundsError as e:\n    print("Withdrawal failed:", e)\nexcept TypeError:\n    print("Amount must be a number")',
        explanation: "The first withdrawal succeeds and returns the new balance; the second raises InsufficientFundsError, which is caught by its own dedicated except block with a clear message.",
      },
      completionStatus: "not_started",
    },
    {
      title: "finally and Structured Debugging with the logging Module",
      goal: "Use finally to guarantee cleanup code runs, and the logging module for structured debug output.",
      videoTitle: "Python finally Block and logging Module Tutorial",
      videoSearchQuery: "python try finally logging module tutorial for beginners",
      videoLearningGoal: "See a finally block run regardless of whether an exception occurred, and logging used instead of plain print statements.",
      recommendedChannels: ["freeCodeCamp.org", "Corey Schafer"],
      keyTakeaways: [
        "A finally block always runs after try/except, whether an exception was raised and caught or not.",
        "finally is the standard place for cleanup code that must always happen, like closing a resource.",
        "The logging module provides leveled messages (debug, info, warning, error) that are more structured than plain print() for tracking what a program is doing.",
      ],
      notes:
        "finally guarantees a piece of code always runs after a try block, regardless of the outcome: whether the try succeeded, an exception was caught, or even if the exception wasn't caught at all. This makes it the natural place for cleanup that must never be skipped. The logging module is a more structured alternative to scattering print() statements everywhere: each message is tagged with a severity level, making it easy to filter what you care about.",
      conceptExplanation:
        "try: risky_operation() except ValueError: handle_it() finally: print(\"Cleanup complete\") runs the finally block after either the try succeeds or the except handles a ValueError, every single time. logging.basicConfig(level=logging.DEBUG) configures the logging module, after which logging.debug(\"details\"), logging.info(\"progress update\"), logging.warning(\"something looks off\"), and logging.error(\"a real problem\") each produce a labeled message showing its severity level. Unlike print(), logging lets you leave detailed debug messages in your code without cluttering normal output, since you can raise the configured level to hide lower-severity messages later.",
      whyItMatters: "finally prevents resource leaks and skipped cleanup, and structured logging gives you a clearer, filterable trail of what a program actually did, which is far more useful than print() debugging once code grows beyond a few lines.",
      practicalTask:
        "Configure the logging module with logging.basicConfig(level=logging.DEBUG). Write a function process_value(value) that logs an info message when it starts, tries to convert value to an int, catches a ValueError if conversion fails and logs an error message, and uses a finally block to log a debug message confirming processing finished for that value. Call it with both a valid numeric string and an invalid one.",
      challenge: "Add a logging.warning() call inside process_value() specifically for values that convert successfully but are negative, distinguishing that case from both success and outright conversion failure.",
      expectedResult: "The program prints a labeled sequence of log messages for each call, always ending with the debug message from finally, whether the conversion succeeded or failed.",
      tests: ["A finally block runs and logs a message regardless of whether the try succeeded or the except ran", "logging is used with at least 2 different severity levels (such as info and error)"],
      hint: "logging.basicConfig(level=logging.DEBUG) must be called once, near the start of the script, before any logging calls will show debug-level messages.",
      lessonAssessment: [
        {
          question: "When does the code inside a finally block run?",
          options: [
            "Only if an exception was raised",
            "Only if no exception was raised",
            "Always, whether the try succeeded or an exception was raised and caught",
            "Only if the program is about to exit",
          ],
          correctAnswerIndex: 2,
          explanation: "finally is guaranteed to run after the try/except regardless of the outcome, making it the standard place for cleanup code.",
        },
        {
          question: "What advantage does the logging module offer over plain print() statements for debugging?",
          options: [
            "Logging runs code faster",
            "Logging messages carry a severity level, so they can be filtered or controlled without deleting the calls",
            "print() cannot output text at all",
            "There is no real difference",
          ],
          correctAnswerIndex: 1,
          explanation: "Logging messages are tagged with a level (debug, info, warning, error), letting you control which messages actually show up without removing the logging calls from your code.",
        },
      ],
      commonMistakes: ["Putting cleanup code only inside the try block, where it gets skipped if an exception is raised before reaching it.", "Calling logging.debug() without first configuring logging.basicConfig(level=logging.DEBUG), then wondering why debug messages don't appear."],
      deliverables: ["A script using finally for guaranteed cleanup and logging for at least 2 severity levels"],
      assessmentCriteria: ["finally correctly runs in both the success and failure paths", "logging correctly reports different severity levels for different situations"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'import logging\n\nlogging.basicConfig(level=logging.DEBUG)\n\ndef process_value(value):\n    logging.info(f"Processing value: {value}")\n    try:\n        number = int(value)\n        logging.info(f"Converted successfully: {number}")\n    except ValueError:\n        logging.error(f"Could not convert {value!r} to a number")\n    finally:\n        logging.debug(f"Finished processing {value!r}")\n\nprocess_value("42")\nprocess_value("abc")',
        explanation: "The finally block logs a debug message after every call, regardless of whether conversion succeeded (logged as info) or failed (logged as an error).",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Exception Handling & Debugging Assessment",
    questions: [
      { question: "What is the base class that nearly all built-in Python exceptions inherit from?", options: ["BaseError", "Exception", "Error", "RuntimeError"], correctAnswerIndex: 1, explanation: "Nearly every built-in exception, like ValueError and TypeError, is a subclass of the base Exception class." },
      { question: "What does raise ValueError(\"bad input\") do?", options: ["Prints the message and continues", "Deliberately triggers a ValueError with that message", "Logs the message silently", "Defines a new function"], correctAnswerIndex: 1, explanation: "raise deliberately triggers the specified exception, interrupting normal execution unless it's caught." },
      { question: "What must a custom exception class inherit from?", options: ["object only", "Exception (or a subclass of it)", "dict", "Nothing is required"], correctAnswerIndex: 1, explanation: "A custom exception needs to inherit from Exception to integrate correctly with try/except." },
      { question: "With multiple except blocks after one try, how many run for a single raised exception?", options: ["All matching ones", "Only the first one whose type matches", "None", "All of them regardless of type"], correctAnswerIndex: 1, explanation: "Python checks except blocks top to bottom and runs only the first one whose exception type matches." },
      { question: "Why should more specific exception types generally be listed before a broad except Exception: block?", options: [
          "Order does not matter",
          "A broad Exception block listed first would catch everything, preventing the more specific blocks from ever running",
          "Python requires alphabetical order",
          "It has no effect on which block runs",
        ], correctAnswerIndex: 1, explanation: "Since only the first matching except block runs, placing a broad Exception catch first would swallow every exception before more specific handlers get a chance." },
      { question: "When does a finally block run?", options: ["Only when an exception occurs", "Only when no exception occurs", "Always, regardless of whether an exception was raised and caught", "Only if the try block is empty"], correctAnswerIndex: 2, explanation: "finally always runs after the try/except, making it reliable for cleanup that must never be skipped." },
      { question: "What is finally typically used for?", options: ["Raising new exceptions", "Guaranteed cleanup code, like closing a resource", "Catching every exception type", "Defining custom exceptions"], correctAnswerIndex: 1, explanation: "finally is the standard place to put cleanup logic that must run no matter what happened in the try or except blocks." },
      { question: "What does logging.basicConfig(level=logging.DEBUG) do?", options: ["Deletes all previous log messages", "Configures logging so debug-level and higher messages are shown", "Disables logging entirely", "Only enables error messages"], correctAnswerIndex: 1, explanation: "Setting the level to DEBUG configures logging to show debug messages and everything above that severity." },
      { question: "What is the main advantage of the logging module compared to scattering print() statements?", options: [
          "Logging cannot output text",
          "Logging messages are tagged with a severity level, making them easier to filter and control",
          "print() is faster in every case",
          "There is no advantage",
        ], correctAnswerIndex: 1, explanation: "Logging associates each message with a severity level (debug, info, warning, error), giving you structured, filterable output instead of undifferentiated print() text." },
      { question: "Why might a program define a custom exception like InsufficientFundsError instead of raising a generic ValueError?", options: [
          "Custom exceptions run faster",
          "A custom, descriptive exception name makes the specific problem immediately clear when caught or read in a traceback",
          "Python requires custom exceptions for every function",
          "It prevents the exception from ever being caught",
        ], correctAnswerIndex: 1, explanation: "A custom exception name documents exactly what went wrong, which is more informative than a generic built-in exception type." },
    ],
  },
  assignment:
    "Build a 'Safe Order Processor': define a custom exception OutOfStockError that inherits from Exception. Write a function place_order(stock, item, quantity) that raises OutOfStockError with a clear message if quantity is greater than the available stock for that item, and otherwise returns the remaining stock after subtracting quantity. Call it inside a try/except/finally: the except block should catch OutOfStockError and print a friendly message, and the finally block should always print a message confirming the order attempt was processed. Test it with both a valid order and one that exceeds stock.",
  assignmentDeliverables: [
    "A script defining OutOfStockError and a place_order() function that raises it appropriately",
    "Output showing a successful order, a failed order caught cleanly, and the finally block running both times",
  ],
  assignmentAssessmentCriteria: [
    "OutOfStockError correctly inherits from Exception and is raised for the right condition",
    "try/except correctly catches OutOfStockError without crashing the program",
    "finally correctly runs after both the successful and failed order attempts",
  ],
  miniProject:
    "Build a 'Validated Signup Processor': define two custom exceptions, InvalidEmailError and WeakPasswordError, both inheriting from Exception. Write a function sign_up(email, password) that raises InvalidEmailError if the email does not contain an \"@\" character, and WeakPasswordError if the password is shorter than 8 characters, otherwise returning a success message. Configure the logging module and log an info message when a signup attempt starts, an error message for each specific failure, and use a finally block to log a debug message noting the attempt is complete. Test the function with at least 3 different inputs: one valid, one with a bad email, and one with a weak password.",
  miniProjectDeliverables: [
    "signup_processor.py in the Academy workspace",
    "Output showing all 3 test cases, each correctly logged and handled without the program crashing",
  ],
  miniProjectAssessmentCriteria: [
    "Both custom exceptions are correctly defined and raised for their specific conditions",
    "Each except block correctly distinguishes and handles its own exception type",
    "logging and finally are used correctly to report progress and guarantee cleanup logging",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
