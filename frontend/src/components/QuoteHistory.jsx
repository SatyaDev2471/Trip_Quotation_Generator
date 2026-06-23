import React from 'react';
import { FiDownload, FiTrash2 } from 'react-icons/fi';
import { IoCarOutline } from 'react-icons/io5';

/**
 * QuoteHistory component displaying table of saved quotes with download capability
 */
export default function QuoteHistory({ history, onDownloadPdf, onDeleteHistory, loading }) {
  if (!history || history.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-10 text-center flex flex-col items-center justify-center border border-slate-200">
        <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-4">
          <IoCarOutline className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-700">No quotation history found</h3>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Fill in the customer and trip details above, click "Save Quotation" to store it here.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-white">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Quotation History Dashboard</h2>
          <p className="text-xs text-slate-500">View and retrieve previously generated customer quotations</p>
        </div>
        <div className="text-xs font-semibold text-slate-400 bg-white border border-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          Total Quotes: {history.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider bg-slate-50/30">
              <th className="py-4 px-6">Quotation ID</th>
              <th className="py-4 px-6">Customer Name</th>
              <th className="py-4 px-6">Vehicle Class</th>
              <th className="py-4 px-6">Distance (KM)</th>
              <th className="py-4 px-6">Total Amount</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
            {history.map((quote) => {
              const dateFormatted = new Date(quote.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <tr key={quote.id} className="hover:bg-slate-50/50 transition-colors group">
                  {/* ID */}
                  <td className="py-4 px-6 font-bold text-primary tracking-wider">
                    {quote.id}
                  </td>
                  
                  {/* Customer */}
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-800">{quote.customer.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">{quote.customer.mobile}</div>
                  </td>
                  
                  {/* Vehicle */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-50 text-primary font-semibold text-[10px]">
                      {quote.vehicle.name}
                    </span>
                  </td>
                  
                  {/* Distance */}
                  <td className="py-4 px-6 font-semibold text-slate-700">
                    {quote.trip.distance} KM
                  </td>
                  
                  {/* Total */}
                  <td className="py-4 px-6 font-extrabold text-slate-800">
                    ₹{quote.calculations.totalPayable.toLocaleString('en-IN')}
                  </td>
                  
                  {/* Date */}
                  <td className="py-4 px-6 font-medium text-slate-500">
                    {dateFormatted}
                  </td>
                  
                  {/* Action */}
                  <td className="py-4 px-6 text-center">
                    <div className="inline-flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onDownloadPdf(quote.id, `${quote.id}.pdf`)}
                        className="p-2 bg-emerald-50 text-success rounded-lg hover:bg-success hover:text-white transition-all duration-200 inline-flex items-center justify-center"
                        title="Download PDF Invoice"
                      >
                        <FiDownload className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteHistory?.(quote.id)}
                        className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-500 hover:text-white transition-all duration-200 inline-flex items-center justify-center"
                        title="Delete quotation history"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
