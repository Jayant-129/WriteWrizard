import { GoogleGenerativeAI } from "@google/generative-ai";

// Use the correct environment variable format for server-side access
// NEXT_PUBLIC_ prefix is for client-side access, but we need server-side access
// for secure API key handling
const apiKey =
  process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

if (!apiKey) {
  console.error(
    "GEMINI_API_KEY is not set. AI features will not work properly."
  );
}

// Initialize the Gemini API with API key
export const geminiAPI = new GoogleGenerativeAI(apiKey);

// Create a model instance for text generation
// Using "gemini-2.0-flash" as specified in the latest Gemini API
export const geminiModel = geminiAPI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
});

export const textOnly = geminiAPI.getGenerativeModel({
  model: "gemini-2.0-flash",
});
