/**
 * Core calculation logic for quotation values.
 */
export const calculateQuotation = (distance, rate, driverCharge, tollCharge, parkingCharge, gstPercent) => {
  const dist = parseFloat(distance) || 0;
  const vRate = parseFloat(rate) || 0;
  const dCharge = parseFloat(driverCharge) || 0;
  const tCharge = parseFloat(tollCharge) || 0;
  const pCharge = parseFloat(parkingCharge) || 0;
  const gst = gstPercent !== undefined ? parseFloat(gstPercent) : 5;

  const baseFare = dist * vRate;
  const subtotal = baseFare + dCharge + tCharge + pCharge;
  const gstAmount = subtotal * (gst / 100);
  const totalPayable = subtotal + gstAmount;

  return {
    baseFare: Math.round(baseFare * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    totalPayable: Math.round(totalPayable * 100) / 100,
  };
};
