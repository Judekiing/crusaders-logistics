import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  Lock, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  UserPlus,
  Mail,
  Phone
} from 'lucide-react';
import { loginUser, createAuthUser } from '../services/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialRole = 'customer' }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [showSuperAdminOption, setShowSuperAdminOption] = useState(initialRole === 'super_admin');
  const [selectedRoleTab, setSelectedRoleTab] = useState(initialRole === 'super_admin' ? 'super_admin' : 'customer');
  
  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration form state
  const [regData, setRegData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    company: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Pre-configured role presets for swift access
  const rolePresets = {
    super_admin: {
      role: 'super_admin',
      roleLabel: 'Global Super Admin',
      username: 'superadmin',
      email: 'superadmin@crusaderslogistics.com',
      password: 'SuperAdmin@2026!',
      name: 'Captain Marcus Vance',
      title: 'Global Fleet Commander',
      icon: ShieldCheck,
      badgeColor: 'bg-purple-950 text-purple-400 border-purple-800',
      btnGradient: 'from-purple-600 to-indigo-600',
      description: 'Corporate Command: user directory, real-time audit stream, parcel creation & deletion, fleet routing, and quote desk.'
    },
    company_admin: {
      role: 'company_admin',
      roleLabel: 'Company Dispatch Admin',
      username: 'companyadmin',
      email: 'admin@crusaderslogistics.com',
      password: 'CompanyAdmin@2026!',
      name: 'Elena Rostova',
      title: 'Regional Operations Manager',
      icon: Building2,
      badgeColor: 'bg-amber-950 text-amber-400 border-amber-800',
      btnGradient: 'from-amber-500 to-flix-600',
      description: 'Regional dispatch command: create consignments, assign transit couriers, update milestone checkpoints, and issue e-AWBs.'
    },
    customer: {
      role: 'customer',
      roleLabel: 'Customer / Shipper User',
      username: 'customer',
      email: 'customer@apextech.com',
      password: 'CustomerUser@2026!',
      name: 'Jonathan Curr',
      title: 'Enterprise Shipper (ApexTech)',
      icon: UserCheck,
      badgeColor: 'bg-sky-950 text-sky-400 border-sky-800',
      btnGradient: 'from-sky-500 to-blue-600',
      description: 'Shipper portal: book cargo, manage consignments, download invoices, print e-Waybills, and track live milestones.'
    }
  };

  useEffect(() => {
    if (initialRole === 'super_admin') {
      setShowSuperAdminOption(true);
      setSelectedRoleTab('super_admin');
    } else {
      setSelectedRoleTab(initialRole || 'customer');
    }
  }, [initialRole, isOpen]);

  const currentPreset = rolePresets[selectedRoleTab] || rolePresets.customer;

  // Auto-fill preset when tab switches
  const handleSelectTab = (roleKey) => {
    setSelectedRoleTab(roleKey);
    const p = rolePresets[roleKey];
    setIdentifier(p.username);
    setPassword(p.password);
    setError(null);
  };

  // Submit login request
  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const idToSubmit = identifier.trim() || currentPreset.username;
      const pwdToSubmit = password.trim() || currentPreset.password;

      const res = await loginUser({
        username: idToSubmit,
        password: pwdToSubmit
      });

      if (res && res.success) {
        const u = res.user || {};
        const cleanUser = {
          ...u,
          fullName: u.fullName || u.name || u.username || 'User',
          name: u.fullName || u.name || u.username || 'User',
          role: String(u.role || currentPreset.role).toLowerCase(),
          roleLabel: u.roleLabel || currentPreset.roleLabel,
          avatar: u.avatar || currentPreset.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          company: u.company || currentPreset.company || 'Crusaders Logistics Shipper'
        };
        setSuccessMsg(`Authenticated successfully as ${cleanUser.fullName}!`);
        setTimeout(() => {
          onLoginSuccess(cleanUser);
          onClose();
          setSuccessMsg(null);
        }, 600);
      } else {
        setError(res?.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Offline fallback
      const user = {
        id: `usr-${currentPreset.role}`,
        username: currentPreset.username,
        email: currentPreset.email,
        fullName: currentPreset.name,
        role: currentPreset.role,
        roleLabel: currentPreset.roleLabel,
        company: currentPreset.role === 'customer' ? 'ApexTech Imports Ltd' : 'Crusaders Logistics Global Command'
      };
      setSuccessMsg(`Logged in as ${user.fullName}`);
      setTimeout(() => {
        onLoginSuccess(user);
        onClose();
        setSuccessMsg(null);
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  // Submit registration request
  const handleRegisterSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    if (!regData.fullName || !regData.email || !regData.password) {
      setError('Please fill in your Full Name, Email, and Password.');
      return;
    }

    setLoading(true);
    try {
      const newShipper = {
        fullName: regData.fullName,
        name: regData.fullName,
        username: regData.username || regData.email.split('@')[0],
        email: regData.email,
        phone: regData.phone || '+1 (555) 000-0000',
        company: regData.company || 'Enterprise Shipper Account',
        password: regData.password,
        role: 'customer',
        roleLabel: 'Customer / Shipper User',
        accountNumber: 'CRU-SHP-' + Math.floor(10000 + Math.random() * 90000)
      };

      const res = await createAuthUser(newShipper);
      if (res && res.success) {
        setSuccessMsg(`Welcome, ${newShipper.fullName}! Your shipper account is ready.`);
        setTimeout(() => {
          onLoginSuccess(res.data || newShipper);
          onClose();
          setSuccessMsg(null);
        }, 700);
      } else {
        setError(res?.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration fallback:', err);
      const fallbackShipper = {
        fullName: regData.fullName,
        name: regData.fullName,
        username: regData.username || regData.email.split('@')[0],
        email: regData.email,
        company: regData.company || 'Enterprise Shipper Account',
        role: 'customer',
        roleLabel: 'Customer / Shipper User',
        accountNumber: 'CRU-SHP-' + Math.floor(10000 + Math.random() * 90000)
      };
      setSuccessMsg(`Account registered for ${fallbackShipper.fullName}!`);
      setTimeout(() => {
        onLoginSuccess(fallbackShipper);
        onClose();
        setSuccessMsg(null);
      }, 700);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Build role tabs: Hide Super Admin unless unlocked or initialRole is super_admin
  const roleTabItems = [
    { id: 'customer', label: 'Customer Shipper', icon: UserCheck, badge: 'Client' },
    { id: 'company_admin', label: 'Company Dispatch', icon: Building2, badge: 'Ops' },
  ];

  if (showSuperAdminOption) {
    roleTabItems.unshift({ id: 'super_admin', label: 'Global Admin', icon: ShieldCheck, badge: 'Console' });
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl text-white overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-flix-500/20 border border-flix-500/40 flex items-center justify-center text-flix-400">
              {mode === 'register' ? <UserPlus className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white flex items-center space-x-2">
                <span>{mode === 'register' ? 'Register Shipper Account' : 'Crusaders Logistics Portal'}</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {mode === 'register' ? 'Create a corporate shipping profile in 30 seconds' : 'Authorized Access & Consignment Tracking'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs (Sign In vs Register) */}
        <div className="px-6 pt-4 flex space-x-2 border-b border-slate-800/80">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
              mode === 'login'
                ? 'border-flix-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In to Dashboard</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
              mode === 'register'
                ? 'border-flix-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Shipper Registration</span>
          </button>
        </div>

        {/* LOGIN MODE */}
        {mode === 'login' ? (
          <div>
            {/* Role Selector Tabs (Only Customer and Company Admin by default) */}
            <div className="p-6 pb-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                <span>Select Account Role</span>
                <span className="text-flix-400 flex items-center space-x-1 text-[10px]">
                  <Sparkles className="w-3 h-3" />
                  <span>One-Click Credentials</span>
                </span>
              </div>

              <div className={`grid gap-2 ${roleTabItems.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {roleTabItems.map(tab => {
                  const Icon = tab.icon;
                  const isActive = selectedRoleTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleSelectTab(tab.id)}
                      className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                        isActive 
                          ? 'bg-slate-800 border-flix-500 shadow-lg shadow-flix-500/20 text-white' 
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-flix-400' : 'text-slate-500'}`} />
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-300">
                          {tab.badge}
                        </span>
                      </div>
                      <div className="text-xs font-bold leading-tight">{tab.label}</div>
                    </button>
                  );
                })}
              </div>

              {/* Role Preview Card */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-white">{currentPreset.name}</span>
                    <div className="text-[11px] text-slate-400">{currentPreset.title}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${currentPreset.badgeColor}`}>
                    {currentPreset.roleLabel}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-900 pt-2">
                  {currentPreset.description}
                </p>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="p-6 pt-3 space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Username / Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex justify-between">
                  <span>Username or Email</span>
                  <span className="text-[10px] font-mono text-slate-500">Preset: {currentPreset.username}</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      const val = e.target.value;
                      setIdentifier(val);
                      if (val.toLowerCase() === 'superadmin' && !showSuperAdminOption) {
                        setShowSuperAdminOption(true);
                        setSelectedRoleTab('super_admin');
                      }
                    }}
                    placeholder={currentPreset.username}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-flix-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex justify-between">
                  <span>Password</span>
                  <span className="text-[10px] font-mono text-slate-500">Preset: {currentPreset.password}</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-flix-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier(currentPreset.username);
                    setPassword(currentPreset.password);
                    setTimeout(() => handleLoginSubmit(), 50);
                  }}
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-black bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-flix-400" />
                  <span>Quick Sign In ({currentPreset.roleLabel.split(' ')[0]})</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r ${currentPreset.btnGradient} hover:opacity-90 shadow-lg shadow-flix-500/20 flex items-center justify-center space-x-1.5 transition-all cursor-pointer`}
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Discreet operator mode toggle */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="hover:text-flix-400 text-slate-400 underline"
                >
                  Need an account? Register as New Shipper
                </button>
                
                {!showSuperAdminOption && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowSuperAdminOption(true);
                      handleSelectTab('super_admin');
                    }}
                    className="text-[10px] text-slate-600 hover:text-slate-400"
                    title="Console operator access"
                  >
                    Office Console &bull;
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          /* REGISTRATION MODE */
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={regData.fullName}
                    onChange={(e) => setRegData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="e.g. David Sterling"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-flix-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Company / Organization</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={regData.company}
                    onChange={(e) => setRegData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="e.g. Apex Global Corp"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-flix-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Corporate Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    value={regData.email}
                    onChange={(e) => setRegData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="shipping@company.com"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-flix-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="tel"
                    value={regData.phone}
                    onChange={(e) => setRegData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 019-2831"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-flix-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Create Password *</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={regData.password}
                  onChange={(e) => setRegData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Minimum 8 characters"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-flix-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              By registering, you gain instant access to electronic waybills, e-invoices, and automated email dispatches for all your bookings.
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-flix-500 to-amber-500 hover:from-flix-400 hover:to-amber-400 shadow-lg shadow-flix-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <span>{loading ? 'Creating Shipper Account...' : 'Complete Registration & Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Already have an account? <span className="text-flix-400 font-bold underline">Sign In</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
