export const deviceVersion = (deviceVersion: any) => {
  return deviceVersion.reduce((acc: DeviceVersion[], deviceVersion: any) => {
      const desc = deviceVersion.description? ` (${deviceVersion.description})` : '';
      acc.push({
          id: deviceVersion.id,
          label: deviceVersion.version + desc
      });

      return acc;

    }, []) as DeviceVersion[];
}