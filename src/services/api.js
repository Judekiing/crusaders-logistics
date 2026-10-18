const API_BASE = '/api';

export async function fetchShipments(filters = {}) {
  const query = new URLSearchParams();
  if (filters.search) query.append('search', filters.search);
  if (filters.status && filters.status !== 'ALL') query.append('status', filters.status);
  
  const res = await fetch(`${API_BASE}/shipments?${query.toString()}`);
  return res.json();
}

export async function fetchShipment(trackingNumber) {
  if (!trackingNumber) return null;
  const res = await fetch(`${API_BASE}/shipments/${encodeURIComponent(trackingNumber.trim())}`);
  return res.json();
}

export async function bookShipment(shipmentData) {
  const res = await fetch(`${API_BASE}/shipments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(shipmentData),
  });
  return res.json();
}

export async function updateShipmentStatus(trackingNumber, payload) {
  const res = await fetch(`${API_BASE}/shipments/${encodeURIComponent(trackingNumber)}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function calculateRates(rateParams) {
  const res = await fetch(`${API_BASE}/rates/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rateParams),
  });
  return res.json();
}

export async function submitQuote(quoteData) {
  const res = await fetch(`${API_BASE}/quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quoteData),
  });
  return res.json();
}

export async function fetchQuotes() {
  const res = await fetch(`${API_BASE}/quotes`);
  return res.json();
}

export async function fetchNotifications() {
  const res = await fetch(`${API_BASE}/notifications`);
  return res.json();
}

export async function sendTestEmail(payload) {
  const res = await fetch(`${API_BASE}/notifications/test-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function fetchDrivers() {
  const res = await fetch(`${API_BASE}/drivers`);
  return res.json();
}

export async function fetchBranches() {
  const res = await fetch(`${API_BASE}/branches`);
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  return res.json();
}

export async function deleteShipment(trackingNumber) {
  const res = await fetch(`${API_BASE}/shipments/${encodeURIComponent(trackingNumber)}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function fetchActivities(filters = {}) {
  const query = new URLSearchParams();
  if (filters.eventType && filters.eventType !== 'ALL') query.append('eventType', filters.eventType);
  if (filters.search) query.append('search', filters.search);

  const res = await fetch(`${API_BASE}/activities?${query.toString()}`);
  return res.json();
}

export async function logActivity(activityData) {
  try {
    const res = await fetch(`${API_BASE}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activityData),
    });
    return res.json();
  } catch (err) {
    console.error('Failed to log activity:', err);
    return null;
  }
}

export async function clearActivities() {
  const res = await fetch(`${API_BASE}/activities/clear`, {
    method: 'POST',
  });
  return res.json();
}

// ---------------- USER AUTHENTICATION & SESSIONS ----------------
const AUTH_KEY = 'crusaders_auth_user';

export function getSavedUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (u && typeof u === 'object') {
      u.fullName = u.fullName || u.name || u.username || 'User';
      u.name = u.fullName;
      u.role = (u.role || '').toLowerCase();
      u.avatar = u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
      return u;
    }
    return null;
  } catch {
    return null;
  }
}

export function setSavedUser(user) {
  try {
    if (user && typeof user === 'object') {
      user.fullName = user.fullName || user.name || user.username || 'User';
      user.name = user.fullName;
      user.role = (user.role || '').toLowerCase();
      user.avatar = user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save auth state:', e);
  }
}


export function clearSavedUser() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (e) {
    console.error('Failed to clear auth state:', e);
  }
}

export async function fetchAuthUsers() {
  const res = await fetch(`${API_BASE}/auth/users`);
  return res.json();
}

export async function createAuthUser(userData) {
  const res = await fetch(`${API_BASE}/auth/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res.json();
}

export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (data?.success && data?.user) {
    setSavedUser(data.user);
  }
  return data;
}

export async function logoutUser() {
  clearSavedUser();
  try {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
  } catch {}
  return { success: true };
}
