-- ============================================================
-- MediCore HMS — Supabase PostgreSQL Seed Data
-- Script 07: 07_data.sql
-- Exactly 3 Canonical Demo Accounts (Admin, Doctor, Patient)
-- Password for all 3 demo accounts: Demo@123
-- BCrypt Hash: $2a$10$ct0lWSNWnqV2.GVn2sjICekFOGmlH/lbCY5kMVkJ3m5zLGNh4joHS
-- ============================================================

-- Clean existing data before seeding (tables are dropped in schema.sql, but safe truncate if run standalone)
TRUNCATE TABLE bill_items, bills, prescription_items, prescriptions, medicines, 
               medical_records, admissions, rooms, appointments, doctors, 
               patients, departments, users CASCADE;

-- ------------------------------------------------------------
-- 1. DEPARTMENTS (9 Core Specialties)
-- ------------------------------------------------------------
INSERT INTO departments (department_id, name, description, location, phone) VALUES
(1, 'Cardiology', 'Specialized care for heart and cardiovascular disorders', 'Block A, Floor 2', '+91 80 2345 6701'),
(2, 'Neurology', 'Diagnosis and treatment of brain and nervous system conditions', 'Block A, Floor 3', '+91 80 2345 6702'),
(3, 'Orthopedics', 'Treatment for bones, joints, ligaments, and tendons', 'Block B, Floor 1', '+91 80 2345 6703'),
(4, 'Pediatrics', 'Comprehensive medical care for infants, children, and adolescents', 'Block B, Floor 2', '+91 80 2345 6704'),
(5, 'Dermatology', 'Advanced skin, hair, and nail healthcare', 'Block B, Floor 3', '+91 80 2345 6705'),
(6, 'General Medicine', 'Primary adult healthcare, acute and chronic disease management', 'Block C, Floor 1', '+91 80 2345 6706'),
(7, 'ENT', 'Comprehensive ear, nose, and throat clinical care', 'Block C, Floor 2', '+91 80 2345 6707'),
(8, 'Ophthalmology', 'Complete eye care, optical evaluation, and microsurgery', 'Block C, Floor 3', '+91 80 2345 6708'),
(9, 'Emergency', '24/7 Acute trauma and emergency critical resuscitation', 'Block A, Ground Floor', '+91 80 2345 6709');

-- ------------------------------------------------------------
-- 2. USERS (Exactly 3 Canonical Demo Accounts)
-- ------------------------------------------------------------
INSERT INTO users (user_id, username, password_hash, email, role, is_active) VALUES
(1, 'demo.admin', '$2a$10$ct0lWSNWnqV2.GVn2sjICekFOGmlH/lbCY5kMVkJ3m5zLGNh4joHS', 'admin@medicore.com', 'ADMIN', 1),
(2, 'demo.doctor', '$2a$10$ct0lWSNWnqV2.GVn2sjICekFOGmlH/lbCY5kMVkJ3m5zLGNh4joHS', 'doctor@medicore.com', 'DOCTOR', 1),
(3, 'demo.patient', '$2a$10$ct0lWSNWnqV2.GVn2sjICekFOGmlH/lbCY5kMVkJ3m5zLGNh4joHS', 'patient@medicore.com', 'PATIENT', 1);

-- ------------------------------------------------------------
-- 3. DOCTORS (10 Physicians across departments)
-- ------------------------------------------------------------
INSERT INTO doctors (doctor_id, user_id, first_name, last_name, email, phone, specialization, department_id, qualification, experience_years, status) VALUES
(2001, 2, 'Rajesh', 'Kumar', 'doctor@medicore.com', '9811122201', 'Interventional Cardiology', 1, 'MD, DM Cardiology, FACC', 16, 'Active'),
(2002, NULL, 'Priya', 'Sharma', 'priya.sharma@medicore.com', '9811122202', 'Clinical Neurology', 2, 'MD, DM Neurology', 12, 'Active'),
(2003, NULL, 'Anil', 'Verma', 'anil.verma@medicore.com', '9811122203', 'Orthopedic Surgery', 3, 'MS Orthopedics, MCh', 18, 'Active'),
(2004, NULL, 'Sunita', 'Patel', 'sunita.patel@medicore.com', '9811122204', 'Pediatric Medicine', 4, 'MD Pediatrics, DCH', 10, 'Active'),
(2005, NULL, 'Vikram', 'Singh', 'vikram.singh@medicore.com', '9811122205', 'Clinical Dermatology', 5, 'MD Dermatology, DVD', 8, 'Active'),
(2006, NULL, 'Meera', 'Reddy', 'meera.reddy@medicore.com', '9811122206', 'Internal Medicine', 6, 'MD General Medicine', 14, 'Active'),
(2007, NULL, 'Arjun', 'Nair', 'arjun.nair@medicore.com', '9811122207', 'Otolaryngology (ENT)', 7, 'MS ENT, DLO', 11, 'Active'),
(2008, NULL, 'Kavita', 'Iyer', 'kavita.iyer@medicore.com', '9811122208', 'Ophthalmic Surgery', 8, 'MS Ophthalmology, DO', 9, 'Active'),
(2009, NULL, 'Suresh', 'Gupta', 'suresh.gupta@medicore.com', '9811122209', 'Emergency Trauma', 9, 'MD Emergency Medicine, MRCEM', 15, 'Active'),
(2010, NULL, 'Anita', 'Desai', 'anita.desai@medicore.com', '9811122210', 'Cardiothoracic Care', 1, 'DM Cardiology, MD Medicine', 7, 'Active');

