export function getStatus(item, currentMileage) {
  if (!currentMileage || currentMileage <= 0) return 'unknown';
  const next = item.nextService;
  if (!next && next !== 0) return 'unknown';
  const warn = item.interval ? Math.max(item.interval * 0.15, 500) : 1000;
  if (currentMileage >= next) return 'overdue';
  if (currentMileage >= next - warn) return 'due-soon';
  return 'ok';
}

export function getProgress(item, currentMileage) {
  if (!currentMileage || !item.interval) return 0;
  const sinceService = Math.max(0, currentMileage - (item.lastServiced || 0));
  return Math.min((sinceService / item.interval) * 100, 120);
}

export function getMilesUntil(item, currentMileage) {
  if (!currentMileage) return null;
  return item.nextService - currentMileage;
}

export function fmtMiles(n) {
  if (n === null || n === undefined) return '—';
  return Number(n).toLocaleString();
}
