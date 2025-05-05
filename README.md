# English Learning Conversation App

An interactive web application for learning English through AI-generated conversations, powered by Next.js and Google's Gemini AI.

## 🌟 Features

### 1. Dynamic Conversation Generation

- Generate natural English conversations for different scenarios
- Multiple difficulty levels (beginner, intermediate, advanced)
- Real-world context and situations
- Common slang and idioms with explanations

### 2. Learning Components

- Detailed vocabulary explanations
- Key phrases and their usage
- Cultural context notes
- Alternative expressions
- Practice scenarios

### 3. Conversation Contexts

- Coffee shops and restaurants
- Business meetings
- Travel situations
- Shopping and retail
- Social gatherings
- Healthcare settings
- And many more...

## 🛠 Technology Stack

### Backend

- **Next.js** - Server and API routes
- **Google Gemini AI** - Conversation generation
- **Node.js** - Runtime environment

### Frontend

- **React** - UI components
- **CSS Modules** - Styling
- **Axios** - API communication

## 📁 Project Structure

```
.
├── pages/                    # Next.js pages
│   ├── api/                  # API endpoints
│   │   └── generate_slang.js # Conversation generation API
│   └── index.js             # Main page
├── components/              # React components
│   ├── ConversationDisplay/
│   ├── VocabularyList/
│   └── ContextSelector/
├── styles/                  # CSS modules
├── public/                  # Static assets
└── utils/                   # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd english-learning-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 📝 API Usage

### Generate Conversation

```http
POST /api/generate_slang
Content-Type: application/json

{
    "context": "at a coffee shop",
    "level": "intermediate"
}
```

#### Response Format

```json
{
  "success": true,
  "data": {
    "title": "String",
    "context": "String",
    "level": "String",
    "conversation": [
      {
        "speaker": "String",
        "text": "String",
        "notes": "String"
      }
    ],
    "vocabulary": [
      {
        "term": "String",
        "meaning": "String",
        "example": "String"
      }
    ],
    "keyPhrases": [
      {
        "phrase": "String",
        "usage": "String",
        "alternatives": ["String"]
      }
    ],
    "culturalNotes": "String"
  }
}
```

## 🔧 Configuration

### Available Conversation Contexts

- Coffee shops
- Restaurants
- Airports
- Shopping malls
- Business meetings
- Doctor's office
- Public transport
- And more...

### Difficulty Levels

- **Beginner**: Basic vocabulary and simple expressions
- **Intermediate**: Common idioms and casual expressions
- **Advanced**: Complex vocabulary, slang, and cultural nuances

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powering the conversation generation
- Next.js team for the amazing framework
- All contributors and users of this application
