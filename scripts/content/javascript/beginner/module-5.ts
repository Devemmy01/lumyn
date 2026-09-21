import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module5: GeneratedModule = {
  title: "Collections: Arrays & Objects",
  description:
    "Learn to store and organize multiple related values using array literals and common array methods, then group named data together with object literals and property access.",
  completionStatus: "locked",
  lessons: [
    {
      title: "Array Literals and Core Array Methods",
      goal: "Create arrays, access items by index, and use push, pop, and length to manage their contents.",
      videoTitle: "JavaScript Arrays Explained: push, pop, length, indexing",
      videoSearchQuery: "javascript arrays push pop length tutorial for beginners",
      videoLearningGoal: "See an array being created, indexed, and modified with push and pop.",
      recommendedChannels: ["freeCodeCamp.org", "Web Dev Simplified"],
      keyTakeaways: [
        "An array literal groups multiple values in order using square brackets, like [\"a\", \"b\", \"c\"].",
        "Array items are accessed by a zero-based index: array[0] is the first item.",
        "push() adds an item to the end, pop() removes the last item, and length tells you how many items are in the array.",
      ],
      notes:
        "An array is an ordered list of values, created with square brackets and comma-separated items: const fruits = [\"apple\", \"banana\", \"cherry\"];. Each item has a numeric position called an index, starting at 0, so fruits[0] is \"apple\" and fruits[2] is \"cherry\". Arrays are commonly declared with const, since you're usually changing the array's contents rather than reassigning the variable to a completely different array.",
      conceptExplanation:
        "fruits.push(\"date\") adds \"date\" to the end of the array, growing its length by one. fruits.pop() removes and returns the last item, shrinking the length by one. fruits.length always reflects the current number of items, which is useful for loops: for (let i = 0; i < fruits.length; i++) safely visits every index without hardcoding a number that might become wrong later. Trying to access an index beyond the array's length, like fruits[10] on a 3-item array, returns undefined rather than an error.",
      whyItMatters: "Arrays are how you'll store and process any list of related data: names, scores, tasks, or anything else with more than one value, throughout the rest of this course.",
      practicalTask:
        "Create an array of at least 4 favorite movies. Print the first and last item by index, print the array's length, then push a new movie onto the end and pop the original first item off using an index-based approach, printing the array after each change.",
      challenge: "Write a for loop that prints every item in the array with its index, formatted like \"0: Movie Title\".",
      expectedResult: "The script prints the first and last movie, the length, and the array's contents after each push and pop operation.",
      tests: ["Array has at least 4 items initially", "push() and pop() are both demonstrated with printed results"],
      hint: "The last item's index is always array.length - 1, since indexing starts at 0.",
      lessonAssessment: [
        {
          question: "What is the index of the first item in a JavaScript array?",
          options: ["1", "0", "-1", "It depends on the array"],
          correctAnswerIndex: 1,
          explanation: "JavaScript arrays are zero-indexed, so the first item is always at index 0.",
        },
        {
          question: "What does array.pop() do?",
          options: ["Adds an item to the end", "Removes and returns the last item", "Removes the first item", "Empties the entire array"],
          correctAnswerIndex: 1,
          explanation: "pop() removes the last item from the array and returns it, reducing the array's length by one.",
        },
      ],
      commonMistakes: ["Trying to access array[array.length] expecting the last item, which is actually one past the end.", "Confusing push (adds to the end) with pop (removes from the end)."],
      deliverables: ["A script demonstrating array creation, indexing, push, pop, and length"],
      assessmentCriteria: ["Indexing correctly retrieves the first and last items", "push and pop correctly modify the array"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "javascript",
        code: 'const movies = ["Inception", "Arrival", "Up", "Coco"];\nconsole.log(movies[0]);\nconsole.log(movies[movies.length - 1]);\nmovies.push("Dune");\nconsole.log(movies);\nmovies.pop();\nconsole.log(movies);',
        explanation: "The array is indexed at both ends, grown with push(), then shrunk again with pop(), printing the result after each change.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Object Literals and Property Access",
      goal: "Group related named values together in an object and access them with dot and bracket notation.",
      videoTitle: "JavaScript Objects Explained: dot notation vs bracket notation",
      videoSearchQuery: "javascript object literals dot notation bracket notation tutorial",
      videoLearningGoal: "See an object literal created with key-value pairs and accessed both ways.",
      recommendedChannels: ["The Net Ninja", "Programming with Mosh"],
      keyTakeaways: [
        "An object literal groups related values under named keys using curly braces, like { name: \"Ada\", age: 25 }.",
        "Dot notation (object.key) is the common way to access a property when you know its name in advance.",
        "Bracket notation (object[\"key\"]) works with property names stored in a variable or that aren't valid identifiers.",
      ],
      notes:
        "Unlike an array, which orders values by position, an object organizes values by name. Each name (called a key or property) maps to a value: const person = { name: \"Ada\", age: 25, isStudent: true };. You read a property with person.name (dot notation) or person[\"name\"] (bracket notation), and both return the same value.",
      conceptExplanation:
        "Dot notation is more common and reads cleanly, but it only works when the property name is a fixed, valid identifier written directly in your code. Bracket notation is required when the property name is stored in a variable, like const key = \"age\"; person[key];, since person.key would look for a literal property named \"key\" rather than using the variable's value. You can also add a new property or change an existing one with either notation: person.city = \"Lagos\"; works just like person[\"city\"] = \"Lagos\";.",
      whyItMatters: "Objects are how you model real-world things with multiple attributes, like a user, a product, or a contact, and you'll combine them with arrays constantly in later modules and projects.",
      practicalTask:
        "Create an object representing a book with at least four properties: title, author, year, and pages. Print two of the properties using dot notation and two using bracket notation. Then add a new property, rating, and print the whole object.",
      challenge: "Store a property name in a variable and use bracket notation with that variable to read the corresponding value from your book object.",
      expectedResult: "The script prints four book properties using both notations, then prints the object again after adding a rating property.",
      tests: ["At least 2 properties are accessed with dot notation", "At least 2 properties are accessed with bracket notation"],
      hint: "Bracket notation needs the property name in quotes (or a variable holding a string), like book[\"author\"].",
      lessonAssessment: [
        {
          question: "Given const car = { brand: \"Toyota\" };, which correctly reads the brand property?",
          options: ["car.brand", "car->brand", "car::brand", "car(brand)"],
          correctAnswerIndex: 0,
          explanation: "Dot notation, object.property, is the standard way to access a known property name.",
        },
        {
          question: "When is bracket notation required instead of dot notation?",
          options: [
            "Never, dot notation always works",
            "When the property name is stored in a variable",
            "Only for arrays, never for objects",
            "Only when the value is a number",
          ],
          correctAnswerIndex: 1,
          explanation: "Bracket notation is needed when the property name comes from a variable, since dot notation only accepts a literal name.",
        },
      ],
      commonMistakes: ["Using dot notation with a variable, like object.key, expecting it to use the variable's value instead of looking for a literal property named 'key'.", "Forgetting quotes around a literal property name in bracket notation, like object[title] instead of object[\"title\"]."],
      deliverables: ["A script demonstrating an object with 4+ properties accessed with both notations"],
      assessmentCriteria: ["Dot notation and bracket notation are both used correctly", "A new property is added and printed successfully"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "javascript",
        code: 'const book = { title: "Dune", author: "Frank Herbert", year: 1965, pages: 412 };\nconsole.log(book.title);\nconsole.log(book["author"]);\nbook.rating = 5;\nconsole.log(book);',
        explanation: "title is read with dot notation, author with bracket notation, and a new rating property is added before printing the full object.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Arrays of Objects and Working with Nested Data",
      goal: "Combine arrays and objects to represent and process a list of structured records.",
      videoTitle: "JavaScript Arrays of Objects Explained",
      videoSearchQuery: "javascript array of objects tutorial for beginners",
      videoLearningGoal: "See a for...of loop process an array of objects, reading a different property from each one.",
      recommendedChannels: ["Fireship", "freeCodeCamp.org"],
      keyTakeaways: [
        "An array can hold objects as its items, letting you represent a list of structured records, like a list of users.",
        "for...of combined with dot notation is the standard way to process every object in an array.",
        "Nested access, like students[0].scores[1], chains indexing and property access together to reach deeply stored data.",
      ],
      notes:
        "Combining arrays and objects is one of the most common patterns in real JavaScript code: an array of objects represents a list of records, where each object has the same shape (the same set of property names) describing one item, like one student, one product, or one contact.",
      conceptExplanation:
        "const students = [{ name: \"Ada\", grade: 90 }, { name: \"Tomi\", grade: 85 }]; is an array containing two objects. for (const student of students) { console.log(student.name, student.grade); } visits each object in turn, letting you read its properties with dot notation just like any other object. When an object itself contains an array (like a scores list inside a student object), you chain access together: student.scores[0] reaches the first score inside that particular student.",
      whyItMatters: "Arrays of objects are how nearly all real data is shaped, from a list of contacts to API responses, making this pattern essential before building any larger project.",
      practicalTask:
        "Create an array of at least 3 objects, each representing a student with name and grade properties. Use a for...of loop to print a formatted line for each student showing their name and grade.",
      challenge: "Add a scores array property to each student object (e.g. scores: [88, 92, 79]) and print the first score for each student inside the same loop.",
      expectedResult: "The script prints one formatted line per student, showing their name and grade, using a single for...of loop.",
      tests: ["Array contains at least 3 objects with consistent properties", "for...of loop correctly prints each object's properties"],
      hint: "Inside the loop, the loop variable is one whole object, so use dot notation on it directly, like student.name.",
      lessonAssessment: [
        {
          question: "Given const items = [{ id: 1 }, { id: 2 }];, what does items[1].id evaluate to?",
          options: ["1", "2", "undefined", "An error"],
          correctAnswerIndex: 1,
          explanation: "items[1] accesses the second object ({ id: 2 }), and .id reads its id property, which is 2.",
        },
        {
          question: "What does the loop variable represent inside for (const student of students) when students is an array of objects?",
          options: ["The index of the current object", "The whole current object", "Only the first property of the object", "The entire students array"],
          correctAnswerIndex: 1,
          explanation: "for...of assigns each full value from the array to the loop variable in turn, so student is one complete object per iteration.",
        },
      ],
      commonMistakes: ["Forgetting that the for...of loop variable is the whole object, and trying to index into it like an array.", "Giving objects in the same array inconsistent property names, making them harder to process uniformly."],
      deliverables: ["A script with an array of 3+ student objects processed in a for...of loop"],
      assessmentCriteria: ["Every object in the array is printed correctly", "Property access on each object works without errors"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 minutes",
      codeExample: {
        language: "javascript",
        code: 'const students = [\n  { name: "Ada", grade: 90 },\n  { name: "Tomi", grade: 85 },\n  { name: "Chinedu", grade: 78 },\n];\n\nfor (const student of students) {\n  console.log(student.name, "-", student.grade);\n}',
        explanation: "The for...of loop visits each student object in turn, and dot notation reads its name and grade properties directly.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Collections: Arrays & Objects Assessment",
    questions: [
      { question: "What is the index of the first item in a JavaScript array?", options: ["1", "0", "-1", "Depends on the array"], correctAnswerIndex: 1, explanation: "JavaScript arrays are zero-indexed; the first item is at index 0." },
      { question: "Given const nums = [10, 20, 30];, what does nums.length return?", options: ["2", "3", "30", "undefined"], correctAnswerIndex: 1, explanation: "length returns the number of items in the array, which is 3." },
      { question: "What does array.push(value) do?", options: ["Removes the last item", "Adds value to the end of the array", "Adds value to the start of the array", "Removes value from the array"], correctAnswerIndex: 1, explanation: "push() appends a new item to the end of the array." },
      { question: "Given const person = { name: \"Kai\" };, which correctly reads the name property?", options: ["person.name", "person->name", "person::name", "person(name)"], correctAnswerIndex: 0, explanation: "Dot notation is the standard way to access a known object property." },
      { question: "When must you use bracket notation instead of dot notation on an object?", options: ["Always", "When the property name is stored in a variable", "Never", "Only for numeric properties"], correctAnswerIndex: 1, explanation: "Bracket notation is required when accessing a property whose name is held in a variable." },
      { question: "Given const arr = [1, 2, 3];, what does arr[arr.length - 1] return?", options: ["1", "2", "3", "undefined"], correctAnswerIndex: 2, explanation: "arr.length - 1 is the index of the last item; for this array that's index 2, which holds 3." },
      { question: "What does array.pop() return?", options: ["The first item", "The last item, after removing it", "The array's length", "undefined always"], correctAnswerIndex: 1, explanation: "pop() removes the last item from the array and returns that removed value." },
      { question: "Given const items = [{ id: 1 }, { id: 2 }];, what does items[0].id evaluate to?", options: ["0", "1", "2", "undefined"], correctAnswerIndex: 1, explanation: "items[0] is the first object ({ id: 1 }), and .id reads its id property, 1." },
      { question: "What does for (const item of someArray) assign to item on each pass?", options: ["The current index", "The current value from the array", "The whole array", "Nothing, it errors"], correctAnswerIndex: 1, explanation: "for...of assigns each value from the array to the loop variable directly, without needing an index." },
      { question: "What happens when you access an array index beyond its length, like arr[99] on a 3-item array?", options: ["It throws an error", "It returns undefined", "It returns the last item", "It automatically extends the array with zeros"], correctAnswerIndex: 1, explanation: "Accessing an out-of-range index returns undefined rather than throwing an error." },
    ],
  },
  assignment:
    "Build a 'Shopping List Manager' script in the Academy workspace: create an array of at least 5 grocery items as strings, print the full list, print the total number of items using length, push two new items onto the list, remove the last item with pop, and print the final list after each change.",
  assignmentDeliverables: [
    "A single JavaScript file demonstrating array creation, length, push, and pop",
    "Console output showing the list after each modification",
  ],
  assignmentAssessmentCriteria: [
    "The array starts with at least 5 items",
    "push and pop are both demonstrated with correct results",
    "length is used correctly to report the item count",
  ],
  miniProject:
    "Build a 'Contact Directory' program that creates an array of at least 4 contact objects, each with name, phone, and email properties, uses a for...of loop to print a formatted line for every contact, then adds a new contact object to the array with push and prints the updated directory using the same loop.",
  miniProjectDeliverables: ["A contactDirectory.js file in the Academy workspace", "Console output showing all contacts printed before and after the new contact is added"],
  miniProjectAssessmentCriteria: [
    "Every contact object has consistent name, phone, and email properties",
    "The for...of loop correctly prints every contact's details",
    "A new contact is correctly appended and reflected in the output",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
