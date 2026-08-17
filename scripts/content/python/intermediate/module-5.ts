import { ACADEMY_WORKSPACE_LAB, type GeneratedModule } from "@/lib/academy";

const SAFE_LEARNING_NOTE = "Run only your own practice code inside the Academy workspace. Only read or write files you created yourself inside the workspace.";

export const module5: GeneratedModule = {
  title: "Working with JSON & Structured Data",
  description:
    "Learn the json module to convert between Python data and JSON text, read and write JSON files in the workspace, and safely parse nested structures with missing or unexpected keys.",
  completionStatus: "locked",
  lessons: [
    {
      title: "The json Module: loads() and dumps()",
      goal: "Convert between JSON text and Python data structures using json.loads() and json.dumps().",
      videoTitle: "Python json Module Tutorial: loads and dumps",
      videoSearchQuery: "python json module tutorial loads dumps for beginners",
      videoLearningGoal: "See a Python dictionary converted to a JSON string and back, and understand how the two formats map to each other.",
      recommendedChannels: ["Corey Schafer", "freeCodeCamp.org"],
      keyTakeaways: [
        "json.dumps(python_object) converts a Python dictionary or list into a JSON-formatted string.",
        "json.loads(json_string) converts a JSON-formatted string back into a Python dictionary or list.",
        "JSON objects map to Python dictionaries, JSON arrays map to Python lists, and JSON's true/false/null map to True/False/None.",
      ],
      notes:
        "JSON (JavaScript Object Notation) is a plain text format for structured data that looks almost identical to a Python dictionary. The json module converts between the two: json.dumps() turns Python data into a JSON string, and json.loads() turns a JSON string back into Python data.",
      conceptExplanation:
        "json.dumps({\"name\": \"Ada\", \"age\": 30}) produces the string '{\"name\": \"Ada\", \"age\": 30}', ready to save or send somewhere. json.loads('{\"name\": \"Ada\", \"age\": 30}') does the reverse, parsing that text back into an actual Python dictionary you can index into with [\"name\"]. Passing indent=2 to json.dumps() produces nicely formatted, human-readable output with line breaks and indentation instead of one dense line.",
      whyItMatters: "JSON is the most common format for structured data exchange in modern software, from configuration files to APIs, so converting between it and Python data is a core practical skill.",
      practicalTask:
        "In the Academy workspace, main.py is already open for you. Create a Python dictionary representing a product with keys name, price, and in_stock. Convert it to a JSON string using json.dumps() and print it. Then convert that JSON string back into a Python dictionary using json.loads(), and print the value of one of its keys to confirm the round trip worked.",
      challenge: "Print the dictionary a second time using json.dumps(product, indent=2) and compare the readable, multi-line output to the original single-line version.",
      expectedResult: "The program prints a single-line JSON string, then successfully parses it back and prints one correctly retrieved value from the resulting dictionary.",
      tests: ["json.dumps() correctly converts a dictionary into a JSON string", "json.loads() correctly parses that string back into a usable dictionary"],
      hint: "Remember to import json at the top of the file before calling any of its functions.",
      lessonAssessment: [
        {
          question: "What does json.dumps({\"a\": 1}) return?",
          options: ["A Python dictionary", "A JSON-formatted string", "A list", "None"],
          correctAnswerIndex: 1,
          explanation: "json.dumps() converts a Python object into its JSON text representation, returned as a string.",
        },
        {
          question: "What does json.loads('{\"a\": 1}') return?",
          options: ["A JSON string, unchanged", "A Python dictionary with key \"a\" mapped to 1", "An error, since strings cannot contain quotes", "A list containing \"a\" and 1"],
          correctAnswerIndex: 1,
          explanation: "json.loads() parses a JSON string and returns the equivalent Python data structure, here a dictionary.",
        },
      ],
      commonMistakes: ["Confusing json.dumps() (Python to JSON string) with json.loads() (JSON string to Python), which are opposite operations.", "Forgetting that json.dumps() returns a string, not a file, so it still needs to be written to a file separately to be saved."],
      deliverables: ["A script demonstrating json.dumps() and json.loads() on the same data"],
      assessmentCriteria: ["dumps() and loads() are both used correctly", "The round trip from Python to JSON and back preserves the correct values"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'import json\n\nproduct = {"name": "Notebook", "price": 4.5, "in_stock": True}\njson_text = json.dumps(product)\nprint(json_text)\n\nparsed = json.loads(json_text)\nprint(parsed["name"], parsed["price"])',
        explanation: "dumps() converts the dictionary into JSON text, and loads() parses that same text back into a usable Python dictionary.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Reading and Writing JSON Files in the Workspace",
      goal: "Save Python data to a JSON file and load it back using json.dump() and json.load().",
      videoTitle: "Python Reading and Writing JSON Files Tutorial",
      videoSearchQuery: "python json file read write dump load tutorial",
      videoLearningGoal: "See json.dump() write a Python dictionary directly into an open file, and json.load() read a file back into Python data.",
      recommendedChannels: ["Programming with Mosh", "Traversy Media"],
      keyTakeaways: [
        "json.dump(data, file) writes Python data directly to an already-open file, formatted as JSON.",
        "json.load(file) reads an already-open JSON file and returns the parsed Python data.",
        "dump/load (no 's') work directly with file objects; dumps/loads (with an 's') work with strings.",
      ],
      notes:
        "json.dump() and json.load() are the file-based counterparts to dumps() and loads(): instead of working with a string, they work directly with an already-open file object, combining the conversion and the writing or reading into one step.",
      conceptExplanation:
        "with open(\"data.json\", \"w\") as f: json.dump(product, f) opens the file, then writes the JSON representation of product directly into it, without you needing to build the string yourself first. Reading it back works the same way: with open(\"data.json\", \"r\") as f: data = json.load(f) opens the file and parses its JSON content directly into a Python dictionary. Remembering the naming pattern helps: the versions without an 's' (dump, load) work with files; the versions with an 's' (dumps, loads) work with strings.",
      whyItMatters: "Saving structured data to a JSON file is one of the most common ways real programs persist data between runs, from settings files to saved application state.",
      practicalTask:
        "Create a Python dictionary representing a user profile with keys username, level, and points. Write it to a file called profile.json using with open(...) and json.dump(). Then open profile.json again in read mode and use json.load() to read it back into a new variable, printing its contents to confirm it matches what you saved.",
      challenge: "Update one value in the loaded dictionary (like increasing points), then write the updated dictionary back to profile.json, overwriting the file, and read it one more time to confirm the change was saved.",
      expectedResult: "profile.json is created in the workspace with the correct JSON content, and reading it back produces a dictionary matching what was originally saved.",
      tests: ["json.dump() is used with an open file in write mode to save the dictionary", "json.load() is used with an open file in read mode to load it back correctly"],
      hint: "json.dump() and json.load() need an already-open file object as their second and only argument respectively; they don't take a filename directly.",
      lessonAssessment: [
        {
          question: "What is the key difference between json.dump() and json.dumps()?",
          options: [
            "There is no difference",
            "json.dump() writes directly to an open file; json.dumps() returns a string",
            "json.dumps() writes to a file; json.dump() returns a string",
            "json.dump() only works with lists",
          ],
          correctAnswerIndex: 1,
          explanation: "The 's' versions (dumps/loads) work with strings in memory; the non-'s' versions (dump/load) work directly with an open file object.",
        },
        {
          question: "What do you need before calling json.load(f)?",
          options: ["A JSON string", "An already-open file object, f, in read mode", "Nothing, it opens the file itself", "A dictionary to load into"],
          correctAnswerIndex: 1,
          explanation: "json.load() expects an already-open file object and reads its JSON content directly from it.",
        },
      ],
      commonMistakes: ["Passing a filename string directly to json.dump() or json.load() instead of an open file object.", "Opening the file in the wrong mode, like trying to json.load() a file opened with \"w\" (write) instead of \"r\" (read)."],
      deliverables: ["A script that writes a dictionary to profile.json and reads it back successfully"],
      assessmentCriteria: ["profile.json is created with correct JSON content", "The file is read back correctly and matches the originally saved data"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'import json\n\nprofile = {"username": "ada_dev", "level": 3, "points": 150}\n\nwith open("profile.json", "w") as f:\n    json.dump(profile, f)\n\nwith open("profile.json", "r") as f:\n    loaded_profile = json.load(f)\n\nprint(loaded_profile["username"], loaded_profile["points"])',
        explanation: "json.dump() writes the dictionary directly into profile.json, and json.load() reads that same file back into a usable Python dictionary.",
      },
      completionStatus: "not_started",
    },
    {
      title: "Parsing Nested JSON and Handling Missing Keys Safely",
      goal: "Navigate nested JSON structures and safely handle keys that might be missing.",
      videoTitle: "Python Nested JSON and Safe Dictionary Access",
      videoSearchQuery: "python nested json parsing dict get method tutorial",
      videoLearningGoal: "See a nested JSON structure parsed with chained key access, and the .get() method used to avoid KeyError crashes.",
      recommendedChannels: ["freeCodeCamp.org", "Corey Schafer"],
      keyTakeaways: [
        "JSON objects can nest inside each other, so a value might be a dictionary containing another dictionary or a list.",
        "Accessing a nested value chains keys together: data[\"user\"][\"address\"][\"city\"].",
        "dictionary.get(\"key\", default) safely returns a fallback value instead of raising a KeyError when the key is missing.",
      ],
      notes:
        "Real JSON data is rarely flat: a user record might contain a nested address dictionary, which itself contains a city and zip code, or a list of tags. Reaching into nested data means chaining square brackets together, one level at a time. Because real data is often incomplete or inconsistent, .get() is the safe way to read a key that might not always be present.",
      conceptExplanation:
        "Given data = {\"user\": {\"name\": \"Ada\", \"address\": {\"city\": \"Lagos\"}}}, reading the city requires data[\"user\"][\"address\"][\"city\"]. If a key like \"zip_code\" doesn't exist and you access it with square brackets, Python raises a KeyError and crashes the program. data[\"user\"][\"address\"].get(\"zip_code\", \"Unknown\") instead returns \"Unknown\" safely if the key is missing, or the real value if it is present. This pattern, using .get() with a sensible default, is the standard way to handle data you don't fully control.",
      whyItMatters: "Real-world JSON data (from files, APIs, or user input) is often incomplete or inconsistently structured, and .get() with defaults prevents an entire class of crashes from missing keys.",
      practicalTask:
        "Create a nested dictionary representing a student with keys name, and a nested \"contact\" dictionary containing email, and optionally phone (only include phone for one of two students you create). Print each student's name and email using direct key access. Then use .get(\"phone\", \"Not provided\") to safely print each student's phone, showing that the missing one falls back correctly instead of crashing.",
      challenge: "Add a list of course dictionaries nested inside each student (each with a course name and a grade), and loop through printing every course for both students, using .get() defensively for any field that might be missing.",
      expectedResult: "The program prints both students' names and emails, and correctly prints \"Not provided\" for the student missing a phone number instead of crashing.",
      tests: ["At least one value is read from a nested dictionary using chained key access", ".get() with a default value is used at least once to safely handle a missing key"],
      hint: "dictionary.get(\"missing_key\", \"default\") never raises an error, even if \"missing_key\" doesn't exist; square brackets always would.",
      lessonAssessment: [
        {
          question: "Given data = {\"user\": {\"city\": \"Lagos\"}}, how do you access \"Lagos\"?",
          options: ["data[\"city\"]", "data[\"user\"][\"city\"]", "data.city", "data[\"user\", \"city\"]"],
          correctAnswerIndex: 1,
          explanation: "Nested dictionary values are reached by chaining square-bracket key access one level at a time.",
        },
        {
          question: "What does person.get(\"phone\", \"Not provided\") do if \"phone\" is not a key in person?",
          options: [
            "Raises a KeyError",
            "Returns \"Not provided\" instead of crashing",
            "Returns None silently with no fallback",
            "Adds \"phone\" to the dictionary automatically",
          ],
          correctAnswerIndex: 1,
          explanation: ".get() returns the given default value when the key is missing, rather than raising an error like direct square-bracket access would.",
        },
      ],
      commonMistakes: ["Using square-bracket access (data[\"phone\"]) on a key that might be missing, causing an unhandled KeyError crash.", "Forgetting to chain all the necessary levels when reading deeply nested data, like stopping one level too early."],
      deliverables: ["A script parsing nested dictionary data and using .get() at least once for a possibly missing key"],
      assessmentCriteria: ["Nested values are correctly accessed with chained keys", ".get() correctly prevents a crash on missing data"],
      safetyNotes: SAFE_LEARNING_NOTE,
      estimatedTime: "20 to 25 minutes",
      codeExample: {
        language: "python",
        code: 'students = [\n    {"name": "Ada", "contact": {"email": "ada@example.com", "phone": "555-0100"}},\n    {"name": "Sam", "contact": {"email": "sam@example.com"}},\n]\n\nfor student in students:\n    email = student["contact"]["email"]\n    phone = student["contact"].get("phone", "Not provided")\n    print(student["name"], email, phone)',
        explanation: "email is read directly since it is always present, while phone uses .get() with a fallback so Sam's missing phone number does not crash the loop.",
      },
      completionStatus: "not_started",
    },
  ],
  quiz: {
    title: "Working with JSON & Structured Data Assessment",
    questions: [
      { question: "What does json.dumps({\"a\": 1}) return?", options: ["A Python dictionary", "A JSON-formatted string", "A tuple", "None"], correctAnswerIndex: 1, explanation: "dumps() converts Python data into a JSON string." },
      { question: "What does json.loads() do?", options: ["Converts a Python object to a JSON string", "Parses a JSON string into a Python object", "Writes data to a file", "Reads data from a file"], correctAnswerIndex: 1, explanation: "loads() parses a JSON-formatted string and returns the equivalent Python data." },
      { question: "What is the difference between json.dump() and json.dumps()?", options: [
          "No difference",
          "dump() writes directly to an open file; dumps() returns a string",
          "dumps() writes to a file; dump() returns a string",
          "dump() only works with lists",
        ], correctAnswerIndex: 1, explanation: "The non-'s' functions (dump/load) work with an already-open file object; the 's' versions (dumps/loads) work with strings." },
      { question: "What must you pass to json.load(f)?", options: ["A JSON string", "An already-open file object in read mode", "A filename string", "A dictionary"], correctAnswerIndex: 1, explanation: "json.load() reads directly from an already-open file object, not a filename." },
      { question: "Given data = {\"user\": {\"city\": \"Lagos\"}}, what correctly accesses \"Lagos\"?", options: ["data[\"city\"]", "data[\"user\"][\"city\"]", "data.user.city", "data[\"user\", \"city\"]"], correctAnswerIndex: 1, explanation: "Nested dictionary access is done by chaining square brackets for each level." },
      { question: "What happens if you use square-bracket access, data[\"phone\"], and \"phone\" is not a key?", options: ["It returns None", "It returns an empty string", "It raises a KeyError", "It returns 0"], correctAnswerIndex: 2, explanation: "Direct square-bracket access on a missing key raises a KeyError and crashes the program if not handled." },
      { question: "What does person.get(\"phone\", \"Not provided\") return if \"phone\" is missing?", options: ["Raises an error", "\"Not provided\"", "None, silently", "It adds the key automatically"], correctAnswerIndex: 1, explanation: ".get() returns the specified default value instead of raising an error when the key does not exist." },
      { question: "In JSON, what does a JSON array correspond to in Python?", options: ["A dictionary", "A list", "A tuple", "A set"], correctAnswerIndex: 1, explanation: "JSON arrays (values in square brackets) map directly to Python lists when parsed." },
      { question: "What does passing indent=2 to json.dumps() do?", options: ["Removes all whitespace", "Formats the output with readable line breaks and indentation", "Converts the data to a list", "Raises an error"], correctAnswerIndex: 1, explanation: "The indent argument tells json.dumps() to produce nicely formatted, human-readable multi-line output." },
      { question: "Why is .get() with a default value preferred over square brackets when reading data from an external JSON source?", options: [
          "It runs faster",
          "Real-world JSON data may be missing keys, and .get() avoids crashing when that happens",
          "Square brackets do not work on dictionaries",
          "It converts the value to a string automatically",
        ], correctAnswerIndex: 1, explanation: "External or user-provided JSON data is often incomplete or inconsistent, and .get() with a default handles missing keys gracefully instead of crashing." },
    ],
  },
  assignment:
    "Build an 'Inventory Saver': create a list of at least 4 dictionaries, each representing a product with keys name, price, and quantity. Save the entire list to a file called inventory.json using json.dump(). Then read inventory.json back using json.load(), loop through the loaded list, and print each product's details along with its total value (price multiplied by quantity).",
  assignmentDeliverables: [
    "A script that saves a list of product dictionaries to inventory.json and reads it back",
    "Printed output showing each product's details and calculated total value after reloading",
  ],
  assignmentAssessmentCriteria: [
    "inventory.json is correctly created with valid JSON content",
    "The reloaded data correctly matches the original list",
    "Total value is calculated correctly for every product",
  ],
  miniProject:
    "Build a 'User Settings Manager': create a nested dictionary representing app settings, with at least one top-level key holding a nested dictionary (for example, \"display\": {\"theme\": \"dark\", \"font_size\": 14}) and one optional key that is not always present. Save it to settings.json. Write a function get_setting(settings, *keys, default=None) that safely walks through nested keys using .get() at each step, returning default if any key along the way is missing. Demonstrate it successfully reading an existing nested value and safely returning a default for a missing one.",
  miniProjectDeliverables: [
    "settings_manager.py in the Academy workspace",
    "settings.json showing the saved nested settings",
    "Output showing get_setting() successfully reading a real value and safely falling back on a missing one",
  ],
  miniProjectAssessmentCriteria: [
    "settings.json correctly contains nested structured data",
    "get_setting() correctly retrieves nested values without crashing on missing keys",
    "The fallback default is demonstrated working correctly",
  ],
  labEnvironment: ACADEMY_WORKSPACE_LAB,
  safetyNotes: SAFE_LEARNING_NOTE,
};
