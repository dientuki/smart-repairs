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
  DescriptionCell,
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
import { useUserStore } from "@/store";
import { ActionButton, FakeInput } from "../form";
import { Icon } from "../Icon";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { BudgetColumns } from "@/types/budget";

type Item = {
  id: string;
  itemable: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  includeInSum: boolean;
  total: 0;
};

const newItem: Item = {
  id: "",
  itemable: "",
  quantity: 1,
  unitPrice: 0,
  totalPrice: 0,
  includeInSum: true,
  total: 0,
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
  itemable: {
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
    itemable: "",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    includeInSum: true,
    total: 0,
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
  const { remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    setData([...defaultData]);
  }, []);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  columns.push(
    columnHelper.accessor(BudgetColumns.Itemable, {
      header: capitalizeFirstLetter(t("budget.description")),
      cell: DescriptionCell,
      meta: {
        name: "items",
        control: control,
        rules: registerOptions.itemable,
        errors: errors,
        data: description,
      },
    }),
  );

  columns.push(
    columnHelper.accessor(BudgetColumns.Quantity, {
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
    columnHelper.accessor(BudgetColumns.UnitPrice, {
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
    columnHelper.accessor(BudgetColumns.TotalPrice, {
      header: capitalizeFirstLetter(t("budget.total_price")),
      cell: TotalPriceCell,
      meta: {
        className: "w-40 text-center",
      },
    }),
  );

  if (user?.package !== PackageType.Basic) {
    columns.push(
      columnHelper.accessor(BudgetColumns.IncludeInSum, {
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
    console.log("value", value, data);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          const newQuantity =
            columnId === BudgetColumns.Quantity ? Number(value) : row.quantity;
          const newPrice =
            columnId === BudgetColumns.UnitPrice
              ? Number(value)
              : row.unitPrice;
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

  const resetRow = (rowIndex: number) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            quantity: 1,
            unitPrice: 0,
            totalPrice: 0,
            itemable: "",
          };
        }
        return row;
      }),
    );
  };

  const addRow = () => {
    const setFunc = (old: Item[]) => [...old, newItem];
    setData(setFunc);
  };

  const removeRow = (rowIndex: number) => {
    const setFilterFunc = (old: Item[]) =>
      old.filter((_row: Item, index: number) => index !== rowIndex);

    setData(setFilterFunc);
    remove(rowIndex);
  };

  const updateItem = (rowIndex: number, itemable: any) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            itemable,
          };
        }
        return row;
      }),
    );
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updatePrice: (rowIndex: number, columnId: string, value: string) =>
        updatePrice(rowIndex, columnId, value),
      resetRow,
      addRow: () => addRow(),
      removeRow: (rowIndex: number) => removeRow(rowIndex),
      updateItem,
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
              {user?.package !== PackageType.Basic && (
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
              )}
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
              <FakeInput
                value='58'
                icon={user?.currency}
                className='text-right'
              />
            </td>
            <td colSpan={2}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
