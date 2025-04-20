"use client";

import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { generateTitle, analyzeThemes } from "@/lib/actions/ai.actions";
import { updateDocument } from "@/lib/actions/room.actions";
import { Button } from "../ui/button";
import Image from "next/image";

interface TitleSuggestionProps {
  roomId: string;
  currentTitle: string;
}

export default function TitleSuggestion({
  roomId,
  currentTitle,
}: TitleSuggestionProps) {
  const [editor] = useLexicalComposerContext();
  const [suggestedTitle, setSuggestedTitle] = useState<string>("");
  const [documentThemes, setDocumentThemes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [docContent, setDocContent] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for document content changes and update content state
  useEffect(() => {
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        setDocContent(root.getTextContent());
      });
    });

    return () => {
      unregister();
    };
  }, [editor]);

  // Function to manually trigger title generation
  const generateTitleManually = async () => {
    if (docContent.trim().length < 20) {
      setError("Document content is too short. Add more content first.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Generate title suggestion
      const titleResult = await generateTitle(docContent);

      if (titleResult && titleResult !== "Untitled Document") {
        setSuggestedTitle(titleResult);
        setShowSuggestion(true);
      }

      // Analyze document themes/topics
      const themes = await analyzeThemes(docContent);
      if (themes && themes.length > 0) {
        setDocumentThemes(themes);
      }
    } catch (error) {
      console.error("Error generating title:", error);
      setError(
        "Failed to generate title. Make sure your API key is set correctly."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyTitleSuggestion = async () => {
    setIsLoading(true);
    try {
      await updateDocument(roomId, suggestedTitle);
      setShowSuggestion(false);
    } catch (error) {
      console.error("Failed to update title:", error);
      setError("Failed to update title.");
    } finally {
      setIsLoading(false);
    }
  };

  const dismissSuggestion = () => {
    setShowSuggestion(false);
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex flex-col items-end gap-2">
          {error && (
            <div className="rounded-md bg-red-900/80 px-3 py-1 text-xs text-white">
              {error}
            </div>
          )}

          {isAnalyzing && (
            <div className="rounded-md bg-dark-200 px-3 py-1 text-xs text-blue-100">
              AI processing document...
            </div>
          )}

          {/* AI title suggestion panel */}
          {showSuggestion && suggestedTitle && (
            <div className="w-80 rounded-lg bg-dark-200 p-4 shadow-lg border border-dark-300">
              <div className="flex items-start mb-2">
                <div className="flex-grow">
                  <h3 className="text-base font-semibold text-blue-400 flex items-center gap-1">
                    AI Title Suggestion
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={dismissSuggestion}
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

              <p className="mb-4 text-sm text-blue-100">{suggestedTitle}</p>

              {documentThemes.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-blue-100 opacity-70 mb-1">
                    Identified themes:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {documentThemes.map((theme, index) => (
                      <span
                        key={index}
                        className="text-xs bg-dark-400 text-blue-100/80 px-2 py-0.5 rounded-full"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={dismissSuggestion}
                  className="bg-dark-300 text-blue-100 hover:bg-dark-400"
                >
                  Dismiss
                </Button>
                <Button
                  size="sm"
                  onClick={applyTitleSuggestion}
                  disabled={isLoading}
                  className="bg-blue-500 text-white hover:bg-blue-400 flex items-center gap-1"
                >
                  {isLoading ? (
                    <>
                      <Image
                        src="/assets/icons/loader.svg"
                        alt="loading"
                        width={16}
                        height={16}
                        className="animate-spin"
                      />
                      <span>Applying...</span>
                    </>
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* AI Control Button */}
          <Button
            onClick={generateTitleManually}
            disabled={isAnalyzing || docContent.trim().length < 20}
            size="sm"
            variant="outline"
            className="flex items-center gap-1 rounded-full bg-dark-300 text-blue-100 hover:bg-dark-400"
            title="Generate title suggestion"
          >
            <Image
              src="/assets/icons/journal-text.svg"
              alt="Generate"
              width={16}
              height={16}
              className="brightness-150 text-blue-300"
            />
            <span className="text-xs">Suggest Title</span>
          </Button>
        </div>
      </div>
    </>
  );
}
