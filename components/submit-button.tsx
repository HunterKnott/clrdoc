"use client";

import { Button } from "@/components/ui/button";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="bg-blue-500 text-white p-2 rounded mt-4"
      aria-disabled={pending}
      {...props}
    >
      {pending ? pendingText : children}
    </button>
  );
}
