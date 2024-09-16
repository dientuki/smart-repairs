import { useModalWindow } from "react-modal-global";
import { ModalLayout } from "@/components/modal";
import { ActionButton } from "@/components/form";
import { StyleColor } from "@/types/enums";
import { useState } from "react";

type ModalParams = {
  title: string;
  onConfirm: () => void;
};

export const DeleteDialog = () => {
  const modal = useModalWindow<ModalParams>();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true); // Establecer loading a true al iniciar la confirmación
    try {
      await modal.params.onConfirm(); // Ejecutar la función de confirmación
    } catch (error) {
      console.error("Error durante la confirmación", error);
    } finally {
      setLoading(false); // Establecer loading a false después de que la confirmación se complete
      modal.close(); // Cerrar el modal
    }
  };

  return (
    <ModalLayout width='328px' height='384px'>
      <div className='transform overflow-hidden m-auto cursor-auto relative rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10'>
        <div>icono</div>
        <div>Borrar {modal.params.title}</div>
        <div>¿estas seguro che?</div>
        <div>
          <ActionButton
            onClick={modal.close}
            style={StyleColor.Gray}
            disabled={loading}
          >
            Cancelar
          </ActionButton>
          <ActionButton
            onClick={handleConfirm}
            style={StyleColor.Danger}
            loading={loading}
          >
            Borrar
          </ActionButton>
        </div>
      </div>
    </ModalLayout>
  );
};
