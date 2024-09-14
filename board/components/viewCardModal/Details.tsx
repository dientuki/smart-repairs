import { useOrderStore } from "@/store/OrderStore";
import Avatar from "react-avatar";

export const Details = () => {
  const { order } = useOrderStore();

  return (
    <div className="p-3 rounded-xl shadow-sm ring-1 ring-gray-950/5 dark:ring-white/10 flex flex-col gap-2 bg-white dark:bg-white/5">
      <div className="flex justify-between w-full">
          <p className="w-1/3">Entrada</p>
          <p className="w-2/3 truncate">{order.createdAtDate.toLocaleDateString()} {order.createdAtDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      <div className="flex justify-between w-full">
          <p className="w-1/3">Cliente</p>
          <p className="w-2/3 truncate">{order.customerFullName}</p>
      </div>
      <div className="flex items-center justify-between w-full">
      <p className="w-1/3">Whatsap</p>
          <a target="_blank" href={`https://wa.me/${order.customerPhone}`} title="Llamar a guasa" className="w-2/3 flex flex-row gap-1 items-center " rel="noreferrer">
            <Avatar unstyled={true} name="Whatsap" maxInitials={1} round={false} size="28" src="/icons/whatsapp.svg" />
            <span className="truncate">{order.customerPhone}</span>
          </a>
      </div>
      <div className="flex items-center justify-between w-full">
          <p className="w-1/3">Vendedor</p>
          <p className="w-2/3 flex flex-row gap-1 items-center ">
            <Avatar name={order.creator} maxInitials={2} round={true} size="28" src={order.creatorAvatar} />
            <div className="truncate">{order.creator}</div>
          </p>
      </div>
      <div className="flex items-center justify-between w-full">
          <p className="w-1/3">Tecnico</p>
          <p className="w-2/3 flex flex-row gap-1 items-center ">
            {order.assignee && <Avatar name={order.assignee} maxInitials={2} round={true} size="28" src={order.assigneeAvatar} />}
            <div className="truncate">{order.assignee}</div>
          </p>
      </div>
    </div>
  );
};
