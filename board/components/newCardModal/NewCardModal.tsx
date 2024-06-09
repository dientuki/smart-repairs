import "react-modal-global/styles/modal.scss" // Imports essential styles for `ModalContainer`.
import ModalLayout from "@/components/modal/ModalLayout";
import { Tab, TabGroup, TabList, TabPanels } from '@headlessui/react'
import { useEffect, useState } from "react";
import Step1 from "@/components/newCardModal/Step1";
import Step2 from "@/components/newCardModal/Step2";
import Step3 from "@/components/newCardModal/Step3";
import { useOrderStore } from "@/store/OrderStore";
import { useBoardStore } from "@/store/BoardStore";
import { useModalWindow } from "react-modal-global";


function NewCardModal() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data, getData, addOrder } = useOrderStore();
  const [customer, setCustomer] = useState<string | null>(null);
  const [device, setDevice] = useState<string | null>(null);
  const { getBoard } = useBoardStore();
  const modal = useModalWindow();

  useEffect(() => {
    getData("01HZJ9PYBNDCMQYHGCXMFHBFK3");
  }, [getData]);

  const goToStep2 = (customerId: string) => {
    setCustomer(customerId);
    nextStep();
  };

  const goToStep3 = (deviceId: string) => {
    setDevice(deviceId);
    nextStep();
  };

  const saveOrder =  async (partialOrder: NewOrder) => {
    const newOrder = {
      ...partialOrder,
      customerId: customer,
    } as NewOrder;

    await addOrder(newOrder);
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
          <h2 className="text-2xl font-medium leading-6 text-gray-900">
            Creacion de orden
          </h2>

          <TabGroup defaultIndex={0} selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <TabList className="my-5">
              <Tab className="mr-2 border border-gray-300 p-3">Informacion del cliente</Tab>
              <Tab className="mx-2 border border-gray-300 p-3">Informacion del equipo</Tab>
              <Tab className="mx-2 border border-gray-300 p-3">Problema</Tab>
            </TabList>
            <TabPanels>

              <Step1 nextStep={goToStep2} customers={data.customers} />
              <Step2 prevStep={prevStep} nextStep={goToStep3} devices={data.devices} brands={data.brands} deviceTypes={data.deviceTypes}  />
              <Step3 prevStep={prevStep} nextStep={saveOrder} device={device} devicesRepared={data.devicesRepared} />
            </TabPanels>

          </TabGroup>



        </div>
        <div className="basis-1/4">
          <p>Estado: FIJO</p>
          <div className="border border-gray-300 p-3 rounded mt-4">
            <p className="my-2">Fecha de entrada: Fijo</p>
            <p className="my-2">Cliente: Elegir</p>
            <p className="my-2">Vendedor: Fijo</p>
          </div>
          <div className="border border-gray-300 p-3 rounded mt-4">
            <p className="my-2">Desbloqueo: Codigo/patron</p>
            <p className="my-2">Validaciones: Usuario</p>
          </div>
        </div>
      </div>
    </ModalLayout>
  )
}

export default NewCardModal;