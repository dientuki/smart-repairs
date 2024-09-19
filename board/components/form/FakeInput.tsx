interface FakeInputProps {
  value: string; // Texto obligatorio
  icon?: React.ReactNode; // Icono opcional, puede ser un tag o string
}

export const FakeInput = ({ value, icon }: FakeInputProps) => {
  return (
    <div
      className='flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5
        [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2
        ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500
        overflow-hidden'
    >
      {icon && (
        <div className='items-center gap-x-3 ps-3 flex border-e border-gray-200 pe-3 dark:border-white/10'>
          {icon}
        </div>
      )}
      <div className='min-w-0 flex-1'>
        <div
          className='block w-full border-none py-1.5 text-base text-gray-950 transition duration-75 placeholder:text-gray-400
            disabled:text-gray-500 dark:text-white dark:placeholder:text-gray-500 dark:disabled:text-gray-400
            bg-white/0 ps-3 pe-3'
        >
          {value}
        </div>
      </div>
    </div>
  );
};
