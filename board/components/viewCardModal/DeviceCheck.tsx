import {
  CheckCircleIcon,
  ChevronUpIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {Icon} from "@/components/Icon";
import { StyleColor } from "@/types/enums";
import { useState } from "react";

export const DeviceCheck = () => {
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
        <div className='flex  items-center gap-3'>Validaciones</div>
        <div
          className={`relative flex items-center justify-center rounded-lg outline-none transition duration-75 focus-visible:ring-2 -m-2 h-9 w-9 text-gray-400 hover:text-gray-500 focus-visible:ring-primary-600 dark:text-gray-500 dark:hover:text-gray-400 dark:focus-visible:ring-primary-500 ${isToggled ? "rotate-180" : "rotate-0"}`}
        >
          <Icon size={5} icon={ChevronUpIcon} />
        </div>
      </div>

      <div
        className={`border-t border-gray-200 dark:border-white/10 p-3 ${isToggled ? "invisible absolute h-0 overflow-hidden border-none" : ""}`}
      >
        <div className='flex justify-between w-full'>
          <p className='w-2/3'>Camara trasera</p>
          <p className='w-1/3'>
            <Icon size={6} icon={CheckCircleIcon} style={StyleColor.Success} />
          </p>
        </div>
        <div className='flex justify-between w-full'>
          <p className='w-2/3'>Pantalla</p>
          <p className='w-1/3'>
            <Icon size={6} icon={XCircleIcon} style={StyleColor.Danger} />
          </p>
        </div>
      </div>
    </div>
  );
};
