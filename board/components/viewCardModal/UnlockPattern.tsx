import { useOrderStore } from "@/store/OrderStore";
import { dynamicStyles } from "@/helper/componentsHelpers";
import { StyleColor } from "@/types/enums";
import { Pattern } from "./Pattern";
import { Code } from "./Code";

export const UnlockPattern = () => {
  const { order } = useOrderStore();

  let code = null,
    colorBackground = null;
  switch (order.deviceUnlockType) {
    case "pattern":
      code = <Pattern deviceUnlockCode={order.deviceUnlockCode} />;
      break;
    case "code":
      code = <Code deviceUnlockCode={order.deviceUnlockCode} />;
      colorBackground = StyleColor.Info;
      break;
    case "none":
      code = "Sin Código";
      colorBackground = StyleColor.Warning;
      break;
  }
  return (
    <div className='flex justify-between w-full items-center'>
      <p className='w-1/3 first-letter:uppercase'>Desbloqueo</p>
      <p
        className='w-2/3 justify-center gap-x-1 rounded-md text-base ring-1 ring-inset px-2  py-1 bg-custom-50 text-custom-600 ring-custom-600/10 dark:bg-custom-400/10 dark:text-custom-400 dark:ring-custom-400/30'
        style={colorBackground ? dynamicStyles(colorBackground) : {}}
      >
        {code}
      </p>
    </div>
  );
};
