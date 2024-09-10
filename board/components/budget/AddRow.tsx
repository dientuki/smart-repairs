import { PlusCircleIcon } from "@heroicons/react/16/solid"

export const AddRow = ({ table }) => {
  const meta = table.options.meta

  return (
    <div className="flex justify-center items-center">
      <button type="button" className="text-green-500 hover:text-green-600" onClick={meta?.addRow}>
          <PlusCircleIcon className="h-5 w-5" />
      </button>
    </div>
  )
}