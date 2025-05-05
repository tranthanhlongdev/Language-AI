import cors from "cors";
import ModelManager from "../../utils/model";

// CORS middleware
const corsMiddleware = cors({
  origin: ["http://localhost:3001"],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
});

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

export default withCors(async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { context } = req.body;

    if (!context) {
      return res.status(400).json({ error: "Context is required" });
    }

    if (typeof context !== "string" || context.length > 100) {
      return res
        .status(400)
        .json({ error: "Invalid context format or length" });
    }

    // Get model instance
    const modelManager = await ModelManager.getInstance();

    // Generate slang conversation
    const slangPrompt = `A casual conversation with slang about ${context}:\nPerson 1: Hey, what's up?`;
    const slangText = await modelManager.generateText(slangPrompt, {
      max_new_tokens: 250,
      temperature: 0.9,
      top_k: 50,
      top_p: 0.95,
    });

    // Process the slang conversation
    const slangConversation = processSlangConversation(slangText);

    // Generate slang explanations
    const explanationPrompt = `Explanation of slang terms in the conversation about ${context}:\n`;
    const explanationText = await modelManager.generateText(explanationPrompt, {
      max_new_tokens: 150,
      temperature: 0.7,
    });

    // Process the explanations
    const slangExplanations = processExplanations(explanationText);

    // Validate the generated content
    if (!slangConversation.length || !slangExplanations.length) {
      throw new Error("Failed to generate valid content");
    }

    return res.status(200).json({
      context,
      conversation: slangConversation,
      explanations: slangExplanations,
    });
  } catch (error) {
    console.error("Error generating slang conversation:", error);
    return res.status(500).json({
      error: "Failed to generate slang conversation",
      message: error.message,
    });
  }
});

// Helper function to process the generated slang conversation
function processSlangConversation(text) {
  try {
    // Extract the conversation part
    const conversationPart = text.replace(
      /A casual conversation with slang about .*?:\n/i,
      ""
    );

    // Format the conversation for better readability
    const cleanedConversation = conversationPart
      .replace(/Person \d+:|Person A:|Person B:/g, (match) => `\n${match}`)
      .trim();

    // Split into conversation turns and clean up
    const turns = cleanedConversation
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        // If line doesn't start with a person identifier, add one
        if (!line.match(/^Person \d+:|^Person [AB]:/)) {
          return `Person ${(turns.length % 2) + 1}: ${line}`;
        }
        return line;
      })
      .slice(0, 8); // Limit to 8 turns for readability

    return turns.length > 0
      ? turns
      : ["Person 1: Hey, what's up?", "Person 2: Not much, just chillin'."];
  } catch (error) {
    console.error("Error processing conversation:", error);
    return [
      "Person 1: [Error generating conversation]",
      "Person 2: Let's try again later.",
    ];
  }
}

// Helper function to extract and process slang explanations
function processExplanations(text) {
  try {
    // Extract the explanation part
    const explanationPart = text.replace(
      /Explanation of slang terms in the conversation about .*?:\n/i,
      ""
    );

    // Try to find terms with explanations (looking for patterns like "term - explanation")
    const explanations = explanationPart
      .split("\n")
      .filter((line) => line.includes("-") || line.includes(":"))
      .map((line) => {
        const parts = line.split(/[-:]/);
        if (parts.length >= 2) {
          return {
            term: parts[0].trim(),
            meaning: parts.slice(1).join(":").trim(),
          };
        }
        return null;
      })
      .filter(Boolean)
      .slice(0, 5); // Limit to 5 explanations

    // If no structured explanations found, create generic ones
    if (explanations.length === 0) {
      return [
        {
          term: "what's up",
          meaning: "A greeting asking how someone is doing",
        },
        { term: "cool", meaning: "Good, great, or awesome" },
        { term: "hang out", meaning: "To spend time together casually" },
        { term: "chill", meaning: "To relax or something that's relaxed" },
      ];
    }

    return explanations;
  } catch (error) {
    console.error("Error processing explanations:", error);
    return [
      { term: "Error", meaning: "Failed to generate slang explanations" },
      {
        term: "Try Again",
        meaning: "Please try generating the conversation again",
      },
    ];
  }
}
