-- ============================================================
-- SUVIDHA - Complete Database Schema
-- Run each block in its respective database
-- ============================================================


-- ============================================================
-- 1. AUTH_DB
--    Contains: users, admins, super_admins, otps, sessions
-- ============================================================
\connect auth_db

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mobile          VARCHAR(15) UNIQUE NOT NULL,
  password_hash   VARCHAR(255),               -- NULL if OTP-only user
  full_name       VARCHAR(100),
  email           VARCHAR(100),
  aadhaar_last4   VARCHAR(4),
  role            VARCHAR(20) DEFAULT 'citizen' CHECK (role IN ('citizen', 'dept_admin', 'super_admin')),
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS otps (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mobile          VARCHAR(15) NOT NULL,
  otp_code        VARCHAR(6) NOT NULL,
  expires_at      TIMESTAMP NOT NULL,
  is_used         BOOLEAN DEFAULT FALSE,
  attempts        INT DEFAULT 0,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dept_admins (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username        VARCHAR(50) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  full_name       VARCHAR(100),
  department      VARCHAR(30) NOT NULL CHECK (department IN ('electricity', 'gas', 'water', 'municipality')),
  district        VARCHAR(100),
  state           VARCHAR(100),
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS super_admins (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username        VARCHAR(50) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  full_name       VARCHAR(100),
  level           VARCHAR(20) CHECK (level IN ('state', 'district')),
  region          VARCHAR(100),
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  token_hash      VARCHAR(255),
  role            VARCHAR(20),
  expires_at      TIMESTAMP NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_otps_mobile ON otps(mobile);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);


-- ============================================================
-- 2. CITIZEN_DB
--    Contains: citizen profiles + their dept connection IDs
-- ============================================================
\connect citizen_db

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS citizen_profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID UNIQUE NOT NULL,   -- references auth_db.users.id
  full_name       VARCHAR(100),
  address         TEXT,
  city            VARCHAR(100),
  state           VARCHAR(100),
  pincode         VARCHAR(10),
  profile_photo   VARCHAR(255),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- Stores all department connection IDs for a citizen
CREATE TABLE IF NOT EXISTS citizen_connections (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  department      VARCHAR(30) NOT NULL CHECK (department IN ('electricity', 'gas', 'water', 'municipality')),
  connection_id   VARCHAR(50) NOT NULL,   -- k_no / water_id / gas_id / municipality_id
  is_primary      BOOLEAN DEFAULT TRUE,
  linked_at       TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, department, connection_id)
);

CREATE INDEX idx_citizen_connections_user ON citizen_connections(user_id);


-- ============================================================
-- 3. ELECTRICITY_DB
-- ============================================================
\connect electricity_db

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS connections (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  k_no            VARCHAR(50) UNIQUE NOT NULL,
  consumer_name   VARCHAR(100),
  address         TEXT,
  connection_type VARCHAR(30),   -- 'domestic', 'commercial', 'industrial'
  sanctioned_load VARCHAR(20),
  status          VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'disconnected')),
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bills (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  k_no            VARCHAR(50) NOT NULL,
  bill_number     VARCHAR(50) UNIQUE,
  units_consumed  DECIMAL(10,2),
  amount          DECIMAL(10,2) NOT NULL,
  due_date        DATE,
  bill_date       DATE,
  status          VARCHAR(20) DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'overdue')),
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meter_readings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  k_no            VARCHAR(50) NOT NULL,
  reading         DECIMAL(10,2),
  reading_date    DATE,
  submitted_by    VARCHAR(20) DEFAULT 'system',  -- 'citizen' | 'system' | 'officer'
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaints (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  k_no            VARCHAR(50),
  complaint_no    VARCHAR(50) UNIQUE,
  category        VARCHAR(50),   -- 'billing', 'outage', 'meter', 'new_connection', 'other'
  description     TEXT,
  status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
  assigned_to     VARCHAR(100),
  resolved_at     TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS new_connection_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  applicant_name  VARCHAR(100),
  address         TEXT,
  connection_type VARCHAR(30),
  documents       TEXT[],        -- array of file paths
  status          VARCHAR(20) DEFAULT 'pending',
  remarks         TEXT,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_elec_bills_user ON bills(user_id);
CREATE INDEX idx_elec_complaints_user ON complaints(user_id);


-- ============================================================
-- 4. GAS_DB
-- ============================================================
\connect gas_db

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS connections (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  gas_id          VARCHAR(50) UNIQUE NOT NULL,
  consumer_name   VARCHAR(100),
  address         TEXT,
  connection_type VARCHAR(30),
  status          VARCHAR(20) DEFAULT 'active',
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bills (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  gas_id          VARCHAR(50) NOT NULL,
  bill_number     VARCHAR(50) UNIQUE,
  units_consumed  DECIMAL(10,2),
  amount          DECIMAL(10,2) NOT NULL,
  due_date        DATE,
  bill_date       DATE,
  status          VARCHAR(20) DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'overdue')),
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaints (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  gas_id          VARCHAR(50),
  complaint_no    VARCHAR(50) UNIQUE,
  category        VARCHAR(50),
  description     TEXT,
  status          VARCHAR(20) DEFAULT 'pending',
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS new_connection_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  applicant_name  VARCHAR(100),
  address         TEXT,
  documents       TEXT[],
  status          VARCHAR(20) DEFAULT 'pending',
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_gas_bills_user ON bills(user_id);
CREATE INDEX idx_gas_complaints_user ON complaints(user_id);


-- ============================================================
-- 5. WATER_DB
-- ============================================================
\connect water_db

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS connections (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  water_id        VARCHAR(50) UNIQUE NOT NULL,
  consumer_name   VARCHAR(100),
  address         TEXT,
  connection_type VARCHAR(30),
  status          VARCHAR(20) DEFAULT 'active',
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bills (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  water_id        VARCHAR(50) NOT NULL,
  bill_number     VARCHAR(50) UNIQUE,
  units_consumed  DECIMAL(10,2),
  amount          DECIMAL(10,2) NOT NULL,
  due_date        DATE,
  bill_date       DATE,
  status          VARCHAR(20) DEFAULT 'unpaid',
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaints (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  water_id        VARCHAR(50),
  complaint_no    VARCHAR(50) UNIQUE,
  category        VARCHAR(50),
  description     TEXT,
  status          VARCHAR(20) DEFAULT 'pending',
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS new_connection_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  applicant_name  VARCHAR(100),
  address         TEXT,
  documents       TEXT[],
  status          VARCHAR(20) DEFAULT 'pending',
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_water_bills_user ON bills(user_id);
CREATE INDEX idx_water_complaints_user ON complaints(user_id);


-- ============================================================
-- 6. MUNICIPALITY_DB
-- ============================================================
\connect municipality_db

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS service_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  municipality_id VARCHAR(50),
  service_type    VARCHAR(50),  -- 'birth_certificate', 'death_certificate', 'trade_license', 'waste_pickup', etc.
  description     TEXT,
  documents       TEXT[],
  status          VARCHAR(20) DEFAULT 'pending',
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certificates (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  cert_type       VARCHAR(50),
  cert_number     VARCHAR(50) UNIQUE,
  file_path       VARCHAR(255),
  issued_at       TIMESTAMP,
  valid_till      DATE,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaints (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  complaint_no    VARCHAR(50) UNIQUE,
  category        VARCHAR(50),   -- 'sanitation', 'road', 'streetlight', 'drainage', 'other'
  description     TEXT,
  location        TEXT,
  photo_path      VARCHAR(255),
  status          VARCHAR(20) DEFAULT 'pending',
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_municipality_requests_user ON service_requests(user_id);


-- ============================================================
-- 7. PAYMENT_DB
-- ============================================================
\connect payment_db

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS transactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  department      VARCHAR(30) NOT NULL,
  connection_id   VARCHAR(50),             -- k_no / gas_id / water_id
  bill_ref_id     UUID,                    -- bill id from respective dept DB
  amount          DECIMAL(10,2) NOT NULL,
  gateway_ref     VARCHAR(100),            -- payment gateway transaction ID
  payment_method  VARCHAR(30),             -- 'upi', 'card', 'netbanking', 'cash'
  status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  paid_at         TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS receipts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id  UUID NOT NULL REFERENCES transactions(id),
  receipt_number  VARCHAR(50) UNIQUE,
  file_path       VARCHAR(255),
  generated_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_user ON transactions(user_id);
CREATE INDEX idx_payment_dept ON transactions(department);
CREATE INDEX idx_payment_status ON transactions(status);


-- ============================================================
-- 8. GRIEVANCE_DB
--    Cross-department unified complaints view
-- ============================================================
\connect grievance_db

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS grievances (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  department      VARCHAR(30) NOT NULL,
  dept_complaint_id UUID,                  -- complaint id in dept DB
  complaint_no    VARCHAR(50) UNIQUE,
  category        VARCHAR(50),
  description     TEXT,
  priority        VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status          VARCHAR(20) DEFAULT 'pending',
  assigned_dept_admin UUID,
  escalated_to    UUID,                    -- super_admin id if escalated
  resolved_at     TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS grievance_updates (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grievance_id    UUID NOT NULL REFERENCES grievances(id),
  updated_by      UUID,
  update_note     TEXT,
  status_changed_to VARCHAR(20),
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_grievance_user ON grievances(user_id);
CREATE INDEX idx_grievance_dept ON grievances(department);
CREATE INDEX idx_grievance_status ON grievances(status);


-- ============================================================
-- 9. NOTIFICATION_DB
-- ============================================================
\connect notification_db

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS notifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL,
  type            VARCHAR(30),   -- 'bill_due', 'complaint_update', 'payment_success', 'outage_alert', 'otp'
  title           VARCHAR(100),
  message         TEXT,
  department      VARCHAR(30),
  is_read         BOOLEAN DEFAULT FALSE,
  sent_via        VARCHAR(20) DEFAULT 'in_app',  -- 'sms', 'in_app', 'both'
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notification_user ON notifications(user_id);
CREATE INDEX idx_notification_read ON notifications(user_id, is_read);