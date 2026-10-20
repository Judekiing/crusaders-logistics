import React, { useState } from 'react';
import { 
  Truck, 
  Search, 
  PlusCircle, 
  Calculator, 
  Layers, 
  UserCheck, 
  Sliders, 
  Mail, 
  PhoneCall, 
  ShieldCheck,
  Menu,
  X,
  Compass,
  BarChart3,
  HeartHandshake,
  Building2,
  Lock,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  notificationCount, 
  onOpenQuickTrack,
  currentUser,
  onOpenAuthModal,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  // Exact menu structure for Crusaders Logistics, plus operational tools
  const primaryNavItems = [
    { id: 'home', label: 'HOME' },
    { id: 'values', label: 'CORE VALUES' },
    { id: 'services', label: 'OUR SERVICES' },
    // { id: 'stats', label: 'STATISTICS' },
    { id: 'rates', label: 'QUOTE' },
    { id: 'contact', label: 'CONTACT US' },
    { id: 'track', label: 'TRACK SHIPMENT' },
  ];


  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const rawRole = String(currentUser?.role || '').toLowerCase();
  const isAdmin = rawRole.includes('admin');
  const isCustomer = !!currentUser && !isAdmin;

  const ROUNDCUBE_WEBMAIL_URL = "https://standard7.doveserver.com:2096/cpsess5669445925/3rdparty/roundcube/?_task=mail&_mbox=INBOX";

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top micro-bar */}
      <div className="bg-black/80 text-slate-400 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800/80 hidden sm:flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5 text-flix-400">
            <span className="w-2 h-2 rounded-full bg-flix-500 animate-pulse"></span>
            <span className="font-semibold tracking-wide">CRUSADERS LOGISTICS &bull; Connecting People & Global Supply Chains</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">Global Freight Transport via Sea, Air & Land</span>
        </div>
        <div className="flex items-center space-x-4">
          <a 
            href="mailto:info@crusaderslogistics.com" 
            className="flex items-center space-x-1.5 text-slate-300 hover:text-flix-400 transition-colors"
          >
            <Mail className="w-3 h-3 text-flix-400" />
            <span>info@crusaderslogistics.com</span>
          </a>
          <span className="text-slate-700">|</span>
          <a 
            href="tel:+18005552781" 
            className="text-flix-400 hover:text-flix-300 font-bold flex items-center space-x-1"
          >
            <PhoneCall className="w-3 h-3" />
            <span>+1 (800) 555-CRU1</span>
          </a>
          {isAdmin && (
            <>
              <span className="text-slate-700">|</span>
              <a
                href={ROUNDCUBE_WEBMAIL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all"
                title="Open Official Crusaders Webmail (Roundcube / Outlook)"
              >
                <Mail className="w-3 h-3 text-amber-400" />
                <span>Webmail (Roundcube)</span>
              </a>
            </>
          )}
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo brand */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center space-x-3 cursor-pointer group select-none py-2"
          >
            {/* Crusaders Shield Logo */}
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-900 flex items-center justify-center shadow-lg shadow-flix-500/25 group-hover:scale-105 transition-all">
              <img 
                src="/crusaders_logo.jpg" 
                alt="Crusaders Logistics Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logo.jpg';
                }}
              />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black tracking-tight flex items-center text-white">
                CRUSADERS <span className="text-flix-500 ml-1.5">LOGISTICS</span>
              </div>
              <div className="text-[10px] text-flix-300 tracking-wider uppercase font-semibold">
                Connecting people &bull; Global Freight
              </div>
            </div>
          </div>

          {/* Primary Nav Menu */}
          <nav className="hidden xl:flex items-center space-x-1">
            {primaryNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 text-xs font-bold tracking-wider transition-all rounded-lg uppercase ${
                    isActive
                      ? 'text-flix-400 bg-slate-900 shadow-sm border border-slate-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action and User Area */}
          <div className="hidden lg:flex items-center space-x-3 border-l border-slate-800 pl-4">
            
            {/* Book Now Button */}
            <button
              onClick={() => handleNavClick('book')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-flix-400" />
              <span>Book Parcel</span>
            </button>

            {/* Authenticated Admin or Customer Shortcuts */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                    : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            )}

            {isCustomer && (
              <button
                onClick={() => handleNavClick('portal')}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  activeTab === 'portal'
                    ? 'bg-flix-500 text-white font-black shadow-lg shadow-flix-500/25'
                    : 'bg-sky-500/10 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>My Dashboard</span>
              </button>
            )}

            {/* User Auth Pill / Switcher */}
            {currentUser ? (
              <div className="relative">
                {(() => {
                  const displayName = currentUser?.fullName || currentUser?.name || currentUser?.username || 'User';
                  const firstName = displayName.split(' ')[0];
                  const isSuper = rawRole.includes('super');
                  const isCompany = rawRole.includes('company');
                  const roleBadgeText = isSuper ? 'Super Admin' : (isCompany ? 'Company Admin' : 'Customer');
                  const roleBadgeClass = isSuper ? 'bg-purple-950 text-purple-300 border-purple-800' : (isCompany ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-sky-950 text-sky-300 border-sky-800');
                  const avatarSrc = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

                  return (
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all text-xs"
                      title="User Profile Menu"
                    >
                      <div className="w-6 h-6 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
                        <img src={avatarSrc} alt={displayName} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left hidden 2xl:block">
                        <div className="text-[11px] font-bold text-white leading-tight">
                          {firstName}
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${roleBadgeClass}`}>
                        {roleBadgeText}
                      </span>
                    </button>
                  );
                })()}

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-xs space-y-2 animate-fade-in">
                    <div className="pb-2 border-b border-slate-800">
                      <div className="font-bold text-white">{currentUser?.fullName || currentUser?.name || currentUser?.username}</div>
                      <div className="text-[10px] text-slate-400">{currentUser?.email}</div>
                      <div className="text-[10px] text-flix-400 font-semibold mt-0.5">{currentUser?.roleLabel || currentUser?.role_title || (isAdmin ? 'Operations Authority' : 'Enterprise Shipper')}</div>
                    </div>

                    {/* Admin-only links */}
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleNavClick('admin');
                          }}
                          className="w-full py-2 px-3 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 text-amber-200 font-semibold flex items-center space-x-2 transition-colors border border-amber-800/40"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span>Admin Operations Console</span>
                        </button>

                        <a
                          href={ROUNDCUBE_WEBMAIL_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center justify-between transition-colors"
                        >
                          <span className="flex items-center space-x-2">
                            <Mail className="w-3.5 h-3.5 text-amber-400" />
                            <span>Official Webmail (Roundcube)</span>
                          </span>
                          <span className="text-[10px] text-amber-300 font-mono">Open &rarr;</span>
                        </a>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleNavClick('outbox');
                          }}
                          className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center justify-between transition-colors"
                        >
                          <span className="flex items-center space-x-2">
                            <Mail className="w-3.5 h-3.5 text-flix-400" />
                            <span>System Outbox Logs</span>
                          </span>
                          {notificationCount > 0 && (
                            <span className="px-1.5 py-0.2 bg-flix-500 text-white rounded-full text-[10px] font-bold">
                              {notificationCount}
                            </span>
                          )}
                        </button>

                        {/* <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleNavClick('portal');
                          }}
                          className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center space-x-2 transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                          <span>Preview Customer Portal</span>
                        </button> */}
                      </>
                    )}

                    {/* Customer-only links */}
                    {isCustomer && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('portal');
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-sky-950/40 hover:bg-sky-900/50 text-sky-200 font-semibold flex items-center space-x-2 transition-colors border border-sky-800/40"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                        <span>My Shipments Dashboard</span>
                      </button>
                    )}

                    {/* <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenAuthModal();
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center space-x-2 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-flix-400" />
                      <span>Switch Account / Sign In</span>
                    </button> */}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 font-semibold flex items-center space-x-2 transition-colors border border-rose-900/50"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuthModal('customer')}
                className="bg-gradient-to-r from-flix-500 to-amber-500 hover:from-flix-400 hover:to-amber-400 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg shadow-flix-500/25 transition-all transform hover:-translate-y-0.5 flex items-center space-x-1.5 cursor-pointer"
                title="Login to Customer Dashboard or Operations Console"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Dashboard Login</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="xl:hidden flex items-center space-x-2">
            {!currentUser && (
              <button
                onClick={() => onOpenAuthModal('customer')}
                className="bg-flix-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1"
              >
                <Lock className="w-3 h-3" />
                <span>Login</span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            {primaryNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-bold ${
                  activeTab === item.id ? 'bg-flix-500 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('book')}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-bold bg-flix-500 text-white"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book Parcel</span>
            </button>

            {isAdmin && (
              <>
                <button
                  onClick={() => handleNavClick('admin')}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Console</span>
                </button>
                <a
                  href={ROUNDCUBE_WEBMAIL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold bg-slate-800 text-amber-300"
                >
                  <Mail className="w-4 h-4" />
                  <span>Webmail (Roundcube)</span>
                </a>
              </>
            )}

            {isCustomer && (
              <button
                onClick={() => handleNavClick('portal')}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40"
              >
                <UserCheck className="w-4 h-4" />
                <span>My Dashboard</span>
              </button>
            )}

            {!currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal('customer');
                }}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-bold bg-gradient-to-r from-flix-500 to-amber-500 text-white"
              >
                <Lock className="w-4 h-4" />
                <span>Dashboard Login</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold bg-rose-950 text-rose-300 border border-rose-900"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
