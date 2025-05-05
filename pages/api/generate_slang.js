import { GoogleGenerativeAI } from "@google/generative-ai";

// Danh sách các tình huống giao tiếp phổ biến
const CONVERSATION_CONTEXTS = [
  "at a coffee shop",
  "in a restaurant",
  "at the airport",
  "shopping at a mall",
  "at a party",
  "in a business meeting",
  "at the doctor's office",
  "at the gym",
  "on public transport",
  "at a hotel",
  "at the bank",
  "in a job interview",
  "at a movie theater",
  "at a grocery store",
  "making small talk with neighbors",
];

// Cấu hình cho Gemini API
const generationConfig = {
  temperature: 0.8,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
};

// Khởi tạo Gemini client
let genAI;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }
  genAI = new GoogleGenerativeAI(apiKey);
  console.log("Gemini client initialized successfully");
} catch (error) {
  console.error("Error initializing Gemini:", error);
}

// Hàm tạo nội dung sử dụng Gemini
async function generateConversation(context, level = "intermediate") {
  try {
    if (!genAI) {
      throw new Error("Gemini client not initialized");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      ...generationConfig,
    });

    const prompt = `Create an engaging English conversation for ${level} level learners in a "${context}" setting.

Requirements:
1. Create a natural dialogue between two people (Alex and Sarah)
2. Include 4-6 exchanges
3. Use common expressions and idioms appropriate for the context
4. Include some slang or informal expressions that are frequently used
5. Focus on practical, everyday English that learners would actually use

The response must be in this exact JSON format:
{
  "title": "A brief title for the conversation",
  "context": "Brief description of the situation and setting (1-2 sentences)",
  "level": "${level}",
  "conversation": [
    {
      "speaker": "Alex/Sarah",
      "text": "The dialogue text",
      "notes": "Optional explanation of any idioms or expressions used"
    }
  ],
  "vocabulary": [
    {
      "term": "word or phrase used",
      "meaning": "clear definition",
      "example": "another example usage"
    }
  ],
  "keyPhrases": [
    {
      "phrase": "useful phrase from the dialogue",
      "usage": "when/how to use this phrase",
      "alternatives": ["other similar expressions"]
    }
  ],
  "culturalNotes": "Brief cultural context or usage notes relevant to the conversation"
}

Make sure:
- The conversation flows naturally
- Include at least 3 useful vocabulary items or expressions
- Explain any slang or informal expressions
- Keep the language authentic but appropriate for learning
- Add relevant cultural context when applicable`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    if (!result.response) {
      throw new Error("No response from Gemini");
    }

    const text = result.response.text();
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    // Parse and validate the response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);

      // Validate required fields
      const requiredFields = [
        "title",
        "context",
        "conversation",
        "vocabulary",
        "keyPhrases",
      ];
      for (const field of requiredFields) {
        if (!parsedResponse[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Validate conversation structure
      if (
        !Array.isArray(parsedResponse.conversation) ||
        parsedResponse.conversation.length < 1
      ) {
        throw new Error("Invalid conversation format");
      }
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      throw new Error("Failed to generate valid conversation format");
    }

    return parsedResponse;
  } catch (error) {
    console.error("Error generating conversation:", error);
    throw error;
  }
}

// Next.js API route handler
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get parameters from request body or use defaults
    const {
      context = CONVERSATION_CONTEXTS[
        Math.floor(Math.random() * CONVERSATION_CONTEXTS.length)
      ],
      level = "intermediate",
    } = req.body;

    // Validate level
    const validLevels = ["beginner", "intermediate", "advanced"];
    if (!validLevels.includes(level.toLowerCase())) {
      return res.status(400).json({
        error: "Invalid level",
        message: "Level must be one of: beginner, intermediate, advanced",
      });
    }

    // Generate conversation
    const conversation = await generateConversation(context, level);

    // Return success response
    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate conversation",
      message: error.message,
    });
  }
}
