import { useProgress } from '../state/useProgress';
import { findTopic, STAGES_PER_TOPIC } from '../data/curriculum';
import './LessonList.css';

/**
 * Black sidebar (mockup slide 2): amber uppercase title, one light-gray
 * pill row per lesson. Completing the next lesson is only possible while
 * a focus session is running for this topic.
 */
export default function LessonList({ topicId }) {
  const { session, getTopicProgress, completeLesson } = useProgress();
  const found = findTopic(topicId);
  if (!found) return null;

  const { language, topic } = found;
  const { lockedStage } = getTopicProgress(topicId);
  const runningHere =
    !!session && session.topicId === topicId && session.running;
  const mastered = lockedStage >= STAGES_PER_TOPIC;

  return (
    <aside className="cs-panel lesson-list">
      <h2 className="cs-panel-title lesson-list-title">
        {language.name}
        <span className="lesson-list-subtitle">{topic.name}</span>
      </h2>

      <ol className="lesson-rows">
        {topic.lessons.map((lesson, i) => {
          const completed = i < lockedStage;
          const isNext = i === lockedStage && !mastered;
          const locked = !completed && !isNext;
          return (
            <li
              key={lesson.id}
              className={`lesson-row${completed ? ' is-completed' : ''}${
                locked ? ' is-locked' : ''
              }`}
            >
              <span className="lesson-row-name">{lesson.name}</span>
              {completed && (
                <span className="lesson-check" aria-label="Completed">
                  ✓
                </span>
              )}
              {isNext && (
                <button
                  type="button"
                  className="lesson-complete-btn"
                  disabled={!runningHere}
                  title={
                    runningHere
                      ? 'Lock in the next growth stage'
                      : 'Start a focus session for this topic first'
                  }
                  onClick={() => completeLesson(topicId)}
                >
                  Complete lesson
                </button>
              )}
              {locked && (
                <span className="lesson-lock" aria-label="Locked">
                  Locked
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {mastered && (
        <p className="lesson-mastered" role="status">
          Topic mastered — tree fully grown!
        </p>
      )}
    </aside>
  );
}
