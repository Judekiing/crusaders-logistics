import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  ArrowRight, 
  Truck, 
  Plane, 
  Ship, 
  ThermometerSnowflake, 
  ShieldCheck, 
  CheckCircle2, 
  Info,
  DollarSign,
  Send,
  Mail
} from 'lucide-react';
import { calculateRates, submitQuote } from '../services/api';

export default function RateCalculatorView({ onSelectRateToBook, onOpenOutbox }) {
  const [params, setParams] = useState({
    originCountry: 'US',
    destCountry: 'DE',
    weightKg: 45,
    lengthCm: 80,
    widthCm: 60,
    heightCm: 50,
    pieces: 1,
    declaredValue: 8500,
    insuranceRequired: true,
    signatureRequired: true
  });

  const [rateResults, setRateResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Custom high-volume quote form
  const [quoteForm, setQuoteForm] = useState({
    clientName: 'Global Manufacturing Inc.',
    clientEmail: 'procurement@globalmanufacturing.com',
    originCity: 'Shanghai, China',
    destCity: 'Rotterdam, Netherlands',
    cargoType: 'Industrial Heavy Machinery & Assemblies',
    weightKg: 12500,
    serviceType: 'ocean_cargo',
    notes: 'Requires 40ft Flat-Rack container and specialized crane loading.'
  });
  const [quoteSuccess, setQuoteSuccess] = useState(null);
  const [submittingQuote, setSubmittingQuote] = useState(false);

  useEffect(() => {
    runCalculation();
  }, []);

  const runCalculation = async () => {
    setLoading(true);
    try {
      const res = await calculateRates(params);
      if (res && res.success) {
        setRateResults(res.data);
      }
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomQuoteSubmit = async (e) => {
    e.preventDefault();
    setSubmittingQuote(true);
    try {
      const res = await submitQuote({
        ...quoteForm,
        estimatedRate: Math.round(quoteForm.weightKg * 1.85 + 450)
      });

      if (res && res.success) {
        setQuoteSuccess(`Quotation #${res.data.id} issued! Confirmation email dispatched to ${quoteForm.clientEmail}.`);
        setTimeout(() => setQuoteSuccess(null), 8000);
      }
    } catch (err) {
      console.error('Submit quote error:', err);
    } finally {
      setSubmittingQuote(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
          IATA Standard Rate Calculation Engine
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
          Freight Rates & Volumetric Calculator
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-2">
          Calculate instant door-to-door and port-to-port estimates with transparent line-item fee breakdowns including fuel surcharges and customs clearance.
        </p>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-sky-600" />
              <span>Consignment Parameters</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">Live Auto-Compute</span>
          </div>

          {/* Route Countries */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Origin Country</label>
              <select
                value={params.originCountry}
                onChange={(e) => setParams({ ...params, originCountry: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500"
              >
                <option value="US">United States (US)</option>
                <option value="DE">Germany (DE)</option>
                <option value="NL">Netherlands (NL)</option>
                <option value="SG">Singapore (SG)</option>
                <option value="CN">China (CN)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="AE">United Arab Emirates (AE)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Destination Country</label>
              <select
                value={params.destCountry}
                onChange={(e) => setParams({ ...params, destCountry: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500"
              >
                <option value="DE">Germany (DE)</option>
                <option value="US">United States (US)</option>
                <option value="NL">Netherlands (NL)</option>
                <option value="SG">Singapore (SG)</option>
                <option value="CN">China (CN)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="AE">United Arab Emirates (AE)</option>
              </select>
            </div>
          </div>

          {/* Weight & Pieces */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gross Weight (kg)</label>
              <input
                type="number"
                min="1"
                value={params.weightKg}
                onChange={(e) => setParams({ ...params, weightKg: parseFloat(e.target.value) || 1 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Number of Pieces</label>
              <input
                type="number"
                min="1"
                value={params.pieces}
                onChange={(e) => setParams({ ...params, pieces: parseInt(e.target.value) || 1 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Dimensions (L &times; W &times; H cm per piece)</label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="Length"
                value={params.lengthCm}
                onChange={(e) => setParams({ ...params, lengthCm: parseFloat(e.target.value) || 10 })}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
              <input
                type="number"
                placeholder="Width"
                value={params.widthCm}
                onChange={(e) => setParams({ ...params, widthCm: parseFloat(e.target.value) || 10 })}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
              <input
                type="number"
                placeholder="Height"
                value={params.heightCm}
                onChange={(e) => setParams({ ...params, heightCm: parseFloat(e.target.value) || 10 })}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Declared Value & Insurance */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Declared Value (USD)</label>
            <input
              type="number"
              min="0"
              value={params.declaredValue}
              onChange={(e) => setParams({ ...params, declaredValue: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold"
            />
          </div>

          <div className="space-y-2 pt-1 border-t border-slate-100">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={params.insuranceRequired}
                onChange={(e) => setParams({ ...params, insuranceRequired: e.target.checked })}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
              <span>Cargo Loss & Damage Insurance (+0.75%)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={params.signatureRequired}
                onChange={(e) => setParams({ ...params, signatureRequired: e.target.checked })}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
              <span>Direct Handover Signature ($15.00)</span>
            </label>
          </div>

          <button
            type="button"
            onClick={runCalculation}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-sky-600/20"
          >
            Compute Rates & Volumetric Weight
          </button>
        </div>

        {/* Right Output Comparison Column */}
        <div className="lg:col-span-7 space-y-6">
          {rateResults && (
            <>
              {/* Volumetric Weight Technical Box */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                      IATA Volumetric Weight Analysis
                    </div>
                    <div className="text-xl font-black text-white mt-0.5">
                      Chargeable Weight: <span className="text-sky-400 font-mono">{rateResults.chargeableWeight} kg</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-xs font-mono">
                    <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                      Actual: <span className="text-white font-bold">{rateResults.actualWeight} kg</span>
                    </div>
                    <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                      Volumetric: <span className="text-white font-bold">{rateResults.volumetricWeight} kg</span>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 mt-2 flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  <span>Freight pricing uses whichever is higher between actual gross mass and dimensional volume ($L \times W \times H / 5000$).</span>
                </div>
              </div>

              {/* Service Tiers List */}
              <div className="space-y-4">
                {rateResults.options.map((opt) => (
                  <div
                    key={opt.serviceId}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-base text-slate-900">{opt.name}</span>
                        <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                          {opt.transitTime}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 max-w-md">{opt.description}</p>
                      
                      {/* Breakdown badges */}
                      <div className="flex flex-wrap gap-2 mt-2 text-[11px] text-slate-600 font-mono">
                        <span>Base: ${opt.breakdown.baseFee}</span>
                        <span>&bull;</span>
                        <span>Weight Charge: ${opt.breakdown.weightCharge}</span>
                        <span>&bull;</span>
                        <span>Fuel (12%): ${opt.breakdown.fuelSurcharge}</span>
                        {opt.breakdown.customsClearanceFee > 0 && (
                          <>
                            <span>&bull;</span>
                            <span>Customs: ${opt.breakdown.customsClearanceFee}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6 min-w-[170px]">
                      <div className="text-2xl font-black text-slate-900 font-mono">
                        ${opt.totalPrice} <span className="text-xs text-slate-500 font-normal">USD</span>
                      </div>
                      <button
                        onClick={() => onSelectRateToBook(opt)}
                        className="mt-2 w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                      >
                        <span>Book This Rate</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>

      {/* CUSTOM ENTERPRISE QUOTE REQUEST FORM */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-700 shadow-2xl">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-950 px-3 py-1 rounded-full border border-sky-800">
            High-Volume & Specialized Cargo
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2">
            Need a Custom Corporate Freight Quotation?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Shipping container fleets, oversized machinery, or ongoing high-frequency cargo? Submit a quote request and our pricing desk will generate an automated quotation with instant email delivery.
          </p>
        </div>

        {quoteSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>{quoteSuccess}</div>
            </div>
            <button
              onClick={onOpenOutbox}
              className="text-white underline font-bold text-xs"
            >
              View Dispatched Quote Email &rarr;
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomQuoteSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Company / Client Name *</label>
              <input
                type="text"
                required
                value={quoteForm.clientName}
                onChange={(e) => setQuoteForm({ ...quoteForm, clientName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Corporate Email (for Instant Quote PDF) *</label>
              <input
                type="email"
                required
                value={quoteForm.clientEmail}
                onChange={(e) => setQuoteForm({ ...quoteForm, clientEmail: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Origin Port / City *</label>
              <input
                type="text"
                required
                value={quoteForm.originCity}
                onChange={(e) => setQuoteForm({ ...quoteForm, originCity: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Destination Port / City *</label>
              <input
                type="text"
                required
                value={quoteForm.destCity}
                onChange={(e) => setQuoteForm({ ...quoteForm, destCity: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Cargo Description *</label>
              <input
                type="text"
                required
                value={quoteForm.cargoType}
                onChange={(e) => setQuoteForm({ ...quoteForm, cargoType: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Gross Estimated Weight (kg) *</label>
              <input
                type="number"
                required
                value={quoteForm.weightKg}
                onChange={(e) => setQuoteForm({ ...quoteForm, weightKg: parseFloat(e.target.value) || 100 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Special Handling & Temperature Requirements</label>
              <textarea
                rows="2"
                value={quoteForm.notes}
                onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={submittingQuote}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-8 py-3 rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-sky-500/20"
              >
                {submittingQuote ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit & Dispatch Automated Quotation Email</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
