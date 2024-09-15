import { dynamicStyles } from "@/helper/componentsHelpers";
import { StyleColor } from "@/types/enums";
import React from "react";

interface IconProps {
  icon: React.ElementType;
  additionalClasses?: string;
  size?: number;
  style?: StyleColor;
}

export const Icon = ({
  icon: IconComponent,
  additionalClasses = "",
  size = 5,
  style = StyleColor.Gray
}: IconProps) => {
  return (
    <IconComponent
      style={dynamicStyles(style)}
      className={`h-${size} w-${size} text-custom-400 dark:text-custom-500 ${additionalClasses}`}
    />
  );
};
