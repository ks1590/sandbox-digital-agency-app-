import dayjs from "dayjs";

export function formatTimestamp(isoStr: string): string {
  if (!isoStr) return "";
  const d = dayjs(isoStr);
  if (!d.isValid()) return isoStr;
  return d.format("YYYY-MM-DD HH:mm");
}

export function truncateInfo(json: string): string {
  try {
    const parsed = JSON.parse(json);
    const entries = Object.entries(parsed);
    if (entries.length === 0) return json;
    const [firstKey, firstVal] = entries[0];
    return `..."${firstKey}": ${JSON.stringify(firstVal)}...`;
  } catch {
    return json.length > 40 ? `${json.slice(0, 40)}...` : json;
  }
}

export function formatJsonSafe(json: string): string {
  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    return json;
  }
}