-- ------------------------------------------------------------
-- 4. PATIENTS (Canonical Demo Patient: Amit Sharma)
-- ------------------------------------------------------------
INSERT INTO patients (patient_id, user_id, first_name, last_name, date_of_birth, gender, blood_group, phone, email, address, emergency_contact_name, emergency_contact_phone, registration_date) VALUES
(1001, 3, 'Amit', 'Sharma', '1988-05-15', 'Male', 'O+', '9876543210', 'patient@medicore.com', '42 MG Road, Bangalore', 'Pooja Sharma', '9876543211', '2024-01-10');

-- ------------------------------------------------------------
-- 5. ROOMS (15 Hospital Rooms)
-- ------------------------------------------------------------
INSERT INTO rooms (room_id, room_number, room_type, floor_number, daily_charge, status) VALUES
(1, 'GW-101', 'General Ward', 1, 500.00, 'Available'),
(2, 'GW-102', 'General Ward', 1, 500.00, 'Available'),
(3, 'GW-103', 'General Ward', 1, 500.00, 'Available'),
(4, 'GW-104', 'General Ward', 1, 500.00, 'Available'),
(5, 'GW-105', 'General Ward', 1, 500.00, 'Available'),
(6, 'SP-201', 'Semi Private', 2, 1500.00, 'Available'),
(7, 'SP-202', 'Semi Private', 2, 1500.00, 'Available'),
(8, 'SP-203', 'Semi Private', 2, 1500.00, 'Available'),
(9, 'PR-301', 'Private', 3, 3000.00, 'Available'),
(10, 'PR-302', 'Private', 3, 3000.00, 'Available'),
(11, 'PR-303', 'Private', 3, 3000.00, 'Available'),
(12, 'ICU-401', 'ICU', 4, 5000.00, 'Available'),
(13, 'ICU-402', 'ICU', 4, 5000.00, 'Available'),
(14, 'ER-501', 'Emergency', 5, 2000.00, 'Available'),
(15, 'ER-502', 'Emergency', 5, 2000.00, 'Available');

-- ------------------------------------------------------------
-- 6. MEDICINES (20 Core Formulary)
-- ------------------------------------------------------------
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES
(1, 'Paracetamol 500mg', 'Analgesic', 'Cipla Ltd', 2.50, 500, '2026-12-31', 50),
(2, 'Amoxicillin 500mg', 'Antibiotic', 'Sun Pharma', 8.00, 200, '2026-08-31', 30),
(3, 'Ibuprofen 400mg', 'NSAID', 'Abbott India', 3.50, 350, '2026-11-30', 40),
(4, 'Metformin 500mg', 'Antidiabetic', 'USV Ltd', 4.00, 400, '2027-01-31', 50),
(5, 'Atorvastatin 10mg', 'Cardiovascular', 'Zydus Cadila', 12.00, 300, '2026-10-31', 30),
(6, 'Omeprazole 20mg', 'Antacid', 'Dr. Reddy''s', 5.50, 250, '2026-09-30', 40),
(7, 'Cetirizine 10mg', 'Antihistamine', 'Cipla Ltd', 3.00, 450, '2027-03-31', 50),
(8, 'Azithromycin 500mg', 'Antibiotic', 'Lupin Ltd', 22.00, 150, '2026-07-31', 25),
(9, 'Amlodipine 5mg', 'Cardiovascular', 'Torrent Pharma', 4.50, 350, '2026-12-31', 40),
(10, 'Ciprofloxacin 500mg', 'Antibiotic', 'Sun Pharma', 9.00, 180, '2026-06-30', 30),
(11, 'Diclofenac 50mg', 'NSAID', 'Novartis', 4.00, 280, '2026-11-30', 35),
(12, 'Pantoprazole 40mg', 'Antacid', 'Alkem Labs', 7.50, 300, '2027-02-28', 40),
(13, 'Metoprolol 25mg', 'Cardiovascular', 'AstraZeneca', 6.00, 200, '2026-10-31', 30),
(14, 'Losartan 50mg', 'Cardiovascular', 'Glenmark', 8.50, 220, '2026-09-30', 30),
(15, 'Doxycycline 100mg', 'Antibiotic', 'Cadila', 6.50, 120, '2026-05-31', 20),
(16, 'Ranitidine 150mg', 'Antacid', 'GSK', 3.00, 8, '2026-04-30', 25),
(17, 'Montelukast 10mg', 'Respiratory', 'Mankind Pharma', 11.00, 160, '2026-08-31', 30),
(18, 'Gabapentin 300mg', 'Neurology', 'Sun Pharma', 15.00, 140, '2026-12-31', 25),
(19, 'Clopidogrel 75mg', 'Cardiovascular', 'Sanofi', 14.00, 180, '2026-11-30', 30),
(20, 'Salbutamol Inhaler', 'Respiratory', 'Cipla Ltd', 120.00, 50, '2027-06-30', 15);

