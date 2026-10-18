import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data with realistic enterprise logistics shipments
const SEED_DATA = {
  shipments: [
    {
      trackingNumber: "APX-774921-US",
      senderName: "Apex Global Supplies Corp",
      senderEmail: "dispatch@apexsupplies.com",
      senderPhone: "+1 (312) 555-0199",
      originAddress: "8400 Logistics Blvd, Dock 4",
      originCity: "Chicago",
      originState: "IL",
      originCountry: "United States",
      originZip: "60666",
      receiverName: "Nexus Tech Hardware",
      receiverEmail: "receiving@nexustech.io",
      receiverPhone: "+1 (415) 555-0142",
      destAddress: "350 Mission Street, Suite 1200",
      destCity: "San Francisco",
      destState: "CA",
      destCountry: "United States",
      destZip: "94105",
      serviceType: "express_air",
      serviceName: "Apex Priority Air Express (Next-Day)",
      packageType: "pallet",
      packageDescription: "Precision Server Racks & Semiconductor Components",
      pieces: 2,
      weightKg: 142.5,
      dimensions: { length: 120, width: 80, height: 160 },
      chargeableWeightKg: 307.2,
      declaredValue: 48500,
      currency: "USD",
      insuranceRequired: true,
      signatureRequired: true,
      currentStatus: "IN_TRANSIT",
      statusLabel: "In Transit - Intermodal Transfer",
      estimatedDelivery: "2026-10-14T14:30:00Z",
      bookedAt: "2026-10-11T09:15:00Z",
      assignedDriver: "David Kowalski (Flight Lead / Fleet 42)",
      vehicleInfo: "Boeing 767-300F / Flight APX-902",
      routeCoordinates: {
        origin: { lat: 41.8781, lng: -87.6298, label: "Chicago O'Hare Int'l Cargo Hub" },
        current: { lat: 39.7392, lng: -104.9903, label: "Denver Rocky Mountain Relay Station" },
        destination: { lat: 37.7749, lng: -122.4194, label: "San Francisco Distribution Depot" }
      },
      checkpoints: [
        {
          id: "chk-1",
          status: "ORDER_PLACED",
          statusTitle: "Shipment Order Confirmed & Waybill Issued",
          location: "Chicago, IL, USA",
          timestamp: "2026-10-11T09:15:00Z",
          operator: "System Automated Dispatch",
          notes: "Electronic shipping manifest generated. Commercial invoice validated."
        },
        {
          id: "chk-2",
          status: "PICKED_UP",
          statusTitle: "Cargo Collected by Apex Freight Feeder",
          location: "Chicago Logistics Blvd, IL",
          timestamp: "2026-10-11T13:40:00Z",
          operator: "Driver D. Miller (Unit #218)",
          notes: "2 high-value pallets inspected, barcode scanned, sealed with security tag #APX-99382."
        },
        {
          id: "chk-3",
          status: "IN_TRANSIT",
          statusTitle: "Processed at Central Air Hub & Loaded onto Flight",
          location: "Chicago O'Hare Air Cargo Hub (ORD)",
          timestamp: "2026-10-12T01:20:00Z",
          operator: "Ramp Agent K. Zhang",
          notes: "Loaded into Unit Load Device (ULD #PMC-7712). Departed ORD."
        },
        {
          id: "chk-4",
          status: "IN_TRANSIT",
          statusTitle: "In Transit: Midway Sorting & Cross-Dock Scan",
          location: "Denver Gateway Sort Hub, CO",
          timestamp: "2026-10-12T11:15:00Z",
          operator: "Terminal Lead M. Torres",
          notes: "Cross-dock transfer completed. Scheduled for final sector flight to SFO at 18:00."
        }
      ]
    },
    {
      trackingNumber: "APX-304912-EU",
      senderName: "EuroChem BioTech B.V.",
      senderEmail: "logistics@eurochem.nl",
      senderPhone: "+31 10 555 4912",
      originAddress: "Maasvlakte Haven 820",
      originCity: "Rotterdam",
      originState: "South Holland",
      originCountry: "Netherlands",
      originZip: "3199 LK",
      receiverName: "Charité Universitätsmedizin Berlin",
      receiverEmail: "apotheke-supply@charite.de",
      receiverPhone: "+49 30 450 500",
      destAddress: "Charitéplatz 1",
      destCity: "Berlin",
      destState: "Berlin",
      destCountry: "Germany",
      destZip: "10117",
      serviceType: "cold_chain",
      serviceName: "Apex Pharma Cold-Chain 2-8°C Active Temp",
      packageType: "parcel",
      packageDescription: "Refrigerated Oncology Pharmaceuticals & Bio-reagents",
      pieces: 4,
      weightKg: 28.0,
      dimensions: { length: 50, width: 40, height: 40 },
      chargeableWeightKg: 32.0,
      declaredValue: 92000,
      currency: "EUR",
      insuranceRequired: true,
      signatureRequired: true,
      currentStatus: "OUT_FOR_DELIVERY",
      statusLabel: "Out for Delivery - Courier On Route",
      estimatedDelivery: "2026-10-12T17:00:00Z",
      bookedAt: "2026-10-10T14:00:00Z",
      assignedDriver: "Marcus Vance (Sprinter Van Temp-Reg #B-AP-492)",
      vehicleInfo: "Mercedes Sprinter EV Cool-Tech",
      routeCoordinates: {
        origin: { lat: 51.9244, lng: 4.4777, label: "Rotterdam Port Terminal" },
        current: { lat: 52.5200, lng: 13.4050, label: "Berlin Central Delivery Zone" },
        destination: { lat: 52.5255, lng: 13.3776, label: "Charité Hospital Medical Depot" }
      },
      checkpoints: [
        {
          id: "chk-eu-1",
          status: "ORDER_PLACED",
          statusTitle: "Order Confirmed - Cold Storage Allocated",
          location: "Rotterdam, Netherlands",
          timestamp: "2026-10-10T14:00:00Z",
          operator: "Pharma Dispatch Team",
          notes: "Calibrated data logger serial #LOG-4491 activated at 3.8°C."
        },
        {
          id: "chk-eu-2",
          status: "PICKED_UP",
          statusTitle: "Collected via Temperature Controlled Truck",
          location: "Rotterdam Port, Netherlands",
          timestamp: "2026-10-11T08:30:00Z",
          operator: "Driver J. Van Houten",
          notes: "Verified constant temp 4.1°C at handover. Sealed."
        },
        {
          id: "chk-eu-3",
          status: "IN_TRANSIT",
          statusTitle: "Customs Border Transit & Cross-Border Scan",
          location: "Hannover Freight Node, Germany",
          timestamp: "2026-10-11T22:15:00Z",
          operator: "Lead Dispatcher Hans Weber",
          notes: "Telemetry confirms unbroken cold-chain adherence (4.0°C)."
        },
        {
          id: "chk-eu-4",
          status: "OUT_FOR_DELIVERY",
          statusTitle: "Loaded on Final Mile Medical Courier",
          location: "Berlin Distribution Center, Germany",
          timestamp: "2026-10-12T07:45:00Z",
          operator: "Courier Marcus Vance",
          notes: "Dispatched for urgent delivery before 17:00. Hospital pharmacy contacted."
        }
      ]
    },
    {
      trackingNumber: "APX-992100-AS",
      senderName: "Pacific Ocean Marine Components",
      senderEmail: "exports@pacificmarine.sg",
      senderPhone: "+65 6789 0123",
      originAddress: "10 Pasir Panjang Road",
      originCity: "Singapore",
      originState: "Singapore",
      originCountry: "Singapore",
      originZip: "118538",
      receiverName: "California Nautical Works",
      receiverEmail: "procurement@calnautical.com",
      receiverPhone: "+1 (562) 555-8910",
      destAddress: "1150 Pier F Ave",
      destCity: "Long Beach",
      destState: "CA",
      destCountry: "United States",
      destZip: "90802",
      serviceType: "ocean_cargo",
      serviceName: "Apex Ocean Standard FCL 40ft High-Cube",
      packageType: "container",
      packageDescription: "Marine Propellers, Bronze Shaft Assemblies & Deck Hardware",
      pieces: 1,
      weightKg: 18400.0,
      dimensions: { length: 1219, width: 244, height: 289 },
      chargeableWeightKg: 18400.0,
      declaredValue: 240000,
      currency: "USD",
      insuranceRequired: true,
      signatureRequired: true,
      currentStatus: "DELIVERED",
      statusLabel: "Delivered & Signed for by Consignee",
      estimatedDelivery: "2026-10-12T10:00:00Z",
      bookedAt: "2026-09-22T08:00:00Z",
      assignedDriver: "Long Beach Terminal Drayage Team #14",
      vehicleInfo: "Freightliner Cascadia Drayage Rig",
      routeCoordinates: {
        origin: { lat: 1.3521, lng: 103.8198, label: "Port of Singapore PSA" },
        current: { lat: 33.7701, lng: -118.1937, label: "Port of Long Beach Pier F" },
        destination: { lat: 33.7701, lng: -118.1937, label: "California Nautical Works Dock" }
      },
      checkpoints: [
        {
          id: "chk-as-1",
          status: "ORDER_PLACED",
          statusTitle: "Bill of Lading APX-BL-88192 Issued",
          location: "Singapore PSA Hub",
          timestamp: "2026-09-22T08:00:00Z",
          operator: "Marine Freight Booking",
          notes: "Container #MSKU-9948271 booked on vessel Apex Voyager v.24W."
        },
        {
          id: "chk-as-2",
          status: "PICKED_UP",
          statusTitle: "Container Gated In at PSA Terminal",
          location: "Port of Singapore",
          timestamp: "2026-09-24T16:20:00Z",
          operator: "Port Crane Operator C-12",
          notes: "Loaded into bay 14. Customs export clearance approved."
        },
        {
          id: "chk-as-3",
          status: "IN_TRANSIT",
          statusTitle: "Vessel Arrived & US CBP Customs Cleared",
          location: "Port of Long Beach, CA, USA",
          timestamp: "2026-10-10T19:00:00Z",
          operator: "Apex US Customs Brokerage",
          notes: "Full US Customs and Border Protection release granted. 3461 clearance signed."
        },
        {
          id: "chk-as-4",
          status: "DELIVERED",
          statusTitle: "Delivered to Consignee Facility & Unloaded",
          location: "Long Beach, CA, USA",
          timestamp: "2026-10-12T10:14:00Z",
          operator: "Drayage Driver T. Rodriguez",
          notes: "Container seal verified intact #SG-993821. Signed by Warehouse Mgr J. Miller."
        }
      ]
    }
  ],
  quotes: [
    {
      id: "QT-88419",
      clientName: "Global Retail Innovations",
      clientEmail: "ops@globalretail.org",
      originCity: "Shenzhen, China",
      destCity: "Rotterdam, Netherlands",
      cargoType: "Consumer Electronics (Smartphones & Accessories)",
      weightKg: 2450,
      serviceType: "express_air",
      estimatedRate: 14700,
      currency: "USD",
      status: "QUOTED",
      createdAt: "2026-10-12T12:30:00Z",
      notes: "Requires lithium battery declaration compliance (UN3481)."
    }
  ],
  notifications: [
    {
      id: "notif-001",
      shipmentId: "APX-774921-US",
      recipientEmail: "receiving@nexustech.io",
      recipientName: "Nexus Tech Hardware",
      type: "STATUS_UPDATE",
      subject: "Crusaders Logistics Alert: Shipment APX-774921-US is IN TRANSIT (Denver Sort Hub)",
      sentAt: "2026-10-12T11:15:30Z",
      status: "DELIVERED",
      channel: "EMAIL",
      previewText: "Your priority air freight cargo has completed cross-dock scan in Denver, CO and is scheduled for San Francisco transfer."
    },
    {
      id: "notif-002",
      shipmentId: "APX-304912-EU",
      recipientEmail: "apotheke-supply@charite.de",
      recipientName: "Charité Universitätsmedizin Berlin",
      type: "OUT_FOR_DELIVERY",
      subject: "Urgent Delivery Alert: Apex Cold-Chain APX-304912-EU is OUT FOR DELIVERY",
      sentAt: "2026-10-12T07:46:10Z",
      status: "DELIVERED",
      channel: "EMAIL",
      previewText: "Driver Marcus Vance is en route in temperature-regulated vehicle #B-AP-492. Estimated delivery before 17:00."
    },
    {
      id: "notif-003",
      shipmentId: "APX-992100-AS",
      recipientEmail: "procurement@calnautical.com",
      recipientName: "California Nautical Works",
      type: "DELIVERY_CONFIRMATION",
      subject: "Proof of Delivery: Shipment APX-992100-AS successfully DELIVERED",
      sentAt: "2026-10-12T10:15:00Z",
      status: "DELIVERED",
      channel: "EMAIL",
      previewText: "Consignee delivery completed at Pier F dock. Signed by J. Miller."
    }
  ],
  drivers: [
    { id: "drv-1", name: "David Kowalski", vehicle: "Boeing 767 Freight APX-902", status: "Active", rating: 4.9, activeShipments: 1 },
    { id: "drv-2", name: "Marcus Vance", vehicle: "Sprinter EV Cool-Tech (#B-AP-492)", status: "On Route", rating: 5.0, activeShipments: 1 },
    { id: "drv-3", name: "Elena Rostova", vehicle: "Volvo FH Electric Heavy Haul", status: "Available", rating: 4.8, activeShipments: 0 },
    { id: "drv-4", name: "Tomas Rodriguez", vehicle: "Freightliner Cascadia Drayage", status: "Available", rating: 4.9, activeShipments: 0 }
  ],
  branches: [
    { id: "br-ny", city: "New York", country: "United States", address: "One World Trade Center, Suite 4800, New York, NY 10007", phone: "+1 (800) 555-CRU1", email: "nyc.hub@crusaderslogistics.com", hours: "24/7 Dispatch" },
    { id: "br-rot", city: "Rotterdam", country: "Netherlands", address: "Havenkwartier 405, 3011 KC Rotterdam", phone: "+31 10 992 4000", email: "rotterdam@crusaderslogistics.com", hours: "Mon-Sat 06:00 - 22:00 CET" },
    { id: "br-sg", city: "Singapore", country: "Singapore", address: "Marina Bay Financial Centre Tower 2, Singapore 018983", phone: "+65 6800 9000", email: "apac.hub@crusaderslogistics.com", hours: "24/7 Marine Operations" },
    { id: "br-dxb", city: "Dubai", country: "United Arab Emirates", address: "Dubai Airport Freezone (DAFZA), Building 4W, Dubai", phone: "+971 4 200 8888", email: "me.hub@crusaderslogistics.com", hours: "Sun-Thu 08:00 - 20:00 GST" },
    { id: "br-lon", city: "London", country: "United Kingdom", address: "25 Bank Street, Canary Wharf, London E14 5JP", phone: "+44 20 7946 0888", email: "london.cargo@crusaderslogistics.com", hours: "Mon-Fri 07:00 - 19:00 GMT" }
  ],
  users: [
    {
      id: "usr-superadmin",
      username: "superadmin",
      email: "superadmin@crusaderslogistics.com",
      password: "SuperAdmin@2026!",
      fullName: "Captain Marcus Vance",
      role: "super_admin",
      roleLabel: "Global Super Admin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      company: "Crusaders Logistics Global Command",
      department: "Corporate Logistics Direction",
      permissions: ["all", "manage_users", "manage_parcels", "delete_parcels", "view_audit_trail", "manage_fleet", "manage_quotes"]
    },
    {
      id: "usr-companyadmin",
      username: "companyadmin",
      email: "admin@crusaderslogistics.com",
      password: "CompanyAdmin@2026!",
      fullName: "Elena Rostova",
      role: "company_admin",
      roleLabel: "Company Dispatch Admin",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      company: "Crusaders Logistics Station Hub #1",
      department: "Regional Dispatch & Manifest Operations",
      permissions: ["manage_parcels", "update_checkpoints", "assign_drivers", "view_quotes", "manage_manifests"]
    },
    {
      id: "usr-customer",
      username: "customer",
      email: "customer@apextech.com",
      password: "CustomerUser@2026!",
      fullName: "Jonathan Curr",
      role: "customer",
      roleLabel: "Verified Customer / Shipper",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      company: "ApexTech Imports Ltd",
      accountNumber: "CRU-CORP-94812",
      creditLine: "$100,000 USD",
      permissions: ["view_my_shipments", "book_shipments", "request_quotes", "download_waybills"]
    }
  ]
};

