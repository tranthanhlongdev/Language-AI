import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SlangComponent.css";

const TOPICS = [
  "at a coffee shop",
  "at a roadside diner",
  "at a music festival",
  "in a tech startup office",
  "at a beach party",
  "in a college dorm",
  "at a food truck",
  "in a gaming cafe",
  "at a local pub",
  "at a shopping mall",
  "in a gym",
  "at a movie theater",
  "in a taxi",
  "at a sports event",
  "at a farmers market",
];

const LANGUAGES = [
  "English (US)",
  "English (UK)",
  "Australian English",
  "Canadian English",
];

const SlangComponent = () => {
  const [language, setLanguage] = useState("");
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(true);

  // Handle space key press
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space" && conversation && showNextButton) {
        event.preventDefault();
        setCurrentDialogIndex((prev) => {
          if (prev < conversation.dialog.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [conversation, showNextButton]);

  const generateRandomTopic = () => {
    const randomIndex = Math.floor(Math.random() * TOPICS.length);
    return TOPICS[randomIndex];
  };

  const handleGenerate = async () => {
    if (!language) {
      setError("Please select a language");
      return;
    }

    setLoading(true);
    setError("");
    setConversation(null);
    setCurrentDialogIndex(0);

    try {
      const response = await axios.post("/api/generate_slang", {
        language,
        context: generateRandomTopic(),
      });

      setConversation(response.data);
      setShowNextButton(true);
    } catch (err) {
      console.error("Error generating slang conversation:", err);
      setError("Failed to generate conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentDialog = () => {
    if (!conversation || !conversation.dialog) return null;

    return conversation.dialog
      .slice(0, currentDialogIndex + 1)
      .map((item, index) => (
        <div
          key={index}
          className={`chat-bubble ${
            item.speaker === "MAYA" ? "left" : "right"
          }`}
        >
          <div className="speaker">{item.speaker}</div>
          <div className="message">{item.text}</div>
        </div>
      ));
  };

  return (
    <div className="slang-container">
      <div className="slang-header">
        <h2>Slang Hang</h2>
        <div className="experiment-tag">EXPERIMENT NO. 002</div>
      </div>

      <p className="description">
        Learn expressions, idioms, and regional slang from a generated
        conversation between native speakers.
      </p>

      <div className="controls">
        <div className="language-select-container">
          <label htmlFor="language">LANGUAGE</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            <option value="">Select language</option>
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerate}
          className="generate-button"
          disabled={loading || !language}
        >
          {loading ? "Generating..." : "Generate Conversation"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Generating your slang conversation...</p>
        </div>
      )}

      {conversation && (
        <div className="conversation-container">
          <div className="scene-description">{conversation.scene}</div>
          <div className="dialog-container">{renderCurrentDialog()}</div>
          {currentDialogIndex < conversation.dialog?.length - 1 &&
            showNextButton && (
              <div className="continue-prompt">Press space to continue</div>
            )}
          {conversation.explanations &&
            currentDialogIndex === conversation.dialog?.length - 1 && (
              <div className="slang-explanations">
                <h4>Slang & Expressions Explained</h4>
                <div className="explanation-cards">
                  {conversation.explanations.map((item, index) => (
                    <div key={index} className="explanation-card">
                      <div className="term">{item.term}</div>
                      <div className="meaning">{item.meaning}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default SlangComponent;
