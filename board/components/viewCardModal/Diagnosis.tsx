import { useOrderStore } from "@/store/OrderStore";
import Icon from "../Icon";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

export const Diagnosis = () => {
  const { order } = useOrderStore();

  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <Icon size={7} icon={DocumentTextIcon} />
          <span className="text-1xl font-bold tracking-tight sm:text-2xl">Diagnostico</span>
        </div>
        <div>Button</div>
      </div>
      <div>Diagnostico</div>
    </>
  );
};
