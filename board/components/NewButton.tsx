"use client";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Modal } from "@/components/modal";
import { Step3Modal } from "@/components/btest/Step3Modal";

export const NewButton = () => {
  const openCard = () => {
    Modal.open(Step3Modal, { keepMounted: false });
  };

  return (
    <button
      className='text-green-500 hover:text-green-600 fixed bottom-5 left-5 z-30'
      onClick={openCard}
    >
      <PlusCircleIcon className='h-14 w-14' />
    </button>
  );
};
