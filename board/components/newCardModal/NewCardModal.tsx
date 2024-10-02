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
import { Step1, Step2, Step3, TabListTab } from "@/components/newCardModal";
import { useErrorHandler } from "@/components/hooks/useErrorHandler";

interface OrderData {
  customer: string | null;
  deviceType: string | null;
  device: string | null;
}

export const NewCardModal = () => {
  const modal = useModalWindow();
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [initialData, setInitialData] = useState<OrderCreationData>();
  const { t } = useTranslation();
  const { getBoard } = useBoardStore();
  const { initializeOrderCreationData, createOrderSelectedData, createOrder } =
    useOrderStore();
  const [orderData, setOrderData] = useState<OrderData>({
    customer: null,
    deviceType: null,
    device: null,
  });
  const [tmpDeviceUnit, setTmpDeviceUnit] = useState<string>("");
  const date = new Date();
  const { handleError } = useErrorHandler();

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

  const handleCustomerSelected = (selectedCustomer: string) => {
    setOrderData((prevState) => ({
      ...prevState,
      customer: selectedCustomer,
    }));
  };

  const handleDeviceSelected = (
    selectedDeviceType: string,
    selectedDevice: string,
    tmp: string,
  ) => {
    setOrderData((prevState) => ({
      ...prevState,
      device: selectedDevice,
      deviceType: selectedDeviceType,
    }));
    setTmpDeviceUnit(tmp);
  };

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
                  hideArrow
                />
              </TabList>

              <TabPanels className='outline-none p-6'>
                <TabPanel unmount={false}>
                  <Step1
                    nextStep={nextStep}
                    customers={initialData.customers}
                    onNext={handleCustomerSelected}
                  />
                </TabPanel>
                <Step2
                  prevStep={prevStep}
                  nextStep={nextStep}
                  brands={initialData.brands}
                  devices={initialData.devices}
                  deviceTypes={initialData.deviceTypes}
                  onNext={handleDeviceSelected}
                />
                <Step3 prevStep={prevStep} nextStep={saveOrder} tmpDeviceUnit={tmpDeviceUnit} budgetTableData={initialData.budgetTableData} />
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
                <p className='w-2/3 truncate'>{orderData.customer || ""}</p>
              </div>
              <div className='flex justify-between w-full'>
                <p className='w-1/3 first-letter:uppercase'>
                  {orderData.deviceType
                    ? orderData.deviceType
                    : t("order.device")}
                </p>
                <p className='w-2/3 truncate'>{orderData.device || ""}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalLayout>
  );
};
