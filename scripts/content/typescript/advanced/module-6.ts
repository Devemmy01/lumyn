import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module6: GeneratedModule = {
  title: "Design Patterns in TypeScript",
  description:
    "Implement three classic design patterns, builder, factory, and strategy, the proper TypeScript way: with interfaces and generics doing the safety work that other languages leave to convention, and no any anywhere.",
  completionStatus: "locked",
  lessons: [
    {
      title: "The Builder Pattern",
      goal: "Build a fluent, chainable builder class that constructs a complex typed object step by step, returning this from each configuration method.",
      videoTitle: "TypeScript Builder Pattern Explained",
      videoSearchQuery: "typescript builder pattern fluent interface tutorial",
      videoLearningGoal: "See a fluent builder class constructed step by step, each method returning this to enable chaining, ending in a build method that returns the fully typed result.",
      recommendedChannels: ["Jack Herrington", "Total TypeScript"],
      keyTakeaways: [
        "A builder accumulates configuration through a series of chained method calls, each one returning this, before producing the final object with a build method.",
        "Using this as a method's return type (rather than the concrete class name) keeps chaining correctly typed even if the builder is later subclassed.",
        "A builder's internal state is often typed as Partial<T> while being assembled, then validated and returned as the fully required T from build().",
      ],
      notes:
        "Some objects have many optional pieces of configuration, and passing them all as one giant constructor argument gets unreadable fast. The builder pattern solves this by letting you set each piece through its own clearly named method, chained together, ending with a single build() call.",
      conceptExplanation:
        "interface RequestConfig { url: string; method: 'GET' | 'POST'; headers: Record<string, string>; body?: string } paired with class RequestBuilder { private config: Partial<RequestConfig> = { headers: {} }; setUrl(url: string): this { this.config.url = url; return this; } setMethod(method: RequestConfig['method']): this { this.config.method = method; return this; } setHeader(key: string, value: string): this { this.config.headers![key] = value; return this; } build(): RequestConfig { if (!this.config.url || !this.config.method) { throw new Error('Missing required fields'); } return this.config as RequestConfig; } } lets you write new RequestBuilder().setUrl(...).setMethod('GET').setHeader('Accept', 'application/json').build(), each call returning this so the chain keeps working, and typed as the builder's own type rather than a fixed class name.",
      whyItMatters: "The builder pattern keeps object construction readable and safe when there are many optional pieces of configuration, and returning this instead of a hardcoded class name keeps the chain correctly typed even through subclassing.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define interface RequestConfig with url: string, method: 'GET' | 'POST', headers: Record<string, string>, and an optional body?: string. Write class RequestBuilder with a private config: Partial<RequestConfig> field (initialized with an empty headers object), chainable setUrl, setMethod, setHeader, and setBody methods each returning this, and a build(): RequestConfig method that throws if url or method weren't set, otherwise returns the completed config. Chain several calls together to build one RequestConfig, then print the result of build().",
      challenge: "Add a setBody(body: string): this method to the builder, and demonstrate building two different RequestConfig objects from two separate builder chains, one with a body set and one without.",
      expectedResult: "Chaining setUrl, setMethod, and setHeader calls together and finishing with build() produces a correctly typed, fully populated RequestConfig object, and calling build() without setting url or method throws the expected error.",
      tests: [
        "Every configuration method on RequestBuilder returns this, allowing the calls to be chained",
        "build() correctly throws when required fields are missing and correctly returns a complete RequestConfig otherwise",
      ],
      hint: "Returning this from a builder method, typed simply as : this, is what lets you write builder.setUrl(...).setMethod(...) as one continuous chain.",
      lessonAssessment: [
        {
          question: "Why does each configuration method on a builder, like setUrl(url: string): this, return this?",
          options: [
            "It has no real purpose beyond style",
            "So the methods can be chained together in a single fluent expression",
            "Because TypeScript requires all methods to return this",
            "To make the method run faster",
          ],
          correctAnswerIndex: 1,
          explanation: "Returning this from each method is exactly what allows consecutive method calls to be chained onto the same builder instance.",
        },
        {
          question: "Why is the builder's internal config field often typed as Partial<RequestConfig> rather than RequestConfig itself?",
          options: [
            "Partial<T> is required syntax for all class fields",
            "Because the config is being built incrementally, and not every required field is set yet while construction is in progress",
            "Partial<T> makes every field readonly",
            "There is no difference between the two",
          ],
          correctAnswerIndex: 1,
          explanation: "During construction, not all required fields necessarily have values yet, so Partial<RequestConfig> correctly represents that in-progress, possibly incomplete state.",
        },
      ],
      commonMistakes: [
        "Returning a specific class name instead of this from a chainable method, which can cause the chain to lose the correct type if the builder is ever subclassed.",
        "Forgetting to validate required fields inside build(), silently returning an incomplete object cast to the full type instead of catching missing configuration.",
      ],
      deliverables: ["main.ts with a chainable RequestBuilder class and at least one fully built RequestConfig produced from it"],
      assessmentCriteria: [
        "RequestBuilder's configuration methods correctly return this, enabling chaining",
        "build() correctly validates required fields and returns a properly typed, complete RequestConfig",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "typescript",
        code:
          'interface RequestConfig {\n  url: string;\n  method: "GET" | "POST";\n  headers: Record<string, string>;\n  body?: string;\n}\n\nclass RequestBuilder {\n  private config: Partial<RequestConfig> = { headers: {} };\n\n  setUrl(url: string): this {\n    this.config.url = url;\n    return this;\n  }\n\n  setMethod(method: RequestConfig["method"]): this {\n    this.config.method = method;\n    return this;\n  }\n\n  setHeader(key: string, value: string): this {\n    this.config.headers![key] = value;\n    return this;\n  }\n\n  setBody(body: string): this {\n    this.config.body = body;\n    return this;\n  }\n\n  build(): RequestConfig {\n    if (!this.config.url || !this.config.method) {\n      throw new Error("Missing required fields: url and method are required");\n    }\n    return this.config as RequestConfig;\n  }\n}\n\nconst request = new RequestBuilder()\n  .setUrl("/api/users")\n  .setMethod("POST")\n  .setHeader("Content-Type", "application/json")\n  .setBody(JSON.stringify({ name: "Ada" }))\n  .build();\n\nconsole.log(request);',
        explanation: "Each configuration method returns this, so the calls chain onto the same RequestBuilder instance, and build() validates the accumulated Partial<RequestConfig> before returning it as a complete, correctly typed RequestConfig.",
      },
      completionStatus: "not_started",
    },
    {
      title: "The Factory Pattern",
      goal: "Build factory functions and factory classes that construct different implementations of a shared interface, using generics and interfaces instead of any.",
      videoTitle: "TypeScript Factory Pattern Explained",
      videoSearchQuery: "typescript factory pattern interface tutorial",
      videoLearningGoal: "See a factory function choose between different classes implementing a shared interface, and a registry-based factory class register and create instances generically.",
      recommendedChannels: ["Total TypeScript", "Theo - t3.gg"],
      keyTakeaways: [
        "A factory hides which concrete class gets constructed behind a shared interface, so calling code depends only on the interface, not on any specific implementation.",
        "A factory function can use a discriminated string parameter (like a 'kind' argument) to decide which concrete class to instantiate, while still returning the shared interface type.",
        "A registry-based factory class stores constructor functions in a Map, keyed by name, letting new implementations be registered without modifying the factory's own code.",
      ],
      notes:
        "The factory pattern separates 'what interface does this satisfy' from 'which concrete class actually implements it.' Code that asks the factory for a Shape never needs to know, or import, the specific Circle or Square class doing the work.",
      conceptExplanation:
        "interface Shape { area(): number } with class Circle implements Shape { constructor(private radius: number) {} area(): number { return Math.PI * this.radius ** 2; } } and class Square implements Shape { constructor(private side: number) {} area(): number { return this.side ** 2; } } are two implementations of one interface. function createShape(kind: 'circle' | 'square', size: number): Shape { switch (kind) { case 'circle': return new Circle(size); case 'square': return new Square(size); } } is a factory function: its return type is the interface Shape, not Circle or Square, so callers only ever see the shared shape. A more flexible registry-based factory stores creators in a Map<string, () => Shape> so new shapes can be registered at runtime, without editing the factory function itself.",
      whyItMatters: "Factories let calling code depend on a stable interface instead of a growing list of concrete classes, so adding a new implementation never requires touching the code that already uses the factory.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define interface Shape with an area(): number method, and two classes, Circle and Square, each implementing Shape with their own constructor arguments and area calculation. Write a factory function createShape(kind: 'circle' | 'square', size: number): Shape that returns the correct instance based on kind. Call createShape with both kinds, store both results in an array typed as Shape[], and loop over it printing each shape's area, without the loop needing to know which concrete class each one actually is.",
      challenge: "Add a third shape, Triangle, implementing Shape, extend createShape's kind parameter to include 'triangle', and confirm your existing loop over Shape[] still works without any changes to the loop itself.",
      expectedResult: "createShape correctly returns a Circle or Square instance typed as Shape based on the kind argument, and a loop over an array of Shape values correctly computes each one's area purely through the shared interface.",
      tests: [
        "Circle and Square both correctly implement the Shape interface",
        "createShape correctly returns the right concrete instance for each kind, typed as the shared Shape interface",
      ],
      hint: "A switch statement on a union type like 'circle' | 'square' is a natural way to write a factory function; TypeScript can even warn you if you forget a case once you add exhaustiveness checking.",
      lessonAssessment: [
        {
          question: "What does the factory function createShape(kind: 'circle' | 'square', size: number): Shape return?",
          options: [
            "A value typed as any, chosen dynamically",
            "A Circle or Square instance, but typed as the shared Shape interface",
            "The string 'circle' or 'square'",
            "A class, not an instance",
          ],
          correctAnswerIndex: 1,
          explanation: "The factory constructs a specific concrete class internally but exposes it to the caller only as the shared Shape interface type.",
        },
        {
          question: "What is the main benefit of code that depends on the Shape interface rather than directly on Circle or Square?",
          options: [
            "It runs faster",
            "New shapes can be added later without changing any code that already works with the Shape interface",
            "It removes the need to implement area() at all",
            "It prevents more than one shape from ever being created",
          ],
          correctAnswerIndex: 1,
          explanation: "Depending on the interface, rather than concrete classes, means adding new implementations doesn't require modifying existing code that only relies on the shared shape.",
        },
      ],
      commonMistakes: [
        "Typing a factory function's return value as any or as a union of concrete classes instead of the shared interface, which defeats the purpose of hiding implementation details.",
        "Forgetting to add a new kind to a switch-based factory's parameter union when adding a new class, so the new kind can never actually be requested.",
      ],
      deliverables: ["main.ts with a Shape interface, Circle and Square implementations, and a createShape factory function"],
      assessmentCriteria: [
        "Circle and Square correctly implement the Shape interface with accurate area calculations",
        "createShape correctly constructs and returns the right implementation, typed as the shared Shape interface",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "typescript",
        code:
          'interface Shape {\n  area(): number;\n}\n\nclass Circle implements Shape {\n  constructor(private radius: number) {}\n\n  area(): number {\n    return Math.PI * this.radius ** 2;\n  }\n}\n\nclass Square implements Shape {\n  constructor(private side: number) {}\n\n  area(): number {\n    return this.side ** 2;\n  }\n}\n\nfunction createShape(kind: "circle" | "square", size: number): Shape {\n  switch (kind) {\n    case "circle":\n      return new Circle(size);\n    case "square":\n      return new Square(size);\n  }\n}\n\nconst shapes: Shape[] = [createShape("circle", 4), createShape("square", 3)];\n\nfor (const shape of shapes) {\n  console.log(shape.area().toFixed(2));\n}',
        explanation: "createShape hides which concrete class gets constructed behind the shared Shape interface, so the loop over shapes computes each area purely through that interface, with no need to know whether a given shape is a Circle or a Square.",
      },
      completionStatus: "not_started",
    },
    {
      title: "The Strategy Pattern",
      goal: "Build a generic strategy interface with interchangeable implementations, and a context class that delegates to whichever strategy it currently holds.",
      videoTitle: "TypeScript Strategy Pattern Explained",
      videoSearchQuery: "typescript strategy pattern interface generics tutorial",
      videoLearningGoal: "See an interchangeable strategy interface implemented multiple ways, and a context class that swaps strategies at runtime while staying fully typed.",
      recommendedChannels: ["Jack Herrington", "Matt Pocock"],
      keyTakeaways: [
        "A strategy interface, like PricingStrategy, defines one method that every interchangeable algorithm implements the same way, so they can be swapped without changing the code that uses them.",
        "A context class holds a reference to a strategy (typed as the interface, not a concrete class) and delegates work to it, rather than implementing the algorithm itself.",
        "Making the strategy interface generic, like Strategy<TInput, TOutput>, lets the same pattern apply to entirely different kinds of algorithms without duplicating the interface for each one.",
      ],
      notes:
        "The strategy pattern is for when you have several interchangeable ways to do the same kind of work, like calculating a price with different discount rules, and you want to be able to swap which one is active without rewriting the code that uses it.",
      conceptExplanation:
        "interface PricingStrategy { calculate(basePrice: number): number } with class RegularPricing implements PricingStrategy { calculate(basePrice: number): number { return basePrice; } } and class MemberDiscountPricing implements PricingStrategy { calculate(basePrice: number): number { return basePrice * 0.9; } } are two interchangeable algorithms behind one interface. class Checkout { constructor(private strategy: PricingStrategy) {} setStrategy(strategy: PricingStrategy): void { this.strategy = strategy; } total(basePrice: number): number { return this.strategy.calculate(basePrice); } } holds whichever strategy it's given and delegates to it, so calling setStrategy swaps the active algorithm without Checkout needing to change at all. Making this generic, interface Strategy<TInput, TOutput> { execute(input: TInput): TOutput }, generalizes the same shape to any kind of interchangeable algorithm, not just pricing.",
      whyItMatters: "The strategy pattern keeps interchangeable algorithms cleanly separated from the code that uses them, so adding a new strategy, or swapping one at runtime, never requires touching the context class itself.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define interface PricingStrategy with a calculate(basePrice: number): number method, and three classes implementing it: RegularPricing (returns the price unchanged), MemberDiscountPricing (applies a 10% discount), and ClearancePricing (applies a 50% discount). Write class Checkout with a private strategy field set through its constructor, a setStrategy(strategy: PricingStrategy): void method, and a total(basePrice: number): number method delegating to the current strategy. Create one Checkout, compute a total with each of the three strategies in turn (swapping with setStrategy between each), and print all three results for the same base price.",
      challenge: "Write a generic interface Strategy<TInput, TOutput> { execute(input: TInput): TOutput }, then refactor PricingStrategy to extend it as interface PricingStrategy extends Strategy<number, number>, confirming your existing classes still satisfy it without any other changes.",
      expectedResult: "Swapping strategies on the same Checkout instance with setStrategy correctly changes the computed total for the same base price, demonstrating the algorithm was fully swapped out at runtime.",
      tests: [
        "RegularPricing, MemberDiscountPricing, and ClearancePricing all correctly implement the shared PricingStrategy interface",
        "Checkout correctly delegates to whichever strategy is currently set, and setStrategy correctly swaps it",
      ],
      hint: "Checkout should never need an if/else or switch statement checking which strategy it has; it should just call this.strategy.calculate(...) and let the interface handle the rest.",
      lessonAssessment: [
        {
          question: "Why does Checkout store its strategy typed as PricingStrategy rather than as a specific class like RegularPricing?",
          options: [
            "It's arbitrary and has no real effect",
            "So Checkout can work with any implementation of the interface, and setStrategy can swap in a completely different one",
            "PricingStrategy is required syntax for all class fields",
            "To prevent Checkout from ever changing its strategy",
          ],
          correctAnswerIndex: 1,
          explanation: "Typing the field as the interface, not a concrete class, is exactly what allows any conforming strategy, including ones swapped in later, to work with Checkout.",
        },
        {
          question: "What does making the strategy interface generic, as in Strategy<TInput, TOutput>, add over a fixed interface like PricingStrategy?",
          options: [
            "Nothing; it behaves identically",
            "It lets the same interchangeable-algorithm shape apply to any input and output types, not just numbers",
            "It removes the need to implement the interface's method",
            "It forces every strategy to return a number",
          ],
          correctAnswerIndex: 1,
          explanation: "A generic Strategy<TInput, TOutput> generalizes the same pattern to any kind of algorithm, with PricingStrategy becoming just one specific instantiation of it.",
        },
      ],
      commonMistakes: [
        "Writing an if/else or switch statement inside the context class to handle each strategy's logic directly, instead of delegating to whichever strategy object it currently holds.",
        "Typing the context class's strategy field as a specific concrete class instead of the shared interface, which prevents swapping in other implementations.",
      ],
      deliverables: ["main.ts with a PricingStrategy interface, at least three implementations, and a Checkout context class that swaps between them"],
      assessmentCriteria: [
        "All pricing strategy classes correctly implement the shared PricingStrategy interface",
        "Checkout correctly delegates to its current strategy, and setStrategy correctly changes the computed result for the same input",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "typescript",
        code:
          'interface PricingStrategy {\n  calculate(basePrice: number): number;\n}\n\nclass RegularPricing implements PricingStrategy {\n  calculate(basePrice: number): number {\n    return basePrice;\n  }\n}\n\nclass MemberDiscountPricing implements PricingStrategy {\n  calculate(basePrice: number): number {\n    return basePrice * 0.9;\n  }\n}\n\nclass ClearancePricing implements PricingStrategy {\n  calculate(basePrice: number): number {\n    return basePrice * 0.5;\n  }\n}\n\nclass Checkout {\n  constructor(private strategy: PricingStrategy) {}\n\n  setStrategy(strategy: PricingStrategy): void {\n    this.strategy = strategy;\n  }\n\n  total(basePrice: number): number {\n    return this.strategy.calculate(basePrice);\n  }\n}\n\nconst checkout = new Checkout(new RegularPricing());\nconsole.log(checkout.total(100));\n\ncheckout.setStrategy(new MemberDiscountPricing());\nconsole.log(checkout.total(100));\n\ncheckout.setStrategy(new ClearancePricing());\nconsole.log(checkout.total(100));',
        explanation: "Checkout never contains any pricing logic itself; it only delegates to whichever PricingStrategy it currently holds, so setStrategy swaps the active algorithm cleanly between calls.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Design Patterns in TypeScript Assessment",
    questions: [
      {
        question: "Why does each configuration method on a builder class typically return this?",
        options: [
          "To make the method run faster",
          "So consecutive method calls can be chained together fluently on the same instance",
          "Because TypeScript requires every method to return this",
          "It has no real effect on the code",
        ],
        correctAnswerIndex: 1,
        explanation: "Returning this from each configuration method is what enables method chaining in a builder.",
      },
      {
        question: "Why is a builder's internal state commonly typed as Partial<T> rather than T while it's being assembled?",
        options: [
          "Partial<T> is required for all private fields",
          "Because not every required field necessarily has a value yet during construction",
          "Partial<T> makes fields readonly",
          "There is no meaningful difference",
        ],
        correctAnswerIndex: 1,
        explanation: "Partial<T> correctly represents the in-progress, possibly incomplete state before build() validates and finalizes it.",
      },
      {
        question: "What should a well-written build() method do before returning the finished object?",
        options: [
          "Nothing; it should just cast the internal state to the target type",
          "Validate that all required fields were actually set, and only then return the completed object",
          "Always return an empty object regardless of what was configured",
          "Delete all optional fields",
        ],
        correctAnswerIndex: 1,
        explanation: "A correct build() checks that required fields are present before returning, rather than blindly trusting the accumulated partial state.",
      },
      {
        question: "In the factory pattern, what type should a factory function like createShape return?",
        options: [
          "any, since the concrete class varies",
          "The shared interface (like Shape), even though it constructs a specific concrete class internally",
          "The name of the concrete class as a string",
          "void, since factories don't return values",
        ],
        correctAnswerIndex: 1,
        explanation: "A factory hides the concrete implementation behind the interface it returns, so callers depend only on the shared interface.",
      },
      {
        question: "What is the main benefit of code depending on the Shape interface instead of directly on Circle or Square?",
        options: [
          "It makes the code run faster",
          "New shape implementations can be added later without modifying code that already depends only on Shape",
          "It removes the need to implement area()",
          "It prevents creating more than one shape",
        ],
        correctAnswerIndex: 1,
        explanation: "Depending on the interface rather than concrete classes decouples calling code from any specific implementation, so new implementations don't require changes elsewhere.",
      },
      {
        question: "What does a registry-based factory (using a Map<string, () => Shape>) allow that a fixed switch-based factory function does not, as easily?",
        options: [
          "Nothing; they behave identically in every way",
          "New creators can be registered at runtime without modifying the factory's own source code",
          "It removes the need for an interface entirely",
          "It only works with exactly two implementations",
        ],
        correctAnswerIndex: 1,
        explanation: "A registry stores creators in a data structure that can be added to dynamically, rather than requiring a new case to be hardcoded into a switch statement.",
      },
      {
        question: "In the strategy pattern, why does Checkout store its strategy typed as the PricingStrategy interface rather than a specific class?",
        options: [
          "It's arbitrary with no real effect",
          "So Checkout can work with any conforming implementation, including ones swapped in later via setStrategy",
          "PricingStrategy is required syntax for constructor parameters",
          "To prevent the strategy from ever being changed",
        ],
        correctAnswerIndex: 1,
        explanation: "Typing the field as the interface is what allows any implementation, present or future, to be used interchangeably with Checkout.",
      },
      {
        question: "What should Checkout's total() method look like internally, in a properly implemented strategy pattern?",
        options: [
          "A switch statement handling each possible strategy's logic directly",
          "A simple delegation to this.strategy.calculate(...), with no knowledge of which concrete strategy it is",
          "A hardcoded calculation duplicated from RegularPricing",
          "An empty method that always returns 0",
        ],
        correctAnswerIndex: 1,
        explanation: "The context class should delegate entirely to the interface method, letting whichever strategy is currently set handle the actual logic.",
      },
      {
        question: "What does making the strategy interface generic, as in Strategy<TInput, TOutput>, provide over a fixed, single-purpose interface?",
        options: [
          "Nothing meaningful",
          "The same interchangeable-algorithm pattern can be reused for any input and output types, not just one specific case like pricing",
          "It removes the need to implement the interface at all",
          "It forces every strategy to operate on strings",
        ],
        correctAnswerIndex: 1,
        explanation: "A generic strategy interface generalizes the pattern so it can be reused across many different kinds of algorithms, with specific interfaces like PricingStrategy becoming one instantiation of it.",
      },
      {
        question: "What do the builder, factory, and strategy patterns in this module have in common, from a type-safety perspective?",
        options: [
          "They all rely on any to stay flexible",
          "They all use interfaces (and sometimes generics) to keep flexible, swappable, or incrementally built code fully type-checked instead of relying on convention alone",
          "They only work correctly in JavaScript, not TypeScript",
          "They eliminate the need for classes entirely",
        ],
        correctAnswerIndex: 1,
        explanation: "Each pattern in this module is implemented using interfaces and generics so that flexibility (chained construction, swappable implementations, interchangeable algorithms) doesn't come at the cost of type safety.",
      },
    ],
  },
  assignment:
    "Build a 'Typed Notification Factory': define interface Notification with a send(message: string): void method, and three implementations, EmailNotification, SmsNotification, and PushNotification, each logging a differently formatted message. Write a factory function createNotification(kind: 'email' | 'sms' | 'push'): Notification that returns the correct implementation typed as the shared Notification interface. Create all three kinds through the factory, store them in a Notification[] array, and loop over the array calling send('Your order shipped') on each, without the loop needing to know which concrete class it's working with.",
  assignmentDeliverables: [
    "main.ts with a Notification interface, three implementations, and a createNotification factory function",
    "Printed output from looping over a Notification[] array and calling send on each",
  ],
  assignmentAssessmentCriteria: [
    "All three notification classes correctly implement the shared Notification interface",
    "createNotification correctly returns the right implementation for each kind, and the loop only depends on the shared interface",
  ],
  miniProject:
    "Build a 'Configurable Report Generator': write a fluent ReportBuilder class (using this-returning methods) with setTitle(title: string): this, addSection(heading: string, content: string): this, and setFooter(footer: string): this, backed by private state, ending in a build(): Report method returning a fully assembled Report object (with title, sections: Array<{ heading: string; content: string }>, and an optional footer). Separately, define interface FormatStrategy { format(report: Report): string } with two implementations, PlainTextFormat and MarkdownFormat, each rendering a Report differently. Write a function renderReport(report: Report, strategy: FormatStrategy): string that delegates formatting to the given strategy. Build one Report using ReportBuilder, then render it with both formatting strategies and print both results to show the same built report rendering two different ways.",
  miniProjectDeliverables: [
    "main.ts with a fluent ReportBuilder class producing a Report object",
    "A FormatStrategy interface with at least two implementations",
    "Printed output showing one built Report rendered through both formatting strategies",
  ],
  miniProjectAssessmentCriteria: [
    "ReportBuilder correctly chains configuration methods and produces a complete, correctly typed Report from build()",
    "renderReport correctly delegates to whichever FormatStrategy it's given, producing genuinely different output per strategy",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
