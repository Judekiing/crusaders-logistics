import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Search, 
  Filter, 
  Truck, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Edit3, 
  Mail, 
  User, 
  MapPin, 
  TrendingUp, 
  ChevronRight,
  ShieldAlert,
  Send,
  PlusCircle,
  Activity as ActivityIcon,
  FileText,
  Trash2,
  Printer,
  X,
  Package,
  Globe,
  DollarSign,
  Layers,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  Laptop,
  Smartphone,
  ShieldCheck,
  Building2,
  Users,
  KeyRound,
  UserPlus,
  Copy
} from 'lucide-react';
import { 
  fetchShipments, 
  updateShipmentStatus, 
  fetchDrivers, 
  fetchStats, 
  bookShipment, 
  deleteShipment,
  fetchActivities,
  clearActivities,
  fetchQuotes,
  fetchAuthUsers,
  createAuthUser
} from '../services/api';

export default function OperationsAdminView({ onOpenEmailViewer, onViewShipment, currentUser, onOpenAuthModal }) {
  // Navigation tabs within the Corporate Office Console
  const [activeOfficeTab, setActiveOfficeTab] = useState('parcels'); // 'parcels' | 'activities' | 'quotes' | 'fleet'

  // Data states
  const [shipments, setShipments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // User Management State
  const [showPasswords, setShowPasswords] = useState({});
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [newUserForm, setNewUserForm] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    role: 'customer',
    roleLabel: 'Customer / Shipper User',
    company: '',
    accountNumber: ''
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activityFilter, setActivityFilter] = useState('ALL');

  // Status update modal state
  const [activeShipment, setActiveShipment] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    status: 'IN_TRANSIT',
    statusTitle: '',
    location: '',
    operator: 'Chief Dispatcher Vance',
    driver: '',
    notes: '',
    notifyCustomer: true
  });
  const [updating, setUpdating] = useState(false);

  // Add Parcel Modal state
  const [addParcelOpen, setAddParcelOpen] = useState(false);
  const [addingParcel, setAddingParcel] = useState(false);
  const [parcelForm, setParcelForm] = useState({
    trackingNumber: '',
    senderName: 'Crusaders Logistics Global Hub',
    senderEmail: 'dispatch@crusaderslogistics.com',
    senderPhone: '+1 (800) 555-CRU1',
    originAddress: '300 Kansas Ave NW',
    originCity: 'New Jersey',
    originState: 'NJ',
    originCountry: 'United States',
    originZip: '07030',
    receiverName: '',
    receiverEmail: '',
    receiverPhone: '',
    destAddress: '',
    destCity: '',
    destState: '',
    destCountry: 'United States',
    destZip: '',
    serviceType: 'express_air',
    serviceName: 'Crusaders Logistics International Priority Air',
    packageType: 'box',
    packageDescription: 'Commercial Electronics & Components',
    pieces: 1,
    weightKg: 12.5,
    lengthCm: 45,
    widthCm: 35,
    heightCm: 25,
    declaredValue: 2500,
    currency: 'USD',
    insuranceRequired: true,
    signatureRequired: true,
    assignedDriver: '',
    initialLocation: 'New Jersey Dispatch Center',
    initialStatus: 'ORDER_PLACED',
    operatorNotes: 'e-AWB issued at Corporate Dispatch Desk. Manifest logged.',
    notifyCustomer: true
  });

  // e-AWB Print Modal state
  const [printingShipment, setPrintingShipment] = useState(null);

  // Notification banners
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    loadAllData();
  }, [statusFilter, activityFilter]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [shipmentsRes, driversRes, statsRes, actRes, quotesRes, usersRes] = await Promise.all([
        fetchShipments({ search: searchQuery, status: statusFilter }),
        fetchDrivers(),
        fetchStats(),
        fetchActivities({ eventType: activityFilter, search: searchQuery }),
        fetchQuotes(),
        fetchAuthUsers()
      ]);

      if (shipmentsRes?.success) setShipments(shipmentsRes.data);
      if (driversRes?.success) {
        setDrivers(driversRes.data);
        if (driversRes.data.length > 0 && !parcelForm.assignedDriver) {
          setParcelForm(prev => ({ ...prev, assignedDriver: driversRes.data[0].name }));
        }
      }
      if (statsRes?.success) setStats(statsRes.data);
      if (actRes?.success) setActivities(actRes.data);
      if (quotesRes?.success) setQuotes(quotesRes.data);
      if (usersRes?.success) setUsers(usersRes.data);
    } catch (err) {
      console.error('Error loading Office data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate new random Waybill Code
  const generateNewTracking = () => {
    const destCode = (parcelForm.destCountry || 'US').substring(0, 2).toUpperCase();
    const code = `FLX-${Math.floor(100000 + Math.random() * 900000)}-${destCode}`;
    setParcelForm(prev => ({ ...prev, trackingNumber: code }));
  };

  const handleOpenAddParcel = () => {
    generateNewTracking();
    setAddParcelOpen(true);
  };

  const handleCreateParcelSubmit = async (e) => {
    e.preventDefault();
    if (!parcelForm.receiverName || !parcelForm.destCity) {
      alert('Please fill in Consignee Name and Destination City.');
      return;
    }
    setAddingParcel(true);

    try {
      const payload = {
        trackingNumber: parcelForm.trackingNumber || `FLX-${Math.floor(100000 + Math.random() * 900000)}-US`,
        senderName: parcelForm.senderName,
        senderEmail: parcelForm.senderEmail,
        senderPhone: parcelForm.senderPhone,
        originAddress: parcelForm.originAddress,
        originCity: parcelForm.originCity,
        originState: parcelForm.originState,
        originCountry: parcelForm.originCountry,
        originZip: parcelForm.originZip,
        receiverName: parcelForm.receiverName,
        receiverEmail: parcelForm.receiverEmail,
        receiverPhone: parcelForm.receiverPhone,
        destAddress: parcelForm.destAddress,
        destCity: parcelForm.destCity,
        destState: parcelForm.destState,
        destCountry: parcelForm.destCountry,
        destZip: parcelForm.destZip,
        serviceType: parcelForm.serviceType,
        serviceName: parcelForm.serviceName,
        packageType: parcelForm.packageType,
        packageDescription: parcelForm.packageDescription,
        pieces: parseInt(parcelForm.pieces) || 1,
        weightKg: parseFloat(parcelForm.weightKg) || 10,
        dimensions: {
          length: parseFloat(parcelForm.lengthCm) || 40,
          width: parseFloat(parcelForm.widthCm) || 30,
          height: parseFloat(parcelForm.heightCm) || 20
        },
        declaredValue: parseFloat(parcelForm.declaredValue) || 0,
        currency: parcelForm.currency || 'USD',
        insuranceRequired: parcelForm.insuranceRequired,
        signatureRequired: parcelForm.signatureRequired,
        assignedDriver: parcelForm.assignedDriver,
        vehicleInfo: 'Crusaders Logistics Dedicated Fleet Unit',
        estimatedDelivery: new Date(Date.now() + 86400000 * 3).toISOString()
      };

      const res = await bookShipment(payload);
      if (res && res.success) {
        setActionSuccess(`Consignment #${payload.trackingNumber} successfully added to manifest & confirmation email dispatched!`);
        setAddParcelOpen(false);
        loadAllData();
        setTimeout(() => setActionSuccess(null), 7000);
      }
    } catch (err) {
      console.error('Error adding parcel:', err);
      alert('Failed to register parcel: ' + err.message);
    } finally {
      setAddingParcel(false);
    }
  };

  const handleDeleteShipment = async (trackingNumber) => {
    if (!window.confirm(`Are you sure you want to remove parcel #${trackingNumber} from the active manifest?`)) {
      return;
    }
    try {
      const res = await deleteShipment(trackingNumber);
      if (res && res.success) {
        setActionSuccess(`Parcel #${trackingNumber} removed from active operations.`);
        loadAllData();
        setTimeout(() => setActionSuccess(null), 5000);
      }
    } catch (err) {
      console.error('Error deleting shipment:', err);
    }
  };

  const handleOpenUpdate = (shipment) => {
    setActiveShipment(shipment);
    let nextStatus = 'IN_TRANSIT';
    if (shipment.currentStatus === 'ORDER_PLACED') nextStatus = 'PICKED_UP';
    else if (shipment.currentStatus === 'PICKED_UP') nextStatus = 'IN_TRANSIT';
    else if (shipment.currentStatus === 'IN_TRANSIT') nextStatus = 'OUT_FOR_DELIVERY';
    else if (shipment.currentStatus === 'OUT_FOR_DELIVERY') nextStatus = 'DELIVERED';
    else nextStatus = 'DELIVERED';

    setUpdateForm({
      status: nextStatus,
      statusTitle: `Cargo arrived at regional hub & processed`,
      location: `${shipment.destCity} Terminal`,
      operator: 'Dispatcher Lead Miller (Console #4)',
      driver: shipment.assignedDriver || (drivers[0]?.name || 'Crusaders Logistics Fleet'),
      notes: 'Barcode scanned, integrity verification confirmed.',
      notifyCustomer: true
    });
  };

  const handleCommitUpdate = async (e) => {
    e.preventDefault();
    if (!activeShipment) return;
    setUpdating(true);

    try {
      const res = await updateShipmentStatus(activeShipment.trackingNumber, updateForm);
      if (res && res.success) {
        setActionSuccess(`Status for #${activeShipment.trackingNumber} updated to ${updateForm.status}! Real-time email alert dispatched.`);
        setActiveShipment(null);
        loadAllData();
        setTimeout(() => setActionSuccess(null), 6000);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleClearActivities = async () => {
    if (window.confirm('Clear visitor activity log history?')) {
      await clearActivities();
      loadAllData();
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Executive Subdomain Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-flix-600/20 via-flix-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-flix-500 text-white shadow-sm">
                <Building2 className="w-3.5 h-3.5" />
                <span>office.domain.com</span>
              </span>
              <span className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Dispatch Connected</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-serif">
              Corporate Office &amp; Operations Center
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time monitoring of all visitor activities, consignment manifests, automated email notifications, and active fleet units.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {currentUser && (
              <div className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs">
                <div className="w-6 h-6 rounded-lg overflow-hidden bg-slate-800 border border-slate-600">
                  <img src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} alt={currentUser?.fullName || currentUser?.name || 'Admin'} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-bold text-white text-[11px] leading-tight">{currentUser?.fullName || currentUser?.name || currentUser?.username || 'Admin Operator'}</div>
                  <div className="text-[9px] text-flix-400 font-semibold">{currentUser?.roleLabel || currentUser?.role_title || 'Authorized Admin'}</div>
                </div>
                {onOpenAuthModal && (
                  <button
                    onClick={onOpenAuthModal}
                    className="ml-2 text-[10px] text-slate-400 hover:text-white underline"
                    title="Switch Admin Role / View Passwords"
                  >
                    Switch
                  </button>
                )}
              </div>
            )}

            <button
              onClick={handleOpenAddParcel}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-flix-500 to-amber-500 hover:from-flix-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-flix-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add New Parcel</span>
            </button>

            <button
              onClick={loadAllData}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-flix-400' : ''}`} />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {/* Mobile-Only Horizontal Tab Navigation */}
        <div className="lg:hidden flex items-center space-x-1 mt-6 pt-4 border-t border-slate-800 overflow-x-auto pb-1">
          {[
            { id: 'parcels', label: 'Parcels', icon: Package, count: shipments.length },
            { id: 'users', label: 'Users', icon: Users, count: users.length },
            { id: 'activities', label: 'Activities', icon: ActivityIcon, count: activities.length, badge: 'Live' },
            { id: 'quotes', label: 'Quotes', icon: DollarSign, count: quotes.length },
            { id: 'fleet', label: 'Fleet', icon: Truck, count: drivers.length },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeOfficeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveOfficeTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                  active 
                    ? 'bg-flix-500 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Side Navbar Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Vertical Side Navbar */}
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-3 lg:sticky lg:top-24 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Command Console
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Side Navigation Tabs */}
            <nav className="space-y-1.5">
              {[
                { id: 'parcels', label: 'Parcel Manifest', icon: Package, count: shipments.length, desc: 'Waybills & status updates' },
                { id: 'users', label: 'User Directory', icon: Users, count: users.length, desc: 'Shippers & admin accounts' },
                { id: 'activities', label: 'Live Audit Stream', icon: ActivityIcon, count: activities.length, badge: 'Live', desc: 'Real-time telemetry' },
                { id: 'quotes', label: 'Commercial Quotes', icon: DollarSign, count: quotes.length, desc: 'Enterprise rate desk' },
                { id: 'fleet', label: 'Fleet & Drivers', icon: Truck, count: drivers.length, desc: 'Couriers & vehicles' },
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeOfficeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveOfficeTab(tab.id)}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-gradient-to-r from-flix-600 to-amber-600 text-white shadow-lg shadow-flix-600/30 font-bold border border-amber-400/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <div>
                        <div className="text-xs leading-none">{tab.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">{tab.desc}</div>
                      </div>
                    </div>
                    {tab.count !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Actions in Sidebar */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                onClick={handleOpenAddParcel}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-flix-500 to-amber-500 hover:from-flix-400 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-flix-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add New Parcel</span>
              </button>

              <button
                onClick={loadAllData}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700/80 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-flix-400' : ''}`} />
                <span>Sync All Data</span>
              </button>
            </div>

            {/* Operational shortcuts */}
            <div className="pt-3 border-t border-slate-800 space-y-1 text-xs">
              <button
                onClick={onOpenEmailViewer}
                className="w-full p-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-flix-400" />
                  <span>Outbox Logs</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">System &rarr;</span>
              </button>

              <a
                href="https://standard7.doveserver.com:2096/cpsess5669445925/3rdparty/roundcube/?_task=mail&_mbox=INBOX"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-2.5 rounded-xl hover:bg-slate-800 text-amber-300 hover:text-amber-200 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Roundcube Webmail</span>
                </span>
                <span className="text-[10px] text-amber-400 font-mono">Open &rarr;</span>
              </a>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="lg:col-span-9 xl:col-span-9 space-y-6">

      {/* Action Notification Alert */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-bold text-emerald-900">{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metric Cards Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Parcels</div>
            <div className="text-xl font-black text-slate-900 font-mono mt-1">{shipments.length}</div>
            <div className="text-[10px] text-slate-400">Database manifest</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">In Transit</div>
            <div className="text-xl font-black text-sky-700 font-mono mt-1">
              {shipments.filter(s => s.currentStatus === 'IN_TRANSIT').length}
            </div>
            <div className="text-[10px] text-sky-600">Active air & road</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Out for Delivery</div>
            <div className="text-xl font-black text-amber-700 font-mono mt-1">
              {shipments.filter(s => s.currentStatus === 'OUT_FOR_DELIVERY').length}
            </div>
            <div className="text-[10px] text-amber-600">Courier vans en route</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Delivered &amp; Signed</div>
            <div className="text-xl font-black text-emerald-700 font-mono mt-1">
              {shipments.filter(s => s.currentStatus === 'DELIVERED').length}
            </div>
            <div className="text-[10px] text-emerald-600">POD verified</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">User Activities</div>
            <div className="text-xl font-black text-indigo-700 font-mono mt-1">{activities.length}</div>
            <div className="text-[10px] text-indigo-600">Visitor interactions</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Freight Tonnage</div>
            <div className="text-xl font-black text-purple-700 font-mono mt-1">{stats.totalCargoTons} T</div>
            <div className="text-[10px] text-purple-600">98.6% on-time</div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: PARCELS & CONSIGNMENT MANIFEST */}
      {/* ========================================================================= */}
      {activeOfficeTab === 'parcels' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search waybill # (e.g. TRN12345), consignee, or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadAllData()}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-flix-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500 font-semibold">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-flix-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="ORDER_PLACED">Order Placed</option>
                <option value="PICKED_UP">Picked Up</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
              </select>

              <button
                onClick={handleOpenAddParcel}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-flix-500 hover:bg-flix-600 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer ml-2"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Parcel</span>
              </button>
            </div>
          </div>

          {/* Shipments Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3.5 px-4">Waybill #</th>
                    <th className="py-3.5 px-4">Route &amp; Corridor</th>
                    <th className="py-3.5 px-4">Consignee &amp; Email</th>
                    <th className="py-3.5 px-4">Cargo Specs</th>
                    <th className="py-3.5 px-4">Current Status</th>
                    <th className="py-3.5 px-4">Assigned Unit</th>
                    <th className="py-3.5 px-4 text-right">Office Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipments.map((s) => (
                    <tr key={s.trackingNumber} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onViewShipment(s.trackingNumber)}
                          className="font-mono font-bold text-flix-600 hover:text-flix-800 underline text-xs"
                        >
                          {s.trackingNumber}
                        </button>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {s.bookedAt ? new Date(s.bookedAt).toLocaleDateString() : 'Active'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">
                          {s.originCity} &rarr; {s.destCity}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {s.originCountry} to {s.destCountry}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{s.receiverName}</div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center space-x-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{s.receiverEmail || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-700">
                          {s.weightKg} kg &bull; {s.pieces || 1} pcs
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize">
                          {s.packageType || 'Box'} &bull; {s.serviceType ? s.serviceType.replace('_', ' ') : 'Air'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          s.currentStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                          s.currentStatus === 'OUT_FOR_DELIVERY' ? 'bg-amber-100 text-amber-800' :
                          s.currentStatus === 'IN_TRANSIT' ? 'bg-sky-100 text-sky-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {s.currentStatus?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {s.assignedDriver || 'Pending Hub Unit'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenUpdate(s)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-flix-50 hover:bg-flix-100 text-flix-700 rounded-lg text-xs font-bold border border-flix-200 transition-colors cursor-pointer"
                            title="Update Status & Dispatch Email"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Update</span>
                          </button>

                          <button
                            onClick={() => setPrintingShipment(s)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Print e-Air Waybill (e-AWB)"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteShipment(s.trackingNumber)}
                            className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Parcel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {shipments.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                        No parcels found matching your filter criteria. Click "+ Add New Parcel" to log one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: USER ACTIVITIES & VISITOR AUDIT TRAIL */}
      {/* ========================================================================= */}
      {activeOfficeTab === 'activities' && (
        <div className="space-y-4">
          {/* Header & Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <ActivityIcon className="w-5 h-5 text-indigo-600" />
                <span>Live Visitor &amp; User Activity Stream</span>
              </h2>
              <p className="text-xs text-slate-500">
                Continuous telemetry monitoring of parcel lookups, rate calculations, quote submissions, and admin actions.
              </p>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <select
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-flix-500"
              >
                <option value="ALL">All Event Types</option>
                <option value="TRACK_PARCEL">Parcel Lookups (Track)</option>
                <option value="CALCULATE_RATE">Rate Calculations</option>
                <option value="SUBMIT_QUOTE">Quote Requests</option>
                <option value="CREATE_PARCEL">Parcel Creations</option>
                <option value="UPDATE_STATUS">Status Advances</option>
                <option value="ADMIN_LOGIN">Admin Logins</option>
                <option value="ADMIN_ACTION">Admin Actions</option>
              </select>

              <button
                onClick={handleClearActivities}
                className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
              >
                Clear Log
              </button>
            </div>
          </div>

          {/* Activities List Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3.5 px-4">Event Type</th>
                    <th className="py-3.5 px-4">Activity Description</th>
                    <th className="py-3.5 px-4">Entity Ref</th>
                    <th className="py-3.5 px-4">Client IP Address</th>
                    <th className="py-3.5 px-4">Device / Client</th>
                    <th className="py-3.5 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activities.map((act) => {
                    const badgeStyles = {
                      TRACK_PARCEL: 'bg-sky-100 text-sky-800 border-sky-200',
                      CALCULATE_RATE: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                      SUBMIT_QUOTE: 'bg-amber-100 text-amber-800 border-amber-200',
                      CREATE_PARCEL: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                      BOOK_PARCEL: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                      UPDATE_STATUS: 'bg-flix-100 text-flix-800 border-flix-200',
                      ADMIN_LOGIN: 'bg-purple-100 text-purple-800 border-purple-200',
                      ADMIN_ACTION: 'bg-slate-100 text-slate-800 border-slate-300',
                    }[act.eventType] || 'bg-slate-100 text-slate-700 border-slate-200';

                    return (
                      <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${badgeStyles}`}>
                            {act.eventType?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          {act.description}
                        </td>
                        <td className="py-3.5 px-4">
                          {act.entityId ? (
                            <button
                              onClick={() => {
                                if (act.entityType === 'shipment' || act.entityId.startsWith('TRN') || act.entityId.startsWith('FLX') || act.entityId.startsWith('APX')) {
                                  onViewShipment(act.entityId);
                                }
                              }}
                              className="font-mono text-xs font-bold text-flix-600 hover:underline"
                            >
                              {act.entityId}
                            </button>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                          {act.ipAddress || '127.0.0.1'}
                        </td>
                        <td className="py-3.5 px-4 text-[11px] text-slate-500 max-w-xs truncate" title={act.userAgent}>
                          {act.userAgent ? (
                            act.userAgent.includes('Mobile') ? (
                              <span className="inline-flex items-center space-x-1 text-slate-600"><Smartphone className="w-3 h-3 text-slate-400" /><span>Mobile</span></span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 text-slate-600"><Laptop className="w-3 h-3 text-slate-400" /><span>Desktop Browser</span></span>
                            )
                          ) : 'Standard Web Client'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
                          {act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Now'}
                        </td>
                      </tr>
                    );
                  })}
                  {activities.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                        No activity records found matching this event filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: COMMERCIAL QUOTES DESK */}
      {/* ========================================================================= */}
      {activeOfficeTab === 'quotes' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>Customer Freight Inquiries &amp; Quotations</span>
              </h2>
              <p className="text-xs text-slate-500">
                Rate quotations requested through the interactive shipping calculator.
              </p>
            </div>
            <button
              onClick={loadAllData}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Refresh Quotes
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3.5 px-4">Quote Ref #</th>
                    <th className="py-3.5 px-4">Client Name &amp; Email</th>
                    <th className="py-3.5 px-4">Corridor (Origin &rarr; Dest)</th>
                    <th className="py-3.5 px-4">Cargo &amp; Weight</th>
                    <th className="py-3.5 px-4">Estimated Rate</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quotes.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {q.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{q.clientName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{q.clientEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {q.originCity} &rarr; {q.destCity}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {q.weightKg || 10} kg &bull; {q.cargoType || 'General Freight'}
                      </td>
                      <td className="py-3.5 px-4 font-bold font-mono text-emerald-600 text-sm">
                        ${Number(q.estimatedRate || 0).toLocaleString()} USD
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {q.status || 'APPROVED'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setParcelForm(prev => ({
                              ...prev,
                              receiverName: q.clientName,
                              receiverEmail: q.clientEmail,
                              destCity: q.destCity,
                              originCity: q.originCity,
                              weightKg: q.weightKg || 10,
                              packageDescription: q.cargoType || 'Cargo',
                              declaredValue: q.estimatedRate || 1000
                            }));
                            setAddParcelOpen(true);
                          }}
                          className="px-2.5 py-1 bg-flix-500 hover:bg-flix-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Convert to Parcel
                        </button>
                      </td>
                    </tr>
                  ))}
                  {quotes.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                        No customer quotes logged yet. Quotes requested via the rate calculator appear here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FLEET & DRIVER UNITS */}
      {/* ========================================================================= */}
      {activeOfficeTab === 'fleet' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Truck className="w-5 h-5 text-flix-600" />
                <span>Active Fleet Logistics &amp; Driver Operators</span>
              </h2>
              <p className="text-xs text-slate-500">
                Ground and aviation couriers currently assigned to Crusaders Logistics transit corridors.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {drivers.map((drv) => (
              <div key={drv.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-flix-100 flex items-center justify-center text-flix-700 font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    drv.status === 'Active' || drv.status === 'On Route' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {drv.status}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{drv.name}</h3>
                  <div className="text-xs text-slate-500">{drv.vehicleType || drv.vehicle}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">Plate: {drv.plateNumber || 'FLX-REG-44'}</div>
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                  <span>📍 {drv.currentCity || 'New Jersey HQ'}</span>
                  <span className="font-mono text-flix-600 font-bold">{drv.phone || '+1 (800) 555-FLIX'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* USER MANAGEMENT & ACCESS DIRECTORY TAB */}
      {/* ========================================================================= */}
      {activeOfficeTab === 'users' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-flix-600" />
                <span>Authorized System Users &amp; Role Credentials</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage global command administrators, regional station dispatchers, and enterprise shipper accounts.
              </p>
            </div>
            <button
              onClick={() => setAddUserOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-flix-500 to-amber-600 hover:from-flix-400 hover:to-amber-500 text-white font-bold text-xs shadow-md shadow-flix-500/20 transition-all cursor-pointer self-start md:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Register New User</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Accounts</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{users.length}</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">100% Active &amp; Verified</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Global Super Admins</div>
              <div className="text-2xl font-black text-purple-900 mt-1">
                {users.filter(u => String(u.role || '').toLowerCase().includes('super')).length}
              </div>
              <div className="text-[10px] text-purple-500 font-semibold mt-1">Full Root Governance</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Company Dispatch Admins</div>
              <div className="text-2xl font-black text-amber-900 mt-1">
                {users.filter(u => String(u.role || '').toLowerCase().includes('company')).length}
              </div>
              <div className="text-[10px] text-amber-500 font-semibold mt-1">Station Waybill Control</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-sky-600">Client / Customer Users</div>
              <div className="text-2xl font-black text-sky-900 mt-1">
                {users.filter(u => String(u.role || '').toLowerCase().includes('customer')).length}
              </div>
              <div className="text-[10px] text-sky-500 font-semibold mt-1">Self-Service Shippers</div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-flix-500 bg-slate-50"
              />
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500 font-semibold">Filter Role:</span>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-flix-500 bg-slate-50 font-semibold text-slate-700"
              >
                <option value="ALL">All Roles ({users.length})</option>
                <option value="super_admin">Global Super Admin</option>
                <option value="company_admin">Company Dispatch Admin</option>
                <option value="customer">Customer / Shipper</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">User Identity</th>
                    <th className="px-5 py-3.5">Username &amp; Email</th>
                    <th className="px-5 py-3.5">Assigned Role</th>
                    <th className="px-5 py-3.5">Company / Entity</th>
                    <th className="px-5 py-3.5">Dashboard Password</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Quick Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users
                    .filter(u => {
                      const matchRole = userRoleFilter === 'ALL' || String(u.role || '').toLowerCase().includes(userRoleFilter.toLowerCase());
                      const q = searchQuery.toLowerCase();
                      const matchQ = !q || 
                        (u.fullName || u.name || '').toLowerCase().includes(q) ||
                        (u.username || '').toLowerCase().includes(q) ||
                        (u.email || '').toLowerCase().includes(q) ||
                        (u.company || '').toLowerCase().includes(q);
                      return matchRole && matchQ;
                    })
                    .map((usr) => {
                      const displayName = usr.fullName || usr.name || usr.username;
                      const roleStr = String(usr.role || '').toLowerCase();
                      const isSuper = roleStr.includes('super');
                      const isCompany = roleStr.includes('company');
                      const isShowingPass = !!showPasswords[usr.id];

                      return (
                        <tr key={usr.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Identity */}
                          <td className="px-5 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-800 border border-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-white text-xs">
                                {usr.avatar ? (
                                  <img src={usr.avatar} alt={displayName} className="w-full h-full object-cover" />
                                ) : (
                                  displayName[0]
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{displayName}</div>
                                <div className="text-[10px] text-slate-400 font-mono">ID: #{usr.id}</div>
                              </div>
                            </div>
                          </td>

                          {/* Username & Email */}
                          <td className="px-5 py-4">
                            <div className="font-mono font-bold text-slate-800">{usr.username}</div>
                            <div className="text-slate-500 text-[11px] flex items-center space-x-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{usr.email}</span>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              isSuper ? 'bg-purple-100 text-purple-800 border-purple-200' :
                              isCompany ? 'bg-amber-100 text-amber-800 border-amber-200' :
                              'bg-sky-100 text-sky-800 border-sky-200'
                            }`}>
                              <ShieldCheck className="w-3 h-3" />
                              <span>{usr.roleLabel || (isSuper ? 'Super Admin' : isCompany ? 'Company Admin' : 'Customer')}</span>
                            </span>
                          </td>

                          {/* Company */}
                          <td className="px-5 py-4">
                            <div className="font-semibold text-slate-800">{usr.company || 'Crusaders Logistics Network'}</div>
                            {usr.accountNumber && (
                              <div className="text-[10px] text-slate-400 font-mono">Acct: {usr.accountNumber}</div>
                            )}
                          </td>

                          {/* Password */}
                          <td className="px-5 py-4">
                            <div className="inline-flex items-center space-x-2 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                              <KeyRound className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="font-mono text-xs font-bold text-slate-800 select-all">
                                {isShowingPass ? (usr.password || '••••••••') : '••••••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, [usr.id]: !prev[usr.id] }))}
                                className="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer"
                                title={isShowingPass ? "Hide password" : "Show password"}
                              >
                                {isShowingPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              {usr.password && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(usr.password);
                                    setActionSuccess(`Copied password for ${usr.username}!`);
                                    setTimeout(() => setActionSuccess(null), 3000);
                                  }}
                                  className="text-slate-400 hover:text-flix-600 ml-1 cursor-pointer"
                                  title="Copy password"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Active</span>
                            </span>
                          </td>

                          {/* Quick Switch */}
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => {
                                if (onOpenAuthModal) {
                                  onOpenAuthModal(usr.role);
                                }
                              }}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] shadow-sm transition-all cursor-pointer"
                            >
                              <span>Switch</span>
                              <ArrowRight className="w-3 h-3 text-flix-400" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REGISTER NEW USER */}
      {/* ========================================================================= */}
      {addUserOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800 text-white">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-flix-500" />
                <h3 className="font-bold text-base">Register System Account</h3>
              </div>
              <button onClick={() => setAddUserOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCreatingUser(true);
                try {
                  const roleLabelMap = {
                    super_admin: 'Global Super Admin',
                    company_admin: 'Company Dispatch Admin',
                    customer: 'Customer / Shipper User'
                  };
                  const payload = {
                    ...newUserForm,
                    roleLabel: roleLabelMap[newUserForm.role] || 'Authorized User'
                  };
                  const res = await createAuthUser(payload);
                  if (res?.success) {
                    setUsers(prev => [...prev, res.data]);
                    setActionSuccess(`User ${newUserForm.username} created successfully!`);
                    setAddUserOpen(false);
                    setNewUserForm({
                      username: '',
                      fullName: '',
                      email: '',
                      password: '',
                      role: 'customer',
                      roleLabel: 'Customer / Shipper User',
                      company: '',
                      accountNumber: ''
                    });
                  }
                } catch (err) {
                  console.error(err);
                } finally {
                  setCreatingUser(false);
                }
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Captain David Sterling"
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-flix-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. dsterling"
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-flix-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="operator@crusaderslogistics.com"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-flix-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Access Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-flix-500 bg-white"
                  >
                    <option value="super_admin">Global Super Admin</option>
                    <option value="company_admin">Company Dispatch Admin</option>
                    <option value="customer">Customer / Shipper User</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="text"
                    required
                    placeholder="StrongPassword@2026!"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-flix-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Department</label>
                <input
                  type="text"
                  placeholder="e.g. Crusaders Maritime Division or Apex Imports Ltd"
                  value={newUserForm.company}
                  onChange={(e) => setNewUserForm({ ...newUserForm, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-flix-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="px-5 py-2.5 rounded-xl bg-flix-600 hover:bg-flix-500 text-white font-bold shadow-md shadow-flix-600/30 flex items-center space-x-2 cursor-pointer"
                >
                  {creatingUser ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  <span>Save Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD PARCEL / CONSIGNMENT */}
      {/* ========================================================================= */}
      {addParcelOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800 text-white">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-flix-500" />
                <h3 className="font-bold text-base">Add New Consignment / Parcel</h3>
              </div>
              <button onClick={() => setAddParcelOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateParcelSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
              {/* Waybill Generator */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500">Waybill # (e-AWB)</label>
                  <input
                    type="text"
                    value={parcelForm.trackingNumber}
                    onChange={(e) => setParcelForm({ ...parcelForm, trackingNumber: e.target.value })}
                    className="font-mono font-bold text-sm text-flix-600 bg-transparent border-none p-0 focus:outline-none"
                    placeholder="e.g. FLX-882310-US or TRN12345"
                  />
                </div>
                <button
                  type="button"
                  onClick={generateNewTracking}
                  className="px-3 py-1 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-100 shadow-xs cursor-pointer"
                >
                  Regenerate
                </button>
              </div>

              {/* Sender Details */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider text-flix-600">
                  1. Shipper / Origin Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Sender Name / Facility *</label>
                    <input
                      type="text"
                      required
                      value={parcelForm.senderName}
                      onChange={(e) => setParcelForm({ ...parcelForm, senderName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Sender Email</label>
                    <input
                      type="email"
                      value={parcelForm.senderEmail}
                      onChange={(e) => setParcelForm({ ...parcelForm, senderEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Origin City *</label>
                    <input
                      type="text"
                      required
                      value={parcelForm.originCity}
                      onChange={(e) => setParcelForm({ ...parcelForm, originCity: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Origin Country</label>
                    <input
                      type="text"
                      value={parcelForm.originCountry}
                      onChange={(e) => setParcelForm({ ...parcelForm, originCountry: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Consignee Details */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider text-flix-600">
                  2. Consignee / Destination Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Consignee Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jonathan Curr / Nexus Tech"
                      value={parcelForm.receiverName}
                      onChange={(e) => setParcelForm({ ...parcelForm, receiverName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Consignee Email (for Real-time Alerts)</label>
                    <input
                      type="email"
                      placeholder="client@company.com"
                      value={parcelForm.receiverEmail}
                      onChange={(e) => setParcelForm({ ...parcelForm, receiverEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Destination City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. London / Seattle / Frankfurt"
                      value={parcelForm.destCity}
                      onChange={(e) => setParcelForm({ ...parcelForm, destCity: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Destination Country</label>
                    <input
                      type="text"
                      value={parcelForm.destCountry}
                      onChange={(e) => setParcelForm({ ...parcelForm, destCountry: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Cargo Specs & Service */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider text-flix-600">
                  3. Cargo Manifest &amp; Service Tier
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Service Tier</label>
                    <select
                      value={parcelForm.serviceType}
                      onChange={(e) => setParcelForm({ ...parcelForm, serviceType: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                    >
                      <option value="express_air">Priority Air Express</option>
                      <option value="standard_ground">Intermodal Ground</option>
                      <option value="ocean_cargo">Ocean Maritime FCL</option>
                      <option value="cold_chain">Cold-Chain BioPharma</option>
                      <option value="last_mile">Urban Last-Mile</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Package Type</label>
                    <select
                      value={parcelForm.packageType}
                      onChange={(e) => setParcelForm({ ...parcelForm, packageType: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                    >
                      <option value="box">Cardboard Box</option>
                      <option value="pallet">Industrial Pallet</option>
                      <option value="crate">Wooden Crate</option>
                      <option value="cold_container">Reefer Container</option>
                      <option value="envelope">Document Pouch</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Weight (KG)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={parcelForm.weightKg}
                      onChange={(e) => setParcelForm({ ...parcelForm, weightKg: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Declared Value ($)</label>
                    <input
                      type="number"
                      value={parcelForm.declaredValue}
                      onChange={(e) => setParcelForm({ ...parcelForm, declaredValue: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Cargo Description</label>
                  <input
                    type="text"
                    value={parcelForm.packageDescription}
                    onChange={(e) => setParcelForm({ ...parcelForm, packageDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    placeholder="e.g. Precision Automation Spares, Server Hardware, etc."
                  />
                </div>
              </div>

              {/* Driver & Initial Status */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider text-flix-600">
                  4. Fleet Assignment &amp; Automated Dispatch
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Assign Driver / Unit</label>
                    <select
                      value={parcelForm.assignedDriver}
                      onChange={(e) => setParcelForm({ ...parcelForm, assignedDriver: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                    >
                      {drivers.map(d => (
                        <option key={d.id} value={d.name}>{d.name} ({d.vehicleType || 'Fleet'})</option>
                      ))}
                      <option value="Flight Lead Harrison (FLX-880)">Flight Lead Harrison (FLX-880)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Initial Checkpoint Location</label>
                    <input
                      type="text"
                      value={parcelForm.initialLocation}
                      onChange={(e) => setParcelForm({ ...parcelForm, initialLocation: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="notifyCheck"
                    checked={parcelForm.notifyCustomer}
                    onChange={(e) => setParcelForm({ ...parcelForm, notifyCustomer: e.target.checked })}
                    className="rounded border-amber-300 text-flix-600 focus:ring-flix-500"
                  />
                  <label htmlFor="notifyCheck" className="text-amber-900 font-bold text-xs cursor-pointer">
                    Dispatch automated booking confirmation &amp; e-AWB HTML email immediately
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAddParcelOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingParcel}
                  className="px-6 py-2 bg-flix-500 hover:bg-flix-600 text-white rounded-xl font-bold shadow-md cursor-pointer flex items-center space-x-2"
                >
                  {addingParcel ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Registering &amp; Notifying...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Issue e-AWB &amp; Add Parcel</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: UPDATE STATUS & ADVANCE MILESTONE */}
      {/* ========================================================================= */}
      {activeShipment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-in">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800 text-white">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-flix-500" />
                <h3 className="font-bold text-sm">Advance Checkpoint: #{activeShipment.trackingNumber}</h3>
              </div>
              <button onClick={() => setActiveShipment(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCommitUpdate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Operational Milestone Status</label>
                <select
                  value={updateForm.status}
                  onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-xs"
                >
                  <option value="PICKED_UP">PICKED UP - Feeder Fleet Collected</option>
                  <option value="IN_TRANSIT">IN TRANSIT - Linehaul / Flight Sector</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY - Courier Van En Route</option>
                  <option value="DELIVERED">DELIVERED - Consignee Signed</option>
                  <option value="EXCEPTION">EXCEPTION - Customs Clearance Delay</option>
                  <option value="ON_HOLD">ON HOLD - Pending Consignee Instruction</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Milestone Headline Title</label>
                <input
                  type="text"
                  required
                  value={updateForm.statusTitle}
                  onChange={(e) => setUpdateForm({ ...updateForm, statusTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Current Facility / Location</label>
                  <input
                    type="text"
                    required
                    value={updateForm.location}
                    onChange={(e) => setUpdateForm({ ...updateForm, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assigned Driver</label>
                  <input
                    type="text"
                    value={updateForm.driver}
                    onChange={(e) => setUpdateForm({ ...updateForm, driver: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Dispatcher Operational Notes</label>
                <textarea
                  rows="2"
                  value={updateForm.notes}
                  onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="bg-flix-50 p-3 rounded-xl border border-flix-200 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="notifToggle"
                  checked={updateForm.notifyCustomer}
                  onChange={(e) => setUpdateForm({ ...updateForm, notifyCustomer: e.target.checked })}
                  className="rounded border-flix-300 text-flix-600"
                />
                <label htmlFor="notifToggle" className="text-flix-950 font-bold text-xs cursor-pointer">
                  Send HTML Milestone Checkpoint Email to: {activeShipment.receiverEmail || activeShipment.senderEmail}
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveShipment(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-flix-500 hover:bg-flix-600 text-white rounded-xl font-bold shadow-md"
                >
                  {updating ? 'Updating & Sending Email...' : 'Commit Checkpoint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: PRINTABLE e-AIR WAYBILL (e-AWB) */}
      {/* ========================================================================= */}
      {printingShipment && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-8 my-8 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <span className="font-serif font-black text-xl text-flix-600">CRUSADERS LOGISTICS</span>
                <span className="text-xs bg-slate-900 text-white px-2 py-0.5 rounded font-mono font-bold">e-AWB # {printingShipment.trackingNumber}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg flex items-center space-x-1.5 cursor-pointer hover:bg-slate-800"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button onClick={() => setPrintingShipment(null)} className="text-slate-400 hover:text-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* AWB Content */}
            <div className="mt-6 space-y-6 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4 border p-4 rounded-xl border-slate-200 bg-slate-50/50">
                <div>
                  <div className="font-bold uppercase text-[10px] text-slate-400">Shipper / Origin</div>
                  <div className="font-bold text-sm mt-1">{printingShipment.senderName}</div>
                  <div>{printingShipment.originAddress || 'Central Depot'}</div>
                  <div>{printingShipment.originCity}, {printingShipment.originCountry}</div>
                  <div className="font-mono text-slate-500">{printingShipment.senderPhone || '+1 (800) 555-CRU1'}</div>
                </div>
                <div>
                  <div className="font-bold uppercase text-[10px] text-slate-400">Consignee / Destination</div>
                  <div className="font-bold text-sm mt-1">{printingShipment.receiverName}</div>
                  <div>{printingShipment.destAddress || 'Direct Consignee Delivery'}</div>
                  <div>{printingShipment.destCity}, {printingShipment.destCountry}</div>
                  <div className="font-mono text-slate-500">{printingShipment.receiverEmail}</div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="font-bold uppercase text-[10px] text-slate-400">Consignment Specifications</div>
                <div className="grid grid-cols-4 gap-2 text-center py-2 bg-slate-50 rounded-lg font-mono">
                  <div>
                    <div className="text-[10px] text-slate-400">PIECES</div>
                    <div className="font-bold text-slate-900">{printingShipment.pieces || 1}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">WEIGHT</div>
                    <div className="font-bold text-slate-900">{printingShipment.weightKg} KG</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">SERVICE</div>
                    <div className="font-bold text-slate-900 uppercase text-[11px]">{printingShipment.serviceType || 'Air'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">DECLARED</div>
                    <div className="font-bold text-slate-900">${printingShipment.declaredValue || 0}</div>
                  </div>
                </div>
                <div className="text-slate-600 mt-2">
                  <strong>Manifest Description:</strong> {printingShipment.packageDescription || 'Industrial Cargo'}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-dashed border-slate-300">
                <div className="font-mono text-center">
                  <div className="h-10 w-44 bg-slate-900 rounded flex items-center justify-center text-white text-[9px] tracking-widest font-mono">
                    ||| | |||| | ||| |||| |
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{printingShipment.trackingNumber}</div>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <div>Crusaders Logistics Operations Desk</div>
                  <div>Authorized Carrier Signature &bull; {new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
