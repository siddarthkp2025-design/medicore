-- ============================================================
-- FILE: seed_cleanup.sql
-- MediCore HMS: Clean Seed Data
-- Retains EXACTLY 3 Demo Accounts (admin, doctor, patient)
-- Password for all 3 is: Demo@123
-- Purges fake patient accounts while preserving master data
-- ============================================================

-- Step 1: Disconnect non-demo doctors from users table
UPDATE doctors SET user_id = NULL WHERE doctor_id != 2001;

-- Step 2: Delete child records for non-demo patients (patient_id != 1001)
DELETE FROM bill_items WHERE bill_id IN (SELECT bill_id FROM bills WHERE patient_id != 1001);
DELETE FROM bills WHERE patient_id != 1001;

DELETE FROM prescription_items WHERE prescription_id IN (SELECT prescription_id FROM prescriptions WHERE patient_id != 1001);
DELETE FROM prescriptions WHERE patient_id != 1001;

DELETE FROM medical_records WHERE patient_id != 1001;
DELETE FROM admissions WHERE patient_id != 1001;
DELETE FROM appointments WHERE patient_id != 1001;

-- Step 3: Delete non-demo patients
DELETE FROM patients WHERE patient_id != 1001;

-- Step 4: Reset users table to EXACTLY 3 Demo Accounts
DELETE FROM patients WHERE user_id NOT IN (1, 2, 3);
DELETE FROM users;

-- Insert the 3 canonical demo accounts
-- Hash for 'Demo@123' is '$2a$10$ct0lWSNWnqV2.GVn2sjICekFOGmlH/lbCY5kMVkJ3m5zLGNh4joHS'
INSERT INTO users (user_id, username, password_hash, email, role, is_active, created_at, updated_at)
VALUES (1, 'demo.admin', '$2a$10$ct0lWSNWnqV2.GVn2sjICekFOGmlH/lbCY5kMVkJ3m5zLGNh4joHS', 'admin@medicore.com', 'ADMIN', 1, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO users (user_id, username, password_hash, email, role, is_active, created_at, updated_at)
VALUES (2, 'demo.doctor', '$2a$10$ct0lWSNWnqV2.GVn2sjICekFOGmlH/lbCY5kMVkJ3m5zLGNh4joHS', 'doctor@medicore.com', 'DOCTOR', 1, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO users (user_id, username, password_hash, email, role, is_active, created_at, updated_at)
VALUES (3, 'demo.patient', '$2a$10$ct0lWSNWnqV2.GVn2sjICekFOGmlH/lbCY5kMVkJ3m5zLGNh4joHS', 'patient@medicore.com', 'PATIENT', 1, SYSTIMESTAMP, SYSTIMESTAMP);

-- Link demo doctor (Dr. Rajesh Kumar) to user_id = 2
UPDATE doctors SET 
    user_id = 2,
    email = 'doctor@medicore.com'
WHERE doctor_id = 2001;

-- Ensure demo patient record exists for user_id = 3
DELETE FROM patients WHERE patient_id = 1001;
INSERT INTO patients (
    patient_id, user_id, first_name, last_name, date_of_birth, gender, blood_group, 
    phone, email, address, emergency_contact_name, emergency_contact_phone, registration_date, created_at, updated_at
) VALUES (
    1001, 3, 'Amit', 'Sharma', TO_DATE('1988-05-15', 'YYYY-MM-DD'), 'Male', 'O+',
    '9876543210', 'patient@medicore.com', '42 MG Road, Bangalore', 'Pooja Sharma', '9876543211',
    TO_DATE('2024-01-10', 'YYYY-MM-DD'), SYSTIMESTAMP, SYSTIMESTAMP
);

-- Ensure demo appointments exist for demo.patient (1001) and demo.doctor (2001)
DELETE FROM appointments WHERE patient_id = 1001;
INSERT INTO appointments (
    appointment_id, patient_id, doctor_id, department_id, appointment_date, appointment_time, reason, status, notes
) VALUES (
    3001, 1001, 2001, 1, TRUNC(SYSDATE) + 2, '10:00 AM', 'Cardiac Routine Follow-up', 'Scheduled', 'Patient advised to bring previous ECG'
);

INSERT INTO appointments (
    appointment_id, patient_id, doctor_id, department_id, appointment_date, appointment_time, reason, status, notes
) VALUES (
    3002, 1001, 2001, 1, TRUNC(SYSDATE) - 10, '11:30 AM', 'Chest Tightness Consultation', 'Completed', 'ECG Normal, advised blood pressure monitoring'
);

-- Ensure demo medical record exists
DELETE FROM medical_records WHERE patient_id = 1001;
INSERT INTO medical_records (
    record_id, patient_id, doctor_id, visit_date, symptoms, diagnosis, treatment, notes
) VALUES (
    5001, 1001, 2001, TRUNC(SYSDATE) - 10, 'Mild chest tightness after exercise, occasional headache',
    'Essential Hypertension Stage 1', 'Low sodium diet, daily aerobic walking 30 min, Amlodipine 5mg OD',
    'Patient advised regular BP monitoring and lifestyle changes. Return in 2 weeks.'
);

-- Ensure demo prescription exists
DELETE FROM prescription_items WHERE prescription_id IN (SELECT prescription_id FROM prescriptions WHERE patient_id = 1001);
DELETE FROM prescriptions WHERE patient_id = 1001;
INSERT INTO prescriptions (
    prescription_id, patient_id, doctor_id, record_id, prescription_date, notes
) VALUES (
    6001, 1001, 2001, 5001, TRUNC(SYSDATE) - 10, 'Take medication strictly in the morning after breakfast'
);

INSERT INTO prescription_items (
    item_id, prescription_id, medicine_id, dosage, frequency, duration, instructions
) VALUES (
    1, 6001, 9, '5mg', 'Once Daily', '30 Days', 'Take with water after breakfast'
);

INSERT INTO prescription_items (
    item_id, prescription_id, medicine_id, dosage, frequency, duration, instructions
) VALUES (
    2, 6001, 1, '500mg', 'As Needed', '5 Days', 'Take for headache if required, max 2 tablets daily'
);

-- Ensure demo bill exists
DELETE FROM bill_items WHERE bill_id IN (SELECT bill_id FROM bills WHERE patient_id = 1001);
DELETE FROM bills WHERE patient_id = 1001;
INSERT INTO bills (
    bill_id, patient_id, appointment_id, consultation_charge, room_charge, medicine_charge, other_charges, discount, tax, total_amount, payment_status, payment_method, billing_date, payment_date
) VALUES (
    7001, 1001, 3002, 800.00, 0.00, 400.00, 100.00, 0.00, 117.00, 1417.00, 'Paid', 'UPI', TRUNC(SYSDATE) - 10, TRUNC(SYSDATE) - 10
);

INSERT INTO bill_items (bill_item_id, bill_id, description, category, amount, quantity)
VALUES (1, 7001, 'Senior Cardiologist Specialist Consultation', 'Consultation', 800.00, 1);

INSERT INTO bill_items (bill_item_id, bill_id, description, category, amount, quantity)
VALUES (2, 7001, 'Amlodipine 5mg (30 Tablets) & Paracetamol', 'Pharmacy', 400.00, 1);

INSERT INTO bill_items (bill_item_id, bill_id, description, category, amount, quantity)
VALUES (3, 7001, 'Resting ECG & Blood Pressure Screening', 'Diagnostic', 100.00, 1);

COMMIT;
