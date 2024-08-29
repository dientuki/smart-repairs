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

  const defaultClasses = "text-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-300"


  return (
    <Button
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