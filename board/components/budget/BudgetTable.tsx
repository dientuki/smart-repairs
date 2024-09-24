import {
  BudgetColumns,
  DiscountType,
  InputType,
  Itemable,
  PackageType,
  StyleColor,
} from "@/types/enums";
import {
  ActionButton,
  CancelButton,
  FakeInput,
  InputField,
  HiddenInput,
} from "@/components/form";
import { Icon } from "@/components/Icon";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { t } from "i18next";
import {
  Control,
  FieldErrors,
  FieldValues,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store";
import { capitalizeFirstLetter } from "@/helper/stringHelpers";
import { DescriptionCell } from "./DescriptionCell";
import { BudgetResume } from "./BudgetResume";

interface Item {
  id: string;
  itemable: { [key: string]: { [key: string]: string } | string } | string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  includeInSum: boolean;
  qdisabled: boolean;
  type: string;
}

const newItem: Item = {
  id: "",
  itemable: "",
  quantity: 1,
  unitPrice: 0,
  totalPrice: 0,
  qdisabled: false,
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
  itemable: {
    required: true,
  },
  quantity: {
    required: true,
    min: 1,
  },
  unitPrice: {
    required: true,
    min: 0,
  },
  includeInSum: {
    required: true,
  },
};

export const BudgetTable = ({
  control,
  errors,
  budget,
  description
}: TableProps) => {
  const [data, setData] = useState<Item[]>([]);
  const { user } = useUserStore();
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "items",
  });
  const { getValues, register, setValue } = useForm();
  const [badgetResumeData, setBudgetResumeData] = useState<BudgetResumeData>({
    subtotal: 0,
    discount: 0,
    total: 0,
  });

  const defaultData: Item[] = [
    {
      id: "",
      itemable: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      includeInSum: true,
      qdisabled: false,
      type: "",
      currency: user?.currency,
    },
  ];

  useEffect(() => {
    //setData(budget || [...defaultData]);
    append(defaultData);
    setData([...defaultData]);
  }, []);

  useEffect(() => {
    const properData = data.filter((item) => item.itemable != "");
    if (data.length === 0 || properData.length === 0) {
      setBudgetResumeData({
        subtotal: 0,
        discount: 0,
        total: 0,
      });
      return;
    }

    let discountPercentageTotal = 0;
    let hasUpdated = false;

    const subTotal = properData
      .filter(
        (item) =>
          item.includeInSum &&
          (item.itemable.info.item_type.indexOf(Itemable.Part) !== -1 ||
            item.itemable.info.item_type.indexOf(Itemable.ServiceJob) !== -1),
      )
      .reduce((acc, item) => {
        return acc + item.totalPrice; // O cualquier otra propiedad que quieras sumar
      }, 0);

    const discountFixed = properData
      .filter(
        (item) =>
          item.includeInSum &&
          item.itemable.info.item_type.indexOf(Itemable.Discount) !== -1 &&
          item.itemable.info.type === DiscountType.Amount,
      )
      .reduce((acc, item) => {
        return acc + item.unitPrice; // O cualquier otra propiedad que quieras sumar
      }, 0);

    data
      .filter((item) => item.itemable != "")
      .filter(
        (item) =>
          item.includeInSum &&
          item.itemable.info.item_type.indexOf(Itemable.Discount) !== -1 &&
          item.itemable.info.type === DiscountType.Percentage,
      )
      .forEach((item) => {
        const discountPercentageValue = (subTotal * item.unitPrice) / 100;
        discountPercentageTotal += discountPercentageValue;

        // Actualiza directamente en `data`
        if (item.totalPrice !== discountPercentageValue) {
          item.totalPrice = discountPercentageValue; // Actualiza el totalPrice
          hasUpdated = true; // Marca que hubo un cambio
        }
      });

    const newBudgetResumeData = {
      subtotal: subTotal,
      discount: discountFixed + discountPercentageTotal,
      total: subTotal - (discountFixed + discountPercentageTotal),
    };

    setBudgetResumeData(newBudgetResumeData);

    if (hasUpdated && discountPercentageTotal > 0) {
      setData([...data]); // Crea una nueva referencia a `data` para evitar mutación
    }
  }, [data]); // Ejecuta cuando budgetResume cambie

  const header = [
    {
      header: capitalizeFirstLetter(t("budget.description")),
    },
    {
      header: capitalizeFirstLetter(t("budget.quantity")),
      className: "w-20 text-center",
    },
    {
      header: capitalizeFirstLetter(t("budget.unit_price")),
      className: "w-40 text-center",
    },
    {
      header: capitalizeFirstLetter(t("budget.total_price")),
      className: "w-40 text-center",
    },
  ];

  if (user?.package !== PackageType.Basic) {
    header.push({
      header: capitalizeFirstLetter(t("budget.sum")),
      className: "w-20 text-center",
    });
  }

  header.push({
    header: "",
    className: "w-20",
  });

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
    //setTimeout(() => refreshRow(rowIndex), 100); // refreshRow(rowIndex);
  };

  const getType = (str: string) => {
    const tmp = str.split("\\");
    return t(`budget.type.${tmp[tmp.length - 1].toLowerCase()}`);
  };

  const updateDescription = (rowIndex: number, itemable: any) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          const newRow = row;
          newRow.itemable = itemable;
          newRow.quantity =
            itemable.info.item_type.indexOf(Itemable.Part) === -1
              ? 1
              : row.quantity;
          newRow.unitPrice = parseFloat(itemable.info.price);
          newRow.qdisabled =
            itemable.info.item_type.indexOf(Itemable.Part) === -1
              ? true
              : false;
          newRow.currency = user?.currency;
          newRow.totalPrice = newRow.quantity * newRow.unitPrice;
          newRow.type = getType(itemable.info.item_type);

          if (itemable.info.item_type.indexOf(Itemable.Discount) !== -1) {
            if (itemable.info.type.indexOf(DiscountType.Percentage) !== -1) {
              newRow.currency = "%";
              newRow.totalPrice = row.totalPrice;
            }
          }

          update(index, {
            ...newRow,
          });
          return {
            ...newRow,
          };
        }
        return row;
      }),
    );
  };

  const refreshRow = (rowIndex: number) => {
    console.log("blue");
    update(rowIndex, {
      ...data[rowIndex],
    });
  };

  const removeRow = (rowIndex: number) => {
    const setFilterFunc = (old: Item[]) =>
      old.filter((_row: Item, index: number) => index !== rowIndex);

    setData(setFilterFunc);
    remove(rowIndex);
  };

  const updatePrice = (rowIndex: number, updates: UpdateField[]) => {
    setData((prevData) =>
      prevData.map((row, index) => {
        if (index === rowIndex) {
          console.log(data, updates);
          let newQuantity = row.quantity; // Valor predeterminado: el valor actual
          let newUnitPrice = row.unitPrice; // Valor predeterminado: el valor actual

          // Iteramos sobre las actualizaciones para modificar los valores
          updates.forEach(({ columnId, value }) => {
            if (columnId === BudgetColumns.Quantity) {
              newQuantity = value; // Actualiza la cantidad
            } else if (columnId === BudgetColumns.UnitPrice) {
              newUnitPrice = value; // Actualiza el precio unitario
            }
          });

          // Calcula el nuevo precio total
          const newTotalPrice = newQuantity * newUnitPrice;

          return {
            ...row,
            quantity: parseInt(newQuantity, 10), // Actualizamos la cantidad
            unitPrice: parseFloat(newUnitPrice), // Actualizamos el precio unitario
            totalPrice: parseFloat(newTotalPrice), // Calculamos y actualizamos el precio total
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
          const newRow = defaultData;
          newRow.includeInSum = row.includeInSum;

          update(index, newRow);
          return newRow; // Retorna newRow directamente, no { newRow }
        }
        return row;
      }),
    );
  };

  return (
    <div className='divide-y divide-gray-200 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:divide-white/10 dark:bg-gray-900 dark:ring-white/10'>
      <table className='w-full table-auto divide-y divide-gray-200 text-start dark:divide-white/5'>
        <thead className='divide-y divide-gray-200 dark:divide-white/5'>
          <tr className='bg-gray-50 dark:bg-white/5'>
            {header.map((item, index) => (
              <th key={index} className={`${item.className || ""} px-3 py-3.5`}>
                {item.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 whitespace-nowrap dark:divide-white/5'>
          {fields.map((field, index) => (
            <tr key={field.id}>
              <td>
                <DescriptionCell
                  control={control}
                  errors={errors}
                  rules={registerOptions.itemable}
                  index={index}
                  options={description}
                  updateDescription={updateDescription}
                  type={data[index].type}
                  resetRow={resetRow}
                />
              </td>
              <td>
                <InputField
                  name={`items.${index}.quantity`}
                  label={t("budget.quantity")}
                  labelless
                  control={control}
                  rules={registerOptions.quantity}
                  errors={errors}
                  defaultValue='1'
                  type={InputType.Number}
                  disabled={data[index].qdisabled}
                  onChange={(e) => {
                    updatePrice(index, [
                      {
                        columnId: BudgetColumns.Quantity,
                        value: Number(e.target.value),
                      },
                    ]);
                  }}
                />
              </td>
              <td>
                <InputField
                  name={`items.${index}.unitPrice`}
                  label={t("budget.unitPrice")}
                  labelless
                  control={control}
                  rules={registerOptions.unitPrice}
                  errors={errors}
                  defaultValue='0'
                  type={InputType.Number}
                  icon={data[index].currency}
                  onChange={(e) => {
                    updatePrice(index, [
                      {
                        columnId: BudgetColumns.UnitPrice,
                        value: Number(e.target.value),
                      },
                    ]);
                  }}
                />
              </td>
              <td>
                <FakeInput
                  value={data[index].totalPrice}
                  icon={user?.currency}
                  className='text-right'
                />
              </td>
              <td>sum</td>
              <td>
                {data.length === 1 ? (
                  <CancelButton customClass='w-full'>
                    {t("button.delete")} {t("budget.item")}
                  </CancelButton>
                ) : (
                  <ActionButton
                    onClick={() => removeRow(index)}
                    style={StyleColor.Danger}
                    customClass='w-full'
                  >
                    {t("button.delete")} {t("budget.item")}
                  </ActionButton>
                )}
              </td>
            </tr>
          ))}
          <tr className='bg-gray-50 dark:bg-white/5'>
            <td colSpan={header.length - 1} align='right' className='p-2'>
              {user?.package !== PackageType.Basic && (
                <ActionButton
                  customClass='w-auto'
                  style={StyleColor.Warning}
                  onClick={() => {
                    console.log("38");
                  }}
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
              <ActionButton
                onClick={() => {
                  setData((old: Item[]) => [...old, ...defaultData]);
                  append(defaultData);
                }}
                style={StyleColor.Primary}
                customClass='w-full'
                disabled={
                  data.filter((item) => item.itemable === "").length > 0
                    ? true
                    : false
                }
              >
                {t("button.add")} {t("budget.item")}
              </ActionButton>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr className='bg-gray-50 dark:bg-white/5'>
            <td className='px-2 py-1 text-right' colSpan={2}></td>
            <td className='px-2 py-1 text-right' colSpan={2}>
              <BudgetResume data={badgetResumeData} />
            </td>
            <td colSpan={user?.package === PackageType.Basic ? 1 : 2}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
