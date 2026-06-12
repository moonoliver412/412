import { useState } from 'react';
import './QuizBlock.css';

// One multiple-choice question. Two homes:
//  - teaching beat (blocks: { type:'quiz' }) — an ungraded concept check
//  - graded quiz exercise (exercise.kind === 'quiz') — reports onCorrect
// Wrong picks shake (T1 error feedback) and stay re-pickable; the right
// pick locks, glows, and reveals the explanation (T3 micro, fires once).

export default function QuizBlock({ quiz, index = 0, onCorrect }) {
  const [picked, setPicked] = useState(null); // last wrong pick (for shake)
  const [solved, setSolved] = useState(false);

  const choose = (i) => {
    if (solved) return;
    if (i === quiz.answer) {
      setSolved(true);
      setPicked(null);
      onCorrect?.();
    } else {
      // Re-trigger the shake even on a repeated wrong pick.
      setPicked(null);
      requestAnimationFrame(() => setPicked(i));
    }
  };

  return (
    <div className="qz lp-enter" style={{ '--i': index }}>
      <p className="qz-question">{quiz.question}</p>
      <div className="qz-options" role="group" aria-label="Answer choices">
        {quiz.options.map((option, i) => {
          const isRight = solved && i === quiz.answer;
          const isWrong = picked === i && !solved;
          return (
            <button
              key={i}
              type="button"
              disabled={solved && !isRight}
              aria-pressed={isRight}
              className={`qz-option${isRight ? ' is-right' : ''}${
                isWrong ? ' is-wrong' : ''
              }`}
              onClick={() => choose(i)}
            >
              <span className="qz-option-mark" aria-hidden="true">
                {isRight ? '✓' : String.fromCharCode(65 + i)}
              </span>
              {option}
            </button>
          );
        })}
      </div>
      {solved && quiz.explain && (
        <p className="qz-explain" role="status">
          {quiz.explain}
        </p>
      )}
    </div>
  );
}
