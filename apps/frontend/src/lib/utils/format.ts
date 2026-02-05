import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone to Vietnam
const VIETNAM_TIMEZONE = 'Asia/Ho_Chi_Minh';

/**
 * Format date to readable string with Vietnam timezone
 */
export function formatDate(date: string | Date, format: string = 'DD/MM/YYYY'): string {
  return dayjs(date).tz(VIETNAM_TIMEZONE).format(format);
}

/**
 * Format date to relative time (e.g., "2 hours ago") with Vietnam timezone
 */
export function formatRelativeTime(date: string | Date): string {
  return dayjs(date).tz(VIETNAM_TIMEZONE).fromNow();
}

/**
 * Format date to datetime string with Vietnam timezone
 */
export function formatDateTime(date: string | Date): string {
  if (!date) return '';
  
  // 🔍 TIMEZONE DEBUG LOG (Development only)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('🎨 Frontend Format - Timezone Debug:', {
      input: date,
      inputType: typeof date,
      parsed_UTC: dayjs.utc(date).format(),
      parsed_VN: dayjs(date).tz(VIETNAM_TIMEZONE).format(),
      browserTZ: Intl.DateTimeFormat().resolvedOptions().timeZone,
      output: dayjs(date).tz(VIETNAM_TIMEZONE).format('DD/MM/YYYY HH:mm'),
    });
  }
  
  return dayjs(date).tz(VIETNAM_TIMEZONE).format('DD/MM/YYYY HH:mm');
}

/**
 * Check if date is today in Vietnam timezone
 */
export function isToday(date: string | Date): boolean {
  const dateInVN = dayjs(date).tz(VIETNAM_TIMEZONE);
  const todayInVN = dayjs().tz(VIETNAM_TIMEZONE);
  return dateInVN.isSame(todayInVN, 'day');
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
