interface ErrorMessageProps {
  message?: string | object; // 'message' es opcional
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null; // No renderizar si no hay mensaje

  return (
    <p className='text-sm text-danger-600 dark:text-danger-400'>
      {typeof message === "string" ? message : JSON.stringify(message)}
    </p>
  );
};
