import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module1: GeneratedModule = {
  title: "Dunder Methods & Operator Overloading",
  description:
    "Give your own classes the same natural behavior as Python's built-in types: readable printing, meaningful comparisons, sorting, and operator support, all through dunder methods.",
  completionStatus: "locked",
  lessons: [
    {
      title: "__str__ vs __repr__: Giving Your Objects a Voice",
      goal: "Understand the difference between __str__ and __repr__ and implement both correctly on a custom class.",
      videoTitle: "Python __str__ vs __repr__ Explained",
      videoSearchQuery: "python str vs repr dunder methods tutorial",
      videoLearningGoal: "See __str__ and __repr__ implemented on a class and how print() and the interactive shell choose between them.",
      recommendedChannels: ["Corey Schafer", "ArjanCodes"],
      keyTakeaways: [
        "__str__ defines the readable, user-facing string for an object; print(obj) and str(obj) use it.",
        "__repr__ defines the unambiguous, developer-facing representation; the interactive shell and repr(obj) use it, and it should ideally look like valid Python that could recreate the object.",
        "If __str__ is missing, Python falls back to __repr__, so defining __repr__ alone is a reasonable minimum.",
      ],
      notes:
        "Every Python object has two special methods for turning itself into text: __str__ for a human-readable summary, and __repr__ for a precise, debugging-oriented representation. Without either, printing an object shows something unhelpful like <__main__.Task object at 0x7f2c1a3a5d90>.",
      conceptExplanation:
        "Define __str__(self) to return the string print(obj) and str(obj) should show; keep it short and readable. Define __repr__(self) to return a string that ideally looks like the code used to construct the object, such as \"Task('Email client', priority=2)\". If only __repr__ is defined, Python uses it automatically wherever __str__ would otherwise be used, since __str__'s default implementation calls __repr__.",
      whyItMatters: "Good __repr__ output turns confusing debugging sessions into readable ones: instead of a generic memory address, you see exactly what an object contains.",
      practicalTask:
        "In the Academy workspace, main.py is already open for you. Define a class Task with an __init__ that stores title and priority. Implement __str__ to return a friendly one-line summary like 'Email client (priority 2)', and __repr__ to return a string like \"Task('Email client', priority=2)\". Create two Task instances and print() each one, then put one in a list and print the list to see __repr__ used automatically.",
      challenge: "Remove your __str__ method temporarily, print a Task again, and confirm in a comment that Python fell back to __repr__ automatically.",
      expectedResult: "Printing a single Task shows the friendly __str__ text; printing a list of Tasks shows the __repr__ form for each element.",
      tests: [
        "Task defines both __str__ and __repr__ returning different strings",
        "Printing a list of Task objects displays the __repr__ output for each item",
      ],
      hint: "print(a_list) never calls __str__ on the items inside it; Python always uses __repr__ for objects shown inside a collection.",
      lessonAssessment: [
        {
          question: "What does print(obj) call, if a class defines both __str__ and __repr__?",
          options: ["__str__", "__repr__", "Both, in order", "Neither, unless str() is called explicitly"],
          correctAnswerIndex: 0,
          explanation: "print() and str() use __str__ when it's defined; __repr__ is used as a fallback or when an object appears inside a container.",
        },
        {
          question: "What happens if a class defines only __repr__ and no __str__?",
          options: [
            "Printing the object raises an error",
            "Python falls back to using __repr__ for str() and print()",
            "The object cannot be printed at all",
            "Python auto-generates a __str__ using the class's field names",
          ],
          correctAnswerIndex: 1,
          explanation: "The default __str__ implementation simply calls __repr__, so defining __repr__ alone still makes print() and str() work.",
        },
      ],
      commonMistakes: [
        "Defining __repr__ to return a non-string value, which raises a TypeError.",
        "Assuming __str__ is used everywhere, when Python actually uses __repr__ for objects displayed inside lists, dicts, and other containers.",
      ],
      deliverables: ["main.py defining a Task class with working __str__ and __repr__ methods"],
      assessmentCriteria: ["__str__ returns a concise, readable summary", "__repr__ returns a precise representation useful for debugging"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'class Task:\n    def __init__(self, title, priority):\n        self.title = title\n        self.priority = priority\n\n    def __str__(self):\n        return f"{self.title} (priority {self.priority})"\n\n    def __repr__(self):\n        return f"Task({self.title!r}, priority={self.priority})"\n\ntask = Task("Email client", 2)\nprint(task)\nprint([task])',
        explanation: "print(task) uses __str__ for a friendly summary, while printing the list uses __repr__ for each item, since Python always falls back to __repr__ inside containers.",
      },
      completionStatus: "not_started",
    },
    {
      title: "__eq__ and __lt__: Making Objects Comparable",
      goal: "Implement __eq__ and __lt__ so custom objects can be compared and sorted meaningfully.",
      videoTitle: "Python __eq__ and __lt__: Custom Object Comparisons",
      videoSearchQuery: "python eq lt dunder methods sorting objects tutorial",
      videoLearningGoal: "See how implementing __eq__ and __lt__ lets custom objects work with ==, sorted(), and sort().",
      recommendedChannels: ["ArjanCodes", "Tech With Tim"],
      keyTakeaways: [
        "By default, == on custom objects compares identity (are they the same object in memory), not their field values.",
        "__eq__(self, other) lets you define what counts as 'equal' based on field values.",
        "__lt__(self, other) lets sorted() and sort() order custom objects without a separate key function.",
      ],
      notes:
        "Without __eq__, comparing two objects with == just checks whether they are literally the same object in memory, even if they hold identical data. Without __lt__, calling sorted() on a list of custom objects raises a TypeError, since Python has no idea how to order them.",
      conceptExplanation:
        "Implement __eq__(self, other) to return True when the objects should be treated as equal, usually by comparing relevant attributes: return self.title == other.title and self.priority == other.priority. Implement __lt__(self, other) to return True when self should sort before other, such as return self.priority < other.priority. Once __lt__ exists, sorted(tasks) and tasks.sort() work directly, and functools.total_ordering can fill in <=, >, and >= automatically from __eq__ and __lt__ alone.",
      whyItMatters: "Sortable, comparable objects are everywhere in real programs, from prioritizing tasks to ranking search results, and __eq__ and __lt__ are what make Python's built-in sorted() work with your own types.",
      practicalTask:
        "Add __eq__ and __lt__ to your Task class from the previous lesson: two tasks are equal if their title and priority match, and one task is 'less than' another if its priority number is lower (a lower number means higher urgency). Create a list of at least 4 Task objects with different priorities, sort the list with sorted(), and print the sorted result.",
      challenge: "Import total_ordering from functools, decorate your Task class with @total_ordering, and confirm in a comment that >, <=, and >= now work even though you only defined __eq__ and __lt__.",
      expectedResult: "sorted() correctly orders the list of Task objects from highest priority (lowest number) to lowest priority, printed using their __str__ output.",
      tests: [
        "Task defines __eq__ comparing at least two attributes",
        "Task defines __lt__ so sorted() orders a list of Task objects without errors",
      ],
      hint: "sorted() calls __lt__ repeatedly behind the scenes; you never need to write your own sorting algorithm.",
      lessonAssessment: [
        {
          question: "Without a custom __eq__, what does == compare on two instances of the same class?",
          options: ["Their field values", "Whether they are the same object in memory (identity)", "Always True", "Always False"],
          correctAnswerIndex: 1,
          explanation: "Python's default __eq__ compares object identity, not the values stored in the objects' attributes.",
        },
        {
          question: "What happens if you call sorted() on a list of custom objects with no __lt__ defined?",
          options: ["It sorts by memory address silently", "It raises a TypeError", "It returns the list unchanged", "It sorts alphabetically by class name"],
          correctAnswerIndex: 1,
          explanation: "sorted() needs a way to compare items; without __lt__, Python has no rule for ordering custom objects and raises a TypeError.",
        },
      ],
      commonMistakes: [
        "Forgetting that == uses identity by default, leading to 'equal-looking' objects comparing as not equal.",
        "Implementing __lt__ but forgetting it must return a bool, not the value being compared.",
      ],
      deliverables: ["main.py with a Task class implementing __eq__ and __lt__, sorted with sorted()"],
      assessmentCriteria: ["__eq__ compares meaningful attributes rather than identity", "sorted() produces a correctly ordered list using __lt__"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'from functools import total_ordering\n\n@total_ordering\nclass Task:\n    def __init__(self, title, priority):\n        self.title = title\n        self.priority = priority\n\n    def __eq__(self, other):\n        return self.title == other.title and self.priority == other.priority\n\n    def __lt__(self, other):\n        return self.priority < other.priority\n\ntasks = [Task("Fix bug", 1), Task("Write docs", 3), Task("Review PR", 2)]\nfor task in sorted(tasks):\n    print(task.title, task.priority)',
        explanation: "sorted() relies entirely on __lt__ to order the list; total_ordering fills in <=, >, and >= automatically from __eq__ and __lt__ alone.",
      },
      completionStatus: "not_started",
    },
    {
      title: "__add__, Other Operator Overloads, and __len__",
      goal: "Overload + and implement __len__ so a custom container-like class behaves like Python's built-in types.",
      videoTitle: "Python Operator Overloading: __add__ and __len__",
      videoSearchQuery: "python operator overloading add len dunder methods tutorial",
      videoLearningGoal: "See __add__ combine two custom objects with + and __len__ make a custom class work with the built-in len() function.",
      recommendedChannels: ["Corey Schafer", "freeCodeCamp.org"],
      keyTakeaways: [
        "__add__(self, other) defines what self + other does for your class.",
        "__len__(self) lets a custom class work with the built-in len() function.",
        "Operator overloads should return a new object rather than mutating self, matching how + behaves on built-in types.",
      ],
      notes:
        "Operator overloading lets your own classes respond to +, -, *, and other symbols in a way that makes sense for their data. __len__ plugs a class into len(), and also makes empty instances 'falsy' in an if check, matching how empty lists and strings behave.",
      conceptExplanation:
        "def __add__(self, other): return TaskList(self.tasks + other.tasks) lets two TaskList objects be combined with the + symbol, returning a brand new TaskList rather than modifying either original list, the same way [1, 2] + [3, 4] doesn't change either input list. def __len__(self): return len(self.tasks) makes len(my_task_list) work, and also makes if my_task_list: treat an empty TaskList as False, just like an empty list.",
      whyItMatters: "Overloaded operators let code that uses your class read naturally, like combined_list = list_a + list_b, instead of forcing everyone to call a specially named method.",
      practicalTask:
        "Create a class TaskList that wraps a list of Task objects and implements __len__ to return the number of tasks it holds, and __add__ to combine two TaskList instances into a new TaskList containing all their tasks. Create two TaskList instances with a few tasks each, print len() of each, combine them with +, and print the length of the combined result.",
      challenge: "Add __contains__(self, item) so you can check if a specific Task is inside a TaskList using the in keyword, and demonstrate it with a print statement.",
      expectedResult: "The combined TaskList's length equals the sum of the two original lengths, confirmed with printed len() calls.",
      tests: [
        "TaskList implements __len__ returning the correct count",
        "TaskList implements __add__ returning a new TaskList containing tasks from both operands",
      ],
      hint: "__add__ should return a new object built from combined data, not modify self.tasks in place.",
      lessonAssessment: [
        {
          question: "Which dunder method lets a custom object work with Python's built-in len() function?",
          options: ["__size__", "__len__", "__count__", "__length__"],
          correctAnswerIndex: 1,
          explanation: "len(obj) calls obj.__len__() internally, so implementing __len__ is what connects a class to the built-in function.",
        },
        {
          question: "What should __add__ typically do?",
          options: [
            "Modify self in place and return None",
            "Return a brand new object representing the combined result",
            "Print the combined result instead of returning it",
            "Always raise NotImplementedError",
          ],
          correctAnswerIndex: 1,
          explanation: "Following the convention set by built-in types, + should produce a new object rather than mutating either operand.",
        },
      ],
      commonMistakes: [
        "Implementing __add__ to mutate self instead of returning a new object, which breaks the usual expectation that a + b doesn't change a.",
        "Forgetting that __len__ must return a non-negative integer, or Python raises a TypeError.",
      ],
      deliverables: ["main.py with a TaskList class implementing __len__ and __add__"],
      assessmentCriteria: [
        "__len__ returns the correct count of contained items",
        "__add__ correctly combines two instances into a new one without mutating the originals",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'class TaskList:\n    def __init__(self, tasks):\n        self.tasks = tasks\n\n    def __len__(self):\n        return len(self.tasks)\n\n    def __add__(self, other):\n        return TaskList(self.tasks + other.tasks)\n\nmorning = TaskList(["Standup", "Email"])\nafternoon = TaskList(["Review", "Client notes"])\ncombined = morning + afternoon\nprint(len(morning), len(afternoon), len(combined))',
        explanation: "__add__ builds and returns a brand new TaskList instead of modifying morning or afternoon, matching how + works on Python's built-in lists.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Dunder Methods & Operator Overloading Assessment",
    questions: [
      {
        question: "What is the key difference between __str__ and __repr__?",
        options: [
          "There is no difference; they always return the same thing",
          "__str__ is for a readable, user-facing string; __repr__ is for a precise, debugging-oriented representation",
          "__repr__ is only used by print()",
          "__str__ can only return numbers",
        ],
        correctAnswerIndex: 1,
        explanation: "__str__ targets human readability; __repr__ targets precision and debugging, ideally resembling the code used to construct the object.",
      },
      {
        question: "What happens when print() is called on an object whose class defines only __repr__, with no __str__?",
        options: ["It raises an AttributeError", "Python falls back to using __repr__", "It prints an empty string", "It prints only the object's memory address"],
        correctAnswerIndex: 1,
        explanation: "The default __str__ implementation calls __repr__, so defining __repr__ alone is enough for print() to work.",
      },
      {
        question: "By default (without a custom __eq__), what does == compare between two instances of the same class?",
        options: ["Whether their attributes match", "Whether they are literally the same object in memory (identity)", "Whether their class names match", "Nothing; it always returns True"],
        correctAnswerIndex: 1,
        explanation: "Python's default equality check is based on object identity, not attribute values.",
      },
      {
        question: "What must __lt__ return for sorted() to work correctly on a list of custom objects?",
        options: ["The object being compared", "A boolean (True or False)", "An integer", "None"],
        correctAnswerIndex: 1,
        explanation: "sorted() repeatedly calls __lt__ and expects a boolean result to determine ordering.",
      },
      {
        question: "What decorator can automatically fill in <=, >, and >= once __eq__ and __lt__ are defined?",
        options: ["@dataclass", "@functools.total_ordering", "@property", "@staticmethod"],
        correctAnswerIndex: 1,
        explanation: "functools.total_ordering derives the remaining comparison operators from __eq__ and __lt__ alone.",
      },
      {
        question: "What should a well-behaved __add__ method typically do?",
        options: ["Modify self in place and return None", "Return a new object representing the combined result", "Print the result instead of returning it", "Always raise NotImplementedError"],
        correctAnswerIndex: 1,
        explanation: "Following the convention of built-in types, + should produce a new object without mutating either operand.",
      },
      {
        question: "Which built-in function does implementing __len__ connect a custom class to?",
        options: ["size()", "len()", "count()", "length()"],
        correctAnswerIndex: 1,
        explanation: "len(obj) internally calls obj.__len__().",
      },
      {
        question: "Which of these dunder methods is required for a custom object to work correctly as a dictionary key or inside a set?",
        options: ["__str__", "__hash__, paired consistently with __eq__", "__len__", "__add__"],
        correctAnswerIndex: 1,
        explanation: "Dict keys and set members must be hashable; defining a custom __eq__ without a matching __hash__ makes instances unhashable by default.",
      },
      {
        question: "What is a likely bug if __add__ mutates self.tasks directly instead of returning a new list?",
        options: ["Nothing, it works fine", "It breaks the expectation that a + b doesn't modify a, causing confusing side effects", "Python raises a SyntaxError", "The class becomes immutable"],
        correctAnswerIndex: 1,
        explanation: "Mutating self inside __add__ silently changes one of the operands, which surprises anyone who expects + to behave like it does on built-in types.",
      },
      {
        question: "Why is a custom __repr__ especially useful when debugging?",
        options: [
          "It makes the program run faster",
          "It shows a precise, informative representation of an object's state instead of a generic memory address",
          "It is required for all classes to be printable at all",
          "It replaces the need for print() entirely",
        ],
        correctAnswerIndex: 1,
        explanation: "A well-written __repr__ shows exactly what an object contains, which speeds up debugging considerably compared to a default memory-address representation.",
      },
    ],
  },
  assignment:
    "Build a 'Money' class representing a currency amount using two integer fields, dollars and cents, so amounts stay exact and avoid floating point rounding issues. Implement __repr__ to show a clear representation like Money(12, 50), __str__ to print it as a readable amount like $12.50, __eq__ to compare two Money amounts for equality, and __lt__ to compare which amount is smaller by their total value in cents. Create at least 5 Money instances with different values, sort them with sorted(), and print the sorted list alongside their formatted output.",
  assignmentDeliverables: [
    "main.py with a Money class implementing __repr__, __str__, __eq__, and __lt__",
    "Printed output showing at least 5 Money instances correctly sorted from smallest to largest",
  ],
  assignmentAssessmentCriteria: [
    "Money correctly represents dollars and cents as separate integer fields to avoid floating point errors",
    "__eq__ and __lt__ produce correct results based on total value, not just one field",
  ],
  miniProject:
    "Build an 'Inventory' class that wraps a list of item dictionaries, each with a name and a quantity. Implement __len__ to return the total number of distinct items (not total quantity), __add__ to combine two Inventory instances into a new Inventory containing both sets of items, and __str__ to print a readable summary of the inventory's contents. Create two separate Inventory instances, combine them with +, and print the length and summary of the combined result.",
  miniProjectDeliverables: [
    "main.py with an Inventory class implementing __len__, __add__, and __str__",
    "Printed output showing the combined inventory's length and readable summary",
  ],
  miniProjectAssessmentCriteria: [
    "__len__ correctly counts distinct items in the inventory",
    "__add__ correctly combines two inventories into a new one without mutating either original",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
