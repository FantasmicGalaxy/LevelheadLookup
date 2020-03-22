import { round } from "./math";

enum formats {
  none = 0,
  comma = 1,
  percent = 2,
  time = 3,
  date = 4
}

export function formatCommas(number: string) {
  number = number ? number : "0";
  const parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return round(parts.join("."), 2);
}

export function formatPercent(percent: string) {
  return `${round(percent, 2)}%`;
}

export function formatTime(seconds: string) {
  seconds = seconds ? seconds : "0";
  const number = parseFloat(seconds);
  const minutes = Math.floor(number / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  }
}

export function formatDate(unixTime: string) {
  unixTime = unixTime ? unixTime : "0";
  const date = new Date(unixTime);
  return `${date.getMonth() + 1}/${date.getDay() + 1}/${date.getFullYear()}`;
}

export function format(data: string, formatCode: number) {
  switch (formatCode) {
    case formats.comma:
      return formatCommas(data);
    case formats.percent:
      return formatPercent(data);
    case formats.time:
      return formatTime(data);
    case formats.date:
      return formatDate(data);
    default:
      return data;
  }
}
