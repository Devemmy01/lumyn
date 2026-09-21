import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace. Always include a way for loops to end to avoid an infinite loop.";

export const module4: GeneratedModule = {
  title: "Loops: Repeating Work",
  description:
    "Learn to repeat actions without copy-pasting code, using for loops, while and do...while loops, the for...of loop, and break/continue to control them precisely.",
  completionStatus: "locked",
  lessons: [
    {
      title: "The for Loop",
      goal: "Write a for loop that repeats a block of code a specific number of times.",
      videoTitle: "JavaScript for Loop Explained",
      videoSearchQuery: "javascript for loop tutorial for beginners",
      videoLearningGoal: "See a for loop's three parts (initialization, condition, increment) control exactly how many times it runs.",
      recommendedChannels: ["freeCodeCamp.org", "Web Dev Simplified"],
      keyTakeaways: [
        "A for loop has three parts in its parentheses: initialization; condition; increment.",
        "for (let i = 0; i < 5; i++) runs its block 5 times, with i taking values 0, 1, 2, 3, 4.",
        "The loop variable (commonly i) updates automatically after each pass through the increment expression.",
      ],
      notes:
        "The for loop is the standard way to repeat code a known number of times in JavaScript. Its header has three parts separated by semicolons: where the loop variable starts, the condition checked before each pass, and how the variable changes after each pass. As long as the condition stays true, the loop body keeps running.",
      conceptExplanation:
        "for (let i = 0; i < 5; i++) { console.log(i); } starts i at 0, checks i < 5 before each iteration, runs the block if true, then executes i++ (increment by 1) before checking again. This produces 0, 1, 2, 3, 4: five iterations, stopping the moment i reaches 5. You can start the counter anywhere, count by any step (i += 2), or even count downward (i--), giving a for loop far more flexibility than simply repeating a fixed number of times.",
      whyItMatters: "for loops are the most common way to repeat an exact number of times, from printing a sequence of numbers to processing a fixed batch of items later with arrays.",
      practicalTask:
        "Write a for loop that prints the numbers 1 through 10. Then write a second for loop that prints every even number from 2 to 20 by stepping the loop variable by 2 each time.",
      challenge: "Write a third loop that counts down from 10 to 1 by decrementing the loop variable, then prints \"Liftoff!\" after the loop ends.",
      expectedResult: "The script prints 1 through 10, then the even numbers 2 through 20, using for loops for both.",
      tests: ["First loop counts from 1 to 10 inclusive", "Second loop steps by 2 to print only even numbers"],
      hint: "i++ is shorthand for i = i + 1, and it runs automatically after each pass through the loop body.",
      lessonAssessment: [
        {
          question: "What are the three parts inside a for loop's parentheses, in order?",
          options: [
            "condition; initialization; increment",
            "initialization; condition; increment",
            "increment; condition; initialization",
            "condition; increment; initialization",
          ],
          correctAnswerIndex: 1,
          explanation: "A for loop header is written as initialization; condition; increment, in that exact order.",
        },
        {
          question: "How many times does for (let i = 0; i < 4; i++) run its body?",
          options: ["3 times", "4 times", "5 times", "Infinite times"],
          correctAnswerIndex: 1,
          explanation: "i takes the values 0, 1, 2, 3, stopping once i reaches 4, so the body runs 4 times.",
        },
      ],
      commonMistakes: ["Using < when <= was intended (or vice versa), causing an off-by-one result.", "Declaring the loop variable with let outside the loop unnecessarily instead of inside the for header."],
      deliverables: ["A script with two for loops producing the specified sequences"],
      assessmentCriteria: ["Loop bounds are correct", "Output matches the expected sequence exactly"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "javascript",
        code: 'for (let i = 1; i <= 10; i++) {\n  console.log(i);\n}\n\nfor (let even = 2; even <= 20; even += 2) {\n  console.log(even);\n}',
        explanation: "The first loop prints 1 through 10; the second steps by 2, printing every even number from 2 through 20.",
      },
      completionStatus: "not_started",
    },
    {
      title: "while and do...while Loops",
      goal: "Write while and do...while loops that repeat based on a condition rather than a fixed count.",
      videoTitle: "JavaScript while and do while Loops Explained",
      videoSearchQuery: "javascript while loop do while loop tutorial for beginners",
      videoLearningGoal: "See a while loop with a counter variable and a do...while loop that always runs its body at least once.",
      recommendedChannels: ["Programming with Mosh", "The Net Ninja"],
      keyTakeaways: [
        "while (condition) { } repeats its block as long as the condition stays true, checking before each pass.",
        "do { } while (condition); always runs its block at least once before checking the condition.",
        "Something inside a while or do...while loop must eventually make the condition false, or it never stops.",
      ],
      notes:
        "A while loop checks its condition before every iteration; if it's true, the block runs, then the condition is checked again. A do...while loop is similar, but it checks the condition after running the block, guaranteeing the block executes at least once even if the condition starts out false.",
      conceptExplanation:
        "A very common while pattern uses a counter: let count = 0; then while (count < 5) { ... count++; }. Each pass increases count by one, and after 5 passes the condition becomes false, ending the loop. Forgetting to update the counter inside the loop is the single most common beginner mistake with while loops, since nothing else will make the condition false. do...while is less common but useful when you need the loop body to run at least once no matter what, like showing a menu before checking whether the user wants to see it again.",
      whyItMatters: "while loops are essential whenever you don't know in advance exactly how many times something needs to repeat, and do...while guarantees at least one run when that matters.",
      practicalTask:
        "Write a while loop that starts a counter at 1 and prints \"Rep number: X\" for X from 1 to 5, then stops. Then write a do...while loop that starts a counter at 10 with a condition that is already false (count < 5), and observe that it still prints once before stopping.",
      challenge: "Modify the while loop to only print odd rep numbers (1, 3, 5), skipping the even ones, using the % operator on the counter.",
      expectedResult: "The while loop prints exactly 5 lines and stops; the do...while loop prints exactly once even though its condition starts false.",
      tests: ["The while loop's condition depends on a counter that is updated inside the loop", "The do...while loop demonstrably runs its body at least once despite a false starting condition"],
      hint: "count++ is shorthand for count = count + 1.",
      lessonAssessment: [
        {
          question: "What is the most common cause of an infinite while loop?",
          options: [
            "Using console.log() inside the loop",
            "Forgetting to update the variable the condition depends on",
            "Using a for loop instead",
            "Adding curly braces around the loop body",
          ],
          correctAnswerIndex: 1,
          explanation: "If nothing inside the loop changes the value being checked, the condition never becomes false and the loop runs forever.",
        },
        {
          question: "What makes do...while different from a regular while loop?",
          options: [
            "do...while never checks a condition",
            "do...while always runs its body at least once before checking the condition",
            "do...while can only run exactly once",
            "There is no difference",
          ],
          correctAnswerIndex: 1,
          explanation: "do...while checks its condition after the body runs, so the body always executes at least once, even if the condition is false from the start.",
        },
      ],
      commonMistakes: ["Forgetting to increment the counter inside a while loop, causing an infinite loop.", "Forgetting the semicolon after the while(condition) in a do...while loop, which JavaScript requires."],
      deliverables: ["A script with a working while loop and a working do...while loop"],
      assessmentCriteria: ["while loop terminates correctly", "do...while loop is shown to run at least once with a false starting condition"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "javascript",
        code: 'let count = 1;\nwhile (count <= 5) {\n  console.log("Rep number:", count);\n  count++;\n}\n\nlet tries = 10;\ndo {\n  console.log("This runs once even though tries < 5 is false");\n} while (tries < 5);',
        explanation: "The while loop runs 5 times as count climbs from 1 to 5; the do...while block runs once before its false condition ends it.",
      },
      completionStatus: "not_started",
    },
    {
      title: "for...of, break, and continue",
      goal: "Iterate over a sequence of values with for...of, and use break and continue to control any loop precisely.",
      videoTitle: "JavaScript for...of Loop, break, and continue Explained",
      videoSearchQuery: "javascript for of loop break continue statement tutorial",
      videoLearningGoal: "See for...of iterate over values directly, and break/continue control both for and while loops.",
      recommendedChannels: ["Fireship", "freeCodeCamp.org"],
      keyTakeaways: [
        "for (const item of collection) loops directly over each value in an array or other iterable, without needing an index.",
        "break immediately exits the nearest enclosing loop, skipping any remaining iterations.",
        "continue skips the rest of the current iteration and moves on to the next one.",
      ],
      notes:
        "for...of is a cleaner way to loop over a sequence of values, like an array, when you just need each value itself rather than a counting index. break and continue give you finer control than letting a loop run to natural completion: break is useful when you find what you're looking for and don't need to keep checking, and continue is useful when you want to skip specific values without stopping the whole loop.",
      conceptExplanation:
        "for (const num of [10, 20, 30]) { console.log(num); } runs the block once per array value, assigning num to 10, then 20, then 30, automatically. A common pattern is searching for a value: loop through a sequence, and once you find a match, break immediately instead of wastefully continuing to check the rest. continue is often paired with a condition that filters out unwanted values, like skipping multiples of 3 in a counting loop, while letting everything else print normally. Both work identically inside for, while, and for...of loops.",
      whyItMatters: "for...of will become your go-to way to process array data once collections are introduced next module, and break/continue let you write loops that respond to conditions found during the loop itself.",
      practicalTask:
        "Write a for loop over numbers 1 through 20 that prints each number, but uses continue to skip multiples of 3, and uses break to stop completely once it reaches 15. Then write a for...of loop over the array [\"red\", \"green\", \"blue\"] that prints each color.",
      challenge: "Rewrite the break/continue logic using a while loop instead of a for loop, producing identical output.",
      expectedResult: "The first loop prints 1, 2, 4, 5, 7, 8, 10, 11, 13, 14 and then stops; the for...of loop prints all three colors.",
      tests: ["continue is used to skip multiples of 3", "break is used to stop the loop at 15", "A for...of loop iterates over an array of at least 3 values"],
      hint: "Check the skip condition first with continue, before any other logic in that iteration.",
      lessonAssessment: [
        {
          question: "What does break do inside a loop?",
          options: ["Skips to the next iteration", "Immediately exits the loop entirely", "Pauses the program", "Restarts the loop from the beginning"],
          correctAnswerIndex: 1,
          explanation: "break stops the loop immediately, and execution continues with the code after the loop.",
        },
        {
          question: "What does for (const item of list) iterate over?",
          options: ["The index positions only", "Each value in list directly", "Only the first value in list", "The length of list"],
          correctAnswerIndex: 1,
          explanation: "for...of gives you each value in the iterable directly, without needing to track an index.",
        },
      ],
      commonMistakes: ["Confusing break (exit the loop) with continue (skip this iteration only).", "Placing the continue check after other code that should have been skipped first."],
      deliverables: ["A script demonstrating break, continue, and a for...of loop"],
      assessmentCriteria: ["continue correctly skips multiples of 3", "break correctly stops the loop at the right point", "for...of correctly iterates every array value"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "javascript",
        code: 'for (let number = 1; number <= 20; number++) {\n  if (number === 15) {\n    break;\n  }\n  if (number % 3 === 0) {\n    continue;\n  }\n  console.log(number);\n}\n\nconst colors = ["red", "green", "blue"];\nfor (const color of colors) {\n  console.log(color);\n}',
        explanation: "The continue skips printing multiples of 3, the break stops the loop at 15, and the for...of loop prints each array value directly.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Loops Assessment",
    questions: [
      { question: "What are the three parts of a for loop header, in order?", options: ["condition; increment; initialization", "initialization; condition; increment", "increment; initialization; condition", "condition; initialization; increment"], correctAnswerIndex: 1, explanation: "A for loop is written as initialization; condition; increment." },
      { question: "When does JavaScript check a while loop's condition?", options: ["Only once at the start", "Before every iteration", "Only at the end", "Never"], correctAnswerIndex: 1, explanation: "while checks its condition before each pass and stops once it's false." },
      { question: "What is the main cause of an infinite while loop?", options: ["Using a for loop", "The loop condition never becomes false", "Using console.log() too much", "Using for...of instead"], correctAnswerIndex: 1, explanation: "If nothing inside the loop changes the condition's outcome, it stays true forever." },
      { question: "What is the defining feature of a do...while loop?", options: ["It never checks a condition", "Its body always runs at least once before the condition is checked", "It can only loop through arrays", "It is identical to a for loop"], correctAnswerIndex: 1, explanation: "do...while checks its condition after the body executes, guaranteeing at least one run." },
      { question: "How many times does for (let i = 0; i < 5; i++) run its body?", options: ["4 times", "5 times", "6 times", "Infinite times"], correctAnswerIndex: 1, explanation: "i takes values 0 through 4, five values total, before the condition i < 5 becomes false." },
      { question: "What does break do?", options: ["Skips to the next iteration", "Exits the current loop immediately", "Raises an error", "Restarts the program"], correctAnswerIndex: 1, explanation: "break exits the nearest enclosing loop right away, skipping remaining iterations." },
      { question: "What does continue do?", options: ["Exits the loop", "Skips the rest of the current iteration only", "Restarts the loop", "Does nothing"], correctAnswerIndex: 1, explanation: "continue moves straight to the next iteration, skipping the rest of the current one." },
      { question: "What does for (const item of [\"a\", \"b\", \"c\"]) assign to item on the first pass?", options: ["0", "\"a\"", "The whole array", "undefined"], correctAnswerIndex: 1, explanation: "for...of gives you each value directly; on the first pass item is \"a\", the array's first value." },
      { question: "If a for loop over 1 to 5 uses continue when number === 3, how many numbers get printed?", options: ["5", "4", "3", "2"], correctAnswerIndex: 1, explanation: "There are 5 values (1-5); continue skips printing exactly one of them (3), leaving 4 printed." },
      { question: "Which statement is true about break and continue?", options: [
          "They do the same thing",
          "break exits the loop; continue skips only the current iteration",
          "continue exits the loop; break skips only the current iteration",
          "Neither can be used inside a for...of loop",
        ], correctAnswerIndex: 1, explanation: "break stops the loop entirely, while continue only skips the remainder of the current pass and keeps looping." },
    ],
  },
  assignment:
    "Write a 'Number Analyzer' script: loop through the numbers 1 to 50 using a for loop, use continue to skip anything not divisible by 5, print the ones that are, and add a break so the loop stops immediately after printing the 5th qualifying number.",
  assignmentDeliverables: ["A script combining for, continue, and break correctly", "Correct printed output showing exactly 5 numbers"],
  assignmentAssessmentCriteria: ["continue correctly filters numbers", "break correctly limits the output to 5 results"],
  miniProject:
    "Build a 'Multiplication Table Generator': using nested for loops (a loop inside a loop), print a multiplication table from 1x1 up to 5x5, with each row and column clearly formatted with template-friendly spacing so the table is easy to read, then use a for...of loop to print a labeled summary line for each row's total.",
  miniProjectDeliverables: ["A multiplicationTable.js file in the Academy workspace", "A clearly formatted 5x5 table in the console output"],
  miniProjectAssessmentCriteria: ["Table values are mathematically correct", "Output layout is readable as a grid", "for...of is used correctly for the row summary"],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
