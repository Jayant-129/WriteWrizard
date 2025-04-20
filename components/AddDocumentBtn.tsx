"use client";

import { createDocument } from "@/lib/actions/room.actions";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const processingRef = useRef(false);

  const addDocumentHandler = async () => {
    // Double protection against multiple document creations:
    // 1. Check state variable for UI feedback
    // 2. Check ref for protection against potential double invocation from React
    if (isCreating || processingRef.current) return;

    setIsCreating(true);
    processingRef.current = true;

    try {
      const room = await createDocument({ userId, email });

      if (room) router.push(`/documents/${room.id}`);
      // Don't reset isCreating here since we're navigating away
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
      className="gradient-blue flex gap-1 shadow-md"
      disabled={isCreating}
    >
      {isCreating ? (
        <Image
          src="/assets/icons/loader.svg"
          alt="loading"
          width={24}
          height={24}
          className="animate-spin"
        />
      ) : (
        <Image src="/assets/icons/add.svg" alt="add" width={24} height={24} />
      )}
      <p className="hidden sm:block">
        {isCreating ? "Creating..." : "Start a blank document"}
      </p>
    </Button>
  );
};

export default AddDocumentBtn;
