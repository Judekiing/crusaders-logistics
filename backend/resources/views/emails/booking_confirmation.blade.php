<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Waybill Confirmed - Crusaders Logistics</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #334155; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background-color: #0f172a; padding: 28px 32px; text-align: left; }
    .logo-badge { display: inline-block; background-color: #ef700e; color: #ffffff; font-weight: 800; font-size: 13px; letter-spacing: 1px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; }
    .logo-text { font-size: 24px; font-weight: 900; color: #ffffff; margin-top: 8px; letter-spacing: -0.5px; }
    .logo-text span { color: #ef700e; }
    .header-tagline { color: #fdba74; font-size: 12px; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 32px; }
    .badge-booked { display: inline-block; background-color: #ffedd5; color: #c2410c; padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .tracking-box { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; border-radius: 10px; padding: 20px; margin: 24px 0; border-left: 4px solid #ef700e; }
    .tracking-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; }
    .tracking-code { font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #fb923c; font-family: monospace; margin: 6px 0; }
    .route-table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f8fafc; border-radius: 8px; overflow: hidden; }
    .route-table td { padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .route-table td strong { color: #0f172a; }
    .btn { display: inline-block; background-color: #ef700e; color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 15px; padding: 14px 28px; border-radius: 8px; text-align: center; margin: 20px 0; box-shadow: 0 4px 6px -1px rgba(239, 112, 14, 0.4); text-transform: uppercase; }
    .footer { background-color: #f1f5f9; padding: 24px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .footer a { color: #ea580c; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">Global Logistics Network</div>
      <div class="logo-text">CRUSADERS <span>LOGISTICS</span></div>
      <div class="header-tagline">Connecting people &bull; Turnkey Transportation Services</div>
    </div>
    <div class="content">
      <div class="badge-booked">Booking Confirmed &amp; Logged</div>
      <h2 style="margin: 16px 0 8px 0; color: #0f172a; font-size: 20px;">Your Shipment Has Been Scheduled</h2>
      <p style="margin: 0 0 16px 0; line-height: 1.6; color: #475569;">
        Dear <strong>{{ $data['receiverName'] ?? $data['senderName'] ?? 'Valued Customer' }}</strong>,<br>
        Your consignment manifest has been issued and assigned a global electronic Air Waybill (e-AWB). Our logistics dispatch operations are handling pickup and forwarding.
      </p>

      <div class="tracking-box">
        <div class="tracking-label">Master Electronic Waybill (AWB)</div>
        <div class="tracking-code">{{ $data['trackingNumber'] }}</div>
        <div style="font-size: 13px; color: #cbd5e1;">Service: <strong>{{ $data['serviceName'] ?? 'Priority Express' }}</strong></div>
      </div>

      <table class="route-table">
        <tr>
          <td><strong>Origin Hub:</strong></td>
          <td>{{ $data['originCity'] }}, {{ $data['originCountry'] ?? 'US' }}</td>
        </tr>
        <tr>
          <td><strong>Destination Port:</strong></td>
          <td>{{ $data['destCity'] }}, {{ $data['destCountry'] ?? 'US' }}</td>
        </tr>
        <tr>
          <td><strong>Consignee:</strong></td>
          <td>{{ $data['receiverName'] }} ({{ $data['destAddress'] ?? 'Pending depot assignment' }})</td>
        </tr>
        <tr>
          <td><strong>Cargo Specs:</strong></td>
          <td>{{ $data['pieces'] ?? 1 }} pcs &bull; {{ $data['weightKg'] ?? 1 }} kg &bull; {{ $data['packageType'] ?? 'General Cargo' }}</td>
        </tr>
        <tr>
          <td><strong>Estimated Arrival:</strong></td>
          <td style="color: #ef700e; font-weight: bold;">{{ isset($data['estimatedDelivery']) ? date('M d, Y H:i T', strtotime($data['estimatedDelivery'])) : 'Within 3 business days' }}</td>
        </tr>
      </table>

      <div style="text-align: center;">
        <a href="{{ config('app.url') }}/?track={{ $data['trackingNumber'] }}" class="btn">Track Consignment Telemetry</a>
      </div>
    </div>
    <div class="footer">
      <p>Crusaders Logistics Corporation &bull; 300 Kansas Ave NW, New Jersey, NJ 07030</p>
      <p>Worldwide Dispatch Hotline: <a href="tel:+18005552781">+1 (800) 555-CRU1</a> &bull; Email: <a href="mailto:dispatch@crusaderslogistics.com">dispatch@crusaderslogistics.com</a></p>
      <p>&copy; {{ date('Y') }} Crusaders Logistics. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
