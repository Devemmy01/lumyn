import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module4: GeneratedModule = {
  title: "Comprehensions & Functional Tools",
  description:
    "Write shorter, more expressive code using list, dict, and set comprehensions, small anonymous lambda functions, and the map(), filter(), and sorted() functions.",
  completionStatus: "locked",
  lessons: [
    {
      title: "List Comprehensions",
      goal: "Build a new list from an existing sequence in a single, readable expression.",
      videoTitle: "Python List Comprehensions Explained",
      videoSearchQuery: "python list comprehension tutorial for beginners",
      videoLearningGoal: "See a list comprehension built step by step from an equivalent for loop.",
      recommendedChannels: ["Corey Schafer", "freeCodeCamp.org"],
      keyTakeaways: [
        "A list comprehension has the form [expression for item in iterable], producing a new list.",
        "You can add a condition: [expression for item in iterable if condition] to filter which items are included.",
        "A list comprehension is equivalent to a for loop that builds a list with append(), written more concisely.",
      ],
      notes:
        "A list comprehension packs a loop that builds a list into a single line. [n * n for n in range(1, 6)] produces [1, 4, 9, 16, 25], the squares of 1 through 5. This is the same result as writing a for loop with an empty list and calling append() each iteration, just more compact and, once you're used to the pattern, easier to read at a glance.",
      conceptExplanation:
        "The basic for loop equivalent of [n * n for n in range(1, 6)] is: squares = []; for n in range(1, 6): squares.append(n * n). Adding an if clause at the end filters which items make it into the result: [n for n in range(1, 20) if n % 3 == 0] keeps only the multiples of 3. The expression at the start can be any transformation of item, not just the item itself, which is what makes comprehensions genuinely useful rather than just a shorter loop.",
      whyItMatters: "List comprehensions are extremely common in real Python code because they turn a multi-line loop into one clear expression, which is both faster to write and easier to scan.",
      practicalTask:
        "In the Academy workspace, main.py is already open for you. Create a list of numbers from 1 to 20 using range(). Write a list comprehension that produces a new list containing only the even numbers from that range. Write a second list comprehension that produces the square of every number from 1 to 10. Print both results.",
      challenge: "Write a third comprehension that takes a list of words and produces a new list containing only the words longer than 4 characters, using len(word) > 4 as the filter condition.",
      expectedResult: "The program prints a list of even numbers from 1 to 20, a list of squares from 1 to 10, and a filtered list of longer words.",
      tests: ["At least one list comprehension includes a filtering if clause", "At least one list comprehension transforms each item with an expression, not just copies it"],
      hint: "The if clause always comes at the end of a list comprehension, after the for clause: [x for x in items if condition].",
      lessonAssessment: [
        {
          question: "What does [n * 2 for n in range(1, 4)] produce?",
          options: ["[1, 2, 3]", "[2, 4, 6]", "[1, 4, 9]", "range(1, 4)"],
          correctAnswerIndex: 1,
          explanation: "The comprehension doubles each value from range(1, 4) (1, 2, 3), producing [2, 4, 6].",
        },
        {
          question: "What does the if clause at the end of a list comprehension do?",
          options: [
            "It has no effect and is purely decorative",
            "It filters which items from the iterable are included in the result",
            "It stops the comprehension after the first match",
            "It sorts the resulting list",
          ],
          correctAnswerIndex: 1,
          explanation: "An if clause in a list comprehension only includes items in the result for which the condition evaluates to True.",
        },
      ],
      commonMistakes: ["Writing the condition before the for clause instead of after it, which is invalid syntax for a plain filtering comprehension.", "Making a comprehension so complex it becomes harder to read than the equivalent for loop; comprehensions should stay simple."],
      deliverables: ["A script with at least 2 list comprehensions, one using a filter condition"],
      assessmentCriteria: ["Comprehensions produce the correct filtered or transformed results", "Syntax is correctly structured with for and if in the right order"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'numbers = list(range(1, 21))\nevens = [n for n in numbers if n % 2 == 0]\nsquares = [n * n for n in range(1, 11)]\nprint(evens)\nprint(squares)',
        explanation: "The first comprehension filters for even numbers with an if clause; the second transforms every number into its square with no filtering at all.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Dict and Set Comprehensions",
      goal: "Build dictionaries and sets using comprehension syntax, similar to list comprehensions.",
      videoTitle: "Python Dictionary and Set Comprehensions Explained",
      videoSearchQuery: "python dict comprehension set comprehension tutorial",
      videoLearningGoal: "See dict and set comprehensions built from an existing list, with and without filtering.",
      recommendedChannels: ["Programming with Mosh", "Tech With Tim"],
      keyTakeaways: [
        "A dict comprehension has the form {key_expr: value_expr for item in iterable}, producing a new dictionary.",
        "A set comprehension has the form {expression for item in iterable}, producing a new set with duplicates automatically removed.",
        "Both support the same optional if filtering clause as list comprehensions.",
      ],
      notes:
        "Dict and set comprehensions follow the same pattern as list comprehensions, just with curly braces instead of square brackets, and a key:value pair for dictionaries. {word: len(word) for word in words} builds a dictionary mapping each word to its length in a single line.",
      conceptExplanation:
        "{n: n * n for n in range(1, 6)} produces {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}, a dictionary mapping each number to its square. A set comprehension, {n % 3 for n in range(10)}, evaluates n % 3 for every number 0 through 9 and keeps only the unique results, since sets never store duplicates. The key difference between the two is just the shape of the expression before the for clause: a single value for a set, a key:value pair for a dict.",
      whyItMatters: "Dict and set comprehensions let you build lookup tables and deduplicated collections in one readable line, patterns that show up constantly when processing real data.",
      practicalTask:
        "Create a list of at least 5 words. Write a dict comprehension that maps each word to its length. Write a set comprehension that produces the set of unique first letters across all the words. Print both results.",
      challenge: "Add an if clause to your dict comprehension so it only includes words longer than 3 characters, and print the filtered dictionary.",
      expectedResult: "The program prints a dictionary mapping each word to its length, and a set showing only the unique first letters used across the word list.",
      tests: ["A dict comprehension correctly maps each item to a derived value", "A set comprehension correctly produces a deduplicated result"],
      hint: "A dict comprehension needs a colon between the key expression and value expression: {key: value for item in iterable}.",
      lessonAssessment: [
        {
          question: "What does {n: n * 2 for n in range(1, 4)} produce?",
          options: ["[2, 4, 6]", "{1: 2, 2: 4, 3: 6}", "{2, 4, 6}", "(1, 2, 3)"],
          correctAnswerIndex: 1,
          explanation: "This dict comprehension maps each number from range(1, 4) to double its value, producing {1: 2, 2: 4, 3: 6}.",
        },
        {
          question: "What is the key difference in syntax between a set comprehension and a dict comprehension?",
          options: [
            "Set comprehensions use square brackets",
            "Dict comprehensions use a key:value pair before the for clause; set comprehensions use a single expression",
            "There is no difference",
            "Set comprehensions cannot use an if clause",
          ],
          correctAnswerIndex: 1,
          explanation: "A dict comprehension pairs a key expression and value expression with a colon; a set comprehension has just one expression, both wrapped in curly braces.",
        },
      ],
      commonMistakes: ["Forgetting the colon between the key and value expressions in a dict comprehension.", "Expecting a set comprehension to preserve duplicate values, when sets always collapse them automatically."],
      deliverables: ["A script with a dict comprehension and a set comprehension"],
      assessmentCriteria: ["Dict comprehension correctly maps keys to derived values", "Set comprehension correctly removes duplicates"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'words = ["apple", "banana", "cherry", "avocado", "blueberry"]\nword_lengths = {word: len(word) for word in words}\nfirst_letters = {word[0] for word in words}\nprint(word_lengths)\nprint(first_letters)',
        explanation: "The dict comprehension maps each word to its length; the set comprehension collects only the unique first letters, automatically dropping repeats.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Lambda Functions, map(), filter(), and sorted() with a Key",
      goal: "Write small anonymous functions with lambda and use them with map(), filter(), and sorted().",
      videoTitle: "Python Lambda, map, filter, and sorted Key Functions",
      videoSearchQuery: "python lambda map filter sorted key function tutorial",
      videoLearningGoal: "See a lambda function used directly inside map(), filter(), and sorted() calls.",
      recommendedChannels: ["freeCodeCamp.org", "Corey Schafer"],
      keyTakeaways: [
        "lambda parameters: expression creates a small, unnamed function in a single line, useful for short throwaway logic.",
        "map(function, iterable) applies a function to every item in an iterable and returns the transformed results.",
        "filter(function, iterable) keeps only the items for which the function returns True.",
      ],
      notes:
        "A lambda is a function without a name, written in one line: lambda x: x * x is equivalent to def square(x): return x * x, just without a def statement or a separate name. Lambdas are most useful when you need a small function briefly, often as an argument to another function, rather than as a reusable, named piece of logic.",
      conceptExplanation:
        "list(map(lambda n: n * n, [1, 2, 3, 4])) applies the lambda to every item, producing [1, 4, 9, 16]. list(filter(lambda n: n % 2 == 0, [1, 2, 3, 4, 5, 6])) keeps only the items where the lambda returns True, producing [2, 4, 6]. sorted(people, key=lambda person: person[\"age\"]) sorts a list of dictionaries by the \"age\" value in each one, using the lambda to tell sorted() what to compare instead of comparing the dictionaries directly, which would fail. Both map() and filter() return special iterator objects, so wrapping them in list() is how you see or use the actual results.",
      whyItMatters: "map(), filter(), and sorted() with a key function are the standard, idiomatic way to transform, filter, and order data in Python without writing a manual loop every time.",
      practicalTask:
        "Create a list of at least 5 numbers. Use map() with a lambda to produce a new list where every number is doubled. Use filter() with a lambda to produce a new list containing only the numbers greater than 10. Then create a list of at least 4 dictionaries, each with a name and score key, and use sorted() with a key=lambda to sort them by score from highest to lowest.",
      challenge: "Combine map() and filter() in one pipeline: filter a list of numbers to keep only the even ones, then map the result to their squares, printing the final list.",
      expectedResult: "The program prints a doubled list, a filtered list of numbers over 10, and a list of dictionaries correctly sorted by score in descending order.",
      tests: ["map() with a lambda correctly transforms every item", "sorted() with a key=lambda correctly orders a list of dictionaries by one of their values"],
      hint: "sorted(some_list, key=lambda item: item[\"score\"], reverse=True) sorts from highest to lowest.",
      lessonAssessment: [
        {
          question: "What does list(map(lambda n: n + 1, [1, 2, 3])) return?",
          options: ["[1, 2, 3]", "[2, 3, 4]", "[1, 4, 9]", "A map object with no values"],
          correctAnswerIndex: 1,
          explanation: "map() applies the lambda (adding 1) to every item, and wrapping it in list() gives [2, 3, 4].",
        },
        {
          question: "What does filter(lambda n: n > 5, [3, 6, 2, 9, 4]) keep?",
          options: ["Every item unchanged", "Only the items greater than 5: 6 and 9", "Only the items 5 or less", "Nothing, filter always returns an empty result"],
          correctAnswerIndex: 1,
          explanation: "filter() keeps only the items for which the lambda returns True, here the values greater than 5.",
        },
      ],
      commonMistakes: ["Forgetting to wrap map() or filter() results in list() before printing or iterating in a way that expects a list.", "Using key=lambda item: item[\"score\"]() (calling the value) instead of just referencing the key, which raises a TypeError."],
      deliverables: ["A script demonstrating map(), filter(), and sorted() with a key=lambda"],
      assessmentCriteria: ["map() and filter() correctly use a lambda to transform or filter data", "sorted() correctly orders a list of dictionaries by a chosen key"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'numbers = [4, 15, 7, 22, 9]\ndoubled = list(map(lambda n: n * 2, numbers))\nover_ten = list(filter(lambda n: n > 10, numbers))\nprint(doubled)\nprint(over_ten)\n\npeople = [{"name": "Ada", "score": 88}, {"name": "Sam", "score": 95}, {"name": "Kim", "score": 72}]\nranked = sorted(people, key=lambda person: person["score"], reverse=True)\nprint(ranked)',
        explanation: "map() doubles every number, filter() keeps only values over 10, and sorted() with a key=lambda orders the people list by score from highest to lowest.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Comprehensions & Functional Tools Assessment",
    questions: [
      { question: "What does [n * n for n in range(1, 4)] produce?", options: ["[1, 2, 3]", "[1, 4, 9]", "range(1, 4)", "[1, 4, 9, 16]"], correctAnswerIndex: 1, explanation: "The comprehension squares each value from range(1, 4) (1, 2, 3), producing [1, 4, 9]." },
      { question: "In a list comprehension, where does an optional if clause go?", options: ["Before the for clause", "After the for clause, at the end", "It cannot be combined with for", "Inside the expression only"], correctAnswerIndex: 1, explanation: "The structure is [expression for item in iterable if condition], with the if clause placed after for." },
      { question: "What does {n: n * 2 for n in range(1, 3)} produce?", options: ["[2, 4]", "{1: 2, 2: 4}", "{2, 4}", "(1, 2)"], correctAnswerIndex: 1, explanation: "This dict comprehension maps each number to double its value, producing {1: 2, 2: 4}." },
      { question: "What does a set comprehension automatically do with repeated results?", options: ["Keeps all duplicates", "Removes duplicates, since sets only store unique values", "Raises an error", "Converts them to a list"], correctAnswerIndex: 1, explanation: "Sets never store duplicate values, so a set comprehension automatically collapses repeated results." },
      { question: "What does lambda x: x * x represent?", options: ["A syntax error", "A small, unnamed function that returns x squared", "A comprehension", "A dictionary"], correctAnswerIndex: 1, explanation: "lambda defines a small anonymous function; here it takes x and returns x * x." },
      { question: "What does map(function, iterable) do?", options: [
          "Filters items out of the iterable",
          "Applies the function to every item in the iterable and returns the transformed results",
          "Sorts the iterable",
          "Deletes the iterable",
        ], correctAnswerIndex: 1, explanation: "map() transforms every item in the iterable by applying the given function to it." },
      { question: "What does filter(lambda n: n > 5, [2, 6, 9, 3]) keep?", options: ["[2, 3]", "[6, 9]", "[2, 6, 9, 3]", "Nothing"], correctAnswerIndex: 1, explanation: "filter() keeps only the items for which the lambda returns True, here the values greater than 5." },
      { question: "What does sorted(people, key=lambda p: p[\"age\"]) do?", options: [
          "Sorts the people list alphabetically by name",
          "Sorts the people list using each dictionary's age value for comparison",
          "Filters out people without an age key",
          "Raises an error because dictionaries cannot be sorted",
        ], correctAnswerIndex: 1, explanation: "The key=lambda tells sorted() what value to compare for ordering, here each dictionary's age." },
      { question: "Why do map() and filter() results need to be wrapped in list() to print them directly as a list?", options: [
          "They do not, printing them directly shows a list automatically",
          "map() and filter() return iterator objects, and list() converts them into an actual list",
          "It is only needed for filter(), not map()",
          "It converts the result into a string",
        ], correctAnswerIndex: 1, explanation: "map() and filter() return lazy iterator objects; wrapping the result in list() produces the concrete list of values." },
      { question: "What is the main advantage of using sorted(items, key=lambda ...) over sorted(items) alone on a list of dictionaries?", options: [
          "There is no difference",
          "It lets you specify exactly which value inside each dictionary to sort by, since dictionaries cannot be compared directly",
          "It reverses the sort order automatically",
          "It removes duplicate dictionaries",
        ], correctAnswerIndex: 1, explanation: "Dictionaries cannot be compared with < or > directly, so key=lambda tells sorted() which specific value to use for comparison." },
    ],
  },
  assignment:
    "Build a 'Data Cleanup Toolkit': start with a list of at least 8 numbers, including some negative values. Write a list comprehension that keeps only the positive numbers. Write a second list comprehension that produces the square root of every remaining positive number (using math.sqrt from the math module). Use sorted() to print the final list of square roots in ascending order.",
  assignmentDeliverables: [
    "A script with at least 2 list comprehensions and a sorted() call",
    "Printed output showing the filtered, transformed, and sorted results at each stage",
  ],
  assignmentAssessmentCriteria: [
    "The filtering comprehension correctly removes negative numbers",
    "The transforming comprehension correctly calculates square roots for the remaining values",
    "sorted() correctly produces ascending order",
  ],
  miniProject:
    "Build a 'Student Rankings' tool: create a list of at least 5 dictionaries, each with name and score keys. Use a dict comprehension to build a lookup dictionary mapping each name directly to their score. Use filter() with a lambda to find students who scored 70 or above, and sorted() with a key=lambda to print the full student list ranked from highest score to lowest, including their rank number.",
  miniProjectDeliverables: [
    "student_rankings.py in the Academy workspace",
    "Printed output showing the name-to-score lookup dictionary, the passing students, and the final ranked list",
  ],
  miniProjectAssessmentCriteria: [
    "The dict comprehension correctly builds a name-to-score mapping",
    "filter() correctly identifies students scoring 70 or above",
    "sorted() with a key=lambda correctly ranks students from highest to lowest score",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
