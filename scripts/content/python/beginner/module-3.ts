import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace.";

export const module3: GeneratedModule = {
  title: "Making Decisions with Conditionals",
  description:
    "Give your programs the ability to branch: run different code depending on a condition, using if, elif, else, and logical operators.",
  completionStatus: "locked",
  lessons: [
    {
      title: "The if Statement",
      goal: "Write an if statement that runs code only when a condition is True.",
      videoTitle: "Python if Statements for Beginners",
      videoSearchQuery: "python if statement tutorial for beginners",
      videoLearningGoal: "See a basic if statement structure and how indentation defines the block that runs.",
      recommendedChannels: ["freeCodeCamp.org", "Programming with Mosh"],
      keyTakeaways: [
        "if <condition>: starts a conditional block; the condition must evaluate to True or False.",
        "The indented lines below if only run when the condition is True.",
        "If the condition is False, the indented block is skipped entirely.",
      ],
      notes:
        "An if statement lets your program make a decision. The syntax is: if condition:, followed by an indented block of code that runs only when the condition is True. If the condition is False, Python skips straight past the indented block.",
      conceptExplanation:
        "Indentation isn't optional in Python: it's how the interpreter knows which lines belong inside the if block. Standard style uses 4 spaces per indentation level. Forgetting to indent, or indenting inconsistently, causes an IndentationError.",
      whyItMatters: "Almost every real program needs to behave differently depending on data. if is the simplest building block for that.",
      practicalTask:
        "Create a variable temperature holding a number. Write an if statement that prints \"It's hot outside!\" only when temperature is greater than 30. Test it by changing the value and re-running.",
      challenge: "Add a second, independent if statement that checks if temperature is below 0 and prints a freezing warning.",
      expectedResult: "Running the script with temperature = 35 prints the hot message; running it with temperature = 20 prints nothing from that check.",
      tests: ["The if condition uses a comparison operator", "The indented block only runs when the condition is True"],
      hint: "Don't forget the colon (:) at the end of the if line, and indent the line below it.",
      lessonAssessment: [
        {
          question: "What happens to the code indented under an if statement when the condition is False?",
          options: ["It still runs once", "It is skipped entirely", "It raises an error", "It runs at the end of the program"],
          correctAnswerIndex: 1,
          explanation: "When the condition is False, Python skips the entire indented block under the if.",
        },
        {
          question: "What is required immediately after the condition in an if statement?",
          options: ["A semicolon", "A colon (:)", "Nothing", "Curly braces { }"],
          correctAnswerIndex: 1,
          explanation: "Python requires a colon after the condition to start the indented block.",
        },
      ],
      commonMistakes: ["Forgetting the colon at the end of the if line.", "Inconsistent indentation (mixing tabs and spaces, or different spacing levels)."],
      deliverables: ["A script with at least one working if statement"],
      assessmentCriteria: ["Condition correctly written", "Block only runs when condition is True"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 minutes",
      codeExample: {
        language: "python",
        code: 'temperature = 35\nif temperature > 30:\n    print("It\'s hot outside!")',
        explanation: "The indented print() line only executes because 35 > 30 evaluates to True.",
      },
      completionStatus: "not_started",
    },
    {
      title: "elif and else: Handling Multiple Branches",
      goal: "Chain multiple conditions together using elif and provide a fallback with else.",
      videoTitle: "Python if elif else Explained",
      videoSearchQuery: "python if elif else tutorial multiple conditions",
      videoLearningGoal: "See a multi-branch if/elif/else chain evaluate several conditions and pick exactly one branch.",
      recommendedChannels: ["Corey Schafer", "Traversy Media"],
      keyTakeaways: [
        "elif lets you check additional conditions if the previous ones were False.",
        "else runs only if none of the above conditions were True.",
        "Python checks conditions top to bottom and stops at the first True one.",
      ],
      notes:
        "When you have more than two possible outcomes, chain elif ('else if') clauses after your first if. An optional else at the end catches every remaining case. Only one branch in the whole chain ever runs.",
      conceptExplanation:
        "Order matters in an if/elif chain: Python evaluates top to bottom and executes the first branch whose condition is True, then skips the rest, even if a later condition would also be True. This is different from writing several separate if statements, which are each checked independently.",
      whyItMatters: "if/elif/else is how you translate a grading scale, a menu system, or any 'pick one of several outcomes' logic into code.",
      practicalTask:
        "Write a script that assigns a letter grade based on a numeric score variable: 90+ is \"A\", 80-89 is \"B\", 70-79 is \"C\", below 70 is \"F\". Print the resulting grade.",
      challenge: "Add a \"D\" grade for scores between 60 and 69, keeping the chain in the correct order.",
      expectedResult: "Changing the score variable to different values (95, 85, 72, 50) produces the correct corresponding grade each time.",
      tests: ["The chain uses if, at least two elif, and else", "Each score range maps to the correct grade"],
      hint: "Order your conditions from highest to lowest, since Python stops at the first True condition.",
      lessonAssessment: [
        {
          question: "In an if/elif/else chain, how many branches can run for a single execution?",
          options: ["All branches that are True", "Exactly one: the first True condition", "Zero, always", "It depends on the else clause"],
          correctAnswerIndex: 1,
          explanation: "Python stops checking after the first True condition in the chain and runs only that branch.",
        },
        {
          question: "Why does condition order matter in an if/elif chain checking score >= 90 then score >= 80?",
          options: [
            "It doesn't matter at all",
            "A score of 95 would incorrectly match score >= 80 first if that check came before score >= 90",
            "Python requires alphabetical order",
            "elif always runs regardless of order",
          ],
          correctAnswerIndex: 1,
          explanation: "Since Python stops at the first True condition, broader conditions must come after narrower ones, or they'll incorrectly catch cases meant for a later branch.",
        },
      ],
      commonMistakes: ["Writing separate if statements instead of elif, causing multiple branches to run.", "Ordering conditions so a broader check accidentally catches cases meant for a later, narrower one."],
      deliverables: ["A script implementing a 4+ branch grading system"],
      assessmentCriteria: ["Correct branch selected for each tested score", "Conditions ordered correctly"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "25 minutes",
      codeExample: {
        language: "python",
        code: 'score = 85\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelif score >= 70:\n    grade = "C"\nelse:\n    grade = "F"\nprint(grade)',
        explanation: "Since 85 is not >= 90 but is >= 80, the second branch runs and grade becomes \"B\"; the rest of the chain is skipped.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Combining Conditions with and, or, and not",
      goal: "Combine multiple conditions into a single expression using logical operators.",
      videoTitle: "Python Logical Operators: and, or, not",
      videoSearchQuery: "python logical operators and or not tutorial",
      videoLearningGoal: "See truth tables for and/or/not demonstrated with real conditions.",
      recommendedChannels: ["Programming with Mosh", "freeCodeCamp.org"],
      keyTakeaways: [
        "and is True only when both sides are True.",
        "or is True when at least one side is True.",
        "not flips a bool: not True is False, and vice versa.",
      ],
      notes:
        "Logical operators let you build compound conditions from simpler ones. age >= 18 and has_id checks two things at once; age < 13 or is_free checks whether either is true. not is used to invert a condition, e.g. not is_logged_in.",
      conceptExplanation:
        "You can combine as many conditions as you need, and use parentheses to make the grouping explicit and readable: (age >= 13 and age <= 19) or has_permission. Python evaluates and before or unless parentheses say otherwise, so when in doubt, add parentheses to make your intent clear rather than relying on precedence rules.",
      whyItMatters: "Real-world rules are rarely a single check. Access control, form validation, and game logic all rely on combined conditions.",
      practicalTask:
        "Write a script simulating a simple login check: create variables has_correct_password (bool) and account_is_active (bool). Print \"Access granted\" only if both are True using and; otherwise print \"Access denied\".",
      challenge: "Add a third variable is_admin (bool) and update the condition so access is also granted if is_admin is True, even if the other two aren't, using or.",
      expectedResult: "Changing the bool variables to different True/False combinations correctly grants or denies access.",
      tests: ["Uses the and operator for the base access check", "Correctly denies access when either required condition is False"],
      hint: "Combine conditions like this: if has_correct_password and account_is_active:",
      lessonAssessment: [
        {
          question: "What does True and False evaluate to?",
          options: ["True", "False", "None", "An error"],
          correctAnswerIndex: 1,
          explanation: "and requires both sides to be True to produce True; since one side is False, the result is False.",
        },
        {
          question: "What does not (5 > 3) evaluate to?",
          options: ["True", "False", "5", "3"],
          correctAnswerIndex: 1,
          explanation: "5 > 3 is True, and not inverts it to False.",
        },
      ],
      commonMistakes: ["Using & or | instead of and/or for simple boolean logic (those are bitwise operators with different behavior).", "Forgetting parentheses when mixing and and or, leading to unexpected grouping."],
      deliverables: ["A script combining at least two conditions with a logical operator"],
      assessmentCriteria: ["Correct use of and/or/not", "Access logic behaves correctly for all tested combinations"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20-25 minutes",
      codeExample: {
        language: "python",
        code: 'has_correct_password = True\naccount_is_active = False\nif has_correct_password and account_is_active:\n    print("Access granted")\nelse:\n    print("Access denied")',
        explanation: "Even though the password is correct, account_is_active is False, so the and expression is False and access is denied.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Making Decisions with Conditionals Assessment",
    questions: [
      { question: "What must follow the condition in an if statement?", options: ["A semicolon", "A colon", "Nothing", "A question mark"], correctAnswerIndex: 1, explanation: "Python requires a colon after the condition before the indented block." },
      { question: "How many branches run in a single if/elif/else chain execution?", options: ["All True branches", "Exactly one", "Zero", "All branches, always"], correctAnswerIndex: 1, explanation: "Python runs only the first branch whose condition evaluates to True, then skips the rest." },
      { question: "What does the else clause run for?", options: ["Every execution, always", "Only when no prior condition was True", "Only when the first condition was True", "It is required in every if statement"], correctAnswerIndex: 1, explanation: "else is optional and only runs when none of the preceding if/elif conditions were True." },
      { question: "What does True or False evaluate to?", options: ["True", "False", "None", "An error"], correctAnswerIndex: 0, explanation: "or only needs one side to be True to produce True." },
      { question: "What does not False evaluate to?", options: ["False", "True", "None", "0"], correctAnswerIndex: 1, explanation: "not inverts a boolean, so not False becomes True." },
      { question: "Given score = 72 and this chain: if score >= 90: ... elif score >= 70: ... elif score >= 60: ..., which branch runs?", options: ["The first (>= 90)", "The second (>= 70)", "The third (>= 60)", "None of them"], correctAnswerIndex: 1, explanation: "72 is not >= 90, but it is >= 70, so the second branch runs and the rest of the chain is skipped." },
      { question: "Why should broad conditions generally come after narrow ones in an elif chain?", options: [
          "It has no effect either way",
          "A broad condition placed first could incorrectly catch cases meant for a later, narrower branch",
          "Python requires narrow conditions first as a syntax rule",
          "It only matters for else",
        ], correctAnswerIndex: 1, explanation: "Since only the first True branch runs, an overly broad early condition can swallow cases intended for later branches." },
      { question: "What is the safest way to combine 'and' and 'or' in one condition to avoid ambiguity?", options: ["Avoid combining them entirely", "Use parentheses to make the grouping explicit", "Always put 'or' first", "Use a colon between them"], correctAnswerIndex: 1, explanation: "Parentheses make evaluation order explicit and easier to read, even though Python has default precedence rules." },
      { question: "What does (5 > 3) and (2 > 4) evaluate to?", options: ["True", "False", "5", "An error"], correctAnswerIndex: 1, explanation: "5 > 3 is True but 2 > 4 is False, and and requires both sides True, so the result is False." },
      { question: "Which keyword checks whether at least one of two conditions is True?", options: ["and", "or", "not", "elif"], correctAnswerIndex: 1, explanation: "or evaluates to True as long as at least one side is True." },
    ],
  },
  assignment:
    "Build a 'Movie Ticket Pricing' script: given variables for age and whether it's a weekday (bool), determine the ticket price using if/elif/else and logical operators (e.g. discounted for children or seniors, a weekday discount that can combine with age discounts, and a regular price otherwise). Print the final price with a short explanation of which discount applied.",
  assignmentDeliverables: ["A script with an if/elif/else chain and at least one combined logical condition", "Output stating the final price and which rule applied"],
  assignmentAssessmentCriteria: ["Correct branch selected for at least 3 different tested scenarios", "Logical operators used correctly to combine conditions"],
  miniProject:
    "Build a 'Rock, Paper, Scissors Judge': create two variables holding each player's choice as a string (\"rock\", \"paper\", or \"scissors\"). Using if/elif/else and logical operators, print which player wins or if it's a tie, covering all possible outcome combinations.",
  miniProjectDeliverables: ["rps_judge.py in the Academy workspace", "Correct results tested for at least 4 different input combinations"],
  miniProjectAssessmentCriteria: ["All win/lose/tie combinations are handled correctly", "Logic is readable and doesn't repeat the same check twice"],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
