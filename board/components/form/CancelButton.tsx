import React from "react";
import { Button } from "@headlessui/react";
import { combineClasses } from "@/helper/componentsHelpers";

interface CancelButtonProps {
  className?: string; // Can contain multiple classes separated by spaces
  children: React.ReactNode; // The content of the button
  onClick?: () => void; // Function to execute on click
  type?: ButtonType; // Button type
}

export const CancelButton = ({
  className = "w-1/4",
  children,
  onClick,
  type = ButtonType.Button,
}: CancelButtonProps) => {
  const defaultClasses =
    "relative grid-flow-col items-center justify-center font-semibold outline-none transition duration-75 focus-visible:ring-2 rounded-lg  gap-1.5 px-3 py-2 text-sm inline-grid shadow-sm bg-white text-gray-950 hover:bg-gray-50 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 ring-1 ring-gray-950/10 dark:ring-white/20 [input:checked+&]:bg-gray-400 [input:checked+&]:text-white [input:checked+&]:ring-0 [input:checked+&]:hover:bg-gray-300 dark:[input:checked+&]:bg-gray-600 dark:[input:checked+&]:hover:bg-gray-500";

  return (
    <Button
      as='button'
      className={combineClasses(defaultClasses, className)}
      onClick={onClick}
      disabled={!onClick}
      type={type}
    >
      {children}
    </Button>
  );
};
