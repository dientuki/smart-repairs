import { XCircleIcon } from "@heroicons/react/16/solid";

export const RemoveRow = ({ row, table }) => {
  const meta = table.options.meta;

  const removeRow = () => {
    console.log(row)
    meta?.removeRow(row.index);
  };

  return (
    <div className="edit-cell-container">
      { row.index != 0 &&
        <button className="text-red-500 hover:text-red-600" onClick={removeRow}>
            <XCircleIcon className="h-5 w-5" />
        </button>
      }
    </div>
  )
}