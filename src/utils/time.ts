import { DateTime, Duration, type DurationUnit } from 'luxon';

export const nowDateTime = (): DateTime => DateTime.utc();

export const now = (): number => nowDateTime().toUnixInteger();

export const fromTimestamp = (time: number): DateTime =>
  DateTime.fromSeconds(time).toUTC();

export const toTimestamp = (time: DateTime): number =>
  time.toUTC().toUnixInteger();

/*
 * Using to calculate delay time in milliseconds for delayed jobs
 * */
export const fromTimestampToDelay = (
  timestamp: number,
  unit: DurationUnit = 'milliseconds',
): number =>
  Duration.fromObject({
    seconds: timestamp - now(),
  }).as(unit);
