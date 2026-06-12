// Topic: Querying Data (sql-select) — 5 lessons.

const lessons = [
  {
    id: 'sql-select-1',
    blocks: [
      {
        type: 'p',
        text: 'SQL is the language of databases — the place apps keep their data. A database holds tables, which look like spreadsheets: columns name the fields, and each row is one record. You ask a table questions with a query.',
      },
      {
        type: 'p',
        text: 'The most common query is SELECT. It reads rows from a table. The star * means "every column".',
      },
      {
        type: 'code',
        text: 'SELECT * FROM trees;',
      },
      {
        type: 'tip',
        text: 'SQL keywords like SELECT and FROM are often written in capitals. It is a habit, not a rule — sql works either way.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE trees (id INTEGER, name TEXT, height INTEGER);\nINSERT INTO trees VALUES (1, \'Oak\', 20), (2, \'Pine\', 15), (3, \'Birch\', 12);',
      instructions:
        'Write a query that selects every column from the trees table.',
      starter: 'SELECT ',
      checks: [
        {
          type: 'queryRowCount',
          count: 3,
          label: 'All three trees come back',
          hint: 'SELECT * FROM trees; returns every row.',
        },
        {
          type: 'queryHasColumns',
          columns: ['name', 'height'],
          label: 'You selected the columns',
        },
      ],
      hints: [
        'Use the star to grab every column: SELECT * FROM trees;',
        'End the query with a semicolon.',
      ],
      solution: 'SELECT * FROM trees;',
    },
  },
];

export default lessons;
