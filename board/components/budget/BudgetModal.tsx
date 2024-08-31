import "react-modal-global/styles/modal.scss" // Imports essential styles for `ModalContainer`.
import { ModalLayout } from "@/components/modal";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { AddRow, RemoveRow, BooleanCell, QuantityCell, UnitPriceCell, TotalPriceCell } from "@/components/budget";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ActionButton } from "@/components/form";
import { FieldErrors, FieldValues, useFieldArray, useForm } from "react-hook-form";
import { useBudgetStore, useServiceJobStore } from "@/store";
import { StaticAutocomplete } from "./StaticAutocomplete";
import { useModalWindow } from "react-modal-global";
import { DiscountType } from "@/types/enums";
import { capitalizeFirstLetter } from "@/helper/stringHelpers";
import { toast } from "react-toastify";

type Item = {
  itemId: string;
  serviceId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  includeInSum: boolean;
  type: "service" | "discount" | "part"
};

type ModalParams = {
  order: string;
};

const newItem: Item = {
  itemId: '',
  serviceId: '',
  quantity: 1,
  unitPrice: 0,
  totalPrice: 0,
  includeInSum: true,
  type: "part"
};

const columnHelper = createColumnHelper<Item>();

const registerOptions = {
  serviceId: {
    required: true,
  },
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
    itemId: 'init',
    serviceId: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    includeInSum: true,
    type: "service"
  },
  {
    itemId: 'init',
    serviceId: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    includeInSum: true,
    type: "discount"
  }
];


export const BudgetModal = () => {
  const modal = useModalWindow<ModalParams>();
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const [data, setData] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { clear: clearBudget, initialValues, updateBudget } = useBudgetStore();
  const { clear: clearService, discounts } = useServiceJobStore();

  useEffect(() => {
    console.log('después de limpiar--------------->', discounts);
  }, [discounts]);

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
    if (data.length === 0) return;
    let discount:number = 0;

    const subtotal:number = data
      .filter((item, index) => index === 0 || (index > 1 && item.includeInSum))
      .reduce((acc, item) => acc + item.totalPrice, 0);

    const discountItem = data[1];

    if  (discountItem.serviceId && discountItem.includeInSum) {

      const discountDetail = discounts.find(d => d.id === discountItem.serviceId);

      if (discountDetail && discountDetail.info) {
        switch (discountDetail?.info.discount_type) {
          case DiscountType.Percentage:
            discount =  (subtotal * discountItem.unitPrice) / 100; // Descuento porcentual
            break;
          case DiscountType.Amount:
            discount =  discountItem.unitPrice; // Descuento fijo
            break;
        }
      }
    }

    const total = subtotal - discount;

    if (data[1].totalPrice !== discount) {
      const newData = [...data];
      newData[1] = { ...newData[1], totalPrice: discount };
      setData(newData);
    }

    setTotal(total);
  }, [data]);

  const { remove } = useFieldArray({
    control,
    name: "items"
  });

  const columns = [
    columnHelper.accessor("serviceId", {
      header: capitalizeFirstLetter(t('budget.description')),
      cell: StaticAutocomplete,
      meta: {
        name: "items",
        control: control,
        rules: registerOptions.serviceId,
        errors: errors,
      }
    }),

    columnHelper.accessor("quantity", {
      header: capitalizeFirstLetter(t('budget.quantity')),
      cell: QuantityCell,
      meta: {
        name: "items",
        control: control,
        rules: registerOptions.quantity,
        errors: errors,
        className: "w-20 text-center",
      }
    }),
    columnHelper.accessor("unitPrice", {
      header: capitalizeFirstLetter(t('budget.unit_price')),
      cell: UnitPriceCell,
      meta: {
        name: "items",
        control: control,
        rules: registerOptions.unitPrice,
        errors: errors,
        className: "w-40 text-center",
      }
    }),
    columnHelper.accessor("totalPrice", {
      header: capitalizeFirstLetter(t('budget.total_price')),
      cell: TotalPriceCell,
      meta: {
        className: "w-40 text-center",
      }
    }),
    columnHelper.accessor("includeInSum", {
      header: `¿${capitalizeFirstLetter(t('budget.sum'))}?`,
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
      updateServiceId: (rowIndex: number, newId: string) => {
        setData(oldData =>
          oldData.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...row,
                serviceId: newId,
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

              // Lógica para las demás filas
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
      updateSum: (rowIndex: number, newValue: boolean) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              // Actualiza solo el valor de 'include_in_sum'
              return {
                ...row,
                includeInSum: newValue,
              };
            }
            return row;
          })
        )
      },
      addRow: () => {
        const canAdd = data.every(item => item.itemId === "init" || item.serviceId !== '');
        if (canAdd) {
          const setFunc = (old: Item[]) => [...old, newItem];
          setData(setFunc);
        } else {
          toast.error(capitalizeFirstLetter(t(`budget.error.can_add`)));
        }
      },
      removeRow: (rowIndex: number) => {
        const setFilterFunc = (old: Item[]) =>
          old.filter((_row: Item, index: number) => index !== rowIndex);
        setData(setFilterFunc);
        remove(rowIndex);
      },
    },
  });

  const handleRegistration = async(_: FieldValues ) => {

    console.log('antes de limpiar', useServiceJobStore.getState().discounts);
    clearService(['services', 'discounts']);
    console.log('después de limpiar', useServiceJobStore.getState().discounts);
    //modal.close();
    /*
    const $result = await updateBudget(modal.params.order, data);
    if ($result) {
      clearBudget('parts');
      clearService(['services', 'discounts']);
      console.log('despues de limpiar', discounts);
      toast.success(t(`toast.success.form`));
      modal.close();
    }
      */
  }

  const handleError = (_: FieldErrors<FieldValues>) => {
    toast.error(t(`toast.error.form`));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Evita que se envíe el formulario al presionar Enter
    }
  };

  return (
    <ModalLayout minHeight="460px" width = '70vw' title={<h2 className="text-2xl font-medium leading-6 text-gray-900 mb-4">Presupuestar equipo</h2>}>
      { !isLoading &&
        <form
          onSubmit={handleSubmit(handleRegistration, handleError)}
          onKeyDown={handleKeyDown}
        >
          <table className="w-full relative overflow-x-auto shadow-md sm:rounded-lg text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-lg text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className={`${header.column.columnDef.meta?.className || ''} py-1 px-2`}>
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
                    <td key={cell.id} className="p-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan={table.getCenterLeafColumns().length - 1} align="right" className="border-t-4 border-green-500 py-3">
                  <div className="first-letter:uppercase cursor-pointer float-right" onClick={table.options.meta?.addRow}>{t('budget.new_item')}</div>
                </td>
                <td className="border-t-4 border-green-500">
                  <AddRow table={table} />
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="font-semibold text-gray-900 dark:text-white text-lg">
                <td className="px-2 py-1 text-right" colSpan={3}>Total:</td>
                <td className="px-2 py-1" colSpan={1}>
                  <div className="relative flex items-center rounded-lg bg-gray-50 border text-gray-900 text-base border-gray-300 p-2.5">
                    <div className="absolute inset-y-0 left-0 w-10 flex items-center justify-center bg-gray-200 rounded-l-lg pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <span className="ml-12 flex-grow text-base font-medium text-right">
                      {total}
                    </span>
                  </div>
                </td>
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