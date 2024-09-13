import React from 'react';
import { Button } from '@headlessui/react';
import { combineClasses } from "@/helper/componentsHelpers";

interface ActionButtonProps {
  customClass?: string; // Can contain multiple classes separated by spaces
  children: React.ReactNode; // The content of the button
  onClick?: () => void; // Function to execute on click
  type?: 'button' | 'submit' | 'reset'; // Button type
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  customClass = 'w-1/4',
  children,
  onClick,
  type = 'button',
  disabled = false
}) => {

  const style = {
    "--c-400": "var(--danger-400)",
    "--c-500": "var(--danger-500)",
    "--c-600": "var(--danger-600)",
  };

  const defaultClasses = "fi-btn relative grid-flow-col items-center justify-center font-semibold outline-none transition duration-75 focus-visible:ring-2 rounded-lg fi-color-custom fi-btn-color-danger fi-color-danger fi-size-md fi-btn-size-md gap-1.5 px-3 py-2 text-sm inline-grid shadow-sm bg-custom-600 text-white hover:bg-custom-500 focus-visible:ring-custom-500/50 dark:bg-custom-500 dark:hover:bg-custom-400 dark:focus-visible:ring-custom-400/50 fi-ac-action fi-ac-btn-action"


  return (
    <Button
      style={style}
      as="button"
      className={combineClasses(defaultClasses, customClass)}

      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </Button>
  );
};