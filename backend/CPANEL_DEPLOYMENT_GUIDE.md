# Crusaders Logistics – cPanel & Production Deployment Guide
**Separated Web Root (`public/`) and Application Core (`backend/`) Architecture**

---

## 1. Architectural Overview

To ensure enterprise-grade security and prevent unauthorized access to sensitive configuration files (`.env`, database credentials, application source code), the project is split into two cleanly separated packages:

| Package | Intended Destination on Server | Contents |
| :--- | :--- | :--- |
| **`crusaders-public.zip`** | `/home/username/public_html` *(or subdomain folder)* | Web document root: `index.php`, `.htaccess`, `robots.txt`, brand assets (`crusaders_logo.jpg`, `crusaders_hero.jpg`), compiled React Single Page App (`index.html`, `assets/`) |
| **`crusaders-backend.zip`** | `/home/username/crusaders-backend` *(outside web root)* | Laravel Application Core: `app/`, `bootstrap/`, `config/`, `database/`, `resources/`, `routes/`, `storage/`, `artisan`, `.env` |

```
/home/username/
├── crusaders-backend/              <-- [EXTRACT HERE] Protected Core Application
│   ├── app/
│   │   ├── Http/Controllers/Api/   <-- Shipment, Rate, Quote, Activity, Notification Controllers
│   │   ├── Mail/                   <-- HTML Booking, Checkpoint & Quote Mailables
│   │   ├── Models/                 <-- Shipment, Checkpoint, Quote, Driver, Branch, Activity
│   │   └── Services/               <-- Freight Rate Calculation Engine
│   ├── bootstrap/app.php
│   ├── config/
│   ├── database/database.sqlite    <-- Pre-seeded working database (or use MySQL)
│   ├── resources/views/emails/     <-- Responsive HTML email templates
│   ├── routes/api.php
│   ├── storage/
│   ├── artisan
│   └── .env
│
└── public_html/                    <-- [EXTRACT HERE] Web Document Root
    ├── index.php                   <-- Auto-detects backend directory and handles requests
    ├── .htaccess                   <-- Apache rewrites and asset caching headers
    ├── index.html                  <-- React SPA client
    ├── crusaders_logo.jpg          <-- Official Crusaders Logistics emblem
    ├── crusaders_hero.jpg          <-- Commercial aviation, fleet & port imagery
    ├── robots.txt
    └── assets/                     <-- Compiled JS & CSS bundles
```

---

## 2. Step-by-Step Deployment Instructions

### Step 1: Upload & Extract the Backend Package
1. Log in to your **cPanel** dashboard.
2. Open **File Manager** and navigate to your home root folder: `/home/yourusername/` (one level above `public_html`).
3. Click **Upload** and upload `crusaders-backend.zip`.
4. Right-click `crusaders-backend.zip` and select **Extract** into a folder named `crusaders-backend` (or extract directly).
5. Ensure the extracted folder is at `/home/yourusername/crusaders-backend`.

### Step 2: Upload & Extract the Public Package
1. In cPanel File Manager, navigate inside `public_html` (or your subdomain folder, e.g. `tracking.crusaderslogistics.com`).
2. Click **Upload** and upload `crusaders-public.zip`.
3. Right-click `crusaders-public.zip` and select **Extract**.
4. Confirm that `index.php`, `.htaccess`, `index.html`, `crusaders_logo.jpg`, `crusaders_hero.jpg`, and `assets/` now reside directly inside `public_html`.

### Step 3: Configure `.env` Settings
1. In File Manager, navigate to `/home/yourusername/crusaders-backend/`.
2. Open `.env` with the cPanel **Code Editor**.
3. Set your production domain:
   ```env
   APP_NAME="Crusaders Logistics"
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://crusaderslogistics.com
   ```

#### A. Database Options:
- **Option 1: Zero-Config SQLite (Default)**
  - Keep `DB_CONNECTION=sqlite` and `DB_DATABASE=database/database.sqlite`.
  - The pre-seeded database is already bundled with test shipments (`TRN12345`), drivers, and international hubs!
- **Option 2: MySQL (Recommended for high volume)**
  - In cPanel, create a database (e.g. `cpaneluser_crusaders`) and a user in **MySQL Databases**.
  - Update `.env`:
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=cpaneluser_crusaders
    DB_USERNAME=cpaneluser_dbuser
    DB_PASSWORD=your_strong_password
    ```

#### B. SMTP Email Delivery Setup:
Configure your corporate email credentials in `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=mail.crusaderslogistics.com
MAIL_PORT=587
MAIL_USERNAME=dispatch@crusaderslogistics.com
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="dispatch@crusaderslogistics.com"
MAIL_FROM_NAME="Crusaders Logistics Dispatch"
```
*(Tip: In development, set `MAIL_MAILER=log` to audit dispatched emails in the Notification Outbox without sending real external emails).*

### Step 4: Install Dependencies & Run Database Migrations
Open cPanel **Terminal** (or connect via SSH):
```bash
cd ~/crusaders-backend

