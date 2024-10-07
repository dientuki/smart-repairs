import PatternLock from "react-pattern-lock";
import { useEffect, useState } from "react";
import { ActionButton } from "../form";
import { StyleColor } from "@/types/enums";


type Props = {
  deviceUnlockCode: string;
};

export const Pattern = ({deviceUnlockCode}: Props) => {
  const [path, setPath] = useState(deviceUnlockCode.split(","));
  const [subPath, setSubPath] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const disabled = true;
  const size = 3;

  let index = 1;
  const delay = 1000;
  useEffect(() => {
    let intervalId;
    if (isActive) {
      intervalId = setInterval(() => {
       setSubPath(path.slice(0, index)); 
       index = path.length == index? 0 : index+1;
      }, delay);
    }
    return () => clearInterval(intervalId);
  }, [isActive, delay]);
  
  return (
    <>
      {!isActive? ( 
          <ActionButton
            onClick={() => setIsActive(true)}
            style={StyleColor.info}
            className='w-full'
          >
            Ver patrón
          </ActionButton>
        ) : (
          <ActionButton
            onClick={() => {setIsActive(false); setSubPath([])}}
            style={StyleColor.info}
            className='w-full'
          >
            Ocultar
          </ActionButton>
        ) 
      }
      {isActive && 
        <PatternLock
          className='overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 mt-4'  
          size={size}
          onChange={ () => {}}
          onFinish={() => {}}
          path={subPath}
          disabled={disabled}
          />
        }
    </>
  );
};
