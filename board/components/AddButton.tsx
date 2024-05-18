'use client'
import { useModalStore } from "@/store/ModalStore"
import { PlusCircleIcon } from "@heroicons/react/24/solid"

function AddButton() {
  const openModal = useModalStore((state) => state.openModal);

  return (
    <div className="flex items-end justify-end p-2">
        <button onClick={openModal} className="text-green-500 hover:text-green-600">
            <PlusCircleIcon className="h-10 w-10" />
        </button>
    </div>
  )
}

export default AddButton