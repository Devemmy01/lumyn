import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module6: GeneratedModule = {
  title: "Design Patterns in JavaScript",
  description:
    "Implement three classic design patterns, the Singleton, Factory Functions, and Observer/Pub-Sub, using plain objects, closures, and functions rather than defaulting to class syntax, and learn to judge when each one genuinely earns its added structure.",
  completionStatus: "locked",
  lessons: [
    {
      title: "The Singleton Pattern: One Shared Instance, Multiple Ways",
      goal: "Implement a Singleton in JavaScript using both a plain shared object and a lazily-initialized closure-based factory, and judge when each is worth using.",
      videoTitle: "JavaScript Singleton Pattern Explained",
      videoSearchQuery: "javascript singleton pattern object literal lazy initialization tutorial",
      videoLearningGoal: "See a Singleton built as a plain shared object, then a second, lazier version built with a closure-based factory function that only creates the instance the first time it's actually needed.",
      recommendedChannels: ["ArjanCodes", "Fireship"],
      keyTakeaways: [
        "A Singleton guarantees a single, shared instance that every part of a program accesses through the same reference.",
        "In JavaScript, the simplest Singleton is often just a plain object literal exported once, since a module's top-level code only ever runs once no matter how many places import it.",
        "A lazy Singleton, useful when creating the instance is expensive, delays creation until the first time it's actually requested, using a closure to remember and reuse that instance afterward.",
      ],
      notes:
        "Many languages need special class-level machinery to enforce a single instance; JavaScript's module system already behaves like this by default, so a Singleton is frequently just an ordinary shared object.",
      conceptExplanation:
        "const appConfig = { theme: 'dark', retries: 3 }; every piece of code that references appConfig shares the exact same object; changing appConfig.theme in one place is visible everywhere else immediately. For a Singleton whose creation is expensive or should be deferred, a lazy version works instead: function createLazySingleton(factory) { let instance = null; return function getInstance() { if (instance === null) { instance = factory(); } return instance; }; } const getConnection = createLazySingleton(() => { console.log('creating connection'); return { id: Math.random() }; }); calling getConnection() the first time creates and logs; every subsequent call returns the exact same cached object without creating anything new.",
      whyItMatters:
        "Recognizing when a plain shared object is enough, versus when lazy creation genuinely matters, keeps code from reaching for unnecessary machinery to solve a problem JavaScript's module system often already solves for free.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Build a plain object literal appConfig with at least three settings, assign it to two different variables, confirm with === that they reference the exact same object, then change a setting through one variable and log it through the other to show the shared state. Separately, write createLazySingleton(factory) as a closure-based helper, use it to lazily create a getConnection() Singleton whose factory logs a message each time it would create a new connection, and call getConnection() three times, confirming the creation message only logs once.",
      challenge:
        "Extend createLazySingleton to also return a reset function alongside getInstance, so calling code can force the next getInstance() call to create a brand new instance, and demonstrate that reset in action by creating, resetting, and re-creating the connection.",
      expectedResult:
        "Both appConfig references are confirmed identical, and calling getConnection() three times logs the creation message exactly once, on the first call, with all three calls returning the exact same object.",
      tests: [
        "Two references to appConfig are confirmed to point to the exact same object using ===",
        "createLazySingleton() ensures its factory function runs exactly once, even across multiple getInstance() calls",
      ],
      hint: "A closure variable like instance, declared outside the returned getInstance function but inside createLazySingleton, is what lets the lazy Singleton remember whether it has already created its value.",
      lessonAssessment: [
        {
          question: "Why does a plain object literal shared from one place already behave like a Singleton in JavaScript?",
          options: [
            "Because JavaScript automatically prevents object literals from being copied",
            "Because every reference to that same object points to the identical instance in memory, and a module's top-level code runs only once",
            "Because object literals cannot have properties added to them later",
            "Because JavaScript objects are always frozen by default",
          ],
          correctAnswerIndex: 1,
          explanation: "Since all references point to the same underlying object, and a module only runs its top-level code once, a shared object literal naturally behaves as a single shared instance.",
        },
        {
          question: "What is the purpose of a lazily-initialized Singleton built with a closure?",
          options: [
            "To create a brand new instance every time it's requested",
            "To defer creating a potentially expensive instance until it's actually first requested, then reuse that same instance afterward",
            "To make the instance inaccessible after the first call",
            "To automatically destroy the instance after each use",
          ],
          correctAnswerIndex: 1,
          explanation: "A lazy Singleton avoids unnecessary work until the instance is genuinely needed, then caches it in a closure for every future request.",
        },
      ],
      commonMistakes: [
        "Recreating a new object every time a 'Singleton' is requested by accident, for example, returning a freshly built object literal from a function instead of caching and returning the same one.",
        "Reaching for elaborate instance-checking logic when a plain shared object, or the simple closure-based lazy pattern shown here, would be simpler and just as correct.",
      ],
      deliverables: ["script.js with a shared appConfig object and a createLazySingleton()-based getConnection() Singleton"],
      assessmentCriteria: [
        "Two references to appConfig are correctly confirmed identical and shown to share state",
        "createLazySingleton() correctly creates its instance exactly once across multiple getInstance() calls",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: "function createLazySingleton(factory) {\n  let instance = null;\n  return function getInstance() {\n    if (instance === null) {\n      instance = factory();\n    }\n    return instance;\n  };\n}\n\nconst getConnection = createLazySingleton(() => {\n  console.log('creating connection');\n  return { id: Math.random() };\n});\n\nconst first = getConnection();\nconst second = getConnection();\nconsole.log(first === second);",
        explanation: "'creating connection' logs only once, on the first call; every later call to getConnection() returns the exact same cached object from the closure.",
      },
      completionStatus: "not_started",
    },
    {
      title: "The Factory Function Pattern",
      goal: "Write factory functions that build and return plain objects, sharing behavior through composition instead of class inheritance.",
      videoTitle: "JavaScript Factory Functions Explained",
      videoSearchQuery: "javascript factory functions object composition tutorial",
      videoLearningGoal: "See a factory function build and return a plain object, and see two factory functions compose shared behavior together without using class or extends.",
      recommendedChannels: ["Fireship", "Jack Herrington"],
      keyTakeaways: [
        "A factory function is simply a function that builds and returns a new object, without new or the class keyword, giving you full control over exactly what shape that object has.",
        "Factory functions can compose shared behavior by calling other factory functions and merging their results together, an alternative to class inheritance called object composition.",
        "Because a factory function's returned object can close over the function's local variables, factory functions naturally support private state, the same way a plain closure or the module pattern does.",
      ],
      notes:
        "A factory function's whole appearance and behavior is: define local variables and functions, then return a plain object exposing whichever of them should be public. There's no constructor, no this, and no new required at all.",
      conceptExplanation:
        "function createLogger(prefix) { const history = []; function log(message) { const entry = `[${prefix}] ${message}`; history.push(entry); console.log(entry); } function getHistory() { return [...history]; } return { log, getHistory }; } const appLogger = createLogger('APP'); appLogger.log('started'); each call to createLogger produces an independent object with its own private history array, exactly like the module pattern, but reusable to create as many instances as you want. Composition looks like: function createTimestamped(prefix) { const base = createLogger(prefix); return { ...base, log(message) { base.log(`${new Date().toISOString()} ${message}`); } }; } which reuses createLogger's behavior and layers new behavior on top, without any class or extends keyword.",
      whyItMatters:
        "Factory functions avoid several class-related pitfalls, like this-binding surprises and deep inheritance chains, while still producing multiple independent objects with private state and shared behavior, which is exactly why 'favor composition over inheritance' is common advice.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Write a factory function createLogger(prefix) that closes over a private history array, exposing log(message), which records and prints a prefixed message, and getHistory(), which returns a copy of recorded messages. Create two independent loggers with different prefixes, log a few messages to each, and print each one's getHistory() to confirm they don't share history. Then write a second factory function, createTimestamped(prefix), that calls createLogger(prefix) internally and returns a new object composing its behavior, overriding log to prepend a timestamp before delegating to the original log.",
      challenge:
        "Write a third factory function that composes two independently created behaviors together, for example a createLogger-based object and a separate createCounter() factory tracking how many times log() was called, merging both into one final returned object using spread syntax.",
      expectedResult:
        "The two independent loggers maintain separate histories, and the timestamped logger correctly prepends a timestamp to every message while still recording it through the original logger's private history.",
      tests: [
        "createLogger() returns independent objects with private, non-shared history state across multiple calls",
        "createTimestamped() correctly composes createLogger's behavior rather than duplicating its logic",
      ],
      hint: "Composition here just means calling one factory function from inside another and spreading, or selectively reusing, its returned object's methods into the new object you return.",
      lessonAssessment: [
        {
          question: "What does a factory function do?",
          options: [
            "It defines a class that must be instantiated with new",
            "It builds and returns a plain object directly, without new or the class keyword",
            "It only ever returns primitive values like numbers or strings",
            "It permanently modifies a global object",
          ],
          correctAnswerIndex: 1,
          explanation: "A factory function is just a regular function whose job is to construct and return a new object.",
        },
        {
          question: "What does 'composition' mean in the context of factory functions?",
          options: [
            "Writing all logic inside a single giant function",
            "Building new behavior by combining the results of other factory functions, instead of relying on class inheritance",
            "Compressing code to use fewer lines",
            "Converting factory functions into classes",
          ],
          correctAnswerIndex: 1,
          explanation: "Composition combines behavior from multiple smaller factory functions into a new object, as an alternative to inheriting from a shared base class.",
        },
      ],
      commonMistakes: [
        "Forgetting that each call to a factory function creates a completely independent object and its own separate closure state, then being surprised two 'instances' don't share data, which is actually the correct, intended behavior.",
        "Manually re-implementing shared logic in multiple factory functions instead of composing them by calling one factory function from another and reusing its result.",
      ],
      deliverables: ["script.js with a createLogger() factory and a createTimestamped() factory composing its behavior"],
      assessmentCriteria: [
        "createLogger() correctly produces independent objects with private, non-shared history",
        "createTimestamped() correctly composes createLogger rather than duplicating its logic",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: "function createLogger(prefix) {\n  const history = [];\n  function log(message) {\n    const entry = `[${prefix}] ${message}`;\n    history.push(entry);\n    console.log(entry);\n  }\n  function getHistory() {\n    return [...history];\n  }\n  return { log, getHistory };\n}\n\nfunction createTimestamped(prefix) {\n  const base = createLogger(prefix);\n  return {\n    ...base,\n    log(message) {\n      base.log(`${new Date().toISOString()} ${message}`);\n    },\n  };\n}\n\nconst appLogger = createLogger('APP');\nconst tsLogger = createTimestamped('SYNC');\nappLogger.log('started');\ntsLogger.log('synced');\nconsole.log(appLogger.getHistory());\nconsole.log(tsLogger.getHistory());",
        explanation: "createTimestamped composes createLogger's behavior by calling it internally and overriding log, while getHistory is reused unchanged through the spread.",
      },
      completionStatus: "not_started",
    },
    {
      title: "The Observer / Pub-Sub Pattern",
      goal: "Build a publish-subscribe event system using plain functions and closures, letting independent listeners react to published events without direct coupling to the publisher.",
      videoTitle: "JavaScript Observer and Pub-Sub Pattern Explained",
      videoSearchQuery: "javascript observer pub sub pattern event emitter tutorial",
      videoLearningGoal: "See a small pub-sub system built from plain objects and functions, where publishing an event notifies every subscribed listener without the publisher knowing anything about them.",
      recommendedChannels: ["Web Dev Simplified", "ArjanCodes"],
      keyTakeaways: [
        "In the observer (or publish-subscribe) pattern, a central hub keeps a list of listener functions for each event name, and notifies all of them whenever that event is published.",
        "Listeners are decoupled from whoever publishes an event: the publisher never needs to know which functions are subscribed, or what they do with the data.",
        "Returning an unsubscribe function from subscribe() is the idiomatic way to let a listener stop receiving future events, which is essential to avoid listeners accumulating forever.",
      ],
      notes:
        "A pub-sub system is really just a factory function managing a dictionary of event names mapped to arrays of listener functions, with subscribe and publish methods to add listeners and call them.",
      conceptExplanation:
        "function createEventBus() { const listeners = {}; function subscribe(eventName, callback) { if (!listeners[eventName]) listeners[eventName] = []; listeners[eventName].push(callback); return function unsubscribe() { listeners[eventName] = listeners[eventName].filter((fn) => fn !== callback); }; } function publish(eventName, data) { (listeners[eventName] || []).forEach((callback) => callback(data)); } return { subscribe, publish }; } const bus = createEventBus(); const unsubscribe = bus.subscribe('taskAdded', (task) => console.log('New task:', task)); bus.publish('taskAdded', { title: 'Write tests' }); unsubscribe(); bus.publish('taskAdded', { title: 'Ignored now' }); the second publish call reaches no listeners, since the only subscriber unsubscribed itself between the two calls.",
      whyItMatters:
        "Pub-sub is the foundation behind DOM events, many state management libraries, and any situation where multiple independent parts of a program need to react to the same change without being directly wired together.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Build a createEventBus() factory function with subscribe(eventName, callback) and publish(eventName, data) methods, where subscribe returns an unsubscribe function. Subscribe at least two different listener functions to the same event name, publish that event with sample data, and confirm both listeners run. Then call unsubscribe on one of them, publish the event again, and confirm only the remaining subscribed listener runs.",
      challenge:
        "Add support for subscribing to multiple different event names on the same bus, and demonstrate publishing two different event names, confirming that listeners subscribed to one event name never receive publishes for a different event name.",
      expectedResult:
        "Both listeners react to the first publish call, and after unsubscribing one, only the remaining listener reacts to the second publish call for the same event.",
      tests: [
        "subscribe() correctly registers a listener and returns a working unsubscribe function",
        "publish() correctly calls every currently subscribed listener for the given event name, and no others",
      ],
      hint: "unsubscribe should filter only the specific callback out of the listeners array for that event name, not clear the entire array, or other subscribers would be accidentally removed too.",
      lessonAssessment: [
        {
          question: "What is the main purpose of the pub-sub (observer) pattern?",
          options: [
            "To let a single function run faster",
            "To let multiple independent listeners react to an event without the publisher needing to know anything about them",
            "To prevent more than one listener from ever subscribing to the same event",
            "To convert asynchronous code into synchronous code",
          ],
          correctAnswerIndex: 1,
          explanation: "Pub-sub decouples publishers from subscribers: the publisher only announces an event, and any number of listeners can independently react to it.",
        },
        {
          question: "Why does subscribe() typically return an unsubscribe function?",
          options: [
            "It's unnecessary and purely decorative",
            "So a listener can stop receiving future events, preventing listeners from accumulating forever",
            "So the event bus can be destroyed immediately after one subscription",
            "So publish() can be called without any arguments",
          ],
          correctAnswerIndex: 1,
          explanation: "An unsubscribe function gives calling code a clean way to remove a listener later, avoiding listeners that pile up and never get cleaned up.",
        },
      ],
      commonMistakes: [
        "Forgetting to filter out only the specific unsubscribed callback, accidentally clearing every listener for that event name instead.",
        "Publishing an event name that no one has subscribed to without guarding against listeners[eventName] being undefined, which throws when trying to call forEach directly on it.",
      ],
      deliverables: ["script.js with a createEventBus() factory demonstrating subscribe, publish, and unsubscribe"],
      assessmentCriteria: [
        "subscribe() and publish() correctly notify every currently subscribed listener for an event",
        "unsubscribe() correctly removes only the intended listener, verified by a follow-up publish",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "javascript",
        code: "function createEventBus() {\n  const listeners = {};\n\n  function subscribe(eventName, callback) {\n    if (!listeners[eventName]) listeners[eventName] = [];\n    listeners[eventName].push(callback);\n    return function unsubscribe() {\n      listeners[eventName] = listeners[eventName].filter((fn) => fn !== callback);\n    };\n  }\n\n  function publish(eventName, data) {\n    (listeners[eventName] || []).forEach((callback) => callback(data));\n  }\n\n  return { subscribe, publish };\n}\n\nconst bus = createEventBus();\nconst unsubscribe = bus.subscribe('taskAdded', (task) => console.log('Listener A:', task));\nbus.subscribe('taskAdded', (task) => console.log('Listener B:', task));\n\nbus.publish('taskAdded', { title: 'Write tests' });\nunsubscribe();\nbus.publish('taskAdded', { title: 'Only B should see this' });",
        explanation: "Both listeners react to the first publish; after Listener A unsubscribes, only Listener B reacts to the second publish for the same event name.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Design Patterns in JavaScript Assessment",
    questions: [
      {
        question: "Why does a plain shared object literal already behave like a Singleton in JavaScript?",
        options: [
          "Because JavaScript prevents object literals from being copied",
          "Because every reference to it points to the identical object in memory, and a module's top-level code runs only once",
          "Because object literals cannot be modified after creation",
          "Because JavaScript automatically freezes every object literal",
        ],
        correctAnswerIndex: 1,
        explanation: "All references to the same object literal point to one shared instance, which combined with a module running once, naturally produces Singleton-like behavior.",
      },
      {
        question: "What is the purpose of a lazily-initialized Singleton built with a closure?",
        options: [
          "To create a brand new instance on every request",
          "To defer creating a potentially expensive instance until it's actually first requested, then reuse it afterward",
          "To permanently delete the instance after first use",
          "To make the instance globally mutable from anywhere",
        ],
        correctAnswerIndex: 1,
        explanation: "A lazy Singleton avoids unnecessary work until the instance is genuinely needed, caching it for every future request via a closure.",
      },
      {
        question: "What does a factory function do?",
        options: ["It defines a class requiring new", "It builds and returns a plain object directly, without new or class", "It only manipulates numbers", "It permanently freezes the global scope"],
        correctAnswerIndex: 1,
        explanation: "A factory function is an ordinary function whose purpose is constructing and returning a new object.",
      },
      {
        question: "What does 'composition' mean when applied to factory functions?",
        options: [
          "Writing everything in a single large function",
          "Combining behavior from multiple smaller factory functions into a new object, instead of relying on class inheritance",
          "Renaming variables for readability",
          "Converting all factory functions into classes",
        ],
        correctAnswerIndex: 1,
        explanation: "Composition builds new objects by combining the results of simpler factory functions, an alternative to inheriting from a shared base class.",
      },
      {
        question: "Why can a factory function's returned object contain genuinely private state?",
        options: [
          "Because JavaScript objects are private by default",
          "Because the returned functions close over the factory function's local variables, which are never directly exposed",
          "Because factory functions require the private keyword",
          "Private state is not actually possible with factory functions",
        ],
        correctAnswerIndex: 1,
        explanation: "Just like the module pattern, a factory function's returned methods keep access to local variables through closures, without exposing those variables directly.",
      },
      {
        question: "What is the main purpose of the observer / pub-sub pattern?",
        options: [
          "To let multiple independent listeners react to an event without the publisher knowing about them",
          "To prevent more than one function from ever running at once",
          "To force all code to run synchronously",
          "To combine multiple events into a single event automatically",
        ],
        correctAnswerIndex: 0,
        explanation: "Pub-sub decouples the publisher of an event from whatever listeners choose to react to it.",
      },
      {
        question: "Why does subscribe() typically return an unsubscribe function?",
        options: [
          "It's purely optional and has no real use",
          "So a listener can stop receiving future events, preventing listeners from accumulating indefinitely",
          "So publish() no longer requires an event name",
          "So the event bus destroys itself after one use",
        ],
        correctAnswerIndex: 1,
        explanation: "An unsubscribe function gives calling code a clean way to remove a listener later, avoiding an ever-growing list of stale listeners.",
      },
      {
        question: "What happens if publish() calls forEach directly on listeners[eventName] without checking whether it exists first?",
        options: [
          "Nothing; forEach handles undefined values automatically",
          "It throws an error, since forEach cannot be called on undefined",
          "It silently returns an empty array",
          "It automatically creates an empty array first",
        ],
        correctAnswerIndex: 1,
        explanation: "Calling forEach on undefined throws a TypeError, which is why publish() should guard with something like (listeners[eventName] || []).",
      },
      {
        question: "What is a common mistake that breaks a Singleton implemented as a factory function?",
        options: [
          "Returning the exact same cached object on every call",
          "Accidentally building and returning a brand new object every time the 'Singleton' is requested, instead of caching one",
          "Using a closure to store the instance",
          "Only creating the instance once it is actually needed",
        ],
        correctAnswerIndex: 1,
        explanation: "If a factory creates a new object on every call instead of reusing a cached one, it no longer behaves like a Singleton at all.",
      },
      {
        question: "Why might composing behavior from factory functions be preferred over deep class inheritance in JavaScript?",
        options: [
          "Because JavaScript does not support classes at all",
          "Because composition avoids this-binding surprises and deep inheritance chains while still allowing shared, reusable behavior",
          "Because factory functions run faster on every JavaScript engine",
          "Because class syntax was removed from modern JavaScript",
        ],
        correctAnswerIndex: 1,
        explanation: "Composing objects from factory functions sidesteps common class pitfalls like this binding and fragile inheritance hierarchies, while still enabling code reuse.",
      },
    ],
  },
  assignment:
    "Build a 'Cache Singleton': write a createLazySingleton(factory) closure helper (or reuse the version from this module's first lesson), and use it to build a single shared inMemoryCache Singleton exposing get(key), set(key, value), and clear() methods backed by a private object. Demonstrate that requesting the cache Singleton multiple times, from at least two separately named references, always returns the exact same object, set a value through one reference, and confirm it's visible when reading through the other.",
  assignmentDeliverables: [
    "script.js with a createLazySingleton() helper and an inMemoryCache Singleton built from it, exposing get/set/clear",
    "Printed output confirming two references to the cache are identical and share the same stored data",
  ],
  assignmentAssessmentCriteria: [
    "The cache Singleton is only ever created once, confirmed by requesting it multiple times",
    "get/set/clear correctly operate on the same shared private data through every reference",
  ],
  miniProject:
    "Combine factory functions and the pub-sub pattern into a 'Notification Center': write a createEventBus() factory (from this module) plus a createNotifier(kind) factory function that returns an object with a notify(message) method, where kind determines how the message is formatted, for example a 'console' kind might prefix messages with '[INFO]', and an 'urgent' kind might prefix them with '[URGENT]'. Subscribe at least one notifier of each kind to a shared event name on one event bus, publish at least three events with different messages, and print a final summary confirming each notifier received and formatted every published message correctly.",
  miniProjectDeliverables: [
    "script.js combining a createEventBus() pub-sub system with at least two createNotifier() factory-built notifiers subscribed to it",
    "Printed output showing each notifier correctly formatting and reacting to every published event",
  ],
  miniProjectAssessmentCriteria: [
    "createNotifier() correctly uses a factory function to produce independently configured notifier objects",
    "The event bus correctly delivers every published event to every currently subscribed notifier",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
