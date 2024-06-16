import { ReactNode } from "react";
import { DNA } from "react-loader-spinner";

interface ModalLayoutProps {
  children: ReactNode;
  width?: string;
  height?: string;
}

function ModalLayout(props: ModalLayoutProps) {
  const { children, width = '80vw', height = '80vh' } = props;
  const css = `h-[${height}] w-[${width}] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl m-auto cursor-auto`;

  return (
    <div className={css}>
      {children ?
        children :
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
