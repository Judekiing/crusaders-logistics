import React, { useState } from 'react';
import { X, Mail, CheckCircle2, Clock, Send, Copy, Check, ExternalLink } from 'lucide-react';

export default function LiveEmailModal({ notification, onClose }) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'source'

  if (!notification) return null;

  const handleCopyHtml = () => {
    if (notification.htmlContent) {
      navigator.clipboard.writeText(notification.htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                  {notification.type || 'NOTIFICATION'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ID: {notification.id}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1 line-clamp-1">
                {notification.subject}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Metadata Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 text-xs space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-500 w-16">To:</span>
              <span className="font-mono text-slate-900 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                {notification.recipientName ? `${notification.recipientName} <${notification.recipientEmail}>` : notification.recipientEmail}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-500 w-16">From:</span>
              <span className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                Crusaders Logistics Dispatch &lt;dispatch@crusaderslogistics.com&gt;
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-500 w-16">Time:</span>
              <span className="text-slate-700 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{new Date(notification.sentAt).toLocaleString()}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-500 w-16">Status:</span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Delivered via Nodemailer Transporter</span>
              </span>
            </div>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                viewMode === 'preview' ? 'bg-sky-100 text-sky-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Rendered HTML Preview
            </button>
            <button
              onClick={() => setViewMode('source')}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                viewMode === 'source' ? 'bg-sky-100 text-sky-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              HTML Source Code
            </button>
          </div>

          <button
            onClick={handleCopyHtml}
            className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied HTML' : 'Copy HTML'}</span>
          </button>
        </div>

        {/* Email Content Body */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          {viewMode === 'preview' ? (
            notification.htmlContent ? (
              <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden max-w-[650px] mx-auto">
                <iframe
                  title="Email Preview"
                  srcDoc={notification.htmlContent}
                  className="w-full min-h-[500px] border-0"
                  sandbox="allow-same-origin"
                />
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl text-center text-slate-500">
                <p className="text-sm font-semibold">{notification.previewText || 'No email body preview recorded.'}</p>
              </div>
            )
          ) : (
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-[500px]">
              {notification.htmlContent || notification.previewText}
            </pre>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Sent with Crusaders Logistics Dispatch Notification Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
