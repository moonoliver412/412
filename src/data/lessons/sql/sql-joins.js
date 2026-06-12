// Topic: Joining Tables (sql-joins) — 5 lessons.

const lessons = [
  {
    id: 'sql-joins-1',
    blocks: [
      {
        type: 'p',
        text: 'Real databases split data across multiple tables. A JOIN combines rows from two tables by matching a shared value.',
      },
      {
        type: 'p',
        text: 'The most common join is INNER JOIN. It returns rows where both tables have a match.',
      },
      {
        type: 'code',
        text: 'SELECT trees.name, plots.location\nFROM trees\nINNER JOIN plots ON trees.plot_id = plots.id;',
      },
      {
        type: 'tip',
        text: 'ON tells SQL which columns to match between the two tables.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE plots (id INTEGER, location TEXT);\nINSERT INTO plots VALUES (1, \'North Garden\'), (2, \'South Meadow\'), (3, \'East Hill\');\nCREATE TABLE trees (id INTEGER, name TEXT, plot_id INTEGER);\nINSERT INTO trees VALUES (1, \'Oak\', 1), (2, \'Pine\', 2), (3, \'Birch\', 1);',
      instructions: 'Join trees to plots and select tree name and plot location.',
      starter: 'SELECT trees.name, plots.location\nFROM trees\nINNER JOIN plots ON ',
      checks: [
        {
          type: 'queryRowCount',
          count: 3,
          label: 'All three trees are joined to their plots',
        },
        {
          type: 'queryReturns',
          rows: [['Oak', 'North Garden'], ['Pine', 'South Meadow']],
          label: 'Oak is in North Garden and Pine is in South Meadow',
        },
      ],
      hints: [
        'Match trees.plot_id to plots.id in the ON clause.',
        'ON trees.plot_id = plots.id',
      ],
      solution: 'SELECT trees.name, plots.location\nFROM trees\nINNER JOIN plots ON trees.plot_id = plots.id;',
    },
  },
  {
    id: 'sql-joins-2',
    blocks: [
      {
        type: 'p',
        text: 'When two tables have a column with the same name, you need to say which table it comes from.',
      },
      {
        type: 'p',
        text: 'Write table.column — the table name, a dot, then the column name.',
      },
      {
        type: 'code',
        text: 'SELECT trees.id, trees.name, plots.location\nFROM trees\nINNER JOIN plots ON trees.plot_id = plots.id;',
      },
      {
        type: 'tip',
        text: 'It is good practice to always prefix column names with the table name in a JOIN query.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE plots (id INTEGER, location TEXT, soil TEXT);\nINSERT INTO plots VALUES (1, \'North Garden\', \'loam\'), (2, \'South Meadow\', \'clay\');\nCREATE TABLE trees (id INTEGER, name TEXT, height INTEGER, plot_id INTEGER);\nINSERT INTO trees VALUES (1, \'Oak\', 20, 1), (2, \'Pine\', 15, 2), (3, \'Birch\', 12, 1);',
      instructions: 'Select trees.name, trees.height, and plots.soil from the joined tables.',
      starter: 'SELECT trees.name, trees.height, plots.soil\nFROM trees\nINNER JOIN plots ON ',
      checks: [
        {
          type: 'queryHasColumns',
          columns: ['name', 'height', 'soil'],
          label: 'name, height, and soil columns are present',
        },
        {
          type: 'queryRowCount',
          count: 3,
          label: 'All three trees are returned',
        },
        {
          type: 'queryReturns',
          rows: [['Oak', '20', 'loam']],
          label: 'Oak is on loam soil',
        },
      ],
      hints: [
        'Match trees.plot_id to plots.id.',
        'SELECT trees.name, trees.height, plots.soil FROM trees INNER JOIN plots ON trees.plot_id = plots.id;',
      ],
      solution: 'SELECT trees.name, trees.height, plots.soil\nFROM trees\nINNER JOIN plots ON trees.plot_id = plots.id;',
    },
  },
  {
    id: 'sql-joins-3',
    blocks: [
      {
        type: 'p',
        text: 'Table aliases shorten your query. Give a table a short nickname with AS.',
      },
      {
        type: 'code',
        text: 'SELECT t.name, p.location\nFROM trees AS t\nINNER JOIN plots AS p ON t.plot_id = p.id;',
      },
      {
        type: 'p',
        text: 'Once you set an alias, use it everywhere in that query.',
      },
      {
        type: 'tip',
        text: 'You can also drop the AS keyword: FROM trees t works too.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE plots (id INTEGER, location TEXT);\nINSERT INTO plots VALUES (1, \'North Garden\'), (2, \'South Meadow\'), (3, \'East Hill\');\nCREATE TABLE trees (id INTEGER, name TEXT, height INTEGER, plot_id INTEGER);\nINSERT INTO trees VALUES (1, \'Oak\', 20, 1), (2, \'Pine\', 15, 2), (3, \'Birch\', 12, 3), (4, \'Maple\', 18, 1);',
      instructions: 'Using table aliases t and p, select t.name and p.location for trees taller than 14.',
      starter: 'SELECT t.name, p.location\nFROM trees AS t\nINNER JOIN plots AS p ON ',
      checks: [
        {
          type: 'queryRowCount',
          count: 3,
          label: 'Three trees taller than 14 are returned',
        },
        {
          type: 'queryReturns',
          rows: [['Oak', 'North Garden']],
          label: 'Oak in North Garden is included',
        },
      ],
      hints: [
        'Match t.plot_id = p.id, then add WHERE t.height > 14.',
        'ON t.plot_id = p.id WHERE t.height > 14',
      ],
      solution: 'SELECT t.name, p.location\nFROM trees AS t\nINNER JOIN plots AS p ON t.plot_id = p.id\nWHERE t.height > 14;',
    },
  },
  {
    id: 'sql-joins-4',
    blocks: [
      {
        type: 'p',
        text: 'LEFT JOIN returns all rows from the left table, even if there is no match in the right table. Missing right-side values show up as NULL.',
      },
      {
        type: 'code',
        text: 'SELECT t.name, p.location\nFROM trees AS t\nLEFT JOIN plots AS p ON t.plot_id = p.id;',
      },
      {
        type: 'p',
        text: 'Use LEFT JOIN when you want to keep rows that have no related data yet.',
      },
      {
        type: 'tip',
        text: 'INNER JOIN drops unmatched rows. LEFT JOIN keeps them with NULLs.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE plots (id INTEGER, location TEXT);\nINSERT INTO plots VALUES (1, \'North Garden\'), (2, \'South Meadow\');\nCREATE TABLE trees (id INTEGER, name TEXT, plot_id INTEGER);\nINSERT INTO trees VALUES (1, \'Oak\', 1), (2, \'Pine\', 2), (3, \'Birch\', NULL);',
      instructions: 'Use a LEFT JOIN to select all tree names and their plot location. Trees with no plot should still appear.',
      starter: 'SELECT t.name, p.location\nFROM trees AS t\n',
      checks: [
        {
          type: 'queryRowCount',
          count: 3,
          label: 'All three trees appear (including Birch with no plot)',
        },
        {
          type: 'queryReturns',
          rows: [['Oak', 'North Garden']],
          label: 'Oak is matched to North Garden',
        },
      ],
      hints: [
        'Use LEFT JOIN instead of INNER JOIN.',
        'LEFT JOIN plots AS p ON t.plot_id = p.id',
      ],
      solution: 'SELECT t.name, p.location\nFROM trees AS t\nLEFT JOIN plots AS p ON t.plot_id = p.id;',
    },
  },
  {
    id: 'sql-joins-5',
    blocks: [
      {
        type: 'p',
        text: 'You can join more than two tables. Just add another JOIN clause for each extra table.',
      },
      {
        type: 'code',
        text: 'SELECT t.name, p.location, g.gardener\nFROM trees AS t\nINNER JOIN plots AS p ON t.plot_id = p.id\nINNER JOIN gardens AS g ON p.garden_id = g.id;',
      },
      {
        type: 'p',
        text: 'Capstone: join two tables, filter with WHERE, and sort the results.',
      },
      {
        type: 'tip',
        text: 'Always double-check your ON conditions — a wrong match creates duplicate or missing rows.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE plots (id INTEGER, location TEXT, zone TEXT);\nINSERT INTO plots VALUES (1, \'North Garden\', \'A\'), (2, \'South Meadow\', \'B\'), (3, \'East Hill\', \'A\');\nCREATE TABLE trees (id INTEGER, name TEXT, height INTEGER, plot_id INTEGER);\nINSERT INTO trees VALUES (1, \'Oak\', 20, 1), (2, \'Pine\', 15, 2), (3, \'Birch\', 12, 3), (4, \'Maple\', 18, 1), (5, \'Cedar\', 22, 3);',
      instructions: "Join trees to plots, select tree name and plot location, filter to zone 'A' only, ordered by tree height descending.",
      starter: 'SELECT t.name, p.location\nFROM trees AS t\nINNER JOIN plots AS p ON t.plot_id = p.id\n',
      checks: [
        {
          type: 'queryRowCount',
          count: 4,
          label: 'Four trees are in zone A',
        },
        {
          type: 'queryReturns',
          rows: [['Cedar', 'East Hill']],
          label: 'Cedar in East Hill appears in results',
        },
        {
          type: 'queryReturns',
          rows: [['Cedar', 'East Hill'], ['Oak', 'North Garden']],
          label: 'Results include zone A trees only',
        },
      ],
      hints: [
        "Add WHERE p.zone = 'A' after the JOIN.",
        "End with ORDER BY t.height DESC.",
      ],
      solution: "SELECT t.name, p.location\nFROM trees AS t\nINNER JOIN plots AS p ON t.plot_id = p.id\nWHERE p.zone = 'A'\nORDER BY t.height DESC;",
    },
  },
];

export default lessons;
