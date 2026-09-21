import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module7: GeneratedModule = {
  title: "Classes with Types",
  description:
    "Add types to class properties and constructors, apply access modifiers, and write a class that implements an interface.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Typed Class Properties and Constructors",
      goal: "Declare a class with explicitly typed properties initialized through a constructor.",
      videoTitle: "TypeScript Classes: Typed Properties and Constructors",
      videoSearchQuery: "typescript classes typed properties constructor tutorial",
      videoLearningGoal: "See a class with explicitly typed properties, a constructor that assigns them from parameters, and a method that uses those properties.",
      recommendedChannels: ["Total TypeScript", "freeCodeCamp.org"],
      keyTakeaways: [
        "Class properties are declared with a name and type before they are ever assigned, like 'title: string;', directly inside the class body.",
        "The constructor is a special method that runs when a class is instantiated with new, typically used to assign initial values to the class's typed properties.",
        "A method inside a class can read this.propertyName to access the instance's own typed properties.",
      ],
      notes:
        "A class bundles typed data (properties) together with the functions that operate on that data (methods). Every instance created with new gets its own independent copy of the properties.",
      conceptExplanation:
        "Declaring title: string; and pages: number; inside a class body reserves those two typed slots on every instance. The constructor's job is usually to fill them in from parameters, using this.title = title; this.pages = pages;. Any method defined afterward, like describe(): string, can then read this.title and this.pages to build a result from that specific instance's own data.",
      whyItMatters: "Classes are how TypeScript models real-world entities, like a Book or a BankAccount, keeping their typed data and the logic that works with it in one clearly organized place.",
      practicalTask:
        "In main.ts, define a class named Book with typed properties title: string and pages: number, a constructor that accepts and assigns both, and a method describe(): string that returns a sentence combining them. Create two Book instances with new and log the result of calling describe() on each.",
      challenge: "Add a third typed property, isRead: boolean, assigned in the constructor, and include it in the describe() output.",
      expectedResult: "main.ts logs two different descriptions, one for each Book instance, built from their own typed properties.",
      tests: [
        "Book class declares typed properties and a constructor that assigns them",
        "describe() is called on at least two separate instances with different values",
      ],
      hint: "Inside describe(), use this.title and this.pages to access the instance's own properties.",
      lessonAssessment: [
        {
          question: "When does a class's constructor run?",
          options: [
            "Every time a method on the class is called",
            "Once, when a new instance is created with new",
            "Only when the file is imported",
            "Never, unless explicitly called by name",
          ],
          correctAnswerIndex: 1,
          explanation: "The constructor runs a single time, at the moment a new instance is created with the new keyword.",
        },
        {
          question: "Inside a class method, how do you access the current instance's own typed property named title?",
          options: ["title", "self.title", "this.title", "Book.title"],
          correctAnswerIndex: 2,
          explanation: "this refers to the current instance, so this.title accesses that instance's own title property.",
        },
      ],
      commonMistakes: [
        "Forgetting to assign a declared typed property inside the constructor, leaving it unset.",
        "Trying to access a property without this., which refers to something else entirely inside a method.",
      ],
      deliverables: ["main.ts with a Book class, its constructor, a describe() method, and two logged instances"],
      assessmentCriteria: ["Properties and constructor parameters are correctly typed", "describe() correctly reads instance properties with this."],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 minutes",
      codeExample: {
        language: "typescript",
        code: 'class Book {\n  title: string;\n  pages: number;\n\n  constructor(title: string, pages: number) {\n    this.title = title;\n    this.pages = pages;\n  }\n\n  describe(): string {\n    return `${this.title} has ${this.pages} pages.`;\n  }\n}\n\nconst book1 = new Book("TypeScript Basics", 220);\nconst book2 = new Book("Advanced Types", 340);\nconsole.log(book1.describe());\nconsole.log(book2.describe());',
        explanation: "title and pages are declared as typed properties, assigned inside the constructor, and read back with this. inside describe().",
      },
      completionStatus: "not_started",
    },
    {
      title: "Constructor Parameter Properties and Access Modifiers",
      goal: "Use the constructor parameter properties shorthand and apply public, private, and protected access modifiers.",
      videoTitle: "TypeScript Parameter Properties and Access Modifiers",
      videoSearchQuery: "typescript constructor parameter properties public private protected",
      videoLearningGoal: "See the constructor shorthand that declares and assigns a property in one step, plus public, private, and protected used on class properties.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "Adding an access modifier directly to a constructor parameter, like constructor(public title: string), both declares the property and assigns it in one step, skipping the separate declaration and this.title = title lines.",
        "public, the default, means a property can be accessed from anywhere; private means it can only be accessed from inside the class itself.",
        "protected is like private but also allows access from subclasses that extend the class, unlike private which blocks even those.",
      ],
      notes:
        "This shorthand removes repetitive boilerplate: instead of declaring a property, then assigning it in the constructor body, you do both in the constructor's parameter list itself.",
      conceptExplanation:
        "constructor(public owner: string, private balance: number) {} declares owner as a public property and balance as a private property, and assigns both from the constructor's arguments automatically, with no extra lines needed. Because balance is private, any code outside the class, like account.balance, is a compile-time error; it can only be read or changed through the class's own methods.",
      whyItMatters: "Access modifiers let a class control its own data: exposing what callers need (like a public method to read a balance) while protecting internal details (like the raw balance number) from being changed directly from outside.",
      practicalTask:
        "In main.ts, write a class named BankAccount using the constructor parameter properties shorthand: constructor(public owner: string, private balance: number). Add a method deposit(amount: number): void that increases balance and a method getBalance(): number that returns it. Create one instance, deposit into it twice, and log the final balance using getBalance().",
      challenge: "Try accessing account.balance directly from outside the class, instead of through getBalance(), and read the error the workspace reports about it being private, then remove that line.",
      expectedResult: "main.ts logs the final balance after two deposits, accessed only through getBalance(), with the direct private access attempt removed.",
      tests: [
        "BankAccount uses constructor parameter properties with at least one private property",
        "balance is only accessed from outside the class through getBalance(), not directly",
      ],
      hint: "The shorthand goes right in the constructor's parameter list: constructor(public owner: string, private balance: number) { }",
      lessonAssessment: [
        {
          question: "What does constructor(public title: string) do compared to writing a separate property declaration and assignment?",
          options: [
            "Nothing, it is purely a style choice with no functional effect",
            "It declares the property and assigns it from the parameter in one step",
            "It makes the property private instead of public",
            "It prevents the property from ever being read",
          ],
          correctAnswerIndex: 1,
          explanation: "The parameter property shorthand combines declaring and assigning a class property into the constructor's parameter list.",
        },
        {
          question: "What is the difference between private and protected access modifiers?",
          options: [
            "They are exactly the same",
            "private allows access only inside the class; protected also allows access from subclasses",
            "protected is more restrictive than private",
            "private only applies to methods, never properties",
          ],
          correctAnswerIndex: 1,
          explanation: "protected extends private's restriction to also allow access from classes that extend the original class.",
        },
      ],
      commonMistakes: [
        "Trying to access a private property directly from outside the class instead of through a public method.",
        "Forgetting that public is the default, so leaving off a modifier does not make a property private.",
      ],
      deliverables: ["main.ts with a BankAccount class using parameter properties and a private balance"],
      assessmentCriteria: ["Access modifiers are used correctly", "balance is never accessed directly from outside the class"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25-30 minutes",
      codeExample: {
        language: "typescript",
        code: 'class BankAccount {\n  constructor(public owner: string, private balance: number) {}\n\n  deposit(amount: number): void {\n    this.balance += amount;\n  }\n\n  getBalance(): number {\n    return this.balance;\n  }\n}\n\nconst account = new BankAccount("Ada", 100);\naccount.deposit(50);\naccount.deposit(25);\nconsole.log(account.getBalance());\n// console.log(account.balance); // Error: Property \'balance\' is private and only accessible within class \'BankAccount\'.',
        explanation: "owner and balance are declared and assigned directly in the constructor parameter list; balance is private, so it can only be read through the public getBalance() method.",
      },
      completionStatus: "not_started",
    },
    {
      title: "A Class Implementing an Interface",
      goal: "Define an interface describing required behavior and write a class that implements it.",
      videoTitle: "TypeScript Classes Implementing Interfaces",
      videoSearchQuery: "typescript class implements interface tutorial for beginners",
      videoLearningGoal: "See an interface describing method signatures, and a class using the implements keyword to guarantee it provides matching methods.",
      recommendedChannels: ["Total TypeScript", "Ben Awad"],
      keyTakeaways: [
        "The implements keyword, used like class Circle implements Shape, makes TypeScript check that the class provides every property and method the interface requires, with matching types.",
        "An interface used with implements can describe method signatures (name, parameters, return type) as well as properties, without providing any implementation itself.",
        "If a class using implements is missing a required method or property from the interface, TypeScript reports a compile-time error naming exactly what is missing.",
      ],
      notes:
        "implements is a promise a class makes to the type checker: 'I guarantee I provide everything this interface requires.' TypeScript then verifies that promise for you automatically.",
      conceptExplanation:
        "interface Shape { area(): number; } describes any shape as something with an area() method returning a number, with no implementation. class Rectangle implements Shape { ... } must then actually define a matching area(): number method, or TypeScript reports an error naming the missing or mismatched member.",
      whyItMatters: "Classes implementing a shared interface can be used interchangeably anywhere that interface is expected, which is the foundation for writing flexible, reusable code that works with many related types.",
      practicalTask:
        "In main.ts, define an interface named Shape with a method area(): number. Write a class named Rectangle that implements Shape, using constructor parameter properties for width: number and height: number, and an area() method that returns their product. Create an instance and log the result of calling area() on it.",
      challenge: "Write a second class, Circle, that also implements Shape with its own radius: number property and a correctly calculated area() method, and log its area too.",
      expectedResult: "main.ts logs the area of at least one class, Rectangle or both Rectangle and Circle, that implements the Shape interface.",
      tests: [
        "Rectangle uses implements Shape and provides a matching area(): number method",
        "An instance of Rectangle is created and area() is called and logged",
      ],
      hint: "The implements keyword goes right after the class name: class Rectangle implements Shape { ... }",
      lessonAssessment: [
        {
          question: "What does class Rectangle implements Shape guarantee, if Shape declares area(): number?",
          options: [
            "Nothing is checked; implements is purely decorative",
            "TypeScript checks that Rectangle provides an area() method matching that signature",
            "Rectangle automatically gets an area() method for free",
            "Shape's properties become optional for Rectangle",
          ],
          correctAnswerIndex: 1,
          explanation: "implements causes TypeScript to verify the class actually fulfills every member the interface requires.",
        },
        {
          question: "What happens if a class using implements is missing a method required by the interface?",
          options: [
            "TypeScript silently adds a default implementation",
            "TypeScript reports a compile-time error naming the missing member",
            "The class simply skips that method at runtime with no error",
            "implements is ignored unless the class also extends something",
          ],
          correctAnswerIndex: 1,
          explanation: "A class that fails to satisfy its declared interface is reported as a compile-time error naming exactly what is missing.",
        },
      ],
      commonMistakes: [
        "Forgetting to implement one of the interface's required methods and expecting the class to still compile.",
        "Giving a method a different return type than the interface requires, such as returning a string where number is expected.",
      ],
      deliverables: ["main.ts with a Shape interface and a Rectangle class implementing it, instance created and logged"],
      assessmentCriteria: ["implements is used correctly", "area() method correctly matches the interface's required signature and returns the right value"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25-30 minutes",
      codeExample: {
        language: "typescript",
        code: 'interface Shape {\n  area(): number;\n}\n\nclass Rectangle implements Shape {\n  constructor(public width: number, public height: number) {}\n\n  area(): number {\n    return this.width * this.height;\n  }\n}\n\nconst rect = new Rectangle(5, 3);\nconsole.log(rect.area());',
        explanation: "Rectangle implements Shape, so TypeScript enforces that it provides an area(): number method; leaving it out or mistyping it would be a compile-time error.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Classes with Types Assessment",
    questions: [
      {
        question: "Where are a class's typed properties declared?",
        options: ["Only inside the constructor body", "Directly inside the class body, with a name and type", "Only inside methods", "In a separate interface file"],
        correctAnswerIndex: 1,
        explanation: "Typed properties are declared directly in the class body, like title: string;",
      },
      {
        question: "When does a class's constructor run?",
        options: ["Every time a method is called", "Once, when a new instance is created", "Only when the class is declared", "Never automatically"],
        correctAnswerIndex: 1,
        explanation: "The constructor runs once, at instantiation time, when new is used.",
      },
      {
        question: "Inside a method, how do you refer to the current instance's own property named pages?",
        options: ["pages", "this.pages", "self.pages", "Book.pages"],
        correctAnswerIndex: 1,
        explanation: "this refers to the current instance, so this.pages accesses its own pages property.",
      },
      {
        question: "What does constructor(public owner: string) do?",
        options: [
          "Declares and assigns owner as a public property in one step",
          "Makes owner private",
          "Declares owner without assigning it",
          "Has no special effect",
        ],
        correctAnswerIndex: 0,
        explanation: "The parameter property shorthand both declares and assigns the property from the constructor argument.",
      },
      {
        question: "What does the private access modifier restrict?",
        options: [
          "Nothing; it is identical to public",
          "Access to only inside the class itself",
          "Access to only inside functions",
          "Access to only readonly properties",
        ],
        correctAnswerIndex: 1,
        explanation: "A private property can only be accessed from code inside its own class.",
      },
      {
        question: "What additional access does protected allow compared to private?",
        options: [
          "None, they are identical",
          "Access from subclasses that extend the class",
          "Access from any file in the project",
          "Access only from outside the class",
        ],
        correctAnswerIndex: 1,
        explanation: "protected permits subclasses to access the member, unlike private which restricts it to the declaring class only.",
      },
      {
        question: "What does the implements keyword do when used on a class?",
        options: [
          "Nothing, it is purely decorative",
          "TypeScript checks the class provides every property and method the named interface requires",
          "It copies all code from the interface automatically",
          "It makes every property optional",
        ],
        correctAnswerIndex: 1,
        explanation: "implements causes TypeScript to enforce that the class satisfies the interface's required members.",
      },
      {
        question: "If interface Shape requires area(): number, what happens if a class implementing Shape omits area()?",
        options: [
          "It compiles fine with no error",
          "TypeScript reports a compile-time error about the missing member",
          "area() is automatically generated",
          "The interface is ignored",
        ],
        correctAnswerIndex: 1,
        explanation: "Failing to satisfy a required interface member is a compile-time error when using implements.",
      },
      {
        question: "What access level does a class property have by default, if no modifier is written?",
        options: ["private", "protected", "public", "readonly"],
        correctAnswerIndex: 2,
        explanation: "public is the default access level in TypeScript classes when no modifier is specified.",
      },
      {
        question: "Why is it useful for multiple classes, like Rectangle and Circle, to implement the same Shape interface?",
        options: [
          "It prevents them from being instantiated",
          "It lets them be used interchangeably anywhere a Shape is expected, since both guarantee the same required members",
          "It merges the two classes into one",
          "It removes the need for a constructor",
        ],
        correctAnswerIndex: 1,
        explanation: "Classes sharing an implemented interface can be treated interchangeably wherever that interface's shape is expected.",
      },
    ],
  },
  assignment:
    "Build a 'Vehicle' class in the Academy workspace using constructor parameter properties for public make: string, public model: string, and private mileage: number. Add a method drive(miles: number): void that increases mileage, and a method getMileage(): number that returns it. Create one instance, call drive() twice, and log the final mileage through getMileage().",
  assignmentDeliverables: [
    "main.ts with a Vehicle class using parameter properties and a private mileage field",
    "Output showing the correct final mileage after two drive() calls",
  ],
  assignmentAssessmentCriteria: [
    "Access modifiers are used correctly on all constructor parameters",
    "mileage is only ever read through getMileage(), never accessed directly",
  ],
  miniProject:
    "Extend the project into a 'Fleet Manager' mini project: define an interface named Trackable with a method getMileage(): number. Update Vehicle to implement Trackable, then create a typed array of at least three Vehicle instances, typed as Trackable[], and use a loop to log every vehicle's mileage through the interface's method.",
  miniProjectDeliverables: ["fleet_manager.ts in the Academy workspace", "Output showing each vehicle's mileage, read only through the Trackable interface's method"],
  miniProjectAssessmentCriteria: [
    "Vehicle correctly implements the Trackable interface",
    "The Trackable[] array correctly logs every vehicle's mileage through the loop",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
