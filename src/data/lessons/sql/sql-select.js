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
  {
    id: 'sql-select-2',
    blocks: [
      {
        type: 'p',
        text: 'You do not always need every column. You can name just the ones you want.',
      },
      {
        type: 'p',
        text: 'List the column names after SELECT, separated by commas.',
      },
      {
        type: 'code',
        text: 'SELECT name, height FROM trees;',
      },
      {
        type: 'tip',
        text: 'Selecting only the columns you need keeps results clean and fast.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE trees (id INTEGER, name TEXT, height INTEGER, age INTEGER);\nINSERT INTO trees VALUES (1, \'Oak\', 20, 80), (2, \'Pine\', 15, 40), (3, \'Birch\', 12, 25);',
      instructions: 'Select only the name and age columns from the trees table.',
      starter: 'SELECT ',
      checks: [
        {
          type: 'queryHasColumns',
          columns: ['name', 'age'],
          label: 'name and age columns are in the result',
        },
        {
          type: 'queryRowCount',
          count: 3,
          label: 'All three rows come back',
        },
      ],
      hints: [
        'Name each column after SELECT, separated by a comma.',
        'SELECT name, age FROM trees;',
      ],
      solution: 'SELECT name, age FROM trees;',
    },
  },
  {
    id: 'sql-select-3',
    blocks: [
      {
        type: 'p',
        text: 'Sometimes you want to sort your results. Use ORDER BY to sort a column.',
      },
      {
        type: 'p',
        text: 'Add ASC to sort smallest to biggest, or DESC for biggest to smallest. ASC is the default.',
      },
      {
        type: 'code',
        text: 'SELECT name, height FROM trees ORDER BY height DESC;',
      },
      {
        type: 'tip',
        text: 'ORDER BY goes at the end of your query, after the table name.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE trees (id INTEGER, name TEXT, height INTEGER);\nINSERT INTO trees VALUES (1, \'Oak\', 20), (2, \'Pine\', 15), (3, \'Birch\', 12), (4, \'Maple\', 18);',
      instructions: 'Select all columns from trees, ordered by height from shortest to tallest.',
      starter: 'SELECT * FROM trees',
      checks: [
        {
          type: 'queryRowCount',
          count: 4,
          label: 'All four trees are returned',
        },
        {
          type: 'queryReturns',
          rows: [['3', 'Birch', '12'], ['2', 'Pine', '15']],
          label: 'Birch comes before Pine (sorted by height ASC)',
        },
      ],
      hints: [
        'Add ORDER BY height after the table name.',
        'ASC means smallest first — it is also the default.',
      ],
      solution: 'SELECT * FROM trees ORDER BY height ASC;',
    },
  },
  {
    id: 'sql-select-4',
    blocks: [
      {
        type: 'p',
        text: 'LIMIT lets you cap how many rows come back. That is useful when a table has thousands of rows and you only need a few.',
      },
      {
        type: 'code',
        text: 'SELECT * FROM trees LIMIT 2;',
      },
      {
        type: 'p',
        text: 'You can combine ORDER BY and LIMIT to get the top or bottom items.',
      },
      {
        type: 'tip',
        text: 'LIMIT always goes at the very end of the query.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE trees (id INTEGER, name TEXT, height INTEGER);\nINSERT INTO trees VALUES (1, \'Oak\', 20), (2, \'Pine\', 15), (3, \'Birch\', 12), (4, \'Maple\', 18), (5, \'Cedar\', 22);',
      instructions: 'Select the name and height of the 3 tallest trees.',
      starter: 'SELECT name, height FROM trees',
      checks: [
        {
          type: 'queryRowCount',
          count: 3,
          label: 'Exactly 3 rows returned',
        },
        {
          type: 'queryReturns',
          rows: [['Cedar', '22']],
          label: 'Cedar (tallest) is in the results',
        },
      ],
      hints: [
        'Sort by height DESC first, then add LIMIT 3.',
        'SELECT name, height FROM trees ORDER BY height DESC LIMIT 3;',
      ],
      solution: 'SELECT name, height FROM trees ORDER BY height DESC LIMIT 3;',
    },
  },
  {
    id: 'sql-select-5',
    blocks: [
      {
        type: 'p',
        text: 'You can rename a column in your results using AS. The new name is called an alias.',
      },
      {
        type: 'code',
        text: 'SELECT name, height AS meters FROM trees;',
      },
      {
        type: 'p',
        text: 'Aliases only change the label in the result. They do not change the table.',
      },
      {
        type: 'p',
        text: 'Now put it all together: SELECT specific columns, alias one, sort the results, and limit how many rows come back.',
      },
      {
        type: 'tip',
        text: 'Capstone: combine SELECT columns, AS alias, ORDER BY, and LIMIT in one query.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE trees (id INTEGER, name TEXT, height INTEGER, age INTEGER);\nINSERT INTO trees VALUES (1, \'Oak\', 20, 80), (2, \'Pine\', 15, 40), (3, \'Birch\', 12, 25), (4, \'Maple\', 18, 60), (5, \'Cedar\', 22, 90);',
      instructions: 'Select name and age, rename age as years_old, order by age descending, and return only the top 3.',
      starter: 'SELECT name, ',
      checks: [
        {
          type: 'queryRowCount',
          count: 3,
          label: 'Only 3 rows returned',
        },
        {
          type: 'queryHasColumns',
          columns: ['name', 'years_old'],
          label: 'age is aliased as years_old',
        },
        {
          type: 'queryReturns',
          rows: [['Cedar', '90']],
          label: 'Cedar (oldest) is in the top 3',
        },
      ],
      hints: [
        'Use AS years_old right after age.',
        'Add ORDER BY age DESC LIMIT 3 at the end.',
      ],
      solution: 'SELECT name, age AS years_old FROM trees ORDER BY age DESC LIMIT 3;',
    },
  },
];

export default lessons;
