import type { GeneratedCourse } from "@/lib/academy";
import { ACADEMY_WORKSPACE_LAB } from "@/lib/academy";
import { module1 } from "./module-1";
import { module2 } from "./module-2";
import { module3 } from "./module-3";
import { module4 } from "./module-4";
import { module5 } from "./module-5";
import { module6 } from "./module-6";
import { module7 } from "./module-7";

export const javascriptBeginnerCourse: GeneratedCourse = {
  courseTitle: "JavaScript Fundamentals",
  courseDescription:
    "A hands-on introduction to JavaScript covering variables, data types, control flow, loops, arrays, objects, functions, strings, error handling, and JSON: through short lessons, practical tasks, assessments, and a final capstone project.",
  difficulty: "Beginner",
  modules: [module1, module2, module3, module4, module5, module6, module7],
  finalProject:
    "Build a Contact List Manager entirely inside the Lumyn Academy workspace: an in-memory, console-driven program that stores contacts, searches and reports on them, validates new entries safely, and round-trips the data through a JSON snapshot, combining every skill from this course.",
  finalProjectPlan: {
    overview:
      "You'll build a console-driven Contact List Manager that stores a list of contacts (each with a name, phone number, email, and group) entirely in memory, using an array of objects. The project deliberately combines every major topic from the course: variables and data types, conditionals, loops, arrays and objects, functions, template literals and string methods, try/catch error handling, and JSON.stringify/JSON.parse. There is no file or network access involved; everything runs and prints through console.log() inside the workspace.",
    labEnvironment: ACADEMY_WORKSPACE_LAB,
    phases: [
      {
        title: "Phase 1: Data & Core Functions",
        instructions:
          "Represent each contact as an object with name, phone, email, and group keys, stored in an array. Write functions: addContact(contacts, name, phone, email, group) that pushes a new contact object onto the array, findContact(contacts, name) that loops through the array and returns the matching contact object (or undefined if not found), and removeContact(contacts, name) that returns a new array with the matching contact filtered out. Seed the array with at least 5 sample contacts across at least 2 different groups.",
        evidence: [
          "A script containing the contact array and the three core functions",
          "Console output showing findContact() locating an existing contact and removeContact() correctly shrinking the array",
        ],
      },
      {
        title: "Phase 2: Search, Filtering & Formatted Reporting",
        instructions:
          "Write a function printContactList(contacts) that loops through every contact with for...of and prints each one on a formatted line using a template literal, such as showing the name, phone, and group together. Write a function contactsInGroup(contacts, group) that returns a new array containing only the contacts whose group matches, built using a loop and an if condition. Call contactsInGroup() for at least two different groups and print each filtered list using printContactList().",
        evidence: [
          "printContactList() output showing every contact formatted with a template literal",
          "Two separate filtered group listings produced by contactsInGroup(), each printed and correct",
        ],
      },
      {
        title: "Phase 3: Validation, Error Handling & JSON Snapshot",
        instructions:
          "Write a function addContactSafe(contacts, name, phone, email, group) that validates the phone value (for example, throwing new Error(\"Invalid phone number\") when it isn't a non-empty string of digits) inside a try/catch, only adding the contact when validation succeeds and printing a friendly message when it fails. Write saveSnapshot(contacts) that returns JSON.stringify(contacts), and loadSnapshot(jsonText) that uses try/catch around JSON.parse(jsonText) to safely rebuild the contact array, printing a friendly error if the text is invalid. Create a snapshot from your contact array, then load it back into a new array and print the reloaded list with printContactList() to prove the round trip works.",
        evidence: [
          "A demonstrated call to addContactSafe() with an invalid phone value that is caught and reported without crashing the script",
          "Console output showing the JSON snapshot string, plus the reloaded contact list printed after loadSnapshot() successfully parses it",
        ],
      },
    ],
    deliverables: [
      "A single JavaScript file with all functions from the three phases",
      "Console output demonstrating add, find, remove, filter, and report functions all working correctly",
      "Console output showing the JSON snapshot string and the successfully reloaded contact list",
      "Implementation notes describing each function's role and how the phases connect to earlier modules",
    ],
    assessmentCriteria: [
      "All core functions (add, find, remove, filter, report) work correctly on the sample data",
      "try/catch correctly prevents an invalid contact from crashing the script",
      "The JSON snapshot round-trips correctly: the reloaded contact list matches the original data",
      "Code uses functions, loops, template literals, and objects appropriately rather than one long unstructured script",
    ],
    safetyNotes: "Run only your own practice code inside the Academy workspace, and keep all contact data fictional rather than using anyone's real personal information.",
  },
  progressStructure: [
    "Complete each module's lessons and mark them done",
    "Pass each module's quiz",
    "Submit each module's assignment and mini-project",
    "Complete the final capstone project",
    "Unlock your certificate",
  ],
  certificateEligible: true,
};
