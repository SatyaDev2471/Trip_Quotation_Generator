import { jsPDF } from 'jspdf';

/**
 * Service to generate travel quotation PDF documents using jsPDF.
 * Output is returned as a Node.js Buffer that can be streamed to the client.
 */
export const generatePdf = (quotation) => {
  // Create instance of jsPDF (A4 page format)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Draw deep blue header accent block (#2563EB)
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 38, 'F');

  // Title Text inside header block
  doc.setTextColor(255, 255, 255);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('TRIP QUOTATION', 15, 22);

  // Subtitle/Company name inside header
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('OFFICIAL TRAVEL QUOTATION', 15, 30);

  // Quotation ID & Date on the right inside header
  doc.setFontSize(9);
  doc.text(`Quotation ID: ${quotation.id}`, 145, 18);
  doc.text(`Date: ${new Date(quotation.createdAt).toLocaleDateString('en-IN')}`, 145, 24);
  doc.text('Status: GENERATED', 145, 30);

  // Restore defaults for body text
  doc.setTextColor(15, 23, 42); // #0F172A

  // Section 1: Customer Details
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. CUSTOMER INFORMATION', 15, 52);
  doc.setDrawColor(226, 232, 240); // light grey separator line
  doc.line(15, 54, 195, 54);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`Name: ${quotation.customer.name}`, 15, 62);
  doc.text(`Mobile: ${quotation.customer.mobile}`, 15, 68);
  doc.text(`Email: ${quotation.customer.email || 'N/A'}`, 110, 62);
  doc.text(`Company: ${quotation.customer.company || 'N/A'}`, 110, 68);

  // Section 2: Trip Details
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. TRIP INFORMATION', 15, 82);
  doc.line(15, 84, 195, 84);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`Pickup Location: ${quotation.trip.pickupLocation}`, 15, 92);
  doc.text(`Drop Location: ${quotation.trip.dropLocation}`, 15, 98);
  doc.text(`Trip Date: ${quotation.trip.tripDate}`, 15, 104);
  doc.text(`Return Date: ${quotation.trip.returnDate || 'N/A (One Way)'}`, 110, 92);
  doc.text(`Distance (KM): ${quotation.trip.distance} KM`, 110, 98);
  doc.text(`Rental Duration: ${quotation.trip.duration} Day(s)`, 110, 104);

  // Section 3: Fare Breakdown (Table-like grid)
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. FARE BREAKDOWN', 15, 118);
  doc.line(15, 120, 195, 120);

  // Draw table header background block
  doc.setFillColor(241, 245, 249);
  doc.rect(15, 124, 180, 8, 'F');
  
  doc.setFontSize(9);
  doc.text('Cost Component Description', 18, 129);
  doc.text('Rate / Calculation Details', 100, 129);
  doc.text('Amount (INR)', 160, 129);

  // Table body entries
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9.5);
  
  // Row 1: Vehicle Base Fare
  doc.text(`Vehicle Base Fare (${quotation.vehicle.name})`, 18, 139);
  doc.text(`${quotation.trip.distance} KM x Rs. ${quotation.vehicle.rate}/KM`, 100, 139);
  doc.text(`Rs. ${quotation.calculations.baseFare.toLocaleString('en-IN')}`, 160, 139);

  // Row 2: Driver Charge
  doc.text('Driver Charge', 18, 146);
  doc.text('Allowance / Daily Charge', 100, 146);
  doc.text(`Rs. ${parseFloat(quotation.cost.driverCharge || 0).toLocaleString('en-IN')}`, 160, 146);

  // Row 3: Toll Charge
  doc.text('Toll Charge', 18, 153);
  doc.text('Route Toll Estimations', 100, 153);
  doc.text(`Rs. ${parseFloat(quotation.cost.tollCharge || 0).toLocaleString('en-IN')}`, 160, 153);

  // Row 4: Parking Charge
  doc.text('Parking Charge', 18, 160);
  doc.text('Airport/Station/Site Parking', 100, 160);
  doc.text(`Rs. ${parseFloat(quotation.cost.parkingCharge || 0).toLocaleString('en-IN')}`, 160, 160);

  // Line separator under table body
  doc.line(15, 165, 195, 165);

  // Subtotal
  doc.setFont('Helvetica', 'bold');
  doc.text('Subtotal', 100, 171);
  doc.text(`Rs. ${quotation.calculations.subtotal.toLocaleString('en-IN')}`, 160, 171);

  // GST
  doc.setFont('Helvetica', 'normal');
  doc.text(`GST (${quotation.cost.gstPercent}%)`, 100, 177);
  doc.text(`Rs. ${quotation.calculations.gstAmount.toLocaleString('en-IN')}`, 160, 177);

  // Total
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Total Payable', 100, 185);
  doc.text(`Rs. ${quotation.calculations.totalPayable.toLocaleString('en-IN')}`, 160, 185);

  // Terms and Conditions Section
  doc.setFontSize(11);
  doc.setFont('Helvetica', 'bold');
  doc.text('TERMS & CONDITIONS', 15, 202);
  doc.line(15, 204, 195, 204);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  const terms = [
    '1. The quotation is valid for 7 days from the date of issue.',
    '2. Toll taxes, state taxes, and parking charges are subject to change based on actual route transit.',
    `3. Additional distance run beyond the estimate of ${quotation.trip.distance} KM will be charged at Rs. ${quotation.vehicle.rate}/KM.`,
    '4. Outstation night driver allowance is included in driver charges unless specified.',
    '5. Standard cancellation terms apply as per reservation policy guidelines.'
  ];
  let currentY = 210;
  terms.forEach(term => {
    doc.text(term, 15, currentY);
    currentY += 5.5;
  });

  // Footer block background
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 270, 210, 27, 'F');
  
  // Footer text
  doc.setFontSize(8.5);
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Thank you for choosing our travel services. Wish you a happy and safe journey!', 50, 278);
  doc.text('Generated electronically via Trip Quotation System. No signature required.', 53, 283);

  // Convert PDF document to Node-friendly Buffer
  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
};
