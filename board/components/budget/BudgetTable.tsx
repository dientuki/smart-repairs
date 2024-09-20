import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import {
  AddRow,
  BooleanCell,
  QuantityCell,
  RemoveRow,
  StaticAutocomplete,
  TotalPriceCell,
  UnitPriceCell,
} from "@/components/budget";
import {
  Control,
  FieldErrors,
  FieldValues,
  useFieldArray,
} from "react-hook-form";
import { capitalizeFirstLetter } from "@/helper/stringHelpers";
import { t } from "i18next";
import { PackageType, StyleColor } from "@/types/enums";
import { useBudgetStore, useUserStore } from "@/store";
import { ActionButton, FakeInput } from "../form";
import { Icon } from "../Icon";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

enum MorphType {
  service = "service",
  part = "part",
}

type Item = {
  id: string;
  itemId: string;
  itemType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  includeInSum: boolean;
};

const newItem: Item = {
  id: "",
  itemId: "",
  itemType: "",
  quantity: 1,
  unitPrice: 0,
  totalPrice: 0,
  includeInSum: true,
};

type TableProps = {
  control: Control<FieldValues>;
  errors?: FieldErrors<FieldValues>;
  budget?: any;
  description: any;
};

const registerOptions = {
  id: {
    required: false,
  },
  itemId: {
    required: false,
  },
  itemType: {
    required: false,
  },
  quantity: {
    required: true,
  },
  unitPrice: {
    required: true,
  },
  includeInSum: {
    required: true,
  },
};

const defaultData: Item[] = [
  {
    id: "",
    itemId: "",
    itemType: "",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    includeInSum: true,
  },
];

const columnHelper = createColumnHelper<Item>();

export const BudgetTable = ({
  control,
  errors,
  budget,
  description,
}: TableProps) => {
  const [data, setData] = useState<Item[]>([]);
  const { user } = useUserStore();
  const columns = [];

  useEffect(() => {
    setData(budget || [...defaultData]);
  }, []);

  /*
  useEffect(() => {
    console.log("data", data);
  }, [data]);
  */

  const { remove } = useFieldArray({
    control,
    name: "items",
  });

  columns.push(
    columnHelper.accessor("itemId", {
      header: capitalizeFirstLetter(t("budget.description")),
      cell: StaticAutocomplete,
      meta: {
        name: "items",
        control: control,
        rulesId: registerOptions.itemId,
        rulesType: registerOptions.itemType,
        errors: errors,
        data: description
      },
    }),
  );

  columns.push(
    columnHelper.accessor("quantity", {
      header: capitalizeFirstLetter(t("budget.quantity")),
      cell: QuantityCell,
      meta: {
        name: "items",
        control: control,
        rules: registerOptions.quantity,
        errors: errors,
        className: "w-20 text-center",
      },
    }),
  );

  columns.push(
    columnHelper.accessor("unitPrice", {
      header: capitalizeFirstLetter(t("budget.unit_price")),
      cell: UnitPriceCell,
      meta: {
        name: "items",
        control: control,
        rules: registerOptions.unitPrice,
        errors: errors,
        className: "w-40 text-center",
      },
    }),
  );

  columns.push(
    columnHelper.accessor("totalPrice", {
      header: capitalizeFirstLetter(t("budget.total_price")),
      cell: TotalPriceCell,
      meta: {
        className: "w-40 text-center",
      },
    }),
  );

  if (user?.package !== PackageType.Basic) {
    columns.push(
      columnHelper.accessor("includeInSum", {
        header: capitalizeFirstLetter(t("budget.sum")),
        cell: BooleanCell,
        meta: {
          name: "items",
          control: control,
          className: "w-20 text-center",
        },
      }),
    );
  }

  columns.push(
    columnHelper.display({
      id: "id",
      cell: RemoveRow,
      meta: {
        name: "items",
        control: control,
        className: "w-20",
      },
    }),
  );

  const updatePrice = (rowIndex: number, columnId: string, value: string) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          const newQuantity =
            columnId === "quantity" ? Number(value) : row.quantity;
          const newPrice =
            columnId === "unitPrice" ? Number(value) : row.unitPrice;
          const newPriceTotal = newQuantity * newPrice;

          return {
            ...row,
            [columnId]: Number(value),
            totalPrice: newPriceTotal,
          };
        }
        return row;
      }),
    );
  };

  const addRow = (newItem: Item) => {
    const setFunc = (old: Item[]) => [...old, newItem];
    setData(setFunc);
  };

  const removeRow = (remove: (index: number) => void, rowIndex: number) => {
    const setFilterFunc = (old: Item[]) =>
      old.filter((_row: Item, index: number) => index !== rowIndex);

    setData(setFilterFunc);
    remove(rowIndex);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updatePrice: (rowIndex: number, columnId: string, value: string) =>
        updatePrice(rowIndex, columnId, value),
      addRow: () => addRow(newItem),
      removeRow: (rowIndex: number) => removeRow(remove, rowIndex),
    },
  });

  return (
    <div className='divide-y divide-gray-200 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:divide-white/10 dark:bg-gray-900 dark:ring-white/10'>
      <table className='w-full table-auto divide-y divide-gray-200 text-start dark:divide-white/5'>
        <thead className='divide-y divide-gray-200 dark:divide-white/5'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className='bg-gray-50 dark:bg-white/5'>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`${header.column.columnDef.meta?.className || ""} px-3 py-3.5`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='divide-y divide-gray-200 whitespace-nowrap dark:divide-white/5'>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className='[@media(hover:hover)]:transition [@media(hover:hover)]:duration-75 hover:bg-gray-50 dark:hover:bg-white/5'
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className='p-2'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          <tr className='bg-gray-50 dark:bg-white/5'>
            <td
              colSpan={table.getCenterLeafColumns().length - 1}
              align='right'
              className='p-2'
            >
              { user?.package !== PackageType.Basic &&
                <ActionButton
                  onClick={table.options.meta?.addRow}
                  customClass='w-auto'
                  style={StyleColor.Warning}
                >
                  <Icon
                    icon={ExclamationTriangleIcon}
                    size={6}
                    style={StyleColor.Warning}
                  />
                  {t("budget.add_foreign_part")}
                </ActionButton>
              }
            </td>
            <td className='p-2'>
              <AddRow table={table} />
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr className='bg-gray-50 dark:bg-white/5'>
            <td className='px-2 py-1 text-right' colSpan={3}>
              Total:
            </td>
            <td className='px-2 py-1' colSpan={1}>
              <FakeInput value='58' icon={user?.currency} />
            </td>
            <td colSpan={2}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
