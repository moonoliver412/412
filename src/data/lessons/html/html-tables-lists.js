// Topic: Tables & Lists (html-tables-lists) — 5 lessons.

const lessons = [
  {
    id: 'html-tables-lists-1',
    blocks: [
      {
        type: 'p',
        text: 'Whenever you catch yourself writing "first… second… third…" in a paragraph, HTML has a better tool: a list. There are two kinds. An unordered list, <ul>, gets bullet points — use it when the order does not matter. An ordered list, <ol>, gets numbers — use it when it does, like steps in a recipe.',
      },
      {
        type: 'code',
        text: '<ul>\n  <li>Trowel</li>\n  <li>Gloves</li>\n</ul>\n<ol>\n  <li>Dig hole</li>\n  <li>Insert tree</li>\n</ol>',
      },
      {
        type: 'p',
        text: 'Both kinds hold the same thing inside: <li> elements, one per list item. The only direct children a <ul> or <ol> should have are <li>s — no stray paragraphs floating between them. Swap the wrapper from <ul> to <ol> and the bullets become numbers; the items themselves never change.',
      },
      {
        type: 'tip',
        text: 'The browser does the numbering for an <ol> automatically. Add, remove, or reorder items and the numbers fix themselves — never type "1." by hand.',
      },
    ],
    exercise: {
      instructions:
        'Make a shopping list for the garden shed: a <ul> with at least three <li> items (tools, seeds, snacks — your call).',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Shed shopping</h1>\n    <!-- your bullet points go here -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'ul li',
          label: 'A <ul> holds your items',
        },
        {
          type: 'selectorExists',
          selector: 'ul li:nth-of-type(3)',
          label: 'The list has at least three items',
        },
      ],
    },
  },
  {
    id: 'html-tables-lists-2',
    blocks: [
      {
        type: 'p',
        text: 'There is a third, lesser-known list made for pairs: the definition list, <dl>. Instead of <li>, it alternates two elements — <dt>, the term, and <dd>, the description of that term. It is perfect for glossaries, FAQs, or any name-and-value data like "Author: Robin Moss".',
      },
      {
        type: 'code',
        text: '<dl>\n  <dt>Loam</dt>\n  <dd>Rich soil that trees adore.</dd>\n  <dt>Mulch</dt>\n  <dd>A cozy blanket for roots.</dd>\n</dl>',
      },
      {
        type: 'p',
        text: 'Read it as a rhythm: term, description, term, description. A term may even have several <dd>s when one definition is not enough. Browsers indent each <dd> beneath its <dt>, so the pairing is visible at a glance.',
      },
      {
        type: 'tip',
        text: 'Mnemonic: dt = definition term, dd = definition description. The <dt> is the word in bold in a dictionary; the <dd> is everything after it.',
      },
    ],
    exercise: {
      instructions:
        'Build a tiny garden glossary: a <dl> with two terms — add a <dt> and a matching <dd> for "Compost", then a second <dt> and <dd> for "Seedling".',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Garden glossary</h1>\n    <!-- term, description, term, description -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'dl dt',
          label: 'Your <dl> contains a term (<dt>)',
        },
        {
          type: 'selectorExists',
          selector: 'dl dt:nth-of-type(2)',
          label: 'There are at least two terms',
        },
        {
          type: 'selectorExists',
          selector: 'dl dd:nth-of-type(2)',
          label: 'Each term has its description (<dd>)',
        },
      ],
    },
  },
  {
    id: 'html-tables-lists-3',
    blocks: [
      {
        type: 'p',
        text: 'When data has rows and columns — scores, schedules, prices — it belongs in a <table>. You build one from the outside in: the <table> wraps everything, each <tr> is a table row, and each <td> inside a row is one table-data cell.',
      },
      {
        type: 'code',
        text: '<table>\n  <tr>\n    <td>Fern</td>\n    <td>14 days</td>\n  </tr>\n  <tr>\n    <td>Bamboo</td>\n    <td>5 days</td>\n  </tr>\n</table>',
      },
      {
        type: 'p',
        text: 'Notice there is no "column" element — columns simply emerge when every row has the same number of cells. Two <td>s per row means two columns. Keep the counts matching and the grid lines up; let one row run long and the table goes wonky.',
      },
      {
        type: 'tip',
        text: 'Tables are for data, not page layout. If you are tempted to position a sidebar with a table, hold that thought until you meet CSS.',
      },
    ],
    exercise: {
      instructions:
        'Chart how fast seeds sprout: build a <table> with two rows, where each row has two <td> cells — a plant name and its days to sprout.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Days to sprout</h1>\n    <!-- rows of cells go here -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'table tr',
          label: 'Your <table> has a row',
        },
        {
          type: 'selectorExists',
          selector: 'table tr:nth-of-type(2)',
          label: 'There are at least two rows',
        },
        {
          type: 'selectorExists',
          selector: 'tr td:nth-of-type(2)',
          label: 'Rows have two cells (two columns)',
        },
      ],
    },
  },
  {
    id: 'html-tables-lists-4',
    blocks: [
      {
        type: 'p',
        text: 'A grid of bare numbers is a puzzle. Three additions turn it into information. First, <th> — a table-header cell. Use it instead of <td> for the cells that label a column or row; browsers make them bold and centered, and screen readers announce them with every cell.',
      },
      {
        type: 'p',
        text: 'Second, <caption>: a title for the whole table, written as the first element inside <table>. Third, when one cell needs to stretch across several columns or rows, give it a colspan or rowspan attribute with the number to span.',
      },
      {
        type: 'code',
        text: '<table>\n  <caption>Watering schedule</caption>\n  <tr>\n    <th>Plant</th>\n    <th>Times per week</th>\n  </tr>\n  <tr>\n    <td colspan="2">…</td>\n  </tr>\n</table>',
      },
      {
        type: 'tip',
        text: 'If a spanned table looks scrambled, count cells: a colspan="2" cell takes the seat of two — its row needs one fewer cell than the others.',
      },
    ],
    exercise: {
      instructions:
        'Upgrade this table: add a <caption> that says "Watering schedule" as the first thing inside the <table>, and change the two <td>s in the first row into <th> header cells.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <table>\n      <tr>\n        <td>Plant</td>\n        <td>Times per week</td>\n      </tr>\n      <tr>\n        <td>Fern</td>\n        <td>3</td>\n      </tr>\n      <tr>\n        <td>Cactus</td>\n        <td>1</td>\n      </tr>\n    </table>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'table caption',
          label: 'The table has a <caption>',
        },
        {
          type: 'textIncludes',
          text: 'watering',
          selector: 'caption',
          label: 'The caption mentions watering',
        },
        {
          type: 'selectorExists',
          selector: 'tr th:nth-of-type(2)',
          label: 'The first row uses <th> header cells',
        },
      ],
    },
  },
  {
    id: 'html-tables-lists-5',
    blocks: [
      {
        type: 'p',
        text: 'Project time: a pricing table, the kind every product site has. Real-world tables organize their rows into three named regions: <thead> for the header row, <tbody> for the data, and <tfoot> for a closing row like a total or a footnote. Each one simply wraps <tr>s.',
      },
      {
        type: 'code',
        text: '<table>\n  <caption>Plans</caption>\n  <thead>\n    <tr><th>Plan</th><th>Price</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Seed</td><td>$0</td></tr>\n  </tbody>\n  <tfoot>…</tfoot>\n</table>',
      },
      {
        type: 'p',
        text: 'Build yours for a sapling-delivery service: a caption naming the table, a header row with <th>s for the plan and the price, at least two plans in the body, and a <tfoot> row with a note (say, "All prices in acorns"). Structure first, beauty later.',
      },
      {
        type: 'tip',
        text: 'Keep the order caption → thead → tbody → tfoot. The browser is forgiving, but future-you reading the code will not be.',
      },
    ],
    exercise: {
      instructions:
        'Build the pricing table inside <main>: a <caption>, a <thead> whose row has two <th>s (Plan, Price), a <tbody> with at least two rows of plans, and a <tfoot> with a row containing a note cell.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <main>\n      <h1>Sapling Subscriptions</h1>\n      <table>\n        <!-- caption, thead, tbody, tfoot -->\n\n      </table>\n    </main>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'table caption',
          label: 'The table introduces itself with a <caption>',
        },
        {
          type: 'selectorExists',
          selector: 'thead th:nth-of-type(2)',
          label: 'A <thead> row labels both columns with <th>s',
        },
        {
          type: 'selectorExists',
          selector: 'tbody tr:nth-of-type(2)',
          label: 'The <tbody> lists at least two plans',
        },
        {
          type: 'selectorExists',
          selector: 'tfoot td',
          label: 'A <tfoot> row closes the table',
        },
      ],
    },
  },
];

export default lessons;
