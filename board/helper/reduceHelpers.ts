export const deviceVersion = (collection: any[]): OptionType[] => {
  return collection.reduce((acc: OptionType[], deviceVersion: any) => {
    const desc = deviceVersion.description
      ? ` (${deviceVersion.description})`
      : "";
    acc.push({
      id: deviceVersion.id,
      label: deviceVersion.version + desc,
    });

    return acc;
  }, []);
};

export const device = (collection: any[]): OptionType[] => {
  return collection.reduce((acc: OptionType[], device: any): OptionType[] => {
    acc.push({
      id: device.id,
      label: `${device.brand.name} ${device.commercial_name}`,
      info: {
        commercialname: device.commercial_name,
        brandid: device.brand.id,
        brand: device.brand.label,
        typeid: device.deviceType.id,
        type: device.deviceType.label,
        url: device.url,
      },
    });

    return acc;
  }, []);
};

export const extra = (
  collection: any[],
  additionalInfo?: Record<string, any>,
): OptionType[] => {
  if (collection.length === 0) return [];

  return collection.reduce((acc: OptionType[], item: any) => {
    const anyValues = Object.keys(item).filter(
      (key) => key !== "id" && key !== "label",
    );

    let info: Record<string, any> = {};

    if (anyValues.length === 1) {
      const key = anyValues[0];
      const value = item[key];
      info[key] = value === null ? null : String(value);
    } else if (anyValues.length > 1) {
      info = anyValues.reduce((obj: Record<string, any>, key: string) => {
        obj[key] = item[key];
        return obj;
      }, {});
    }

    // Agregar additionalInfo si existe
    if (additionalInfo) {
      info = { ...info, ...additionalInfo };
    }

    acc.push({
      id: item.id,
      label: item.label,
      info: info,
    });

    return acc;
  }, []);
};
