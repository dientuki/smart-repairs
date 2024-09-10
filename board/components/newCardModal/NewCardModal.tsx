import "react-modal-global/styles/modal.scss" // Imports essential styles for `ModalContainer`.
import { ModalLayout } from "@/components/modal";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useBoardStore, useOrderStore } from "@/store";
import { Tab, TabGroup, TabList, TabPanels } from "@headlessui/react";
import Step1 from "@/components/newCardModal/Step1";
import Step2 from "@/components/newCardModal/Step2";
import Step3 from "@/components/newCardModal/Step3";
import { useModalWindow } from "react-modal-global";

export const NewCardModal = () => {
  const modal = useModalWindow();
  const [ selectedIndex, setSelectedIndex ] = useState(0);
  const { t } = useTranslation();
  const { getBoard } = useBoardStore();
  const { initializeOrderCreationData, createOrderSelectedData, createOrder } = useOrderStore();
  const date = new Date();

  useEffect(() => {
    initializeOrderCreationData().catch((e: any) => {
      toast.error(t(`toast.error.${e.message}`));
    });
  }, []);

  const saveOrder =  async () => {
    await createOrder();
    await getBoard();
    modal.close();
  }

  const prevStep = () => {
    setSelectedIndex(selectedIndex - 1);
  };

  const nextStep = () => {
    setSelectedIndex(selectedIndex + 1);
  };

  return (
    <ModalLayout>
      <div className="flex flex-row h-full relative z-50">
        <div className="basis-3/4 pr-6 overflow-y-scroll mr-3">
          <h2 className="text-2xl font-medium leading-6 text-gray-900 mb-6">
            Creacion de orden
          </h2>

          <TabGroup defaultIndex={0} selectedIndex={selectedIndex} onChange={setSelectedIndex} className="pl-1 pb-1">
            <TabList className="flex items-center w-full justify-between border rounded">
              <Tab className="flex items-center data-[selected]:text-blue-600 text-gray-500  space-x-2.5 p-2 grow">
                <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full  ">
                    1
                </span>
                <span>
                    <h3 className="font-medium leading-tight">Cliente</h3>
                    <p className="text-base">Informacion del cliente</p>
                </span>
              </Tab>
              <Tab className="flex items-center data-[selected]:text-blue-600 text-gray-500 space-x-2.5 p-2 grow">
                <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full  ">
                    2
                </span>
                <span>
                    <h3 className="font-medium leading-tight">Equipo</h3>
                    <p className="text-base">Informacion del equipo</p>
                </span>
              </Tab>
              <Tab className="flex items-center data-[selected]:text-blue-600 text-gray-500 space-x-2.5 p-2 grow">
                <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full  ">
                    3
                </span>
                <span>
                    <h3 className="font-medium leading-tight">Problema</h3>
                    <p className="text-base">Detalle del problema a resolver</p>
                </span>
              </Tab>
            </TabList>

            <TabPanels className="mt-4">
              <Step1 nextStep={nextStep} />
              <Step2 prevStep={prevStep} nextStep={nextStep} />
              <Step3 prevStep={prevStep} nextStep={saveOrder} />
            </TabPanels>
          </TabGroup>
        </div>

        <div className="basis-1/4">
          <p>Estado: FIJO</p>
          <div className="border border-gray-300 p-3 rounded mt-4">
            <p className="my-2">Fecha de entrada: {date.toDateString()} {date.toLocaleTimeString()} </p>
            <p className="my-2">Vendedor: </p>

          </div>
          <div className="border border-gray-300 p-3 rounded mt-4">
            <p className="my-2">Cliente: {createOrderSelectedData.customer?.label} </p>
            <p className="my-2">
              {createOrderSelectedData.deviceTypeLabel ? createOrderSelectedData.deviceTypeLabel : 'Equipo'}: {createOrderSelectedData.deviceLabel}
            </p>
          </div>
        </div>
      </div>
    </ModalLayout>
  )
}