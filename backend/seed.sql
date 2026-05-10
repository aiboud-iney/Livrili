BEGIN TRANSACTION;

TRUNCATE audit_logs, notifications, user_subscriptions, assignments,
         shipments, routes, trucks, users RESTART IDENTITY CASCADE;

INSERT INTO plans (id, name, description, price, duration_days, is_premium, created_at)
VALUES
  (1, 'Free',    'Up to 5 combined posts (shipments + routes)',    0,    0,  false, NOW()),
  (2, 'Premium', 'Unlimited posts, priority support',           60000, 30,  true, NOW());

SELECT setval('plans_id_seq', 2, true);

INSERT INTO users (id, email, password, business_name, phone_number, tin_nif,
                   trade_register, user_type, verified, verification,
                   category, headquarters_address, created_at)
VALUES

  (1, 'admin@livrili.test',
   '$2b$10$W2nXGd96mT0yfCh.do36cOyg3E2hPznGQivjQHEH1GYLLJTIkG66y',
   'Livrili Administration', '0213456789', 'ADMIN001', 'ADM-REG-001',
   'admin', true, true, 'Platform Administration', '16 - Alger',
   NOW() - INTERVAL '6 months'),

  (2, 'user@livrili.test',
   '$2b$10$/YavZnBIXP80EyYCxpcwX.zyiNpb16HlmcTaXbxVwAlChYQ8tXV/6',
   'Transporteurs du Nord', '0550123456', 'TIN-002', 'REG-002',
   'user', true, true, 'Transport & Logistics', '16 - Alger',
   NOW() - INTERVAL '5 months'),

  (3, 'premium@livrili.test',
   '$2b$10$vI6a4TuT5Rf6rX9QsGkT0eW5uRk5Lk7zP8mN3oQ4rS8tU7vW6x',
   'Sahara Logistics Premium', '0661234567', 'TIN-003', 'REG-003',
   'user', true, true, 'Premium Freight Services', '31 - Oran',
   NOW() - INTERVAL '4 months 15 days'),

  (4, 'fares.transport@livrili.test',
   '$2b$10$abcdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnO',
   'Ets Fares Transport', '0770123456', 'TIN-004', 'REG-004',
   'user', true, true, 'General Transport', '23 - Annaba',
   NOW() - INTERVAL '4 months'),

  (5, 'benali.logistics@livrili.test',
   '$2b$10$efGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQr',
   'Benali Freres Logistique', '0650234567', 'TIN-005', 'REG-005',
   'user', true, false, 'Cold Chain Logistics', '25 - Constantine',
   NOW() - INTERVAL '3 months 20 days'),

  (6, 'atlas.freight@livrili.test',
   '$2b$10$ijKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUv',
   'Atlas Freight Solutions', '0790345678', 'TIN-006', 'REG-006',
   'user', true, true, 'Heavy Transport', '13 - Tlemcen',
   NOW() - INTERVAL '3 months 10 days'),

  (7, 'sahel.cargo@livrili.test',
   '$2b$10$mnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz',
   'Sahel Cargo Express', '0550456789', 'TIN-007', 'REG-007',
   'user', false, false, 'Express Delivery', '19 - Setif',
   NOW() - INTERVAL '2 months 25 days'),

  (8, 'oulednay.transport@livrili.test',
   '$2b$10$qrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz1234',
   'Ouled Nay Transport', '0660567890', 'TIN-008', 'REG-008',
   'user', true, true, 'Container Transport', '09 - Blida',
   NOW() - INTERVAL '2 months 15 days'),

  (9, 'djazair.shipping@livrili.test',
   '$2b$10$uvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz12345678',
   'Djazair Shipping Co', '0770678901', 'TIN-009', 'REG-009',
   'user', true, true, 'Maritime Logistics', '42 - Tipaza',
   NOW() - INTERVAL '1 month 20 days'),

  (10, 'kabilia.logistics@livrili.test',
   '$2b$10$WxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz1234567890A',
   'Kabylie Logistics SARL', '0650789012', 'TIN-010', 'REG-010',
   'user', true, false, 'Regional Transport', '15 - Tizi Ouzou',
   NOW() - INTERVAL '1 month 5 days');

SELECT setval('users_id_seq', 10, true);

INSERT INTO trucks (id, name, truck_type, max_tonnage, max_volume, license_plate,
                    created_by, created_at)
