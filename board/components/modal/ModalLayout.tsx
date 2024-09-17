import { ReactNode } from "react";
import { DNA } from "react-loader-spinner";

interface ModalLayoutProps {
  title?: ReactNode;
  children: ReactNode;
  width?: string;
  height?: string;
  minHeight?: string;
}

export const ModalLayout = ({
  title,
  children,
  width = "80vw",
  height = "80vh",
  minHeight,
}: ModalLayoutProps) => {
  return (
    <div
      className='transform overflow-hidden m-auto cursor-auto relative bg-white shadow-xl ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 rounded-xl'
      style={{
        width,
        height: minHeight ? undefined : height,
        minHeight: minHeight || undefined,
      }}
    >
      {title && <>{title}</>}
      {children ? (
        children
      ) : (
        <DNA
          visible={true}
          height='120'
          width='120'
          ariaLabel='dna-loading'
          wrapperClass='dna-wrapper m-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
        />
      )}
    </div>
  );
};
