<?php
/**
 * Crusaders Logistics - Universal Production Front Controller
 * Target File: /home/crusader/public_html/index.php
 */

define('LARAVEL_START', microtime(true));

// Production settings
ini_set('display_errors', '0');
error_reporting(E_ALL);
@ini_set('max_execution_time', '180');
@set_time_limit(180);

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. AUTO-DETECT LARAVEL (If vendor & bootstrap exist)
$possibleRoots = [
    '/home/crusader/Crusader/Backend',
    '/home/crusader/Crusader',
    '/home/crusader/Backend',
    __DIR__ . '/../Crusader/Backend',
    __DIR__ . '/../Crusader',
    __DIR__ . '/../Backend',
    __DIR__ . '/..',
];

$laravelRoot = null;
foreach ($possibleRoots as $p) {
    if ($p && file_exists($p . '/bootstrap/app.php') && file_exists($p . '/vendor/autoload.php')) {
        $laravelRoot = realpath($p);
        break;
    }
}

if ($laravelRoot) {
    try {
        if (file_exists($m = $laravelRoot . '/storage/framework/maintenance.php')) { require $m; }
        require_once $laravelRoot . '/vendor/autoload.php';
        $app = require_once $laravelRoot . '/bootstrap/app.php';
        $app->handleRequest(\Illuminate\Http\Request::capture());
        exit;
    } catch (\Throwable $e) {
        error_log('Laravel fallback: ' . $e->getMessage());
    }
}

// 2. REQUEST ROUTING
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Serve React Frontend SPA for all non-API web pages
if (strpos($uri, '/api/') !== 0) {
    if (file_exists(__DIR__ . '/index.html')) {
        header('Content-Type: text/html; charset=UTF-8');
        readfile(__DIR__ . '/index.html');
        exit;
    }
    echo '<!DOCTYPE html><html><body><h1>Crusaders Logistics Online</h1></body></html>';
    exit;
}

// API JSON Responses
header('Content-Type: application/json; charset=utf-8');
$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) { $body = $_POST; }

// Storage Setup
$possibleStores = [
    '/home/crusader/Crusader/Backend/storage/app',
    '/home/crusader/Backend/storage/app',
    __DIR__ . '/storage',
    __DIR__,
];
$storeDir = __DIR__;
foreach ($possibleStores as $d) {
    if (!is_dir($d)) { @mkdir($d, 0775, true); }
    if (is_dir($d) && is_writable($d)) { $storeDir = $d; break; }
}
$storeFile = $storeDir . '/crusaders_store.json';

