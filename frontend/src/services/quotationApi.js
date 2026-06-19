import axios from 'axios';

const API_BASE =
  `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/quotation`;

/**
 * Generate calculations via backend validation
 */
export const generateQuotationApi = async (formData) => {
  const response = await axios.post(`${API_BASE}/generate`, formData);
  return response.data;
};

/**
 * Persist quotation to quotations.json
 */
export const saveQuotationApi = async (quotationData) => {
  const response = await axios.post(`${API_BASE}/save`, quotationData);
  return response.data;
};

/**
 * Retrieve saved quotations list
 */
export const getQuotationHistoryApi = async () => {
  const response = await axios.get(`${API_BASE}/history`);
  return response.data;
};

/**
 * Downloads a generated PDF file from the backend
 */
export const downloadQuotationPdfApi = async (id, filename = 'Quotation.pdf') => {
  const response = await axios.get(`${API_BASE}/pdf/${id}`, {
    responseType: 'blob',
  });
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

/**
 * Get WhatsApp link with formatted text
 */
export const getWhatsAppShareUrlApi = async (id, mobile) => {
  const response = await axios.get(`${API_BASE}/share/${id}`, {
    params: { mobile }
  });
  return response.data; // { whatsappUrl }
};
