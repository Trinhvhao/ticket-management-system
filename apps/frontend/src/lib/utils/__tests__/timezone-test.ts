/**
 * Timezone Test Suite
 * 
 * Test để kiểm tra và debug timezone issues
 * Chạy: node -r ts-node/register apps/frontend/src/lib/utils/__tests__/timezone-test.ts
 */

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

console.log('='.repeat(80));
console.log('TIMEZONE DEBUG TEST');
console.log('='.repeat(80));

// Test data - giả sử backend trả về
const testDates = [
  '2026-02-02T11:46:00.000Z',  // UTC time from database
  '2026-02-02T18:46:00.000Z',  // If already in Vietnam time
  '2026-01-19T17:39:11.262Z',  // Another test case
];

console.log('\n1. CURRENT SYSTEM INFO');
console.log('-'.repeat(80));
console.log('Browser/System Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
console.log('Current Time:', new Date().toString());
console.log('Current UTC Time:', new Date().toISOString());

console.log('\n2. TEST WITHOUT TIMEZONE PLUGIN (CURRENT ISSUE)');
console.log('-'.repeat(80));
testDates.forEach((dateStr, i) => {
  const parsed = dayjs(dateStr);
  console.log(`\nTest ${i + 1}: ${dateStr}`);
  console.log('  Parsed:', parsed.toString());
  console.log('  Format DD/MM/YYYY HH:mm:', parsed.format('DD/MM/YYYY HH:mm'));
  console.log('  ❌ WRONG: Shows UTC time, not Vietnam time!');
});

console.log('\n3. TEST WITH TIMEZONE PLUGIN (SOLUTION)');
console.log('-'.repeat(80));
testDates.forEach((dateStr, i) => {
  const parsed = dayjs(dateStr).tz('Asia/Ho_Chi_Minh');
  console.log(`\nTest ${i + 1}: ${dateStr}`);
  console.log('  Parsed with TZ:', parsed.toString());
  console.log('  Format DD/MM/YYYY HH:mm:', parsed.format('DD/MM/YYYY HH:mm'));
  console.log('  ✅ CORRECT: Shows Vietnam time (UTC+7)');
});

console.log('\n4. TEST WITH NATIVE DATE + toLocaleString');
console.log('-'.repeat(80));
testDates.forEach((dateStr, i) => {
  const formatted = new Date(dateStr).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  console.log(`\nTest ${i + 1}: ${dateStr}`);
  console.log('  Formatted:', formatted);
  console.log('  ✅ CORRECT: Native Date handles timezone properly');
});

console.log('\n5. COMPARISON: UTC vs Vietnam Time');
console.log('-'.repeat(80));
const testDate = '2026-02-02T11:46:00.000Z';
console.log('Input (UTC):', testDate);
console.log('Without TZ conversion:', dayjs(testDate).format('DD/MM/YYYY HH:mm'));
console.log('With TZ conversion:', dayjs(testDate).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm'));
console.log('Expected:', '02/02/2026 18:46');
console.log('Difference:', '7 hours (UTC+7)');

console.log('\n6. RECOMMENDED SOLUTION');
console.log('-'.repeat(80));
console.log(`
// Install dayjs timezone plugin
npm install dayjs

// Update format.ts:
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDateTime(date: string | Date): string {
  return dayjs(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm');
}

export function formatDate(date: string | Date, format: string = 'DD/MM/YYYY'): string {
  return dayjs(date).tz('Asia/Ho_Chi_Minh').format(format);
}

export function formatRelativeTime(date: string | Date): string {
  return dayjs(date).tz('Asia/Ho_Chi_Minh').fromNow();
}
`);

console.log('\n' + '='.repeat(80));
console.log('TEST COMPLETE');
console.log('='.repeat(80));
