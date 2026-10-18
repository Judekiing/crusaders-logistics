import React, { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState('home');
  const [selectedTrackingCode, setSelectedTrackingCode] = useState('TRN12345');
  const [inspectingNotification, setInspectingNotification] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isOfficeSubdomain, setIsOfficeSubdomain] = useState(false);

  // Authentication State - Defaults to guest / customer
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState('customer');
  const [currentUser, setCurrentUser] = useState(() => {
    return getSavedUser() || null;
  });

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
      setActiveTab('admin');
      document.title = 'Crusaders Logistics Corporate Office | Operations Console';
      
      const saved = getSavedUser();
      const role = String(saved?.role || '').toLowerCase();
      if (!saved || !role.includes('admin')) {
        setAuthInitialRole('super_admin');
        setAuthModalOpen(true);
      }

      logActivity({
        eventType: 'ADMIN_LOGIN',
        description: `Operator connected to Corporate Office Console (${hostname})`,
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
    } else if (tabParam) {
      setActiveTab(tabParam);
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

  const handleNavigate = (tab) => {
    if (tab === 'values' || tab === 'stats') {
      setActiveTab('home');
      setTimeout(() => {
        const el = document.getElementById(tab);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
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
        onLogout={() => {
          clearSavedUser();
          setCurrentUser(null);
        }}
      />

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
          <CustomerPortalView
            onTrackShipment={handleSearchTracking}
            onBookNew={() => { setActiveTab('book'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            currentUser={currentUser}
            onOpenAuthModal={() => {
              setAuthInitialRole('customer');
              setAuthModalOpen(true);
            }}
          />
        )}

        {activeTab === 'admin' && (
          <OperationsAdminView
            onOpenEmailViewer={() => { setActiveTab('outbox'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onViewShipment={handleSearchTracking}
            currentUser={currentUser}
            onOpenAuthModal={() => {
              setAuthInitialRole('super_admin');
              setAuthModalOpen(true);
            }}
          />
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
        onClose={() => setAuthModalOpen(false)}
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
