-- ============================================================
-- FILE: data.sql
-- MediCore HMS - Standard Seed Data
-- Exactly 3 Demo Accounts (admin, doctor, patient)
-- Password for all demo accounts: Demo@123
-- Run AFTER: schema.sql, sequences.sql, constraints.sql
-- ============================================================

SET DEFINE OFF;

BEGIN

-- ============================================================
-- 1. DEPARTMENTS (9)
-- ============================================================
INSERT INTO departments (department_id, name, description, location, phone)
VALUES (1, 'Cardiology', 'Specialized care for heart and cardiovascular disorders', 'Block A, Floor 2', '+91 80 2345 6701');

INSERT INTO departments (department_id, name, description, location, phone)
VALUES (2, 'Neurology', 'Diagnosis and treatment of brain and nervous system conditions', 'Block A, Floor 3', '+91 80 2345 6702');

INSERT INTO departments (department_id, name, description, location, phone)
VALUES (3, 'Orthopedics', 'Treatment for bones, joints, ligaments, and tendons', 'Block B, Floor 1', '+91 80 2345 6703');

INSERT INTO departments (department_id, name, description, location, phone)
VALUES (4, 'Pediatrics', 'Comprehensive medical care for infants, children, and adolescents', 'Block B, Floor 2', '+91 80 2345 6704');

INSERT INTO departments (department_id, name, description, location, phone)
VALUES (5, 'Dermatology', 'Advanced skin, hair, and nail healthcare', 'Block B, Floor 3', '+91 80 2345 6705');

INSERT INTO departments (department_id, name, description, location, phone)
VALUES (6, 'General Medicine', 'Primary adult healthcare, acute and chronic disease management', 'Block C, Floor 1', '+91 80 2345 6706');

INSERT INTO departments (department_id, name, description, location, phone)
VALUES (7, 'ENT', 'Comprehensive ear, nose, and throat clinical care', 'Block C, Floor 2', '+91 80 2345 6707');

INSERT INTO departments (department_id, name, description, location, phone)
VALUES (8, 'Ophthalmology', 'Complete eye care, optical evaluation, and microsurgery', 'Block C, Floor 3', '+91 80 2345 6708');

INSERT INTO departments (department_id, name, description, location, phone)
VALUES (9, 'Emergency', '24/7 Acute trauma and emergency critical resuscitation', 'Block A, Ground Floor', '+91 80 2345 6709');

-- ============================================================
-- 2. USERS (Exactly 3 Canonical Demo Accounts)
-- BCrypt Hash for 'Demo@123'
-- ============================================================
INSERT INTO users (user_id, username, password_hash, email, role, is_active)
VALUES (1, 'demo.admin', '$2a$10$ct0lWSNWnqV2.GVn2sjICekFOGmlH/lbCY5kMVkJ3m5zLGNh4joHS', 'admin@medicore.com', 'ADMIN', 1);

INSERT INTO users (user_id, username, password_hash, email, role, is_active)
VALUES (2, 'demo.doctor', '$2a$10$ct0lWSNWnqV2.GVn2sjICekFOGmlH/lbCY5kMVkJ3m5zLGNh4joHS', 'doctor@medicore.com', 'DOCTOR', 1);

INSERT INTO users (user_id, username, password_hash, email, role, is_active)
VALUES (3, 'demo.patient', '$2a$10$ct0lWSNWnqV2.GVn2sjICekFOGmlH/lbCY5kMVkJ3m5zLGNh4joHS', 'patient@medicore.com', 'PATIENT', 1);

-- ============================================================
-- 3. DOCTORS (10 Physicians across specialties)
-- ============================================================
INSERT INTO doctors (doctor_id, user_id, first_name, last_name, email, phone, specialization, department_id, qualification, experience_years, status)
VALUES (2001, 2, 'Rajesh', 'Kumar', 'doctor@medicore.com', '9811122201', 'Interventional Cardiology', 1, 'MD, DM Cardiology, FACC', 16, 'Active');

INSERT INTO doctors (doctor_id, user_id, first_name, last_name, email, phone, specialization, department_id, qualification, experience_years, status)
VALUES (2002, NULL, 'Priya', 'Sharma', 'priya.sharma@medicore.com', '9811122202', 'Clinical Neurology', 2, 'MD, DM Neurology', 12, 'Active');

INSERT INTO doctors (doctor_id, user_id, first_name, last_name, email, phone, specialization, department_id, qualification, experience_years, status)
VALUES (2003, NULL, 'Anil', 'Verma', 'anil.verma@medicore.com', '9811122203', 'Orthopedic Surgery', 3, 'MS Orthopedics, MCh', 18, 'Active');