VALUES
  (1, 'Dry Van 24T', 'DRY_VAN', 24.00, 90.00, '16-ALG-101-2021', 2, NOW() - INTERVAL '4 months'),
  (2, 'Reefer 12T', 'REEFER', 12.00, 45.00, '16-ALG-102-2022', 2, NOW() - INTERVAL '4 months'),
  (3, 'Flatbed Standard', 'FLATBED', 18.00, 60.00, '31-ORA-200-2020', 3, NOW() - INTERVAL '3 months 20 days'),
  (4, 'Box Truck 16T', 'BOX_TRUCK', 16.00, 55.00, '25-CON-303-2021', 4, NOW() - INTERVAL '3 months 10 days'),
  (5, 'Container Carrier', 'CONTAINER', 22.00, 75.00, '23-ANN-404-2022', 5, NOW() - INTERVAL '3 months'),
  (6, 'Hot Shot Express', 'HOT_SHOT', 15.00, 20.00, '13-TLM-505-2021', 3, NOW() - INTERVAL '2 months 25 days'),
  (7, 'Conestoga 20T', 'CONESTOGA', 20.00, 80.00, '19-SET-606-2020', 2, NOW() - INTERVAL '2 months 15 days'),
  (8, 'Step Deck Heavy', 'STEP_DECK', 14.00, 40.00, '09-BLD-707-2021', 4, NOW() - INTERVAL '2 months 5 days'),
  (9, 'Cargo Van Small', 'CARGO_VAN', 8.00, 25.00, '42-TIP-808-2022', 5, NOW() - INTERVAL '1 month 20 days'),
  (10, 'Reefer 18T', 'REEFER', 18.00, 62.00, '15-OUZ-909-2021', 6, NOW() - INTERVAL '1 month 10 days'),
  (11, 'Dry Van 26T', 'DRY_VAN', 26.00, 95.00, '16-ALG-1010-2022', 2, NOW() - INTERVAL '1 month'),
  (12, 'Flatbed 25T', 'FLATBED', 25.00, 85.00, '31-ORA-1111-2020', 7, NOW() - INTERVAL '25 days'),
  (13, 'Box Truck 12T', 'BOX_TRUCK', 12.00, 40.00, '16-ALG-1212-2021', 3, NOW() - INTERVAL '20 days'),
  (14, 'Step Deck 28T', 'STEP_DECK', 28.00, 100.00, '25-CON-1313-2022', 8, NOW() - INTERVAL '15 days'),
   (15, 'Container 30T', 'CONTAINER', 30.00, 92.00, '23-ANN-1414-2021', 9, NOW() - INTERVAL '10 days'),
   (16, 'Kabylie Reefer 14T', 'REEFER', 14.00, 45.00, '15-OUZ-1616-2023', 10, NOW() - INTERVAL '5 days');

SELECT setval('trucks_id_seq', 16, true);

INSERT INTO routes (id, posted_by, origin, destination, transit_cities, departure_date,
                    end_date, max_weight, max_volume, contact_phone, truck_type,
                    route_type, status, created_at)
