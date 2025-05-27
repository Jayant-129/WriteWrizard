"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import {
  generateTitle,
  analyzeThemes,
  getSuggestions,
  generateSummary,
} from "@/lib/actions/ai.actions";
import { Button } from "../ui/button";
import {
  Sparkles,
  Type,
  Lightbulb,
  FileText,
  X,
  Loader2,
  Wand2,
} from "lucide-react";

interface AIMenuDropdownProps {
  roomId: string;
  currentTitle: string;
  currentUserType: UserType;
}

export default function AIMenuDropdown({
  roomId,
  currentTitle,
  currentUserType,
}: AIMenuDropdownProps) {
  const [editor] = useLexicalComposerContext();
  const [docContent, setDocContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // States for different AI features
  const [suggestedTitle, setSuggestedTitle] = useState<string>("");
  const [documentThemes, setDocumentThemes] = useState<string[]>([]);
  const [writingSuggestions, setWritingSuggestions] = useState<string[]>([]);
  const [documentSummary, setDocumentSummary] = useState<string>("");

  // Display states
  const [showTitlePanel, setShowTitlePanel] = useState(false);
  const [showSuggestionsPanel, setShowSuggestionsPanel] = useState(false);
  const [showSummaryPanel, setShowSummaryPanel] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Listen for document content changes and update content state
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

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handler for generating title suggestion
  const handleGenerateTitle = useCallback(async () => {
    if (docContent.trim().length < 20) {
      setError("Document content is too short. Add more content first.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setShowDropdown(false);
    setIsProcessing(true);
    setProcessingType("title");
    setError(null);

    try {
      // Generate title suggestion
      const titleResult = await generateTitle(docContent);

      if (titleResult && titleResult !== "Untitled Document") {
        setSuggestedTitle(titleResult);

        // Get themes for the document
        const themes = await analyzeThemes(docContent);
        if (themes && themes.length > 0) {
          setDocumentThemes(themes);
        }

        // Show the title panel
        setShowTitlePanel(true);
        setShowSuggestionsPanel(false);
        setShowSummaryPanel(false);
      }
    } catch (error: any) {
      console.error("Error generating title:", error);
      setError(`Failed to generate title: ${error.message || "API error"}`);
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
    }
  }, [docContent]);

  // Handler for generating writing suggestions
  const handleGetSuggestions = useCallback(async () => {
    if (docContent.trim().length < 100) {
      setError("Document content is too short. Add more content first.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setShowDropdown(false);
    setIsProcessing(true);
    setProcessingType("suggestions");
    setError(null);

    try {
      const suggestions = await getSuggestions(docContent);

      if (suggestions && suggestions.length > 0) {
        setWritingSuggestions(suggestions);
        setShowSuggestionsPanel(true);
        setShowTitlePanel(false);
        setShowSummaryPanel(false);
      } else {
        setError("No suggestions available. Try with different content.");
      }
    } catch (error: any) {
      console.error("Error getting writing suggestions:", error);
      setError(`Failed to get suggestions: ${error.message || "API error"}`);
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
    }
  }, [docContent]);

  // Handler for generating document summary
  const handleGenerateSummary = useCallback(async () => {
    if (docContent.trim().length < 100) {
      setError("Document content is too short. Add more content first.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setShowDropdown(false);
    setIsProcessing(true);
    setProcessingType("summary");
    setError(null);

    try {
      const summary = await generateSummary(docContent);

      if (summary) {
        setDocumentSummary(summary);
        setShowSummaryPanel(true);
        setShowTitlePanel(false);
        setShowSuggestionsPanel(false);
      }
    } catch (error: any) {
      console.error("Error generating summary:", error);
      setError(`Failed to generate summary: ${error.message || "API error"}`);
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
    }
  }, [docContent]);

  // Toggle dropdown - close if any panel is already showing
  const toggleDropdown = () => {
    // If any panel is showing, don't open dropdown
    if (showTitlePanel || showSuggestionsPanel || showSummaryPanel) {
      return;
    }
    setShowDropdown((prev) => !prev);
  };

  // Close panels and allow dropdown to be opened again
  const dismissPanel = () => {
    setShowTitlePanel(false);
    setShowSuggestionsPanel(false);
    setShowSummaryPanel(false);
  };

  // Only show for editors
  if (currentUserType !== "editor") {
    return null;
  }

  return (
    <>
      {/* AI Output Panels - positioned with higher z-index */}
      <div className="fixed bottom-20 right-4 z-[1000]">
        <div className="flex flex-col items-end gap-2">
          {/* Error message */}
          {error && (
            <div className="rounded-md bg-red-900/80 px-3 py-1 text-xs text-white">
              {error}
            </div>
          )}

          {/* Processing indicator */}
          {isProcessing && (
            <div className="rounded-md bg-dark-200 px-3 py-1 text-xs text-red-100">
              {processingType === "title" && "Generating title..."}
              {processingType === "suggestions" && "Analyzing writing..."}
              {processingType === "summary" && "Generating summary..."}
            </div>
          )}

          {/* Title suggestion panel */}
          {showTitlePanel && suggestedTitle && (
            <div className="w-80 rounded-lg bg-dark-200 p-4 shadow-lg border border-dark-300">
              <div className="flex items-start mb-2">
                <div className="flex-grow">
                  <h3 className="text-base font-semibold text-red-400">
                    AI Title Suggestion
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={dismissPanel}
                  className="p-0 h-6 w-6 rounded-full hover:bg-dark-400"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>

              <p className="mb-4 text-sm text-red-100">{suggestedTitle}</p>

              {documentThemes.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-red-100 opacity-70 mb-1">
                    Identified themes:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {documentThemes.map((theme, index) => (
                      <span
                        key={index}
                        className="text-xs bg-dark-400 text-red-100/80 px-2 py-0.5 rounded-full"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={dismissPanel}
                  className="bg-dark-300 text-red-100 hover:bg-dark-400"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          {/* Writing suggestions panel */}
          {showSuggestionsPanel && writingSuggestions.length > 0 && (
            <div className="w-80 rounded-lg bg-dark-200 p-4 shadow-lg border border-dark-300">
              <div className="flex items-start mb-2">
                <div className="flex-grow">
                  <h3 className="text-base font-semibold text-red-400">
                    Writing Suggestions
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={dismissPanel}
                  className="p-0 h-6 w-6 rounded-full hover:bg-dark-400"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>

              <ul className="mb-3 space-y-2">
                {writingSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="text-sm text-red-100 flex items-start gap-2"
                  >
                    <span className="mt-0.5 text-red-400">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateSummary}
                  className="bg-dark-300 text-red-100 hover:bg-dark-400"
                >
                  Generate Summary
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={dismissPanel}
                  className="bg-dark-300 text-red-100 hover:bg-dark-400"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          {/* Document summary panel */}
          {showSummaryPanel && documentSummary && (
            <div className="w-80 rounded-lg bg-dark-200 p-4 shadow-lg border border-dark-300">
              <div className="flex items-start mb-2">
                <div className="flex-grow">
                  <h3 className="text-base font-semibold text-red-400">
                    Document Summary
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={dismissPanel}
                  className="p-0 h-6 w-6 rounded-full hover:bg-dark-400"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>

              <p className="mb-4 text-sm text-red-100 leading-relaxed">
                {documentSummary}
              </p>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={dismissPanel}
                  className="bg-dark-300 text-red-100 hover:bg-dark-400"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Menu Button with Custom Dropdown - positioned separately */}
      <div className="fixed bottom-4 right-4 z-[900]" ref={dropdownRef}>
        <div className="relative">
          {/* Main trigger button */}
          <button
            className="flex items-center gap-1 rounded-full bg-black text-white hover:bg-gray-900 hover:text-white border border-white px-4 py-2"
            title="AI Features"
            disabled={isProcessing}
            onClick={toggleDropdown}
          >
            <Wand2 className="w-5 h-5" />
            <span className="text-sm">AI</span>
          </button>

          {/* Custom dropdown menu */}
          {showDropdown && (
            <div className="absolute bottom-full right-0 mb-2 w-56 p-1 bg-black border border-white text-white rounded-md shadow-lg z-[999] overflow-hidden">
              <div className="flex flex-col gap-1">
                <div
                  onClick={handleGenerateTitle}
                  className={`flex items-center justify-start gap-2 py-2 px-3 text-sm text-white hover:bg-gray-800 rounded cursor-pointer ${
                    isProcessing || docContent.trim().length < 20
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <Type className="w-4 h-4" />
                  <span>Generate Title</span>
                </div>
                <div
                  onClick={handleGetSuggestions}
                  className={`flex items-center justify-start gap-2 py-2 px-3 text-sm text-white hover:bg-gray-800 rounded cursor-pointer ${
                    isProcessing || docContent.trim().length < 100
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Writing Tips</span>
                </div>
                <div
                  onClick={handleGenerateSummary}
                  className={`flex items-center justify-start gap-2 py-2 px-3 text-sm text-white hover:bg-gray-800 rounded cursor-pointer ${
                    isProcessing || docContent.trim().length < 100
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Summarize</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
