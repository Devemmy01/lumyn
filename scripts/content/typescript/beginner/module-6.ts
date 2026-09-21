import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module6: GeneratedModule = {
  title: "Arrays, Tuples & Enums",
  description:
    "Go deeper on typed arrays and tuples, declare your first enum, and learn when a union of literals is the better choice.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Typed Arrays: string[] vs Array<string>",
      goal: "Recognize and use both array type syntaxes and understand they mean the same thing.",
      videoTitle: "TypeScript Array Types: Two Syntaxes Explained",
      videoSearchQuery: "typescript array type syntax string array vs generic array",
      videoLearningGoal: "See both the string[] shorthand and the Array<string> generic syntax used for the same array type, and array methods that preserve or change the element type.",
      recommendedChannels: ["Total TypeScript", "Ben Awad"],
      keyTakeaways: [
        "string[] and Array<string> are two ways of writing the exact same array type in TypeScript; string[] is the more common shorthand.",
        "Array methods like .map() can change the element type of the resulting array, such as turning a number[] into a string[].",
        "Array methods like .filter() and .push() are still fully type-checked: TypeScript does not let you push a value of the wrong type into a typed array.",
      ],
      notes:
        "Both array syntaxes are equivalent, so you will see both in real codebases. Recognizing them as the same thing matters more than picking one over the other.",
      conceptExplanation:
        "Array<number> and number[] describe the exact same type: an array whose elements are all numbers. Calling .map() on that array with a callback that returns a string produces a new array typed string[], since TypeScript infers the result type from what the callback returns, not from the original array's type.",
      whyItMatters: "Recognizing both array syntaxes, and understanding how methods like .map() transform types, is essential for reading and writing realistic TypeScript array code.",
      practicalTask:
        "In main.ts, declare a variable named scores typed as Array<number> holding at least four numbers. Use .map() to create a new array named scoreLabels typed as string[] that converts each score into a labeled string like 'Score: 85'. Log both arrays.",
      challenge: "Try pushing a string directly into the scores array with .push() and read the error the workspace reports, then remove that broken line.",
      expectedResult: "main.ts logs the original number array and the mapped string array, both correctly typed.",
      tests: [
        "scores is declared using the Array<number> generic syntax",
        "scoreLabels is created with .map() and typed as string[]",
      ],
      hint: ".map() returns a new array; the type of its elements depends on what the callback function returns.",
      lessonAssessment: [
        {
          question: "Which of these is equivalent to Array<number>?",
          options: ["number[]", "[number]", "Array[number]", "number<Array>"],
          correctAnswerIndex: 0,
          explanation: "number[] and Array<number> are two syntaxes for the exact same array type.",
        },
        {
          question: "If you call .map() on a number[] and each callback returns a string, what is the resulting array's type?",
          options: ["number[]", "string[]", "boolean[]", "any[]"],
          correctAnswerIndex: 1,
          explanation: ".map() infers the result array's element type from what the callback function returns, here string.",
        },
      ],
      commonMistakes: [
        "Mixing up the two equivalent syntaxes and assuming they behave differently.",
        "Trying to push a value of the wrong type into an already-typed array.",
      ],
      deliverables: ["main.ts with an Array<number> variable and a derived string[] array from .map()"],
      assessmentCriteria: ["Both array syntaxes are used correctly", ".map() correctly transforms the element type"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "typescript",
        code: 'const scores: Array<number> = [72, 85, 91, 60];\nconst scoreLabels: string[] = scores.map((score) => `Score: ${score}`);\nconsole.log(scores, scoreLabels);',
        explanation: "scores uses the Array<number> generic syntax while scoreLabels uses the string[] shorthand; .map() converts each number into a labeled string, changing the element type.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Tuples in Depth",
      goal: "Use tuples for fixed-shape, ordered data, including optional tuple elements.",
      videoTitle: "TypeScript Tuples in Depth",
      videoSearchQuery: "typescript tuples in depth tutorial explained",
      videoLearningGoal: "See a tuple used to represent a fixed, ordered piece of data, plus an optional element inside a tuple type.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "A tuple's types are positional: the first position's type and the second position's type are checked independently, not interchangeably.",
        "You can destructure a tuple into separate variables in one line, the same way you would destructure an array.",
        "A tuple element can be marked optional with ?, like [string, number?], allowing that position to be omitted.",
      ],
      notes:
        "Tuples shine when order and position carry meaning, like an (x, y) coordinate or a (name, priority) pair, where the first slot always means one thing and the second always means another.",
      conceptExplanation:
        "const coordinate: [number, number] = [12, 45]; can be destructured directly with const [x, y] = coordinate;, giving you two separate, correctly typed variables in one line. A tuple type like [string, number?] means the second position, the number, may be left out entirely when creating the tuple.",
      whyItMatters: "Tuples make position-sensitive data explicit in the type system, preventing the kind of bug where two values accidentally get swapped.",
      practicalTask:
        "In main.ts, declare a tuple named coordinate typed as [number, number] holding an x and y value. Destructure it into two separate variables, x and y, in one line, and log them. Then declare a second tuple typed as [string, number?] representing a task name and an optional priority, once with the priority included and once without.",
      challenge: "Try assigning a [string, number] tuple where a number comes first instead of a string, and read the error the workspace reports, then fix the order back.",
      expectedResult: "main.ts logs the destructured coordinate values and both versions of the task tuple, with and without priority.",
      tests: [
        "coordinate is destructured into two separate variables in one line",
        "A tuple with an optional element is declared and used both with and without that element",
      ],
      hint: "Destructuring a tuple looks just like destructuring an array: const [x, y] = coordinate;",
      lessonAssessment: [
        {
          question: "In a tuple typed [string, number], what does TypeScript check about each position?",
          options: [
            "Only that the tuple has two elements, ignoring their types",
            "That the first position is a string and the second is specifically a number",
            "That both positions can be either type",
            "Nothing; tuples are not type-checked",
          ],
          correctAnswerIndex: 1,
          explanation: "Each tuple position has its own specific type, checked independently of the others.",
        },
        {
          question: "What does a ? on a tuple element, like [string, number?], indicate?",
          options: [
            "That element is required to be a string",
            "That element may be omitted from the tuple",
            "The tuple can now hold unlimited elements",
            "The tuple is converted into a regular array",
          ],
          correctAnswerIndex: 1,
          explanation: "The ? marks that tuple position as optional, allowing it to be left out.",
        },
      ],
      commonMistakes: [
        "Swapping the order of values in a tuple, which changes which type applies to which position.",
        "Treating a tuple like a flexible array that can grow past its declared length.",
      ],
      deliverables: ["main.ts with a destructured [number, number] tuple and a [string, number?] tuple used both ways"],
      assessmentCriteria: ["Tuple types and order are correct", "Destructuring is used correctly"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "typescript",
        code: 'const coordinate: [number, number] = [12, 45];\nconst [x, y] = coordinate;\nconsole.log(`x: ${x}, y: ${y}`);\n\nconst task1: [string, number?] = ["Write report"];\nconst task2: [string, number?] = ["Fix bug", 1];\nconsole.log(task1, task2);',
        explanation: "coordinate is destructured directly into x and y; the [string, number?] tuple type allows task1 to omit the priority position entirely while task2 includes it.",
      },
      completionStatus: "not_started",
    },
    {
      title: "enum and When to Prefer a Union of Literals",
      goal: "Declare and use an enum, and reason about when a union of string literals is the better choice instead.",
      videoTitle: "TypeScript enum vs Union of Literals",
      videoSearchQuery: "typescript enum vs union of string literals when to use",
      videoLearningGoal: "See an enum declared and used, and the same set of options rewritten as a union of string literals, comparing how each behaves.",
      recommendedChannels: ["Total TypeScript", "Web Dev Simplified"],
      keyTakeaways: [
        "enum creates a named set of related constants, like enum Direction { Up, Down, Left, Right }, accessed as Direction.Up.",
        "A union of string literals, like \"up\" | \"down\" | \"left\" | \"right\", achieves a similar restriction using plain strings instead of a separate enum construct.",
        "Many teams prefer a literal union over enum for simple sets of options because it compiles away to nothing extra and compares directly against plain strings, while enum generates actual runtime code.",
      ],
      notes:
        "Both enum and a literal union restrict a value to a fixed set of valid options. The difference is mostly about how each one behaves once compiled to JavaScript, and how naturally each compares against ordinary values.",
      conceptExplanation:
        "enum Direction { Up, Down, Left, Right } creates an actual object at runtime that you access with dot notation, like Direction.Up. type DirectionLiteral = \"up\" | \"down\" | \"left\" | \"right\" instead restricts a value to one of four plain strings, with no extra runtime object generated at all, comparing directly with === against ordinary string values.",
      whyItMatters: "Understanding both options lets you choose deliberately: enum for a small set of related named constants where dot-notation access reads well, or a literal union for lightweight, string-comparable options.",
      practicalTask:
        "In main.ts, declare an enum named Direction with four members: Up, Down, Left, Right. Write a function move(direction: Direction): void that logs a message naming the direction, and call it once for each of the four enum members using Direction.Up, Direction.Down, and so on.",
      challenge: 'Rewrite the same feature using a union of string literals instead, as type DirectionLiteral = "up" | "down" | "left" | "right", with a second function that accepts that type, and call it with each literal string.',
      expectedResult: "main.ts logs four direction messages using the enum version and four more using the literal union version.",
      tests: [
        "Direction enum is declared with exactly four members and used via Direction.MemberName",
        "A parallel union-of-literals version is defined and used with plain string values",
      ],
      hint: "Enum members are accessed with dot notation: Direction.Up, not just Up.",
      lessonAssessment: [
        {
          question: "How do you access a member of enum Direction { Up, Down, Left, Right }?",
          options: ['Direction["up"]', "Direction.Up", "Up", "enum.Direction.Up"],
          correctAnswerIndex: 1,
          explanation: "Enum members are accessed using dot notation on the enum's name, like Direction.Up.",
        },
        {
          question: "What is one commonly cited reason to prefer a union of string literals over an enum for a simple set of options?",
          options: [
            "Union types cannot represent multiple options at all",
            "A literal union compiles away with no extra runtime code and compares directly against plain strings",
            "enum cannot be used in functions",
            "Union types are only valid for numbers",
          ],
          correctAnswerIndex: 1,
          explanation: "Literal unions add no runtime object, unlike enum, which generates actual JavaScript code when compiled.",
        },
      ],
      commonMistakes: [
        "Forgetting the dot notation and trying to use a bare enum member name like Up instead of Direction.Up.",
        "Assuming enum and a union of literals are always interchangeable with zero tradeoffs.",
      ],
      deliverables: ["main.ts with a Direction enum used in a function, plus a parallel union-of-literals version"],
      assessmentCriteria: ["enum is declared and accessed correctly", "The literal union version behaves equivalently using plain strings"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 minutes",
      codeExample: {
        language: "typescript",
        code: 'enum Direction {\n  Up,\n  Down,\n  Left,\n  Right,\n}\n\nfunction move(direction: Direction): void {\n  console.log(`Moving: ${Direction[direction]}`);\n}\n\nmove(Direction.Up);\nmove(Direction.Left);\n\ntype DirectionLiteral = "up" | "down" | "left" | "right";\nfunction moveLiteral(direction: DirectionLiteral): void {\n  console.log(`Moving: ${direction}`);\n}\nmoveLiteral("up");',
        explanation: "Direction.Up and moveLiteral(\"up\") both restrict the caller to a fixed set of valid options, but the enum version generates an actual object at runtime while the literal union compiles away entirely.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Arrays, Tuples & Enums Assessment",
    questions: [
      {
        question: "Which two type annotations describe the exact same array type?",
        options: ["number[] and string[]", "number[] and Array<number>", "Array<number> and Array<string>", "[number] and number[]"],
        correctAnswerIndex: 1,
        explanation: "number[] is shorthand for the exact same type as Array<number>.",
      },
      {
        question: "If .map() is called on a string[] with a callback returning a number, what is the result's type?",
        options: ["string[]", "number[]", "boolean[]", "any[]"],
        correctAnswerIndex: 1,
        explanation: ".map() infers the resulting array's element type from what the callback returns.",
      },
      {
        question: "What happens if you try to .push() a boolean into a number[] array?",
        options: ["It is allowed and converted to 1 or 0", "TypeScript reports a type error", "The array becomes any[] automatically", "Nothing, arrays accept any value"],
        correctAnswerIndex: 1,
        explanation: "A typed array only accepts values matching its declared element type; a mismatched push is a type error.",
      },
      {
        question: "What does destructuring const [x, y] = coordinate; do for a [number, number] tuple?",
        options: [
          "Creates one combined variable named x_y",
          "Creates two separate typed variables, x and y, from the tuple's positions",
          "Deletes the coordinate tuple",
          "Converts the tuple into an array of strings",
        ],
        correctAnswerIndex: 1,
        explanation: "Tuple destructuring assigns each position of the tuple to its own variable in one line.",
      },
      {
        question: "What does the ? in a tuple type like [string, number?] mean?",
        options: [
          "The string is optional",
          "The number position is optional and may be omitted",
          "The tuple can have unlimited length",
          "It is invalid syntax",
        ],
        correctAnswerIndex: 1,
        explanation: "The ? marks that specific tuple position as optional.",
      },
      {
        question: "How is a member of enum Direction { Up, Down } accessed?",
        options: ["Direction.Up", "Up", "Direction['Up']()", "Direction::Up"],
        correctAnswerIndex: 0,
        explanation: "Enum members use dot notation on the enum name.",
      },
      {
        question: "Does declaring an enum generate any actual JavaScript code at runtime?",
        options: [
          "No, enums are removed entirely during compilation",
          "Yes, enum compiles down to a real object with its members",
          "Only if the enum has string members",
          "Only inside classes",
        ],
        correctAnswerIndex: 1,
        explanation: "Unlike a literal type union, enum generates an actual runtime object.",
      },
      {
        question: 'What does type DirectionLiteral = "up" | "down" | "left" | "right"; restrict a value to?',
        options: [
          "Any string value",
          "Exactly one of those four literal string values",
          "Any of the four values plus numbers",
          "Only the word up",
        ],
        correctAnswerIndex: 1,
        explanation: "A literal type union restricts a value to exactly the listed options.",
      },
      {
        question: "Which is a commonly cited advantage of a literal union over an enum for a simple set of options?",
        options: [
          "It requires more code to write",
          "It adds no extra runtime object and compares directly with plain strings",
          "It cannot be used as a function parameter type",
          "It is slower to type-check",
        ],
        correctAnswerIndex: 1,
        explanation: "Literal unions compile away entirely, unlike enum, which generates runtime code.",
      },
      {
        question: "What is the key difference between a regular typed array and a tuple?",
        options: [
          "There is no difference",
          "A tuple has a fixed length with a specific type per position; a regular array is a flexible list of one type",
          "Tuples can only hold strings",
          "Regular arrays cannot be typed",
        ],
        correctAnswerIndex: 1,
        explanation: "Tuples enforce both length and per-position types, unlike a regular array of a single repeated type.",
      },
    ],
  },
  assignment:
    "Build a 'Typed Playlist' script in the Academy workspace: declare a tuple array typed as [string, number][] where each tuple holds a song title and its duration in seconds. Use .map() to build a string[] array of formatted labels like 'Song Title - 180s', and log both the raw tuple array and the formatted labels.",
  assignmentDeliverables: [
    "main.ts with a [string, number][] tuple array of at least four songs",
    "A .map()-derived string[] array of formatted labels, logged",
  ],
  assignmentAssessmentCriteria: [
    "Tuple array is correctly typed and ordered",
    ".map() correctly produces a string[] of formatted labels",
  ],
  miniProject:
    "Extend the playlist into a 'Playlist Player' mini project: declare an enum PlaybackState with members Playing, Paused, and Stopped. Write a function reportState(state: PlaybackState): string that returns a message describing the current state, and call it once for each of the three states, logging every result alongside the playlist labels from the assignment.",
  miniProjectDeliverables: ["playlist_player.ts in the Academy workspace", "Output showing the playlist labels and a reported message for all three PlaybackState values"],
  miniProjectAssessmentCriteria: [
    "PlaybackState enum is declared and used correctly",
    "reportState() returns a correct, distinct message per state",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
