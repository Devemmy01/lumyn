import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module3: GeneratedModule = {
  title: "Template Literal Types & Type-Level Patterns",
  description:
    "Build string types the same way you'd build a template string: combine literal text with unions and other types to generate precise, self-documenting string types like typed event names.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Template Literal Types",
      goal: "Build new string literal types by combining literal text with other types inside backticks, the type-level equivalent of a template string.",
      videoTitle: "TypeScript Template Literal Types Explained",
      videoSearchQuery: "typescript template literal types tutorial",
      videoLearningGoal: "See a template literal type built from literal text and a type placeholder, then see one built from a union type.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "A template literal type, like `on${string}`, uses backtick syntax at the type level to describe strings that follow a specific pattern.",
        "Embedding a union type inside a template literal type produces a union of every combination, the same way distribution works for conditional types.",
        "Template literal types are checked at compile time: assigning a string that doesn't match the pattern is a type error, even though it's just a string at runtime.",
      ],
      notes:
        "You already know template strings at the value level, like `Hello, ${name}`. Template literal types apply the exact same backtick syntax to types instead of values, letting you describe not just 'any string' but 'a string that follows this specific shape.'",
      conceptExplanation:
        "type Greeting = `Hello, ${string}` describes any string starting with 'Hello, ' followed by any other string; 'Hello, Ada' matches, but 'Hi, Ada' does not. When you embed a union type instead of string, like type Direction = 'up' | 'down'; type Move = `move-${Direction}`, TypeScript expands it into every combination: 'move-up' | 'move-down'. This expansion happens automatically, the same distributive behavior you saw with conditional types over unions.",
      whyItMatters: "Template literal types let you model precise string formats, like CSS class names, event names, or route paths, so a typo or an invalid combination is caught while you're writing the code, not after it ships.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define type Greeting = `Hello, ${string}` and declare a variable of that type assigned a valid greeting string, printing it. Then define type Direction = 'up' | 'down' | 'left' | 'right' and type Move = `move-${Direction}`, declare a variable of type Move set to one valid combination, and print it. Add a comment showing what a variable of type Move would need to look like to be invalid, without actually writing code that fails to compile.",
      challenge: "Define a second union type Speed = 'slow' | 'fast' and a type MoveWithSpeed = `move-${Direction}-${Speed}` combining both unions in one template literal type, then declare a variable using one valid combination.",
      expectedResult: "Greeting and Move both correctly constrain their variables to the described string patterns, and Move correctly represents all four direction combinations as a union of literal strings.",
      tests: [
        "Greeting correctly type-checks a string that starts with 'Hello, '",
        "Move correctly represents the union of all four 'move-direction' combinations generated from the Direction union",
      ],
      hint: "Template literal types use the exact same `${...}` syntax as template strings, just written after type instead of const, and applied to a type rather than a runtime value.",
      lessonAssessment: [
        {
          question: "What does type Greeting = `Hello, ${string}` describe?",
          options: [
            "Only the exact string 'Hello, '",
            "Any string that starts with 'Hello, ' followed by any other string",
            "A runtime function that generates greetings",
            "Any string at all, with no constraint",
          ],
          correctAnswerIndex: 1,
          explanation: "The template literal type matches any string that fits the literal pattern, with ${string} standing in for any string content in that position.",
        },
        {
          question: "Given type Direction = 'up' | 'down'; type Move = `move-${Direction}`, what does Move resolve to?",
          options: [
            "A single string type, 'move-Direction'",
            "The union 'move-up' | 'move-down'",
            "A type error",
            "The type string, with no further constraint",
          ],
          correctAnswerIndex: 1,
          explanation: "Embedding a union inside a template literal type expands it into a union of every combination, the same distributive behavior seen with conditional types.",
        },
      ],
      commonMistakes: [
        "Expecting a template literal type built from a union to produce one merged string type, rather than a union of every individual combination.",
        "Assuming template literal type constraints exist at runtime, when they're purely a compile-time check; an invalid string can still be produced by unchecked code like JSON.parse or an any-typed value.",
      ],
      deliverables: ["main.ts with a Greeting template literal type and a Move template literal type built from a union"],
      assessmentCriteria: [
        "Greeting correctly constrains a variable to strings matching its literal pattern",
        "Move correctly resolves to the union of all combinations generated from the Direction union",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code:
          'type Greeting = `Hello, ${string}`;\n\nconst message: Greeting = "Hello, Ada";\nconsole.log(message);\n// const invalid: Greeting = "Hi, Ada"; // would fail to compile\n\ntype Direction = "up" | "down" | "left" | "right";\ntype Move = `move-${Direction}`;\n\nconst nextMove: Move = "move-up";\nconsole.log(nextMove);\n\ntype Speed = "slow" | "fast";\ntype MoveWithSpeed = `move-${Direction}-${Speed}`;\n\nconst timedMove: MoveWithSpeed = "move-left-fast";\nconsole.log(timedMove);',
        explanation: "Greeting constrains a variable to a specific string pattern, while Move and MoveWithSpeed expand their embedded unions into every valid combination, all checked at compile time.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Combining Template Literals with Unions",
      goal: "Generate a full union of string combinations from multiple unions inside a template literal type, and use the built-in string-manipulation utility types.",
      videoTitle: "TypeScript Template Literal Types with Unions",
      videoSearchQuery: "typescript template literal types union combinations tutorial",
      videoLearningGoal: "See two unions combined inside one template literal type to generate every possible string combination, plus Capitalize and Uppercase applied to a type.",
      recommendedChannels: ["Total TypeScript", "Jack Herrington"],
      keyTakeaways: [
        "A template literal type with two embedded unions generates the full cross product: every combination of one member from each union.",
        "TypeScript ships built-in string-manipulation types: Uppercase<T>, Lowercase<T>, Capitalize<T>, and Uncapitalize<T>, which work at the type level on string literal types.",
        "Combining these utilities with a union, like Capitalize<'click' | 'change'>, distributes the transformation across each member, producing 'Click' | 'Change'.",
      ],
      notes:
        "Template literal types get genuinely powerful once you combine multiple unions in one pattern: TypeScript computes every combination for you, which is exactly how design systems generate exhaustive, typo-proof sets of class names or variant strings.",
      conceptExplanation:
        "type Size = 'sm' | 'md' | 'lg'; type Color = 'red' | 'blue'; type ButtonClass = `btn-${Size}-${Color}` produces all six combinations: 'btn-sm-red' | 'btn-sm-blue' | 'btn-md-red' | 'btn-md-blue' | 'btn-lg-red' | 'btn-lg-blue', computed entirely by the compiler. Alongside this, TypeScript's built-in Capitalize<T>, Uncapitalize<T>, Uppercase<T>, and Lowercase<T> transform string literal types the same way their runtime string method counterparts would, and like other operations on naked type parameters, applying one to a union transforms every member: Capitalize<'click' | 'change'> becomes 'Click' | 'Change'.",
      whyItMatters: "Generating an exhaustive set of valid string combinations at the type level means invalid combinations, like a typo'd class name, become compile errors instead of a bug you only discover by looking at a broken screen.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define type Size = 'sm' | 'md' | 'lg' and type Color = 'red' | 'blue', then define type ButtonClass = `btn-${Size}-${Color}` and declare a variable of type ButtonClass set to one valid combination, printing it. Then define type EventKind = 'click' | 'change' | 'submit' and use Capitalize<EventKind> as a type alias CapitalizedEvent, declaring a variable of that type set to one valid capitalized value.",
      challenge: "Write a type alias EventHandlerName = `on${Capitalize<EventKind>}` combining Capitalize with a template literal, and declare a variable of that type set to one valid handler name, such as 'onClick'.",
      expectedResult: "ButtonClass correctly represents all six size-and-color combinations, and EventHandlerName correctly combines Capitalize with a template literal to produce properly capitalized handler-style names.",
      tests: [
        "ButtonClass correctly generates the full cross product of Size and Color combinations",
        "EventHandlerName correctly combines Capitalize<EventKind> inside a template literal type",
      ],
      hint: "Capitalize, Uppercase, Lowercase, and Uncapitalize are all globally available in TypeScript; you don't need to import them from anywhere.",
      lessonAssessment: [
        {
          question: "Given type ButtonClass = `btn-${Size}-${Color}` where Size has 3 members and Color has 2, how many total string combinations does ButtonClass represent?",
          options: ["2", "3", "5", "6"],
          correctAnswerIndex: 3,
          explanation: "A template literal type with two embedded unions produces the full cross product: 3 sizes times 2 colors equals 6 total combinations.",
        },
        {
          question: "What does Capitalize<'click' | 'change'> resolve to?",
          options: [
            "'Click' | 'Change'",
            "A single string type, 'click' | 'change' capitalized together",
            "A compile error, since Capitalize only works on single strings",
            "'CLICK' | 'CHANGE'",
          ],
          correctAnswerIndex: 0,
          explanation: "Capitalize distributes over a union the same way other type-level string operations do, capitalizing each member individually.",
        },
      ],
      commonMistakes: [
        "Underestimating how quickly combined unions inside a template literal type grow; three unions of five members each already produce 125 combinations, which can make error messages long.",
        "Trying to call Capitalize or Uppercase like a runtime function, instead of using them as type-level utilities applied to a type.",
      ],
      deliverables: ["main.ts with a ButtonClass template literal type combining two unions, and an EventHandlerName type combining Capitalize with a template literal"],
      assessmentCriteria: [
        "ButtonClass correctly generates the full set of combinations from both embedded unions",
        "EventHandlerName correctly combines Capitalize with a template literal type",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code:
          'type Size = "sm" | "md" | "lg";\ntype Color = "red" | "blue";\ntype ButtonClass = `btn-${Size}-${Color}`;\n\nconst primaryButton: ButtonClass = "btn-md-blue";\nconsole.log(primaryButton);\n\ntype EventKind = "click" | "change" | "submit";\ntype CapitalizedEvent = Capitalize<EventKind>;\n\nconst capitalized: CapitalizedEvent = "Click";\nconsole.log(capitalized);\n\ntype EventHandlerName = `on${Capitalize<EventKind>}`;\nconst handlerName: EventHandlerName = "onSubmit";\nconsole.log(handlerName);',
        explanation: "ButtonClass computes all six size-and-color combinations, while EventHandlerName combines the built-in Capitalize utility with a template literal to produce valid handler-style names like 'onClick' and 'onSubmit'.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Practical Example: Typed Event-Name Strings",
      goal: "Combine template literal types with mapped type key remapping to build a fully typed event-handler object from an event map, catching typos and mismatched payloads at compile time.",
      videoTitle: "TypeScript Typed Event Names with Template Literals",
      videoSearchQuery: "typescript template literal types event emitter tutorial",
      videoLearningGoal: "See a typed event map turned into a fully typed set of 'on' handler names and matching handler function signatures, using template literal types and key remapping together.",
      recommendedChannels: ["Matt Pocock", "Theo - t3.gg"],
      keyTakeaways: [
        "A typed event map, like { click: MouseInfo; change: ChangeInfo }, gives each event name a precise payload type that TypeScript can check against.",
        "Combining a mapped type's key remapping (the as clause from the previous module) with a template literal type generates handler property names, like onClick and onChange, directly from the event map's keys.",
        "The resulting handler object's method signatures stay linked to the event map: each handler's parameter type automatically matches its event's payload type, with no manual duplication.",
      ],
      notes:
        "This lesson combines everything from this module and the last one: mapped types, key remapping with as, and template literal types, applied to a genuinely practical problem, building a typed event system where handler names and payload types can never drift out of sync.",
      conceptExplanation:
        "type EventMap = { click: { x: number; y: number }; change: { value: string } } describes each event's payload. type OnHandlers<T> = { [K in keyof T as `on${Capitalize<string & K>}`]: (payload: T[K]) => void } remaps every key K into `on${Capitalize<K>}`, producing onClick and onChange properties, while each one's function type still refers back to T[K], so onClick expects a { x: number; y: number } payload and onChange expects a { value: string } payload. The string & K part is needed because keyof T could theoretically include symbol or number keys, and template literal types only accept string, number, or the other primitive types allowed inside them.",
      whyItMatters: "This exact pattern (an event map driving generated, correctly typed handler names) is how real typed event systems and typed UI event props stay in sync automatically as events are added or changed, instead of relying on developers to update handler types by hand.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define type EventMap = { click: { x: number; y: number }; change: { value: string }; close: void }. Write type OnHandlers<T> = { [K in keyof T as `on${Capitalize<string & K>}`]: (payload: T[K]) => void }, then declare a variable typed as OnHandlers<EventMap> and implement all three handlers (onClick, onChange, onClose), each one printing its received payload. Call each handler directly with a matching sample payload to demonstrate the generated names and payload types are both correct.",
      challenge: "Add a fourth event to EventMap and confirm, just by adding it and re-checking, that OnHandlers<EventMap> automatically requires a new matching handler property without you touching the OnHandlers type definition at all.",
      expectedResult: "The OnHandlers<EventMap> value correctly requires onClick, onChange, and onClose properties, each with a function signature matching its corresponding event's payload type from EventMap.",
      tests: [
        "OnHandlers<T> correctly generates property names using key remapping combined with a template literal type",
        "Each generated handler's parameter type correctly matches its corresponding key's payload type in EventMap",
      ],
      hint: "string & K intersects K with string, which is necessary because keyof T can include symbol keys that aren't valid inside a template literal type.",
      lessonAssessment: [
        {
          question: "In type OnHandlers<T> = { [K in keyof T as `on${Capitalize<string & K>}`]: (payload: T[K]) => void }, what generates the property name onClick from an event map key click?",
          options: [
            "Nothing; onClick must be typed manually",
            "The as clause combined with a template literal type and Capitalize, applied to each key K",
            "TypeScript automatically prefixes every property with on",
            "A runtime string replace called during compilation",
          ],
          correctAnswerIndex: 1,
          explanation: "Key remapping's as clause lets the mapped type compute a new property name per key, here built from a template literal type combining 'on' with the capitalized key.",
        },
        {
          question: "Why does OnHandlers<T> use (payload: T[K]) => void instead of (payload: unknown) => void for each handler?",
          options: [
            "It's arbitrary and could be unknown with no difference",
            "T[K] links each handler's parameter type to that specific event's payload type from the event map, keeping them in sync",
            "TypeScript requires unknown to be replaced with T[K] for template literal types to work",
            "T[K] disables type checking for the parameter entirely",
          ],
          correctAnswerIndex: 1,
          explanation: "Using T[K] means each generated handler's parameter type is tied directly to that event's actual payload type in the event map, so they can never drift apart.",
        },
      ],
      commonMistakes: [
        "Forgetting string & K when remapping keys with a template literal type, which causes an error if keyof T could include a symbol key.",
        "Writing each handler's type by hand for every event instead of generating it from the event map, which reintroduces the exact drift risk this pattern is meant to prevent.",
      ],
      deliverables: ["main.ts with an EventMap type and an OnHandlers<T> type that generates handler property names and payload types from it"],
      assessmentCriteria: [
        "OnHandlers<T> correctly generates 'on'-prefixed, capitalized property names from the event map's keys using key remapping and a template literal type",
        "Each generated handler's parameter type correctly matches its event's payload type from the event map",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "typescript",
        code:
          'type EventMap = {\n  click: { x: number; y: number };\n  change: { value: string };\n  close: void;\n};\n\ntype OnHandlers<T> = {\n  [K in keyof T as `on${Capitalize<string & K>}`]: (payload: T[K]) => void;\n};\n\nconst handlers: OnHandlers<EventMap> = {\n  onClick: (payload) => console.log("clicked at", payload.x, payload.y),\n  onChange: (payload) => console.log("changed to", payload.value),\n  onClose: () => console.log("closed"),\n};\n\nhandlers.onClick({ x: 10, y: 20 });\nhandlers.onChange({ value: "new value" });\nhandlers.onClose(undefined);',
        explanation: "OnHandlers<EventMap> generates onClick, onChange, and onClose property names purely from EventMap's keys, and each handler's parameter type is automatically tied to that event's actual payload type.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Template Literal Types & Type-Level Patterns Assessment",
    questions: [
      {
        question: "What does type Greeting = `Hello, ${string}` describe?",
        options: [
          "Only the exact literal string 'Hello, '",
          "Any string that starts with 'Hello, ' followed by any other string content",
          "A function that returns greetings at runtime",
          "Any value of any type",
        ],
        correctAnswerIndex: 1,
        explanation: "A template literal type describes strings matching a specific literal pattern, with ${string} standing in for arbitrary string content.",
      },
      {
        question: "Given type Move = `move-${Direction}` where Direction = 'up' | 'down', what does Move resolve to?",
        options: [
          "The single string 'move-Direction'",
          "The union 'move-up' | 'move-down'",
          "A compile error",
          "The plain string type with no constraint",
        ],
        correctAnswerIndex: 1,
        explanation: "Embedding a union inside a template literal type expands it into a union of every combination.",
      },
      {
        question: "Given type ButtonClass = `btn-${Size}-${Color}` where Size has 3 members and Color has 2 members, how many total string combinations does ButtonClass represent?",
        options: ["2", "3", "5", "6"],
        correctAnswerIndex: 3,
        explanation: "A template literal type with two embedded unions produces the full cross product of their members: 3 times 2 is 6.",
      },
      {
        question: "What does Capitalize<'click' | 'change'> resolve to?",
        options: ["'Click' | 'Change'", "'CLICK' | 'CHANGE'", "A single merged string type", "A compile error"],
        correctAnswerIndex: 0,
        explanation: "Capitalize distributes across a union, capitalizing each member individually.",
      },
      {
        question: "Which of these is NOT one of TypeScript's built-in string-manipulation utility types?",
        options: ["Uppercase<T>", "Capitalize<T>", "Reverse<T>", "Lowercase<T>"],
        correctAnswerIndex: 2,
        explanation: "TypeScript ships Uppercase, Lowercase, Capitalize, and Uncapitalize; there is no built-in Reverse utility type.",
      },
      {
        question: "In type OnHandlers<T> = { [K in keyof T as `on${Capitalize<string & K>}`]: (payload: T[K]) => void }, what role does the as clause play?",
        options: [
          "It has no effect on the resulting type",
          "It remaps each property's key to a new name computed from a template literal type",
          "It converts the mapped type into an interface",
          "It removes the property from the resulting type",
        ],
        correctAnswerIndex: 1,
        explanation: "Key remapping with as lets a mapped type compute new property names instead of reusing the source type's original keys.",
      },
      {
        question: "Why is string & K used instead of just K inside the template literal type in OnHandlers<T>?",
        options: [
          "It has no real purpose and could be omitted",
          "keyof T can include symbol or number keys, and only string-compatible keys are valid inside a template literal type",
          "It converts K into a number",
          "It's required syntax with no semantic meaning",
        ],
        correctAnswerIndex: 1,
        explanation: "Intersecting K with string filters it down to only the string-compatible keys, which is what a template literal type position requires.",
      },
      {
        question: "In OnHandlers<T>, why does each generated handler use T[K] as its parameter type instead of a fixed type like unknown?",
        options: [
          "It's arbitrary; unknown would behave identically",
          "T[K] links each handler's expected payload to that specific event's actual payload type from the event map",
          "TypeScript requires T[K] syntactically for all mapped types",
          "T[K] disables type checking for the handler entirely",
        ],
        correctAnswerIndex: 1,
        explanation: "Using T[K] keeps each handler's parameter type tied directly to its corresponding event's payload type, so the two can never drift out of sync.",
      },
      {
        question: "What happens to OnHandlers<EventMap> if a new event is added to EventMap, without changing the OnHandlers type definition itself?",
        options: [
          "Nothing; new events are silently ignored",
          "OnHandlers<EventMap> automatically requires a new matching handler property, generated from the new key",
          "It causes an unrelated compile error elsewhere in the file",
          "OnHandlers must be rewritten by hand for every new event",
        ],
        correctAnswerIndex: 1,
        explanation: "Because OnHandlers is generated generically from keyof T, adding a key to the underlying event map automatically produces a new required handler property.",
      },
      {
        question: "Are template literal type constraints enforced at runtime?",
        options: [
          "Yes, TypeScript inserts runtime string pattern checks automatically",
          "No, they are purely a compile-time check; an unchecked value like one from JSON.parse could still violate the pattern at runtime",
          "Only in strict mode",
          "Only when using Capitalize or Uppercase",
        ],
        correctAnswerIndex: 1,
        explanation: "Like all TypeScript types, template literal types disappear after compilation; they catch mismatches while you write code, not while the program runs.",
      },
    ],
  },
  assignment:
    "Build a 'Typed Route Builder': define type Resource = 'users' | 'posts' | 'comments' and type Action = 'list' | 'create'. Write type ApiRoute = `/${Resource}/${Action}` combining both unions into every valid route string. Then define type RouteMap = { users: { id: number }; posts: { id: number; title: string } } and write type RouteHandlers<T> = { [K in keyof T as `handle${Capitalize<string & K>}`]: (params: T[K]) => void } using key remapping and a template literal type. Implement an object typed as RouteHandlers<RouteMap> with both generated handler methods, each printing its received params, and call both handlers with sample data.",
  assignmentDeliverables: [
    "main.ts with an ApiRoute template literal type combining two unions",
    "A RouteMap type and a RouteHandlers<T> type using key remapping with a template literal type",
    "An implemented RouteHandlers<RouteMap> object with both handlers called with sample data",
  ],
  assignmentAssessmentCriteria: [
    "ApiRoute correctly generates every combination of Resource and Action as valid route strings",
    "RouteHandlers<T> correctly generates handler property names and links each handler's parameter type to the matching RouteMap entry",
  ],
  miniProject:
    "Build a 'Typed Mini Event Bus': define type AppEvents = { userLoggedIn: { userId: number }; userLoggedOut: { userId: number }; itemAdded: { itemId: string; quantity: number } }. Write type OnHandlers<T> = { [K in keyof T as `on${Capitalize<string & K>}`]: (payload: T[K]) => void } and a generic class EventBus<T extends Record<string, unknown>> with a private handlers object typed as Partial<OnHandlers<T>>, an on method for registering a handler for a given event name, and an emit method that calls the registered handler (if any) for a given event name with a matching payload. Register handlers for all three AppEvents events, then emit each event with a valid payload and confirm every handler ran with the correct data.",
  miniProjectDeliverables: [
    "main.ts with an AppEvents type, an OnHandlers<T> generated handler type, and a generic EventBus<T> class",
    "Registered handlers for all three events in AppEvents",
    "Printed output confirming each emitted event triggered its correctly typed handler with the right payload",
  ],
  miniProjectAssessmentCriteria: [
    "OnHandlers<T> correctly generates handler names and payload types from the AppEvents map using key remapping and a template literal type",
    "EventBus correctly registers and invokes handlers by event name, with each handler receiving a correctly typed payload",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
