// Topic: Aggregating Data (sql-aggregate) — 5 lessons.

const lessons = [
  {
    id: 'sql-aggregate-1',
    blocks: [
      {
        type: 'p',
        text: 'Aggregate functions crunch a whole column down to one number.',
      },
      {
        type: 'p',
        text: 'COUNT(*) tells you how many rows are in a table.',
      },
      {
        type: 'code',
        text: 'SELECT COUNT(*) FROM trees;',
      },
      {
        type: 'tip',
        text: 'COUNT(*) counts every row, even ones with empty fields.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE trees (id INTEGER, name TEXT, height INTEGER);\nINSERT INTO trees VALUES (1, \'Oak\', 20), (2, \'Pine\', 15), (3, \'Birch\', 12), (4, \'Cedar\', 22), (5, \'Maple\', 18);',
      instructions: 'Write a query that counts how many trees are in the table.',
      starter: 'SELECT ',
      checks: [
        {
          type: 'queryRowCount',
          count: 1,
          label: 'Query returns a single summary row',
        },
        {
          type: 'queryCellIncludes',
          text: '5',
          label: 'The count is 5',
        },
      ],
      hints: [
        'Use COUNT(*) to count all rows.',
        'SELECT COUNT(*) FROM trees;',
      ],
      solution: 'SELECT COUNT(*) FROM trees;',
    },
  },
  {
    id: 'sql-aggregate-2',
    blocks: [
      {
        type: 'p',
        text: 'SUM adds up all values in a column. AVG finds the average.',
      },
      {
        type: 'code',
        text: 'SELECT SUM(height), AVG(height) FROM trees;',
      },
      {
        type: 'p',
        text: 'MIN and MAX find the smallest and largest values.',
      },
      {
        type: 'code',
        text: 'SELECT MIN(height), MAX(height) FROM trees;',
      },
      {
        type: 'tip',
        text: 'You can use several aggregate functions in the same SELECT.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE trees (id INTEGER, name TEXT, height INTEGER);\nINSERT INTO trees VALUES (1, \'Oak\', 20), (2, \'Pine\', 15), (3, \'Birch\', 12), (4, \'Cedar\', 22), (5, \'Maple\', 18);',
      instructions: 'Select the minimum and maximum height from the trees table.',
      starter: 'SELECT ',
      checks: [
        {
          type: 'queryHasColumns',
          columns: ['MIN(height)', 'MAX(height)'],
          label: 'MIN and MAX columns are in the result',
        },
        {
          type: 'queryReturns',
          rows: [['12', '22']],
          label: 'MIN is 12 and MAX is 22',
        },
      ],
      hints: [
        'Use MIN(height) and MAX(height) in your SELECT.',
        'SELECT MIN(height), MAX(height) FROM trees;',
      ],
      solution: 'SELECT MIN(height), MAX(height) FROM trees;',
    },
  },
  {
    id: 'sql-aggregate-3',
    blocks: [
      {
        type: 'p',
        text: 'GROUP BY groups rows that share a value in a column. Then aggregate functions run on each group.',
      },
      {
        type: 'code',
        text: 'SELECT type, COUNT(*) FROM plants GROUP BY type;',
      },
      {
        type: 'p',
        text: 'That gives you one row per type, with a count for each.',
      },
      {
        type: 'tip',
        text: 'Every column in SELECT must either be in GROUP BY or inside an aggregate function.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE plants (id INTEGER, name TEXT, type TEXT);\nINSERT INTO plants VALUES (1, \'Rose\', \'flower\'), (2, \'Lily\', \'flower\'), (3, \'Fern\', \'fern\'), (4, \'Cactus\', \'succulent\'), (5, \'Daisy\', \'flower\'), (6, \'Maidenhair\', \'fern\');',
      instructions: 'Select type and the count of plants in each type, grouped by type.',
      starter: 'SELECT type, ',
      checks: [
        {
          type: 'queryRowCount',
          count: 3,
          label: 'One row per type (3 types)',
        },
        {
          type: 'queryHasColumns',
          columns: ['type'],
          label: 'type column is present',
        },
        {
          type: 'queryCellIncludes',
          text: '3',
          label: 'The flower count (3) appears in results',
        },
      ],
      hints: [
        'Use COUNT(*) for the count.',
        'SELECT type, COUNT(*) FROM plants GROUP BY type;',
      ],
      solution: 'SELECT type, COUNT(*) FROM plants GROUP BY type;',
    },
  },
  {
    id: 'sql-aggregate-4',
    blocks: [
      {
        type: 'p',
        text: 'HAVING filters groups — it works like WHERE but runs after GROUP BY.',
      },
      {
        type: 'code',
        text: 'SELECT type, COUNT(*) FROM plants GROUP BY type HAVING COUNT(*) > 1;',
      },
      {
        type: 'p',
        text: 'Use WHERE to filter individual rows before grouping. Use HAVING to filter the grouped results.',
      },
      {
        type: 'tip',
        text: 'Remember: WHERE before GROUP BY, HAVING after GROUP BY.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE plants (id INTEGER, name TEXT, type TEXT, water_days INTEGER);\nINSERT INTO plants VALUES (1, \'Rose\', \'flower\', 2), (2, \'Lily\', \'flower\', 3), (3, \'Fern\', \'fern\', 1), (4, \'Cactus\', \'succulent\', 14), (5, \'Daisy\', \'flower\', 2), (6, \'Maidenhair\', \'fern\', 1);',
      instructions: 'Select type and count of plants per type, but only show types that have more than 1 plant.',
      starter: 'SELECT type, COUNT(*) FROM plants GROUP BY type',
      checks: [
        {
          type: 'queryRowCount',
          count: 2,
          label: 'Two types have more than 1 plant',
        },
        {
          type: 'queryCellIncludes',
          text: 'flower',
          label: 'flower type appears in results',
        },
      ],
      hints: [
        'Add HAVING COUNT(*) > 1 after GROUP BY type.',
        'SELECT type, COUNT(*) FROM plants GROUP BY type HAVING COUNT(*) > 1;',
      ],
      solution: 'SELECT type, COUNT(*) FROM plants GROUP BY type HAVING COUNT(*) > 1;',
    },
  },
  {
    id: 'sql-aggregate-5',
    blocks: [
      {
        type: 'p',
        text: 'You can alias aggregate results to give them readable names.',
      },
      {
        type: 'code',
        text: 'SELECT type, COUNT(*) AS total, AVG(water_days) AS avg_water FROM plants GROUP BY type;',
      },
      {
        type: 'p',
        text: 'Capstone: combine GROUP BY, aggregate functions, aliases, HAVING, and ORDER BY.',
      },
      {
        type: 'tip',
        text: 'SQL processes clauses in this order: WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE plants (id INTEGER, name TEXT, type TEXT, water_days INTEGER);\nINSERT INTO plants VALUES (1, \'Rose\', \'flower\', 2), (2, \'Lily\', \'flower\', 3), (3, \'Fern\', \'fern\', 1), (4, \'Cactus\', \'succulent\', 14), (5, \'Daisy\', \'flower\', 2), (6, \'Maidenhair\', \'fern\', 1), (7, \'Aloe\', \'succulent\', 10);',
      instructions: 'Select type and average water_days aliased as avg_water, grouped by type, only for types with at least 2 plants, ordered by avg_water descending.',
      starter: 'SELECT type, AVG(water_days) AS avg_water FROM plants',
      checks: [
        {
          type: 'queryRowCount',
          count: 3,
          label: 'Three types returned (all have 2+ plants)',
        },
        {
          type: 'queryHasColumns',
          columns: ['type', 'avg_water'],
          label: 'avg_water alias is in the result',
        },
        {
          type: 'queryCellIncludes',
          text: 'succulent',
          label: 'succulent (highest avg_water) appears first',
        },
      ],
      hints: [
        'Add GROUP BY type HAVING COUNT(*) >= 2.',
        'Add ORDER BY avg_water DESC at the end.',
      ],
      solution: 'SELECT type, AVG(water_days) AS avg_water FROM plants GROUP BY type HAVING COUNT(*) >= 2 ORDER BY avg_water DESC;',
    },
  },
];

export default lessons;