INSERT INTO doctors (doctor_id, user_id, first_name, last_name, email, phone, specialization, department_id, qualification, experience_years, status)
VALUES (2004, NULL, 'Sunita', 'Patel', 'sunita.patel@medicore.com', '9811122204', 'Pediatric Medicine', 4, 'MD Pediatrics, DCH', 10, 'Active');

INSERT INTO doctors (doctor_id, user_id, first_name, last_name, email, phone, specialization, department_id, qualification, experience_years, status)
VALUES (2005, NULL, 'Vikram', 'Singh', 'vikram.singh@medicore.com', '9811122205', 'Clinical Dermatology', 5, 'MD Dermatology, DVD', 8, 'Active');

INSERT INTO doctors (doctor_id, user_id, first_name, last_name, email, phone, specialization, department_id, qualification, experience_years, status)
VALUES (2006, NULL, 'Meera', 'Reddy', 'meera.reddy@medicore.com', '9811122206', 'Internal Medicine', 6, 'MD General Medicine', 14, 'Active');

INSERT INTO doctors (doctor_id, user_id, first_name, last_name, email, phone, specialization, department_id, qualification, experience_years, status)
VALUES (2007, NULL, 'Arjun', 'Nair', 'arjun.nair@medicore.com', '9811122207', 'Otolaryngology (ENT)', 7, 'MS ENT, DLO', 11, 'Active');

INSERT INTO doctors (doctor_id, user_id, first_name, last_name, email, phone, specialization, department_id, qualification, experience_years, status)
VALUES (2008, NULL, 'Kavita', 'Iyer', 'kavita.iyer@medicore.com', '9811122208', 'Ophthalmic Surgery', 8, 'MS Ophthalmology, DO', 9, 'Active');

INSERT INTO doctors (doctor_id, user_id, first_name, last_name, email, phone, specialization, department_id, qualification, experience_years, status)
VALUES (2009, NULL, 'Suresh', 'Gupta', 'suresh.gupta@medicore.com', '9811122209', 'Emergency Trauma', 9, 'MD Emergency Medicine, MRCEM', 15, 'Active');

INSERT INTO doctors (doctor_id, user_id, first_name, last_name, email, phone, specialization, department_id, qualification, experience_years, status)
VALUES (2010, NULL, 'Anita', 'Desai', 'anita.desai@medicore.com', '9811122210', 'Cardiothoracic Care', 1, 'DM Cardiology, MD Medicine', 7, 'Active');

-- ============================================================
-- 4. PATIENTS (Canonical Demo Patient: Amit Sharma)
-- ============================================================
INSERT INTO patients (patient_id, user_id, first_name, last_name, date_of_birth, gender, blood_group, phone, email, address, emergency_contact_name, emergency_contact_phone, registration_date)
VALUES (1001, 3, 'Amit', 'Sharma', TO_DATE('1988-05-15', 'YYYY-MM-DD'), 'Male', 'O+', '9876543210', 'patient@medicore.com', '42 MG Road, Bangalore', 'Pooja Sharma', '9876543211', TO_DATE('2024-01-10', 'YYYY-MM-DD'));

