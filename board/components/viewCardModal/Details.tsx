import { useOrderStore } from "@/store/OrderStore";

export const Details = () => {
  const { order } = useOrderStore();

  return (
    <div className="p-3 rounded-xl shadow-sm ring-1 ring-gray-950/5 dark:ring-white/10 flex flex-col gap-1.5">
      <div className="flex justify-between w-full">
          <p className="w-1/3">Entrada</p>
          <p className="w-2/3">{order.createdAtDate.toLocaleDateString()} {order.createdAtDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      <div className="flex justify-between w-full">
          <p className="w-1/3">Cliente</p>
          <p className="w-2/3">{order.customerFullName}</p>
      </div>
      <div className="flex justify-between w-full">
          <p className="w-1/3">Whatsap</p>
          <p className="w-2/3"><a target="_blank" href={`https://wa.me/${order.customerPhone}`}>whatsap</a></p>
      </div>
      <div className="flex justify-between w-full">
          <p className="w-1/3">Tecnico</p>
          <p className="w-2/3">{order.assignee}</p>
      </div>
      <div className="flex justify-between w-full">
          <p className="w-1/3">Vendedor</p>
          <p className="w-2/3">{order.creator}</p>
      </div>
    </div>
  );
};
