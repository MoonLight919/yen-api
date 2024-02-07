export type SizeUnit = 'Kb' | 'Mb' | 'Gb';

export const getBytesFromKilobytes = (kilobytes: number): number => {
  return kilobytes * 1024;
};

export const getBytesFromMegabytes = (megabytes: number): number => {
  return getBytesFromKilobytes(megabytes) * 1024;
};

export const getBytesFromGigabytes = (gigabytes: number): number => {
  return getBytesFromMegabytes(gigabytes) * 1024;
};

export const getBytesFromFriendly = (value: number, unit: SizeUnit): number => {
  switch (unit) {
    case 'Gb':
      return getBytesFromGigabytes(value);
    case 'Mb':
      return getBytesFromMegabytes(value);
    case 'Kb':
      return getBytesFromKilobytes(value);
    default:
      throw new Error(`Unknown size unit "${unit}" type`);
  }
};

export const getKilobytesFromBytes = (bytes: number): number => {
  return Math.ceil(bytes / 1024);
};

export const getMegabytesFromBytes = (bytes: number): number => {
  return Math.ceil(getKilobytesFromBytes(bytes) / 1024);
};

export const getGigabytesFromBytes = (bytes: number): number => {
  return Math.ceil(getMegabytesFromBytes(bytes) / 1024);
};

export const getFriendlyFromBytes = (bytes: number, unit: SizeUnit): number => {
  switch (unit) {
    case 'Gb':
      return getGigabytesFromBytes(bytes);
    case 'Mb':
      return getMegabytesFromBytes(bytes);
    case 'Kb':
      return getKilobytesFromBytes(bytes);
    default:
      throw new Error(`Unknown size unit "${unit}" type`);
  }
};
