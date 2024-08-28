import "react-modal-global/styles/modal.scss" // Imports essential styles for `ModalContainer`.
import ModalLayout from "@/components/modal/ModalLayout";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { AddRow, InputCell, RemoveRow, BooleanCell } from "@/components/budget";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ActionButton } from "../form";
import { FieldErrors, FieldValues, useFieldArray, useForm } from "react-hook-form";

type BillItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  includeInSum: boolean;
};

const defaultData: BillItem[] = [
  {
    description: 'Mano de obra',
    quantity: 1,
    unitPrice: 5000,
    totalPrice: 5000,
    includeInSum: true,
  },
  {
    description: 'Parte',
    quantity: 2,
    unitPrice: 5000,
    totalPrice: 10000,
    includeInSum: false,
  },
  {
    description: 'Otra cosa',
    quantity: 1,
    unitPrice: 1000,
    totalPrice: 1000,
    includeInSum: false,
  }
];
const columnHelper = createColumnHelper<BillItem>();

const registerOptions = {
  quantity: {
    required: true
  }
}

export const BudgetModal = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(() => [...defaultData]);
  const [total, setTotal] = useState(0);
  const { control, handleSubmit } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    const newTotal = data
      .filter(item => item.includeInSum)  // Filtrar solo los elementos donde includeInSum es true
      .reduce((acc, item) => acc + item.totalPrice, 0);  // Sumar los priceTotal de esos elementos

    setTotal(newTotal);
  }, [data]);

  const columns = [
    columnHelper.accessor("description", {
      header: "Description",
    }),

    columnHelper.accessor("quantity", {
      header: "Cantidad",
      cell: InputCell,
      meta: {
        name: "items",
        control: control,
        rules: registerOptions.quantity,
      }
    }),
    columnHelper.accessor("unitPrice", {
      header: "Precio unitario",

    }),
    columnHelper.accessor("totalPrice", {
      header: "Precio Total",
    }),
    columnHelper.accessor("includeInSum", {
      header: "Suma?",
      cell: BooleanCell
    }),
    columnHelper.display({
      id: "edit",
      cell: RemoveRow,
    }),
  ];


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
              const newPrice = columnId === 'unitPrice' ? Number(value) : row.unitPrice;
              const newPriceTotal = newQuantity * newPrice;

              return {
                ...row,
                [columnId]: Number(value),
                totalPrice: newPriceTotal,
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
          unitPrice: 200,
          totalPrice: 1000,
          includeInSum: true,
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

  const handleRegistration = async(data: FieldValues ) => {
    console.log(data)
    return false;
  }

  const handleError = (error: FieldErrors<FieldValues>) => {
    console.log('error', error)
  };

  return (
    <ModalLayout minHeight="460px">
      <h2>Presupuestar equipo</h2>
      <form onSubmit={handleSubmit(handleRegistration, handleError)}>
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
            <ActionButton customClass=" mt-6" type="submit">asdf {total}</ActionButton>
        </div>


      </form>
    </ModalLayout>
  )
}