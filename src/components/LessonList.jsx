import { useState } from 'react';
import { useProgress } from '../state/useProgress';
import { findTopic, STAGES_PER_TOPIC } from '../data/curriculum';
import { getLesson } from '../data/lessons';
import LessonPanel from './LessonPanel';
import './LessonList.css';

/**
 * Black sidebar (mockup slide 2): amber uppercase title, one light-gray
 * pill row per lesson. Lessons WITH authored content open the LessonPanel
 * (its exercise gates completion); lessons without content keep the
 * honor-system button, explicitly labeled as a preview.
 */
export default function LessonList({ topicId }) {
  const { session, getTopicProgress, completeLesson } = useProgress();
  const [openLessonId, setOpenLessonId] = useState(null);
  const found = findTopic(topicId);
  if (!found) return null;

  const { language, topic } = found;
  const { lockedStage } = getTopicProgress(topicId);
  const runningHere =
    !!session && session.topicId === topicId && session.running;
  const mastered = lockedStage >= STAGES_PER_TOPIC;
  const openLesson = openLessonId ? getLesson(openLessonId) : null;
  const openLessonName =
    topic.lessons.find((l) => l.id === openLessonId)?.name;

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
              {isNext &&
                (getLesson(lesson.id) ? (
                  <button
                    type="button"
                    className="lesson-complete-btn"
                    title="Open the lesson — the exercise unlocks completion"
                    onClick={() => setOpenLessonId(lesson.id)}
                  >
                    Open lesson
                  </button>
                ) : (
                  <button
                    type="button"
                    className="lesson-complete-btn"
                    disabled={!runningHere}
                    title={
                      runningHere
                        ? 'No authored content yet — completes on trust'
                        : 'Start a focus session for this topic first'
                    }
                    onClick={() => completeLesson(topicId)}
                  >
                    Quick-complete (preview)
                  </button>
                ))}
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

      {openLesson && (
        <LessonPanel
          topicId={topicId}
          lesson={openLesson}
          title={openLessonName}
          onClose={() => setOpenLessonId(null)}
        />
      )}
    </aside>
  );
}
