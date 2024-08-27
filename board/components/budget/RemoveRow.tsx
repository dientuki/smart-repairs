export const RemoveRow = ({ row, table }) => {
  const meta = table.options.meta;

  const removeRow = () => {
    console.log(row)
    meta?.removeRow(row.index);
  };

  return (
    <div className="edit-cell-container">
      { row.index != 0 && <button onClick={removeRow} name="remove">X</button>}
    </div>
  )
}