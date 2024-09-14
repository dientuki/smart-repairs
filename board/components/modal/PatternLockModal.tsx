//import { useModalWindow } from "react-modal-global";
import { ModalLayout } from "@/components/modal";
import PatternLock from "react-pattern-lock/lib/components/PatternLock";
import { useState } from "react";
import { useModalWindow } from "react-modal-global";

type ModalParams = {
  setPattern: (pattern: number[]) => void
};

function PatternLockModal() {
    const modal = useModalWindow<ModalParams>();
    const [ pattern, setPath ] = useState<number[]>([]);
    const [ isSuccess, setIsSuccess ] = useState(false);
    const [ isError, setIsError ] = useState(false);

    const reset = () => {
        setPath([]);
        setIsSuccess(false);
    }

    const closeModal = () => {
        modal.close();
    }

    const onFinish = () => {
        if (pattern.length > 3) {
          modal.params.setPattern(pattern);
          setIsSuccess(true);
          setIsError(false);
        } else {
          setIsError(true);
          setIsSuccess(false);
        }
    }

    return (
        <ModalLayout width="328px" height="384px">
            <div onPointerDown={reset}>
              <PatternLock
                className="bg-black"
                success={ isSuccess }
                error={ isError }
                width={ 280 }
                pointSize={ 15 }
                pointActiveSize={ 40 }
                size={ 3 }
                path={ pattern }
                allowOverlapping={ true }
                connectorThickness={5}
                onChange={(path) => {setPath([...path] as number[])}}
                onFinish={onFinish}
              />
            </div>
            <button onClick={closeModal} className="mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-2.5 text-center">Listo!</button>

        </ModalLayout>
    )
}

export default PatternLockModal