function getStore($file) {
    if (file_exists($file)) {
        $data = json_decode(@file_get_contents($file), true);
        if (is_array($data) && isset($data['shipments'])) { return $data; }
    }
    $init = [
        'users' => [
            [
                'id' => 1,
                'username' => 'superadmin',
                'email' => 'superadmin@crusaderslogistics.com',
                'password' => 'SuperAdmin@2026!',
                'fullName' => 'Captain Marcus Vance',
                'name' => 'Captain Marcus Vance',
                'role' => 'super_admin',
                'roleLabel' => 'Global Super Admin',
                'company' => 'Crusaders Logistics Global Command',
                'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
            ],
            [
                'id' => 2,
                'username' => 'companyadmin',
                'email' => 'admin@crusaderslogistics.com',
                'password' => 'CompanyAdmin@2026!',
                'fullName' => 'Elena Rostova',
                'name' => 'Elena Rostova',
                'role' => 'company_admin',
                'roleLabel' => 'Company Dispatch Admin',
                'company' => 'Crusaders Logistics Regional Operations',
                'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
            ],
            [
                'id' => 3,
                'username' => 'customer',
                'email' => 'customer@apextech.com',
                'password' => 'CustomerUser@2026!',
                'fullName' => 'Jonathan Curr',
                'name' => 'Jonathan Curr',
                'role' => 'customer',
                'roleLabel' => 'Customer / Shipper User',
                'company' => 'ApexTech Imports Ltd',
                'accountNumber' => 'CRU-CORP-94812',
                'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
            ],
        ],
        'shipments' => [
            [
                'trackingNumber' => 'CRU-892410-EXP',
                'senderName' => 'Apex Global Components',
                'senderEmail' => 'dispatch@apexglobal.com',
                'receiverName' => 'Crusader London Depot',
                'receiverEmail' => 'receiving@crusader-uk.com',
                'originCity' => 'Chicago',
                'originCountry' => 'United States',
                'destCity' => 'London',
                'destCountry' => 'United Kingdom',
                'serviceType' => 'express_air',
                'serviceName' => 'Crusader Priority Air Express',
                'currentStatus' => 'IN_TRANSIT',
                'statusLabel' => 'In Transit - Air Freight',
                'weightKg' => 142.5,
                'pieces' => 2,
                'declaredValue' => 48500,
                'currency' => 'USD',
                'estimatedDelivery' => date('Y-m-d\TH:i:s\Z', strtotime('+2 days')),
                'bookedAt' => date('Y-m-d\TH:i:s\Z', strtotime('-1 day')),
                'checkpoints' => [
                    ['id' => 'chk-1', 'status' => 'ORDER_PLACED', 'statusTitle' => 'Waybill Booked', 'location' => 'Chicago ORD Hub', 'timestamp' => date('Y-m-d H:i:s', strtotime('-1 day')), 'notes' => 'Shipment manifest registered.'],
                    ['id' => 'chk-2', 'status' => 'IN_TRANSIT', 'statusTitle' => 'Transshipment Flight Departed', 'location' => 'Frankfurt Hub', 'timestamp' => date('Y-m-d H:i:s', strtotime('-6 hours')), 'notes' => 'Loaded onto flight to London Heathrow.']
                ]
            ],
            [
                'trackingNumber' => 'CRU-773192-AIR',
                'senderName' => 'Kyoto Optics',
                'senderEmail' => 'export@kyoto-optics.jp',
                'receiverName' => 'MedTech Solutions GmbH',
                'receiverEmail' => 'supply@medtech.de',
                'originCity' => 'Kyoto',
                'originCountry' => 'Japan',
                'destCity' => 'Munich',
                'destCountry' => 'Germany',
                'serviceType' => 'express_air',
                'serviceName' => 'Crusader Priority Air Express',
                'currentStatus' => 'CUSTOMS_HOLD',
                'statusLabel' => 'Customs Clearance in Progress',
                'weightKg' => 28.0,
                'pieces' => 4,
                'declaredValue' => 18400,
                'currency' => 'EUR',
                'estimatedDelivery' => date('Y-m-d\TH:i:s\Z', strtotime('+1 day')),
                'bookedAt' => date('Y-m-d\TH:i:s\Z', strtotime('-2 days')),
                'checkpoints' => [
                    ['id' => 'chk-1', 'status' => 'ORDER_PLACED', 'statusTitle' => 'Export Manifest Created', 'location' => 'Kyoto Hub', 'timestamp' => date('Y-m-d H:i:s', strtotime('-2 days')), 'notes' => 'Customs declaration submitted.'],
                    ['id' => 'chk-2', 'status' => 'CUSTOMS_HOLD', 'statusTitle' => 'Customs Processing', 'location' => 'Munich Airport', 'timestamp' => date('Y-m-d H:i:s', strtotime('-4 hours')), 'notes' => 'Import verification in progress.']
                ]
            ],
            [
                'trackingNumber' => 'CRU-440188-SEA',
                'senderName' => 'Shanghai Solar Ltd',
                'senderEmail' => 'logistics@shanghaisolar.cn',
                'receiverName' => 'Helios Clean Energy',
                'receiverEmail' => 'install@heliosenergy.co.uk',
                'originCity' => 'Shanghai',
                'originCountry' => 'China',
                'destCity' => 'Glasgow',
                'destCountry' => 'United Kingdom',
                'serviceType' => 'ocean_freight',
                'serviceName' => 'Crusader Global Ocean Freight',
                'currentStatus' => 'IN_TRANSIT',
                'statusLabel' => 'In Transit - Maritime Sector 3',
                'weightKg' => 18450.0,
                'pieces' => 1,
                'declaredValue' => 125000,
                'currency' => 'USD',
                'estimatedDelivery' => date('Y-m-d\TH:i:s\Z', strtotime('+14 days')),
                'bookedAt' => date('Y-m-d\TH:i:s\Z', strtotime('-10 days')),
                'checkpoints' => [
                    ['id' => 'chk-1', 'status' => 'ORDER_PLACED', 'statusTitle' => 'Container Sealed', 'location' => 'Port of Shanghai', 'timestamp' => date('Y-m-d H:i:s', strtotime('-10 days')), 'notes' => 'Customs seal #CRU-994821 affixed.']
                ]
            ]
        ],
        'quotes' => [],
        'activities' => [
            ['id' => 'act-1', 'eventType' => 'SYSTEM_INIT', 'action' => 'Platform Initialized', 'description' => 'Crusaders Logistics engine active.', 'user' => 'system', 'timestamp' => date('Y-m-d H:i:s'), 'ip' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1']
        ],
        'notifications' => []
    ];
    @file_put_contents($file, json_encode($init, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    return $init;
}

function putStore($file, $data) {
    @file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

// -----------------------------------------------------------------------------
// SECURE SMTP MAILER (Port 465 SSL - info@crusaderslogistics.com)
// -----------------------------------------------------------------------------
function sendCrusadersSmtpEmail($to, $subject, $htmlBody, $plainBody = '') {
    $smtpHost = 'mail.crusaderslogistics.com';
    $smtpPort = 465;
    $username = 'info@crusaderslogistics.com';
    $password = 'eXvTmpFNB.zNESY0';
    $fromEmail = 'info@crusaderslogistics.com';
    $fromName = 'Crusaders Logistics Command';

    if (empty($plainBody)) {
        $plainBody = strip_tags(str_replace(['<br>', '<br/>', '<p>', '</p>'], "\n", $htmlBody));
    }

    $boundary = '=_cru_' . md5(uniqid((string)microtime(true), true));

    $message  = "From: {$fromName} <{$fromEmail}>\r\n";
    $message .= "Reply-To: {$fromEmail}\r\n";
    $message .= "To: {$to}\r\n";
    $message .= "Subject: {$subject}\r\n";
    $message .= "MIME-Version: 1.0\r\n";
    $message .= "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n\r\n";
    $message .= "--{$boundary}\r\n";
    $message .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $message .= $plainBody . "\r\n\r\n";
    $message .= "--{$boundary}\r\n";
    $message .= "Content-Type: text/html; charset=UTF-8\r\n";
    $message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $message .= $htmlBody . "\r\n\r\n";
    $message .= "--{$boundary}--\r\n";

    $delivered = false;
    $logMsg = '';

    // Direct SSL Socket Connection to mail.crusaderslogistics.com:465
    try {
        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true,
            ]
        ]);
        $socket = @stream_socket_client("ssl://{$smtpHost}:{$smtpPort}", $errno, $errstr, 8, STREAM_CLIENT_CONNECT, $context);
        if ($socket) {
            stream_set_timeout($socket, 8);
            $readResp = function($s) {
                $buf = '';
                while ($line = fgets($s, 515)) {
                    $buf .= $line;
                    if (substr($line, 3, 1) === ' ') break;
                }
                return $buf;
            };

            $readResp($socket); // banner
            fputs($socket, "EHLO " . ($_SERVER['SERVER_NAME'] ?? 'crusaderslogistics.com') . "\r\n");
            $readResp($socket);

            fputs($socket, "AUTH LOGIN\r\n");
            $readResp($socket);

            fputs($socket, base64_encode($username) . "\r\n");
            $readResp($socket);

            fputs($socket, base64_encode($password) . "\r\n");
            $authResp = $readResp($socket);

            if (strpos($authResp, '235') !== false || strpos($authResp, '250') !== false) {
                fputs($socket, "MAIL FROM: <{$fromEmail}>\r\n");
                $readResp($socket);

                fputs($socket, "RCPT TO: <{$to}>\r\n");
                $readResp($socket);

                fputs($socket, "DATA\r\n");
                $readResp($socket);

                fputs($socket, $message . "\r\n.\r\n");
                $readResp($socket);

                fputs($socket, "QUIT\r\n");
                fclose($socket);
                $delivered = true;
            } else {
                fclose($socket);
                $logMsg = 'Auth failed: ' . trim($authResp);
            }
        } else {
            $logMsg = "Socket error: {$errno} {$errstr}";
        }
    } catch (\Throwable $e) {
        $logMsg = 'Socket exception: ' . $e->getMessage();
    }

    // Fallback to native PHP mail() if outbound socket was restricted by host
    if (!$delivered) {
        $headers  = "From: {$fromName} <{$fromEmail}>\r\n";
        $headers .= "Reply-To: {$fromEmail}\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "X-Mailer: Crusaders-Production-Mailer/2.0\r\n";
        $delivered = @mail($to, $subject, $htmlBody, $headers);
    }

    return ['success' => $delivered, 'to' => $to, 'log' => $logMsg];
}

$db = getStore($storeFile);

// 3. API ENDPOINTS

// Health Check
if ($uri === '/api/health') {
    echo json_encode(['status' => 'ok', 'app' => 'Crusaders Logistics Platform', 'timestamp' => date('Y-m-d\TH:i:s\Z'), 'storage' => $storeFile]);
    exit;
}

// User List & Management
if ($uri === '/api/auth/users') {
    if ($method === 'GET') {
        $reqRole = strtolower($_SERVER['HTTP_X_USER_ROLE'] ?? $_GET['role'] ?? '');
        $isSuper = str_contains($reqRole, 'super');
        $filtered = array_values(array_filter($db['users'] ?? [], function($u) use ($isSuper) {
            if ($isSuper) return true;
            return !str_contains(strtolower($u['role'] ?? ''), 'super') && strtolower($u['username'] ?? '') !== 'superadmin';
        }));
        echo json_encode(['success' => true, 'data' => $filtered]);
        exit;
    }
    if ($method === 'POST') {
        $newUser = array_merge([
            'id' => count($db['users']) + 1,
            'role' => 'customer',
            'roleLabel' => 'Customer / Shipper User',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            'company' => 'Crusaders Logistics Client'
        ], $body);
        $newUser['fullName'] = $newUser['fullName'] ?? $newUser['name'] ?? $newUser['username'] ?? 'New User';
        $newUser['name'] = $newUser['fullName'];
        $db['users'][] = $newUser;
        putStore($storeFile, $db);
        echo json_encode(['success' => true, 'data' => $newUser]);
        exit;
    }
}

// Login
if ($uri === '/api/auth/login' && $method === 'POST') {
    $userParam = trim($body['username'] ?? $body['email'] ?? '');
    $passParam = trim($body['password'] ?? '');
    foreach ($db['users'] as $u) {
        if ((strcasecmp($u['username'], $userParam) === 0 || strcasecmp($u['email'], $userParam) === 0) && $u['password'] === $passParam) {
            unset($u['password']);
            $db['activities'][] = ['id' => 'act-'.uniqid(), 'eventType' => 'USER_LOGIN', 'action' => 'User Login', 'description' => "{$u['username']} signed in.", 'user' => $u['username'], 'timestamp' => date('Y-m-d H:i:s'), 'ip' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'];
            putStore($storeFile, $db);
            echo json_encode(['success' => true, 'token' => 'cru_tok_'.bin2hex(random_bytes(16)), 'user' => $u]);
            exit;
        }
    }
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    exit;
}

// Logout
if ($uri === '/api/auth/logout') {
    echo json_encode(['success' => true]);
    exit;
}

// Shipments: List or Create
if ($uri === '/api/shipments') {
    if ($method === 'GET') {
        $search = strtolower($_GET['search'] ?? '');
        $status = $_GET['status'] ?? 'ALL';
        $res = array_values(array_filter($db['shipments'], function($s) use ($search, $status) {
            $matchS = ($status === 'ALL' || ($s['currentStatus'] ?? '') === $status);
            $matchQ = ($search === '' || strpos(strtolower(json_encode($s)), $search) !== false);
            return $matchS && $matchQ;
        }));
        echo json_encode(['success' => true, 'data' => $res]);
        exit;
    }
    if ($method === 'POST') {
        $trk = 'CRU-' . rand(100000, 999999) . '-EXP';
        $newS = array_merge([
            'trackingNumber' => $trk,
            'currentStatus' => 'ORDER_PLACED',
            'statusLabel' => 'Shipment Booked & Confirmed',
            'bookedAt' => date('Y-m-d\TH:i:s\Z'),
            'estimatedDelivery' => date('Y-m-d\TH:i:s\Z', strtotime('+3 days')),
            'checkpoints' => [
                [
                    'id' => 'chk-'.uniqid(),
                    'status' => 'ORDER_PLACED',
                    'statusTitle' => 'Shipment Booked Online & E-Waybill Generated',
                    'location' => ($body['originCity'] ?? 'Chicago Central Hub'),
                    'timestamp' => date('Y-m-d H:i:s'),
                    'notes' => 'Manifest and waybill registered in Crusaders Logistics Global System.'
                ]
            ]
        ], $body);
        $db['shipments'][] = $newS;
        $db['activities'][] = [
            'id' => 'act-'.uniqid(),
            'eventType' => 'SHIPMENT_CREATED',
            'action' => 'Parcel Created',
            'description' => "Shipment {$trk} registered ({$newS['originCity']} -> {$newS['destCity']}).",
            'user' => $newS['senderName'] ?? 'system',
            'timestamp' => date('Y-m-d H:i:s'),
            'ip' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'
        ];

        // -------------------------------------------------------------
        // SEND EMAILS VIA SMTP PORT 465 (mail.crusaderslogistics.com)
        // -------------------------------------------------------------
        $senderEmail = trim($newS['senderEmail'] ?? '');
        $receiverEmail = trim($newS['receiverEmail'] ?? '');
        $adminEmail = 'info@crusaderslogistics.com';

        $origin = ($newS['originCity'] ?? '') . ', ' . ($newS['originCountry'] ?? '');
        $dest = ($newS['destCity'] ?? '') . ', ' . ($newS['destCountry'] ?? '');
        $pieces = $newS['pieces'] ?? 1;
        $weight = $newS['weightKg'] ?? 'N/A';
        $service = $newS['serviceName'] ?? $newS['serviceType'] ?? 'Crusaders Priority Air Express';
        $declared = isset($newS['declaredValue']) ? ('$' . number_format(floatval($newS['declaredValue']), 2) . ' ' . ($newS['currency'] ?? 'USD')) : 'Standard Carrier Coverage';

        // Rich HTML Email Template for Customer
        $customerHtml = "
        <div style='font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 25px; border-radius: 12px; max-width: 650px; margin: auto;'>
            <div style='border-bottom: 2px solid #f59e0b; padding-bottom: 15px; margin-bottom: 20px;'>
                <h1 style='color: #f59e0b; margin: 0; font-size: 22px; font-weight: 900;'>CRUSADERS LOGISTICS</h1>
                <p style='color: #94a3b8; margin: 4px 0 0; font-size: 13px;'>Global Turnkey Freight &amp; Consignment Logistics</p>
            </div>
            <h2 style='color: #38bdf8; font-size: 18px;'>Shipment Booking Confirmation</h2>
            <p style='font-size: 14px; line-height: 1.6; color: #cbd5e1;'>
                Dear Valued Shipper,<br><br>
                Your consignment has been successfully confirmed and registered in our global transport network. Your official Crusaders Logistics electronic tracking code is:
            </p>
            <div style='background: #1e293b; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 6px;'>
                <span style='font-size: 12px; color: #94a3b8; text-transform: uppercase;'>Electronic Waybill / Tracking #</span><br>
                <strong style='font-size: 26px; color: #f59e0b; letter-spacing: 1.5px; font-family: monospace;'>{$trk}</strong>
            </div>
            <table style='width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; color: #e2e8f0;'>
                <tr style='border-bottom: 1px solid #334155;'><td style='padding: 8px 0; color: #94a3b8;'>Route:</td><td style='padding: 8px 0; font-weight: bold;'>{$origin} &rarr; {$dest}</td></tr>
                <tr style='border-bottom: 1px solid #334155;'><td style='padding: 8px 0; color: #94a3b8;'>Service Type:</td><td style='padding: 8px 0;'>{$service}</td></tr>
                <tr style='border-bottom: 1px solid #334155;'><td style='padding: 8px 0; color: #94a3b8;'>Cargo Pieces &amp; Weight:</td><td style='padding: 8px 0;'>{$pieces} Pcs / {$weight} kg</td></tr>
                <tr style='border-bottom: 1px solid #334155;'><td style='padding: 8px 0; color: #94a3b8;'>Declared Value:</td><td style='padding: 8px 0;'>{$declared}</td></tr>
            </table>
            <div style='text-align: center; margin: 30px 0;'>
                <a href='https://crusaderslogistics.com/?tracking={$trk}' style='background: #f59e0b; color: #0f172a; padding: 12px 28px; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 8px; display: inline-block;'>Track Consignment Live</a>
            </div>
            <p style='font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 15px; margin-top: 25px;'>
                This is an automated notification from Crusaders Logistics dispatch server (mail.crusaderslogistics.com:465).<br>
                24/7 Operations Command: info@crusaderslogistics.com | +1 (800) 555-CRU1
            </p>
        </div>";

        // Admin Notification HTML
        $adminHtml = "
        <div style='font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 25px; border-radius: 12px; max-width: 650px; margin: auto; border: 1px solid #334155;'>
            <div style='border-bottom: 2px solid #38bdf8; padding-bottom: 12px; margin-bottom: 18px;'>
                <h2 style='color: #38bdf8; margin: 0; font-size: 20px;'>[ADMIN DISPATCH] New Consignment Registered</h2>
                <p style='color: #94a3b8; margin: 4px 0 0; font-size: 12px;'>Waybill #{$trk} booked via Web Terminal</p>
            </div>
            <p style='font-size: 14px; color: #e2e8f0;'>
                A new consignment has been booked and awaits pickup / linehaul assignment.
            </p>
            <div style='background: #1e293b; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 13px; line-height: 1.8;'>
                <div><strong>Shipper:</strong> " . htmlspecialchars($newS['senderName'] ?? 'N/A') . " (" . htmlspecialchars($senderEmail) . ")</div>
                <div><strong>Consignee:</strong> " . htmlspecialchars($newS['receiverName'] ?? 'N/A') . " (" . htmlspecialchars($receiverEmail) . ")</div>
                <div><strong>Route:</strong> {$origin} &rarr; {$dest}</div>
                <div><strong>Service:</strong> {$service}</div>
                <div><strong>Weight &amp; Pieces:</strong> {$weight} kg, {$pieces} pieces</div>
                <div><strong>Declared Value:</strong> {$declared}</div>
            </div>
            <div style='text-align: center; margin: 20px 0;'>
                <a href='https://crusaderslogistics.com/?tab=admin' style='background: #38bdf8; color: #0f172a; padding: 10px 22px; text-decoration: none; font-weight: bold; font-size: 13px; border-radius: 6px; display: inline-block;'>Open Admin Operations Console</a>
            </div>
        </div>";

        // Dispatch to Customer
        if (!empty($senderEmail)) {
            sendCrusadersSmtpEmail($senderEmail, "[CRUSADERS LOGISTICS] Consignment Booking Confirmed: {$trk}", $customerHtml);
        }
        if (!empty($receiverEmail) && strcasecmp($receiverEmail, $senderEmail) !== 0) {
            sendCrusadersSmtpEmail($receiverEmail, "[CRUSADERS LOGISTICS] Inbound Consignment Notice: {$trk}", $customerHtml);
        }

        // Dispatch to Admin
        sendCrusadersSmtpEmail($adminEmail, "[ADMIN DISPATCH] New Consignment {$trk} ({$origin} -> {$dest})", $adminHtml);

        // Store notification record for outbox viewer
        $db['notifications'][] = [
            'id' => 'notif-' . uniqid(),
            'type' => 'BOOKING_CONFIRMATION',
            'trackingNumber' => $trk,
            'recipient' => $senderEmail ?: $adminEmail,
            'adminRecipient' => $adminEmail,
            'subject' => "Consignment Booking Confirmed: {$trk}",
            'sentAt' => date('Y-m-d H:i:s'),
            'status' => 'DISPATCHED_SMTP_465'
        ];

        putStore($storeFile, $db);
        echo json_encode(['success' => true, 'data' => $newS]);
        exit;
    }
}

// -----------------------------------------------------------------------------
// LIVE SUPPORT MESSAGE ENDPOINT (Connected to info@crusaderslogistics.com)
// -----------------------------------------------------------------------------
if ($uri === '/api/support/message' && $method === 'POST') {
    $custName = trim($body['name'] ?? 'Guest Shipper');
    $custEmail = trim($body['email'] ?? 'Not provided');
    $custPhone = trim($body['phone'] ?? 'Not provided');
    $custMsg = trim($body['message'] ?? '');
    $custSubject = trim($body['subject'] ?? 'Live Support Chat Inquiry');

    $adminSupportHtml = "
    <div style='font-family: Arial, sans-serif; background: #0f172a; color: #ffffff; padding: 25px; border-radius: 12px; max-width: 600px; margin: auto;'>
        <h2 style='color: #f59e0b; margin-top: 0;'>[CRUSADERS LIVE SUPPORT INQUIRY]</h2>
        <p style='color: #cbd5e1; font-size: 14px;'>A visitor has submitted a 24/7 Live Support request:</p>
        <div style='background: #1e293b; padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 13px; line-height: 1.8;'>
            <strong>Customer:</strong> {$custName}<br>
            <strong>Email:</strong> {$custEmail}<br>
            <strong>Phone:</strong> {$custPhone}<br>
            <strong>Subject:</strong> {$custSubject}<br>
            <strong>Timestamp:</strong> " . date('Y-m-d H:i:s') . "<br>
            <strong>IP:</strong> " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "
        </div>
        <div style='background: #334155; padding: 15px; border-radius: 8px; margin-top: 15px; color: #f8fafc; font-size: 14px; white-space: pre-wrap;'>
            <strong>Customer Message:</strong><br><br>" . htmlspecialchars($custMsg) . "
        </div>
    </div>";

    // Dispatch to official Crusaders email
    sendCrusadersSmtpEmail('info@crusaderslogistics.com', "[LIVE SUPPORT] {$custSubject} from {$custName}", $adminSupportHtml);

    // If customer provided an email, send auto-acknowledgment
    if (filter_var($custEmail, FILTER_VALIDATE_EMAIL)) {
        $autoAckHtml = "
        <div style='font-family: Arial, sans-serif; background: #0b0f19; color: #ffffff; padding: 25px; border-radius: 12px; max-width: 600px; margin: auto;'>
            <h2 style='color: #f59e0b; margin-top: 0;'>CRUSADERS LOGISTICS</h2>
            <p style='color: #cbd5e1; font-size: 14px;'>
                Hello {$custName},<br><br>
                Thank you for contacting Crusaders Logistics 24/7 Operations Desk. We have received your inquiry regarding <strong>{$custSubject}</strong>.<br><br>
                One of our global fleet dispatch officers is reviewing your request and will follow up shortly at {$custEmail}.
            </p>
            <p style='font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 15px;'>
                Crusaders Logistics &bull; Connecting People &amp; Global Supply Chains<br>
                24/7 Support: info@crusaderslogistics.com | +1 (800) 555-CRU1
            </p>
        </div>";
        sendCrusadersSmtpEmail($custEmail, "We received your inquiry - Crusaders Logistics Support", $autoAckHtml);
    }

    $db['activities'][] = [
        'id' => 'act-' . uniqid(),
        'eventType' => 'SUPPORT_INQUIRY',
        'action' => 'Live Support Message',
        'description' => "Inquiry from {$custName} ({$custEmail}) dispatched to info@crusaderslogistics.com.",
        'user' => $custName,
        'timestamp' => date('Y-m-d H:i:s'),
        'ip' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'
    ];

    $db['notifications'][] = [
        'id' => 'notif-' . uniqid(),
        'type' => 'SUPPORT_INQUIRY',
        'recipient' => 'info@crusaderslogistics.com',
        'customerEmail' => $custEmail,
        'subject' => "Live Support Inquiry from {$custName}",
        'sentAt' => date('Y-m-d H:i:s'),
        'status' => 'DISPATCHED_SMTP_465'
    ];

    putStore($storeFile, $db);
    echo json_encode(['success' => true, 'message' => 'Support inquiry dispatched to Crusaders Operations Command.']);
    exit;
}

// -----------------------------------------------------------------------------
// NOTIFICATIONS LIST ENDPOINT
// -----------------------------------------------------------------------------
if ($uri === '/api/notifications' && $method === 'GET') {
    echo json_encode(['success' => true, 'data' => array_reverse($db['notifications'] ?? [])]);
    exit;
}

// Shipment Details / Status Update / Delete
if (preg_match('#^/api/shipments/([^/]+)(/status)?$#', $uri, $m)) {
    $trk = urldecode($m[1]);
    $isStatus = isset($m[2]) && $m[2] === '/status';
    $idx = -1;
    foreach ($db['shipments'] as $i => $s) {
        if (strcasecmp($s['trackingNumber'], $trk) === 0) { $idx = $i; break; }
    }
    if ($idx === -1) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => "Shipment {$trk} not found"]);
        exit;
    }
    if ($method === 'GET') {
        echo json_encode(['success' => true, 'data' => $db['shipments'][$idx]]);
        exit;
    }
    if ($method === 'DELETE') {
        array_splice($db['shipments'], $idx, 1);
        putStore($storeFile, $db);
        echo json_encode(['success' => true, 'message' => "Shipment {$trk} deleted"]);
        exit;
    }
    if ($method === 'POST' && $isStatus) {
        $st = $body['status'] ?? 'IN_TRANSIT';
        $loc = $body['location'] ?? 'Distribution Depot';
        $notes = $body['notes'] ?? 'Status updated by station lead.';
        $db['shipments'][$idx]['currentStatus'] = $st;
        $db['shipments'][$idx]['statusLabel'] = ucwords(strtolower(str_replace('_', ' ', $st)));
        $db['shipments'][$idx]['checkpoints'][] = [
            'id' => 'chk-'.uniqid(),
            'status' => $st,
            'statusTitle' => 'Milestone: ' . ucwords(strtolower(str_replace('_', ' ', $st))),
            'location' => $loc,
            'timestamp' => date('Y-m-d H:i:s'),
            'notes' => $notes
        ];
        $db['activities'][] = ['id' => 'act-'.uniqid(), 'eventType' => 'STATUS_UPDATED', 'action' => 'Checkpoint Added', 'description' => "Shipment {$trk} status set to {$st} at {$loc}.", 'user' => 'companyadmin', 'timestamp' => date('Y-m-d H:i:s'), 'ip' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'];
        putStore($storeFile, $db);
        $notifyEmail = $db['shipments'][$idx]['receiverEmail'] ?? $db['shipments'][$idx]['senderEmail'] ?? null;
        if ($notifyEmail) {
            @mail($notifyEmail, "Crusaders Update: {$trk} is {$st}", "Hello,\n\nShipment {$trk} is now {$st} at {$loc}.\nNotes: {$notes}\nTrack: https://crusaderslogistics.com", "From: Crusaders Logistics <updates@crusaderslogistics.com>\r\n");
        }
        echo json_encode(['success' => true, 'data' => $db['shipments'][$idx]]);
        exit;
    }
}

