export function genericParseJSON<T>(data: string): T {
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    throw new Error("Invalid JSON format");
  }
}
