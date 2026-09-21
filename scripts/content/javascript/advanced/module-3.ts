import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module3: GeneratedModule = {
  title: "Iterators & Generators",
  description:
    "Learn the iteration protocol that powers for...of, spread, and destructuring, build a custom object that satisfies it with Symbol.iterator, then write generator functions with function* and yield that implement the same protocol with dramatically less code.",
  completionStatus: "locked",
  lessons: [
    {
      title: "The Iteration Protocol: Symbol.iterator and Building a Custom Iterable",
      goal: "Understand the iteration protocol built on the well-known symbol Symbol.iterator, and build a custom object that works correctly with for...of, spread, and destructuring.",
      videoTitle: "JavaScript Iterators and Symbol.iterator Explained",
      videoSearchQuery: "javascript symbol.iterator custom iterable tutorial",
      videoLearningGoal: "See a for...of loop call a custom object's [Symbol.iterator]() method under the hood, and a hand-built iterator object satisfying the protocol with next().",
      recommendedChannels: ["Fireship", "Web Dev Simplified"],
      keyTakeaways: [
        "An object is iterable if it has a method keyed by the well-known symbol Symbol.iterator that returns an iterator.",
        "An iterator is any object with a next() method that returns an object shaped like { value, done }.",
        "for...of, the spread operator, and array destructuring all work automatically on any object that correctly implements Symbol.iterator, not just arrays and strings.",
      ],
      notes:
        "Arrays, strings, Maps, and Sets are all iterable by built-in design, each defining its own [Symbol.iterator] method internally. You can give that exact same capability to your own objects by implementing the protocol yourself.",
      conceptExplanation:
        "const range = { from: 1, to: 5, [Symbol.iterator]() { let current = this.from; const last = this.to; return { next() { if (current <= last) { return { value: current++, done: false }; } return { value: undefined, done: true }; } }; } }; for (const n of range) console.log(n); works because for...of calls range[Symbol.iterator](), receives back an object with a next() method, and repeatedly calls next() until the returned done is true.",
      whyItMatters:
        "Implementing Symbol.iterator lets custom objects, like a numeric range, a linked list, or a paginated collection, plug directly into every language feature built around iteration: for...of, spread, Array.from, and destructuring.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Build a range object literal with from and to properties that implements [Symbol.iterator]() returning an object with a working next() method. Use it in a for...of loop to print every value, spread it into an array with [...range] and log that array, and destructure the first two values with const [first, second] = range, logging both.",
      challenge:
        "Add a step property to your range object so it can count by twos or more, defaulting to 1 when not provided, and update [Symbol.iterator]() to respect it.",
      expectedResult:
        "for...of prints every expected value in range, spreading it into an array produces an identical array of values, and destructuring correctly pulls the first two values without any manual iteration code.",
      tests: [
        "The custom range object correctly implements [Symbol.iterator] returning an object with a working next() method",
        "for...of, the spread operator, and array destructuring all work correctly on the custom iterable without additional code",
      ],
      hint: "next() must return an object literal shaped like { value, done }, not just the raw value; forgetting to eventually return done: true causes an infinite loop.",
      lessonAssessment: [
        {
          question: "What makes an object 'iterable' in JavaScript?",
          options: [
            "It has a length property",
            "It has a method keyed by Symbol.iterator that returns an iterator",
            "It is defined using an array literal",
            "It has at least one numeric property",
          ],
          correctAnswerIndex: 1,
          explanation: "The iteration protocol specifically requires a [Symbol.iterator] method that returns an iterator object.",
        },
        {
          question: "What shape must the object returned by an iterator's next() method have?",
          options: [
            "Just the raw next value with nothing else",
            "An object like { value, done }",
            "An array of all remaining values",
            "A string describing the current position",
          ],
          correctAnswerIndex: 1,
          explanation: "next() must return an object with a value and a done boolean so consumers like for...of know when to stop.",
        },
      ],
      commonMistakes: [
        "Forgetting to eventually return done: true from next(), which causes for...of and the spread operator to loop forever.",
        "Implementing next() directly on the object instead of returning it from [Symbol.iterator](), which breaks the two-step protocol that for...of relies on.",
      ],
      deliverables: ["script.js with a custom range object implementing the full Symbol.iterator protocol"],
      assessmentCriteria: [
        "[Symbol.iterator] correctly returns an object with a working next() method",
        "for...of, spread, and destructuring all correctly consume the custom iterable",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: "const range = {\n  from: 1,\n  to: 5,\n  [Symbol.iterator]() {\n    let current = this.from;\n    const last = this.to;\n    return {\n      next() {\n        if (current <= last) {\n          return { value: current++, done: false };\n        }\n        return { value: undefined, done: true };\n      },\n    };\n  },\n};\n\nfor (const n of range) {\n  console.log(n);\n}\n\nconsole.log([...range]);\nconst [first, second] = range;\nconsole.log(first, second);",
        explanation: "for...of, spread, and destructuring all call range[Symbol.iterator]() and repeatedly invoke next() until done is true, without any special-case code for this custom object.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Generator Functions: function* and yield",
      goal: "Write generator functions using function* and yield as a dramatically simpler way to implement the iteration protocol.",
      videoTitle: "JavaScript Generators and yield Explained",
      videoSearchQuery: "javascript generator functions yield tutorial",
      videoLearningGoal: "See a generator function pause and resume execution at each yield, producing values lazily and automatically satisfying the iteration protocol.",
      recommendedChannels: ["Fireship", "Jack Herrington"],
      keyTakeaways: [
        "A function declared with function* is a generator function; calling it doesn't run its body immediately, it returns a generator object.",
        "yield pauses the generator's execution and produces a value; calling next() on the generator resumes execution right after the last yield.",
        "Generator objects automatically implement the iteration protocol, so they work directly in for...of, spread, and destructuring, with far less code than a hand-built iterable.",
      ],
      notes:
        "function* rangeGen(from, to) { for (let n = from; n <= to; n++) { yield n; } } produces the exact same for...of behavior as the manual range object from the previous lesson, in a fraction of the code, with no manual next()/done bookkeeping at all.",
      conceptExplanation:
        "Calling rangeGen(1, 5) does not execute the loop yet; it returns a generator object. Each next() call, or each step of a for...of loop, resumes execution right where it left off, runs until the next yield (or the function ends), and returns { value, done }. When the function body finally finishes running, done becomes true automatically, with no manual bookkeeping required from you.",
      whyItMatters:
        "Generator functions are the idiomatic way most real JavaScript code implements custom iteration; they replace pages of manual next()/done bookkeeping with a plain, linear-looking function.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Rewrite the range object from the previous lesson as a generator function rangeGen(from, to, step = 1) using yield, and confirm in a for...of loop that its output matches your earlier object-based version. Then write a second generator, take(iterable, count), that yields only the first count values from any iterable passed to it, using an internal for...of loop with a counter and a break once count is reached, and demonstrate it limiting a long sequence to a handful of values.",
      challenge:
        "Write an infinite generator function naturalNumbers() that yields 1, 2, 3, and so on forever, using a while (true) loop containing yield, and safely consume only the first 5 values from it using your take() helper, proving you never need to run the infinite loop to completion.",
      expectedResult:
        "rangeGen produces output identical to the earlier manual iterable with far less code, and take() correctly limits both a finite and an effectively infinite generator to the requested number of values.",
      tests: [
        "rangeGen uses function* and yield rather than manually implementing next() and done",
        "take() correctly limits an infinite generator to a fixed number of values without ever exhausting it",
      ],
      hint: "A generator function's body only runs incrementally, as it's consumed; calling it does not run any code inside until the first next() call, or the first step of a for...of loop, happens.",
      lessonAssessment: [
        {
          question: "What does calling a function declared with function* return immediately?",
          options: [
            "An array of every value it will eventually produce",
            "A generator object, without running any of the function's body yet",
            "The first yielded value only",
            "undefined, since generator functions have no return value",
          ],
          correctAnswerIndex: 1,
          explanation: "Calling a generator function immediately returns a generator object; none of its body executes until it's iterated.",
        },
        {
          question: "What does the yield keyword do inside a generator function?",
          options: [
            "It ends the function immediately and discards all further code",
            "It pauses the generator's execution and produces a value, resuming from that point on the next next() call",
            "It restarts the generator from the beginning",
            "It converts the generator into a regular array",
          ],
          correctAnswerIndex: 1,
          explanation: "yield pauses execution at that point and hands back a value; the generator resumes exactly there the next time it's advanced.",
        },
      ],
      commonMistakes: [
        "Expecting rangeGen(1, 5) to immediately return an array of values, when it actually returns a generator object that must be iterated to produce anything.",
        "Writing an infinite generator and then accidentally spreading it directly into an array, like [...naturalNumbers()], which never terminates since spread tries to exhaust the entire iterable.",
      ],
      deliverables: ["script.js with a rangeGen generator function and a take(iterable, count) generator limiting any iterable"],
      assessmentCriteria: [
        "rangeGen correctly uses function* and yield to produce values lazily",
        "take() correctly limits an infinite generator to a fixed, finite number of values",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: "function* rangeGen(from, to, step = 1) {\n  for (let n = from; n <= to; n += step) {\n    yield n;\n  }\n}\n\nfunction* take(iterable, count) {\n  let taken = 0;\n  for (const value of iterable) {\n    if (taken >= count) break;\n    yield value;\n    taken += 1;\n  }\n}\n\nfunction* naturalNumbers() {\n  let n = 1;\n  while (true) {\n    yield n;\n    n += 1;\n  }\n}\n\nconsole.log([...rangeGen(1, 10, 2)]);\nconsole.log([...take(naturalNumbers(), 5)]);",
        explanation: "rangeGen pauses at each yield and resumes on the next iteration; take() safely limits the infinite naturalNumbers() generator by stopping itself after 5 values, never exhausting the underlying infinite loop.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Delegating and Communicating with Generators: yield*, return, and next() Arguments",
      goal: "Delegate to other iterables with yield*, understand what a generator's own return value means, and pass values back into a paused generator through next().",
      videoTitle: "JavaScript yield*, Generator Delegation, and Two-Way Communication",
      videoSearchQuery: "javascript yield delegation generator return value next argument tutorial",
      videoLearningGoal: "See yield* flatten values from a nested generator into an outer generator's output, and see a value passed into next() become the result of the yield expression that was paused.",
      recommendedChannels: ["Jack Herrington", "ArjanCodes"],
      keyTakeaways: [
        "yield* delegates iteration to another iterable, including another generator, yielding each of its values in turn as if they were yielded directly by the outer generator.",
        "A generator can return a final value with a plain return statement; that value appears once, in the { value, done: true } result of the next() call that finishes the generator, and is skipped entirely by for...of.",
        "Calling next(someValue) passes someValue in as the result of the yield expression that was paused, enabling simple two-way communication between calling code and a running generator.",
      ],
      notes:
        "Generators aren't limited to one-way value production. yield* composes generators together cleanly, and arguments passed to next() let calling code talk back to a generator that's paused mid-execution.",
      conceptExplanation:
        "function* inner() { yield 'a'; yield 'b'; } function* outer() { yield 1; yield* inner(); yield 2; } iterating outer() produces 1, 'a', 'b', 2 in order, because yield* re-yields every value from inner() before outer() continues past it. Separately, function* echo() { const first = yield 'ready'; console.log('received', first); } const gen = echo(); gen.next(); gen.next('hello') logs 'received hello', because the value passed to that second next() call becomes the result of the yield 'ready' expression that had been paused, waiting for exactly that value.",
      whyItMatters:
        "yield* is how larger generators are composed cleanly out of smaller ones instead of duplicating iteration logic, and passing values into next() is the foundation of patterns like cooperative task scheduling and coroutine-style control flow.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Write two small generator functions, evens(limit) and odds(limit), each yielding the even or odd numbers up to limit. Write a third generator, allNumbers(limit), that uses yield* to delegate to both evens(limit) and odds(limit) in sequence, and log the combined output in a for...of loop. Separately, write a generator function askName() that yields a prompt string, receives a value through next(passedValue) as the result of that yield, and then yields a second prompt string built using that received value. Manually drive askName() with two next() calls, logging what each call returns.",
      challenge:
        "Give one of your generators a final return statement carrying a summary value, consume it manually with next() calls instead of for...of (since for...of ignores a generator's final return value), and log the { value, done: true } result object that contains it.",
      expectedResult:
        "allNumbers correctly interleaves output from both delegated generators using yield*, and the manually driven askName generator correctly receives and uses the value passed into its second next() call.",
      tests: [
        "A generator correctly uses yield* to delegate to at least one other generator",
        "A value passed into next() is correctly received as the result of a paused yield expression inside the generator",
      ],
      hint: "The very first call to next() on a generator can't deliver a value to a yield expression, since the generator hasn't reached its first yield yet; any value passed to that first next() call is simply discarded.",
      lessonAssessment: [
        {
          question: "What does yield* do inside a generator function?",
          options: [
            "It ends the generator immediately",
            "It delegates to another iterable, re-yielding each of its values as if they came from the outer generator",
            "It yields the inner generator object itself as a single value",
            "It converts the generator into a regular function",
          ],
          correctAnswerIndex: 1,
          explanation: "yield* iterates the delegated-to iterable fully, yielding each of its values individually through the outer generator.",
        },
        {
          question: "What happens when calling code passes a value into next(someValue)?",
          options: [
            "The value is ignored entirely",
            "The value becomes the result of the yield expression that was paused inside the generator",
            "The value replaces the generator's next yielded output",
            "It immediately ends the generator",
          ],
          correctAnswerIndex: 1,
          explanation: "A value passed to next() becomes what the paused yield expression evaluates to when the generator resumes.",
        },
      ],
      commonMistakes: [
        "Using yield instead of yield* when trying to delegate to another generator or iterable, which yields the inner generator object itself instead of its individual values one at a time.",
        "Expecting the first next() call to deliver a value into the generator, when the generator hasn't paused at any yield yet, so that first argument is simply discarded.",
      ],
      deliverables: ["script.js demonstrating yield* delegation across two generators and a manually driven generator receiving values through next()"],
      assessmentCriteria: [
        "yield* correctly delegates to at least one other generator, combining their output",
        "A value passed into next() is correctly received inside the generator as the result of a paused yield",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "javascript",
        code: "function* evens(limit) {\n  for (let n = 0; n <= limit; n += 2) yield n;\n}\n\nfunction* odds(limit) {\n  for (let n = 1; n <= limit; n += 2) yield n;\n}\n\nfunction* allNumbers(limit) {\n  yield* evens(limit);\n  yield* odds(limit);\n}\n\nconsole.log([...allNumbers(6)]);\n\nfunction* askName() {\n  const first = yield 'What is your first name?';\n  yield `Nice to meet you, ${first}!`;\n}\n\nconst gen = askName();\nconsole.log(gen.next());\nconsole.log(gen.next('Amara'));",
        explanation: "allNumbers combines evens and odds using yield*; askName pauses at its first yield until gen.next('Amara') supplies a value that becomes the result of that paused expression.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Iterators & Generators Assessment",
    questions: [
      {
        question: "What well-known symbol must an object implement to be iterable?",
        options: ["Symbol.hasInstance", "Symbol.iterator", "Symbol.toPrimitive", "Symbol.species"],
        correctAnswerIndex: 1,
        explanation: "An object is iterable specifically when it has a method keyed by Symbol.iterator that returns an iterator.",
      },
      {
        question: "What shape must the object returned by next() have?",
        options: ["Just the raw value", "An object like { value, done }", "An array of remaining values", "A string"],
        correctAnswerIndex: 1,
        explanation: "next() must return an object containing value and a done boolean so consumers know when iteration is complete.",
      },
      {
        question: "What does calling a function declared with function* return immediately?",
        options: ["An array of all yielded values", "A generator object, without running any of the function body yet", "The first yielded value only", "undefined"],
        correctAnswerIndex: 1,
        explanation: "Calling a generator function returns a generator object without executing any of its body until it's iterated.",
      },
      {
        question: "What does the yield keyword do inside a generator function?",
        options: ["It ends the function permanently", "It pauses execution and produces a value, resuming from that point on the next next() call", "It restarts the generator", "It converts values into strings"],
        correctAnswerIndex: 1,
        explanation: "yield pauses the generator at that point and hands back a value, resuming exactly there when advanced again.",
      },
      {
        question: "Why is it safe to consume only a few values from an infinite generator like naturalNumbers()?",
        options: [
          "It isn't safe; infinite generators always crash the program",
          "Because a generator only computes values as they're requested, so you can stop requesting more at any time",
          "Because JavaScript automatically limits generators to 1000 values",
          "Because infinite generators are converted to arrays automatically",
        ],
        correctAnswerIndex: 1,
        explanation: "Generators produce values lazily; as long as you don't force full exhaustion (like spreading them into an array), you can safely take just what you need.",
      },
      {
        question: "What does yield* do inside a generator function?",
        options: ["It ends the generator immediately", "It delegates to another iterable, re-yielding each of its values individually", "It yields the inner generator object as one single value", "It pauses forever"],
        correctAnswerIndex: 1,
        explanation: "yield* fully iterates the delegated-to iterable, yielding each of its values one at a time through the outer generator.",
      },
      {
        question: "What happens to a generator's final return value when consumed with for...of?",
        options: ["It is yielded as the very last value in the loop", "It is skipped entirely; for...of stops as soon as done becomes true", "It causes an error", "It replaces the first yielded value"],
        correctAnswerIndex: 1,
        explanation: "for...of only processes values where done is false, so a generator's final return value, attached to the done: true result, is never seen by the loop.",
      },
      {
        question: "What happens when calling code passes a value into next(someValue)?",
        options: ["It is ignored", "It becomes the result of the yield expression that was paused inside the generator", "It immediately terminates the generator", "It is appended to the generator's output array"],
        correctAnswerIndex: 1,
        explanation: "The argument to next() becomes what the paused yield expression evaluates to when the generator resumes.",
      },
      {
        question: "Why is a value passed to the very first next() call on a generator discarded?",
        options: [
          "Because the first call is always ignored by JavaScript",
          "Because the generator hasn't reached its first yield expression yet, so there's nothing paused to receive that value",
          "Because generators only accept string arguments",
          "Because the first next() call always throws an error",
        ],
        correctAnswerIndex: 1,
        explanation: "There is no paused yield expression to deliver a value to before the generator has run to its first yield.",
      },
      {
        question: "What is a key advantage of writing a generator function over manually implementing the iteration protocol with an object and a next() method?",
        options: [
          "Generators run in a separate thread",
          "Generators automatically satisfy the iteration protocol with far less code, using ordinary control flow like loops and yield instead of manual done/value bookkeeping",
          "Generators can only be used once per program",
          "Generators bypass JavaScript's garbage collector",
        ],
        correctAnswerIndex: 1,
        explanation: "Generator functions let you write natural, linear-looking code with yield, while the JavaScript engine handles all the { value, done } bookkeeping automatically.",
      },
    ],
  },
  assignment:
    "Build a custom iterable class PageIterator that takes an array of items and a page size, and implements [Symbol.iterator]() so that iterating a PageIterator instance with for...of yields successive page arrays (chunks) of the given size, with the final page containing whatever items remain if the array doesn't divide evenly. Create a PageIterator over an array of at least 22 items with a page size of 5, iterate it with for...of, and print each page.",
  assignmentDeliverables: [
    "script.js implementing a PageIterator class with a working [Symbol.iterator]() method",
    "Printed output showing every yielded page, including a correctly sized final partial page",
  ],
  assignmentAssessmentCriteria: [
    "PageIterator correctly implements the iteration protocol so for...of works directly on an instance",
    "The final, smaller page is handled correctly when the array doesn't divide evenly",
  ],
  miniProject:
    "Build a 'Prime Number Generator' using function* and yield: a generator function primesUpTo(limit) that yields each prime number from 2 up to limit one at a time. Use it in a for...of loop to print every prime below 100, then create a second, independent call to primesUpTo() and sum every prime it yields using a manual accumulation loop over the generator directly, without first converting it to an array, and print the total.",
  miniProjectDeliverables: [
    "script.js with a primesUpTo(limit) generator function using function* and yield",
    "Printed output listing the primes below 100 and their total sum, computed directly from a generator without first building an array",
  ],
  miniProjectAssessmentCriteria: [
    "primesUpTo() correctly identifies and yields only prime numbers using yield rather than building a list upfront",
    "The sum is computed by iterating a fresh generator call directly, not by converting it to an array first",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
