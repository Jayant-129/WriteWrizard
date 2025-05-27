"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useSelf } from "@liveblocks/react/suspense";
import React, { useState, useCallback } from "react";
import { Button } from "./ui/button";
import {
  Share2,
  Mail,
  UserPlus,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import UserTypeSelector from "./UserTypeSelector";
import Collaborator from "./Collaborator";
import { updateDocumentAccess } from "@/lib/actions/room.actions";
import { useRouter } from "next/navigation";

const ShareModal = ({
  roomId,
  collaborators,
  creatorId,
  currentUserType,
}: ShareDocumentDialogProps) => {
  const user = useSelf();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<UserType>("viewer");

  const shareDocumentHandler = useCallback(async () => {
    if (!email.trim()) {
      setError("Please enter a valid email address");
      return;
    }

    // Check if user is already a collaborator
    if (collaborators.some((c) => c.email === email.trim())) {
      setError("This user is already a collaborator");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateDocumentAccess({
        roomId,
        email: email.trim(),
        userType: userType as UserType,
        updatedBy: user.info as User,
      });

      setSuccess(true);
      setEmail("");
      setTimeout(() => setSuccess(false), 3000);

      // Trigger custom event for real-time permission updates
      window.dispatchEvent(
        new CustomEvent("permissionUpdated", {
          detail: { email: email.trim(), userType, roomId },
        })
      );

      // Refresh the page to update collaborator list
      router.refresh();
    } catch (err) {
      setError("Failed to invite user. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [email, userType, roomId, user.info, collaborators]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setEmail("");
    setError(null);
    setSuccess(false);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="gradient-red flex h-9 gap-2 px-4 hover:scale-105 transition-all duration-300 shadow-lg"
          disabled={currentUserType !== "editor"}
          onClick={() => setOpen(true)}
        >
          <Share2 className="w-4 h-4" />
          <p className="mr-1 hidden sm:block">Share</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog glass-card max-w-lg">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg">
              <UserPlus className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-white">
                Share Document
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Invite others to collaborate on this document
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Status Messages */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700/50 rounded-lg text-red-300">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-700/50 rounded-lg text-green-300">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Invitation sent successfully!</span>
            </div>
          )}

          <div className="space-y-3">
            <Label
              htmlFor="email"
              className="text-red-100 font-medium flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email address
            </Label>
            <div className="space-y-3">
              <div className="flex flex-1 rounded-lg bg-gray-800/50 border border-gray-700/50 overflow-hidden focus-within:border-red-500/50 transition-colors">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      shareDocumentHandler();
                    }
                  }}
                  className="share-input border-none bg-transparent focus-visible:ring-0"
                  disabled={loading}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <Label className="text-sm text-gray-400 mb-2 block">
                    Permission Level
                  </Label>
                  <UserTypeSelector
                    userType={userType}
                    setUserType={setUserType}
                  />
                </div>
                <Button
                  type="submit"
                  onClick={shareDocumentHandler}
                  className="gradient-red flex h-11 gap-2 px-6 hover:scale-105 transition-all duration-300 shadow-lg"
                  disabled={loading || !email.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Invite</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {collaborators.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Current Collaborators ({collaborators.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                <ul className="space-y-2">
                  {collaborators.map((collaborator) => (
                    <li
                      key={collaborator.id}
                      className="glass-effect rounded-lg p-3 hover:bg-white/10 transition-colors"
                    >
                      <Collaborator
                        roomId={roomId}
                        creatorId={creatorId}
                        email={collaborator.email}
                        collaborator={collaborator}
                        user={user.info as User}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
