import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module2: GeneratedModule = {
  title: "Advanced Interfaces & Type Aliases",
  description:
    "Go deeper on TypeScript's two main ways to name a shape: know when to reach for type versus interface, combine shapes with intersection types, and describe objects with flexible, unknown keys using index signatures.",
  completionStatus: "locked",
  lessons: [
    {
      title: "type vs interface: When to Use Which",
      goal: "Understand the real differences between type aliases and interfaces, and choose the right one deliberately instead of by habit.",
      videoTitle: "TypeScript type vs interface: What's the Real Difference?",
      videoSearchQuery: "typescript type vs interface difference tutorial",
      videoLearningGoal: "See the same object shape declared with both type and interface, then see the specific situations where only one of the two actually works.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "Both type and interface can describe the shape of an object, and for a plain object shape they are often interchangeable.",
        "interface supports declaration merging (declaring the same interface twice adds to it) and reads naturally when other types extend it; type does not merge, but can describe unions, tuples, and primitives that interface cannot.",
        "A common convention is: prefer interface for object shapes meant to be extended or implemented, and prefer type for unions, tuples, or anything that isn't a plain object shape.",
      ],
      notes:
        "You have used both interface and basic type aliases already. Now it's time to understand precisely where they overlap and where they don't. interface User { name: string } and type User = { name: string } describe the exact same object shape and are used almost identically at the call site.",
      conceptExplanation:
        "Where they diverge: type can alias things an interface never can, such as a union (type Status = \"active\" | \"inactive\"), a tuple (type Point = [number, number]), or a primitive alias (type ID = string | number). interface can be reopened and merged: declaring interface Config { debug: boolean } twice in the same scope combines both declarations into one interface with all the properties from both, which is useful for extending shapes from a library, but can also cause confusing accidental merges in your own code if you're not careful. interface also uses the extends keyword to build on another interface (interface Admin extends User { role: string }), while type achieves a similar result using an intersection with & (type Admin = User & { role: string }), covered in the next lesson.",
      whyItMatters: "Knowing the real differences lets you choose deliberately: interface when you want an extendable, mergeable object contract, and type when you need unions, tuples, or other shapes an interface simply cannot express.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define the same shape twice: once as interface Task { title: string; done: boolean } and once as type Priority = \"low\" | \"medium\" | \"high\" (a union, which only type can express). Create one Task object and one Priority value, printing both. Then declare interface Reminder extends Task { remindAt: string }, create a Reminder object, and print it, showing that Reminder correctly has all of Task's properties plus its own.",
      challenge: "Add a second interface declaration for Task in the same file with one additional optional property, tags?: string[], and create a new Task object that includes tags, showing that TypeScript merged both Task declarations into one combined interface.",
      expectedResult: "The program prints the Task object, the Priority string value, and the Reminder object with all four of its properties correctly present and typed.",
      tests: ["Priority is declared as a union using type, not interface, since interface cannot express a union", "Reminder correctly extends Task using the extends keyword and includes both inherited and new properties"],
      hint: "A union like \"low\" | \"medium\" | \"high\" can only be written with type; interface has no equivalent syntax for a union of literal values.",
      lessonAssessment: [
        {
          question: "Which of the following can type express that interface cannot?",
          options: [
            "A plain object shape with string properties",
            "A union of literal string values, like \"low\" | \"medium\" | \"high\"",
            "A property that is a function",
            "An optional property",
          ],
          correctAnswerIndex: 1,
          explanation: "interface can only describe object-like shapes; a union of literal values, a tuple, or a primitive alias must be written with type.",
        },
        {
          question: "What happens if you declare interface Config { debug: boolean } twice in the same scope?",
          options: [
            "TypeScript throws a compile error for a duplicate declaration",
            "The second declaration silently overwrites the first",
            "TypeScript merges both declarations into a single interface containing every property from both",
            "Only the first declaration is used, and the second is ignored",
          ],
          correctAnswerIndex: 2,
          explanation: "interface supports declaration merging: multiple declarations with the same name in the same scope are combined into one interface with all their members.",
        },
      ],
      commonMistakes: ["Trying to write a union of literal values using interface, such as interface Status = \"active\" | \"inactive\", which is not valid syntax for interface.", "Declaring the same interface name twice by accident and being confused when TypeScript merges them instead of reporting a duplicate."],
      deliverables: ["A script with an interface, a type union, an interface using extends, and a note on when each was chosen"],
      assessmentCriteria: ["Priority is correctly written as a type union, not an interface", "Reminder correctly extends Task and includes all expected properties"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code: 'interface Task {\n  title: string;\n  done: boolean;\n}\n\ntype Priority = "low" | "medium" | "high";\n\ninterface Reminder extends Task {\n  remindAt: string;\n}\n\nconst task: Task = { title: "Write report", done: false };\nconst priority: Priority = "high";\nconst reminder: Reminder = {\n  title: "Call client",\n  done: false,\n  remindAt: "2026-09-22T09:00:00",\n};\n\nconsole.log(task, priority, reminder);',
        explanation: "Priority uses type because a literal union has no interface equivalent, while Reminder uses interface extends to build directly on Task's shape.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Intersection Types: Combining Shapes with &",
      goal: "Combine two or more type shapes into one using the & intersection operator.",
      videoTitle: "TypeScript Intersection Types Explained",
      videoSearchQuery: "typescript intersection types ampersand tutorial",
      videoLearningGoal: "See two separate type shapes combined into a single type using &, and an object that satisfies both requirements at once.",
      recommendedChannels: ["Total TypeScript", "Web Dev Simplified"],
      keyTakeaways: [
        "The & operator combines two or more types into a single type that must satisfy every combined type at once.",
        "Intersecting two object shapes, like A & B, produces a type with all the properties of A and all the properties of B.",
        "Intersection types are commonly used to add extra fields onto an existing shape without editing the original type.",
      ],
      notes:
        "A union with | means 'one of these types.' An intersection with & means the opposite: 'all of these types at once.' type WithId = { id: number } & { createdAt: string } produces a type that requires both an id and a createdAt property in the same object.",
      conceptExplanation:
        "type Timestamped = { createdAt: string; updatedAt: string }; type User = { name: string; email: string }; type TimestampedUser = User & Timestamped; requires an object to have every property from both User and Timestamped: name, email, createdAt, and updatedAt, all at once. This pattern is extremely common for layering extra fields onto a base shape without modifying the original type, for example combining a base entity shape with an audit-fields shape. Intersections aren't limited to two types either: type A & B & C requires satisfying all three. If the same property name appears in both intersected types with incompatible primitive types, like { id: string } & { id: number }, the resulting property type becomes the impossible type never, since nothing can be both a string and a number at once, a useful signal that the intersection was probably a mistake.",
      whyItMatters: "Intersection types let you build precise, composed shapes out of smaller, reusable pieces instead of duplicating fields across multiple large, similar interfaces.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define type Timestamped = { createdAt: string; updatedAt: string } and type Person = { name: string; email: string }. Create a combined type Employee = Person & Timestamped & { employeeId: number }. Create one Employee object with all five required properties, and print it. Then write a function describeEmployee(employee: Employee): string that returns a sentence combining the name and employeeId, and call it with your object, printing the result.",
      challenge: "Create a second intersection type, Manager = Employee & { directReports: string[] }, create one Manager object with all six properties, and print how many direct reports they have using directReports.length.",
      expectedResult: "The program prints the full Employee object with all five properties present, then the sentence from describeEmployee, without any type errors about missing properties.",
      tests: ["Employee is declared as an intersection using &, combining at least two named types plus an inline object type", "The Employee object literal includes every property required by all sides of the intersection"],
      hint: "Every property required by any part of an intersection must be present on the object; missing even one property from any side causes a type error.",
      lessonAssessment: [
        {
          question: "What does type TimestampedUser = User & Timestamped require of an object of that type?",
          options: [
            "It must have only the properties from User",
            "It must have only the properties from Timestamped",
            "It must have every property from both User and Timestamped at the same time",
            "It must have neither shape's properties",
          ],
          correctAnswerIndex: 2,
          explanation: "The & operator produces an intersection: a type requiring all properties from every combined type simultaneously, not just one or the other.",
        },
        {
          question: "What happens to a property's type if two intersected types define it with incompatible primitive types, such as { id: string } & { id: number }?",
          options: [
            "TypeScript picks string automatically",
            "TypeScript picks number automatically",
            "The resulting property type becomes never, since no value can satisfy both at once",
            "TypeScript ignores the conflicting property entirely",
          ],
          correctAnswerIndex: 2,
          explanation: "When intersected types disagree on a primitive property type, the resulting type is never, because no single value can simultaneously be both a string and a number.",
        },
      ],
      commonMistakes: ["Confusing & (intersection, requires all shapes at once) with | (union, requires only one), leading to objects that are missing required properties.", "Creating an object literal for an intersection type but forgetting to include a property required by one of the combined shapes."],
      deliverables: ["A script defining an intersection type combining at least three sources and a function using it"],
      assessmentCriteria: ["The intersection type is correctly formed with &, combining more than one source shape", "The object literal satisfies every property required by the full intersection"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code: 'type Timestamped = { createdAt: string; updatedAt: string };\ntype Person = { name: string; email: string };\ntype Employee = Person & Timestamped & { employeeId: number };\n\nconst employee: Employee = {\n  name: "Ada Lovelace",\n  email: "ada@example.test",\n  createdAt: "2026-01-01",\n  updatedAt: "2026-01-05",\n  employeeId: 1001,\n};\n\nfunction describeEmployee(person: Employee): string {\n  return `${person.name} is employee #${person.employeeId}`;\n}\n\nconsole.log(employee);\nconsole.log(describeEmployee(employee));',
        explanation: "Employee intersects three shapes together, so the object literal must satisfy all five combined properties before TypeScript accepts it as a valid Employee.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Index Signatures: Typing Objects with Flexible Keys",
      goal: "Describe an object whose exact property names aren't known ahead of time, using an index signature.",
      videoTitle: "TypeScript Index Signatures Explained",
      videoSearchQuery: "typescript index signatures tutorial dynamic keys",
      videoLearningGoal: "See an index signature used to type an object whose keys are only known at runtime, like a lookup table or a tally of counts.",
      recommendedChannels: ["Jack Herrington", "Matt Pocock"],
      keyTakeaways: [
        "An index signature, written [key: string]: ValueType, describes an object whose property names aren't fixed but whose value type always follows the same pattern.",
        "Every property on an object with an index signature, whether declared explicitly or added dynamically, must match the declared value type.",
        "Index signatures are the right tool for lookup tables, tallies, and dictionaries; a fixed, known set of properties should still use a regular interface.",
      ],
      notes:
        "A normal interface lists exact, known property names: interface User { name: string; age: number }. Sometimes you don't know the property names ahead of time, only the pattern: a dictionary of scores by player name, or a tally of votes by candidate. That's what an index signature is for.",
      conceptExplanation:
        "interface ScoreBoard { [playerName: string]: number } means: any string key is allowed, and its value must be a number. const scores: ScoreBoard = { alice: 10, bob: 7 } is valid, and so is scores.carol = 15 added later, since carol also maps to a number. If you also want to require a couple of specific properties alongside the flexible ones, you can combine both: interface Inventory { [itemName: string]: number; totalItems: number } requires totalItems to specifically be a number, while every other key must also be a number, since the index signature's value type has to be compatible with every named property's type too. Index signatures work with number keys as well, [index: number]: ValueType, which is how arrays themselves are typed internally.",
      whyItMatters: "Index signatures let you type dictionaries, tallies, and lookup tables accurately, so accessing or adding entries by a dynamic key still gets full type checking instead of falling back to any.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define an interface WordCount with an index signature [word: string]: number. Create a WordCount object with at least three word-count pairs, then add one more pair to it after creation using bracket or dot notation. Write a function totalCount(counts: WordCount): number that sums every value in the object using Object.values() and reduce(), and call it on your object, printing the total.",
      challenge: "Define a second interface, PlayerScores, with an index signature [player: string]: number plus one required named property, topScore: number. Create a PlayerScores object satisfying both parts, and print the player with the highest individual score using Object.entries().",
      expectedResult: "The program prints the total from totalCount, correctly summing every value including the entry you added after the object's initial creation.",
      tests: ["WordCount is declared with a [word: string]: number index signature, not a fixed set of named properties", "totalCount correctly sums every value in the object, including one added after the object literal"],
      hint: "Object.values(counts) returns an array of every value in the object regardless of its key name, which is exactly what an index signature makes safe to do.",
      lessonAssessment: [
        {
          question: "What does interface ScoreBoard { [playerName: string]: number } describe?",
          options: [
            "An object with exactly one property named playerName",
            "An object where any string key is allowed, and every value for any such key must be a number",
            "An array of numbers",
            "A function that returns a number",
          ],
          correctAnswerIndex: 1,
          explanation: "An index signature allows any key matching the declared key type (here, string), as long as every value matches the declared value type (here, number).",
        },
        {
          question: "In interface Inventory { [itemName: string]: number; totalItems: number }, what is required of the totalItems property?",
          options: [
            "It can be any type, since the index signature overrides it",
            "It must specifically be a number, matching both its own declared type and the index signature's value type",
            "It is optional and can be omitted",
            "It must be a string",
          ],
          correctAnswerIndex: 1,
          explanation: "A named property alongside an index signature must still satisfy its own declared type, which also needs to be compatible with the index signature's value type.",
        },
      ],
      commonMistakes: ["Using a regular interface with only a couple of fixed, guessed property names to model data whose keys are actually dynamic and unknown ahead of time.", "Adding a named property with a type that conflicts with the index signature's value type, which TypeScript correctly rejects as incompatible."],
      deliverables: ["A script defining an index-signature interface and a function that safely processes every value in it"],
      assessmentCriteria: ["The index signature is correctly declared and used for genuinely dynamic keys", "The processing function correctly handles every entry, including ones added after the object literal"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code: 'interface WordCount {\n  [word: string]: number;\n}\n\nconst counts: WordCount = {\n  the: 5,\n  cat: 2,\n  sat: 1,\n};\ncounts.mat = 1;\n\nfunction totalCount(wordCount: WordCount): number {\n  return Object.values(wordCount).reduce((sum, value) => sum + value, 0);\n}\n\nconsole.log(counts);\nconsole.log(totalCount(counts));',
        explanation: "WordCount's index signature allows any string key with a number value, so both the original three entries and the dynamically added mat entry are fully type-checked and included in the total.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Advanced Interfaces & Type Aliases Assessment",
    questions: [
      { question: "Which of these can only be written with type, not interface?", options: ["A plain object shape", "A union of literal string values, like \"low\" | \"high\"", "A property with a string type", "An interface with two properties"], correctAnswerIndex: 1, explanation: "interface can only describe object-like shapes; unions of literal values require type." },
      { question: "What happens when the same interface name is declared more than once in the same scope?", options: ["TypeScript reports a duplicate declaration error", "TypeScript merges the declarations into a single interface with all their members", "Only the last declaration is kept", "Only the first declaration is kept"], correctAnswerIndex: 1, explanation: "interface supports declaration merging: multiple declarations combine into one interface containing every member from all of them." },
      { question: "What does interface Admin extends User { role: string } produce?", options: ["A type unrelated to User", "A shape requiring everything User requires, plus a role property", "A shape that removes all of User's properties", "A type error, since extends is not valid on interface"], correctAnswerIndex: 1, explanation: "extends on an interface builds directly on another interface's shape, adding new required members on top of the inherited ones." },
      { question: "What does the & operator do when combining two types?", options: ["Selects only properties common to both", "Requires an object to satisfy every combined type simultaneously", "Requires an object to satisfy only one of the combined types", "Removes duplicate properties automatically"], correctAnswerIndex: 1, explanation: "& creates an intersection type: a value of that type must satisfy all of the combined types at once, not just one." },
      { question: "What is the resulting type of a property when two intersected types declare it with incompatible primitive types, like { id: string } & { id: number }?", options: ["string", "number", "never, since no value can be both at once", "any"], correctAnswerIndex: 2, explanation: "An incompatible intersection on a primitive property resolves to never, signaling that no valid value could ever satisfy both requirements." },
      { question: "How does & (intersection) differ from | (union)?", options: [
          "They behave identically",
          "& requires satisfying all combined types at once; | requires satisfying only one of them",
          "& requires satisfying only one type; | requires satisfying all of them",
          "Neither can be used with object types",
        ], correctAnswerIndex: 1, explanation: "Intersection (&) combines requirements from every type; union (|) allows a value to match any single one of the listed types." },
      { question: "What does interface ScoreBoard { [playerName: string]: number } describe?", options: ["An object with one fixed property called playerName", "An object where any string key is allowed and every value must be a number", "A tuple of scores", "A function returning a player's name"], correctAnswerIndex: 1, explanation: "An index signature allows arbitrary keys matching the key type, as long as every value matches the declared value type." },
      { question: "In interface Inventory { [itemName: string]: number; totalItems: number }, what must totalItems's declared type be compatible with?", options: [
          "Nothing, named properties ignore index signatures",
          "The index signature's value type",
          "It must always be a string",
          "It has no type requirement at all",
        ], correctAnswerIndex: 1, explanation: "A named property alongside an index signature must have a type compatible with that index signature's declared value type." },
      { question: "When should you prefer a regular interface with fixed property names over an index signature?", options: [
          "Never, index signatures are always better",
          "When the exact set of property names is known and fixed ahead of time, rather than dynamic",
          "Only when working with arrays",
          "Only when every value is a string",
        ], correctAnswerIndex: 1, explanation: "Index signatures fit genuinely dynamic keys, like dictionaries or tallies; a known, fixed set of properties is better modeled with a regular interface." },
      { question: "Which combination correctly describes when to reach for interface versus type as a general convention?", options: [
          "Always use type and never interface",
          "Prefer interface for extendable object shapes, and type for unions, tuples, or other non-object shapes",
          "Always use interface and never type",
          "They must always be used together on the same declaration",
        ], correctAnswerIndex: 1, explanation: "A common, practical convention is reaching for interface when a shape is meant to be extended or merged, and type when the shape is a union, tuple, or otherwise not a plain object." },
    ],
  },
  assignment:
    "Build a 'Shape Toolkit' file: define type Circle = { kind: \"circle\"; radius: number } and type Square = { kind: \"square\"; side: number } as two separate object types. Define interface Timestamped { createdAt: string } and use an intersection to create type LoggedCircle = Circle & Timestamped. Define a third type, interface Tally { [label: string]: number }, representing a count of how many shapes of each kind have been created. Create one LoggedCircle object, one plain Square object, and one Tally object tracking at least two different kind counts, printing all three.",
  assignmentDeliverables: [
    "A script defining Circle, Square, Timestamped, LoggedCircle (an intersection), and Tally (an index signature)",
    "Printed output for one LoggedCircle object, one Square object, and one populated Tally object",
  ],
  assignmentAssessmentCriteria: [
    "LoggedCircle is correctly formed as an intersection combining Circle and Timestamped",
    "Tally correctly uses an index signature rather than a fixed set of named properties",
  ],
  miniProject:
    "Build a small 'Product Catalog with Flexible Attributes' script: define interface Product { id: number; name: string; price: number } for the fixed, known fields every product has. Define interface ProductAttributes { [attributeName: string]: string } for attributes that vary per product, like color or material. Create type CatalogEntry = Product & ProductAttributes, combining both. Create at least three CatalogEntry objects, each with different attribute keys, then write a function formatEntry(entry: CatalogEntry): string that returns a readable one-line summary including the name, price, and every attribute using Object.entries(), filtering out the fixed Product keys. Print the formatted summary for every entry.",
  miniProjectDeliverables: [
    "A script defining Product, ProductAttributes, CatalogEntry (an intersection), and formatEntry()",
    "Printed formatted summaries for at least three CatalogEntry objects with different attribute keys",
  ],
  miniProjectAssessmentCriteria: [
    "CatalogEntry correctly intersects a fixed-shape interface with a flexible index-signature interface",
    "formatEntry correctly reads and displays each entry's dynamic attributes alongside its fixed fields",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
