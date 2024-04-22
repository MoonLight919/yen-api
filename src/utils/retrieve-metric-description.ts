import { type MetricValueDescription } from '@lib/interfaces';

export const retrieveDescription = (
  collection: MetricValueDescription[],
  value: number,
): string | undefined => {
  return collection.find((description) => {
    return (
      (description.lower_border === undefined ||
        value >= description.lower_border) &&
      (description.upper_border === undefined ||
        value <= description.upper_border)
    );
  })?.description;
};
