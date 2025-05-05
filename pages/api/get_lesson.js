const express = require("express");
const router = express.Router();
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// CORS middleware
const corsMiddleware = cors({
  origin: ["http://localhost:3001"],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
});

// Cấu hình safety settings
const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_NONE",
  },
];

// Cấu hình generation
const generationConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
};

// Initialize Gemini client with error handling
let genAI;
try {
  const apiKey = "AIzaSyAYJGwp3bKclMpln-viL7ZU1CMHhUiyGxU";
  console.log("Using Gemini API key:", apiKey ? "Present" : "Missing");

  genAI = new GoogleGenerativeAI(apiKey);
  console.log("Gemini client initialized successfully");
} catch (error) {
  console.error("Error initializing Gemini:", error);
}

// Helper function to wrap API handler with CORS
function withCors(handler) {
  return async (req, res) => {
    return new Promise((resolve, reject) => {
      corsMiddleware(req, res, async (result) => {
        if (result instanceof Error) {
          return reject(result);
        }

        // Handle preflight request
        if (req.method === "OPTIONS") {
          res.status(200).end();
          return resolve();
        }

        return resolve(handler(req, res));
      });
    });
  };
}

// Helper function to generate content using Gemini
async function generateContent(prompt) {
  try {
    if (!genAI) {
      throw new Error("Gemini client not initialized - missing API key");
    }

    console.log("Generating content with prompt:", prompt);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // Sử dụng model mới
      ...generationConfig,
    });

    const result = await model.generateContent({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    if (!result.response) {
      throw new Error("No response from Gemini");
    }

    const text = result.response.text();
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    console.log("Generated content:", text.substring(0, 100) + "...");
    return text.trim();
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}

// Helper function to generate vocabulary
async function generateVocabulary(purpose, language) {
  try {
    const prompt = `As a language learning assistant, create a list of 10 essential ${language} vocabulary words that would be useful for "${purpose}". 
For each word:
- Choose commonly used words or phrases
- Include both basic and intermediate level terms
- Provide accurate translations
- Focus on practical, everyday usage

Format each line exactly as: "word/phrase - translation"
Example format:
good morning - chào buổi sáng
thank you - cảm ơn`;

    const result = await generateContent(prompt);

    // Process the generated text into vocabulary items
    const words = result
      .split("\n")
      .filter((line) => line.trim() && line.includes(" - "))
      .slice(0, 10)
      .map((line) => {
        const [word, translation] = line.split(" - ");
        return {
          word: word?.trim() || "",
          translation: translation?.trim() || "",
          description: "",
        };
      });

    if (words.length === 0) {
      throw new Error("No vocabulary words generated");
    }

    return words;
  } catch (error) {
    console.error("Error generating vocabulary:", error);
    throw error;
  }
}

// Helper function to generate phrases
async function generatePhrases(purpose, language) {
  try {
    const prompt = `As a language learning assistant, create 9 useful ${language} phrases that would be essential for "${purpose}".
For each phrase:
- Include common expressions and sentences used in real conversations
- Mix of formal and informal phrases where appropriate
- Provide natural, conversational translations
- Focus on practical dialogue that learners can use immediately

Format each line exactly as: "phrase - translation"
Example format:
Could you help me with this? - Bạn có thể giúp tôi việc này không?
I don't understand - Tôi không hiểu`;

    const result = await generateContent(prompt);

    // Process the generated text into phrases
    const phrases = result
      .split("\n")
      .filter((line) => line.trim() && line.includes(" - "))
      .slice(0, 9)
      .map((line) => {
        const [text, translation] = line.split(" - ");
        return {
          text: text?.trim() || "",
          translation: translation?.trim() || "",
          description: "",
        };
      });

    if (phrases.length === 0) {
      throw new Error("No phrases generated");
    }

    return phrases;
  } catch (error) {
    console.error("Error generating phrases:", error);
    throw error;
  }
}

// Helper function to generate tips
async function generateTips(purpose, language) {
  try {
    const prompt = `As a language learning assistant, provide 3 important language learning tips for studying ${language} specifically for "${purpose}".
For each tip:
- Focus on practical learning strategies
- Include cultural context where relevant
- Provide specific examples or scenarios
- Address common challenges learners might face

Format each tip exactly as "Title: Description"
Example format:
Practice Active Listening: Focus on understanding native speakers in real conversations rather than just memorizing phrases.
Cultural Context: Learn about the cultural norms and expectations in business settings to communicate more effectively.`;

    const result = await generateContent(prompt);

    // Process the generated text into tips
    const tips = result
      .split("\n")
      .filter((line) => line.trim() && line.includes(": "))
      .slice(0, 3)
      .map((line) => {
        const [title, ...descriptionParts] = line.split(": ");
        return {
          title: title?.trim() || "",
          description: descriptionParts.join(": ").trim() || "",
        };
      });

    if (tips.length === 0) {
      throw new Error("No tips generated");
    }

    return tips;
  } catch (error) {
    console.error("Error generating tips:", error);
    throw error;
  }
}

// API endpoint
router.post("/", async (req, res) => {
  try {
    console.log("Received request:", req.body);

    // Only allow POST method
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }

    const { language, purpose } = req.body;

    // Validate input
    if (!language || !purpose) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        details: {
          language: !language ? "Language is required" : null,
          purpose: !purpose ? "Purpose is required" : null,
        },
      });
    }

    // Check Gemini initialization
    if (!genAI) {
      return res.status(503).json({
        success: false,
        message: "Service temporarily unavailable",
        error: "Gemini client not initialized",
      });
    }

    // Generate content using Gemini
    const [vocabulary, phrases, tips] = await Promise.all([
      generateVocabulary(purpose, language),
      generatePhrases(purpose, language),
      generateTips(purpose, language),
    ]);

    const lessonContent = {
      title: `${language} for ${purpose}`,
      vocabulary,
      phrases,
      tips,
    };

    console.log("Generated lesson content:", lessonContent);

    return res.status(200).json({
      success: true,
      content: lessonContent,
    });
  } catch (error) {
    console.error("Error handling request:", error);

    // Determine appropriate error response
    if (error.message.includes("Gemini")) {
      return res.status(503).json({
        success: false,
        message: "Service temporarily unavailable",
        error: "Error communicating with Gemini: " + error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error generating lesson",
      error: error.message,
    });
  }
});

module.exports = router;
