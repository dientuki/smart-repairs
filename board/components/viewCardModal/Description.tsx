import { useOrderStore } from "@/store/OrderStore";
import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import Icon from "@/components/Icon";

export const Description = () => {
  const { order } = useOrderStore();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <Icon size={7} icon={Bars3BottomLeftIcon} />
          <span className="text-1xl font-bold tracking-tight sm:text-2xl">Descripcion inicial del problema</span>
        </div>
        <div>Button</div>
      </div>
      <div className="ml-9">
        {order.observation}
      </div>
    </div>
  );
};
