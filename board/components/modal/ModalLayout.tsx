import { ReactNode } from "react";
import { DNA } from "react-loader-spinner";

interface ModalLayoutProps {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}
/*
      style={{
        width,
        height: minHeight ? undefined : height,
        minHeight: minHeight || undefined,
      }}
        */

export const ModalLayout = ({
  title,
  children,
  className = "w-[80vw] h-[80vh]",
}: ModalLayoutProps) => {
  return (
    <div
      className={`flex flex-col transform overflow-hidden m-auto cursor-auto relative bg-gray-50 shadow-xl ring-1 ring-gray-950/5 dark:bg-gray-950 dark:ring-white/10 rounded-xl ${className}`}
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
