import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { 
  sendEmail, 
  generateBookingConfirmationHtml, 
  generateStatusUpdateHtml, 
  generateQuoteConfirmationHtml 
} from './emailService.js';
import { calculateFreightRates } from './rateEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ---------------- HEALTH CHECK ----------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Crusaders Logistics Dispatch & Tracking Engine',
    timestamp: new Date().toISOString(),
    stats: db.getStats()
  });
});

// ---------------- SHIPMENTS API ----------------
// List all shipments
app.get('/api/shipments', (req, res) => {
  const { search, status } = req.query;
  let shipments = db.getAllShipments();

  if (status && status !== 'ALL') {
    shipments = shipments.filter(s => s.currentStatus === status);
  }

  if (search) {
    const q = search.toLowerCase();
    shipments = shipments.filter(s => 
      s.trackingNumber.toLowerCase().includes(q) ||
      (s.senderName && s.senderName.toLowerCase().includes(q)) ||
      (s.receiverName && s.receiverName.toLowerCase().includes(q)) ||
      (s.destCity && s.destCity.toLowerCase().includes(q)) ||
      (s.originCity && s.originCity.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: shipments.length, data: shipments });
});

// Get single shipment by tracking number
app.get('/api/shipments/:trackingNumber', (req, res) => {
  const shipment = db.getShipment(req.params.trackingNumber);
  if (!shipment) {
    return res.status(404).json({ success: false, message: 'Shipment not found. Please verify tracking number.' });
  }
  res.json({ success: true, data: shipment });
});

// Book new shipment & trigger automatic confirmation email
app.post('/api/shipments', async (req, res) => {
  try {
    const body = req.body;
    if (!body.senderName || !body.receiverName || !body.originCity || !body.destCity) {
      return res.status(400).json({ success: false, message: 'Missing required shipment booking details.' });
    }

    // Default estimated delivery (3 days from now if not specified)
    const estimatedDelivery = body.estimatedDelivery || new Date(Date.now() + 86400000 * 3).toISOString();

    const newShipment = db.createShipment({
      ...body,
      estimatedDelivery,
    });

    // Automatically trigger Booking Confirmation Email
    const targetEmail = body.receiverEmail || body.senderEmail;
    if (targetEmail) {
      const emailHtml = generateBookingConfirmationHtml(newShipment);
      sendEmail({
        to: targetEmail,
        recipientName: body.receiverName || body.senderName,
        subject: `Crusaders Logistics Dispatch Confirmed: Waybill ${newShipment.trackingNumber}`,
        html: emailHtml,
        shipmentId: newShipment.trackingNumber,
        type: 'BOOKING_CONFIRMATION',
        previewText: `Waybill ${newShipment.trackingNumber} issued. Scheduled pickup from ${newShipment.originCity} to ${newShipment.destCity}.`
      }).catch(err => console.error('Email dispatch error:', err));
    }

    res.status(201).json({
      success: true,
      message: 'Shipment booked successfully and confirmation email dispatched.',
      data: newShipment
    });
  } catch (err) {
    console.error('Create shipment error:', err);
    res.status(500).json({ success: false, message: 'Internal server error booking shipment.' });
  }
});

// Update shipment status / add checkpoint & notify customer
app.post('/api/shipments/:trackingNumber/status', async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const { status, statusTitle, location, operator, notes, driver, eta, notifyCustomer } = req.body;

    const result = db.updateShipmentStatus(trackingNumber, {
      status,
      statusTitle,
      location,
      operator,
      notes,
      driver,
      eta
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Shipment not found.' });
    }

    const { shipment, checkpoint } = result;

    // Send email notification if enabled (default true)
    if (notifyCustomer !== false && (shipment.receiverEmail || shipment.senderEmail)) {
      const emailHtml = generateStatusUpdateHtml(shipment, checkpoint);
      const recipient = shipment.receiverEmail || shipment.senderEmail;
      
      sendEmail({
        to: recipient,
        recipientName: shipment.receiverName || shipment.senderName,
        subject: `Crusaders Logistics Milestone: [${shipment.trackingNumber}] ${status.replace('_', ' ')}`,
        html: emailHtml,
        shipmentId: shipment.trackingNumber,
        type: status === 'DELIVERED' ? 'DELIVERY_CONFIRMATION' : 'STATUS_UPDATE',
        previewText: `Checkpoint update: ${checkpoint.statusTitle || status} at ${checkpoint.location}.`
      }).catch(err => console.error('Status email dispatch error:', err));
    }

    res.json({
      success: true,
      message: `Shipment ${trackingNumber} status updated to ${status}. Notification dispatched.`,
      data: shipment,
      checkpoint
    });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ success: false, message: 'Error updating shipment status.' });
  }
});

// ---------------- RATE CALCULATOR ----------------
app.post('/api/rates/calculate', (req, res) => {
  try {
    const rates = calculateFreightRates(req.body);
    res.json({ success: true, data: rates });
  } catch (err) {
    console.error('Rate calculation error:', err);
    res.status(500).json({ success: false, message: 'Error computing freight rates.' });
  }
});

// ---------------- QUOTES API ----------------
app.get('/api/quotes', (req, res) => {
  res.json({ success: true, data: db.getQuotes() });
});

