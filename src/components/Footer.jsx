import React from 'react';
import { Truck, Mail, Phone, MapPin, Shield, CheckCircle, Globe } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      {/* Upper footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/30 bg-slate-900 flex items-center justify-center shadow-md shadow-flix-500/30">
                <img src="/crusaders_logo.jpg" alt="Crusaders Logistics" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-black text-white tracking-tight uppercase">
                CRUSADERS <span className="text-flix-500">LOGISTICS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              We proffer global turnkey logistics and transportation services via sea, land and air. We will protect you from risk and liability. Connecting people with real-time tracking, live audit trails, and automated email alerts.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <Shield className="w-3 h-3 text-flix-400" />
                <span>ISO 9001:2015 Certified</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>IATA Accredited</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <Globe className="w-3 h-3 text-cyan-400" />
                <span>FMC Licensed</span>
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => onNavigate('values')} className="hover:text-white transition-colors">Core Values</button></li>
              <li><button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">Our Services</button></li>
              <li><button onClick={() => onNavigate('stats')} className="hover:text-white transition-colors">Statistics</button></li>
              <li><button onClick={() => onNavigate('rates')} className="hover:text-white transition-colors">Instant Quote</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Contact Us</button></li>
              <li><button onClick={() => onNavigate('track')} className="text-flix-400 hover:text-flix-300 font-semibold transition-colors">Track Shipment</button></li>
            </ul>
          </div>

          {/* Operational Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Operations & Tools</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('book')} className="hover:text-white transition-colors">Book Consignment</button></li>
              <li><button onClick={() => onNavigate('portal')} className="hover:text-white transition-colors">Customer Portal</button></li>
              <li><button onClick={() => onNavigate('admin')} className="text-flix-400 hover:text-flix-300 font-semibold transition-colors">Corporate Office (office.domain.com)</button></li>
              <li><button onClick={() => onNavigate('outbox')} className="text-amber-400 hover:text-amber-300 transition-colors">Email Outbox & Notifications</button></li>
              <li><button onClick={() => onNavigate('careers')} className="hover:text-white transition-colors">Driver & Carrier Network</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Contact & Support</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start space-x-2">
                <Phone className="w-3.5 h-3.5 text-flix-400 flex-shrink-0 mt-0.5" />
                <span>+1 (800) 555-CRU1</span>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="w-3.5 h-3.5 text-flix-400 flex-shrink-0 mt-0.5" />
                <span>support@crusaderslogistics.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-flix-400 flex-shrink-0 mt-0.5" />
                <span>Global Hubs: New York &bull; Rotterdam &bull; Singapore</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/90 border-t border-slate-900 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Crusaders Logistics Inc. All rights reserved. Connecting people.
          </div>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-300">Carrier Liability Terms</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-300">Privacy & Cargo Security</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
