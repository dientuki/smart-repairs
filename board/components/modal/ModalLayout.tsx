
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
      className="transform overflow-hidden m-auto cursor-auto relative  rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10"
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