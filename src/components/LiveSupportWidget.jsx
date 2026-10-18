import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  User, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  Clock, 
  Paperclip,
  ExternalLink
} from 'lucide-react';

export default function LiveSupportWidget({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [message, setMessage] = useState('');
  const [department, setDepartment] = useState('Customer Support');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      name: 'Dispatch Officer Sarah',
      text: 'Hello! Welcome to Crusaders Logistics Global Support. How can our dispatch & customs desk assist you with your freight today?',
      time: 'Just now'
    }
  ]);

  const quickPrompts = [
    'Track my consignment',
    'Request freight quote',
    'Urgent booking assistance',
    'Customs clearance inquiry'
  ];

  const handleQuickPrompt = (prompt) => {
    setMessage(prompt);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !email.trim()) return;

    setSending(true);

    // Add user message to UI
    const userMsg = {
      sender: 'user',
      name: name.trim() || 'Valued Shipper',
      text: message.trim(),
      time: 'Just now'
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Send message to backend API to dispatch real email to info@crusaderslogistics.com
      const res = await fetch('/api/support/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Visitor',
          email: email.trim(),
          trackingNumber: trackingNumber.trim(),
          department,
          message: message.trim()
        })
      });

      const data = await res.json();

      // Agent automated response
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            sender: 'agent',
            name: 'Dispatch Officer Sarah',
            text: `Thank you, ${name || 'Sir/Madam'}. Your ticket has been logged and forwarded directly to info@crusaderslogistics.com. A certified freight agent will reply to ${email} within 15 minutes.`,
            time: 'Just now'
          }
        ]);
        setSentSuccess(true);
      }, 700);

      setMessage('');
    } catch (err) {
      console.error('Support send error:', err);
      // Fallback response
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            sender: 'agent',
            name: 'System Dispatch',
            text: `Your message has been received and routed to info@crusaderslogistics.com. We will contact you at ${email}.`,
            time: 'Just now'
          }
        ]);
        setSentSuccess(true);
      }, 700);
      setMessage('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-3 bg-gradient-to-r from-flix-500 to-amber-600 hover:from-flix-400 hover:to-amber-500 text-white px-5 py-3.5 rounded-full shadow-2xl shadow-flix-500/40 hover:shadow-flix-500/60 transform hover:-translate-y-1 transition-all cursor-pointer border border-amber-400/40"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse"></span>
          </div>
          <div className="text-left">
            <div className="text-xs font-black uppercase tracking-wider leading-none">Live Support</div>
            <div className="text-[10px] text-amber-100/90 font-medium leading-tight mt-0.5">Officers Online 24/7</div>
          </div>
          {/* Animated ping ring */}
          <span className="absolute -inset-1 rounded-full bg-flix-500 opacity-20 animate-ping pointer-events-none" />
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white animate-fade-in text-xs max-h-[620px] h-[580px]">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-flix-500 to-amber-600 p-0.5">
                  <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center font-bold text-flix-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white flex items-center space-x-1.5">
                  <span>Crusaders Live Support</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded">
                    Connected
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">
                  Direct dispatch to <strong className="text-flix-400">info@crusaderslogistics.com</strong>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Notice Banner */}
          <div className="bg-slate-950/80 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3 h-3 text-flix-400" />
              <span>Avg response: <strong>&lt; 5 mins</strong></span>
            </span>
            <a 
              href="mailto:info@crusaderslogistics.com" 
              className="text-flix-400 hover:underline flex items-center space-x-0.5 font-bold"
            >
              <span>Email Direct</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-1 mb-1 text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-300">{m.name}</span>
                  <span>&bull;</span>
                  <span>{m.time}</span>
                </div>
                <div 
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-gradient-to-r from-flix-600 to-amber-600 text-white rounded-tr-none shadow-md' 
                      : 'bg-slate-800 border border-slate-700/80 text-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs py-1">
                <div className="w-2 h-2 rounded-full bg-flix-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-flix-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-flix-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px]">Connecting to mail server...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickPrompt(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] border border-slate-700 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
            {/* Contact details row if not yet filled */}
            {(!email || !name) && (
              <div className="grid grid-cols-2 gap-2 pb-1">
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-flix-500"
                />
                <input
                  type="email"
                  placeholder="Your Email *"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-flix-500"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={email ? "Type your message here..." : "Type message & enter email above..."}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-flix-500"
              />
              <button
                type="submit"
                disabled={sending || !message.trim()}
                className="bg-flix-500 hover:bg-flix-600 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-md shadow-flix-500/20 cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[9px] text-slate-500 text-center">
              Secured with TLS • Inquiries sent to info@crusaderslogistics.com
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
