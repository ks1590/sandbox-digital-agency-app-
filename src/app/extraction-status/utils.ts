import { format, isValid, parseISO } from "date-fns";

export function formatTimestamp(isoStr: string): string {
  if (!isoStr) return "";
  const d = parseISO(isoStr);
  if (!isValid(d)) return isoStr;
  return format(d, "yyyy-MM-dd HH:mm");
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
