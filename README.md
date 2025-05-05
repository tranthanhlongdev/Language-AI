# Language Learning App

A web application similar to Google's Little Language Lessons, built with Next.js (backend) and React (frontend).

## Features

1. **Tiny Lesson**: Generate personalized English lessons with vocabulary, grammar, and dialogues based on user-specified topics.
2. **Slang Hang**: Generate slang conversations and explanations based on user-specified contexts.

## Technology Stack

- **Backend**: Next.js (API Routes), Transformers.js (GPT-2)
- **Frontend**: React, Axios

## Project Structure

```
.
├── package.json              # Backend dependencies
├── pages/                    # Next.js pages
│   └── api/                  # API endpoints
│       ├── get_lesson.js     # Tiny Lesson API
│       └── generate_slang.js # Slang Hang API
└── frontend/                 # React frontend
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        ├── App.css
        ├── index.js
        ├── index.css
        └── components/
            ├── LessonComponent.js
            ├── LessonComponent.css
            ├── SlangComponent.js
            └── SlangComponent.css
```

## How to Run

### Backend (Next.js)

1. Install dependencies:

   ```
   npm install
   ```

2. Start the development server:

   ```
   npm run dev
   ```

   The backend server will run on http://localhost:3000.

### Frontend (React)

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm start
   ```

   The frontend will run on http://localhost:3001.

## Note

The application uses GPT-2 via the Transformers.js library to generate lessons and slang conversations. First-time loading might take some time as the model needs to be downloaded.
