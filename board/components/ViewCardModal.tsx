import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore"
import { Dialog, DialogPanel, DialogTitle, Textarea, Transition, TransitionChild } from '@headlessui/react'
import { Fragment, useRef } from "react"
import Comments from "./Comments";

function ViewCardModal() {

  const { order, cleanOrder } = useBoardStore();

  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  console.log('view modal')

  return (
      <Transition show={isOpen} as={Fragment} appear>
        <Dialog
          onClose={() => {
            closeModal();
            cleanOrder();
          }}
          className="relative z-50"
          onSubmit={handleSubmit}
        >
          <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto flex">
            <div className="flex absolute inset-0 items-center justify-center">
              <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="h-[80vh] w-[80vh] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    className="text-lg font-medium leading-6 text-gray-900 pb-2"
                    as="h3"
                  >
                    {order.brand} {order.deviceCommercialName}
                  </DialogTitle>
                  <div className="flex flex-row">
                    <div className="basis-3/4">
                      <p>Serie: {order.deviceSerial}</p>
                      <p>{order.observation}</p>
                      <Comments comments={order.comments?.length ? order.comments : []}/>
                      <Textarea name="description" />
                    </div>
                    <div className="basis-1/4">
                      <p>Fecha: {order.createdAt}</p>
                      <p>Cliente: {order.customerFullName}</p>
                      <p>Estatus: {order.status}</p>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
  )
}

export default ViewCardModal;