import type { GeneratedCourse } from "@/lib/academy";
import { ACADEMY_WORKSPACE_LAB } from "@/lib/academy";
import { module1 } from "./module-1";
import { module2 } from "./module-2";
import { module3 } from "./module-3";
import { module4 } from "./module-4";
import { module5 } from "./module-5";
import { module6 } from "./module-6";
import { module7 } from "./module-7";

export const typescriptBeginnerCourse: GeneratedCourse = {
  courseTitle: "TypeScript Fundamentals",
  courseDescription:
    "A hands-on introduction to TypeScript for developers who already know JavaScript: covering type annotations, functions, interfaces, unions, arrays, tuples, enums, and classes, through short lessons, practical tasks, assessments, and a final capstone project.",
  difficulty: "Beginner",
  modules: [module1, module2, module3, module4, module5, module6, module7],
  finalProject:
    "Build a typed 'Library Catalog' entirely inside the Lumyn Academy workspace: an in-memory program that models books with an interface, stores them in a typed array, and manages them through a class that implements a catalog interface, combining every skill from this course.",
  finalProjectPlan: {
    overview:
      "You'll build an in-memory Library Catalog system that models books with an interface, stores and searches them using typed arrays and typed functions, and manages the whole collection through a class that implements a Catalog interface. This project deliberately combines every major topic from the course: type annotations, typed functions, interfaces (including optional and readonly properties and extension), union and literal types with narrowing, typed arrays and enums, and a class implementing an interface with access modifiers.",
    labEnvironment: ACADEMY_WORKSPACE_LAB,
    phases: [
      {
        title: "Phase 1: Modeling Books and Core Functions",
        instructions:
          "Define an interface named Book with readonly isbn: string, title: string, author: string, and an optional publicationYear?: number. Define a literal type BookStatus as \"available\" | \"checked-out\" | \"lost\", and add a status: BookStatus property to Book. Write a typed array books: Book[] seeded with at least five Book objects covering a mix of statuses, including at least one book without publicationYear. Write a function findBookByIsbn(books: Book[], isbn: string): Book | undefined that searches the array and returns the matching book or undefined.",
        evidence: [
          "main.ts containing the Book interface, BookStatus literal type, and the seeded books array",
          "Console output showing findBookByIsbn() correctly returning a match and correctly returning undefined for an unknown isbn",
        ],
      },
      {
        title: "Phase 2: A Catalog Class Implementing an Interface",
        instructions:
          "Define an interface named Catalog with three method signatures: addBook(book: Book): void, removeBook(isbn: string): boolean, and listByStatus(status: BookStatus): Book[]. Write a class named LibraryCatalog that implements Catalog, using a private books: Book[] property initialized in the constructor from your seeded array. Implement all three methods: addBook() pushes a new book, removeBook() finds and removes a book by isbn (returning true if removed, false if not found), and listByStatus() returns every book whose status matches, using array filtering. Create one LibraryCatalog instance and demonstrate each method.",
        evidence: [
          "LibraryCatalog class implementing all three Catalog methods with correct typing",
          "Console output demonstrating addBook(), removeBook() (both a successful and a failed removal), and listByStatus() for at least two different statuses",
        ],
      },
      {
        title: "Phase 3: Reporting With Narrowing and a Final Summary",
        instructions:
          "Add a method catalogSummary(): string to LibraryCatalog that returns a formatted multi-line summary: the total number of books, a count of books per BookStatus, and the titles of any books missing a publicationYear, using narrowing to safely check for that optional property. Call catalogSummary() after performing at least one add and one removal, and log the final result so it reflects the catalog's true current state.",
        evidence: [
          "catalogSummary() correctly counting books per status and correctly identifying books without a publicationYear",
          "Final console output showing an accurate summary after the catalog has been modified by earlier phases",
        ],
      },
    ],
    deliverables: [
      "main.ts with the Book interface, BookStatus literal type, Catalog interface, and LibraryCatalog class",
      "Console output demonstrating every Catalog method plus catalogSummary()",
      "Short implementation notes explaining how each course concept (interfaces, unions and literals, narrowing, typed arrays, enums or literals, and the class implementing an interface) was used",
    ],
    assessmentCriteria: [
      "Book and Catalog interfaces are correctly typed, including the optional and readonly properties",
      "LibraryCatalog correctly implements every method the Catalog interface requires",
      "BookStatus narrowing is used correctly in listByStatus() and catalogSummary()",
      "catalogSummary() produces an accurate, readable report reflecting the catalog's current state after modifications",
    ],
    safetyNotes:
      "Run only your own practice code inside the Academy workspace, and keep all book and catalog data limited to safe, fictional, or placeholder examples.",
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
