import { useOthers } from "@liveblocks/react/suspense";
import { User } from "lucide-react";

const ActiveCollaborators = () => {
  const others = useOthers();

  const collaborators = others.map((other) => other.info);

  return (
    <ul className="collaborators-list">
      {collaborators.map((collaborator: any, index: number) => (
        <li key={collaborator?.id || index}>
          {collaborator?.avatar ? (
            <img
              src={collaborator.avatar}
              alt={collaborator.name || "Collaborator"}
              className="inline-block size-8 rounded-full ring-2 ring-dark-100"
              style={{ border: `3px solid ${collaborator.color || "#6366f1"}` }}
            />
          ) : (
            <div
              className="inline-block size-8 rounded-full ring-2 ring-dark-100 bg-gray-700 flex items-center justify-center"
              style={{
                border: `3px solid ${collaborator?.color || "#6366f1"}`,
              }}
            >
              <User className="w-4 h-4 text-gray-300" />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ActiveCollaborators;