VALUES

  (1, 2, '16', '31', '["09","42"]'::jsonb,
   CURRENT_DATE + 5, CURRENT_DATE + 7, 24.00, 90.00, '0550123456', 'DRY_VAN', 'ONE_WAY', 'open',
   NOW() - INTERVAL '2 days'),

  (2, 2, '16', '25', '["26","19"]'::jsonb,
   CURRENT_DATE + 10, CURRENT_DATE + 13, 12.00, 45.00, '0550123456', 'REEFER', 'ROUND_TRIP', 'open',
   NOW() - INTERVAL '1 day'),

  (3, 2, '16', '23', '["25"]'::jsonb,
   CURRENT_DATE + 12, CURRENT_DATE + 15, 18.00, 60.00, '0550123456', 'FLATBED', 'ONE_WAY', 'open',
   NOW() - INTERVAL '3 days'),

  (4, 2, '31', '16', '["42"]'::jsonb,
   CURRENT_DATE - 20, CURRENT_DATE - 18, 18.00, 60.00, '0550123456', 'FLATBED', 'ONE_WAY', 'completed',
   NOW() - INTERVAL '25 days'),

  (5, 2, '16', '13', '[]'::jsonb,
   CURRENT_DATE + 8, CURRENT_DATE + 10, 20.00, 70.00, '0550123456', 'BOX_TRUCK', 'ONE_WAY', 'open',
   NOW() - INTERVAL '5 days'),

  (6, 3, '31', '16', '["42","09"]'::jsonb,
   CURRENT_DATE + 6, CURRENT_DATE + 9, 22.00, 75.00, '0661234567', 'CONTAINER', 'ROUND_TRIP', 'open',
   NOW() - INTERVAL '4 days'),

  (7, 3, '25', '23', '[]'::jsonb,
   CURRENT_DATE + 3, CURRENT_DATE + 5, 15.00, 50.00, '0661234567', 'HOT_SHOT', 'ONE_WAY', 'in_transit',
   NOW() - INTERVAL '2 days'),

  (8, 3, '13', '31', '["09","42"]'::jsonb,
   CURRENT_DATE - 30, CURRENT_DATE - 28, 16.00, 55.00, '0661234567', 'DRY_VAN', 'ONE_WAY', 'completed',
   NOW() - INTERVAL '35 days'),

  (9, 3, '31', '19', '["22"]'::jsonb,
   CURRENT_DATE + 15, CURRENT_DATE + 18, 24.00, 85.00, '0661234567', 'CONESTOGA', 'ONE_WAY', 'open',
   NOW() - INTERVAL '6 days'),

  (10, 3, '16', '09', '[]'::jsonb,
   CURRENT_DATE - 10, CURRENT_DATE - 8, 14.00, 40.00, '0661234567', 'REEFER', 'ONE_WAY', 'cancelled',
   NOW() - INTERVAL '12 days'),

  (11, 4, '23', '16', '["25","26"]'::jsonb,
   CURRENT_DATE + 7, CURRENT_DATE + 10, 20.00, 70.00, '0770123456', 'STEP_DECK', 'ROUND_TRIP', 'open',
   NOW() - INTERVAL '7 days'),

  (12, 5, '25', '16', '["26"]'::jsonb,
   CURRENT_DATE + 4, CURRENT_DATE + 6, 18.00, 62.00, '0650234567', 'REEFER', 'ONE_WAY', 'open',
   NOW() - INTERVAL '3 days'),

  (13, 5, '19', '16', '["26"]'::jsonb,
   CURRENT_DATE - 45, CURRENT_DATE - 42, 16.00, 55.00, '0650234567', 'DRY_VAN', 'ONE_WAY', 'completed',
   NOW() - INTERVAL '50 days'),

  (14, 6, '13', '31', '[]'::jsonb,
   CURRENT_DATE + 9, CURRENT_DATE + 11, 12.00, 35.00, '0790345678', 'CARGO_VAN', 'ONE_WAY', 'open',
   NOW() - INTERVAL '8 days'),

  (15, 7, '16', '15', '["10"]'::jsonb,
   CURRENT_DATE - 5, CURRENT_DATE - 3, 25.00, 80.00, '0550456789', 'CONTAINER', 'ONE_WAY', 'in_transit',
   NOW() - INTERVAL '6 days'),

  (16, 8, '09', '31', '["42"]'::jsonb,
   CURRENT_DATE + 14, CURRENT_DATE + 16, 20.00, 65.00, '0660567890', 'FLATBED', 'ONE_WAY', 'open',
   NOW() - INTERVAL '9 days'),

  (17, 9, '42', '16', '["09"]'::jsonb,
   CURRENT_DATE + 2, CURRENT_DATE + 4, 8.00, 25.00, '0770678901', 'CARGO_VAN', 'ONE_WAY', 'open',
   NOW() - INTERVAL '1 day'),

  (18, 9, '16', '23', '["25","26","19"]'::jsonb,
   CURRENT_DATE - 60, CURRENT_DATE - 55, 26.00, 95.00, '0770678901', 'DRY_VAN', 'ROUND_TRIP', 'completed',
   NOW() - INTERVAL '65 days'),

  (19, 10, '15', '16', '[]'::jsonb,
   CURRENT_DATE + 11, CURRENT_DATE + 13, 14.00, 45.00, '0650789012', 'REEFER', 'ONE_WAY', 'open',
   NOW() - INTERVAL '10 days'),

  (20, 4, '16', '19', '["26"]'::jsonb,
   CURRENT_DATE - 15, CURRENT_DATE - 13, 22.00, 75.00, '0770123456', 'STEP_DECK', 'ONE_WAY', 'completed',
   NOW() - INTERVAL '20 days');

SELECT setval('routes_id_seq', 20, true);

INSERT INTO shipments (id, title, origin, destination, from_pickup_date, to_pickup_date,
                       weight, volume, phone_number, status, created_by, description,
                       shipment_type, truck_type, created_at)
