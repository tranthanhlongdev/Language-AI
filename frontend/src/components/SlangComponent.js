import React, { useState } from "react";
import axios from "axios";
import "./SlangComponent.css";

const SlangComponent = () => {
  const [context, setContext] = useState("");
  const [slangConversation, setSlangConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!context.trim()) {
      setError("Please enter a context for slang conversation");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/generate_slang", { context });
      setSlangConversation(response.data);
    } catch (err) {
      console.error("Error generating slang conversation:", err);
      setError("Failed to generate slang conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="slang-container">
      <h2>Slang Hang</h2>
      <p className="description">
        Learn natural expressions and slang through AI-generated conversations
        between native speakers.
      </p>

      <form onSubmit={handleSubmit} className="slang-form">
        <div className="input-group">
          <label htmlFor="context">Context or Situation</label>
          <input
            type="text"
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g., ordering coffee, meeting friends"
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading || !context.trim()}
        >
          {loading ? "Generating..." : "Generate Conversation"}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Generating your slang conversation...</p>
        </div>
      )}

      {slangConversation && (
        <div className="conversation-result">
          {/* Display the generated conversation here */}
        </div>
      )}
    </div>
  );
};

export default SlangComponent;
