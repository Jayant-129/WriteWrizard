import { User } from "lucide-react";
import React, { useState } from "react";
import UserTypeSelector from "./UserTypeSelector";
import { Button } from "./ui/button";
import {
  removeCollaborator,
  updateDocumentAccess,
} from "@/lib/actions/room.actions";
import { useRouter } from "next/navigation";

const Collaborator = ({
  roomId,
  creatorId,
  collaborator,
  email,
  user,
}: CollaboratorProps) => {
  const [userType, setUserType] = useState(collaborator.userType || "viewer");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if current user can remove this collaborator
  const canRemoveCollaborator =
    user.id === creatorId && collaborator.id !== creatorId;

  const shareDocumentHandler = async (type: string) => {
    setLoading(true);

    await updateDocumentAccess({
      roomId,
      email,
      userType: type as UserType,
      updatedBy: user,
    });

    // Trigger custom event for real-time permission updates
    window.dispatchEvent(new CustomEvent('permissionUpdated', {
      detail: { email, userType: type, roomId }
    }));

    setLoading(false);
  };

  const removeCollaboratorHandler = async (email: string) => {
    setLoading(true);

    try {
      await removeCollaborator({ roomId, email });
      router.refresh(); // Refresh to update the collaborator list
    } catch (error) {
      console.error("Error removing collaborator:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className="flex items-center justify-between gap-2 py-3">
      <div className="flex gap-2">
        {collaborator.avatar ? (
          <img
            src={collaborator.avatar}
            alt={collaborator.name}
            className="size-9 rounded-full"
          />
        ) : (
          <div className="size-9 rounded-full bg-gray-700 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-300" />
          </div>
        )}
        <div>
          <p className="line-clamp-1 text-sm font-semibold leading-4 text-white">
            {collaborator.name}
            <span className="text-10-regular pl-2 text-red-200">
              {loading && "updating..."}
            </span>
          </p>
          <p className="text-sm font-light text-red-200">
            {collaborator.email}
          </p>
        </div>
      </div>

      {creatorId === collaborator.id ? (
        <p className="text-sm text-red-200">Owner</p>
      ) : (
        <div className="flex items-center gap-2">
          <UserTypeSelector
            userType={userType as UserType}
            setUserType={setUserType || "viewer"}
            onClickHandler={shareDocumentHandler}
          />
          {canRemoveCollaborator && (
            <Button
              type="button"
              onClick={() => removeCollaboratorHandler(collaborator.email)}
              className="remove-btn text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 py-1 text-xs"
              disabled={loading}
            >
              {loading ? "Removing..." : "Remove"}
            </Button>
          )}
        </div>
      )}
    </li>
  );
};

export default Collaborator;
