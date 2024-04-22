import { type MetricValueDescription } from '@lib/interfaces';

export const RadiationLevelDescriptions: MetricValueDescription[] = [
  {
    upper_border: 260,
    description: 'Safe level of the background radiation',
  },
  {
    lower_border: 260,
    upper_border: 1200,
    description: 'Increased level of the background radiation',
  },
  {
    lower_border: 1200,
    description: 'Dangerous level of the background radiation',
  },
];
