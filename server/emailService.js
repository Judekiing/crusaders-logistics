import nodemailer from 'nodemailer';
import { db } from './db.js';

// Setup Nodemailer transporter
let transporter;

async function initTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    // Real external SMTP (e.g. SendGrid, Mailgun, AWS SES, Gmail)
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log('[EmailService] Configured with custom external SMTP server.');
  } else {
    // Development / Test mode with simulated transporter
    transporter = nodemailer.createTransport({
      streamTransport: true,
      newline: 'windows',
    });
    console.log('[EmailService] Configured with internal Stream/Virtual Transporter (outbox viewer enabled).');
  }
}

initTransporter();

/**
 * Generate styling-rich HTML Email Template
 */
function wrapEmailHtml({ title, preheader, bodyContent, trackingNumber }) {
  const brandColor = "#f97316";
  const darkBg = "#0f172a";
  const lightBg = "#f8fafc";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: ${lightBg}; color: #334155; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background-color: ${darkBg}; padding: 28px 32px; text-align: left; }
    .logo-badge { display: inline-block; background-color: #f97316; color: #ffffff; font-weight: 800; font-size: 13px; letter-spacing: 1px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; }
    .logo-text { font-size: 24px; font-weight: 900; color: #ffffff; margin-top: 8px; letter-spacing: -0.5px; }
    .logo-text span { color: #f97316; }
    .header-tagline { color: #fdba74; font-size: 12px; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 32px; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .badge-transit { background-color: #ffedd5; color: #c2410c; }
    .badge-out { background-color: #fef3c7; color: #b45309; }
    .badge-delivered { background-color: #d1fae5; color: #047857; }
    .badge-booked { background-color: #e2e8f0; color: #334155; }
    .tracking-box { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; border-radius: 10px; padding: 20px; margin: 24px 0; border-left: 4px solid #f97316; }
    .tracking-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; }
    .tracking-code { font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #fb923c; font-family: monospace; margin: 6px 0; }
    .route-table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f8fafc; border-radius: 8px; overflow: hidden; }
    .route-table td { padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .route-table td strong { color: #0f172a; }
    .btn { display: inline-block; background-color: ${brandColor}; color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 15px; padding: 14px 28px; border-radius: 8px; text-align: center; margin: 20px 0; box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.4); text-transform: uppercase; }
    .footer { background-color: #f1f5f9; padding: 24px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .footer a { color: #ea580c; text-decoration: none; }
  </style>
</head>
<body>
  <div style="display:none; font-size:1px; color:#333; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
    ${preheader || title}
  </div>
  <div class="container">
    <div class="header">
      <div class="logo-badge">Global Logistics Network</div>
      <div class="logo-text">LOGISTICS <span>FLIX</span></div>
      <div class="header-tagline">Connecting people &bull; Turnkey Transportation Services</div>
    </div>
    
    <div class="content">
      ${bodyContent}
      
      ${trackingNumber ? `
      <div style="text-align: center;">
        <a href="http://localhost:5173/?tracking=${trackingNumber}" class="btn" target="_blank">
          View Live Tracking & Milestones &rarr;
        </a>
      </div>
      ` : ''}
    </div>

    <div class="footer">
      <p>This automated notification was dispatched by the Crusaders Logistics Automated Notification System.</p>
      <p>&copy; 2026 Crusaders Logistics Inc. All rights reserved. | 24/7 Operations: +1 (800) 555-CRU1</p>
      <p><a href="http://localhost:5173">Track Online</a> &bull; <a href="http://localhost:5173">Customer Support</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Booking Confirmation Email
 */
export function generateBookingConfirmationHtml(shipment) {
  const content = `
    <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Your Shipment Has Been Confirmed & Dispatched!</h2>
    <p style="font-size: 15px; line-height: 1.6;">Hello <strong>${shipment.receiverName || shipment.senderName}</strong>,</p>
    <p style="font-size: 15px; line-height: 1.6;">
      Thank you for shipping with Crusaders Logistics. Your consignment has been booked and entered into our global dispatch schedule under service level: 
      <strong style="color: #0284c7;">${shipment.serviceName || shipment.serviceType}</strong>.
    </p>

    <div class="tracking-box">
      <div class="tracking-label">Electronic Tracking Number (AWB)</div>
      <div class="tracking-code">${shipment.trackingNumber}</div>
      <div style="font-size: 13px; color: #cbd5e1; margin-top: 4px;">
        Estimated Delivery: <strong>${new Date(shipment.estimatedDelivery || Date.now() + 86400000 * 3).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
      </div>
    </div>

    <table class="route-table">
      <tr>
        <td style="width: 25%; color: #64748b;">Origin / Pickup:</td>
        <td><strong>${shipment.originCity}, ${shipment.originCountry}</strong><br><span style="color: #64748b; font-size: 13px;">${shipment.originAddress || ''}</span></td>
      </tr>
      <tr>
        <td style="color: #64748b;">Destination:</td>
        <td><strong>${shipment.destCity}, ${shipment.destCountry}</strong><br><span style="color: #64748b; font-size: 13px;">${shipment.destAddress || ''}</span></td>
      </tr>
      <tr>
        <td style="color: #64748b;">Consignment Cargo:</td>
        <td><strong>${shipment.packageDescription || 'General Cargo'}</strong> (${shipment.packageType})</td>
      </tr>
      <tr>
        <td style="color: #64748b;">Weight & Quantity:</td>
        <td><strong>${shipment.weightKg} kg</strong> &bull; ${shipment.pieces || 1} Package(s)</td>
      </tr>
      <tr>
        <td style="color: #64748b;">Insurance / Security:</td>
        <td>${shipment.insuranceRequired ? '<span style="color: #047857; font-weight:600;">&#10003; Full Cargo Coverage</span>' : 'Standard Carrier Liability'} &bull; ${shipment.signatureRequired ? 'Direct Signature Required' : 'Standard Release'}</td>
      </tr>
    </table>

    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 18px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #166534;">
        <strong>Next Milestone:</strong> Our local feeder courier is scheduled to collect the shipment. You will receive an automatic ping once barcode scan is verified at the sorting terminal.
      </p>
    </div>
  `;

  return wrapEmailHtml({
    title: `Shipment Confirmed: ${shipment.trackingNumber}`,
    preheader: `Your shipment ${shipment.trackingNumber} has been scheduled for pickup and transit.`,
    bodyContent: content,
    trackingNumber: shipment.trackingNumber
  });
}

/**
 * Status Update / Milestone Alert Email
 */
export function generateStatusUpdateHtml(shipment, checkpoint) {
  let badgeClass = "badge-transit";
  let statusColor = "#0284c7";
  if (checkpoint.status === 'DELIVERED') {
    badgeClass = "badge-delivered";
    statusColor = "#10b981";
  } else if (checkpoint.status === 'OUT_FOR_DELIVERY') {
    badgeClass = "badge-out";
    statusColor = "#f59e0b";
  }

  const content = `
    <div style="margin-bottom: 12px;">
      <span class="badge ${badgeClass}">${checkpoint.status.replace('_', ' ')}</span>
    </div>
    
    <h2 style="color: #0f172a; margin-top: 4px; font-size: 22px;">
      ${checkpoint.status === 'DELIVERED' ? 'Shipment Successfully Delivered!' : 'Transit Milestone Update'}
    </h2>
    
    <p style="font-size: 15px; line-height: 1.6;">
      Shipment <strong>${shipment.trackingNumber}</strong> has reached a new operational checkpoint.
    </p>

    <div class="tracking-box" style="border-left: 4px solid ${statusColor};">
      <div class="tracking-label">Latest Verified Checkpoint</div>
      <div style="font-size: 18px; font-weight: 700; color: #ffffff; margin: 4px 0;">
        ${checkpoint.statusTitle || checkpoint.status}
      </div>
      <div style="font-size: 14px; color: #38bdf8; margin-top: 4px;">
        Location: <strong>${checkpoint.location}</strong>
      </div>
      <div style="font-size: 13px; color: #94a3b8; margin-top: 4px;">
        Timestamp: ${new Date(checkpoint.timestamp).toUTCString()}
      </div>
    </div>

    ${checkpoint.notes ? `
    <div style="background-color: #f8fafc; border-left: 3px solid #0284c7; padding: 12px 16px; margin: 18px 0; font-size: 14px; color: #334155;">
      <strong>Dispatcher Notes:</strong> "${checkpoint.notes}"
    </div>
    ` : ''}

    <table class="route-table">
      <tr>
        <td style="width: 30%; color: #64748b;">Destination:</td>
        <td><strong>${shipment.destCity}, ${shipment.destCountry}</strong> (${shipment.destAddress})</td>
      </tr>
      <tr>
        <td style="color: #64748b;">Assigned Driver / Unit:</td>
        <td><strong>${shipment.assignedDriver || 'Apex Fleet Logistics'}</strong></td>
      </tr>
      <tr>
        <td style="color: #64748b;">Current ETA:</td>
        <td><strong>${new Date(shipment.estimatedDelivery || Date.now()).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong></td>
      </tr>
    </table>
  `;

  return wrapEmailHtml({
    title: `Shipment Update [${shipment.trackingNumber}]: ${checkpoint.status}`,
    preheader: `Update for ${shipment.trackingNumber}: ${checkpoint.statusTitle} in ${checkpoint.location}`,
    bodyContent: content,
    trackingNumber: shipment.trackingNumber
  });
}

/**
 * Quote Request Confirmation Email
 */
export function generateQuoteConfirmationHtml(quote) {
  const content = `
    <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Freight Quote Request Received</h2>
    <p style="font-size: 15px; line-height: 1.6;">Hello <strong>${quote.clientName}</strong>,</p>
    <p style="font-size: 15px; line-height: 1.6;">
      We have processed your instant freight rate calculation for Reference <strong>#${quote.id}</strong>.
      Our dedicated route specialist is preparing customized volume discounts and customs brokerage options.
    </p>

    <div class="tracking-box">
      <div class="tracking-label">Estimated Shipping Cost</div>
      <div class="tracking-code" style="color: #4ade80;">$${(quote.estimatedRate || 0).toLocaleString()} ${quote.currency || 'USD'}</div>
      <div style="font-size: 13px; color: #cbd5e1; margin-top: 4px;">
        Service: <strong>${(quote.serviceType || 'Standard').toUpperCase()}</strong>
      </div>
    </div>

    <table class="route-table">
      <tr>
        <td style="width: 30%; color: #64748b;">Route:</td>
        <td><strong>${quote.originCity} &rarr; ${quote.destCity}</strong></td>
      </tr>
      <tr>
        <td style="color: #64748b;">Consignment Type:</td>
        <td><strong>${quote.cargoType || 'Commercial Freight'}</strong></td>
      </tr>
      <tr>
        <td style="color: #64748b;">Gross Weight:</td>
        <td><strong>${quote.weightKg} kg</strong></td>
      </tr>
      ${quote.notes ? `
      <tr>
        <td style="color: #64748b;">Special Requirements:</td>
        <td>${quote.notes}</td>
      </tr>
      ` : ''}
    </table>

    <p style="font-size: 14px; color: #475569;">
      Need to immediately schedule this dispatch? You can reply directly to this quotation or convert it to a live booking in our self-service portal.
    </p>
  `;

  return wrapEmailHtml({
    title: `Crusaders Logistics Rate Quote #${quote.id}`,
    preheader: `Your freight rate quote #${quote.id} from ${quote.originCity} to ${quote.destCity} is ready.`,
    bodyContent: content,
    trackingNumber: null
  });
}

/**
 * Dispatch Email & record in database notifications
 */
export async function sendEmail({ to, recipientName, subject, html, shipmentId, type, previewText }) {
  try {
    const mailOptions = {
      from: '"Crusaders Logistics Global Dispatch" <dispatch@crusaderslogistics.com>',
      to,
      subject,
      html,
    };

    let sendResult = null;
    if (transporter) {
      sendResult = await transporter.sendMail(mailOptions);
    }

    // Always record in database outbox so user can inspect, preview, and verify
    const recorded = db.addNotification({
      shipmentId: shipmentId || "SYSTEM",
      recipientEmail: to,
      recipientName: recipientName || to.split('@')[0],
      type: type || "INFO",
      subject,
      previewText: previewText || subject,
      htmlContent: html,
      deliveredAt: new Date().toISOString()
    });

    console.log(`[EmailService] Dispatched email to ${to} (${subject}). Notification ID: ${recorded.id}`);
    return { success: true, notificationId: recorded.id, messageId: sendResult?.messageId };
  } catch (err) {
    console.error(`[EmailService] Failed to dispatch email to ${to}:`, err);
    // Even if transporter had an issue, record the failure or simulated entry
    const recorded = db.addNotification({
      shipmentId: shipmentId || "SYSTEM",
      recipientEmail: to,
      recipientName: recipientName || to.split('@')[0],
      type: type || "INFO",
      subject,
      previewText: `[Dispatch Attempt] ${subject}`,
      htmlContent: html,
      status: "FAILED_TRANSPORT",
      error: err.message
    });
    return { success: false, error: err.message, notificationId: recorded.id };
  }
}
