/**
 * Date formatting utilities
 */

/**
 * Format a Date object to dd.mm.yyyy string
 */
export function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

/**
 * Parse a dd.mm.yyyy string to a Date object
 */
export function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const parts = dateStr.split('.');
  if (parts.length !== 3) return new Date();
  const [d, m, y] = parts.map(Number);
  if (!d || !m || !y) return new Date();
  return new Date(y, m - 1, d);
}

