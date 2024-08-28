import "react-modal-global/styles/modal.scss" // Imports essential styles for `ModalContainer`.
import ModalLayout from "@/components/modal/ModalLayout";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { AddRow, InputCell, RemoveRow, BooleanCell } from "@/components/budget";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ActionButton } from "@/components/form";

type BillItem = {
  description: string;
  quantity: number;
  price: number;
  priceTotal: number;
  addToTotal: boolean;
};

const defaultData: BillItem[] = [
  {
    description: 'Mano de obra',
    quantity: 1,
    price: 5000,
    priceTotal: 5000,
    addToTotal: true,
  },
  {
    description: 'Parte',
    quantity: 2,
    price: 5000,
    priceTotal: 10000,
    addToTotal: false,
  },
  {
    description: 'Otra cosa',
    quantity: 1,
    price: 1000,
    priceTotal: 1000,
    addToTotal: false,
  }
];
const columnHelper = createColumnHelper<BillItem>();

const columns = [
  columnHelper.accessor("description", {
    header: "Description",
  }),
  columnHelper.accessor("quantity", {
    header: "Cantidad",
    cell: InputCell,
    meta: {type: "number"}
  }),
  columnHelper.accessor("price", {
    header: "Precio unitario",
    cell: InputCell,
    meta: {
      type: "number",
      caca: "popo"
    }
  }),
  columnHelper.accessor("priceTotal", {
    header: "Precio Total",
  }),
  columnHelper.accessor("addToTotal", {
    header: "Suma?",
    cell: BooleanCell
  }),
  columnHelper.display({
    id: "edit",
    cell: RemoveRow,
  }),
];

export const BudgetModal = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(() => [...defaultData]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newTotal = data
      .filter(item => item.addToTotal)  // Filtrar solo los elementos donde addToTotal es true
      .reduce((acc, item) => acc + item.priceTotal, 0);  // Sumar los priceTotal de esos elementos

    setTotal(newTotal);
  }, [data]);


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {

              const newQuantity = columnId === 'quantity' ? Number(value) : row.quantity;
              const newPrice = columnId === 'price' ? Number(value) : row.price;
              const newPriceTotal = newQuantity * newPrice;

              return {
                ...row,
                [columnId]: Number(value),
                priceTotal: newPriceTotal,
              };
            }
            return row;
          })
        );
      },
      addRow: () => {
        const newRow: BillItem = {
          description: "text",
          quantity: 1,
          price: 200,
          priceTotal: 1000,
          addToTotal: true,
        };
        const setFunc = (old: BillItem[]) => [...old, newRow];
        setData(setFunc);
      },
      removeRow: (rowIndex: number) => {
        const setFilterFunc = (old: BillItem[]) =>
          old.filter((_row: BillItem, index: number) => index !== rowIndex);
        setData(setFilterFunc);
      },
    },
  });

  return (
    <ModalLayout minHeight="460px">
      <h2>Presupuestar equipo</h2>
      <div>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td colSpan={table.getCenterLeafColumns().length} align="right">
                <AddRow table={table} />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} >Total</td>
              <td colSpan={1} align="right">{total}</td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-4">
          <ActionButton customClass=" mt-6">asdf {total}</ActionButton>
        </div>

      </div>
    </ModalLayout>
  )
}