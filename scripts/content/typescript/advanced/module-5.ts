import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module5: GeneratedModule = {
  title: "Advanced Async Patterns with Types",
  description:
    "Type asynchronous code with the same precision as synchronous code: typed Promises and Promise.all tuples, async generators for streaming data, and typed Result-style error handling instead of unknown thrown errors.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Typed Promises",
      goal: "Type async functions and Promise chains precisely, including using Promise.all with a tuple of differently typed promises.",
      videoTitle: "TypeScript Typed Promises Explained",
      videoSearchQuery: "typescript typed promises async function Promise.all tuple tutorial",
      videoLearningGoal: "See an async function's return type automatically wrapped in Promise<T>, and see Promise.all correctly type a tuple of differently typed results.",
      recommendedChannels: ["Matt Pocock", "Theo - t3.gg"],
      keyTakeaways: [
        "An async function's declared return type is the resolved value's type, not the Promise itself: async function fetchUser(): Promise<User> returns a value typed User inside the function body, wrapped in Promise<User> automatically.",
        ".then callbacks preserve and transform types through the chain: a Promise<T>.then(fn) where fn returns U produces a Promise<U>.",
        "Promise.all applied to a fixed-length array literal of differently typed promises infers a typed tuple, like Promise<[User, Post[]]>, not a loosely typed array.",
      ],
      notes:
        "You've used Promise<T> and async/await in intermediate TypeScript. This lesson goes further: precisely typing what an async function resolves to, following how types flow through a .then chain, and getting real per-position types out of Promise.all instead of one merged, less useful type.",
      conceptExplanation:
        "async function fetchUser(id: number): Promise<User> { const user: User = { id, name: 'Ada' }; return user; } declares the function's resolved type as User; TypeScript wraps it in Promise<User> for you, and inside the function you write return user, not return Promise.resolve(user). Promise.all works best when given a literal array (or tuple) of promises with different types: Promise.all([fetchUser(1), fetchPosts(1)]) infers Promise<[User, Post[]]>, a tuple where each position keeps its own specific type, letting you destructure const [user, posts] = await Promise.all([...]) with both variables correctly and separately typed.",
      whyItMatters: "Precise Promise typing means await always gives you back exactly the type you expect, and Promise.all lets you run independent async operations concurrently without losing per-result type information, which is both faster and safer than awaiting them one at a time.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define an interface User with id and name, and an interface Post with id and title. Write two async functions, fetchUser(id: number): Promise<User> and fetchPosts(userId: number): Promise<Post[]>, each simulating work with a short delay (you can use a helper that returns a Promise resolving after a setTimeout) before resolving with sample data. Use Promise.all to run both concurrently for the same id, destructure the tuple result into separately typed user and posts variables, and print both.",
      challenge: "Chain a .then off one of the two async calls that transforms its result into a different shape (for example, mapping posts into just their titles as string[]), and confirm the resulting type is Promise<string[]>.",
      expectedResult: "Both async functions resolve with correctly typed data, and awaiting Promise.all([...]) produces a tuple whose two positions destructure into a correctly typed User and a correctly typed Post[] respectively.",
      tests: [
        "fetchUser and fetchPosts are correctly typed to resolve with User and Post[] respectively",
        "Promise.all is used to run both calls concurrently, and the destructured result variables have the correct, distinct types",
      ],
      hint: "A helper like function delay(ms: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms)); } is a convenient way to simulate async work without any real network calls.",
      lessonAssessment: [
        {
          question: "For async function fetchUser(id: number): Promise<User> { const user: User = ...; return user; }, what do you actually return inside the function body?",
          options: [
            "A Promise<User> value, wrapped manually",
            "A plain User value; TypeScript and the async keyword handle wrapping it in a Promise",
            "A Promise<Promise<User>> value",
            "Nothing; async functions cannot use return",
          ],
          correctAnswerIndex: 1,
          explanation: "Inside an async function, you return the resolved value directly; the async keyword and the function's return type wrap it in a Promise automatically.",
        },
        {
          question: "What does Promise.all([fetchUser(1), fetchPosts(1)]) resolve to, given fetchUser returns Promise<User> and fetchPosts returns Promise<Post[]>?",
          options: [
            "Promise<(User | Post[])[]>, a loosely typed array",
            "Promise<[User, Post[]]>, a tuple preserving each position's specific type",
            "Promise<User>, only the first result",
            "A compile error, since the two promises resolve to different types",
          ],
          correctAnswerIndex: 1,
          explanation: "Passing a literal array of differently typed promises to Promise.all infers a tuple type, keeping each position's specific type intact rather than merging them into a union array.",
        },
      ],
      commonMistakes: [
        "Manually wrapping a value in Promise.resolve() inside an async function's return statement, which is unnecessary since the async keyword already does the wrapping.",
        "Awaiting several independent async calls one after another with separate await statements when they could run concurrently with Promise.all, needlessly serializing work that doesn't depend on each other.",
      ],
      deliverables: ["main.ts with typed fetchUser and fetchPosts async functions combined using Promise.all"],
      assessmentCriteria: [
        "fetchUser and fetchPosts are correctly typed and resolve with realistic sample data",
        "Promise.all is used correctly, and the destructured tuple result has correct, distinct types for both positions",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code:
          'interface User {\n  id: number;\n  name: string;\n}\n\ninterface Post {\n  id: number;\n  title: string;\n}\n\nfunction delay(ms: number): Promise<void> {\n  return new Promise((resolve) => setTimeout(resolve, ms));\n}\n\nasync function fetchUser(id: number): Promise<User> {\n  await delay(50);\n  return { id, name: "Ada" };\n}\n\nasync function fetchPosts(userId: number): Promise<Post[]> {\n  await delay(30);\n  return [\n    { id: 1, title: "Hello world" },\n    { id: 2, title: "Learning TypeScript" },\n  ];\n}\n\nasync function main() {\n  const [user, posts] = await Promise.all([fetchUser(1), fetchPosts(1)]);\n  console.log(user.name, posts.length);\n\n  const titles = await fetchPosts(1).then((result) => result.map((post) => post.title));\n  console.log(titles);\n}\n\nmain();',
        explanation: "Promise.all([fetchUser(1), fetchPosts(1)]) infers a Promise<[User, Post[]]> tuple, so destructuring gives user the User type and posts the Post[] type; the .then chain separately transforms a Post[] result into string[].",
      },
      completionStatus: "not_started",
    },
    {
      title: "Typing Async Generators",
      goal: "Write and type async generator functions with AsyncGenerator<T>, and consume them with for await...of.",
      videoTitle: "TypeScript Async Generators Explained",
      videoSearchQuery: "typescript async generator AsyncGenerator for await of tutorial",
      videoLearningGoal: "See an async generator function stream typed values over time, consumed one at a time with for await...of.",
      recommendedChannels: ["Jack Herrington", "Total TypeScript"],
      keyTakeaways: [
        "An async generator function is declared with async function*, and its type is AsyncGenerator<T>, where T is the type of each yielded value.",
        "Inside an async generator, you can both await other Promises and yield values, mixing asynchronous work with streaming output.",
        "for await (const item of someAsyncGenerator()) consumes an async generator one item at a time, awaiting each value automatically as it's produced.",
      ],
      notes:
        "A regular generator produces a sequence of values lazily. An async generator does the same thing, but each value can take time to produce, because you're allowed to await inside it. This is the natural way to type something like streaming paginated results from an API, one page or item at a time.",
      conceptExplanation:
        "async function* countUpTo(max: number): AsyncGenerator<number> { for (let i = 1; i <= max; i++) { await delay(20); yield i; } } is an async generator: calling countUpTo(5) doesn't run the loop immediately, it returns an AsyncGenerator<number> that produces one number at a time, waiting briefly before each. Consuming it looks like for await (const value of countUpTo(5)) { console.log(value); }, which awaits and logs each yielded number in order. AsyncGenerator<T, TReturn, TNext> technically takes three type parameters, but in typical use you only specify T, the type of each yielded value, and let the other two default.",
      whyItMatters: "Async generators let you type and consume data that arrives incrementally, like paginated API results or a stream of events, without loading everything into memory at once or losing type information along the way.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Write an async generator function countUpTo(max: number): AsyncGenerator<number> that awaits a short delay and then yields each number from 1 to max, one at a time. Consume it with a for await...of loop, summing every yielded value into a running total, and print the total once the loop finishes. Then write a second async generator, paginate<T>(pages: T[][]): AsyncGenerator<T>, that awaits a short delay before each page and yields every item in that page one at a time (not the whole page at once), and consume it with a for await...of loop over a sample array of pages, printing each item.",
      challenge: "Modify paginate<T> to also print a 'Loading page N' message right before awaiting each page's delay, so the console output shows the streaming, page-by-page nature of the generator as it runs.",
      expectedResult: "countUpTo correctly streams numbers one at a time and the running total matches the sum of 1 through max, and paginate correctly flattens and streams individual items from multiple pages in order.",
      tests: [
        "countUpTo is correctly typed as AsyncGenerator<number> and yields one number at a time",
        "paginate<T> is correctly typed as a generic async generator that yields individual items, not whole pages",
      ],
      hint: "yield inside an async generator works exactly like yield in a regular generator; the only difference is you're also allowed to await other Promises anywhere in the function body.",
      lessonAssessment: [
        {
          question: "What is the type of the function declared as async function* countUpTo(max: number): AsyncGenerator<number> { ... }?",
          options: [
            "A regular function returning Promise<number>",
            "An async generator function; calling it returns an AsyncGenerator<number>",
            "A regular generator function returning Generator<number>",
            "A function returning number[]",
          ],
          correctAnswerIndex: 1,
          explanation: "The async function* syntax declares an async generator; calling it produces an AsyncGenerator<number>, not a single Promise or a plain array.",
        },
        {
          question: "How do you consume an async generator's values one at a time, awaiting each as it's produced?",
          options: [
            "A regular for...of loop",
            "A for await (const item of theAsyncGenerator()) loop",
            "Calling .then() on the generator directly",
            "Async generators cannot be consumed in a loop",
          ],
          correctAnswerIndex: 1,
          explanation: "for await...of is specifically designed to consume async iterables, including async generators, awaiting each value automatically as it's produced.",
        },
      ],
      commonMistakes: [
        "Using a regular for...of loop on an async generator instead of for await...of, which doesn't correctly await each produced value.",
        "Forgetting that yield inside an async generator still pauses the generator at that point, the same as in a regular generator, and resumes only when the consumer asks for the next value.",
      ],
      deliverables: ["main.ts with a countUpTo async generator and a generic paginate<T> async generator, both consumed with for await...of"],
      assessmentCriteria: [
        "countUpTo correctly streams numbers one at a time and the consuming loop correctly sums them",
        "paginate<T> correctly flattens multiple pages into individually yielded items, consumed correctly with for await...of",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "typescript",
        code:
          'function delay(ms: number): Promise<void> {\n  return new Promise((resolve) => setTimeout(resolve, ms));\n}\n\nasync function* countUpTo(max: number): AsyncGenerator<number> {\n  for (let i = 1; i <= max; i++) {\n    await delay(20);\n    yield i;\n  }\n}\n\nasync function* paginate<T>(pages: T[][]): AsyncGenerator<T> {\n  for (const page of pages) {\n    await delay(20);\n    for (const item of page) {\n      yield item;\n    }\n  }\n}\n\nasync function main() {\n  let total = 0;\n  for await (const value of countUpTo(5)) {\n    total += value;\n  }\n  console.log("Total:", total);\n\n  const pages = [["a", "b"], ["c", "d", "e"]];\n  for await (const item of paginate(pages)) {\n    console.log("Item:", item);\n  }\n}\n\nmain();',
        explanation: "countUpTo streams numbers one at a time with a delay between each, and paginate<T> flattens multiple pages into individually yielded items, both consumed correctly with for await...of.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Result-Style Typed Error Handling for Async Code",
      goal: "Structure async error handling around a typed discriminated union Result<T, E>, rather than relying only on try/catch and an implicitly unknown caught error.",
      videoTitle: "TypeScript Result Type Error Handling for Async Code",
      videoSearchQuery: "typescript result type discriminated union async error handling tutorial",
      videoLearningGoal: "See a Result<T, E> discriminated union used to represent success and failure explicitly, replacing an unknown-typed catch block with a narrowed, checked outcome.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "In strict TypeScript, a catch block's error variable is typed unknown, not any, so you must narrow it (for example with instanceof Error) before using it safely.",
        "A Result<T, E> discriminated union, with an ok: boolean field distinguishing a success branch from a failure branch, makes both outcomes explicit in the type system instead of relying on a thrown exception the caller might forget to catch.",
        "Wrapping an async operation to return Promise<Result<T, E>> instead of letting it throw turns error handling into an ordinary, exhaustively checked if/else on the result, rather than a try/catch the caller could skip entirely.",
      ],
      notes:
        "Throwing exceptions works, but nothing in a function's type signature warns a caller that it might throw, or what it might throw. A Result type makes both outcomes, success and failure, part of the function's actual return type, so the caller's type checker enforces handling both.",
      conceptExplanation:
        "type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E } is a discriminated union: checking result.ok narrows result to exactly one branch, giving you result.value when true and result.error when false, with no casting needed. async function safeFetch<T>(fn: () => Promise<T>): Promise<Result<T>> { try { const value = await fn(); return { ok: true, value }; } catch (error) { return { ok: false, error: error instanceof Error ? error : new Error(String(error)) }; } } wraps any async operation, catching its unknown-typed error, narrowing it with instanceof Error, and returning an explicit Result instead of letting the exception propagate.",
      whyItMatters: "Result-style error handling makes failure a normal, type-checked part of a function's contract instead of an invisible possibility a caller has to remember to guard against, which is especially valuable for async code where a forgotten try/catch can crash an entire operation.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }. Write async function safeFetch<T>(fn: () => Promise<T>): Promise<Result<T>> that awaits fn() inside a try block, returning { ok: true, value } on success, and catches any error in a catch block, narrowing it with instanceof Error before returning { ok: false, error }. Write a sample async function that throws when given certain input and succeeds otherwise, call it through safeFetch twice (once triggering success, once triggering failure), and use if (result.ok) to print the value or the error message correctly in each case.",
      challenge: "Write a helper function mapResult<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> that transforms a successful result's value with fn while passing a failed result through unchanged, and demonstrate it on one successful and one failed Result.",
      expectedResult: "safeFetch correctly returns a success Result with the resolved value when the wrapped function succeeds, and a failure Result with a properly narrowed Error when it throws, with both branches handled through result.ok narrowing rather than try/catch at the call site.",
      tests: [
        "Result<T, E> is correctly defined as a discriminated union using an ok field",
        "safeFetch correctly narrows the caught error with instanceof Error before including it in the failure branch",
      ],
      hint: "Checking if (result.ok) narrows the union automatically inside that branch; TypeScript knows result.value exists there and result.error exists in the else branch, with no type assertion needed.",
      lessonAssessment: [
        {
          question: "In strict TypeScript, what is the type of the variable in catch (error) { ... }?",
          options: ["any", "unknown", "Error", "never"],
          correctAnswerIndex: 1,
          explanation: "TypeScript types a caught error as unknown by default in strict mode, since JavaScript allows throwing any value, not just Error instances, so it must be narrowed before use.",
        },
        {
          question: "Given type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }, what does checking if (result.ok) do?",
          options: [
            "Nothing; ok has no special meaning to TypeScript",
            "It narrows result to the { ok: true; value: T } branch inside that if block, making value safely accessible",
            "It throws an error if ok is false",
            "It converts result into a boolean",
          ],
          correctAnswerIndex: 1,
          explanation: "ok acts as a discriminant; checking its value narrows the union to the matching branch, so TypeScript knows exactly which fields are available inside each branch.",
        },
      ],
      commonMistakes: [
        "Using the caught error directly as if it were an Error (for example, calling error.message) without first narrowing it with instanceof Error, which fails to compile under strict settings.",
        "Defining a Result type but still throwing exceptions from functions that are supposed to return it, mixing the two error-handling styles instead of picking one consistently for a given function.",
      ],
      deliverables: ["main.ts with a Result<T, E> discriminated union and a safeFetch wrapper demonstrating both a success and a failure case"],
      assessmentCriteria: [
        "Result<T, E> is correctly defined and used as a discriminated union with proper narrowing on the ok field",
        "safeFetch correctly narrows the caught error and returns a properly typed success or failure Result in both demonstrated cases",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "typescript",
        code:
          'type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };\n\nasync function safeFetch<T>(fn: () => Promise<T>): Promise<Result<T>> {\n  try {\n    const value = await fn();\n    return { ok: true, value };\n  } catch (error) {\n    return { ok: false, error: error instanceof Error ? error : new Error(String(error)) };\n  }\n}\n\nasync function riskyLookup(id: number): Promise<string> {\n  if (id < 0) {\n    throw new Error(`Invalid id: ${id}`);\n  }\n  return `user-${id}`;\n}\n\nasync function main() {\n  const success = await safeFetch(() => riskyLookup(1));\n  if (success.ok) {\n    console.log("Found:", success.value);\n  } else {\n    console.log("Failed:", success.error.message);\n  }\n\n  const failure = await safeFetch(() => riskyLookup(-1));\n  if (failure.ok) {\n    console.log("Found:", failure.value);\n  } else {\n    console.log("Failed:", failure.error.message);\n  }\n}\n\nmain();',
        explanation: "safeFetch turns riskyLookup's thrown exceptions into an explicit Result value; checking result.ok narrows each result to the correct branch, so success.value and failure.error are both safely typed with no casting.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Advanced Async Patterns with Types Assessment",
    questions: [
      {
        question: "For async function fetchUser(): Promise<User> { return user; }, what does the function actually return inside its body?",
        options: [
          "A Promise<User>, wrapped manually with Promise.resolve",
          "A plain User value; the async keyword wraps it in a Promise automatically",
          "A Promise<Promise<User>>",
          "Nothing; return cannot be used in async functions",
        ],
        correctAnswerIndex: 1,
        explanation: "Inside an async function, you return the resolved value directly, and the function's return type is automatically wrapped in a Promise.",
      },
      {
        question: "What does Promise.all([fetchUser(1), fetchPosts(1)]) resolve to, given the two functions return Promise<User> and Promise<Post[]>?",
        options: [
          "Promise<(User | Post[])[]>",
          "Promise<[User, Post[]]>, a tuple preserving each position's own type",
          "A compile error",
          "Promise<User>, ignoring the second promise",
        ],
        correctAnswerIndex: 1,
        explanation: "Promise.all given a literal array of differently typed promises infers a tuple type, keeping each position's specific type.",
      },
      {
        question: "What is the type of async function* countUpTo(max: number): AsyncGenerator<number> { ... } when called?",
        options: [
          "It returns Promise<number>",
          "It returns an AsyncGenerator<number>",
          "It returns number[]",
          "It returns Generator<number> without async support",
        ],
        correctAnswerIndex: 1,
        explanation: "async function* declares an async generator, and calling it returns an AsyncGenerator<T> object, here typed AsyncGenerator<number>.",
      },
      {
        question: "How do you correctly consume the values from an async generator, one at a time, awaiting each as it's produced?",
        options: [
          "A plain for...of loop",
          "A for await (const item of theAsyncGenerator()) loop",
          "Calling .json() on the generator",
          "You cannot loop over an async generator",
        ],
        correctAnswerIndex: 1,
        explanation: "for await...of is built specifically to consume async iterables, including async generators.",
      },
      {
        question: "Can you both await other Promises and yield values inside the same async generator function?",
        options: [
          "No, only one or the other is allowed",
          "Yes, an async generator can freely mix await and yield within its body",
          "Only if the function is also marked as a regular generator",
          "Only at the very start of the function",
        ],
        correctAnswerIndex: 1,
        explanation: "An async generator combines both capabilities: it can await asynchronous work and yield values to its consumer as it progresses.",
      },
      {
        question: "In strict TypeScript, what type is the variable in catch (error) { ... }?",
        options: ["any", "unknown", "Error", "string"],
        correctAnswerIndex: 1,
        explanation: "Since JavaScript allows throwing any value, TypeScript types a caught error as unknown by default, requiring narrowing before use.",
      },
      {
        question: "Given type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }, what does if (result.ok) do?",
        options: [
          "Nothing special",
          "It narrows result to the success branch inside that block, making value safely accessible without casting",
          "It always throws if ok is false",
          "It converts the whole result object into a boolean",
        ],
        correctAnswerIndex: 1,
        explanation: "ok is the discriminant field; narrowing on it lets TypeScript know exactly which branch's fields are available inside each block.",
      },
      {
        question: "What is a key advantage of returning Promise<Result<T, E>> from an async function instead of letting it throw?",
        options: [
          "It makes the function run faster",
          "The possibility of failure becomes part of the function's type signature, which the type checker can enforce the caller handles",
          "It removes the need to ever check for errors",
          "It automatically retries failed operations",
        ],
        correctAnswerIndex: 1,
        explanation: "A Result-typed return value makes both success and failure explicit and checkable in the type system, rather than an invisible possibility a caller might forget to guard against.",
      },
      {
        question: "Why does safeFetch use error instanceof Error ? error : new Error(String(error)) inside its catch block?",
        options: [
          "It has no real purpose and could be removed",
          "Because the caught error is typed unknown and might not actually be an Error instance, so it needs narrowing or normalizing before being returned",
          "To convert the error into a string permanently",
          "Because catch blocks require this exact syntax",
        ],
        correctAnswerIndex: 1,
        explanation: "Since a caught value could technically be anything, this pattern safely narrows it when possible and normalizes it into a real Error otherwise.",
      },
      {
        question: "What does a generic async generator function like paginate<T>(pages: T[][]): AsyncGenerator<T> allow you to do?",
        options: [
          "Yield one whole page array at a time, typed as T[][]",
          "Yield individual items of type T, one at a time, regardless of how many pages or items each page contains",
          "Only work with pages of numbers",
          "Return all items at once as a single array",
        ],
        correctAnswerIndex: 1,
        explanation: "By looping over each page and yielding its individual items, paginate<T> streams individual values of type T rather than whole page arrays.",
      },
    ],
  },
  assignment:
    "Build a 'Typed Async Fetch Toolkit': write async function fetchProduct(id: number): Promise<Product> and async function fetchReviews(productId: number): Promise<Review[]> (using a small simulated delay for each), define matching Product and Review interfaces, and use Promise.all to fetch both concurrently for the same id, destructuring the correctly typed tuple result and printing both. Then define type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E } and a safeFetch<T>(fn: () => Promise<T>): Promise<Result<T>> wrapper. Write a version of fetchProduct that throws for an invalid id, call it through safeFetch for both a valid and an invalid id, and print the correctly narrowed success or failure branch for each.",
  assignmentDeliverables: [
    "main.ts with typed fetchProduct and fetchReviews functions combined using Promise.all",
    "A Result<T, E> type and a safeFetch wrapper demonstrating both a success and a failure case",
  ],
  assignmentAssessmentCriteria: [
    "Promise.all is used correctly with the destructured tuple result showing correct, distinct types for each position",
    "safeFetch correctly narrows the caught error and returns a properly typed Result for both the success and failure cases",
  ],
  miniProject:
    "Build a 'Streaming Data Pipeline': write a generic async generator streamBatches<T>(batches: T[][]): AsyncGenerator<T> that awaits a short simulated delay before each batch and yields its items one at a time. Write type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E } and a function processItem<T>(item: T, handler: (item: T) => T): Result<T> that runs handler in a try/catch, returning a typed success or failure Result instead of letting exceptions escape. Consume streamBatches with a for await...of loop over a sample array of batches of numbers, pass each item through processItem with a handler that throws for negative numbers and otherwise doubles the number, and print a running count of how many items succeeded versus failed by the end of the loop.",
  miniProjectDeliverables: [
    "main.ts with a generic streamBatches<T> async generator and a Result-returning processItem<T> function",
    "A for await...of loop consuming the stream and routing each item through processItem",
    "Printed output showing a final count of succeeded versus failed items",
  ],
  miniProjectAssessmentCriteria: [
    "streamBatches<T> correctly streams individual items across multiple batches using an async generator",
    "processItem correctly wraps handler execution in a typed Result instead of allowing exceptions to propagate uncaught",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
