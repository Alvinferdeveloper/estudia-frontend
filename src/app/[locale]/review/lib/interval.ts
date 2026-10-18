const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export type IntervalUnit = "minute" | "hour" | "day" | "month" | "year";

const UNITS: [IntervalUnit, number][] = [
  ["year", 365 * DAY],
  ["month", 30 * DAY],
  ["day", DAY],
  ["hour", HOUR],
  ["minute", MINUTE],
];

// The time until a date in its largest whole unit ("10 min", "4 d"), for the rating buttons.
export const intervalUntil = (date: Date, now: Date): { value: number; unit: IntervalUnit } => {
  const ms = Math.max(date.getTime() - now.getTime(), MINUTE);
  const [unit, size] = UNITS.find(([, size]) => ms >= size) ?? UNITS[UNITS.length - 1];
  return { value: Math.round(ms / size), unit };
};