VALUES

  (1, 'Construction Materials - Cement Bags', '16', '31',
   CURRENT_DATE + 3, CURRENT_DATE + 6, 20.00, 70.00, '0550123456', 'posted', 2,
   'Cement bags and bricks on pallets. Loading dock available.',
   'CONSTRUCTION', 'DRY_VAN', NOW() - INTERVAL '2 days'),

  (2, 'Refrigerated Food Products', '16', '25',
   CURRENT_DATE + 9, CURRENT_DATE + 13, 10.00, 35.00, '0550123456', 'posted', 2,
   'Canned goods and packaged foods. Temperature controlled not required.',
   'DRY_FOOD', 'DRY_VAN', NOW() - INTERVAL '1 day'),

  (3, 'Electrical Equipment Delivery', '31', '16',
   CURRENT_DATE + 5, CURRENT_DATE + 8, 8.00, 25.00, '0550123456', 'posted', 2,
   'Cables and electrical panels in boxes. Fragile handling required.',
   'ELECTRONICS', 'BOX_TRUCK', NOW() - INTERVAL '3 days'),

  (4, 'Palletized Textiles Shipped', '31', '16',
   CURRENT_DATE - 20, CURRENT_DATE - 18, 5.00, 18.00, '0550123456', 'delivered', 2,
   'Clothing in cartons, delivery completed successfully.',
   'PALLETIZED', 'DRY_VAN', NOW() - INTERVAL '25 days'),

  (5, 'Medical Supplies Priority', '16', '06',
   CURRENT_DATE + 8, CURRENT_DATE + 11, 2.00, 8.00, '0550123456', 'in_transit', 2,
   'Medicines and health products - Temperature controlled transport required.',
   'MEDICAL', 'REEFER', NOW() - INTERVAL '4 days'),

  (6, 'Heavy Machinery Transport', '25', '16',
   CURRENT_DATE - 50, CURRENT_DATE - 48, 35.00, 100.00, '0661234567', 'delivered', 3,
   'Industrial machines, delivery completed safely with heavy lift equipment.',
   'MACHINERY', 'FLATBED', NOW() - INTERVAL '55 days'),

  (7, 'Hazardous Chemicals Shipment', '09', '13',
   CURRENT_DATE + 2, CURRENT_DATE + 5, 12.00, 15.00, '0661234567', 'posted', 3,
   'Petroleum products in sealed containers. ADR compliant transport required.',
   'HAZARDOUS', 'CONTAINER', NOW() - INTERVAL '3 days'),

  (8, 'Appliances on Pallets', '22', '16',
   CURRENT_DATE - 8, CURRENT_DATE - 5, 15.00, 50.00, '0661234567', 'picked_up', 3,
   'Refrigerators and stoves on pallets. Rear loading dock access.',
   'PALLETIZED', 'DRY_VAN', NOW() - INTERVAL '2 days'),

  (9, 'Raw Minerals - Mining Products', '06', '16',
   CURRENT_DATE - 12, CURRENT_DATE - 10, 40.00, 120.00, '0661234567', 'cancelled', 3,
   'Cancelled due to client plan change. Original: Iron ore transport.',
   'RAW_MATERIALS', 'FLATBED', NOW() - INTERVAL '15 days'),

  (10, 'Vehicle Parts - Auto Components', '25', '16',
   CURRENT_DATE + 1, CURRENT_DATE + 4, 6.00, 22.00, '0661234567', 'assigned', 3,
   'Engines and transmissions in crates. Side loading required.',
   'VEHICLES', 'FLATBED', NOW() - INTERVAL '5 days'),

  (11, 'Steel Metal Beams', '31', '19',
   CURRENT_DATE - 70, CURRENT_DATE - 68, 28.00, 95.00, '0770123456', 'delivered', 4,
   'Construction steel beams. Overlength load - pilot car required.',
   'STEEL_METAL', 'FLATBED', NOW() - INTERVAL '75 days'),

  (12, 'Chemical Cleaning Products', '16', '06',
   CURRENT_DATE + 4, CURRENT_DATE + 7, 18.00, 65.00, '0650234567', 'posted', 5,
   'Industrial cleaning chemicals. Non-hazardous classification.',
   'CHEMICALS', 'DRY_VAN', NOW() - INTERVAL '2 days'),

  (13, 'Fresh Produce - Fruits and Vegetables', '23', '16',
   CURRENT_DATE - 3, CURRENT_DATE - 1, 10.00, 40.00, '0650234567', 'in_transit', 5,
   'Fresh fruits and vegetables - Refrigerated service required.',
   'REFRIGERATED', 'REEFER', NOW()),

  (14, 'Computer Equipment IT Hardware', '19', '16',
   CURRENT_DATE + 6, CURRENT_DATE + 9, 3.00, 12.00, '0790345678', 'posted', 6,
   'Computers and servers in original packaging. Shock-sensitive.',
   'ELECTRONICS', 'CARGO_VAN', NOW() - INTERVAL '1 day'),

  (15, 'Beverages - Soft Drinks Delivery', '09', '31',
   CURRENT_DATE - 40, CURRENT_DATE - 38, 16.00, 48.00, '0550456789', 'delivered', 7,
   'Sodas and mineral water in crates, delivery successful.',
   'BEVERAGES', 'DRY_VAN', NOW() - INTERVAL '45 days'),

  (16, 'Livestock Transport - Sheep', '26', '16',
   CURRENT_DATE + 10, CURRENT_DATE + 12, 8.00, 30.00, '0660567890', 'posted', 8,
   'Live sheep transport. Ventilated vehicle required.',
   'LIVESTOCK', 'DRY_VAN', NOW() - INTERVAL '8 days'),

  (17, 'Oversize Construction Equipment', '16', '25',
   CURRENT_DATE + 12, CURRENT_DATE + 15, 45.00, 150.00, '0770678901', 'posted', 9,
   'Crane components - Oversize load permit required.',
   'OVERSIZE', 'STEP_DECK', NOW() - INTERVAL '9 days'),

  (18, 'Frozen Food Products', '31', '19',
   CURRENT_DATE + 7, CURRENT_DATE + 10, 12.00, 40.00, '0770678901', 'posted', 9,
   'Frozen meat products - Minus 18°C transport required.',
   'FROZEN', 'REEFER', NOW() - INTERVAL '6 days'),

  (19, 'Agricultural Bulk - Grain', '19', '16',
   CURRENT_DATE + 14, CURRENT_DATE + 17, 25.00, 80.00, '0650789012', 'posted', 10,
   'Wheat grain in bulk bags. Tipper unloading preferred.',
   'AGRICULTURAL_BULK', 'DRY_VAN', NOW() - INTERVAL '11 days'),

  (20, 'Fragile Glass Products', '42', '16',
   CURRENT_DATE + 3, CURRENT_DATE + 6, 5.00, 20.00, '0770123456', 'posted', 4,
   'Glass bottles and containers. Extra padding required.',
   'FRAGILE', 'BOX_TRUCK', NOW() - INTERVAL '4 days');

