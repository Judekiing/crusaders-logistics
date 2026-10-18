<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Freight Quotation - Crusaders Logistics</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #334155; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background-color: #0f172a; padding: 28px 32px; text-align: left; }
    .logo-badge { display: inline-block; background-color: #ef700e; color: #ffffff; font-weight: 800; font-size: 13px; letter-spacing: 1px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; }
    .logo-text { font-size: 24px; font-weight: 900; color: #ffffff; margin-top: 8px; letter-spacing: -0.5px; }
    .logo-text span { color: #ef700e; }
    .content { padding: 32px; }
    .quote-hero { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; border-radius: 10px; padding: 24px; margin: 20px 0; border-left: 4px solid #ef700e; text-align: center; }
    .price-tag { font-size: 36px; font-weight: 900; color: #fb923c; margin: 8px 0; }
    .breakdown-table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f8fafc; border-radius: 8px; overflow: hidden; }
    .breakdown-table td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .breakdown-table td strong { color: #0f172a; }
    .btn { display: inline-block; background-color: #ef700e; color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 15px; padding: 14px 28px; border-radius: 8px; text-align: center; margin: 20px 0; box-shadow: 0 4px 6px -1px rgba(239, 112, 14, 0.4); text-transform: uppercase; }
    .footer { background-color: #f1f5f9; padding: 24px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .footer a { color: #ea580c; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">Freight Estimation Engine</div>
      <div class="logo-text">CRUSADERS <span>LOGISTICS</span></div>
    </div>
    <div class="content">
      <div style="display:inline-block; background-color:#ffedd5; color:#c2410c; padding:6px 14px; border-radius:9999px; font-weight:700; font-size:12px; text-transform:uppercase;">
        Quotation Ready &bull; Ref #{{ $quote->id }}
      </div>
      <h2 style="margin: 16px 0 8px 0; color: #0f172a; font-size: 20px;">Formal Freight Estimate</h2>
      <p style="margin: 0 0 16px 0; line-height: 1.6; color: #475569;">
        Dear <strong>{{ $quote->client_name }}</strong>,<br>
        Thank you for requesting a rate calculation with Crusaders Logistics. Below is your official freight quotation for transit along the designated corridor.
      </p>

      <div class="quote-hero">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">Estimated Shipping Cost</div>
        <div class="price-tag">${{ number_format($quote->estimated_rate, 2) }} USD</div>
        <div style="font-size: 13px; color: #cbd5e1;">Selected Tier: <strong>{{ ucwords(str_replace('_', ' ', $quote->selected_service)) }}</strong></div>
        <div style="font-size: 12px; color: #fb923c; margin-top: 4px;">Transit Time: {{ $quote->transit_days ?: '2-4 Business Days' }}</div>
      </div>

      <table class="breakdown-table">
        <tr>
          <td><strong>Route:</strong></td>
          <td>{{ $quote->origin_city }}, {{ $quote->origin_country }} &rarr; {{ $quote->dest_city }}, {{ $quote->dest_country }}</td>
        </tr>
        <tr>
          <td><strong>Cargo Description:</strong></td>
          <td>{{ $quote->cargo_type ?: 'Commercial General Cargo' }}</td>
        </tr>
        <tr>
          <td><strong>Weight / Pieces:</strong></td>
          <td>{{ $quote->weight_kg }} kg &bull; {{ $quote->pieces }} piece(s)</td>
        </tr>
        <tr>
          <td><strong>Client Contact:</strong></td>
          <td>{{ $quote->client_email }} &bull; {{ $quote->client_phone ?: 'N/A' }}</td>
        </tr>
      </table>

      <div style="text-align: center;">
        <a href="{{ config('app.url') }}/?book=1&quote={{ $quote->id }}" class="btn">Proceed With Direct Booking</a>
      </div>
    </div>
    <div class="footer">
      <p>Crusaders Logistics Corporation &bull; 300 Kansas Ave NW, New Jersey, NJ 07030</p>
      <p>Quotation valid for 14 days from date of issuance. Rates subject to final container load validation.</p>
    </div>
  </div>
</body>
</html>
