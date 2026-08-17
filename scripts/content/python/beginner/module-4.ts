import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace. Always include a way for loops to end to avoid an infinite loop.";

export const module4: GeneratedModule = {
  title: "Loops: Repeating Work",
  description:
    "Learn to repeat actions without copy-pasting code, using while loops, for loops with range(), and the break/continue keywords to control them precisely.",
  completionStatus: "locked",
  lessons: [
    {
      title: "The while Loop",
      goal: "Write a while loop that repeats as long as a condition stays True.",
      videoTitle: "Python while Loops Explained",
      videoSearchQuery: "python while loop tutorial for beginners",
      videoLearningGoal: "See a while loop with a counter variable that increases each iteration until the condition becomes False.",
      recommendedChannels: ["freeCodeCamp.org", "Corey Schafer"],
      keyTakeaways: [
        "while <condition>: repeats its indented block as long as the condition stays True.",
        "Something inside the loop must eventually make the condition False, or it never stops (an infinite loop).",
        "A counter variable is a common pattern for controlling how many times a while loop runs.",
      ],
      notes:
        "A while loop checks its condition before every iteration. If the condition is True, the indented block runs, then Python checks the condition again, repeating until it becomes False. If nothing inside the loop changes the condition, it runs forever.",
      conceptExplanation:
        "A very common while pattern uses a counter: count = 0, then while count < 5:, with count += 1 as the last line inside the loop. Each pass increases count by one, and after 5 passes the condition becomes False, ending the loop. Forgetting to update the counter is the single most common beginner mistake with while loops.",
      whyItMatters: "while loops are essential whenever you don't know in advance exactly how many times something needs to repeat, like waiting for valid input.",
      practicalTask:
        "Write a while loop that starts a counter at 1 and prints \"Rep number: X\" for X from 1 to 5, then stops. Make sure the counter updates inside the loop.",
      challenge: "Modify the loop to only print odd rep numbers (1, 3, 5), skipping the even ones, using the % operator on the counter.",
      expectedResult: "The program prints exactly 5 lines (\"Rep number: 1\" through \"Rep number: 5\") and then stops without hanging.",
      tests: ["The loop condition depends on a counter variable", "The counter is updated inside the loop body"],
      hint: "count += 1 is shorthand for count = count + 1.",
      lessonAssessment: [
        {
          question: "What is the most common cause of an infinite while loop?",
          options: [
            "Using print() inside the loop",
            "Forgetting to update the variable the condition depends on",
            "Using a for loop instead",
            "Indenting the loop body",
          ],
          correctAnswerIndex: 1,
          explanation: "If nothing inside the loop changes the value being checked, the condition never becomes False and the loop runs forever.",
        },
        {
          question: "When does Python check a while loop's condition?",
          options: ["Only once, before the first iteration", "Before every iteration, including the first", "Only after the loop finishes", "Never, it runs a fixed number of times"],
          correctAnswerIndex: 1,
          explanation: "A while loop re-checks its condition before each pass, and stops as soon as it evaluates to False.",
        },
      ],
      commonMistakes: ["Forgetting to increment the counter, causing an infinite loop.", "Off-by-one errors when deciding whether the condition should be < or <=."],
      deliverables: ["A script with a working, correctly-terminating while loop"],
      assessmentCriteria: ["Loop terminates correctly", "Counter logic is correct"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "python",
        code: 'count = 1\nwhile count <= 5:\n    print("Rep number:", count)\n    count += 1',
        explanation: "count starts at 1 and increases by 1 each pass; once it exceeds 5, the condition count <= 5 becomes False and the loop stops.",
      },
      completionStatus: "not_started",
    },
    {
      title: "The for Loop and range()",
      goal: "Use a for loop with range() to repeat code a specific number of times.",
      videoTitle: "Python for Loops and range() Explained",
      videoSearchQuery: "python for loop range function tutorial",
      videoLearningGoal: "See for loops iterating over range() with different start/stop/step arguments.",
      recommendedChannels: ["Programming with Mosh", "Corey Schafer"],
      keyTakeaways: [
        "for i in range(5): runs the loop body 5 times, with i taking values 0, 1, 2, 3, 4.",
        "range(start, stop) generates numbers from start up to (but not including) stop.",
        "range(start, stop, step) lets you control the increment, including counting backward with a negative step.",
      ],
      notes:
        "A for loop paired with range() is the standard way to repeat code a known number of times in Python. range(5) produces 0 through 4: five values, starting at 0 by default. This is different from while, which relies on a condition rather than a fixed count.",
      conceptExplanation:
        "range() is flexible: range(5) is short for range(0, 5, 1). range(2, 10) starts at 2 instead of 0. range(0, 10, 2) counts by twos: 0, 2, 4, 6, 8. range(10, 0, -1) counts backward from 10 to 1. The loop variable (commonly named i) automatically updates each pass, so you don't manage a counter manually like you do with while.",
      whyItMatters: "for loops with range() are the most common way to repeat an exact number of times, from printing a multiplication table to processing a fixed batch of items.",
      practicalTask:
        "Write a for loop using range() that prints the numbers 1 through 10. Then write a second for loop that prints every even number from 2 to 20 using a step argument.",
      challenge: "Write a third loop that prints a countdown from 10 down to 1, then prints \"Liftoff!\" after the loop ends.",
      expectedResult: "The program prints 1 through 10, then the even numbers 2 through 20, using range() for both.",
      tests: ["First loop uses range(1, 11)", "Second loop uses a step argument to print only even numbers"],
      hint: "range(1, 11) includes 1 through 10 because the stop value is exclusive.",
      lessonAssessment: [
        {
          question: "What values does range(3) produce?",
          options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "1, 2"],
          correctAnswerIndex: 1,
          explanation: "range(3) is short for range(0, 3), producing 0, 1, and 2: three values starting at 0, stopping before 3.",
        },
        {
          question: "What does range(2, 10, 2) produce?",
          options: ["2, 4, 6, 8", "2, 4, 6, 8, 10", "2, 3, 4, ... 9", "2, 10"],
          correctAnswerIndex: 0,
          explanation: "Starting at 2, stepping by 2, and stopping before 10 gives 2, 4, 6, 8.",
        },
      ],
      commonMistakes: ["Expecting range(1, 10) to include 10 (the stop value is always exclusive).", "Forgetting that range() with a negative step needs the start to be greater than the stop."],
      deliverables: ["A script with two for loops using range() in different ways"],
      assessmentCriteria: ["Correct range() arguments used", "Output matches the expected sequence"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "python",
        code: 'for i in range(1, 11):\n    print(i)\n\nfor even in range(2, 21, 2):\n    print(even)',
        explanation: "The first loop prints 1 through 10; the second steps by 2, printing every even number from 2 through 20.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Controlling Loops with break and continue",
      goal: "Use break to exit a loop early and continue to skip to the next iteration.",
      videoTitle: "Python break and continue Explained",
      videoSearchQuery: "python break and continue statement tutorial",
      videoLearningGoal: "See break stop a loop early and continue skip specific iterations, inside both while and for loops.",
      recommendedChannels: ["freeCodeCamp.org", "Traversy Media"],
      keyTakeaways: [
        "break immediately exits the nearest enclosing loop, skipping any remaining iterations.",
        "continue skips the rest of the current iteration and moves on to the next one.",
        "Both work inside while and for loops the same way.",
      ],
      notes:
        "break and continue give you finer control than letting a loop run to natural completion. break is useful when you find what you're looking for and don't need to keep checking. continue is useful when you want to skip specific values without stopping the whole loop.",
      conceptExplanation:
        "A common pattern is searching for a value: loop through a range of numbers, and once you find a match, break immediately instead of wastefully continuing to check the rest. continue is often paired with a condition that filters out unwanted values, like skipping multiples of 3 in a counting loop, while letting everything else print normally.",
      whyItMatters: "break and continue let you write loops that respond to conditions found during the loop itself, not just a fixed range decided in advance.",
      practicalTask:
        "Write a for loop over range(1, 21) that prints each number, but uses continue to skip multiples of 3, and uses break to stop completely once it reaches 15.",
      challenge: "Rewrite the same logic using a while loop instead of a for loop, producing identical output.",
      expectedResult: "The program prints 1, 2, 4, 5, 7, 8, 10, 11, 13, 14 and then stops (skipping multiples of 3, stopping before printing 15).",
      tests: ["continue is used to skip multiples of 3", "break is used to stop the loop at 15"],
      hint: "Check the skip condition first with continue, before any other logic in that iteration.",
      lessonAssessment: [
        {
          question: "What does break do inside a loop?",
          options: ["Skips to the next iteration", "Immediately exits the loop entirely", "Pauses the program", "Restarts the loop from the beginning"],
          correctAnswerIndex: 1,
          explanation: "break stops the loop immediately, and execution continues with the code after the loop.",
        },
        {
          question: "What does continue do inside a loop?",
          options: ["Exits the loop", "Skips the rest of the current iteration and moves to the next one", "Does nothing", "Repeats the current iteration again"],
          correctAnswerIndex: 1,
          explanation: "continue jumps straight to the next iteration, skipping any remaining code in the current pass.",
        },
      ],
      commonMistakes: ["Confusing break (exit the loop) with continue (skip this iteration only).", "Placing the continue check after other code that should be skipped."],
      deliverables: ["A script demonstrating both break and continue in one loop"],
      assessmentCriteria: ["continue correctly skips multiples of 3", "break correctly stops the loop at the right point"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "python",
        code: 'for number in range(1, 21):\n    if number == 15:\n        break\n    if number % 3 == 0:\n        continue\n    print(number)',
        explanation: "The continue skips printing multiples of 3, and the break stops the entire loop the moment number reaches 15.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Loops Assessment",
    questions: [
      { question: "When does Python check a while loop's condition?", options: ["Only once at the start", "Before every iteration", "Only at the end", "Never"], correctAnswerIndex: 1, explanation: "while checks its condition before each pass and stops once it's False." },
      { question: "What is the main cause of an infinite while loop?", options: ["Using range()", "The loop condition never becomes False", "Using print() too much", "Using a for loop instead"], correctAnswerIndex: 1, explanation: "If nothing inside the loop changes the condition's outcome, it stays True forever." },
      { question: "What values does range(0, 5) produce?", options: ["0, 1, 2, 3, 4", "1, 2, 3, 4, 5", "0, 1, 2, 3, 4, 5", "5 values starting at 1"], correctAnswerIndex: 0, explanation: "range(0, 5) produces 0 through 4. The stop value 5 is excluded." },
      { question: "What does range(1, 10, 3) produce?", options: ["1, 4, 7", "1, 3, 6, 9", "1, 4, 7, 10", "1, 2, 3"], correctAnswerIndex: 0, explanation: "Starting at 1, stepping by 3, stopping before 10 gives 1, 4, 7." },
      { question: "What does break do?", options: ["Skips to the next iteration", "Exits the current loop immediately", "Raises an error", "Restarts the program"], correctAnswerIndex: 1, explanation: "break exits the nearest enclosing loop right away, skipping remaining iterations." },
      { question: "What does continue do?", options: ["Exits the loop", "Skips the rest of the current iteration only", "Restarts the loop", "Does nothing"], correctAnswerIndex: 1, explanation: "continue moves straight to the next iteration, skipping the rest of the current one." },
      { question: "In a for loop, what does the loop variable (e.g. i) do?", options: ["Stays the same every iteration", "Automatically takes the next value from the sequence each pass", "Must be updated manually", "Is optional"], correctAnswerIndex: 1, explanation: "The for loop automatically assigns the next value from the sequence (like range()) to the loop variable each iteration." },
      { question: "How would you loop over range() counting backward from 5 to 1?", options: ["range(5, 0, -1)", "range(1, 5)", "range(5, 1)", "range(-5, -1)"], correctAnswerIndex: 0, explanation: "A negative step counts downward; range(5, 0, -1) produces 5, 4, 3, 2, 1." },
      { question: "If a for loop over range(1, 6) uses continue when number == 3, how many numbers get printed?", options: ["5", "4", "3", "6"], correctAnswerIndex: 1, explanation: "range(1, 6) has 5 values (1-5); continue skips printing exactly one of them (3), leaving 4 printed." },
      { question: "Which statement is true about break and continue?", options: [
          "They do the same thing",
          "break exits the loop; continue skips only the current iteration",
          "continue exits the loop; break skips only the current iteration",
          "Neither can be used inside a for loop",
        ], correctAnswerIndex: 1, explanation: "break stops the loop entirely, while continue only skips the remainder of the current pass and keeps looping." },
    ],
  },
  assignment:
    "Write a 'Number Analyzer' script: loop through the numbers 1 to 50 using a for loop and range(). For each number, use continue to skip anything not divisible by 5, and print the ones that are. Add a break so the loop stops immediately after printing the 5th qualifying number.",
  assignmentDeliverables: ["A script combining for, range(), continue, and break correctly", "Correct printed output showing exactly 5 numbers"],
  assignmentAssessmentCriteria: ["continue correctly filters numbers", "break correctly limits the output to 5 results"],
  miniProject:
    "Build a 'Multiplication Table Generator': using nested for loops (a loop inside a loop) and range(), print a multiplication table from 1x1 up to 5x5, with each row and column clearly formatted so the table is easy to read.",
  miniProjectDeliverables: ["multiplication_table.py in the Academy workspace", "A clearly formatted 5x5 table in the output"],
  miniProjectAssessmentCriteria: ["Table values are mathematically correct", "Output layout is readable as a grid"],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
