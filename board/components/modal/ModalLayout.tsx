import { ReactNode } from "react";
import { DNA } from "react-loader-spinner";

interface ModalLayoutProps {
  children: ReactNode;
}

function ModalLayout(props: ModalLayoutProps) {

  return (
    <div className="h-[80vh] w-[80vw] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl m-auto">
      {props.children ?
        props.children :
        <DNA
        visible={true}
        height="120"
        width="120"
        ariaLabel="dna-loading"
        wrapperClass="dna-wrapper m-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />}
    </div>
  );
}

export default ModalLayout;
