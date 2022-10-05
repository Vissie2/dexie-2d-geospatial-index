export function rand(min: number | string, max: number | string) {
  return Math.random() * (Number(max) - Number(min)) + Number(min);
}
