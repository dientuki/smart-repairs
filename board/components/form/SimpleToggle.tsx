import { InputType } from "@/types/enums";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface SimpleToggleProps {
  name: string;
  value: string;
  text: string;
  register: UseFormRegister<FieldValues>;
}

export const SimpleToggle = ({ name, value, text, register }: SimpleToggleProps) => {
  return (
    <label className='flex items-center mb-5 cursor-pointer'>
      <input
        type={InputType.Checkbox}
        {...register(name)}
        value={value}
        className='sr-only peer'
      />
      <div className="relative w-9 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
      {text && (
        <span className='ms-3 text-base font-medium text-gray-900 dark:text-gray-300'>
          {text}
        </span>
      )}
    </label>
  );
};
