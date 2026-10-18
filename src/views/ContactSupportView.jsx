import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Globe2,
  Building2
} from 'lucide-react';
import { fetchBranches } from '../services/api';

export default function ContactSupportView() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    trackingNumber: '',
    message: ''
  });
  const [ticketSent, setTicketSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    fetchBranches().then(res => {
      if (res?.success) {
        setBranches(res.data);
        setSelectedBranch(res.data[0]);
      }
    });
  }, []);

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setTicketForm({ name: '', email: '', subject: 'General Inquiry', trackingNumber: '', message: '' });
    }, 6000);
  };

  const faqs = [
    {
      q: 'How quickly do automated tracking email notifications dispatch?',
      a: 'Email milestone alerts are triggered automatically within 3 seconds of a barcode scan, ramp cross-dock scan, or customs release timestamp logged by our flight crews or terminal handlers.'
    },
    {
      q: 'What is volumetric (dimensional) weight and how is it billed?',
      a: 'International freight relies on the IATA standard formula: (Length × Width × Height in cm) / 5000. Consignments are billed on Chargeable Weight, which is whichever figure is higher between physical gross mass and volumetric weight.'
    },
    {
      q: 'How does Crusaders Logistics manage cold-chain pharmaceutical cargo?',
      a: 'We utilize calibrated active compressor containers and passive vacuum-insulated packaging equipped with dual calibrated IoT sensors streaming temperature, ambient humidity, and shock data in real time.'
    },
    {
      q: 'What should I do if my shipment is held by Customs & Border Protection?',
      a: 'Our in-house licensed customs brokers proactively contact the designated importer of record with the exact single-window declaration request. You can also monitor clearance updates directly via our tracking console.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
          Global Support & Gateways
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          24/7 Dispatch Control & Contact
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Connect with dedicated route dispatchers, report exceptions, or contact any of our global gateways.
        </p>
      </div>

      {/* Emergency Hotline Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Phone className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">24/7 Global Air Charter & Urgent Operations Command</div>
            <div className="text-2xl font-black text-white font-mono mt-0.5">+1 (800) 555-APEX &bull; +44 20 7946 0888</div>
          </div>
        </div>

        <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-xl self-start md:self-auto">
          Average Hotline Pickup: 8 Seconds
        </span>
      </div>

      {/* TWO COLUMNS: Global Gateway Locations & Support Ticket Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Global Hubs Selector */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">International Hub Operations</h3>
            <p className="text-xs text-slate-500">Select an operational hub to view contact and gate access hours.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {branches.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBranch(b)}
                className={`p-3 rounded-xl text-left transition-all ${
                  selectedBranch?.id === b.id
                    ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/30'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium'
                }`}
              >
                <div className="text-xs">{b.city}</div>
                <div className="text-[10px] opacity-75">{b.country}</div>
              </button>
            ))}
          </div>

          {selectedBranch && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 text-xs animate-fade-in">
              <div className="flex items-center space-x-2 text-sky-700 font-bold text-sm">
                <Building2 className="w-4 h-4" />
                <span>Crusaders Logistics Gateway {selectedBranch.city}</span>
              </div>
              <div className="text-slate-700">
                <strong>Address:</strong> {selectedBranch.address}
              </div>
              <div className="text-slate-700">
                <strong>Direct Phone:</strong> <span className="font-mono">{selectedBranch.phone}</span>
              </div>
              <div className="text-slate-700">
                <strong>Email:</strong> <span className="font-mono text-sky-600">{selectedBranch.email}</span>
              </div>
              <div className="text-slate-700 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Operating Hours: <strong>{selectedBranch.hours}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Support Ticket Form */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-5 text-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">Submit an Operations Ticket</h3>
            <p className="text-slate-500">Directly routed to the duty dispatcher handling your lane.</p>
          </div>

          {ticketSent ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-bold text-sm">Support Ticket Dispatched!</div>
              <p className="text-xs text-emerald-700">Ticket #OPS-8491 registered. Our on-duty controller will respond within 15 minutes.</p>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={ticketForm.name}
                    onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={ticketForm.email}
                    onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Inquiry Topic</label>
                  <select
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="General Inquiry">General Logistics Inquiry</option>
                    <option value="Tracking Status Exception">Tracking Status / Hold Exception</option>
                    <option value="Customs Documentation">Customs & Duty Clearance</option>
                    <option value="Cold Chain Telemetry Request">Cold-Chain Temperature Log Request</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tracking Number (if applicable)</label>
                  <input
                    type="text"
                    placeholder="e.g. APX-774921-US"
                    value={ticketForm.trackingNumber}
                    onChange={(e) => setTicketForm({ ...ticketForm, trackingNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Message *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe your inquiry or cargo reference..."
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow-md shadow-sky-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Interactive FAQs Accordion */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 mt-1">Essential operational details on tracking, volumetric rates, and customs.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between font-bold text-slate-900 text-xs sm:text-sm hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-sky-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
