import {
  CheckCircleIcon,
  ChevronUpIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Icon } from "@/components/Icon";
import { useState } from "react";
import { capitalizeFirstLetter } from "@/helper/stringHelpers";
import { dynamicStyles } from "@/helper/componentsHelpers";

// Define la interfaz para las propiedades del componente
interface ChecklistDisplayProps {
  title: string;
  checklist: { value: string; checked: boolean }[];
  extraDetails?: string;
  error: string;
}

export const ChecklistDisplay = ({
  title,
  checklist,
  extraDetails = "",
  error,
}: ChecklistDisplayProps) => {
  const [isToggled, setIsToggled] = useState(true);

  const toggleClasses = () => {
    setIsToggled(!isToggled);
  };

  return (
    <div className='rounded-xl shadow-sm ring-1 ring-gray-950/5 dark:ring-white/10 bg-white dark:bg-white/5'>
      <div
        className='flex flex-row justify-between gap-3 cursor-pointer p-3'
        onClick={toggleClasses}
      >
        <div className='flex items-center gap-3'>
          {capitalizeFirstLetter(title)}
        </div>
        <div
          className={`relative flex items-center justify-center rounded-lg outline-none transition duration-75 focus-visible:ring-2 -m-2 h-9 w-9 text-gray-400 hover:text-gray-500 focus-visible:ring-primary-600 dark:text-gray-500 dark:hover:text-gray-400 dark:focus-visible:ring-primary-500 ${isToggled ? "rotate-180" : "rotate-0"}`}
        >
          <Icon size={5} icon={ChevronUpIcon} />
        </div>
      </div>

      <div
        className={`border-t border-gray-200 dark:border-white/10 p-3 flex flex-col gap-2 ${isToggled ? "invisible absolute h-0 overflow-hidden border-none" : ""}`}
      >
        {checklist.length > 0 ? (
          checklist.map((item, index) => (
            <div className='flex justify-between w-full' key={index}>
              <p className='w-2/3 first-letter:uppercase'>{item.value}</p>
              <p className='w-1/3'>
                <Icon
                  size={6}
                  icon={item.checked ? CheckCircleIcon : XCircleIcon}
                  style={item.checked ? StyleColor.Success : StyleColor.Danger}
                />
              </p>
            </div>
          ))
        ) : (
          <p
            style={dynamicStyles(StyleColor.Gray)}
            className='font-semibold text-custom-600 dark:text-custom-400 group-hover/link:underline group-focus-visible/link:underline first-letter:uppercase'
          >
            {error}
          </p> // Mensaje de error
        )}
        {extraDetails && (
          <div>
            <p>{extraDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
};
