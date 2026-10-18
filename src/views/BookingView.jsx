import React, { useState } from 'react';
import { 
  PlusCircle, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Truck, 
  Plane, 
  Ship, 
  ThermometerSnowflake, 
  Package, 
  ShieldCheck, 
  Mail, 
  Calendar, 
  MapPin, 
  Clock, 
  FileCheck
} from 'lucide-react';
import { bookShipment } from '../services/api';

export default function BookingView({ onBookingSuccess, onOpenOutbox, currentUser, onOpenAuthModal }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [authAlert, setAuthAlert] = useState(false);
  const [bookedShipment, setBookedShipment] = useState(null);

  const [formData, setFormData] = useState({
    // Step 1: Origin / Shipper
    senderName: 'Apex Precision Engineering Ltd',
    senderEmail: 'shipping@apexprecision.com',
    senderPhone: '+1 (312) 555-7800',
    originAddress: '720 Industrial Parkway, Dock 12',
    originCity: 'Chicago',
    originCountry: 'United States',
    originZip: '60607',

    // Step 2: Destination / Consignee
    receiverName: 'Vanguard Systems International',
    receiverEmail: 'intake@vanguardsystems.de',
    receiverPhone: '+49 69 5050 200',
    destAddress: 'Westhafen Tower, Speicherstraße 55',
    destCity: 'Frankfurt',
    destCountry: 'Germany',
    destZip: '60327',

    // Step 3: Cargo Details
    packageType: 'pallet',
    packageDescription: 'Precision Robotic Actuators & Calibration Sensors',
    pieces: 2,
    weightKg: 85,
    lengthCm: 100,
    widthCm: 80,
    heightCm: 110,
    declaredValue: 24500,

    // Step 4: Service & Options
    serviceType: 'express_air',
    insuranceRequired: true,
    signatureRequired: true,
    pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    notes: 'Fragile electronic instruments. Handle with care.'
  });

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const calculateEstimate = () => {
    const w = parseFloat(formData.weightKg) || 10;
    const isAir = formData.serviceType === 'express_air';
    const rate = isAir ? 11.8 : 3.5;
    const base = isAir ? 95 : 45;
    const ins = formData.insuranceRequired ? Math.max(25, formData.declaredValue * 0.0075) : 0;
    const total = base + (w * rate) + ins + 65; // includes international customs
    return Math.round(total * 100) / 100;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthAlert(true);
      if (onOpenAuthModal) onOpenAuthModal('customer');
      return;
    }
    setLoading(true);

    try {
      const payload = {
        ...formData,
        pieces: parseInt(formData.pieces) || 1,
        weightKg: parseFloat(formData.weightKg) || 1,
        dimensions: {
          length: parseFloat(formData.lengthCm) || 40,
          width: parseFloat(formData.widthCm) || 30,
          height: parseFloat(formData.heightCm) || 20,
        },
        declaredValue: parseFloat(formData.declaredValue) || 0,
        serviceName: formData.serviceType === 'express_air' 
          ? 'Apex Priority Air Express (Next-Day)' 
          : formData.serviceType === 'cold_chain'
          ? 'Apex Active Cold-Chain BioPharma'
          : formData.serviceType === 'ocean_cargo'
          ? 'Apex Ocean FCL Maritime'
          : 'Apex Standard Intermodal Ground',
      };

      const res = await bookShipment(payload);
      if (res && res.success) {
        setBookedShipment(res.data);
      }
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (bookedShipment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block">
              Consignment Confirmed & Dispatched
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
              Shipment Successfully Booked!
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto mt-2">
              Your electronic Waybill has been generated and queued for pickup.
            </p>
          </div>

          {/* Tracking Code Highlight Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 max-w-md mx-auto border border-slate-800 shadow-lg">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Electronic Tracking Code</div>
            <div className="text-3xl font-mono font-black text-sky-400 tracking-wider my-1">
              {bookedShipment.trackingNumber}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Route: {bookedShipment.originCity} &rarr; {bookedShipment.destCity}
            </div>
          </div>

          {/* Email Notification Alert Banner */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 max-w-md mx-auto text-left flex items-start space-x-3">
            <Mail className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-sky-900">
              <strong className="font-bold">Confirmation Email Dispatched!</strong>
              <div className="text-sky-700 mt-0.5">
                Sent to <strong>{bookedShipment.receiverEmail || bookedShipment.senderEmail}</strong> with full tracking link, cargo manifest, and printable waybill.
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onBookingSuccess(bookedShipment.trackingNumber)}
              className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors flex items-center justify-center space-x-2"
            >
              <span>Track This Consignment Live</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenOutbox}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-xl text-xs transition-colors border border-slate-300"
            >
              Inspect Sent Email in Outbox
            </button>
            <button
              onClick={() => { setBookedShipment(null); setStep(1); }}
              className="w-full sm:w-auto text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              Book Another Shipment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Wizard Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
          Self-Service Consignment Booking
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
          Book & Dispatch a Freight Consignment
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Complete the 5-step form to schedule cargo pickup and generate instant waybills.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between text-xs">
        {[
          { num: 1, label: 'Shipper (Origin)' },
          { num: 2, label: 'Consignee (Dest)' },
          { num: 3, label: 'Cargo Specs' },
          { num: 4, label: 'Service Level' },
          { num: 5, label: 'Confirm & Dispatch' }
        ].map((s) => (
          <div key={s.num} className="flex items-center space-x-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
              step >= s.num ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              {s.num}
            </div>
            <span className={`hidden sm:inline font-semibold ${step >= s.num ? 'text-slate-900' : 'text-slate-400'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: SHIPPER (ORIGIN) */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 1: Shipper & Collection Origin</h3>
                <p className="text-slate-500">Provide the pickup address and shipper contact details.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company / Shipper Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.senderName}
                    onChange={(e) => handleInputChange('senderName', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shipper Email (for Waybill copy) *</label>
                  <input
                    type="email"
                    required
                    value={formData.senderEmail}
                    onChange={(e) => handleInputChange('senderEmail', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shipper Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.senderPhone}
                    onChange={(e) => handleInputChange('senderPhone', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Street Address & Dock Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.originAddress}
                    onChange={(e) => handleInputChange('originAddress', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Origin City *</label>
                  <input
                    type="text"
                    required
                    value={formData.originCity}
                    onChange={(e) => handleInputChange('originCity', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Postal / Zip Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.originZip}
                    onChange={(e) => handleInputChange('originZip', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={formData.originCountry}
                    onChange={(e) => handleInputChange('originCountry', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center space-x-1.5"
                >
                  <span>Proceed to Destination</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONSIGNEE (DESTINATION) */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 2: Consignee & Delivery Destination</h3>
                <p className="text-slate-500">Provide the delivery destination and recipient email (they will receive real-time updates).</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Consignee / Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.receiverName}
                    onChange={(e) => handleInputChange('receiverName', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recipient Email (for Automated Milestone Notifications) *</label>
                  <input
                    type="email"
                    required
                    value={formData.receiverEmail}
                    onChange={(e) => handleInputChange('receiverEmail', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recipient Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.receiverPhone}
                    onChange={(e) => handleInputChange('receiverPhone', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Delivery Street Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.destAddress}
                    onChange={(e) => handleInputChange('destAddress', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination City *</label>
                  <input
                    type="text"
                    required
                    value={formData.destCity}
                    onChange={(e) => handleInputChange('destCity', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Postal / Zip Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.destZip}
                    onChange={(e) => handleInputChange('destZip', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={formData.destCountry}
                    onChange={(e) => handleInputChange('destCountry', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center space-x-1.5"
                >
                  <span>Proceed to Cargo Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CARGO SPECS */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 3: Cargo Specifications & Weight</h3>
                <p className="text-slate-500">Accurate dimensions allow automated loading density and freight calculation.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Packaging Classification *</label>
                  <select
                    value={formData.packageType}
                    onChange={(e) => handleInputChange('packageType', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="pallet">Standard Euro/US Pallet (Skid)</option>
                    <option value="parcel">Boxed Express Parcel / Carton</option>
                    <option value="container">Ocean Intermodal Container (FCL)</option>
                    <option value="documents">Security Document Pouch</option>
                    <option value="crate">Heavy Industrial Wooden Crate</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cargo Item Description *</label>
                  <input
                    type="text"
                    required
                    value={formData.packageDescription}
                    onChange={(e) => handleInputChange('packageDescription', e.target.value)}
                    placeholder="e.g. Electrical Components, Machinery"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pieces / Qty *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.pieces}
                    onChange={(e) => handleInputChange('pieces', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Weight (kg) *</label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.weightKg}
                    onChange={(e) => handleInputChange('weightKg', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Declared Value ($) *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.declaredValue}
                    onChange={(e) => handleInputChange('declaredValue', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Pickup Date *</label>
                  <input
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Length (cm)</label>
                  <input
                    type="number"
                    value={formData.lengthCm}
                    onChange={(e) => handleInputChange('lengthCm', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Width (cm)</label>
                  <input
                    type="number"
                    value={formData.widthCm}
                    onChange={(e) => handleInputChange('widthCm', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={formData.heightCm}
                    onChange={(e) => handleInputChange('heightCm', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center space-x-1.5"
                >
                  <span>Select Service Tier</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SERVICE LEVEL */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 4: Transit Speed & Value Additions</h3>
                <p className="text-slate-500">Choose the optimal transit mode for your delivery deadline.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'express_air',
                    title: 'Priority Air Express',
                    speed: '1-2 Days Guaranteed',
                    rate: '$11.80/kg',
                    icon: Plane,
                    desc: 'Fastest transit with belly-hold priority and direct airport courier release.'
                  },
                  {
                    id: 'standard_ground',
                    title: 'Intermodal Ground Freight',
                    speed: '3-5 Business Days',
                    rate: '$2.85/kg',
                    icon: Truck,
                    desc: 'Cost-effective highway and rail network for commercial palletized cargo.'
                  },
                  {
                    id: 'cold_chain',
                    title: 'BioPharma Cold Chain (2°-8°C)',
                    speed: '2-3 Days',
                    rate: '$8.40/kg',
                    icon: ThermometerSnowflake,
                    desc: 'Validated cold storage with live continuous calibrated temperature sensors.'
                  },
                  {
                    id: 'ocean_cargo',
                    title: 'Ocean Maritime FCL',
                    speed: '14-22 Days',
                    rate: '$0.85/kg',
                    icon: Ship,
                    desc: 'Maximum economy for high-volume international container cargo.'
                  }
                ].map((tier) => {
                  const Icon = tier.icon;
                  const isSelected = formData.serviceType === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => handleInputChange('serviceType', tier.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{tier.title}</div>
                            <div className="text-[11px] text-sky-700 font-semibold">{tier.speed}</div>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-slate-900">{tier.rate}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-2">{tier.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Add-ons */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-800">Security & Protection Add-ons:</div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.insuranceRequired}
                      onChange={(e) => handleInputChange('insuranceRequired', e.target.checked)}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span>Include Full Declared Value Cargo Insurance (+0.75%)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.signatureRequired}
                      onChange={(e) => handleInputChange('signatureRequired', e.target.checked)}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span>Direct Consignee Signature Required ($15)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center space-x-1.5"
                >
                  <span>Review Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & DISPATCH */}
          {step === 5 && (
            <div className="space-y-6 animate-fade-in text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 5: Review & Confirm Dispatch</h3>
                <p className="text-slate-500">Confirm consignment details. Once submitted, your tracking number and email notification are generated.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">Shipper (Pickup)</div>
                  <div className="font-bold text-slate-900">{formData.senderName}</div>
                  <div className="text-slate-600">{formData.originAddress}</div>
                  <div className="text-slate-600">{formData.originCity}, {formData.originCountry} ({formData.originZip})</div>
                  <div className="text-slate-500 mt-1">{formData.senderEmail}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">Consignee (Delivery)</div>
                  <div className="font-bold text-slate-900">{formData.receiverName}</div>
                  <div className="text-slate-600">{formData.destAddress}</div>
                  <div className="text-slate-600">{formData.destCity}, {formData.destCountry} ({formData.destZip})</div>
                  <div className="text-sky-700 font-semibold mt-1 flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Notification will send to: {formData.receiverEmail}</span>
                  </div>
                </div>
              </div>

              {/* Authentication Status Gate */}
              {!currentUser ? (
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold shadow-md">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-amber-950">
                        Shipper Authentication Required
                      </div>
                      <div className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                        To dispatch this consignment, bind insurance liability, and issue an official e-Waybill, please sign in or register before completing your booking.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => onOpenAuthModal && onOpenAuthModal('customer')}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-black bg-amber-600 hover:bg-amber-500 text-white shadow-md flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Sign In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenAuthModal && onOpenAuthModal('customer')}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-white shadow-md flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Register Account</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-left flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-950">
                        Verified Shipper Account: {currentUser.fullName || currentUser.username}
                      </div>
                      <div className="text-[11px] text-emerald-700">
                        {currentUser.email} &bull; {currentUser.company || 'Enterprise Shipper'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-800 border border-emerald-400">
                    VERIFIED SHIPPER
                  </span>
                </div>
              )}

              {/* Price Calculation Summary */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Estimated Charge</div>
                    <div className="text-3xl font-extrabold text-sky-400 font-mono mt-1">
                      ${calculateEstimate()} <span className="text-xs text-slate-400 font-normal">USD</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Includes linehaul freight, customs handling, fuel index & verified electronic waybill.
                    </div>
                  </div>

                  {!currentUser ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthAlert(true);
                        if (onOpenAuthModal) onOpenAuthModal('customer');
                      }}
                      className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-extrabold px-8 py-4 rounded-xl shadow-xl shadow-amber-600/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Sign In / Register to Complete</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold px-8 py-4 rounded-xl shadow-xl shadow-sky-600/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Confirm & Dispatch Consignment</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Options</span>
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
