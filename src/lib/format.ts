export function formatBytes(bytes: string | number): string {
  const value = Number(bytes);
  if (!value || value <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(
    Math.floor(Math.log(value) / Math.log(1024)),
    units.length - 1
  );
  const size = value / Math.pow(1024, exponent);

  return `${exponent === 0 ? size : size.toFixed(1)} ${units[exponent]}`;
}
