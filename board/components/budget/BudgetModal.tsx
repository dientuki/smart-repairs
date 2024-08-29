import "react-modal-global/styles/modal.scss" // Imports essential styles for `ModalContainer`.
import { ModalLayout } from "@/components/modal";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { AddRow, InputCell, RemoveRow, BooleanCell } from "@/components/budget";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ActionButton } from "@/components/form";
import { FieldErrors, FieldValues, useFieldArray, useForm } from "react-hook-form";
import { useBudgetStore } from "@/store";
import { StaticAutocomplete } from "./StaticAutocomplete";
import { useModalWindow } from "react-modal-global";

type Item = {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  includeInSum: boolean;
};

type ModalParams = {
  order: string;
};

const defaultData: Item[] = [
  {
    description: 'Mano de obra',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    includeInSum: true,
  },
  {
    description: 'Parte',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    includeInSum: false,
  },
];
const columnHelper = createColumnHelper<Item>();

const registerOptions = {
  quantity: {
    required: true,
    min: 1,
    valueAsNumber: true,
    validate: (value: number) => Number.isInteger(value),
  },
  unitPrice: {
    required: true,
    valueAsNumber: true,
    validate: (value: number) => Number.isInteger(value),
  },
}


export const BudgetModal = () => {
  const modal = useModalWindow<ModalParams>();
  const { t } = useTranslation();
  const [data, setData] = useState(() => [...defaultData]);
  const [total, setTotal] = useState(0);
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { initialValues } = useBudgetStore();

  useEffect(() => {
    initialValues(modal.params.order);
  }, []);

  useEffect(() => {
    const newTotal = data
      .filter(item => item.includeInSum)
      .reduce((acc, item) => acc + item.totalPrice, 0);

    setTotal(newTotal);
    console.log(data);
  }, [data]);

  const { remove } = useFieldArray({
    control,
    name: "items"
  });

  const columns = [
    columnHelper.accessor("description", {
      header: "Description",
      cell: StaticAutocomplete,
    }),

    columnHelper.accessor("quantity", {
      header: "Cantidad",
      cell: InputCell,
      meta: {
        name: "items",
        control: control,
        rules: registerOptions.quantity,
        errors: errors,
        type: "number"
      }
    }),
    columnHelper.accessor("unitPrice", {
      header: "Precio unitario",
      cell: InputCell,
      meta: {
        name: "items",
        control: control,
        rules: registerOptions.unitPrice,
        errors: errors,
        type: "number"
      }
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
      updateItem: (rowIndex: number, newPrice: number) => {
        setData(oldData =>
          oldData.map((row, index) => {
            if (index === rowIndex) {
              // Actualiza el precio unitario y recalcula el precio total
              const newTotalPrice = row.quantity * newPrice;
              return {
                ...row,
                unitPrice: newPrice,
                totalPrice: newTotalPrice,
              };
            }
            return row;
          })
        );
      },
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
        const newRow: Item = {
          description: "text",
          quantity: 1,
          unitPrice: 200,
          totalPrice: 1000,
          includeInSum: true,
        };
        const setFunc = (old: Item[]) => [...old, newRow];
        setData(setFunc);
      },
      removeRow: (rowIndex: number) => {
        const setFilterFunc = (old: Item[]) =>
          old.filter((_row: Item, index: number) => index !== rowIndex);
        setData(setFilterFunc);
        remove(rowIndex);
      },
    },
  });

  const handleRegistration = async(data: FieldValues ) => {
    console.log('submit', data)
    return false;
  }

  const handleError = (error: FieldErrors<FieldValues>) => {
    console.log('error', error)
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Evita que se envíe el formulario al presionar Enter
    }
  };

  return (
    <ModalLayout minHeight="460px" width = '70vw'>
      <h2>Presupuestar equipo</h2>
      <form onSubmit={handleSubmit(handleRegistration, handleError)} onKeyDown={handleKeyDown}>
        <table className="w-full">
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
            <ActionButton customClass=" mt-6" type="submit">Done</ActionButton>
        </div>


      </form>
    </ModalLayout>
  )
}