-- ============================================================
-- 5. ROOMS (15 Rooms)
-- ============================================================
INSERT INTO rooms (room_id, room_number, room_type, floor_number, daily_charge, status) VALUES (1, 'GW-101', 'General Ward', 1, 500.00, 'Available');
INSERT INTO rooms (room_id, room_number, room_type, floor_number, daily_charge, status) VALUES (2, 'GW-102', 'General Ward', 1, 500.00, 'Available');
INSERT INTO rooms (room_id, room_number, room_type, floor_number, daily_charge, status) VALUES (3, 'GW-103', 'General Ward', 1, 500.00, 'Available');
INSERT INTO rooms (room_id, room_number, room_type, floor_number, daily_charge, status) VALUES (4, 'GW-104', 'General Ward', 1, 500.00, 'Available');
INSERT INTO rooms (room_id, room_number, room_type, floor_number, daily_charge, status) VALUES (5, 'GW-105', 'General Ward', 1, 500.00, 'Available');
INSERT INTO rooms (room_id, room_number, room_type, floor_number, daily_charge, status) VALUES (6, 'SP-201', 'Semi Private', 2, 1500.00, 'Available');
INSERT INTO rooms (room_id, room_number, room_type, floor_number, daily_charge, status) VALUES (7, 'SP-202', 'Semi Private', 2, 1500.00, 'Available');
INSERT INTO rooms (room_id, room_number, room_type, floor_number, daily_charge, status) VALUES (8, 'SP-203', 'Semi Private', 2, 1500.00, 'Available');
INSERT INTO rooms (room_id, room_number, room_type, floor_number, daily_charge, status) VALUES (9, 'PR-301', 'Private', 3, 3000.00, 'Available');
INSERT INTO rooms (room_id, room_number, room_type, floor_number, daily_charge, status) VALUES (10, 'PR-302', 'Private', 3, 3000.00, 'Available');
INSERT INTO rooms (room_id, room_number, room_type, floor_number, daily_charge, status) VALUES (11, 'PR-303', 'Private', 3, 3000.00, 'Available');
INSERT INTO rooms (room_id, room_number, room_type, floor_number, daily_charge, status) VALUES (12, 'ICU-401', 'ICU', 4, 5000.00, 'Available');
INSERT INTO rooms (room_id, room_number, room_type, floor_number, daily_charge, status) VALUES (13, 'ICU-402', 'ICU', 4, 5000.00, 'Available');
INSERT INTO rooms (room_id, room_number, room_type, floor_number, daily_charge, status) VALUES (14, 'ER-501', 'Emergency', 5, 2000.00, 'Available');
INSERT INTO rooms (room_id, room_number, room_type, floor_number, daily_charge, status) VALUES (15, 'ER-502', 'Emergency', 5, 2000.00, 'Available');

-- ============================================================
-- 6. MEDICINES (20 Core Formulary)
-- ============================================================
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (1, 'Paracetamol 500mg', 'Analgesic', 'Cipla Ltd', 2.50, 500, TO_DATE('2026-12-31', 'YYYY-MM-DD'), 50);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (2, 'Amoxicillin 500mg', 'Antibiotic', 'Sun Pharma', 8.00, 200, TO_DATE('2026-08-31', 'YYYY-MM-DD'), 30);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (3, 'Ibuprofen 400mg', 'NSAID', 'Abbott India', 3.50, 350, TO_DATE('2026-11-30', 'YYYY-MM-DD'), 40);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (4, 'Metformin 500mg', 'Antidiabetic', 'USV Ltd', 4.00, 400, TO_DATE('2027-01-31', 'YYYY-MM-DD'), 50);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (5, 'Atorvastatin 10mg', 'Cardiovascular', 'Zydus Cadila', 12.00, 300, TO_DATE('2026-10-31', 'YYYY-MM-DD'), 30);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (6, 'Omeprazole 20mg', 'Antacid', 'Dr. Reddy''s', 5.50, 250, TO_DATE('2026-09-30', 'YYYY-MM-DD'), 40);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (7, 'Cetirizine 10mg', 'Antihistamine', 'Cipla Ltd', 3.00, 450, TO_DATE('2027-03-31', 'YYYY-MM-DD'), 50);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (8, 'Azithromycin 500mg', 'Antibiotic', 'Lupin Ltd', 22.00, 150, TO_DATE('2026-07-31', 'YYYY-MM-DD'), 25);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (9, 'Amlodipine 5mg', 'Cardiovascular', 'Torrent Pharma', 4.50, 350, TO_DATE('2026-12-31', 'YYYY-MM-DD'), 40);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (10, 'Ciprofloxacin 500mg', 'Antibiotic', 'Sun Pharma', 9.00, 180, TO_DATE('2026-06-30', 'YYYY-MM-DD'), 30);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (11, 'Diclofenac 50mg', 'NSAID', 'Novartis', 4.00, 280, TO_DATE('2026-11-30', 'YYYY-MM-DD'), 35);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (12, 'Pantoprazole 40mg', 'Antacid', 'Alkem Labs', 7.50, 300, TO_DATE('2027-02-28', 'YYYY-MM-DD'), 40);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (13, 'Metoprolol 25mg', 'Cardiovascular', 'AstraZeneca', 6.00, 200, TO_DATE('2026-10-31', 'YYYY-MM-DD'), 30);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (14, 'Losartan 50mg', 'Cardiovascular', 'Glenmark', 8.50, 220, TO_DATE('2026-09-30', 'YYYY-MM-DD'), 30);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (15, 'Doxycycline 100mg', 'Antibiotic', 'Cadila', 6.50, 120, TO_DATE('2026-05-31', 'YYYY-MM-DD'), 20);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (16, 'Ranitidine 150mg', 'Antacid', 'GSK', 3.00, 8, TO_DATE('2026-04-30', 'YYYY-MM-DD'), 25);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (17, 'Montelukast 10mg', 'Respiratory', 'Mankind Pharma', 11.00, 160, TO_DATE('2026-08-31', 'YYYY-MM-DD'), 30);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (18, 'Gabapentin 300mg', 'Neurology', 'Sun Pharma', 15.00, 140, TO_DATE('2026-12-31', 'YYYY-MM-DD'), 25);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (19, 'Clopidogrel 75mg', 'Cardiovascular', 'Sanofi', 14.00, 180, TO_DATE('2026-11-30', 'YYYY-MM-DD'), 30);
INSERT INTO medicines (medicine_id, name, category, manufacturer, unit_price, stock_quantity, expiry_date, reorder_level) VALUES (20, 'Salbutamol Inhaler', 'Respiratory', 'Cipla Ltd', 120.00, 50, TO_DATE('2027-06-30', 'YYYY-MM-DD'), 15);

