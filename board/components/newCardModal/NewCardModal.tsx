import { ModalLayout } from "@/components/modal";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useBoardStore, useOrderStore, useUserStore } from "@/store";
import { TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react";
import { useModalWindow } from "react-modal-global";
import { AbortControllerManager } from "@/helper/AbortControllerManager";
import { InboxIcon } from "@heroicons/react/24/outline";
import { Icon } from "../Icon";
import { OrderStatus } from "@/components/viewCardModal";
import { TypedColumn } from "@/types/enums";
import Avatar from "react-avatar";
import {
  Step1,
  Step2,
  Step3,
  Step4,
  TabListTab,
} from "@/components/newCardModal";
import { useErrorHandler } from "@/components/hooks/useErrorHandler";

interface OrderTable {
  customer: OptionType;
  obervation: string;
}

interface OrderChecksTable {
  damages: [damage];
  features: [feature];
  damagesDescription: string;
  featuresDescription: string;
}

interface OrderData {
  order: OrderTable;
  orderChecks: OrderChecksTable;
  tmpDeviceUnit: tmpDeviceUnitTable;
}

const orderDataInit: OrderData = {
  order: {
    customer: { id: '', label: '', info: null },
    obervation: '',
  },
  orderChecks: {
    damages: [],
    features: [],
    damagesDescription: '',
    featuresDescription: '',
  },
  tmpDeviceUnit: {
    serial: '',
    unlockType: '',
    unlockCode: '',
    device: { id: '', label: '', info: null },
    deviceVersion: { id: '', label: '', info: null },
    deviceUnit: '',
  }
};

export const NewCardModal = () => {
  const modal = useModalWindow();
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [initialData, setInitialData] = useState<OrderCreationData>();
  const { t } = useTranslation();
  const { getBoard } = useBoardStore();
  const { initializeOrderCreationData, createOrder } = useOrderStore();
  const [orderData, setOrderData] = useState<OrderData>(orderDataInit);
  const date = new Date();
  const { handleError } = useErrorHandler();

  console.log(orderData)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await initializeOrderCreationData();
        setInitialData(data);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    return () => {
      AbortControllerManager.abort();
    };
  }, []);

  const handleStep1 = (selectedCustomer: OptionType) => {
    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      order: {
        ...prevOrderData.order,
        customer: selectedCustomer,
      },
    }));
  };

  const handleStep2 = (
    tmpDeviceUnit: tmpDeviceUnitTable,
  ) => {
    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      tmpDeviceUnit: tmpDeviceUnit,
    }));
  };

  const handleStep3 = () => {};

  const saveOrder = async () => {
    await createOrder();
    await getBoard();
    modal.close();
  };

  const prevStep = () => {
    setSelectedIndex(selectedIndex - 1);
  };

  const nextStep = () => {
    setSelectedIndex(selectedIndex + 1);
  };

  return (
    <ModalLayout
      minHeight='460px'
      width='70vw'
      title={
        <h2 className='flex flex-row items-center gap-2 px-5 py-3 text-2xl font-bold tracking-tight sm:text-3xl border-b border-gray-200 dark:border-white/10'>
          <Icon size={7} icon={InboxIcon} />
          <span>Creacion de orden</span>
        </h2>
      }
    >
      {!isLoading && initialData && (
        <div className='flex flex-row flex-grow border-t border-gray-200 dark:border-white/10 px-5 py-3 text-base min-h-0'>
          <div className='basis-3/4 p-2 pr-4 mr-3 flex flex-col overflow-y-scroll min-h-full max-h-full'>
            <TabGroup
              defaultIndex={0}
              selectedIndex={selectedIndex}
              className='flex flex-col min-h-full max-h-full rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10'
            >
              <TabList className='grid divide-y divide-gray-200 dark:divide-white/5 md:grid-flow-col md:divide-y-0 md:overflow-x-auto border-b border-gray-200 dark:border-white/10'>
                <TabListTab
                  index={0}
                  title='Cliente'
                  subtitle='Informacion del cliente'
                  selectedIndex={selectedIndex}
                />
                <TabListTab
                  index={1}
                  title='Equipo'
                  subtitle='Informacion del equipo'
                  selectedIndex={selectedIndex}
                />
                <TabListTab
                  index={2}
                  title='Problema'
                  subtitle='Informacion del problema'
                  selectedIndex={selectedIndex}
                />
                <TabListTab
                  index={3}
                  title='Presupuesto'
                  subtitle='y biyuya'
                  selectedIndex={selectedIndex}
                  hideArrow
                />
              </TabList>

              <TabPanels className='outline-none p-6'>
                <TabPanel unmount={false}>
                  <Step1
                    nextStep={nextStep}
                    customers={initialData.customers}
                    onNext={handleStep1}
                  />
                </TabPanel>
                <TabPanel unmount={false}>
                  <Step2
                    prevStep={prevStep}
                    nextStep={nextStep}
                    brands={initialData.brands}
                    devices={initialData.devices}
                    deviceTypes={initialData.deviceTypes}
                    onNext={handleStep2}
                  />
                </TabPanel>
                <Step3
                  prevStep={prevStep}
                  nextStep={nextStep}
                  checks={initialData.devicesChecks}
                  deviceType={orderData.deviceType?.id}
                  onNext={handleStep3}
                />

              </TabPanels>
            </TabGroup>
          </div>

          <div className='basis-1/4 flex flex-col gap-4 overflow-y-scroll min-h-full max-h-full pr-2 pl-1 pt-2'>
            <OrderStatus status={t(`status.${TypedColumn.ForBudgeting}`)} />
            <div className='p-3 rounded-xl shadow-sm ring-1 ring-gray-950/5 dark:ring-white/10 flex flex-col gap-2 bg-white dark:bg-white/5'>
              <div className='flex justify-between w-full'>
                <p className='w-1/3 first-letter:uppercase'>
                  {t("order.created_at")}
                </p>
                <p className='w-2/3 truncate'>
                  {date.toLocaleDateString()}{" "}
                  {date.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className='flex items-center justify-between w-full'>
                <p className='w-1/3 first-letter:uppercase'>Vendedor</p>
                <div className='w-2/3 flex flex-row gap-1 items-center'>
                  <Avatar
                    name={user.name}
                    maxInitials={2}
                    round={true}
                    size='28'
                    src={user.imageUrl}
                  />
                  <div className='truncate'>{user.name}</div>
                </div>
              </div>
              <div className='flex justify-between w-full'>
                <p className='w-1/3 first-letter:uppercase'>
                  {t("order.customer")}
                </p>
                <p className='w-2/3 truncate'>{orderData.order.customer.label || ""}</p>
              </div>
              <div className='flex justify-between w-full'>
                {
                  orderData.tmpDeviceUnit.device.info == null ?
                    <>
                      <p className='w-1/3 first-letter:uppercase'>
                        No
                      </p>
                      <p className='w-2/3 truncate'>No</p>
                    </>
                  :
                    <>
                      <p className='w-1/3 first-letter:uppercase'>
                        {orderData.tmpDeviceUnit.device.info.type}
                      </p>
                      <p className='w-2/3 truncate'>
                        {orderData.tmpDeviceUnit.device.info.brand} {orderData.tmpDeviceUnit.device.info.commercialname}
                      </p>
                    </>
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalLayout>
  );
};
