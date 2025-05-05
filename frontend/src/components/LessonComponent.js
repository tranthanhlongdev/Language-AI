import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LessonComponent.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const LessonForm = ({ onSubmit, loading, error }) => {
  const [language, setLanguage] = useState("English (UK)");
  const [purpose, setPurpose] = useState("");

  const languages = [
    "English (UK)",
    "English (US)",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Japanese",
    "Korean",
    "Chinese",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!purpose.trim()) return;
    onSubmit({ language, purpose: purpose.trim() });
  };

  return (
    <div className="lesson-page">
      <div className="lesson-header">
        <div className="experiment-label">EXPERIMENT NO. 001</div>
        <h1 className="lesson-title">Tiny Lesson</h1>
        <p className="lesson-description">
          Find relevant vocabulary, phrases, and grammar tips for any situation.
        </p>
      </div>

      <div className="lesson-content">
        <div className="lesson-form">
          <div className="input-group">
            <label>LANGUAGE</label>
            <div className="select-wrapper">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="language-select"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>PURPOSE OR THEME</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g., taking a taxi"
              className="purpose-input"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="generate-button"
            disabled={loading || !purpose.trim()}
          >
            {loading ? (
              <span className="loading-text">Generating...</span>
            ) : (
              <>
                Generate
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"
                    fill="currentColor"
                  />
                </svg>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <svg className="error-icon" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                fill="currentColor"
              />
            </svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

const AudioButton = () => (
  <button className="audio-button" onClick={() => console.log("Play audio")}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z"
        fill="currentColor"
      />
    </svg>
  </button>
);

const LessonContent = ({ lesson }) => {
  if (!lesson) return null;

  return (
    <div className="lesson-result">
      <h2 className="lesson-title-header">{lesson.title}</h2>
      <div className="lesson-sections">
        <section className="section">
          <div className="section-header">
            <svg className="icon" viewBox="0 0 24 24" fill="none">
              <path
                d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
                fill="currentColor"
              />
            </svg>
            <h3>Vocabulary</h3>
          </div>
          <div className="section-content">
            <div className="vocabulary-list">
              {lesson.vocabulary.map((item, index) => (
                <div key={index} className="vocabulary-item">
                  <div className="vocabulary-word">
                    {item.word}
                    <AudioButton />
                  </div>
                  <div className="vocabulary-translation">
                    {item.translation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <svg className="icon" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
                fill="currentColor"
              />
            </svg>
            <h3>Phrases</h3>
          </div>
          <div className="section-content">
            <div className="phrases-list">
              {lesson.phrases.map((item, index) => (
                <div key={index} className="phrase-item">
                  <div className="phrase-text">
                    {item.text}
                    <AudioButton />
                  </div>
                  <div className="phrase-translation">{item.translation}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <svg className="icon" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"
                fill="currentColor"
              />
            </svg>
            <h3>Tips</h3>
          </div>
          <div className="section-content">
            <div className="tips-list">
              {lesson.tips.map((item, index) => (
                <div key={index} className="tip-item">
                  <div className="tip-title">{item.title}</div>
                  <div className="tip-description">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const LessonComponent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/get_lesson`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || `HTTP error! status: ${response.status}`
        );
      }

      if (!data.content) {
        throw new Error("No lesson content received");
      }

      // Store the lesson data in sessionStorage
      sessionStorage.setItem("lessonData", JSON.stringify(data.content));

      // Navigate to the content page
      navigate("/lesson-content");
    } catch (err) {
      console.error("Error details:", err);
      setError(err.message || "Failed to generate lesson");
    } finally {
      setLoading(false);
    }
  };

  return <LessonForm onSubmit={handleSubmit} loading={loading} error={error} />;
};

export default LessonComponent;