app.post('/api/quotes', async (req, res) => {
  try {
    const body = req.body;
    if (!body.clientName || !body.clientEmail || !body.originCity || !body.destCity) {
      return res.status(400).json({ success: false, message: 'Missing required quote details.' });
    }

    const newQuote = db.createQuote(body);

    // Send confirmation email to client
    const emailHtml = generateQuoteConfirmationHtml(newQuote);
    sendEmail({
      to: newQuote.clientEmail,
      recipientName: newQuote.clientName,
      subject: `Crusaders Logistics Freight Quote #${newQuote.id}: ${newQuote.originCity} to ${newQuote.destCity}`,
      html: emailHtml,
      shipmentId: newQuote.id,
      type: 'QUOTE_CONFIRMATION',
      previewText: `Quotation #${newQuote.id} for ${newQuote.cargoType || 'cargo'} estimated at $${(newQuote.estimatedRate || 0).toLocaleString()} USD.`
    }).catch(err => console.error('Quote email dispatch error:', err));

    res.status(201).json({
      success: true,
      message: 'Quote generated and dispatched to your email.',
      data: newQuote
    });
  } catch (err) {
    console.error('Create quote error:', err);
    res.status(500).json({ success: false, message: 'Error generating quote.' });
  }
});

// ---------------- NOTIFICATIONS / EMAIL OUTBOX API ----------------
app.get('/api/notifications', (req, res) => {
  res.json({ success: true, data: db.getNotifications() });
});

// Send test email
app.post('/api/notifications/test-email', async (req, res) => {
  try {
    const { email, customMessage } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const testShipment = db.getAllShipments()[0] || {
      trackingNumber: "APX-TEST-9999",
      senderName: "Apex Logistics HQ",
      receiverName: "Valued Customer",
      originCity: "New York",
      destCity: "London",
      serviceName: "Priority Air Express",
      weightKg: 25,
      estimatedDelivery: new Date().toISOString()
    };

    const html = generateBookingConfirmationHtml(testShipment);

    const result = await sendEmail({
      to: email,
      recipientName: "Test Subscriber",
      subject: `[Crusaders Logistics Test Ping] Automated Logistics Notification System Verified`,
      html: html,
      shipmentId: testShipment.trackingNumber,
      type: 'TEST_DISPATCH',
      previewText: customMessage || 'Verification ping from Crusaders Logistics automated notification daemon.'
    });

    res.json({
      success: true,
      message: `Test email dispatched to ${email}! View in Notification Outbox.`,
      result
    });
  } catch (err) {
    console.error('Test email error:', err);
    res.status(500).json({ success: false, message: 'Failed to send test email.' });
  }
});

// ---------------- FLEET & BRANCHES ----------------
app.get('/api/drivers', (req, res) => {
  res.json({ success: true, data: db.getDrivers() });
});

app.get('/api/branches', (req, res) => {
  res.json({ success: true, data: db.getBranches() });
});

app.get('/api/stats', (req, res) => {
  res.json({ success: true, data: db.getStats() });
});

// ---------------- USER ACTIVITIES AUDIT LOG ----------------
app.get('/api/activities', (req, res) => {
  const { eventType, search } = req.query;
  const list = db.getActivities({ eventType, search });
  res.json({ success: true, count: list.length, data: list });
});

app.post('/api/activities', (req, res) => {
  const item = db.createActivity({
    ...req.body,
    ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
    userAgent: req.headers['user-agent'] || 'Browser Client'
  });
  res.status(201).json({ success: true, data: item });
});

app.all('/api/activities/clear', (req, res) => {
  db.clearActivities();
  res.json({ success: true, message: 'Activity log cleared.' });
});

// Delete parcel
app.delete('/api/shipments/:trackingNumber', (req, res) => {
  const deleted = db.deleteShipment(req.params.trackingNumber);
  if (deleted) {
    res.json({ success: true, message: `Shipment #${req.params.trackingNumber} deleted.` });
  } else {
    res.status(404).json({ success: false, message: 'Shipment not found.' });
  }
});

// ---------------- AUTHENTICATION & ROLES API ----------------
// List demo/available user accounts
app.get('/api/auth/users', (req, res) => {
  res.json({ success: true, data: db.getUsers() });
});

// User login
app.post('/api/auth/login', (req, res) => {
  const { username, email, password } = req.body;
  const identifier = username || email;
  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Username/Email and Password are required.' });
  }

  const authenticated = db.authenticate(identifier, password);
  if (!authenticated) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your username/email and password.' });
  }

  // Log login activity
  db.createActivity({
    eventType: 'USER_LOGIN',
    description: `${authenticated.fullName} logged in as ${authenticated.roleLabel}`,
    entityType: 'user',
    entityId: authenticated.id,
    ipAddress: req.ip || '127.0.0.1',
    userAgent: req.headers['user-agent'] || 'Crusader Client'
  });

  res.json({
    success: true,
    message: `Welcome back, ${authenticated.fullName}!`,
    token: `token-${authenticated.id}-${Date.now()}`,
    user: authenticated
  });
});

// Check session
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.json({ success: true, authenticated: false, user: null });
  }
  // Default to superadmin or parse token
  const user = db.getUsers()[0];
  res.json({ success: true, authenticated: true, user });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ---------------- SERVE STATIC FRONTEND DIST ----------------
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`[Crusaders Logistics Backend] Server running at http://localhost:${PORT}`);
});
