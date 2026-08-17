import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace. Keep thread counts and sleep durations small so runs finish quickly.";

export const module5: GeneratedModule = {
  title: "Concurrency Basics",
  description:
    "Get a practical, plain-language introduction to concurrency: starting and coordinating threads, understanding what the GIL does and doesn't allow, and protecting shared data from race conditions.",
  completionStatus: "locked",
  lessons: [
    {
      title: "The Threading Module: Starting and Joining Threads",
      goal: "Create and run multiple threads using the threading module, and use join() to wait for them.",
      videoTitle: "Python Threading Module: Starting and Joining Threads",
      videoSearchQuery: "python threading module start join threads tutorial",
      videoLearningGoal: "See multiple threads created, started, and joined, with output showing they interleave rather than running strictly in order.",
      recommendedChannels: ["Corey Schafer", "Tech With Tim"],
      keyTakeaways: [
        "threading.Thread(target=some_function) creates a new thread that will run some_function.",
        "start() begins running the thread; join() blocks the calling code until that thread finishes.",
        "Without join(), your main program might finish, or move on, before a spawned thread has completed its work.",
      ],
      notes:
        "The threading module lets a Python program run multiple pieces of work concurrently. Creating a thread is simple: wrap a function in threading.Thread, call start() to begin it, and call join() when you need to wait for it to finish before continuing.",
      conceptExplanation:
        "t = threading.Thread(target=worker, args=(5,)) creates a thread that will call worker(5) once started; t.start() begins that call running concurrently with the rest of your program; t.join() pauses the main thread until t finishes. Creating several threads, starting all of them, then joining all of them in a separate loop lets them run concurrently rather than one after another, which is the whole point of using threads.",
      whyItMatters: "Threads let a program make progress on multiple tasks 'at once' from the operating system's perspective, which is especially useful for tasks that spend time waiting, like network or file I/O.",
      practicalTask:
        "In the Academy workspace, main.py is already open for you. Write a function worker(name, delay) that uses time.sleep(delay) to simulate work, then prints a message including name once it's done. Create three threading.Thread objects targeting worker with different name and delay values, start all three, then join all three, and print a final 'All workers finished' message only after every join() call returns.",
      challenge: "Run the same three worker calls sequentially, without threads, just calling worker() three times directly, and time both versions using the time module, printing how much faster the threaded version was.",
      expectedResult: "The three worker messages print in an order based on each thread's delay rather than strictly in the order the threads were created, and 'All workers finished' only appears after all three complete.",
      tests: [
        "Three threads are created with threading.Thread and started",
        "join() is called on all three threads before the final message is printed",
      ],
      hint: "Call start() on every thread first in one loop, then call join() on every thread in a second loop, so they actually run concurrently rather than one at a time.",
      lessonAssessment: [
        {
          question: "What does calling join() on a thread do?",
          options: ["Starts the thread running", "Blocks the calling code until that thread finishes", "Immediately kills the thread", "Creates a copy of the thread"],
          correctAnswerIndex: 1,
          explanation: "join() pauses the calling code until the target thread has completed.",
        },
        {
          question: "If you call start() on three threads in a loop and then call join() on all three in a second loop, roughly what happens?",
          options: [
            "The threads run one after another, waiting for each to finish before starting the next",
            "The threads run concurrently, and the program waits for all three to finish before continuing",
            "Only the first thread actually runs",
            "join() must be called immediately after each start() or the thread never runs",
          ],
          correctAnswerIndex: 1,
          explanation: "Starting all threads before joining any of them lets them run concurrently; the second loop then waits for each to finish.",
        },
      ],
      commonMistakes: [
        "Calling join() immediately after each start() inside the same loop, which accidentally makes threads run one at a time instead of concurrently.",
        "Forgetting to call join() at all, so the main program can finish or move on before spawned threads complete their work.",
      ],
      deliverables: ["main.py creating, starting, and joining at least three threads"],
      assessmentCriteria: [
        "Threads are started before any of them are joined, allowing genuine concurrency",
        "The program correctly waits for all threads to finish before printing the final message",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'import threading\nimport time\n\ndef worker(name, delay):\n    time.sleep(delay)\n    print(f"{name} finished after {delay}s")\n\nthreads = [\n    threading.Thread(target=worker, args=("A", 0.3)),\n    threading.Thread(target=worker, args=("B", 0.1)),\n    threading.Thread(target=worker, args=("C", 0.2)),\n]\n\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\n\nprint("All workers finished")',
        explanation: "Starting every thread before joining any of them lets all three sleep calls overlap, so B usually finishes before A even though A was started first.",
      },
      completionStatus: "not_started",
    },
    {
      title: "The GIL: CPU-bound vs I/O-bound Work",
      goal: "Understand, in plain language, what the Global Interpreter Lock is and why it matters for choosing between threads and other approaches.",
      videoTitle: "Python's GIL Explained: CPU-bound vs I/O-bound Work",
      videoSearchQuery: "python GIL global interpreter lock explained cpu bound io bound",
      videoLearningGoal: "See a plain-language explanation of the GIL and a demonstration comparing threaded performance on a CPU-heavy task versus an I/O-heavy task.",
      recommendedChannels: ["ArjanCodes", "Tech With Tim"],
      keyTakeaways: [
        "The GIL (Global Interpreter Lock) allows only one thread to execute Python bytecode at a time in the standard CPython interpreter, even on a multi-core machine.",
        "For I/O-bound work, such as waiting on files, network, or sleep, threads still help because the GIL is released while a thread waits.",
        "For CPU-bound work, such as heavy computation, threads generally don't speed things up in CPython, because the GIL prevents them from truly running Python code in parallel.",
      ],
      notes:
        "The GIL is a lock inside CPython, the standard Python interpreter, that only lets one thread execute Python bytecode at any given instant, no matter how many CPU cores your machine has. This sounds like it defeats the purpose of threading, but it doesn't, for one important category of work.",
      conceptExplanation:
        "When a thread is waiting on something outside the CPU, like time.sleep(), reading a file, or a network response, it releases the GIL, letting another thread run Python code during that wait. This is why threading genuinely speeds up I/O-bound programs: the waiting overlaps. But when a thread is doing pure computation, like a tight loop of math, it holds the GIL the whole time, so a second thread doing similar computation can't actually run in parallel; it just waits its turn. For CPU-bound work, Python's multiprocessing module, which runs separate processes each with its own interpreter and GIL, is the standard workaround, though it comes with more overhead and complexity than threading.",
      whyItMatters: "Understanding the GIL prevents a common mistake: reaching for threading to speed up a CPU-heavy calculation and being confused when it doesn't get faster, or even gets slower.",
      practicalTask:
        "Write a CPU-bound function busy_count(n) that does a tight loop counting up to n, with no sleep and no I/O, doing simple arithmetic each iteration. Time how long it takes to run busy_count(a large number) twice sequentially, then time how long it takes to run it twice using two threads with start() and join(). Print both timings and, in a comment, explain what you observe based on this lesson's explanation of the GIL.",
      challenge: "Write a second, I/O-bound function that just calls time.sleep(1), and compare the same sequential-versus-threaded timing for two calls to that function instead, noting in a comment how differently threading behaves for I/O-bound work.",
      expectedResult: "The CPU-bound comparison shows threading provides little to no speedup, and sometimes even a slight slowdown from thread overhead, while the I/O-bound comparison with time.sleep() shows a clear speedup from threading.",
      tests: [
        "Both a CPU-bound timing comparison and an I/O-bound timing comparison are demonstrated with printed timings",
        "A comment correctly explains why the two comparisons behave differently, referencing the GIL",
      ],
      hint: "time.perf_counter() before and after a block of code, subtracted, gives you a precise elapsed time in seconds for that comparison.",
      lessonAssessment: [
        {
          question: "In CPython, what does the GIL (Global Interpreter Lock) restrict?",
          options: ["How many threads can be created", "Only one thread can execute Python bytecode at a time, even on a multi-core machine", "How many variables a program can have", "Nothing in modern Python versions"],
          correctAnswerIndex: 1,
          explanation: "The GIL ensures only one thread executes Python bytecode at any given moment in the standard CPython interpreter.",
        },
        {
          question: "For which kind of workload does Python's threading module typically provide a real speedup, given the GIL?",
          options: ["CPU-bound work like heavy math loops", "I/O-bound work like waiting on files, network calls, or sleeps", "Neither kind of work benefits from threading", "Both equally"],
          correctAnswerIndex: 1,
          explanation: "Threads release the GIL while waiting on I/O, so overlapping those waits produces a real speedup for I/O-bound work.",
        },
      ],
      commonMistakes: [
        "Using threading to try to speed up a CPU-heavy computation and being surprised when it doesn't get faster because of the GIL.",
        "Assuming the GIL means Python threads are useless, when they're genuinely effective for I/O-bound work.",
      ],
      deliverables: ["main.py comparing sequential vs threaded timing for both a CPU-bound task and an I/O-bound task"],
      assessmentCriteria: [
        "Both comparisons are correctly timed and printed",
        "The written explanation correctly connects the results to the GIL and CPU-bound vs I/O-bound behavior",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "python",
        code: 'import time\nimport threading\n\ndef busy_count(n):\n    total = 0\n    for i in range(n):\n        total += i\n    return total\n\nstart = time.perf_counter()\nbusy_count(5_000_000)\nbusy_count(5_000_000)\nprint("Sequential:", time.perf_counter() - start)\n\nstart = time.perf_counter()\nthreads = [threading.Thread(target=busy_count, args=(5_000_000,)) for _ in range(2)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\nprint("Threaded:", time.perf_counter() - start)',
        explanation: "Because busy_count is CPU-bound, the GIL prevents the two threads from truly running Python bytecode in parallel, so the threaded version rarely beats the sequential one.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Coordinating Threads Safely with Locks, and When to Reach for Multiprocessing",
      goal: "Use a Lock to protect shared data from race conditions, and understand conceptually when multiprocessing is the better tool.",
      videoTitle: "Python Thread Locks and Race Conditions Explained",
      videoSearchQuery: "python threading lock race condition tutorial",
      videoLearningGoal: "See a race condition happen on shared data without a lock, then see threading.Lock fix it.",
      recommendedChannels: ["Corey Schafer", "ArjanCodes"],
      keyTakeaways: [
        "A race condition happens when multiple threads read and write shared data at the same time, producing incorrect or inconsistent results.",
        "threading.Lock() provides acquire()/release(), or a with block, to ensure only one thread modifies shared data at a time.",
        "multiprocessing runs separate processes with separate interpreters, sidestepping the GIL entirely, which makes it a better fit than threading for CPU-bound parallelism.",
      ],
      notes:
        "When multiple threads read and modify the same shared variable without coordination, their operations can interleave in unpredictable ways, producing a final result that's wrong, even though each individual line of code looks correct. A Lock fixes this by ensuring only one thread can be inside a protected section of code at a time.",
      conceptExplanation:
        "counter = 0; lock = threading.Lock(); def increment(): global counter; with lock: counter += 1 ensures that even if many threads call increment() concurrently, only one at a time actually executes counter += 1, preventing lost updates. Without the lock, two threads could both read the same old value of counter before either writes back the incremented result, silently losing one of the increments. For CPU-bound parallelism, not just concurrency during waiting, multiprocessing.Process is generally the better tool than threading, since each process gets its own Python interpreter and its own GIL, allowing genuine parallel computation across CPU cores, at the cost of more overhead and the inability to directly share plain Python objects between processes.",
      whyItMatters: "Race conditions are a classic source of rare, hard-to-reproduce bugs in concurrent programs; knowing when a Lock is needed, and when multiprocessing is the more appropriate tool entirely, prevents both broken data and wasted threading effort on the wrong kind of workload.",
      practicalTask:
        "Write a shared counter variable and a function unsafe_increment() that reads the counter, sleeps for a tiny fraction of a second to widen the window for a race condition, then writes back counter + 1. Run it from several threads without a lock and print the final counter value, noting that it's often less than expected. Then write a safe_increment() version using a threading.Lock() around the read-modify-write, run it the same way, and print the final counter value, confirming it now matches the expected total.",
      challenge: "In a comment, describe a scenario from this course, or a hypothetical program, where you would reach for multiprocessing instead of threading, and explain why, referencing the GIL and CPU-bound versus I/O-bound work.",
      expectedResult: "The unsafe version's final counter value is unreliable and often lower than expected; the lock-protected version's final counter value always matches the expected total exactly.",
      tests: [
        "An unsafe, unlocked increment function demonstrates an unreliable final counter value across multiple runs",
        "A lock-protected increment function reliably produces the correct final counter value",
      ],
      hint: "with lock: inside a function works just like with open(...):; it automatically acquires and releases the lock, even if an error occurs inside the block.",
      lessonAssessment: [
        {
          question: "What is a race condition?",
          options: [
            "A program that runs too fast",
            "A bug caused by multiple threads reading and writing shared data without coordination, producing inconsistent results",
            "An error raised when a thread is never started",
            "A syntax error in threading code",
          ],
          correctAnswerIndex: 1,
          explanation: "A race condition arises when concurrent operations on shared data interleave in a way that produces an incorrect final result.",
        },
        {
          question: "Why might multiprocessing be preferred over threading for a CPU-bound task in Python?",
          options: [
            "multiprocessing is always simpler to write",
            "Each process has its own interpreter and GIL, allowing genuine parallel computation across CPU cores",
            "multiprocessing does not require importing any module",
            "Threads cannot run CPU-bound code at all",
          ],
          correctAnswerIndex: 1,
          explanation: "Because each process runs its own interpreter and GIL, multiprocessing achieves true parallelism for CPU-bound work that threading cannot.",
        },
      ],
      commonMistakes: [
        "Forgetting to protect shared, mutable data with a lock, leading to intermittent, hard-to-reproduce bugs that don't show up on every run.",
        "Holding a lock for longer than necessary, which can eliminate most of the concurrency benefit by forcing threads to wait on each other unnecessarily.",
      ],
      deliverables: ["main.py demonstrating an unsafe race condition and a lock-protected fix for the same shared counter"],
      assessmentCriteria: ["The unsafe version visibly demonstrates inconsistent results", "The lock-protected version reliably produces the correct final value"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "python",
        code: 'import threading\n\ncounter = 0\nlock = threading.Lock()\n\ndef safe_increment():\n    global counter\n    with lock:\n        current = counter\n        current += 1\n        counter = current\n\nthreads = [threading.Thread(target=safe_increment) for _ in range(100)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\n\nprint(counter)',
        explanation: "with lock: ensures only one thread at a time can read and update counter, so all 100 increments are counted correctly instead of some being lost.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Concurrency Basics Assessment",
    questions: [
      {
        question: "What does calling start() on a threading.Thread object do?",
        options: ["Blocks until the thread finishes", "Begins running the thread's target function concurrently", "Creates the thread object", "Does nothing until join() is also called"],
        correctAnswerIndex: 1,
        explanation: "start() launches the thread's target function to run concurrently with the rest of the program.",
      },
      {
        question: "What does join() do?",
        options: ["Starts a thread", "Blocks the calling code until that thread finishes", "Kills the thread immediately", "Merges two threads into one"],
        correctAnswerIndex: 1,
        explanation: "join() pauses execution until the target thread completes.",
      },
      {
        question: "What is the correct pattern for running several threads concurrently rather than one at a time?",
        options: [
          "Call start() and join() on each thread before moving to the next",
          "Call start() on all threads first in one loop, then call join() on all of them in a separate loop",
          "Only ever create one thread at a time",
          "Never call join()",
        ],
        correctAnswerIndex: 1,
        explanation: "Starting all threads first lets them run concurrently; joining them afterward waits for each to complete.",
      },
      {
        question: "What does the GIL (Global Interpreter Lock) restrict in CPython?",
        options: ["How many threads can be created", "Only one thread can execute Python bytecode at a time, even on a multi-core machine", "How many variables a program can hold", "Nothing; it was removed in recent Python versions"],
        correctAnswerIndex: 1,
        explanation: "The GIL limits Python bytecode execution to one thread at a time in the standard CPython interpreter.",
      },
      {
        question: "For which kind of workload does Python threading typically provide a genuine speedup?",
        options: ["CPU-bound work like heavy math loops", "I/O-bound work like waiting on files, network calls, or sleeps", "Neither", "Both equally in every case"],
        correctAnswerIndex: 1,
        explanation: "Threads release the GIL while waiting on I/O, allowing real overlap and speedup for I/O-bound work.",
      },
      {
        question: "Why might multiprocessing be preferred over threading for CPU-bound parallel work?",
        options: ["It is always simpler to write", "Each process has its own interpreter and GIL, allowing genuine parallel computation across CPU cores", "It requires no imports", "Threads cannot execute any code at all"],
        correctAnswerIndex: 1,
        explanation: "Separate processes each run their own interpreter, sidestepping the GIL and enabling true parallel CPU-bound computation.",
      },
      {
        question: "What is a race condition?",
        options: ["A program that runs too quickly", "A bug caused by multiple threads reading and writing shared data without coordination, producing inconsistent results", "An error from forgetting to import threading", "A syntax error in a loop"],
        correctAnswerIndex: 1,
        explanation: "A race condition occurs when unsynchronized concurrent access to shared data produces incorrect results.",
      },
      {
        question: "What does threading.Lock() help prevent?",
        options: ["Programs from running at all", "Multiple threads from modifying shared data at the same time in a way that corrupts it", "Threads from ever starting", "Functions from returning values"],
        correctAnswerIndex: 1,
        explanation: "A Lock ensures only one thread at a time can execute the protected section of code that modifies shared data.",
      },
      {
        question: "What is the safest way to use a Lock around a section of shared-data code?",
        options: [
          "Call acquire() and release() manually and hope no exception occurs in between",
          "Use a with lock: block, which acquires and releases automatically, even if an exception occurs",
          "Avoid locks entirely and hope for the best",
          "Create a new Lock for every single line of code",
        ],
        correctAnswerIndex: 1,
        explanation: "A with lock: block guarantees the lock is released even if an exception is raised inside it, avoiding a permanently held lock.",
      },
      {
        question: "Which statement best summarizes when to reach for multiprocessing instead of threading?",
        options: [
          "Always use multiprocessing, never threading",
          "Use multiprocessing for CPU-bound work that needs true parallelism; use threading for I/O-bound work that mostly waits",
          "Multiprocessing and threading are always interchangeable with no tradeoffs",
          "Never use either; sequential code is always best",
        ],
        correctAnswerIndex: 1,
        explanation: "The right tool depends on the workload: multiprocessing sidesteps the GIL for CPU-bound work, while threading is efficient for I/O-bound waiting.",
      },
    ],
  },
  assignment:
    "Build a 'Parallel Task Simulator' with no real network calls: write a function simulate_task(name, delay) that uses time.sleep(delay) to represent time-consuming work, then prints a completion message. Run at least four calls to simulate_task with different delays using separate threads, starting all of them before joining any of them. Print the total elapsed time for the threaded run, then run the same four calls sequentially, without threads, and print that elapsed time too, comparing the two and explaining the difference in a comment referencing I/O-bound work and the GIL.",
  assignmentDeliverables: [
    "main.py comparing threaded versus sequential timing for at least four simulated tasks",
    "Printed timings for both versions and a comment explaining the difference",
  ],
  assignmentAssessmentCriteria: [
    "Threads are started before any are joined, enabling genuine concurrency",
    "The written explanation correctly connects the timing difference to I/O-bound work and the GIL",
  ],
  miniProject:
    "Build a 'Thread-Safe Task Counter': create a shared dictionary mapping category names to counts, such as urgent, normal, and low, each starting at zero. Write a function record_task(category) that safely increments the count for a given category using a threading.Lock() to protect the shared dictionary. Start multiple threads that each call record_task() many times across different categories, join them all, and print the final counts per category, confirming the total matches the expected number of calls exactly.",
  miniProjectDeliverables: [
    "main.py with a lock-protected shared dictionary updated concurrently by multiple threads",
    "Printed final counts per category that exactly match the expected totals",
  ],
  miniProjectAssessmentCriteria: [
    "The shared dictionary is correctly protected with a Lock during every update",
    "Final counts are accurate and consistent across runs",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