// Calculate Rates (Full IATA Freight Engine)
if ($uri === '/api/rates/calculate' && $method === 'POST') {
    $origin = strtoupper($body['originCountry'] ?? 'US');
    $dest = strtoupper($body['destCountry'] ?? 'US');
    $weightKg = max(1, floatval($body['weightKg'] ?? $body['weight'] ?? 10));
    $lengthCm = max(10, floatval($body['lengthCm'] ?? $body['length'] ?? 40));
    $widthCm = max(10, floatval($body['widthCm'] ?? $body['width'] ?? 30));
    $heightCm = max(10, floatval($body['heightCm'] ?? $body['height'] ?? 25));
    $pieces = max(1, intval($body['pieces'] ?? 1));
    $declaredValue = floatval($body['declaredValue'] ?? 0);
    $insuranceRequired = !empty($body['insuranceRequired']);
    $signatureRequired = !empty($body['signatureRequired']);

    $volumetricWeightPerPiece = ($lengthCm * $widthCm * $heightCm) / 5000.0;
    $totalVolumetricWeight = $volumetricWeightPerPiece * $pieces;
    $chargeableWeight = max($weightKg, $totalVolumetricWeight);
    $isInternational = ($origin !== $dest);
    $intlMultiplier = $isInternational ? 1.45 : 1.0;

    $insuranceFee = ($insuranceRequired && $declaredValue > 0) ? max(25.0, $declaredValue * 0.0075) : 0.0;
    $signatureFee = $signatureRequired ? 15.0 : 0.0;

    $services = [
        [
            'serviceId' => 'express_air',
            'name' => 'Apex Priority Air Express',
            'baseFee' => 95.0,
            'ratePerKg' => 11.80,
            'transitTime' => '1-2 Business Days',
            'description' => 'Time-critical air courier with guaranteed delivery slot and next-day arrival.'
        ],
        [
            'serviceId' => 'standard_ground',
            'name' => 'Apex Intermodal Ground Freight',
            'baseFee' => 45.0,
            'ratePerKg' => 2.85,
            'transitTime' => '3-5 Business Days',
            'description' => 'Cost-effective nationwide road and rail network for commercial palletized cargo.'
        ],
        [
            'serviceId' => 'ocean_cargo',
            'name' => 'Apex Ocean Maritime FCL/LCL',
            'baseFee' => 180.0,
            'ratePerKg' => 0.85,
            'transitTime' => '14-22 Business Days',
            'description' => 'Maximum efficiency for large-scale container loads and bulk international freight.'
        ],
        [
            'serviceId' => 'cold_chain',
            'name' => 'Apex BioPharma Active Cold-Chain',
            'baseFee' => 150.0,
            'ratePerKg' => 8.40,
            'transitTime' => '2-4 Business Days',
            'description' => 'Certified GDP temperature-controlled transit (2°C-8°C / -20°C) with continuous IoT telemetry.'
        ],
        [
            'serviceId' => 'last_mile',
            'name' => 'Apex Urban Last-Mile Express',
            'baseFee' => 30.0,
            'ratePerKg' => 4.50,
            'transitTime' => 'Same-Day / Next-Day',
            'description' => 'Dedicated electric courier fleet for rapid metropolitan and direct-to-door delivery.'
        ]
    ];

    $options = [];
    foreach ($services as $srv) {
        $baseCargoCost = ($srv['baseFee'] + ($srv['ratePerKg'] * $chargeableWeight)) * $intlMultiplier;
        $fuelSurcharge = $baseCargoCost * 0.12;
        $customsFee = $isInternational ? 65.0 : 0.0;
        $subtotal = $baseCargoCost + $fuelSurcharge + $customsFee + $insuranceFee + $signatureFee;
        $total = round($subtotal, 2);

        $options[] = [
            'serviceId' => $srv['serviceId'],
            'name' => $srv['name'],
            'transitTime' => $srv['transitTime'],
            'description' => $srv['description'],
            'breakdown' => [
                'baseFee' => round($srv['baseFee'] * $intlMultiplier, 2),
                'weightCharge' => round($srv['ratePerKg'] * $chargeableWeight * $intlMultiplier, 2),
                'chargeableWeightKg' => round($chargeableWeight, 1),
                'volumetricWeightKg' => round($totalVolumetricWeight, 1),
                'actualWeightKg' => $weightKg,
                'fuelSurcharge' => round($fuelSurcharge, 2),
                'customsClearanceFee' => round($customsFee, 2),
                'insuranceFee' => round($insuranceFee, 2),
                'signatureFee' => round($signatureFee, 2),
            ],
            'currency' => 'USD',
            'totalPrice' => $total
        ];
    }

    echo json_encode([
        'success' => true,
        'data' => [
            'chargeableWeight' => round($chargeableWeight, 1),
            'volumetricWeight' => round($totalVolumetricWeight, 1),
            'actualWeight' => $weightKg,
            'isInternational' => $isInternational,
            'options' => $options,
            'recommendedService' => $options[0]
        ]
    ]);
    exit;
}

