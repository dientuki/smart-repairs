import { dynamicStyles } from "@/helper/componentsHelpers";
import { StyleColor } from "@/types/enums";
import React from "react";

interface IconProps {
  icon: React.ElementType;
  size?: number; // Tamaño opcional, por defecto será 5
  additionalClasses?: string;
  style?: StyleColor;
}

const Icon: React.FC<IconProps> = ({
  style = StyleColor.Gray,
  icon: IconComponent,
  size = 5,
  additionalClasses = "",
}) => {
  return (
    <IconComponent
      style={dynamicStyles(style)}
      className={`h-${size} w-${size} text-custom-400 dark:text-custom-500 ${additionalClasses}`}
    />
  );
};

export default Icon;
