/**
 * Calculates the quotation amount.
 */
export const calculateQuotation = (
  distance,
  rate,
  driverCharge,
  tollCharge,
  parkingCharge,
  gstPercent = 5
) => {
  const dist = parseFloat(distance) || 0;
  const vRate = parseFloat(rate) || 0;
  const dCharge = parseFloat(driverCharge) || 0;
  const tCharge = parseFloat(tollCharge) || 0;
  const pCharge = parseFloat(parkingCharge) || 0;
  const gst = parseFloat(gstPercent) || 5;

  const baseFare = dist * vRate;
  const subtotal = baseFare + dCharge + tCharge + pCharge;
  const gstAmount = subtotal * (gst / 100);
  const totalPayable = subtotal + gstAmount;

  return {
    baseFare: Number(baseFare.toFixed(2)),
    subtotal: Number(subtotal.toFixed(2)),
    gstAmount: Number(gstAmount.toFixed(2)),
    totalPayable: Number(totalPayable.toFixed(2)),
  };
};