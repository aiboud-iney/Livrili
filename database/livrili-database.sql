CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP VIEW IF EXISTS routes_with_details;
DROP VIEW IF EXISTS shipments_with_details;
DROP VIEW IF EXISTS trucks_with_details;

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS trucks CASCADE;
DROP TABLE IF EXISTS plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS shipment_type_enum CASCADE;
DROP TYPE IF EXISTS truck_type_enum CASCADE;
DROP TYPE IF EXISTS route_type_enum CASCADE;
DROP TYPE IF EXISTS user_type_enum CASCADE;

CREATE TYPE shipment_type_enum AS ENUM (
  'GENERAL_CARGO', 'PALLETIZED', 'PACKAGED', 'LOOSE_CARGO',
  'REFRIGERATED', 'FROZEN', 'DRY_FOOD', 'BEVERAGES', 'LIVESTOCK',
  'RAW_MATERIALS', 'STEEL_METAL', 'CHEMICALS', 'HAZARDOUS', 'CONSTRUCTION', 'MACHINERY',
  'OVERSIZE', 'HEAVY_LIFT', 'VEHICLES', 'FRAGILE', 'MEDICAL', 'ELECTRONICS',
  'DRY_BULK', 'LIQUID_BULK', 'AGRICULTURAL_BULK'
);

CREATE TYPE truck_type_enum AS ENUM (
  'DRY_VAN', 'REEFER', 'FLATBED', 'BOX_TRUCK', 'CONTAINER',
  'HOT_SHOT', 'CONESTOGA', 'STEP_DECK', 'CARGO_VAN'
);

CREATE TYPE route_type_enum AS ENUM ('ONE_WAY', 'ROUND_TRIP');
CREATE TYPE user_type_enum AS ENUM ('user', 'admin');

