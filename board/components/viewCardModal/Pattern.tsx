import PatternLock from "react-pattern-lock";
import { useEffect, useState } from "react";

export const Pattern = () => {

  //Get array
  const [path, setPath] = useState([0,1,2,4,7]);
  const [subPath, setSubPath] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const disabled = true;
  const size = 3;

  let index = 0;
  const delay = 1000;
  useEffect(() => {
    let intervalId;
    if (isActive) {
      intervalId = setInterval(() => {
       index++;
       setSubPath(path.slice(0, index)); 
       if(path.length==index){
          index = 0;
       }
      }, delay);
    }
    return () => clearInterval(intervalId);
  }, [isActive, delay]);
  

  return (
    <>
      {!isActive? (<button onClick={() => setIsActive(true)}>Ver Patrón</button> ) : (<button onClick={() => {setIsActive(false); setSubPath([])}}>Ocultar</button> ) }
      {isActive && 
        <PatternLock
          style={{background: "cyan", color: "red"}}
          size={size}
          onChange={ () => {
            //onChange();
          }}
          onFinish={() => {
            // check if the pattern is correct
          }}
          path={subPath}
          disabled={disabled}
          />
        }
    </>
  );
};
