// Topic: DOM & Events (js-dom) — 5 lessons.

const lessons = [
  {
    id: 'js-dom-1',
    blocks: [
      {
        type: 'p',
        text: 'When a browser loads a page it builds a tree of objects from the HTML — one object per element. This tree is called the Document Object Model, or DOM. JavaScript can reach into that tree, find any element, and read or change it.',
      },
      {
        type: 'p',
        text: 'The two most useful selection methods are document.querySelector() and document.querySelectorAll(). Both take the same CSS selectors you already know. querySelector returns the first matching element (or null); querySelectorAll returns a NodeList of all matches.',
      },
      {
        type: 'code',
        text: 'const title = document.querySelector("#title");\nconsole.log(title.textContent); // reads the text\n\nconst items = document.querySelectorAll(".leaf");\nconsole.log(items.length); // number of .leaf elements',
      },
      {
        type: 'tip',
        text: 'Always check that querySelector did not return null before touching the element. If the selector matched nothing and you try to read .textContent on null, JavaScript throws a TypeError — a very common beginner mistake.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Select the element with id "grove-title" and log its textContent. Then select all elements with class "leaf" and log how many there are.',
      starter:
        '// Select #grove-title and log its text\n// your code here\n\n// Select all .leaf elements and log the count\n// your code here\n',
      html: '<h2 id="grove-title">The Grove</h2>\n<ul>\n  <li class="leaf">Maple leaf</li>\n  <li class="leaf">Oak leaf</li>\n  <li class="leaf">Birch leaf</li>\n</ul>',
      checks: [
        {
          type: 'logIncludes',
          text: 'grove',
          label: 'The grove title text is logged',
        },
        {
          type: 'logIncludes',
          text: '3',
          label: 'The count of 3 leaf elements is logged',
        },
      ],
    },
  },
  {
    id: 'js-dom-2',
    blocks: [
      {
        type: 'p',
        text: 'Selecting an element is just the beginning — the real power is changing the page. You can rewrite an element\'s text, swap its class, change an attribute, or build entirely new elements and insert them into the tree.',
      },
      {
        type: 'code',
        text: 'const banner = document.querySelector("#banner");\nbanner.textContent = "New growth detected!";\nbanner.classList.add("highlight");\n\nconst li = document.createElement("li");\nli.textContent = "Cherry";\ndocument.querySelector("#grove").appendChild(li);',
      },
      {
        type: 'p',
        text: 'textContent sets text safely — any HTML characters in the string are treated as plain text, not markup. innerHTML sets raw HTML markup, which is powerful but must never be used with user-supplied content (it opens cross-site scripting holes). When in doubt, use textContent.',
      },
      {
        type: 'tip',
        text: 'classList is your friend: classList.add("x"), classList.remove("x"), classList.toggle("x"), and classList.contains("x") all do exactly what they say. Avoid setting className directly — it replaces all existing classes at once.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Change the textContent of #status to "Planted!". Then create a new <li> with text "Willow" and append it to the #grove list.',
      starter:
        '// Change the status text\n// your code here\n\n// Create a new li and append it\n// your code here\n',
      html: '<p id="status">Waiting…</p>\n<ul id="grove">\n  <li>Maple</li>\n  <li>Oak</li>\n</ul>',
      checks: [
        {
          type: 'textIncludes',
          text: 'planted',
          selector: '#status',
          label: '#status now says "Planted!"',
        },
        {
          type: 'selectorExists',
          selector: '#grove li',
          count: 3,
          label: 'A third item has been added to the grove list',
        },
        {
          type: 'textIncludes',
          text: 'willow',
          selector: '#grove',
          label: 'The new item says "Willow"',
        },
      ],
    },
  },
  {
    id: 'js-dom-3',
    blocks: [
      {
        type: 'p',
        text: 'A static page is a painting; an interactive page is a conversation. Events are how the browser tells your JavaScript that something happened — a click, a key press, a mouse movement. You register a listener with addEventListener and give it a callback.',
      },
      {
        type: 'code',
        text: 'const btn = document.querySelector("#plant-btn");\nbtn.addEventListener("click", function () {\n  document.querySelector("#message").textContent = "A new tree is planted!";\n});',
      },
      {
        type: 'p',
        text: 'The callback receives an event object (usually written e or event) with details about what happened — which key was pressed, where the mouse was, which element was clicked. event.target is the element that triggered the event, which lets one listener handle many elements.',
      },
      {
        type: 'tip',
        text: 'Use addEventListener, not the older onclick = ... style. The older style only allows one listener per element — addEventListener lets you attach as many as you need, and removeEventListener lets you clean them up.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Add a click listener to #plant-btn. When clicked, change the textContent of #output to "Seedling planted!" and add the class "active" to #plant-btn.',
      starter:
        '// Add a click listener to #plant-btn\n// your code here\n',
      html: '<button id="plant-btn">Plant</button>\n<p id="output">Waiting for action…</p>',
      checks: [
        {
          type: 'exprTruthy',
          expr: '(function(){ document.querySelector("#plant-btn").click(); return document.querySelector("#output").textContent.toLowerCase().includes("planted") || document.querySelector("#output").textContent.toLowerCase().includes("seedling"); })()',
          label: 'Clicking the button updates #output text',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ return document.querySelector("#plant-btn").classList.contains("active"); })()',
          label: 'The button gets the "active" class on click',
        },
      ],
    },
  },
  {
    id: 'js-dom-4',
    blocks: [
      {
        type: 'p',
        text: 'Forms are the most common place where JavaScript and the DOM meet: you read input values, validate them, and update the page in response. The input event fires every time the user changes a field; the submit event fires when they send the form.',
      },
      {
        type: 'code',
        text: 'const input = document.querySelector("#name-input");\nconst preview = document.querySelector("#preview");\n\ninput.addEventListener("input", (e) => {\n  preview.textContent = `Hello, ${e.target.value}!`;\n});',
      },
      {
        type: 'p',
        text: 'For forms, always call event.preventDefault() inside the submit listener — otherwise the browser tries to navigate the page, wiping your JavaScript state. Reading input.value gives the current text; setting input.value = "" clears the field.',
      },
      {
        type: 'tip',
        text: 'Keep your state (the data your app cares about) in JavaScript variables, not in the DOM. Read from the DOM into variables, process the variables, then write results back out. This direction — read → process → write — keeps code predictable.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Listen for the "input" event on #tree-input. Each time it fires, set the textContent of #tree-label to "Tree: " followed by the current input value.',
      starter:
        '// Listen to the input event on #tree-input\n// your code here\n',
      html: '<input id="tree-input" type="text" placeholder="Type a tree name…" />\n<p id="tree-label">Tree: </p>',
      checks: [
        {
          type: 'exprTruthy',
          expr: '(function(){ const inp = document.querySelector("#tree-input"); inp.value = "Elm"; inp.dispatchEvent(new Event("input")); return document.querySelector("#tree-label").textContent.toLowerCase().includes("elm"); })()',
          label: '#tree-label updates to show the typed tree name',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ const inp = document.querySelector("#tree-input"); inp.value = "Ash"; inp.dispatchEvent(new Event("input")); return document.querySelector("#tree-label").textContent.includes("Ash") || document.querySelector("#tree-label").textContent.includes("ash"); })()',
          label: 'The label updates live as the user types',
        },
      ],
    },
  },
  {
    id: 'js-dom-5',
    blocks: [
      {
        type: 'p',
        text: 'Time to put DOM selection, manipulation, and events together in one place. A to-do list is a classic mini-app because it exercises exactly these skills: reading input, building elements, adding them to the page, and handling more events to remove or complete items.',
      },
      {
        type: 'code',
        text: 'function addItem(listEl, text) {\n  const li = document.createElement("li");\n  li.textContent = text;\n  li.addEventListener("click", () => li.remove());\n  listEl.appendChild(li);\n}',
      },
      {
        type: 'p',
        text: 'Each <li> gets its own click listener at the moment it is created — that is the cleanest pattern for dynamic items. Clicking the item removes it from the DOM entirely with the remove() method. The list element never needs to know about individual items; each item manages itself.',
      },
      {
        type: 'tip',
        text: 'Event delegation is an alternative: put one listener on the parent and check event.target to see which child was clicked. It scales better when the list is very long, and it survives items being added or removed without re-registering listeners.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Wire up the mini to-do list: when #add-btn is clicked, read the value from #todo-input, create a new <li> with that text, append it to #todo-list, and clear the input. If the input is empty, do nothing.',
      starter:
        'const addBtn   = document.querySelector("#add-btn");\nconst input    = document.querySelector("#todo-input");\nconst list     = document.querySelector("#todo-list");\n\n// your code here\n',
      html: '<input id="todo-input" type="text" placeholder="Add a task…" />\n<button id="add-btn">Add</button>\n<ul id="todo-list"></ul>',
      checks: [
        {
          type: 'exprTruthy',
          expr: '(function(){ document.querySelector("#todo-input").value = "Water the oak"; document.querySelector("#add-btn").click(); return document.querySelectorAll("#todo-list li").length >= 1; })()',
          label: 'Clicking Add appends a new item to the list',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ return document.querySelector("#todo-list").textContent.toLowerCase().includes("water"); })()',
          label: 'The new item contains the input text',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ const inp = document.querySelector("#todo-input"); inp.value = ""; document.querySelector("#add-btn").click(); const before = document.querySelectorAll("#todo-list li").length; inp.value = ""; document.querySelector("#add-btn").click(); return document.querySelectorAll("#todo-list li").length === before; })()',
          label: 'Clicking Add with empty input does not add a blank item',
        },
      ],
    },
  },
];

export default lessons;
