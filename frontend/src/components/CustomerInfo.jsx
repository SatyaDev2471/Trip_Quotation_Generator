import React from 'react';
import { FiUser, FiPhone, FiMail, FiBriefcase } from 'react-icons/fi';

/**
 * CustomerInfo component for capturing client contact details.
 */
export default function CustomerInfo({ customer, setCustomer, errors }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-blue-50 text-primary rounded-xl">
          <FiUser className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Customer Information</h2>
          <p className="text-xs text-slate-500">Enter primary client details for the quote</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider flex items-center">
            Customer Name <span className="text-rose-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiUser className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="name"
              value={customer.name}
              onChange={handleChange}
              placeholder="e.g. Rajesh Kumar"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.name 
                  ? 'border-rose-400 focus:ring-rose-100 focus:border-rose-500' 
                  : 'border-slate-200 focus:ring-blue-100 focus:border-primary'
              }`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs font-medium text-rose-500 flex items-center">{errors.name}</p>
          )}
        </div>

        {/* Mobile Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider flex items-center">
            Mobile Number <span className="text-rose-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiPhone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              name="mobile"
              value={customer.mobile}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.mobile 
                  ? 'border-rose-400 focus:ring-rose-100 focus:border-rose-500' 
                  : 'border-slate-200 focus:ring-blue-100 focus:border-primary'
              }`}
            />
          </div>
          {errors.mobile && (
            <p className="mt-1 text-xs font-medium text-rose-500 flex items-center">{errors.mobile}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
            Email Address <span className="text-slate-400 text-[10px] font-normal lowercase">(optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiMail className="w-4 h-4" />
            </div>
            <input
              type="email"
              name="email"
              value={customer.email}
              onChange={handleChange}
              placeholder="e.g. rajesh@company.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Address Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
            Address <span className="text-slate-400 text-[10px] font-normal lowercase">(optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiBriefcase className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="address"
              value={customer.address}
              onChange={handleChange}
              placeholder="e.g. 123 Main Street"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
