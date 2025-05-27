import Link from "next/link";
import { FileText, Clock, Users, MoreHorizontal } from "lucide-react";
import { DeleteModal } from "./DeleteModal";
import { dateConverter } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

interface DocumentCardProps {
  id: string;
  metadata: {
    title: string;
    creatorId: string;
    email?: string;
  };
  createdAt: string;
  collaborators?: any[];
  currentUserEmail?: string;
}

const DocumentCard = ({
  id,
  metadata,
  createdAt,
  collaborators = [],
  currentUserEmail,
}: DocumentCardProps) => {
  // Check if current user is the owner
  const isOwner =
    currentUserEmail === metadata.email ||
    currentUserEmail === metadata.creatorId;

  return (
    <div className="floating-card group hover:scale-[1.02] transition-all duration-300 animate-fade-in">
      <Link href={`/documents/${id}`} className="block">
        <div className="space-y-4">
          {/* Header with icon and actions */}
          <div className="flex items-center justify-between">
            <div className="p-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg group-hover:from-red-500/30 group-hover:to-orange-500/30 transition-all duration-300">
              <FileText className="w-6 h-6 text-red-400" />
            </div>
            {/* Only show delete button if user is the owner */}
            {isOwner && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <DeleteModal roomId={id} />
              </div>
            )}
          </div>

          {/* Document info */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-white line-clamp-2 group-hover:text-red-400 transition-colors duration-300">
                  {metadata.title || "Untitled Document"}
                </h3>
                {!isOwner && (
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full whitespace-nowrap">
                    Shared
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 line-clamp-1">
                {isOwner
                  ? "Click to open and start editing"
                  : "Shared document - Click to view"}
              </p>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-700/30">
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{dateConverter(createdAt)}</span>
              </div>

              {collaborators.length > 0 && (
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{collaborators.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DocumentCard;
