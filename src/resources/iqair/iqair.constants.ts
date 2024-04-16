import { type IqAirValueDescription } from '@resources/iqair/contracts';

export const WindDirectionDescriptions: IqAirValueDescription[] = [
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

export const WindSpeedDescriptions: IqAirValueDescription[] = [
  {
    upper_border: 0,
    description: 'Calm wind. Smoke rises vertically with little if any drift',
  },
  {
    lower_border: 0,
    upper_border: 1,
    description:
      'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution',
  },
  {
    lower_border: 1,
    upper_border: 3,
    description:
      'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution',
  },
  {
    lower_border: 3,
    upper_border: 5,
    description:
      'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution',
  },
  {
    lower_border: 5,
    upper_border: 8,
    description:
      'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution',
  },
  {
    lower_border: 8,
    upper_border: 11,
    description:
      'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution',
  },
  {
    lower_border: 11,
    upper_border: 14,
    description:
      'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution',
  },
  {
    lower_border: 14,
    upper_border: 17,
    description:
      'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution',
  },
  {
    lower_border: 17,
    upper_border: 21,
    description:
      'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution',
  },
  {
    lower_border: 21,
    upper_border: 24,
    description:
      'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution',
  },
  {
    lower_border: 24,
    upper_border: 28,
    description:
      'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution',
  },
  {
    lower_border: 28,
    upper_border: 33,
    description:
      'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution',
  },
  {
    lower_border: 33,
    description:
      'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution',
  },
];

export const AirQualityDescriptions: IqAirValueDescription[] = [
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

export const WeatherTypes: {
  [key: string]: string;
} = {
  '01d': 'Clear sky at the day',
  '01n': 'Clear sky at the night',
  '02d': 'Few clouds at the day',
  '02n': 'Few clouds at the night',
  '03d': 'Scattered clouds',
  '04d': 'Broken clouds',
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
