export const deviceVersion = (collection: GraphQLObject[]): OptionType[] => {
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

export const deviceSingle = (device: any): OptionType => {
  return {
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
  };
};

export const extra = (
  collection: GraphQLObject[],
  additionalInfo?: Record<string, any>,
): OptionType[] => {
  if (collection.length === 0) return [];

  return collection.reduce((acc: OptionType[], item: GraphQLObject) => {
    const keys = Object.keys(item).filter(
      (key) => key !== "id" && key !== "label",
    );

    let info: Record<string, string | null> | null = null;

    // Si solo tiene id y label
    if (keys.length === 0) {
      info = additionalInfo || null;
    } else {
      // Si hay otras propiedades además de id y label
      info = keys.reduce((obj: Record<string, string | null>, key: string) => {
        obj[key] = item[key] !== null ? String(item[key]) : null;
        return obj;
      }, {});

      // Agregar additionalInfo si existe
      if (additionalInfo) {
        info = { ...info, ...additionalInfo };
      }
    }

    acc.push({
      id: item.id as string,
      label: item.label as string,
      info: info,
    });

    return acc;
  }, []);
};

export const extraSingle = (
  item: GraphQLObject,
  additionalInfo?: Record<string, any>,
): OptionType => {
  const keys = Object.keys(item).filter(
    (key) => key !== "id" && key !== "label",
  );

  let info: Record<string, string | null> | null = null;

  // Si solo tiene id y label
  if (keys.length === 0) {
    info = additionalInfo || null;
  } else {
    // Si hay otras propiedades además de id y label
    info = keys.reduce((obj: Record<string, string | null>, key: string) => {
      obj[key] = item[key] !== null ? String(item[key]) : null;
      return obj;
    }, {});

    // Agregar additionalInfo si existe
    if (additionalInfo) {
      info = { ...info, ...additionalInfo };
    }
  }

  return {
    id: item.id as string,
    label: item.label as string,
    info: info,
  };
};
