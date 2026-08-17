import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module2: GeneratedModule = {
  title: "Decorators & Closures",
  description:
    "Understand closures, then use them to build custom decorators that add reusable behavior like timing and logging to any function without changing its code.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Closures and Free Variables",
      goal: "Understand how a nested function can remember variables from its enclosing scope after the outer function has returned.",
      videoTitle: "Python Closures Explained",
      videoSearchQuery: "python closures free variables tutorial",
      videoLearningGoal: "See a nested function capture a variable from its enclosing function and keep using it after the outer function has returned.",
      recommendedChannels: ["Corey Schafer", "ArjanCodes"],
      keyTakeaways: [
        "A closure is a function that remembers variables from the scope it was defined in, even after that scope has finished running.",
        "A variable captured this way is called a free variable: it is used inside the inner function but defined in the enclosing function.",
        "Each call to the outer function creates a fresh, independent closure with its own captured variables.",
      ],
      notes:
        "When you define a function inside another function, the inner function can see the outer function's local variables. Normally those variables would disappear once the outer function returns, but if the inner function is returned and used later, Python keeps those variables alive just for it. This is a closure.",
      conceptExplanation:
        "def make_multiplier(factor): def multiply(n): return n * factor; return multiply creates a closure: multiply remembers whatever factor was, even after make_multiplier has finished running. Calling make_multiplier(3) and make_multiplier(5) produces two independent functions, each with its own remembered factor. You can inspect what a closure captured using its __closure__ attribute, though you won't need that for everyday code.",
      whyItMatters: "Closures are the mechanism that makes decorators possible: a decorator is, at its core, a closure that wraps another function.",
      practicalTask:
        "In the Academy workspace, main.py is already open for you. Write a function make_counter() that defines and returns an inner function increment(), which increases and returns a count each time it's called, using a variable from make_counter's scope. Create two separate counters from two separate calls to make_counter(), call each one a few times, and print the results to show they count independently.",
      challenge: "Write a second closure, make_greeting_prefixer(prefix), that returns a function adding the prefix to any name passed to it, and demonstrate it with two different prefixes.",
      expectedResult: "Each counter created from make_counter() tracks its own count independently, unaffected by calls to the other counter.",
      tests: [
        "increment() correctly remembers and updates a variable from make_counter's scope across calls",
        "Two separate counters maintain independent counts",
      ],
      hint: "Since you're reassigning a variable from the enclosing scope inside the inner function, you'll need the nonlocal keyword.",
      lessonAssessment: [
        {
          question: "What is a closure in Python?",
          options: [
            "A function that never returns anything",
            "A function that remembers variables from its enclosing scope even after that scope ends",
            "A class with only private methods",
            "A loop that runs forever",
          ],
          correctAnswerIndex: 1,
          explanation: "A closure is an inner function that retains access to variables from the scope it was defined in, even after the outer function has finished running.",
        },
        {
          question: "What keyword is needed to reassign (not just read) a variable from an enclosing function's scope inside a nested function?",
          options: ["global", "nonlocal", "closure", "outer"],
          correctAnswerIndex: 1,
          explanation: "nonlocal tells Python to update the variable in the nearest enclosing scope rather than creating a new local variable.",
        },
      ],
      commonMistakes: [
        "Trying to reassign a captured variable without nonlocal, which creates a new local variable instead of updating the outer one.",
        "Assuming all closures created from the same outer function share the same captured variables, when each call actually creates independent ones.",
      ],
      deliverables: ["main.py with a make_counter() closure demonstrating two independent counters"],
      assessmentCriteria: ["nonlocal is used correctly to update the captured variable", "Two independently created counters do not interfere with each other"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'def make_counter():\n    count = 0\n\n    def increment():\n        nonlocal count\n        count += 1\n        return count\n\n    return increment\n\ncounter_a = make_counter()\ncounter_b = make_counter()\nprint(counter_a(), counter_a(), counter_a())\nprint(counter_b())',
        explanation: "counter_a and counter_b each capture their own independent count variable, so calling one never affects the other.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Writing Your First Decorator",
      goal: "Write a decorator function that wraps another function to add behavior before and after it runs.",
      videoTitle: "Python Decorators Explained From Scratch",
      videoSearchQuery: "python decorators tutorial from scratch",
      videoLearningGoal: "See a decorator function built step by step, then applied to a target function using the @ syntax.",
      recommendedChannels: ["Corey Schafer", "ArjanCodes"],
      keyTakeaways: [
        "A decorator is a function that takes a function as input and returns a new function that wraps it.",
        "@my_decorator above a function definition is shorthand for func = my_decorator(func).",
        "The wrapper function inside a decorator typically calls the original function with *args and **kwargs and returns its result.",
      ],
      notes:
        "A decorator adds behavior to a function without changing the function's own code. It works because functions are just objects in Python: you can pass them around, wrap them, and return new ones, exactly like the closures from the previous lesson.",
      conceptExplanation:
        "def logs_calls(func): def wrapper(*args, **kwargs): print(f'Calling {func.__name__}'); result = func(*args, **kwargs); print(f'{func.__name__} finished'); return result; return wrapper defines a decorator. Applying it with @logs_calls above def process(x): is exactly equivalent to writing process = logs_calls(process) manually. *args and **kwargs let the wrapper work with any function signature, not just one specific set of parameters.",
      whyItMatters: "Decorators let you add cross-cutting behavior (logging, timing, access checks) to many functions without repeating that logic inside each one.",
      practicalTask:
        "Write a decorator called logs_calls that prints a message before and after the wrapped function runs, then apply it with @logs_calls to two different functions with different parameters. Call each decorated function and observe the before and after messages surrounding the function's own output.",
      challenge: "Modify wrapper to also print the value the function returned, using the result it captured from calling func(*args, **kwargs).",
      expectedResult: "Each call to a decorated function prints a 'before' message, the function's own output, and an 'after' message, in that order.",
      tests: [
        "logs_calls uses *args and **kwargs so it works on functions with different signatures",
        "The wrapper function returns the original function's result rather than discarding it",
      ],
      hint: "Applying @logs_calls above a def line is the same as writing my_function = logs_calls(my_function) right after defining it.",
      lessonAssessment: [
        {
          question: "What does @my_decorator above a function definition actually do?",
          options: [
            "Nothing; it's just a comment",
            "It replaces the function with the result of calling my_decorator(function)",
            "It runs the decorator once at import time and never again",
            "It only works on class methods",
          ],
          correctAnswerIndex: 1,
          explanation: "The @ syntax is shorthand for reassigning the function name to whatever the decorator returns when called with the original function.",
        },
        {
          question: "Why do decorator wrapper functions typically accept *args and **kwargs?",
          options: [
            "To make the code look more advanced",
            "So the wrapper works regardless of the wrapped function's specific parameters",
            "Because Python requires it for all functions",
            "To avoid using return",
          ],
          correctAnswerIndex: 1,
          explanation: "*args and **kwargs let the wrapper forward any combination of arguments to the wrapped function, no matter its signature.",
        },
      ],
      commonMistakes: [
        "Forgetting to return the result of calling func(*args, **kwargs), silently discarding the wrapped function's return value.",
        "Writing wrapper() without *args, **kwargs, which breaks the decorator on any function that takes parameters.",
      ],
      deliverables: ["main.py with a logs_calls decorator applied to at least two functions"],
      assessmentCriteria: ["Decorator correctly wraps and calls the original function", "Wrapper preserves and returns the original function's result"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'def logs_calls(func):\n    def wrapper(*args, **kwargs):\n        print(f"Calling {func.__name__}")\n        result = func(*args, **kwargs)\n        print(f"{func.__name__} finished")\n        return result\n    return wrapper\n\n@logs_calls\ndef add(a, b):\n    return a + b\n\nprint(add(2, 3))',
        explanation: "@logs_calls above add is shorthand for add = logs_calls(add); the wrapper runs before and after the real function on every call.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Decorators with Arguments and functools.wraps",
      goal: "Write a decorator that accepts its own arguments, and use functools.wraps to preserve the original function's metadata.",
      videoTitle: "Python Decorators with Arguments and functools.wraps",
      videoSearchQuery: "python decorator with arguments functools wraps tutorial",
      videoLearningGoal: "See a decorator factory that accepts arguments, plus functools.wraps fixing a wrapped function's lost name and docstring.",
      recommendedChannels: ["ArjanCodes", "Tech With Tim"],
      keyTakeaways: [
        "A decorator that takes its own arguments needs an extra outer layer: a function that returns the actual decorator.",
        "Without functools.wraps, a decorated function's __name__ and __doc__ get replaced by the wrapper's, which breaks introspection and debugging.",
        "@functools.wraps(func) applied to the wrapper function copies over the original function's metadata.",
      ],
      notes:
        "Sometimes you want to configure a decorator, like @retry(times=3) instead of a plain @retry. That requires three levels of nested functions: the outermost accepts the decorator's own arguments, the middle one is the actual decorator, and the innermost is the wrapper that runs on every call.",
      conceptExplanation:
        "def repeat(times): def decorator(func): def wrapper(*args, **kwargs): result = None; for _ in range(times): result = func(*args, **kwargs); return result; return wrapper; return decorator lets you write @repeat(times=3) above a function. Without @functools.wraps(func) on the wrapper, calling help(decorated_function) or checking decorated_function.__name__ would show 'wrapper' instead of the real function's name and docstring, which is confusing during debugging and breaks tools that rely on that metadata.",
      whyItMatters: "Configurable decorators and functools.wraps are what separate hand-rolled decorators from production-quality ones that don't quietly break introspection, logging, and debugging tools.",
      practicalTask:
        "Write a decorator factory called repeat(times) that makes the decorated function run times times in a row, returning the result from the final call. Apply @functools.wraps(func) inside your wrapper. Decorate a simple function with @repeat(times=3), call it once, and print both its output and its __name__ afterward to confirm the real name survived.",
      challenge: "Write a second decorator timer_seconds that wraps a function with the time module from the standard library to measure and print how long it took to run, in seconds.",
      expectedResult: "The decorated function runs the expected number of times, and printing its __name__ shows the original function's real name, not 'wrapper'.",
      tests: [
        "repeat(times) correctly runs the wrapped function the specified number of times",
        "functools.wraps is used so the decorated function's __name__ matches the original",
      ],
      hint: "import functools, then add @functools.wraps(func) directly above your def wrapper(*args, **kwargs): line.",
      lessonAssessment: [
        {
          question: "Why does a decorator that accepts its own arguments (like @repeat(times=3)) need an extra layer of nesting compared to a plain decorator?",
          options: [
            "It doesn't; Python handles this automatically",
            "Because the outer function needs to first accept the decorator's arguments and then return the actual decorator",
            "Because Python requires three functions for every decorator",
            "To avoid using *args",
          ],
          correctAnswerIndex: 1,
          explanation: "The outermost function captures the configuration arguments, then returns the real decorator, which in turn wraps the target function.",
        },
        {
          question: "What problem does functools.wraps solve?",
          options: [
            "It makes decorated functions run faster",
            "It preserves the original function's __name__ and __doc__ on the wrapper",
            "It removes the need for a wrapper function",
            "It automatically logs every function call",
          ],
          correctAnswerIndex: 1,
          explanation: "Without functools.wraps, a wrapped function's identity (name, docstring) would appear to be 'wrapper' instead of its real name.",
        },
      ],
      commonMistakes: [
        "Forgetting the outermost argument-accepting layer when writing a configurable decorator, resulting in a decorator that can't be called with parentheses and arguments.",
        "Skipping functools.wraps and later being confused why a decorated function's __name__ shows 'wrapper' in error messages or logs.",
      ],
      deliverables: ["main.py with a repeat(times) decorator factory using functools.wraps"],
      assessmentCriteria: ["Decorator correctly accepts and uses its own configuration argument", "functools.wraps preserves the original function's metadata"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'import functools\n\ndef repeat(times):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            result = None\n            for _ in range(times):\n                result = func(*args, **kwargs)\n            return result\n        return wrapper\n    return decorator\n\n@repeat(times=3)\ndef greet(name):\n    print(f"Hello, {name}")\n    return name\n\ngreet("Ada")\nprint(greet.__name__)',
        explanation: "functools.wraps copies greet's real name and docstring onto wrapper, so greet.__name__ prints 'greet' instead of 'wrapper'.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Decorators & Closures Assessment",
    questions: [
      {
        question: "What is a closure?",
        options: [
          "A function that never returns",
          "A function that remembers variables from its enclosing scope even after that scope has finished running",
          "A class with no methods",
          "A loop that runs exactly once",
        ],
        correctAnswerIndex: 1,
        explanation: "A closure retains access to variables from its enclosing scope, even after that scope has finished executing.",
      },
      {
        question: "What keyword lets a nested function reassign (not just read) a variable from its enclosing function's scope?",
        options: ["global", "nonlocal", "closure", "outer"],
        correctAnswerIndex: 1,
        explanation: "nonlocal updates a variable in the nearest enclosing function scope rather than creating a new local one.",
      },
      {
        question: "What does @my_decorator above a function definition actually do?",
        options: ["Nothing; it's a comment", "It replaces the function with the result of calling my_decorator(function)", "It deletes the function", "It only works on class methods"],
        correctAnswerIndex: 1,
        explanation: "The @ syntax reassigns the function's name to the value returned by calling the decorator on the original function.",
      },
      {
        question: "Why do decorator wrapper functions typically use *args and **kwargs?",
        options: ["To make the code look advanced", "So the wrapper works regardless of the wrapped function's specific parameters", "Because Python requires it", "To avoid using return"],
        correctAnswerIndex: 1,
        explanation: "*args and **kwargs let a wrapper forward any set of arguments to the function it wraps.",
      },
      {
        question: "What is a common bug when writing a decorator's wrapper function?",
        options: ["Forgetting to return the result of calling the wrapped function", "Using too many parentheses", "Naming the wrapper function 'wrapper'", "Using a docstring"],
        correctAnswerIndex: 0,
        explanation: "If the wrapper doesn't return func(*args, **kwargs)'s result, the decorated function silently loses its return value.",
      },
      {
        question: "What extra layer of nesting does a decorator need if it accepts its own configuration arguments, like @repeat(times=3)?",
        options: [
          "None; it works the same as a plain decorator",
          "An outer function that accepts those arguments and returns the actual decorator",
          "A class instead of a function",
          "A generator instead of a function",
        ],
        correctAnswerIndex: 1,
        explanation: "A configurable decorator needs an extra outer function to capture its arguments before returning the real decorator.",
      },
      {
        question: "What problem does functools.wraps solve?",
        options: ["It makes decorated functions run faster", "It preserves the original function's __name__ and __doc__ on the wrapper", "It removes the need for a wrapper function entirely", "It automatically adds logging"],
        correctAnswerIndex: 1,
        explanation: "functools.wraps copies metadata like __name__ and __doc__ from the original function onto the wrapper.",
      },
      {
        question: "Given def make_adder(x): def add(y): return x + y; return add, what does make_adder(5)(3) evaluate to?",
        options: ["8", "53", "5", "An error"],
        correctAnswerIndex: 0,
        explanation: "make_adder(5) returns a closure remembering x=5; calling it with (3) evaluates 5 + 3, which is 8.",
      },
      {
        question: "Which of these is a practical, common use case for a decorator?",
        options: ["Declaring a variable", "Timing how long a function takes to run", "Importing a module", "Defining a class"],
        correctAnswerIndex: 1,
        explanation: "Timing, logging, and access checks are classic examples of behavior that decorators add without changing a function's own code.",
      },
      {
        question: "Why does each call to a closure-producing function (like make_counter()) create independent state?",
        options: [
          "It doesn't; all calls share the same state",
          "Each call creates its own separate local scope, which the returned inner function captures independently",
          "Python caches only the first call's result",
          "Closures cannot hold state",
        ],
        correctAnswerIndex: 1,
        explanation: "Every call to the outer function creates a fresh local scope, and the closure returned from that call captures its own copy of the variables.",
      },
    ],
  },
  assignment:
    "Build a 'Timing Toolkit': write a decorator called timed that measures and prints how long the wrapped function took to run, using the time module and functools.wraps to preserve the wrapped function's name. Apply @timed to at least two different functions that each do some repeated work, such as a loop building up a list, call each one, and confirm the printed timing output appears for both.",
  assignmentDeliverables: ["main.py with a timed decorator using functools.wraps", "Printed timing output for at least two decorated functions"],
  assignmentAssessmentCriteria: [
    "Decorator correctly measures and prints elapsed time for each call",
    "functools.wraps preserves the original function's name and docstring",
  ],
  miniProject:
    "Build a 'Retry and Log' toolkit: a decorator retry_on_failure(times) that retries the wrapped function up to times times if it raises an exception, only letting the final failure propagate if every attempt fails, and a separate logged decorator that prints a message every time the wrapped function is called. Write a function that fails on its first call or two, using a counter you control, but eventually succeeds. Decorate it with both @retry_on_failure(times=3) and @logged stacked together, and demonstrate it succeeding despite the early failures.",
  miniProjectDeliverables: [
    "main.py with retry_on_failure(times) and logged decorators stacked on one function",
    "Printed output showing at least one failed attempt followed by an eventual success",
  ],
  miniProjectAssessmentCriteria: [
    "retry_on_failure correctly retries up to the specified number of times before giving up",
    "Both decorators work correctly together when stacked on the same function",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
