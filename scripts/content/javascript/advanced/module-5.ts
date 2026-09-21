import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace. Keep any deliberately slow loops short so runs finish quickly.";

export const module5: GeneratedModule = {
  title: "The Event Loop & Concurrency Model",
  description:
    "Get a precise, practical understanding of how JavaScript actually schedules work: the single-threaded call stack, the macrotask (task) queue versus the microtask queue, and the exact priority rules that determine the real order mixed synchronous and asynchronous code runs in.",
  completionStatus: "locked",
  lessons: [
    {
      title: "The Call Stack and Single-Threaded Execution",
      goal: "Understand JavaScript's single-threaded call stack, how synchronous function calls push and pop frames on it, and why a long-running synchronous operation blocks everything else.",
      videoTitle: "JavaScript Call Stack Explained",
      videoSearchQuery: "javascript call stack single threaded execution tutorial",
      videoLearningGoal: "See function calls pushed onto and popped off the call stack one at a time, and a blocking synchronous loop delay a queued setTimeout callback from running.",
      recommendedChannels: ["Fireship", "Web Dev Simplified"],
      keyTakeaways: [
        "JavaScript executes on a single call stack: only one function runs at a time, and each function call is pushed onto the stack and popped off when it returns.",
        "Because there's only one call stack, a long-running synchronous operation blocks everything else, including any already-scheduled asynchronous callbacks, until it finishes.",
        "Asynchronous APIs like setTimeout don't run their callback on the call stack immediately; they schedule it elsewhere and only place it back on the stack once it's ready and the stack is completely empty.",
      ],
      notes:
        "Every function call pushes a new frame onto the call stack; when that function returns, its frame is popped off. This happens entirely synchronously, one function at a time, no matter how many asynchronous operations are pending elsewhere.",
      conceptExplanation:
        "function first() { second(); } function second() { third(); } function third() { console.log('deepest'); } first(); pushes first, then second, then third onto the stack in order, then pops them off in reverse as each returns. If third() instead contained a tight, long-running loop with no yielding pause, the entire program, including any setTimeout callbacks waiting to run, would be stuck behind it until that loop finishes, because the call stack must be empty before anything else can execute.",
      whyItMatters:
        "Understanding the call stack explains why one truly slow synchronous function can make an entire JavaScript program feel frozen, and why asynchronous APIs exist in the first place: to avoid blocking that single stack.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Write three nested functions, first(), second(), third(), each calling the next, with third() logging a message. Then write a deliberately slow synchronous function busyWait(ms) that loops using Date.now() comparisons until the given number of milliseconds has passed, with no yielding. Call setTimeout(() => console.log('timeout fired'), 0) before calling busyWait(300), then log a message immediately after busyWait returns, and observe in your printed output that the timeout callback still doesn't run until after busyWait finishes completely, even though it was scheduled for 0ms.",
      challenge:
        "Time how long the whole script actually takes using Date.now() before and after everything runs, and in a comment compare that total time to the busyWait duration you chose, explaining why the timeout callback couldn't have run any earlier, no matter how small its requested delay was.",
      expectedResult:
        "The setTimeout callback's message appears only after busyWait's own message, confirming the call stack must fully clear, including the busyWait call, before that queued callback can run.",
      tests: [
        "Nested synchronous function calls execute in an order matching typical call stack push/pop behavior",
        "A setTimeout callback scheduled with a 0ms delay is shown to still wait until a long-running synchronous call finishes",
      ],
      hint: "setTimeout(fn, 0) schedules fn to run as soon as possible, but 'as soon as possible' always means after the current call stack is completely empty, never in the middle of it.",
      lessonAssessment: [
        {
          question: "How many functions can be actively running on JavaScript's call stack at once?",
          options: ["As many as the CPU has cores", "Exactly one at a time", "Unlimited, running in parallel", "Two: one synchronous and one asynchronous"],
          correctAnswerIndex: 1,
          explanation: "JavaScript's call stack is single-threaded: only one function executes at any given moment.",
        },
        {
          question: "Why doesn't setTimeout(fn, 0) run fn immediately?",
          options: [
            "Because 0ms is rounded up to 1 second internally",
            "Because the call stack must be completely empty before any queued callback can run, regardless of the requested delay",
            "Because setTimeout always ignores a delay of 0",
            "Because fn must be an async function to run at all",
          ],
          correctAnswerIndex: 1,
          explanation: "A scheduled callback can only run once the current call stack has fully cleared, no matter how small the delay passed to setTimeout was.",
        },
      ],
      commonMistakes: [
        "Assuming setTimeout(fn, 0) runs fn essentially instantly, when it actually only runs after the current call stack has fully cleared, no matter how small the requested delay is.",
        "Writing a long, tight synchronous loop and being surprised that nothing else, including other scheduled callbacks, runs until it finishes, since JavaScript has only one call stack.",
      ],
      deliverables: ["script.js demonstrating nested synchronous calls and a busy-wait loop delaying a scheduled setTimeout callback"],
      assessmentCriteria: [
        "Nested function calls correctly demonstrate call stack push and pop order",
        "The setTimeout callback is correctly shown to wait until the busy-wait loop finishes, despite its 0ms delay",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: "function busyWait(ms) {\n  const end = Date.now() + ms;\n  while (Date.now() < end) {\n    // deliberately blocking the call stack\n  }\n}\n\nsetTimeout(() => console.log('timeout fired'), 0);\nconsole.log('starting busy wait');\nbusyWait(300);\nconsole.log('busy wait finished');",
        explanation: "Even though the timeout is scheduled for 0ms and comes first in the source, 'timeout fired' only logs after 'busy wait finished', because the call stack stays occupied by busyWait until it returns.",
      },
      completionStatus: "not_started",
    },
    {
      title: "The Task Queue (Macrotasks) vs the Microtask Queue",
      goal: "Distinguish the microtask queue used by Promises from the macrotask (task) queue used by setTimeout, and understand why microtasks always run before the next macrotask.",
      videoTitle: "JavaScript Microtask Queue vs Task Queue Explained",
      videoSearchQuery: "javascript microtask queue macrotask queue event loop tutorial",
      videoLearningGoal: "See a Promise callback run before a setTimeout callback even when the setTimeout was scheduled first in the source code, and understand the two separate queues that explain why.",
      recommendedChannels: ["Jack Herrington", "Theo - t3.gg"],
      keyTakeaways: [
        "setTimeout callbacks go into the macrotask (or 'task') queue; Promise .then()/.catch()/.finally() callbacks, and the code that runs after an await, go into the microtask queue.",
        "After each single macrotask finishes and the call stack is empty, the event loop fully drains the entire microtask queue before picking up the next macrotask.",
        "This is why a Promise.resolve().then(...) scheduled after a setTimeout(fn, 0) still runs before that setTimeout's callback: the microtask queue is always emptied first.",
      ],
      notes:
        "setTimeout and Promises both schedule work to run later, but they use two different queues with different priority, and mixing them up leads to genuinely surprising ordering bugs until you've seen how the event loop actually prioritizes them.",
      conceptExplanation:
        "console.log('1'); setTimeout(() => console.log('2'), 0); Promise.resolve().then(() => console.log('3')); console.log('4'); logs 1, 4, 3, 2 in that exact order. '1' and '4' run synchronously first, since neither is scheduled at all; once the call stack is empty, the microtask queue is drained completely, logging '3'; only after that does the event loop move to the next macrotask from the task queue, logging '2'. Even a setTimeout(fn, 0) scheduled before a Promise .then() still loses to it, because the entire microtask queue is checked and drained after every single macrotask, without exception.",
      whyItMatters:
        "This exact ordering rule explains a huge share of 'why did my async code run in that order' confusion; once you know microtasks always drain before the next macrotask, the event loop stops being mysterious.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Write a script that logs a distinct message at each of these points, in this exact order in your source code: a synchronous console.log first; a setTimeout(..., 0) callback logging a message; a Promise.resolve().then(...) logging a message; and a final synchronous console.log. Run it, observe the actual printed order, and write a comment explaining why the Promise's message appears before the setTimeout's message even though the setTimeout was scheduled earlier in the source code.",
      challenge:
        "Add a second .then() chained after the first Promise.resolve().then(...) call, and confirm both microtask callbacks still run before the setTimeout callback, demonstrating that the entire microtask queue drains, not just one microtask, before the next macrotask runs.",
      expectedResult:
        "The printed order shows both synchronous logs first, then the Promise-based microtask log, and only then the setTimeout-based macrotask log, regardless of the order they were scheduled in the source code.",
      tests: [
        "Synchronous code, a microtask (Promise .then()), and a macrotask (setTimeout) are all demonstrated together in one script",
        "The printed output correctly shows the microtask callback running before the macrotask callback, even when the macrotask was scheduled first in the source",
      ],
      hint: "The macrotask queue holds tasks to run one at a time, but before the event loop grabs the next macrotask, it always empties the entire microtask queue first, however many microtasks are currently in it.",
      lessonAssessment: [
        {
          question: "Which queue do Promise .then() callbacks go into?",
          options: ["The macrotask (task) queue", "The microtask queue", "There is no separate queue for them", "The same queue as setTimeout, with identical priority"],
          correctAnswerIndex: 1,
          explanation: "Promise callbacks are scheduled on the microtask queue, which has higher priority than the macrotask queue.",
        },
        {
          question: "What does the event loop always do before running the next macrotask?",
          options: [
            "Nothing extra; it runs macrotasks strictly in scheduled order",
            "It fully drains the entire microtask queue first",
            "It runs exactly one microtask, then moves on regardless of how many remain",
            "It skips microtasks entirely if a macrotask is already queued",
          ],
          correctAnswerIndex: 1,
          explanation: "The event loop always empties the whole microtask queue after the current task and before picking up the next macrotask.",
        },
      ],
      commonMistakes: [
        "Assuming code scheduled earlier in the source always runs first, when the type of queue, microtask versus macrotask, matters more than the scheduling order between different queue types.",
        "Forgetting that the entire microtask queue is drained before the next macrotask, not just a single microtask, which matters once multiple .then() calls are chained together.",
      ],
      deliverables: ["script.js demonstrating that a microtask (Promise .then()) runs before a macrotask (setTimeout) regardless of scheduling order"],
      assessmentCriteria: [
        "The script correctly mixes synchronous code, a microtask, and a macrotask",
        "The written comment correctly explains why the microtask ran before the macrotask",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: "console.log('1');\n\nsetTimeout(() => console.log('2 (macrotask)'), 0);\n\nPromise.resolve().then(() => console.log('3 (microtask)'));\n\nconsole.log('4');",
        explanation: "The output is 1, 4, 3 (microtask), 2 (macrotask): synchronous code runs first, then the entire microtask queue drains, and only then does the event loop reach the next macrotask.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Predicting Execution Order: Sync Code, Microtasks, and Macrotasks Together",
      goal: "Given a mix of synchronous code, microtasks, and macrotasks, correctly predict the full order code will actually run in.",
      videoTitle: "JavaScript Event Loop: Predicting Execution Order",
      videoSearchQuery: "javascript event loop execution order sync microtask macrotask tutorial",
      videoLearningGoal: "Walk through a script mixing synchronous code, setTimeout calls, and Promise chains, predicting the output before running it, then confirming the prediction against the real result.",
      recommendedChannels: ["Fireship", "Jack Herrington"],
      keyTakeaways: [
        "The full priority order is: run all synchronous code in the current call stack to completion first, then drain the entire microtask queue, then run exactly one macrotask, then drain the microtask queue again, and repeat.",
        "await pauses a function and schedules everything after it as a microtask continuation, so async/await follows the same microtask-first rules as explicit .then() chains, even though it looks synchronous.",
        "Multiple setTimeout calls with the same delay run in the order they were scheduled, but any pending microtasks always still run in between the current macrotask finishing and the next setTimeout macrotask starting.",
      ],
      notes:
        "Once you know the three rules from this module, a single call stack, microtasks draining before the next macrotask, and multiple macrotasks queued in order, you can trace almost any real mixed script by hand, which is a genuinely useful debugging skill.",
      conceptExplanation:
        "async function asyncFn() { console.log('A'); await null; console.log('B'); } console.log('start'); setTimeout(() => console.log('timeout'), 0); asyncFn(); Promise.resolve().then(() => console.log('promise')); console.log('end'); logs start, A, end, B, promise, timeout. 'start' and 'A' run synchronously, since asyncFn() runs synchronously up to its first await; 'end' also runs synchronously since asyncFn paused at await and returned control back immediately; then the microtask queue drains in the order its callbacks were queued, first the continuation after await null, logging 'B', then the explicit Promise .then(), logging 'promise'; only after the microtask queue is completely empty does the setTimeout macrotask finally run, logging 'timeout' last.",
      whyItMatters:
        "Real production bugs, like a UI update that seems to happen 'too early' or 'too late', or a race between two async operations, very often come down to exactly this ordering; being able to trace it by hand turns a confusing bug into a quick diagnosis.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Write a script combining at least: two console.log statements outside any function, two setTimeout calls with a 0ms delay logging different messages, one Promise.resolve().then() chain, and one async function that logs something before and after an await null. Before running it, write your predicted output order as a comment at the top of the file. Run the script, compare the actual printed order to your prediction, and correct your comment if you predicted anything wrong.",
      challenge:
        "Add a third setTimeout call with a 0ms delay that itself contains a Promise.resolve().then() call inside its callback, and predict, then confirm, exactly where that inner microtask fires relative to the other setTimeout callbacks.",
      expectedResult:
        "Your written prediction, after correction if needed, exactly matches the script's real printed output order, and the comment correctly explains the reasoning for at least one non-obvious ordering decision.",
      tests: [
        "The script combines synchronous code, at least one macrotask (setTimeout), and at least one microtask (Promise or await) in a single trace",
        "A written prediction of the execution order is compared against, and corrected to match, the actual printed output",
      ],
      hint: "Trace it in passes: first, everything synchronous top to bottom, including any async function body up to its first await; second, drain every microtask in the order it was queued; third, run the next macrotask, then repeat from the microtask step.",
      lessonAssessment: [
        {
          question: "What runs first: all synchronous code in the current call stack, or the microtask queue?",
          options: [
            "The microtask queue always runs first, before any synchronous code",
            "All synchronous code in the current call stack runs to completion first",
            "They run simultaneously",
            "It depends on which was written first in the file",
          ],
          correctAnswerIndex: 1,
          explanation: "Synchronous code always finishes running before the event loop even looks at the microtask queue.",
        },
        {
          question: "How does await relate to the microtask queue?",
          options: [
            "It has no relationship to microtasks at all",
            "The code after an await runs as a microtask continuation once the awaited Promise settles",
            "await pauses the entire program, including all other scripts",
            "await always schedules its continuation as a macrotask, like setTimeout",
          ],
          correctAnswerIndex: 1,
          explanation: "Once an awaited Promise settles, the rest of the async function resumes as a microtask, following the same priority rules as an explicit .then().",
        },
      ],
      commonMistakes: [
        "Assuming an async function's entire body runs asynchronously from its very first line, when in fact it runs synchronously up until its first await.",
        "Losing track of ordering once multiple setTimeout calls and multiple Promise chains are mixed together, instead of tracing them pass by pass: synchronous code, then microtasks, then one macrotask, then repeat.",
      ],
      deliverables: ["script.js with a written prediction comment followed by a script mixing synchronous code, microtasks, and macrotasks"],
      assessmentCriteria: [
        "The script correctly combines synchronous code, at least one microtask, and at least two macrotasks",
        "The prediction comment is corrected to accurately match and explain the real printed execution order",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "javascript",
        code: "async function asyncFn() {\n  console.log('A');\n  await null;\n  console.log('B');\n}\n\nconsole.log('start');\nsetTimeout(() => console.log('timeout'), 0);\nasyncFn();\nPromise.resolve().then(() => console.log('promise'));\nconsole.log('end');",
        explanation: "The output is start, A, end, B, promise, timeout: synchronous code (including asyncFn up to its first await) runs first, then the microtask queue drains in the order its callbacks were queued, and only then does the setTimeout macrotask run.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "The Event Loop & Concurrency Model Assessment",
    questions: [
      {
        question: "How many functions can be actively executing on JavaScript's call stack at any given moment?",
        options: ["As many as there are CPU cores", "Exactly one", "Unlimited", "Two, one sync and one async"],
        correctAnswerIndex: 1,
        explanation: "JavaScript's call stack is single-threaded, so only one function runs at a time.",
      },
      {
        question: "Why doesn't a long-running synchronous loop let a setTimeout(fn, 0) callback run in the middle of it?",
        options: [
          "Because setTimeout callbacks always have lower priority than any loop",
          "Because the call stack must be completely empty before a queued callback can run, and the loop occupies the stack the whole time",
          "Because JavaScript pauses loops automatically after 100ms",
          "Because setTimeout callbacks require a separate thread that doesn't exist",
        ],
        correctAnswerIndex: 1,
        explanation: "A scheduled callback can only run once the current call stack clears, and a long synchronous loop keeps the stack occupied the entire time.",
      },
      {
        question: "Which queue does a setTimeout callback get placed into?",
        options: ["The microtask queue", "The macrotask (task) queue", "Neither; it runs immediately", "A queue shared identically with Promise callbacks"],
        correctAnswerIndex: 1,
        explanation: "setTimeout schedules its callback on the macrotask queue, which is checked after the microtask queue is empty.",
      },
      {
        question: "Which queue does a Promise .then() callback get placed into?",
        options: ["The macrotask queue", "The microtask queue", "It runs synchronously with no queue involved", "A separate rendering queue"],
        correctAnswerIndex: 1,
        explanation: "Promise callbacks are scheduled on the microtask queue, which has priority over the macrotask queue.",
      },
      {
        question: "What does the event loop do immediately after the current task finishes, before picking up the next macrotask?",
        options: [
          "Nothing; it goes straight to the next macrotask",
          "It fully drains the entire microtask queue",
          "It runs exactly one microtask and stops",
          "It restarts the whole program",
        ],
        correctAnswerIndex: 1,
        explanation: "The event loop always empties the entire microtask queue before it moves on to the next macrotask.",
      },
      {
        question: "In console.log('1'); setTimeout(() => console.log('2'), 0); Promise.resolve().then(() => console.log('3')); console.log('4');, what is the correct output order?",
        options: ["1, 2, 3, 4", "1, 4, 3, 2", "1, 3, 4, 2", "4, 1, 2, 3"],
        correctAnswerIndex: 1,
        explanation: "Synchronous logs ('1', '4') run first, then the microtask ('3') drains, and only then does the macrotask ('2') run.",
      },
      {
        question: "How much of an async function's body runs synchronously, before yielding to the event loop?",
        options: [
          "None of it; the whole function is asynchronous from the first line",
          "Everything up to and including its first await expression",
          "The entire function always runs synchronously with no pauses",
          "Only the function's return statement",
        ],
        correctAnswerIndex: 1,
        explanation: "An async function executes synchronously until it hits its first await, at which point it pauses and returns control.",
      },
      {
        question: "What happens to the code that comes after an await once the awaited Promise settles?",
        options: [
          "It runs immediately, interrupting whatever else is currently on the call stack",
          "It is scheduled to run as a microtask, following the same priority as an explicit .then() callback",
          "It is scheduled as a macrotask, just like setTimeout",
          "It never runs unless a synchronous log statement follows it",
        ],
        correctAnswerIndex: 1,
        explanation: "The continuation after an await behaves like a microtask, running with the same priority as a Promise .then() callback.",
      },
      {
        question: "If two Promise .then() callbacks are queued and one setTimeout(fn, 0) callback is also queued, in what order do they run?",
        options: [
          "The setTimeout callback always runs first",
          "Both .then() callbacks run before the setTimeout callback, since the whole microtask queue drains first",
          "They run in an unpredictable, random order",
          "Only one of the .then() callbacks runs before setTimeout; the other runs after",
        ],
        correctAnswerIndex: 1,
        explanation: "The entire microtask queue, however many callbacks it holds, always drains completely before the next macrotask runs.",
      },
      {
        question: "What is the most reliable way to figure out the execution order of a script mixing synchronous code, microtasks, and macrotasks?",
        options: [
          "Guess based on which line appears first in the source file",
          "Trace it in passes: run all synchronous code first, then drain the microtask queue, then run one macrotask, and repeat",
          "Assume setTimeout callbacks always run before Promise callbacks",
          "Assume everything runs strictly top to bottom regardless of async or sync",
        ],
        correctAnswerIndex: 1,
        explanation: "Tracing in strict passes, synchronous code, then microtasks, then one macrotask, then repeating, correctly predicts real execution order.",
      },
    ],
  },
  assignment:
    "Build an 'Execution Order Logger': write a script that logs a distinct labeled message at each of the following points, first writing your predicted final printed order as a comment at the top of the file before running anything: one synchronous log at the very start; a setTimeout(...,0) callback; a Promise.resolve().then() callback; a second, later synchronous log; and a second setTimeout(...,0) callback scheduled after the first one. Run the script and compare the real output to your written prediction, correcting the comment if any part of your prediction was wrong, and add one sentence explaining the specific rule behind the biggest surprise in the actual order.",
  assignmentDeliverables: [
    "script.js with a written prediction comment followed by the execution-order logging script itself",
    "Printed output showing the actual order, with the prediction comment corrected to match, plus one sentence explaining the key ordering rule involved",
  ],
  assignmentAssessmentCriteria: [
    "The script correctly mixes synchronous code, a microtask, and at least two macrotasks",
    "The corrected prediction comment accurately explains the real execution order using the module's queue-priority rules",
  ],
  miniProject:
    "Build a 'Task Priority Demo' that makes the microtask-versus-macrotask distinction concrete: write a function scheduleWork(label, useMicrotask) that either schedules a Promise.resolve().then() callback or a setTimeout(...,0) callback logging label, depending on the useMicrotask flag. Call scheduleWork() at least four times with a mix of true and false in a deliberately interleaved order, immediately followed by one synchronous log statement, and confirm the printed order always shows every microtask-flagged call before every macrotask-flagged call, regardless of the order scheduleWork() was actually called in.",
  miniProjectDeliverables: [
    "script.js with a scheduleWork(label, useMicrotask) helper and at least four interleaved calls mixing microtasks and macrotasks",
    "Printed output confirming every microtask-scheduled log appears before every macrotask-scheduled log",
  ],
  miniProjectAssessmentCriteria: [
    "scheduleWork() correctly routes work to either the microtask queue (via Promise) or the macrotask queue (via setTimeout) based on its flag",
    "The printed order correctly demonstrates that all microtasks run before any macrotask, independent of call order",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
