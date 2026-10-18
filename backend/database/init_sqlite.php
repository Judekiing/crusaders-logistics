<?php

$dbPath = __DIR__ . '/database.sqlite';
if (file_exists($dbPath)) {
    unlink($dbPath);
}

$pdo = new PDO('sqlite:' . $dbPath);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// 1. Create shipments table
$pdo->exec("
CREATE TABLE IF NOT EXISTS shipments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tracking_number VARCHAR(64) UNIQUE NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255),
    sender_phone VARCHAR(255),
    origin_address VARCHAR(255),
    origin_city VARCHAR(255) NOT NULL,
    origin_state VARCHAR(255),
    origin_country VARCHAR(255) DEFAULT 'United States',
    origin_zip VARCHAR(255),
    receiver_name VARCHAR(255) NOT NULL,
    receiver_email VARCHAR(255),
    receiver_phone VARCHAR(255),
    dest_address VARCHAR(255),
    dest_city VARCHAR(255) NOT NULL,
    dest_state VARCHAR(255),
    dest_country VARCHAR(255) DEFAULT 'United States',
    dest_zip VARCHAR(255),
    service_type VARCHAR(255) DEFAULT 'express_air',
    service_name VARCHAR(255) DEFAULT 'Crusaders Logistics Priority Air Express',
    package_type VARCHAR(255) DEFAULT 'box',
    package_description TEXT,
    pieces INTEGER DEFAULT 1,
    weight_kg NUMERIC DEFAULT 1.0,
    chargeable_weight_kg NUMERIC DEFAULT 1.0,
    dimensions TEXT,
    declared_value NUMERIC DEFAULT 0.0,
    currency VARCHAR(10) DEFAULT 'USD',
    insurance_required BOOLEAN DEFAULT 0,
    signature_required BOOLEAN DEFAULT 0,
    current_status VARCHAR(50) DEFAULT 'ORDER_PLACED',
    status_label VARCHAR(255) DEFAULT 'Order Manifest Received',
    estimated_delivery DATETIME,
    booked_at DATETIME,
    delivered_at DATETIME,
    assigned_driver VARCHAR(255),
    vehicle_info VARCHAR(255),
    route_coordinates TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
");

// 2. Create checkpoints table
$pdo->exec("
CREATE TABLE IF NOT EXISTS checkpoints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shipment_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    status_title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    operator VARCHAR(255),
    driver VARCHAR(255),
    notes TEXT,
    checkpoint_time DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);
");

