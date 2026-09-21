import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module1: GeneratedModule = {
  title: "Objects & Classes: OOP Basics in JavaScript",
  description:
    "Learn to model real things as JavaScript classes and objects: define a class, give every object its own data with a constructor, and write instance methods that use this to act on that data.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Classes and Objects: Defining Your First Blueprint",
      goal: "Understand what a class and an object are in JavaScript, and define and instantiate a simple class with the class keyword.",
      videoTitle: "JavaScript Classes Explained: Objects and the class Keyword",
      videoSearchQuery: "javascript classes and objects tutorial for beginners es6",
      videoLearningGoal: "See how a class acts as a blueprint and how creating an object with new works.",
      recommendedChannels: ["freeCodeCamp.org", "Web Dev Simplified"],
      keyTakeaways: [
        "A class is a blueprint that defines what properties and behavior every object built from it will share.",
        "An object (also called an instance) is one specific thing created from a class, with its own copy of that data.",
        "You define a class with the class keyword and create an object by calling the class name with new ClassName().",
      ],
      notes:
        "Every array, string, and object you have used so far is actually built from a class that JavaScript defines internally. In this module you start writing your own classes. A class describes a category of thing (Dog, Book, BankAccount); an object is one real example of that category, created with the new keyword.",
      conceptExplanation:
        "class Dog {} defines the simplest possible class: a blueprint with no properties or behavior yet. Writing new Dog() creates a new object, an instance of Dog, and each call produces a separate object in memory. Two objects created from the same class are still different objects: comparing them with === (which checks whether two variables point to the exact same object) returns false unless you assigned one to the other directly.",
      whyItMatters: "Classes let you group related data and behavior into one reusable unit instead of tracking many separate variables that all describe the same thing.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Define a class called Dog with an empty body. Create two separate Dog objects using new, and print each one with console.log, then print the result of comparing them with the === operator to show they are different objects.",
      challenge: "Add a static property to the Dog class called species, set to \"Canine\", using the static keyword inside the class body, and print it with Dog.species to show it belongs to the class itself, not to any one object.",
      expectedResult: "The program prints two Dog object representations, prints false for the === comparison between the two different objects, and prints \"Canine\" for the static property.",
      tests: ["A class named Dog is defined using the class keyword", "Two separate Dog objects are created with new and compared with ==="],
      hint: "Writing new ClassName() creates a brand new object every time, even if the class body is empty and no arguments are passed.",
      lessonAssessment: [
        {
          question: "What is the relationship between a class and an object in JavaScript?",
          options: [
            "They are the same thing with different names",
            "A class is a blueprint; an object is a specific instance created from that blueprint",
            "An object defines the class",
            "A class can only ever create one object",
          ],
          correctAnswerIndex: 1,
          explanation: "A class defines the structure and behavior shared by its instances, while an object is one concrete instance built from that class with new.",
        },
        {
          question: "What does dog1 === dog2 check when dog1 and dog2 are both objects?",
          options: [
            "Whether dog1 and dog2 have equal property values",
            "Whether dog1 and dog2 are literally the same object in memory",
            "Whether dog1 was created before dog2",
            "Whether dog1 and dog2 belong to the same class",
          ],
          correctAnswerIndex: 1,
          explanation: "For objects, === checks reference identity, whether two variables refer to the exact same object, not whether their contents look alike.",
        },
      ],
      commonMistakes: ["Forgetting the new keyword when creating an object, which throws a TypeError because a class constructor cannot be invoked without new.", "Assuming two separately created objects are automatically equal just because they came from the same class."],
      deliverables: ["script.js with a Dog class and two created objects"],
      assessmentCriteria: ["Class is defined correctly with the class keyword", "Two distinct objects are created with new and compared"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'class Dog {\n  static species = "Canine";\n}\n\nconst dog1 = new Dog();\nconst dog2 = new Dog();\nconsole.log(dog1);\nconsole.log(dog2);\nconsole.log(dog1 === dog2);\nconsole.log(Dog.species);',
        explanation: "new Dog() is called twice to create two separate objects; dog1 === dog2 is false because they are different objects, even though both share the static property species.",
      },
      completionStatus: "not_started",
    },
    {
      title: "The Constructor and this: Giving Every Object Its Own Data",
      goal: "Use a constructor method and this to give every new object its own starting data through instance properties.",
      videoTitle: "JavaScript Constructor and this Keyword Explained",
      videoSearchQuery: "javascript class constructor this keyword tutorial",
      videoLearningGoal: "See the constructor method run automatically when an object is created, storing values on this.",
      recommendedChannels: ["The Net Ninja", "Programming with Mosh"],
      keyTakeaways: [
        "constructor(...) is a special method that runs automatically every time new creates an object from the class.",
        "this refers to the specific object being created or used, and is available inside every instance method.",
        "Properties assigned with this.name = value become instance properties: each object gets its own separate copy.",
      ],
      notes:
        "Instead of manually attaching properties to an object after creating it, you define a constructor to set them up automatically. Every parameter you list on the constructor becomes a value you can supply when creating an object, and this.propertyName = value stores that value on the specific object being built.",
      conceptExplanation:
        "constructor(title, author) { this.title = title; this.author = author; } means new Book(\"Dune\", \"Frank Herbert\") automatically runs the constructor with this bound to the new object, title set to \"Dune\", and author set to \"Frank Herbert\". Because this.title stores the value on that particular object, two different Book objects can hold two completely different titles without interfering with each other. You never call the constructor directly; JavaScript calls it for you the moment new runs.",
      whyItMatters: "Instance properties are what let every object built from the same class carry its own unique data, which is the entire point of modeling real things as objects.",
      practicalTask:
        "Define a class called Book with a constructor that accepts title, author, and pages, and stores each as an instance property using this. Create two Book objects with different values and print each one's title and author using a template literal.",
      challenge: "Add a fourth constructor parameter, read, with a default value of false using JavaScript's default parameter syntax, and print whether each book has been read using its .read property.",
      expectedResult: "The program prints two different, correctly labeled book descriptions built entirely from each object's own instance properties.",
      tests: ["constructor accepts at least 3 parameters and stores them with this.", "Two Book objects hold different property values"],
      hint: "Every constructor parameter needs a matching this.propertyName = propertyName line to actually be stored on the object.",
      lessonAssessment: [
        {
          question: "When does a class's constructor method run?",
          options: [
            "Only when you call it directly by name",
            "Automatically, every time a new object is created from the class with new",
            "Only once per program, no matter how many objects are made",
            "Never, unless the object calls it explicitly",
          ],
          correctAnswerIndex: 1,
          explanation: "JavaScript automatically calls the constructor as part of creating a new object, so it always runs when new is used on the class.",
        },
        {
          question: "What does this represent inside an instance method?",
          options: [
            "The class itself",
            "The specific object the method is being called on",
            "A required argument the caller must always pass explicitly",
            "A global variable shared across all objects",
          ],
          correctAnswerIndex: 1,
          explanation: "this is automatically bound to the particular object the method was called on, which is how each object keeps its own separate data.",
        },
      ],
      commonMistakes: ["Forgetting the new keyword when creating an object, which throws a TypeError instead of running the constructor.", "Writing a constructor parameter but forgetting the matching this.name = name line, so the value never gets stored on the object."],
      deliverables: ["A script with a Book class using a constructor to set at least 3 instance properties"],
      assessmentCriteria: ["Constructor correctly stores every parameter as an instance property", "Two objects hold distinct, correctly printed values"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'class Book {\n  constructor(title, author, pages) {\n    this.title = title;\n    this.author = author;\n    this.pages = pages;\n  }\n}\n\nconst book1 = new Book("Dune", "Frank Herbert", 412);\nconst book2 = new Book("Project Hail Mary", "Andy Weir", 496);\nconsole.log(`${book1.title} by ${book1.author}`);\nconsole.log(`${book2.title} by ${book2.author}`);',
        explanation: "The constructor runs automatically for each new Book() call, storing separate title, author, and pages values on book1 and book2.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Instance Methods: Giving Objects Behavior",
      goal: "Write instance methods that use this to read and act on an object's own properties.",
      videoTitle: "JavaScript Class Methods Tutorial: Defining Behavior with this",
      videoSearchQuery: "javascript class instance methods this tutorial",
      videoLearningGoal: "See instance methods defined inside a class and called on specific objects using dot notation.",
      recommendedChannels: ["Traversy Media", "freeCodeCamp.org"],
      keyTakeaways: [
        "A method is a function defined inside a class body, written without the function keyword.",
        "Calling object.method() automatically binds that object as this inside the method.",
        "Methods can read and change an object's own instance properties using this.propertyName.",
      ],
      notes:
        "A class becomes genuinely useful once it can do things, not just hold data. Methods are functions defined inside the class body that operate on a specific object's properties. You call them with dot notation, book1.describe(), and JavaScript automatically binds book1 as this behind the scenes.",
      conceptExplanation:
        "describe() { return `${this.title} by ${this.author}`; } reads the calling object's own title and author. Methods can also change an object's state: markAsRead() { this.read = true; } updates only the object the method was called on, leaving every other object untouched. This is the core pattern of OOP: bundling data and the operations on that data into one unit.",
      whyItMatters: "Methods are what let objects behave like real things: a Book can describe itself, a BankAccount can deposit money, a Car can accelerate, all without external code reaching in and manually editing properties.",
      practicalTask:
        "Add two methods to your Book class from the previous lesson: describe(), which returns a formatted string with the title, author, and page count, and markAsRead(), which sets this.read to true. Call describe() on two different books before and after calling markAsRead() on one of them, printing the results each time.",
      challenge: "Add a method pageDensity() that returns a short label (\"short\", \"medium\", or \"long\") based on this.pages, using if/else if/else, and print the label for each book.",
      expectedResult: "The program prints each book's description, shows one book's read status changing after markAsRead() is called, while the other book's status stays unaffected.",
      tests: ["describe() returns a string built from the object's own properties", "markAsRead() changes read only on the object it was called on"],
      hint: "Calling book1.markAsRead() never affects book2, because this inside that call is bound only to book1.",
      lessonAssessment: [
        {
          question: "When you call book1.describe(), what gets bound as this inside describe()?",
          options: ["Nothing, this is left undefined", "The Book class itself", "book1, the specific object the method was called on", "A brand new Book object"],
          correctAnswerIndex: 2,
          explanation: "Dot notation automatically binds the object before the dot as this, so describe() operates on book1's own properties.",
        },
        {
          question: "If book1.markAsRead() sets this.read = true, what happens to book2.read?",
          options: ["It also becomes true", "It stays whatever it was before, since this only refers to book1 in that call", "It becomes false", "It throws an error"],
          correctAnswerIndex: 1,
          explanation: "Each method call is bound to one specific object through this, so changes to book1 never affect book2's separate instance properties.",
        },
      ],
      commonMistakes: ["Calling a method without parentheses, like book1.describe, which returns the function itself instead of running it.", "Referencing a property inside a method without this, like writing title instead of this.title, which throws a ReferenceError."],
      deliverables: ["A Book class with at least 2 working instance methods"],
      assessmentCriteria: ["Methods correctly use this to read or change instance properties", "Method calls on one object do not affect other objects"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'class Book {\n  constructor(title, author, pages) {\n    this.title = title;\n    this.author = author;\n    this.pages = pages;\n    this.read = false;\n  }\n\n  describe() {\n    return `${this.title} by ${this.author} (${this.pages} pages)`;\n  }\n\n  markAsRead() {\n    this.read = true;\n  }\n}\n\nconst book1 = new Book("Dune", "Frank Herbert", 412);\nconst book2 = new Book("Project Hail Mary", "Andy Weir", 496);\nconsole.log(book1.describe(), book1.read);\nbook1.markAsRead();\nconsole.log(book1.describe(), book1.read);\nconsole.log(book2.describe(), book2.read);',
        explanation: "markAsRead() only changes book1's read property; book2 keeps its original false value since methods act only on the object they are called on.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Objects & Classes: OOP Basics in JavaScript Assessment",
    questions: [
      { question: "What is a class in JavaScript?", options: ["A single value stored in memory", "A blueprint that defines the properties and methods of the objects created from it", "A built-in array method", "A type of loop"], correctAnswerIndex: 1, explanation: "A class defines the structure (properties) and behavior (methods) that every object created from it will share." },
      { question: "What does writing new Dog() do?", options: ["Runs the class definition again", "Creates a new object (instance) of the Dog class", "Deletes the Dog class", "Prints the class name"], correctAnswerIndex: 1, explanation: "The new keyword creates and returns a new instance of the class it is used with." },
      { question: "What does the === operator check between two objects?", options: ["Whether their property values look equal", "Whether they are literally the same object in memory", "Whether they belong to the same class", "Whether one was created before the other"], correctAnswerIndex: 1, explanation: "For objects, === checks reference identity, not equal-looking contents, so two separately created objects are not === even with identical data." },
      { question: "When does a class's constructor method run?", options: ["Only when explicitly called by name", "Automatically each time new creates an object from the class", "Once for the whole program", "Only if no other method is defined"], correctAnswerIndex: 1, explanation: "JavaScript automatically invokes the constructor as part of object creation whenever new is used on the class." },
      { question: "What happens if you call a class like Book(\"Dune\") without the new keyword?", options: ["It works exactly the same as with new", "It throws a TypeError because a class constructor cannot be invoked without new", "It silently returns undefined", "It creates a static object"], correctAnswerIndex: 1, explanation: "JavaScript class constructors must be called with new; calling them as plain functions throws a TypeError." },
      { question: "Given this.title = title inside a constructor, what kind of property is title?", options: ["A static property shared by every object", "An instance property unique to that object", "A local variable that disappears immediately", "A global variable"], correctAnswerIndex: 1, explanation: "Assigning to this.property inside the constructor creates an instance property stored on that specific object." },
      { question: "What gets bound automatically as this when you call book1.describe()?", options: ["Nothing", "The Book class", "book1 itself", "A new empty object"], correctAnswerIndex: 2, explanation: "Dot notation (object.method()) automatically binds the object before the dot as this inside the method." },
      { question: "If book1.markAsRead() sets this.read = true, what happens to a separate object book2?", options: ["book2.read also becomes true", "book2.read is unaffected", "book2 is deleted", "An error occurs"], correctAnswerIndex: 1, explanation: "Since this is bound only to book1 during that call, book2's own properties remain untouched." },
      { question: "What does a static property, declared with the static keyword, belong to?", options: ["Every individual instance separately", "The class itself, shared across all instances", "Nothing, static properties are invalid in classes", "Only the first instance created"], correctAnswerIndex: 1, explanation: "A static property or method belongs to the class itself and is accessed as ClassName.property, not through an individual instance." },
      { question: "What is the main benefit of bundling data and behavior together in a class?", options: [
          "It makes the program run faster automatically",
          "Objects can manage and act on their own data through methods, rather than external code editing properties directly",
          "It removes the need for variables",
          "It is required for every JavaScript program to run",
        ], correctAnswerIndex: 1, explanation: "Object-oriented design groups related data and the operations on that data into one unit, making code easier to reason about and reuse." },
    ],
  },
  assignment:
    "Build a 'Student Record' system using a class: define a Student class with a constructor that accepts a name and stores an empty array of grades as an instance property. Add a method addGrade(grade) that pushes a grade into the array, and a method averageGrade() that returns the average of the stored grades (or 0 if the array is empty). Create at least 3 Student objects, add at least 3 grades to each, and print each student's name alongside their average.",
  assignmentDeliverables: [
    "A script defining a Student class with a constructor, addGrade, and averageGrade",
    "At least 3 Student objects created with grades added and printed averages",
  ],
  assignmentAssessmentCriteria: [
    "Each Student object correctly stores its own independent array of grades",
    "averageGrade() correctly calculates the mean and handles an empty array without crashing",
    "Output clearly labels each student's name and average",
  ],
  miniProject:
    "Build a 'Library Catalog' using two classes: a Book class (title, author, and an available instance property defaulting to true) and a Catalog class that stores an array of Book objects. Give Catalog methods addBook(book), listAvailable() that prints every book currently available, and borrowBook(title) that finds a book by title and sets its available property to false if found. Add at least 4 books, borrow at least 1, and print the available list before and after to show the change.",
  miniProjectDeliverables: [
    "A script defining Book and Catalog classes with the required methods",
    "Printed output showing the available list before and after borrowing a book",
  ],
  miniProjectAssessmentCriteria: [
    "Catalog correctly stores and manages an array of Book objects",
    "borrowBook() correctly updates only the matching book's availability",
    "Output clearly demonstrates the catalog changing state",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
