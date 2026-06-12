// Topic: Tables & Lists (html-tables-lists) — 5 lessons.

const lessons = [
  {
    id: 'html-tables-lists-1',
    blocks: [
      {
        type: 'p',
        text: 'Sometimes a paragraph tries to say "first… second… third…". HTML has a better tool: a list. There are two kinds. An unordered list (<ul>) gets bullet points — use it when order does not matter. An ordered list (<ol>) gets numbers — use it when order does matter, like steps in a recipe.',
      },
      {
        type: 'code',
        text: '<ul>\n  <li>Trowel</li>\n  <li>Gloves</li>\n</ul>\n<ol>\n  <li>Dig hole</li>\n  <li>Insert tree</li>\n</ol>',
      },
      {
        type: 'p',
        text: 'Both kinds hold the same thing inside: <li> elements, one per list item. The only direct children a <ul> or <ol> should have are <li>s. Swap the wrapper from <ul> to <ol> and bullets become numbers. The items themselves never change.',
      },
      {
        type: 'tip',
        text: 'The browser numbers an <ol> for you. Add, remove, or reorder items and the numbers fix themselves. Never type "1." by hand.',
      },
    ],
    exercise: {
      instructions:
        'Make a shopping list for the garden shed: a <ul> with at least three <li> items (tools, seeds, snacks — your call).',
      hints: [
        'A <ul> creates a bullet-point list. Every item inside it must be wrapped in an <li> element.',
        'Add <ul> with at least three <li> items inside it, like <li>Trowel</li>, <li>Seeds</li>, <li>Gloves</li>.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Shed shopping</h1>\n    <ul>\n      <li>Trowel</li>\n      <li>Seeds</li>\n      <li>Gloves</li>\n    </ul>\n\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Shed shopping</h1>\n    <!-- your bullet points go here -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'ul li',
          label: 'A <ul> holds your items',
          hint: 'Add a <ul> element with at least one <li> inside it.',
        },
        {
          type: 'selectorExists',
          selector: 'ul li:nth-of-type(3)',
          label: 'The list has at least three items',
          hint: 'Your <ul> needs at least three <li> items.',
        },
      ],
    },
  },
  {
    id: 'html-tables-lists-2',
    blocks: [
      {
        type: 'p',
        text: 'There is a third list type made for pairs: the definition list, <dl>. Instead of <li>, it uses two elements. <dt> holds the term. <dd> holds the description. Use it for glossaries, FAQs, or any name-and-value data like "Author: Robin Moss".',
      },
      {
        type: 'code',
        text: '<dl>\n  <dt>Loam</dt>\n  <dd>Rich soil that trees adore.</dd>\n  <dt>Mulch</dt>\n  <dd>A cozy blanket for roots.</dd>\n</dl>',
      },
      {
        type: 'p',
        text: 'Think of it as a rhythm: term, description, term, description. A term can have several <dd>s when one description is not enough. Browsers indent each <dd> under its <dt>, so the pairing is easy to see.',
      },
      {
        type: 'tip',
        text: 'Memory trick: dt = definition term, dd = definition description. The <dt> is the bold word in a dictionary. The <dd> is everything after it.',
      },
    ],
    exercise: {
      instructions:
        'Build a tiny garden glossary: a <dl> with two terms — add a <dt> and a matching <dd> for "Compost", then a second <dt> and <dd> for "Seedling".',
      hints: [
        'A <dl> is a definition list. Each entry needs a <dt> (the term) followed by a <dd> (the description).',
        'Write <dl><dt>Compost</dt><dd>Decomposed organic matter.</dd><dt>Seedling</dt><dd>A young plant.</dd></dl>.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Garden glossary</h1>\n    <dl>\n      <dt>Compost</dt>\n      <dd>Decomposed organic matter used to enrich soil.</dd>\n      <dt>Seedling</dt>\n      <dd>A young plant grown from seed.</dd>\n    </dl>\n\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Garden glossary</h1>\n    <!-- term, description, term, description -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'dl dt',
          label: 'Your <dl> contains a term (<dt>)',
          hint: 'Add a <dl> element with at least one <dt> inside it.',
        },
        {
          type: 'selectorExists',
          selector: 'dl dt:nth-of-type(2)',
          label: 'There are at least two terms',
          hint: 'Add two <dt> elements — one for Compost and one for Seedling.',
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
        text: 'When data has rows and columns — scores, schedules, prices — it belongs in a <table>. You build one from the outside in. <table> wraps everything. Each <tr> is a table row. Each <td> inside a row is one data cell.',
      },
      {
        type: 'code',
        text: '<table>\n  <tr>\n    <td>Fern</td>\n    <td>14 days</td>\n  </tr>\n  <tr>\n    <td>Bamboo</td>\n    <td>5 days</td>\n  </tr>\n</table>',
      },
      {
        type: 'p',
        text: 'There is no "column" element. Columns appear when every row has the same number of cells. Two <td>s per row means two columns. Keep the counts matching and the grid lines up. Let one row run long and the table breaks.',
      },
      {
        type: 'tip',
        text: 'Tables are for data, not page layout. If you want to position a sidebar with a table, wait until you meet CSS — it has better tools for that.',
      },
    ],
    exercise: {
      instructions:
        'Chart how fast seeds sprout: build a <table> with two rows, where each row has two <td> cells — a plant name and its days to sprout.',
      hints: [
        'A table is built from the outside in: <table> wraps everything, <tr> is a row, and <td> is one cell inside a row.',
        'Add <table> with two <tr> rows. Each row needs two <td> cells — the plant name in the first, the number of days in the second.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Days to sprout</h1>\n    <table>\n      <tr>\n        <td>Fern</td>\n        <td>14 days</td>\n      </tr>\n      <tr>\n        <td>Bamboo</td>\n        <td>5 days</td>\n      </tr>\n    </table>\n\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Days to sprout</h1>\n    <!-- rows of cells go here -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'table tr',
          label: 'Your <table> has a row',
          hint: 'Add a <table> element with at least one <tr> inside it.',
        },
        {
          type: 'selectorExists',
          selector: 'table tr:nth-of-type(2)',
          label: 'There are at least two rows',
          hint: 'Add a second <tr> row to your <table>.',
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
        text: 'A grid of bare numbers is hard to read. Three additions turn it into clear information. First, <th> — a table-header cell. Use it instead of <td> to label a column or row. Browsers make <th> bold and centered, and screen readers read them out with every cell.',
      },
      {
        type: 'p',
        text: 'Second, <caption>: a title for the whole table. Write it as the first element inside <table>. Third, when one cell needs to stretch across several columns or rows, add a colspan or rowspan attribute with the number to span.',
      },
      {
        type: 'code',
        text: '<table>\n  <caption>Watering schedule</caption>\n  <tr>\n    <th>Plant</th>\n    <th>Times per week</th>\n  </tr>\n  <tr>\n    <td colspan="2">…</td>\n  </tr>\n</table>',
      },
      {
        type: 'tip',
        text: 'If a spanned table looks scrambled, count cells. A colspan="2" cell takes the space of two. Its row needs one fewer cell than the others.',
      },
    ],
    exercise: {
      instructions:
        'Upgrade this table: add a <caption> that says "Watering schedule" as the first thing inside the <table>, and change the two <td>s in the first row into <th> header cells.',
      hints: [
        '<caption> is a title for the whole table — write it as the very first element inside <table>. <th> is a header cell — use it instead of <td> to label columns.',
        'Add <caption>Watering schedule</caption> before the first <tr>, then change <td>Plant</td> to <th>Plant</th> and <td>Times per week</td> to <th>Times per week</th>.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <table>\n      <caption>Watering schedule</caption>\n      <tr>\n        <th>Plant</th>\n        <th>Times per week</th>\n      </tr>\n      <tr>\n        <td>Fern</td>\n        <td>3</td>\n      </tr>\n      <tr>\n        <td>Cactus</td>\n        <td>1</td>\n      </tr>\n    </table>\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <table>\n      <tr>\n        <td>Plant</td>\n        <td>Times per week</td>\n      </tr>\n      <tr>\n        <td>Fern</td>\n        <td>3</td>\n      </tr>\n      <tr>\n        <td>Cactus</td>\n        <td>1</td>\n      </tr>\n    </table>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'table caption',
          label: 'The table has a <caption>',
          hint: 'Add a <caption> element as the first child of <table>.',
        },
        {
          type: 'textIncludes',
          text: 'watering',
          selector: 'caption',
          label: 'The caption mentions watering',
          hint: 'Your <caption> text needs to include the word "watering".',
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
        text: 'Project time: a pricing table — the kind every product site has. Real tables organize their rows into three named sections. <thead> holds the header row. <tbody> holds the data. <tfoot> holds a closing row like a total or footnote. Each section just wraps <tr>s.',
      },
      {
        type: 'code',
        text: '<table>\n  <caption>Plans</caption>\n  <thead>\n    <tr><th>Plan</th><th>Price</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Seed</td><td>$0</td></tr>\n  </tbody>\n  <tfoot>…</tfoot>\n</table>',
      },
      {
        type: 'p',
        text: 'Build one for a sapling-delivery service. Add a caption, a header row with <th>s for plan and price, at least two plans in the body, and a <tfoot> row with a short note (try "All prices in acorns"). Structure first, style later.',
      },
      {
        type: 'tip',
        text: 'Keep the order: caption → thead → tbody → tfoot. The browser is flexible, but anyone reading your code later will thank you for it.',
      },
    ],
    exercise: {
      instructions:
        'Build the pricing table inside <main>: a <caption>, a <thead> whose row has two <th>s (Plan, Price), a <tbody> with at least two rows of plans, and a <tfoot> with a row containing a note cell.',
      hints: [
        'A full table has four parts in order: <caption>, <thead> (header rows), <tbody> (data rows), and <tfoot> (closing row).',
        'Inside <thead>, add a <tr> with two <th> cells. Inside <tbody>, add at least two <tr> rows with <td> cells. Inside <tfoot>, add one <tr> with a <td> note.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <main>\n      <h1>Sapling Subscriptions</h1>\n      <table>\n        <caption>Plans</caption>\n        <thead>\n          <tr><th>Plan</th><th>Price</th></tr>\n        </thead>\n        <tbody>\n          <tr><td>Seed</td><td>$0</td></tr>\n          <tr><td>Sprout</td><td>$5</td></tr>\n        </tbody>\n        <tfoot>\n          <tr><td colspan="2">All prices in acorns.</td></tr>\n        </tfoot>\n      </table>\n    </main>\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <main>\n      <h1>Sapling Subscriptions</h1>\n      <table>\n        <!-- caption, thead, tbody, tfoot -->\n\n      </table>\n    </main>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'table caption',
          label: 'The table introduces itself with a <caption>',
          hint: 'Add a <caption> as the first element inside <table>.',
        },
        {
          type: 'selectorExists',
          selector: 'thead th:nth-of-type(2)',
          label: 'A <thead> row labels both columns with <th>s',
          hint: 'Your <thead> row needs two <th> header cells.',
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
