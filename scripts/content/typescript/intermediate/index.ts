import type { GeneratedCourse } from "@/lib/academy";
import { ACADEMY_WORKSPACE_LAB } from "@/lib/academy";
import { module1 } from "./module-1";
import { module2 } from "./module-2";
import { module3 } from "./module-3";
import { module4 } from "./module-4";
import { module5 } from "./module-5";
import { module6 } from "./module-6";
import { module7 } from "./module-7";

export const typescriptIntermediateCourse: GeneratedCourse = {
  courseTitle: "TypeScript Intermediate",
  courseDescription:
    "Build on TypeScript fundamentals with generics, advanced interfaces, utility types, project organization, safe handling of external data, strict null checks, and typed testing patterns: through short lessons, practical tasks, assessments, and a final capstone project.",
  difficulty: "Intermediate",
  modules: [module1, module2, module3, module4, module5, module6, module7],
  finalProject:
    "Build a typed Order Management System entirely inside the Lumyn Academy workspace: a generic, in-memory repository for storing and querying orders, a type guard that safely validates incoming order data shaped as unknown before it enters the system, typed custom errors for invalid and missing orders, and a small typed test suite proving it all works correctly, combining every skill from this course.",
  finalProjectPlan: {
    overview:
      "You'll build a single-file, console.log-driven Order Management System in main.ts. It deliberately combines every major topic from this course: a generic Repository<T> class built with generics and constrained with extends, utility types (Partial, Pick, Omit, Record) for updates and reporting, a type guard validating unknown incoming order data before it's trusted, typed custom Error subclasses for domain-specific failures, optional chaining and nullish coalescing for safely reading optional fields, and a typed assertion-based test suite verifying the whole system's correctness.",
    labEnvironment: ACADEMY_WORKSPACE_LAB,
    phases: [
      {
        title: "Phase 1: Core Order Types and a Generic Repository",
        instructions:
          "Define interface Order { id: number; customer: string; item: string; quantity: number; status: \"pending\" | \"shipped\" | \"delivered\"; notes?: string }. Define a generic class Repository<T extends { id: number }> with a private array of T items, and methods add(item: T): void, findById(id: number): T | undefined, list(): T[], and update(id: number, changes: Partial<T>): T | undefined that merges changes into the matching item using the spread operator and returns the updated item (or undefined if no item matches that id). Create one Repository<Order>, add at least four Order objects covering more than one status, and demonstrate findById() with both an existing and a missing id, list(), and update() changing at least one field on an existing order, printing the result of each operation.",
        evidence: [
          "main.ts containing Order and the generic Repository<T extends { id: number }> class with add, findById, list, and update",
          "Printed output showing at least four orders added, a successful and a missing findById() lookup, the full list, and a successful update()",
        ],
      },
      {
        title: "Phase 2: Safely Ingesting Unknown Order Data and Typed Errors",
        instructions:
          "Write a type guard function isOrder(value: unknown): value is Order that checks value is a non-null object with correctly typed id, customer, item, quantity, and status fields (status must be one of the three allowed literal values), treating notes as genuinely optional. Define class InvalidOrderError extends Error with a reason: string property, and class OrderNotFoundError extends Error with an orderId: number property. Write a function ingestOrder(repository: Repository<Order>, raw: unknown): Order that uses isOrder() to validate raw, throwing a new InvalidOrderError with a clear reason if it fails, and otherwise adds the order to the repository and returns it. Write a function requireOrder(repository: Repository<Order>, id: number): Order that throws a new OrderNotFoundError if findById() returns undefined, and otherwise returns the found order. Demonstrate ingestOrder() with one valid and one invalid JSON-parsed order (parsed with JSON.parse() into a variable typed unknown), and requireOrder() with one existing and one missing id, using try/catch with instanceof to handle both custom error types distinctly, printing a clear message for each outcome without crashing the program.",
        evidence: [
          "isOrder() as a real type guard, plus InvalidOrderError and OrderNotFoundError as typed Error subclasses",
          "Printed output showing a valid order successfully ingested, an invalid one cleanly rejected, a successful requireOrder() lookup, and a cleanly caught OrderNotFoundError for a missing id",
        ],
      },
      {
        title: "Phase 3: Reporting with Utility Types and a Typed Test Suite",
        instructions:
          "Define type OrderSummary = Pick<Order, \"id\" | \"customer\" | \"status\">, and write a function summarize(orders: Order[]): OrderSummary[] that maps every order to its summary form. Define type StatusCounts = Record<\"pending\" | \"shipped\" | \"delivered\", number>, and write a function countByStatus(orders: Order[]): StatusCounts that tallies how many orders currently have each status, using ?? to default any status with zero orders to 0 rather than leaving it missing. Write a generic assertEquals<T>(actual: T, expected: T, label: string): void helper and a small test suite of at least three test functions verifying Repository<Order>'s add/findById/update behavior, isOrder()'s validation of at least one valid and one invalid input, and countByStatus()'s tally against a known set of orders. Build a test runner that loops over all test functions, catches thrown assertion failures, and prints a PASS or FAIL line for each test plus a final summary count. Print the OrderSummary array and the StatusCounts tally as well.",
        evidence: [
          "OrderSummary (built with Pick) and StatusCounts (built with Record) plus summarize() and countByStatus() using them correctly",
          "Printed output showing the OrderSummary array, the StatusCounts tally, and a full PASS/FAIL test run covering the repository, the type guard, and the reporting functions, with an accurate summary count",
        ],
      },
    ],
    deliverables: [
      "main.ts with Order, the generic Repository<T>, isOrder(), InvalidOrderError, OrderNotFoundError, ingestOrder(), requireOrder(), OrderSummary, StatusCounts, summarize(), countByStatus(), assertEquals<T>, and the test suite with its runner",
      "Printed output demonstrating every phase: repository operations, safe ingestion of valid and invalid data, typed error handling for a missing order, reporting output, and a full test run with an accurate pass/fail summary",
      "Short implementation notes explaining how each course topic (generics, utility types, type guards, custom errors, null safety, and typed testing) was used in the final system",
    ],
    assessmentCriteria: [
      "Repository<T extends { id: number }> is correctly generic and reused for Order without being hardcoded to it",
      "isOrder() is a real type guard performing genuine runtime validation, and InvalidOrderError/OrderNotFoundError are correctly typed Error subclasses caught with instanceof",
      "OrderSummary and StatusCounts correctly use Pick and Record respectively, and the typed test suite accurately reports pass/fail results for the system's core behavior",
    ],
    safetyNotes: "Run only your own practice code inside the Academy workspace, and use only sample or invented order data.",
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
