import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";
const SIMULATED_FILES_NOTE =
  "The Academy workspace runs a single main.ts file, so this lesson simulates a multi-file project using clearly labeled comment sections that show exactly what each real file would contain, followed by working code that proves the same logic runs correctly.";

export const module4: GeneratedModule = {
  title: "Modules & Organizing a Typed Project",
  description:
    "Learn how real TypeScript projects are split across files: export and import values and types correctly, use import type for type-only imports, organize shared types into their own file, and group related exports with the barrel file pattern.",
  completionStatus: "locked",
  lessons: [
    {
      title: "export, import, and import type",
      goal: "Understand how export and import connect code across files, and when to use import type for a type-only import.",
      videoTitle: "TypeScript Modules: export, import, and import type Explained",
      videoSearchQuery: "typescript export import import type tutorial",
      videoLearningGoal: "See a type and a value exported from one file and imported into another, and see import type used for an import that only exists for type checking.",
      recommendedChannels: ["Matt Pocock", "Jack Herrington"],
      keyTakeaways: [
        "export makes a function, variable, interface, or type available to other files; import brings an exported name into the current file.",
        "import type { Name } from \"./file\" imports something that is only used as a type, and that import is fully erased from the compiled JavaScript output.",
        "A single file can freely mix regular exports (functions, values) and type exports (interfaces, type aliases) in the same export and import statements.",
      ],
      notes:
        SIMULATED_FILES_NOTE + " A real multi-file project splits related code into separate files, and export/import is the mechanism that connects them: a file declares export in front of something to make it available elsewhere, and another file writes import { thatThing } from \"./relative-path\" to use it.",
      conceptExplanation:
        "In a file named user.ts, export interface User { id: number; name: string } and export function greet(user: User): string { return `Hi, ${user.name}`; } both become available to other files. In main.ts, import { User, greet } from \"./user\"; brings both in. Because User is only ever used as a type (never as a runtime value), it is clearer, and slightly faster to compile, to write import type { User } from \"./user\"; import { greet } from \"./user\";, or combine both into one line: import { type User, greet } from \"./user\";. The reason import type matters: TypeScript interfaces and type aliases do not exist in compiled JavaScript at all, they are erased entirely, so an import type is guaranteed to disappear from the final output, while a regular import of a value like greet must remain, since greet is real, callable code at runtime.",
      whyItMatters: "Getting export and import right, and knowing when to reach for import type, is what makes a TypeScript project's file boundaries clean: values that exist at runtime are imported as values, and types that exist only during compilation are imported as types.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. At the top of the file, write a comment block labeled // ==== FILE: user.ts ==== containing, as comments, an exported interface User with id: number and name: string, and an exported function greet(user: User): string exactly as they would appear in a real file. Below that, write a comment block labeled // ==== FILE: main.ts ==== containing, as a comment, the import line you would write to bring in User as a type-only import and greet as a regular import from \"./user\". Beneath both comment blocks, write the actual runnable code: declare the same User interface and greet function directly (not commented out) in this file, create one User object, call greet() with it, and print the result.",
      challenge: "Add a second exported item to your simulated user.ts comment block, an interface Address with street: string and city: string, and update your simulated main.ts import comment to also bring in Address as a type-only import, then declare Address for real below and create one Address object showing it fits the same simulated import line.",
      expectedResult: "The program prints the greeting string produced by greet(), and the comment blocks clearly and correctly show what a real, split-file version of this same code would look like.",
      tests: ["The comment block simulating main.ts shows User imported with import type (or a type-only style using the type keyword) while greet is imported as a regular value", "The real, runnable code below the comments successfully creates a User object and calls greet() with it"],
      hint: "A type or interface never needs to exist at runtime, which is exactly why it can be imported with import type and safely erased from the compiled output.",
      lessonAssessment: [
        {
          question: "What is the key difference between import { User } from \"./user\" and import type { User } from \"./user\", when User is an interface?",
          options: [
            "There is no difference at all",
            "import type makes it explicit that the import is type-only and guarantees it is erased from the compiled JavaScript",
            "import type is slower at runtime",
            "import type can only be used with functions, never interfaces",
          ],
          correctAnswerIndex: 1,
          explanation: "import type marks an import as type-only, which both documents the intent clearly and guarantees the import is fully removed from the compiled JavaScript output.",
        },
        {
          question: "Why can't an interface like User be imported the same way a runtime function like greet is compiled?",
          options: [
            "Interfaces and functions compile identically",
            "Interfaces exist only during type checking and are erased entirely from compiled JavaScript, while a function like greet is real code that must remain at runtime",
            "Functions are erased from compiled JavaScript, but interfaces are not",
            "Neither interfaces nor functions exist in compiled JavaScript",
          ],
          correctAnswerIndex: 1,
          explanation: "TypeScript interfaces exist purely for compile-time type checking and disappear completely once compiled, while a function's actual implementation must remain in the output to run at all.",
        },
      ],
      commonMistakes: ["Importing an interface or type alias as a regular value import with no distinction, which still works but loses the clarity and compile-time guarantees that import type provides.", "Assuming export alone is enough to make something usable elsewhere without ever writing the corresponding import statement in the consuming file."],
      deliverables: ["A script with labeled comment blocks simulating a user.ts file and a type-only import in main.ts, plus real, runnable equivalent code"],
      assessmentCriteria: ["The simulated import comment correctly distinguishes a type-only import (User) from a value import (greet)", "The real code below the comments runs correctly and produces the expected greeting output"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code: '// ==== FILE: user.ts ====\n// export interface User {\n//   id: number;\n//   name: string;\n// }\n//\n// export function greet(user: User): string {\n//   return `Hi, ${user.name}`;\n// }\n\n// ==== FILE: main.ts ====\n// import { type User, greet } from "./user";\n\n// Runnable equivalent, kept in this single file:\ninterface User {\n  id: number;\n  name: string;\n}\n\nfunction greet(user: User): string {\n  return `Hi, ${user.name}`;\n}\n\nconst user: User = { id: 1, name: "Ada" };\nconsole.log(greet(user));',
        explanation: "The comment blocks document exactly how this code would be split across user.ts and main.ts in a real project, including the type-only import syntax, while the code beneath them actually runs in this single-file workspace.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Organizing Shared Types Across Files",
      goal: "Design a dedicated types file that multiple other files import from, keeping a project's shapes defined in exactly one place.",
      videoTitle: "TypeScript Project Structure: Organizing Shared Types",
      videoSearchQuery: "typescript project structure organizing types across files",
      videoLearningGoal: "See how a real project centralizes its shared interfaces and type aliases into one types file that several other files import from.",
      recommendedChannels: ["Jack Herrington", "Web Dev Simplified"],
      keyTakeaways: [
        "A shared types file (often named types.ts) holds interfaces and type aliases used by more than one other file, so they are defined in exactly one place.",
        "Files that need a shared shape import it with import type from the types file, instead of each file redeclaring a slightly different version of the same shape.",
        "Centralizing shared types means a change to one shape (like adding a required field) is caught everywhere that shape is used, instead of silently drifting apart.",
      ],
      notes:
        SIMULATED_FILES_NOTE + " As a project grows past one file, the same shapes, like User or Order, tend to be needed in more than one place: one file that creates data, another that displays it, another that validates it. Redeclaring a slightly different version of User in each file is how projects end up with subtle, hard-to-find bugs.",
      conceptExplanation:
        "A common structure is a dedicated types.ts file: export interface Product { id: number; name: string; price: number } and export type OrderStatus = \"pending\" | \"shipped\" | \"delivered\"; live there, and nowhere else. A file named cart.ts then writes import type { Product } from \"./types\"; and uses Product to type its own functions, while a file named orders.ts writes import type { Product, OrderStatus } from \"./types\"; to use both shapes for its own purposes. Neither cart.ts nor orders.ts ever redefines Product itself, they only consume the one definition from types.ts. If Product later gains a new required field, every file importing it will show a type error anywhere that field is missing, which is exactly the safety net a single shared source of truth is meant to provide.",
      whyItMatters: "Centralizing shared types into one file prevents the same real-world concept, like a Product or an Order, from silently drifting into several slightly different, inconsistent shapes across a growing project.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Write a comment block labeled // ==== FILE: types.ts ==== containing, as comments, an exported interface Product with id: number, name: string, and price: number, and an exported type OrderStatus as a union of \"pending\", \"shipped\", and \"delivered\". Write a second comment block labeled // ==== FILE: cart.ts ==== containing, as a comment, the import type line cart.ts would use to bring in Product from \"./types\", followed by a comment showing a function signature addToCart(product: Product): void. Write a third comment block labeled // ==== FILE: orders.ts ==== showing the import type line it would use to bring in both Product and OrderStatus. Beneath all three comment blocks, write the real, runnable code: declare Product and OrderStatus directly, create two Product objects and one OrderStatus value, and print all three.",
      challenge: "Add a fourth simulated file, // ==== FILE: inventory.ts ====, showing how it would import only Product (not OrderStatus) from types.ts, then write a real, runnable function countTotalValue(products: Product[]): number below that sums every product's price, and call it with your two Product objects, printing the total.",
      expectedResult: "The program prints both Product objects, the OrderStatus value, and the total value from countTotalValue, with the comment blocks correctly showing which simulated file imports which shared types.",
      tests: ["The simulated types.ts comment block defines Product and OrderStatus as the single shared source of both shapes", "At least two simulated consumer files (such as cart.ts and orders.ts) are shown importing from types.ts with import type, using only the specific shapes each one needs"],
      hint: "A consumer file should only import the specific types it actually uses; orders.ts needing both Product and OrderStatus does not mean cart.ts needs OrderStatus too.",
      lessonAssessment: [
        {
          question: "Why is it useful to define a shape like Product in exactly one shared types file instead of redeclaring it separately in every file that uses it?",
          options: [
            "It makes the program run faster",
            "A single shared definition means a change to that shape is caught everywhere it's used, instead of silently drifting into inconsistent versions",
            "TypeScript requires every type to be declared in a file named types.ts",
            "Redeclaring a type in multiple files is not allowed by the compiler",
          ],
          correctAnswerIndex: 1,
          explanation: "Centralizing a shared shape in one file means every consumer stays in sync automatically, since they all import the same single definition rather than maintaining their own copies.",
        },
        {
          question: "If orders.ts needs both Product and OrderStatus from types.ts, but cart.ts only needs Product, what should cart.ts's import line look like?",
          options: [
            "cart.ts must still import both Product and OrderStatus even though it only uses one",
            "cart.ts should import only Product, since a file should only import the specific types it actually uses",
            "cart.ts cannot import from types.ts at all if orders.ts already does",
            "cart.ts must redeclare Product itself instead of importing it",
          ],
          correctAnswerIndex: 1,
          explanation: "Each consumer file should import only the specific shared types it actually needs, keeping its own imports minimal and clear about what it depends on.",
        },
      ],
      commonMistakes: ["Letting each file that needs a shape like Product declare its own slightly different local copy, instead of importing one shared definition from a dedicated types file.", "Importing every type from the shared types file into every consumer file out of habit, instead of importing only the specific types each individual file actually needs."],
      deliverables: ["A script with a simulated types.ts file and at least two simulated consumer files importing from it, plus real, runnable equivalent code"],
      assessmentCriteria: ["The simulated types.ts block is the single source for both Product and OrderStatus", "Each simulated consumer file imports only the specific shared types it actually needs"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code: '// ==== FILE: types.ts ====\n// export interface Product {\n//   id: number;\n//   name: string;\n//   price: number;\n// }\n//\n// export type OrderStatus = "pending" | "shipped" | "delivered";\n\n// ==== FILE: cart.ts ====\n// import type { Product } from "./types";\n// function addToCart(product: Product): void { /* ... */ }\n\n// ==== FILE: orders.ts ====\n// import type { Product, OrderStatus } from "./types";\n\n// Runnable equivalent, kept in this single file:\ninterface Product {\n  id: number;\n  name: string;\n  price: number;\n}\ntype OrderStatus = "pending" | "shipped" | "delivered";\n\nconst mug: Product = { id: 1, name: "Mug", price: 12 };\nconst notebook: Product = { id: 2, name: "Notebook", price: 6 };\nconst status: OrderStatus = "shipped";\n\nconsole.log(mug, notebook, status);',
        explanation: "types.ts is the single shared source for Product and OrderStatus, while cart.ts and orders.ts each import only the specific shapes they need, exactly as the runnable code below demonstrates locally.",
      },
      completionStatus: "not_started",
    },
    {
      title: "The Barrel File Pattern",
      goal: "Understand how a barrel file (an index.ts that re-exports from several files) simplifies imports elsewhere in a project.",
      videoTitle: "TypeScript Barrel Files Explained: index.ts Re-exports",
      videoSearchQuery: "typescript barrel file index.ts re-export pattern tutorial",
      videoLearningGoal: "See several separate files' exports gathered together through one index.ts barrel file, simplifying how other files import from that group.",
      recommendedChannels: ["Total TypeScript", "Jack Herrington"],
      keyTakeaways: [
        "A barrel file, conventionally named index.ts, re-exports items from several other files so consumers can import them all from one combined location.",
        "export * from \"./file\" re-exports every export from that file; export { Name } from \"./file\" re-exports just one specific name.",
        "Barrel files shorten and simplify import lines elsewhere in a project, but grouping too much into one very large barrel file can make it harder to see where something actually came from.",
      ],
      notes:
        SIMULATED_FILES_NOTE + " Once a project has several small, related files, like product.ts, order.ts, and user.ts all inside a models folder, importing from each individually everywhere else in the project gets repetitive. A barrel file collects and re-exports all of them from one place.",
      conceptExplanation:
        "Given models/product.ts exporting Product, models/order.ts exporting Order and OrderStatus, and models/user.ts exporting User, a barrel file at models/index.ts can write export * from \"./product\"; export * from \"./order\"; export * from \"./user\";, re-exporting everything from all three files. A consumer elsewhere in the project can then write import type { Product, Order, User } from \"./models\"; a single import line pulling from the folder's barrel file, instead of three separate import lines each pointing at a different individual file. If you only want to re-export specific names rather than everything, export { Order, OrderStatus } from \"./order\"; re-exports just those two names instead of every export in that file. Barrel files are a convenience for consumers, not a requirement: for a small project, plain direct imports from each file are often just as clear, and an overly large barrel file re-exporting dozens of unrelated things can make it harder to trace where a given export actually originates.",
      whyItMatters: "Barrel files reduce repetitive, scattered import lines across a growing project by giving consumers one predictable place to import a related group of exports from, as long as the barrel stays focused on one coherent group.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Write three comment blocks labeled // ==== FILE: models/product.ts ====, // ==== FILE: models/order.ts ====, and // ==== FILE: models/user.ts ====, each containing, as comments, one exported interface (Product, Order, and User respectively, each with at least two properties of your choice). Write a fourth comment block labeled // ==== FILE: models/index.ts ==== containing, as comments, three export * from lines re-exporting all three files. Write a fifth comment block labeled // ==== FILE: main.ts ==== showing the single combined import type line that would import Product, Order, and User all from \"./models\" at once. Beneath all the comment blocks, write the real, runnable code: declare all three interfaces directly, create one object of each, and print all three.",
      challenge: "Add a comment showing a second style of barrel re-export, export { Order } from \"./order\"; (re-exporting only Order by name instead of everything from that file with export *), and write one sentence explaining, in a comment, when you would prefer that named style over export *.",
      expectedResult: "The program prints one object each for Product, Order, and User, and the comment blocks correctly show three source files, one barrel file re-exporting all of them, and one consumer file importing everything through the barrel in a single line.",
      tests: ["The simulated models/index.ts barrel file re-exports from all three simulated model files using export * from", "The simulated main.ts import comment shows a single combined import line pulling Product, Order, and User from the barrel file's path, rather than three separate import lines"],
      hint: "export * from \"./file\" re-exports everything that file exports; it does not create a new name, it just makes those existing exports also reachable through the barrel file's own path.",
      lessonAssessment: [
        {
          question: "What does a barrel file, conventionally named index.ts, typically do?",
          options: [
            "It defines brand new types that don't exist anywhere else",
            "It re-exports items from several other files, so consumers can import them all from one combined location",
            "It deletes exports from other files",
            "It replaces the need for the export keyword entirely",
          ],
          correctAnswerIndex: 1,
          explanation: "A barrel file gathers and re-exports the exports of several other files, giving consumers one place to import a related group of items from.",
        },
        {
          question: "What is a downside of putting too many unrelated exports into one very large barrel file?",
          options: [
            "There is no downside at any size",
            "It can make it harder to trace where a specific export actually originates, since everything is funneled through one combined file",
            "Barrel files stop working correctly after more than three exports",
            "TypeScript does not allow more than a few export * statements in one file",
          ],
          correctAnswerIndex: 1,
          explanation: "An overly broad barrel file re-exporting many unrelated things makes it harder for readers to trace an import back to the specific file it actually came from, even though it still works.",
        },
      ],
      commonMistakes: ["Creating one giant barrel file that re-exports everything in an entire project, rather than scoping each barrel file to one coherent, related group of files.", "Forgetting that export * from \"./file\" only re-exports what that file already exports; it does not automatically pull in exports from files that file itself imports internally."],
      deliverables: ["A script with three simulated model files, one simulated barrel file, and one simulated consumer import, plus real, runnable equivalent code"],
      assessmentCriteria: ["The simulated barrel file correctly re-exports from all three simulated model files", "The simulated consumer import correctly shows a single combined import line using the barrel file's path"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code: '// ==== FILE: models/product.ts ====\n// export interface Product { id: number; name: string; }\n\n// ==== FILE: models/order.ts ====\n// export interface Order { id: number; total: number; }\n\n// ==== FILE: models/user.ts ====\n// export interface User { id: number; name: string; }\n\n// ==== FILE: models/index.ts (the barrel file) ====\n// export * from "./product";\n// export * from "./order";\n// export * from "./user";\n\n// ==== FILE: main.ts ====\n// import type { Product, Order, User } from "./models";\n\n// Runnable equivalent, kept in this single file:\ninterface Product { id: number; name: string; }\ninterface Order { id: number; total: number; }\ninterface User { id: number; name: string; }\n\nconst product: Product = { id: 1, name: "Mug" };\nconst order: Order = { id: 100, total: 12 };\nconst user: User = { id: 7, name: "Grace" };\n\nconsole.log(product, order, user);',
        explanation: "models/index.ts acts as a barrel, re-exporting Product, Order, and User from three separate files so main.ts can import all three from one combined path instead of three individual ones.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Modules & Organizing a Typed Project Assessment",
    questions: [
      { question: "What does export in front of a function or interface do?", options: ["It deletes the function from the file", "It makes that function or interface available for other files to import", "It runs the function immediately", "It converts the function into a type"], correctAnswerIndex: 1, explanation: "export marks a declaration as available to other files, which can then bring it in with an import statement." },
      { question: "What is the key benefit of import type { User } from \"./user\" over a regular import for an interface?", options: ["It runs faster at runtime", "It makes the import's type-only intent explicit and guarantees it is erased from compiled JavaScript", "It is required syntax with no real benefit", "It allows User to be used as a runtime value"], correctAnswerIndex: 1, explanation: "import type documents that the import exists purely for type checking, and TypeScript guarantees it disappears from the compiled JavaScript output." },
      { question: "Why can a function like greet() not be erased from compiled JavaScript the way an interface can?", options: [
          "Functions and interfaces are erased identically",
          "A function is real, callable code that must exist at runtime, while an interface exists only for compile-time type checking",
          "Interfaces are never erased either",
          "Functions are always erased, but interfaces are not",
        ], correctAnswerIndex: 1, explanation: "Interfaces are purely compile-time constructs and vanish entirely from output, but a function's implementation must remain since it actually runs." },
      { question: "What is the main benefit of centralizing a shared shape like Product into one types.ts file?", options: [
          "It makes the program run faster",
          "A single shared definition means a change to that shape is caught everywhere it's used, instead of drifting into inconsistent local copies",
          "It is required by the TypeScript compiler",
          "It removes the need for any interfaces elsewhere in the project",
        ], correctAnswerIndex: 1, explanation: "One shared source of truth for a shape keeps every consumer of it automatically in sync, catching mismatches as compile errors instead of silent drift." },
      { question: "If cart.ts only needs Product from types.ts, while orders.ts needs both Product and OrderStatus, what should cart.ts import?", options: ["Both Product and OrderStatus, to stay consistent with orders.ts", "Only Product, since a file should import only the specific types it actually uses", "Neither, since only orders.ts is allowed to import from types.ts", "cart.ts must redeclare Product locally instead"], correctAnswerIndex: 1, explanation: "Each file should import only the shared types it actually needs, rather than pulling in everything out of habit or to match another file." },
      { question: "What does a barrel file, typically named index.ts, do?", options: ["Defines new types unrelated to any other file", "Re-exports items from several other files so consumers can import them all from one combined location", "Deletes unused exports automatically", "Replaces the need for the export keyword"], correctAnswerIndex: 1, explanation: "A barrel file gathers exports from multiple files and re-exports them together, giving consumers a single, combined import location." },
      { question: "What does export * from \"./product\"; do inside a barrel file?", options: ["Deletes everything exported from product.ts", "Re-exports every export from product.ts through the barrel file's own path", "Only re-exports the default export of product.ts", "Creates a brand new type called product"], correctAnswerIndex: 1, explanation: "export * from re-exports everything that the named file exports, making those exports also reachable through the barrel file's path." },
      { question: "What is a downside of one very large barrel file re-exporting dozens of unrelated items?", options: [
          "There is no real downside",
          "It can make it harder to trace where a specific export actually originates",
          "TypeScript refuses to compile more than a few re-exports",
          "It automatically breaks all consumer imports",
        ], correctAnswerIndex: 1, explanation: "An overly broad barrel file makes tracing an export back to its real source file harder, even though the code still compiles and runs correctly." },
      { question: "What does export { Order } from \"./order\"; do differently from export * from \"./order\";?", options: [
          "They behave identically in every case",
          "It re-exports only the specifically named Order export, rather than everything order.ts exports",
          "It deletes Order from order.ts",
          "It re-exports everything except Order",
        ], correctAnswerIndex: 1, explanation: "Named re-exports let a barrel file be selective, re-exporting only the specific items listed instead of everything a source file exports." },
      { question: "In a project with a models folder containing product.ts, order.ts, user.ts, and an index.ts barrel file, what would a consumer typically import from \"./models\"?", options: [
          "Nothing, barrel files cannot be imported from directly",
          "Whatever the barrel file re-exports from product.ts, order.ts, and user.ts, combined into one import line",
          "Only files literally named index anywhere in the project",
          "The barrel file's own file path as a string",
        ], correctAnswerIndex: 1, explanation: "Importing from the folder's barrel file (\"./models\") gives access to everything it re-exports from the individual files inside that folder, in one combined import." },
    ],
  },
  assignment:
    "Write comment blocks simulating a small 'Library Catalog' project split across three files: // ==== FILE: types.ts ==== with exported interfaces Book (title: string, author: string, available: boolean) and Member (id: number, name: string); // ==== FILE: catalog.ts ==== showing an import type line bringing in Book from \"./types\" and a comment for a function signature checkOut(book: Book): void; and // ==== FILE: main.ts ==== showing a combined import type line bringing in both Book and Member from \"./types\". Beneath all three comment blocks, write real, runnable code: declare Book and Member directly, create two Book objects and one Member object, and print all three.",
  assignmentDeliverables: [
    "A script with three labeled comment blocks simulating types.ts, catalog.ts, and main.ts",
    "Real, runnable code beneath the comments creating and printing Book and Member objects",
  ],
  assignmentAssessmentCriteria: [
    "The simulated types.ts block is the single source for both Book and Member",
    "The simulated catalog.ts and main.ts blocks correctly show import type lines pulling only the specific shapes each one needs",
  ],
  miniProject:
    "Build a small 'Shop Models Barrel' script: write three comment blocks simulating models/product.ts (exporting Product), models/cart.ts (exporting CartItem, an intersection of Product and { quantity: number }), and models/index.ts as a barrel file re-exporting from both with export * from. Write a fourth comment block simulating checkout.ts, showing a combined import type line pulling Product and CartItem from \"./models\". Beneath all the comment blocks, write real, runnable code: declare Product and CartItem directly, create an array of at least three CartItem objects, and write a function cartTotal(items: CartItem[]): number that returns the sum of price times quantity for every item, printing the final total.",
  miniProjectDeliverables: [
    "A script with four labeled comment blocks simulating models/product.ts, models/cart.ts, models/index.ts (a barrel file), and checkout.ts",
    "Real, runnable code beneath the comments computing and printing a total from an array of CartItem objects",
  ],
  miniProjectAssessmentCriteria: [
    "The simulated barrel file correctly re-exports from both simulated model files using export * from",
    "cartTotal() correctly computes the total across every CartItem, using both the Product and quantity parts of the intersection",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
