import type { GeneratedCourse } from "@/lib/academy";
import { ACADEMY_WORKSPACE_LAB } from "@/lib/academy";
import { module1 } from "./module-1";
import { module2 } from "./module-2";
import { module3 } from "./module-3";
import { module4 } from "./module-4";
import { module5 } from "./module-5";
import { module6 } from "./module-6";
import { module7 } from "./module-7";

export const pythonAdvancedCourse: GeneratedCourse = {
  courseTitle: "Python Advanced",
  courseDescription:
    "A hands-on deep dive into advanced Python: dunder methods and operator overloading, decorators and closures, iterators and generators, context managers, concurrency fundamentals, classic design patterns, and the habits that separate production-quality code from a first draft, all through short lessons, practical tasks, assessments, and a final capstone project.",
  difficulty: "Advanced",
  modules: [module1, module2, module3, module4, module5, module6, module7],
  finalProject:
    "Build a Task Scheduler entirely inside the Lumyn Academy workspace: an in-memory task scheduling and event system combining dunder methods, a custom context manager, a generator function, and a custom decorator, that saves and loads its tasks to and from a JSON file.",
  finalProjectPlan: {
    overview:
      "You'll build a class-based Task Scheduler that manages a collection of tasks, each with a title, a priority, and a due day (a plain integer standing in for a due date, so the project stays deterministic and easy to test). This project deliberately combines every major topic from the course: a Task class with dunder methods for representation, equality, and ordering; a generator method that yields only the tasks currently due; a custom context manager for timing how long processing takes; a decorator that logs when a task handler runs; and JSON file persistence so the scheduler's state survives between runs.",
    labEnvironment: ACADEMY_WORKSPACE_LAB,
    phases: [
      {
        title: "Phase 1: Core Task and TaskScheduler Classes",
        instructions:
          "Build a Task class storing title, priority (1 is highest urgency, 5 is lowest), and due_day (a plain integer representing which day it's due). Implement __repr__ so printing a task shows a clear constructor-like string, __eq__ so two tasks with the same title and due_day are considered equal, and __lt__ so tasks sort by priority first and due_day second (a lower priority number and an earlier due_day sort first). Build a TaskScheduler class that holds a list of Task objects with methods add_task(task) and all_tasks() returning a sorted copy of the list using your __lt__ implementation. Create at least 6 tasks with varied priorities and due days, add them to a scheduler, and print the sorted list to confirm the ordering is correct.",
        evidence: [
          "main.py containing the Task and TaskScheduler classes",
          "Printed output showing at least 6 tasks correctly sorted by priority then due_day",
        ],
      },
      {
        title: "Phase 2: Generators, a Context Manager, and a Logging Decorator",
        instructions:
          "Add a generator method due_tasks(self, current_day) to TaskScheduler that yields only the tasks whose due_day is less than or equal to current_day, without building an intermediate list. Write a context manager, either a class with __enter__ and __exit__, or built with @contextlib.contextmanager, called processing_timer that measures and prints how long a block of code took using the time module. Write a decorator called log_handler_call that prints a message each time the function it wraps is called. Define a handler function, decorated with @log_handler_call, that takes a task and prints a message describing it being processed. Inside a with processing_timer(): block, loop through scheduler.due_tasks(current_day) for a chosen current_day and call your decorated handler on each due task.",
        evidence: [
          "Printed output showing only the correctly filtered due tasks being processed",
          "Printed output showing the logging decorator's message for each processed task",
          "Printed elapsed time from the processing_timer context manager",
        ],
      },
      {
        title: "Phase 3: Saving and Loading Tasks with JSON",
        instructions:
          "Write a function save_tasks(scheduler, filename) that converts each Task in the scheduler into a dictionary with title, priority, and due_day, and writes the full list to a JSON file using the json module and a with open(...) block. Write a matching function load_tasks(filename) that reads the JSON file back, reconstructs each dictionary into a new Task object, and returns a new TaskScheduler containing them. Save your scheduler from Phase 1, then load it back into a fresh TaskScheduler, print the reloaded, sorted task list, and confirm the reloaded data matches the original. Organize the whole script with functions and a final if __name__ == \"__main__\": block that runs the complete Phase 1 through Phase 3 flow in order.",
        evidence: [
          "tasks.json created in the Academy workspace containing the saved task data",
          "Printed output showing the reloaded TaskScheduler's sorted tasks matching the originally saved ones",
          "The full script runs end to end from a single if __name__ == \"__main__\": block",
        ],
      },
    ],
    deliverables: [
      "main.py containing the Task class, TaskScheduler class, due_tasks() generator, processing_timer context manager, log_handler_call decorator, and save/load functions",
      "tasks.json showing saved task data",
      "Printed output demonstrating sorted tasks, filtered due tasks, decorator logging, timing output, and a successful save and load round trip",
      "Short implementation notes explaining how each required feature (dunder methods, context manager, generator, decorator) fits into the scheduler",
    ],
    assessmentCriteria: [
      "Task correctly implements __repr__, __eq__, and __lt__, and TaskScheduler sorts using them",
      "due_tasks() is a generator that correctly filters tasks without building an unnecessary intermediate list",
      "The context manager correctly times a block of code, and the decorator correctly logs handler calls",
      "Saving and loading tasks to and from JSON round-trips the data correctly",
      "The script is organized into functions and guarded with if __name__ == \"__main__\":",
    ],
    safetyNotes: "Run only your own practice code inside the Academy workspace, and only read or write files you created yourself as part of this project.",
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
