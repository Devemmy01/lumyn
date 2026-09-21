import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module4: GeneratedModule = {
  title: "Array Methods & Functional Programming",
  description:
    "Move beyond for loops with map, filter, and reduce, chain array methods together to build data pipelines, and use destructuring and spread/rest syntax to write cleaner, more expressive JavaScript.",
  completionStatus: "locked",
  lessons: [
    {
      title: "map, filter, and reduce: Transforming Arrays Functionally",
      goal: "Use map() to transform every element of an array, filter() to keep only matching elements, and reduce() to combine an array into a single value.",
      videoTitle: "JavaScript map, filter, reduce Explained",
      videoSearchQuery: "javascript map filter reduce tutorial array methods",
      videoLearningGoal: "See map, filter, and reduce each solve a different kind of array transformation without writing a manual for loop.",
      recommendedChannels: ["Web Dev Simplified", "Fireship"],
      keyTakeaways: [
        "array.map(callback) returns a new array with every element transformed by the callback function.",
        "array.filter(callback) returns a new array containing only the elements for which the callback returns true.",
        "array.reduce(callback, initialValue) combines every element into a single accumulated value, like a total or a summary object.",
      ],
      notes:
        "map, filter, and reduce are functions built onto every array that replace many common for loop patterns. Each one takes a callback function that describes what to do with each element, and none of them change the original array, they return a brand new result.",
      conceptExplanation:
        "[1, 2, 3].map(n => n * 2) returns [2, 4, 6], a new array with every element doubled. [1, 2, 3, 4].filter(n => n % 2 === 0) returns [2, 4], keeping only the elements where the callback returns true. [1, 2, 3, 4].reduce((total, n) => total + n, 0) returns 10, starting the accumulator (total) at 0 and adding each element to it in turn. The second argument to reduce is the starting value of the accumulator, and forgetting it can cause the first element to be used as the starting accumulator instead, which is often not what you want.",
      whyItMatters: "map, filter, and reduce are the foundation of functional-style JavaScript, used constantly to transform, narrow down, and summarize data from arrays and API-shaped data without manually managing loop counters.",
      practicalTask:
        "In the Academy workspace, script.js is already open for you. Create an array of at least 6 numbers. Use map() to create a new array with every number doubled and print it. Use filter() to create a new array containing only the numbers greater than 10 and print it. Use reduce() to calculate the sum of all the original numbers and print it.",
      challenge: "Create an array of at least 4 objects, each representing a product with name and price. Use reduce() to calculate the total price of all products, and use map() to create a new array of just the product names (a list of strings).",
      expectedResult: "The program prints a doubled array, a filtered array of numbers greater than 10, and the correct sum of the original numbers.",
      tests: ["map() correctly transforms every element into a new array", "reduce() correctly combines the array into a single summed value"],
      hint: "reduce() always needs a starting value as its second argument, or the first array element becomes the starting accumulator instead, which can produce unexpected results.",
      lessonAssessment: [
        {
          question: "What does [1, 2, 3].map(n => n * 2) return?",
          options: ["[1, 2, 3]", "[2, 4, 6]", "6", "undefined"],
          correctAnswerIndex: 1,
          explanation: "map() returns a new array where every element has been transformed by the callback, here doubling each number.",
        },
        {
          question: "What does the second argument to reduce(callback, initialValue) control?",
          options: [
            "The index to start looping from",
            "The starting value of the accumulator before processing any elements",
            "The maximum number of elements to process",
            "Nothing, it is optional and has no effect",
          ],
          correctAnswerIndex: 1,
          explanation: "The second argument to reduce() sets the accumulator's initial value; omitting it makes the first array element the starting accumulator instead.",
        },
      ],
      commonMistakes: ["Expecting map() or filter() to change the original array, when both always return a brand new array and leave the original untouched.", "Omitting reduce()'s initial value argument, which silently changes behavior by using the first element as the starting accumulator instead of 0 or another intended starting point."],
      deliverables: ["A script using map(), filter(), and reduce() on the same array"],
      assessmentCriteria: ["map() correctly transforms every element", "filter() correctly narrows the array based on a condition", "reduce() correctly produces a single summarized value"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'const numbers = [3, 8, 12, 5, 20, 7];\n\nconst doubled = numbers.map((n) => n * 2);\nconsole.log(doubled);\n\nconst aboveTen = numbers.filter((n) => n > 10);\nconsole.log(aboveTen);\n\nconst sum = numbers.reduce((total, n) => total + n, 0);\nconsole.log(sum);',
        explanation: "map() returns every number doubled, filter() keeps only numbers greater than 10, and reduce() accumulates every number into a single sum starting from 0.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Method Chaining: Combining Array Methods",
      goal: "Chain multiple array methods together to build a single readable data-processing pipeline.",
      videoTitle: "JavaScript Method Chaining Tutorial: map, filter, reduce Together",
      videoSearchQuery: "javascript method chaining array map filter reduce tutorial",
      videoLearningGoal: "See map, filter, and reduce chained together in one expression to process data step by step.",
      recommendedChannels: ["Traversy Media", "freeCodeCamp.org"],
      keyTakeaways: [
        "Because map() and filter() each return a new array, their results can be immediately chained with another array method using dot notation.",
        "Chaining reads as a sequence of steps: filter first to narrow down, then map to transform, then reduce to summarize, in whatever order the task needs.",
        "Each step in a chain should do one clear thing, making the whole chain easier to read than one large, mixed-purpose loop.",
      ],
      notes:
        "Once you are comfortable with map, filter, and reduce individually, chaining them together lets you express a multi-step data transformation as one readable pipeline instead of several separate loops or intermediate variables.",
      conceptExplanation:
        "orders.filter(order => order.completed).map(order => order.total).reduce((sum, total) => sum + total, 0) first keeps only completed orders, then extracts just their totals, then adds those totals together into one number. Each dot-notation call works on the result of the one before it, since filter() and map() both return arrays that support the next method in the chain. Breaking a long chain across multiple lines, one method per line, keeps it readable even as it grows.",
      whyItMatters: "Chaining is how real JavaScript code expresses multi-step data processing clearly and concisely, and recognizing this pattern is essential for reading code written by other developers.",
      practicalTask:
        "Create an array of at least 6 order objects, each with amount and completed (a boolean) properties. In a single chained expression, filter() the array to keep only completed orders, map() the result to just their amount values, then reduce() that into a total. Print the final total, and also print the length of the filtered (completed-only) array using a separate chain.",
      challenge: "Extend the chain to also apply a 10 percent discount to each amount using map() before reducing, and compare the discounted total to the original total by printing both.",
      expectedResult: "The program prints the correct total of only the completed orders' amounts, and the correct count of completed orders.",
      tests: ["filter(), map(), and reduce() are chained together in a single expression", "The chained result correctly reflects only the completed orders"],
      hint: "Each method in a chain runs on the array returned by the previous one, so the order of filter(), map(), and reduce() changes what each step receives.",
      lessonAssessment: [
        {
          question: "Why can filter() and map() be chained together with dot notation, one after the other?",
          options: [
            "Because they modify the original array in place",
            "Because both return a new array, which supports calling another array method directly on the result",
            "Because JavaScript requires it for arrays with more than 2 elements",
            "They cannot actually be chained together",
          ],
          correctAnswerIndex: 1,
          explanation: "filter() and map() each return a new array, so another array method can be called directly on that returned array using dot notation.",
        },
        {
          question: "In orders.filter(o => o.completed).map(o => o.total), what does map() receive as its input?",
          options: [
            "The original, unfiltered orders array",
            "Only the array of orders that passed the filter() condition",
            "A single number",
            "An empty array, always",
          ],
          correctAnswerIndex: 1,
          explanation: "map() runs on whatever filter() returned, so it only processes the orders that already passed the completed check.",
        },
      ],
      commonMistakes: ["Assuming a chained method operates on the original array instead of the array returned by the previous step in the chain.", "Chaining so many steps on one line that the code becomes hard to read, instead of breaking each method onto its own line."],
      deliverables: ["A script using at least one chain combining filter(), map(), and reduce()"],
      assessmentCriteria: ["The chain correctly narrows, transforms, and summarizes the data in the right order", "Output correctly reflects only the intended subset of data"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'const orders = [\n  { amount: 40, completed: true },\n  { amount: 15, completed: false },\n  { amount: 60, completed: true },\n  { amount: 25, completed: true },\n  { amount: 10, completed: false },\n];\n\nconst completedTotal = orders\n  .filter((order) => order.completed)\n  .map((order) => order.amount)\n  .reduce((sum, amount) => sum + amount, 0);\n\nconsole.log(completedTotal);',
        explanation: "filter() keeps only completed orders, map() extracts just their amounts, and reduce() adds those amounts together, each step working on the previous step's returned array.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Destructuring and Spread/Rest Syntax",
      goal: "Use destructuring to pull values out of arrays and objects, and spread/rest syntax to expand or collect values.",
      videoTitle: "JavaScript Destructuring and Spread/Rest Explained",
      videoSearchQuery: "javascript destructuring spread rest syntax tutorial",
      videoLearningGoal: "See array and object destructuring extract values into named variables, and spread/rest syntax expand or gather values.",
      recommendedChannels: ["Web Dev Simplified", "The Net Ninja"],
      keyTakeaways: [
        "Array destructuring, const [a, b] = array, and object destructuring, const { name, price } = product, pull values directly into named variables.",
        "The spread operator, ...array or ...object, expands an array or object's values, commonly used to copy or combine them.",
        "Rest syntax, also written with ..., collects the remaining arguments or elements into a single array inside a function or destructuring pattern.",
      ],
      notes:
        "Destructuring and spread/rest both use similar-looking syntax for related but different purposes: destructuring pulls values out into variables, spread expands a collection outward, and rest gathers separate values back into a collection.",
      conceptExplanation:
        "const [first, second] = [10, 20]; sets first to 10 and second to 20 directly from the array. const { name, price } = product; pulls product.name and product.price into two variables named exactly like the object's keys. const combined = [...arrayA, ...arrayB]; spreads both arrays' elements into one new array, and const copy = { ...original, price: 9.99 }; spreads an object's properties into a new object while overriding just one. function sum(...numbers) { return numbers.reduce((t, n) => t + n, 0); } uses rest syntax to collect any number of arguments into a single numbers array inside the function.",
      whyItMatters: "Destructuring and spread/rest remove a lot of repetitive indexing and manual copying from everyday JavaScript, and they appear constantly in real-world code, especially when working with function arguments and object updates.",
      practicalTask:
        "Create an object representing a user with name, age, and city. Use object destructuring to pull all three into separate variables in one line, and print them. Create two separate arrays of numbers, and use the spread operator to combine them into one new array without changing either original array. Write a function total(...amounts) using rest syntax that returns the sum of any number of arguments passed to it, and call it with at least 4 numbers.",
      challenge: "Use object destructuring with a default value for a property that might be missing, for example const { name, age, city = \"Unknown\" } = user;, and demonstrate it working correctly on a second user object that has no city property.",
      expectedResult: "The program prints the destructured user values, the correctly combined array from spreading two arrays together, and the correct sum from the rest-parameter function.",
      tests: ["Object destructuring is used to extract at least 2 properties into variables", "The spread operator is used to combine two arrays into a new one"],
      hint: "Spread (...) inside an array or object literal expands values outward; rest (...) inside a function's parameter list gathers values inward into one array.",
      lessonAssessment: [
        {
          question: "What does const { name, price } = product; do?",
          options: [
            "Deletes name and price from product",
            "Creates two new variables, name and price, holding product's matching property values",
            "Creates a new object with only name and price",
            "Throws an error unless product has exactly two properties",
          ],
          correctAnswerIndex: 1,
          explanation: "Object destructuring pulls the named properties directly out of the object into new variables with matching names.",
        },
        {
          question: "In function total(...amounts) { ... }, what does ...amounts collect?",
          options: [
            "Only the first argument passed to the function",
            "Every argument passed to the function, gathered into a single array called amounts",
            "The function's own name",
            "Nothing, this syntax is invalid in a function's parameters",
          ],
          correctAnswerIndex: 1,
          explanation: "Rest syntax in a function's parameter list collects any number of remaining arguments into a single array.",
        },
      ],
      commonMistakes: ["Confusing spread (expanding a collection's values outward, e.g. into a new array or object) with rest (gathering separate values inward into one array), even though both use the same ... syntax.", "Misnaming a destructured variable, expecting const { username } = user; to work when the object's actual key is name, not username."],
      deliverables: ["A script using object destructuring, the spread operator on two arrays, and a rest-parameter function"],
      assessmentCriteria: ["Destructuring correctly extracts the intended properties", "Spread correctly combines two arrays without mutating the originals", "The rest-parameter function correctly sums any number of arguments"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "javascript",
        code: 'const user = { name: "Ada", age: 30, city: "Lagos" };\nconst { name, age, city } = user;\nconsole.log(name, age, city);\n\nconst arrayA = [1, 2, 3];\nconst arrayB = [4, 5, 6];\nconst combined = [...arrayA, ...arrayB];\nconsole.log(combined);\n\nfunction total(...amounts) {\n  return amounts.reduce((sum, n) => sum + n, 0);\n}\nconsole.log(total(10, 20, 30, 40));',
        explanation: "Object destructuring pulls name, age, and city out of user; spread combines arrayA and arrayB into one new array; rest syntax gathers every argument passed to total() into the amounts array.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Array Methods & Functional Programming Assessment",
    questions: [
      { question: "What does [1, 2, 3].map(n => n * 2) return?", options: ["[1, 2, 3]", "[2, 4, 6]", "6", "undefined"], correctAnswerIndex: 1, explanation: "map() returns a new array with every element transformed by the callback." },
      { question: "What does [1, 2, 3, 4].filter(n => n % 2 === 0) return?", options: ["[1, 3]", "[2, 4]", "[1, 2, 3, 4]", "4"], correctAnswerIndex: 1, explanation: "filter() returns a new array containing only the elements for which the callback returns true." },
      { question: "What does the second argument to reduce(callback, initialValue) do?", options: ["Limits how many elements are processed", "Sets the accumulator's starting value", "Sets the index to start from", "Has no effect"], correctAnswerIndex: 1, explanation: "The second argument to reduce() initializes the accumulator before any elements are processed." },
      { question: "Do map() and filter() change the original array?", options: ["Yes, both mutate the original array", "No, both return a new array and leave the original unchanged", "Only map() mutates the original", "Only filter() mutates the original"], correctAnswerIndex: 1, explanation: "Neither map() nor filter() mutates the array they are called on; both return a brand new array." },
      { question: "In orders.filter(o => o.completed).map(o => o.amount), what does map() operate on?", options: ["The original unfiltered orders array", "Only the orders that passed the filter() condition", "A single number", "Nothing, this chain is invalid"], correctAnswerIndex: 1, explanation: "Each method in a chain operates on the array returned by the previous method, so map() only sees the filtered results." },
      { question: "What does const [a, b] = [10, 20]; do?", options: ["Creates an array named a containing [10, 20]", "Sets a to 10 and b to 20 using array destructuring", "Throws an error", "Sets a to [10, 20] and b to undefined"], correctAnswerIndex: 1, explanation: "Array destructuring assigns each array element, by position, to the corresponding named variable." },
      { question: "What does const { name, price } = product; do?", options: ["Deletes name and price from product", "Creates variables name and price from product's matching properties", "Creates a copy of the entire product object", "Only works if product has exactly two properties"], correctAnswerIndex: 1, explanation: "Object destructuring pulls the named properties out of the object into new variables." },
      { question: "What does [...arrayA, ...arrayB] produce?", options: ["A nested array containing arrayA and arrayB as elements", "A new flat array containing all of arrayA's and arrayB's elements", "An error, since spread only works on objects", "arrayA unchanged"], correctAnswerIndex: 1, explanation: "The spread operator expands each array's elements individually, so combining two spreads inside one array literal produces one flat new array." },
      { question: "In function total(...amounts) { ... }, what does ...amounts do?", options: ["Collects every argument passed to the function into one array called amounts", "Only accepts a single argument", "Spreads an existing array into separate arguments", "Is invalid syntax"], correctAnswerIndex: 0, explanation: "Rest syntax in a function's parameters gathers any number of passed arguments into a single array." },
      { question: "Why might a developer chain filter(), map(), and reduce() together instead of writing three separate loops?", options: [
          "Chaining is required by JavaScript for arrays with more than one element",
          "It expresses a multi-step data transformation as one readable pipeline",
          "It changes the original array in place, which loops cannot do",
          "Chaining always runs faster than any loop",
        ], correctAnswerIndex: 1, explanation: "Chaining array methods lets each step express one clear transformation, forming a readable pipeline instead of several separate loops with intermediate variables." },
    ],
  },
  assignment:
    "Build a 'Sales Report' from an array of at least 6 sale objects, each with product, amount, and region properties. Use filter() to keep only sales from one chosen region, use map() to extract just the amount values from that filtered result, and use reduce() to calculate the total sales amount for that region. Print the filtered list of sales, the extracted amounts, and the final total, each with a clear label.",
  assignmentDeliverables: [
    "A script defining an array of sale objects and processing it with filter(), map(), and reduce()",
    "Printed output showing the filtered sales, the extracted amounts, and the correctly calculated regional total",
  ],
  assignmentAssessmentCriteria: [
    "filter() correctly narrows the sales to the chosen region",
    "map() correctly extracts the amount from each filtered sale",
    "reduce() correctly calculates the total from the extracted amounts",
  ],
  miniProject:
    "Build a 'Student Grade Analyzer' from an array of at least 6 student objects, each with name and an array of numeric scores. Use map() to create a new array of objects containing each student's name and their average score (calculated with reduce() inside the map callback). Use destructuring to pull name and average out of each processed result while printing it. Use the spread operator to create a separate array combining the top 2 and bottom 2 performing students (sorted by average) into one highlights array, and print that array's length and contents.",
  miniProjectDeliverables: [
    "A script processing an array of student objects into name/average pairs using map() and reduce()",
    "Printed output showing each student's destructured name and average, plus a spread-combined highlights array",
  ],
  miniProjectAssessmentCriteria: [
    "Each student's average score is calculated correctly using reduce()",
    "Destructuring is used correctly to print each student's name and average",
    "The spread operator correctly combines two smaller arrays into one highlights array",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