-- ------------------------------------------------------------
-- 7. APPOINTMENTS (Demo Patient & Demo Doctor)
-- ------------------------------------------------------------
INSERT INTO appointments (appointment_id, patient_id, doctor_id, department_id, appointment_date, appointment_time, reason, status, notes) VALUES
(3001, 1001, 2001, 1, CURRENT_DATE + 2, '10:00 AM', 'Cardiac Routine Follow-up', 'Scheduled', 'Patient advised to bring previous ECG reports'),
(3002, 1001, 2001, 1, CURRENT_DATE - 10, '11:30 AM', 'Chest Tightness Consultation', 'Completed', 'ECG Normal, blood pressure monitoring advised');

-- ------------------------------------------------------------
-- 8. MEDICAL RECORDS
-- ------------------------------------------------------------
INSERT INTO medical_records (record_id, patient_id, doctor_id, visit_date, symptoms, diagnosis, treatment, notes) VALUES
(5001, 1001, 2001, CURRENT_DATE - 10, 'Mild chest tightness after exercise, occasional headache',
 'Essential Hypertension Stage 1', 'Low sodium diet, daily aerobic walking 30 min, Amlodipine 5mg OD',
 'Patient advised regular BP monitoring and lifestyle modifications. Return in 2 weeks.');

-- ------------------------------------------------------------
-- 9. PRESCRIPTIONS & ITEMS
-- ------------------------------------------------------------
INSERT INTO prescriptions (prescription_id, patient_id, doctor_id, record_id, prescription_date, notes) VALUES
(6001, 1001, 2001, 5001, CURRENT_DATE - 10, 'Take medication strictly in the morning after breakfast');

INSERT INTO prescription_items (item_id, prescription_id, medicine_id, dosage, frequency, duration, instructions) VALUES
(1, 6001, 9, '5mg', 'Once Daily', '30 Days', 'Take with water after breakfast'),
(2, 6001, 1, '500mg', 'As Needed', '5 Days', 'Take for headache if required, max 2 tablets daily');

-- ------------------------------------------------------------
-- 10. BILLS & ITEMS
-- ------------------------------------------------------------
INSERT INTO bills (bill_id, patient_id, appointment_id, consultation_charge, room_charge, medicine_charge, other_charges, discount, tax, total_amount, payment_status, payment_method, billing_date, payment_date) VALUES
(7001, 1001, 3002, 800.00, 0.00, 400.00, 100.00, 0.00, 117.00, 1417.00, 'Paid', 'UPI', CURRENT_DATE - 10, CURRENT_DATE - 10);

INSERT INTO bill_items (bill_item_id, bill_id, description, category, amount, quantity) VALUES
(1, 7001, 'Senior Cardiologist Specialist Consultation', 'Consultation', 800.00, 1),
(2, 7001, 'Amlodipine 5mg (30 Tabs) and Paracetamol', 'Pharmacy', 400.00, 1),
(3, 7001, 'Resting ECG and Blood Pressure Screening', 'Diagnostic', 100.00, 1);

-- ------------------------------------------------------------
-- 11. SYNCHRONIZE POSTGRESQL SEQUENCES
-- Guarantees nextval() starts above existing primary keys
-- ------------------------------------------------------------
SELECT setval('user_seq', COALESCE((SELECT MAX(user_id) FROM users), 1));
SELECT setval('department_seq', COALESCE((SELECT MAX(department_id) FROM departments), 1));
SELECT setval('patient_seq', COALESCE((SELECT MAX(patient_id) FROM patients), 1001));
SELECT setval('doctor_seq', COALESCE((SELECT MAX(doctor_id) FROM doctors), 2001));
SELECT setval('appointment_seq', COALESCE((SELECT MAX(appointment_id) FROM appointments), 3001));
SELECT setval('room_seq', COALESCE((SELECT MAX(room_id) FROM rooms), 1));
SELECT setval('admission_seq', 4001);
SELECT setval('medical_record_seq', COALESCE((SELECT MAX(record_id) FROM medical_records), 5001));
SELECT setval('medicine_seq', COALESCE((SELECT MAX(medicine_id) FROM medicines), 1));
SELECT setval('prescription_seq', COALESCE((SELECT MAX(prescription_id) FROM prescriptions), 6001));
SELECT setval('prescription_item_seq', COALESCE((SELECT MAX(item_id) FROM prescription_items), 1));
SELECT setval('bill_seq', COALESCE((SELECT MAX(bill_id) FROM bills), 7001));
SELECT setval('bill_item_seq', COALESCE((SELECT MAX(bill_item_id) FROM bill_items), 1));
