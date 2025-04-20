"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with server-side environment variable
// The API key should be stored in environment variables for security
const apiKey =
  process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

if (!apiKey) {
  console.error(
    "GEMINI_API_KEY is not set. AI features will not work properly."
  );
}

// Initialize the Gemini model
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Server action to generate a title suggestion based on document content
 */
export async function generateTitle(content: string): Promise<string> {
  if (!content || content.trim().length < 20) {
    return "Untitled Document";
  }

  if (!apiKey) {
    throw new Error(
      "Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables."
    );
  }

  try {
    // Clean and truncate content to avoid excessive tokens
    const cleanContent = content.replace(/<[^>]*>?/gm, "");
    const truncatedContent =
      cleanContent.length > 5000
        ? cleanContent.substring(0, 5000) + "..."
        : cleanContent;

    const prompt = `Please generate a concise, engaging title for this document content. 
      The title should be short (under 50 characters) and capture the main essence of the text.
      Don't use quotes in your response, just return the plain title text.
      Content: ${truncatedContent}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const title = response.text().trim().replace(/^"|"$/g, ""); // Remove any quotes

    return title || "Untitled Document";
  } catch (error) {
    console.error("Error generating title:", error);
    throw error;
  }
}

/**
 * Server action to analyze document themes and topics
 */
export async function analyzeThemes(content: string): Promise<string[]> {
  if (!content || content.trim().length < 100) {
    return [];
  }

  if (!apiKey) {
    throw new Error(
      "Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables."
    );
  }

  try {
    // Clean and truncate content
    const cleanContent = content.replace(/<[^>]*>?/gm, "");
    const truncatedContent =
      cleanContent.length > 5000
        ? cleanContent.substring(0, 5000) + "..."
        : cleanContent;

    const prompt = `Please identify 3-5 main topics or themes from this text. 
      Return only a comma-separated list of single words or short phrases with no numbering or additional text.
      Content: ${truncatedContent}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const themesText = response.text().trim();

    // Parse the comma-separated response
    const themes = themesText
      .split(",")
      .map((theme) => theme.trim())
      .filter((theme) => theme.length > 0);

    return themes.slice(0, 5); // Limit to 5 themes
  } catch (error) {
    console.error("Error analyzing themes:", error);
    throw error;
  }
}

/**
 * Server action to get writing improvement suggestions
 */
export async function getSuggestions(content: string): Promise<string[]> {
  if (!content || content.trim().length < 100) {
    return [];
  }

  if (!apiKey) {
    throw new Error(
      "Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables."
    );
  }

  try {
    // Clean and truncate content
    const cleanContent = content.replace(/<[^>]*>?/gm, "");
    const truncatedContent =
      cleanContent.length > 5000
        ? cleanContent.substring(0, 5000) + "..."
        : cleanContent;

    const prompt = `Please analyze this document and provide 2-3 specific, actionable suggestions to improve the writing. 
      Focus on clarity, structure, and engagement.
      Return only bullet points with no numbering or additional explanations.
      Each suggestion should be concise (under 100 characters).
      Content: ${truncatedContent}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const suggestionsText = response.text().trim();

    // Split the response into separate suggestions
    const suggestions = suggestionsText
      .split(/\n+|-|\*/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10 && s.length < 120);

    return suggestions.length > 0 ? suggestions : [];
  } catch (error) {
    console.error("Error generating suggestions:", error);
    throw error;
  }
}

/**
 * Server action to generate a summary of the document
 */
export async function generateSummary(content: string): Promise<string> {
  if (!content || content.trim().length < 100) {
    return "Content is too short to summarize.";
  }

  if (!apiKey) {
    throw new Error(
      "Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables."
    );
  }

  try {
    // Clean and truncate content
    const cleanContent = content.replace(/<[^>]*>?/gm, "");
    const truncatedContent =
      cleanContent.length > 8000
        ? cleanContent.substring(0, 8000) + "..."
        : cleanContent;

    const prompt = `Please summarize this text in a concise paragraph (50-100 words).
      Focus on capturing the main points while being engaging and clear.
      Content: ${truncatedContent}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text().trim();

    return summary || "Unable to generate summary.";
  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
}
