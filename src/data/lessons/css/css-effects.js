// Topic: Transitions & Animations (css-effects) — 5 lessons.

const lessons = [
  {
    id: 'css-effects-1',
    blocks: [
      {
        type: 'p',
        text: 'CSS transitions turn abrupt state changes into smooth ones. Without a transition, hovering over a button changes its color instantly — a hard cut. With transition, the color glides from one value to the next over a duration you choose, giving the interface a feeling of responsiveness and polish.',
      },
      {
        type: 'code',
        text: '.sprout-btn {\n  background: seagreen;\n  transition: background 200ms ease-out;\n}\n\n.sprout-btn:hover {\n  background: darkgreen;\n}',
      },
      {
        type: 'p',
        text: 'transition takes three values: the property to animate, the duration in milliseconds, and the easing function. Use "all" to transition every animatable property at once, or name a specific property to keep transitions surgical. 150–300ms feels natural for hover effects; longer than 400ms starts to feel sluggish.',
      },
      {
        type: 'tip',
        text: 'Put the transition rule on the element itself, not on the :hover rule. That way the reverse animation (hover-off) also plays smoothly.',
      },
    ],
    exercise: {
      instructions:
        'Give the .leaf-btn a transition on "background" lasting 250ms with easing "ease-out". The :hover state is already provided — just add the transition to the base rule.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .leaf-btn {\n        background: #4caf50;\n        color: white;\n        border: none;\n        padding: 10px 24px;\n        border-radius: 6px;\n        cursor: pointer;\n        font-size: 1rem;\n        /* your css here */\n      }\n      .leaf-btn:hover {\n        background: #1b5e20;\n      }\n    </style>\n  </head>\n  <body>\n    <button class="leaf-btn">Plant a seed</button>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'transition:background',
          label: 'A background transition is defined',
        },
        {
          type: 'styleIncludes',
          text: '250ms',
          label: 'The transition lasts 250ms',
        },
      ],
    },
  },
  {
    id: 'css-effects-2',
    blocks: [
      {
        type: 'p',
        text: 'CSS transforms let you move, rotate, scale, and skew elements without touching the layout. Because transforms work in the compositor layer — not the layout engine — they are silky-smooth even when animated. They are the go-to tool for interactive feedback.',
      },
      {
        type: 'code',
        text: '.card:hover {\n  transform: translateY(-4px) scale(1.02);\n  /* moves up 4px, grows 2% */\n}',
      },
      {
        type: 'p',
        text: 'You can chain multiple transform functions in one declaration. translateY(-4px) lifts the card off the surface; scale(1.02) makes it slightly larger — together they give a "pick up the card" feeling. rotate() and skewX() are also available for more dramatic effects.',
      },
      {
        type: 'tip',
        text: 'Always pair transforms with a transition on the base element, otherwise the effect snaps on instantly. Transform + transition is the standard combo for hover lift effects.',
      },
    ],
    exercise: {
      instructions:
        'Make the .tree-card lift when hovered: add a transition on "transform" of 200ms ease-out to the base rule, and add a transform of "translateY(-6px) scale(1.02)" to the :hover rule.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .tree-card {\n        background: #e8f5e9;\n        padding: 20px;\n        border-radius: 10px;\n        display: inline-block;\n        cursor: pointer;\n        /* your css here */\n      }\n      .tree-card:hover {\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="tree-card">\n      <h3>Oak Tree</h3>\n      <p>Grows slowly, lives long.</p>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'transition:transform',
          label: 'A transform transition is defined',
        },
        {
          type: 'styleIncludes',
          text: 'translateY(-6px)',
          label: 'The hover lifts the card up 6px',
        },
      ],
    },
  },
  {
    id: 'css-effects-3',
    blocks: [
      {
        type: 'p',
        text: 'Transitions animate between two states. Keyframe animations can animate through many states in sequence, loop indefinitely, and run automatically without any user interaction. They are the engine behind loaders, pulse effects, and anything that needs to feel alive on its own.',
      },
      {
        type: 'code',
        text: '@keyframes sway {\n  0%   { transform: rotate(-3deg); }\n  50%  { transform: rotate(3deg); }\n  100% { transform: rotate(-3deg); }\n}\n\n.willow-branch {\n  animation: sway 3s ease-in-out infinite;\n}',
      },
      {
        type: 'p',
        text: 'The animation shorthand takes: name, duration, easing, delay, iteration count, and direction. infinite loops forever. alternate makes it play forward then backward smoothly, avoiding a jump-cut at the end of each cycle.',
      },
      {
        type: 'tip',
        text: 'Keyframe percentages are positions in the animation timeline, not speeds. 0% is the start, 100% is the end. You can add as many waypoints as you need in between.',
      },
    ],
    exercise: {
      instructions:
        'Write a @keyframes rule named "pulse" that goes from opacity 1 at 0% to opacity 0.4 at 50% and back to 1 at 100%. Apply it to .dot with duration 1.4s, easing ease-in-out, and infinite iteration.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      /* your @keyframes here */\n\n      .dot {\n        width: 16px;\n        height: 16px;\n        border-radius: 50%;\n        background: seagreen;\n        /* your animation here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="dot"></div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: '@keyframespulse',
          label: 'A @keyframes rule named pulse is defined',
        },
        {
          type: 'styleIncludes',
          text: 'animation:pulse',
          label: 'The dot uses the pulse animation',
        },
        {
          type: 'styleIncludes',
          text: 'infinite',
          label: 'The animation loops infinitely',
        },
      ],
    },
  },
  {
    id: 'css-effects-4',
    blocks: [
      {
        type: 'p',
        text: 'Easing functions are the difference between motion that feels mechanical and motion that feels natural. ease-out starts fast and slows to a stop — good for things entering the screen. ease-in starts slow and accelerates — good for exits. ease-in-out is symmetric and feels the most organic.',
      },
      {
        type: 'code',
        text: '/* cubic-bezier gives you precise control */\ntransition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);\n/* that specific curve overshoots slightly — a spring feel */\n\n/* performance: only animate these two */\ntransition: transform 250ms ease-out,\n            opacity  250ms ease-out;',
      },
      {
        type: 'p',
        text: 'For performance, only ever animate transform and opacity in anything that loops or affects many elements. These two properties run entirely in the GPU compositor and never trigger a layout recalculation. Animating width, height, or top forces the browser to re-measure the whole page — avoid it.',
      },
      {
        type: 'tip',
        text: 'Add "@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }" to respect users who prefer no motion.',
      },
    ],
    exercise: {
      instructions:
        'Add a transition on both "transform" and "opacity" to the .panel base rule, each 300ms with ease-out. The :hover state is provided — just add the transition.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .panel {\n        background: #c8e6c9;\n        padding: 20px;\n        border-radius: 8px;\n        display: inline-block;\n        cursor: pointer;\n        opacity: 0.85;\n        /* your css here */\n      }\n      .panel:hover {\n        transform: scale(1.03);\n        opacity: 1;\n      }\n      @media (prefers-reduced-motion: reduce) {\n        .panel { transition: none; }\n      }\n    </style>\n  </head>\n  <body>\n    <div class="panel">\n      <h3>Grove Panel</h3>\n      <p>Hover to highlight.</p>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'transition:transform',
          label: 'The transform transition is declared',
        },
        {
          type: 'styleIncludes',
          text: 'opacity',
          label: 'Opacity is also transitioned',
        },
        {
          type: 'styleIncludes',
          text: '300ms',
          label: 'Both transitions last 300ms',
        },
      ],
    },
  },
  {
    id: 'css-effects-5',
    blocks: [
      {
        type: 'p',
        text: 'An animated hero section is where CSS effects meet real design. Combine what you know: a keyframe animation for the headline fading in, a transform lift on the CTA button, and a subtle pulse on an icon to draw attention. Each effect is simple; together they make the page feel alive.',
      },
      {
        type: 'p',
        text: 'For the capstone, build a hero with a fade-in-up entrance: a @keyframes rule that moves from opacity 0 + translateY(20px) to opacity 1 + translateY(0), applied to the headline. Add a hover lift on the button and a reduced-motion override at the end.',
      },
      {
        type: 'tip',
        text: 'animation-fill-mode: both makes an element hold the 0% keyframe before the animation starts and the 100% keyframe after it ends — preventing any flash of the unstyled state.',
      },
    ],
    exercise: {
      instructions:
        'Write a @keyframes "fadeUp" that goes from "opacity: 0; transform: translateY(20px)" to "opacity: 1; transform: translateY(0)". Apply it to .hero-title with 600ms ease-out and fill-mode both. Give .hero-cta a hover transform of "translateY(-3px)" with a 200ms ease-out transition.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .hero {\n        background: #1a2e1a;\n        color: white;\n        padding: 64px 32px;\n        text-align: center;\n      }\n      /* your @keyframes here */\n\n      .hero-title {\n        font-size: 2.5rem;\n        margin-bottom: 24px;\n        /* your animation here */\n      }\n      .hero-cta {\n        background: #4caf50;\n        color: white;\n        border: none;\n        padding: 14px 32px;\n        border-radius: 6px;\n        font-size: 1rem;\n        cursor: pointer;\n        /* your transition here */\n      }\n      .hero-cta:hover {\n        /* your hover transform here */\n      }\n      @media (prefers-reduced-motion: reduce) {\n        .hero-title { animation: none; }\n        .hero-cta   { transition: none; }\n      }\n    </style>\n  </head>\n  <body>\n    <div class="hero">\n      <h1 class="hero-title">Grow something beautiful</h1>\n      <button class="hero-cta">Start learning</button>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: '@keyframesfadeup',
          label: 'A fadeUp keyframes rule is defined',
        },
        {
          type: 'styleIncludes',
          text: 'animation:fadeup',
          label: 'The hero title uses the fadeUp animation',
        },
        {
          type: 'styleIncludes',
          text: 'translateY(-3px)',
          label: 'The CTA button lifts on hover',
        },
      ],
    },
  },
];

export default lessons;
