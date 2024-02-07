/* eslint-disable @typescript-eslint/no-explicit-any */
import { asyncMap } from './async-map';

type Mapper<ValueType, KeyType, MappedValueType> = (
  value: ValueType,
  key: KeyType,
) => MappedValueType | PromiseLike<MappedValueType>;

type PromiseResult<Value> = Value extends PromiseLike<infer Result>
  ? Result
  : Value;

export const asyncObject = async <
  InputType extends { [key: string]: any },
  ValueType extends InputType[keyof InputType],
  MappedValueType = PromiseResult<ValueType>,
>(
  map: InputType,
  mapper: Mapper<
    PromiseResult<ValueType>,
    keyof InputType,
    MappedValueType
  > = async (value) => await value,
): Promise<{ [key in keyof InputType]: MappedValueType }> => {
  const asyncEntries = Object.entries(map);
  const values = await asyncMap(asyncEntries, async ([key, value]) =>
    mapper(value, key),
  );
  const result: any = {};
  for (const [index, key] of Object.keys(map).entries()) {
    result[key] = values[index];
  }
  return result;
};
