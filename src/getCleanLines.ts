export function getCleanLines(output: string) {
  return output
    .split(/\r{0,1}\n/)
    .map((line) => line.trim())
    .filter((line) => line.length !== 0);
}
