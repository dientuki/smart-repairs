import { TabStatusEnum } from "@/types/enums";
import { Tab } from '@headlessui/react'; // Asegúrate de importar Tab correctamente
import { CheckIcon } from "@heroicons/react/24/outline";
import clsx from 'clsx';
import { Icon } from "../Icon";

interface TabListTabProps {
  index: number;
  title: string;
  subtitle?: string;
  status: TabStatusEnum;
}

export const TabListTab = ({ index, title, subtitle, status }: TabListTabProps) => {
  return (
    <div className="relative flex" data-f="li">
      <Tab
        className="fi-fo-wizard-header-step-button flex h-full items-center gap-x-4 px-6 py-4 text-start"
        disabled={status !== TabStatusEnum.Completed}
      >
        <div className={clsx(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
              status === TabStatusEnum.Completed && 'bg-primary-600 dark:bg-primary-500',
              status === TabStatusEnum.Active && 'border-2 border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-500',
              status === TabStatusEnum.Inactive && 'border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
            )}
        >
          { status === TabStatusEnum.Completed ? <Icon size={6} icon={CheckIcon} additionalClasses="text-white dark:text-white" /> : index }
        </div>
        <div className={clsx(
              'grid justify-items-start md:w-max md:max-w-60 text-base font-medium',
              status === TabStatusEnum.Completed && 'text-gray-950 dark:text-white',
              status === TabStatusEnum.Active && 'text-primary-600 dark:text-primary-400',
              status === TabStatusEnum.Inactive && 'text-gray-500 dark:text-gray-400'
            )}
        >
          <h3 className="font-bold leading-tight">{title}</h3>
          {subtitle && <div>{subtitle}</div>}
        </div>
      </Tab>
      <div className="fi-fo-wizard-header-step-separator absolute end-0 hidden h-full w-5 md:block">
        <svg fill="none" preserveAspectRatio="none" viewBox="0 0 22 80" className="h-full w-full text-gray-200 dark:text-white/5 rtl:rotate-180">
          <path d="M0 -2L20 40L0 82" strokeLinejoin="round" stroke="currentcolor" vectorEffect="non-scaling-stroke"></path>
        </svg>
      </div>
    </div>
  );
};