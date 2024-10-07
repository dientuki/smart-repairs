type Props = {
  deviceUnlockCode: string;
};

export const Code = ({deviceUnlockCode}: Props) => {
  return (
    <span>
      {deviceUnlockCode}
    </span>
        
  );
};
