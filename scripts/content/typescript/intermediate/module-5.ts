import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module5: GeneratedModule = {
  title: "Working with JSON & External Data Safely",
  description:
    "Type the shape of incoming data you don't fully control, understand the real risk behind the as type assertion, and write a type guard function that safely validates unknown data at runtime before trusting it.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Typing an API Response Shape",
      goal: "Define an interface that describes the shape of parsed JSON data, and use it to type a value returned by JSON.parse().",
      videoTitle: "TypeScript Typing JSON and API Response Shapes",
      videoSearchQuery: "typescript typing json api response shape tutorial",
      videoLearningGoal: "See an interface written to match a real JSON payload's shape, then used to type the result of parsing that JSON string.",
      recommendedChannels: ["Matt Pocock", "Web Dev Simplified"],
      keyTakeaways: [
        "JSON.parse() always returns a value typed as any, since TypeScript cannot know the shape of arbitrary JSON text at compile time.",
        "Writing an interface that matches the expected JSON shape, and applying it to the parsed result, restores type checking on that data.",
        "The interface only describes what you expect the data to look like; TypeScript trusts your description completely and does not verify it against the real data by itself.",
      ],
      notes:
        "Data that arrives as JSON, from an API response, a saved file, or any external source, starts life as plain text. JSON.parse() turns that text into a real JavaScript value, but TypeScript has no way to know its shape ahead of time, so the result is typed any until you tell it otherwise.",
      conceptExplanation:
        "Given a JSON string representing a user profile, const raw = '{\"id\":1,\"name\":\"Ada\",\"email\":\"ada@example.test\"}';, JSON.parse(raw) returns any. Defining interface UserProfile { id: number; name: string; email: string } and writing const profile = JSON.parse(raw) as UserProfile restores full type checking on profile: profile.name is treated as a string, and profile.age would be a compile-time error, since age isn't part of UserProfile. This is genuinely useful, but it's important to understand what TypeScript is actually doing here: it trusts the interface you wrote completely, without checking the real JSON data against it. If the real JSON is missing a field, or a field has the wrong type, JSON.parse() plus a type description will not catch that on its own; it only makes your code convenient and readable once you already trust the shape. Runtime validation of data you don't fully control is covered later in this module.",
      whyItMatters: "Typing the shape of parsed JSON turns an untyped any value into a checked, autocompletable object, which is essential for working productively with any data that comes from outside your own code.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define interface UserProfile { id: number; name: string; email: string }. Create a JSON string variable holding a user profile with all three fields (for example, const raw = '{\"id\":1,\"name\":\"Ada\",\"email\":\"ada@example.test\"}';). Parse it with JSON.parse(raw) as UserProfile, storing the result in a variable typed as UserProfile. Print the parsed profile's name and email properties. Then write a function formatProfile(profile: UserProfile): string that returns a one-line summary, and call it with your parsed profile, printing the result.",
      challenge: "Create a second JSON string representing an array of two user profiles, parse it as UserProfile[], and use a loop or .map() to print each profile's formatted summary using formatProfile().",
      expectedResult: "The program prints the parsed profile's name and email, then the formatted summary string produced by formatProfile(), all correctly typed as UserProfile rather than any.",
      tests: ["UserProfile is defined as an interface matching the JSON string's actual shape", "JSON.parse() is combined with as UserProfile so the parsed result is a typed UserProfile, not left as any"],
      hint: "The variable's declared type only matters to the TypeScript compiler; JSON.parse() itself has no idea what shape the string actually contains.",
      lessonAssessment: [
        {
          question: "What type does JSON.parse() return by default?",
          options: [
            "The exact shape of the JSON string automatically",
            "any, since TypeScript cannot know the shape of arbitrary JSON text at compile time",
            "string, since JSON.parse() takes a string as input",
            "A compile-time error, since JSON.parse() cannot be typed",
          ],
          correctAnswerIndex: 1,
          explanation: "JSON.parse() is typed to return any, because TypeScript has no built-in way to know the shape of arbitrary JSON text without help from you.",
        },
        {
          question: "When you write JSON.parse(raw) as UserProfile, what guarantee does TypeScript actually provide?",
          options: [
            "It verifies the real JSON data matches UserProfile and throws an error if it doesn't",
            "It only tells the compiler to treat the result as UserProfile for type-checking purposes, without verifying the actual data matches that shape",
            "It converts every property to a string automatically",
            "It has no effect on the parsed value at all",
          ],
          correctAnswerIndex: 1,
          explanation: "A type assertion tells the compiler to trust your description of the shape; it does not perform any runtime check that the real data actually matches it.",
        },
      ],
      commonMistakes: ["Leaving the result of JSON.parse() untyped (implicitly any), losing autocomplete and type checking on every property you access from it afterward.", "Assuming that typing a JSON.parse() result with as SomeInterface somehow validates the real data, when it is only a compile-time description the compiler trusts without checking."],
      deliverables: ["A script defining UserProfile, parsing a JSON string into it, and formatting it with a function"],
      assessmentCriteria: ["UserProfile accurately matches the fields present in the JSON string used", "The parsed result is correctly typed as UserProfile rather than left as any"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code: 'interface UserProfile {\n  id: number;\n  name: string;\n  email: string;\n}\n\nconst raw = \'{"id":1,"name":"Ada","email":"ada@example.test"}\';\nconst profile = JSON.parse(raw) as UserProfile;\n\nfunction formatProfile(user: UserProfile): string {\n  return `${user.name} <${user.email}>`;\n}\n\nconsole.log(profile.name, profile.email);\nconsole.log(formatProfile(profile));',
        explanation: "JSON.parse(raw) alone would be typed any, but pairing it with as UserProfile gives profile full type checking that matches the interface, as long as the real JSON actually matches that shape.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Type Assertions with as and Their Risk",
      goal: "Use the as type assertion correctly, and understand exactly why it can hide real bugs if the asserted type is wrong.",
      videoTitle: "TypeScript Type Assertions (as) and Their Risks Explained",
      videoSearchQuery: "typescript type assertion as keyword risk explained",
      videoLearningGoal: "See a type assertion silently accept an incorrect shape, causing a runtime error the compiler had no way to catch.",
      recommendedChannels: ["Total TypeScript", "Matt Pocock"],
      keyTakeaways: [
        "value as SomeType tells the compiler 'trust me, treat this value as SomeType,' without performing any actual runtime check.",
        "If the asserted type is wrong, TypeScript will not catch the mistake, and the incorrect assumption can cause a runtime error somewhere later in the program.",
        "A type assertion is appropriate when you have genuine outside knowledge the compiler lacks; it is not a safe substitute for actually validating untrusted data.",
      ],
      notes:
        "You already used as in the previous lesson to type a JSON.parse() result. Now look closely at what could go wrong: an assertion is a promise you make to the compiler, and the compiler believes it unconditionally, whether or not it's actually true.",
      conceptExplanation:
        "interface UserProfile { id: number; name: string; email: string } combined with const raw = '{\"id\":1,\"name\":\"Ada\"}'; (missing email entirely) and const profile = JSON.parse(raw) as UserProfile; compiles without any error, because the compiler trusts the assertion completely. The bug only appears later, at runtime, the moment something tries to use profile.email, for example console.log(profile.email.toUpperCase()), which crashes because profile.email is actually undefined, not a string. This is the core risk of as: it silences the compiler's checking for that specific value, so a wrong assertion doesn't fail where the mistake actually happened, it fails somewhere else entirely, often much later and harder to trace. A safe use of as is asserting a more specific type when you have real, certain outside knowledge, such as document.getElementById(\"id\") as HTMLInputElement when you know for certain that particular element is an input. An unsafe use is asserting the shape of genuinely untrusted external data with no verification at all, which is what the next lesson's type guard function is designed to fix.",
      whyItMatters: "Understanding that as performs no runtime check is essential for knowing exactly when it's safe to use, and for recognizing incorrect JSON shapes as a common, easy-to-miss source of runtime bugs in real projects.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Reuse interface UserProfile { id: number; name: string; email: string } from the previous lesson. Create a JSON string that is deliberately missing the email field (for example, const raw = '{\"id\":2,\"name\":\"Grace\"}';). Parse it with JSON.parse(raw) as UserProfile, and print profile.name successfully. Then, in a comment directly below, write the exact line of code that would crash at runtime if you tried to use profile.email as a string (for example, console.log(profile.email.toUpperCase());), and write a one-line explanation of why TypeScript did not catch this at compile time.",
      challenge: "Rewrite the same scenario using a safer pattern: check if (typeof profile.email === \"string\") before using profile.email.toUpperCase(), and print either the uppercase email or a fallback message like \"No email on file\" depending on the result, showing a lightweight, partial defense against the missing field.",
      expectedResult: "The program prints profile.name successfully, and the accompanying comment and explanation correctly identify why the missing email field compiles fine but would fail only when actually used at runtime.",
      tests: ["The JSON string used is deliberately missing a field required by UserProfile, demonstrating the assertion's blind trust", "A comment or conditional check correctly identifies and explains the runtime risk created by the type assertion"],
      hint: "TypeScript's type checking happens once, at compile time, based entirely on what you declared; it has no visibility into what the real runtime value actually contains.",
      lessonAssessment: [
        {
          question: "What does the compiler actually verify when you write JSON.parse(raw) as UserProfile?",
          options: [
            "That the real parsed data genuinely matches every field in UserProfile",
            "Nothing about the real data; it simply trusts your assertion and applies the UserProfile type going forward",
            "That raw is valid JSON syntax",
            "That UserProfile has at least one required field",
          ],
          correctAnswerIndex: 1,
          explanation: "A type assertion performs no runtime verification at all; the compiler simply accepts your claim about the value's type and moves on.",
        },
        {
          question: "If a JSON string is missing a field required by the asserted interface, when does the resulting bug typically surface?",
          options: [
            "Immediately, as a compile-time error on the JSON.parse() line",
            "Only later at runtime, the moment code actually tries to use the missing field",
            "It never causes any problem",
            "TypeScript automatically adds the missing field with a default value",
          ],
          correctAnswerIndex: 1,
          explanation: "Since the assertion is trusted at compile time with no verification, a missing or wrong field only causes a visible failure once the program actually tries to use that specific value at runtime.",
        },
      ],
      commonMistakes: ["Using as to silence a type error without checking whether the underlying assumption about the data's shape is actually true.", "Treating a successful compile as proof that JSON.parse(raw) as SomeInterface produced correctly shaped data, when compiling successfully only means the assertion was accepted, not verified."],
      deliverables: ["A script demonstrating a type assertion on data missing a required field, with a comment explaining the resulting runtime risk"],
      assessmentCriteria: ["The example clearly demonstrates a case where the asserted type does not match the real data", "The explanation correctly identifies that TypeScript performs no runtime check for a type assertion"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code: 'interface UserProfile {\n  id: number;\n  name: string;\n  email: string;\n}\n\nconst raw = \'{"id":2,"name":"Grace"}\'; // email is missing on purpose\nconst profile = JSON.parse(raw) as UserProfile;\n\nconsole.log(profile.name); // works fine\n\n// console.log(profile.email.toUpperCase());\n// The line above compiles without error, since the assertion told\n// TypeScript to trust that profile has an email: string. But the real\n// parsed object has no email property, so profile.email is actually\n// undefined at runtime, and calling .toUpperCase() on it would crash.\n\nif (typeof profile.email === "string") {\n  console.log(profile.email.toUpperCase());\n} else {\n  console.log("No email on file");\n}',
        explanation: "The type assertion compiles cleanly even though email is genuinely missing from the JSON, proving the compiler performs no real verification, while the typeof check afterward adds a real, runtime-safe guard around the risky property access.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Writing a Type Guard Function to Validate unknown Data",
      goal: "Write a type guard function that safely validates data typed as unknown at runtime before trusting its shape.",
      videoTitle: "TypeScript Type Guards: Validating unknown Data Safely",
      videoSearchQuery: "typescript type guard function unknown validation tutorial",
      videoLearningGoal: "See a custom type guard function inspect an unknown value's real shape at runtime and safely narrow it, instead of blindly trusting a type assertion.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "unknown is a safer alternative to any for data you don't yet trust: TypeScript forces you to check or narrow it before using it as anything specific.",
        "A type guard function, written as function isX(value: unknown): value is X { ... }, performs a real runtime check and tells TypeScript how to narrow the type if it returns true.",
        "Combining JSON.parse() with unknown and a type guard gives you both real runtime validation and full compile-time type safety, unlike a plain type assertion.",
      ],
      notes:
        "The previous lesson's risk comes from trusting an assertion with no verification. unknown, paired with a type guard function, fixes that: unknown forces you to prove a value's shape before TypeScript will let you treat it as anything specific, and a type guard is where you write that proof as real, runtime-checked code.",
      conceptExplanation:
        "function isUserProfile(value: unknown): value is UserProfile checks, at runtime, that value is a non-null object with id as a number, name as a string, and email as a string, using typeof and property checks, typically after first confirming value is an object with something like typeof value === \"object\" && value !== null. The value is UserProfile part of the return type is what makes this a type guard rather than a plain function returning boolean: after a call like if (isUserProfile(parsed)) { ... }, TypeScript narrows parsed to UserProfile inside that block, because the function proved it at runtime, not because you merely asserted it. const parsed: unknown = JSON.parse(raw); if (isUserProfile(parsed)) { console.log(parsed.email.toUpperCase()); } else { console.log(\"Invalid user profile data\"); } is now genuinely safe: the code only reaches parsed.email.toUpperCase() after real verification that email is actually a string, closing the exact gap that a plain as UserProfile assertion left open.",
      whyItMatters: "A type guard function is the correct way to handle data you don't fully control, giving you real runtime safety backed by TypeScript's compile-time narrowing, instead of the false confidence a type assertion provides on its own.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Reuse interface UserProfile { id: number; name: string; email: string }. Write a type guard function isUserProfile(value: unknown): value is UserProfile that checks value is a non-null object and that id, name, and email each have the correct type. Create two JSON strings, one with a complete, valid UserProfile shape and one missing or with a wrong-typed field, and parse both with JSON.parse() into variables typed unknown. For each one, call isUserProfile() inside an if/else, printing a formatted profile summary on success and a clear \"Invalid user profile data\" message on failure.",
      challenge: "Write a second type guard function isUserProfileArray(value: unknown): value is UserProfile[] that checks value is an array and that every item passes isUserProfile(), using Array.isArray() and .every(). Call it with a JSON array string containing two valid profiles, printing every profile's summary if the guard passes.",
      expectedResult: "The program correctly identifies the valid UserProfile data and prints its formatted summary, while the invalid data is correctly rejected and prints the fallback message instead of crashing.",
      tests: ["isUserProfile is declared with the value is UserProfile return type, making it a real type guard rather than a plain boolean function", "The invalid JSON data is correctly rejected by isUserProfile() and does not reach the code that assumes a valid UserProfile shape"],
      hint: "Checking typeof value === \"object\" && value !== null before accessing any property is essential, since typeof null is also \"object\" in JavaScript.",
      lessonAssessment: [
        {
          question: "What does the value is UserProfile return type on a function signal to TypeScript?",
          options: [
            "That the function always returns true",
            "That the function is a type guard: if it returns true, TypeScript narrows the checked value to UserProfile in that branch",
            "That the function only accepts a UserProfile argument",
            "That UserProfile must be a class, not an interface",
          ],
          correctAnswerIndex: 1,
          explanation: "A value is X return type marks a function as a type guard, telling TypeScript to narrow the argument's type to X in any branch where the function returned true.",
        },
        {
          question: "Why is unknown a safer starting type than any for data returned by JSON.parse() that you don't yet trust?",
          options: [
            "unknown and any behave identically",
            "unknown forces you to check or narrow the value before using it as anything specific, while any allows any operation with no checking at all",
            "unknown automatically validates the data's shape for you",
            "unknown can only be used with numbers",
          ],
          correctAnswerIndex: 1,
          explanation: "unknown blocks property access and most operations until the value has been narrowed through a check like a type guard, unlike any which allows anything without restriction.",
        },
      ],
      commonMistakes: ["Writing a type guard function that returns a plain boolean instead of value is X, which leaves TypeScript unable to narrow the checked value even though the runtime logic is correct.", "Checking only typeof value === \"object\" without also excluding null, since typeof null is \"object\" in JavaScript and would otherwise pass an incomplete check."],
      deliverables: ["A script defining isUserProfile as a real type guard and using it to safely handle both valid and invalid unknown data"],
      assessmentCriteria: ["isUserProfile is correctly declared with a value is UserProfile return type and performs a real runtime check", "Both the valid and invalid test cases are handled correctly and distinctly, without the invalid case ever reaching code that assumes a valid shape"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "typescript",
        code: 'interface UserProfile {\n  id: number;\n  name: string;\n  email: string;\n}\n\nfunction isUserProfile(value: unknown): value is UserProfile {\n  if (typeof value !== "object" || value === null) return false;\n  const candidate = value as Record<string, unknown>;\n  return (\n    typeof candidate.id === "number" &&\n    typeof candidate.name === "string" &&\n    typeof candidate.email === "string"\n  );\n}\n\nconst validRaw = \'{"id":1,"name":"Ada","email":"ada@example.test"}\';\nconst invalidRaw = \'{"id":2,"name":"Grace"}\';\n\nconst validParsed: unknown = JSON.parse(validRaw);\nconst invalidParsed: unknown = JSON.parse(invalidRaw);\n\nfor (const parsed of [validParsed, invalidParsed]) {\n  if (isUserProfile(parsed)) {\n    console.log(`${parsed.name} <${parsed.email}>`);\n  } else {\n    console.log("Invalid user profile data");\n  }\n}',
        explanation: "isUserProfile performs a real runtime check on each field before narrowing, so the loop correctly prints a formatted summary for the valid profile and a safe fallback message for the invalid one, without ever crashing on a missing property.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Working with JSON & External Data Safely Assessment",
    questions: [
      { question: "What type does JSON.parse() return by default?", options: ["The exact shape of the parsed JSON automatically", "any, since TypeScript cannot know arbitrary JSON's shape at compile time", "string", "never"], correctAnswerIndex: 1, explanation: "JSON.parse() is typed to return any by default, since TypeScript has no way to infer arbitrary JSON text's shape." },
      { question: "What does JSON.parse(raw) as UserProfile actually verify about the real parsed data?", options: ["That it genuinely matches every field of UserProfile", "Nothing; it only tells the compiler to trust and treat the result as UserProfile", "That raw is syntactically valid JSON", "That UserProfile has no optional fields"], correctAnswerIndex: 1, explanation: "A type assertion performs no runtime verification; it only instructs the compiler to treat the value as the asserted type going forward." },
      { question: "If a JSON string is missing a field required by the interface used in a type assertion, when does the resulting problem typically appear?", options: ["Immediately, as a compile error on the JSON.parse() line", "Only later, at runtime, when code actually tries to use the missing field", "It never causes a problem", "TypeScript fills in a default value automatically"], correctAnswerIndex: 1, explanation: "Since the assertion is trusted without verification, a mismatch only surfaces once the program actually accesses the incorrectly typed or missing value at runtime." },
      { question: "What is a genuinely safe use of the as type assertion?", options: [
          "Asserting the shape of completely untrusted, unverified external data",
          "Asserting a more specific type when you have real, certain outside knowledge the compiler lacks, such as a known DOM element type",
          "Using it to silence every type error regardless of whether the assumption is true",
          "as should never be used under any circumstance",
        ], correctAnswerIndex: 1, explanation: "A type assertion is appropriate when you have genuine, verified knowledge beyond what the compiler can infer; it is not a safe substitute for validating untrusted data." },
      { question: "What does the unknown type require before you can use a value as something more specific?", options: [
          "Nothing, unknown behaves exactly like any",
          "The value must first be checked or narrowed, such as with a type guard, before it can be used as a specific type",
          "unknown values can never be used for anything",
          "unknown only works with numbers",
        ], correctAnswerIndex: 1, explanation: "unknown blocks most operations and property access until the value has been narrowed by a check, unlike any which allows anything unconditionally." },
      { question: "What does a value is UserProfile return type signal about a function?", options: [
          "That it always returns true",
          "That it is a type guard, and TypeScript will narrow the checked value to UserProfile in branches where it returns true",
          "That the function can only take a UserProfile argument",
          "That UserProfile must be declared as a class",
        ], correctAnswerIndex: 1, explanation: "The value is X syntax marks a function as a type guard, enabling TypeScript to narrow a value's type based on the function's real, checked result." },
      { question: "Why must a type guard check typeof value === \"object\" && value !== null, rather than just typeof value === \"object\"?", options: [
          "There is no difference between the two checks",
          "typeof null is also \"object\" in JavaScript, so excluding null explicitly is necessary for an accurate object check",
          "typeof value === \"object\" is always false for real objects",
          "null cannot appear in parsed JSON data",
        ], correctAnswerIndex: 1, explanation: "JavaScript's typeof null evaluates to \"object\", so a correct object check must explicitly exclude null to avoid incorrectly treating it as a valid object." },
      { question: "What is the main advantage of combining unknown with a type guard over a plain as type assertion?", options: [
          "It runs faster",
          "It combines a real runtime check with compile-time narrowing, instead of trusting an unverified claim about the data's shape",
          "It removes the need to define an interface at all",
          "There is no real advantage"
        ], correctAnswerIndex: 1, explanation: "A type guard actually inspects the value's real shape at runtime before TypeScript narrows its type, closing the safety gap a plain assertion leaves open." },
      { question: "In a for loop calling isUserProfile(parsed) on both valid and invalid parsed JSON data, what happens for the invalid case?", options: [
          "The program crashes immediately",
          "isUserProfile() returns false, so the invalid data is handled by the else branch instead of code that assumes a valid shape",
          "TypeScript automatically repairs the invalid data",
          "isUserProfile() throws a compile-time error"
        ], correctAnswerIndex: 1, explanation: "A correctly written type guard returns false for data that fails its checks, safely routing invalid data to the else branch instead of ever reaching code that assumes a valid shape." },
      { question: "Why is Array.isArray(value) combined with .every(isUserProfile) a correct way to write isUserProfileArray(value: unknown): value is UserProfile[]?", options: [
          "Because arrays cannot be checked with typeof, so Array.isArray() confirms it is an array, and .every() confirms every individual element separately passes the isUserProfile check",
          "Because .every() alone is sufficient without Array.isArray()",
          "Because typeof value === \"array\" always works correctly in JavaScript",
          "Because arrays never need individual element validation"
        ], correctAnswerIndex: 0, explanation: "typeof does not distinguish arrays from other objects, so Array.isArray() confirms the array itself, while .every(isUserProfile) confirms every individual element matches the expected shape." },
    ],
  },
  assignment:
    "Build a small 'Safe Order Loader': define interface Order { id: number; item: string; quantity: number }. Write a type guard function isOrder(value: unknown): value is Order that checks value is a non-null object with the correct field types for id, item, and quantity. Create three JSON strings: one representing a fully valid Order, one missing a required field, and one with a field of the wrong type. Parse all three into variables typed unknown, and for each one, use isOrder() inside an if/else to either print a formatted order summary or a clear invalid-data message, without ever letting invalid data reach code that assumes a valid Order shape.",
  assignmentDeliverables: [
    "A script defining Order, a real isOrder type guard, and three JSON test cases (valid, missing field, wrong type)",
    "Printed output showing each of the three cases handled correctly and distinctly",
  ],
  assignmentAssessmentCriteria: [
    "isOrder is declared as a real type guard using value is Order and performs genuine runtime field checks",
    "All three test cases (valid, missing field, wrong type) are correctly distinguished, with only the valid case reaching code that assumes a valid Order",
  ],
  miniProject:
    "Build a 'Safe Product Feed Processor': define interface Product { id: number; name: string; price: number; inStock: boolean }. Write a type guard isProduct(value: unknown): value is Product covering all four fields, and a second type guard isProductArray(value: unknown): value is Product[] built from Array.isArray() and .every(isProduct). Create one JSON array string containing a realistic mix of valid Product objects and at least one invalid entry (missing or wrong-typed field). Parse it into a variable typed unknown, and write a function processFeed(value: unknown): Product[] that returns only the valid Product entries. If isProductArray() succeeds on the whole array, return it directly; otherwise, if the parsed value is a plain array, filter it manually using isProduct() to keep only the valid items. Print both the total number of entries received and the number that were valid, along with each valid product's name and price.",
  miniProjectDeliverables: [
    "A script defining Product, isProduct, isProductArray, and processFeed()",
    "Printed output showing the total entries received, the count of valid entries kept, and each valid product's name and price",
  ],
  miniProjectAssessmentCriteria: [
    "isProduct and isProductArray are both correctly implemented as real type guards with genuine runtime checks",
    "processFeed() correctly filters out invalid entries and only returns products that actually match the Product shape",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
