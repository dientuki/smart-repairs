import React from 'react';
import { Button } from '@headlessui/react';
import { combineClasses } from "@/helper/componentsHelpers";

interface ActionButtonProps {
  customClass?: string; // Can contain multiple classes separated by spaces
  children: React.ReactNode; // The content of the button
  onClick?: () => void; // Function to execute on click
  type?: 'button' | 'submit' | 'reset'; // Button type
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  customClass = 'w-1/4',
  children,
  onClick,
  type = 'button'
}) => {

  const defaultClasses = `text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`;

  return (
    <Button
      as="button"
      className={combineClasses(defaultClasses, customClass)}
      onClick={onClick}
      type={type}
    >
      {children}
    </Button>
  );
};