import type { GeneratedCourse } from "@/lib/academy";
import { ACADEMY_WORKSPACE_LAB } from "@/lib/academy";
import { module1 } from "./module-1";
import { module2 } from "./module-2";
import { module3 } from "./module-3";
import { module4 } from "./module-4";
import { module5 } from "./module-5";
import { module6 } from "./module-6";
import { module7 } from "./module-7";

export const javascriptAdvancedCourse: GeneratedCourse = {
  courseTitle: "JavaScript Advanced",
  courseDescription:
    "A hands-on deep dive into advanced JavaScript: closures and the module pattern, prototypes and this, iterators and generators, Promises and async/await, the event loop's concurrency model, classic design patterns built from plain functions and closures, and the habits that separate production-quality code from a first draft, all through short lessons, practical tasks, assessments, and a final capstone project.",
  difficulty: "Advanced",
  modules: [module1, module2, module3, module4, module5, module6, module7],
  finalProject:
    "Build a Task Scheduler & Event Emitter entirely inside the Lumyn Academy workspace: an in-memory task scheduling system combining closures and factory functions for private state, a generator for filtering due tasks, a publish-subscribe event bus, and async/await-driven simulated task execution with defensive error handling and memoized calculations.",
  finalProjectPlan: {
    overview:
      "You'll build a Task Scheduler using a factory function that manages a private collection of tasks, each with a title, a priority, and a due tick (a plain integer standing in for a due time, so the project stays deterministic and runs entirely with setTimeout-based simulated delays). This project deliberately combines every major topic from the course: closures and a factory function for private, validated state; a generator method that yields only the tasks currently due without building an intermediate array; a publish-subscribe event bus that notifies independent listeners when a task completes; async/await with try/catch driving simulated task execution and handling a deliberately failing task; a custom error class enforcing validation with guard clauses; and a memoized helper avoiding repeated work.",
    labEnvironment: ACADEMY_WORKSPACE_LAB,
    phases: [
      {
        title: "Phase 1: Core Scheduler with Closures, Factory Functions, and Validation",
        instructions:
          "Write a custom class TaskValidationError extends Error (setting this.name = 'TaskValidationError' in its constructor). Build a factory function createTaskScheduler() that closes over a private tasks array and returns an object with addTask(title, priority, dueTick) and listTasks(). addTask() must use guard clauses to validate that title is a non-empty string, priority is a number from 1 to 5, and dueTick is a non-negative integer, throwing a TaskValidationError with a clear message for any violation. listTasks() must return a sorted copy of the tasks (not the live private array), ordered by priority first and dueTick second. Create a scheduler, add at least six valid tasks with varied priorities and due ticks, attempt one deliberately invalid addTask() call caught with try/catch and logged, and print the sorted task list.",
        evidence: [
          "script.js containing createTaskScheduler(), a TaskValidationError class, and validated addTask()/listTasks() methods",
          "Printed output showing at least six valid tasks added and one caught invalid addTask() attempt",
          "Printed output showing tasks correctly sorted by priority then dueTick",
        ],
      },
      {
        title: "Phase 2: Generators, a Pub-Sub Event Bus, and Async Task Execution",
        instructions:
          "Add a generator function dueTasks(tasks, currentTick) that yields only the tasks whose dueTick is less than or equal to currentTick, without first building an intermediate array. Build a createEventBus() factory (subscribe/publish, with subscribe returning an unsubscribe function) and subscribe at least two listeners to a 'taskCompleted' event: one that logs a message describing the completed task, and one that counts how many times it has fired. Write a delay(ms) helper returning a Promise that resolves after ms milliseconds using setTimeout, and an async function runTask(task, eventBus) that awaits delay() to simulate the task taking time, then publishes 'taskCompleted' with the task's details; wrap the await in try/catch, and make exactly one task intentionally simulate failure (for example by rejecting its delay), confirming that failure is caught and logged without crashing the rest of the run. Using a for...of loop over dueTasks(scheduler.listTasks(), currentTick), await runTask() for each due task in turn, and print the counting listener's final tally at the end.",
        evidence: [
          "Printed output showing only correctly filtered due tasks being processed, produced by a generator rather than a prebuilt array",
          "Printed output showing both event bus listeners reacting to each completed task",
          "Printed output showing the one simulated task failure correctly caught with try/catch without crashing the script",
        ],
      },
      {
        title: "Phase 3: Memoized Estimates and a Full Run Report",
        instructions:
          "Write a memoize(fn) helper using a Map, and use it to wrap a function estimateDuration(priority) that logs a message every time it actually computes a value (simulating an expensive lookup) and returns a fake duration based on priority. Call estimateDuration() once for each due task before running it in Phase 2's loop, including at least two tasks that share the same priority, and confirm in your printed output that the underlying computation only logs once per distinct priority. Organize the entire flow, building the scheduler and tasks, processing due tasks through the generator and event bus with async runTask() and estimateDuration(), into a single main() function that runs everything in order and finishes by printing a labeled summary report: total tasks added, total tasks completed, total tasks failed, and how many estimateDuration() calls were served from cache versus actually computed. Call main() exactly once, at the bottom of the file.",
        evidence: [
          "Printed output showing estimateDuration() computing once per distinct priority and returning cached results for repeated priorities",
          "A single main() entry point orchestrating the full Phase 1 through Phase 3 flow end to end",
          "A final printed summary report showing total tasks, completions, failures, and cache hit/compute counts",
        ],
      },
    ],
    deliverables: [
      "script.js containing the TaskValidationError class, createTaskScheduler() factory, dueTasks() generator, createEventBus() pub-sub system, delay()-based async runTask(), memoize()-wrapped estimateDuration(), and a single main() entry point",
      "Printed output demonstrating validated task creation, sorted listing, generator-filtered due tasks, event bus notifications, async task execution with one handled failure, memoized estimation, and a final summary report",
      "Short implementation notes explaining how each required feature (closures and factory functions, the generator, the pub-sub event bus, async/await, the custom error class, and memoization) fits into the scheduler",
    ],
    assessmentCriteria: [
      "createTaskScheduler() correctly uses closures and a factory function for private state, validating input with a custom TaskValidationError",
      "dueTasks() is a generator that correctly filters tasks without building an unnecessary intermediate array",
      "The event bus correctly notifies every subscribed listener whenever a task completes",
      "runTask() correctly uses async/await with try/catch to handle both successful and failing simulated task execution",
      "estimateDuration() is correctly memoized, computing each distinct priority's estimate only once",
      "The script is organized into single-responsibility functions run from a single main() entry point",
    ],
    safetyNotes: "Run only your own practice code inside the Academy workspace. Keep delay values small so the full scheduler run finishes quickly.",
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
