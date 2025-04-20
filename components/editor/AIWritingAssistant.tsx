"use client";

import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { getSuggestions, generateSummary } from "@/lib/actions/ai.actions";
import { Button } from "../ui/button";
import Image from "next/image";

interface AIWritingAssistantProps {
  currentUserType: UserType;
}

export default function AIWritingAssistant({
  currentUserType,
}: AIWritingAssistantProps) {
  const [editor] = useLexicalComposerContext();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [docSummary, setDocSummary] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [docContent, setDocContent] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for document content changes
  useEffect(() => {
    if (currentUserType !== "editor") return;

    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        setDocContent(root.getTextContent());
      });
    });

    return () => {
      unregister();
    };
  }, [editor, currentUserType]);

  const dismissSuggestions = () => {
    setShowSuggestions(false);
  };

  const dismissSummary = () => {
    setShowSummary(false);
  };

  const handleGenerateSummary = async () => {
    if (docContent.trim().length < 100) {
      setError("Document content is too short. Add more content first.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsSummarizing(true);
    setError(null);

    try {
      const summary = await generateSummary(docContent);

      if (summary) {
        setDocSummary(summary);
        setShowSummary(true);
        setShowSuggestions(false); // Hide suggestions when showing summary
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      setError(
        "Failed to generate summary. Make sure your API key is set correctly."
      );
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGetSuggestions = async () => {
    if (docContent.trim().length < 100) {
      setError("Document content is too short. Add more content first.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const improvementSuggestions = await getSuggestions(docContent);

      if (improvementSuggestions && improvementSuggestions.length > 0) {
        setSuggestions(improvementSuggestions);
        setShowSuggestions(true);
        setShowSummary(false); // Hide summary when showing suggestions
      } else {
        setError("No suggestions available. Try with different content.");
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error("Error getting writing suggestions:", error);
      setError(
        "Failed to get suggestions. Make sure your API key is set correctly."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Only show for editors
  if (currentUserType !== "editor") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="flex flex-col items-start gap-2">
        {error && (
          <div className="rounded-md bg-red-900/80 px-3 py-1 text-xs text-white">
            {error}
          </div>
        )}

        {/* Status indicator */}
        {(isAnalyzing || isSummarizing) && (
          <div className="rounded-md bg-dark-200 px-3 py-1 text-xs text-blue-100">
            {isAnalyzing ? "Analyzing writing..." : "Generating summary..."}
          </div>
        )}

        {/* Writing suggestions panel */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="w-80 rounded-lg bg-dark-200 p-4 shadow-lg border border-dark-300">
            <div className="flex items-start mb-2">
              <div className="flex-grow">
                <h3 className="text-base font-semibold text-blue-400">
                  Writing Suggestions
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissSuggestions}
                className="p-0 h-6 w-6 rounded-full hover:bg-dark-400"
              >
                <Image
                  src="/assets/icons/close.svg"
                  width={12}
                  height={12}
                  alt="Close"
                />
              </Button>
            </div>

            <ul className="mb-3 space-y-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="text-sm text-blue-100 flex items-start gap-2"
                >
                  <span className="mt-0.5 text-blue-400">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateSummary}
                className="bg-dark-300 text-blue-100 hover:bg-dark-400"
              >
                Generate Summary
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={dismissSuggestions}
                className="bg-dark-300 text-blue-100 hover:bg-dark-400"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {/* Document summary panel */}
        {showSummary && docSummary && (
          <div className="w-80 rounded-lg bg-dark-200 p-4 shadow-lg border border-dark-300">
            <div className="flex items-start mb-2">
              <div className="flex-grow">
                <h3 className="text-base font-semibold text-blue-400">
                  Document Summary
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissSummary}
                className="p-0 h-6 w-6 rounded-full hover:bg-dark-400"
              >
                <Image
                  src="/assets/icons/close.svg"
                  width={12}
                  height={12}
                  alt="Close"
                />
              </Button>
            </div>

            <p className="mb-4 text-sm text-blue-100 leading-relaxed">
              {docSummary}
            </p>

            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGetSuggestions}
                className="bg-dark-300 text-blue-100 hover:bg-dark-400"
              >
                Get Suggestions
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={dismissSummary}
                className="bg-dark-300 text-blue-100 hover:bg-dark-400"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {/* AI Control Buttons */}
        {!showSummary && !showSuggestions && (
          <div className="flex gap-2">
            <Button
              onClick={handleGetSuggestions}
              disabled={isAnalyzing || docContent.trim().length < 100}
              size="sm"
              variant="outline"
              className="flex items-center gap-1 rounded-full bg-dark-300 text-blue-100 hover:bg-dark-400"
              title="Get writing suggestions"
            >
              <Image
                src="/assets/icons/journal-text.svg"
                alt="Suggestions"
                width={16}
                height={16}
                className="brightness-150 text-blue-300"
              />
              <span className="text-xs">Writing Tips</span>
            </Button>

            <Button
              onClick={handleGenerateSummary}
              disabled={isSummarizing || docContent.trim().length < 100}
              size="sm"
              variant="outline"
              className="flex items-center gap-1 rounded-full bg-dark-300 text-blue-100 hover:bg-dark-400"
              title="Generate document summary"
            >
              <Image
                src="/assets/icons/file.svg"
                alt="Summary"
                width={16}
                height={16}
                className="brightness-150 text-blue-300"
              />
              <span className="text-xs">Summarize</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
