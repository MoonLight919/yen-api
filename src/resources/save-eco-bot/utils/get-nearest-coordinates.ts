import turf from 'turf';
import { type CoordinatesWithPayload } from '../contracts';

export const getNearestCoordinates = <T>(
  target: CoordinatesWithPayload<T>,
  pool: CoordinatesWithPayload<T>[],
): CoordinatesWithPayload<T> => {
  const targetPoint = turf.point(
    [target.longitude, target.latitude],
    target.payload,
  );
  const points = turf.featureCollection(
    pool.map((coordinatesWithPayload) => {
      return turf.point(
        [coordinatesWithPayload.longitude, coordinatesWithPayload.latitude],
        coordinatesWithPayload.payload,
      );
    }),
  );

  const nearest = turf.nearest(targetPoint, points);
  const coordinates = nearest.geometry.coordinates;

  return {
    longitude: coordinates[0],
    latitude: coordinates[1],
    payload: nearest.properties as T,
  };
};