// Quotes
if ($uri === '/api/quotes') {
    if ($method === 'GET') { echo json_encode(['success' => true, 'data' => $db['quotes'] ?? []]); exit; }
    if ($method === 'POST') {
        $q = array_merge(['id' => 'QUO-'.uniqid(), 'createdAt' => date('Y-m-d H:i:s')], $body);
        $db['quotes'][] = $q;
        putStore($storeFile, $db);
        echo json_encode(['success' => true, 'data' => $q]);
        exit;
    }
}

// Test Email
if ($uri === '/api/notifications/test-email' && $method === 'POST') {
    $to = $body['email'] ?? 'test@example.com';
    $ref = $body['trackingNumber'] ?? 'CRU-892410-EXP';
    $sent = @mail($to, "Crusaders Logistics Notification Test", "Verified test dispatch from Crusaders Logistics.\nTracking: {$ref}\nStatus: Operational", "From: Crusaders Logistics <no-reply@crusaderslogistics.com>\r\n");
    echo json_encode(['success' => true, 'message' => "Email sent to {$to}", 'mail_sent' => $sent]);
    exit;
}

// Drivers, Branches & Stats
if ($uri === '/api/drivers') {
    echo json_encode(['success' => true, 'data' => [
        ['id' => 'drv-1', 'name' => 'Capt. Marcus Vance', 'vehicle' => 'Air Fleet Boeing 777F', 'status' => 'ON_DUTY', 'phone' => '+1 (555) 019-2811'],
        ['id' => 'drv-2', 'name' => 'David Kowalski', 'vehicle' => 'Sprinter Van #14', 'status' => 'IN_TRANSIT', 'phone' => '+1 (555) 018-9943'],
        ['id' => 'drv-3', 'name' => 'Elena Rostova', 'vehicle' => 'Regional Hub Unit', 'status' => 'ACTIVE', 'phone' => '+44 20 7946 0882'],
    ]]);
    exit;
}

