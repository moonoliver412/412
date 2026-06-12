// Topic: Filtering Rows (sql-filter) — 5 lessons.

const lessons = [
  {
    id: 'sql-filter-1',
    blocks: [
      {
        type: 'p',
        text: 'Most of the time you do not want every row. You want rows that match a condition.',
      },
      {
        type: 'p',
        text: 'Use WHERE to filter. Write the condition after WHERE.',
      },
      {
        type: 'code',
        text: 'SELECT * FROM trees WHERE height > 15;',
      },
      {
        type: 'tip',
        text: 'WHERE goes between the table name and ORDER BY (or the end of the query).',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE trees (id INTEGER, name TEXT, height INTEGER);\nINSERT INTO trees VALUES (1, \'Oak\', 20), (2, \'Pine\', 15), (3, \'Birch\', 12), (4, \'Cedar\', 22);',
      instructions: 'Select all columns from trees where height is greater than 15.',
      starter: 'SELECT * FROM trees',
      checks: [
        {
          type: 'queryRowCount',
          count: 2,
          label: 'Two trees taller than 15 are returned',
        },
        {
          type: 'queryReturns',
          rows: [['1', 'Oak', '20'], ['4', 'Cedar', '22']],
          label: 'Oak and Cedar are in the results',
        },
      ],
      hints: [
        'Add WHERE height > 15 after the table name.',
        'SELECT * FROM trees WHERE height > 15;',
      ],
      solution: 'SELECT * FROM trees WHERE height > 15;',
    },
  },
  {
    id: 'sql-filter-2',
    blocks: [
      {
        type: 'p',
        text: 'You can filter on text too. Use = and wrap the value in single quotes.',
      },
      {
        type: 'code',
        text: "SELECT * FROM trees WHERE name = 'Oak';",
      },
      {
        type: 'p',
        text: 'Other comparison operators work on numbers: <, >, <=, >=, and != (not equal).',
      },
      {
        type: 'tip',
        text: 'Text values always need single quotes. Numbers do not.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE plants (id INTEGER, name TEXT, type TEXT, water_days INTEGER);\nINSERT INTO plants VALUES (1, \'Rose\', \'flower\', 2), (2, \'Fern\', \'fern\', 1), (3, \'Cactus\', \'succulent\', 14), (4, \'Lily\', \'flower\', 3);',
      instructions: "Select all columns from plants where type is 'flower'.",
      starter: 'SELECT * FROM plants',
      checks: [
        {
          type: 'queryRowCount',
          count: 2,
          label: 'Two flowers are returned',
        },
        {
          type: 'queryReturns',
          rows: [['1', 'Rose', 'flower', '2'], ['4', 'Lily', 'flower', '3']],
          label: 'Rose and Lily are in the results',
        },
      ],
      hints: [
        "Add WHERE type = 'flower' after the table name.",
        "Text values go inside single quotes: 'flower'.",
      ],
      solution: "SELECT * FROM plants WHERE type = 'flower';",
    },
  },
  {
    id: 'sql-filter-3',
    blocks: [
      {
        type: 'p',
        text: 'You can combine conditions with AND and OR.',
      },
      {
        type: 'p',
        text: 'AND means both conditions must be true. OR means either one can be true.',
      },
      {
        type: 'code',
        text: "SELECT * FROM plants WHERE type = 'flower' AND water_days <= 2;",
      },
      {
        type: 'tip',
        text: 'Use parentheses when mixing AND and OR to make the order clear.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE plants (id INTEGER, name TEXT, type TEXT, water_days INTEGER);\nINSERT INTO plants VALUES (1, \'Rose\', \'flower\', 2), (2, \'Fern\', \'fern\', 1), (3, \'Cactus\', \'succulent\', 14), (4, \'Lily\', \'flower\', 3), (5, \'Daisy\', \'flower\', 2);',
      instructions: "Select all columns from plants where type is 'flower' and water_days is less than 3.",
      starter: 'SELECT * FROM plants WHERE ',
      checks: [
        {
          type: 'queryRowCount',
          count: 2,
          label: 'Two rows match both conditions',
        },
        {
          type: 'queryReturns',
          rows: [['1', 'Rose', 'flower', '2'], ['5', 'Daisy', 'flower', '2']],
          label: 'Rose and Daisy are returned',
        },
      ],
      hints: [
        "Use AND to join the two conditions: type = 'flower' AND water_days < 3.",
        "SELECT * FROM plants WHERE type = 'flower' AND water_days < 3;",
      ],
      solution: "SELECT * FROM plants WHERE type = 'flower' AND water_days < 3;",
    },
  },
  {
    id: 'sql-filter-4',
    blocks: [
      {
        type: 'p',
        text: 'LIKE lets you match text patterns. Use % as a wildcard — it stands for any number of characters.',
      },
      {
        type: 'code',
        text: "SELECT * FROM trees WHERE name LIKE 'B%';",
      },
      {
        type: 'p',
        text: "That finds rows where name starts with B. Use '%oak' for ends with, or '%oak%' for contains.",
      },
      {
        type: 'tip',
        text: 'LIKE is case-insensitive in SQLite, so B% also matches birch.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE plants (id INTEGER, name TEXT, type TEXT);\nINSERT INTO plants VALUES (1, \'Sunflower\', \'flower\'), (2, \'Snapdragon\', \'flower\'), (3, \'Fern\', \'fern\'), (4, \'Snowdrop\', \'flower\'), (5, \'Sweetgrass\', \'grass\');',
      instructions: "Select all columns from plants where name contains 'sn' anywhere (case-insensitive).",
      starter: 'SELECT * FROM plants WHERE ',
      checks: [
        {
          type: 'queryRowCount',
          count: 2,
          label: 'Two plants match',
        },
        {
          type: 'queryReturns',
          rows: [['2', 'Snapdragon', 'flower']],
          label: 'Snapdragon is in the results',
        },
      ],
      hints: [
        "Use LIKE '%sn%' to find names that contain sn.",
        "SELECT * FROM plants WHERE name LIKE '%sn%';",
      ],
      solution: "SELECT * FROM plants WHERE name LIKE '%sn%';",
    },
  },
  {
    id: 'sql-filter-5',
    blocks: [
      {
        type: 'p',
        text: 'IN lets you match a list of values without writing many OR conditions.',
      },
      {
        type: 'code',
        text: "SELECT * FROM plants WHERE type IN ('flower', 'fern');",
      },
      {
        type: 'p',
        text: 'BETWEEN matches a range. It includes both end values.',
      },
      {
        type: 'code',
        text: 'SELECT * FROM plants WHERE water_days BETWEEN 1 AND 3;',
      },
      {
        type: 'tip',
        text: 'Capstone: combine IN or BETWEEN with ORDER BY and LIMIT to drill down to exactly what you need.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE plants (id INTEGER, name TEXT, type TEXT, water_days INTEGER);\nINSERT INTO plants VALUES (1, \'Rose\', \'flower\', 2), (2, \'Fern\', \'fern\', 1), (3, \'Cactus\', \'succulent\', 14), (4, \'Lily\', \'flower\', 3), (5, \'Daisy\', \'flower\', 2), (6, \'Bamboo\', \'grass\', 4);',
      instructions: "Select name and water_days from plants where type is 'flower' or 'fern', ordered by water_days ascending.",
      starter: 'SELECT name, water_days FROM plants WHERE ',
      checks: [
        {
          type: 'queryRowCount',
          count: 4,
          label: 'Four plants (flowers + ferns) returned',
        },
        {
          type: 'queryHasColumns',
          columns: ['name', 'water_days'],
          label: 'name and water_days columns are present',
        },
        {
          type: 'queryReturns',
          rows: [['Fern', '1']],
          label: 'Fern (lowest water_days) appears in results',
        },
      ],
      hints: [
        "Use IN ('flower', 'fern') after WHERE type.",
        "Add ORDER BY water_days at the end.",
      ],
      solution: "SELECT name, water_days FROM plants WHERE type IN ('flower', 'fern') ORDER BY water_days ASC;",
    },
  },
];

export default lessons;
