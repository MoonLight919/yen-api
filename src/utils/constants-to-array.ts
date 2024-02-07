export const constantsToArray = <T>(constants: Record<string, T>): T[] =>
  Object.values(constants);
