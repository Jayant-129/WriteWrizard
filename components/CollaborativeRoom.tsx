"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { Editor } from "@/components/editor/Editor";
import Header from "@/components/Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import ActiveCollaborators from "./ActiveCollaborators";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { updateDocument } from "@/lib/actions/room.actions";
import Loader from "./Loader";
import ShareModal from "./ShareModal";
import { useDebounce } from "@/lib/hooks/useDebounce";
import Notifications from "./Notifications";
import RealTimePermissions from "./RealTimePermissions";

const CollaborativeRoom = ({
  roomId,
  roomMetadata,
  users,
  currentUserType,
}: CollaborativeRoomProps) => {
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [realTimeUserType, setRealTimeUserType] = useState(currentUserType);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the document title to reduce API calls
  const debouncedTitle = useDebounce(documentTitle, 500);

  // Get user email from users array for real-time permissions
  const currentUserEmail = users.find(
    (user) => user.userType === currentUserType
  )?.email;

  const updateTitleHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      setLoading(true);

      try {
        if (documentTitle !== roomMetadata.title) {
          const updatedDocument = await updateDocument(roomId, documentTitle);

          if (updatedDocument) {
            setEditing(false);
          }
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    }
  };

  // Auto-save on title change
  useEffect(() => {
    if (debouncedTitle !== roomMetadata.title && debouncedTitle.trim()) {
      const autoSave = async () => {
        setLoading(true);
        try {
          await updateDocument(roomId, debouncedTitle);
        } catch (error) {
          console.error("Auto-save failed:", error);
        }
        setLoading(false);
      };

      autoSave();
    }
  }, [debouncedTitle, roomId, roomMetadata.title]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setEditing(false);
        if (documentTitle !== roomMetadata.title) {
          updateDocument(roomId, documentTitle);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [roomId, documentTitle, roomMetadata.title]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <RealTimePermissions userEmail={currentUserEmail || roomMetadata.email}>
          <div className="collaborative-room">
            <Header>
              <div
                ref={containerRef}
                className="flex items-center gap-3 min-w-0 flex-1"
              >
                {editing && !loading ? (
                  <Input
                    type="text"
                    value={documentTitle}
                    ref={inputRef}
                    placeholder="Enter document title..."
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    onKeyDown={updateTitleHandler}
                    disabled={!editing}
                    className="document-title-input"
                  />
                ) : (
                  <div className="flex items-center gap-2 min-w-0">
                    <h1 className="document-title truncate">
                      {documentTitle || "Untitled Document"}
                    </h1>
                    {currentUserType === "editor" && !editing && (
                      <button
                        onClick={() => setEditing(true)}
                        className="p-1 rounded hover:bg-gray-800/50 transition-colors duration-200 opacity-60 hover:opacity-100"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                )}

                {currentUserType !== "editor" && !editing && (
                  <span className="view-only-tag">View only</span>
                )}

                {loading && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <ActiveCollaborators />

                <ShareModal
                  roomId={roomId}
                  collaborators={users}
                  creatorId={roomMetadata.creatorId}
                  currentUserType={currentUserType}
                />

                <Notifications />

                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </Header>
            <Editor
              roomId={roomId}
              currentUserType={currentUserType}
              title={documentTitle}
            />
          </div>
        </RealTimePermissions>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;
