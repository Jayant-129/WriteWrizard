"use client";

import Theme from "./plugins/Theme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import React, { useState, useEffect } from "react";

import {
  FloatingComposer,
  FloatingThreads,
  liveblocksConfig,
  LiveblocksPlugin,
  useIsEditorReady,
} from "@liveblocks/react-lexical";
import { useRoom } from "@liveblocks/react";
import Loader from "../Loader";

import FloatingToolbarPlugin from "./plugins/FloatingToolbarPlugin";
import AIMenuDropdown from "./AIMenuDropdown";
import { useThreads } from "@liveblocks/react/suspense";
import Comments from "../Comments";
import { DeleteModal } from "../DeleteModal";

function Placeholder() {
  return (
    <div className="editor-placeholder text-gray-500 text-lg">
      ✨ Start writing your masterpiece...
    </div>
  );
}

function EditorContent({
  roomId,
  currentUserType,
  title,
}: {
  roomId: string;
  currentUserType: UserType;
  title: string;
}) {
  const isEditorReady = useIsEditorReady();
  const { threads } = useThreads();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isEditorReady) {
      const timer = setTimeout(() => setIsInitialized(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isEditorReady]);

  console.log("Editor ready:", isEditorReady, "Initialized:", isInitialized);

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full">
        <Loader />
        <p className="text-gray-400 mt-4 animate-pulse">
          Loading your workspace...
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Editor Ready: {isEditorReady ? "Yes" : "No"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="comments-section w-full lg:w-80 flex-shrink-0 min-w-0 order-2 lg:order-1">
        <div className="sticky top-6 space-y-4">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 shadow-xl">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-1.946-.274A5.978 5.978 0 0111 20c-3.309 0-6-2.691-6-6 0-1.075.29-2.085.794-2.952A8.001 8.001 0 1721 12z"
                />
              </svg>
              Comments & Discussions
            </h3>
            <div className="space-y-4">
              <FloatingComposer className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg shadow-lg overflow-hidden" />
              <div className="space-y-2 max-h-[400px] lg:max-h-[500px] overflow-y-auto custom-scrollbar">
                <FloatingThreads threads={threads} />
                <Comments />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="editor-section flex-1 flex flex-col items-center order-1 lg:order-2">
        <div className="editor-inner w-full max-w-[800px] bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl shadow-blue-500/10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 rounded-xl"></div>
          <div className="relative z-10 min-h-[75vh]">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="editor-input relative z-10 p-8 min-h-full outline-none" />
              }
              placeholder={<Placeholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          {currentUserType === "editor" && <FloatingToolbarPlugin />}
          <HistoryPlugin />
          <AutoFocusPlugin />
        </div>
      </div>

      <div className="ai-section w-full lg:w-80 flex-shrink-0 order-3">
        <div className="sticky top-6">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 shadow-xl">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              AI Writing Assistant
            </h3>
            {currentUserType === "editor" && (
              <AIMenuDropdown
                roomId={roomId}
                currentTitle={title}
                currentUserType={currentUserType}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function Editor({
  roomId,
  currentUserType,
  title,
}: {
  roomId: string;
  currentUserType: UserType;
  title: string;
}) {
  const room = useRoom();

  if (!room) {
    console.error("Room is not available in the React tree");
    return (
      <div className="flex items-center justify-center h-64 text-red-400 bg-red-900/20 rounded-lg border border-red-500">
        <div className="text-center">
          <div className="text-2xl mb-2">⚠️</div>
          <div>Error loading editor: Room not available</div>
        </div>
      </div>
    );
  }

  const initialConfig = liveblocksConfig({
    namespace: "Editor",
    nodes: [HeadingNode],
    onError: (error: Error) => {
      console.error(error);
      throw error;
    },
    theme: Theme,
    editable: currentUserType === "editor",
  });

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="toolbar-wrapper flex min-w-full justify-between items-center p-4 bg-black/80 backdrop-blur-xl border-b border-blue-500/20 shadow-lg">
          <div className="flex items-center">
            <ToolbarPlugin />
          </div>
          <div className="flex items-center">
            {currentUserType === "editor" && <DeleteModal roomId={roomId} />}
          </div>
        </div>

        <div className="editor-wrapper flex min-h-screen p-4 md:p-6 gap-4 md:gap-6 flex-col lg:flex-row">
          <LiveblocksPlugin>
            <EditorContent
              roomId={roomId}
              currentUserType={currentUserType}
              title={title}
            />
          </LiveblocksPlugin>
        </div>
      </div>
    </LexicalComposer>
  );
}
