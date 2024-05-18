'use client'
import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { PhotoIcon } from "@heroicons/react/24/solid";
import { Fragment, useRef } from "react"

function Modal() {

  const imagePickerRef = useRef<HTMLInputElement>(null);

  const [addTask, newTaskInput, setNewTaskInput, image, setImage] = useBoardStore((state) => [
    state.addTask,
    state.newTaskInput,
    state.setNewTaskInput,
    state.image,
    state.setImage
  ]);

  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskInput) return;

    addTask(newTaskInput, "done", image);

    setImage(null);
    closeModal();
  }

  return (
      <Transition show={isOpen} as={Fragment} appear>
        <Dialog
          onClose={closeModal}
          as="form"
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

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  className="text-lg font-medium leading-6 text-gray-900 pb-2"
                  as="h3"
                >
                  Add a order
                </DialogTitle>

                <div className="mt-2">

                  <input
                    type="text"
                    value={newTaskInput}
                    placeholder="Enter a task"
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-5 outline-none" />
                </div>

                <div className="mt-2">

                  <button type="button" className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => imagePickerRef.current?.click()}
                  >
                    <PhotoIcon
                      className="h-6 w-6 mr-2 inline-block"
                    />
                    Upload an image
                  </button>

                  <input
                    type="file"
                    ref={imagePickerRef}
                    hidden
                    onChange={(e) => {
                      // check e if an image
                      if (!e.target.files![0].type.startsWith("image/")) return
                      setImage(e.target.files![0])
                    }}
                    />
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    disabled={!newTaskInput}
                  >
                    Add Task
                  </button>
                </div>



              </DialogPanel>

            </TransitionChild>

            </div>
          </div>
        </Dialog>
      </Transition>
  )
}

export default Modal;