export function formatJson(value: string): string {
  const parsed = JSON.parse(value);
  return JSON.stringify(parsed, null, 2);
}

export function minifyJson(value: string): string {
  const parsed = JSON.parse(value);
  return JSON.stringify(parsed);
}

export function validateJson(value: string): void {
  JSON.parse(value);
}
