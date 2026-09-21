import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module4: GeneratedModule = {
  title: "Decorators",
  description:
    "Use TypeScript's experimentalDecorators to attach reusable behavior directly to classes and methods with @ syntax, the pattern behind frameworks that register, wrap, and log class-based code.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Class Decorators",
      goal: "Understand what a class decorator is, enable experimentalDecorators, and write a class decorator that runs when the class itself is defined.",
      videoTitle: "TypeScript Class Decorators Explained",
      videoSearchQuery: "typescript class decorators experimentalDecorators tutorial",
      videoLearningGoal: "See a class decorator applied with @ syntax, and see what the decorator function receives and can do with the class's constructor.",
      recommendedChannels: ["Matt Pocock", "Jack Herrington"],
      keyTakeaways: [
        "A class decorator is an ordinary function placed above a class definition with @ syntax; it receives the class's constructor function as its only argument.",
        "Using decorators requires 'experimentalDecorators': true in tsconfig.json, since this decorator syntax predates the version of decorators standardized by TC39.",
        "A class decorator can inspect, modify, or replace the constructor it receives, for example by freezing it or attaching extra properties.",
      ],
      notes:
        "You've seen the @ symbol on classes in frameworks that use TypeScript, like @Injectable() or @Controller(). Those are class decorators: ordinary functions that TypeScript calls automatically when the class is defined, letting you attach behavior without changing the class's own code.",
      conceptExplanation:
        "A class decorator is written as a function that accepts a constructor: function Sealed(constructor: Function) { Object.seal(constructor); Object.seal(constructor.prototype); }. Applying it with @Sealed directly above a class declaration is roughly equivalent to calling Sealed(TheClass) right after defining it, except TypeScript wires this up automatically wherever @ is written above a class. This requires 'experimentalDecorators': true in tsconfig.json, since it's an earlier decorator proposal that shipped in TypeScript well before the newer standardized decorators; frameworks like Angular and TypeORM still rely on this experimentalDecorators form.",
      whyItMatters: "Class decorators let a framework or your own code attach cross-cutting setup, like registration, validation rules, or immutability, to a class declaratively, right where the class is defined, instead of in a separate setup step easy to forget.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Write a class decorator function Sealed(constructor: Function): void that calls Object.seal on both the constructor and its prototype. Apply @Sealed above a simple class with a couple of properties and a method. Create an instance, and inside a try/catch block, attempt to add a brand-new property to that instance that wasn't declared on the class, printing whether it succeeded or was blocked, to confirm the seal took effect.",
      challenge: "Write a second class decorator, Timestamped, that adds a readonly createdAt: Date property to the class's prototype set to new Date() the first time the decorator runs, and confirm an instance has that property after construction.",
      expectedResult: "Attempting to add a new, undeclared property to a sealed class instance fails (either silently or by throwing, depending on strict mode), confirming Object.seal was correctly applied by the decorator.",
      tests: [
        "Sealed is written as a proper class decorator function accepting a constructor parameter",
        "Sealed correctly calls Object.seal on both the constructor and its prototype",
      ],
      hint: "TypeScript modules are strict mode by default, so assigning a new property to a sealed object throws a TypeError rather than failing silently; wrap the attempt in try/catch to observe it cleanly.",
      lessonAssessment: [
        {
          question: "What does a class decorator function receive as its argument?",
          options: [
            "The class's instance, after construction",
            "The class's constructor function itself",
            "A string containing the class's name",
            "Nothing; class decorators take no arguments",
          ],
          correctAnswerIndex: 1,
          explanation: "A class decorator is called with the class's constructor function, which it can inspect, modify, or replace.",
        },
        {
          question: "What tsconfig.json setting is required to use this decorator syntax?",
          options: ["\"strict\": true", "\"experimentalDecorators\": true", "\"allowJs\": true", "No setting is required"],
          correctAnswerIndex: 1,
          explanation: "This decorator syntax predates TC39's standardized decorators, so TypeScript requires experimentalDecorators to be explicitly enabled to use it.",
        },
      ],
      commonMistakes: [
        "Forgetting to enable experimentalDecorators, then being confused why @ syntax above a class produces a compile error.",
        "Assuming a class decorator runs once per instance, when it actually runs exactly once, when the class itself is defined, not each time new is called.",
      ],
      deliverables: ["main.ts with a Sealed class decorator applied to a class, demonstrating the seal blocking a new property"],
      assessmentCriteria: [
        "Sealed is correctly written as a class decorator function that seals both the constructor and its prototype",
        "The practical task demonstrates, through try/catch, that adding an undeclared property to a sealed instance is blocked",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code:
          'function Sealed(constructor: Function): void {\n  Object.seal(constructor);\n  Object.seal(constructor.prototype);\n}\n\n@Sealed\nclass Account {\n  balance = 0;\n\n  deposit(amount: number): void {\n    this.balance += amount;\n  }\n}\n\nconst account = new Account();\naccount.deposit(50);\nconsole.log(account.balance);\n\ntry {\n  (account as any).nickname = "Savings";\n  console.log("Property added (unexpected)");\n} catch (error) {\n  console.log("Blocked: sealed instances reject new properties");\n}',
        explanation: "@Sealed runs once, when Account is defined, freezing its shape. Attempting to add an undeclared nickname property afterward is rejected, proving the class decorator took effect.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Method Decorators: A Practical Logging Decorator",
      goal: "Write a method decorator that wraps a class method's behavior using target, propertyKey, and a PropertyDescriptor.",
      videoTitle: "TypeScript Method Decorators Explained",
      videoSearchQuery: "typescript method decorator PropertyDescriptor logging tutorial",
      videoLearningGoal: "See a method decorator built from scratch that wraps a class method to log its calls and return value, by replacing descriptor.value.",
      recommendedChannels: ["Jack Herrington", "Total TypeScript"],
      keyTakeaways: [
        "A method decorator function receives three arguments: target (the class prototype), propertyKey (the method's name), and descriptor (a PropertyDescriptor describing the method).",
        "descriptor.value holds the original method function; a method decorator typically saves it, then replaces descriptor.value with a new function that wraps it.",
        "Because the wrapper is called as the method (obj.method(...)), it must use function, not an arrow function, so that this still refers to the instance, and must call the original method with .apply(this, args) to preserve that binding.",
      ],
      notes:
        "A method decorator works like a class decorator but targets a single method instead of the whole class. It's the same wrapping idea you'd recognize from a Python or JavaScript decorator: capture the original behavior, then substitute a new function that does extra work around it.",
      conceptExplanation:
        "function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor): void { const original = descriptor.value; descriptor.value = function (...args: any[]) { console.log(`Calling ${propertyKey} with`, args); const result = original.apply(this, args); console.log(`${propertyKey} returned`, result); return result; }; } replaces the method stored on descriptor.value with a wrapper that logs before and after calling the original. Using function instead of an arrow function for the wrapper matters here: arrow functions don't have their own this, so calling original.apply(this, args) inside one wouldn't correctly forward the instance the method was actually called on.",
      whyItMatters: "Method decorators are how frameworks add logging, validation, caching, or access control to specific methods declaratively, the exact same cross-cutting-behavior idea as a Python decorator, expressed with TypeScript's class-oriented @ syntax.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Write a method decorator LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor): void that saves the original method from descriptor.value, then replaces descriptor.value with a function that logs the method name and arguments before calling the original with .apply(this, args), logs the return value, and returns it. Apply @LogMethod to at least two different methods on a class, call each one with different arguments, and confirm the before/after logs surround each method's own output.",
      challenge: "Modify LogMethod to also log how long the original method call took, using Date.now() before and after calling original.apply(this, args).",
      expectedResult: "Calling either decorated method prints a 'calling' message with its arguments, then the method's own behavior, then a 'returned' message with its result, in that order.",
      tests: [
        "LogMethod correctly reads the original method from descriptor.value before replacing it",
        "The wrapper function uses original.apply(this, args), correctly preserving the instance the method was called on",
      ],
      hint: "descriptor.value is where the class's method function currently lives; assigning a new function to descriptor.value is what actually changes the method's runtime behavior.",
      lessonAssessment: [
        {
          question: "What three arguments does a method decorator function receive?",
          options: [
            "The class name, the method name, and the return type",
            "target (the prototype), propertyKey (the method name), and descriptor (a PropertyDescriptor)",
            "Only the method function itself",
            "The instance, the arguments array, and the result",
          ],
          correctAnswerIndex: 1,
          explanation: "TypeScript calls a method decorator with the prototype it's defined on, the method's property name, and a descriptor object describing that method.",
        },
        {
          question: "Why must the wrapper function assigned to descriptor.value be a regular function rather than an arrow function?",
          options: [
            "Arrow functions are not allowed inside decorators at all",
            "A regular function has its own this, so original.apply(this, args) correctly forwards the instance the method was actually called on",
            "It makes no difference either way",
            "Arrow functions can't accept a rest parameter like ...args",
          ],
          correctAnswerIndex: 1,
          explanation: "An arrow function doesn't bind its own this, so this inside it wouldn't correctly refer to the instance the decorated method was called on when using .apply(this, args).",
        },
      ],
      commonMistakes: [
        "Forgetting to call original.apply(this, args) (or forgetting to return its result), which silently breaks the method's real behavior and return value.",
        "Writing the wrapper as an arrow function, which loses the correct this binding needed to call the original method on the right instance.",
      ],
      deliverables: ["main.ts with a LogMethod method decorator applied to at least two methods on a class"],
      assessmentCriteria: [
        "LogMethod correctly wraps the original method, preserving its arguments, this binding, and return value",
        "Applying LogMethod to two different methods produces correct, method-specific log output for each",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "typescript",
        code:
          'function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor): void {\n  const original = descriptor.value;\n\n  descriptor.value = function (...args: any[]) {\n    console.log(`Calling ${propertyKey} with`, args);\n    const result = original.apply(this, args);\n    console.log(`${propertyKey} returned`, result);\n    return result;\n  };\n}\n\nclass Calculator {\n  @LogMethod\n  add(a: number, b: number): number {\n    return a + b;\n  }\n\n  @LogMethod\n  multiply(a: number, b: number): number {\n    return a * b;\n  }\n}\n\nconst calc = new Calculator();\ncalc.add(2, 3);\ncalc.multiply(4, 5);',
        explanation: "LogMethod replaces each decorated method with a wrapper that logs before and after calling the original via .apply(this, args), so add and multiply both keep their real behavior while gaining logging.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Decorator Factories: Combining Class and Method Decorators",
      goal: "Write a decorator factory that accepts configuration arguments, and combine a class decorator with a method decorator to build a small command registry.",
      videoTitle: "TypeScript Decorator Factories Explained",
      videoSearchQuery: "typescript decorator factory arguments class method decorator tutorial",
      videoLearningGoal: "See a decorator factory that accepts its own arguments and returns the actual decorator, then see a class decorator and a method decorator working together on the same class.",
      recommendedChannels: ["Theo - t3.gg", "Matt Pocock"],
      keyTakeaways: [
        "A decorator factory is a function that accepts configuration arguments and returns the actual decorator function, enabling syntax like @Command('greet') instead of a plain, argument-free @Command.",
        "Class decorators and method decorators can be combined freely on the same class: the class decorator sees the fully-decorated class after all method decorators inside it have already run.",
        "A common real pattern is a class decorator that registers the class (or its instances) somewhere, like a shared registry, so other code can discover it without manual bookkeeping.",
      ],
      notes:
        "This lesson combines everything from the module: a configurable decorator factory (the same idea as a Python decorator that takes arguments), a class decorator, and a method decorator, all working together to build something a small framework might actually need: a registry of named commands.",
      conceptExplanation:
        "function Command(name: string) { return function (constructor: Function) { CommandRegistry.set(name, constructor); }; } is a decorator factory: calling Command('greet') returns the real class decorator, which registers the class under that name in a shared CommandRegistry map. Applied as @Command('greet') above a class, alongside @LogMethod on one of its methods, both decorators run: the method decorator runs first, wrapping that method, and then the class decorator runs on the now-fully-defined class, registering it. This mirrors how real frameworks discover and wire up classes purely from their decorators, without any separate manual registration step.",
      whyItMatters: "Decorator factories and registries are the backbone of how many real frameworks organize class-based code: a class announces what it is and how it should behave through decorators, and the framework wires everything else together automatically.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Create a Map called CommandRegistry that maps command names (strings) to constructor functions. Write a decorator factory Command(name: string) that returns a class decorator registering the decorated class's constructor into CommandRegistry under that name. Reuse your LogMethod decorator from the previous lesson on one method of a class. Apply both @Command('greet') and @LogMethod (on a method) to the same class. After defining the class, look up 'greet' in CommandRegistry, confirm you got the right constructor back, construct an instance from it, and call the decorated method.",
      challenge: "Register a second, different class under a different command name, then write a small function runCommand(name: string) that looks the class up in CommandRegistry, constructs it, and calls a known method on it, demonstrating the registry can dispatch to either class by name.",
      expectedResult: "CommandRegistry correctly maps each command name to its class's constructor, and constructing an instance from a looked-up constructor still has the method-decorator behavior applied to it.",
      tests: [
        "Command(name) is correctly written as a decorator factory returning a class decorator",
        "CommandRegistry correctly stores and retrieves the right constructor by command name",
      ],
      hint: "A decorator factory just needs to return an ordinary decorator function; everything you already know about class decorators and method decorators still applies to what it returns.",
      lessonAssessment: [
        {
          question: "What is a decorator factory?",
          options: [
            "A decorator that can only be applied to factories",
            "A function that accepts configuration arguments and returns the actual decorator function",
            "A built-in TypeScript keyword",
            "A class that manufactures other classes at runtime",
          ],
          correctAnswerIndex: 1,
          explanation: "A decorator factory is called first, with its own arguments, and its return value is the real decorator that TypeScript then applies to the class or method.",
        },
        {
          question: "When a class decorator and a method decorator are both applied to the same class, in what order do they run?",
          options: [
            "The class decorator always runs first, before any method decorators",
            "Method decorators inside the class run first, then the class decorator runs on the fully-defined class",
            "They run in an unpredictable order",
            "Only one of them can run; combining them is not allowed",
          ],
          correctAnswerIndex: 1,
          explanation: "Method (and property) decorators inside a class are applied first, and the class decorator receives the class only after those inner decorators have already taken effect.",
        },
      ],
      commonMistakes: [
        "Writing Command as a plain class decorator instead of a factory, making @Command('greet') impossible to call with an argument.",
        "Assuming a class decorator sees the class before its method decorators have run, when it actually always runs after them.",
      ],
      deliverables: ["main.ts with a Command(name) decorator factory, a CommandRegistry map, and a class using both @Command and @LogMethod together"],
      assessmentCriteria: [
        "Command(name) is correctly implemented as a decorator factory that registers the class by name",
        "The registered class is correctly retrieved from CommandRegistry and still has its method-decorator behavior applied",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "typescript",
        code:
          'const CommandRegistry = new Map<string, new () => any>();\n\nfunction Command(name: string) {\n  return function (constructor: new () => any): void {\n    CommandRegistry.set(name, constructor);\n  };\n}\n\nfunction LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor): void {\n  const original = descriptor.value;\n  descriptor.value = function (...args: any[]) {\n    console.log(`Running command method: ${propertyKey}`);\n    return original.apply(this, args);\n  };\n}\n\n@Command("greet")\nclass GreetCommand {\n  @LogMethod\n  run(name: string): void {\n    console.log(`Hello, ${name}!`);\n  }\n}\n\nconst GreetConstructor = CommandRegistry.get("greet")!;\nconst greetInstance = new GreetConstructor();\ngreetInstance.run("Ada");',
        explanation: "Command('greet') registers GreetCommand's constructor in CommandRegistry, while LogMethod still wraps run with logging; looking the class up by name and constructing it produces a fully working, still-decorated instance.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Decorators Assessment",
    questions: [
      {
        question: "What does a class decorator function receive as its argument?",
        options: [
          "An instance of the class",
          "The class's constructor function",
          "A string with the class name",
          "Nothing at all",
        ],
        correctAnswerIndex: 1,
        explanation: "A class decorator is invoked with the class's constructor, which it can inspect, modify, or replace.",
      },
      {
        question: "What tsconfig.json option must be enabled to use this decorator syntax?",
        options: ["\"strict\": true", "\"experimentalDecorators\": true", "\"noImplicitAny\": true", "No option is required"],
        correctAnswerIndex: 1,
        explanation: "This is an earlier decorator proposal predating TC39's standardized decorators, so it requires experimentalDecorators explicitly.",
      },
      {
        question: "How many times does a class decorator run for a given class?",
        options: [
          "Once per instance created with new",
          "Exactly once, when the class itself is defined",
          "Once per method on the class",
          "It never runs automatically",
        ],
        correctAnswerIndex: 1,
        explanation: "A class decorator runs a single time, at class definition, not once per instance.",
      },
      {
        question: "What three arguments does a method decorator function receive?",
        options: [
          "The instance, the arguments, and the result",
          "target, propertyKey, and descriptor",
          "Only the method's return value",
          "The class name and the method's source code",
        ],
        correctAnswerIndex: 1,
        explanation: "A method decorator receives the prototype (target), the method's name (propertyKey), and its PropertyDescriptor.",
      },
      {
        question: "Where does a method decorator find the original method it's about to wrap?",
        options: ["target.method", "descriptor.value", "propertyKey.value", "It has to look it up from the class name"],
        correctAnswerIndex: 1,
        explanation: "descriptor.value holds the current method function; a method decorator typically saves this before replacing it.",
      },
      {
        question: "Why must a method decorator's wrapper function use .apply(this, args) rather than just calling original(args)?",
        options: [
          "It has no real effect either way",
          "To correctly forward both the instance (this) the method was called on and its arguments to the original method",
          "Because JavaScript requires .apply for all function calls",
          "To convert the arguments into an array",
        ],
        correctAnswerIndex: 1,
        explanation: ".apply(this, args) preserves the correct this binding for the instance the decorated method was actually called on, along with its arguments.",
      },
      {
        question: "Why must a method decorator's wrapper be a regular function rather than an arrow function?",
        options: [
          "Arrow functions are forbidden inside classes",
          "A regular function has its own this, needed for .apply(this, args) to forward the correct instance",
          "Arrow functions can't accept arguments",
          "It makes no difference",
        ],
        correctAnswerIndex: 1,
        explanation: "Arrow functions don't have their own this, so using one would break the instance binding needed when calling the original method.",
      },
      {
        question: "What is a decorator factory?",
        options: [
          "A special kind of class that only decorators can extend",
          "A function that accepts its own configuration arguments and returns the actual decorator",
          "A built-in TypeScript compiler feature with no user code involved",
          "A decorator that can only be used once per file",
        ],
        correctAnswerIndex: 1,
        explanation: "A decorator factory is called with its own arguments first, and what it returns is the decorator TypeScript actually applies.",
      },
      {
        question: "When a class decorator and a method decorator are both applied to the same class, in what order do they run?",
        options: [
          "The class decorator always runs first",
          "Method decorators inside the class run first; the class decorator then runs on the already-decorated class",
          "Whichever is written first in the file runs first, regardless of position",
          "They cannot both be used on the same class",
        ],
        correctAnswerIndex: 1,
        explanation: "Method and property decorators are applied before the enclosing class decorator, which then sees the fully decorated class.",
      },
      {
        question: "What is a practical, realistic use case for a class decorator combined with a shared registry?",
        options: [
          "Declaring a local variable",
          "Automatically registering a class (like a command or a controller) somewhere so other code can discover it without manual setup",
          "Making a class's methods run faster",
          "Converting a class into an interface",
        ],
        correctAnswerIndex: 1,
        explanation: "Registering classes via a decorator, as frameworks commonly do for controllers or commands, is a classic real use case for class decorators combined with a shared registry.",
      },
    ],
  },
  assignment:
    "Build a 'Validated Model' toolkit: write a method decorator called Positive that wraps a method taking a single number parameter, checking before calling the original method whether the argument is greater than 0, and if not, logging an error message and returning undefined instead of calling the original method. Apply @Positive to a method like deposit(amount: number): number on a small BankAccount-style class. Call the decorated method once with a valid positive amount and once with a negative amount, and confirm from the printed output that the negative call was correctly rejected while the positive one succeeded.",
  assignmentDeliverables: [
    "main.ts with a Positive method decorator applied to a numeric-argument method",
    "Printed output showing one successful call and one rejected call with a negative argument",
  ],
  assignmentAssessmentCriteria: [
    "Positive correctly inspects the argument and only calls the original method when it's greater than 0",
    "The decorated method correctly demonstrates both an accepted and a rejected call, evidenced by printed output",
  ],
  miniProject:
    "Build a 'Mini Plugin Framework': write a decorator factory Plugin(name: string) that registers the decorated class's constructor in a shared Map called PluginRegistry, keyed by name. Write a method decorator Logged that wraps any method with before/after console.log statements naming the method. Define at least two different classes, each decorated with @Plugin and a unique name, each with at least one method decorated with @Logged. Write a function runPlugin(name: string, method: string, ...args: any[]) that looks up a class by name in PluginRegistry, constructs an instance, calls the named method with the given arguments using bracket notation, and returns the result. Demonstrate runPlugin successfully dispatching to both registered plugin classes.",
  miniProjectDeliverables: [
    "main.ts with a Plugin(name) decorator factory, a Logged method decorator, a PluginRegistry map, and at least two decorated plugin classes",
    "A runPlugin(name, method, ...args) function that looks up and invokes a plugin's method by name",
    "Printed output demonstrating both registered plugins were successfully looked up and invoked",
  ],
  miniProjectAssessmentCriteria: [
    "Plugin(name) correctly registers each decorated class's constructor under its given name",
    "runPlugin correctly retrieves, constructs, and invokes a method on either registered plugin, with Logged's wrapping still applied",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