SELECT setval('shipments_id_seq', 20, true);

INSERT INTO assignments (id, shipment_id, route_id, truck_id, status, created_at)
VALUES
  (1, 1, 1, 1, 'assigned', NOW() - INTERVAL '1 day'),
  (2, 2, 2, 2, 'assigned', NOW() - INTERVAL '18 hours'),
  (3, 3, 3, 3, 'delivered', NOW() - INTERVAL '24 days'),
  (4, 4, 4, 3, 'delivered', NOW() - INTERVAL '24 days'),
  (5, 5, 10, 2, 'in_transit', NOW() - INTERVAL '12 hours'),
  (6, 6, 4, 4, 'delivered', NOW() - INTERVAL '48 days'),
  (7, 7, 7, 6, 'assigned', NOW() - INTERVAL '32 days'),
  (8, 8, 8, 11, 'picked_up', NOW() - INTERVAL '1 day'),
  (9, 9, 9, 8, 'cancelled', NOW() - INTERVAL '12 days'),
  (10, 10, 10, 9, 'assigned', NOW() - INTERVAL '4 days'),
  (11, 11, 11, 7, 'delivered', NOW() - INTERVAL '62 days'),
  (12, 12, 12, 15, 'assigned', NOW() - INTERVAL '1 day'),
  (13, 13, 13, 9, 'in_transit', NOW() - INTERVAL '2 hours'),
  (14, 14, 14, 10, 'assigned', NOW() - INTERVAL '1 day'),
  (15, 15, 15, 12, 'delivered', NOW() - INTERVAL '42 days'),
  (16, 16, 6, 1, 'assigned', NOW() - INTERVAL '8 days'),
  (17, 17, 17, 14, 'assigned', NOW() - INTERVAL '9 days'),
  (18, 18, 9, 2, 'assigned', NOW() - INTERVAL '6 days'),
  (19, 19, 13, 13, 'assigned', NOW() - INTERVAL '11 days'),
  (20, 20, 17, 14, 'assigned', NOW() - INTERVAL '4 days');

SELECT setval('assignments_id_seq', 20, true);

INSERT INTO user_subscriptions (id, user_id, plan_id, status, start_date, end_date,
                                payment_method, created_at, updated_at)
