// Topic: Modifying Data (sql-modify) — 5 lessons.

const lessons = [
  {
    id: 'sql-modify-1',
    blocks: [
      {
        type: 'p',
        text: 'So far you have only read data. INSERT INTO adds new rows to a table.',
      },
      {
        type: 'code',
        text: "INSERT INTO trees (id, name, height) VALUES (4, 'Maple', 18);",
      },
      {
        type: 'p',
        text: 'List the column names in parentheses, then the matching values after VALUES.',
      },
      {
        type: 'tip',
        text: 'The order of values must match the order of column names you listed.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE trees (id INTEGER, name TEXT, height INTEGER);\nINSERT INTO trees VALUES (1, \'Oak\', 20), (2, \'Pine\', 15), (3, \'Birch\', 12);',
      instructions: "Insert a new tree: id 4, name 'Cedar', height 22.",
      starter: 'INSERT INTO trees ',
      checks: [
        {
          type: 'verifyRowCount',
          query: 'SELECT * FROM trees',
          count: 4,
          label: 'Table now has 4 rows',
        },
        {
          type: 'verifyRowCount',
          query: "SELECT * FROM trees WHERE name = 'Cedar'",
          count: 1,
          label: "Cedar was inserted",
        },
      ],
      hints: [
        'List columns in parentheses: (id, name, height).',
        "INSERT INTO trees (id, name, height) VALUES (4, 'Cedar', 22);",
      ],
      solution: "INSERT INTO trees (id, name, height) VALUES (4, 'Cedar', 22);",
    },
  },
  {
    id: 'sql-modify-2',
    blocks: [
      {
        type: 'p',
        text: 'You can insert multiple rows in one statement by adding more VALUES groups.',
      },
      {
        type: 'code',
        text: "INSERT INTO trees (id, name, height) VALUES\n  (4, 'Maple', 18),\n  (5, 'Cedar', 22);",
      },
      {
        type: 'tip',
        text: 'Each group of values is in its own parentheses, separated by commas.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE trees (id INTEGER, name TEXT, height INTEGER);\nINSERT INTO trees VALUES (1, \'Oak\', 20), (2, \'Pine\', 15);',
      instructions: "Insert two new trees in one statement: (3, 'Birch', 12) and (4, 'Maple', 18).",
      starter: 'INSERT INTO trees (id, name, height) VALUES\n  ',
      checks: [
        {
          type: 'verifyRowCount',
          query: 'SELECT * FROM trees',
          count: 4,
          label: 'Table now has 4 rows',
        },
        {
          type: 'verifyRowCount',
          query: "SELECT * FROM trees WHERE name IN ('Birch', 'Maple')",
          count: 2,
          label: 'Both Birch and Maple were inserted',
        },
      ],
      hints: [
        "Separate the two value groups with a comma.",
        "VALUES (3, 'Birch', 12), (4, 'Maple', 18);",
      ],
      solution: "INSERT INTO trees (id, name, height) VALUES\n  (3, 'Birch', 12),\n  (4, 'Maple', 18);",
    },
  },
  {
    id: 'sql-modify-3',
    blocks: [
      {
        type: 'p',
        text: 'UPDATE changes values in existing rows. Use SET to say which column to change.',
      },
      {
        type: 'code',
        text: 'UPDATE trees SET height = 25 WHERE id = 1;',
      },
      {
        type: 'p',
        text: 'Always add WHERE when you UPDATE. Without it, every row gets changed.',
      },
      {
        type: 'tip',
        text: 'You can update multiple columns at once: SET height = 25, name = \'Big Oak\'.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE trees (id INTEGER, name TEXT, height INTEGER);\nINSERT INTO trees VALUES (1, \'Oak\', 20), (2, \'Pine\', 15), (3, \'Birch\', 12);',
      instructions: "Update the Birch tree's height to 16.",
      starter: 'UPDATE trees SET ',
      checks: [
        {
          type: 'verifyRowCount',
          query: 'SELECT * FROM trees WHERE height = 16',
          count: 1,
          label: 'One tree now has height 16',
        },
        {
          type: 'verifyRowCount',
          query: "SELECT * FROM trees WHERE name = 'Birch' AND height = 16",
          count: 1,
          label: 'Birch height was updated to 16',
        },
      ],
      hints: [
        "Set the column: SET height = 16.",
        "Add WHERE name = 'Birch' to target only Birch.",
      ],
      solution: "UPDATE trees SET height = 16 WHERE name = 'Birch';",
    },
  },
  {
    id: 'sql-modify-4',
    blocks: [
      {
        type: 'p',
        text: 'DELETE removes rows from a table.',
      },
      {
        type: 'code',
        text: 'DELETE FROM trees WHERE id = 3;',
      },
      {
        type: 'p',
        text: 'Like UPDATE, always include WHERE. DELETE without WHERE removes every row.',
      },
      {
        type: 'tip',
        text: 'Deleted rows are gone for good. There is no undo in standard SQL.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE trees (id INTEGER, name TEXT, height INTEGER);\nINSERT INTO trees VALUES (1, \'Oak\', 20), (2, \'Pine\', 15), (3, \'Birch\', 12), (4, \'Stump\', 1);',
      instructions: 'Delete the row where height is 1 (the stump).',
      starter: 'DELETE FROM trees ',
      checks: [
        {
          type: 'verifyRowCount',
          query: 'SELECT * FROM trees',
          count: 3,
          label: 'Table has 3 rows after delete',
        },
        {
          type: 'verifyRowCount',
          query: 'SELECT * FROM trees WHERE height = 1',
          count: 0,
          label: 'No row with height 1 remains',
        },
      ],
      hints: [
        'Add WHERE height = 1 to target just the stump.',
        'DELETE FROM trees WHERE height = 1;',
      ],
      solution: 'DELETE FROM trees WHERE height = 1;',
    },
  },
  {
    id: 'sql-modify-5',
    blocks: [
      {
        type: 'p',
        text: 'In real apps you often run several statements in a row: insert some rows, update others, then delete stale data.',
      },
      {
        type: 'p',
        text: 'Capstone: write three separate statements to reshape the garden data.',
      },
      {
        type: 'tip',
        text: 'Separate multiple statements with semicolons. The runner executes them all in order.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE trees (id INTEGER, name TEXT, height INTEGER, status TEXT);\nINSERT INTO trees VALUES (1, \'Oak\', 20, \'healthy\'), (2, \'Pine\', 15, \'healthy\'), (3, \'Stump\', 1, \'dead\'), (4, \'Birch\', 12, \'healthy\');',
      instructions: "Do all three: (1) Insert a new tree (5, 'Maple', 18, 'healthy'). (2) Update Oak's height to 22. (3) Delete the row where status is 'dead'.",
      starter: "INSERT INTO trees (id, name, height, status) VALUES (5, 'Maple', 18, 'healthy');\n",
      checks: [
        {
          type: 'verifyRowCount',
          query: 'SELECT * FROM trees',
          count: 4,
          label: 'Table has 4 rows (added one, deleted one)',
        },
        {
          type: 'verifyRowCount',
          query: "SELECT * FROM trees WHERE name = 'Maple'",
          count: 1,
          label: 'Maple was inserted',
        },
        {
          type: 'verifyRowCount',
          query: "SELECT * FROM trees WHERE name = 'Oak' AND height = 22",
          count: 1,
          label: "Oak's height is now 22",
        },
      ],
      hints: [
        "UPDATE trees SET height = 22 WHERE name = 'Oak';",
        "DELETE FROM trees WHERE status = 'dead';",
      ],
      solution: "INSERT INTO trees (id, name, height, status) VALUES (5, 'Maple', 18, 'healthy');\nUPDATE trees SET height = 22 WHERE name = 'Oak';\nDELETE FROM trees WHERE status = 'dead';",
    },
  },
];

export default lessons;
