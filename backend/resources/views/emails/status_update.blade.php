<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Milestone Update - Crusaders Logistics</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #334155; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background-color: #0f172a; padding: 28px 32px; text-align: left; }
    .logo-badge { display: inline-block; background-color: #ef700e; color: #ffffff; font-weight: 800; font-size: 13px; letter-spacing: 1px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; }
    .logo-text { font-size: 24px; font-weight: 900; color: #ffffff; margin-top: 8px; letter-spacing: -0.5px; }
    .logo-text span { color: #ef700e; }
    .content { padding: 32px; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .badge-transit { background-color: #ffedd5; color: #c2410c; }
    .badge-delivered { background-color: #d1fae5; color: #047857; }
    .badge-alert { background-color: #fee2e2; color: #b91c1c; }
    .tracking-box { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; border-radius: 10px; padding: 20px; margin: 24px 0; border-left: 4px solid #ef700e; }
    .checkpoint-card { background-color: #f8fafc; border-left: 4px solid #ef700e; padding: 18px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; }
    .btn { display: inline-block; background-color: #ef700e; color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 15px; padding: 14px 28px; border-radius: 8px; text-align: center; margin: 20px 0; box-shadow: 0 4px 6px -1px rgba(239, 112, 14, 0.4); text-transform: uppercase; }
    .footer { background-color: #f1f5f9; padding: 24px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .footer a { color: #ea580c; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">Automated Dispatch Telemetry</div>
      <div class="logo-text">CRUSADERS <span>LOGISTICS</span></div>
    </div>
    <div class="content">
      @if($checkpoint->status === 'DELIVERED')
        <div class="badge badge-delivered">DELIVERED &bull; SIGNED BY CONSIGNEE</div>
      @elseif($checkpoint->status === 'EXCEPTION' || $checkpoint->status === 'ON_HOLD')
        <div class="badge badge-alert">OPERATIONAL NOTICE: {{ str_replace('_', ' ', $checkpoint->status) }}</div>
      @else
        <div class="badge badge-transit">{{ str_replace('_', ' ', $checkpoint->status) }}</div>
      @endif

      <h2 style="margin: 16px 0 8px 0; color: #0f172a; font-size: 20px;">Milestone Status Update</h2>
      <p style="margin: 0 0 16px 0; line-height: 1.6; color: #475569;">
        Waybill <strong>#{{ $shipment->tracking_number }}</strong> has logged a new operational event along its transit corridor.
      </p>

      <div class="checkpoint-card">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: bold;">Current Milestone</div>
        <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 4px 0;">{{ $checkpoint->status_title ?: str_replace('_', ' ', $checkpoint->status) }}</div>
        <div style="font-size: 14px; color: #334155; margin-bottom: 6px;">📍 <strong>Location:</strong> {{ $checkpoint->location }}</div>
        <div style="font-size: 13px; color: #64748b;">🕒 <strong>Time:</strong> {{ date('M d, Y H:i T', strtotime($checkpoint->checkpoint_time)) }}</div>
        @if($checkpoint->notes)
          <div style="margin-top: 8px; font-size: 13px; color: #475569; background: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <em>"{{ $checkpoint->notes }}"</em>
          </div>
        @endif
        @if($checkpoint->operator || $checkpoint->driver)
          <div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">
            Operator/Unit: {{ $checkpoint->operator ?? $checkpoint->driver }}
          </div>
        @endif
      </div>

      <div class="tracking-box">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">Routing Summary</div>
        <div style="font-size: 16px; font-weight: 700; color: #ffffff; margin-top: 4px;">
          {{ $shipment->origin_city }} &rarr; {{ $shipment->dest_city }}
        </div>
        <div style="font-size: 13px; color: #fb923c; margin-top: 4px;">
          Consignee: {{ $shipment->receiver_name }}
        </div>
      </div>

      <div style="text-align: center;">
        <a href="{{ config('app.url') }}/?track={{ $shipment->tracking_number }}" class="btn">View Live Telemetry Stepper</a>
      </div>
    </div>
    <div class="footer">
      <p>Crusaders Logistics Corporation &bull; 300 Kansas Ave NW, New Jersey, NJ 07030</p>
      <p>Need assistance? Contact our 24/7 Operations Desk at <a href="mailto:dispatch@crusaderslogistics.com">dispatch@crusaderslogistics.com</a></p>
    </div>
  </div>
</body>
</html>
