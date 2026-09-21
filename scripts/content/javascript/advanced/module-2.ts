import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module2: GeneratedModule = {
  title: "Prototypes & `this` Deep Dive",
  description:
    "Go beneath class syntax to see how JavaScript actually resolves properties through the prototype chain, build inheritance directly with Object.create, and get a firm, practical grip on how this is determined, controlled, and captured differently by arrow functions.",
  completionStatus: "locked",
  lessons: [
    {
      title: "The Prototype Chain: How Property Lookup Really Works",
      goal: "Understand how JavaScript looks up properties through the prototype chain, and how methods placed on a prototype are shared across every instance instead of duplicated.",
      videoTitle: "JavaScript Prototype Chain Explained",
      videoSearchQuery: "javascript prototype chain explained tutorial",
      videoLearningGoal: "See property lookup walk up an object's prototype chain step by step until it finds a matching property or reaches the end of the chain.",
      recommendedChannels: ["Fireship", "Web Dev Simplified"],
      keyTakeaways: [
        "Every JavaScript object has an internal link to another object, its prototype, retrievable with Object.getPrototypeOf().",
        "When you access a property that isn't found directly on an object, JavaScript automatically walks up the prototype chain, checking each linked object in turn, until it finds the property or reaches the end of the chain.",
        "Methods added to a constructor function's prototype are shared by every instance created from that constructor, rather than being duplicated onto each individual object.",
      ],
      notes:
        "for(const obj of chain) is not literally how it works, but conceptually every property lookup in JavaScript is a walk: check the object itself, then its prototype, then that prototype's prototype, and so on, stopping at the first match. Understanding this walk explains why instances can call methods they never defined themselves.",
      conceptExplanation:
        "function Dog(name) { this.name = name; } Dog.prototype.bark = function () { return `${this.name} says woof`; }; const rex = new Dog('Rex'); rex.bark() works even though bark is not a property directly on rex, because property lookup fails to find bark on rex itself, then checks Object.getPrototypeOf(rex), which is Dog.prototype, and finds it there. Every Dog instance shares that exact same bark function object; it is never copied per instance, only referenced through the chain.",
      whyItMatters:
        "Understanding prototype lookup demystifies why methods work on objects that never explicitly defined them, and it's the exact mechanism ES6 class syntax is built on top of under the hood.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Write a constructor function Dog(name, breed) that sets this.name and this.breed, then add a bark method to Dog.prototype that returns a string using this.name. Create two Dog instances, call bark() on both, then use Object.getPrototypeOf(rex) === Dog.prototype to confirm both instances share the exact same prototype object, logging the boolean result. Also demonstrate rex.hasOwnProperty('name') logging true and rex.hasOwnProperty('bark') logging false, to distinguish own properties from inherited ones.",
      challenge:
        "Add a second method to Dog.prototype after your instances already exist, and confirm with a fresh call that existing instances immediately gain access to it too, since prototype lookup happens at call time, not at instance-creation time.",
      expectedResult:
        "bark() works identically on both instances by reading through the shared prototype, and the hasOwnProperty checks correctly separate an instance's own data properties from properties it merely inherits.",
      tests: [
        "Dog instances call a shared bark() method defined once on Dog.prototype rather than each having its own copy",
        "hasOwnProperty() correctly reports name as an own property and bark as inherited",
      ],
      hint: "Property lookup on an object first checks the object's own properties; only if nothing is found there does JavaScript check the object's prototype, then that prototype's own prototype, and so on.",
      lessonAssessment: [
        {
          question: "What happens when you access a property that doesn't exist directly on an object?",
          options: [
            "JavaScript immediately throws an error",
            "JavaScript walks up the object's prototype chain, checking each linked object until it finds the property or reaches the end",
            "The property is automatically created with a value of undefined",
            "JavaScript returns the first property of any type it finds anywhere in the program",
          ],
          correctAnswerIndex: 1,
          explanation: "Property lookup automatically continues up the prototype chain until a match is found or the chain ends.",
        },
        {
          question: "When a method is added to a constructor function's prototype, how is it shared across instances?",
          options: [
            "Each instance receives its own independent copy of the method",
            "Every instance shares the exact same function object through the prototype chain, rather than duplicating it",
            "Only the first created instance can use the method",
            "The method must be manually copied onto each instance",
          ],
          correctAnswerIndex: 1,
          explanation: "Prototype methods exist once on the prototype object; every instance reaches them through the shared prototype link rather than owning a separate copy.",
        },
      ],
      commonMistakes: [
        "Assuming each instance gets its own private copy of a prototype method, when in fact every instance shares the exact same function object on the prototype.",
        "Confusing an object's own properties with inherited ones when using a plain for...in loop, which iterates over both unless guarded with hasOwnProperty().",
      ],
      deliverables: ["script.js with a Dog constructor and prototype method, demonstrating shared prototype identity and own-vs-inherited property checks"],
      assessmentCriteria: [
        "bark() is correctly defined once on Dog.prototype and shared by all instances",
        "hasOwnProperty() is used correctly to distinguish own properties from inherited ones",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: "function Dog(name, breed) {\n  this.name = name;\n  this.breed = breed;\n}\n\nDog.prototype.bark = function () {\n  return `${this.name} says woof`;\n};\n\nconst rex = new Dog('Rex', 'Labrador');\nconst fido = new Dog('Fido', 'Poodle');\n\nconsole.log(rex.bark());\nconsole.log(Object.getPrototypeOf(rex) === Dog.prototype);\nconsole.log(rex.hasOwnProperty('name'), rex.hasOwnProperty('bark'));",
        explanation: "rex and fido both reach bark() through the shared Dog.prototype object; hasOwnProperty distinguishes name, an own property, from bark, an inherited one.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Object.create and Building Inheritance Without Classes",
      goal: "Use Object.create() to build a direct prototype link between objects and implement inheritance without any class or constructor function.",
      videoTitle: "JavaScript Object.create Explained",
      videoSearchQuery: "javascript object.create prototypal inheritance tutorial",
      videoLearningGoal: "See Object.create() used to build an object whose prototype is another plain object, and a short chain of Object.create() calls implementing inheritance with no class syntax involved.",
      recommendedChannels: ["ArjanCodes", "Jack Herrington"],
      keyTakeaways: [
        "Object.create(proto) creates a brand new object whose prototype is set directly to proto, without running any constructor function.",
        "This lets you build prototype chains, and therefore inheritance, using plain objects, with no class or constructor involved at all.",
        "Object.create(null) creates an object with no prototype whatsoever, useful for a plain data dictionary that shouldn't inherit anything from Object.prototype.",
      ],
      notes:
        "Classes and constructor functions are conveniences layered on top of a simpler underlying mechanism: any object can become another object's prototype directly, with a single call to Object.create.",
      conceptExplanation:
        "const animal = { speak() { return `${this.name} makes a sound`; } }; const dog = Object.create(animal); dog.name = 'Rex'; dog.speak() works even though dog has no speak property of its own, because Object.create(animal) set animal as dog's prototype directly. dog itself only ever gained the name property you assigned; speak is reached purely through the prototype link. For a plain lookup table that shouldn't accidentally inherit methods like toString, Object.create(null) produces an object with no prototype at all, so even basic Object.prototype members are absent.",
      whyItMatters:
        "Object.create reveals that inheritance in JavaScript is fundamentally about linking objects together, not about classes specifically, which is useful both for lightweight object hierarchies and for building safe dictionary-style objects.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Build an animal object with a speak() method that uses this.name. Use Object.create(animal) to create dog and cat objects, assign each a name, and call speak() on both to confirm they inherit the method correctly. Then build a plain word-count dictionary using Object.create(null), add a few key-value pairs to it, and log typeof dict.toString to confirm it's 'undefined', showing the dictionary has no inherited baggage from Object.prototype.",
      challenge:
        "Chain three levels of Object.create (animal, then dog created from animal, then puppy created from dog), with each level adding or overriding one property or method, and log a call to an inherited method from the puppy object to confirm it correctly walks two levels up the chain.",
      expectedResult:
        "dog.speak() and cat.speak() both log correctly through the inherited method, and dict.toString logs as undefined, confirming the null-prototype object has no inherited members at all.",
      tests: [
        "dog and cat are created with Object.create(animal) and correctly inherit speak()",
        "A dictionary created with Object.create(null) is shown to lack inherited members like toString",
      ],
      hint: "Object.create(proto) sets up the prototype link directly; it does not copy any of proto's own properties onto the new object.",
      lessonAssessment: [
        {
          question: "What does Object.create(proto) do?",
          options: [
            "Copies all of proto's properties onto a new object",
            "Creates a new object whose prototype is set directly to proto",
            "Creates a deep clone of proto",
            "Freezes proto so it can no longer be modified",
          ],
          correctAnswerIndex: 1,
          explanation: "Object.create(proto) produces a new, empty object linked to proto as its prototype, without copying any properties.",
        },
        {
          question: "What is a practical use for Object.create(null)?",
          options: [
            "It permanently disables the object from ever having properties",
            "It creates an object with no prototype at all, useful for a plain dictionary that shouldn't inherit methods like toString",
            "It automatically deep-freezes the object",
            "It is required before any object can be used in a for...in loop",
          ],
          correctAnswerIndex: 1,
          explanation: "Object.create(null) produces an object with no inherited members whatsoever, which is ideal for a clean, dictionary-style data structure.",
        },
      ],
      commonMistakes: [
        "Expecting Object.create(proto) to copy proto's properties onto the new object, when it actually only sets up a live prototype link.",
        "Forgetting that Object.create(null) objects lack even basic methods like toString and hasOwnProperty, which can break code that assumes every object has them.",
      ],
      deliverables: ["script.js using Object.create() to build inherited animal/dog/cat objects and a null-prototype dictionary"],
      assessmentCriteria: [
        "dog and cat correctly inherit speak() through Object.create(animal) rather than duplicating it",
        "The null-prototype dictionary is shown to have no inherited members",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: "const animal = {\n  speak() {\n    return `${this.name} makes a sound`;\n  },\n};\n\nconst dog = Object.create(animal);\ndog.name = 'Rex';\n\nconst cat = Object.create(animal);\ncat.name = 'Whiskers';\n\nconsole.log(dog.speak());\nconsole.log(cat.speak());\n\nconst dict = Object.create(null);\ndict.apple = 3;\nconsole.log(typeof dict.toString);",
        explanation: "dog and cat both inherit speak() through Object.create(animal); dict has no prototype at all, so it has no inherited toString method.",
      },
      completionStatus: "not_started",
    },
    {
      title: "call, apply, bind, and How Arrow Functions Capture `this` Differently",
      goal: "Control what this refers to using call, apply, and bind, and understand why arrow functions capture this lexically instead of determining it at call time.",
      videoTitle: "JavaScript this, call, apply, and bind Explained",
      videoSearchQuery: "javascript this call apply bind arrow functions tutorial",
      videoLearningGoal: "See the same function produce different this values depending on how it's called, then see call/apply/bind explicitly control it, and arrow functions bypass the whole problem by using their surrounding scope's this.",
      recommendedChannels: ["Web Dev Simplified", "Theo - t3.gg"],
      keyTakeaways: [
        "In a regular function, this is determined by how the function is called, its 'call site', not by where the function was defined: as a method it's the object before the dot, as a detached plain call it's undefined in strict mode.",
        "call() and apply() invoke a function immediately with an explicit this value; bind() instead returns a brand new function permanently bound to that this value.",
        "Arrow functions do not have their own this; they capture this lexically from the enclosing scope at the moment they're defined, which is why they're commonly used for callbacks that need to preserve an outer this.",
      ],
      notes:
        "this is one of the more confusing parts of JavaScript because, in a regular function, it's decided fresh every single time the function is called, based on how it was called, unlike a closure over an ordinary variable, which is fixed by where the function was defined.",
      conceptExplanation:
        "const user = { name: 'Amara', greet() { return `Hi, I'm ${this.name}`; } }; user.greet() works correctly because this is user at that call site. const greetFn = user.greet; greetFn() loses that context entirely: this becomes undefined in strict mode, so this.name throws. greetFn.call(user) explicitly supplies this for one call; greetFn.apply(user, []) does the same but takes arguments as an array. const boundGreet = greetFn.bind(user) permanently locks this to user, so boundGreet() works correctly no matter where it's later called from. An arrow function defined inside greet(), like const arrowGreet = () => this.name, would instead capture this from greet's surrounding scope at the moment it was defined, which is exactly why arrow functions are the common fix for callbacks, like setTimeout, that would otherwise lose track of the right this.",
      whyItMatters:
        "Losing track of this is one of the most common sources of real bugs in JavaScript, especially with callbacks and event handlers passed around detached from the object they came from; call/apply/bind and arrow functions are the tools that fix it.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Define a user object with a name and a greet() method that returns a template string using this.name. Call user.greet() directly and log the result. Extract the method into a standalone constant, const detachedGreet = user.greet, call it directly wrapped in a try/catch, and log the caught error's message to show this has been lost. Then call detachedGreet.call(user) and detachedGreet.apply(user), logging both correct results, and create const boundGreet = detachedGreet.bind(user), call boundGreet(), and confirm it still produces the correct result even though it's a fully detached reference.",
      challenge:
        "Add a method scheduleGreet to user that uses setTimeout with a regular function callback, and observe in a comment that this inside that callback no longer refers to user. Fix it by replacing the callback with an arrow function, and confirm this now correctly refers to user inside the delayed callback.",
      expectedResult:
        "The detached call demonstrates this being lost, call/apply/bind each visibly restore the correct behavior, and the setTimeout example shows an arrow function correctly preserving this while a plain function callback does not.",
      tests: [
        "Calling a detached method directly demonstrates this no longer referring to the original object",
        "call(), apply(), and bind() are each used correctly to restore this to the intended object",
      ],
      hint: "An arrow function has no this of its own to set; call(), apply(), and bind() have no effect on where an arrow function looks up this, since it was already fixed lexically when the arrow function was defined.",
      lessonAssessment: [
        {
          question: "In a regular function used as an object's method, what determines its this value?",
          options: [
            "Where the function was originally defined in the source code",
            "How the function is called, its call site, such as being invoked as obj.method()",
            "The number of arguments passed to it",
            "this is always the global object no matter how the function is called",
          ],
          correctAnswerIndex: 1,
          explanation: "A regular function's this is resolved fresh at each call based on how it was invoked, not where it was written.",
        },
        {
          question: "How does an arrow function determine its this value?",
          options: [
            "It gets its own this based on how it is called, just like a regular function",
            "It has no this of its own; it captures this lexically from its enclosing scope at the time it was defined",
            "Its this is always undefined no matter what",
            "It is randomly assigned each time the arrow function runs",
          ],
          correctAnswerIndex: 1,
          explanation: "Arrow functions don't define their own this; they simply use whatever this was in scope where they were written.",
        },
      ],
      commonMistakes: [
        "Passing an object's method as a callback, for example to setTimeout or an event listener, without binding it, then being surprised that this no longer refers to the original object inside the callback.",
        "Trying to use call(), apply(), or bind() on an arrow function to change its this, which has no effect since arrow functions never have their own this to override.",
      ],
      deliverables: ["script.js demonstrating this being lost on a detached method call, then restored with call(), apply(), and bind()"],
      assessmentCriteria: [
        "The lost-this bug is clearly demonstrated with a detached method call",
        "call(), apply(), and bind() are each correctly used to restore this to the intended object",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "javascript",
        code: "const user = {\n  name: 'Amara',\n  greet() {\n    return `Hi, I'm ${this.name}`;\n  },\n};\n\nconsole.log(user.greet());\n\nconst detachedGreet = user.greet;\ntry {\n  console.log(detachedGreet());\n} catch (error) {\n  console.log('Caught:', error.message);\n}\n\nconsole.log(detachedGreet.call(user));\nconsole.log(detachedGreet.apply(user));\n\nconst boundGreet = detachedGreet.bind(user);\nconsole.log(boundGreet());",
        explanation: "detachedGreet() alone loses the connection to user, throwing when it tries to read this.name; call, apply, and bind each explicitly restore the correct this.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Prototypes & `this` Deep Dive Assessment",
    questions: [
      {
        question: "What does every JavaScript object have an internal link to?",
        options: ["Its constructor's source file", "Another object called its prototype", "A list of every other object in the program", "A copy of the global object"],
        correctAnswerIndex: 1,
        explanation: "Every object carries an internal link to another object, its prototype, which property lookup falls back to.",
      },
      {
        question: "What happens when a property isn't found directly on an object?",
        options: ["JavaScript throws an error immediately", "JavaScript walks up the prototype chain checking each linked object until a match is found or the chain ends", "The property is silently created with value null", "JavaScript checks every other object in the program at random"],
        correctAnswerIndex: 1,
        explanation: "Property lookup automatically continues up the prototype chain rather than failing immediately.",
      },
      {
        question: "When a method lives on a constructor function's prototype, how many copies of it exist across all instances?",
        options: ["One copy per instance", "One shared copy referenced by every instance through the prototype chain", "Zero, until an instance is created", "One copy per property the instance has"],
        correctAnswerIndex: 1,
        explanation: "Prototype methods exist once; instances reach them through the shared prototype link rather than duplicating them.",
      },
      {
        question: "What does Object.create(proto) return?",
        options: ["A deep copy of proto with all its properties duplicated", "A new, empty object whose prototype is set directly to proto", "A frozen version of proto", "A string describing proto's structure"],
        correctAnswerIndex: 1,
        explanation: "Object.create(proto) produces a new object linked to proto as its prototype, without copying any of proto's own properties.",
      },
      {
        question: "What is Object.create(null) useful for?",
        options: ["Creating an object that behaves exactly like {} in every way", "Creating an object with no prototype at all, useful for a clean dictionary without inherited members like toString", "Permanently preventing the object from having any properties", "Automatically deep-freezing an object"],
        correctAnswerIndex: 1,
        explanation: "Object.create(null) produces an object with no inherited members whatsoever, ideal for a plain lookup table.",
      },
      {
        question: "In a regular function used as an object method, what determines its this value?",
        options: ["Where in the file the function was defined", "How the function is called, its call site", "The function's name", "The number of parameters it declares"],
        correctAnswerIndex: 1,
        explanation: "A regular function's this is resolved based on how it's invoked at the call site, not where it's written in the source.",
      },
      {
        question: "What is the difference between call() and apply()?",
        options: ["There is no difference at all", "call() takes arguments individually; apply() takes them as an array", "apply() permanently binds this; call() does not", "call() only works on arrow functions"],
        correctAnswerIndex: 1,
        explanation: "Both invoke a function immediately with an explicit this, but call() lists arguments individually while apply() takes them as an array.",
      },
      {
        question: "What does bind() return?",
        options: ["The result of calling the function immediately", "A brand new function permanently bound to the given this value, which can be called later", "A copy of the original function's source code", "Nothing; bind() has no return value"],
        correctAnswerIndex: 1,
        explanation: "bind() does not call the function; it returns a new function that will always use the specified this whenever it is eventually called.",
      },
      {
        question: "How does an arrow function determine its this value?",
        options: ["Based on how it is called, exactly like a regular function", "It has no this of its own; it captures this lexically from its enclosing scope at definition time", "this is always the global object", "It is set randomly on each call"],
        correctAnswerIndex: 1,
        explanation: "Arrow functions don't define their own this binding; they simply reuse this from the scope they were written in.",
      },
      {
        question: "Why does calling call(), apply(), or bind() on an arrow function have no effect on its this?",
        options: ["Because arrow functions cannot be called with those methods at all, which throws an error", "Because an arrow function has no this of its own to override; its this was already fixed lexically when it was defined", "Because those methods only work on class methods", "Because arrow functions ignore all arguments passed to them"],
        correctAnswerIndex: 1,
        explanation: "Since an arrow function never binds its own this, there is nothing for call, apply, or bind to override.",
      },
    ],
  },
  assignment:
    "Build a 'Shape' prototype-based hierarchy without using the class keyword: a shapeProto object with a describe() method that returns a generic descriptive string, and at least two objects created with Object.create(shapeProto) representing specific shapes, such as a circle and a rectangle, each given their own data properties and their own area() method appropriate to that shape. Demonstrate calling describe() and area() on each shape, and confirm with Object.getPrototypeOf() that both shapes share the exact same prototype object.",
  assignmentDeliverables: [
    "script.js implementing a shapeProto-based prototype hierarchy with at least two shape objects built using Object.create()",
    "Printed output showing describe() and area() results for each shape, plus confirmation that both share the same prototype",
  ],
  assignmentAssessmentCriteria: [
    "Shapes are built with Object.create() rather than class syntax or constructor functions",
    "Each shape correctly inherits describe() while providing its own correct area() calculation",
  ],
  miniProject:
    "Build a small 'Lost this, Fixed' demo around a realistic bug: create a counter object with a count property and increment() and getCount() methods. Assign increment to a standalone variable to simulate passing it as a detached callback, call it directly, and log the incorrect behavior or caught error that results from this being lost. Then create a version fixed with bind() and a separate version fixed by wrapping the call in an arrow function, and demonstrate both fixed versions correctly increment the same counter object's count when called the same detached way.",
  miniProjectDeliverables: [
    "script.js demonstrating a lost-this bug on a detached method, then two different fixes: bind() and an arrow function wrapper",
    "Printed output showing the broken behavior followed by both corrected behaviors correctly incrementing the same counter object",
  ],
  miniProjectAssessmentCriteria: [
    "The lost-this bug is clearly demonstrated before any fix is applied",
    "Both the bind() fix and the arrow-function fix correctly restore the intended this and produce the correct incremented count",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
