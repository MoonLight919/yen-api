export interface IJsonSerializable {
  toJson(...args: unknown[]): string;
}

export interface IStaticJsonSerializable<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  C extends new (...args: unknown[]) => IJsonSerializable,
  T,
> extends Function {
  fromJson(message: string): T & IJsonSerializable;
}
