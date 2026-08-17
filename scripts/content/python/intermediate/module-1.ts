import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module1: GeneratedModule = {
  title: "Object-Oriented Programming Basics",
  description:
    "Learn to model real things as classes and objects: define a class, give every object its own data with __init__, and write methods that act on that data.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Classes and Objects: Building Your Own Blueprints",
      goal: "Understand what a class and an object are, and define and instantiate a simple class.",
      videoTitle: "Python OOP Tutorial: Classes and Objects Explained",
      videoSearchQuery: "python classes and objects tutorial for beginners oop",
      videoLearningGoal: "See how a class acts as a blueprint and how creating an object from it works.",
      recommendedChannels: ["Corey Schafer", "freeCodeCamp.org"],
      keyTakeaways: [
        "A class is a blueprint that defines what data and behavior every object built from it will share.",
        "An object (also called an instance) is one specific thing created from a class, with its own copy of that data.",
        "You define a class with the class keyword and create an object by calling the class name like a function.",
      ],
      notes:
        "Everything you have used so far, strings, lists, dictionaries, is actually an object built from a class that Python defines for you. In this module you start writing your own classes. A class describes a category of thing (Dog, Book, BankAccount); an object is one real example of that category, created by calling the class.",
      conceptExplanation:
        "class Dog: pass defines the simplest possible class: a blueprint with no data or behavior yet. Calling Dog() creates a new object, an instance of Dog, and each call produces a separate object in memory. Two objects created from the same class are still different objects: comparing them with is (which checks whether two names point to the exact same object) returns False unless you assigned one to the other directly.",
      whyItMatters: "Classes let you group related data and behavior into one reusable unit instead of tracking many separate variables that all describe the same thing.",
      practicalTask:
        "In the Academy workspace, main.py is already open for you. Define a class called Dog with just a pass statement in its body. Create two separate Dog objects and print each one, then print the result of comparing them with the is operator to show they are different objects.",
      challenge: "Add a class-level attribute species = \"Canine\" inside the Dog class, outside any method, and print it using both Dog.species and an instance's .species to show both access paths work.",
      expectedResult: "The program prints two Dog object representations, prints False for the is comparison between the two different objects, and prints \"Canine\" for the class attribute.",
      tests: ["A class named Dog is defined using the class keyword", "Two separate Dog objects are created and compared with is"],
      hint: "Calling ClassName() creates a brand new object every time, even if you pass no arguments.",
      lessonAssessment: [
        {
          question: "What is the relationship between a class and an object in Python?",
          options: [
            "They are the same thing with different names",
            "A class is a blueprint; an object is a specific instance created from that blueprint",
            "An object defines the class",
            "A class can only ever create one object",
          ],
          correctAnswerIndex: 1,
          explanation: "A class defines the structure and behavior shared by its instances, while an object is one concrete instance built from that class.",
        },
        {
          question: "What does dog1 is dog2 check?",
          options: [
            "Whether dog1 and dog2 have equal attribute values",
            "Whether dog1 and dog2 are literally the same object in memory",
            "Whether dog1 was created before dog2",
            "Whether dog1 and dog2 belong to the same class",
          ],
          correctAnswerIndex: 1,
          explanation: "The is operator checks object identity, whether two names refer to the exact same object, not whether their contents look alike.",
        },
      ],
      commonMistakes: ["Forgetting the parentheses when creating an object, e.g. writing Dog instead of Dog().", "Assuming two separately created objects are automatically equal just because they came from the same class."],
      deliverables: ["main.py with a Dog class and two created objects"],
      assessmentCriteria: ["Class is defined correctly with the class keyword", "Two distinct objects are created and compared"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'class Dog:\n    species = "Canine"\n\ndog1 = Dog()\ndog2 = Dog()\nprint(dog1)\nprint(dog2)\nprint(dog1 is dog2)\nprint(Dog.species, dog1.species)',
        explanation: "Dog() is called twice to create two separate objects; dog1 is dog2 is False because they are different objects, even though both share the class attribute species.",
      },
      completionStatus: "not_started",
    },
    {
      title: "The __init__ Method and Instance Attributes",
      goal: "Use __init__ to give every new object its own starting data through instance attributes.",
      videoTitle: "Python __init__ Constructor and self Explained",
      videoSearchQuery: "python init constructor self instance attributes tutorial",
      videoLearningGoal: "See __init__ run automatically when an object is created, storing values on self.",
      recommendedChannels: ["Programming with Mosh", "Corey Schafer"],
      keyTakeaways: [
        "__init__ is a special method that runs automatically every time a new object is created.",
        "self refers to the specific object being created or used, and is always the first parameter of an instance method.",
        "Attributes assigned with self.name = value become instance attributes: each object gets its own separate copy.",
      ],
      notes:
        "Instead of manually setting attributes on an object after creating it, you define __init__ to set them up automatically. Every parameter you list after self becomes a value you must (or optionally can) supply when creating an object, and self.attribute_name = value stores that value on the specific object being built.",
      conceptExplanation:
        "def __init__(self, title, author): self.title = title; self.author = author means Book(\"Dune\", \"Frank Herbert\") automatically runs __init__ with self bound to the new object, title set to \"Dune\", and author set to \"Frank Herbert\". Because self.title stores the value on that particular object, two different Book objects can hold two completely different titles without interfering with each other. You never call __init__ directly; Python calls it for you the moment you call the class.",
      whyItMatters: "Instance attributes are what let every object built from the same class carry its own unique data, which is the entire point of modeling real things as objects.",
      practicalTask:
        "Define a class called Book with an __init__ method that accepts title, author, and pages, and stores each as an instance attribute using self. Create two Book objects with different values and print each one's title and author using an f-string.",
      challenge: "Add a fourth parameter, read, with a default value of False, and print whether each book has been read using its .read attribute.",
      expectedResult: "The program prints two different, correctly labeled book descriptions built entirely from each object's own instance attributes.",
      tests: ["__init__ accepts at least 3 parameters besides self and stores them with self.", "Two Book objects hold different attribute values"],
      hint: "Every parameter in __init__ after self needs a matching self.parameter_name = parameter_name line to actually be stored.",
      lessonAssessment: [
        {
          question: "When does a class's __init__ method run?",
          options: [
            "Only when you call it directly by name",
            "Automatically, every time a new object is created from the class",
            "Only once per program, no matter how many objects are made",
            "Never, unless the object calls it explicitly",
          ],
          correctAnswerIndex: 1,
          explanation: "Python automatically calls __init__ as part of creating a new object, so it always runs when the class is called like a function.",
        },
        {
          question: "What does self represent inside an instance method?",
          options: [
            "The class itself",
            "The specific object the method is being called on",
            "A required argument the caller must always pass explicitly",
            "A global variable shared across all objects",
          ],
          correctAnswerIndex: 1,
          explanation: "self is automatically bound to the particular object the method was called on, which is how each object keeps its own separate data.",
        },
      ],
      commonMistakes: ["Forgetting self as the first parameter in __init__, which causes a TypeError when creating an object.", "Writing a parameter in __init__ but forgetting the matching self.name = name line, so the value never gets stored."],
      deliverables: ["A script with a Book class using __init__ to set at least 3 instance attributes"],
      assessmentCriteria: ["__init__ correctly stores every parameter as an instance attribute", "Two objects hold distinct, correctly printed values"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'class Book:\n    def __init__(self, title, author, pages):\n        self.title = title\n        self.author = author\n        self.pages = pages\n\nbook1 = Book("Dune", "Frank Herbert", 412)\nbook2 = Book("Foundation", "Isaac Asimov", 255)\nprint(f"{book1.title} by {book1.author}")\nprint(f"{book2.title} by {book2.author}")',
        explanation: "__init__ runs automatically for each Book() call, storing separate title, author, and pages values on book1 and book2.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Defining and Calling Methods",
      goal: "Write instance methods that use self to read and act on an object's own attributes.",
      videoTitle: "Python Class Methods Tutorial: Defining Behavior with self",
      videoSearchQuery: "python class instance methods tutorial self attributes",
      videoLearningGoal: "See instance methods defined inside a class and called on specific objects using dot notation.",
      recommendedChannels: ["freeCodeCamp.org", "Tech With Tim"],
      keyTakeaways: [
        "A method is a function defined inside a class; its first parameter is always self.",
        "Calling object.method() automatically passes that object in as self.",
        "Methods can read and change an object's own instance attributes using self.attribute_name.",
      ],
      notes:
        "A class becomes genuinely useful once it can do things, not just hold data. Methods are functions defined inside the class body that operate on a specific object's attributes. You call them with dot notation, book1.describe(), and Python automatically supplies book1 as self behind the scenes.",
      conceptExplanation:
        "def describe(self): return f\"{self.title} by {self.author}\" reads the calling object's own title and author. Methods can also change an object's state: def mark_as_read(self): self.read = True updates only the object the method was called on, leaving every other object untouched. This is the core pattern of OOP: bundling data and the operations on that data into one unit.",
      whyItMatters: "Methods are what let objects behave like real things: a Book can describe itself, a BankAccount can deposit money, a Car can accelerate, all without external code reaching in and manually editing attributes.",
      practicalTask:
        "Add two methods to your Book class from the previous lesson: describe(self), which returns a formatted string with the title, author, and page count, and mark_as_read(self), which sets self.read to True. Call describe() on two different books before and after calling mark_as_read() on one of them, printing the results each time.",
      challenge: "Add a method page_density(self) that returns a short label (\"short\", \"medium\", or \"long\") based on self.pages, using if/elif/else, and print the label for each book.",
      expectedResult: "The program prints each book's description, shows one book's read status changing after mark_as_read() is called, while the other book's status stays unaffected.",
      tests: ["describe() returns a string built from the object's own attributes", "mark_as_read() changes read only on the object it was called on"],
      hint: "Calling book1.mark_as_read() never affects book2, because self inside that call is bound only to book1.",
      lessonAssessment: [
        {
          question: "When you call book1.describe(), what gets passed as the self parameter?",
          options: ["Nothing, self is left empty", "The Book class itself", "book1, the specific object the method was called on", "A brand new Book object"],
          correctAnswerIndex: 2,
          explanation: "Dot notation automatically supplies the object before the dot as self, so describe() operates on book1's own attributes.",
        },
        {
          question: "If book1.mark_as_read() sets self.read = True, what happens to book2.read?",
          options: ["It also becomes True", "It stays whatever it was before, since self only refers to book1 in that call", "It becomes False", "It raises an error"],
          correctAnswerIndex: 1,
          explanation: "Each method call is bound to one specific object through self, so changes to book1 never affect book2's separate instance attributes.",
        },
      ],
      commonMistakes: ["Forgetting self as the first parameter when defining a method, causing a TypeError on every call.", "Calling a method on the class itself instead of an instance, e.g. Book.describe() with no object supplied."],
      deliverables: ["A Book class with at least 2 working instance methods"],
      assessmentCriteria: ["Methods correctly use self to read or change instance attributes", "Method calls on one object do not affect other objects"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'class Book:\n    def __init__(self, title, author, pages):\n        self.title = title\n        self.author = author\n        self.pages = pages\n        self.read = False\n\n    def describe(self):\n        return f"{self.title} by {self.author} ({self.pages} pages)"\n\n    def mark_as_read(self):\n        self.read = True\n\nbook1 = Book("Dune", "Frank Herbert", 412)\nbook2 = Book("Foundation", "Isaac Asimov", 255)\nprint(book1.describe(), book1.read)\nbook1.mark_as_read()\nprint(book1.describe(), book1.read)\nprint(book2.describe(), book2.read)',
        explanation: "mark_as_read() only changes book1's read attribute; book2 keeps its original False value since methods act only on the object they are called on.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Object-Oriented Programming Basics Assessment",
    questions: [
      { question: "What is a class in Python?", options: ["A single value stored in memory", "A blueprint that defines the data and behavior of the objects created from it", "A built-in function", "A type of loop"], correctAnswerIndex: 1, explanation: "A class defines the structure (attributes) and behavior (methods) that every object created from it will share." },
      { question: "What does calling Dog() do?", options: ["Runs the class definition again", "Creates a new object (instance) of the Dog class", "Deletes the Dog class", "Prints the class name"], correctAnswerIndex: 1, explanation: "Calling a class like a function creates and returns a new instance of that class." },
      { question: "What does the is operator check between two objects?", options: ["Whether their attribute values look equal", "Whether they are literally the same object in memory", "Whether they belong to the same class", "Whether one was created before the other"], correctAnswerIndex: 1, explanation: "is checks object identity, not equal-looking contents, so two separately created objects are not is-equal even with identical data." },
      { question: "When does __init__ run?", options: ["Only when explicitly called by name", "Automatically each time a new object is created", "Once for the whole program", "Only if no other method is defined"], correctAnswerIndex: 1, explanation: "Python automatically invokes __init__ as part of object creation whenever the class is called." },
      { question: "What must be the first parameter of every instance method, including __init__?", options: ["cls", "self", "this", "obj"], correctAnswerIndex: 1, explanation: "By convention and requirement, the first parameter of an instance method is self, representing the calling object." },
      { question: "Given self.title = title inside __init__, what kind of attribute is title?", options: ["A class attribute shared by every object", "An instance attribute unique to that object", "A local variable that disappears immediately", "A global variable"], correctAnswerIndex: 1, explanation: "Assigning to self.attribute inside __init__ creates an instance attribute stored on that specific object." },
      { question: "What gets passed automatically as self when you call book1.describe()?", options: ["Nothing", "The Book class", "book1 itself", "A new empty object"], correctAnswerIndex: 2, explanation: "Dot notation (object.method()) automatically supplies the object before the dot as the self argument." },
      { question: "If book1.mark_as_read() sets self.read = True, what happens to a separate object book2?", options: ["book2.read also becomes True", "book2.read is unaffected", "book2 is deleted", "An error occurs"], correctAnswerIndex: 1, explanation: "Since self is bound only to book1 during that call, book2's own attributes remain untouched." },
      { question: "What happens if you define a method without self as its first parameter and then call it normally on an object?", options: ["It works exactly the same as with self", "It raises a TypeError about too many arguments", "Python automatically adds self for you silently", "It only affects class attributes"], correctAnswerIndex: 1, explanation: "Python automatically passes the calling object as the first argument, so a method missing that parameter raises a TypeError when called on an instance." },
      { question: "What is the main benefit of bundling data and behavior together in a class?", options: [
          "It makes the program run faster automatically",
          "Objects can manage and act on their own data through methods, rather than external code editing attributes directly",
          "It removes the need for variables",
          "It is required for every Python program to run",
        ], correctAnswerIndex: 1, explanation: "Object-oriented design groups related data and the operations on that data into one unit, making code easier to reason about and reuse." },
    ],
  },
  assignment:
    "Build a 'Student Record' system using a class: define a Student class with an __init__ that accepts a name and stores an empty list of grades as an instance attribute. Add a method add_grade(self, grade) that appends a grade to the list, and a method average_grade(self) that returns the average of the stored grades (or 0 if the list is empty). Create at least 3 Student objects, add at least 3 grades to each, and print each student's name alongside their average.",
  assignmentDeliverables: [
    "A script defining a Student class with __init__, add_grade, and average_grade",
    "At least 3 Student objects created with grades added and printed averages",
  ],
  assignmentAssessmentCriteria: [
    "Each Student object correctly stores its own independent list of grades",
    "average_grade() correctly calculates the mean and handles an empty list without crashing",
    "Output clearly labels each student's name and average",
  ],
  miniProject:
    "Build a 'Library Catalog' using two classes: a Book class (title, author, and an available instance attribute defaulting to True) and a Catalog class that stores a list of Book objects. Give Catalog methods add_book(self, book), list_available(self) that prints every book currently available, and borrow_book(self, title) that finds a book by title and sets its available attribute to False if found. Add at least 4 books, borrow at least 1, and print the available list before and after to show the change.",
  miniProjectDeliverables: [
    "A script defining Book and Catalog classes with the required methods",
    "Printed output showing the available list before and after borrowing a book",
  ],
  miniProjectAssessmentCriteria: [
    "Catalog correctly stores and manages a list of Book objects",
    "borrow_book() correctly updates only the matching book's availability",
    "Output clearly demonstrates the catalog changing state",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
