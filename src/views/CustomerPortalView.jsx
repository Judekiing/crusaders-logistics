import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Package, 
  FileText, 
  Bookmark, 
  Bell, 
  Download, 
  Eye, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight,
  Shield,
  CreditCard
} from 'lucide-react';
import { fetchShipments } from '../services/api';

export default function CustomerPortalView({ onTrackShipment, onBookNew, currentUser, onOpenAuthModal }) {
  const [activeTab, setActiveTab] = useState('shipments'); // 'shipments' | 'invoices' | 'addresses' | 'preferences'
  const [shipments, setShipments] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const user = currentUser?.role === 'customer' ? currentUser : {
    fullName: 'Jonathan Curr',
    company: 'ApexTech Imports Ltd',
    accountNumber: 'CRU-CORP-94812',
    creditLine: '$100,000 USD Active',
    dispatcher: 'Elena Rostova (Station Hub #1)'
  };

  useEffect(() => {
    fetchShipments().then(res => {
      if (res?.success) setShipments(res.data);
    });
  }, []);

  const savedAddresses = [
    { id: 1, name: 'Main Chicago Distribution Dock', contact: 'David Kowalski', address: '8400 Logistics Blvd, Dock 4, Chicago, IL 60666, US', phone: '+1 (312) 555-0199', defaultOrigin: true },
    { id: 2, name: 'Rotterdam Port Terminal Hub', contact: 'Jan Van Houten', address: 'Maasvlakte Haven 820, 3199 LK Rotterdam, NL', phone: '+31 10 555 4912', defaultOrigin: false },
    { id: 3, name: 'Berlin Clinical Depot', contact: 'Dr. H. Weber', address: 'Charitéplatz 1, 10117 Berlin, DE', phone: '+49 30 450 500', defaultOrigin: false },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Account Profile Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-sky-600/30 font-bold text-xl">
            {user.fullName ? user.fullName[0] : 'C'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">{user.company || 'Crusader Shipper Portal'}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-950 text-sky-400 border border-sky-800 px-2 py-0.5 rounded">
                Verified Customer Tier
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
              <span>Client: <strong className="text-white">{user.fullName}</strong></span>
              <span>&bull;</span>
              <span>Account ID: <strong className="text-white font-mono">{user.accountNumber || 'CRU-CORP-94812'}</strong></span>
              <span>&bull;</span>
              <span>Credit Line: <strong className="text-emerald-400 font-mono">{user.creditLine || '$100,000 USD Active'}</strong></span>
              <span>&bull;</span>
              <span>Dedicated Dispatcher: <strong className="text-slate-200">{user.dispatcher || 'Elena Rostova'}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-3 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
              title="View customer credentials and switch accounts"
            >
              Credentials / Role
            </button>
          )}
          <button
            onClick={onBookNew}
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs transition-colors shadow-lg shadow-sky-500/20"
          >
            + Book New Consignment
          </button>
        </div>
      </div>

      {/* Side Navbar + Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Navbar */}
        <aside className="lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-4 lg:sticky lg:top-24">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Shipper Navigation</span>
            <span className="text-sky-600 font-mono text-[10px]">Tier 1</span>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'shipments', label: 'My Consignments', icon: Package, count: shipments.length },
              { id: 'invoices', label: 'Invoices & Waybills', icon: FileText },
              { id: 'addresses', label: 'Saved Address Book', icon: Bookmark },
              { id: 'preferences', label: 'Alert Preferences', icon: Bell },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-3.5 py-3 rounded-2xl flex items-center justify-between text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25 border border-sky-500'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={onBookNew}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-2xl text-xs transition-all shadow-md shadow-sky-500/20 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>+ Book Consignment</span>
            </button>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700">Account Credit</div>
              <div className="text-emerald-600 font-mono font-bold">{user.creditLine || '$100,000 USD Active'}</div>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="lg:col-span-9 space-y-6">

      {/* TAB 1: SHIPMENTS */}
      {activeTab === 'shipments' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 gap-4">
            {shipments.map((s) => (
              <div
                key={s.trackingNumber}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono font-bold text-sm text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                      {s.trackingNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      s.currentStatus === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : s.currentStatus === 'OUT_FOR_DELIVERY'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}>
                      {s.currentStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2">
                    {s.originCity}, {s.originCountry} &rarr; {s.destCity}, {s.destCountry}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-3">
                    <span>Cargo: <strong>{s.packageDescription || s.packageType}</strong></span>
                    <span>&bull;</span>
                    <span>Weight: <strong>{s.weightKg} kg</strong></span>
                    <span>&bull;</span>
                    <span>ETA: <strong>{new Date(s.estimatedDelivery).toLocaleDateString()}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onTrackShipment(s.trackingNumber)}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors flex items-center space-x-1"
                  >
                    <span>Track Real-Time</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INVOICES & DOCUMENTS */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden animate-fade-in text-xs">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Commercial Invoices & Freight Receipts</h3>
            <p className="text-slate-500">Official digital tax invoices and customs declarations ready for download.</p>
          </div>

          <table className="w-full text-left divide-y divide-slate-100">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Associated Waybill</th>
                <th className="p-4">Billing Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shipments.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-4 font-mono font-bold text-slate-900">INV-2026-00{idx + 142}</td>
                  <td className="p-4 font-mono text-sky-600">{s.trackingNumber}</td>
                  <td className="p-4 text-slate-500">{new Date(s.bookedAt).toLocaleDateString()}</td>
                  <td className="p-4 font-mono font-bold text-slate-900">
                    ${Math.round(s.weightKg * 11.5 + 85).toLocaleString()} USD
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>PAID &bull; NET 30</span>
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => alert(`Commercial Invoice INV-2026-00${idx + 142} generated for ${s.trackingNumber}.`)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: ADDRESS BOOK */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in text-xs">
          {savedAddresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-900 text-sm">{addr.name}</h4>
                {addr.defaultOrigin && (
                  <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    Default Origin
                  </span>
                )}
              </div>
              <p className="text-slate-600 leading-relaxed">{addr.address}</p>
              <div className="text-slate-500 pt-2 border-t border-slate-100">
                Contact: <strong>{addr.contact}</strong> &bull; {addr.phone}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: ALERT PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md max-w-2xl space-y-6 text-xs animate-fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900">Automated Notification Routing</h3>
            <p className="text-slate-500">Configure which email addresses receive real-time telemetry events.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">New Booking Confirmation Emails</div>
                <div className="text-slate-500 text-[11px]">Send PDF waybills immediately upon dispatch creation</div>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-sky-600" />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">Intermediate Transit Checkpoints</div>
                <div className="text-slate-500 text-[11px]">Notify whenever airport ramp or cross-dock scan occurs</div>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-sky-600" />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">Out For Delivery & Final Driver Arrival</div>
                <div className="text-slate-500 text-[11px]">Send courier vehicle plate and expected 2-hour window</div>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-sky-600" />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">Signed Proof of Delivery (e-POD)</div>
                <div className="text-slate-500 text-[11px]">Attach signatory name and delivery receipt timestamp</div>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-sky-600" />
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
