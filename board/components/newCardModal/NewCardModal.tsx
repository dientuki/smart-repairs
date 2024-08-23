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
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";


function NewCardModal() {
  const [ selectedIndex, setSelectedIndex ] = useState(0);
  const { data, getOrderCreationData, addOrder } = useOrderStore();
  const [ customer, setCustomer ] = useState<CustomerFullName | null>(null);
  const [ device, setDevice ] = useState<DeviceInfo | null>(null);
  const [ checks, setChecks ] = useState(null);
  const { getBoard } = useBoardStore();
  const [ newOrder, setNewOrder ] = useState<NewOrder>();
  const modal = useModalWindow();
  const date = new Date();
  const { t } = useTranslation();

  useEffect(() => {
    getOrderCreationData().catch((e: any) => {
      console.log(e.message);
      toast.error(t(`toast.error.${e.message}`));
    });;
  }, [getOrderCreationData]);

  const goToStep2 = (customer: CustomerFullName) => {
    setCustomer(customer);
    setNewOrder({
      ...newOrder,
      customerId: customer.id
    } as NewOrder);
    nextStep();
  };

  const goToStep3 = (device: DeviceInfo, tempDeviceUnitId: String) => {
    const toCheck = data.devicesChecks[data.devicesChecks.findIndex((d: DeviceChecks) => d.deviceTypeId === device.typeId)];

    setDevice(device);
    setNewOrder({
      ...newOrder,
      tempDeviceUnitId: tempDeviceUnitId,
      deviceid: device.id
    } as NewOrder );
    setChecks(toCheck);
    nextStep();
  };

  const saveOrder =  async (step3data: Step3data) => {
    await addOrder({ ...newOrder, ...step3data } as NewOrder);
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
                    <p className="text-sm">Informacion del cliente</p>
                </span>
              </Tab>
              <Tab className="flex items-center data-[selected]:text-blue-600 text-gray-500 space-x-2.5 p-2 grow">
                <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full  ">
                    2
                </span>
                <span>
                    <h3 className="font-medium leading-tight">Equipo</h3>
                    <p className="text-sm">Informacion del equipo</p>
                </span>
              </Tab>
              <Tab className="flex items-center data-[selected]:text-blue-600 text-gray-500 space-x-2.5 p-2 grow">
                <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full  ">
                    3
                </span>
                <span>
                    <h3 className="font-medium leading-tight">Problema</h3>
                    <p className="text-sm">Detalle del problema a resolver</p>
                </span>
              </Tab>
            </TabList>

            <TabPanels className="mt-4">
              <Step1 nextStep={goToStep2} customers={data.customers} />
              <Step2 prevStep={prevStep} nextStep={goToStep3}
                devices={data.devices} brands={data.brands} deviceTypes={data.deviceTypes}  />
              <Step3 prevStep={prevStep} nextStep={saveOrder} checks={checks} />
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
            <p className="my-2">Cliente: {customer?.fullName} </p>
            <p className="my-2">
              {device?.type ? device.type : 'Equipo'}: {device?.label}
            </p>
          </div>
        </div>
      </div>
    </ModalLayout>
  )
}

export default NewCardModal;