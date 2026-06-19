import { calculateQuotation } from './services/quotationCalculationService.js';

console.log('--- RUNNING BACKEND CALCULATION TEST ---');

// Test input inputs
const distance = 250; 
const rate = 16;      
const driverCharge = 500;
const tollCharge = 350;
const parkingCharge = 150;
const gstPercent = 5;

// Expected results:
// baseFare = 250 * 16 = 4000
// subtotal = 4000 + 500 + 350 + 150 = 5000
// gstAmount = 5000 * 5% = 250
// totalPayable = 5000 + 250 = 5250

const results = calculateQuotation(distance, rate, driverCharge, tollCharge, parkingCharge, gstPercent);

console.log('Inputs:');
console.log(`- Distance: ${distance} KM`);
console.log(`- Vehicle Rate: Rs. ${rate}/KM`);
console.log(`- Driver Charge: Rs. ${driverCharge}`);
console.log(`- Toll Charge: Rs. ${tollCharge}`);
console.log(`- Parking Charge: Rs. ${parkingCharge}`);
console.log(`- GST: ${gstPercent}%`);

console.log('\nCalculated Results:');
console.log(`- Base Fare: Rs. ${results.baseFare} (Expected: 4000)`);
console.log(`- Subtotal: Rs. ${results.subtotal} (Expected: 5000)`);
console.log(`- GST Amount: Rs. ${results.gstAmount} (Expected: 250)`);
console.log(`- Total Payable: Rs. ${results.totalPayable} (Expected: 5250)`);

if (
  results.baseFare === 4000 &&
  results.subtotal === 5000 &&
  results.gstAmount === 250 &&
  results.totalPayable === 5250
) {
  console.log('\n✅ TEST PASSED: Calculations are accurate!');
  process.exit(0);
} else {
  console.error('\n❌ TEST FAILED: Calculation mismatch.');
  process.exit(1);
}
