export const deviceVersion = (deviceVersion: any): OptionType[] => {
  return deviceVersion.reduce((acc: DeviceVersion[], deviceVersion: any) => {
      const desc = deviceVersion.description? ` (${deviceVersion.description})` : '';
      acc.push({
          id: deviceVersion.id,
          label: deviceVersion.version + desc
      });

      return acc;

    }, []);
}

export const extra = (collection: any[]): OptionType[] => {
  return collection.reduce((acc: OptionType[], item: any) => {
    const anyValues = Object.keys(item).filter(key => key !== 'id' && key !== 'label');

    if (anyValues.length === 1) {
      // Si hay solo una clave en ANY, usamos su valor como una cadena de texto para info.
      const key = anyValues[0];
      const value = item[key];

      // Manejar el caso en que el valor es null.
      acc.push({
        id: item.id,
        label: item.label,
        info: value === null ? null : String(value) // Si el valor es null, info será null.
      });
    } else if (anyValues.length > 1) {
      // Si hay más de una clave en ANY, usamos las claves y valores como un objeto para info.
      const infoObject = anyValues.reduce((obj: Record<string, any>, key: string) => {
        obj[key] = item[key];
        return obj;
      }, {});
      acc.push({
        id: item.id,
        label: item.label,
        info: infoObject
      });
    }

    return acc;
  }, []);
}