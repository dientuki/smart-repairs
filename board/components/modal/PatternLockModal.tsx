//import { useModalWindow } from "react-modal-global";
import { ModalLayout } from "@/components/modal";
import PatternLock from "react-pattern-lock/lib/components/PatternLock";
import { useState } from "react";
import { useModalWindow } from "react-modal-global";
import { ActionButton } from "../form";

type ModalParams = {
  setPattern: (pattern: number[]) => void;
};

function PatternLockModal() {
  const modal = useModalWindow<ModalParams>();
  const [pattern, setPath] = useState<number[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const reset = () => {
    setPath([]);
    setIsSuccess(false);
  };

  const closeModal = () => {
    modal.close();
  };

  const onFinish = () => {
    if (pattern.length > 3) {
      modal.params.setPattern(pattern);
      setIsSuccess(true);
      setIsError(false);
    } else {
      setIsError(true);
      setIsSuccess(false);
    }
  };

  return (
    <ModalLayout className="w-[328px] h-[384px]">
      <div className='p-4 flex flex-col justify-between h-full'>
        <div onPointerDown={reset}>
          <PatternLock
            className='overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10'
            success={isSuccess}
            error={isError}
            width={296}
            pointSize={15}
            pointActiveSize={40}
            size={3}
            path={pattern}
            allowOverlapping={true}
            connectorThickness={5}
            onChange={(path) => {
              setPath([...path] as number[]);
            }}
            onFinish={onFinish}
          />
        </div>
        <ActionButton onClick={closeModal} className='w-full'>
          Listo!
        </ActionButton>
      </div>
    </ModalLayout>
  );
}

export default PatternLockModal;
