import React from 'react';

interface IconProps {
  icon: React.ElementType;
  size?: number;  // Tamaño opcional, por defecto será 5
  additionalClasses?: string;
}

const Icon: React.FC<IconProps> = ({ icon: IconComponent, size = 5, additionalClasses = '' }) => {
  return (
    <IconComponent
      className={`h-${size} w-${size} text-gray-400 dark:text-gray-500 ${additionalClasses}`}
    />
  );
};

export default Icon;