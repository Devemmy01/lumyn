import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module3: GeneratedModule = {
  title: "Utility Types",
  description:
    "Stop rewriting near-duplicate interfaces by hand: use TypeScript's built-in utility types, Partial, Pick, Omit, Record, and Readonly, to derive new shapes from types you already have, and see the mapped type idea that powers them.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Partial and Pick: Deriving Smaller Shapes",
      goal: "Use Partial<T> to make every property of a type optional, and Pick<T, Keys> to select only some properties from it.",
      videoTitle: "TypeScript Utility Types: Partial and Pick Explained",
      videoSearchQuery: "typescript partial pick utility types tutorial",
      videoLearningGoal: "See Partial and Pick each derive a new, smaller type from an existing interface without rewriting it by hand.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "Partial<T> produces a new type where every property of T becomes optional, useful for things like an update function that only changes some fields.",
        "Pick<T, \"a\" | \"b\"> produces a new type containing only the listed properties of T, with their original required or optional status kept.",
        "Both are generic utility types built into TypeScript itself; you use them by filling in T (and keys, for Pick) rather than importing anything.",
      ],
      notes:
        "You've built interfaces from scratch so far. Often what you actually need is a slightly different version of a type you already have: the same shape but with every field optional, or just a couple of its fields. Rewriting a second, near-duplicate interface for that is exactly what utility types exist to avoid.",
      conceptExplanation:
        "Given interface User { id: number; name: string; email: string; age: number }, Partial<User> produces a type equivalent to { id?: number; name?: string; email?: string; age?: number }, every property optional. This is the standard shape for an update function: function updateUser(id: number, changes: Partial<User>): void, since a caller should be able to pass only the fields they want to change. Pick<User, \"id\" | \"name\"> produces a type equivalent to { id: number; name: string }, containing only the listed keys with their original modifiers preserved. Pick is useful for narrowing a large interface down to exactly the subset a function actually needs, such as a summary view that only shows id and name without exposing email or age.",
      whyItMatters: "Partial and Pick let you derive precise, smaller types from a single source of truth interface, so updating that interface automatically keeps every derived type correct instead of drifting out of sync.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define interface User { id: number; name: string; email: string; age: number }. Write a function updateUser(user: User, changes: Partial<User>): User that returns a new object combining user and changes using the spread operator. Call it with a full User object and a changes object containing only one or two fields, printing the merged result. Then define type UserSummary = Pick<User, \"id\" | \"name\">, create one UserSummary object, and print it.",
      challenge: "Write a function toSummary(user: User): UserSummary that returns only the id and name from a full User object, and call it with your original user, printing the result.",
      expectedResult: "The program prints the merged User object from updateUser with only the intended fields changed, then the UserSummary object containing exactly id and name.",
      tests: ["Partial<User> is used as the type of the changes parameter in updateUser", "UserSummary is declared using Pick<User, \"id\" | \"name\">, not a hand-written duplicate interface"],
      hint: "{ ...user, ...changes } spreads user first, then overwrites any matching fields with values from changes, since later spread properties override earlier ones.",
      lessonAssessment: [
        {
          question: "What does Partial<User> produce, given interface User { id: number; name: string }?",
          options: [
            "A type identical to User with no changes",
            "A type where every property of User becomes optional",
            "A type with only the id property",
            "A type with no properties at all",
          ],
          correctAnswerIndex: 1,
          explanation: "Partial<T> derives a new type where every property from T is marked optional, useful for representing partial updates.",
        },
        {
          question: "What does Pick<User, \"id\" | \"name\"> produce?",
          options: [
            "A type with every property of User except id and name",
            "A type containing only the id and name properties from User",
            "A type identical to Partial<User>",
            "An error, since Pick requires exactly one key",
          ],
          correctAnswerIndex: 1,
          explanation: "Pick<T, Keys> selects only the listed keys from T, producing a smaller type containing just those properties.",
        },
      ],
      commonMistakes: ["Hand-writing a second, separate interface like interface UserUpdate { id?: number; name?: string; ... } instead of deriving it with Partial<User>, which falls out of sync if User later changes.", "Passing a string key to Pick that doesn't actually exist on the source type, which TypeScript correctly rejects at compile time."],
      deliverables: ["A script defining User, an updateUser function typed with Partial<User>, and a UserSummary type built with Pick"],
      assessmentCriteria: ["Partial<User> and Pick<User, ...> are both used correctly to derive new types from User", "updateUser correctly merges partial changes into a full User object"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code: 'interface User {\n  id: number;\n  name: string;\n  email: string;\n  age: number;\n}\n\nfunction updateUser(user: User, changes: Partial<User>): User {\n  return { ...user, ...changes };\n}\n\ntype UserSummary = Pick<User, "id" | "name">;\n\nconst user: User = { id: 1, name: "Ada", email: "ada@example.test", age: 30 };\nconst updated = updateUser(user, { age: 31 });\nconst summary: UserSummary = { id: user.id, name: user.name };\n\nconsole.log(updated);\nconsole.log(summary);',
        explanation: "Partial<User> lets updateUser accept just the fields being changed, while Pick<User, \"id\" | \"name\"> derives a smaller UserSummary type from the same source interface.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Omit and Record: Removing Fields and Building Dictionaries",
      goal: "Use Omit<T, Keys> to exclude specific properties from a type, and Record<Keys, ValueType> to build a dictionary type with a fixed value type.",
      videoTitle: "TypeScript Utility Types: Omit and Record Explained",
      videoSearchQuery: "typescript omit record utility types tutorial",
      videoLearningGoal: "See Omit strip properties out of an existing type, and Record build a dictionary type from a set of keys and one value type.",
      recommendedChannels: ["Web Dev Simplified", "Jack Herrington"],
      keyTakeaways: [
        "Omit<T, \"a\" | \"b\"> produces a new type with every property of T except the ones listed, the opposite of Pick.",
        "Record<Keys, ValueType> builds an object type where every key from Keys maps to a value of type ValueType.",
        "Omit is common for hiding sensitive or server-generated fields (like id or password) from a type used for input data.",
      ],
      notes:
        "Where Pick keeps only the properties you list, Omit removes only the properties you list and keeps everything else. Record takes a different approach entirely: instead of deriving from an existing object type, it builds a fresh dictionary type from a set of keys and a value type you specify.",
      conceptExplanation:
        "Given interface User { id: number; name: string; email: string; password: string }, Omit<User, \"id\" | \"password\"> produces a type equivalent to { name: string; email: string }, useful for a signup form's input shape that shouldn't include a server-generated id or expose the raw password field after creation. Record<\"admin\" | \"editor\" | \"viewer\", number> produces a type equivalent to { admin: number; editor: number; viewer: number }, exactly one property per listed key, each holding a number. Record<string, T> (using the general string type as the key rather than specific literal keys) behaves very similarly to an index signature { [key: string]: T }, and is often the more concise way to write the same idea.",
      whyItMatters: "Omit and Record cover the two most common shape-derivation needs in real code: stripping sensitive or irrelevant fields from a type, and building a strongly typed dictionary from a known or general set of keys.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define interface User { id: number; name: string; email: string; password: string }. Define type SignupInput = Omit<User, \"id\" | \"password\">, create one SignupInput object, and print it. Then define type RoleCounts = Record<\"admin\" | \"editor\" | \"viewer\", number>, create one RoleCounts object with a count for each role, and print the total using Object.values() and reduce().",
      challenge: "Define a second Record type, type RolePermissions = Record<\"admin\" | \"editor\" | \"viewer\", string[]>, create one object listing at least two permission strings per role, and print the permissions array for the \"editor\" role.",
      expectedResult: "The program prints the SignupInput object with only name and email, then the RoleCounts object and its correctly summed total across all three roles.",
      tests: ["SignupInput is declared using Omit<User, \"id\" | \"password\">, not a hand-written duplicate interface", "RoleCounts is declared using Record with exactly the three listed role keys, each mapping to a number"],
      hint: "Record<\"admin\" | \"editor\" | \"viewer\", number> requires an object literal to include every one of the three listed keys, not just some of them.",
      lessonAssessment: [
        {
          question: "What does Omit<User, \"id\" | \"password\"> produce, given interface User { id: number; name: string; password: string }?",
          options: [
            "A type with only id and password",
            "A type with every property of User except id and password",
            "A type identical to User",
            "A type with no properties",
          ],
          correctAnswerIndex: 1,
          explanation: "Omit<T, Keys> removes the listed keys from T and keeps everything else, the opposite behavior of Pick.",
        },
        {
          question: "What does Record<\"admin\" | \"editor\" | \"viewer\", number> produce?",
          options: [
            "An array of three numbers",
            "An object type with exactly the keys admin, editor, and viewer, each required to map to a number",
            "A union of three string literals",
            "A function that counts roles",
          ],
          correctAnswerIndex: 1,
          explanation: "Record<Keys, ValueType> builds a dictionary-shaped object type, requiring every listed key to be present and map to the given value type.",
        },
      ],
      commonMistakes: ["Using Pick when the intent is actually to remove a couple of fields and keep the rest, requiring you to list every field except the ones you don't want, which Omit does more directly.", "Creating a Record object literal that is missing one of the required listed keys, which TypeScript correctly rejects since every key in a Record's key union is required by default."],
      deliverables: ["A script defining SignupInput with Omit and RoleCounts with Record, both derived correctly"],
      assessmentCriteria: ["Omit and Record are both used correctly with the appropriate keys and value types", "Object literals for both derived types satisfy their full requirements"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code: 'interface User {\n  id: number;\n  name: string;\n  email: string;\n  password: string;\n}\n\ntype SignupInput = Omit<User, "id" | "password">;\ntype RoleCounts = Record<"admin" | "editor" | "viewer", number>;\n\nconst signup: SignupInput = { name: "Grace", email: "grace@example.test" };\nconst roleCounts: RoleCounts = { admin: 2, editor: 5, viewer: 20 };\n\nconst total = Object.values(roleCounts).reduce((sum, count) => sum + count, 0);\n\nconsole.log(signup);\nconsole.log(roleCounts, total);',
        explanation: "SignupInput strips id and password out of User with Omit, while RoleCounts uses Record to require exactly the three named roles, each mapping to a number.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Readonly and a Peek Under the Hood: Mapped Types",
      goal: "Use Readonly<T> to prevent property reassignment, and understand conceptually how utility types like Partial and Readonly are built from mapped types.",
      videoTitle: "TypeScript Readonly and Mapped Types Explained",
      videoSearchQuery: "typescript readonly utility type mapped types explained",
      videoLearningGoal: "See Readonly<T> block a property reassignment at compile time, and get a first look at the mapped type syntax that generates utility types like it.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "Readonly<T> produces a new type where every property of T becomes read-only, so reassigning any of them after creation is a compile-time error.",
        "Readonly only prevents reassignment at the type level during compilation; it does not freeze the object at runtime the way Object.freeze() does.",
        "Partial, Readonly, Pick, and Omit are all implemented internally using a mapped type, a pattern that loops over a type's keys with [K in keyof T] to build a new type.",
      ],
      notes:
        "Readonly<T> is the last of the core utility types for this module: it takes every property of T and makes it read-only, so TypeScript flags any attempt to reassign that property later in the code as a compile-time error.",
      conceptExplanation:
        "Given interface Config { debug: boolean; retries: number }, Readonly<Config> produces a type equivalent to { readonly debug: boolean; readonly retries: number }. const settings: Readonly<Config> = { debug: false, retries: 3 } is created fine, but settings.retries = 5 afterward is a compile-time error, since retries is now read-only. It's worth knowing this protection is purely a compile-time type check: it does not call Object.freeze() behind the scenes, so code that bypasses the type checker (such as accessing the object through any) could still technically mutate it at runtime. Under the hood, Partial<T>, Readonly<T>, Pick<T, K>, and similar utility types are all built using a mapped type, a pattern that loops over a type's keys and transforms each one: Partial<T> is conceptually equivalent to { [K in keyof T]?: T[K] }, and Readonly<T> is conceptually equivalent to { [K in keyof T]: readonly T[K] }. You are not expected to write your own mapped types yet, that's an advanced topic, but recognizing this [K in keyof T] pattern helps explain why these utility types behave the way they do, and why they cleanly apply to any interface you give them.",
      whyItMatters: "Readonly protects configuration and constant data from accidental reassignment while you're still writing code, and understanding that utility types come from a general mapped-type pattern makes their consistent, predictable behavior far less mysterious.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define interface Config { debug: boolean; retries: number; apiVersion: string }. Create a Readonly<Config> object with all three properties, and print it. In a comment directly below it, write the line of code that would try to reassign one of its properties (for example, settings.retries = 5;), and write a one-line explanation of why TypeScript rejects that specific line at compile time.",
      challenge: "Write, as a comment, the mapped type declaration you believe Readonly<Config> is conceptually equivalent to for this specific Config interface, spelling out all three properties by hand as readonly.",
      expectedResult: "The program prints the Readonly<Config> object correctly, and the accompanying comments clearly show both the rejected reassignment line and a correct explanation of why it fails to compile.",
      tests: ["A Readonly<Config> object is correctly created with all required properties", "A comment demonstrates the specific reassignment TypeScript would reject, with an accurate explanation of why"],
      hint: "Readonly<T> only stops you from writing settings.someProperty = newValue after the object is created; it does not stop you from reading any property.",
      lessonAssessment: [
        {
          question: "What does Readonly<Config> do to every property of Config?",
          options: [
            "Makes every property optional",
            "Makes every property read-only, so reassigning it later is a compile-time error",
            "Deletes every property",
            "Converts every property to a string",
          ],
          correctAnswerIndex: 1,
          explanation: "Readonly<T> marks every property of T as read-only, so TypeScript flags any later reassignment of those properties as a compile-time error.",
        },
        {
          question: "Which pattern do utility types like Partial<T> and Readonly<T> conceptually rely on internally?",
          options: [
            "A regular expression that scans the type's name",
            "A mapped type, which loops over a type's keys with [K in keyof T] and transforms each one",
            "A runtime function that inspects the object",
            "There is no internal pattern; each utility type is unrelated to the others",
          ],
          correctAnswerIndex: 1,
          explanation: "Partial, Readonly, Pick, and similar utility types are all built from the mapped type pattern, which iterates over keyof T to transform each property consistently.",
        },
      ],
      commonMistakes: ["Assuming Readonly<T> freezes the object at runtime the way Object.freeze() does, when it is actually only a compile-time type check with no runtime effect on its own.", "Trying to reassign a property on a Readonly<T> value and being surprised by the compile error instead of recognizing it as the intended protection."],
      deliverables: ["A script creating a Readonly<Config> object with comments demonstrating and explaining the reassignment restriction"],
      assessmentCriteria: ["The Readonly<Config> object is created correctly with all required properties present", "The accompanying comment and explanation correctly identify why a reassignment would fail to compile"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code: 'interface Config {\n  debug: boolean;\n  retries: number;\n  apiVersion: string;\n}\n\nconst settings: Readonly<Config> = {\n  debug: false,\n  retries: 3,\n  apiVersion: "v2",\n};\n\nconsole.log(settings);\n\n// settings.retries = 5;\n// The line above would not compile: Readonly<Config> marks every\n// property as read-only, so reassigning retries after creation is a\n// compile-time error, even though reading settings.retries works fine.\n\n// Conceptually, Readonly<Config> behaves like:\n// { readonly debug: boolean; readonly retries: number; readonly apiVersion: string }',
        explanation: "settings is created once and printed successfully, while the commented-out reassignment shows exactly what Readonly<Config> blocks and the mapped-type shape it conceptually expands to.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Utility Types Assessment",
    questions: [
      { question: "What does Partial<User> produce, given interface User { id: number; name: string }?", options: ["A type identical to User", "A type where every property of User becomes optional", "A type with only id", "An empty type"], correctAnswerIndex: 1, explanation: "Partial<T> makes every property from T optional in the derived type." },
      { question: "What does Pick<User, \"id\" | \"name\"> produce?", options: ["Every property of User except id and name", "Only the id and name properties from User", "The same as Partial<User>", "A type error"], correctAnswerIndex: 1, explanation: "Pick<T, Keys> keeps only the listed keys from T." },
      { question: "What does Omit<User, \"password\"> produce, given interface User { id: number; password: string }?", options: ["Only the password property", "Every property of User except password", "An empty type", "Exactly the same type as User"], correctAnswerIndex: 1, explanation: "Omit<T, Keys> removes the listed keys and keeps every other property of T." },
      { question: "What does Record<\"admin\" | \"editor\", number> require of an object literal assigned to it?", options: ["At least one of the two keys", "Exactly the two listed keys, each mapping to a number", "Any number of arbitrary string keys", "No keys at all"], correctAnswerIndex: 1, explanation: "Record<Keys, ValueType> requires every key in the Keys union to be present, each mapped to the given value type." },
      { question: "What does Readonly<Config> do to Config's properties?", options: ["Deletes them", "Makes them all optional", "Makes them all read-only, blocking reassignment at compile time", "Converts them all to strings"], correctAnswerIndex: 2, explanation: "Readonly<T> marks every property of T as read-only, causing a compile-time error on any later reassignment." },
      { question: "Does Readonly<T> freeze the underlying object at runtime the way Object.freeze() does?", options: ["Yes, it is identical to Object.freeze()", "No, it is a compile-time type check only, with no runtime enforcement on its own", "Only for arrays", "Only for numbers"], correctAnswerIndex: 1, explanation: "Readonly<T> is purely a compile-time restriction; it does not call Object.freeze() or provide any runtime protection by itself." },
      { question: "What pattern do Partial, Readonly, Pick, and Omit share internally?", options: [
          "They are all unrelated built-in keywords with no shared pattern",
          "They are all conceptually built from a mapped type, using [K in keyof T] to transform each property",
          "They all require an explicit import from a separate library",
          "They can only be used with arrays",
        ], correctAnswerIndex: 1, explanation: "These utility types are all conceptually implemented as mapped types, looping over a type's keys with [K in keyof T] and transforming each one." },
      { question: "Which utility type is the most direct fit for a signup form's input, which should exclude a server-generated id field?", options: ["Partial<User>", "Readonly<User>", "Omit<User, \"id\">", "Record<\"id\", number>"], correctAnswerIndex: 2, explanation: "Omit removes the specified field (id) while keeping every other property, which matches excluding a server-generated field from an input shape." },
      { question: "Why is Partial<T> a better fit than a hand-written second interface for an update function's parameter type?", options: [
          "Partial<T> runs faster",
          "Partial<T> stays in sync automatically if T's properties change later, while a hand-written duplicate can drift out of date",
          "A hand-written interface cannot have optional properties",
          "There is no difference between the two approaches",
        ], correctAnswerIndex: 1, explanation: "Deriving a type from the source interface with Partial<T> keeps it automatically consistent if the source interface changes, unlike a separately maintained duplicate." },
      { question: "Given const roleCounts: Record<\"admin\" | \"editor\" | \"viewer\", number> = { admin: 1, editor: 2, viewer: 3 }, what would happen if the viewer key were left out of the object literal?", options: [
          "Nothing, viewer would default to 0",
          "TypeScript would report a compile-time error, since Record requires every listed key to be present",
          "The program would still run, just without a viewer property",
          "TypeScript would automatically rename editor to viewer",
        ], correctAnswerIndex: 1, explanation: "Record<Keys, ValueType> requires every key in the Keys union to be present in the object literal, so omitting one is a compile-time error." },
    ],
  },
  assignment:
    "Build a small 'User Profile Deriver': define interface Profile { id: number; username: string; email: string; bio: string; isVerified: boolean }. Define type ProfileUpdate = Partial<Omit<Profile, \"id\">>, combining two utility types so id can never be changed but every other field is optional. Write a function applyUpdate(profile: Profile, update: ProfileUpdate): Profile that returns a merged object using the spread operator. Define type ProfilePreview = Readonly<Pick<Profile, \"username\" | \"bio\">>, create one ProfilePreview object, and print it alongside the result of applyUpdate called with a partial update.",
  assignmentDeliverables: [
    "A script defining Profile, ProfileUpdate (Partial + Omit combined), applyUpdate(), and ProfilePreview (Readonly + Pick combined)",
    "Printed output showing a merged, updated Profile and a ProfilePreview object",
  ],
  assignmentAssessmentCriteria: [
    "ProfileUpdate and ProfilePreview both correctly combine two utility types rather than being hand-written duplicate interfaces",
    "applyUpdate correctly merges a partial update into a full Profile object",
  ],
  miniProject:
    "Build a small 'Permissions Dashboard' script: define interface Feature { key: string; label: string; enabled: boolean }. Define type FeatureFlags = Record<\"billing\" | \"analytics\" | \"betaAccess\", boolean>, and create one FeatureFlags object. Define type FeatureSummary = Omit<Feature, \"key\">, and write a function buildSummaries(flags: FeatureFlags): FeatureSummary[] that converts the FeatureFlags object into an array of FeatureSummary objects using Object.entries(), where label is the flag name and enabled is its boolean value. Print the resulting array. Finally, define type LockedFlags = Readonly<FeatureFlags>, create one LockedFlags object, and print it alongside a comment showing the reassignment line that would fail to compile.",
  miniProjectDeliverables: [
    "A script defining Feature, FeatureFlags (Record), FeatureSummary (Omit), buildSummaries(), and LockedFlags (Readonly)",
    "Printed output showing the FeatureSummary array and a LockedFlags object, with a comment demonstrating the blocked reassignment",
  ],
  miniProjectAssessmentCriteria: [
    "FeatureFlags, FeatureSummary, and LockedFlags each correctly use the appropriate utility type",
    "buildSummaries() correctly transforms the Record-typed object into an array of FeatureSummary objects",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
