<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>System Ping - Crusaders Logistics</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #334155; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background-color: #0f172a; padding: 28px 32px; text-align: left; }
    .logo-badge { display: inline-block; background-color: #ef700e; color: #ffffff; font-weight: 800; font-size: 13px; letter-spacing: 1px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; }
    .logo-text { font-size: 24px; font-weight: 900; color: #ffffff; margin-top: 8px; letter-spacing: -0.5px; }
    .logo-text span { color: #ef700e; }
    .content { padding: 32px; }
    .ping-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 18px; margin: 18px 0; color: #166534; }
    .footer { background-color: #f1f5f9; padding: 24px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">Automated Dispatch Subsystem</div>
      <div class="logo-text">CRUSADERS <span>LOGISTICS</span></div>
    </div>
    <div class="content">
      <div style="display:inline-block; background-color:#dcfce7; color:#15803d; padding:6px 14px; border-radius:9999px; font-weight:700; font-size:12px;">
        SMTP GATEWAY &bull; VERIFIED
      </div>
      <h2 style="margin: 16px 0 8px 0; color: #0f172a; font-size: 20px;">System Verification Ping</h2>
      <p style="margin: 0 0 16px 0; line-height: 1.6; color: #475569;">
        This is an automated delivery test originating from the Crusaders Logistics dispatch notification engine.
      </p>

      <div class="ping-box">
        <strong>Dispatch Status:</strong> Connected &amp; Operating Normally<br>
        <strong>Recipient:</strong> {{ $recipientEmail }}<br>
        <strong>Timestamp:</strong> {{ date('Y-m-d H:i:s T') }}<br>
        @if($customMessage)
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #86efac;">
            <strong>Operator Note:</strong> {{ $customMessage }}
          </div>
        @endif
      </div>

      <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
        All milestone checkpoint triggers, booking notifications, and customer quotes will route through this secure outbound transport.
      </p>
    </div>
    <div class="footer">
      <p>Crusaders Logistics Corporation &bull; 300 Kansas Ave NW, New Jersey, NJ 07030</p>
    </div>
  </div>
</body>
</html>
