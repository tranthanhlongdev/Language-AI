import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LessonComponent.css";

const AudioButton = () => (
  <button className="audio-button">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z"
        fill="currentColor"
      />
    </svg>
  </button>
);

const ActionButton = ({ icon }) => (
  <button className="action-button">{icon}</button>
);

const ContentSection = ({ items, itemsPerPage = 4, renderItem }) => {
  const [displayCount, setDisplayCount] = useState(itemsPerPage);

  const handleShowMore = () => {
    if (displayCount === itemsPerPage) {
      setDisplayCount(8); // Show 8 items on first click
    } else if (displayCount === 8) {
      setDisplayCount(10); // Show all 10 items on second click
    } else {
      setDisplayCount(itemsPerPage); // Reset to initial 4 items
    }
  };

  const displayItems = items.slice(0, displayCount);
  const hasMore = items.length > displayCount;
  const isShowingAll = displayCount === 10;

  return (
    <>
      {displayItems.map(renderItem)}
      {(hasMore || isShowingAll) && (
        <button className="see-more" onClick={handleShowMore}>
          {isShowingAll ? "Show less" : "See more"}
        </button>
      )}
    </>
  );
};

const LessonContentPage = () => {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [activeTab, setActiveTab] = useState("vocabulary");

  useEffect(() => {
    // Get lesson data from sessionStorage
    const lessonData = sessionStorage.getItem("lessonData");
    if (!lessonData) {
      navigate("/tiny-lesson");
      return;
    }

    try {
      setLesson(JSON.parse(lessonData));
    } catch (error) {
      console.error("Error parsing lesson data:", error);
      navigate("/tiny-lesson");
    }
  }, [navigate]);

  if (!lesson) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "vocabulary":
        return (
          <div className="vocabulary-list">
            <ContentSection
              items={lesson.vocabulary}
              renderItem={(item) => (
                <div key={item.word} className="vocabulary-item">
                  <div className="vocabulary-word">
                    {item.word}
                    <AudioButton />
                  </div>
                  <div className="vocabulary-translation">
                    {item.translation}
                  </div>
                </div>
              )}
            />
          </div>
        );
      case "phrases":
        return (
          <div className="phrases-list">
            <ContentSection
              items={lesson.phrases}
              renderItem={(item) => (
                <div key={item.text} className="phrase-item">
                  <div className="phrase-text">
                    {item.text}
                    <AudioButton />
                  </div>
                  <div className="phrase-translation">{item.translation}</div>
                </div>
              )}
            />
          </div>
        );
      case "tips":
        return (
          <div className="tips-section">
            <ContentSection
              items={lesson.tips}
              renderItem={(item) => (
                <div key={item.title} className="tip-item">
                  <div className="tip-title">
                    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                      <path
                        d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"
                        fill="currentColor"
                      />
                    </svg>
                    {item.title}
                  </div>
                  <div className="tip-description">{item.description}</div>
                </div>
              )}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="lesson-page">
      <div className="lesson-title-header">
        <div className="title">{lesson.title}</div>
        <div className="actions">
          <ActionButton
            icon={
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                  fill="currentColor"
                />
              </svg>
            }
          />
          <ActionButton
            icon={
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
                  fill="currentColor"
                />
              </svg>
            }
          />
          <ActionButton
            icon={
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  fill="currentColor"
                />
              </svg>
            }
          />
        </div>
      </div>

      <div className="lesson-navigation">
        <div
          className={`nav-item ${activeTab === "vocabulary" ? "active" : ""}`}
          onClick={() => setActiveTab("vocabulary")}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
              fill="currentColor"
            />
          </svg>
          Vocabulary
        </div>
        <div
          className={`nav-item ${activeTab === "phrases" ? "active" : ""}`}
          onClick={() => setActiveTab("phrases")}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
              fill="currentColor"
            />
          </svg>
          Phrases
        </div>
        <div
          className={`nav-item ${activeTab === "tips" ? "active" : ""}`}
          onClick={() => setActiveTab("tips")}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"
              fill="currentColor"
            />
          </svg>
          Tips
        </div>
      </div>

      <div className="section-content">{renderContent()}</div>
    </div>
  );
};

export default LessonContentPage;
