export function formatTimestamp(isoStr: string): string {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return isoStr;
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${mo}-${day} ${h}:${min}`;
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
