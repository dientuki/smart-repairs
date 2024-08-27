import { useState } from "react";
import { InputCell } from "./InputCell";
import { RemoveRow } from "./RemoveRow";
import { AddRow } from "./AddRow";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@headlessui/react";
import ActionButton from "../form/ActionButton";


type BillItem = {
  description: string;
  quantity: number;
  price: number;
  addToTotal: boolean;
};

const defaultData: BillItem[] = [
  {
    description: 'Mano de obra',
    quantity: 1,
    price: 5000,
    addToTotal: true,
  },
  {
    description: 'Parte',
    quantity: 2,
    price: 5000,
    addToTotal: false,
  },
  {
    description: 'Otra cosa',
    quantity: 1,
    price: 1000,
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
    header: "Precio",
    cell: InputCell,
    meta: {
      type: "number",
      caca: "popo"
    }
  }),
  columnHelper.accessor("addToTotal", {
    header: "Suma?",
  }),
  columnHelper.display({
    id: "edit",
    cell: RemoveRow,
  }),
];


export const Table = () => {
  const [data, setData] = useState(() => [...defaultData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
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
          addToTotal: true,
        };
        const setFunc = (old: BillItem[]) => [...old, newRow];
        setData(setFunc);
        //setOriginalData(setFunc);
      },
      removeRow: (rowIndex: number) => {
        const setFilterFunc = (old: BillItem[]) =>
          old.filter((_row: BillItem, index: number) => index !== rowIndex);
        setData(setFilterFunc);
        //setOriginalData(setFilterFunc);
      },
    },
  });

  return (
    <>
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
            <td colSpan={2}>Total</td>
            <td colSpan={1} align="right">Precio</td>
            <td colSpan={2}></td>
          </tr>
        </tfoot>
      </table>
      <div className="mt-4">
          <ActionButton customClass=" mt-6">asdf</ActionButton>
      </div>

    </>
  );
};
