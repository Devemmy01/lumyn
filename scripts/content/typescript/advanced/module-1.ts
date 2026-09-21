import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module1: GeneratedModule = {
  title: "Advanced Generics",
  description:
    "Go beyond basic generic functions: constrain type parameters to real shapes, give them sensible defaults, and build generic classes that stay type-safe across every instantiation.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Generic Constraints in Depth",
      goal: "Use extends to constrain a generic type parameter to a shape, including constraining one type parameter to the keys of another.",
      videoTitle: "TypeScript Generic Constraints Explained",
      videoSearchQuery: "typescript generic constraints extends keyof tutorial",
      videoLearningGoal: "See how extends narrows what a generic type parameter can be, including constraining a key parameter to keyof another type parameter.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "extends on a generic type parameter restricts it to any type that satisfies a shape, not to one exact type, so the function still works on many different types.",
        "Constraining a type parameter with K extends keyof T means only real property names of T are accepted as valid keys, checked at compile time.",
        "A constrained generic still infers and preserves the caller's specific type; the constraint sets a minimum shape, it doesn't widen the result down to that shape.",
      ],
      notes:
        "You've used generics without constraints, where T could be literally anything. Most real generic functions need to promise the compiler a little more: that T at least has a certain property or method. That promise is what a constraint is, and it's what makes generic code both flexible and safe at the same time.",
      conceptExplanation:
        "interface HasLength { length: number } combined with function longest<T extends HasLength>(a: T, b: T): T tells TypeScript that T can be any type with a length property, string or array or a custom class, and the function can safely read a.length and b.length. A second, very common pattern constrains one type parameter using another: function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] means K can only be a property name that actually exists on T, and the return type T[K] is the exact type of that property, not a generic union of every possible property type.",
      whyItMatters: "Constraints are what let generic functions be genuinely reusable and genuinely safe at the same time: without them you're stuck choosing between any (no safety) or one concrete type (no reuse).",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define an interface HasLength with a length: number property, then write a generic function longest<T extends HasLength>(a: T, b: T): T that returns whichever of two length-having values is longer. Call it with two strings and then two arrays to prove it works on both without using any. Then write a generic function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] and call it on a sample object with a few different real keys, printing each result.",
      challenge: "Write a second interface Identifiable with an id: number property, then write a function using a combined constraint like <T extends HasLength & Identifiable> that reads both a.length and a.id inside the same function body.",
      expectedResult: "longest correctly returns the longer of two length-having values regardless of their specific type, and getProperty returns correctly typed values for valid keys while an invalid key argument fails to compile.",
      tests: [
        "longest works correctly on both strings and arrays without using any anywhere in its signature",
        "getProperty's key parameter is constrained with keyof so only real property names of the object type are accepted",
      ],
      hint: "keyof T produces a union of T's property names as string literal types; constraining K to that union is exactly what makes T[K] resolve to a precise, correct return type.",
      lessonAssessment: [
        {
          question: "What does the constraint in function longest<T extends HasLength>(a: T, b: T): T guarantee about T?",
          options: [
            "T must be exactly the HasLength interface",
            "T can be any type that satisfies the HasLength shape, such as a string, array, or custom class",
            "T must always be a string",
            "T must be an array specifically",
          ],
          correctAnswerIndex: 1,
          explanation: "extends HasLength only requires T to have a length property; any type with that property, not just HasLength itself, is accepted.",
        },
        {
          question: "In function getProperty<T, K extends keyof T>(obj: T, key: K): T[K], what happens if you call getProperty(point, \"z\") on an object that only has x and y properties?",
          options: [
            "It compiles and returns undefined at runtime",
            "It fails to compile, because \"z\" is not one of T's actual property names",
            "It throws a runtime error but still compiles",
            "It silently returns the string \"z\"",
          ],
          correctAnswerIndex: 1,
          explanation: "Since K is constrained to keyof T, TypeScript rejects any key argument that isn't a real property name on the inferred T at compile time.",
        },
      ],
      commonMistakes: [
        "Constraining a generic to one exact type, like <T extends string>, when a shape-based constraint like <T extends HasLength> would let the function work on far more types.",
        "Typing a key parameter as plain string instead of K extends keyof T, which loses the compile-time guarantee that the key actually exists on the object.",
      ],
      deliverables: ["main.ts with a constrained longest function and a getProperty function using keyof"],
      assessmentCriteria: [
        "longest correctly accepts any type satisfying the length constraint and returns the correct value",
        "getProperty is properly constrained with keyof so invalid keys are rejected at compile time",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code:
          'interface HasLength {\n  length: number;\n}\n\nfunction longest<T extends HasLength>(a: T, b: T): T {\n  return a.length >= b.length ? a : b;\n}\n\nconsole.log(longest("hello", "hi"));\nconsole.log(longest([1, 2, 3], [1, 2]));\n\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\nconst point = { x: 10, y: 20 };\nconsole.log(getProperty(point, "x"));\nconsole.log(getProperty(point, "y"));',
        explanation: "longest accepts any type with a length property while returning that same specific type. getProperty's K extends keyof T constraint means a call like getProperty(point, \"z\") would fail to compile, since \"z\" is not one of point's real keys.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Default Generic Type Parameters",
      goal: "Give a generic type parameter a default type so callers can omit the type argument entirely when a sensible default applies.",
      videoTitle: "TypeScript Default Generic Type Parameters",
      videoSearchQuery: "typescript default generic type parameters tutorial",
      videoLearningGoal: "See a generic interface and class given a default type parameter, and compare calling it with and without an explicit type argument.",
      recommendedChannels: ["Total TypeScript", "Jack Herrington"],
      keyTakeaways: [
        "A generic type parameter can declare a default with T = SomeType, used automatically whenever the caller doesn't supply a type argument.",
        "Defaults and constraints combine: <T extends object = {}> both restricts what T can be and supplies a fallback when it's omitted.",
        "Defaults make common cases convenient without removing the ability to specify a more precise type when you need one.",
      ],
      notes:
        "Not every caller of a generic type wants to think about type arguments every time. When there's an obviously reasonable default, like an API response's data defaulting to unknown, giving the type parameter a default keeps the common case simple while still allowing full precision when a caller wants it.",
      conceptExplanation:
        "interface ApiResponse<TData = unknown> { status: number; data: TData } means ApiResponse can be used as ApiResponse (data typed as unknown) or as ApiResponse<User> (data typed precisely). The same idea applies to classes: class MapCache<TValue = string> implements Cache<TValue> lets new MapCache() default to string values while new MapCache<number>() overrides that default. Defaults are resolved left to right and can reference earlier type parameters in the same declaration, similar to how default function parameters can reference earlier parameters.",
      whyItMatters: "Default type parameters keep generic APIs pleasant to use for the common case while still supporting full precision for callers who need it, instead of forcing every caller to write out a type argument.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define an interface ApiResponse<TData = unknown> with status and data fields, then write a function wrapResponse<TData = unknown>(data: TData, status = 200): ApiResponse<TData>. Call it once without a type argument and once with an explicit object type argument, printing both results' data. Then define an interface Cache<TValue = string> with get and set methods, and a class MapCache<TValue = string> implementing it using a Map internally, and demonstrate it storing string values without specifying a type argument.",
      challenge: "Instantiate MapCache with an explicit type argument, such as MapCache<number>, and use it to store and retrieve numeric values, showing the default was correctly overridden.",
      expectedResult: "wrapResponse and MapCache both work correctly when the type argument is omitted, using their defaults, and also work correctly when an explicit type argument overrides the default.",
      tests: [
        "wrapResponse's data field is correctly typed as unknown when no type argument is supplied",
        "MapCache correctly defaults to storing string values but accepts an explicit type argument to store a different type",
      ],
      hint: "A default is only used when the type argument is omitted entirely; passing any type argument, even one that happens to match the default, overrides it explicitly.",
      lessonAssessment: [
        {
          question: "Given interface ApiResponse<TData = unknown>, what is the type of data in const r: ApiResponse = { status: 200, data: \"x\" }?",
          options: ["string", "unknown", "any", "It fails to compile"],
          correctAnswerIndex: 1,
          explanation: "Since no type argument was supplied, TData falls back to its default, unknown.",
        },
        {
          question: "What does class MapCache<TValue = string> implements Cache<TValue> allow you to write?",
          options: [
            "Only new MapCache<string>(), nothing else",
            "new MapCache() to default TValue to string, or new MapCache<T>() for any other type",
            "new MapCache() with TValue always resolving to any",
            "Nothing; classes cannot have default type parameters",
          ],
          correctAnswerIndex: 1,
          explanation: "A default lets callers omit the type argument for the common case while still allowing an explicit override for other types.",
        },
      ],
      commonMistakes: [
        "Assuming a default type parameter makes the type argument mandatory to override, when actually it can always be omitted safely.",
        "Giving a generic a default that's too specific for genuinely general-purpose code, forcing most callers to override it anyway, which defeats the point of a default.",
      ],
      deliverables: ["main.ts with a default-typed ApiResponse/wrapResponse pair and a default-typed Cache/MapCache pair"],
      assessmentCriteria: [
        "wrapResponse and ApiResponse correctly use a default type parameter that resolves to unknown when omitted",
        "MapCache correctly defaults to string but accepts an explicit type argument to override that default",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code:
          'interface ApiResponse<TData = unknown> {\n  status: number;\n  data: TData;\n}\n\nfunction wrapResponse<TData = unknown>(data: TData, status = 200): ApiResponse<TData> {\n  return { status, data };\n}\n\nconst generic = wrapResponse("no type argument needed here");\nconst typed = wrapResponse<{ id: number; name: string }>({ id: 1, name: "Ada" });\n\nconsole.log(generic.data);\nconsole.log(typed.data.name);\n\ninterface Cache<TValue = string> {\n  get(key: string): TValue | undefined;\n  set(key: string, value: TValue): void;\n}\n\nclass MapCache<TValue = string> implements Cache<TValue> {\n  private store = new Map<string, TValue>();\n\n  get(key: string): TValue | undefined {\n    return this.store.get(key);\n  }\n\n  set(key: string, value: TValue): void {\n    this.store.set(key, value);\n  }\n}\n\nconst stringCache = new MapCache();\nstringCache.set("greeting", "hello");\nconsole.log(stringCache.get("greeting"));',
        explanation: "wrapResponse and MapCache both default their type parameter, so the common case needs no type argument at all, while an explicit type argument like wrapResponse<{ id: number; name: string }> still works precisely.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Generic Classes",
      goal: "Write classes with their own generic type parameters, understand how a constraint applies across every instance method, and know why static members can't use the class's type parameter.",
      videoTitle: "TypeScript Generic Classes Explained",
      videoSearchQuery: "typescript generic classes tutorial",
      videoLearningGoal: "See a generic class built from scratch, instantiated with different type arguments, and the reason static members can't reference the class's own type parameter.",
      recommendedChannels: ["Jack Herrington", "Theo - t3.gg"],
      keyTakeaways: [
        "A class declared as class Stack<T> gives every instance method and property access to that instance's specific T, chosen when the class is instantiated.",
        "A generic class can constrain its type parameter, like class Repository<T extends HasId>, so every method can safely rely on that shape.",
        "Static members belong to the class itself, not to any one instantiation, so they cannot reference the class's instance-level type parameters.",
      ],
      notes:
        "Generic classes work like generic functions, but the type parameter is chosen once, when the class is instantiated with new, and then applies consistently to every property and method on that instance. This is what lets you write one Stack<T> class and get a fully typed Stack<number> and a fully typed Stack<string> from it.",
      conceptExplanation:
        "class Stack<T> { private items: T[] = []; push(item: T): void { ... } pop(): T | undefined { ... } } means new Stack<number>() produces a stack where push only accepts numbers and pop returns number | undefined. Constraining the class, as in class Repository<T extends HasId>, means every method inside can safely read item.id, because T is guaranteed to have that property no matter what concrete type is used to instantiate Repository. One subtlety: you cannot write a static method that returns T or accepts a T parameter, because static members exist once per class, not once per instantiation, and T only has meaning within a specific instantiation.",
      whyItMatters: "Generic classes are how you build reusable data structures and services, like stacks, repositories, and caches, that stay fully type-safe no matter what type of data they end up holding.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Write a generic class Stack<T> with push(item: T): void, pop(): T | undefined, peek(): T | undefined, and a size getter, backed by a private array. Instantiate a Stack<number>, push a few numbers, and print the result of pop() and size. Then define an interface HasId with an id: number property, write a generic class Repository<T extends HasId> with add(item: T): void, getById(id: number): T | undefined, and all(): T[], backed by a Map. Define a User interface extending HasId, create a Repository<User>, add a few users, and print one retrieved by id.",
      challenge: "Add a generic method remove(id: number): boolean to Repository<T> that deletes an item by id and returns whether it was found, then demonstrate it removing one of the users you added.",
      expectedResult: "Stack<number> correctly manages numbers with type-safe push and pop, and Repository<User> correctly stores and retrieves users by id, relying on the HasId constraint.",
      tests: [
        "Stack<T> correctly maintains last-in-first-out order across push and pop calls",
        "Repository<T extends HasId> correctly constrains T so every stored item is guaranteed to have an id",
      ],
      hint: "A private items: T[] = [] field, initialized once, is enough backing storage for a generic stack; you don't need any type beyond T itself.",
      lessonAssessment: [
        {
          question: "In const numbers = new Stack<number>();, what does the type argument <number> determine?",
          options: [
            "Nothing; Stack ignores type arguments",
            "That this instance's push, pop, and peek all work with number specifically",
            "That Stack can only ever hold numbers, for every instance",
            "That numbers must be converted to strings internally",
          ],
          correctAnswerIndex: 1,
          explanation: "The type argument is chosen per instantiation, so this specific Stack instance is fully typed to work with number, while other instances can use different types.",
        },
        {
          question: "Why can't a generic class define a static method that uses the class's own type parameter T?",
          options: [
            "TypeScript doesn't allow static methods on generic classes at all",
            "Static members belong to the class itself, not to any particular instantiation, but T only has meaning within one instantiation",
            "T is automatically any inside static methods, so it isn't needed",
            "It's allowed, there is no restriction",
          ],
          correctAnswerIndex: 1,
          explanation: "A type parameter like T is resolved per instance (per call to new ClassName<T>()); static members exist once for the whole class, so referencing T there wouldn't correspond to any specific type.",
        },
      ],
      commonMistakes: [
        "Trying to reference a class's generic type parameter inside a static method or property, which TypeScript correctly rejects.",
        "Forgetting to constrain a generic class's type parameter when its methods rely on specific properties, resulting in compile errors inside the class body instead of a clear constraint.",
      ],
      deliverables: ["main.ts with a generic Stack<T> class and a constrained generic Repository<T extends HasId> class"],
      assessmentCriteria: [
        "Stack<T> correctly implements last-in-first-out behavior with fully type-safe push and pop",
        "Repository<T extends HasId> correctly uses its constraint to store and retrieve items by id",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "typescript",
        code:
          'class Stack<T> {\n  private items: T[] = [];\n\n  push(item: T): void {\n    this.items.push(item);\n  }\n\n  pop(): T | undefined {\n    return this.items.pop();\n  }\n\n  peek(): T | undefined {\n    return this.items[this.items.length - 1];\n  }\n\n  get size(): number {\n    return this.items.length;\n  }\n}\n\nconst numbers = new Stack<number>();\nnumbers.push(1);\nnumbers.push(2);\nconsole.log(numbers.pop(), numbers.size);\n\ninterface HasId {\n  id: number;\n}\n\nclass Repository<T extends HasId> {\n  private items = new Map<number, T>();\n\n  add(item: T): void {\n    this.items.set(item.id, item);\n  }\n\n  getById(id: number): T | undefined {\n    return this.items.get(id);\n  }\n\n  all(): T[] {\n    return [...this.items.values()];\n  }\n}\n\ninterface User extends HasId {\n  name: string;\n}\n\nconst users = new Repository<User>();\nusers.add({ id: 1, name: "Ada" });\nusers.add({ id: 2, name: "Grace" });\nconsole.log(users.getById(1)?.name);\nconsole.log(users.all().length);',
        explanation: "Stack<T> gives numbers a fully type-safe number stack, while Repository<T extends HasId> relies on its constraint to safely use item.id as a Map key for any shape that includes an id.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Advanced Generics Assessment",
    questions: [
      {
        question: "What does the constraint in function longest<T extends HasLength>(a: T, b: T): T guarantee?",
        options: [
          "T must be exactly the HasLength interface",
          "T can be any type that has a length property, such as strings, arrays, or custom classes",
          "T must always be a string",
          "T must be a number",
        ],
        correctAnswerIndex: 1,
        explanation: "extends HasLength only requires the shape, so any type with a matching length property satisfies the constraint.",
      },
      {
        question: "In function getProperty<T, K extends keyof T>(obj: T, key: K): T[K], what is T[K]?",
        options: [
          "A syntax error",
          "An indexed access type: the exact type of the property named by K on T",
          "Always the any type",
          "A union of every property type on T",
        ],
        correctAnswerIndex: 1,
        explanation: "T[K] is an indexed access type that resolves to the precise type of the property K on the object type T.",
      },
      {
        question: "Given interface ApiResponse<TData = unknown>, what type does data have in a value typed as plain ApiResponse (no type argument)?",
        options: ["any", "unknown, the default", "never", "It fails to compile"],
        correctAnswerIndex: 1,
        explanation: "Omitting the type argument falls back to the declared default, unknown.",
      },
      {
        question: "What is the purpose of combining a constraint and a default, like <T extends object = {}>?",
        options: [
          "It has no effect; only one can be used at a time",
          "It restricts what T can be while also supplying a fallback type when the caller omits it",
          "It makes T always resolve to {} regardless of what's passed",
          "It disables type checking for T",
        ],
        correctAnswerIndex: 1,
        explanation: "The constraint restricts valid types, and the default supplies what T becomes if no type argument is given, and the two work together.",
      },
      {
        question: "In class Stack<T>, when is the concrete type for T actually chosen?",
        options: [
          "When the class is defined",
          "When the class is instantiated with new Stack<SomeType>()",
          "It's chosen randomly at runtime",
          "T is always any at runtime",
        ],
        correctAnswerIndex: 1,
        explanation: "A generic class's type parameter is resolved per instantiation, when new is called with a specific type argument (or one is inferred).",
      },
      {
        question: "Why can't a static method on a generic class reference the class's own type parameter T?",
        options: [
          "Static methods can't exist on generic classes at all",
          "Static members belong to the class itself, not to any specific instantiation, so T has no meaning there",
          "T is always converted to any inside static methods",
          "There is no such restriction",
        ],
        correctAnswerIndex: 1,
        explanation: "T only has a concrete meaning within one instantiation; static members exist once per class, independent of any instantiation.",
      },
      {
        question: "What does class Repository<T extends HasId> guarantee inside the class body?",
        options: [
          "Nothing extra beyond a plain generic class",
          "Every T used with Repository is guaranteed to have an id property, so methods can safely read item.id",
          "T must be exactly the HasId interface",
          "Repository can only ever store one item",
        ],
        correctAnswerIndex: 1,
        explanation: "The constraint guarantees the shape needed by the class's own methods, no matter which specific type is used to instantiate Repository.",
      },
      {
        question: "Calling getProperty(point, \"z\") where point only has x and y properties results in:",
        options: [
          "A runtime error only",
          "A compile-time error, since \"z\" is not a member of keyof typeof point",
          "undefined, with no errors at all",
          "The literal string \"z\"",
        ],
        correctAnswerIndex: 1,
        explanation: "Because the key parameter is constrained to keyof T, an invalid key fails to compile rather than merely failing at runtime.",
      },
      {
        question: "What is a practical reason to give a generic type parameter a default, as in class MapCache<TValue = string>?",
        options: [
          "To make the type parameter mandatory",
          "To keep the common case convenient (no type argument needed) while still allowing an explicit override",
          "To disable generics entirely for that class",
          "Defaults are not supported on classes, only functions",
        ],
        correctAnswerIndex: 1,
        explanation: "A default lets callers who want the common type skip the type argument, without removing the ability to specify a different one explicitly.",
      },
      {
        question: "Which best describes the difference between a generic constraint and a generic default?",
        options: [
          "They do the same thing",
          "A constraint restricts which types are valid; a default supplies a fallback type when none is given",
          "A default restricts which types are valid; a constraint supplies a fallback",
          "Neither affects type checking, only documentation",
        ],
        correctAnswerIndex: 1,
        explanation: "extends restricts valid types (a requirement), while = supplies what to use when the type argument is omitted (a fallback), and they can be combined.",
      },
    ],
  },
  assignment:
    "Build a 'Typed Event Queue': write a generic class Queue<T> with enqueue(item: T): void, dequeue(): T | undefined, and a size getter, backed by a private array, ensuring first-in-first-out order. Then write a generic function processAll<T>(queue: Queue<T>, handler: (item: T) => void): void that dequeues and handles every item in the queue until it's empty. Create a Queue<string>, enqueue several messages, and call processAll with a handler that prints each message with its position number.",
  assignmentDeliverables: [
    "main.ts with a generic Queue<T> class enforcing first-in-first-out order",
    "A generic processAll function that drains the queue using a handler callback",
    "Printed output showing every queued item processed in the correct order",
  ],
  assignmentAssessmentCriteria: [
    "Queue<T> correctly maintains first-in-first-out order across enqueue and dequeue calls",
    "processAll is properly generic and correctly drains the queue using the provided handler",
  ],
  miniProject:
    "Build a 'Typed Plugin Registry': define an interface Plugin<TConfig extends object = {}> with a name: string and a run: (config: TConfig) => void. Build a generic class PluginRegistry<TConfig extends object = {}> with register(plugin: Plugin<TConfig>): void, backed by an array, and runAll(config: TConfig): void that calls every registered plugin's run method with the given config. Create a PluginRegistry for a shared config shape (such as { verbose: boolean }), register at least three plugins that each print a different message using the config, and call runAll to demonstrate every plugin receiving the same correctly typed config.",
  miniProjectDeliverables: [
    "main.ts with a generic Plugin<TConfig> interface and a generic PluginRegistry<TConfig> class",
    "At least three registered plugins sharing one config type",
    "Printed output from runAll showing every plugin executed with the correctly typed config",
  ],
  miniProjectAssessmentCriteria: [
    "PluginRegistry correctly constrains TConfig to an object type and stores registered plugins",
    "runAll correctly invokes every plugin's run method with a fully typed config argument, with no use of any",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
