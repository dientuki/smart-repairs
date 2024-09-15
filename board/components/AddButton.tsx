"use client";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Modal } from "@/components/modal";
import { NewCardModal } from "@/components/newCardModal/NewCardModal";

export const AddButton = () => {
  const openCard = () => {
    Modal.open(NewCardModal, { keepMounted: false });
  };

  return (
    <button
      className='text-green-500 hover:text-green-600 fixed bottom-5 right-5 z-50'
      onClick={openCard}
    >
      <PlusCircleIcon className='h-14 w-14' />
    </button>
  );
}
