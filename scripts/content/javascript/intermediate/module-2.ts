import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module2: GeneratedModule = {
  title: "Inheritance & Polymorphism",
  description:
    "Build class hierarchies with extends and super, override inherited methods to customize behavior, and use instanceof and polymorphism to treat different but related objects the same way.",
  completionStatus: "locked",
  lessons: [
    {
      title: "extends and super: Building a Subclass",
      goal: "Create a subclass with extends and call the parent constructor with super() to reuse existing behavior.",
      videoTitle: "JavaScript Class Inheritance: extends and super Explained",
      videoSearchQuery: "javascript extends super class inheritance tutorial",
      videoLearningGoal: "See a subclass extend a parent class and call super() to reuse the parent constructor's setup.",
      recommendedChannels: ["Web Dev Simplified", "The Net Ninja"],
      keyTakeaways: [
        "class Child extends Parent makes Child inherit every property and method that Parent defines.",
        "super(...) calls the parent class's constructor, and must run before this can be used in a subclass constructor.",
        "A subclass automatically gains access to every parent method it does not redefine itself.",
      ],
      notes:
        "Inheritance lets one class build on another instead of repeating the same properties and methods. A subclass written with extends automatically gains everything the parent class defines, and can add its own properties and methods on top.",
      conceptExplanation:
        "class Animal { constructor(name) { this.name = name; } } class Dog extends Animal { constructor(name, breed) { super(name); this.breed = breed; } } means creating a Dog first runs super(name), which runs Animal's constructor and sets this.name, then continues to set this.breed. Skipping super() in a subclass constructor throws a ReferenceError, because this is not initialized until the parent constructor runs.",
      whyItMatters: "Inheritance avoids duplicating shared setup and behavior across related classes, so a change to the parent automatically benefits every subclass.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Define a class Animal with a constructor accepting name and a method speak() that returns `${this.name} makes a sound.`. Define a class Dog that extends Animal, with a constructor accepting name and breed, calling super(name) and storing breed. Create a Dog object and call both speak() (inherited) and print its breed.",
      challenge: "Define a second subclass, Cat, that also extends Animal, with its own constructor accepting name and indoor. Create one Dog and one Cat, and call speak() on both to show they both inherit the same method from Animal.",
      expectedResult: "The program prints the inherited speak() message for the Dog object, plus the Dog's own breed property.",
      tests: ["Dog is defined using class Dog extends Animal", "The Dog constructor calls super(name) before setting its own properties"],
      hint: "super(...) must be called before you use this anywhere in a subclass constructor, or JavaScript throws a ReferenceError.",
      lessonAssessment: [
        {
          question: "What does class Dog extends Animal mean?",
          options: [
            "Dog and Animal are unrelated classes",
            "Dog inherits every property and method that Animal defines",
            "Animal inherits from Dog",
            "Dog replaces Animal entirely",
          ],
          correctAnswerIndex: 1,
          explanation: "extends sets up inheritance so the subclass (Dog) automatically gains everything the parent class (Animal) defines.",
        },
        {
          question: "What happens if a subclass constructor uses this before calling super()?",
          options: [
            "Nothing, it works normally",
            "JavaScript throws a ReferenceError",
            "this becomes an empty object automatically",
            "The parent constructor is skipped silently",
          ],
          correctAnswerIndex: 1,
          explanation: "In a subclass constructor, this is not initialized until super() runs the parent constructor, so using this earlier throws a ReferenceError.",
        },
      ],
      commonMistakes: ["Forgetting to call super() in a subclass constructor, which throws a ReferenceError as soon as this is used.", "Calling super() with the wrong arguments, so the parent constructor does not receive the values it expects."],
      deliverables: ["script.js with an Animal class and a Dog subclass using extends and super"],
      assessmentCriteria: ["Dog correctly extends Animal and calls super() with the right arguments", "The Dog object correctly uses both inherited and its own properties or methods"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n\n  speak() {\n    return `${this.name} makes a sound.`;\n  }\n}\n\nclass Dog extends Animal {\n  constructor(name, breed) {\n    super(name);\n    this.breed = breed;\n  }\n}\n\nconst dog = new Dog("Rex", "Labrador");\nconsole.log(dog.speak());\nconsole.log(dog.breed);',
        explanation: "super(name) runs Animal's constructor first, setting this.name, before Dog's own constructor sets this.breed; speak() is inherited without being redefined.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Method Overriding: Customizing Inherited Behavior",
      goal: "Override an inherited method in a subclass, and use super.methodName() to still call the parent's version when needed.",
      videoTitle: "JavaScript Method Overriding Tutorial: super.method()",
      videoSearchQuery: "javascript method overriding super call parent method tutorial",
      videoLearningGoal: "See a subclass redefine a parent's method and optionally still call the parent's original version with super.",
      recommendedChannels: ["freeCodeCamp.org", "Fireship"],
      keyTakeaways: [
        "A subclass can override a parent method by defining a method with the exact same name.",
        "When a method is overridden, calling it on a subclass object runs the subclass version, not the parent's.",
        "super.methodName() inside an overriding method calls the parent class's original version of that method.",
      ],
      notes:
        "Inheriting a method does not mean a subclass is stuck with it exactly as written. Defining a method with the same name in the subclass overrides the parent's version, letting each subclass customize shared behavior while still reusing the parent's structure.",
      conceptExplanation:
        "If Animal defines speak() { return `${this.name} makes a sound.`; } and Dog defines speak() { return `${this.name} barks.`; }, calling dog.speak() runs Dog's version, completely replacing Animal's. If Dog instead writes speak() { return `${super.speak()} Specifically, it barks.`; }, it calls Animal's original speak() through super.speak() and builds on top of the result, rather than replacing it entirely.",
      whyItMatters: "Overriding lets each subclass specialize shared behavior for its own case, which is how a Dog and a Cat can both speak() differently while sharing the same Animal foundation.",
      practicalTask:
        "Using your Animal and Dog classes from the previous lesson, override speak() in Dog so it returns `${this.name} barks.` instead of the generic Animal message. Create both an Animal object and a Dog object, and call speak() on each to show the overridden behavior.",
      challenge: "Change Dog's speak() to call super.speak() first and append \" Specifically, it barks.\" to the result, showing that the parent's version still runs as part of the override.",
      expectedResult: "The program prints the generic Animal message for the plain Animal object, and the customized Dog message for the Dog object.",
      tests: ["Dog defines its own speak() method with the same name as Animal's", "Calling speak() on a Dog object runs Dog's overridden version"],
      hint: "super.methodName() only works inside a method of a subclass, and it calls the parent's version of that exact method name.",
      lessonAssessment: [
        {
          question: "What happens when a subclass defines a method with the same name as one in its parent class?",
          options: [
            "It causes a syntax error",
            "The subclass method overrides the parent's version for objects of that subclass",
            "Both methods run every time, one after the other, automatically",
            "The parent method always takes priority",
          ],
          correctAnswerIndex: 1,
          explanation: "Defining a method with the same name in a subclass overrides the inherited version, so calling it on a subclass object runs the new definition.",
        },
        {
          question: "What does super.speak() do inside an overriding method?",
          options: [
            "Calls the subclass's own speak() again, causing infinite recursion",
            "Calls the parent class's original speak() method",
            "Deletes the parent's speak() method",
            "Is invalid syntax outside a constructor",
          ],
          correctAnswerIndex: 1,
          explanation: "super.methodName() explicitly calls the parent class's version of that method, letting an override build on top of the original behavior.",
        },
      ],
      commonMistakes: ["Assuming both the parent's and subclass's methods run automatically, when only the subclass's overriding version runs unless super.methodName() is called explicitly.", "Using super.methodName() outside of a subclass method, where it is not valid."],
      deliverables: ["A Dog class that overrides Animal's speak() method"],
      assessmentCriteria: ["speak() is correctly overridden in Dog", "The overridden method produces output distinct from the parent's version"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n\n  speak() {\n    return `${this.name} makes a sound.`;\n  }\n}\n\nclass Dog extends Animal {\n  constructor(name, breed) {\n    super(name);\n    this.breed = breed;\n  }\n\n  speak() {\n    return `${super.speak()} Specifically, it barks.`;\n  }\n}\n\nconst animal = new Animal("Creature");\nconst dog = new Dog("Rex", "Labrador");\nconsole.log(animal.speak());\nconsole.log(dog.speak());',
        explanation: "Dog's speak() overrides Animal's version, and super.speak() calls the original Animal implementation before appending extra text.",
      },
      completionStatus: "not_started",
    },
    {
      title: "instanceof and Polymorphism: Treating Different Objects the Same Way",
      goal: "Use instanceof to check an object's class, and write code that treats different subclass objects the same way through polymorphism.",
      videoTitle: "JavaScript instanceof and Polymorphism Explained",
      videoSearchQuery: "javascript instanceof polymorphism tutorial classes",
      videoLearningGoal: "See instanceof check an object's class, and a single loop call an overridden method on different subclass objects.",
      recommendedChannels: ["Fireship", "Programming with Mosh"],
      keyTakeaways: [
        "object instanceof ClassName returns true if the object was created from that class or one of its subclasses.",
        "Polymorphism means calling the same method name on different objects and getting behavior specific to each object's own class.",
        "Code that loops over a mixed array of related objects and calls a shared method works without needing to check each object's exact type.",
      ],
      notes:
        "instanceof answers the question \"was this object built from this class (or a subclass of it)?\". Polymorphism is the payoff of inheritance and overriding: a single piece of code can call the same method on many different kinds of objects, and each object responds in its own way.",
      conceptExplanation:
        "dog instanceof Dog is true, and dog instanceof Animal is also true, because Dog extends Animal, so a Dog object is also considered an Animal. Given an array [dog, cat] of different Animal subclasses, a single loop like animals.forEach(a => console.log(a.speak())) calls speak() on every object without checking its exact class first; each object runs its own overridden version. This is polymorphism: one method call, many possible behaviors, chosen automatically based on the object's actual class.",
      whyItMatters: "Polymorphism lets you write one piece of code that works correctly for many related types, instead of writing separate branching logic for every possible subclass.",
      practicalTask:
        "Using your Animal, Dog, and a new Cat subclass (constructor accepting name and indoor, and an overridden speak() returning `${this.name} meows.`), create one array containing one Dog object and one Cat object. Loop through the array and call speak() on each object, printing the result, without checking each object's class individually. Also print the result of dog instanceof Animal and cat instanceof Dog to demonstrate instanceof.",
      challenge: "Add a method describeSpecies() to each subclass that returns a different label (\"Canine\" for Dog, \"Feline\" for Cat), and print each object's label inside the same loop that already calls speak(), showing each object independently choosing its own overridden behavior for two different methods.",
      expectedResult: "The loop prints each animal's own overridden speak() message correctly, and the instanceof checks correctly print true and false.",
      tests: ["A loop calls speak() on a mixed array of Dog and Cat objects without special-casing either type", "instanceof is used to correctly check at least one object's class relationship"],
      hint: "instanceof checks the whole inheritance chain, so a Dog object is instanceof both Dog and Animal, but never instanceof Cat.",
      lessonAssessment: [
        {
          question: "If class Dog extends Animal and dog is a Dog object, what does dog instanceof Animal return?",
          options: ["false, because Dog is a different class", "true, because Dog inherits from Animal", "undefined", "It throws an error"],
          correctAnswerIndex: 1,
          explanation: "instanceof checks the full inheritance chain, so an object of a subclass is also considered an instance of its parent class.",
        },
        {
          question: "What best describes polymorphism when looping over a mixed array of Dog and Cat objects and calling animal.speak() on each?",
          options: [
            "Every object must first be checked with an if statement to know which speak() to call",
            "The same method call automatically runs each object's own overridden version",
            "Only Dog objects can have a speak() method",
            "The loop only works if every object is the exact same class",
          ],
          correctAnswerIndex: 1,
          explanation: "Polymorphism means the same method call resolves to each object's own overridden implementation automatically, without manual type checks.",
        },
      ],
      commonMistakes: ["Writing unnecessary if/else checks for each object's type before calling a method that is already correctly overridden on every subclass.", "Confusing instanceof direction, expecting animal instanceof Dog to be true for a plain Animal object that is not a Dog."],
      deliverables: ["A script with Dog and Cat subclasses of Animal, looped over polymorphically, plus instanceof checks"],
      assessmentCriteria: ["A single loop correctly calls the overridden method on every object in a mixed array", "instanceof is used correctly to check class relationships"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    return `${this.name} makes a sound.`;\n  }\n}\n\nclass Dog extends Animal {\n  speak() {\n    return `${this.name} barks.`;\n  }\n}\n\nclass Cat extends Animal {\n  speak() {\n    return `${this.name} meows.`;\n  }\n}\n\nconst dog = new Dog("Rex");\nconst cat = new Cat("Whiskers");\nconst animals = [dog, cat];\nanimals.forEach((animal) => console.log(animal.speak()));\nconsole.log(dog instanceof Animal);\nconsole.log(cat instanceof Dog);',
        explanation: "forEach calls speak() on every object the same way, but each one runs its own overridden version; instanceof confirms Dog is an Animal but Cat is not a Dog.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Inheritance & Polymorphism Assessment",
    questions: [
      { question: "What does class Dog extends Animal mean?", options: ["Dog and Animal share no relationship", "Dog inherits every property and method Animal defines", "Animal inherits from Dog", "extends deletes the Animal class"], correctAnswerIndex: 1, explanation: "extends sets up an inheritance relationship, so the subclass automatically gains everything the parent class defines." },
      { question: "What must a subclass constructor call before using this?", options: ["this.init()", "super()", "Object.create()", "Nothing, this works immediately"], correctAnswerIndex: 1, explanation: "super() must run first in a subclass constructor to initialize this by running the parent class's constructor." },
      { question: "What happens if a subclass method has the same name as a parent method?", options: ["A syntax error occurs", "The subclass method overrides the parent's version for that subclass", "Both run automatically together every time", "The parent version always wins"], correctAnswerIndex: 1, explanation: "Defining a method with the same name in a subclass overrides the inherited version." },
      { question: "What does super.speak() do inside an overriding speak() method?", options: ["Calls the subclass's own version again, causing infinite recursion", "Calls the parent class's original speak() method", "Removes the parent's speak() method permanently", "Is only valid inside a constructor"], correctAnswerIndex: 1, explanation: "super.methodName() explicitly invokes the parent class's version of that method." },
      { question: "If class Dog extends Animal and dog is a Dog object, what does dog instanceof Animal return?", options: ["false", "true", "undefined", "It throws an error"], correctAnswerIndex: 1, explanation: "instanceof checks the full inheritance chain, so a subclass instance is also an instance of its parent class." },
      { question: "What does polymorphism allow when calling the same method on a mixed array of related subclass objects?", options: [
          "Each object must be manually checked with if statements first",
          "The same method call automatically runs each object's own overridden implementation",
          "Only the parent class's method can ever run",
          "The array must contain only one type of object",
        ], correctAnswerIndex: 1, explanation: "Polymorphism means the same method call resolves to whichever version the specific object's class defines, without manual type checks." },
      { question: "What happens if a subclass constructor uses this before calling super()?", options: ["Nothing unusual happens", "JavaScript throws a ReferenceError", "this becomes null silently", "The parent constructor runs automatically afterward"], correctAnswerIndex: 1, explanation: "this is not initialized in a subclass constructor until super() runs, so using it earlier throws a ReferenceError." },
      { question: "Given class Cat extends Animal and cat is a Cat object, what does cat instanceof Dog return?", options: ["true, since both extend Animal", "false, since Cat and Dog are unrelated classes despite a shared parent", "undefined", "It throws an error"], correctAnswerIndex: 1, explanation: "instanceof only returns true along the actual inheritance chain; sibling subclasses like Cat and Dog are not instances of each other." },
      { question: "Why might an overriding method call super.methodName() instead of fully replacing the parent's logic?", options: [
          "It is required syntax for every override",
          "To reuse and build on top of the parent's existing behavior instead of duplicating it",
          "It disables the override entirely",
          "It converts the method into a static method",
        ], correctAnswerIndex: 1, explanation: "Calling super.methodName() lets an override extend the parent's behavior rather than rewriting it from scratch." },
      { question: "What is the main advantage of inheritance between related classes like Animal, Dog, and Cat?", options: [
          "It makes the program run in a different order",
          "Shared properties and methods are defined once in the parent and reused by every subclass",
          "It removes the need for constructors",
          "It is required for JavaScript classes to work at all",
        ], correctAnswerIndex: 1, explanation: "Inheritance avoids duplicating shared setup and behavior across related classes, since subclasses automatically reuse what the parent defines." },
    ],
  },
  assignment:
    "Build a 'Shape Collection' using inheritance: define a Shape base class with a constructor accepting a name and a method area() that returns 0 by default. Create Circle and Rectangle subclasses that extend Shape, each with their own constructor and an overridden area() method that calculates the correct area from their own properties (radius for Circle, width and height for Rectangle). Create at least 2 Circle objects and 2 Rectangle objects, store them in one array, and loop through printing each shape's name and calculated area.",
  assignmentDeliverables: [
    "A script defining Shape, Circle, and Rectangle classes using extends and overridden area() methods",
    "Printed output looping through a mixed array of shapes and showing each one's correct calculated area",
  ],
  assignmentAssessmentCriteria: [
    "Circle and Rectangle correctly extend Shape and call super() with the right arguments",
    "Each subclass correctly overrides area() with the right calculation for its own shape",
    "A single loop correctly prints results for every shape without special-casing each type",
  ],
  miniProject:
    "Build an 'Employee Payroll' system using inheritance: define an Employee base class with a constructor accepting name and baseSalary, and a method calculatePay() returning baseSalary. Create Manager and Developer subclasses that extend Employee, each overriding calculatePay() to add their own bonus logic (for example, a fixed management bonus for Manager, and a per-project bonus for Developer based on a projectsCompleted property). Create at least 2 objects of each subclass, store them together in one array, and print every employee's name and calculated pay using a single loop.",
  miniProjectDeliverables: [
    "A script defining Employee, Manager, and Developer classes with overridden calculatePay() methods",
    "Printed output showing every employee's correctly calculated pay from a single polymorphic loop",
  ],
  miniProjectAssessmentCriteria: [
    "Manager and Developer correctly extend Employee and reuse its constructor with super()",
    "Each subclass's calculatePay() override produces a distinct, correct result",
    "The loop treats every employee object the same way regardless of its specific subclass",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
