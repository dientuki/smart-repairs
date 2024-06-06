import "react-modal-global/styles/modal.scss" // Imports essential styles for `ModalContainer`.
import ModalLayout from "@/components/modal/ModalLayout";
import { Field, Input, Label, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Step1 from "@/components/newCardForm/Step1";
import { useOrderStore } from "@/store/OrderStore";

const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'Inception', year: 2010 }
];

function NewCardModal() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data, getData } = useOrderStore();

  useEffect(() => {
    getData("01HZJ9PYBNDCMQYHGCXMFHBFK3");
  }, [getData]);

  const nextStep = (customerId: string) => {
    console.log(customerId);
    setSelectedIndex(selectedIndex + 1);
  };

  console.log(data);

  return (
    <ModalLayout>
      <div className="flex flex-row h-full relative z-50">
        <div className="basis-3/4 pr-6 overflow-y-scroll mr-3">
          <h2 className="text-2xl font-medium leading-6 text-gray-900">
            Creacion de orden
          </h2>

          <TabGroup defaultIndex={0} selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <TabList>
              <Tab className="mx-2">Informacion del cliente</Tab>
              <Tab  className="mx-2">Informacion del equipo</Tab>
              <Tab className="mx-2">Problema</Tab>
            </TabList>
            <TabPanels>

              <Step1 nextStep={nextStep} customers={data.customers} />

              <TabPanel unmount={false}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo2"
                  options={top100Films}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Device" />}
                />
                <div>IMEI si lo tengo</div>
              <Field>
                <Label className="">Tipo</Label>
                <Input name="full_name" className="border border-gray-300 p-3 mt-3 block w-full rounded-lg " />
              </Field>
              <Field>
                <Label className="">Marca</Label>
                <Input name="full_name" className="border border-gray-300 p-3 mt-3 block w-full rounded-lg " />
              </Field>
              <Field>
                <Label className="">Nombre comercial</Label>
                <Input name="full_name" className="border border-gray-300 p-3 mt-3 block w-full rounded-lg " />
              </Field>
              <Field>
                <Label className="">Nombre tecnico</Label>
                <Input name="full_name" className="border border-gray-300 p-3 mt-3 block w-full rounded-lg " />
              </Field>
              <Field>
                <Label className="">Web</Label>
                <Input name="full_name" className="border border-gray-300 p-3 mt-3 block w-full rounded-lg " />
              </Field>
              </TabPanel>
              <TabPanel unmount={false}>
                <Field>
                  <Label className="">Imei</Label>
                  <Input name="full_name" className="border border-gray-300 p-3 mt-3 block w-full rounded-lg " />
                </Field>
                <Field>
                  <Label className="">Selector de codigo</Label>
                  <Input name="full_name" className="border border-gray-300 p-3 mt-3 block w-full rounded-lg " />
                </Field>
                <Field>
                  <Label className="">codigo/algo</Label>
                  <Input name="full_name" className="border border-gray-300 p-3 mt-3 block w-full rounded-lg " />
                </Field>
                <Field>
                  <Label className="">observaciones</Label>
                  <Input name="full_name" className="border border-gray-300 p-3 mt-3 block w-full rounded-lg " />
                </Field>
              </TabPanel>
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