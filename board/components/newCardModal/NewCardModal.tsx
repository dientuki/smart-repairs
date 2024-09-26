import { ModalLayout } from "@/components/modal";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useBoardStore, useOrderStore, useUserStore } from "@/store";
import { TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Step1 from "@/components/newCardModal/Step1";
import Step2 from "@/components/newCardModal/Step2";
import Step3 from "@/components/newCardModal/Step3";
import { useModalWindow } from "react-modal-global";
import { AbortControllerManager } from "@/helper/AbortControllerManager";
import { InboxIcon } from "@heroicons/react/24/outline";
import { Icon } from "../Icon";
import { OrderStatus } from "@/components/viewCardModal";
import { TypedColumn } from "@/types/enums";
import Avatar from "react-avatar";
import { TabListTab } from "./TabListTab";

export const NewCardModal = () => {
  const modal = useModalWindow();
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { t } = useTranslation();
  const { getBoard } = useBoardStore();
  const { initializeOrderCreationData, createOrderSelectedData, createOrder } =
    useOrderStore();
  const date = new Date();

  useEffect(() => {
    initializeOrderCreationData()
      .catch((e: any) => {
        toast.error(t(`toast.error.${e.message}`));
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      AbortControllerManager.abort();
    };
  }, []);

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
      {!isLoading && (
        <div className='flex flex-row flex-grow border-t border-gray-200 dark:border-white/10 px-5 py-3 text-base min-h-0'>
          <div className='basis-3/4 p-2 pr-4 mr-3 flex flex-col gap-6 overflow-y-scroll min-h-full max-h-full'>
            <TabGroup
              defaultIndex={0}
              selectedIndex={selectedIndex}
              onChange={setSelectedIndex}
              className='flex flex-col gap-6 min-h-full max-h-full rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10'
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

              <TabPanels className='mt-4 fi-fo-wizard-step outline-none fi-active p-6'>
                <TabPanel unmount={false}>panel 1</TabPanel>
                <TabPanel unmount={false}>panel 1</TabPanel>
                <TabPanel unmount={false}>panel 1</TabPanel>
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
              <div className='flex justify-between w-full'>
                <p className='w-1/3 first-letter:uppercase'>
                  {t("order.customer")}
                </p>
                <p className='w-2/3 truncate'>Cliente</p>
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
            </div>
          </div>
        </div>
      )}
    </ModalLayout>
  );
};
