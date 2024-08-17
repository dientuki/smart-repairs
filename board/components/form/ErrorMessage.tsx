import React from 'react';

interface ErrorMessageProps {
  message?: string | object;  // 'message' es opcional
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  if (!message) return null; // No renderizar si no hay mensaje

  return (
    <p className={`mt-2 text-sm text-red-600 dark:text-red-500 ${className}`}>
      {typeof message === 'string' ? message : JSON.stringify(message)}
    </p>
  );
};

export default ErrorMessage;
