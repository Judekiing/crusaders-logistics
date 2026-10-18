import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Truck, 
  Plane, 
  Ship, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  Mail, 
  Download, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Building,
  Box,
  Compass,
  Thermometer
} from 'lucide-react';
import { fetchShipment, sendTestEmail } from '../services/api';

const STATUS_STEPS = [
  { key: 'ORDER_PLACED', label: 'Order Booked' },
  { key: 'PICKED_UP', label: 'Cargo Collected' },
  { key: 'IN_TRANSIT', label: 'In Transit' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' }
];

export default function TrackingView({ initialTrackingNumber, onOpenEmailOutbox }) {
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber || 'APX-774921-US');
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailAlertInput, setEmailAlertInput] = useState('');
  const [emailAlertSuccess, setEmailAlertSuccess] = useState(false);
  const [showWaybillModal, setShowWaybillModal] = useState(false);

  useEffect(() => {
    if (initialTrackingNumber) {
      setTrackingNumber(initialTrackingNumber);
      handleSearch(initialTrackingNumber);
    } else {
      handleSearch('APX-774921-US');
    }
  }, [initialTrackingNumber]);

  const handleSearch = async (codeToSearch) => {
    const code = (codeToSearch || trackingNumber).trim();
    if (!code) return;

    setLoading(true);
    setError(null);
    setEmailAlertSuccess(false);

    try {
      const res = await fetchShipment(code);
      if (res && res.success) {
        setShipment(res.data);
      } else {
        setError(res?.message || 'No shipment found with tracking code ' + code);
        setShipment(null);
      }
    } catch (err) {
      setError('Network error connecting to tracking database.');
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribeAlerts = async (e) => {
    e.preventDefault();
    if (!emailAlertInput || !shipment) return;

    try {
      await sendTestEmail({
        email: emailAlertInput,
        customMessage: `Live alert subscription verified for Consignment ${shipment.trackingNumber}. You will receive milestone updates.`
      });
      setEmailAlertSuccess(true);
      setTimeout(() => setEmailAlertSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const getStepStatus = (stepKey, currentStatus) => {
    const order = ['ORDER_PLACED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIdx = order.indexOf(currentStatus);
    const stepIdx = order.indexOf(stepKey);

    if (currentIdx > stepIdx) return 'completed';
    if (currentIdx === stepIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-700">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>Global Cargo Tracking & Telemetry System</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Track Consignment in Real Time
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            Enter your 10-14 digit Waybill Number, Bill of Lading, or Customer Reference to inspect instant milestone telemetry.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="mt-6 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number (e.g. APX-774921-US)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-sky-500/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Status</span>
                </>
              )}
            </button>
          </form>

          {/* Preset demo shortcuts */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Quick Samples:</span>
            {[
              { code: 'APX-774921-US', label: 'Air Express (In Transit)' },
              { code: 'APX-304912-EU', label: 'BioPharma (Out for Delivery)' },
              { code: 'APX-992100-AS', label: 'Maritime (Delivered)' }
            ].map((p) => (
              <button
                key={p.code}
                onClick={() => { setTrackingNumber(p.code); handleSearch(p.code); }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-mono text-[11px] transition-colors"
              >
                {p.code} &bull; <span className="text-sky-300">{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <div>{error}</div>
        </div>
      )}

      {shipment && (
        <div className="space-y-8 animate-fade-in">
          {/* Main Status & Waybill Overview Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-900 text-sky-400">
                    AWB: {shipment.trackingNumber}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    shipment.currentStatus === 'DELIVERED' 
                      ? 'bg-emerald-100 text-emerald-800'
                      : shipment.currentStatus === 'OUT_FOR_DELIVERY'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}>
                    {shipment.statusLabel || shipment.currentStatus.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  {shipment.originCity}, {shipment.originCountry} &rarr; {shipment.destCity}, {shipment.destCountry}
                </h2>
                <div className="text-xs text-slate-500 mt-1 flex items-center space-x-3">
                  <span>Service: <strong className="text-slate-800">{shipment.serviceName || shipment.serviceType}</strong></span>
                  <span>&bull;</span>
                  <span>Pieces: <strong className="text-slate-800">{shipment.pieces || 1}</strong></span>
                  <span>&bull;</span>
                  <span>Gross Weight: <strong className="text-slate-800">{shipment.weightKg} kg</strong></span>
                </div>
              </div>

              {/* Delivery ETA Pill */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl md:text-right min-w-[220px]">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {shipment.currentStatus === 'DELIVERED' ? 'Delivery Completed On' : 'Estimated Time of Arrival'}
                </div>
                <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                  {new Date(shipment.estimatedDelivery).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <div className="text-xs text-slate-500 flex items-center md:justify-end space-x-1 mt-1">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  <span>
                    {shipment.currentStatus === 'DELIVERED' ? 'Signed & Received' : 'Guaranteed Window: 09:00 - 18:00'}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual 5-Stage Stepper */}
            <div className="py-8">
              <div className="grid grid-cols-5 relative">
                {/* Horizontal connector line */}
                <div className="absolute top-5 left-0 w-full h-1 bg-slate-200 -z-0"></div>

                {STATUS_STEPS.map((step, idx) => {
                  const state = getStepStatus(step.key, shipment.currentStatus);
                  return (
                    <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        state === 'completed'
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                          : state === 'current'
                          ? 'bg-sky-500 text-white ring-4 ring-sky-100 animate-pulse'
                          : 'bg-white text-slate-400 border-2 border-slate-300'
                      }`}>
                        {state === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      <div className="mt-3">
                        <div className={`text-xs font-bold ${
                          state === 'current' ? 'text-sky-600' : state === 'completed' ? 'text-slate-800' : 'text-slate-400'
                        }`}>
                          {step.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-semibold text-slate-700">Carrier Unit:</span>
                <span className="text-slate-600 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {shipment.vehicleInfo || shipment.assignedDriver || 'Apex Fleet Logistics'}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowWaybillModal(true)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Electronic Waybill</span>
                </button>
              </div>
            </div>
          </div>

          {/* TWO COLUMNS: Simulated Telemetry Map & Route Checkpoint Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Simulated Route & Telemetry Card */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Simulated Route Visualization Canvas */}
              <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl overflow-hidden relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Telemetry Map</span>
                  </div>
                  <span className="text-[11px] font-mono text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                    GPS Fix &bull; Active
                  </span>
                </div>

                {/* Route visualization graph */}
                <div className="py-6 px-4 bg-slate-900/80 rounded-2xl border border-slate-800/80 space-y-6 relative">
                  
                  {/* Origin */}
                  <div className="flex items-start space-x-3 relative">
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
                      <Building className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Origin Hub</div>
                      <div className="text-xs font-bold text-white">{shipment.originCity}, {shipment.originCountry}</div>
                      <div className="text-[11px] text-slate-400">{shipment.originAddress}</div>
                    </div>
                  </div>

                  {/* Connecting Line with pulse */}
                  <div className="ml-3.5 pl-6 border-l-2 border-dashed border-sky-500/60 py-2">
                    <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-sky-950 text-sky-400 border border-sky-800 text-[11px] font-mono">
                      <Truck className="w-3.5 h-3.5 animate-bounce" />
                      <span>
                        Current: {shipment.checkpoints[shipment.checkpoints.length - 1]?.location || shipment.destCity}
                      </span>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="flex items-start space-x-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Destination Depot</div>
                      <div className="text-xs font-bold text-white">{shipment.destCity}, {shipment.destCountry}</div>
                      <div className="text-[11px] text-slate-400">{shipment.destAddress}</div>
                    </div>
                  </div>
                </div>

                {/* IoT Telemetry Data Readout */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Assigned Unit</div>
                    <div className="font-semibold text-white mt-0.5 truncate">{shipment.assignedDriver || 'Transit Fleet #88'}</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Security Seal</div>
                    <div className="font-semibold text-emerald-400 mt-0.5 font-mono">SEAL-OK &bull; Verified</div>
                  </div>
                </div>

                {shipment.serviceType === 'cold_chain' && (
                  <div className="mt-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 flex items-center space-x-3 text-xs">
                    <Thermometer className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-cyan-300">Active Temp Telemetry: 3.9°C</div>
                      <div className="text-[11px] text-slate-400">GDP compliant range: 2.0°C to 8.0°C. Zero breach detected.</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Instant Email Updates Subscription Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md">
                <div className="flex items-center space-x-2 text-sky-600 mb-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Email Milestone Notifications</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Receive Live Email Alerts
                </h3>
                <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
                  Enter your email address to automatically receive instant HTML notifications every time this consignment clears a checkpoint or is handed off to local couriers.
                </p>

                <form onSubmit={handleSubscribeAlerts} className="space-y-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter recipient email..."
                    value={emailAlertInput}
                    onChange={(e) => setEmailAlertInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-md shadow-sky-600/20"
                  >
                    <span>Subscribe to Email Alerts</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {emailAlertSuccess && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Notification test ping dispatched to your inbox! Check the Email Outbox.</span>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Verified Checkpoints Event Timeline */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Verified Milestone Audit Log</h3>
                    <p className="text-xs text-slate-500">Chronological chain of custody and checkpoint scans</p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                    {shipment.checkpoints.length} Recorded Events
                  </span>
                </div>

                <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                  {shipment.checkpoints.slice().reverse().map((chk, idx) => {
                    const isLatest = idx === 0;
                    return (
                      <div key={chk.id || idx} className="relative flex items-start space-x-4 pl-1">
                        {/* Bullet node */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                          isLatest
                            ? 'bg-sky-500 text-white ring-4 ring-sky-100'
                            : 'bg-emerald-500 text-white'
                        }`}>
                          {isLatest ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                        </div>

                        {/* Content box */}
                        <div className="flex-1 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl p-4 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <span className="text-xs font-bold text-slate-900">
                              {chk.statusTitle || chk.status}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">
                              {new Date(chk.timestamp).toLocaleString()}
                            </span>
                          </div>

                          <div className="text-xs text-sky-700 font-semibold flex items-center space-x-1.5 mt-1">
                            <MapPin className="w-3 h-3 text-sky-500" />
                            <span>{chk.location}</span>
                            {chk.operator && (
                              <span className="text-slate-400 font-normal">&bull; Logged by: {chk.operator}</span>
                            )}
                          </div>

                          {chk.notes && (
                            <p className="text-xs text-slate-600 mt-2 bg-white p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
                              "{chk.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* WAYBILL MODAL */}
      {showWaybillModal && shipment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">Electronic Air Waybill (e-AWB)</div>
                <h3 className="text-2xl font-black text-slate-900 font-mono mt-0.5">{shipment.trackingNumber}</h3>
              </div>
              <button
                onClick={() => setShowWaybillModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            {/* Mock barcode */}
            <div className="text-center py-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="font-mono text-xs tracking-[6px] text-slate-800 font-bold mb-1">
                ||||| | |||| |||||| ||| ||||||| |||| ||||||
              </div>
              <div className="font-mono text-xs text-slate-500">{shipment.trackingNumber}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Shipper</span>
                <div className="font-bold text-slate-900 mt-1">{shipment.senderName}</div>
                <div className="text-slate-600">{shipment.originCity}, {shipment.originCountry}</div>
                <div className="text-slate-500 text-[11px]">{shipment.senderPhone}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Consignee</span>
                <div className="font-bold text-slate-900 mt-1">{shipment.receiverName}</div>
                <div className="text-slate-600">{shipment.destCity}, {shipment.destCountry}</div>
                <div className="text-slate-500 text-[11px]">{shipment.receiverPhone}</div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left divide-y divide-slate-200">
                <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 font-bold">
                  <tr>
                    <th className="p-2.5">Pieces</th>
                    <th className="p-2.5">Gross Weight</th>
                    <th className="p-2.5">Declared Value</th>
                    <th className="p-2.5">Service</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5">{shipment.pieces || 1}</td>
                    <td className="p-2.5">{shipment.weightKg} kg</td>
                    <td className="p-2.5">${(shipment.declaredValue || 0).toLocaleString()} USD</td>
                    <td className="p-2.5 font-semibold text-sky-700">{shipment.serviceType}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Print Waybill
              </button>
              <button
                onClick={() => setShowWaybillModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
