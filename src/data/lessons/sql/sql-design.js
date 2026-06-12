// Topic: Designing Tables (sql-design) — 5 lessons.

const lessons = [
  {
    id: 'sql-design-1',
    blocks: [
      {
        type: 'p',
        text: 'Before you can store data, you have to create a table. CREATE TABLE defines the columns and their data types.',
      },
      {
        type: 'code',
        text: 'CREATE TABLE trees (\n  id INTEGER,\n  name TEXT,\n  height INTEGER\n);',
      },
      {
        type: 'p',
        text: 'Each column gets a name and a type. Common types are INTEGER (whole numbers), TEXT (strings), and REAL (decimals).',
      },
      {
        type: 'tip',
        text: 'Column definitions are separated by commas. The last one has no comma.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: '',
      instructions: "Create a table called gardens with columns: id (INTEGER), name (TEXT), and size (REAL).",
      starter: 'CREATE TABLE gardens (\n  ',
      checks: [
        {
          type: 'verifyRowCount',
          query: 'SELECT * FROM gardens',
          count: 0,
          label: 'gardens table exists and is empty',
        },
        {
          type: 'sourceIncludes',
          text: 'CREATE TABLE',
          label: 'Query uses CREATE TABLE',
        },
      ],
      hints: [
        'List all three columns separated by commas.',
        'CREATE TABLE gardens (id INTEGER, name TEXT, size REAL);',
      ],
      solution: 'CREATE TABLE gardens (\n  id INTEGER,\n  name TEXT,\n  size REAL\n);',
    },
  },
  {
    id: 'sql-design-2',
    blocks: [
      {
        type: 'p',
        text: 'PRIMARY KEY marks a column as the unique ID for each row. No two rows can share the same primary key value.',
      },
      {
        type: 'code',
        text: 'CREATE TABLE trees (\n  id INTEGER PRIMARY KEY,\n  name TEXT,\n  height INTEGER\n);',
      },
      {
        type: 'p',
        text: 'NOT NULL means a column must have a value — you cannot leave it blank.',
      },
      {
        type: 'tip',
        text: 'Put constraints like PRIMARY KEY and NOT NULL right after the column type.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: '',
      instructions: "Create a table called plants with: id INTEGER PRIMARY KEY, name TEXT NOT NULL, and type TEXT.",
      starter: 'CREATE TABLE plants (\n  ',
      checks: [
        {
          type: 'verifyRowCount',
          query: 'SELECT * FROM plants',
          count: 0,
          label: 'plants table was created',
        },
        {
          type: 'sourceIncludes',
          text: 'PRIMARY KEY',
          label: 'PRIMARY KEY constraint is present',
        },
        {
          type: 'sourceIncludes',
          text: 'NOT NULL',
          label: 'NOT NULL constraint is present',
        },
      ],
      hints: [
        'Add PRIMARY KEY after INTEGER for the id column.',
        'Add NOT NULL after TEXT for the name column.',
      ],
      solution: 'CREATE TABLE plants (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  type TEXT\n);',
    },
  },
  {
    id: 'sql-design-3',
    blocks: [
      {
        type: 'p',
        text: 'DEFAULT gives a column a value when you do not provide one.',
      },
      {
        type: 'code',
        text: "CREATE TABLE trees (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  status TEXT DEFAULT 'healthy'\n);",
      },
      {
        type: 'p',
        text: "If you insert a row without setting status, it will be 'healthy' automatically.",
      },
      {
        type: 'tip',
        text: 'DEFAULT values save you from writing the same value over and over in your INSERT statements.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: '',
      instructions: "Create a table called plots with: id INTEGER PRIMARY KEY, location TEXT NOT NULL, and zone TEXT DEFAULT 'A'.",
      starter: 'CREATE TABLE plots (\n  ',
      checks: [
        {
          type: 'verifyRowCount',
          query: 'SELECT * FROM plots',
          count: 0,
          label: 'plots table was created',
        },
        {
          type: 'sourceIncludes',
          text: 'DEFAULT',
          label: 'DEFAULT constraint is present',
        },
        {
          type: 'sourceIncludes',
          text: 'NOT NULL',
          label: 'NOT NULL constraint is present',
        },
      ],
      hints: [
        "Add DEFAULT 'A' at the end of the zone column definition.",
        "CREATE TABLE plots (id INTEGER PRIMARY KEY, location TEXT NOT NULL, zone TEXT DEFAULT 'A');",
      ],
      solution: "CREATE TABLE plots (\n  id INTEGER PRIMARY KEY,\n  location TEXT NOT NULL,\n  zone TEXT DEFAULT 'A'\n);",
    },
  },
  {
    id: 'sql-design-4',
    blocks: [
      {
        type: 'p',
        text: 'A FOREIGN KEY links a column in one table to the primary key of another table. This keeps related data connected.',
      },
      {
        type: 'code',
        text: 'CREATE TABLE trees (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  plot_id INTEGER,\n  FOREIGN KEY (plot_id) REFERENCES plots(id)\n);',
      },
      {
        type: 'p',
        text: 'The FOREIGN KEY line goes at the end of the column list, after all column definitions.',
      },
      {
        type: 'tip',
        text: 'Foreign keys are how you model relationships — one plot can have many trees.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: 'CREATE TABLE gardens (id INTEGER PRIMARY KEY, name TEXT);',
      instructions: "Create a table called plots with: id INTEGER PRIMARY KEY, location TEXT NOT NULL, garden_id INTEGER, and a FOREIGN KEY on garden_id referencing gardens(id).",
      starter: 'CREATE TABLE plots (\n  id INTEGER PRIMARY KEY,\n  location TEXT NOT NULL,\n  ',
      checks: [
        {
          type: 'verifyRowCount',
          query: 'SELECT * FROM plots',
          count: 0,
          label: 'plots table was created',
        },
        {
          type: 'sourceIncludes',
          text: 'FOREIGN KEY',
          label: 'FOREIGN KEY constraint is present',
        },
        {
          type: 'sourceIncludes',
          text: 'REFERENCES gardens',
          label: 'REFERENCES points to the gardens table',
        },
      ],
      hints: [
        'Add a garden_id INTEGER column first.',
        'Then add FOREIGN KEY (garden_id) REFERENCES gardens(id) as the last item.',
      ],
      solution: 'CREATE TABLE plots (\n  id INTEGER PRIMARY KEY,\n  location TEXT NOT NULL,\n  garden_id INTEGER,\n  FOREIGN KEY (garden_id) REFERENCES gardens(id)\n);',
    },
  },
  {
    id: 'sql-design-5',
    blocks: [
      {
        type: 'p',
        text: 'Good table design is about choosing the right columns, types, and constraints from the start.',
      },
      {
        type: 'p',
        text: 'Capstone: design two related tables from scratch — a parent table and a child table that references it.',
      },
      {
        type: 'tip',
        text: 'Create the parent table first. The child table references it, so the parent must exist.',
      },
    ],
    exercise: {
      kind: 'sql',
      seed: '',
      instructions: "Design two tables: gardens (id INTEGER PRIMARY KEY, name TEXT NOT NULL) and trees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, height INTEGER DEFAULT 0, garden_id INTEGER, FOREIGN KEY (garden_id) REFERENCES gardens(id)). Create both, then insert one garden and two trees that belong to it.",
      starter: 'CREATE TABLE gardens (\n  ',
      checks: [
        {
          type: 'verifyRowCount',
          query: 'SELECT * FROM gardens',
          count: 1,
          label: 'One garden was inserted',
        },
        {
          type: 'verifyRowCount',
          query: 'SELECT * FROM trees',
          count: 2,
          label: 'Two trees were inserted',
        },
        {
          type: 'sourceIncludes',
          text: 'FOREIGN KEY',
          label: 'trees table has a FOREIGN KEY',
        },
      ],
      hints: [
        'Create gardens first, then trees (with the FOREIGN KEY).',
        "INSERT INTO gardens VALUES (1, 'North Garden'); then insert two trees with garden_id = 1.",
      ],
      solution: "CREATE TABLE gardens (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL\n);\nCREATE TABLE trees (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  height INTEGER DEFAULT 0,\n  garden_id INTEGER,\n  FOREIGN KEY (garden_id) REFERENCES gardens(id)\n);\nINSERT INTO gardens VALUES (1, 'North Garden');\nINSERT INTO trees (id, name, height, garden_id) VALUES (1, 'Oak', 20, 1), (2, 'Pine', 15, 1);",
    },
  },
];

export default lessons;
