import PatternLock from "react-pattern-lock";
import { useEffect, useState } from "react";


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
          <button onClick={() => setIsActive(true)}>Ver Patrón</button> 
        ) : (
          <button onClick={() => {setIsActive(false); setSubPath([])}}>Ocultar</button> 
        ) 
      }
      {isActive && 
        <PatternLock
          style={{background: "cyan", color: "red"}}
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
