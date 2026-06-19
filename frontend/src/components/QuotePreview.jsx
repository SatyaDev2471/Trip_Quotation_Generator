import React from 'react';
import { FiFileText, FiMapPin, FiCalendar, FiBriefcase, FiPhone, FiMail } from 'react-icons/fi';
import { IoCarOutline } from 'react-icons/io5';

/**
 * QuotePreview component rendering a clean visual breakdown of costs and itinerary details.
 */
export default function QuotePreview({ customer, trip, vehicle, cost, calculations, isSaved, quotationId }) {
  const customerName = customer.name || '___________';
  const customerMobile = customer.mobile || '___________';
  const pickupLoc = trip.pickupLocation || '___________';
  const dropLoc = trip.dropLocation || '___________';
  const tripDate = trip.tripDate ? new Date(trip.tripDate).toLocaleDateString('en-IN') : 'DD/MM/YYYY';
  const returnDate = trip.returnDate ? new Date(trip.returnDate).toLocaleDateString('en-IN') : 'One Way';
  
  const baseFare = calculations.baseFare || 0;
  const subtotal = calculations.subtotal || 0;
  const gstAmount = calculations.gstAmount || 0;
  const totalPayable = calculations.totalPayable || 0;

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white sticky top-6">
      {/* Header Accent */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white flex justify-between items-start">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full text-white">
            {isSaved ? 'Official Quote' : 'Live Preview'}
          </span>
          <h2 className="text-xl font-bold mt-2">TRIP QUOTATION</h2>
          <p className="text-xs text-white/70 mt-0.5">Generated via Trip Quote Pro</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase font-semibold text-white/80 tracking-wider">Quotation No</p>
          <p className="font-extrabold text-sm tracking-wider mt-0.5">{quotationId || 'DRAFT-XXXXXX'}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Customer Info Box */}
        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center">
            <FiFileText className="mr-1.5 w-3.5 h-3.5" /> Customer Details
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-slate-400">Name</p>
              <p className="font-bold text-slate-800 break-words mt-0.5">{customerName}</p>
            </div>
            <div>
              <p className="text-slate-400">Mobile</p>
              <p className="font-bold text-slate-800 break-words mt-0.5 flex items-center">
                <FiPhone className="mr-1 text-slate-400" /> {customerMobile}
              </p>
            </div>
            {customer.email && (
              <div className="col-span-2 border-t border-slate-100 pt-2">
                <p className="text-slate-400">Email Address</p>
                <p className="font-medium text-slate-700 break-all mt-0.5 flex items-center">
                  <FiMail className="mr-1 text-slate-400" /> {customer.email}
                </p>
              </div>
            )}
            {customer.company && (
              <div className="col-span-2 border-t border-slate-100 pt-2">
                <p className="text-slate-400">Company Name</p>
                <p className="font-medium text-slate-700 break-words mt-0.5 flex items-center">
                  <FiBriefcase className="mr-1 text-slate-400" /> {customer.company}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Trip Details Box */}
        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center">
            <IoCarOutline className="mr-1.5 w-4 h-4" /> Trip Details
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-start space-x-2.5">
              <FiMapPin className="text-emerald-500 w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Pickup Location</p>
                <p className="font-bold text-slate-700 mt-0.5">{pickupLoc}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2.5 border-t border-slate-100 pt-2">
              <FiMapPin className="text-rose-500 w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Drop Location</p>
                <p className="font-bold text-slate-700 mt-0.5">{dropLoc}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
              <div>
                <p className="text-slate-400">Travel Date</p>
                <p className="font-bold text-slate-700 mt-0.5 flex items-center">
                  <FiCalendar className="mr-1.5 text-slate-400" /> {tripDate}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Return Date</p>
                <p className="font-bold text-slate-700 mt-0.5 flex items-center">
                  <FiCalendar className="mr-1.5 text-slate-400" /> {returnDate}
                </p>
              </div>
              <div className="pt-2">
                <p className="text-slate-400">Distance (KM)</p>
                <p className="font-extrabold text-slate-700 mt-0.5">{trip.distance || '0'} KM</p>
              </div>
              <div className="pt-2">
                <p className="text-slate-400">Rental Duration</p>
                <p className="font-extrabold text-slate-700 mt-0.5">{trip.duration || '0'} Day(s)</p>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-100">
                <p className="text-slate-400">Vehicle Type Selected</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5 flex items-center">
                  <span className="bg-primary/10 text-primary p-1.5 rounded-lg mr-2">
                    <IoCarOutline className="w-4 h-4" />
                  </span>
                  {vehicle.name} <span className="text-xs text-slate-400 font-normal ml-1.5">(₹{cost.vehicleRate || vehicle.rate || 0}/KM)</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fare Breakdown List */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Cost Breakdown</h3>
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex justify-between items-center">
              <span>Vehicle Base Fare ({trip.distance || 0} KM x ₹{cost.vehicleRate || vehicle.rate || 0})</span>
              <span className="font-semibold text-slate-800">₹{baseFare.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Driver Charge & Allowance</span>
              <span className="font-semibold text-slate-800">₹{parseFloat(cost.driverCharge || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Toll charges</span>
              <span className="font-semibold text-slate-800">₹{parseFloat(cost.tollCharge || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Parking charges</span>
              <span className="font-semibold text-slate-800">₹{parseFloat(cost.parkingCharge || 0).toLocaleString('en-IN')}</span>
            </div>
            
            {/* Divider */}
            <div className="border-t border-dashed border-slate-200 my-3"></div>

            <div className="flex justify-between items-center font-bold text-slate-800 text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>GST ({cost.gstPercent || 5}%)</span>
              <span className="font-semibold text-slate-800">₹{gstAmount.toLocaleString('en-IN')}</span>
            </div>

            {/* Total Highlight block */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex justify-between items-center mt-4 text-primary">
              <span className="font-extrabold text-sm uppercase tracking-wider">Total Payable</span>
              <span className="font-black text-xl">₹{totalPayable.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Terms and Conditions inside receipt */}
        <div className="border-t border-slate-100 pt-4 text-[9px] text-slate-400 space-y-1">
          <p className="font-bold text-slate-500 uppercase tracking-wider mb-1">Terms & Conditions:</p>
          <p>• Quote is calculated as an estimate, valid for 7 days.</p>
          <p>• Toll and parking charges will be paid as per actual receipts.</p>
          <p>• Extra running kms will be charged at ₹{cost.vehicleRate || vehicle.rate || 0}/KM.</p>
        </div>
      </div>
    </div>
  );
}
