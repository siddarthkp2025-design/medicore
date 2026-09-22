-- ============================================================
-- MediCore HMS — Migration: Add user_sessions login audit table
-- Run this in Supabase SQL Editor ONCE
-- ============================================================

DROP SEQUENCE IF EXISTS session_seq CASCADE;
CREATE SEQUENCE session_seq START WITH 1 INCREMENT BY 1;

DROP TABLE IF EXISTS user_sessions CASCADE;

CREATE TABLE user_sessions (
    session_id      BIGINT PRIMARY KEY DEFAULT nextval('session_seq'),
    user_id         BIGINT NOT NULL,
    username        VARCHAR(50),
    role            VARCHAR(20),
    login_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address      VARCHAR(50),
    user_agent      VARCHAR(500),
    login_successful BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Index for fast lookup by user
CREATE INDEX idx_sessions_user_id  ON user_sessions(user_id);
CREATE INDEX idx_sessions_login_at ON user_sessions(login_at DESC);

-- ============================================================
-- RESEED: Restore all demo data (run if tables are empty)
-- ============================================================

-- Clear existing data safely
TRUNCATE TABLE bill_items, bills, prescription_items, prescriptions, medicines,
               medical_records, admissions, rooms, appointments, doctors,
               patients, departments, users CASCADE;

-- Reset sequences
SELECT setval('user_seq', 1, false);
SELECT setval('department_seq', 1, false);
SELECT setval('patient_seq', 1001, false);
SELECT setval('doctor_seq', 2001, false);
SELECT setval('appointment_seq', 3001, false);
SELECT setval('room_seq', 1, false);
SELECT setval('admission_seq', 4001, false);
SELECT setval('medical_record_seq', 5001, false);
SELECT setval('medicine_seq', 1, false);
SELECT setval('prescription_seq', 6001, false);
SELECT setval('prescription_item_seq', 1, false);
SELECT setval('bill_seq', 7001, false);
SELECT setval('bill_item_seq', 1, false);
SELECT setval('session_seq', 1, false);

-- 1. DEPARTMENTS
INSERT INTO departments (department_id, name, description, location, phone) VALUES
(1, 'Cardiology',       'Specialized care for heart and cardiovascular disorders',       'Block A, Floor 2',       '+91 80 2345 6701'),
(2, 'Neurology',        'Diagnosis and treatment of brain and nervous system conditions','Block A, Floor 3',       '+91 80 2345 6702'),
(3, 'Orthopedics',      'Treatment for bones, joints, ligaments, and tendons',          'Block B, Floor 1',       '+91 80 2345 6703'),
(4, 'Pediatrics',       'Comprehensive medical care for infants, children, and adolescents','Block B, Floor 2',   '+91 80 2345 6704'),
(5, 'Dermatology',      'Advanced skin, hair, and nail healthcare',                     'Block B, Floor 3',       '+91 80 2345 6705'),
(6, 'General Medicine', 'Primary adult healthcare, acute and chronic disease management','Block C, Floor 1',      '+91 80 2345 6706'),
(7, 'ENT',              'Comprehensive ear, nose, and throat clinical care',             'Block C, Floor 2',       '+91 80 2345 6707'),
(8, 'Ophthalmology',    'Complete eye care, optical evaluation, and microsurgery',       'Block C, Floor 3',       '+91 80 2345 6708'),
(9, 'Emergency',        '24/7 Acute trauma and emergency critical resuscitation',        'Block A, Ground Floor',  '+91 80 2345 6709');

-- 2. USERS (BCrypt hash for Demo@123)
INSERT INTO users (user_id, username, password_hash, email, role, is_active) VALUES
(1, 'demo.admin',   '$2a$10$ct0lWSNWnqV2.GVn2sjICekFOGmlH/lbCY5kMVkJ3m5zLGNh4joHS', 'admin@medicore.com',   'ADMIN',   1),
(2, 'demo.doctor',  '$2a$10$ct0lWSNWnqV2.GVn2sjICekFOGmlH/lbCY5kMVkJ3m5zLGNh4joHS', 'doctor@medicore.com',  'DOCTOR',  1),
(3, 'demo.patient', '$2a$10$ct0lWSNWnqV2.GVn2sjICekFOGmlH/lbCY5kMVkJ3m5zLGNh4joHS', 'patient@medicore.com', 'PATIENT', 1);

-- 3. DOCTORS
INSERT INTO doctors (doctor_id, user_id, first_name, last_name, email, phone, specialization, department_id, qualification, experience_years, status) VALUES
(2001, 2,    'Rajesh',  'Kumar',  'doctor@medicore.com',          '9811122201', 'Interventional Cardiology', 1, 'MD, DM Cardiology, FACC',        16, 'Active'),
(2002, NULL, 'Priya',   'Sharma', 'priya.sharma@medicore.com',    '9811122202', 'Clinical Neurology',        2, 'MD, DM Neurology',               12, 'Active'),
(2003, NULL, 'Anil',    'Verma',  'anil.verma@medicore.com',      '9811122203', 'Orthopedic Surgery',        3, 'MS Orthopedics, MCh',            18, 'Active'),
(2004, NULL, 'Sunita',  'Patel',  'sunita.patel@medicore.com',    '9811122204', 'Pediatric Medicine',        4, 'MD Pediatrics, DCH',             10, 'Active'),
(2005, NULL, 'Vikram',  'Singh',  'vikram.singh@medicore.com',    '9811122205', 'Clinical Dermatology',      5, 'MD Dermatology, DVD',             8, 'Active'),
(2006, NULL, 'Meera',   'Reddy',  'meera.reddy@medicore.com',     '9811122206', 'Internal Medicine',         6, 'MD General Medicine',            14, 'Active'),
(2007, NULL, 'Arjun',   'Nair',   'arjun.nair@medicore.com',      '9811122207', 'Otolaryngology (ENT)',      7, 'MS ENT, DLO',                    11, 'Active'),
(2008, NULL, 'Kavita',  'Iyer',   'kavita.iyer@medicore.com',     '9811122208', 'Ophthalmic Surgery',        8, 'MS Ophthalmology, DO',            9, 'Active'),
(2009, NULL, 'Suresh',  'Gupta',  'suresh.gupta@medicore.com',    '9811122209', 'Emergency Trauma',          9, 'MD Emergency Medicine, MRCEM',   15, 'Active'),
(2010, NULL, 'Anita',   'Desai',  'anita.desai@medicore.com',     '9811122210', 'Cardiothoracic Care',       1, 'DM Cardiology, MD Medicine',      7, 'Active');

-- 4. PATIENTS
INSERT INTO patients (patient_id, user_id, first_name, last_name, date_of_birth, gender, blood_group, phone, email, address, emergency_contact_name, emergency_contact_phone, registration_date) VALUES
(1001, 3, 'Amit', 'Sharma', '1988-05-15', 'Male', 'O+', '9876543210', 'patient@medicore.com', '42 MG Road, Bangalore', 'Pooja Sharma', '9876543211', '2024-01-10'),
(1002, NULL, 'Priya', 'Nair', '1995-08-22', 'Female', 'B+', '9876543220', 'priya.nair@example.com', '15 Brigade Road, Bangalore', 'Raj Nair', '9876543221', '2024-02-14'),
(1003, NULL, 'Rahul', 'Mehta', '1979-12-01', 'Male', 'A-', '9876543230', 'rahul.mehta@example.com', '78 Koramangala, Bangalore', 'Sunita Mehta', '9876543231', '2024-03-05');

-- 5. ROOMS
INSERT INTO rooms (room_id, room_number, room_type, floor_number, daily_charge, status) VALUES
(1,  'G-101', 'General Ward',  1, 1500.00, 'Available'),
(2,  'G-102', 'General Ward',  1, 1500.00, 'Available'),
(3,  'G-103', 'General Ward',  1, 1500.00, 'Available'),
(4,  'SP-201','Semi Private',  2, 3000.00, 'Available'),
(5,  'SP-202','Semi Private',  2, 3000.00, 'Available'),
(6,  'SP-203','Semi Private',  2, 3000.00, 'Available'),
(7,  'P-301', 'Private',       3, 5000.00, 'Available'),
(8,  'P-302', 'Private',       3, 5000.00, 'Available'),
(9,  'P-303', 'Private',       3, 5000.00, 'Available'),
(10, 'ICU-01','ICU',           4,12000.00, 'Available'),
(11, 'ICU-02','ICU',           4,12000.00, 'Available'),
(12, 'ICU-03','ICU',           4,12000.00, 'Available'),
(13, 'EM-01', 'Emergency',     1, 8000.00, 'Available'),
(14, 'EM-02', 'Emergency',     1, 8000.00, 'Available'),
(15, 'EM-03', 'Emergency',     1, 8000.00, 'Available');

-- 6. MEDICINES
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES
(1,  'Paracetamol 500mg',     'Analgesic',       'Sun Pharma',      12.50,  500, '2026-12-31', 50),
(2,  'Amoxicillin 500mg',     'Antibiotic',      'Cipla',           45.00,  300, '2026-09-30', 30),
(3,  'Ibuprofen 400mg',       'NSAID',           'Abbott',          18.00,  400, '2026-11-30', 40),
(4,  'Metformin 500mg',       'Antidiabetic',    'USV Pharma',      22.00,  600, '2027-03-31', 60),
(5,  'Atorvastatin 10mg',     'Statin',          'Ranbaxy',         35.00,  250, '2027-01-31', 25),
(6,  'Omeprazole 20mg',       'PPI',             'Dr. Reddy',       28.00,  350, '2026-10-31', 35),
(7,  'Azithromycin 500mg',    'Antibiotic',      'Zydus',           85.00,  200, '2026-08-31', 20),
(8,  'Cetirizine 10mg',       'Antihistamine',   'Mankind',         10.00,  450, '2027-06-30', 45),
(9,  'Losartan 50mg',         'Antihypertensive','Lupin',           42.00,  300, '2027-02-28', 30),
(10, 'Pantoprazole 40mg',     'PPI',             'Aristo',          32.00,  280, '2026-12-31', 28),
(11, 'Dolo 650mg',            'Analgesic',       'Micro Labs',      18.00,  600, '2027-04-30', 60),
(12, 'Clopidogrel 75mg',      'Antiplatelet',    'Sun Pharma',      55.00,  150, '2027-01-31', 15);

-- 7. APPOINTMENTS
INSERT INTO appointments (appointment_id, patient_id, doctor_id, department_id, appointment_date, appointment_time, reason, status, notes) VALUES
(3001, 1001, 2001, 1, CURRENT_DATE + 2, '10:00', 'Chest pain and shortness of breath',      'Scheduled',  NULL),
(3002, 1001, 2006, 6, CURRENT_DATE + 5, '11:30', 'Routine health checkup',                  'Confirmed',  'Fasting blood test required'),
(3003, 1002, 2002, 2, CURRENT_DATE - 3, '09:00', 'Recurring migraines',                     'Completed',  'MRI recommended'),
(3004, 1002, 2004, 4, CURRENT_DATE + 1, '14:00', 'Child vaccination follow-up',             'Scheduled',  NULL),
(3005, 1003, 2003, 3, CURRENT_DATE - 7, '15:00', 'Knee joint pain',                         'Completed',  'X-ray done, physiotherapy advised'),
(3006, 1003, 2001, 1, CURRENT_DATE + 3, '10:30', 'Post-cardiac checkup',                    'Scheduled',  NULL);

-- 8. MEDICAL RECORDS
INSERT INTO medical_records (record_id, patient_id, doctor_id, visit_date, symptoms, diagnosis, treatment, notes) VALUES
(5001, 1002, 2002, CURRENT_DATE - 3,
 'Severe headache, nausea, light sensitivity',
 'Migraine without aura (G43.0)',
 'Sumatriptan 50mg as needed; avoid triggers',
 'Patient reports weekly episodes for last 3 months. MRI of brain ordered to rule out secondary causes.'),
(5002, 1003, 2003, CURRENT_DATE - 7,
 'Right knee pain, swelling, difficulty walking',
 'Osteoarthritis of right knee (M17.1)',
 'Ibuprofen 400mg TDS, physiotherapy 3x/week, weight management',
 'X-ray shows moderate joint space narrowing. Follow-up in 4 weeks.');

-- 9. PRESCRIPTIONS
INSERT INTO prescriptions (prescription_id, patient_id, doctor_id, record_id, prescription_date, notes) VALUES
(6001, 1002, 2002, 5001, CURRENT_DATE - 3, 'Avoid bright lights; rest in dark room during episodes'),
(6002, 1003, 2003, 5002, CURRENT_DATE - 7, 'Take with food; avoid NSAIDs on empty stomach');

-- 10. PRESCRIPTION ITEMS
INSERT INTO prescription_items (item_id, prescription_id, medicine_id, dosage, frequency, duration, instructions) VALUES
(1, 6001, 3,  '400mg', 'Once at onset of migraine', '5 days',  'Take at first sign of migraine; max 3 doses/day'),
(2, 6001, 8,  '10mg',  'Once daily at night',        '30 days', 'For sleep disturbance during migraine'),
(3, 6002, 3,  '400mg', 'Three times daily',           '14 days', 'Take with food or milk'),
(4, 6002, 6,  '20mg',  'Once daily before breakfast', '14 days', 'For gastric protection while on NSAIDs');

-- 11. BILLS
INSERT INTO bills (bill_id, patient_id, appointment_id, consultation_charge, room_charge, medicine_charge, other_charges, discount, tax, total_amount, payment_status, payment_method, billing_date, payment_date) VALUES
(7001, 1002, 3003, 800.00, 0.00, 350.00, 200.00, 0.00, 135.00, 1485.00, 'Paid', 'Card', CURRENT_DATE - 3, CURRENT_DATE - 3),
(7002, 1003, 3005, 900.00, 0.00, 280.00, 150.00, 50.00, 128.00, 1408.00, 'Paid', 'UPI',  CURRENT_DATE - 7, CURRENT_DATE - 7),
(7003, 1001, 3001, 600.00, 0.00,   0.00,   0.00,  0.00,  60.00,  660.00, 'Pending', NULL, CURRENT_DATE, NULL);

-- 12. BILL ITEMS
INSERT INTO bill_items (bill_item_id, bill_id, description, category, amount, quantity) VALUES
(1, 7001, 'Neurology Consultation', 'Consultation', 800.00, 1),
(2, 7001, 'MRI Brain (contrast)',   'Investigation', 200.00, 1),
(3, 7001, 'Ibuprofen 400mg',        'Medicine',     108.00, 6),
(4, 7001, 'Cetirizine 10mg',        'Medicine',      60.00, 6),
(5, 7002, 'Orthopedics Consultation','Consultation', 900.00, 1),
(6, 7002, 'Knee X-Ray (bilateral)', 'Investigation', 150.00, 1),
(7, 7002, 'Ibuprofen 400mg',        'Medicine',     108.00, 6),
(8, 7002, 'Omeprazole 20mg',        'Medicine',      84.00, 3),
(9, 7003, 'Cardiology Consultation','Consultation', 600.00, 1);

SELECT 'MediCore HMS database restore complete!' AS status,
       (SELECT COUNT(*) FROM departments)  AS departments,
       (SELECT COUNT(*) FROM users)        AS users,
       (SELECT COUNT(*) FROM doctors)      AS doctors,
       (SELECT COUNT(*) FROM patients)     AS patients,
       (SELECT COUNT(*) FROM rooms)        AS rooms,
       (SELECT COUNT(*) FROM medicines)    AS medicines,
       (SELECT COUNT(*) FROM appointments) AS appointments,
       (SELECT COUNT(*) FROM medical_records) AS medical_records,
       (SELECT COUNT(*) FROM prescriptions)   AS prescriptions,
       (SELECT COUNT(*) FROM bills)           AS bills;
