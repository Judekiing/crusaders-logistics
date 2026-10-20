import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveEmailModal from './components/LiveEmailModal';

import HomeView from './views/HomeView';
import TrackingView from './views/TrackingView';
import BookingView from './views/BookingView';
import RateCalculatorView from './views/RateCalculatorView';
import ServicesView from './views/ServicesView';
import CustomerPortalView from './views/CustomerPortalView';
import OperationsAdminView from './views/OperationsAdminView';
import EmailOutboxView from './views/EmailOutboxView';
import AboutTrustView from './views/AboutTrustView';
import ContactSupportView from './views/ContactSupportView';
import CareersPartnersView from './views/CareersPartnersView';
import AuthModal from './components/AuthModal';
import LiveSupportWidget from './components/LiveSupportWidget';

import { 
  fetchNotifications, 
  logActivity, 
  getSavedUser, 
  setSavedUser, 
  clearSavedUser 
} from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return getSavedUser() || null;
  });

  // Default initial tab: if logged in, stay directly on user's dashboard!
  const [activeTab, setActiveTab] = useState(() => {
    const saved = getSavedUser();
    if (saved) {
      const role = String(saved.role || '').toLowerCase();
      return role.includes('admin') ? 'admin' : 'portal';
    }
    return 'home';
  });

  const [selectedTrackingCode, setSelectedTrackingCode] = useState('TRN12345');
  const [inspectingNotification, setInspectingNotification] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isOfficeSubdomain, setIsOfficeSubdomain] = useState(false);
  const [inactivityNotice, setInactivityNotice] = useState(false);

  // Authentication State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState('customer');

  // Check URL query params & office.domain.com subdomain routing on mount
  useEffect(() => {
    const hostname = window.location.hostname.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const trackingParam = params.get('tracking') || params.get('track');
    const tabParam = params.get('tab');

    // Detect if accessed via office.domain.com, admin.*, /admin, or /office
    const isOffice = 
      hostname.startsWith('office.') || 
      hostname.includes('office-') || 
      hostname.startsWith('admin.') || 
      pathname.startsWith('/admin') || 
      pathname.startsWith('/office') || 
      params.has('office') || 
      tabParam === 'admin';

    if (isOffice) {
      setIsOfficeSubdomain(true);
      document.title = 'Crusaders Logistics Corporate Office | Operations Console';
      
      const saved = getSavedUser();
      const role = String(saved?.role || '').toLowerCase();
      if (saved && role.includes('admin')) {
        setActiveTab('admin');
      } else {
        // DO NOT set activeTab to 'admin' before authentication!
        setActiveTab('home');
        setAuthInitialRole('super_admin');
        setAuthModalOpen(true);
      }

      logActivity({
        eventType: 'ADMIN_ACCESS_ATTEMPT',
        description: `Terminal access attempted from ${hostname}`,
        entityType: 'admin',
        entityId: 'office.crusaderslogistics.com'
      });
    } else if (trackingParam) {
      setSelectedTrackingCode(trackingParam);
      setActiveTab('track');
      logActivity({
        eventType: 'TRACK_PARCEL',
        description: `Visitor tracked consignment #${trackingParam}`,
        entityType: 'shipment',
        entityId: trackingParam
      });
    } else if (tabParam === 'login' || pathname === '/login') {
      setAuthInitialRole('customer');
      setAuthModalOpen(true);
    } else if (tabParam === 'admin') {
      const saved = getSavedUser();
      const role = String(saved?.role || '').toLowerCase();
      if (saved && role.includes('admin')) {
        setActiveTab('admin');
      } else {
        setActiveTab('home');
        setAuthInitialRole('super_admin');
        setAuthModalOpen(true);
      }
    } else if (tabParam === 'portal') {
      const saved = getSavedUser();
      if (saved) {
        setActiveTab('portal');
      } else {
        setActiveTab('home');
        setAuthInitialRole('customer');
        setAuthModalOpen(true);
      }
    } else if (tabParam) {
      setActiveTab(tabParam);
    } else {
      // If user is already signed in and no specific tab given, keep them on their dashboard
      const saved = getSavedUser();
      if (saved) {
        const role = String(saved.role || '').toLowerCase();
        setActiveTab(role.includes('admin') ? 'admin' : 'portal');
      }
    }

    // Refresh notification count periodically
    const checkCount = async () => {
      try {
        const res = await fetchNotifications();
        if (res?.success) {
          setNotificationCount(res.data.length);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkCount();
  }, []);

  // 10-Minute Inactivity Auto-Logout Timer
  useEffect(() => {
    if (!currentUser) return;

    const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
    let timer = null;

    const performLogout = () => {
      clearSavedUser();
      setCurrentUser(null);
      setActiveTab('home');
      setInactivityNotice(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(performLogout, INACTIVITY_TIMEOUT);
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(ev => window.addEventListener(ev, resetTimer, { passive: true }));

    resetTimer();

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach(ev => window.removeEventListener(ev, resetTimer));
    };
  }, [currentUser]);

  const handleAuthModalClose = () => {
    setAuthModalOpen(false);
    const saved = getSavedUser();
    const role = String(saved?.role || '').toLowerCase();
    
    // If modal is closed without valid credentials on a protected route,
    // immediately redirect back to home page and clear URL parameters
    if (activeTab === 'admin' && (!saved || !role.includes('admin'))) {
      setActiveTab('home');
      try {
        window.history.replaceState({}, '', '/');
      } catch (e) {}
    } else if (activeTab === 'portal' && !saved) {
      setActiveTab('home');
      try {
        window.history.replaceState({}, '', '/');
      } catch (e) {}
    }
  };

  const handleNavigate = (tab) => {
    if (tab === 'values' || tab === 'stats') {
      setActiveTab('home');
      setTimeout(() => {
        const el = document.getElementById(tab);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (tab === 'admin') {
      const saved = getSavedUser();
      const role = String(saved?.role || '').toLowerCase();
      if (!saved || !role.includes('admin')) {
        setAuthInitialRole('super_admin');
        setAuthModalOpen(true);
        return;
      }
      setActiveTab('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'portal') {
      const saved = getSavedUser();
      if (!saved) {
        setAuthInitialRole('customer');
        setAuthModalOpen(true);
        return;
      }
      setActiveTab('portal');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchTracking = (code) => {
    setSelectedTrackingCode(code);
    setActiveTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    logActivity({
      eventType: 'TRACK_PARCEL',
      description: `Visitor initiated tracking lookup for waybill #${code}`,
      entityType: 'shipment',
      entityId: code
    });
  };

  const handleBookingSuccess = (newCode) => {
    setSelectedTrackingCode(newCode);
    setActiveTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRateToBook = (rateOption) => {
    setActiveTab('book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEmailViewer = (notif) => {
    if (notif) {
      setInspectingNotification(notif);
    } else {
      setActiveTab('outbox');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    clearSavedUser();
    setCurrentUser(null);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-flix-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        notificationCount={notificationCount}
        onOpenQuickTrack={() => setActiveTab('track')}
        currentUser={currentUser}
        onOpenAuthModal={(role) => {
          setAuthInitialRole(role || 'customer');
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Inactivity Auto-Logout Security Notification Banner */}
      {inactivityNotice && (
        <div className="bg-amber-500 text-slate-950 font-bold px-4 py-3 flex items-center justify-between text-xs animate-fade-in shadow-md">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-slate-950 flex-shrink-0" />
            <span>You have been automatically signed out after 10 minutes of inactivity for your session security.</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setInactivityNotice(false);
                setAuthInitialRole('customer');
                setAuthModalOpen(true);
              }}
              className="underline hover:text-black font-extrabold cursor-pointer"
            >
              Sign In Again
            </button>
            <button
              onClick={() => setInactivityNotice(false)}
              className="text-slate-950 hover:opacity-70 p-1 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            onSearchTracking={handleSearchTracking}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'track' && (
          <TrackingView
            initialTrackingNumber={selectedTrackingCode}
            onOpenEmailOutbox={() => { setActiveTab('outbox'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        )}

        {activeTab === 'book' && (
          <BookingView
            onBookingSuccess={handleBookingSuccess}
            onOpenOutbox={() => { setActiveTab('outbox'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            currentUser={currentUser}
            onOpenAuthModal={(role) => {
              setAuthInitialRole(role || 'customer');
              setAuthModalOpen(true);
            }}
          />
        )}

        {activeTab === 'rates' && (
          <RateCalculatorView
            onSelectRateToBook={handleSelectRateToBook}
            onOpenOutbox={() => { setActiveTab('outbox'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        )}

        {activeTab === 'services' && (
          <ServicesView
            onBookService={(serviceId) => { setActiveTab('book'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onGetQuote={() => { setActiveTab('rates'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        )}

        {activeTab === 'portal' && (
          currentUser ? (
            <CustomerPortalView
              onTrackShipment={handleSearchTracking}
              onBookNew={() => { setActiveTab('book'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              currentUser={currentUser}
              onOpenAuthModal={() => {
                setAuthInitialRole('customer');
                setAuthModalOpen(true);
              }}
            />
          ) : (
            <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-slate-950">
              <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl space-y-6">
                <div className="w-16 h-16 bg-sky-500/10 border border-sky-500/30 rounded-2xl flex items-center justify-center mx-auto text-sky-400 shadow-lg shadow-sky-500/20">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-bold uppercase tracking-wider mb-2">
                    <span>Shipper Access</span>
                  </div>
                  <h2 className="text-xl font-black text-white">Shipper Sign-In Required</h2>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Please sign in to your Crusaders Logistics shipper account to view your consignments, invoices, and profile.
                  </p>
                </div>
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      setAuthInitialRole('customer');
                      setAuthModalOpen(true);
                    }}
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Sign In to Shipper Portal</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('home');
                      window.history.replaceState({}, '', '/');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Return to Homepage
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {activeTab === 'admin' && (
          currentUser && String(currentUser.role || '').toLowerCase().includes('admin') ? (
            <OperationsAdminView
              onOpenEmailViewer={() => { setActiveTab('outbox'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              onViewShipment={handleSearchTracking}
              currentUser={currentUser}
              onOpenAuthModal={() => {
                setAuthInitialRole('super_admin');
                setAuthModalOpen(true);
              }}
            />
          ) : (
            <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-slate-950">
              <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl space-y-6">
                <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-500 shadow-lg shadow-rose-500/20">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold uppercase tracking-wider mb-2">
                    <span>Restricted Terminal</span>
                  </div>
                  <h2 className="text-xl font-black text-white">Administrator Access Required</h2>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    The Crusaders Logistics Operations Center is restricted to authorized personnel. Please sign in with administrator credentials to proceed.
                  </p>
                </div>
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      setAuthInitialRole('super_admin');
                      setAuthModalOpen(true);
                    }}
                    className="w-full bg-gradient-to-r from-flix-500 to-amber-500 hover:from-flix-400 hover:to-amber-400 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-flix-500/25 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Sign In to Admin Console</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('home');
                      window.history.replaceState({}, '', '/');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Return to Homepage
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {activeTab === 'outbox' && (
          <EmailOutboxView
            onInspectNotification={(n) => setInspectingNotification(n)}
          />
        )}

        {activeTab === 'about' && (
          <AboutTrustView />
        )}

        {activeTab === 'contact' && (
          <ContactSupportView />
        )}

        {activeTab === 'careers' && (
          <CareersPartnersView />
        )}
      </main>

      {/* Live 24/7 Support Widget Connected to Email info@crusaderslogistics.com */}
      <LiveSupportWidget onNavigate={handleNavigate} />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={handleAuthModalClose}
        initialRole={authInitialRole}
        onLoginSuccess={(user) => {
          const rawRole = String(user.role || '').toLowerCase();
          const cleanUser = {
            ...user,
            fullName: user.fullName || user.name || user.username || 'User',
            name: user.fullName || user.name || user.username || 'User',
            role: rawRole,
            avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
          };
          setCurrentUser(cleanUser);
          setSavedUser(cleanUser);
          setAuthModalOpen(false);

          // Direct immediately to appropriate dashboard:
          if (rawRole.includes('admin') || isOfficeSubdomain) {
            setActiveTab('admin');
          } else {
            setActiveTab('portal');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Live Email Inspector Modal */}
      {inspectingNotification && (
        <LiveEmailModal
          notification={inspectingNotification}
          onClose={() => setInspectingNotification(null)}
        />
      )}
    </div>
  );
}
