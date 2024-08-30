import { useEffect, useState } from "react";

export const TotalPriceCell = ({ getValue, row, column, table }: InputCellProps) => {
  const initialValue = getValue();
  const [val, setVal] = useState(initialValue);

  useEffect(() => {
    setVal(initialValue);
  }, [initialValue]);


  return (
    <div className="relative flex items-center rounded-lg bg-gray-50 border text-gray-900 text-base border-gray-300 p-2.5">
      <div className="absolute inset-y-0 left-0 w-10 flex items-center justify-center bg-gray-200 rounded-l-lg pointer-events-none">
        <span className="text-gray-500 sm:text-sm">$</span>
      </div>
      <span className="ml-12 flex-grow text-base font-medium text-right">
        {val}
      </span>
    </div>
  );
};
