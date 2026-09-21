import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module6: GeneratedModule = {
  title: "Error Handling & Strict Null Checks",
  description:
    "Handle missing values the TypeScript-idiomatic way: understand what strictNullChecks actually enforces, use optional chaining and nullish coalescing to work with null and undefined safely, and write a typed custom Error subclass for domain-specific failures.",
  completionStatus: "locked",
  lessons: [
    {
      title: "strictNullChecks and Optional Chaining (?.)",
      goal: "Understand what the strictNullChecks compiler flag enforces, and use optional chaining to safely read properties that might be null or undefined.",
      videoTitle: "TypeScript strictNullChecks and Optional Chaining Explained",
      videoSearchQuery: "typescript strictnullchecks optional chaining tutorial",
      videoLearningGoal: "See TypeScript reject unsafe property access on a possibly null value under strictNullChecks, and see optional chaining fix it cleanly.",
      recommendedChannels: ["Matt Pocock", "Total TypeScript"],
      keyTakeaways: [
        "With strictNullChecks enabled, null and undefined are only assignable to a variable whose type explicitly includes them, such as string | null.",
        "Under strictNullChecks, accessing a property directly on a value typed as possibly null or undefined is a compile-time error, catching a common class of runtime crash before the code ever runs.",
        "Optional chaining, value?.property, safely reads a property and short-circuits to undefined instead of throwing, if value is null or undefined at that point.",
      ],
      notes:
        "strictNullChecks is a compiler setting that changes how seriously TypeScript treats null and undefined. With it enabled (the default in a strict TypeScript setup), a type like string does not secretly also allow null; if a value might be missing, its type has to say so explicitly, such as string | null or string | undefined.",
      conceptExplanation:
        "function getLength(text: string | null): number { return text.length; } is a compile-time error under strictNullChecks, because text might be null at that line, and null has no length property, so TypeScript refuses to compile code that could crash. Optional chaining fixes exactly this shape of problem: function getLength(text: string | null): number { return text?.length ?? 0; } uses text?.length, which evaluates to undefined instead of throwing if text is null, and the ?? 0 (covered next lesson) supplies a fallback number. Optional chaining also works through nested paths: user?.address?.city safely returns undefined the moment any link in that chain, user or user.address, is null or undefined, without needing a separate check for each level. It even works with function calls: callback?.() only calls callback if it isn't null or undefined, otherwise it safely evaluates to undefined instead of throwing 'callback is not a function'.",
      whyItMatters: "strictNullChecks turns a huge category of 'cannot read property of undefined' runtime crashes into compile-time errors instead, and optional chaining is the concise, safe way to satisfy that stricter checking when a value genuinely might be missing.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define interface Address { city: string; zip: string }. Define interface Customer { name: string; address: Address | null }. Create two Customer objects: one with a full address, one with address set to null. Write a function getCity(customer: Customer): string | undefined that returns customer.address?.city using optional chaining, and call it with both customers, printing both results. Then define a variable holding an optional callback function typed as (() => void) | null, set it to null, and call it safely using callback?.(), showing the call does not throw.",
      challenge: "Extend Customer with a nested optional phone?: { mobile?: string }, and write a function getMobile(customer: Customer & { phone?: { mobile?: string } }): string | undefined that reads customer.phone?.mobile using a single chained optional access, then call it with a customer that has no phone property at all, printing the (safely undefined) result.",
      expectedResult: "The program prints the correct city for the customer with a full address, and undefined for the customer whose address is null, without either call throwing a runtime error.",
      tests: ["Address | null (or an equivalent explicit optional type) is used for the possibly missing value, not a bare Address that silently allows null", "getCity uses optional chaining (?.) to safely read the nested city property instead of accessing it directly"],
      hint: "customer.address?.city reads exactly like customer.address.city, except it evaluates to undefined instead of throwing if customer.address happens to be null or undefined.",
      lessonAssessment: [
        {
          question: "Under strictNullChecks, what happens if you try to access a property directly on a value typed as string | null, such as text.length?",
          options: [
            "It compiles and works fine, since JavaScript allows it",
            "It is a compile-time error, since text might be null at that point and null has no length property",
            "TypeScript automatically converts null to an empty string",
            "strictNullChecks only affects arrays, not strings",
          ],
          correctAnswerIndex: 1,
          explanation: "strictNullChecks makes TypeScript track exactly when a value might be null or undefined, and rejects direct property access on such a value unless it's been narrowed or accessed safely first.",
        },
        {
          question: "What does user?.address?.city evaluate to if user is null?",
          options: [
            "It throws a runtime error immediately",
            "undefined, since optional chaining short-circuits the entire remaining chain the moment it hits a null or undefined link",
            "It returns an empty string",
            "It skips straight to address, ignoring that user is null",
          ],
          correctAnswerIndex: 1,
          explanation: "Optional chaining short-circuits at the first null or undefined value in the chain, evaluating the whole expression to undefined instead of continuing and throwing.",
        },
      ],
      commonMistakes: ["Writing a type like Address (without | null or | undefined) for a value that can genuinely be missing, hiding the possibility from the type system entirely instead of modeling it honestly.", "Using regular dot access (customer.address.city) on a value known to possibly be null, relying on it happening to work at runtime instead of using optional chaining or a proper null check."],
      deliverables: ["A script with Customer's address modeled as Address | null, and getCity() using optional chaining to read it safely"],
      assessmentCriteria: ["The possibly missing value is honestly typed with | null (or | undefined), not silently treated as always present", "Optional chaining correctly prevents a crash on the customer whose address is null"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code: 'interface Address {\n  city: string;\n  zip: string;\n}\n\ninterface Customer {\n  name: string;\n  address: Address | null;\n}\n\nfunction getCity(customer: Customer): string | undefined {\n  return customer.address?.city;\n}\n\nconst withAddress: Customer = {\n  name: "Ada",\n  address: { city: "London", zip: "SW1A" },\n};\nconst withoutAddress: Customer = { name: "Grace", address: null };\n\nconsole.log(getCity(withAddress));\nconsole.log(getCity(withoutAddress));\n\nconst callback: (() => void) | null = null;\ncallback?.();\nconsole.log("Callback call completed safely");',
        explanation: "customer.address?.city safely returns undefined for withoutAddress instead of throwing, and callback?.() safely skips calling a null callback, both without any runtime error.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Nullish Coalescing (??) and Safe Defaults",
      goal: "Use the nullish coalescing operator (??) to supply a fallback value only when the left side is null or undefined, and understand how it differs from ||.",
      videoTitle: "TypeScript Nullish Coalescing (??) vs || Explained",
      videoSearchQuery: "typescript nullish coalescing operator vs or explained",
      videoLearningGoal: "See ?? correctly preserve a valid falsy value like 0 or an empty string, in a case where || would incorrectly replace it with a fallback.",
      recommendedChannels: ["Web Dev Simplified", "Jack Herrington"],
      keyTakeaways: [
        "value ?? fallback evaluates to fallback only if value is exactly null or undefined; every other value, including 0, \"\", and false, is kept as-is.",
        "value || fallback evaluates to fallback for any falsy value, including 0, \"\", false, NaN, null, and undefined, which is often too broad for supplying a genuine default.",
        "?? and optional chaining are commonly combined: value?.property ?? fallback safely reads a possibly missing property and supplies a default in a single expression.",
      ],
      notes:
        "|| (logical OR) looks like it supplies a default value, but it actually replaces every falsy value, not just missing ones. ?? (nullish coalescing) is more precise: it only steps in for null or undefined, leaving legitimate falsy values like 0 or an empty string untouched.",
      conceptExplanation:
        "function getDiscount(discount: number | null): number { return discount || 10; } looks reasonable, but if discount is legitimately 0 (meaning no discount, on purpose), discount || 10 incorrectly returns 10 instead of the real value 0, because 0 is falsy. function getDiscount(discount: number | null): number { return discount ?? 10; } fixes this precisely: discount ?? 10 only falls back to 10 if discount is null or undefined, correctly preserving 0 as a valid, meaningful value. The same distinction applies to strings: (name || \"Guest\") replaces a genuinely empty string \"\" with \"Guest\", while (name ?? \"Guest\") only replaces null or undefined, leaving an intentional empty string alone. ?? combines naturally with optional chaining: const city = customer.address?.city ?? \"Unknown\"; safely reads a nested, possibly missing property and supplies a fallback in one expression, without needing a separate if statement.",
      whyItMatters: "?? avoids a subtle, common bug where || accidentally overwrites legitimate falsy values like 0, false, or an empty string, which matters anywhere zero, an empty string, or false could be a real, valid piece of data rather than a sign of something missing.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Write a function getDiscount(discount: number | null): number that returns discount ?? 10. Call it once with 0 and once with null, printing both results, and confirm 0 is preserved correctly rather than replaced. Then write a function getDisplayName(name: string | null | undefined): string that returns name ?? \"Guest\", and call it with an empty string \"\", with null, and with a real name, printing all three results, confirming the empty string is preserved while null falls back to \"Guest\".",
      challenge: "Reuse the Customer and Address interfaces from the previous lesson, and write a function getCityOrDefault(customer: Customer): string that returns customer.address?.city ?? \"Unknown city\" in a single expression, then call it with both a customer that has an address and one that does not, printing both results.",
      expectedResult: "The program prints 0 (not 10) for getDiscount(0), 10 for getDiscount(null), the empty string (not \"Guest\") for getDisplayName(\"\"), and \"Guest\" for getDisplayName(null), correctly demonstrating that ?? only replaces null and undefined.",
      tests: ["getDiscount and getDisplayName both use ?? rather than ||, so that falsy-but-valid values like 0 and \"\" are preserved instead of replaced", "Calling each function with a genuinely valid falsy value (0 or \"\") produces that original value in the output, not the fallback"],
      hint: "If you're unsure whether ?? or || is doing the right thing, ask: is 0, an empty string, or false a value I want to treat as missing here, or a legitimate real value?",
      lessonAssessment: [
        {
          question: "What does discount ?? 10 evaluate to if discount is 0?",
          options: [
            "10, since 0 is falsy",
            "0, since ?? only falls back for null or undefined, and 0 is neither",
            "undefined",
            "It causes a compile-time error",
          ],
          correctAnswerIndex: 1,
          explanation: "?? only replaces null or undefined specifically; 0 is a valid, defined value, so ?? correctly leaves it unchanged.",
        },
        {
          question: "Why would discount || 10 be a bug if discount is meant to be a legitimate value that can be 0?",
          options: [
            "|| and ?? behave identically in every case",
            "|| replaces every falsy value, including a genuinely valid 0, with the fallback, incorrectly discarding real data",
            "|| only works with strings, not numbers",
            "|| would cause a compile-time error on a number type",
          ],
          correctAnswerIndex: 1,
          explanation: "|| treats any falsy value, including a legitimate 0, as a reason to use the fallback, which incorrectly overwrites valid data that || cannot distinguish from something missing." ,
        },
      ],
      commonMistakes: ["Using || to supply a default for a number or string that could legitimately be 0, false, or an empty string, silently discarding valid data.", "Assuming ?? and || are interchangeable stylistic choices, rather than recognizing they check for genuinely different conditions."],
      deliverables: ["A script with getDiscount and getDisplayName both using ??, correctly tested against 0 and an empty string"],
      assessmentCriteria: ["?? is used instead of || specifically to preserve valid falsy values like 0 and \"\"", "Test calls demonstrate the correct, precise behavior for both null/undefined and legitimate falsy values"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "typescript",
        code: 'function getDiscount(discount: number | null): number {\n  return discount ?? 10;\n}\n\nfunction getDisplayName(name: string | null | undefined): string {\n  return name ?? "Guest";\n}\n\nconsole.log(getDiscount(0));       // 0, preserved correctly\nconsole.log(getDiscount(null));    // 10, the fallback\nconsole.log(getDisplayName(""));   // "", preserved correctly\nconsole.log(getDisplayName(null)); // "Guest", the fallback',
        explanation: "?? only substitutes the fallback for null or undefined, so the legitimately falsy values 0 and \"\" both pass through unchanged, unlike what || would have done with the same inputs.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Writing a Typed Custom Error Subclass",
      goal: "Define a custom Error subclass with additional typed properties, and use instanceof to handle it specifically when catching errors.",
      videoTitle: "TypeScript Custom Error Classes Explained",
      videoSearchQuery: "typescript custom error class extends error tutorial",
      videoLearningGoal: "See a custom error class extend the built-in Error class with extra typed fields, then get caught and identified specifically using instanceof.",
      recommendedChannels: ["Matt Pocock", "Jack Herrington"],
      keyTakeaways: [
        "A custom error class extends Error, calls super(message) in its constructor, and can add its own additional typed properties beyond message.",
        "catch blocks in TypeScript receive the caught value typed as unknown by default under strict settings, so it must be narrowed, typically with instanceof, before accessing error-specific properties.",
        "instanceof correctly distinguishes a custom error subclass from the generic Error class and from other custom error types, letting each be handled with its own specific logic.",
      ],
      notes:
        "You've used custom exception-style classes conceptually before; TypeScript's version builds directly on JavaScript's built-in Error class. Extending it, rather than writing an unrelated class from scratch, keeps compatibility with stack traces, try/catch, and everything else that expects a real Error.",
      conceptExplanation:
        "class ValidationError extends Error { field: string; constructor(message: string, field: string) { super(message); this.field = field; this.name = \"ValidationError\"; } } defines a typed custom error with an extra field property beyond the inherited message. Throwing it looks like throw new ValidationError(\"Age must be positive\", \"age\");, and catching it safely requires narrowing: catch (error) { if (error instanceof ValidationError) { console.log(error.field, error.message); } else if (error instanceof Error) { console.log(error.message); } else { console.log(\"Unknown error\", error); } }. This layered instanceof check matters because a catch block's error is typed unknown by default in modern, strict TypeScript, exactly like the unknown type from the previous module: you cannot safely access error.field or even error.message without first proving, through instanceof, what you actually caught. Checking the most specific type first (ValidationError before the general Error) ensures a ValidationError is handled by its own specific branch rather than falling through to the more generic one.",
      whyItMatters: "A typed custom error class carries structured, specific information about what went wrong (like which field failed validation) all the way from where it's thrown to where it's caught, and instanceof narrowing lets each error type be handled with logic specific to it instead of one generic catch-all.",
      practicalTask:
        "In the Academy workspace, main.ts is already open for you. Define class ValidationError extends Error with an additional field: string property, calling super(message) and setting this.name = \"ValidationError\" in the constructor. Write a function validateAge(age: number): void that throws a new ValidationError with a clear message and field: \"age\" if age is negative, and otherwise does nothing. Call it once with a valid age and once with a negative age, each inside its own try/catch, using instanceof ValidationError in the catch block to print both the field and message specifically, and instanceof Error as a fallback branch for any other error type.",
      challenge: "Define a second custom error class, NotFoundError extends Error, with an additional resourceId: number property, and write a function findItem(id: number): string that throws a NotFoundError if id is greater than 100 (simulating a missing record), otherwise returning a found message. Call it with both a valid and an out-of-range id, using a catch block that distinguishes ValidationError, NotFoundError, and a generic Error fallback with three separate instanceof checks.",
      expectedResult: "The program prints a success path for the valid age, and correctly prints both the field (\"age\") and the message from the caught ValidationError for the negative age, without the program crashing.",
      tests: ["ValidationError correctly extends Error, calls super(message), and adds a typed field property beyond the inherited message", "The catch block uses instanceof ValidationError (checked before or alongside a more general instanceof Error) to safely access field and message"],
      hint: "Always call super(message) as the very first line inside a custom error's constructor before setting any of your own additional properties.",
      lessonAssessment: [
        {
          question: "What must a custom error class's constructor call before setting its own additional properties?",
          options: [
            "this.field = field, before anything else",
            "super(message), to properly initialize the inherited Error behavior first",
            "console.log(message)",
            "Nothing; extending Error requires no special constructor setup",
          ],
          correctAnswerIndex: 1,
          explanation: "Calling super(message) first ensures the built-in Error behavior, like the message property and stack trace, is set up correctly before the subclass adds its own fields.",
        },
        {
          question: "Why is instanceof ValidationError needed inside a catch block before accessing error.field?",
          options: [
            "It isn't needed; every caught value can be accessed as any type directly",
            "Because the caught value is typed unknown by default, and instanceof proves at runtime, and narrows at compile time, that it is actually a ValidationError with a field property",
            "instanceof is only usable with built-in types, not custom classes",
            "field is a property on every possible error type automatically",
          ],
          correctAnswerIndex: 1,
          explanation: "A catch block's error is typed unknown by default, so instanceof ValidationError is what actually proves, and lets TypeScript narrow, that the caught value has the field property specific to that class.",
        },
      ],
      commonMistakes: ["Forgetting to call super(message) in a custom error's constructor, leaving the inherited message property (and correct error behavior) unset.", "Accessing a custom error's specific property directly inside a catch block without an instanceof check first, which is unsafe since the caught value's real type isn't guaranteed at that point."],
      deliverables: ["A script defining ValidationError as a typed Error subclass and safely catching it with instanceof narrowing"],
      assessmentCriteria: ["ValidationError correctly extends Error, calls super(message), and includes a typed field property", "The catch block correctly narrows with instanceof before accessing any error-specific property"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 to 30 minutes",
      codeExample: {
        language: "typescript",
        code: 'class ValidationError extends Error {\n  field: string;\n\n  constructor(message: string, field: string) {\n    super(message);\n    this.name = "ValidationError";\n    this.field = field;\n  }\n}\n\nfunction validateAge(age: number): void {\n  if (age < 0) {\n    throw new ValidationError("Age cannot be negative", "age");\n  }\n}\n\nfunction runValidation(age: number): void {\n  try {\n    validateAge(age);\n    console.log(`Age ${age} is valid`);\n  } catch (error) {\n    if (error instanceof ValidationError) {\n      console.log(`Validation failed on "${error.field}": ${error.message}`);\n    } else if (error instanceof Error) {\n      console.log(`Unexpected error: ${error.message}`);\n    } else {\n      console.log("Unknown error", error);\n    }\n  }\n}\n\nrunValidation(30);\nrunValidation(-5);',
        explanation: "ValidationError adds a typed field property on top of the inherited message, and the catch block safely narrows the unknown-typed error with instanceof before reading either property.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Error Handling & Strict Null Checks Assessment",
    questions: [
      { question: "With strictNullChecks enabled, what does a type like string actually allow?", options: ["string, null, and undefined all together", "Only real string values; null and undefined require an explicit union like string | null", "Only empty strings", "Any type at all"], correctAnswerIndex: 1, explanation: "Under strictNullChecks, null and undefined are excluded from a plain type like string unless explicitly included in a union." },
      { question: "Why does function getLength(text: string | null): number { return text.length; } fail to compile under strictNullChecks?", options: ["length is spelled incorrectly", "text might be null at that line, and null has no length property, so direct access is unsafe", "string | null is not a valid type", "Functions cannot return number"], correctAnswerIndex: 1, explanation: "TypeScript rejects direct property access on a value whose type includes null, since that access could crash at runtime if the value actually is null." },
      { question: "What does user?.address?.city evaluate to if user is null?", options: ["It throws a runtime error", "undefined, since optional chaining short-circuits at the first null or undefined link in the chain", "An empty string", "It skips straight to city, ignoring the null user"], correctAnswerIndex: 1, explanation: "Optional chaining stops safely at the first null or undefined value in the chain, evaluating the whole expression to undefined instead of throwing." },
      { question: "What does callback?.() do if callback is null?", options: ["Throws \"callback is not a function\"", "Safely evaluates to undefined without calling callback or throwing", "Calls callback with no arguments regardless", "Causes a compile-time error"], correctAnswerIndex: 1, explanation: "Optional chaining also works on function calls: it only invokes the function if it isn't null or undefined, otherwise it safely evaluates to undefined." },
      { question: "What does discount ?? 10 evaluate to if discount is 0?", options: ["10, since 0 is falsy", "0, since ?? only replaces null or undefined, and 0 is neither", "undefined", "A compile-time error"], correctAnswerIndex: 1, explanation: "?? checks specifically for null or undefined, so a legitimately valid 0 is preserved rather than replaced by the fallback." },
      { question: "Why is discount || 10 risky if discount can legitimately be 0?", options: [
          "|| and ?? behave identically",
          "|| treats every falsy value, including a valid 0, as a reason to use the fallback, incorrectly discarding real data",
          "|| only works with strings",
          "|| always causes a compile-time error with numbers",
        ], correctAnswerIndex: 1, explanation: "|| replaces any falsy value, so a genuinely meaningful 0 gets incorrectly overwritten by the fallback, which ?? avoids by checking specifically for null or undefined." },
      { question: "What must a custom error class's constructor call before setting its own additional properties?", options: ["this.name = \"CustomError\"", "super(message), to correctly initialize the inherited Error behavior first", "console.error(message)", "Nothing is required before setting custom properties"], correctAnswerIndex: 1, explanation: "super(message) must run first so the inherited Error setup, including the message property, is correctly established before the subclass adds its own fields." },
      { question: "Why is instanceof ValidationError required before accessing error.field inside a catch block?", options: [
          "It isn't required; any caught value can be accessed directly as any type",
          "Because the caught value is typed unknown by default, and instanceof proves at runtime, and narrows at compile time, that it is a ValidationError",
          "instanceof only works with built-in error types",
          "field exists on every error type automatically",
        ], correctAnswerIndex: 1, explanation: "A catch block's error is unknown by default, so instanceof is what safely proves and narrows the caught value to a specific error class before accessing its unique properties." },
      { question: "In a catch block checking both instanceof ValidationError and instanceof Error, why should the more specific ValidationError check come first?", options: [
          "Order does not matter at all",
          "Since ValidationError is also an instance of Error, checking Error first would incorrectly handle it in the more generic branch",
          "TypeScript requires alphabetical ordering of instanceof checks",
          "instanceof Error always runs before any other check regardless of order",
        ], correctAnswerIndex: 1, explanation: "Because a ValidationError instance is also an instance of Error, the more specific check must come first, or the generic Error branch would catch it before the specific one gets a chance." },
      { question: "What is the safest way to write const city = customer.address?.city ?? \"Unknown\"; combining this lesson's two operators?", options: [
          "It safely reads a possibly missing nested property and falls back to \"Unknown\" only if the result is null or undefined, in a single expression",
          "It throws an error if address is missing",
          "?? and ?. cannot be combined in the same expression",
          "It always returns \"Unknown\" regardless of the real data",
        ], correctAnswerIndex: 0, explanation: "Optional chaining safely reads the nested property, evaluating to undefined if any link is missing, and ?? then supplies the fallback only for that null or undefined result." },
    ],
  },
  assignment:
    "Build a 'Safe Settings Reader': define interface Settings { theme: string | null; retries: number | null; }. Write a function getTheme(settings: Settings): string that returns settings.theme ?? \"light\", and a function getRetries(settings: Settings): number that returns settings.retries ?? 3, using ?? rather than || in both. Call both functions with a Settings object where retries is 0 (a legitimate value) and theme is null, printing both results and confirming retries stays 0 rather than becoming 3. Then define class ConfigError extends Error with an additional key: string property, write a function requireKey(settings: Record<string, unknown>, key: string): void that throws a ConfigError if settings[key] is undefined, and call it inside a try/catch with a missing key, using instanceof ConfigError to print the specific key that was missing.",
  assignmentDeliverables: [
    "A script defining Settings, getTheme(), getRetries(), and ConfigError with requireKey()",
    "Printed output showing 0 correctly preserved by getRetries(), and the specific missing key printed from a caught ConfigError",
  ],
  assignmentAssessmentCriteria: [
    "getTheme() and getRetries() both use ?? and correctly preserve a legitimate 0 value instead of replacing it",
    "ConfigError correctly extends Error with an added key property, and the catch block safely narrows with instanceof before reading it",
  ],
  miniProject:
    "Build a 'Safe User Directory Lookup' script: define interface Address { city: string; zip: string }. Define interface DirectoryUser { name: string; address: Address | null; phone: string | null }. Create an array of at least four DirectoryUser objects, including at least one with a null address and one with an empty string phone (a legitimate, valid 'no phone listed' value, not missing data). Write a function describeUser(user: DirectoryUser): string that uses optional chaining and ?? to build a one-line summary such as name, city (or \"Unknown city\" if missing), and phone (or \"No phone listed\" only if phone is null, correctly leaving an intentional empty string as-is if that's a meaningful distinction you choose to make, explained in a comment). Then define class LookupError extends Error with a query: string property, write a function findUserByName(directory: DirectoryUser[], name: string): DirectoryUser that throws a LookupError if no match is found, and call it once with a name that exists and once with one that doesn't, using try/catch with instanceof LookupError to print a clear, specific message for the failed lookup.",
  miniProjectDeliverables: [
    "A script defining Address, DirectoryUser, describeUser(), LookupError, and findUserByName()",
    "Printed output showing every user's summary from describeUser(), plus a successful lookup and a caught LookupError with its query property printed",
  ],
  miniProjectAssessmentCriteria: [
    "describeUser() correctly uses optional chaining and ?? to handle missing address and phone data without crashing, and does not confuse a legitimate falsy value with a missing one",
    "LookupError correctly extends Error with a typed query property, and is caught and identified specifically with instanceof rather than a generic catch-all",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
