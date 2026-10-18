import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  Plane, 
  Ship, 
  Truck, 
  Clock, 
  Mail, 
  CheckCircle2, 
  Quote, 
  MapPin, 
  Globe2, 
  ShieldCheck, 
  Phone, 
  Award, 
  TrendingUp, 
  Compass, 
  Sliders, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { submitQuote } from '../services/api';

export default function HomeView({ onSearchTracking, onNavigate }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [trackingInput, setTrackingInput] = useState('');

  // Cost calculator state matching the HTML formula: fin = cont * dist * type * ins / 2
  const [truckload, setTruckload] = useState(1.3); // 20ft=1.3, 40ft=2, 45ft=2.2, 53ft=2.5
  const [truckloadLabel, setTruckloadLabel] = useState('20ft');
  const [commodity, setCommodity] = useState(1); // General=1, Fragile=1.2, Fine Arts=1.1, Hazardous=1.5
  const [commodityLabel, setCommodityLabel] = useState('General');
  const [distance, setDistance] = useState(1200); // 0 - 5000 miles
  const [isRefrigerated, setIsRefrigerated] = useState(false); // 1 or 1.3
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState(null);

  // Calculate total: cont * dist * type * ins / 2 (minimum $180)
  const calcTotal = () => {
    const cont = parseFloat(truckload) || 1.3;
    const dist = parseFloat(distance) || 0;
    const type = parseFloat(commodity) || 1;
    const ins = isRefrigerated ? 1.3 : 1.0;
    if (dist === 0) return 0;
    const fin = (cont * dist * type * ins) / 2;
    return Math.round(fin);
  };

  const heroSlides = [
    {
      image: '/crusaders_hero.jpg',
      superTitle: 'Welcome to',
      title: 'Crusaders Logistics',
      subtitle: 'We proffer global turnkey logistics and transportation services via sea, land and air. We protect you from risk and liability with cutting-edge tracking and automated dispatch.',
      btn1Text: 'Book now',
      btn1Action: () => {
        if (onNavigate) onNavigate('book');
      },
      btn2Text: 'Track Shipment',
      btn2Action: () => {
        const el = document.getElementById('track');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      image: '/crusader_air_cargo.jpg',
      superTitle: 'Priority Air Freight Network',
      title: 'Supersonic Air Cargo & Courier',
      subtitle: 'Next-day intercontinental charter and scheduled priority air cargo to over 140 countries. Real-time temperature control and guaranteed departure windows.',
      btn1Text: 'Book now',
      btn1Action: () => {
        if (onNavigate) onNavigate('book');
      },
      btn2Text: 'Calculate Rate',
      btn2Action: () => {
        if (onNavigate) onNavigate('rates');
      }
    },
    {
      image: '/crusader_ocean_freight.jpg',
      superTitle: 'Trans-Oceanic Deep-Sea Lines',
      title: 'Global Maritime Freight & FCL/LCL',
      subtitle: 'Cost-efficient ocean transport across major maritime corridors. High-cube containers, customs clearance, and port-to-door bonded intermodal delivery.',
      btn1Text: 'Book now',
      btn1Action: () => {
        if (onNavigate) onNavigate('book');
      },
      btn2Text: 'Track Shipment',
      btn2Action: () => {
        const el = document.getElementById('track');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      image: '/crusader_smart_hub.jpg',
      superTitle: 'Next-Gen Smart Warehousing',
      title: 'AI-Powered Sorting & Automated Hubs',
      subtitle: 'High-speed robotic parcel sortation, automated inventory dispatch, and end-to-end telemetry for modern global trade and high-value cargo.',
      btn1Text: 'Book now',
      btn1Action: () => {
        if (onNavigate) onNavigate('book');
      },
      btn2Text: 'Our Services',
      btn2Action: () => {
        if (onNavigate) onNavigate('services');
      }
    },
    {
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=85',
      superTitle: 'Doorstep Courier Speed',
      title: 'Swiftly and Around the World',
      subtitle: 'Ship whatever, whenever in time & style with our express logistics and courier system dedicated to providing the best shipping experience.',
      btn1Text: 'Book now',
      btn1Action: () => {
        if (onNavigate) onNavigate('book');
      },
      btn2Text: 'Get a quote',
      btn2Action: () => {
        const el = document.getElementById('get-quote');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  ];

  // Auto-swipe hero carousel every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      onSearchTracking(trackingInput.trim());
    }
  };

  const handleQuickQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!quoteEmail) return;

    try {
      const estimatedRate = calcTotal() || 1500;
      await submitQuote({
        clientName: quoteEmail.split('@')[0],
        clientEmail: quoteEmail,
        originCity: 'New Jersey, USA',
        destCity: 'Global Destination',
        cargoType: `${truckloadLabel} Container - ${commodityLabel} (${isRefrigerated ? 'Refrigerated' : 'Ambient'})`,
        weightKg: Math.round(distance * 2.2),
        serviceType: 'standard_ground',
        estimatedRate,
        currency: 'USD',
        notes: `Quick Quote estimate computed: distance ${distance} miles.`
      });
      setQuoteSuccessMsg(`Quote for $${estimatedRate.toLocaleString()} USD dispatched to ${quoteEmail}! Check the Email Outbox.`);
      setTimeout(() => setQuoteSuccessMsg(null), 7000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-16 pb-12 font-sans bg-slate-50">
      
      {/* 1. HERO SLIDER SECTION (Matching exact text from HTML) */}
      <section id="top" className="relative overflow-hidden bg-slate-950 text-white min-h-[580px] lg:min-h-[640px] flex items-center">
        {/* Background Image with smooth fade */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
          style={{ backgroundImage: `url(${heroSlides[activeSlide].image})` }}
        >
          {/* Dark scrim gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/45"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full z-10">
          <div className="max-w-3xl space-y-6">
            
            <div className="space-y-1">
              <p className="text-sm font-semibold tracking-widest text-slate-300 uppercase">
                {heroSlides[activeSlide].superTitle}
              </p>
              <div className="border-b-4 border-flix-500 pb-2 inline-block">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[1.05]">
                  {heroSlides[activeSlide].title}
                </h1>
              </div>
            </div>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal max-w-2xl">
              {heroSlides[activeSlide].subtitle}
            </p>

            {/* Action buttons from HTML */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={heroSlides[activeSlide].btn1Action}
                className="bg-flix-500 hover:bg-flix-600 text-white font-bold px-8 py-3.5 rounded-lg text-xs uppercase tracking-wider transition-all shadow-xl shadow-flix-500/30 transform hover:-translate-y-0.5"
              >
                {heroSlides[activeSlide].btn1Text}
              </button>
              <button
                onClick={heroSlides[activeSlide].btn2Action}
                className="bg-slate-700/80 hover:bg-slate-600 text-white font-bold px-8 py-3.5 rounded-lg text-xs uppercase tracking-wider transition-all border border-slate-600"
              >
                {heroSlides[activeSlide].btn2Text}
              </button>
            </div>

            {/* Quick Track Input Bar directly in Hero */}
            <div className="pt-4">
              <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 max-w-xl shadow-2xl">
                <form onSubmit={handleTrackSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="Enter Tracking ID (e.g. TRN12345 or APX-774921-US)"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-flix-500"
                  />
                  <button
                    type="submit"
                    className="bg-flix-500 hover:bg-flix-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center space-x-1"
                  >
                    <span>Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Try: <button type="button" onClick={() => onSearchTracking('TRN12345')} className="text-flix-400 font-mono font-bold hover:underline">TRN12345</button> or <button type="button" onClick={() => onSearchTracking('APX-774921-US')} className="text-flix-400 font-mono font-bold hover:underline">APX-774921-US</button></span>
                  <span className="text-emerald-400 font-medium flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Live GPS Active</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Slider Switcher */}
            <div className="pt-4 flex items-center space-x-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeSlide === idx ? 'w-10 bg-flix-500' : 'w-4 bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 2. CORE VALUES SECTION MATCHING HTML (#about-us & #values) */}
      <section id="about-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div id="values" className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left title column */}
            <div className="lg:col-span-4 text-left lg:text-right border-l-4 lg:border-l-0 lg:border-r-4 border-flix-500 pl-4 lg:pl-0 lg:pr-8">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                OUR CORE VALUES
              </p>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1 uppercase">
                CRUSADER <span className="text-flix-500">LOGISTICS</span>
              </h2>
            </div>

            {/* Middle Quote column */}
            <div className="lg:col-span-5 text-slate-600 text-xs sm:text-sm leading-relaxed border-l-2 border-slate-100 pl-4">
              <blockquote className="space-y-3 italic">
                <p>
                  <strong className="text-slate-900 font-bold not-italic">Respect:</strong> We respect our customers, employees and industry partners. We encourage their development and reward their performance.
                </p>
                <p>
                  <strong className="text-slate-900 font-bold not-italic">Integrity:</strong> We uphold the highest standards of integrity in all of our actions.
                </p>
                <p>
                  <strong className="text-slate-900 font-bold not-italic">Accountability:</strong> We are personally accountable for delivering on our commitments.
                </p>
              </blockquote>
            </div>

            {/* Right Forklift Graphic column */}
            <div className="lg:col-span-3 flex justify-center">
              <div className="relative group text-center">
                <div className="w-60 h-60 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-50 relative bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
                    alt="Logistics Warehouse & Forklift Operations"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4 text-left">
                    <div className="text-white text-xs">
                      <div className="font-bold uppercase text-flix-400">Warehouse Equipment</div>
                      <div className="font-semibold text-slate-200">High-Bay Pallet System</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. THREE FEATURE CARDS (Around the world SHIPMENTS, Cargo Insurance PROTECTION, On Time DELIVERIES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all group">
            <div className="h-56 overflow-hidden relative">
              <img
                src="/crusader_courier.jpg"
                alt="Crusader Logistics Express Courier Delivery"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                Global Network
              </div>
            </div>
            <div className="p-6 sm:p-8 space-y-2">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Around the world
              </p>
              <h3 className="text-2xl font-black text-flix-500 uppercase tracking-tight">
                SHIPMENTS
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pt-1">
                With a solid transportation infrastructure, we offer superb transport and logistics finely tuned to the demanding operations.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => onNavigate('services')}
                  className="text-xs font-bold text-flix-600 hover:text-flix-700 flex items-center space-x-1 uppercase"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all group">
            <div className="h-56 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80"
                alt="Cargo insurance protection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                Full Coverage
              </div>
            </div>
            <div className="p-6 sm:p-8 space-y-2">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Cargo Insurance
              </p>
              <h3 className="text-2xl font-black text-flix-500 uppercase tracking-tight">
                PROTECTION
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pt-1">
                Our company’s services guarantee first-class operations for each of our clients while also offering infallible insurance third-party providers.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => onNavigate('about')}
                  className="text-xs font-bold text-flix-600 hover:text-flix-700 flex items-center space-x-1 uppercase"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all group">
            <div className="h-56 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80"
                alt="On time deliveries courier"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                Guaranteed Windows
              </div>
            </div>
            <div className="p-6 sm:p-8 space-y-2">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                On Time
              </p>
              <h3 className="text-2xl font-black text-flix-500 uppercase tracking-tight">
                DELIVERIES
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pt-1">
                We adhere to strict and precise operative capacities in order to sustain reliable delivery times for every client.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => onNavigate('book')}
                  className="text-xs font-bold text-flix-600 hover:text-flix-700 flex items-center space-x-1 uppercase"
                >
                  <span>Book Consignment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. CUSTOMER REVIEWS SECTION (Matching HTML) */}
      <section id="reviews" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Header intro */}
            <div className="lg:col-span-4 text-left lg:text-right border-l-4 lg:border-l-0 lg:border-r-4 border-flix-500 pl-4 lg:pl-0 lg:pr-8">
              <p className="text-xs font-black uppercase tracking-widest text-flix-400">
                CUSTOMER REVIEWS
              </p>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 uppercase text-white">
                CLIENTS THAT TRUST OUR SERVICES
              </h2>
              <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                Customer satisfaction and feedback is very high and extremely important to everyone here at Crusaders Logistics. We put you the customer, first and foremost before anything else.
              </p>
            </div>

            {/* Review 1 */}
            <div className="lg:col-span-4 bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-4">
              <blockquote className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                "I owe my success to having listened respectfully to the advice of Crusaders Logistics. I have been able to expand the reach of my business with precision and order."
              </blockquote>
              <div className="pt-2 border-t border-slate-700 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white uppercase tracking-wider">JONATHAN CURR</div>
                  <div className="text-flix-400 text-[11px]">UK</div>
                </div>
                <div className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  VERIFIED CLIENT
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="lg:col-span-4 bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-4">
              <blockquote className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                "They do what some companies are not willing to do. Immediate results = long-term business. Crusaders Logistics has been our source of leverage to empower business growth within our company."
              </blockquote>
              <div className="pt-2 border-t border-slate-700 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white uppercase tracking-wider">MIKA STALLION</div>
                  <div className="text-flix-400 text-[11px]">New York</div>
                </div>
                <div className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  VERIFIED CLIENT
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WHAT WE DO: LOGISTICS SERVICES & SOLUTIONS (Matching HTML #services) */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <p className="text-xs font-black uppercase tracking-wider text-flix-600">
            WHAT WE DO
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
            LOGISTICS SERVICES &amp; SOLUTIONS
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Discover our core global transportation solutions built for demanding industrial, commercial, and parcel freight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Service 1: Worldwide */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between">
            <div>
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80"
                  alt="Worldwide Air Routes"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase">
                  Global Reach
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Worldwide</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  At Crusaders Logistics, we ship round the globe. Wherever there is an air route, rest assured Crusaders Logistics will deliver on time.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => onNavigate('book')}
                className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-flix-50 text-slate-800 hover:text-flix-600 text-xs font-bold transition-colors border border-slate-200 flex items-center justify-center space-x-1"
              >
                <span>Book Air Route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Service 2: Tracking */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between">
            <div>
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                  alt="Real-time Tracking"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase">
                  Live Telemetry
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Tracking</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Locate and stay up to date with your shipment’s live location on mobile or over the web with our state of the art monitoring environment.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => onNavigate('track')}
                className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-flix-50 text-slate-800 hover:text-flix-600 text-xs font-bold transition-colors border border-slate-200 flex items-center justify-center space-x-1"
              >
                <span>Track Cargo Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Service 3: Fast and reliable */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between">
            <div>
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800&q=80"
                  alt="Fast and reliable ocean and road shipping"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase">
                  Rapid Transit
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Fast and reliable</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We adhere to strict and precise operative capacities in order to sustain reliable delivery times for every client.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => onNavigate('rates')}
                className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-flix-50 text-slate-800 hover:text-flix-600 text-xs font-bold transition-colors border border-slate-200 flex items-center justify-center space-x-1"
              >
                <span>Calculate Cost</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Service 4: Storage */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between">
            <div>
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80"
                  alt="Warehousing and Storage"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase">
                  Warehousing
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Storage</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our warehousing and distribution services are regularly audited and analyzed to ensure that it meets the contemporary business models.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => onNavigate('services')}
                className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-flix-50 text-slate-800 hover:text-flix-600 text-xs font-bold transition-colors border border-slate-200 flex items-center justify-center space-x-1"
              >
                <span>View Warehousing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Service 5: 24/7 Support */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between">
            <div>
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                  alt="24/7 Support"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase">
                  Always Online
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-bold text-slate-900">24/7 Support</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Crusaders Logistics provides 24/7 customer service support to facilitate round the clock flow and ease of shipping.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => onNavigate('contact')}
                className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-flix-50 text-slate-800 hover:text-flix-600 text-xs font-bold transition-colors border border-slate-200 flex items-center justify-center space-x-1"
              >
                <span>Contact Support</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Service 6: Automated Email Milestone Telemetry */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-flix-500/20 text-flix-400 flex items-center justify-center mb-4 border border-flix-500/30">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Automated Notifications</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Receive instant responsive HTML alerts whenever a consignment changes milestones: Order Placed &rarr; Picked Up &rarr; In Transit &rarr; Out for Delivery &rarr; Signed Proof of Delivery.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onNavigate('outbox')}
                className="w-full py-2.5 rounded-xl bg-flix-500 hover:bg-flix-600 text-white text-xs font-bold transition-colors flex items-center justify-center space-x-1 shadow-md shadow-flix-500/25 uppercase"
              >
                <span>Inspect Sent Outbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. MONITORING ENVIRONMENT: TRACK PACKAGE (Matching HTML #track) */}
      <section id="track" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left title column */}
            <div className="lg:col-span-5 text-left lg:text-right border-l-4 lg:border-l-0 lg:border-r-4 border-flix-500 pl-4 lg:pl-0 lg:pr-8 space-y-2">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                MONITORING ENVIRONMENT
              </p>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                TRACK PACKAGE
              </h2>
              <blockquote className="text-xs sm:text-sm text-slate-600 italic pt-2">
                "Enter your unique tracking ID to begin tracking your shipment in real time."
              </blockquote>
            </div>

            {/* Right Form column matching HTML structure */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Enter the Consignment No.</h4>
              
              <form onSubmit={handleTrackSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="Ex: TRN12345"
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-flix-500"
                  />
                  <button
                    type="submit"
                    className="bg-flix-500 hover:bg-flix-600 text-white font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md shadow-flix-500/20"
                  >
                    Track Shipment
                  </button>
                </div>
              </form>

              <div className="pt-2 text-xs text-slate-500 flex flex-wrap items-center gap-2">
                <span>Demo tracking numbers:</span>
                <button
                  type="button"
                  onClick={() => onSearchTracking('TRN12345')}
                  className="px-2.5 py-1 rounded bg-white border border-slate-200 font-mono font-bold text-flix-600 hover:bg-slate-100"
                >
                  TRN12345 (In Transit)
                </button>
                <button
                  type="button"
                  onClick={() => onSearchTracking('APX-304912-EU')}
                  className="px-2.5 py-1 rounded bg-white border border-slate-200 font-mono font-bold text-amber-600 hover:bg-slate-100"
                >
                  APX-304912-EU (Out for Delivery)
                </button>
                <button
                  type="button"
                  onClick={() => onSearchTracking('APX-992100-AS')}
                  className="px-2.5 py-1 rounded bg-white border border-slate-200 font-mono font-bold text-emerald-600 hover:bg-slate-100"
                >
                  APX-992100-AS (Delivered)
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. STATISTICAL FACTS: NUMBERS & PROGRESS BARS (Matching HTML #bt_section611cd25e5b254) */}
      <section id="statistics" className="bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Title column */}
            <div className="lg:col-span-4 text-left lg:text-right border-l-4 lg:border-l-0 lg:border-r-4 border-flix-500 pl-4 lg:pl-0 lg:pr-8 space-y-2">
              <p className="text-xs font-black uppercase tracking-widest text-flix-400">
                STATISTICAL FACTS
              </p>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                Crusaders Logistics NUMBERS
              </h2>
              <blockquote className="text-slate-400 text-xs italic pt-2">
                "Our huge strides over the years have proven Crusaders Logistics to be a trusted and reliable logistics partner you can trust."
              </blockquote>
            </div>

            {/* Progress Bars Column matching HTML exact numbers */}
            <div className="lg:col-span-8 space-y-4">
              {/* International Deliveries 88% */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  <span>INTERNATIONAL DELIVERIES</span>
                  <span className="text-flix-400 font-mono">88%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-flix-500 h-full rounded-full transition-all duration-1000" style={{ width: '88%' }}></div>
                </div>
              </div>

              {/* Freight Forwarding 76% */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  <span>FREIGHT FORWARDING</span>
                  <span className="text-flix-400 font-mono">76%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-flix-500 h-full rounded-full transition-all duration-1000" style={{ width: '76%' }}></div>
                </div>
              </div>

              {/* Door-to-Door 97% */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  <span>DOOR-TO-DOOR</span>
                  <span className="text-flix-400 font-mono">97%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-flix-500 h-full rounded-full transition-all duration-1000" style={{ width: '97%' }}></div>
                </div>
              </div>

              {/* Customer Satisfaction 100% */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  <span>CUSTOMER SATISFACTION</span>
                  <span className="text-emerald-400 font-mono">100%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Large Numerical Counters matching HTML */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-800">
            {/* 897,344 KM IN 1/4 2020 */}
            <div className="text-center p-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-flix-500 font-mono tracking-tight">
                897,344
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-white">
                KM IN 1/4 2020
              </div>
              <p className="text-slate-400 text-xs leading-relaxed pt-1">
                Amassing a total 5 million square mile mark in 2018 and recording the lowest since operation, 897,344 KM, we are your best bet!
              </p>
            </div>

            {/* 7,279 TONS OF GOODS */}
            <div className="text-center p-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-flix-500 font-mono tracking-tight">
                7,279
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-white">
                TONS OF GOODS
              </div>
              <p className="text-slate-400 text-xs leading-relaxed pt-1">
                Amidst global market shifts, Crusaders Logistics has continued to cover more grounds regardless of the challenges faced.
              </p>
            </div>

            {/* 1,000,000 SATISFIED CLIENTS */}
            <div className="text-center p-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono tracking-tight">
                1,000,000
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-white">
                SATISFIED CLIENTS
              </div>
              <p className="text-slate-400 text-xs leading-relaxed pt-1">
                Customer satisfaction remains our priority. With that in mind, Crusaders Logistics has taken global strides to improve in excellence.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 8. GET A QUOTE / COST CALCULATOR SECTION (Matching HTML #get-quote) */}
      <section id="get-quote" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left title column with green truck image */}
            <div className="lg:col-span-4 text-left lg:text-right border-l-4 lg:border-l-0 lg:border-r-4 border-flix-500 pl-4 lg:pl-0 lg:pr-8 space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                START SHIPPING
              </p>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                GET A QUOTE
              </h2>
              <p className="text-xs text-slate-500 italic">
                * for detailed quote use extended version
              </p>

              <div className="pt-6 hidden lg:block">
                <img
                  src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80"
                  alt="Logistics Freight Fleet"
                  className="rounded-2xl shadow-lg border border-slate-200 object-cover w-full h-44"
                />
              </div>
            </div>

            {/* Right interactive calculator matching HTML formula */}
            <div className="lg:col-span-8 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
              <div>
                <h4 className="text-base font-black text-slate-900 uppercase">GET A QUICK QUOTE</h4>
                <p className="text-xs text-slate-500">Live cost simulation based on equipment size, commodity, and mileage.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                {/* Truckload dropdown */}
                <div>
                  <label className="block mb-1 uppercase tracking-wider">TRUCKLOAD</label>
                  <select
                    value={truckload}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setTruckload(val);
                      if (val === 1.3) setTruckloadLabel('20ft');
                      else if (val === 2) setTruckloadLabel('40ft');
                      else if (val === 2.2) setTruckloadLabel('45ft');
                      else if (val === 2.5) setTruckloadLabel('53ft');
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-flix-500"
                  >
                    <option value={1.3}>20ft Container</option>
                    <option value={2}>40ft High-Cube</option>
                    <option value={2.2}>45ft Extended</option>
                    <option value={2.5}>53ft Heavy Haul</option>
                  </select>
                </div>

                {/* Commodity dropdown */}
                <div>
                  <label className="block mb-1 uppercase tracking-wider">COMMODITY</label>
                  <select
                    value={commodity}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setCommodity(val);
                      if (val === 1) setCommodityLabel('General');
                      else if (val === 1.2) setCommodityLabel('Fragile Goods');
                      else if (val === 1.1) setCommodityLabel('Fine Arts');
                      else if (val === 1.5) setCommodityLabel('Hazardous Goods');
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-flix-500"
                  >
                    <option value={1}>General Cargo</option>
                    <option value={1.2}>Fragile Goods</option>
                    <option value={1.1}>Fine Arts & High Value</option>
                    <option value={1.5}>Hazardous Goods (Class 1-9)</option>
                  </select>
                </div>
              </div>

              {/* Distance Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="uppercase tracking-wider">DIST (MILES)</span>
                  <span className="font-mono text-flix-600 font-black">{distance} miles</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={distance}
                  onChange={(e) => setDistance(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-flix-500"
                />
              </div>

              {/* Refrigerated Switch */}
              <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider">REFRIGERATED (TEMP-CONTROLLED 2-8°C)</span>
                <button
                  type="button"
                  onClick={() => setIsRefrigerated(!isRefrigerated)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    isRefrigerated ? 'bg-flix-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isRefrigerated ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Total Calculation Output */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estimated Total</div>
                  <div className="text-3xl font-black text-flix-400 font-mono">
                    ${calcTotal().toLocaleString()} <span className="text-xs text-slate-400 font-normal">USD</span>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Enter email to receive quote..."
                    value={quoteEmail}
                    onChange={(e) => setQuoteEmail(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-flix-500"
                  />
                  <button
                    type="button"
                    onClick={handleQuickQuoteSubmit}
                    className="bg-flix-500 hover:bg-flix-600 text-white font-bold px-5 py-2 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md"
                  >
                    Send Email Quote
                  </button>
                </div>
              </div>

              {quoteSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{quoteSuccessMsg}</span>
                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* 9. CONTACT US ORANGE SECTION (Matching HTML #contact style="background-color:#ef700e;") */}
      <section id="contact" className="bg-[#ef700e] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            
            {/* Column 1: Header */}
            <div className="pr-4 text-left">
              <p className="text-xs font-black uppercase tracking-widest text-white/80">
                WE'LL BE GLAD TO HELP
              </p>
              <h2 className="text-3xl font-black tracking-tight text-white uppercase mt-1">
                CONTACT US
              </h2>
            </div>

            {/* Column 2: Write Us */}
            <div className="pt-4 md:pt-0 md:pl-6 space-y-1">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-2">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-wider">WRITE US</h4>
              <p className="text-xs text-white/90">
                Send us a mail<br />
                <a href="mailto:info@crusaderslogistics.com" className="font-bold underline hover:text-white">
                  info@crusaderslogistics.com
                </a>
              </p>
            </div>

            {/* Column 3: Working Hours */}
            <div className="pt-4 md:pt-0 md:pl-6 space-y-1">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-2">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-wider">WORKING HOURS</h4>
              <p className="text-xs text-white/90">
                Mon-Sat 7AM-5PM<br />
                Sat 9AM-3PM
              </p>
            </div>

            {/* Column 4: Our Location */}
            <div className="pt-4 md:pt-0 md:pl-6 space-y-1">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-2">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-wider">OUR LOCATION</h4>
              <p className="text-xs text-white/90">
                300 Kansas Ave NW<br />
                New Jersey
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
