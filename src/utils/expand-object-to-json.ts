export const expandObjectToJson = (alias: string, name: string): string => {
  return `coalesce(to_json(${alias}.*), json 'null') as ${name}`;
};
