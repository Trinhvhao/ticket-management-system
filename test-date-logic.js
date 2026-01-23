console.log('🧪 Testing Date Calculation Logic\n');
console.log('='.repeat(80));

// Current implementation (FIXED)
function calculateDatesFixed(limit) {
  const trends = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Start of today

  for (let i = limit - 1; i >= 0; i--) {
    // Calculate date by subtracting milliseconds
    const daysAgoMs = i * 24 * 60 * 60 * 1000;
    const periodStart = new Date(now.getTime() - daysAgoMs);
    
    trends.push({
      index: i,
      date: periodStart,
      formatted: periodStart.toLocaleDateString('vi-VN', { 
        weekday: 'short', 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      })
    });
  }
  
  return trends;
}

// Old implementation (BUGGY)
function calculateDatesOld(limit) {
  const trends = [];
  const now = new Date();

  for (let i = limit - 1; i >= 0; i--) {
    // BUG: Using Date constructor with subtraction
    const periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i, 0, 0, 0, 0);
    
    trends.push({
      index: i,
      date: periodStart,
      formatted: periodStart.toLocaleDateString('vi-VN', { 
        weekday: 'short', 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      })
    });
  }
  
  return trends;
}

// Test with 7 days
console.log('\n📅 Testing 7 days calculation:\n');
console.log('Today:', new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
console.log('');

console.log('✅ FIXED Implementation (using milliseconds):');
console.log('-'.repeat(80));
const fixedDates = calculateDatesFixed(7);
fixedDates.forEach((item, idx) => {
  const isToday = item.index === 0;
  const marker = isToday ? '👉 TODAY' : '';
  console.log(`${idx + 1}. ${item.formatted} (${item.index} days ago) ${marker}`);
});

console.log('\n❌ OLD Implementation (using Date constructor):');
console.log('-'.repeat(80));
const oldDates = calculateDatesOld(7);
oldDates.forEach((item, idx) => {
  const isToday = item.index === 0;
  const marker = isToday ? '👉 TODAY' : '';
  console.log(`${idx + 1}. ${item.formatted} (${item.index} days ago) ${marker}`);
});

// Compare
console.log('\n🔍 Comparison:');
console.log('='.repeat(80));
let hasDifference = false;
for (let i = 0; i < 7; i++) {
  const fixed = fixedDates[i].date.toISOString().split('T')[0];
  const old = oldDates[i].date.toISOString().split('T')[0];
  
  if (fixed !== old) {
    console.log(`Day ${i + 1}: Fixed=${fixed}, Old=${old} ❌ DIFFERENT`);
    hasDifference = true;
  } else {
    console.log(`Day ${i + 1}: ${fixed} ✅ SAME`);
  }
}

if (!hasDifference) {
  console.log('\n✅ Both implementations produce the same results');
  console.log('💡 The bug might only occur at month boundaries');
} else {
  console.log('\n❌ Implementations produce different results!');
  console.log('💡 Use the FIXED implementation');
}

// Test edge case: month boundary
console.log('\n' + '='.repeat(80));
console.log('🧪 Testing Edge Case: Month Boundary\n');

// Simulate being on January 2nd
const jan2 = new Date(2026, 0, 2, 0, 0, 0, 0); // January 2, 2026

console.log('Simulated date: January 2, 2026');
console.log('Calculating 7 days back...\n');

console.log('✅ FIXED (milliseconds):');
for (let i = 6; i >= 0; i--) {
  const daysAgoMs = i * 24 * 60 * 60 * 1000;
  const date = new Date(jan2.getTime() - daysAgoMs);
  console.log(`  ${i} days ago: ${date.toLocaleDateString('vi-VN')}`);
}

console.log('\n❌ OLD (Date constructor):');
for (let i = 6; i >= 0; i--) {
  const date = new Date(jan2.getFullYear(), jan2.getMonth(), jan2.getDate() - i, 0, 0, 0, 0);
  console.log(`  ${i} days ago: ${date.toLocaleDateString('vi-VN')}`);
}

console.log('\n' + '='.repeat(80));
console.log('✅ Date logic test completed!');
console.log('='.repeat(80));
