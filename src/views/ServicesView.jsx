import React from 'react';
import { 
  Plane, 
  Ship, 
  Truck, 
  ThermometerSnowflake, 
  Warehouse, 
  FileCheck2, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Clock,
  Compass
} from 'lucide-react';

export default function ServicesView({ onBookService, onGetQuote }) {
  const services = [
    {
      id: 'express_air',
      title: 'Priority International Air Freight',
      tagline: 'When delivery speed defines operational survival.',
      icon: Plane,
      color: 'sky',
      sla: '24 - 48 Hours Global Transit',
      description: 'Scheduled scheduled flights, dedicated cargo freighters, and priority belly-space allocations across 140+ international hub airports. Includes tarmac ramp oversight and immediate customs handoff.',
      features: [
        'Guaranteed next-flight-out dispatch',
        'Direct tarmac supervision & ULD loading',
        'IATA Class 1-9 Dangerous Goods certified',
        'End-to-end automated email milestone telemetry'
      ]
    },
    {
      id: 'ocean_cargo',
      title: 'Ocean Maritime Shipping (FCL & LCL)',
      tagline: 'High-volume intercontinental freight economics.',
      icon: Ship,
      color: 'blue',
      sla: '14 - 24 Days Trans-Oceanic',
      description: 'Full Container Load (20ft, 40ft, 40ft High-Cube) and consolidated Less-than-Container Load services partnering with the world\'s leading carrier alliances. Comprehensive port drayage included.',
      features: [
        'Vessel space booking guarantee during peak seasons',
        'Consolidated LCL weekly departures',
        'Reefer container active temperature monitoring',
        'Complete harbor drayage and destination de-vanning'
      ]
    },
    {
      id: 'cold_chain',
      title: 'Pharmaceutical & BioPharma Cold Chain',
      tagline: 'Unbroken thermal integrity for life-saving therapeutics.',
      icon: ThermometerSnowflake,
      color: 'cyan',
      sla: '2°C to 8°C & -20°C Cryogenic Precision',
      description: 'GDP compliant supply chain engineered for vaccines, biologics, blood products, and sensitive active pharmaceutical ingredients (API). Calibrated IoT sensors stream continuous temperature readouts.',
      features: [
        'Active compressor reefer units & dry-ice validation',
        'Continuous IoT temperature & shock dataloggers',
        'GDP trained pharmaceutical handlers & drivers',
        'Zero-excursion emergency protocols'
      ]
    },
    {
      id: 'standard_ground',
      title: 'Intermodal Road & Rail Freight',
      tagline: 'Domestic arterial freight with nationwide precision.',
      icon: Truck,
      color: 'amber',
      sla: '1 - 4 Business Days Continental',
      description: 'Full Truckload (FTL) and Less-than-Truckload (LTL) transportation across North America and Europe. Cross-dock terminals ensure rapid sortation without cargo idle delays.',
      features: [
        'Extensive modern fleet equipped with GPS telematics',
        'Hydraulic liftgates & inside white-glove delivery',
        'Cross-border expedited customs transit',
        'Heavy-haul and oversized specialized flatbeds'
      ]
    },
    {
      id: 'warehousing',
      title: 'Customs-Bonded Warehousing & 3PL',
      tagline: 'Strategic inventory staging adjacent to global sea and air ports.',
      icon: Warehouse,
      color: 'emerald',
      sla: 'Same-Day Pick & Pack Dispatch',
      description: 'Over 1.8M sq ft of state-of-the-art secure storage in Rotterdam, Chicago, Singapore, and Dubai. Duty deferment zones minimize cash flow tax friction until goods enter local markets.',
      features: [
        'FTZ (Foreign Trade Zone) tax duty deferment',
        'Barcode scanning & live WMS inventory visibility',
        'Kitting, labeling, palletizing & QA inspection',
        'Climate-regulated ambient and cold zones'
      ]
    },
    {
      id: 'customs',
      title: 'Licensed Customs Brokerage & Compliance',
      tagline: 'Seamless international border navigation without delays.',
      icon: FileCheck2,
      color: 'purple',
      sla: '< 4 Hours Average Electronic Release',
      description: 'In-house licensed customs brokers managing import and export filings, HS tariff classifications, free trade agreement optimizations, and single-window regulatory declarations.',
      features: [
        'Automated ACE & ATLAS customs electronic filing',
        'Duty mitigation through preferential tariff regimes',
        'Carnet ATA temporary admission support',
        'Audit-proof documentation archiving'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Services Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
          Global Logistics Capabilities
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
          Multi-Modal Logistics Services
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-2">
          Integrated transportation, cold-chain preservation, and regulatory brokerage designed for enterprise shippers who demand zero cargo downtime.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="text-[11px] font-bold text-sky-600 uppercase tracking-wider flex items-center space-x-1.5 mb-1">
                  <Clock className="w-3 h-3" />
                  <span>{s.sla}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-500 font-medium italic mt-1">{s.tagline}</p>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">{s.description}</p>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-700 uppercase mb-2">Capabilities:</div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {s.features.map((f, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center space-x-3">
                <button
                  onClick={() => onBookService(s.id)}
                  className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <span>Book Consignment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onGetQuote}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Rates
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
