// ─── User Roles ──────────────────────────────────────────────────────────────
const ROLES = {
    CITIZEN:     'citizen',
    DEPT_ADMIN:  'dept_admin',
    SUPER_ADMIN: 'super_admin',
  };
  
  // ─── Departments ─────────────────────────────────────────────────────────────
  const DEPARTMENTS = {
    ELECTRICITY:  'electricity',
    GAS:          'gas',
    WATER:        'water',
    MUNICIPALITY: 'municipality',
  };
  
  // ─── Service Ports ───────────────────────────────────────────────────────────
  const PORTS = {
    API_GATEWAY:          3000,
    AUTH_SERVICE:         3001,
    CITIZEN_SERVICE:      3002,
    ELECTRICITY_SERVICE:  3003,
    GAS_SERVICE:          3004,
    WATER_SERVICE:        3005,
    MUNICIPALITY_SERVICE: 3006,
    PAYMENT_SERVICE:      3007,
    GRIEVANCE_SERVICE:    3008,
    NOTIFICATION_SERVICE: 3009,
    REPORT_SERVICE:       3010,
  
    // Dummy department servers (your friend's work)
    DUMMY_ELECTRICITY:    4001,
    DUMMY_GAS:            4002,
    DUMMY_WATER:          4003,
    DUMMY_MUNICIPALITY:   4004,
  };
  
  // ─── Complaint / Application Statuses ────────────────────────────────────────
  const STATUS = {
    PENDING:     'pending',
    IN_PROGRESS: 'in_progress',
    RESOLVED:    'resolved',
    REJECTED:    'rejected',
    APPROVED:    'approved',
  };
  
  // ─── Payment Statuses ────────────────────────────────────────────────────────
  const PAYMENT_STATUS = {
    PENDING:   'pending',
    SUCCESS:   'success',
    FAILED:    'failed',
    REFUNDED:  'refunded',
  };
  
  // ─── JWT Config ──────────────────────────────────────────────────────────────
  const JWT_CONFIG = {
    CITIZEN_EXPIRY:     '30m',   // short — shared kiosk
    ADMIN_EXPIRY:       '8h',    // full workday
    OTP_EXPIRY_MINUTES: 10,
  };
  
  // ─── OTP Config ──────────────────────────────────────────────────────────────
  const OTP_CONFIG = {
    LENGTH:          6,
    EXPIRY_MINUTES:  10,
    MAX_ATTEMPTS:    3,
  };
  
  module.exports = {
    ROLES,
    DEPARTMENTS,
    PORTS,
    STATUS,
    PAYMENT_STATUS,
    JWT_CONFIG,
    OTP_CONFIG,
  };