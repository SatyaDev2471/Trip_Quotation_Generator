import React from 'react';
import { FiDollarSign, FiPercent, FiTruck } from 'react-icons/fi';
import { RiRoadsterLine } from 'react-icons/ri';
import { MdOutlineLocalParking, MdDirections } from 'react-icons/md';

/**
 * CostComponents component displaying vehicle rate, driver charges, tolls, parking, and GST
 */
export default function CostComponents({ cost, setCost, selectedVehicleRate, errors }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCost(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-emerald-50 text-success rounded-xl">
          <FiDollarSign className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Cost Components</h2>
          <p className="text-xs text-slate-500">Configure base rates, allowances, taxes, and other charges</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Vehicle Rate */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider flex items-center">
            Vehicle Rate (₹/KM)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <RiRoadsterLine className="w-4 h-4" />
            </div>
            <input
              type="number"
              name="vehicleRate"
              value={cost.vehicleRate}
              onChange={handleChange}
              placeholder={selectedVehicleRate ? `${selectedVehicleRate}` : 'e.g. 12'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-success transition-all font-semibold"
            />
          </div>
        </div>

        {/* Driver Charge */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
            Driver Charge (₹)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiTruck className="w-4 h-4" />
            </div>
            <input
              type="number"
              name="driverCharge"
              value={cost.driverCharge}
              onChange={handleChange}
              placeholder="e.g. 500"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-success transition-all"
            />
          </div>
        </div>

        {/* Toll Charge */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
            Toll Charge (₹)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MdDirections className="w-4 h-4" />
            </div>
            <input
              type="number"
              name="tollCharge"
              value={cost.tollCharge}
              onChange={handleChange}
              placeholder="e.g. 350"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-success transition-all"
            />
          </div>
        </div>

        {/* Parking Charge */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
            Parking Charge (₹)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MdOutlineLocalParking className="w-4 h-4" />
            </div>
            <input
              type="number"
              name="parkingCharge"
              value={cost.parkingCharge}
              onChange={handleChange}
              placeholder="e.g. 150"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-success transition-all"
            />
          </div>
        </div>

        {/* GST % */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider flex items-center">
            GST (%)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiPercent className="w-4 h-4" />
            </div>
            <input
              type="number"
              name="gstPercent"
              value={cost.gstPercent}
              onChange={handleChange}
              placeholder="5"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-success transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
