import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module2: GeneratedModule = {
  title: "Inheritance & Polymorphism",
  description:
    "Share and specialize behavior between classes using inheritance, override methods safely with super(), and learn when inheritance is the right tool compared to composition.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Subclassing: Extending a Class with Inheritance",
      goal: "Create a subclass that inherits attributes and methods from a parent class.",
      videoTitle: "Python Inheritance Tutorial: Parent and Child Classes",
      videoSearchQuery: "python inheritance tutorial parent child class subclass",
      videoLearningGoal: "See a child class automatically gain the attributes and methods of a parent class.",
      recommendedChannels: ["Corey Schafer", "Programming with Mosh"],
      keyTakeaways: [
        "Inheritance lets a class (the subclass or child) reuse the attributes and methods of another class (the parent or base class).",
        "You write a subclass with class Child(Parent): and it automatically gains everything the parent defines.",
        "A subclass can add its own new attributes and methods on top of what it inherits.",
      ],
      notes:
        "Inheritance models an 'is a' relationship: a Dog is an Animal, a Car is a Vehicle. Instead of rewriting shared attributes and methods on every related class, you define them once on a parent class, then create subclasses that automatically inherit them and add only what makes that subclass different.",
      conceptExplanation:
        "class Animal: def __init__(self, name): self.name = name, followed by class Dog(Animal): pass, means every Dog object automatically has a name attribute and behaves like an Animal, without repeating any code. Writing class Dog(Animal): with the parent's name inside parentheses is what establishes the inheritance link. A subclass can also introduce brand new attributes or methods that the parent never had, specializing the general behavior.",
      whyItMatters: "Inheritance avoids duplicating shared logic across related classes, which keeps a codebase consistent and easier to update in one place.",
      practicalTask:
        "In the Academy workspace, main.py is already open for you. Define an Animal class with an __init__ that stores a name, and a method make_sound(self) that returns \"...\". Define a Dog subclass that inherits from Animal with no new code yet (just pass). Create a Dog object, print its name, and call make_sound() on it to show the inherited method works.",
      challenge: "Add a second subclass, Cat(Animal), and create a Cat object alongside your Dog object, showing both inherit name and make_sound() from the same parent.",
      expectedResult: "The Dog object correctly has a name attribute and a working make_sound() method, even though neither was defined directly on the Dog class.",
      tests: ["Dog is defined as a subclass of Animal using class Dog(Animal):", "A Dog object successfully uses the inherited __init__ and make_sound()"],
      hint: "Writing class Dog(Animal): with nothing but pass in the body still gives Dog everything Animal has.",
      lessonAssessment: [
        {
          question: "What does class Dog(Animal): mean?",
          options: [
            "Dog and Animal are unrelated classes that happen to be named similarly",
            "Dog is a subclass that inherits from the Animal parent class",
            "Animal is a subclass of Dog",
            "This creates a new object named Animal",
          ],
          correctAnswerIndex: 1,
          explanation: "Placing a class name in parentheses after the subclass name establishes Dog as a subclass that inherits from Animal.",
        },
        {
          question: "If Dog(Animal) has no __init__ of its own, what happens when you create a Dog object with an argument?",
          options: [
            "It raises an error because Dog has no __init__",
            "It uses Animal's inherited __init__ automatically",
            "The Dog object is created with no attributes at all",
            "Python creates an empty __init__ automatically that ignores arguments",
          ],
          correctAnswerIndex: 1,
          explanation: "A subclass without its own __init__ automatically inherits and uses the parent class's __init__.",
        },
      ],
      commonMistakes: ["Forgetting to put the parent class name in parentheses, which creates an unrelated standalone class instead of a subclass.", "Assuming a subclass needs to redefine every method from the parent, even ones it does not need to change."],
      deliverables: ["A script with an Animal parent class and at least one working subclass"],
      assessmentCriteria: ["Subclass correctly inherits attributes and methods from the parent", "Inherited __init__ and method work correctly on the subclass object"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def make_sound(self):\n        return "..."\n\nclass Dog(Animal):\n    pass\n\nfido = Dog("Fido")\nprint(fido.name)\nprint(fido.make_sound())',
        explanation: "Dog inherits both the __init__ and make_sound() from Animal without redefining either, so fido works correctly even though Dog's body is empty.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Overriding Methods and Using super()",
      goal: "Override an inherited method with specialized behavior and call the parent's version using super().",
      videoTitle: "Python super() and Method Overriding Explained",
      videoSearchQuery: "python super method overriding tutorial subclass",
      videoLearningGoal: "See a subclass override a parent method and use super() to extend rather than fully replace it.",
      recommendedChannels: ["freeCodeCamp.org", "Tech With Tim"],
      keyTakeaways: [
        "A subclass overrides a method by defining a method with the same name; the subclass's version runs instead of the parent's.",
        "super() gives you access to the parent class's version of a method from inside the subclass.",
        "Overriding __init__ often still needs super().__init__(...) so the parent's setup logic still runs.",
      ],
      notes:
        "Overriding lets a subclass replace or extend a specific piece of inherited behavior without touching the parent class at all. If Dog defines its own make_sound(self), calling it on a Dog object runs Dog's version, not Animal's. super() is how you call the parent's original version from inside the override, useful when you want to add to existing behavior rather than fully replace it.",
      conceptExplanation:
        "class Dog(Animal): def make_sound(self): return \"Woof\" completely replaces Animal's make_sound() for Dog objects. When overriding __init__ to add new subclass-specific attributes, you typically still want the parent's setup to run: def __init__(self, name, breed): super().__init__(name); self.breed = breed calls Animal's __init__ to set name, then adds breed on top. Without that super().__init__() call, the parent's setup logic would be skipped entirely.",
      whyItMatters: "Overriding with super() lets you specialize behavior in a subclass while still reusing the parent's logic, instead of copy-pasting and duplicating it.",
      practicalTask:
        "Using your Animal and Dog classes from the previous lesson, override make_sound() on Dog to return \"Woof!\" instead of \"...\". Then override __init__ on Dog to accept name and breed, calling super().__init__(name) to reuse Animal's setup, and storing breed as a new instance attribute. Create a Dog object and print its name, breed, and the result of make_sound().",
      challenge: "Add a Cat subclass with its own overridden make_sound() returning \"Meow!\", and loop through a list containing one Dog and one Cat, calling make_sound() on each to show each returns its own specialized sound.",
      expectedResult: "The Dog object correctly prints its inherited name, its new breed attribute, and the overridden \"Woof!\" sound instead of the parent's default.",
      tests: ["Dog overrides make_sound() with its own return value", "Dog's __init__ calls super().__init__() to reuse the parent's setup"],
      hint: "super().__init__(name) must be called before you rely on self.name existing inside Dog's own __init__.",
      lessonAssessment: [
        {
          question: "What happens when a subclass defines a method with the same name as one in its parent class?",
          options: [
            "Python raises an error for the naming conflict",
            "The subclass's version overrides the parent's, and it runs instead for objects of that subclass",
            "Both versions run, one after the other, automatically",
            "The parent's version always takes priority",
          ],
          correctAnswerIndex: 1,
          explanation: "Overriding replaces the inherited method for that subclass; Python looks for the method starting on the object's own class first.",
        },
        {
          question: "Why would you call super().__init__(name) inside a subclass's own __init__?",
          options: [
            "It is required syntax with no real effect",
            "To reuse the parent class's setup logic instead of duplicating it",
            "To delete the parent class",
            "To prevent the subclass from having any attributes",
          ],
          correctAnswerIndex: 1,
          explanation: "super().__init__() runs the parent's constructor logic, so shared setup code does not need to be copy-pasted into every subclass.",
        },
      ],
      commonMistakes: ["Overriding __init__ without calling super().__init__(), silently losing attributes the parent was supposed to set up.", "Assuming overriding a method deletes it from the parent class entirely, when it only replaces it for that specific subclass."],
      deliverables: ["A script with an overridden method and an __init__ using super()"],
      assessmentCriteria: ["Overridden method correctly replaces the parent behavior", "super() correctly reuses parent setup logic instead of duplicating it"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def make_sound(self):\n        return "..."\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)\n        self.breed = breed\n\n    def make_sound(self):\n        return "Woof!"\n\nfido = Dog("Fido", "Labrador")\nprint(fido.name, fido.breed, fido.make_sound())',
        explanation: "super().__init__(name) reuses Animal's setup for name, Dog adds its own breed attribute, and make_sound() is fully overridden to return a Dog-specific sound.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Polymorphism and Composition: When to Use Inheritance",
      goal: "Recognize polymorphism through overridden methods, and understand when composition is a clearer choice than inheritance.",
      videoTitle: "Python Polymorphism and Composition vs Inheritance",
      videoSearchQuery: "python polymorphism composition vs inheritance tutorial",
      videoLearningGoal: "See the same method call produce different results depending on an object's actual class, and compare that to composing objects together.",
      recommendedChannels: ["Programming with Mosh", "Corey Schafer"],
      keyTakeaways: [
        "Polymorphism means the same method call (like make_sound()) behaves differently depending on the object's actual class.",
        "Composition means one class holds another class's object as an attribute, instead of inheriting from it.",
        "Inheritance fits an 'is a' relationship; composition fits a 'has a' relationship.",
      ],
      notes:
        "Polymorphism is what makes overriding useful at scale: you can loop through a list of different subclass objects and call the same method name on each, and every object responds with its own version automatically. Composition is the alternative to inheritance: instead of a Car being a kind of Engine, a Car has an Engine as one of its attributes.",
      conceptExplanation:
        "for animal in [Dog(\"Fido\", \"Lab\"), Cat(\"Tom\")]: print(animal.make_sound()) calls make_sound() on each object without checking its exact type first, and each one returns its own overridden result: this is polymorphism in action. Composition looks like class Car: def __init__(self, engine): self.engine = engine, where Car does not inherit from Engine, it simply holds one. Composition is usually preferred when the relationship is not a true 'is a': a Car is not a kind of Engine, but it definitely has one.",
      whyItMatters: "Polymorphism lets you write code that works with a whole family of related objects uniformly, and knowing when to choose composition over inheritance prevents overly rigid, hard-to-change class hierarchies.",
      practicalTask:
        "Using your Animal, Dog, and Cat classes, create a list containing at least one Dog and one Cat object. Loop through the list and call make_sound() on each item using the same loop code, printing each result to demonstrate polymorphism. Then define a separate Engine class with a horsepower attribute, and a Car class whose __init__ accepts and stores an Engine object as self.engine (composition, not inheritance).",
      challenge: "Add a method describe(self) to Car that returns a sentence including self.engine.horsepower, showing how a class can use an object it holds through composition.",
      expectedResult: "The loop prints a different sound for the Dog and the Cat using identical loop code, and the Car object correctly reports its Engine's horsepower through composition.",
      tests: ["A single loop calls make_sound() polymorphically on at least 2 different subclass objects", "Car holds an Engine object as an attribute rather than inheriting from Engine"],
      hint: "Composition just means storing another object as an attribute: self.engine = engine, then using self.engine.horsepower to reach into it.",
      lessonAssessment: [
        {
          question: "What does polymorphism mean in the context of overridden methods?",
          options: [
            "Every subclass must have identical method implementations",
            "The same method call behaves differently depending on the actual class of the object it is called on",
            "Only parent classes can define methods",
            "Objects cannot be stored in the same list",
          ],
          correctAnswerIndex: 1,
          explanation: "Polymorphism lets one method name (like make_sound()) produce different, class-specific behavior depending on which object it is called on.",
        },
        {
          question: "Which relationship is composition typically used for, compared to inheritance?",
          options: [
            "An 'is a' relationship, like a Dog is an Animal",
            "A 'has a' relationship, like a Car has an Engine",
            "Composition and inheritance model the exact same relationship",
            "Composition is only used for numeric data",
          ],
          correctAnswerIndex: 1,
          explanation: "Composition models a 'has a' relationship, where one class holds another object as an attribute, rather than a true type hierarchy.",
        },
      ],
      commonMistakes: ["Using inheritance for a 'has a' relationship, e.g. making Car inherit from Engine instead of holding one.", "Writing separate if/elif checks for each object's type instead of relying on polymorphism to call the same method uniformly."],
      deliverables: ["A script demonstrating polymorphism through a loop and composition through a Car/Engine relationship"],
      assessmentCriteria: ["Polymorphic loop correctly calls the same method on different subclass objects", "Composition correctly models a 'has a' relationship without misusing inheritance"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'class Engine:\n    def __init__(self, horsepower):\n        self.horsepower = horsepower\n\nclass Car:\n    def __init__(self, model, engine):\n        self.model = model\n        self.engine = engine\n\n    def describe(self):\n        return f"{self.model} has {self.engine.horsepower} horsepower"\n\nanimals = [Dog("Fido", "Lab"), Cat("Tom")]\nfor animal in animals:\n    print(animal.make_sound())\n\ncar = Car("Roadster", Engine(300))\nprint(car.describe())',
        explanation: "The loop calls make_sound() polymorphically on each animal, while Car uses composition, holding an Engine object rather than inheriting from it.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Inheritance & Polymorphism Assessment",
    questions: [
      { question: "What does class Dog(Animal): establish?", options: ["Dog and Animal are unrelated", "Dog inherits from Animal", "Animal inherits from Dog", "Dog replaces Animal entirely"], correctAnswerIndex: 1, explanation: "Placing Animal in parentheses after Dog makes Dog a subclass that inherits Animal's attributes and methods." },
      { question: "If Dog has no __init__ of its own, what __init__ does creating a Dog object use?", options: ["None, it fails", "Animal's inherited __init__", "A default empty one Python generates", "Dog's own, invisible __init__"], correctAnswerIndex: 1, explanation: "A subclass without its own __init__ automatically uses the parent's inherited __init__." },
      { question: "What happens when a subclass defines a method with the same name as its parent's method?", options: ["A naming error occurs", "The subclass's version overrides the parent's for that subclass", "Both run automatically in sequence", "The parent version always wins"], correctAnswerIndex: 1, explanation: "Overriding means the subclass's method definition replaces the parent's for instances of that subclass." },
      { question: "What does super().__init__(name) do inside a subclass's __init__?", options: ["Deletes the parent class", "Calls the parent class's __init__ to reuse its setup logic", "Creates a second object", "Has no effect"], correctAnswerIndex: 1, explanation: "super() gives access to the parent class, letting the subclass reuse rather than duplicate the parent's constructor logic." },
      { question: "What is a common risk of overriding __init__ without calling super().__init__()?", options: ["The subclass runs faster", "Attributes the parent was supposed to set up may never get created", "Nothing changes", "The parent class gets deleted"], correctAnswerIndex: 1, explanation: "Skipping super().__init__() means the parent's setup code never runs, so any attributes it was responsible for creating are missing." },
      { question: "What does polymorphism allow you to do with a list of different subclass objects?", options: [
          "Call the same method name on each object and get behavior specific to its own class",
          "Force every object to behave identically regardless of class",
          "Prevent the objects from being stored in the same list",
          "Automatically convert every object to the same class",
        ], correctAnswerIndex: 0, explanation: "Polymorphism lets one method call adapt its behavior based on the actual class of the object it runs on." },
      { question: "Which relationship best fits composition rather than inheritance?", options: ["A Dog is an Animal", "A Car has an Engine", "A Cat is an Animal", "A Square is a Shape"], correctAnswerIndex: 1, explanation: "'Has a' relationships, like a Car having an Engine, are modeled with composition: storing an object as an attribute rather than inheriting from it." },
      { question: "In composition, how does one class typically use another class's functionality?", options: ["By inheriting from it directly", "By holding an instance of it as an attribute", "It cannot use it at all", "By overriding all of its methods"], correctAnswerIndex: 1, explanation: "Composition stores another object as an attribute (self.engine = engine) and calls into it, rather than inheriting its class." },
      { question: "Why is inheritance a poor fit for a 'has a' relationship like Car and Engine?", options: [
          "Inheritance is always the wrong choice",
          "A Car is not a specialized kind of Engine, so modeling it as a subclass misrepresents the relationship",
          "Python does not allow inheritance between unrelated classes",
          "Engine objects cannot have attributes",
        ], correctAnswerIndex: 1, explanation: "Inheritance should model true 'is a' relationships; forcing a 'has a' relationship into inheritance creates a misleading and inflexible class hierarchy." },
      { question: "What is the benefit of writing one polymorphic loop instead of separate if/elif checks for each object's class?", options: [
          "It runs the code twice for safety",
          "The same loop code works correctly for every current and future subclass without extra branching",
          "It removes the need for methods entirely",
          "It disables inheritance",
        ], correctAnswerIndex: 1, explanation: "Polymorphism lets a single, uniform piece of code work correctly across every subclass, without needing to special-case each type." },
    ],
  },
  assignment:
    "Build a small 'Shape' hierarchy: define a base class Shape with an __init__ that stores a name, and a method area(self) that returns 0 by default. Create two subclasses, Rectangle(Shape) and Circle(Shape), each overriding __init__ (using super().__init__(name)) to store their own dimensions, and overriding area() to calculate the correct area for that shape. Create one of each, store them in a list, and loop through the list calling area() polymorphically, printing each shape's name and area.",
  assignmentDeliverables: [
    "A script with a Shape base class and Rectangle and Circle subclasses",
    "A loop that polymorphically calls area() on a list containing both subclass objects",
  ],
  assignmentAssessmentCriteria: [
    "Both subclasses correctly override __init__ using super() and area() with the correct formula",
    "The polymorphic loop correctly prints each shape's own, distinct area",
  ],
  miniProject:
    "Build a small 'Employee Payroll' system: define a base class Employee with name and base_salary, and a method monthly_pay(self) that returns base_salary. Create two subclasses, Manager(Employee) and Salesperson(Employee): Manager overrides monthly_pay() to add a fixed bonus on top of the base (using super() to reuse the base calculation), and Salesperson overrides monthly_pay() to add a commission based on a sales_total attribute. Create at least one of each, store them in a list, and print each employee's name and monthly_pay() using one polymorphic loop.",
  miniProjectDeliverables: [
    "A script with an Employee base class and at least 2 subclasses overriding monthly_pay()",
    "Printed output from a single polymorphic loop showing correct, different pay calculations",
  ],
  miniProjectAssessmentCriteria: [
    "Each subclass correctly overrides monthly_pay() with its own calculation, reusing super() where appropriate",
    "The polymorphic loop correctly handles every employee type without special-casing",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