// 3. Create quotes table
$pdo->exec("
CREATE TABLE IF NOT EXISTS quotes (
    id VARCHAR(64) PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(255),
    company_name VARCHAR(255),
    origin_city VARCHAR(255) NOT NULL,
    origin_country VARCHAR(255) DEFAULT 'United States',
    dest_city VARCHAR(255) NOT NULL,
    dest_country VARCHAR(255) DEFAULT 'United States',
    cargo_type VARCHAR(255),
    weight_kg NUMERIC DEFAULT 10.0,
    pieces INTEGER DEFAULT 1,
    dimensions TEXT,
    selected_service VARCHAR(255) DEFAULT 'standard_ground',
    estimated_rate NUMERIC DEFAULT 0.0,
    transit_days VARCHAR(255),
    special_instructions TEXT,
    status VARCHAR(30) DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
");

// 4. Create notification_logs table
$pdo->exec("
CREATE TABLE IF NOT EXISTS notification_logs (
    id VARCHAR(64) PRIMARY KEY,
    shipment_id VARCHAR(64),
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'STATUS_UPDATE',
    status VARCHAR(30) DEFAULT 'SENT',
    preview_text TEXT,
    html_content TEXT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
");

// 5. Create drivers table
$pdo->exec("
CREATE TABLE IF NOT EXISTS drivers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    vehicle_type VARCHAR(255) DEFAULT 'Box Truck',
    plate_number VARCHAR(255),
    status VARCHAR(255) DEFAULT 'AVAILABLE',
    current_city VARCHAR(255) DEFAULT 'New Jersey',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
");

// 6. Create branches table
$pdo->exec("
CREATE TABLE IF NOT EXISTS branches (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    email VARCHAR(255),
    hub_type VARCHAR(255) DEFAULT 'REGIONAL_HUB',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
");

// 7. Create activities table (Track all user & visitor activities)
$pdo->exec("
CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(64),
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
");

// Seed Primary Reference Shipment: TRN12345
$stmt = $pdo->prepare("
INSERT INTO shipments (
    tracking_number, sender_name, sender_email, sender_phone, origin_address, origin_city, origin_state, origin_country, origin_zip,
    receiver_name, receiver_email, receiver_phone, dest_address, dest_city, dest_state, dest_country, dest_zip,
    service_type, service_name, package_type, package_description, pieces, weight_kg, chargeable_weight_kg, dimensions,
    declared_value, currency, insurance_required, signature_required, current_status, status_label, estimated_delivery, booked_at,
    assigned_driver, vehicle_info, route_coordinates
) VALUES (
    :tracking_number, :sender_name, :sender_email, :sender_phone, :origin_address, :origin_city, :origin_state, :origin_country, :origin_zip,
    :receiver_name, :receiver_email, :receiver_phone, :dest_address, :dest_city, :dest_state, :dest_country, :dest_zip,
    :service_type, :service_name, :package_type, :package_description, :pieces, :weight_kg, :chargeable_weight_kg, :dimensions,
    :declared_value, :currency, :insurance_required, :signature_required, :current_status, :status_label, :estimated_delivery, :booked_at,
    :assigned_driver, :vehicle_info, :route_coordinates
)
");

$stmt->execute([
    ':tracking_number' => 'TRN12345',
    ':sender_name' => 'Crusaders Logistics Global Forwarding',
    ':sender_email' => 'dispatch@crusaderslogistics.com',
    ':sender_phone' => '+1 (800) 555-CRU1',
    ':origin_address' => '300 Kansas Ave NW',
    ':origin_city' => 'New Jersey',
    ':origin_state' => 'NJ',
    ':origin_country' => 'United States',
    ':origin_zip' => '07030',
    ':receiver_name' => 'Jonathan Curr',
    ':receiver_email' => 'jonathan.curr@currltd.co.uk',
    ':receiver_phone' => '+44 20 7946 0991',
    ':dest_address' => '25 Bank Street, Canary Wharf',
    ':dest_city' => 'London',
    ':dest_state' => 'Greater London',
    ':dest_country' => 'United Kingdom',
    ':dest_zip' => 'E14 5JP',
    ':service_type' => 'express_air',
    ':service_name' => 'Crusaders Logistics International Air Priority',
    ':package_type' => 'pallet',
    ':package_description' => 'Industrial Electronics & Precision Automation Spares',
    ':pieces' => 3,
    ':weight_kg' => 215.0,
    ':chargeable_weight_kg' => 268.8,
    ':dimensions' => json_encode(['length' => 120, 'width' => 80, 'height' => 140]),
    ':declared_value' => 65000,
    ':currency' => 'USD',
    ':insurance_required' => 1,
    ':signature_required' => 1,
    ':current_status' => 'IN_TRANSIT',
    ':status_label' => 'In Transit - Trans-Atlantic Flight Sector',
    ':estimated_delivery' => '2026-10-18 16:00:00',
    ':booked_at' => '2026-10-15 08:30:00',
    ':assigned_driver' => 'Flight Capt. Harrison (Boeing 777F #FLX-880)',
    ':vehicle_info' => 'Boeing 777F Cargo Airlifter / Flx-880',
    ':route_coordinates' => json_encode([
        'origin' => ['lat' => 40.7128, 'lng' => -74.0060, 'label' => 'New Jersey Dispatch Center'],
        'current' => ['lat' => 51.4700, 'lng' => -0.4543, 'label' => 'London Heathrow Cargo Hub (LHR)'],
        'destination' => ['lat' => 51.5055, 'lng' => -0.0166, 'label' => 'Canary Wharf Consignee Depot'],
    ])
]);
$trnId = $pdo->lastInsertId();

// Seed Checkpoints for TRN12345
$chkStmt = $pdo->prepare("
INSERT INTO checkpoints (shipment_id, status, status_title, location, operator, driver, notes, checkpoint_time)
VALUES (:shipment_id, :status, :status_title, :location, :operator, :driver, :notes, :checkpoint_time)
");

$chkStmt->execute([
    ':shipment_id' => $trnId,
    ':status' => 'ORDER_PLACED',
    ':status_title' => 'Waybill Issued & Consignment Manifest Logged',
    ':location' => 'New Jersey, USA',
    ':operator' => 'Automated Dispatch System',
    ':driver' => null,
    ':notes' => 'Booking confirmed under e-AWB #TRN12345. Commercial invoice validated.',
    ':checkpoint_time' => '2026-10-15 08:30:00',
]);

$chkStmt->execute([
    ':shipment_id' => $trnId,
    ':status' => 'PICKED_UP',
    ':status_title' => 'Cargo Collected by Crusaders Logistics Feeder Fleet',
    ':location' => '300 Kansas Ave NW, New Jersey',
    ':operator' => 'Driver Tom Keller (Unit #44)',
    ':driver' => 'Tom Keller',
    ':notes' => 'Pallets loaded, tamper-evident security seals affixed (#LF-99211).',
    ':checkpoint_time' => '2026-10-15 12:15:00',
]);

$chkStmt->execute([
    ':shipment_id' => $trnId,
    ':status' => 'IN_TRANSIT',
    ':status_title' => 'Trans-Atlantic Flight Departure (JFK -> LHR)',
    ':location' => 'JFK International Airport / Trans-Atlantic Corridor',
    ':operator' => 'Aviation Cargo Team',
    ':driver' => 'Flight Capt. Harrison',
    ':notes' => 'En route to Heathrow Hub. Altitude 35,000ft. Telemetry normal.',
    ':checkpoint_time' => '2026-10-16 02:40:00',
]);

// Seed APX-774921-US
$stmt->execute([
    ':tracking_number' => 'APX-774921-US',
    ':sender_name' => 'Global Pharma Distribution',
    ':sender_email' => 'dispatch@globalpharma.com',
    ':sender_phone' => '+1 (555) 019-2831',
    ':origin_address' => '450 Innovation Parkway, Suite 200',
    ':origin_city' => 'Boston',
    ':origin_state' => 'MA',
    ':origin_country' => 'United States',
    ':origin_zip' => '02142',
    ':receiver_name' => 'Sarah Jenkins',
    ':receiver_email' => 's.jenkins@medtech-seattle.org',
    ':receiver_phone' => '+1 (206) 555-0149',
    ':dest_address' => '782 Rainier Avenue S',
    ':dest_city' => 'Seattle',
    ':dest_state' => 'WA',
    ':dest_country' => 'United States',
    ':dest_zip' => '98144',
    ':service_type' => 'express_air',
    ':service_name' => 'Crusaders Logistics Priority Air Express',
    ':package_type' => 'box',
    ':package_description' => 'Medical Diagnostic Equipment',
    ':pieces' => 2,
    ':weight_kg' => 14.5,
    ':chargeable_weight_kg' => 18.0,
    ':dimensions' => json_encode(['length' => 45, 'width' => 35, 'height' => 30]),
    ':declared_value' => 8500,
    ':currency' => 'USD',
    ':insurance_required' => 1,
    ':signature_required' => 1,
    ':current_status' => 'OUT_FOR_DELIVERY',
    ':status_label' => 'Out for Delivery with Local Courier Unit',
    ':estimated_delivery' => '2026-10-17 17:30:00',
    ':booked_at' => '2026-10-14 10:15:00',
    ':assigned_driver' => 'Marcus Vance (Unit #12)',
    ':vehicle_info' => 'Electric Delivery Sprinter EV-994',
    ':route_coordinates' => json_encode([
        'origin' => ['lat' => 42.3601, 'lng' => -71.0589, 'label' => 'Boston Central Depot'],
        'current' => ['lat' => 47.5800, 'lng' => -122.3100, 'label' => 'Seattle Metro Hub'],
        'destination' => ['lat' => 47.6062, 'lng' => -122.3321, 'label' => 'Rainier Ave Delivery Point'],
    ])
]);
$apxId = $pdo->lastInsertId();

$chkStmt->execute([
    ':shipment_id' => $apxId,
    ':status' => 'OUT_FOR_DELIVERY',
    ':status_title' => 'Loaded into Delivery Vehicle #12',
    ':location' => 'Seattle, WA',
    ':operator' => 'Marcus Vance',
    ':driver' => 'Marcus Vance',
    ':notes' => 'Courier en route to Rainier Ave. Contactless delivery if unavailable.',
    ':checkpoint_time' => '2026-10-17 08:15:00',
]);

// Seed Drivers
$drvStmt = $pdo->prepare("
INSERT INTO drivers (id, name, phone, vehicle_type, plate_number, status, current_city)
VALUES (:id, :name, :phone, :vehicle_type, :plate_number, :status, :current_city)
");

$drivers = [
    ['drv-1', 'David Kowalski', '+1 (555) 234-5678', 'Boeing 767 Freight (Flx-902)', 'N-880FLX', 'Active', 'New York / JFK'],
    ['drv-2', 'Marcus Vance', '+1 (206) 555-8833', 'Sprinter EV Delivery Van', 'WA-492-EV', 'On Route', 'Seattle'],
    ['drv-3', 'Elena Rostova', '+49 170 555 4912', 'Volvo FH Electric Heavy Haul', 'B-ER-991', 'Available', 'Frankfurt'],
    ['drv-4', 'Tomas Rodriguez', '+1 (718) 555-0922', 'Freightliner Cascadia Intermodal', 'NJ-771-TRK', 'Available', 'New Jersey']
];

foreach ($drivers as $d) {
    $drvStmt->execute([
        ':id' => $d[0],
        ':name' => $d[1],
        ':phone' => $d[2],
        ':vehicle_type' => $d[3],
        ':plate_number' => $d[4],
        ':status' => $d[5],
        ':current_city' => $d[6]
    ]);
}

// Seed Branches
$brStmt = $pdo->prepare("
INSERT INTO branches (id, name, code, city, country, address, phone, email, hub_type)
VALUES (:id, :name, :code, :city, :country, :address, :phone, :email, :hub_type)
");

$branches = [
    ['br-nj', 'Crusaders Logistics Americas Superhub', 'US-EWR', 'New Jersey', 'United States', '300 Kansas Ave NW, New Jersey, NJ 07030', '+1 (800) 555-CRU1', 'dispatch@crusaderslogistics.com', 'GLOBAL_HEADQUARTERS'],
    ['br-lon', 'Crusaders Logistics London Cargo Hub', 'UK-LHR', 'London', 'United Kingdom', '25 Bank Street, Canary Wharf, London E14 5JP', '+44 20 7946 0888', 'london.cargo@crusaderslogistics.com', 'EUROPEAN_GATEWAY'],
    ['br-rot', 'Crusaders Logistics Maritime Port Terminal', 'NL-RTM', 'Rotterdam', 'Netherlands', 'Havenkwartier 405, 3011 KC Rotterdam', '+31 10 992 4000', 'rotterdam@crusaderslogistics.com', 'OCEAN_FREIGHT_DEPOT'],
    ['br-sg', 'Crusaders Logistics APAC Aviation Hub', 'SG-SIN', 'Singapore', 'Singapore', 'Marina Bay Financial Centre Tower 2, Singapore 018983', '+65 6800 9000', 'apac.hub@crusaderslogistics.com', 'ASIA_PACIFIC_SUPERHUB'],
    ['br-dxb', 'Crusaders Logistics Middle East Crossdock', 'AE-DXB', 'Dubai', 'United Arab Emirates', 'Dubai Airport Freezone (DAFZA), Building 4W, Dubai', '+971 4 200 8888', 'me.hub@crusaderslogistics.com', 'CROSS_CONTINENTAL_HUB']
];

foreach ($branches as $b) {
    $brStmt->execute([
        ':id' => $b[0],
        ':name' => $b[1],
        ':code' => $b[2],
        ':city' => $b[3],
        ':country' => $b[4],
        ':address' => $b[5],
        ':phone' => $b[6],
        ':email' => $b[7],
        ':hub_type' => $b[8]
    ]);
}

// Seed Initial Notification Log
$notifStmt = $pdo->prepare("
INSERT INTO notification_logs (id, shipment_id, recipient_email, recipient_name, subject, type, status, preview_text, sent_at)
VALUES (:id, :shipment_id, :recipient_email, :recipient_name, :subject, :type, :status, :preview_text, :sent_at)
");

$notifStmt->execute([
    ':id' => 'notif-seed-01',
    ':shipment_id' => 'TRN12345',
    ':recipient_email' => 'jonathan.curr@currltd.co.uk',
    ':recipient_name' => 'Jonathan Curr',
    ':subject' => 'Crusaders Logistics Dispatch Confirmed: Waybill #TRN12345',
    ':type' => 'BOOKING_CONFIRMATION',
    ':status' => 'SENT',
    ':preview_text' => 'Consignment manifest TRN12345 confirmed for New Jersey to London Heathrow transit corridor.',
    ':sent_at' => '2026-10-15 08:31:00'
]);

$notifStmt->execute([
    ':id' => 'notif-seed-02',
    ':shipment_id' => 'TRN12345',
    ':recipient_email' => 'jonathan.curr@currltd.co.uk',
    ':recipient_name' => 'Jonathan Curr',
    ':subject' => 'Crusaders Logistics Milestone: [TRN12345] IN TRANSIT',
    ':type' => 'STATUS_UPDATE',
    ':status' => 'SENT',
    ':preview_text' => 'Flight Capt. Harrison departs JFK for London Heathrow. Altitude 35,000ft.',
    ':sent_at' => '2026-10-16 02:41:00'
]);

// Seed Initial User & Visitor Activities
$actStmt = $pdo->prepare("
INSERT INTO activities (event_type, description, entity_type, entity_id, ip_address, user_agent, metadata, created_at)
VALUES (:event_type, :description, :entity_type, :entity_id, :ip_address, :user_agent, :metadata, :created_at)
");

$activities = [
    [
        'TRACK_PARCEL',
        'Consignee Jonathan Curr queried waybill #TRN12345 telemetry from London, UK',
        'shipment',
        'TRN12345',
        '82.165.197.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
        json_encode(['status' => 'IN_TRANSIT', 'location' => 'London Heathrow Cargo Hub']),
        '2026-10-17 14:12:00'
    ],
    [
        'CALCULATE_RATE',
        'Visitor calculated shipping estimates for 215kg cargo (New Jersey -> London)',
        'rate',
        'RATE-US-UK',
        '82.165.197.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
        json_encode(['weightKg' => 215, 'service' => 'express_air']),
        '2026-10-17 14:15:30'
    ],
    [
        'SUBMIT_QUOTE',
        'Client Jonathan Curr submitted formal rate quote #QTE-2026-90412 for Electronics Spares',
        'quote',
        'QTE-2026-90412',
        '82.165.197.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
        json_encode(['rate' => 3890.50, 'origin' => 'New Jersey', 'dest' => 'London']),
        '2026-10-17 14:20:00'
    ],
    [
        'TRACK_PARCEL',
        'Visitor tracked medical consignment #APX-774921-US from Seattle, WA',
        'shipment',
        'APX-774921-US',
        '64.233.160.1',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
        json_encode(['status' => 'OUT_FOR_DELIVERY', 'driver' => 'Marcus Vance']),
        '2026-10-17 15:02:18'
    ],
    [
        'UPDATE_STATUS',
        'Courier Marcus Vance advanced APX-774921-US to OUT_FOR_DELIVERY at Seattle Metro Hub',
        'shipment',
        'APX-774921-US',
        '127.0.0.1',
        'Crusaders Logistics Mobile Courier Terminal #12',
        json_encode(['status' => 'OUT_FOR_DELIVERY', 'unit' => 'Sprinter EV #WA-492-EV']),
        '2026-10-17 15:10:00'
    ],
    [
        'CREATE_PARCEL',
        'Operations dispatcher logged master waybill #TRN12345 into Atlantic flight manifest',
        'shipment',
        'TRN12345',
        '127.0.0.1',
        'Crusaders Logistics Office Console (office.domain.com)',
        json_encode(['operator' => 'Dispatcher Miller', 'pieces' => 3, 'weight' => 215]),
        '2026-10-17 15:30:00'
    ],
    [
        'ADMIN_LOGIN',
        'Operations Manager authenticated into Corporate Office Console (office.domain.com)',
        'admin',
        'SESSION-OFFICE-01',
        '192.168.1.100',
        'Crusaders Logistics Executive Suite',
        json_encode(['host' => 'office.domain.com', 'role' => 'Super Admin']),
        '2026-10-17 16:00:00'
    ],
];

foreach ($activities as $act) {
    $actStmt->execute([
        ':event_type' => $act[0],
        ':description' => $act[1],
        ':entity_type' => $act[2],
        ':entity_id' => $act[3],
        ':ip_address' => $act[4],
        ':user_agent' => $act[5],
        ':metadata' => $act[6],
        ':created_at' => $act[7],
    ]);
}

// -----------------------------------------------------------------------------
// 7. CREATE & SEED USERS TABLE (Global Super Admin, Company Admin, Customer)
// -----------------------------------------------------------------------------
$pdo->exec("CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    raw_password VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    role_label VARCHAR(100),
    avatar VARCHAR(500),
    company VARCHAR(255),
    department VARCHAR(255),
    permissions TEXT,
    account_number VARCHAR(100),
    credit_line VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$userStmt = $pdo->prepare("INSERT OR REPLACE INTO users (
    id, username, email, password, raw_password, full_name, role, role_label, avatar, company, department, permissions, account_number, credit_line
) VALUES (
    :id, :username, :email, :password, :raw_password, :full_name, :role, :role_label, :avatar, :company, :department, :permissions, :account_number, :credit_line
)");

$seedUsers = [
    [
        'id' => 'usr-superadmin',
        'username' => 'superadmin',
        'email' => 'superadmin@crusaderslogistics.com',
        'password' => 'SuperAdmin@2026!',
        'full_name' => 'Captain Marcus Vance',
        'role' => 'super_admin',
        'role_label' => 'Global Super Admin',
        'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        'company' => 'Crusaders Logistics Global Command',
        'department' => 'Corporate Logistics Direction',
        'permissions' => json_encode(['all', 'manage_users', 'manage_parcels', 'delete_parcels', 'view_audit_trail', 'manage_fleet', 'manage_quotes']),
        'account_number' => null,
        'credit_line' => null,
    ],
    [
        'id' => 'usr-companyadmin',
        'username' => 'companyadmin',
        'email' => 'admin@crusaderslogistics.com',
        'password' => 'CompanyAdmin@2026!',
        'full_name' => 'Elena Rostova',
        'role' => 'company_admin',
        'role_label' => 'Company Dispatch Admin',
        'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        'company' => 'Crusaders Logistics Station Hub #1',
        'department' => 'Regional Dispatch & Manifest Operations',
        'permissions' => json_encode(['manage_parcels', 'update_checkpoints', 'assign_drivers', 'view_quotes', 'manage_manifests']),
        'account_number' => null,
        'credit_line' => null,
    ],
    [
        'id' => 'usr-customer',
        'username' => 'customer',
        'email' => 'customer@apextech.com',
        'password' => 'CustomerUser@2026!',
        'full_name' => 'Jonathan Curr',
        'role' => 'customer',
        'role_label' => 'Verified Customer / Shipper',
        'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        'company' => 'ApexTech Imports Ltd',
        'department' => 'Procurement & Supply Chain',
        'permissions' => json_encode(['view_my_shipments', 'book_shipments', 'request_quotes', 'download_waybills']),
        'account_number' => 'CRU-CORP-94812',
        'credit_line' => '$100,000 USD',
    ]
];

foreach ($seedUsers as $u) {
    $userStmt->execute([
        ':id' => $u['id'],
        ':username' => $u['username'],
        ':email' => $u['email'],
        ':password' => password_hash($u['password'], PASSWORD_DEFAULT),
        ':raw_password' => $u['password'],
        ':full_name' => $u['full_name'],
        ':role' => $u['role'],
        ':role_label' => $u['role_label'],
        ':avatar' => $u['avatar'],
        ':company' => $u['company'],
        ':department' => $u['department'],
        ':permissions' => $u['permissions'],
        ':account_number' => $u['account_number'],
        ':credit_line' => $u['credit_line']
    ]);
}

echo "SQLite database initialized and seeded successfully with Auth Users at: " . $dbPath . "\n";
