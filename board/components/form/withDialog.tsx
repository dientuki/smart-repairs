// withDialog.tsx
import React from "react";
import { DeleteDialog } from "../modal/DeleteDialog";
import { Modal } from "../modal";

interface WithDialogProps {
  confirmMessage: string;
  onConfirm: () => void;
}

export const withDialog = <P extends object>(
  WrappedComponent: React.ComponentType<P & WithDialogProps>,
) => {
  const EnhancedComponent = (props: P & WithDialogProps) => {
    const { confirmMessage, onConfirm, ...restProps } = props;

    const handleClick = () => {
      console.log("abrite");
      Modal.open(DeleteDialog, {
        layer: 5,
        title: confirmMessage,
        onConfirm: onConfirm,
      });
    };

    return (
      <WrappedComponent
        {...(restProps as P)}
        confirmMessage={confirmMessage}
        onConfirm={onConfirm}
        onClick={handleClick}
      />
    );
  };

  EnhancedComponent.displayName = `withDialog(${WrappedComponent.displayName || WrappedComponent.name})`;

  return EnhancedComponent;
};
