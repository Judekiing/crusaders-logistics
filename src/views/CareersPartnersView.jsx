import React, { useState } from 'react';
import { 
  Truck, 
  Briefcase, 
  Handshake, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Send 
} from 'lucide-react';

export default function CareersPartnersView() {
  const [activeFormTab, setActiveFormTab] = useState('driver'); // 'driver' | 'partner' | 'corporate'
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
  };

  const openings = [
    { title: 'Regional Intermodal Fleet Driver (CDL-A)', location: 'Chicago Hub, IL', type: 'Full-time', pay: '$88,000 - $110,000 / yr' },
    { title: 'Air Charter Dispatch Controller', location: 'New York JFK Hub', type: 'Shift (24/7 Ops)', pay: '$95,000 - $120,000 / yr' },
    { title: 'Licensed Senior Customs Broker', location: 'Rotterdam Gateway', type: 'Full-time', pay: '€75,000 - €92,000 / yr' },
    { title: 'Cold-Chain Pharma Quality Lead', location: 'Frankfurt Airport Node', type: 'Full-time', pay: '€82,000 - €105,000 / yr' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
          Global Logistics Ecosystem
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Join the Fleet. Partner With Crusaders Logistics.
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Whether you are an independent owner-operator, a regional freight brokerage, or a career professional in air cargo logistics, we invest in our network.
        </p>
      </div>

      {/* 3 Pillars Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Professional Fleet Drivers</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Competitive per-mile pay, consistent dedicated routes, modern well-maintained Peterbilt & Volvo tractors, and comprehensive healthcare from day one.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Weekly Direct Deposit & Fuel Card</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Dedicated Dispatcher Support</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Handshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Freight Agents & Forwarders</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Expand your agency capabilities by leveraging our direct airline contracts, bonded ocean gateways, and single-window automated customer notification APIs.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Top-tier commission splits</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Access to proprietary Waybill TMS</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Corporate & Tech Careers</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Join our engineering, operations research, customs compliance, and client solutions teams shaping the future of real-time supply chain telemetry.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Global rotation programs</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Continuing IATA education sponsorship</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Application Drawer */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-2xl">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-black">Express Application & Onboarding</h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Submit your credentials and our recruitment and carrier compliance teams will reach out within 24 hours.
          </p>

          <div className="flex space-x-2 mt-6">
            {[
              { id: 'driver', label: 'Driver Application' },
              { id: 'partner', label: 'Carrier / Agency Partner' },
              { id: 'corporate', label: 'Corporate Positions' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFormTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeFormTab === tab.id ? 'bg-sky-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-sm flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>Application received! A confirmation has been logged and our team will contact you.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name / Legal Entity *</label>
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
              <input
                type="email"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {activeFormTab === 'driver' ? 'CDL License # & Years Experience' : activeFormTab === 'partner' ? 'MC / DOT Number' : 'Desired Position'}
              </label>
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Brief Overview / Equipment Type / Notes</label>
              <textarea
                rows="2"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:ring-2 focus:ring-sky-500"
              ></textarea>
            </div>
            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-8 py-3 rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-sky-500/20"
              >
                <Send className="w-4 h-4" />
                <span>Submit Application & Credentials</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Featured Career Openings */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Current Corporate & Terminal Vacancies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {openings.map((job, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{job.title}</h4>
                <div className="text-slate-500 mt-1 flex items-center space-x-2">
                  <span>{job.location}</span>
                  <span>&bull;</span>
                  <span>{job.type}</span>
                </div>
                <div className="text-sky-700 font-bold font-mono mt-1">{job.pay}</div>
              </div>
              <button
                onClick={() => { setActiveFormTab('corporate'); window.scrollTo({ top: 600, behavior: 'smooth' }); }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 font-bold text-xs transition-colors"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
