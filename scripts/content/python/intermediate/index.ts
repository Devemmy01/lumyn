import type { GeneratedCourse } from "@/lib/academy";
import { ACADEMY_WORKSPACE_LAB } from "@/lib/academy";
import { module1 } from "./module-1";
import { module2 } from "./module-2";
import { module3 } from "./module-3";
import { module4 } from "./module-4";
import { module5 } from "./module-5";
import { module6 } from "./module-6";
import { module7 } from "./module-7";

export const pythonIntermediateCourse: GeneratedCourse = {
  courseTitle: "Python Intermediate",
  courseDescription:
    "Build on Python fundamentals with object-oriented programming, inheritance, the standard library, comprehensions, JSON, robust exception handling, and testing: through short lessons, practical tasks, assessments, and a final capstone project.",
  difficulty: "Intermediate",
  modules: [module1, module2, module3, module4, module5, module6, module7],
  finalProject:
    "Build a Contact Book Manager entirely inside the Lumyn Academy workspace: a class-based program that stores contacts, supports adding, searching, and removing them, saves and loads the contact list to a JSON file, and uses a custom exception for invalid operations, combining every skill from this course.",
  finalProjectPlan: {
    overview:
      "You'll build a class-based Contact Book Manager with two classes: a Contact class representing one person's details, and a ContactBook class that manages a list of Contact objects. This project deliberately combines every major topic from the course: classes and instance methods, custom exceptions, the json module for saving and loading data, comprehensions and safe dictionary access, and structured error handling with try/except and finally.",
    labEnvironment: ACADEMY_WORKSPACE_LAB,
    phases: [
      {
        title: "Phase 1: Contact and ContactBook Classes",
        instructions:
          "Define a Contact class with an __init__ accepting name, phone, and email, storing each as an instance attribute, plus a method to_dict(self) that returns the contact's data as a dictionary (useful for saving to JSON later) and a method describe(self) that returns a readable one-line summary. Define a ContactBook class whose __init__ creates an empty list of Contact objects, with methods add_contact(self, contact) that appends a new Contact, and search_contacts(self, keyword) that returns a list of every Contact whose name contains the keyword (case-insensitively), using a list comprehension. Seed the ContactBook with at least 5 sample contacts and demonstrate a successful search.",
        evidence: [
          "contact_book.py containing the Contact and ContactBook classes with the required methods",
          "Printed output showing describe() for several contacts and the results of at least one search_contacts() call",
        ],
      },
      {
        title: "Phase 2: Custom Exceptions and Safe Operations",
        instructions:
          "Define two custom exceptions inheriting from Exception: DuplicateContactError and ContactNotFoundError. Update add_contact(self, contact) to raise DuplicateContactError if a contact with the same name already exists in the book. Add a method remove_contact(self, name) that raises ContactNotFoundError if no contact with that name exists, and otherwise removes it. Demonstrate both exceptions being raised and caught with try/except, printing a friendly message for each without crashing the program, and use a finally block to confirm each operation attempt completed.",
        evidence: [
          "DuplicateContactError and ContactNotFoundError class definitions, both inheriting from Exception",
          "Output showing both exceptions being triggered intentionally and caught cleanly, with finally confirming each attempt",
        ],
      },
      {
        title: "Phase 3: Saving and Loading the Contact Book as JSON",
        instructions:
          "Write a method save_to_file(self, filename) on ContactBook that converts every Contact to a dictionary (using to_dict()) and writes the resulting list to a JSON file using json.dump(). Write a method load_from_file(self, filename) that reads the JSON file back with json.load(), safely handles any dictionary missing an expected key using .get() with a sensible default, and rebuilds the list of Contact objects from the loaded data. Save your populated contact book to contacts.json, create a brand new empty ContactBook, load it from that same file, and print every contact's describe() output to prove the round trip worked correctly.",
        evidence: [
          "contacts.json created in the Academy workspace containing the saved contact data",
          "Output showing a freshly created ContactBook, loaded from contacts.json, correctly printing every contact's details",
        ],
      },
    ],
    deliverables: [
      "contact_book.py with the Contact and ContactBook classes, both custom exceptions, and all required methods",
      "contacts.json showing saved contact data",
      "Printed output demonstrating add, search, remove, duplicate and not-found error handling, and the save and load round trip",
      "Short implementation notes explaining each class's responsibilities",
    ],
    assessmentCriteria: [
      "Contact and ContactBook classes are correctly defined with working instance methods",
      "DuplicateContactError and ContactNotFoundError are correctly raised, caught, and handled without crashing the program",
      "Saving to and loading from contacts.json round-trips the contact data correctly, including safe handling of any missing keys",
      "Code uses classes, comprehensions, and try/except/finally appropriately rather than one long unstructured script",
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
