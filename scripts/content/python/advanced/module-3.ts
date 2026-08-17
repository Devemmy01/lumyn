import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module3: GeneratedModule = {
  title: "Iterators & Generators",
  description:
    "Learn how for loops actually work under the hood, then write your own iterators and generators to produce sequences of values, including ones too large to hold in memory at once.",
  completionStatus: "locked",
  lessons: [
    {
      title: "The Iterator Protocol and Custom Iterator Classes",
      goal: "Understand __iter__ and __next__ and build a custom iterator class.",
      videoTitle: "Python Iterator Protocol: __iter__ and __next__ Explained",
      videoSearchQuery: "python iterator protocol iter next custom class tutorial",
      videoLearningGoal: "See what for loops do under the hood by implementing __iter__ and __next__ on a custom class.",
      recommendedChannels: ["Corey Schafer", "ArjanCodes"],
      keyTakeaways: [
        "An iterable is any object with __iter__, which returns an iterator; an iterator is any object with __next__, which returns the next value or raises StopIteration.",
        "A for loop is syntactic sugar: it repeatedly calls __next__ on an iterator until StopIteration is raised.",
        "A class can be both iterable and its own iterator by implementing both __iter__ (returning self) and __next__.",
      ],
      notes:
        "Every time you write for item in something:, Python is calling iter(something) to get an iterator, then repeatedly calling next() on it until it raises StopIteration. Understanding this protocol lets you build your own objects that work seamlessly with for loops.",
      conceptExplanation:
        "__iter__(self) should return an iterator object, most simply self if the class manages its own position. __next__(self) computes and returns the next value, or raises StopIteration when there's nothing left. A common pattern is a CountUp iterator that stores a current value and a limit, increments current on each __next__ call, and raises StopIteration once current exceeds the limit.",
      whyItMatters: "Understanding the iterator protocol demystifies for loops, list(), and every other place Python consumes a sequence of values one at a time, and it's the foundation for generators in the next lesson.",
      practicalTask:
        "In the Academy workspace, main.py is already open for you. Write a class CountUp that takes a start and end value in __init__. Implement __iter__ to return self and __next__ to return the next number each call, raising StopIteration once it passes end. Use CountUp in a for loop to print every number from your chosen start to end.",
      challenge: "Add a step parameter to CountUp so it can count by twos, threes, or any interval, defaulting to 1 if not provided.",
      expectedResult: "The for loop over your CountUp instance prints every expected number in order and then stops cleanly without any error.",
      tests: [
        "CountUp implements both __iter__ (returning self) and __next__",
        "__next__ raises StopIteration exactly once the sequence is exhausted",
      ],
      hint: "raise StopIteration inside __next__ is what tells a for loop to stop calling it; forgetting this causes an infinite loop.",
      lessonAssessment: [
        {
          question: "What does a for loop call repeatedly on an iterator until it stops?",
          options: ["__iter__", "__next__", "__len__", "__repr__"],
          correctAnswerIndex: 1,
          explanation: "A for loop obtains an iterator once with iter(), then calls __next__ on it repeatedly until StopIteration is raised.",
        },
        {
          question: "What must __next__ do once there are no more values to produce?",
          options: ["Return None", "Raise StopIteration", "Return an empty list", "Return the value 0"],
          correctAnswerIndex: 1,
          explanation: "Raising StopIteration is the signal that tells a for loop (or any code using the iterator) that the sequence is finished.",
        },
      ],
      commonMistakes: [
        "Forgetting to raise StopIteration, causing the for loop to run forever.",
        "Implementing __next__ but forgetting __iter__, so the object isn't recognized as iterable by a for loop.",
      ],
      deliverables: ["main.py with a CountUp class implementing the full iterator protocol"],
      assessmentCriteria: ["__iter__ and __next__ are both implemented correctly", "The for loop over the custom iterator produces the correct sequence and terminates"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'class CountUp:\n    def __init__(self, start, end):\n        self.current = start\n        self.end = end\n\n    def __iter__(self):\n        return self\n\n    def __next__(self):\n        if self.current > self.end:\n            raise StopIteration\n        value = self.current\n        self.current += 1\n        return value\n\nfor number in CountUp(1, 5):\n    print(number)',
        explanation: "Each call to __next__ returns the next number and advances current; once current passes end, StopIteration tells the for loop to stop.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Generator Functions and yield",
      goal: "Write generator functions using yield as a simpler alternative to building a full iterator class.",
      videoTitle: "Python Generators and yield Explained",
      videoSearchQuery: "python generator functions yield tutorial",
      videoLearningGoal: "See a generator function pause and resume with yield, producing values lazily instead of all at once.",
      recommendedChannels: ["Corey Schafer", "freeCodeCamp.org"],
      keyTakeaways: [
        "A function containing yield becomes a generator function: calling it returns a generator object instead of running the body immediately.",
        "Each call to next() on a generator runs the function until the next yield, pauses there, and returns that value.",
        "Generator functions automatically implement the iterator protocol, so they work directly in for loops.",
      ],
      notes:
        "yield turns an ordinary-looking function into a generator: instead of computing everything up front and returning it, the function produces values one at a time, pausing its own execution between each one. This is a far simpler way to write most custom iterators than the __iter__/__next__ class from the previous lesson.",
      conceptExplanation:
        "def count_up(start, end): current = start; while current <= end: yield current; current += 1 looks like a regular function, but calling count_up(1, 5) doesn't run any of that code yet: it returns a generator object. Each next() call, or each pass of a for loop, resumes execution right after the last yield, runs until the next yield, and returns that value. When the function finally returns (falls off the end), the generator raises StopIteration automatically.",
      whyItMatters: "Generators give you the exact same for-loop-friendly behavior as a custom iterator class, with far less code, and they're the idiomatic Python way to produce a sequence of values lazily.",
      practicalTask:
        "Rewrite your CountUp class from the previous lesson as a generator function called count_up(start, end, step=1) using yield. Use it in a for loop to print the same sequence of numbers, and confirm the output matches your class-based version.",
      challenge: "Write a second generator function, even_numbers_up_to(limit), that yields only the even numbers from 0 up to limit, and print its output in a for loop.",
      expectedResult: "The generator function produces the exact same sequence of numbers as your earlier CountUp class, using dramatically less code.",
      tests: [
        "count_up uses yield rather than building and returning a list",
        "The for loop over count_up() produces the correct sequence of numbers",
      ],
      hint: "Calling a generator function doesn't run its body; the body only executes as you iterate over it or call next() on it.",
      lessonAssessment: [
        {
          question: "What does calling a function containing yield return immediately?",
          options: ["The full list of all yielded values", "A generator object", "The first yielded value only", "An error, since the function body never ran"],
          correctAnswerIndex: 1,
          explanation: "Calling a generator function immediately returns a generator object without running any of the function's body yet.",
        },
        {
          question: "When does the code inside a generator function actually execute?",
          options: [
            "All at once, when the generator function is called",
            "Incrementally, as the generator is iterated, for example via next() or a for loop",
            "Only when the program ends",
            "Never; generators don't execute code",
          ],
          correctAnswerIndex: 1,
          explanation: "A generator's body only advances as the generator is consumed, pausing at each yield until the next value is requested.",
        },
      ],
      commonMistakes: [
        "Expecting count_up(1, 5) to immediately return a list of numbers, when it actually returns a generator object that must be iterated.",
        "Calling a generator's result more than once expecting it to restart. Once exhausted, a generator cannot be reused; you must call the generator function again to get a new one.",
      ],
      deliverables: ["main.py with a count_up generator function using yield, replacing the earlier class-based iterator"],
      assessmentCriteria: ["Generator function correctly uses yield to produce values lazily", "for loop output matches the expected sequence exactly"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'def count_up(start, end, step=1):\n    current = start\n    while current <= end:\n        yield current\n        current += step\n\nfor number in count_up(1, 10, 2):\n    print(number)',
        explanation: "count_up(1, 10, 2) pauses at each yield and resumes on the next iteration, producing 1, 3, 5, 7, 9 without ever building a full list.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Generator Expressions and Memory Efficiency",
      goal: "Use generator expressions and understand when generators save memory compared to building full lists.",
      videoTitle: "Python Generator Expressions and Memory Efficiency",
      videoSearchQuery: "python generator expressions memory efficiency tutorial",
      videoLearningGoal: "See a generator expression compared side by side with a list comprehension, and a memory-size comparison between the two.",
      recommendedChannels: ["ArjanCodes", "Tech With Tim"],
      keyTakeaways: [
        "A generator expression looks like a list comprehension but with parentheses instead of square brackets: (x * x for x in range(10)).",
        "A generator expression produces values lazily, one at a time, instead of building the entire result in memory up front.",
        "Generators are ideal when you only need to iterate through values once, especially over large or unbounded sequences.",
      ],
      notes:
        "[x * x for x in range(1000000)] builds a full list of a million numbers in memory immediately. (x * x for x in range(1000000)) builds nothing yet: it's a generator that computes each value only as you ask for it. For large sequences, or ones you only need to scan once, this difference is significant.",
      conceptExplanation:
        "You can pass a generator expression directly into functions like sum(), max(), or a for loop without ever materializing a full list: total = sum(x * x for x in range(1000000)) never holds all million squared values at once, only the current one and the running total. The tradeoff is that a generator can only be iterated once; unlike a list, you can't loop over it a second time without recreating it. Use sys.getsizeof() to directly compare how much memory a list comprehension takes versus a generator expression for the same range.",
      whyItMatters: "Choosing a generator over a list comprehension is one of the simplest, most direct ways to reduce a Python program's memory footprint when processing large amounts of data.",
      practicalTask:
        "Using the sys module, compare sys.getsizeof() on a list comprehension [x for x in range(100000)] versus a generator expression (x for x in range(100000)) for the same range, and print both sizes side by side with a labeled message. Then use sum() directly on a generator expression to compute the sum of squares from 1 to 100000 without ever building a full list.",
      challenge: "Try iterating over the same generator object twice with two separate for loops, observe that the second loop prints nothing, and explain why in a comment.",
      expectedResult: "The printed sizes clearly show the generator expression using dramatically less memory than the list comprehension, and the sum of squares is printed correctly.",
      tests: [
        "sys.getsizeof() is used to compare a list comprehension and a generator expression of the same size",
        "sum() is used directly on a generator expression without first converting it to a list",
      ],
      hint: "sys.getsizeof(some_generator) will look small and roughly constant regardless of range size, while the list's size grows with the number of items.",
      lessonAssessment: [
        {
          question: "What is the main practical difference between a list comprehension and an equivalent generator expression?",
          options: [
            "There is no real difference; they behave identically",
            "The list comprehension builds all values in memory immediately; the generator expression produces values lazily, one at a time",
            "Generator expressions can only hold numbers",
            "List comprehensions are always faster",
          ],
          correctAnswerIndex: 1,
          explanation: "A list comprehension eagerly builds the full result; a generator expression produces each value only as it's requested.",
        },
        {
          question: "What happens if you try to iterate over an already-exhausted generator a second time?",
          options: ["It restarts from the beginning", "It raises a StopIteration or produces nothing further", "It raises a TypeError immediately", "It duplicates the previous output"],
          correctAnswerIndex: 1,
          explanation: "A generator can only be consumed once; iterating it again after exhaustion simply produces no further values.",
        },
      ],
      commonMistakes: [
        "Converting a generator expression to a list unnecessarily with list(...), losing the memory benefit when the values were only needed once.",
        "Trying to reuse a generator after it has already been fully iterated, then being confused why the second loop produces nothing.",
      ],
      deliverables: ["main.py comparing memory usage of a list comprehension and a generator expression, plus a sum() computed directly from a generator"],
      assessmentCriteria: [
        "Memory comparison correctly demonstrates the generator's smaller footprint",
        "sum() is computed directly from a generator expression without an intermediate list",
      ],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'import sys\n\nnumbers_list = [x * x for x in range(100000)]\nnumbers_gen = (x * x for x in range(100000))\n\nprint(sys.getsizeof(numbers_list))\nprint(sys.getsizeof(numbers_gen))\nprint(sum(x * x for x in range(100000)))',
        explanation: "The list comprehension's size grows with the range; the generator expression's size stays small and roughly constant no matter how large the range is.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Iterators & Generators Assessment",
    questions: [
      {
        question: "What two methods does the iterator protocol require?",
        options: ["__init__ and __del__", "__iter__ and __next__", "__enter__ and __exit__", "__get__ and __set__"],
        correctAnswerIndex: 1,
        explanation: "An iterable provides __iter__ to return an iterator, and an iterator provides __next__ to produce successive values.",
      },
      {
        question: "What must __next__ do once there are no more values left to produce?",
        options: ["Return None", "Raise StopIteration", "Return an empty list", "Loop forever"],
        correctAnswerIndex: 1,
        explanation: "Raising StopIteration signals to a for loop, or any consumer, that the sequence has ended.",
      },
      {
        question: "What does a for loop call repeatedly, under the hood, to get each value from an iterable?",
        options: ["__len__", "next() on the iterator returned by iter()", "__repr__", "__eq__"],
        correctAnswerIndex: 1,
        explanation: "A for loop first gets an iterator via iter(), then repeatedly calls next() on it until StopIteration is raised.",
      },
      {
        question: "What does calling a function that contains a yield statement return immediately?",
        options: ["The first yielded value", "A generator object", "A list of all yielded values", "None"],
        correctAnswerIndex: 1,
        explanation: "Calling a generator function returns a generator object without executing any of its body yet.",
      },
      {
        question: "When does the code inside a generator function actually execute?",
        options: ["All at once, when the function is called", "Incrementally, as the generator is iterated", "Only when the program exits", "Never"],
        correctAnswerIndex: 1,
        explanation: "Execution advances one yield at a time, only as the generator is consumed.",
      },
      {
        question: "What happens if you try to iterate a second time over a generator that has already been fully consumed?",
        options: ["It restarts from the beginning", "It produces no further values", "It raises a TypeError immediately on creation", "It duplicates the previous output"],
        correctAnswerIndex: 1,
        explanation: "Generators are single-use; once exhausted, further iteration simply yields nothing more.",
      },
      {
        question: "How is a generator expression written differently from a list comprehension?",
        options: ["Curly braces instead of square brackets", "Parentheses instead of square brackets", "They are written identically", "A generator expression requires the word 'yield'"],
        correctAnswerIndex: 1,
        explanation: "A generator expression uses parentheses, like (x for x in range(10)), instead of the square brackets of a list comprehension.",
      },
      {
        question: "What is the main memory advantage of a generator expression over an equivalent list comprehension?",
        options: [
          "There is no difference",
          "The generator produces values lazily instead of building the entire result in memory at once",
          "Generators can only hold numbers",
          "List comprehensions are always slower",
        ],
        correctAnswerIndex: 1,
        explanation: "Because a generator computes one value at a time, its memory footprint stays small regardless of how many values it will eventually produce.",
      },
      {
        question: "Can you pass a generator expression directly into sum() without first converting it to a list?",
        options: ["No, sum() only accepts lists", "Yes, sum() can iterate over a generator expression directly", "Only if it has fewer than 10 items", "Only inside a for loop"],
        correctAnswerIndex: 1,
        explanation: "sum(), like most functions that accept an iterable, works directly on a generator expression without needing a list first.",
      },
      {
        question: "What is a good use case for writing a custom iterator class instead of a simple generator function?",
        options: [
          "There is never a reason to use a class instead of a generator function",
          "When the iteration logic needs more structure or additional methods beyond simple value production",
          "Classes are always required for iteration",
          "Generator functions cannot use yield more than once",
        ],
        correctAnswerIndex: 1,
        explanation: "A class-based iterator makes sense when you need extra state, methods, or structure beyond what a simple generator function offers.",
      },
    ],
  },
  assignment:
    "Write a generator function batches(items, size) that yields successive chunks (as lists) of size items from a longer list, with the final chunk containing whatever remains if the list doesn't divide evenly. Test it on a list of at least 23 items with a batch size of 5, looping through and printing each yielded batch.",
  assignmentDeliverables: [
    "main.py with a batches(items, size) generator function",
    "Printed output showing every yielded batch, including a correctly sized final partial batch",
  ],
  assignmentAssessmentCriteria: [
    "batches() correctly yields fixed-size chunks using yield rather than building all chunks in memory first",
    "The final, smaller batch is handled correctly when the list doesn't divide evenly",
  ],
  miniProject:
    "Build a 'Prime Number Generator': write a generator function primes_up_to(limit) that yields each prime number from 2 up to limit one at a time using yield. Use it in a for loop to print every prime below 100, then call primes_up_to() again in a fresh call and pass it directly into sum() to print the total of all those primes without ever building a full list of them.",
  miniProjectDeliverables: [
    "main.py with a primes_up_to(limit) generator function",
    "Printed output listing the primes below 100 and their total sum",
  ],
  miniProjectAssessmentCriteria: [
    "primes_up_to() correctly identifies and yields only prime numbers",
    "sum() is used directly on a fresh generator call without first converting it to a list",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
