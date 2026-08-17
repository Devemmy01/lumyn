import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module5: GeneratedModule = {
  title: "Collections: Lists, Dictionaries, Tuples & Sets",
  description:
    "Store and organize multiple values at once using Python's core collection types, and learn the methods that make working with them practical.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Lists: Creating, Indexing, and Modifying",
      goal: "Create a list, access items by index, and change items in place.",
      videoTitle: "Python Lists Tutorial for Beginners",
      videoSearchQuery: "python lists tutorial indexing for beginners",
      videoLearningGoal: "See how to create a list, access elements with [index], and change or add items.",
      recommendedChannels: ["Corey Schafer", "freeCodeCamp.org"],
      keyTakeaways: [
        "A list is an ordered, changeable collection written with square brackets: fruits = [\"apple\", \"banana\"].",
        "Items are accessed by index, starting at 0: fruits[0] is the first item.",
        "Negative indexes count from the end: fruits[-1] is the last item.",
      ],
      notes:
        "A list stores multiple values in one variable, in a specific order. You access an individual item using its index in square brackets. Lists are mutable, meaning you can change an item after creating the list: fruits[1] = \"orange\" replaces the second item.",
      conceptExplanation:
        "Indexing starts at 0, not 1: the first item in fruits is fruits[0], and the last item in a 3-item list is fruits[2]. Trying to access an index that doesn't exist (like fruits[5] on a 3-item list) raises an IndexError. Negative indexing is a convenient shortcut: fruits[-1] always means 'the last item', regardless of the list's length.",
      whyItMatters: "Lists are the single most-used data structure in everyday Python code. Anywhere you have more than one related value, a list is often the right tool.",
      practicalTask:
        "Create a list of 5 of your favorite foods. Print the first item, the last item (using negative indexing), and the full list. Then change the second item to a different food and print the list again to show the change.",
      challenge: "Add a new item to the end of the list using append(), and remove one item using remove(), printing the list after each change.",
      expectedResult: "The program prints the first item, last item, and the modified list showing the second item changed.",
      tests: ["List has at least 5 items", "First and last items are accessed with indexing (including at least one negative index)"],
      hint: "fruits[-1] always gives you the last item, no matter how long the list is.",
      lessonAssessment: [
        {
          question: "In the list colors = [\"red\", \"green\", \"blue\"], what is colors[0]?",
          options: ["\"red\"", "\"green\"", "\"blue\"", "An error"],
          correctAnswerIndex: 0,
          explanation: "List indexing starts at 0, so colors[0] is the first item, \"red\".",
        },
        {
          question: "What does colors[-1] return for colors = [\"red\", \"green\", \"blue\"]?",
          options: ["\"red\"", "\"green\"", "\"blue\"", "An error"],
          correctAnswerIndex: 2,
          explanation: "Negative indexing counts from the end, so -1 refers to the last item, \"blue\".",
        },
      ],
      commonMistakes: ["Assuming indexing starts at 1 instead of 0.", "Accessing an index beyond the list's length, causing an IndexError."],
      deliverables: ["A script creating, indexing, and modifying a list"],
      assessmentCriteria: ["Correct use of positive and negative indexing", "List modification demonstrated correctly"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "python",
        code: 'fruits = ["apple", "banana", "cherry"]\nprint(fruits[0])\nprint(fruits[-1])\nfruits[1] = "orange"\nprint(fruits)',
        explanation: "fruits[0] accesses the first item, fruits[-1] the last, and reassigning fruits[1] changes the second item in place.",
      },
      completionStatus: "not_started",
    },
    {
      title: "List Methods and Slicing",
      goal: "Use common list methods (append, insert, remove, sort) and slicing to work with sublists.",
      videoTitle: "Python List Methods and Slicing Explained",
      videoSearchQuery: "python list methods append sort slicing tutorial",
      videoLearningGoal: "See append, insert, remove, sort, and slice notation used on real list examples.",
      recommendedChannels: ["Programming with Mosh", "Corey Schafer"],
      keyTakeaways: [
        "append() adds an item to the end; insert() adds at a specific position; remove() deletes the first matching item.",
        "sort() rearranges a list in place, in ascending order by default.",
        "Slicing (list[start:stop]) extracts a portion of a list without changing the original.",
      ],
      notes:
        "Lists come with built-in methods for common operations. append(item) adds to the end. insert(index, item) adds at a specific position. remove(item) deletes the first matching value. sort() reorders the list in place. len(list) tells you how many items it has.",
      conceptExplanation:
        "Slicing uses the syntax list[start:stop], returning a new list containing items from index start up to (but not including) index stop. Omitting start defaults to the beginning; omitting stop defaults to the end. For example, numbers[1:4] returns items at indexes 1, 2, and 3. Slicing never modifies the original list: it always returns a new one.",
      whyItMatters: "Slicing and list methods are how you transform raw collected data into exactly the subset or order you need.",
      practicalTask:
        "Create a list of 6 numbers in random order. Print a slice showing just the middle two items. Then sort the list and print it. Finally, append one new number and print the final list.",
      challenge: "Use sort(reverse=True) to sort the list in descending order instead, and print the result.",
      expectedResult: "The program prints a 2-item slice, the sorted list, and the list after appending a new number.",
      tests: ["Slicing syntax is used correctly", "sort() and append() are both demonstrated"],
      hint: "numbers[1:3] gives you items at index 1 and 2 (not 3): the stop index is exclusive, same as range().",
      lessonAssessment: [
        {
          question: "What does [10, 20, 30, 40, 50][1:3] return?",
          options: ["[10, 20]", "[20, 30]", "[20, 30, 40]", "[30, 40]"],
          correctAnswerIndex: 1,
          explanation: "Slicing from index 1 up to (not including) index 3 returns the items at index 1 and 2: [20, 30].",
        },
        {
          question: "Does calling numbers.sort() create a new list or modify the original?",
          options: ["It creates a new list, leaving the original unchanged", "It modifies the original list in place", "It raises an error", "It only works on strings"],
          correctAnswerIndex: 1,
          explanation: "sort() rearranges the existing list directly; it does not return a new list.",
        },
      ],
      commonMistakes: ["Expecting slicing to include the stop index (it's always exclusive).", "Assuming sort() returns a new sorted list instead of modifying in place."],
      deliverables: ["A script using slicing, sort(), and append() on a list"],
      assessmentCriteria: ["Slicing produces the correct sublist", "List methods used correctly"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "python",
        code: 'numbers = [42, 7, 19, 3, 88]\nprint(numbers[1:3])\nnumbers.sort()\nprint(numbers)\nnumbers.append(100)\nprint(numbers)',
        explanation: "The slice [1:3] extracts two middle items without changing the list; sort() then reorders the list in place, and append() adds a final item.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Dictionaries, Tuples, and Sets",
      goal: "Use dictionaries for key-value pairs, tuples for fixed groups of values, and sets for unique collections.",
      videoTitle: "Python Dictionaries, Tuples, and Sets Explained",
      videoSearchQuery: "python dictionaries tuples sets tutorial for beginners",
      videoLearningGoal: "See dictionaries with key-value pairs, an immutable tuple, and a set removing duplicates.",
      recommendedChannels: ["freeCodeCamp.org", "Traversy Media"],
      keyTakeaways: [
        "A dictionary stores key-value pairs: person = {\"name\": \"Ada\", \"age\": 30}, accessed with person[\"name\"].",
        "A tuple is like a list but immutable (cannot be changed after creation): point = (3, 4).",
        "A set stores only unique values and automatically removes duplicates.",
      ],
      notes:
        "Dictionaries are ideal when data has named fields rather than just an order: person[\"name\"] is clearer than person[0]. Tuples are used for fixed groups of values that shouldn't change, like coordinates. Sets are useful whenever you need to guarantee no duplicates.",
      conceptExplanation:
        "Dictionary keys must be unique; assigning to an existing key overwrites its value: person[\"age\"] = 31 updates age rather than adding a duplicate entry. Tuples use parentheses instead of square brackets and raise a TypeError if you try to change an item after creation. This immutability makes them safe to pass around without worrying about accidental changes. A set is created with curly braces or set(), and set([1, 2, 2, 3]) automatically collapses to {1, 2, 3}.",
      whyItMatters: "Choosing the right collection type (list, dict, tuple, or set) makes your code's intent clearer and prevents entire categories of bugs.",
      practicalTask:
        "Create a dictionary representing a book with keys title, author, and year. Print each value using its key. Then create a tuple representing a coordinate (x, y) and print both values. Finally, create a set from a list that has duplicate numbers and print it to show the duplicates are gone.",
      challenge: "Add a new key, \"rating\", to the book dictionary after creating it, and print the updated dictionary.",
      expectedResult: "The program prints the book's title, author, and year; the tuple's two values; and a deduplicated set.",
      tests: ["Dictionary values accessed by key, not index", "A set is created from a list containing duplicates"],
      hint: "Adding a new key to a dictionary looks like: book[\"rating\"] = 5",
      lessonAssessment: [
        {
          question: "How do you access the value for the key \"name\" in a dictionary called person?",
          options: ["person[0]", "person.name", "person[\"name\"]", "person(\"name\")"],
          correctAnswerIndex: 2,
          explanation: "Dictionary values are accessed using square brackets with the key inside, like person[\"name\"].",
        },
        {
          question: "What happens when you try to change an item in a tuple after it's created?",
          options: ["It updates normally, like a list", "Python raises a TypeError", "The tuple silently ignores the change", "It converts the tuple to a list automatically"],
          correctAnswerIndex: 1,
          explanation: "Tuples are immutable, so attempting to assign to an index raises a TypeError.",
        },
      ],
      commonMistakes: ["Trying to index a dictionary with a number instead of a key.", "Expecting a tuple to be changeable like a list."],
      deliverables: ["A script demonstrating a dictionary, a tuple, and a set"],
      assessmentCriteria: ["Dictionary accessed by key correctly", "Set correctly removes duplicate values"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 minutes",
      codeExample: {
        language: "python",
        code: 'book = {"title": "Dune", "author": "Frank Herbert", "year": 1965}\nprint(book["title"], "by", book["author"])\n\npoint = (3, 4)\nprint(point[0], point[1])\n\nnumbers = {1, 2, 2, 3, 3, 3}\nprint(numbers)',
        explanation: "The dictionary values are accessed by key, the tuple holds two fixed coordinate values, and the set automatically collapses duplicate numbers to {1, 2, 3}.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Collections Assessment",
    questions: [
      { question: "What index does the first item in a Python list have?", options: ["1", "0", "-1", "It depends on the list"], correctAnswerIndex: 1, explanation: "Python list indexing is zero-based, so the first item is at index 0." },
      { question: "What does colors[-1] return for a list?", options: ["The first item", "The last item", "An empty list", "An error, always"], correctAnswerIndex: 1, explanation: "Negative index -1 refers to the last item in the list." },
      { question: "What does [1, 2, 3, 4, 5][1:4] return?", options: ["[1, 2, 3, 4]", "[2, 3, 4]", "[2, 3, 4, 5]", "[1, 2, 3]"], correctAnswerIndex: 1, explanation: "Slicing from index 1 up to (not including) 4 returns items at indexes 1, 2, and 3: [2, 3, 4]." },
      { question: "Which method adds an item to the end of a list?", options: ["insert()", "append()", "add()", "extend_one()"], correctAnswerIndex: 1, explanation: "append() adds a single item to the end of a list." },
      { question: "Does sort() modify a list in place or return a new sorted list?", options: ["Modifies in place", "Returns a new list, leaving the original unchanged", "Both", "Neither"], correctAnswerIndex: 0, explanation: "sort() rearranges the existing list directly rather than creating a new one." },
      { question: "How are dictionary values accessed?", options: ["By numeric index", "By key", "By value", "Dictionaries cannot be accessed"], correctAnswerIndex: 1, explanation: "Dictionaries map keys to values, and you retrieve a value using its key, like person[\"name\"]." },
      { question: "What is a key property of tuples that distinguishes them from lists?", options: ["They can only hold numbers", "They are immutable (cannot be changed after creation)", "They cannot be printed", "They must always have exactly 2 items"], correctAnswerIndex: 1, explanation: "Tuples cannot be modified after creation, unlike lists which are mutable." },
      { question: "What happens when you create a set from [1, 1, 2, 3, 3]?", options: ["{1, 1, 2, 3, 3}", "{1, 2, 3}", "[1, 2, 3]", "An error"], correctAnswerIndex: 1, explanation: "Sets automatically remove duplicate values, collapsing the list to {1, 2, 3}." },
      { question: "Which collection type would be best for storing a person's name, age, and email as named fields?", options: ["A list", "A tuple", "A dictionary", "A set"], correctAnswerIndex: 2, explanation: "A dictionary lets you use descriptive keys (name, age, email) rather than relying on positional order." },
      { question: "What does assigning to an existing dictionary key do, e.g. person[\"age\"] = 31 when age already exists?", options: ["Adds a duplicate key", "Raises an error", "Overwrites the existing value for that key", "Does nothing"], correctAnswerIndex: 2, explanation: "Since dictionary keys must be unique, assigning to an existing key simply updates its value." },
    ],
  },
  assignment:
    "Build a 'Contact Book' script: create a list of at least 4 dictionaries, each representing a contact with keys name, phone, and email. Loop through the list and print each contact's details in a readable format. Then add one more contact to the list using append() and print the full updated contact book.",
  assignmentDeliverables: ["A script with a list of dictionaries and a loop printing each one", "Output showing the appended contact"],
  assignmentAssessmentCriteria: ["Dictionaries correctly structured with the required keys", "Loop correctly iterates and prints every contact"],
  miniProject:
    "Build a 'Shopping List Manager': start with a list of grocery items. Implement (using plain code, not functions yet) adding a new item, removing an item that's already been bought, sorting the list alphabetically, and printing the final list at each stage so the changes are visible.",
  miniProjectDeliverables: ["shopping_list.py in the Academy workspace", "Output showing the list before and after each operation"],
  miniProjectAssessmentCriteria: ["Add, remove, and sort operations all work correctly", "Output clearly shows the list changing at each step"],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
