import "react-modal-global/styles/modal.scss" // Imports essential styles for `ModalContainer`.
import ModalLayout from "@/components/modal/ModalLayout";
import { useTranslation } from "react-i18next";
import { Table } from "./Table";


function BudgetModal() {
  const { t } = useTranslation();

  return (
    <ModalLayout minHeight="460px">
      <h2>Presupuestar equipo</h2>
      <div>
        <Table />
      </div>
    </ModalLayout>
  )
}

export default BudgetModal;