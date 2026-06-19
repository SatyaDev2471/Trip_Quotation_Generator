import React, { useState, useEffect } from 'react';
import { calculateQuotation } from '../utils/calculator';
import {
  generateQuotationApi,
  saveQuotationApi,
  getQuotationHistoryApi,
  downloadQuotationPdfApi,
  getWhatsAppShareUrlApi
} from '../services/quotationApi';
import CustomerInfo from '../components/CustomerInfo';
import TripInfo from '../components/TripInfo';
import VehicleSelector, { VEHICLES } from '../components/VehicleSelector';
import CostComponents from '../components/CostComponents';
import AIAssistant from '../components/AIAssistant';
import QuotePreview from '../components/QuotePreview';
import ActionButtons from '../components/ActionButtons';
import QuoteHistory from '../components/QuoteHistory';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

/**
 * Home component acting as the main dashboard orchestrator.
 */
export default function Home() {
  // Master states
  const [customer, setCustomer] = useState({
    name: '',
    mobile: '',
    email: '',
    company: ''
  });

  const [trip, setTrip] = useState({
    pickupLocation: '',
    dropLocation: '',
    tripDate: '',
    returnDate: '',
    distance: '',
    duration: ''
  });

  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[0]); // default Sedan

  const [cost, setCost] = useState({
    vehicleRate: VEHICLES[0].rate.toString(),
    driverCharge: '500',
    tollCharge: '0',
    parkingCharge: '0',
    gstPercent: '5'
  });

  const [calculations, setCalculations] = useState({
    baseFare: 0,
    subtotal: 0,
    gstAmount: 0,
    totalPayable: 0
  });

  // UI state variables
  const [errors, setErrors] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [savedQuotationId, setSavedQuotationId] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // 1. Fetch history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // 2. Auto-compute calculations when pricing inputs change for real-time preview
  useEffect(() => {
    const computed = calculateQuotation(
      trip.distance,
      cost.vehicleRate || selectedVehicle.rate,
      cost.driverCharge,
      cost.tollCharge,
      cost.parkingCharge,
      cost.gstPercent
    );
    setCalculations(computed);
    // Any change to inputs invalidates saved state (they must click save again to record new data)
    setIsSaved(false);
    setSavedQuotationId('');
  }, [trip.distance, cost, selectedVehicle]);

  // Helper to show custom status toast
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const fetchHistory = async () => {
    try {
      const data = await getQuotationHistoryApi();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  // Select vehicle callback
  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setCost(prev => ({
      ...prev,
      vehicleRate: vehicle.rate.toString()
    }));
  };

  // Perform form validation
  const validateForm = () => {
    const newErrors = {};
    if (!customer.name.trim()) newErrors.name = 'Customer name is required.';
    if (!customer.mobile.trim()) newErrors.mobile = 'Mobile number is required.';
    
    if (!trip.pickupLocation.trim()) newErrors.pickupLocation = 'Pickup location is required.';
    if (!trip.dropLocation.trim()) newErrors.dropLocation = 'Drop location is required.';
    if (!trip.tripDate) newErrors.tripDate = 'Trip date is required.';
    
    const distNum = parseFloat(trip.distance);
    if (!trip.distance || isNaN(distNum) || distNum <= 0) {
      newErrors.distance = 'Distance must be greater than 0.';
    }
    
    const durNum = parseFloat(trip.duration);
    if (!trip.duration || isNaN(durNum) || durNum <= 0) {
      newErrors.duration = 'Rental duration must be greater than 0.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Action: Generate Quotation via Backend computation (as verification step)
  const handleGenerate = async () => {
    if (!validateForm()) {
      showToast('Please correct validation errors first.', 'error');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        distance: trip.distance,
        vehicleRate: cost.vehicleRate || selectedVehicle.rate,
        driverCharge: cost.driverCharge,
        tollCharge: cost.tollCharge,
        parkingCharge: cost.parkingCharge,
        gstPercent: cost.gstPercent
      };
      
      const response = await generateQuotationApi(payload);
      setCalculations(response.calculations);
      showToast('Calculations updated and verified successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to verify calculations with server. Using client calculation instead.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Action: Save Quotation to JSON database
  const handleSave = async () => {
    if (!validateForm()) {
      showToast('Please correct validation errors before saving.', 'error');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        customer,
        trip,
        vehicle: {
          id: selectedVehicle.id,
          name: selectedVehicle.name,
          rate: cost.vehicleRate || selectedVehicle.rate
        },
        cost: {
          driverCharge: cost.driverCharge,
          tollCharge: cost.tollCharge,
          parkingCharge: cost.parkingCharge,
          gstPercent: cost.gstPercent
        }
      };

      const savedQuote = await saveQuotationApi(payload);
      setIsSaved(true);
      setSavedQuotationId(savedQuote.id);
      showToast(`Quotation ${savedQuote.id} saved successfully!`, 'success');
      
      // Refresh dashboard list
      fetchHistory();
    } catch (err) {
      console.error(err);
      showToast('Failed to save quotation.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Action: Download PDF for current saved quotation
  const handleDownloadPdf = async () => {
    if (!isSaved || !savedQuotationId) {
      showToast('Save the quotation first to generate PDF.', 'error');
      return;
    }
    setLoading(true);
    try {
      await downloadQuotationPdfApi(savedQuotationId, `Quotation-${savedQuotationId}.pdf`);
      showToast('PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to download PDF.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Action: Download PDF of historical records
  const handleDownloadHistoryPdf = async (id, filename) => {
    try {
      await downloadQuotationPdfApi(id, filename);
      showToast(`Downloaded PDF for ${id}`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to download historical PDF.', 'error');
    }
  };

  // Action: Share current quotation link via WhatsApp in browser
  const handleShareWhatsApp = async () => {
    if (!isSaved || !savedQuotationId) {
      showToast('Save the quotation first to enable WhatsApp sharing.', 'error');
      return;
    }

    if (!customer.mobile.trim()) {
      showToast('Enter a mobile number to share via WhatsApp.', 'error');
      return;
    }

    try {
      // Open a blank window synchronously (prevents popup blockers), then navigate it when API responds
      const newWindow = window.open('', '_blank');
      const newWindowBlocked = !newWindow;
      const data = await getWhatsAppShareUrlApi(savedQuotationId, customer.mobile);
      if (data && data.whatsappUrl) {
        if (newWindowBlocked) {
          // Popup was blocked — navigate current tab as fallback
          window.location.href = data.whatsappUrl;
        } else {
          try {
            newWindow.location.href = data.whatsappUrl;
          } catch (err) {
            // In some strict environments setting location may fail; fallback to opening a new tab
            try { newWindow.close(); } catch (_) {}
            window.open(data.whatsappUrl, '_blank');
          }
        }
        showToast('WhatsApp link opened!', 'success');
      } else {
        if (!newWindowBlocked) try { newWindow.close(); } catch (_) {}
        showToast('Failed to generate WhatsApp URL.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to generate WhatsApp share link.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification Banner */}
      {toast.show && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center space-x-2 py-3.5 px-5 rounded-2xl shadow-xl border text-sm font-semibold transition-all duration-300 transform translate-y-0 ${
          toast.type === 'error'
            ? 'bg-rose-50 border-rose-100 text-rose-700'
            : 'bg-emerald-50 border-emerald-100 text-emerald-700'
        }`}>
          {toast.type === 'error' ? <FiAlertCircle className="w-5 h-5" /> : <FiCheckCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200/80 pb-6 gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800 flex items-center">
              Trip Quotation <span className="text-primary ml-2">Generator</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Configure professional trip cost calculations, get AI recommendations, and generate travel invoices.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-400 bg-white border border-slate-200/85 px-4 py-2 rounded-2xl shadow-sm">
            Status: Ready
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Inputs - Occupies 7 columns */}
          <div className="lg:col-span-7 space-y-8">
            <CustomerInfo 
              customer={customer} 
              setCustomer={setCustomer} 
              errors={errors} 
            />
            
            <TripInfo 
              trip={trip} 
              setTrip={setTrip} 
              errors={errors} 
            />
            
            <VehicleSelector 
              selectedVehicleId={selectedVehicle.id} 
              onSelect={handleSelectVehicle} 
            />
            
            <CostComponents 
              cost={cost} 
              setCost={setCost} 
              selectedVehicleRate={selectedVehicle.rate} 
              errors={errors} 
            />
            
            <AIAssistant 
              customer={customer}
              trip={trip}
              vehicle={selectedVehicle}
              cost={cost}
              calculations={calculations}
              onRecommendVehicle={handleSelectVehicle}
            />

            <ActionButtons 
              onGenerate={handleGenerate}
              onSave={handleSave}
              onDownloadPdf={handleDownloadPdf}
              onShareWhatsApp={handleShareWhatsApp}
              isSaved={isSaved}
              loading={loading}
            />
          </div>

          {/* Right Live Preview Sticky Receipt - Occupies 5 columns */}
          <div className="lg:col-span-5 lg:sticky lg:top-6">
            <QuotePreview 
              customer={customer}
              trip={trip}
              vehicle={selectedVehicle}
              cost={cost}
              calculations={calculations}
              isSaved={isSaved}
              quotationId={savedQuotationId}
            />
          </div>
        </div>

        {/* Bottom Quotation History Dashboard */}
        <div className="pt-4">
          <QuoteHistory 
            history={history} 
            onDownloadPdf={handleDownloadHistoryPdf}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