VALUES
  (1, 2, 2, 'active', NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days',
   'Baridi Mob', NOW() - INTERVAL '10 days', NOW()),

  (2, 2, 1, 'expired', NOW() - INTERVAL '35 days', NOW() - INTERVAL '5 days',
   'Bank Transfer(WimPay)', NOW() - INTERVAL '35 days', NOW() - INTERVAL '5 days'),

  (3, 3, 2, 'active', NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days',
   'Algerie Post(CCP)', NOW() - INTERVAL '5 days', NOW()),

  (4, 3, 1, 'cancelled', NOW() - INTERVAL '60 days', NOW() - INTERVAL '30 days',
   'Baridi Mob', NOW() - INTERVAL '60 days', NOW() - INTERVAL '30 days'),

  (5, 4, 2, 'pending', NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days',
   'Bank Transfer(WimPay)', NOW() - INTERVAL '3 days', NOW()),

  (6, 4, 1, 'active', NOW() - INTERVAL '2 months', NOW() + INTERVAL '1 month',
   'Algerie Post(CCP)', NOW() - INTERVAL '2 months', NOW()),

  (7, 5, 2, 'active', NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days',
   'Baridi Mob', NOW() - INTERVAL '15 days', NOW()),

  (8, 6, 1, 'expired', NOW() - INTERVAL '45 days', NOW() - INTERVAL '15 days',
   'Bank Transfer(WimPay)', NOW() - INTERVAL '45 days', NOW() - INTERVAL '15 days'),

  (9, 7, 2, 'active', NOW() - INTERVAL '20 days', NOW() + INTERVAL '10 days',
   'Algerie Post(CCP)', NOW() - INTERVAL '20 days', NOW()),

  (10, 8, 1, 'active', NOW() - INTERVAL '1 month', NOW() + INTERVAL '1 month',
   'Baridi Mob', NOW() - INTERVAL '1 month', NOW()),

  (11, 9, 2, 'pending', NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days',
   'Bank Transfer(WimPay)', NOW() - INTERVAL '2 days', NOW()),

  (12, 10, 1, 'active', NOW() - INTERVAL '7 days', NOW() + INTERVAL '23 days',
   'Algerie Post(CCP)', NOW() - INTERVAL '7 days', NOW()),

  (13, 5, 1, 'cancelled', NOW() - INTERVAL '90 days', NOW() - INTERVAL '60 days',
   'Baridi Mob', NOW() - INTERVAL '90 days', NOW() - INTERVAL '60 days'),

  (14, 6, 2, 'active', NOW() - INTERVAL '12 days', NOW() + INTERVAL '18 days',
   'Algerie Post(CCP)', NOW() - INTERVAL '12 days', NOW()),

  (15, 7, 1, 'expired', NOW() - INTERVAL '80 days', NOW() - INTERVAL '50 days',
   'Bank Transfer(WimPay)', NOW() - INTERVAL '80 days', NOW() - INTERVAL '50 days');

SELECT setval('user_subscriptions_id_seq', 15, true);

