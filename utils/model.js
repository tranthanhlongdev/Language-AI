import { pipeline, env } from "@xenova/transformers";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Configure environment
env.cacheDir = "./.cache"; // Set cache directory
env.localModelPath = "./.models"; // Set local model directory

// Suppress ONNX Runtime warnings
env.suppressWarnings = true;
env.silent = true;

class ModelManager {
  static instance = null;
  generator = null;
  openai = null;
  gemini = null;

  static async getInstance() {
    if (!this.instance) {
      this.instance = new ModelManager();
    }
    return this.instance;
  }

  async initializeGPT2() {
    if (!this.generator) {
      try {
        console.log("Initializing GPT-2 model...");
        this.generator = await pipeline("text-generation", "Xenova/gpt2", {
          quantized: false, // Disable quantization to reduce warnings
          revision: "main",
          cache_dir: env.localModelPath,
        });
        console.log("GPT-2 model initialized successfully");
      } catch (error) {
        console.error("Error initializing GPT-2 model:", error);
        throw new Error("Failed to initialize GPT-2 model: " + error.message);
      }
    }
    return this.generator;
  }

  async initializeGPT35() {
    if (!this.openai) {
      try {
        console.log("Initializing GPT-3.5 model...");
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        console.log("GPT-3.5 model initialized successfully");
      } catch (error) {
        console.error("Error initializing GPT-3.5 model:", error);
        throw new Error("Failed to initialize GPT-3.5 model: " + error.message);
      }
    }
    return this.openai;
  }

  async initializeGemini() {
    if (!this.gemini) {
      try {
        console.log("Initializing Gemini model...");
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        this.gemini = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log("Gemini model initialized successfully");
      } catch (error) {
        console.error("Error initializing Gemini model:", error);
        throw new Error("Failed to initialize Gemini model: " + error.message);
      }
    }
    return this.gemini;
  }

  async generateText(prompt, modelType = "gpt2", options = {}) {
    try {
      const defaultOptions = {
        max_new_tokens: 150,
        temperature: 0.7,
        do_sample: true,
        no_repeat_ngram_size: 2,
        num_beams: 1,
        top_k: 50,
        top_p: 0.95,
      };

      switch (modelType.toLowerCase()) {
        case "gpt2":
          if (!this.generator) await this.initializeGPT2();
          const result = await this.generator(prompt, {
            ...defaultOptions,
            ...options,
          });
          return result[0].generated_text;

        case "gpt3.5":
          if (!this.openai) await this.initializeGPT35();
          const completion = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: options.temperature || defaultOptions.temperature,
            max_tokens: options.max_new_tokens || defaultOptions.max_new_tokens,
            stream: options.stream || false,
          });
          return options.stream
            ? completion
            : completion.choices[0].message.content;

        case "gemini":
          if (!this.gemini) await this.initializeGemini();
          const geminiResult = await this.gemini.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: options.temperature || defaultOptions.temperature,
              maxOutputTokens:
                options.max_new_tokens || defaultOptions.max_new_tokens,
            },
          });
          return geminiResult.response.text();

        default:
          throw new Error(`Unsupported model type: ${modelType}`);
      }
    } catch (error) {
      console.error(`Error generating text with ${modelType}:`, error);
      throw new Error(
        `Failed to generate text with ${modelType}: ${error.message}`
      );
    }
  }

  async generateStream(prompt, modelType = "gpt3.5") {
    try {
      switch (modelType.toLowerCase()) {
        case "gpt3.5":
          if (!this.openai) await this.initializeGPT35();
          return await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            stream: true,
          });

        case "gemini":
          if (!this.gemini) await this.initializeGemini();
          return await this.gemini.generateContentStream({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          });

        default:
          throw new Error(
            `Streaming not supported for model type: ${modelType}`
          );
      }
    } catch (error) {
      console.error(`Error streaming with ${modelType}:`, error);
      throw new Error(`Failed to stream with ${modelType}: ${error.message}`);
    }
  }
}

export default ModelManager;
