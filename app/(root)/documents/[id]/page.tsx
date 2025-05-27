import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Document = async ({ params: { id } }: SearchParamProps) => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  if (!room) redirect("/");

  const userIds = Object.keys(room.usersAccesses);
  const users = await getClerkUsers({ userIds });

  const usersData = users.map((user: User) => {
    // Check if user and email exist before accessing
    if (!user || !user.email) {
      return {
        ...user,
        userType: "viewer", // Default to viewer for users without email
      };
    }

    const userAccess = room.usersAccesses[user.email];
    return {
      ...user,
      userType: userAccess?.includes("room:write") ? "editor" : "viewer",
    };
  });

  const currentUserAccess =
    room.usersAccesses[clerkUser.emailAddresses[0].emailAddress];
  const currentUserType = currentUserAccess?.includes("room:write")
    ? "editor"
    : "viewer";

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  );
};

export default Document;