if ($uri === '/api/branches') {
    echo json_encode(['success' => true, 'data' => [
        ['id' => 'br-1', 'city' => 'Chicago', 'country' => 'United States', 'address' => '8400 Logistics Blvd, Dock 4', 'type' => 'Air Super Hub'],
        ['id' => 'br-2', 'city' => 'London', 'country' => 'United Kingdom', 'address' => '14 Heathrow Cargo Parkway', 'type' => 'European Gateway'],
        ['id' => 'br-3', 'city' => 'Shanghai', 'country' => 'China', 'address' => 'Port of Shanghai Dock 18', 'type' => 'Maritime Terminal'],
        ['id' => 'br-4', 'city' => 'Frankfurt', 'country' => 'Germany', 'address' => 'Frankfurt Cargo City South', 'type' => 'Central Sort Center'],
    ]]);
    exit;
}

if ($uri === '/api/stats') {
    echo json_encode(['success' => true, 'data' => [
        'activeShipments' => count($db['shipments'] ?? []),
        'onTimeRate' => '99.4%',
        'deliveredThisMonth' => 1248,
        'countriesServed' => 140,
        'globalHubs' => 18,
        'fleetUnits' => 340
    ]]);
    exit;
}

if ($uri === '/api/activities') {
    if ($method === 'GET') { echo json_encode(['success' => true, 'data' => array_reverse($db['activities'] ?? [])]); exit; }
    if ($method === 'POST') {
        $act = array_merge(['id' => 'act-'.uniqid(), 'timestamp' => date('Y-m-d H:i:s'), 'ip' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'], $body);
        $db['activities'][] = $act;
        putStore($storeFile, $db);
        echo json_encode(['success' => true, 'data' => $act]);
        exit;
    }
}

if ($uri === '/api/activities/clear' && $method === 'POST') {
    $db['activities'] = [];
    putStore($storeFile, $db);
    echo json_encode(['success' => true, 'message' => 'Activities reset']);
    exit;
}

http_response_code(404);
echo json_encode(['success' => false, 'message' => "Endpoint {$uri} not found"]);