INSERT INTO notifications (id, user_id, title, message, type, is_read, meta, created_at)
VALUES
  (1, 2, 'Account Verified',
   'Your account has been verified by the admin. Your profile now shows a verified badge.',
   'success', true,
   jsonb_build_object('actionUrl', '/profile'), NOW() - INTERVAL '120 days'),

  (2, 2, 'New Assignment on Your Route',
   'A shipment "Construction Materials" has been assigned to your route 16→31.',
   'info', false,
   jsonb_build_object('routeId', 1, 'shipmentId', 1), NOW() - INTERVAL '1 day'),

  (3, 3, 'Shipment Assigned',
   'Your shipment "Electrical Equipment" has been matched with a carrier.',
   'info', false,
   jsonb_build_object('shipmentId', 3, 'routeId', 3), NOW() - INTERVAL '3 days'),

  (4, 3, 'Delivery Completed',
   'Your shipment has been successfully delivered.',
   'success', true,
   jsonb_build_object('shipmentId', 4), NOW() - INTERVAL '25 days'),

  (5, 4, 'Route Status Updated',
   'Your route from 25 to 23 is now marked as open.',
   'info', true,
   jsonb_build_object('routeId', 4), NOW() - INTERVAL '3 days'),

  (6, 4, 'Payment Received',
   'Your subscription payment has been confirmed.',
   'success', true,
   jsonb_build_object('planId', 2), NOW() - INTERVAL '5 days'),

  (7, 5, 'Route Cancelled',
   'Your route from 13 to 31 has been cancelled.',
   'warning', true,
   jsonb_build_object('routeId', 8), NOW() - INTERVAL '12 days'),

  (8, 5, 'New Shipment Available',
   'A new shipment matching your truck capacity is posted: "Appliances on Pallets".',
   'info', false,
   jsonb_build_object('shipmentId', 8), NOW() - INTERVAL '2 days'),

  (9, 6, 'Verification Pending',
   'Your account documents are under review. This usually takes 24-48 hours.',
   'info', true,
   jsonb_build_object('actionUrl', '/documents'), NOW() - INTERVAL '45 days'),

  (10, 7, 'Assignment Pickup Confirmed',
   'Your shipment "Vehicle Parts" has been picked up successfully.',
   'success', true,
   jsonb_build_object('shipmentId', 10), NOW() - INTERVAL '4 days'),

  (11, 8, 'System Maintenance',
   'We will perform scheduled maintenance on 2026-05-15 from 2-4 AM UTC.',
   'warning', true,
   jsonb_build_object('severity', 'low'), NOW() - INTERVAL '7 days'),

  (12, 8, 'New Shipment Match',
   'A shipment "Chemical Cleaning Products" matches your truck availability.',
   'info', false,
   jsonb_build_object('shipmentId', 12), NOW() - INTERVAL '1 day'),

  (13, 9, 'Subscription Expiring',
   'Your Premium subscription will expire in 10 days. Renew now for uninterrupted service.',
   'warning', false,
   jsonb_build_object('planId', 2), NOW() - INTERVAL '5 days'),

  (14, 10, 'Welcome to Livrili',
   'Welcome! Your account has been created. Verify your email to get started.',
   'info', true,
   jsonb_build_object('actionUrl', '/verify-email'), NOW() - INTERVAL '30 days'),

  (15, 2, 'High-Value Shipment',
   'A high-value shipment "Computer Equipment" is available for transport.',
   'info', false,
   jsonb_build_object('shipmentId', 14), NOW() - INTERVAL '8 hours'),

  (16, 3, 'Route Completed',
   'Your route 31→16 has been marked as completed.',
   'success', true,
   jsonb_build_object('routeId', 4), NOW() - INTERVAL '25 days'),

  (17, 5, 'New Route Posted',
   'A new route matching your destination has been posted.',
   'info', false,
   jsonb_build_object('routeId', 11), NOW() - INTERVAL '7 days'),

  (18, 6, 'Truck Registration Complete',
   'Your truck registration has been approved.',
   'success', true,
   jsonb_build_object('truckId', 4), NOW() - INTERVAL '100 days'),

  (19, 9, 'New Match Available',
   'A new shipment from 42 to 16 matches your route preferences.',
   'info', false,
   jsonb_build_object('shipmentId', 20), NOW() - INTERVAL '4 days'),

  (20, 10, 'Payment Reminder',
   'Your subscription payment is due in 3 days.',
   'warning', false,
   jsonb_build_object('planId', 1), NOW() - INTERVAL '1 day');

SELECT setval('notifications_id_seq', 20, true);

