import type { useFormatter } from "next-intl";

const SIZE_UNITS = ["kilobyte", "megabyte", "gigabyte", "terabyte"] as const;

// Locale-aware size ("1,5 MB" in Spanish) in binary steps, starting at kB so tiny files read "0,5 kB".
export const formatBytes = (format: ReturnType<typeof useFormatter>, bytes: number | string): string => {
  let value = (Number(bytes) || 0) / 1024;
  let index = 0;
  while (value >= 1024 && index < SIZE_UNITS.length - 1) {
    value /= 1024;
    index++;
  }
  return format.number(value, { style: "unit", unit: SIZE_UNITS[index], maximumFractionDigits: 1 });
};
