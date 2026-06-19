import React from 'react';
import { FiRefreshCw, FiSave, FiDownload, FiShare2 } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

/**
 * ActionButtons component for triggering quote computations, persistence, PDF downloading, and sharing.
 */
export default function ActionButtons({
  onGenerate,
  onSave,
  onDownloadPdf,
  onShareWhatsApp,
  isSaved,
  loading
}) {
  return (
    <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Generate / Calculate */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="flex items-center justify-center space-x-2 py-3 px-4 bg-slate-800 text-white rounded-xl font-semibold text-sm hover:bg-slate-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Generate Quote</span>
        </button>

        {/* Save Quotation */}
        <button
          type="button"
          onClick={onSave}
          disabled={loading}
          className="flex items-center justify-center space-x-2 py-3 px-4 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
        >
          <FiSave className="w-4 h-4" />
          <span>Save Quotation</span>
        </button>

        {/* Download PDF */}
        <button
          type="button"
          onClick={onDownloadPdf}
          disabled={loading || !isSaved}
          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed ${
            isSaved
              ? 'bg-success text-white hover:bg-emerald-600'
              : 'bg-emerald-50 text-emerald-400 border border-emerald-100'
          }`}
          title={!isSaved ? 'Please save the quotation first to download PDF' : 'Download PDF Document'}
        >
          <FiDownload className="w-4 h-4" />
          <span>Download PDF</span>
        </button>

        {/* Share WhatsApp */}
        <button
          type="button"
          onClick={onShareWhatsApp}
          disabled={loading || !isSaved}
          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-green-100 disabled:opacity-45 disabled:cursor-not-allowed ${
            isSaved
              ? 'bg-[#25D366] text-white hover:bg-[#20ba59]'
              : 'bg-green-50 text-green-400 border border-green-100'
          }`}
          title={!isSaved ? 'Please save the quotation first to share' : 'Share via WhatsApp'}
        >
          <FaWhatsapp className="w-4 h-4" />
          <span>WhatsApp Share</span>
        </button>
      </div>

      {!isSaved && (
        <p className="text-[11px] text-slate-400 font-medium text-center mt-3">
          💡 Note: Save the quotation to enable PDF download and WhatsApp sharing.
        </p>
      )}
    </div>
  );
}
