import { useState } from 'react';
import { isThirsty, useProgress } from '../state/useProgress';
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
  const { session, getTopicProgress, completeLesson, waterTopic } =
    useProgress();
  const [openLessonId, setOpenLessonId] = useState(null);
  const [reviewLessonId, setReviewLessonId] = useState(null);
  const found = findTopic(topicId);
  if (!found) return null;

  const { language, topic } = found;
  const topicProgress = getTopicProgress(topicId);
  const { lockedStage } = topicProgress;
  const runningHere =
    !!session && session.topicId === topicId && session.running;
  const mastered = lockedStage >= STAGES_PER_TOPIC;
  const thirsty = isThirsty(topicProgress);
  const openLesson = openLessonId ? getLesson(openLessonId) : null;
  const openLessonName =
    topic.lessons.find((l) => l.id === openLessonId)?.name;
  const reviewLesson = reviewLessonId ? getLesson(reviewLessonId) : null;
  const reviewLessonName =
    topic.lessons.find((l) => l.id === reviewLessonId)?.name;

  // Watering reviews one authored lesson from this topic; rotating off the
  // tendedAt stamp gives a different lesson each watering without Math.random.
  const startWatering = () => {
    const authored = topic.lessons.filter((l) => getLesson(l.id));
    if (!authored.length) {
      waterTopic(topicId); // no content to review — water on trust
      return;
    }
    const pick = authored[(topicProgress.tendedAt ?? 0) % authored.length];
    setReviewLessonId(pick.id);
  };

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
              }${isNext ? ' is-next' : ''}`}
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
                    title="Open the lesson and complete the exercise to finish it"
                    onClick={() => setOpenLessonId(lesson.id)}
                  >
                    Start lesson
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

      {mastered && !thirsty && (
        <p className="lesson-mastered" role="status">
          Topic mastered — tree fully grown!
        </p>
      )}

      {mastered && thirsty && (
        <div className="lesson-thirsty">
          <p className="lesson-thirsty-note" role="status">
            This tree is thirsty — review to keep the knowledge green.
          </p>
          <button
            type="button"
            className="lesson-water-btn"
            onClick={startWatering}
          >
            💧 Water this tree
          </button>
        </div>
      )}

      {openLesson && (
        <LessonPanel
          topicId={topicId}
          lesson={openLesson}
          title={openLessonName}
          onClose={() => setOpenLessonId(null)}
        />
      )}

      {reviewLesson && (
        <LessonPanel
          topicId={topicId}
          lesson={reviewLesson}
          title={`Review · ${reviewLessonName ?? 'Lesson'}`}
          mode="review"
          onWatered={() => waterTopic(topicId)}
          onClose={() => setReviewLessonId(null)}
        />
      )}
    </aside>
  );
}
