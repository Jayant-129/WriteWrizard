"use client";

import { createDocument } from "@/lib/actions/room.actions";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Plus } from "lucide-react";

const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const processingRef = useRef(false);

  const addDocumentHandler = async () => {
    if (isCreating || processingRef.current) return;

    setIsCreating(true);
    processingRef.current = true;

    try {
      const room = await createDocument({ userId, email });

      if (room) router.push(`/documents/${room.id}`);
    } catch (error) {
      console.log(error);
      setIsCreating(false);
      processingRef.current = false;
    }
  };

  return (
    <Button
      type="submit"
      onClick={addDocumentHandler}
      className="gradient-red modern-button group relative overflow-hidden"
      disabled={isCreating}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

      {isCreating ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="hidden sm:block">Creating...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:block">New Document</span>
        </div>
      )}
    </Button>
  );
};

export default AddDocumentBtn;