-- ============================================================
-- 7. APPOINTMENTS (Demo Patient & Demo Doctor)
-- ============================================================
INSERT INTO appointments (appointment_id, patient_id, doctor_id, department_id, appointment_date, appointment_time, reason, status, notes)
VALUES (3001, 1001, 2001, 1, TRUNC(SYSDATE) + 2, '10:00 AM', 'Cardiac Routine Follow-up', 'Scheduled', 'Patient advised to bring previous ECG reports');

INSERT INTO appointments (appointment_id, patient_id, doctor_id, department_id, appointment_date, appointment_time, reason, status, notes)
VALUES (3002, 1001, 2001, 1, TRUNC(SYSDATE) - 10, '11:30 AM', 'Chest Tightness Consultation', 'Completed', 'ECG Normal, blood pressure monitoring advised');

-- ============================================================
-- 8. MEDICAL RECORDS
-- ============================================================
INSERT INTO medical_records (record_id, patient_id, doctor_id, visit_date, symptoms, diagnosis, treatment, notes)
VALUES (5001, 1001, 2001, TRUNC(SYSDATE) - 10, 'Mild chest tightness after exercise, occasional headache',
'Essential Hypertension Stage 1', 'Low sodium diet, daily aerobic walking 30 min, Amlodipine 5mg OD',
'Patient advised regular BP monitoring and lifestyle modifications. Return in 2 weeks.');

-- ============================================================
-- 9. PRESCRIPTIONS & ITEMS
-- ============================================================
INSERT INTO prescriptions (prescription_id, patient_id, doctor_id, record_id, prescription_date, notes)
VALUES (6001, 1001, 2001, 5001, TRUNC(SYSDATE) - 10, 'Take medication strictly in the morning after breakfast');

INSERT INTO prescription_items (item_id, prescription_id, medicine_id, dosage, frequency, duration, instructions)
VALUES (1, 6001, 9, '5mg', 'Once Daily', '30 Days', 'Take with water after breakfast');

INSERT INTO prescription_items (item_id, prescription_id, medicine_id, dosage, frequency, duration, instructions)
VALUES (2, 6001, 1, '500mg', 'As Needed', '5 Days', 'Take for headache if required, max 2 tablets daily');

-- ============================================================
-- 10. BILLS & ITEMS
-- ============================================================
INSERT INTO bills (bill_id, patient_id, appointment_id, consultation_charge, room_charge, medicine_charge, other_charges, discount, tax, total_amount, payment_status, payment_method, billing_date, payment_date)
VALUES (7001, 1001, 3002, 800.00, 0.00, 400.00, 100.00, 0.00, 117.00, 1417.00, 'Paid', 'UPI', TRUNC(SYSDATE) - 10, TRUNC(SYSDATE) - 10);

INSERT INTO bill_items (bill_item_id, bill_id, description, category, amount, quantity)
VALUES (1, 7001, 'Senior Cardiologist Specialist Consultation', 'Consultation', 800.00, 1);

INSERT INTO bill_items (bill_item_id, bill_id, description, category, amount, quantity)
VALUES (2, 7001, 'Amlodipine 5mg (30 Tabs) and Paracetamol', 'Pharmacy', 400.00, 1);

INSERT INTO bill_items (bill_item_id, bill_id, description, category, amount, quantity)
VALUES (3, 7001, 'Resting ECG and Blood Pressure Screening', 'Diagnostic', 100.00, 1);

COMMIT;
END;
/
