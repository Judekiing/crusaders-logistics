import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Globe2, 
  Building, 
  Users, 
  FileCheck, 
  Lock, 
  HeartHandshake,
  TrendingUp
} from 'lucide-react';

export default function AboutTrustView() {
  const certifications = [
    {
      code: 'IATA CASS 01-4-8891',
      title: 'IATA Cargo Agent Accreditation',
      body: 'Full member of the International Air Transport Association Cargo Accounts Settlement System with direct airline ticketing and space allocation privileges.'
    },
    {
      code: 'FMC OTI #024911',
      title: 'Federal Maritime Commission License',
      body: 'Licensed Ocean Transportation Intermediary (OTI) authorized to issue ocean bills of lading and negotiate tier-one vessel carrier contracts.'
    },
    {
      code: 'ISO 9001:2015',
      title: 'Quality Management Systems Standard',
      body: 'Audited and certified by Bureau Veritas for end-to-end supply chain operational integrity, error traceability, and customer dispute resolution.'
    },
    {
      code: 'AEO-F #NL000291',
      title: 'Authorized Economic Operator (Customs & Security)',
      body: 'Highest European customs security status conferring green-lane expedited border processing and reduced physical consignment inspections.'
    },
    {
      code: 'EU GDP / WHO TRS 961',
      title: 'Good Distribution Practice Certification',
      body: 'Certified pharmaceutical transit protocol ensuring uninterrupted 2-8°C cold chains and rigorous thermal compliance auditing.'
    },
    {
      code: 'C-TPAT Tier 3',
      title: 'Customs-Trade Partnership Against Terrorism',
      body: 'Highest green-tier validation with U.S. Customs and Border Protection for tamper-evident container seal integrity and facility security.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
          Trust, Compliance & Governance
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Architects of Resilient Global Commerce
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Founded in 2011, Crusaders Logistics connects global manufacturing powerhouses, pharmaceutical innovators, and critical technology suppliers across 140+ countries with uncompromised velocity and verifiable compliance.
        </p>
      </div>

      {/* Trust & Insurance Card */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Comprehensive Risk Mitigation & Cargo Underwriting</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Backed by Global Underwriters. Up to $50M per Consignment.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Every shipment handled through the Crusaders Logistics network is protected by primary marine and inland transit cargo policies underwritten by Lloyd's of London and Allianz Global Corporate & Specialty.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="font-bold text-white">Full Declared Value Coverage</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Zero deductible on certified packaging losses</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="font-bold text-white">24-Hour Claims Settlement</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Expedited digital documentation review</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Safety & Audit Metrics</div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">On-Time Linehaul Reliability</span>
                  <span className="text-sky-400 font-mono">99.4%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-1 overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: '99.4%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Cold Chain Thermal Adherence</span>
                  <span className="text-emerald-400 font-mono">99.98%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-1 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '99.98%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Customs Single-Window First-Pass Clearance</span>
                  <span className="text-cyan-400 font-mono">98.7%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-1 overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '98.7%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Accreditations & Regulatory Authorities</h2>
          <p className="text-xs text-slate-500 mt-1">Directly licensed and audited across international trade bodies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((c, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                {c.code}
              </span>
              <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Client References */}
      <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-6">
        <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider text-xs">
          Trusted by Fortune 500 Manufacturing & Healthcare Leaders
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-slate-400 font-bold text-lg font-mono tracking-wider">
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200/60 flex items-center justify-center">
            AERO<span className="text-sky-600">DYNAMICS</span>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200/60 flex items-center justify-center">
            NEXUS<span className="text-sky-600">CORP</span>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200/60 flex items-center justify-center">
            EURO<span className="text-sky-600">PHARMA</span>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200/60 flex items-center justify-center">
            PACIFIC<span className="text-sky-600">TECH</span>
          </div>
        </div>
      </div>
    </div>
  );
}