// Database class that persists to JSON file
class Database {
  constructor() {
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.data = { ...SEED_DATA };
        this.save();
      }
    } catch (err) {
      console.error('Error loading DB file, fallback to seed:', err);
      this.data = { ...SEED_DATA };
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving DB file:', err);
    }
  }

  getAllShipments() {
    return this.data.shipments;
  }

  getShipment(trackingNumber) {
    if (!trackingNumber) return null;
    const clean = trackingNumber.trim().toUpperCase();
    return this.data.shipments.find(s => s.trackingNumber.toUpperCase() === clean) || null;
  }

  createShipment(shipmentData) {
    const trackingNumber = shipmentData.trackingNumber || `APX-${Math.floor(100000 + Math.random() * 900000)}-${(shipmentData.destCountry || 'GL').substring(0, 2).toUpperCase()}`;
    const newShipment = {
      ...shipmentData,
      trackingNumber,
      currentStatus: shipmentData.currentStatus || "ORDER_PLACED",
      statusLabel: "Order Placed & Confirmed",
      bookedAt: new Date().toISOString(),
      checkpoints: [
        {
          id: `chk-${Date.now()}-1`,
          status: "ORDER_PLACED",
          statusTitle: "Order Booked & Electronic Waybill Created",
          location: `${shipmentData.originCity || 'Origin Hub'}, ${shipmentData.originCountry || ''}`,
          timestamp: new Date().toISOString(),
          operator: "Self-Service Customer Booking Portal",
          notes: "Booking confirmation sent. Pickup order queued for local fleet dispatch."
        }
      ]
    };

    this.data.shipments.unshift(newShipment);
    this.save();
    return newShipment;
  }

  updateShipmentStatus(trackingNumber, { status, statusTitle, location, operator, notes, driver, eta }) {
    const shipment = this.getShipment(trackingNumber);
    if (!shipment) return null;

    shipment.currentStatus = status;
    if (statusTitle) shipment.statusLabel = statusTitle;
    if (driver) shipment.assignedDriver = driver;
    if (eta) shipment.estimatedDelivery = eta;

    const checkpoint = {
      id: `chk-${Date.now()}`,
      status,
      statusTitle: statusTitle || `Status updated to ${status.replace('_', ' ')}`,
      location: location || shipment.destCity || "Transit Hub",
      timestamp: new Date().toISOString(),
      operator: operator || "Operations Command Center",
      notes: notes || "Checkpoint verified."
    };

    shipment.checkpoints.push(checkpoint);

    // Update current simulated coords if location provided
    if (status === 'DELIVERED') {
      shipment.statusLabel = 'Delivered & Signed for by Consignee';
      if (shipment.routeCoordinates && shipment.routeCoordinates.destination) {
        shipment.routeCoordinates.current = shipment.routeCoordinates.destination;
      }
    } else if (status === 'OUT_FOR_DELIVERY') {
      shipment.statusLabel = 'Out for Final Delivery';
    }

    this.save();
    return { shipment, checkpoint };
  }

  addNotification(notification) {
    const record = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sentAt: new Date().toISOString(),
      status: "SENT",
      channel: "EMAIL",
      ...notification
    };
    this.data.notifications.unshift(record);
    this.save();
    return record;
  }

  getNotifications() {
    return this.data.notifications;
  }

  createQuote(quoteData) {
    const id = `QT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newQuote = {
      id,
      ...quoteData,
      status: "SUBMITTED",
      createdAt: new Date().toISOString()
    };
    this.data.quotes.unshift(newQuote);
    this.save();
    return newQuote;
  }

  getQuotes() {
    return this.data.quotes;
  }

  getDrivers() {
    return this.data.drivers;
  }

  getBranches() {
    return this.data.branches;
  }

  getStats() {
    const total = this.data.shipments.length;
    const inTransit = this.data.shipments.filter(s => s.currentStatus === 'IN_TRANSIT' || s.currentStatus === 'OUT_FOR_DELIVERY').length;
    const delivered = this.data.shipments.filter(s => s.currentStatus === 'DELIVERED').length;
    const booked = this.data.shipments.filter(s => s.currentStatus === 'ORDER_PLACED' || s.currentStatus === 'PICKED_UP').length;
    const notificationsCount = this.data.notifications.length;
    const quotesCount = this.data.quotes.length;

    return {
      totalShipments: total,
      inTransit,
      delivered,
      pendingPickup: booked,
      notificationsSent: notificationsCount,
      quoteRequests: quotesCount,
      onTimeRate: "99.4%",
      activeCountries: 142
    };
  }

  deleteShipment(trackingNumber) {
    if (!this.data.shipments) return false;
    const initialLen = this.data.shipments.length;
    this.data.shipments = this.data.shipments.filter(s => s.trackingNumber !== trackingNumber);
    if (this.data.shipments.length !== initialLen) {
      this.save();
      this.createActivity({
        eventType: 'ADMIN_ACTION',
        description: `Admin removed parcel #${trackingNumber} from operations manifest`,
        entityType: 'shipment',
        entityId: trackingNumber
      });
      return true;
    }
    return false;
  }

  getActivities(filter = {}) {
    if (!this.data.activities) {
      this.data.activities = [
        {
          id: 'act-1',
          eventType: 'TRACK_PARCEL',
          description: 'Consignee Jonathan Curr queried waybill #TRN12345 telemetry from London, UK',
          entityType: 'shipment',
          entityId: 'TRN12345',
          ipAddress: '82.165.197.1',
          userAgent: 'Desktop Browser (Chrome/128)',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 'act-2',
          eventType: 'CALCULATE_RATE',
          description: 'Visitor calculated shipping estimates for 215kg cargo (New Jersey -> London)',
          entityType: 'rate',
          entityId: 'RATE-US-UK',
          ipAddress: '82.165.197.1',
          userAgent: 'Desktop Browser (Chrome/128)',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'act-3',
          eventType: 'CREATE_PARCEL',
          description: 'Operations dispatcher logged master waybill #TRN12345 into Atlantic flight manifest',
          entityType: 'shipment',
          entityId: 'TRN12345',
          ipAddress: '127.0.0.1',
          userAgent: 'Crusaders Logistics Office Console (office.domain.com)',
          timestamp: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 'act-4',
          eventType: 'ADMIN_LOGIN',
          description: 'Operations Manager authenticated into Corporate Office Console (office.domain.com)',
          entityType: 'admin',
          entityId: 'SESSION-OFFICE-01',
          ipAddress: '192.168.1.100',
          userAgent: 'Crusaders Logistics Executive Suite',
          timestamp: new Date().toISOString()
        }
      ];
      this.save();
    }

    let list = this.data.activities;
    if (filter.eventType && filter.eventType !== 'ALL') {
      list = list.filter(a => a.eventType === filter.eventType);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(a => (a.description || '').toLowerCase().includes(q) || (a.entityId || '').toLowerCase().includes(q));
    }
    return list;
  }

  createActivity(act) {
    if (!this.data.activities) this.data.activities = [];
    const item = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ipAddress: act.ipAddress || '127.0.0.1',
      userAgent: act.userAgent || 'Browser Client',
      ...act
    };
    this.data.activities.unshift(item);
    if (this.data.activities.length > 200) {
      this.data.activities = this.data.activities.slice(0, 200);
    }
    this.save();
    return item;
  }

  clearActivities() {
    this.data.activities = [
      {
        id: `act-${Date.now()}`,
        eventType: 'ADMIN_ACTION',
        description: 'Admin cleared visitor activity log',
        entityType: 'admin',
        entityId: 'SYS-CLEAR',
        ipAddress: '127.0.0.1',
        userAgent: 'Crusaders Logistics Office Console',
        timestamp: new Date().toISOString()
      }
    ];
    this.save();
    return true;
  }

  // User Authentication Methods
  getUsers() {
    if (!this.data.users) {
      this.data.users = [...SEED_DATA.users];
      this.save();
    }
    return this.data.users.map(({ password, ...safeUser }) => safeUser);
  }

  findUser(identifier) {
    if (!this.data.users) {
      this.data.users = [...SEED_DATA.users];
      this.save();
    }
    const clean = (identifier || '').trim().toLowerCase();
    return this.data.users.find(u => 
      u.username.toLowerCase() === clean || 
      u.email.toLowerCase() === clean
    );
  }

  authenticate(identifier, password) {
    const user = this.findUser(identifier);
    if (!user) return null;
    if (user.password === password) {
      const { password: _, ...safeUser } = user;
      return safeUser;
    }
    return null;
  }
}

export const db = new Database();
