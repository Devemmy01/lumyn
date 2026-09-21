import type { GeneratedCourse } from "@/lib/academy";
import { ACADEMY_WORKSPACE_LAB } from "@/lib/academy";
import { module1 } from "./module-1";
import { module2 } from "./module-2";
import { module3 } from "./module-3";
import { module4 } from "./module-4";
import { module5 } from "./module-5";
import { module6 } from "./module-6";
import { module7 } from "./module-7";

export const javascriptIntermediateCourse: GeneratedCourse = {
  courseTitle: "JavaScript Intermediate",
  courseDescription:
    "Build on JavaScript fundamentals with object-oriented programming and inheritance, ES module syntax and built-in objects, functional array methods, JSON and asynchronous basics, robust error handling, and testing and code quality: through short lessons, practical tasks, assessments, and a final capstone project.",
  difficulty: "Intermediate",
  modules: [module1, module2, module3, module4, module5, module6, module7],
  finalProject:
    "Build a Library Inventory Manager entirely inside the Lumyn Academy workspace: a class-based program that models a library catalog with an inheritance hierarchy, manages checking items in and out using array methods and custom errors, and demonstrates saving and reloading the catalog with JSON.stringify() and JSON.parse(), combining every skill from this course.",
  finalProjectPlan: {
    overview:
      "You'll build a class-based Library Inventory Manager with a small inheritance hierarchy: a LibraryItem base class, and Book and Dvd subclasses that extend it. A Library class manages an array of LibraryItem objects using array methods like filter, map, and reduce. This project deliberately combines every major topic from the course: classes, constructors, and instance methods; inheritance with extends and super, plus method overriding and polymorphism; array methods, destructuring, and spread syntax; custom Error subclasses caught with try/catch/finally; JSON.stringify() and JSON.parse() for saving and reloading data; and simple assertion-style tests organized with describe/it to confirm the whole system behaves correctly.",
    labEnvironment: ACADEMY_WORKSPACE_LAB,
    phases: [
      {
        title: "Phase 1: LibraryItem Classes and the Library Catalog",
        instructions:
          "Define a LibraryItem base class with a constructor accepting title and id, plus an available instance property defaulting to true, and a method describe() returning a readable one-line summary. Define Book and Dvd subclasses that extend LibraryItem: Book's constructor adds author and pages, and Dvd's constructor adds director and runtimeMinutes; both override describe() to include their own extra details, calling super.describe() and appending to it. Define a Library class whose constructor creates an empty items array, with methods addItem(item) that pushes a new item into the array, and findAvailable() that uses filter() to return every item currently available. Seed the Library with at least 5 items, a mix of Book and Dvd objects, and print every item's describe() output using a single loop that treats every item the same way regardless of its subclass.",
        evidence: [
          "script.js containing the LibraryItem, Book, Dvd, and Library classes with the required methods",
          "Printed output showing describe() called polymorphically on a mixed array of Book and Dvd objects, plus the result of findAvailable()",
        ],
      },
      {
        title: "Phase 2: Checking Items Out with Custom Errors and Array Methods",
        instructions:
          "Define two custom error classes extending Error: ItemNotFoundError and ItemUnavailableError. Add a method checkOut(id) to Library that uses find() to locate the item by id, throws ItemNotFoundError if no item matches, throws ItemUnavailableError if the item's available property is already false, and otherwise sets available to false and returns the item. Add a matching method returnItem(id) that sets available back to true, throwing ItemNotFoundError if the id does not match any item. Demonstrate checkOut() succeeding once, checkOut() throwing ItemNotFoundError for an id that does not exist, and checkOut() throwing ItemUnavailableError for an item that is already checked out, each call wrapped in try/catch and reported with console.error(), with a finally block confirming every attempt completed. Then use reduce() on the items array to calculate and print how many items are currently checked out.",
        evidence: [
          "ItemNotFoundError and ItemUnavailableError class definitions, both extending Error",
          "Output showing all three checkOut() outcomes, a success, an ItemNotFoundError, and an ItemUnavailableError, each caught cleanly with finally confirming every attempt, plus the reduce()-calculated checked-out count",
        ],
      },
      {
        title: "Phase 3: Saving the Catalog as JSON and Testing the System",
        instructions:
          "Write a method exportCatalog() on Library that uses map() to convert every item into a plain data object and returns the result of JSON.stringify() on that array, storing the returned JSON string in a variable, not writing it to a file. Write a method importCatalog(jsonString) that uses JSON.parse() to read that string back, safely handling any object missing an expected property with a sensible default, and rebuilds the items array from the parsed data. Demonstrate exporting the current catalog into a variable, creating a brand-new empty Library, calling importCatalog() with that variable, and printing every reloaded item's describe() to prove the round trip worked correctly. Finally, using the describe/it pattern from this course, write at least 5 test cases that verify checkOut(), returnItem(), and the export/import round trip all behave correctly, and print a final pass/fail summary.",
        evidence: [
          "A variable holding the JSON string produced by exportCatalog(), printed to the console",
          "Output showing a freshly created Library, populated by importCatalog(), correctly printing every reloaded item's details",
          "describe/it-organized test output covering at least 5 test cases, ending with a printed final pass/fail summary",
        ],
      },
    ],
    deliverables: [
      "script.js with LibraryItem, Book, Dvd, Library, ItemNotFoundError, and ItemUnavailableError, and all required methods",
      "Printed output demonstrating polymorphic describe(), successful and failed checkOut()/returnItem() calls, and the JSON export/import round trip",
      "describe/it-organized tests covering at least 5 cases with a final pass/fail summary",
      "Short implementation notes explaining each class's responsibility",
    ],
    assessmentCriteria: [
      "LibraryItem, Book, and Dvd correctly use inheritance, method overriding, and polymorphism",
      "ItemNotFoundError and ItemUnavailableError are correctly defined, thrown, and caught without crashing the program",
      "JSON.stringify() and JSON.parse() correctly round-trip the catalog data, including safely handling any missing properties",
      "Tests organized with describe/it correctly verify the system's key behaviors and report accurate pass/fail results",
    ],
    safetyNotes: "Run only your own practice code inside the Academy workspace.",
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
