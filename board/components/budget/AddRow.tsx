export const AddRow = ({ table }) => {
  const meta = table.options.meta

  return (
    <button className="add-button" onClick={meta?.addRow}>
      Add New +
    </button>
  )
}