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


const newItem: Item = {
  id: '',
  quantity: 1,
  unitPrice: 0,
  totalPrice: 0,
  includeInSum: true,
};

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
    min: 0,
    valueAsNumber: true,
    validate: (value: number) => Number.isInteger(value),
  },
}

const defaultData: Item[] = [
  {
    id: 'init',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    includeInSum: true,
  },
  {
    id: 'init',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    includeInSum: true,
  }
];


export const BudgetModal = () => {
  const modal = useModalWindow<ModalParams>();
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const [data, setData] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { initialValues } = useBudgetStore();

  useEffect(() => {
    initialValues(modal.params.order)
    .then(() => {
      }
    )
    .finally(() => {
      setIsLoading(false)
      setData([...defaultData]);
    });
  }, []);

  useEffect(() => {
    const newTotal = data
      .filter(item => item.includeInSum)
      .reduce((acc, item) => acc + item.totalPrice, 0);
    setTotal(newTotal);
  }, [data]);

  const { remove } = useFieldArray({
    control,
    name: "items"
  });

  const columns = [
    columnHelper.accessor("id", {
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
        type: "number",
        className: "w-20",
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
        type: "number",
        className: "w-40",
      }
    }),
    columnHelper.accessor("totalPrice", {
      header: "Precio Total",
      meta: {
        className: "w-40",
      }
    }),
    columnHelper.accessor("includeInSum", {
      header: "Suma?",
      cell: BooleanCell,
      meta: {
        className: "w-20",
      }
    }),
    columnHelper.display({
      id: "edit",
      cell: RemoveRow,
      meta: {
        className: "w-10",
      }
    }),
  ];


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateId: (rowIndex: number, newId: string) => {
        setData(oldData =>
          oldData.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...row,
                id: newId,
              };
            }
            return row;
          })
        );
      },
      updatePrice: (rowIndex: number, columnId: string, value: string) => {
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
        const setFunc = (old: Item[]) => [...old, newItem];
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
    <ModalLayout minHeight="460px" width = '70vw' title={<h2>Presupuestar equipo</h2>}>
      { !isLoading &&
        <form
          onSubmit={handleSubmit(handleRegistration, handleError)}
          onKeyDown={handleKeyDown}
        >
          <table className="w-full relative overflow-x-auto shadow-md sm:rounded-lg">
            <thead className="text-xs text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className={header.column.columnDef.meta?.className || ''}>
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
                <tr key={row.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-2 py-1">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan={table.getCenterLeafColumns().length - 1} align="right">
                  Añadir item
                </td>
                <td>
                  <AddRow table={table} />
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="font-semibold text-gray-900 dark:text-white">
                <td className="px-2 py-1" colSpan={3} >Total</td>
                <td className="px-2 py-1" colSpan={1} align="right">{total}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
          <div className="mt-4">
              <ActionButton customClass=" mt-6" type="submit">Done</ActionButton>
          </div>


        </form>
      }
    </ModalLayout>
  )
}