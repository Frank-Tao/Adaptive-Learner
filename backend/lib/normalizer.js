export function normalizeEvent(event) {
  const normalized = { ...event };
  if (normalized.event_type) {
    normalized.event_type = normalized.event_type.toLowerCase();
  }
  return normalized;
}
