import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module4: GeneratedModule = {
  title: "Interfaces & Object Types",
  description:
    "Define interfaces that describe the shape of your data, mark properties optional or readonly, and extend one interface from another.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Defining an Interface for Object Shapes",
      goal: "Define an interface describing the shape of an object and use it to type a variable.",
      videoTitle: "TypeScript Interfaces Explained",
      videoSearchQuery: "typescript interfaces explained for beginners",
      videoLearningGoal: "See an interface defined for an object shape, and a variable typed with that interface, including the error that appears when a required property is missing.",
      recommendedChannels: ["Total TypeScript", "Web Dev Simplified"],
      keyTakeaways: [
        "An interface, created with the interface keyword, describes the shape an object must have: which properties it needs and what type each one is.",
        "A variable annotated with an interface must include every required property, with values matching each property's declared type.",
        "Interfaces describe shape, not behavior: they do not contain implementation code, only property names and types.",
      ],
      notes:
        "Once your objects get more than a couple of properties, typing them inline gets repetitive. An interface lets you name a shape once and reuse it for every object that should match it.",
      conceptExplanation:
        "interface Product { name: string; price: number; inStock: boolean; } declares that any value typed Product must have exactly those three properties, with matching types. If you assign an object literal to a Product-typed variable and it is missing one of those properties, or has the wrong type for one, TypeScript reports the mismatch immediately.",
      whyItMatters: "Interfaces are the primary tool for describing the shape of data flowing through a program: function parameters, API responses, and configuration objects are all commonly typed this way.",
      practicalTask:
        "In main.ts, define an interface named Product with name: string, price: number, and inStock: boolean. Declare a variable typed as Product and assign it a matching object literal. Log the object.",
      challenge: "Remove one required property from the object literal temporarily and read the error the workspace reports about the missing property, then add it back.",
      expectedResult: "main.ts logs one Product object that matches the interface exactly, with no missing or mistyped properties.",
      tests: [
        "An interface named Product is defined with the three required properties",
        "A variable typed as Product is created and logged, matching the interface",
      ],
      hint: "An object matching an interface must include every property the interface declares, with matching types.",
      lessonAssessment: [
        {
          question: "What does a TypeScript interface describe?",
          options: [
            "The runtime behavior of a function",
            "The shape of an object: its property names and types",
            "A loop's iteration count",
            "A file's import path",
          ],
          correctAnswerIndex: 1,
          explanation: "An interface declares which properties an object must have and what type each one is, without any implementation.",
        },
        {
          question: "What happens if an object is missing a required property declared in the interface it is typed with?",
          options: [
            "TypeScript ignores the missing property",
            "TypeScript reports a type error",
            "The property is automatically set to undefined with no warning",
            "The interface is silently ignored",
          ],
          correctAnswerIndex: 1,
          explanation: "A required property that is missing from an object typed with that interface is flagged as a type error.",
        },
      ],
      commonMistakes: [
        "Forgetting a required property on an object literal typed with an interface.",
        "Assuming an interface can include actual implementation code rather than just property names and types.",
      ],
      deliverables: ["main.ts with a Product interface and a matching typed object"],
      assessmentCriteria: ["Interface declares correct property names and types", "Object literal matches the interface exactly"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "typescript",
        code: 'interface Product {\n  name: string;\n  price: number;\n  inStock: boolean;\n}\n\nconst mouse: Product = {\n  name: "Wireless Mouse",\n  price: 19.99,\n  inStock: true,\n};\n\nconsole.log(mouse);',
        explanation: "The mouse object must include name, price, and inStock with the exact types the Product interface declares, or TypeScript reports an error.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Optional and Readonly Properties",
      goal: "Mark interface properties as optional or readonly, and understand what each guarantees.",
      videoTitle: "TypeScript Optional and Readonly Properties",
      videoSearchQuery: "typescript optional readonly properties interface tutorial",
      videoLearningGoal: "See an interface with an optional property marked with ? and a readonly property, including the error that appears when a readonly property is reassigned.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "A ? after a property name in an interface, like discount?: number, marks it optional: matching objects may include it or leave it out.",
        "readonly before a property name, like readonly id: number, prevents that property from being reassigned after the object is created.",
        "Optional and readonly are independent modifiers: a property can be optional, readonly, both, or neither.",
      ],
      notes:
        "These two modifiers answer two different questions about a property: does it have to be there (optional), and can it change later (readonly). Combining them precisely describes how a property is meant to be used.",
      conceptExplanation:
        "An object typed with an interface containing discount?: number is valid whether or not it includes discount at all. An object typed with an interface containing readonly id: number can be created with an id, and that id can be read freely afterward, but any later line that tries to reassign it, like mouse.id = 5, is a compile-time error.",
      whyItMatters: "Marking properties optional or readonly makes an interface communicate real constraints, like 'an id should never change after creation', that TypeScript then enforces automatically.",
      practicalTask:
        "In main.ts, add a readonly id: number property and an optional discount?: number property to a Product-like interface (or reuse Product from the previous lesson). Create one object without the discount property and one with it, and log both.",
      challenge: "Try reassigning the readonly id property on one of your objects after it is created, and read the error the workspace reports, then remove that line.",
      expectedResult: "main.ts logs two valid Product objects, one with discount and one without, and the readonly violation was caught and removed.",
      tests: [
        "The interface includes a readonly property and an optional property",
        "Two valid objects are created: one with the optional property and one without it",
      ],
      hint: "readonly goes directly before the property name inside the interface: readonly id: number;",
      lessonAssessment: [
        {
          question: "What does marking an interface property with ? indicate?",
          options: [
            "The property must always be included",
            "The property is optional and may be omitted",
            "The property cannot be a number",
            "The property is deleted at runtime",
          ],
          correctAnswerIndex: 1,
          explanation: "A ? after a property name marks it as optional, so matching objects may leave it out.",
        },
        {
          question: "What does the readonly modifier prevent?",
          options: [
            "Reading the property's value",
            "Reassigning the property after the object is created",
            "Logging the property with console.log()",
            "Including the property in an interface at all",
          ],
          correctAnswerIndex: 1,
          explanation: "readonly allows the property to be read freely but blocks reassignment after creation.",
        },
      ],
      commonMistakes: [
        "Confusing optional (?) with readonly: they solve different problems and can be combined.",
        "Trying to reassign a readonly property after the object has already been created.",
      ],
      deliverables: ["main.ts with an interface featuring both a readonly and an optional property, and two valid matching objects"],
      assessmentCriteria: ["readonly and optional modifiers are used correctly", "Both objects are valid according to the interface"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "typescript",
        code: 'interface Product {\n  readonly id: number;\n  name: string;\n  price: number;\n  discount?: number;\n}\n\nconst mouse: Product = { id: 1, name: "Wireless Mouse", price: 19.99 };\nconst keyboard: Product = { id: 2, name: "Mechanical Keyboard", price: 59.99, discount: 10 };\n\nconsole.log(mouse, keyboard);\n// mouse.id = 5; // Error: Cannot assign to \'id\' because it is a read-only property.',
        explanation: "discount is optional so mouse can leave it out entirely, while id is readonly, so reassigning mouse.id after creation is a compile-time error.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Extending One Interface From Another",
      goal: "Build a new interface on top of an existing one using extends, adding properties without repeating them.",
      videoTitle: "TypeScript Interface Extends Tutorial",
      videoSearchQuery: "typescript interface extends inheritance tutorial for beginners",
      videoLearningGoal: "See one interface extend another with the extends keyword, inheriting all of its properties plus its own additional ones.",
      recommendedChannels: ["Total TypeScript", "freeCodeCamp.org"],
      keyTakeaways: [
        "An interface can extend another interface using interface Child extends Parent { ... }, automatically inheriting every property the parent declares.",
        "An object typed with the extended interface must satisfy both the parent's properties and any additional properties the child interface adds.",
        "Extending interfaces avoids repeating shared properties across multiple related shapes, keeping each one focused on what is different.",
      ],
      notes:
        "extends is the interface version of building on top of something that already exists, similar in spirit to how a more specific object usually 'is a' more general one, plus some extra details.",
      conceptExplanation:
        "Given interface Item { name: string; price: number; }, writing interface DigitalItem extends Item { fileSizeMb: number; } means any DigitalItem-typed object needs name, price, and fileSizeMb, all three, because DigitalItem inherits Item's requirements and adds its own on top.",
      whyItMatters: "Extending interfaces keeps related shapes consistent and easy to maintain: change a shared property once on the parent interface, and every interface extending it stays in sync.",
      practicalTask:
        "In main.ts, define a base interface named Item with name: string and price: number. Define a second interface named DigitalItem that extends Item and adds fileSizeMb: number. Create an object typed as DigitalItem that includes all three properties, and log it.",
      challenge: "Define a third interface, PhysicalItem, that also extends Item and adds weightKg: number, and create a matching object for it too.",
      expectedResult: "main.ts logs at least one DigitalItem object that correctly combines the inherited Item properties with its own additional property.",
      tests: [
        "DigitalItem extends Item using the extends keyword",
        "The DigitalItem object includes name, price, and fileSizeMb, matching both interfaces",
      ],
      hint: "Extending looks like: interface DigitalItem extends Item { fileSizeMb: number; }",
      lessonAssessment: [
        {
          question: "What does 'interface DigitalItem extends Item { fileSizeMb: number; }' mean?",
          options: [
            "DigitalItem replaces Item entirely",
            "DigitalItem inherits Item's properties and adds fileSizeMb",
            "DigitalItem can only be used inside Item",
            "extends is only valid for classes, not interfaces",
          ],
          correctAnswerIndex: 1,
          explanation: "extends between interfaces means the child interface inherits every property from the parent and can add more of its own.",
        },
        {
          question: "What must an object typed with an interface that extends another interface include?",
          options: [
            "Only the properties from the child interface",
            "Only the properties from the parent interface",
            "All properties from both the parent and child interfaces",
            "No properties are required",
          ],
          correctAnswerIndex: 2,
          explanation: "The extended interface's requirements are the union of the parent's and the child's own properties.",
        },
      ],
      commonMistakes: [
        "Forgetting that an object typed with the extended interface still needs every property from the parent interface too.",
        "Repeating shared properties manually in multiple interfaces instead of using extends.",
      ],
      deliverables: ["main.ts with a base interface, an extended interface, and a matching object"],
      assessmentCriteria: ["extends is used correctly between two interfaces", "The object satisfies all properties from both interfaces"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "typescript",
        code: 'interface Item {\n  name: string;\n  price: number;\n}\n\ninterface DigitalItem extends Item {\n  fileSizeMb: number;\n}\n\nconst ebook: DigitalItem = { name: "TypeScript Guide", price: 9.99, fileSizeMb: 4.2 };\nconsole.log(ebook);',
        explanation: "DigitalItem inherits name and price from Item and adds fileSizeMb, so the ebook object must satisfy all three properties.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Interfaces & Object Types Assessment",
    questions: [
      {
        question: "Which keyword declares an interface in TypeScript?",
        options: ["type", "interface", "class", "shape"],
        correctAnswerIndex: 1,
        explanation: "interface is the dedicated keyword for declaring an object shape.",
      },
      {
        question: "What must an object typed with an interface include?",
        options: [
          "Any properties, regardless of the interface",
          "Every required property the interface declares, with matching types",
          "Only the first property listed",
          "No properties are actually required",
        ],
        correctAnswerIndex: 1,
        explanation: "TypeScript checks that every required interface property is present with a matching type.",
      },
      {
        question: "Do interfaces contain implementation code, like function bodies?",
        options: [
          "Yes, always",
          "No, interfaces only describe property names and types",
          "Only for readonly properties",
          "Only when extending another interface",
        ],
        correctAnswerIndex: 1,
        explanation: "Interfaces describe shape only; they never contain executable implementation code themselves.",
      },
      {
        question: "What does discount?: number inside an interface mean?",
        options: [
          "discount is required and must be a number",
          "discount is optional and may be omitted",
          "discount must always be 0",
          "discount is a string, not a number",
        ],
        correctAnswerIndex: 1,
        explanation: "The ? marks discount as an optional property.",
      },
      {
        question: "What does readonly id: number prevent?",
        options: [
          "Reading id after creation",
          "Reassigning id after the object is created",
          "Using id inside a function",
          "Declaring id as a number",
        ],
        correctAnswerIndex: 1,
        explanation: "readonly blocks reassignment of the property after the object exists, while still allowing it to be read.",
      },
      {
        question: "Can a single property be both optional and readonly at the same time?",
        options: [
          "No, they are mutually exclusive",
          "Yes, the two modifiers are independent and can be combined",
          "Only for string properties",
          "Only inside extended interfaces",
        ],
        correctAnswerIndex: 1,
        explanation: "optional and readonly answer different questions about a property and can be combined freely.",
      },
      {
        question: "What does 'interface DigitalItem extends Item' do?",
        options: [
          "Deletes Item entirely",
          "Makes DigitalItem inherit all of Item's properties",
          "Makes Item inherit DigitalItem's properties",
          "Has no effect on typing",
        ],
        correctAnswerIndex: 1,
        explanation: "extends makes the child interface inherit every property the parent interface declares.",
      },
      {
        question: "If Item has name and price, and DigitalItem extends Item adding fileSizeMb, what properties does a valid DigitalItem object need?",
        options: [
          "Only fileSizeMb",
          "Only name and price",
          "name, price, and fileSizeMb",
          "None of these are required",
        ],
        correctAnswerIndex: 2,
        explanation: "A DigitalItem object must satisfy both the inherited Item properties and its own additional property.",
      },
      {
        question: "What is the main benefit of extending interfaces instead of repeating shared properties manually?",
        options: [
          "It hides properties from the type checker",
          "Shared properties stay consistent in one place and update everywhere they are inherited",
          "It removes the need for type checking",
          "It converts interfaces into classes automatically",
        ],
        correctAnswerIndex: 1,
        explanation: "extends keeps related interfaces consistent by defining shared properties only once, in the parent.",
      },
      {
        question: "If an object literal is missing a required (non-optional) property from its interface, when is that caught?",
        options: [
          "Only when the program is deployed",
          "At compile time, before the program runs",
          "Only if the property is later accessed",
          "It is never caught",
        ],
        correctAnswerIndex: 1,
        explanation: "TypeScript's type checker flags missing required properties at compile time.",
      },
    ],
  },
  assignment:
    "Define a 'Contact' interface in the Academy workspace with fullName: string, email: string, and an optional phone?: string property. Create at least three Contact objects, with different combinations of the optional property included or omitted, stored in a typed array, then log each contact using a template literal.",
  assignmentDeliverables: [
    "main.ts with a Contact interface and a typed array of 3+ Contact objects",
    "A loop or repeated calls logging each contact with a template literal",
  ],
  assignmentAssessmentCriteria: [
    "Interface correctly marks phone as optional",
    "At least one contact includes phone and at least one omits it",
  ],
  miniProject:
    "Extend the Contact interface into a small 'Address Book': define a second interface, BusinessContact, that extends Contact and adds a readonly companyId: number and a company: string property. Create a typed array mixing regular Contact and BusinessContact objects (typed as Contact[], since BusinessContact satisfies Contact too), and log a formatted report listing every contact.",
  miniProjectDeliverables: ["address_book.ts in the Academy workspace", "Output listing every contact, including the extended BusinessContact entries"],
  miniProjectAssessmentCriteria: [
    "BusinessContact correctly extends Contact",
    "The array and report correctly include both kinds of contacts",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
