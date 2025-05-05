import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LessonComponent from "./components/LessonComponent";
import LessonContentPage from "./components/LessonContentPage";
import SlangComponent from "./components/SlangComponent";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-left">
            <Link to="/" className="google-labs-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8L19.2 8 12 11.2 4.8 8 12 4.8zM4 9.8l7 3.5v5.9l-7-3.5V9.8zm9 9.4v-5.9l7-3.5v5.9l-7 3.5z"
                  fill="currentColor"
                />
              </svg>
              <span>Language Lab</span>
              <span className="experiment-tag">BETA</span>
            </Link>
          </div>
          <div className="header-right">
            <div className="language-selector">
              English
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
              </svg>
            </div>
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <main className="main-content">
                <section className="hero-section">
                  <h1 className="brand-title">Little Language Lessons</h1>
                  <p className="brand-description">
                    Discover a new way to learn languages through AI-powered,
                    bite-sized lessons tailored to your needs. Start your
                    journey today with our experimental learning tools.
                  </p>
                </section>

                <div className="experiments-grid">
                  <div className="experiment-card">
                    <div className="experiment-number">EXPERIMENT NO. 001</div>
                    <h2 className="experiment-title">Tiny Lesson</h2>
                    <p className="experiment-description">
                      Get personalized vocabulary, phrases, and grammar tips for
                      any situation. Perfect for quick, focused learning
                      sessions.
                    </p>
                    <Link to="/tiny-lesson" className="try-it-button">
                      Try it now
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"
                          fill="currentColor"
                        />
                      </svg>
                    </Link>
                  </div>

                  <div className="experiment-card">
                    <div className="experiment-number">EXPERIMENT NO. 002</div>
                    <h2 className="experiment-title">Slang Hang</h2>
                    <p className="experiment-description">
                      Learn natural expressions and slang through AI-generated
                      conversations between native speakers. Make your language
                      skills more authentic.
                    </p>
                    <Link to="/slang-hang" className="try-it-button">
                      Try it now
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"
                          fill="currentColor"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </main>
            }
          />
          <Route path="/tiny-lesson" element={<LessonComponent />} />
          <Route path="/lesson-content" element={<LessonContentPage />} />
          <Route path="/slang-hang" element={<SlangComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
