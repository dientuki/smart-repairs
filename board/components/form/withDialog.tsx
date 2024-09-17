// withDialog.tsx
import React from "react";
import { Modal, DeleteDialog } from "@/components/modal";

interface WithDialogProps {
  record: string;
  onConfirm: () => void;
}

export const withDialog = <P extends object>(
  WrappedComponent: React.ComponentType<P & WithDialogProps>,
) => {
  const EnhancedComponent = (props: P & WithDialogProps) => {
    const { record, onConfirm, ...restProps } = props;

    const handleClick = () => {
      Modal.open(DeleteDialog, {
        layer: 5,
        record: record,
        onConfirm: onConfirm,
      });
    };

    return (
      <WrappedComponent
        {...(restProps as P)}
        record={record}
        onConfirm={onConfirm}
        onClick={handleClick}
      />
    );
  };

  EnhancedComponent.displayName = `withDialog(${WrappedComponent.displayName || WrappedComponent.name})`;

  return EnhancedComponent;
};
