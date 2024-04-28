import { type MetricValueDescription } from '@lib/interfaces';

export const WindDirectionDescriptions: MetricValueDescription[] = [
  {
    lower_border: 0,
    upper_border: 45,
    description: 'North',
  },
  {
    lower_border: 45,
    upper_border: 135,
    description: 'East',
  },
  {
    lower_border: 135,
    upper_border: 225,
    description: 'South',
  },
  {
    lower_border: 225,
    upper_border: 315,
    description: 'West',
  },
  {
    lower_border: 315,
    upper_border: 360,
    description: 'North',
  },
];

export const WindSpeedDescriptions: MetricValueDescription[] = [
  {
    upper_border: 0,
    description: 'Calm wind. Smoke rises vertically with little if any drift',
  },
  {
    lower_border: 0,
    upper_border: 1,
    description:
      'Light Air. Direction of wind shown by smoke drift, not by wind vanes. Little if any movement with flags. Wind barely moves tree leaves',
  },
  {
    lower_border: 1,
    upper_border: 3,
    description:
      'Light Breeze. Wind felt on face. Leaves rustle and small twigs move. Ordinary wind vanes move',
  },
  {
    lower_border: 3,
    upper_border: 5,
    description:
      'Gentle Breeze. Leaves and small twigs in constant motion. Wind blows up dry leaves from the ground. Flags are extended out',
  },
  {
    lower_border: 5,
    upper_border: 8,
    description:
      'Moderate Breeze. Wind moves small branches. Wind raises dust and loose paper from the ground and drives them along',
  },
  {
    lower_border: 8,
    upper_border: 11,
    description:
      'Fresh Breeze. Large branches and small trees in leaf begin to sway. Crested wavelets form on inland lakes and large rivers',
  },
  {
    lower_border: 11,
    upper_border: 14,
    description:
      'Strong Breeze. Large branches in continuous motion. Whistling sounds heard in overhead or nearby power and telephone lines. Umbrellas used with difficulty',
  },
  {
    lower_border: 14,
    upper_border: 17,
    description:
      'Near Gale. Whole trees in motion. Inconvenience felt when walking against the wind',
  },
  {
    lower_border: 17,
    upper_border: 21,
    description:
      'Gale. Wind breaks twigs and small branches. Wind generally impedes walking',
  },
  {
    lower_border: 21,
    upper_border: 24,
    description:
      'Strong Gale. Structural damage occurs, such as chimney covers, roofing tiles blown off, and television antennas damaged. Ground is littered with many small twigs and broken branches',
  },
  {
    lower_border: 24,
    upper_border: 28,
    description:
      'Whole Gale. Considerable structural damage occurs, especially on roofs. Small trees may be blown over and uprooted',
  },
  {
    lower_border: 28,
    upper_border: 33,
    description:
      'Storm Force. Widespread damage occurs. Larger trees blown over and uprooted',
  },
  {
    lower_border: 33,
    description:
      'Hurricane. Severe and extensive damage. Roofs can be peeled off. Windows broken. Trees uprooted. RVs and small mobile homes overturned. Moving automobiles can be pushed off the roadways',
  },
];

export const AirQualityDescriptions: MetricValueDescription[] = [
  {
    upper_border: 50,
    description:
      'Air quality is satisfactory, and air pollution poses little or no risk',
  },
  {
    lower_border: 51,
    upper_border: 100,
    description:
      'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution',
  },
  {
    lower_border: 101,
    upper_border: 150,
    description:
      'Members of sensitive groups may experience health effects. The general public is less likely to be affected',
  },
  {
    lower_border: 151,
    upper_border: 200,
    description:
      'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects',
  },
  {
    lower_border: 201,
    upper_border: 300,
    description:
      'Health alert: The risk of health effects is increased for everyone',
  },
  {
    lower_border: 301,
    description:
      'Health warning of emergency conditions: everyone is more likely to be affected',
  },
];

export const WeatherValues: {
  [key: number]: string;
} = {
  1: '01d',
  2: '01n',
  3: '02d',
  4: '02n',
  5: '03d',
  6: '04d',
  7: '04n',
  8: '09d',
  9: '10d',
  10: '10n',
  11: '11d',
  12: '13d',
  13: 'Mist',
};

export const WeatherTypes: {
  [key: string]: string;
} = {
  '01d': 'Clear sky at the day',
  '01n': 'Clear sky at the night',
  '02d': 'Few clouds at the day',
  '02n': 'Few clouds at the night',
  '03d': 'Scattered clouds',
  '04d': 'Broken clouds',
  '04n': 'Broken clouds',
  '09d': 'Shower rain',
  '10d': 'Rain at the day time',
  '10n': 'Rain at the night time',
  '11d': 'Thunderstorm',
  '13d': 'Snow',
  '50d': 'Mist',
};

export const MainPollutants: {
  [key: string]: string;
} = {
  p2: 'pm2.5',
  p1: 'pm10',
  o3: 'Ozone O3',
  n2: 'Nitrogen dioxide NO2',
  s2: 'Sulfur dioxide SO2',
  co: 'Carbon monoxide CO',
};