# Install Composer dependencies (if vendor wasn't uploaded)
composer install --no-dev --optimize-autoloader

# Run database migrations and seed default data (if using MySQL)
php artisan migrate --seed --force

# Optimize Laravel route and config caching for lightning performance
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Step 5: Verify Permissions
Ensure the following directories have write permissions (755 or 775):
- `/home/yourusername/crusaders-backend/storage/`
- `/home/yourusername/crusaders-backend/bootstrap/cache/`
- `/home/yourusername/crusaders-backend/database/` (if using SQLite)

---

## 3. Configuring `office.crusaderslogistics.com` Subdomain in cPanel

To direct `office.yourdomain.com` automatically to the Admin Console:
1. In your **cPanel** home, click **Domains** (or **Subdomains**).
2. Click **Create A New Domain** / **Add Subdomain**.
3. Domain name: `office.crusaderslogistics.com` (or `office.yourdomain.com`)
4. **Document Root**: Point it to the **same** directory as your main site:
   - Set Document Root to: `public_html` *(uncheck "Share document root" if cPanel gives an independent input, and type `public_html`)*.
5. Click **Submit**.

**How It Works**:
- When anyone visits `https://crusaderslogistics.com/` &rarr; They see the public Crusaders Logistics marketing website, live tracking stepper, quote calculator, and booking.
- When an operator visits `https://office.crusaderslogistics.com/` &rarr; The application automatically detects the `office.*` host header and opens the **Corporate Office & Operations Console**, complete with parcel management, user activity telemetry, quotes, and fleet control!
- You can also access the admin anytime via `https://crusaderslogistics.com/office` or `https://crusaderslogistics.com/admin` or `?office=1`.

---

## 4. Verification & Live Features Check

Visit your domain in any browser:
1. **Public Website & Hero**:
   - Access `https://crusaderslogistics.com/` to verify the brand logo, hero slider with fleet imagery, statistics counter (897,344 KM, 7,279 Tons, 1M+ Clients), customer reviews (Jonathan Curr, Mika Stallion), and Core Values.
2. **Package Tracking Telemetry**:
   - Test waybill `TRN12345` to see the live 5-stage progress bar, milestone checkpoints, GPS telemetry map coordinates, and printable e-Air Waybill modal.
3. **Interactive Rate Calculator**:
   - Calculate custom freight rates for Air, Road, Ocean, Cold-Chain, and Last-Mile tiers. Test the instant quote email dispatch.
4. **Corporate Office & Admin Console (`office.domain.com`)**:
   - Access `https://office.crusaderslogistics.com/` or `https://crusaderslogistics.com/admin`.
   - **Add Parcel**: Click `+ Add New Parcel` to register consignments with auto-generated e-AWBs (`CRU-...`), cargo specs, sender/consignee, driver assignment, and instant email dispatch.
   - **Track All User Activities**: Live real-time audit stream showing who searched tracking numbers, calculated rates, requested quotes, with client IP and device.
   - **Advance Checkpoints**: Update milestones, driver location, and trigger customer status emails.
   - **Print e-AWB**: Printable formal Air Waybill slips with barcodes and stamps.
   - **Commercial Quotes Desk**: Review and convert customer freight inquiries into live shipments.
   - **Fleet Dispatch**: Track active drivers and vehicles.
5. **Email Notification Outbox Inspector**:
   - Click **Email Outbox** to view full HTML renders of booking confirmations, milestone checkpoint updates, and test notifications sent by the system.

---

## 5. Rebuilding Deployment Packages
Whenever you modify frontend code or backend features locally, you can regenerate the packages anytime with one command:
```powershell
powershell.exe -ExecutionPolicy Bypass -File "C:\Users\u.okorie\.gemini\antigravity\scratch\create_separated_packages_logistics.ps1"
```
This generates:
- `C:\Users\u.okorie\.gemini\antigravity\scratch\crusaders-backend.zip`
- `C:\Users\u.okorie\.gemini\antigravity\scratch\crusaders-public.zip`
- `C:\Users\u.okorie\.gemini\antigravity\scratch\logistics-deployment/` (mirror folders)