CREATE TABLE users (
  id                          SERIAL PRIMARY KEY,
  email                       VARCHAR(255) NOT NULL UNIQUE,
  password                    VARCHAR(255) NOT NULL,
  business_name               VARCHAR(255) NOT NULL,
  phone_number                VARCHAR(50),
  tin_nif                     VARCHAR(100),
  trade_register              VARCHAR(100),
  user_type                   user_type_enum NOT NULL DEFAULT 'user',
  -- verified = email confirmed (via verification code); verification = identity verified by admin
  verified                    BOOLEAN NOT NULL DEFAULT false,
  verification                BOOLEAN NOT NULL DEFAULT false,
  verification_code           VARCHAR(10),
  verification_date           TIMESTAMPTZ,
  more_details                TEXT,
  category                    VARCHAR(100),
  headquarters_address        TEXT,
  profile_picture             TEXT,
  reset_token                 VARCHAR(255),
  reset_token_expiry          TIMESTAMPTZ,

  verification_status         VARCHAR(20) DEFAULT 'not_requested'
                              CONSTRAINT users_verification_status_check
                              CHECK (verification_status IN ('not_requested', 'pending', 'verified', 'rejected')),
  verification_requested_at   TIMESTAMPTZ,
  verification_rejected_reason TEXT,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_business_name ON users(business_name);
CREATE INDEX idx_users_verification_status ON users(verification_status);

CREATE TABLE trucks (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(255),
  truck_type      truck_type_enum NOT NULL,
  max_tonnage     NUMERIC(10,2),
  max_volume      NUMERIC(10,2),
  license_plate   VARCHAR(50),
  truck_pictures  TEXT[] DEFAULT '{}',
  created_by      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trucks_created_by ON trucks(created_by);
CREATE INDEX idx_trucks_truck_type ON trucks(truck_type);

CREATE TABLE routes (
  id                SERIAL PRIMARY KEY,
  posted_by         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  origin            VARCHAR(255) NOT NULL,
  destination       VARCHAR(255) NOT NULL,
  transit_cities    JSONB NOT NULL DEFAULT '[]',
  departure_date    DATE,
  end_date          DATE,
  max_weight        NUMERIC(10,2),
  max_volume        NUMERIC(10,2),
  phone_country_code VARCHAR(10),
  contact_phone     VARCHAR(50),
  notes             TEXT,
  truck_type        truck_type_enum,
  route_type        route_type_enum DEFAULT 'ONE_WAY',
  assigned_truck_id INTEGER REFERENCES trucks(id) ON DELETE SET NULL,
  status            VARCHAR(20) NOT NULL DEFAULT 'open',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT routes_status_check CHECK (status IN ('open', 'in_transit', 'completed', 'cancelled'))
);

CREATE INDEX idx_routes_posted_by ON routes(posted_by);
CREATE INDEX idx_routes_status ON routes(status);
CREATE INDEX idx_routes_departure ON routes(departure_date);
CREATE INDEX idx_routes_route_type ON routes(route_type);
CREATE INDEX idx_routes_truck_type ON routes(truck_type);
CREATE INDEX idx_routes_origin ON routes(origin);
CREATE INDEX idx_routes_destination ON routes(destination);
CREATE INDEX idx_routes_created_at ON routes(created_at DESC);
CREATE INDEX idx_routes_weight ON routes(max_weight);
CREATE INDEX idx_routes_volume ON routes(max_volume);

CREATE TABLE shipments (
  id                 SERIAL PRIMARY KEY,
  title              VARCHAR(255),
  origin             VARCHAR(255) NOT NULL,
  destination        VARCHAR(255) NOT NULL,
  current_lat        NUMERIC(10,6) DEFAULT 36.7134,
  current_lng        NUMERIC(10,6) DEFAULT 3.1527,
  from_pickup_date   DATE,
  to_pickup_date     DATE,
  weight             NUMERIC(10,2),
  volume             NUMERIC(10,2),
  phone_number       VARCHAR(50),
  status             VARCHAR(20) NOT NULL DEFAULT 'posted',
  created_by         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shipment_pictures  TEXT[] DEFAULT '{}',
  description        TEXT,
  shipment_type      shipment_type_enum,
  truck_type         truck_type_enum,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT shipments_status_check CHECK (status IN ('posted', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled', 'completed'))
);

CREATE INDEX idx_shipments_created_by ON shipments(created_by);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_origin ON shipments(origin);
CREATE INDEX idx_shipments_destination ON shipments(destination);
CREATE INDEX idx_shipments_created_at ON shipments(created_at DESC);
CREATE INDEX idx_shipments_shipment_type ON shipments(shipment_type);
CREATE INDEX idx_shipments_truck_type ON shipments(truck_type);
CREATE INDEX idx_shipments_weight ON shipments(weight);
CREATE INDEX idx_shipments_volume ON shipments(volume);
CREATE INDEX idx_shipments_pickup_date ON shipments(from_pickup_date, to_pickup_date);

CREATE TABLE assignments (
  id           SERIAL PRIMARY KEY,
  shipment_id  INTEGER NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  route_id     INTEGER NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  truck_id     INTEGER REFERENCES trucks(id) ON DELETE SET NULL,
  status       VARCHAR(20) NOT NULL DEFAULT 'assigned',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT assignments_status_check CHECK (status IN ('assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'))
);

CREATE INDEX idx_assignments_route_id ON assignments(route_id);
CREATE INDEX idx_assignments_shipment_id ON assignments(shipment_id);
CREATE INDEX idx_assignments_status ON assignments(status);

CREATE TABLE plans (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  description    TEXT,
  price          NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration_days  INTEGER NOT NULL DEFAULT 30,
  is_premium     BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_subscriptions (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id         INTEGER NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
  status          VARCHAR(20) NOT NULL DEFAULT 'pending',
  start_date      TIMESTAMPTZ,
  end_date        TIMESTAMPTZ,
  payment_method  VARCHAR(100),
  receipt         TEXT,

  billing_cycle   VARCHAR(20) DEFAULT 'monthly',
  amount          INTEGER DEFAULT 60000,
  ref             VARCHAR(50),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_subscriptions_status_check CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),
  CONSTRAINT user_subscriptions_payment_method_check CHECK (payment_method IN ('Baridi Mob', 'Bank Transfer(WimPay)', 'Algerie Post(CCP)'))
);

CREATE INDEX idx_usersubs_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_usersubs_status ON user_subscriptions(status);
CREATE INDEX idx_usersubs_end_date ON user_subscriptions(end_date);
CREATE UNIQUE INDEX idx_user_subscriptions_ref ON user_subscriptions(ref) WHERE ref IS NOT NULL;

CREATE TABLE notifications (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      VARCHAR(255),
  message    TEXT NOT NULL,
  type       VARCHAR(50) DEFAULT 'info',
  is_read    BOOLEAN NOT NULL DEFAULT false,
  meta       JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

CREATE TABLE audit_logs (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action      VARCHAR(100) NOT NULL,
  entity      VARCHAR(50),
  entity_id   INTEGER,
  details     JSONB,
  ip_address  VARCHAR(45),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

CREATE OR REPLACE VIEW routes_with_details AS
SELECT
    r.id, r.origin, r.destination, r.transit_cities, r.departure_date, r.end_date,
    r.max_weight, r.max_volume, r.contact_phone, r.status, r.notes, r.created_at,
    u.business_name AS company, u.phone_number AS user_phone,
    t.truck_type, t.license_plate, t.max_tonnage, t.max_volume AS truck_max_volume,
    t.truck_pictures
FROM routes r
JOIN users u ON r.posted_by = u.id
LEFT JOIN trucks t ON r.assigned_truck_id = t.id;

CREATE OR REPLACE VIEW shipments_with_details AS
SELECT
    s.id, s.title, s.shipment_type, s.truck_type, s.origin, s.destination,
    s.from_pickup_date, s.to_pickup_date, s.weight, s.volume,
    s.phone_number, s.status, s.description, s.created_at,
    u.business_name AS company, u.phone_number AS user_phone
FROM shipments s
JOIN users u ON s.created_by = u.id;

CREATE OR REPLACE VIEW trucks_with_details AS
SELECT
    t.id, t.name, t.truck_type, t.license_plate, t.max_tonnage, t.max_volume,
    t.truck_pictures, t.created_at,
    u.business_name AS company
FROM trucks t
JOIN users u ON t.created_by = u.id;

INSERT INTO plans (name, description, price, duration_days, is_premium) VALUES
  ('Free', 'Up to 5 combined posts (shipments + routes)', 0, 0, false),
  ('Premium', 'Unlimited posts, priority support', 60000, 30, true);

INSERT INTO users (email, password, business_name, user_type, verified, verification, verification_status)
VALUES (
  'admin@livrili.dz',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
  'Livrili Admin',
  'admin',
  true,
  true,
  'verified'
);

INSERT INTO users (email, password, business_name, user_type, verified, verification, verification_status)
VALUES (
  'demo@livrili.dz',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
  'Demo Transport Company',
  'user',
  true,
  true,
  'verified'
);

INSERT INTO trucks (name, truck_type, max_tonnage, max_volume, license_plate, created_by)
VALUES
  ('Demo Dry Van', 'DRY_VAN', 25, 100, '1234-567-A', 2),
  ('Demo Reefer', 'REEFER', 20, 80, '9876-543-B', 2);

INSERT INTO routes (posted_by, origin, destination, transit_cities, departure_date, end_date, max_weight, max_volume, truck_type, route_type, status, contact_phone, notes)
VALUES
  (2, '16 - Alger', '31 - Oran', '["42 - Tipaza", "27 - Mostaganem"]', CURRENT_DATE + 7, CURRENT_DATE + 14, 25, 100, 'DRY_VAN', 'ONE_WAY', 'open', '+213551234567', 'Regular delivery route'),
  (2, '31 - Oran', '16 - Alger', '[]', CURRENT_DATE + 3, CURRENT_DATE + 5, 20, 80, 'REEFER', 'ROUND_TRIP', 'open', '+213551234568', 'Round trip refrigerated');

INSERT INTO shipments (created_by, title, origin, destination, from_pickup_date, to_pickup_date, weight, volume, shipment_type, truck_type, status, description)
VALUES
  (2, 'Fresh Produce Delivery', '16 - Alger', '31 - Oran', CURRENT_DATE + 2, CURRENT_DATE + 3, 5, 30, 'REFRIGERATED', 'REEFER', 'posted', 'Fresh fruits and vegetables'),
  (2, 'Construction Materials', '31 - Oran', '25 - Constantine', CURRENT_DATE + 5, CURRENT_DATE + 7, 15, 50, 'CONSTRUCTION', 'FLATBED', 'posted', 'Cement and steel');

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('plans_id_seq', (SELECT MAX(id) FROM plans));
