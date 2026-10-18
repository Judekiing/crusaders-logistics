import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  Send, 
  Inbox, 
  Eye, 
  Filter,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { fetchNotifications, sendTestEmail } from '../services/api';

export default function EmailOutboxView({ onInspectNotification }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Test email sender form
  const [testEmail, setTestEmail] = useState('');
  const [customMsg, setCustomMsg] = useState('Testing Crusaders Logistics automated logistics notification engine.');
  const [sendingTest, setSendingTest] = useState(false);
  const [testSuccess, setTestSuccess] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetchNotifications();
      if (res && res.success) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async (e) => {
    e.preventDefault();
    if (!testEmail) return;
    setSendingTest(true);
    setTestSuccess(null);

    try {
      const res = await sendTestEmail({
        email: testEmail,
        customMessage: customMsg
      });

      if (res && res.success) {
        setTestSuccess(`Notification dispatched to ${testEmail}! Logged in outbox below.`);
        loadNotifications();
        setTimeout(() => setTestSuccess(null), 6000);
      }
    } catch (err) {
      console.error('Test email failed:', err);
    } finally {
      setSendingTest(false);
    }
  };

  const filtered = notifications.filter(n => {
    const matchType = typeFilter === 'ALL' || n.type === typeFilter;
    const q = search.toLowerCase();
    const matchSearch = !search || 
      n.subject.toLowerCase().includes(q) ||
      n.recipientEmail.toLowerCase().includes(q) ||
      (n.shipmentId && n.shipmentId.toLowerCase().includes(q));
    return matchType && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">
            <Mail className="w-4 h-4" />
            <span>Nodemailer Engine & Notification Outbox</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Email Notification Center & Outbox
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Audit every automated customer notification dispatched by Crusaders Logistics. Inspect rendered responsive HTML templates for booking confirmations, transit checkpoints, and proof of delivery.
          </p>
        </div>

        <button
          onClick={loadNotifications}
          className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 flex items-center space-x-2 text-xs font-semibold self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Outbox</span>
        </button>
      </div>

      {/* Test Email Dispatcher Card */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 border border-sky-800/40 shadow-xl text-white">
        <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Live Email Simulator & Tester</span>
        </div>
        <h3 className="text-lg font-bold text-white">Dispatch a Verification Test Email</h3>
        <p className="text-xs text-slate-300 mt-1 mb-4">
          Enter any email address to test the platform's responsive HTML email delivery and see it logged in real time.
        </p>

        <form onSubmit={handleSendTest} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            placeholder="Enter destination email (e.g. you@example.com)..."
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={sendingTest}
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-md shadow-sky-500/20"
          >
            {sendingTest ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Test Email</span>
              </>
            )}
          </button>
        </form>

        {testSuccess && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{testSuccess}</span>
          </div>
        )}
      </div>

      {/* Outbox Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search outbox by recipient, subject, or shipment ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-semibold">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="ALL">All Types</option>
            <option value="BOOKING_CONFIRMATION">Booking Confirmation</option>
            <option value="STATUS_UPDATE">Status Milestone Update</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERY_CONFIRMATION">Delivery Proof</option>
            <option value="QUOTE_CONFIRMATION">Quote Request</option>
          </select>
        </div>
      </div>

      {/* Outbox Manifest List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Inbox className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Outbox Transmissions Log</h3>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            {filtered.length} Dispatched Messages
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No notifications match your search criteria.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => onInspectNotification(item)}
                className="p-4 sm:p-5 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 group-hover:bg-sky-600 group-hover:text-white text-sky-700 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.type || 'NOTIFICATION'}
                      </span>
                      {item.shipmentId && (
                        <span className="text-[11px] font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                          {item.shipmentId}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.sentAt).toLocaleString()}</span>
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 group-hover:text-sky-600 transition-colors">
                      {item.subject}
                    </h4>

                    <div className="text-xs text-slate-500 mt-0.5">
                      To: <strong className="text-slate-800">{item.recipientEmail}</strong> ({item.recipientName || 'Subscriber'})
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                      "{item.previewText}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:self-center">
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>SENT</span>
                  </span>

                  <button
                    type="button"
                    className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-sky-600 group-hover:text-white transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
