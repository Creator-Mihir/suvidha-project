-- ============================================================
-- SUVIDHA - Seed Data for Testing
-- Run after schema.sql
-- Password for all test accounts: "Test@1234" (bcrypt hashed)
-- ============================================================

-- ─── AUTH_DB ────────────────────────────────────────────────
\connect auth_db

-- Test citizen (login via OTP: mobile 9999900001)
INSERT INTO users (id, mobile, full_name, email, role) VALUES
  ('11111111-1111-1111-1111-111111111111', '9999900001', 'Ramesh Kumar', 'ramesh@test.com', 'citizen'),
  ('11111111-1111-1111-1111-111111111112', '9999900002', 'Sunita Devi', 'sunita@test.com', 'citizen'),
  ('11111111-1111-1111-1111-111111111113', '9999900003', 'Ajay Singh', 'ajay@test.com', 'citizen')
ON CONFLICT DO NOTHING;

-- Test dept admins (login via username/password)
-- password hash = bcrypt("Admin@1234")
INSERT INTO dept_admins (id, username, password_hash, full_name, department, district, state) VALUES
  ('22222222-2222-2222-2222-222222222201', 'elec_admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVsl8RBKE.', 'Electricity Admin', 'electricity', 'Indore', 'Madhya Pradesh'),
  ('22222222-2222-2222-2222-222222222202', 'gas_admin',  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVsl8RBKE.', 'Gas Admin', 'gas', 'Indore', 'Madhya Pradesh'),
  ('22222222-2222-2222-2222-222222222203', 'water_admin','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVsl8RBKE.', 'Water Admin', 'water', 'Indore', 'Madhya Pradesh'),
  ('22222222-2222-2222-2222-222222222204', 'muni_admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVsl8RBKE.', 'Municipality Admin', 'municipality', 'Indore', 'Madhya Pradesh')
ON CONFLICT DO NOTHING;

-- Test super admin
INSERT INTO super_admins (id, username, password_hash, full_name, level, region) VALUES
  ('33333333-3333-3333-3333-333333333301', 'super_admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVsl8RBKE.', 'Super Admin MP', 'state', 'Madhya Pradesh')
ON CONFLICT DO NOTHING;


-- ─── CITIZEN_DB ─────────────────────────────────────────────
\connect citizen_db

INSERT INTO citizen_profiles (user_id, full_name, address, city, state, pincode) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Ramesh Kumar', '12 MG Road, Vijay Nagar', 'Indore', 'Madhya Pradesh', '452010'),
  ('11111111-1111-1111-1111-111111111112', 'Sunita Devi', '45 Palasia Square', 'Indore', 'Madhya Pradesh', '452001'),
  ('11111111-1111-1111-1111-111111111113', 'Ajay Singh', '7 Bhawarkua Main Road', 'Indore', 'Madhya Pradesh', '452015')
ON CONFLICT DO NOTHING;

INSERT INTO citizen_connections (user_id, department, connection_id) VALUES
  ('11111111-1111-1111-1111-111111111111', 'electricity', 'EL-2024-00123'),
  ('11111111-1111-1111-1111-111111111111', 'gas',         'GAS-IND-45678'),
  ('11111111-1111-1111-1111-111111111111', 'water',       'WT-IND-98321'),
  ('11111111-1111-1111-1111-111111111112', 'electricity', 'EL-2024-00456'),
  ('11111111-1111-1111-1111-111111111112', 'water',       'WT-IND-11200')
ON CONFLICT DO NOTHING;


-- ─── ELECTRICITY_DB ─────────────────────────────────────────
\connect electricity_db

INSERT INTO connections (user_id, k_no, consumer_name, address, connection_type, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'EL-2024-00123', 'Ramesh Kumar', '12 MG Road, Vijay Nagar, Indore', 'domestic', 'active'),
  ('11111111-1111-1111-1111-111111111112', 'EL-2024-00456', 'Sunita Devi',  '45 Palasia Square, Indore', 'domestic', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO bills (user_id, k_no, bill_number, units_consumed, amount, due_date, bill_date, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'EL-2024-00123', 'BILL-EL-001', 245.00, 1890.00, '2026-03-15', '2026-02-15', 'unpaid'),
  ('11111111-1111-1111-1111-111111111111', 'EL-2024-00123', 'BILL-EL-002', 198.00, 1540.00, '2026-02-15', '2026-01-15', 'paid'),
  ('11111111-1111-1111-1111-111111111112', 'EL-2024-00456', 'BILL-EL-003', 310.00, 2380.00, '2026-03-15', '2026-02-15', 'unpaid')
ON CONFLICT DO NOTHING;


-- ─── GAS_DB ─────────────────────────────────────────────────
\connect gas_db

INSERT INTO connections (user_id, gas_id, consumer_name, address, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'GAS-IND-45678', 'Ramesh Kumar', '12 MG Road, Vijay Nagar, Indore', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO bills (user_id, gas_id, bill_number, units_consumed, amount, due_date, bill_date, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'GAS-IND-45678', 'BILL-GAS-001', 32.50, 975.00, '2026-03-10', '2026-02-10', 'unpaid'),
  ('11111111-1111-1111-1111-111111111111', 'GAS-IND-45678', 'BILL-GAS-002', 28.00, 840.00, '2026-02-10', '2026-01-10', 'paid')
ON CONFLICT DO NOTHING;


-- ─── WATER_DB ───────────────────────────────────────────────
\connect water_db

INSERT INTO connections (user_id, water_id, consumer_name, address, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'WT-IND-98321', 'Ramesh Kumar', '12 MG Road, Vijay Nagar, Indore', 'active'),
  ('11111111-1111-1111-1111-111111111112', 'WT-IND-11200', 'Sunita Devi',  '45 Palasia Square, Indore', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO bills (user_id, water_id, bill_number, units_consumed, amount, due_date, bill_date, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'WT-IND-98321', 'BILL-WT-001', 18.00, 450.00, '2026-03-20', '2026-02-20', 'unpaid'),
  ('11111111-1111-1111-1111-111111111112', 'WT-IND-11200', 'BILL-WT-002', 22.00, 550.00, '2026-03-20', '2026-02-20', 'unpaid')
ON CONFLICT DO NOTHING;


-- ─── PAYMENT_DB ─────────────────────────────────────────────
\connect payment_db

INSERT INTO transactions (user_id, department, connection_id, amount, payment_method, status, paid_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'electricity', 'EL-2024-00123', 1540.00, 'upi',  'success', '2026-01-20 10:30:00'),
  ('11111111-1111-1111-1111-111111111111', 'gas',         'GAS-IND-45678',  840.00, 'card', 'success', '2026-01-15 14:45:00'),
  ('11111111-1111-1111-1111-111111111112', 'electricity', 'EL-2024-00456', 2100.00, 'upi',  'success', '2026-01-18 09:15:00')
ON CONFLICT DO NOTHING;