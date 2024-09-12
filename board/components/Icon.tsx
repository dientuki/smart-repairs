import React from 'react';

interface IconProps {
  icon: React.ElementType;
  additionalClasses?: string;
}

const Icon: React.FC<IconProps> = ({ icon: IconComponent, additionalClasses = '' }) => {
  return <IconComponent className={`h-5 w-5 text-gray-400 dark:text-gray-500 ${additionalClasses}`} />;
};

export default Icon;
