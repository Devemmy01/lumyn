import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module6: GeneratedModule = {
  title: "Design Patterns in Python",
  description:
    "Implement three classic design patterns (Singleton, Factory, and Observer) in idiomatic Python, and learn to judge when each one is genuinely worth its added complexity.",
  completionStatus: "locked",
  lessons: [
    {
      title: "The Singleton Pattern",
      goal: "Implement the Singleton pattern in idiomatic Python and understand when it's worth using.",
      videoTitle: "Python Singleton Pattern Explained",
      videoSearchQuery: "python singleton design pattern tutorial",
      videoLearningGoal: "See a Singleton implemented using __new__ and discussion of simpler Python alternatives like a module-level instance.",
      recommendedChannels: ["ArjanCodes", "Tech With Tim"],
      keyTakeaways: [
        "A Singleton ensures a class has only one instance, and provides a single global point of access to it.",
        "In Python, a Singleton is commonly implemented by overriding __new__ to return an existing instance if one already exists.",
        "Python often achieves the same goal more simply with a module-level variable, since modules are already singletons by nature.",
      ],
      notes:
        "The Singleton pattern restricts a class to a single shared instance, useful for things like a single configuration object or a single connection manager that the whole program should agree on. Python has several ways to implement it, from formal to pragmatic.",
      conceptExplanation:
        "class AppConfig: _instance = None; def __new__(cls, *args, **kwargs): if cls._instance is None: cls._instance = super().__new__(cls); return cls._instance ensures every call to AppConfig() returns the exact same object. Since Python modules are only ever imported once and then cached, a simpler and very common Python idiom is just to create one instance at module level, like config = AppConfig(), and have other files import that same instance directly, sidestepping the __new__ machinery entirely for most everyday cases.",
      whyItMatters: "Recognizing when you genuinely need a single shared instance, versus when a plain module-level variable or a passed-in dependency would be simpler, keeps your code from reaching for unnecessary complexity.",
      practicalTask:
        "In the Academy workspace, main.py is already open for you. Implement a Singleton class called AppConfig using the __new__ override pattern, storing a settings dictionary as an instance attribute. Create two separate 'instances' with AppConfig() and confirm with is that they are actually the same object. Modify a setting through one variable and print it through the other to prove they share state.",
      challenge: "Add a class method get_instance() as an alternative access point, and in a comment, note which approach, calling AppConfig() directly or get_instance(), reads more clearly to you and why.",
      expectedResult: "Both variables created from AppConfig() are confirmed identical with is, and changing a setting through one is visible through the other.",
      tests: [
        "AppConfig.__new__ ensures only one instance is ever created",
        "Two separately created variables both reference the exact same object, confirmed with is",
      ],
      hint: "cls._instance stores state on the class itself, shared by every call to __new__, not on any single instance.",
      lessonAssessment: [
        {
          question: "What guarantee does the Singleton pattern provide?",
          options: ["A class can never be instantiated", "A class has at most one instance, shared everywhere it's accessed", "A class runs faster than normal", "A class cannot have any attributes"],
          correctAnswerIndex: 1,
          explanation: "A Singleton restricts a class to exactly one shared instance, accessible from anywhere that references it.",
        },
        {
          question: "Why is a Singleton sometimes unnecessary complexity in Python specifically?",
          options: [
            "Python doesn't support classes with only one instance",
            "A module-level variable already behaves like a singleton, since modules are cached after their first import",
            "Singletons are illegal in Python",
            "Python automatically prevents creating more than one instance of any class",
          ],
          correctAnswerIndex: 1,
          explanation: "Because a module is imported only once and cached, a plain module-level instance already provides the single-shared-object behavior a Singleton is meant to guarantee.",
        },
      ],
      commonMistakes: [
        "Overriding __init__ instead of __new__ when trying to prevent re-initialization, which still re-runs __init__ on every call even though __new__ returns the same object.",
        "Reaching for a formal Singleton class when a simple module-level instance would be clearer and sufficient.",
      ],
      deliverables: ["main.py with a Singleton AppConfig class demonstrated with two references to the same instance"],
      assessmentCriteria: ["Singleton correctly returns the same instance on every construction call", "Shared state is demonstrated correctly through two separate references"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'class AppConfig:\n    _instance = None\n\n    def __new__(cls, *args, **kwargs):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n            cls._instance.settings = {}\n        return cls._instance\n\nfirst = AppConfig()\nsecond = AppConfig()\nfirst.settings["debug"] = True\nprint(second.settings)\nprint(first is second)',
        explanation: "__new__ only creates a real object the first time; every later call returns that same cached instance, so both variables share the same settings dictionary.",
      },
      completionStatus: "not_started",
    },
    {
      title: "The Factory Pattern",
      goal: "Implement the Factory pattern to centralize object creation logic behind a single function or method.",
      videoTitle: "Python Factory Pattern Explained",
      videoSearchQuery: "python factory design pattern tutorial",
      videoLearningGoal: "See a factory function decide which of several related classes to instantiate based on input, keeping that decision out of the calling code.",
      recommendedChannels: ["ArjanCodes", "Corey Schafer"],
      keyTakeaways: [
        "The Factory pattern centralizes the logic for deciding which class to instantiate behind one function or method.",
        "Calling code depends only on the factory and the common interface, not on every concrete class it might receive.",
        "Adding a new type later usually means updating the factory in one place, rather than every place objects were created.",
      ],
      notes:
        "Instead of scattering if/elif chains that decide which class to create throughout your codebase, a factory function centralizes that decision in one place. Calling code just asks the factory for what it needs and gets back an object matching a shared interface.",
      conceptExplanation:
        "def create_notifier(kind): if kind == 'email': return EmailNotifier(); elif kind == 'sms': return SmsNotifier(); raise ValueError(f'Unknown notifier kind: {kind}') is a factory function. Every notifier class shares a common method, like send(message), so calling code that receives whatever create_notifier() returns doesn't need to know or care which concrete class it got; it just calls .send(). When a new notifier type is added later, only the factory function needs a new branch, not every place a notifier is created throughout the program.",
      whyItMatters: "Factories keep object-creation decisions in one place, which makes adding new types safer and prevents the same branching logic from being duplicated across a codebase.",
      practicalTask:
        "Define at least two classes, such as EmailNotifier and SmsNotifier, that each implement a send(message) method with different printed output. Write a factory function create_notifier(kind) that returns the correct instance based on a string argument, raising a ValueError for an unrecognized kind. Call the factory with both valid kinds, call .send() on each result, and demonstrate the ValueError case using try/except.",
      challenge: "Add a third notifier type and update only the factory function to support it, without changing any of the calling code that uses create_notifier().",
      expectedResult: "Both valid notifier kinds produce correctly typed objects that respond to .send() correctly, and an invalid kind raises a caught ValueError with a clear message.",
      tests: [
        "create_notifier() returns the correct class instance for each recognized kind string",
        "create_notifier() raises a ValueError for an unrecognized kind, caught with try/except",
      ],
      hint: "Each notifier class should implement the same method name, like send(), so calling code can treat the results interchangeably.",
      lessonAssessment: [
        {
          question: "What is the main purpose of the Factory pattern?",
          options: ["To make classes run faster", "To centralize the decision of which class to instantiate behind one function or method", "To prevent any class from being instantiated directly", "To combine multiple classes into a single class"],
          correctAnswerIndex: 1,
          explanation: "A factory centralizes and hides the class-selection decision behind a single function or method.",
        },
        {
          question: "Why does calling code that uses a factory typically not need to know the exact concrete class it receives?",
          options: ["Because factories only ever return strings", "Because the returned objects share a common interface, like the same method name", "Because Python hides the class name automatically", "It does need to know the exact class"],
          correctAnswerIndex: 1,
          explanation: "As long as every possible returned object implements the same interface, calling code can use it without caring about its concrete type.",
        },
      ],
      commonMistakes: [
        "Scattering the same if/elif type-selection logic in multiple places instead of centralizing it in one factory function.",
        "Forgetting to raise a clear error for unrecognized input, letting an invalid kind silently produce None or a confusing failure later.",
      ],
      deliverables: ["main.py with a factory function and at least two classes sharing a common method"],
      assessmentCriteria: ["Factory function correctly returns the right class instance for valid input", "Factory function raises a clear error for invalid input"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'class EmailNotifier:\n    def send(self, message):\n        print(f"Emailing: {message}")\n\nclass SmsNotifier:\n    def send(self, message):\n        print(f"Texting: {message}")\n\ndef create_notifier(kind):\n    if kind == "email":\n        return EmailNotifier()\n    if kind == "sms":\n        return SmsNotifier()\n    raise ValueError(f"Unknown notifier kind: {kind}")\n\nfor kind in ["email", "sms"]:\n    notifier = create_notifier(kind)\n    notifier.send("Task completed")',
        explanation: "Calling code never checks which class it got; it just calls .send(), and the factory function is the only place that knows how each kind maps to a class.",
      },
      completionStatus: "not_started",
    },
    {
      title: "The Observer Pattern",
      goal: "Implement the Observer pattern so multiple listener objects can react automatically when a subject's state changes.",
      videoTitle: "Python Observer Pattern Explained",
      videoSearchQuery: "python observer design pattern tutorial",
      videoLearningGoal: "See a subject notify a list of subscribed observer objects whenever its state changes, without the subject knowing any observer's implementation details.",
      recommendedChannels: ["ArjanCodes", "Tech With Tim"],
      keyTakeaways: [
        "In the Observer pattern, a subject keeps a list of observers and notifies all of them whenever a relevant event happens.",
        "Observers implement a common method, like update(event), that the subject calls, without needing to know what each observer actually does with it.",
        "Observers can be added or removed at runtime, decoupling the subject from any specific fixed set of reactions.",
      ],
      notes:
        "The Observer pattern lets one object, the subject, broadcast changes to any number of other objects, the observers, that have subscribed to it, without the subject needing to know anything about what those observers actually do in response. This keeps the subject and its observers loosely coupled.",
      conceptExplanation:
        "class TaskBoard: def __init__(self): self._observers = []; def subscribe(self, observer): self._observers.append(observer); def add_task(self, task): for observer in self._observers: observer.update(task) lets any number of observer objects register interest and get notified automatically. Each observer just needs to implement update(task) however it likes, whether that's printing a message, counting events, or logging to a list; TaskBoard never needs to know or care which.",
      whyItMatters: "The Observer pattern is the foundation behind event systems, UI frameworks, and pub/sub architectures: any situation where multiple independent parts of a program need to react to the same change without being tightly wired together.",
      practicalTask:
        "Write a TaskBoard subject class with subscribe(observer) and add_task(task) methods, where add_task notifies every subscribed observer by calling observer.update(task). Write at least two different observer classes, for example one that prints a notification message and one that keeps a running count of tasks seen, each implementing update(task) differently. Subscribe both observers to one TaskBoard, add a few tasks, and print the final count from the counting observer to confirm it received every notification.",
      challenge: "Add an unsubscribe(observer) method to TaskBoard, unsubscribe one observer partway through adding tasks, and confirm through printed output that it stopped receiving notifications for tasks added afterward.",
      expectedResult: "Every subscribed observer reacts to every added task in its own way, and the counting observer's final count exactly matches the number of tasks added while it was subscribed.",
      tests: [
        "TaskBoard notifies all subscribed observers via a shared update(task) method whenever a task is added",
        "At least two different observer implementations react differently to the same notifications",
      ],
      hint: "The subject only needs to call observer.update(task) on each subscribed observer; it never needs to know what each observer's update() actually does internally.",
      lessonAssessment: [
        {
          question: "In the Observer pattern, what does the subject do when a relevant event occurs?",
          options: ["It stops running", "It notifies all subscribed observers by calling a shared method on each of them", "It deletes all its observers", "It converts itself into an observer"],
          correctAnswerIndex: 1,
          explanation: "The subject broadcasts the event to every subscribed observer through a common method.",
        },
        {
          question: "Why is the Observer pattern described as keeping the subject and observers 'loosely coupled'?",
          options: ["Because they run in separate programs entirely", "Because the subject only depends on observers implementing a shared method, not on any observer's internal details", "Because observers cannot be added or removed", "Because there can only ever be one observer"],
          correctAnswerIndex: 1,
          explanation: "The subject interacts with observers only through a shared interface, never their internal implementation, which keeps the two loosely coupled.",
        },
      ],
      commonMistakes: [
        "Having the subject directly call specific, named methods for each observer type instead of one shared interface method, which defeats the purpose of the pattern.",
        "Forgetting to provide a way to unsubscribe, causing observers to keep receiving notifications long after they should have stopped.",
      ],
      deliverables: ["main.py with a TaskBoard subject and at least two observer classes reacting to notifications"],
      assessmentCriteria: ["Subject correctly notifies every subscribed observer through a shared method", "Observers correctly implement distinct reactions to the same notifications"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'class TaskBoard:\n    def __init__(self):\n        self._observers = []\n\n    def subscribe(self, observer):\n        self._observers.append(observer)\n\n    def add_task(self, task):\n        for observer in self._observers:\n            observer.update(task)\n\nclass PrintObserver:\n    def update(self, task):\n        print(f"New task: {task}")\n\nclass CountingObserver:\n    def __init__(self):\n        self.count = 0\n\n    def update(self, task):\n        self.count += 1\n\nboard = TaskBoard()\nprinter = PrintObserver()\ncounter = CountingObserver()\nboard.subscribe(printer)\nboard.subscribe(counter)\nboard.add_task("Write tests")\nboard.add_task("Fix bug")\nprint(counter.count)',
        explanation: "TaskBoard never knows what PrintObserver or CountingObserver actually do with a task; it only calls the shared update() method on each subscribed observer.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Design Patterns in Python Assessment",
    questions: [
      {
        question: "What guarantee does the Singleton pattern provide?",
        options: ["A class can never be instantiated", "A class has at most one instance, shared everywhere it's accessed", "A class must have exactly ten instances", "A class cannot have any methods"],
        correctAnswerIndex: 1,
        explanation: "A Singleton restricts a class to a single, shared instance accessible everywhere it's referenced.",
      },
      {
        question: "Why is a formal Singleton class sometimes unnecessary in Python?",
        options: ["Python doesn't support single-instance classes", "A module-level variable already behaves like a singleton, since modules are cached after their first import", "Singletons are illegal in Python", "Classes cannot hold state in Python"],
        correctAnswerIndex: 1,
        explanation: "Because modules are imported and cached only once, a plain module-level instance often achieves the same effect more simply.",
      },
      {
        question: "What is the main purpose of the Factory pattern?",
        options: ["To make classes run faster", "To centralize the decision of which class to instantiate behind one function or method", "To prevent any class from being instantiated directly", "To merge multiple classes into one"],
        correctAnswerIndex: 1,
        explanation: "A factory function or method is responsible for deciding which concrete class to create, keeping that logic in one place.",
      },
      {
        question: "Why does calling code that uses a factory typically not need to know the exact concrete class it receives?",
        options: ["Because factories only return strings", "Because the returned objects share a common interface, like the same method name", "Because Python hides class names automatically", "It always does need to know the exact class"],
        correctAnswerIndex: 1,
        explanation: "As long as returned objects share a common interface, calling code can use them interchangeably without knowing their exact type.",
      },
      {
        question: "In the Observer pattern, what does the subject do when a relevant event occurs?",
        options: ["It stops running entirely", "It notifies all subscribed observers by calling a shared method on each of them", "It deletes all its observers", "It converts itself into an observer"],
        correctAnswerIndex: 1,
        explanation: "The subject broadcasts the change to every subscribed observer through a shared notification method.",
      },
      {
        question: "Why is the Observer pattern described as 'loosely coupled'?",
        options: ["Because subject and observers run in separate programs", "Because the subject only depends on observers implementing a shared method, not on their internal details", "Because there can only ever be one observer", "Because observers cannot be added or removed"],
        correctAnswerIndex: 1,
        explanation: "The subject depends only on a shared interface, not on how each observer is internally implemented.",
      },
      {
        question: "What is a reasonable question to ask before applying a design pattern to a problem?",
        options: [
          "Does this pattern look impressive?",
          "Does the added structure genuinely solve a real problem here, or would a simpler, direct approach work just as well?",
          "Are there fewer than 3 classes involved?",
          "Design patterns should always be applied regardless of the problem",
        ],
        correctAnswerIndex: 1,
        explanation: "Design patterns add structure and indirection; they're worth it only when that structure solves a real, recurring problem, not by default.",
      },
      {
        question: "What is a common mistake when implementing a Singleton with __new__?",
        options: [
          "Overriding __init__ instead, which still re-runs on every construction call even though __new__ returns the same object",
          "Using a class variable to store the instance",
          "Returning cls._instance when it already exists",
          "Using super().__new__(cls) to create the first instance",
        ],
        correctAnswerIndex: 0,
        explanation: "Even when __new__ correctly returns the cached instance, __init__ still runs again on every call, which can unintentionally reset state if not handled carefully.",
      },
      {
        question: "What is a common mistake when implementing a factory function?",
        options: [
          "Raising a clear error for unrecognized input",
          "Scattering the same type-selection logic in multiple places instead of centralizing it in the factory",
          "Returning objects that share a common method",
          "Adding a new branch when a new type is introduced",
        ],
        correctAnswerIndex: 1,
        explanation: "Duplicating the same selection logic elsewhere defeats the purpose of centralizing it in one factory function.",
      },
      {
        question: "What is a common mistake when implementing the Observer pattern?",
        options: [
          "Providing an unsubscribe method",
          "Having the subject call one shared method on every observer",
          "Having the subject call specific, differently-named methods for each observer type, defeating the shared interface",
          "Allowing multiple observers to subscribe to one subject",
        ],
        correctAnswerIndex: 2,
        explanation: "Calling different, type-specific methods on each observer reintroduces tight coupling that the shared interface was meant to avoid.",
      },
    ],
  },
  assignment:
    "Build a 'Logger Singleton': a Singleton class SimpleLogger with a log(message) method that appends messages, paired with an internal counter used as a simple sequence number instead of a real timestamp, to an internal list, and a get_logs() method returning that list. Create two separate variables using SimpleLogger(), confirm with is that they reference the same object, log a few messages through one variable, and print get_logs() through the other to prove they share the same history.",
  assignmentDeliverables: [
    "main.py with a Singleton SimpleLogger class",
    "Printed output confirming both variables reference the same instance and share log history",
  ],
  assignmentAssessmentCriteria: [
    "SimpleLogger correctly returns the same instance on every construction call",
    "Logged messages are visible and consistent across both references",
  ],
  miniProject:
    "Combine the Factory and Observer patterns into a 'Notification Center': write a factory function create_observer(kind) that returns either a ConsoleObserver, which prints each notification, or a CountingObserver, which tracks how many notifications it received, based on a string argument. Build a subject class EventBus with subscribe(observer) and publish(event) methods, where publish notifies every subscribed observer through a shared update(event) method. Use the factory to create at least one of each observer type, subscribe both to one EventBus, publish several events, and print a final summary including the CountingObserver's total.",
  miniProjectDeliverables: [
    "main.py combining a create_observer(kind) factory function with an EventBus subject and at least two observer types",
    "Printed output showing each observer reacting to published events and a final summary count",
  ],
  miniProjectAssessmentCriteria: [
    "The factory function correctly creates the requested observer type for each valid kind",
    "EventBus correctly notifies every subscribed observer through the shared update() method",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
