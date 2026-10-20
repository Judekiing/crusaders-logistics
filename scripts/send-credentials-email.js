import nodemailer from 'nodemailer';

async function sendCredentialsEmail() {
  const transporter = nodemailer.createTransport({
    host: 'mail.crusaderslogistics.com',
    port: 465,
    secure: true, // SSL/TLS
    auth: {
      user: 'info@crusaderslogistics.com',
      pass: 'eXvTmpFNB.zNESY0',
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0b1120; color: #e2e8f0; margin: 0; padding: 24px; }
      .card { max-width: 650px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; }
      .header { background: #0f172a; padding: 28px; border-bottom: 2px solid #f97316; }
      .logo { font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; }
      .logo span { color: #f97316; }
      .body { padding: 28px; }
      h2 { color: #ffffff; font-size: 20px; margin-top: 0; }
      .cred-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      .cred-table th { text-align: left; background: #0f172a; padding: 12px; font-size: 12px; text-transform: uppercase; color: #94a3b8; border: 1px solid #334155; }
      .cred-table td { padding: 12px; font-size: 13px; border: 1px solid #334155; color: #f1f5f9; }
      .code { font-family: monospace; background: #0f172a; padding: 4px 8px; border-radius: 6px; color: #38bdf8; font-weight: bold; }
      .badge { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; }
      .badge-admin { background: #581c87; color: #d8b4fe; }
      .badge-ops { background: #78350f; color: #fcd34d; }
      .badge-cust { background: #0c4a6e; color: #7dd3fc; }
      .footer { background: #0f172a; padding: 20px 28px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #334155; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="logo">CRUSADERS <span>LOGISTICS</span></div>
        <div style="color: #94a3b8; font-size: 12px; margin-top: 4px;">Confidential Access & Testing Credentials Vault</div>
      </div>
      <div class="body">
        <h2>Crusaders Logistics Platform Credentials</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
          As requested, all test credentials and preset logins have been removed from the public website interface for production security. Below are the confidential access credentials for testing and administration.
        </p>

        <h3 style="color: #f97316; margin-top: 24px; font-size: 15px;">1. Operational & Administrative Accounts</h3>
        <table class="cred-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Username</th>
              <th>Password</th>
              <th>Direct Login URL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="badge badge-admin">Super Admin</span></td>
              <td><span class="code">superadmin</span></td>
              <td><span class="code">SuperAdmin@2026!</span></td>
              <td><a href="https://crusaderslogistics.com/?tab=admin" style="color: #f97316;">Portal Admin</a></td>
            </tr>
            <tr>
              <td><span class="badge badge-ops">Company Dispatch</span></td>
              <td><span class="code">companyadmin</span></td>
              <td><span class="code">CompanyAdmin@2026!</span></td>
              <td><a href="https://crusaderslogistics.com/?tab=login" style="color: #f97316;">Sign In</a></td>
            </tr>
            <tr>
              <td><span class="badge badge-cust">Customer Shipper</span></td>
              <td><span class="code">customer</span></td>
              <td><span class="code">CustomerUser@2026!</span></td>
              <td><a href="https://crusaderslogistics.com/?tab=login" style="color: #f97316;">Sign In</a></td>
            </tr>
          </tbody>
        </table>

        <h3 style="color: #f97316; margin-top: 24px; font-size: 15px;">2. Official Corporate Webmail (Roundcube)</h3>
        <p style="font-size: 13px; color: #cbd5e1;">
          <strong>Webmail URL:</strong> <a href="https://standard7.doveserver.com:2096/cpsess5669445925/3rdparty/roundcube/?_task=mail&_mbox=INBOX" style="color: #38bdf8;">Standard7 Roundcube Inbound</a><br>
          <strong>Username / Email:</strong> <span class="code">info@crusaderslogistics.com</span><br>
          <strong>Password:</strong> <span class="code">eXvTmpFNB.zNESY0</span><br>
          <strong>Incoming Server:</strong> mail.crusaderslogistics.com (IMAP: 993, POP3: 995)<br>
          <strong>Outgoing Server:</strong> mail.crusaderslogistics.com (SMTP: 465 SSL/TLS)
        </p>

        <h3 style="color: #f97316; margin-top: 24px; font-size: 15px;">3. Direct Access Links</h3>
        <ul style="font-size: 13px; color: #cbd5e1; line-height: 1.8;">
          <li>Public Portal: <a href="https://crusaderslogistics.com" style="color: #38bdf8;">https://crusaderslogistics.com</a></li>
          <li>Direct Sign-In Modal: <a href="https://crusaderslogistics.com/?tab=login" style="color: #38bdf8;">https://crusaderslogistics.com/?tab=login</a></li>
          <li>Corporate Office Console: <a href="https://office.crusaderslogistics.com" style="color: #38bdf8;">https://office.crusaderslogistics.com</a> or <a href="https://crusaderslogistics.com/?tab=admin" style="color: #38bdf8;">https://crusaderslogistics.com/?tab=admin</a></li>
        </ul>
      </div>
      <div class="footer">
        &copy; 2026 Crusaders Logistics Inc. &bull; Enterprise Cargo & Transport Network
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    console.log('Sending credentials email to info@crusaderslogistics.com and judekiingokorie@gmail.com...');
    const info = await transporter.sendMail({
      from: '"Crusaders Logistics Security" <info@crusaderslogistics.com>',
      to: 'info@crusaderslogistics.com, judekiingokorie@gmail.com',
      subject: 'Crusaders Logistics - Authorized Platform & Super Admin Credentials',
      text: `Crusaders Logistics Test & Super Admin Credentials\n\nSuper Admin:\nUsername: superadmin\nPassword: SuperAdmin@2026!\nURL: https://crusaderslogistics.com/?tab=admin\n\nCompany Admin:\nUsername: companyadmin\nPassword: CompanyAdmin@2026!\n\nCustomer Shipper:\nUsername: customer\nPassword: CustomerUser@2026!\n\nCorporate Webmail: info@crusaderslogistics.com\nPassword: eXvTmpFNB.zNESY0`,
      html: htmlContent
    });
    console.log('Email dispatched successfully! Message ID:', info.messageId);
  } catch (err) {
    console.error('Failed to send credentials email:', err);
  }
}

sendCredentialsEmail();