INSERT INTO audit_logs (id, user_id, action, entity, entity_id, details, ip_address, created_at)
VALUES
  (1, 1, 'VERIFIED', 'user', 2,
   jsonb_build_object('userAccount', 'Transporteurs du Nord',
                      'targetEmail', 'user@livrili.test',
                      'reason', 'Account verification completed'),
   '192.168.1.100', NOW() - INTERVAL '120 days'),

  (2, 2, 'CREATED', 'route', 1,
   jsonb_build_object('origin', '16', 'destination', '31',
                      'departureDate', CURRENT_DATE + 5),
   '203.0.113.45', NOW() - INTERVAL '2 days'),

  (3, 2, 'CREATED', 'shipment', 1,
   jsonb_build_object('title', 'Construction Materials - Cement Bags',
                      'weight', 20.0, 'volume', 70.0),
   '203.0.113.45', NOW() - INTERVAL '2 days'),

  (4, 1, 'VERIFIED', 'user', 3,
   jsonb_build_object('userAccount', 'Sahara Logistics Premium',
                      'targetEmail', 'premium@livrili.test'),
   '192.168.1.100', NOW() - INTERVAL '110 days'),

  (5, 3, 'CREATED', 'truck', 3,
   jsonb_build_object('truckType', 'FLATBED', 'capacity', 18.0,
                      'licensePlate', '31-ORA-200-2020'),
   '203.0.113.46', NOW() - INTERVAL '100 days'),

  (6, 2, 'UPDATED', 'shipment', 4,
   jsonb_build_object('previousStatus', 'in_transit', 'newStatus', 'delivered',
                      'completedAt', NOW() - INTERVAL '25 days'),
   '203.0.113.45', NOW() - INTERVAL '25 days'),

  (7, 4, 'CREATED', 'route', 4,
   jsonb_build_object('origin', '31', 'destination', '16',
                      'transitCities', '["42"]', 'status', 'completed'),
   '203.0.113.47', NOW() - INTERVAL '3 days'),

  (8, 1, 'FLAGGED', 'user', 7,
   jsonb_build_object('reason', 'Document verification incomplete',
                      'targetEmail', 'sahel.cargo@livrili.test'),
   '192.168.1.100', NOW() - INTERVAL '60 days'),

  (9, 3, 'UPDATED', 'route', 10,
   jsonb_build_object('previousStatus', 'open', 'newStatus', 'cancelled',
                      'reason', 'Shipper request'),
   '203.0.113.48', NOW() - INTERVAL '12 days'),

  (10, 3, 'CREATED', 'assignment', 7,
   jsonb_build_object('shipmentId', 7, 'routeId', 7, 'truckId', 6,
                      'status', 'assigned'),
   '203.0.113.49', NOW() - INTERVAL '32 days'),

  (11, 8, 'CREATED', 'subscription', 10,
   jsonb_build_object('planId', 1, 'status', 'active',
                      'paymentMethod', 'Baridi Mob'),
   '203.0.113.50', NOW() - INTERVAL '1 month'),

  (12, 3, 'UPDATED', 'shipment', 9,
   jsonb_build_object('previousStatus', 'posted', 'newStatus', 'cancelled',
                      'reason', 'User request - cancelled assignment'),
   '192.168.1.100', NOW() - INTERVAL '12 days'),

  (13, 5, 'CREATED', 'shipment', 12,
   jsonb_build_object('title', 'Chemical Cleaning Products',
                      'shipmentType', 'CHEMICALS', 'weight', 18.0),
   '203.0.113.51', NOW() - INTERVAL '2 days'),

  (14, 6, 'CREATED', 'route', 14,
   jsonb_build_object('origin', '13', 'destination', '31',
                      'truckType', 'CARGO_VAN', 'status', 'open'),
   '203.0.113.52', NOW() - INTERVAL '8 days'),

  (15, 1, 'VERIFIED', 'user', 8,
   jsonb_build_object('userAccount', 'Ouled Nay Transport',
                      'targetEmail', 'oulednay.transport@livrili.test'),
   '192.168.1.100', NOW() - INTERVAL '75 days'),

  (16, 9, 'CREATED', 'truck', 13,
   jsonb_build_object('truckType', 'BOX_TRUCK', 'capacity', 12.0,
                      'licensePlate', '16-ALG-1212-2021'),
   '203.0.113.53', NOW() - INTERVAL '20 days'),

  (17, 10, 'CREATED', 'shipment', 19,
   jsonb_build_object('title', 'Agricultural Bulk - Grain',
                      'shipmentType', 'AGRICULTURAL_BULK', 'weight', 25.0),
   '203.0.113.54', NOW() - INTERVAL '11 days'),

  (18, 4, 'UPDATED', 'route', 11,
   jsonb_build_object('previousStatus', 'open', 'newStatus', 'in_transit',
                      'startedAt', NOW() - INTERVAL '2 days'),
   '203.0.113.55', NOW() - INTERVAL '2 days'),

  (19, 7, 'CREATED', 'assignment', 13,
   jsonb_build_object('shipmentId', 13, 'routeId', 13, 'truckId', 9,
                      'status', 'in_transit'),
   '203.0.113.56', NOW() - INTERVAL '2 hours'),

  (20, 1, 'LOGIN', 'user', 1,
   jsonb_build_object('email', 'admin@livrili.test',
                      'ipAddress', '192.168.1.100',
                      'userAgent', 'Mozilla/5.0'),
   '192.168.1.100', NOW() - INTERVAL '1 hour');

SELECT setval('audit_logs_id_seq', 20, true);

SELECT '=== LIVRILI SEED DATA SUMMARY ===' AS title;
SELECT 'Users created:' AS metric, COUNT(*) AS value FROM users;
SELECT 'Trucks registered:' AS metric, COUNT(*) AS value FROM trucks;
SELECT 'Routes posted:' AS metric, COUNT(*) AS value FROM routes;
SELECT 'Shipments created:' AS metric, COUNT(*) AS value FROM shipments;
SELECT 'Assignments made:' AS metric, COUNT(*) AS value FROM assignments;
SELECT 'Subscriptions:' AS metric, COUNT(*) AS value FROM user_subscriptions;
SELECT 'Notifications sent:' AS metric, COUNT(*) AS value FROM notifications;
SELECT 'Audit logs:' AS metric, COUNT(*) AS value FROM audit_logs;

SELECT 'User Accounts:' AS label;
SELECT email, business_name, user_type, verified, verification FROM users ORDER BY id;

COMMIT;

SELECT 'Seed data loaded successfully!' AS status;
