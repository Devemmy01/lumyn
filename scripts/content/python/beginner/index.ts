import type { GeneratedCourse } from "@/lib/academy";
import { ACADEMY_WORKSPACE_LAB } from "@/lib/academy";
import { module1 } from "./module-1";
import { module2 } from "./module-2";
import { module3 } from "./module-3";
import { module4 } from "./module-4";
import { module5 } from "./module-5";
import { module6 } from "./module-6";
import { module7 } from "./module-7";

export const pythonBeginnerCourse: GeneratedCourse = {
  courseTitle: "Python Fundamentals",
  courseDescription:
    "A hands-on introduction to Python covering variables, control flow, loops, collections, functions, and file handling: through short lessons, practical tasks, assessments, and a final capstone project.",
  difficulty: "Beginner",
  modules: [module1, module2, module3, module4, module5, module6, module7],
  finalProject:
    "Build a Personal Expense Tracker entirely inside the Lumyn Academy workspace: a program that stores expenses, calculates totals and breakdowns by category, and saves/loads the expense log from a file, combining every skill from this course.",
  finalProjectPlan: {
    overview:
      "You'll build a command-line-style Personal Expense Tracker that stores a list of expenses (each with a category and amount), calculates useful summaries, and persists the data to a file so it survives between runs. This project deliberately combines every major topic from the course: variables and data types, conditionals, loops, lists and dictionaries, functions, string formatting, error handling, and file I/O.",
    labEnvironment: ACADEMY_WORKSPACE_LAB,
    phases: [
      {
        title: "Phase 1: Data & Core Functions",
        instructions:
          "Represent each expense as a dictionary with 'category' and 'amount' keys, stored in a list. Write functions: add_expense(expenses, category, amount) that appends a new dictionary to the list, total_spent(expenses) that returns the sum of all amounts using a loop, and spent_by_category(expenses, category) that returns the total for just one category. Seed the list with at least 6 sample expenses across at least 3 categories.",
        evidence: [
          "expense_tracker.py containing the expense list and the three core functions",
          "Printed output showing total_spent() and spent_by_category() producing correct results",
        ],
      },
      {
        title: "Phase 2: Reporting and Error Handling",
        instructions:
          "Write a function print_report(expenses) that loops through every expense and prints it in a readable, formatted line using an f-string, then prints the grand total at the end. Write a function add_expense_safe(expenses, category, amount_text) that accepts amount as a string (simulating user input), uses try/except to catch a ValueError if it isn't a valid number, and only adds the expense if conversion succeeds.",
        evidence: [
          "print_report() output showing every expense plus a correct grand total",
          "A demonstrated call to add_expense_safe() with invalid text that is caught and reported without crashing the program",
        ],
      },
      {
        title: "Phase 3: Saving and Loading from a File",
        instructions:
          "Write a function save_expenses(expenses, filename) that writes each expense to a file as one line per expense (e.g. 'Groceries,42.50'), using with open(...) safely. Write a matching function load_expenses(filename) that reads the file back, splits each line, converts the amount back to a float, and rebuilds the list of dictionaries. Run save, then a fresh load, and print the reloaded report to prove the round trip works.",
        evidence: [
          "expenses.txt created in the Academy workspace containing the saved data",
          "Output showing the reloaded expenses match the originally saved ones, printed via print_report()",
        ],
      },
    ],
    deliverables: [
      "expense_tracker.py with all functions from the three phases",
      "expenses.txt showing saved expense data",
      "A final printed report generated from the reloaded data",
      "Short implementation notes explaining each function's role",
    ],
    assessmentCriteria: [
      "All core functions (add, total, by-category, report) work correctly on the sample data",
      "try/except correctly prevents invalid input from crashing the program",
      "Saving and reloading from a file round-trips the data correctly",
      "Code uses functions, loops, and f-strings appropriately rather than one long unstructured script",
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
