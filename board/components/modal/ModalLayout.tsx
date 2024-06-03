import { ReactNode } from "react";

interface ModalLayoutProps {
  children: ReactNode;
}

function ModalLayout(props: ModalLayoutProps) {

  return (
    <div className="h-[80vh] w-[80vw] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl m-auto">
        <div>
            {props.children}
        </div>
    </div>
  );
}

export default ModalLayout;
