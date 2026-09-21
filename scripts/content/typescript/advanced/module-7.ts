import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module7: GeneratedModule = {
  title: "Writing Production-Quality TypeScript",
  description:
    "Pick up the habits that separate a first draft from production TypeScript: structuring types across a larger codebase, replacing any with unknown and real narrowing, and the strict tsconfig flags and migration habits real teams rely on.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Structuring a Larger Typed Codebase",
      goal: "Separate internal domain types from the shapes that cross a boundary (like an API response), and map between them explicitly at that boundary.",
      videoTitle: "Structuring Types in a Large TypeScript Codebase",
      videoSearchQuery: "typescript structuring types large codebase domain model dto tutorial",
      videoLearningGoal: "See an internal domain type kept separate from the public shape that crosses a boundary, with an explicit mapping function converting between the two.",
      recommendedChannels: ["Matt Pocock", "Theo - t3.gg"],
      keyTakeaways: [
        "A domain type (your program's internal model) and a boundary type (what actually crosses an API, a file, or another external edge) often shouldn't be the same type, even if they look similar at first.",
        "An explicit mapping function, like toUserDto(user: User): UserDto, is a deliberate checkpoint where internal-only fields (like a password hash) are guaranteed to be stripped before data leaves.",
        "import type (instead of a normal import) makes it explicit that an import is only used for types, which keeps type-only dependencies clearly separated from runtime ones as a codebase grows.",
      ],
      notes:
        "In a small script, one flat pile of types is fine. In a larger codebase, the types that describe your internal logic and the types that describe what crosses a boundary, like a network response, tend to drift apart, and treating them as the same type eventually leaks internal details or breaks compatibility.",
      conceptExplanation:
        "interface User { id: number; name: string; email: string; passwordHash: string } is a rich internal domain type; passwordHash should never leave the server. interface UserDto { id: number; name: string; email: string } is the boundary shape that's actually safe to send elsewhere. A dedicated mapping function, function toUserDto(user: User): UserDto { return { id: user.id, name: user.name, email: user.email }; }, is the one deliberate place where the conversion happens, so passwordHash physically cannot leak through by accident, the way it could if User itself were reused directly as the response shape. As a codebase grows across files, import type { User } from './types' (instead of a plain import) documents that a particular import exists purely for type checking, with nothing runtime being pulled in.",
      whyItMatters: "Keeping domain types and boundary types separate, with an explicit mapping step between them, is one of the simplest habits that prevents entire categories of bugs and accidental data leaks as a codebase grows past a single file.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define interface User with id: number, name: string, email: string, and passwordHash: string. Define interface UserDto with only id, name, and email. Write function toUserDto(user: User): UserDto that maps a User into a UserDto, explicitly picking only the safe fields. Create a sample User object including a fake passwordHash value, convert it with toUserDto, and print the result, adding a comment confirming passwordHash does not appear anywhere in the printed output.",
      challenge: "Write a second mapping function, toUserDtoList(users: User[]): UserDto[], that maps an array of internal User objects into UserDto objects using your existing toUserDto function, and demonstrate it on a small array of sample users.",
      expectedResult: "Printing the result of toUserDto(sampleUser) shows only id, name, and email; passwordHash is never present in the mapped output, even though it exists on the original User object.",
      tests: [
        "User and UserDto are defined as two distinct interfaces, with UserDto intentionally omitting passwordHash",
        "toUserDto correctly constructs a new object containing only the safe fields, rather than reusing the original User object directly",
      ],
      hint: "The mapping function should build a brand-new object literal with only the fields UserDto needs, rather than spreading the entire User object and then trying to delete fields from it.",
      lessonAssessment: [
        {
          question: "Why might interface User (internal) and interface UserDto (public) intentionally be two different types instead of one shared type?",
          options: [
            "TypeScript requires every exported type to have a matching Dto version",
            "So internal-only fields, like a password hash, can never accidentally end up in data that crosses a boundary",
            "There's no real reason; using one shared type is always better",
            "Dto types are only needed for classes, not interfaces",
          ],
          correctAnswerIndex: 1,
          explanation: "Keeping the types separate, with an explicit mapping function between them, guarantees sensitive internal fields are deliberately excluded rather than accidentally included.",
        },
        {
          question: "What is the benefit of writing import type { User } from './types' instead of a plain import?",
          options: [
            "It makes the import run faster at runtime",
            "It documents that the import is used purely for type checking, with no runtime dependency being pulled in",
            "It automatically converts User into a UserDto",
            "It has no effect and is purely stylistic with no meaning",
          ],
          correctAnswerIndex: 1,
          explanation: "import type signals, both to readers and to the compiler, that a given import exists only for its type information, keeping type-only and runtime dependencies clearly distinguished.",
        },
      ],
      commonMistakes: [
        "Reusing one internal type directly as the shape sent across a boundary, which risks leaking fields that were never meant to leave, like a password hash or an internal id scheme.",
        "Building a Dto by spreading the full internal object and deleting unwanted fields afterward, instead of constructing a new object with only the fields that belong, which is easy to get wrong as fields are added later.",
      ],
      deliverables: ["main.ts with separate User and UserDto interfaces and a toUserDto mapping function"],
      assessmentCriteria: [
        "User and UserDto are correctly defined as distinct types, with UserDto excluding internal-only fields",
        "toUserDto correctly constructs a new object containing only the safe, public fields",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code:
          'interface User {\n  id: number;\n  name: string;\n  email: string;\n  passwordHash: string;\n}\n\ninterface UserDto {\n  id: number;\n  name: string;\n  email: string;\n}\n\nfunction toUserDto(user: User): UserDto {\n  return {\n    id: user.id,\n    name: user.name,\n    email: user.email,\n  };\n}\n\nconst sampleUser: User = {\n  id: 1,\n  name: "Ada",\n  email: "ada@example.test",\n  passwordHash: "not-a-real-hash",\n};\n\nconst publicUser = toUserDto(sampleUser);\nconsole.log(publicUser);\n// publicUser has no passwordHash field at all, at the type level or in the printed output.\n\nfunction toUserDtoList(users: User[]): UserDto[] {\n  return users.map(toUserDto);\n}\n\nconsole.log(toUserDtoList([sampleUser]));',
        explanation: "toUserDto deliberately constructs a new object with only the public fields, so passwordHash is guaranteed to be excluded from anything derived from publicUser, unlike simply reusing or spreading the original User object.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Avoiding any in Practice: unknown Plus Narrowing",
      goal: "Replace any with unknown at untrusted boundaries, and safely narrow unknown values using type guards and assertion functions instead of type assertions.",
      videoTitle: "TypeScript unknown vs any: Safe Narrowing in Practice",
      videoSearchQuery: "typescript unknown type guards assertion functions avoid any tutorial",
      videoLearningGoal: "See unknown used at an untrusted boundary like JSON.parse, narrowed safely with a custom type guard and an assertion function instead of an any-typed shortcut.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "unknown accepts any value, just like any, but TypeScript refuses to let you use an unknown value's properties or methods until you've proven what it actually is; any skips that proof entirely.",
        "A user-defined type guard, written as function isUser(value: unknown): value is User { ... }, lets you narrow an unknown value to a specific type based on your own runtime checks.",
        "An assertion function, written as function assertIsUser(value: unknown): asserts value is User { ... }, throws if the check fails and otherwise narrows the value for the rest of the enclosing code, without needing an if block.",
      ],
      notes:
        "any and unknown both mean 'this could be anything,' but they behave completely differently after that. any lets you do anything with the value, correct or not, with zero safety net. unknown makes you prove what the value is before you're allowed to use it, which is exactly the safety any throws away.",
      conceptExplanation:
        "function parseJson(text: string): unknown { return JSON.parse(text); } correctly types the result as unknown, since JSON.parse can return literally anything based on its input. To use it safely, write a type guard: function isUser(value: unknown): value is User { return typeof value === 'object' && value !== null && 'id' in value && 'name' in value; }, then if (isUser(parsed)) { /* parsed is User here */ }. An assertion function does the same narrowing without an explicit if: function assertIsUser(value: unknown): asserts value is User { if (!isUser(value)) { throw new Error('Invalid user data'); } }; assertIsUser(parsed); console.log(parsed.name); works because everything after the assertion call is narrowed for the rest of that scope.",
      whyItMatters: "Untrusted data, like a parsed JSON string or an external API response, is exactly where any causes real bugs: it looks type-safe right up until a field is missing or misspelled at runtime. unknown plus real narrowing catches those problems at the boundary instead of deep inside your program.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define interface User with id: number and name: string. Write function parseJson(text: string): unknown that wraps JSON.parse. Write a type guard function isUser(value: unknown): value is User checking for the right shape. Parse two different JSON strings, one that matches User's shape and one that doesn't, and for each one use if (isUser(parsed)) to safely print the name when it matches, and print a clear 'invalid data' message when it doesn't, without using any anywhere in your code.",
      challenge: "Write an assertion function assertIsUser(value: unknown): asserts value is User that throws when isUser returns false, then rewrite one of your two parsing cases to use assertIsUser followed directly by using parsed.name, wrapped in a try/catch to handle the case where it throws.",
      expectedResult: "Parsing valid User-shaped JSON correctly narrows to User and prints the name; parsing invalid JSON is correctly detected by isUser (or rejected by assertIsUser) without a runtime crash from accessing a missing property.",
      tests: [
        "parseJson correctly returns unknown rather than any",
        "isUser is correctly implemented as a type guard (using the value is User syntax) and correctly distinguishes valid from invalid data",
      ],
      hint: "'id' in value only works once TypeScript already knows value is some kind of object, which is why the typeof value === 'object' && value !== null checks need to come first in the type guard.",
      lessonAssessment: [
        {
          question: "What is the key difference between any and unknown?",
          options: [
            "There is no real difference; they're interchangeable",
            "unknown accepts any value but blocks property access and method calls until the value is narrowed; any allows anything with no checks",
            "any is only for primitive values; unknown is only for objects",
            "unknown cannot be used as a function's return type",
          ],
          correctAnswerIndex: 1,
          explanation: "Both accept any value, but unknown requires you to prove what the value actually is (through narrowing) before you're allowed to use it, while any skips that requirement entirely.",
        },
        {
          question: "What does the return type value is User on a function like isUser(value: unknown) mean?",
          options: [
            "The function always returns the literal type User",
            "It marks the function as a type guard: when it returns true, TypeScript narrows the checked value to User in that branch",
            "It has no special meaning beyond a regular boolean return type",
            "It converts value into a User at runtime automatically",
          ],
          correctAnswerIndex: 1,
          explanation: "value is User is a type predicate; it tells TypeScript that a true result means the argument can safely be treated as a User from that point on.",
        },
      ],
      commonMistakes: [
        "Reaching for as User (a type assertion) to silence a type error on unknown data instead of writing a real type guard that actually checks the shape at runtime.",
        "Checking 'id' in value before first confirming typeof value === 'object' && value !== null, which fails to compile because the in operator needs TypeScript to already know value could be an object.",
      ],
      deliverables: ["main.ts with a parseJson function returning unknown and an isUser type guard used to safely narrow parsed data"],
      assessmentCriteria: [
        "parseJson correctly returns unknown instead of any",
        "isUser is correctly implemented as a type guard and correctly used to safely narrow both a valid and an invalid parsed value",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "typescript",
        code:
          'interface User {\n  id: number;\n  name: string;\n}\n\nfunction parseJson(text: string): unknown {\n  return JSON.parse(text);\n}\n\nfunction isUser(value: unknown): value is User {\n  return (\n    typeof value === "object" &&\n    value !== null &&\n    "id" in value &&\n    "name" in value &&\n    typeof (value as { id: unknown }).id === "number" &&\n    typeof (value as { name: unknown }).name === "string"\n  );\n}\n\nfunction assertIsUser(value: unknown): asserts value is User {\n  if (!isUser(value)) {\n    throw new Error("Invalid user data");\n  }\n}\n\nconst validParsed = parseJson(\'{"id": 1, "name": "Ada"}\');\nif (isUser(validParsed)) {\n  console.log("Valid user:", validParsed.name);\n} else {\n  console.log("Invalid user data");\n}\n\nconst invalidParsed = parseJson(\'{"foo": "bar"}\');\ntry {\n  assertIsUser(invalidParsed);\n  console.log("Valid user:", invalidParsed.name);\n} catch (error) {\n  console.log("Rejected:", error instanceof Error ? error.message : error);\n}',
        explanation: "parseJson correctly returns unknown, and both isUser and assertIsUser prove the shape of the data at runtime before any code is allowed to treat it as a User, catching the invalid case instead of silently trusting it.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Strict tsconfig Flags and Incremental JS-to-TS Migration",
      goal: "Know a handful of strict tsconfig flags worth enabling on a team project, and understand the incremental strategy for migrating an existing JavaScript codebase to TypeScript.",
      videoTitle: "Strict TypeScript Config Flags and Migrating from JavaScript",
      videoSearchQuery: "typescript strict tsconfig flags migrate javascript to typescript incrementally tutorial",
      videoLearningGoal: "See what noUncheckedIndexedAccess and similar strict flags actually change about the code you write, and the incremental steps a team takes to migrate an existing JS codebase.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "noUncheckedIndexedAccess makes array and index-signature lookups return T | undefined instead of just T, forcing you to actually handle the case where an index doesn't exist, the way accessing an array in real JavaScript can behave.",
        "Flags like noImplicitAny, strictNullChecks, and noUncheckedIndexedAccess can be enabled one at a time on an existing codebase, fixing the errors each one surfaces before turning on the next, rather than flipping 'strict': true all at once.",
        "Migrating an existing JavaScript codebase to TypeScript incrementally usually starts with allowJs and checkJs (type-checking .js files without converting them yet), then renaming files to .ts one at a time, starting with the ones other files depend on least.",
      ],
      notes:
        "Real teams rarely start a project with every strict flag on, and rarely migrate an entire codebase from JavaScript in one pass either. Both processes work the same way: turn on one more piece of safety, see what it surfaces, fix it, and repeat, so the codebase is always in a working state.",
      conceptExplanation:
        "With noUncheckedIndexedAccess enabled, const items: string[] = ['a', 'b']; const first: string = items[0]; would actually fail to compile, because items[0] is really string | undefined (nothing stops you from writing items[99] in real code); the fix is writing a small helper like function getAt<T>(items: T[], index: number): T | undefined { return items[index]; } and handling the undefined case explicitly wherever you read from an array by index. For migrating an existing JavaScript project, the typical order is: add a tsconfig.json with allowJs: true and checkJs: true so .js files get type-checked using inferred types and JSDoc comments without renaming anything yet; fix the errors that surfaces; then rename files to .ts one at a time, usually leaf files (the ones nothing else depends on) first, so each rename is a small, reviewable, low-risk step instead of one enormous rewrite.",
      whyItMatters: "Knowing which strict flags actually change your code, and how to adopt them (or migrate to TypeScript at all) incrementally, is what makes it realistic to raise a team's type safety over time instead of it staying an all-or-nothing decision nobody wants to make.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Write a generic helper function getAt<T>(items: T[], index: number): T | undefined that returns undefined instead of letting an out-of-range index silently return undefined typed as T (the exact behavior noUncheckedIndexedAccess would force you to handle). Use it to read a few indexes from a sample array, including at least one out-of-range index, and handle the undefined case explicitly each time with a clear fallback or message, instead of assuming the value is always present. Then declare and print a const MIGRATION_STEPS: string[] listing, in order, the concrete steps you'd take to migrate an existing JavaScript codebase to TypeScript incrementally.",
      challenge: "Write a const RECOMMENDED_STRICT_FLAGS: string[] listing at least four strict tsconfig flags worth enabling on a team project (such as noImplicitAny, strictNullChecks, noUncheckedIndexedAccess, and noImplicitOverride), and for each one include a short one-line reason as part of the string, then print the full list.",
      expectedResult: "getAt correctly returns undefined for an out-of-range index instead of an unchecked value, every call site explicitly handles that possibility, and the printed MIGRATION_STEPS clearly lists a realistic, ordered incremental migration plan.",
      tests: [
        "getAt<T> is correctly typed to return T | undefined, and every call site explicitly handles the undefined case",
        "MIGRATION_STEPS lists a coherent, ordered set of concrete steps for incrementally migrating a JavaScript codebase to TypeScript",
      ],
      hint: "Think of getAt<T> as manually modeling exactly what noUncheckedIndexedAccess would force the compiler to require of you automatically, if it were enabled in this workspace's configuration.",
      lessonAssessment: [
        {
          question: "What does enabling noUncheckedIndexedAccess change about reading from an array by index, like items[0]?",
          options: [
            "Nothing; it only affects object properties, not arrays",
            "The result becomes T | undefined instead of just T, forcing you to handle the possibility the index doesn't exist",
            "It prevents you from using bracket indexing on arrays at all",
            "It automatically throws a runtime error for out-of-range indexes",
          ],
          correctAnswerIndex: 1,
          explanation: "noUncheckedIndexedAccess reflects the real possibility of an out-of-range index by typing the result as T | undefined, requiring an explicit check.",
        },
        {
          question: "What is the recommended approach for adopting several new strict tsconfig flags on an existing codebase?",
          options: [
            "Enable every strict flag at once, then fix however many errors appear",
            "Enable one flag at a time, fix the errors it surfaces, and only then enable the next one",
            "Strict flags can only be enabled on brand-new projects, never existing ones",
            "Avoid strict flags entirely on any codebase larger than one file",
          ],
          correctAnswerIndex: 1,
          explanation: "Enabling flags one at a time keeps each step small and reviewable, rather than facing an overwhelming, unsorted pile of errors from turning everything on simultaneously.",
        },
      ],
      commonMistakes: [
        "Enabling 'strict': true (or several individual flags) all at once on a large existing codebase and getting overwhelmed by hundreds of errors with no clear starting point.",
        "Trying to rewrite an entire JavaScript codebase to TypeScript in one huge pass instead of using allowJs/checkJs and converting files incrementally, starting with the ones fewest other files depend on.",
      ],
      deliverables: ["main.ts with a getAt<T> helper modeling noUncheckedIndexedAccess-style safety and a printed MIGRATION_STEPS list"],
      assessmentCriteria: [
        "getAt<T> is correctly typed to return T | undefined, with every call site explicitly handling that possibility",
        "MIGRATION_STEPS describes a coherent, realistic, ordered incremental migration plan from JavaScript to TypeScript",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "typescript",
        code:
          'function getAt<T>(items: T[], index: number): T | undefined {\n  return items[index];\n}\n\nconst fruits = ["apple", "banana", "cherry"];\n\nconst first = getAt(fruits, 0);\nconsole.log(first ? first.toUpperCase() : "No fruit at that index");\n\nconst missing = getAt(fruits, 10);\nconsole.log(missing ? missing.toUpperCase() : "No fruit at that index");\n\nconst MIGRATION_STEPS: string[] = [\n  "1. Add a tsconfig.json with allowJs and checkJs so existing .js files get type-checked without renaming anything yet.",\n  "2. Fix the type errors checkJs surfaces, using JSDoc comments to add types where inference alone isn\'t enough.",\n  "3. Rename leaf files (the ones fewest other files depend on) from .js to .ts first, one at a time.",\n  "4. Gradually enable strict flags one at a time (noImplicitAny, strictNullChecks, and so on), fixing each round of errors before enabling the next flag.",\n  "5. Keep allowJs on until every remaining .js file has been converted, then remove it once the migration is complete.",\n];\n\nconsole.log(MIGRATION_STEPS.join("\\n"));',
        explanation: "getAt<T> manually models the exact safety noUncheckedIndexedAccess would enforce automatically, and MIGRATION_STEPS lays out a realistic, ordered plan for incrementally adopting TypeScript on an existing JavaScript codebase.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Writing Production-Quality TypeScript Assessment",
    questions: [
      {
        question: "Why might an internal User type and a public UserDto type intentionally be different, rather than one shared type?",
        options: [
          "TypeScript requires a Dto suffix on every exported type",
          "So internal-only fields, like a password hash, can never accidentally leak into data that crosses a boundary",
          "There's no real reason to ever separate them",
          "Dto types can only be used with classes",
        ],
        correctAnswerIndex: 1,
        explanation: "Keeping the types separate, with an explicit mapping function, guarantees sensitive internal fields are deliberately excluded from boundary-crossing data.",
      },
      {
        question: "What does import type { User } from './types' communicate compared to a normal import?",
        options: [
          "That the import is only used for type checking, not for any runtime value",
          "That User is being renamed to type at import time",
          "That the import should be lazy-loaded at runtime",
          "It has no different meaning from a normal import",
        ],
        correctAnswerIndex: 0,
        explanation: "import type explicitly marks an import as type-only, keeping type-only and runtime dependencies clearly distinguished as a codebase grows.",
      },
      {
        question: "What is the key difference between any and unknown?",
        options: [
          "They behave identically",
          "unknown accepts any value but blocks its use until narrowed; any allows any use with no safety checks",
          "any only applies to objects, unknown only applies to primitives",
          "unknown cannot be a function parameter type",
        ],
        correctAnswerIndex: 1,
        explanation: "Both accept any value, but unknown requires proving the value's actual shape (narrowing) before it can be used, unlike any.",
      },
      {
        question: "What does a type guard function like function isUser(value: unknown): value is User actually do?",
        options: [
          "It converts any value into a User automatically",
          "When it returns true, TypeScript narrows the checked value to User for the rest of that branch",
          "It has no special compile-time effect, only a runtime one",
          "It prevents the function from ever returning false",
        ],
        correctAnswerIndex: 1,
        explanation: "The value is User type predicate tells TypeScript's narrowing exactly what a true return value means for the checked argument.",
      },
      {
        question: "What does an assertion function like function assertIsUser(value: unknown): asserts value is User do differently from a type guard?",
        options: [
          "Nothing; they behave identically in every way",
          "It throws when the check fails, and narrows the value for the rest of the enclosing scope without needing an explicit if block",
          "It can only be used inside a class",
          "It converts the value into a string",
        ],
        correctAnswerIndex: 1,
        explanation: "An assertion function narrows by throwing on failure, so any code reachable after a successful call is automatically narrowed, unlike a type guard which requires an if check.",
      },
      {
        question: "What does enabling noUncheckedIndexedAccess change about array indexing, like items[0]?",
        options: [
          "Nothing changes",
          "The result type becomes T | undefined instead of just T, reflecting that the index might not exist",
          "It disables bracket indexing on arrays entirely",
          "It only affects object property access, never arrays",
        ],
        correctAnswerIndex: 1,
        explanation: "noUncheckedIndexedAccess makes indexed access results include undefined, forcing explicit handling of a possibly missing value.",
      },
      {
        question: "What is the recommended way to adopt several new strict tsconfig flags on a large existing codebase?",
        options: [
          "Enable all of them simultaneously and fix whatever errors appear",
          "Enable one flag at a time, fixing the errors it surfaces before enabling the next",
          "Strict flags should never be added to an existing codebase",
          "Only enable strict flags in test files, never in source files",
        ],
        correctAnswerIndex: 1,
        explanation: "Enabling flags incrementally keeps each round of fixes small and manageable, rather than facing an overwhelming batch of errors all at once.",
      },
      {
        question: "In an incremental JavaScript-to-TypeScript migration, what do allowJs and checkJs let a team do first?",
        options: [
          "Immediately delete all .js files",
          "Type-check existing .js files (using inference and JSDoc) before renaming anything to .ts",
          "Skip type checking entirely for the whole project",
          "Automatically convert every .js file to .ts overnight",
        ],
        correctAnswerIndex: 1,
        explanation: "allowJs and checkJs let existing JavaScript files be type-checked in place, surfacing issues to fix before committing to renaming files.",
      },
      {
        question: "In an incremental migration, which files are typically renamed from .js to .ts first?",
        options: [
          "The largest files in the codebase, regardless of dependencies",
          "Leaf files that few or no other files depend on, so each rename stays a small, low-risk step",
          "Only test files, never source files",
          "Files are always renamed in alphabetical order",
        ],
        correctAnswerIndex: 1,
        explanation: "Starting with files that have the fewest dependents keeps each conversion step small and easy to review, rather than triggering a cascade of changes.",
      },
      {
        question: "Why does the getAt<T> helper in this module's practical task return T | undefined instead of just T?",
        options: [
          "It's an arbitrary stylistic choice with no real benefit",
          "It manually models the safety noUncheckedIndexedAccess would enforce automatically, acknowledging an index might be out of range",
          "TypeScript requires all generic functions to return a union type",
          "T | undefined always means the function failed",
        ],
        correctAnswerIndex: 1,
        explanation: "Returning T | undefined honestly reflects that an index-based lookup might not find anything, the same guarantee noUncheckedIndexedAccess would enforce at the compiler level.",
      },
    ],
  },
  assignment:
    "Build a 'Safe Config Loader': write function parseConfig(text: string): unknown wrapping JSON.parse, define interface AppConfig with apiUrl: string and timeoutMs: number, and write a type guard isAppConfig(value: unknown): value is AppConfig checking both fields' presence and types. Write function loadConfig(text: string): AppConfig that parses the text, and either returns a valid AppConfig or throws a clear error naming exactly what was invalid, using isAppConfig internally rather than any type assertion. Call loadConfig with one valid JSON string and one invalid one (inside a try/catch for the invalid case), printing the successfully loaded config and the caught error message respectively.",
  assignmentDeliverables: [
    "main.ts with an AppConfig interface, an isAppConfig type guard, and a loadConfig function using unknown and narrowing rather than any",
    "Printed output demonstrating both a successful load and a caught, clearly described failure",
  ],
  assignmentAssessmentCriteria: [
    "isAppConfig correctly narrows unknown to AppConfig based on real runtime checks, with no use of any",
    "loadConfig correctly succeeds for valid input and throws a clear, specific error for invalid input",
  ],
  miniProject:
    "Build a 'Typed Data Boundary Layer': define an internal interface Order with id: number, customerName: string, internalNotes: string, and total: number, and a public interface OrderDto with only id, customerName, and total. Write toOrderDto(order: Order): OrderDto and toOrderDtoList(orders: Order[]): OrderDto[]. Separately, write function parseOrders(text: string): unknown wrapping JSON.parse, a type guard isOrderArray(value: unknown): value is Order[] that checks the value is an array where every element has the right shape, and function loadOrders(text: string): OrderDto[] that parses, narrows with isOrderArray (throwing a clear error if the shape doesn't match), and maps the result through toOrderDtoList before returning it. Call loadOrders with a valid JSON string representing a few orders and print the result, confirming internalNotes never appears in the output, then call it with invalid JSON inside a try/catch and print the caught error.",
  miniProjectDeliverables: [
    "main.ts with separate Order and OrderDto types, mapping functions between them, and a parseOrders/isOrderArray/loadOrders pipeline built entirely on unknown and narrowing",
    "Printed output showing successfully loaded orders with internalNotes correctly excluded",
    "Printed output showing a caught, clearly described error for invalid input",
  ],
  miniProjectAssessmentCriteria: [
    "Order and OrderDto are correctly kept separate, with toOrderDto/toOrderDtoList correctly excluding internalNotes",
    "loadOrders correctly uses unknown and a real type guard (not any or an unchecked assertion) to safely validate and load parsed data",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
