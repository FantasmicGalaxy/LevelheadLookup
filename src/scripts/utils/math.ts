export function round(number: number | string, digit: number): number {
  const place = 10 ** digit;
  if (typeof number === "number") {
    return Math.floor(number * place) / place;
  } else if (typeof number === "string") {
    return Math.floor(parseFloat(number) * place) / place;
  }
  return 0;
}
