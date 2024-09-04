import { ReactNode } from "react";
import { DNA } from "react-loader-spinner";

interface ModalLayoutProps {
  title?: ReactNode;
  children: ReactNode;
  width?: string;
  height?: string;
  minHeight?: string;
}

export const ModalLayout: React.FC<ModalLayoutProps> = ({
  title,
  children,
  width = '80vw',
  height = '80vh',
  minHeight
}) => {
  return (
    <div
      className="transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl m-auto cursor-auto relative"
      style={{
        width,
        height: minHeight ? undefined : height, // Usar height solo si minHeight no está definido
        minHeight: minHeight || undefined // Usar minHeight si está definido
      }}
    >
      {title && <>{title}</>}
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