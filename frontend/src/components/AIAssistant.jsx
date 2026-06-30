import React, { useState } from 'react';
import { FiCpu, FiMessageSquare, FiFileText, FiAward, FiCopy, FiCheck } from 'react-icons/fi';
import { VEHICLES } from './VehicleSelector';

/**
 * AIAssistant component containing rule-based helpers.
 */
export default function AIAssistant({ customer, trip, vehicle, cost, calculations, onRecommendVehicle }) {
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  const distance = parseFloat(trip.distance) || 0;
  const duration = parseFloat(trip.duration) || 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Recommend Vehicle
  const recommendVehicle = () => {
    setActiveTab('recommend');
    if (distance <= 0) {
      setGeneratedText('⚠️ Please specify a valid trip distance in the Trip Information section first.');
      return;
    }

    let recommendedId = 'sedan';
    let explanation = '';

    if (distance < 150) {
      recommendedId = 'sedan';
      explanation = `Based on a shorter distance of ${distance} KM, a Sedan is the most cost-effective and comfortable option for your trip. It offers excellent maneuverability and pricing (₹12/KM).`;
    } else if (distance >= 150 && distance <= 300) {
      recommendedId = 'suv';
      explanation = `For a medium distance of ${distance} KM, an SUV is highly recommended. It offers better suspension, ground clearance, and comfort for highway travel (₹16/KM).`;
    } else {
      recommendedId = 'innova';
      explanation = `For long-distance touring (${distance} KM), we recommend a premium Innova Crysta or a Tempo Traveller. These vehicles provide superior cabin space, individual seats, and high comfort to reduce travel fatigue over long hours (₹20/KM - ₹28/KM).`;
    }

    const recVehicle = VEHICLES.find(v => v.id === recommendedId);

    setGeneratedText(`🤖 *AI Vehicle Recommendation*
Distance: ${distance} KM

*Recommendation:* ${recVehicle?.name} (Rate: ₹${recVehicle?.rate}/KM)
*Analysis:* ${explanation}

[Click 'Apply Recommendation' below to automatically select this vehicle in the dashboard]`);
  };

  // 2. Generate Quote Notes
  const generateNotes = () => {
    setActiveTab('notes');
    const noteText = `📌 *Important Quotation Notes:*
1. Base fare is calculated for a distance of ${distance || '___'} KM at ₹${cost.vehicleRate || vehicle.rate || '___'}/KM.
2. Estimated Toll Charge (₹${cost.tollCharge || 0}) and Parking Charge (₹${cost.parkingCharge || 0}) are pre-estimated and subject to actual receipts.
3. Driver daily allowance (₹${cost.driverCharge || 0}) is included in this quote for the duration of ${duration || '___'} day(s).
4. Standard GST of ${cost.gstPercent || 5}% is applied over the subtotal of base fare and allowances.
5. In case of route deviation, extra running charges will apply at the standard rate of ₹${cost.vehicleRate || vehicle.rate || '___'}/KM.`;
    
    setGeneratedText(noteText);
  };

  // 3. Generate Follow-up Message
  const generateFollowup = () => {
    setActiveTab('followup');
    const totalVal = calculations?.totalPayable ? `₹${calculations.totalPayable.toLocaleString('en-IN')}` : '₹_______';
    const clientName = customer.name || 'Valued Customer';
    const pickup = trip.pickupLocation || 'Pickup Location';
    const drop = trip.dropLocation || 'Drop Location';
    const date = trip.tripDate || 'Date';
    const selectedVehicleName = vehicle.name || 'Selected Vehicle';

    const followupText = `✉️ *Customer Follow-up Template:*

Dear ${clientName},

I hope this message finds you well. 

We recently prepared a customized travel quotation for your upcoming journey:
• *Route:* ${pickup} to ${drop}
• *Travel Date:* ${date}
• *Vehicle Selected:* ${selectedVehicleName}
• *Estimated Distance:* ${distance} KM (${duration} Day(s))
• *Total Estimated Fare:* ${totalVal} (Inclusive of GST)

We prioritize safety, comfort, and punctual service. Please let us know if the above details align with your expectations, or if you would like us to modify the vehicle type, schedule, or cost parameters.

Looking forward to touring with you.

Warm regards,
${customer.address || 'Travel Reservations Team'}`;

    setGeneratedText(followupText);
  };

  // 4. Generate Trip Summary
  const generateSummary = () => {
    setActiveTab('summary');
    const selectedVehicleName = vehicle.name || 'Selected Vehicle';
    const pickup = trip.pickupLocation || 'Pickup Location';
    const drop = trip.dropLocation || 'Drop Location';
    const date = trip.tripDate || 'Date';
    const returnDate = trip.returnDate;

    const summaryText = `📋 *Trip Summary Outline:*
This trip is scheduled for ${date} ${returnDate ? `with return journey on ${returnDate}` : '(One Way journey)'}. It spans an estimated distance of ${distance} KM over a duration of ${duration} day(s) utilizing a ${selectedVehicleName}. The pickup is designated at "${pickup}" with final drop-off at "${drop}". Calculations include driver allowances, regional tolls, parking charges, and relevant tax calculations.`;

    setGeneratedText(summaryText);
  };

  // Handler to apply vehicle recommendation
  const applyRecommendation = () => {
    let recommendedId = 'sedan';
    if (distance >= 150 && distance <= 300) recommendedId = 'suv';
    if (distance > 300) recommendedId = 'innova';
    const recVehicle = VEHICLES.find(v => v.id === recommendedId);
    if (recVehicle) {
      onRecommendVehicle(recVehicle);
      setGeneratedText(`✅ Selected ${recVehicle.name} (₹${recVehicle.rate}/KM) as recommended!`);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
          <FiCpu className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Rule-Based AI Assistant</h2>
          <p className="text-xs text-slate-500">Generate automated insights, follow-ups, and auto-recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <button
          type="button"
          onClick={recommendVehicle}
          className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'recommend'
              ? 'bg-violet-600 border-violet-600 text-white shadow-sm'
              : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-200'
          }`}
        >
          <FiAward className="w-3.5 h-3.5" />
          <span>Recommend Vehicle</span>
        </button>

        <button
          type="button"
          onClick={generateNotes}
          className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'notes'
              ? 'bg-violet-600 border-violet-600 text-white shadow-sm'
              : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-200'
          }`}
        >
          <FiFileText className="w-3.5 h-3.5" />
          <span>Quote Notes</span>
        </button>

        <button
          type="button"
          onClick={generateFollowup}
          className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'followup'
              ? 'bg-violet-600 border-violet-600 text-white shadow-sm'
              : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-200'
          }`}
        >
          <FiMessageSquare className="w-3.5 h-3.5" />
          <span>Follow-up Copy</span>
        </button>

        <button
          type="button"
          onClick={generateSummary}
          className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'summary'
              ? 'bg-violet-600 border-violet-600 text-white shadow-sm'
              : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-200'
          }`}
        >
          <FiFileText className="w-3.5 h-3.5" />
          <span>Trip Summary</span>
        </button>
      </div>

      {generatedText && (
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 relative animate-fade-in group">
          <div className="absolute top-3 right-3 flex items-center space-x-1">
            {activeTab === 'recommend' && distance > 0 && !generatedText.startsWith('✅') && (
              <button
                type="button"
                onClick={applyRecommendation}
                className="text-[10px] font-bold bg-violet-100 hover:bg-violet-200 text-violet-700 px-2.5 py-1.5 rounded-lg transition-all"
              >
                Apply Recommendation
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-white border border-slate-100 text-slate-500 hover:text-slate-700 hover:shadow-sm transition-all"
              title="Copy to Clipboard"
            >
              {copied ? <FiCheck className="w-3.5 h-3.5 text-emerald-500" /> : <FiCopy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="text-xs text-slate-700 font-sans whitespace-pre-wrap leading-relaxed pr-24">
            {generatedText}
          </pre>
        </div>
      )}
    </div>
  );
}
