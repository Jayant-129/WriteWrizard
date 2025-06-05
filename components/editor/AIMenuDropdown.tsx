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

  const [suggestedTitle, setSuggestedTitle] = useState<string>("");
  const [documentThemes, setDocumentThemes] = useState<string[]>([]);
  const [writingSuggestions, setWritingSuggestions] = useState<string[]>([]);
  const [documentSummary, setDocumentSummary] = useState<string>("");

  const [showTitlePanel, setShowTitlePanel] = useState(false);
  const [showSuggestionsPanel, setShowSuggestionsPanel] = useState(false);
  const [showSummaryPanel, setShowSummaryPanel] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

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
    <div className="w-full max-w-4xl mx-auto">
      {/* AI Menu Button with Custom Dropdown - positioned below comments */}
      <div className="flex justify-center mt-8 mb-6" ref={dropdownRef}>
        <div className="relative">
          {/* Main trigger button */}
          <button
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-[2px] transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/30 ${
              isProcessing
                ? "cursor-not-allowed"
                : "hover:shadow-2xl hover:shadow-purple-500/25"
            }`}
            title="AI Features"
            disabled={isProcessing}
            onClick={toggleDropdown}
          >
            <div className="relative rounded-2xl bg-gray-900/90 backdrop-blur-sm px-6 py-3 transition-all duration-300 group-hover:bg-gray-900/70">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-purple-400 transition-transform duration-300 group-hover:rotate-12" />
                  )}
                </div>
                <span className="text-sm font-semibold text-white">
                  AI Assistant
                </span>
                <div
                  className={`transition-transform duration-300 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </button>

          {/* Custom dropdown menu */}
          {showDropdown && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl shadow-black/50 z-[999] overflow-hidden">
              <div className="p-2">
                <div className="mb-3 px-4 py-2">
                  <h3 className="text-sm font-semibold text-gray-300">
                    AI Tools
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Enhance your writing with AI assistance
                  </p>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={handleGenerateTitle}
                    disabled={isProcessing || docContent.trim().length < 20}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                      isProcessing || docContent.trim().length < 20
                        ? "opacity-40 cursor-not-allowed bg-gray-800/30"
                        : "hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:scale-[1.02] cursor-pointer group"
                    }`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <Type className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-white">
                        Generate Title
                      </div>
                      <div className="text-xs text-gray-400">
                        Create a compelling title for your document
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleGetSuggestions}
                    disabled={isProcessing || docContent.trim().length < 100}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                      isProcessing || docContent.trim().length < 100
                        ? "opacity-40 cursor-not-allowed bg-gray-800/30"
                        : "hover:bg-gradient-to-r hover:from-yellow-600/20 hover:to-orange-600/20 hover:scale-[1.02] cursor-pointer group"
                    }`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-white">
                        Writing Tips
                      </div>
                      <div className="text-xs text-gray-400">
                        Get suggestions to improve your writing
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleGenerateSummary}
                    disabled={isProcessing || docContent.trim().length < 100}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                      isProcessing || docContent.trim().length < 100
                        ? "opacity-40 cursor-not-allowed bg-gray-800/30"
                        : "hover:bg-gradient-to-r hover:from-green-600/20 hover:to-emerald-600/20 hover:scale-[1.02] cursor-pointer group"
                    }`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                      <FileText className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-white">
                        Summarize
                      </div>
                      <div className="text-xs text-gray-400">
                        Generate a concise summary of your content
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Output Panels - positioned in normal document flow */}
      <div className="w-full flex flex-col items-center gap-4 mb-8">
        {/* Error message */}
        {error && (
          <div className="w-full max-w-md rounded-xl bg-red-900/90 backdrop-blur-sm border border-red-500/50 px-4 py-3 text-sm text-white shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <X className="w-3 h-3 text-red-400" />
              </div>
              {error}
            </div>
          </div>
        )}

        {/* Processing indicator */}
        {isProcessing && (
          <div className="w-full max-w-md rounded-xl bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 px-4 py-3 text-sm text-gray-300 shadow-lg">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-purple-400 flex-shrink-0" />
              <span>
                {processingType === "title" && "Generating title..."}
                {processingType === "suggestions" && "Analyzing writing..."}
                {processingType === "summary" && "Generating summary..."}
              </span>
            </div>
          </div>
        )}

        {/* Title suggestion panel */}
        {showTitlePanel && suggestedTitle && (
          <div className="w-full max-w-2xl rounded-xl bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 p-6 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Type className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  AI Title Suggestion
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissPanel}
                className="p-2 h-8 w-8 rounded-full hover:bg-gray-800/50 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="mb-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-blue-100 font-medium">{suggestedTitle}</p>
            </div>

            {documentThemes.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Identified themes:</p>
                <div className="flex flex-wrap gap-2">
                  {documentThemes.map((theme, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full border border-gray-700/50"
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
                className="bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border-gray-600/50"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {/* Writing suggestions panel */}
        {showSuggestionsPanel && writingSuggestions.length > 0 && (
          <div className="w-full max-w-2xl rounded-xl bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 p-6 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Writing Suggestions
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissPanel}
                className="p-2 h-8 w-8 rounded-full hover:bg-gray-800/50 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3 mb-6">
              {writingSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                >
                  <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-yellow-400">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateSummary}
                className="bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border-gray-600/50"
              >
                Generate Summary
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={dismissPanel}
                className="bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border-gray-600/50"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {/* Document summary panel */}
        {showSummaryPanel && documentSummary && (
          <div className="w-full max-w-2xl rounded-xl bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 p-6 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Document Summary
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissPanel}
                className="p-2 h-8 w-8 rounded-full hover:bg-gray-800/50 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-gray-200 leading-relaxed">{documentSummary}</p>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={dismissPanel}
                className="bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border-gray-600/50"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
