import { faker } from '@faker-js/faker';
import { type PageInfo } from '@knexion/cursor-pagination';
import { type ID, type ResourceObject } from '@lib/db';

export const generateRandomArray = <T>(
  mapReducer: () => T,
  length: number = faker.number.int({
    min: 1,
    max: 10,
  }),
): T[] => new Array(length).fill(0).map(mapReducer);

export const getIdOrCreateNewResource = async (
  id: unknown,
  insert: () => Promise<ResourceObject>,
): Promise<ID> => {
  return (id as string) ?? (await insert()).id;
};

export const unique = <T>(values: T[]): T[] => {
  return [...new Set(values)];
};

export const randomValue = <T>(values: T[]): T => {
  if (!values.length) {
    throw new Error('Empty array provided!');
  }
  return values[faker.number.int({ min: 0, max: values.length - 1 })];
};

export const randomUniqueValue = <T>(values: T[]): (() => T) => {
  const valuesToTake: T[] = [...values];

  return () => {
    if (!valuesToTake.length) {
      throw new Error('No values left!');
    }
    const randomIndex = faker.number.int({
      min: 0,
      max: valuesToTake.length - 1,
    });
    const value = valuesToTake[randomIndex];
    valuesToTake.splice(randomIndex, 1);
    return value;
  };
};

export const encodePageInfo = (info: PageInfo<string>): string => {
  return Buffer.from(JSON.stringify(info)).toString('base64');
};
