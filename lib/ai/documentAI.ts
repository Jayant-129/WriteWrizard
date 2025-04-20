"use client";

import { geminiModel } from "./gemini.config";

/**
 * DocumentAI - AI utilities for document processing powered by Google's Gemini API
 *
 * This module provides AI-powered features for document processing,
 * such as title generation, content summarization, and theme analysis.
 */

/**
 * Generates a document title suggestion based on content using Gemini AI
 *
 * @param content The document content to analyze
 * @returns A Promise that resolves to a suggested title for the document
 */
export const generateTitleSuggestion = async (
  content: string
): Promise<string> => {
  if (!content || content.trim() === "") {
    return "Untitled Document";
  }

  // Limit content length to avoid exceeding API limits
  const cleanContent = content.replace(/<[^>]*>?/gm, "");
  const truncatedContent =
    cleanContent.length > 5000
      ? cleanContent.substring(0, 5000) + "..."
      : cleanContent;

  try {
    const prompt = `Please generate a concise, engaging title for this document content. 
    The title should be short (under 50 characters) and capture the main essence of the text.
    Don't use quotes in your response, just return the title text.
    Here's the content:
    ${truncatedContent}`;

    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const title = response.text().trim().replace(/^"|"$/g, ""); // Remove any quotes

    if (!title) {
      return "Untitled Document";
    }

    return title;
  } catch (error) {
    console.error("Error generating title with Gemini:", error);

    // Fallback to a simple title extraction if Gemini API fails
    const sentences = truncatedContent.split(/[.!?]+/);
    if (sentences[0] && sentences[0].length > 3) {
      const words = sentences[0].trim().split(/\s+/);
      if (words.length > 5) {
        return words.slice(0, 5).join(" ") + "...";
      }
      return sentences[0].trim();
    }

    return "Untitled Document";
  }
};

/**
 * Analyzes document content to extract key topics and themes using Gemini AI
 *
 * @param content The document content to analyze
 * @returns A Promise that resolves to an array of identified topics/themes
 */
export const analyzeDocumentThemes = async (
  content: string
): Promise<string[]> => {
  if (!content || content.length < 50) {
    return [];
  }

  // Limit content length for API call
  const cleanContent = content.replace(/<[^>]*>?/gm, "");
  const truncatedContent =
    cleanContent.length > 5000
      ? cleanContent.substring(0, 5000) + "..."
      : cleanContent;

  try {
    const prompt = `Please identify 3-5 main topics or themes from the following text. 
    Return only a comma-separated list of single words or short phrases with no numbering, explanation or additional text.
    Here's the content:
    ${truncatedContent}`;

    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const themesText = response.text().trim();

    // Parse the comma-separated response
    const themes = themesText
      .split(",")
      .map((theme) => theme.trim())
      .filter((theme) => theme.length > 0);

    return themes.slice(0, 5); // Limit to 5 themes
  } catch (error) {
    console.error("Error analyzing themes with Gemini:", error);

    // Fallback to simple keyword extraction
    const words = truncatedContent.toLowerCase().match(/\b\w{5,}\b/g) || [];
    const wordFreq = words.reduce((acc: Record<string, number>, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((entry) => entry[0]);
  }
};

/**
 * Suggests document improvements based on content analysis using Gemini AI
 *
 * @param content The document content to analyze
 * @returns A Promise that resolves to an array of suggestions
 */
export const suggestImprovements = async (
  content: string
): Promise<string[]> => {
  if (!content || content.length < 100) {
    return ["Add more content to make your document more detailed."];
  }

  // Limit content length for API call
  const cleanContent = content.replace(/<[^>]*>?/gm, "");
  const truncatedContent =
    cleanContent.length > 5000
      ? cleanContent.substring(0, 5000) + "..."
      : cleanContent;

  try {
    const prompt = `Please analyze this document and provide 2-4 specific, actionable suggestions to improve the writing. 
    Focus on clarity, structure, engagement, and readability.
    Return only a list of suggestions with no numbering or additional explanations.
    Each suggestion should be concise (under 100 characters).
    Here's the content:
    ${truncatedContent}`;

    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const improvementsText = response.text().trim();

    // Split the response into separate suggestions
    const suggestions = improvementsText
      .split(/\n+|\./)
      .map((suggestion) => suggestion.trim())
      .filter(
        (suggestion) => suggestion.length > 10 && suggestion.length < 100
      );

    return suggestions.length > 0
      ? suggestions
      : ["Consider adding more structure to improve readability."];
  } catch (error) {
    console.error("Error generating suggestions with Gemini:", error);

    // Fallback to simple suggestions
    const suggestions = [];
    if (truncatedContent.split(/\s+/).length < 200) {
      suggestions.push(
        "Consider adding more detail to develop your ideas further."
      );
    }
    if (!truncatedContent.includes("?")) {
      suggestions.push(
        "Adding questions can engage readers and improve interaction."
      );
    }
    if (
      truncatedContent.split(/\.\s+/).some((s) => s.split(/\s+/).length > 25)
    ) {
      suggestions.push(
        "Some sentences are very long. Consider shorter sentences for readability."
      );
    }

    return suggestions.length > 0
      ? suggestions
      : ["Review your document for clarity and structure."];
  }
};
