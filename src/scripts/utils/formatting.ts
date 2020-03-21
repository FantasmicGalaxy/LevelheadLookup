export const none = 0;
export const comma = 1;
export const percent = 2;
export const time = 3;
export const date = 4;

export function formatCommas(number: string) {
  number = number ? number : "0";
  const parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function formatPercent(percent: string) {
  return `${percent}%`;
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
    case comma:
      return formatCommas(data);
    case percent:
      return formatPercent(data);
    case time:
      return formatTime(data);
    case date:
      return formatDate(data);
    default:
      return data;
  }
}
