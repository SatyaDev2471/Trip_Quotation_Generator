/**
 * Service to generate formatted WhatsApp messages and share URLs.
 */
const normalizeMobileForWhatsApp = (rawMobile) => {
  if (!rawMobile) return '';
  let digits = rawMobile.replace(/\D/g, '');
  while (digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  if (digits.length === 10) {
    digits = `91${digits}`;
  }
  return digits;
};

export const generateWhatsAppUrl = (quotation, mobile = '') => {
  const dateFormatted = new Date(quotation.createdAt).toLocaleDateString('en-IN');
  const returnStr = quotation.trip.returnDate ? `to ${quotation.trip.returnDate}` : 'One Way';
  
  const textMessage = `*🚗 TRIP QUOTATION (${quotation.id})*
*Date:* ${dateFormatted}

*Customer Details:*
• Name: ${quotation.customer.name}
• Mobile: ${quotation.customer.mobile}
${quotation.customer.company ? `• Company: ${quotation.customer.company}` : ''}

*Trip Details:*
• Route: ${quotation.trip.pickupLocation} ➔ ${quotation.trip.dropLocation}
• Travel Date: ${quotation.trip.tripDate} ${quotation.trip.returnDate ? `(Return: ${quotation.trip.returnDate})` : '(One Way)'}
• Distance: ${quotation.trip.distance} KM
• Duration: ${quotation.trip.duration} Day(s)
• Vehicle: ${quotation.vehicle.name} (Rate: ₹${quotation.vehicle.rate}/KM)

*Cost Breakdown:*
• Vehicle Fare: ₹${quotation.calculations.baseFare.toLocaleString('en-IN')}
• Driver Charge: ₹${parseFloat(quotation.cost.driverCharge || 0).toLocaleString('en-IN')}
• Toll Charge: ₹${parseFloat(quotation.cost.tollCharge || 0).toLocaleString('en-IN')}
• Parking Charge: ₹${parseFloat(quotation.cost.parkingCharge || 0).toLocaleString('en-IN')}
-----------------------------
• Subtotal: ₹${quotation.calculations.subtotal.toLocaleString('en-IN')}
• GST (${quotation.cost.gstPercent}%): ₹${quotation.calculations.gstAmount.toLocaleString('en-IN')}
*• Total Payable: ₹${quotation.calculations.totalPayable.toLocaleString('en-IN')}*

Thank you for choosing our travel services. Have a safe and happy journey!`;

  const encodedText = encodeURIComponent(textMessage);
  const number = normalizeMobileForWhatsApp(mobile);
  return number
    ? `https://wa.me/${number}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;
};
