-- ============================================================
-- MediCore HMS — Supabase PostgreSQL Database Schema
-- Script 01: 01_schema.sql
-- ============================================================

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS bill_items CASCADE;
DROP TABLE IF EXISTS bills CASCADE;
DROP TABLE IF EXISTS prescription_items CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS admissions CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ------------------------------------------------------------
-- TABLE: USERS
-- ------------------------------------------------------------
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_role CHECK (role IN ('ADMIN', 'DOCTOR', 'PATIENT'))
);

-- ------------------------------------------------------------
-- TABLE: DEPARTMENTS
-- ------------------------------------------------------------
CREATE TABLE departments (
    department_id BIGINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    location VARCHAR(200),
    phone VARCHAR(20),
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- TABLE: PATIENTS
-- ------------------------------------------------------------
CREATE TABLE patients (
    patient_id BIGINT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    blood_group VARCHAR(5),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address VARCHAR(500),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    registration_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patient_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT chk_patient_gender CHECK (gender IN ('Male', 'Female', 'Other')),
    CONSTRAINT chk_blood_group CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'))
);

-- ------------------------------------------------------------
-- TABLE: DOCTORS
-- ------------------------------------------------------------
CREATE TABLE doctors (
    doctor_id BIGINT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    department_id BIGINT,
    qualification VARCHAR(200),
    experience_years INTEGER,
    joining_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doctor_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_doctor_dept FOREIGN KEY (department_id) REFERENCES departments(department_id),
    CONSTRAINT chk_doctor_status CHECK (status IN ('Active', 'On Leave', 'Inactive'))
);

-- ------------------------------------------------------------
-- TABLE: APPOINTMENTS
-- ------------------------------------------------------------
CREATE TABLE appointments (
    appointment_id BIGINT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    department_id BIGINT,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(10) NOT NULL,
    reason VARCHAR(500),
    status VARCHAR(20) DEFAULT 'Scheduled',
    notes VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appt_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    CONSTRAINT fk_appt_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    CONSTRAINT fk_appt_dept FOREIGN KEY (department_id) REFERENCES departments(department_id),
    CONSTRAINT chk_appt_status CHECK (status IN ('Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No Show'))
);

-- ------------------------------------------------------------
-- TABLE: ROOMS
-- ------------------------------------------------------------
CREATE TABLE rooms (
    room_id BIGINT PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL UNIQUE,
    room_type VARCHAR(30) NOT NULL,
    floor_number INTEGER NOT NULL,
    daily_charge NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_room_type CHECK (room_type IN ('General Ward', 'Semi Private', 'Private', 'ICU', 'Emergency')),
    CONSTRAINT chk_room_status CHECK (status IN ('Available', 'Occupied', 'Maintenance')),
    CONSTRAINT chk_daily_charge CHECK (daily_charge > 0)
);

-- ------------------------------------------------------------
-- TABLE: ADMISSIONS
-- ------------------------------------------------------------
CREATE TABLE admissions (
    admission_id BIGINT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    admission_date DATE DEFAULT CURRENT_DATE NOT NULL,
    expected_discharge_date DATE,
    actual_discharge_date DATE,
    diagnosis VARCHAR(500),
    status VARCHAR(20) DEFAULT 'Admitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_adm_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    CONSTRAINT fk_adm_room FOREIGN KEY (room_id) REFERENCES rooms(room_id),
    CONSTRAINT fk_adm_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    CONSTRAINT chk_adm_status CHECK (status IN ('Admitted', 'Discharged'))
);

-- ------------------------------------------------------------
-- TABLE: MEDICAL_RECORDS
-- ------------------------------------------------------------
CREATE TABLE medical_records (
    record_id BIGINT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    visit_date DATE DEFAULT CURRENT_DATE NOT NULL,
    symptoms VARCHAR(1000),
    diagnosis VARCHAR(1000) NOT NULL,
    treatment VARCHAR(1000),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mr_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    CONSTRAINT fk_mr_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

-- ------------------------------------------------------------
-- TABLE: MEDICINES
-- ------------------------------------------------------------
CREATE TABLE medicines (
    medicine_id BIGINT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    manufacturer VARCHAR(200),
    unit_price NUMERIC(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    expiry_date DATE,
    reorder_level INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_med_price CHECK (unit_price > 0),
    CONSTRAINT chk_med_stock CHECK (stock_quantity >= 0)
);

-- ------------------------------------------------------------
-- TABLE: PRESCRIPTIONS
-- ------------------------------------------------------------
CREATE TABLE prescriptions (
    prescription_id BIGINT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    record_id BIGINT,
    prescription_date DATE DEFAULT CURRENT_DATE NOT NULL,
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_presc_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    CONSTRAINT fk_presc_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    CONSTRAINT fk_presc_record FOREIGN KEY (record_id) REFERENCES medical_records(record_id)
);

-- ------------------------------------------------------------
-- TABLE: PRESCRIPTION_ITEMS
-- ------------------------------------------------------------
CREATE TABLE prescription_items (
    item_id BIGINT PRIMARY KEY,
    prescription_id BIGINT NOT NULL,
    medicine_id BIGINT NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    instructions VARCHAR(500),
    CONSTRAINT fk_pi_prescription FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE,
    CONSTRAINT fk_pi_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(medicine_id)
);

-- ------------------------------------------------------------
-- TABLE: BILLS
-- ------------------------------------------------------------
CREATE TABLE bills (
    bill_id BIGINT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    appointment_id BIGINT,
    admission_id BIGINT,
    consultation_charge NUMERIC(10,2) DEFAULT 0,
    room_charge NUMERIC(10,2) DEFAULT 0,
    medicine_charge NUMERIC(10,2) DEFAULT 0,
    other_charges NUMERIC(10,2) DEFAULT 0,
    discount NUMERIC(10,2) DEFAULT 0,
    tax NUMERIC(10,2) DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'Pending',
    payment_method VARCHAR(20),
    billing_date DATE DEFAULT CURRENT_DATE NOT NULL,
    payment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bill_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    CONSTRAINT fk_bill_appt FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
    CONSTRAINT fk_bill_adm FOREIGN KEY (admission_id) REFERENCES admissions(admission_id),
    CONSTRAINT chk_payment_status CHECK (payment_status IN ('Pending', 'Partially Paid', 'Paid')),
    CONSTRAINT chk_payment_method CHECK (payment_method IN ('Cash', 'Card', 'UPI', 'Insurance'))
);

-- ------------------------------------------------------------
-- TABLE: BILL_ITEMS
-- ------------------------------------------------------------
CREATE TABLE bill_items (
    bill_item_id BIGINT PRIMARY KEY,
    bill_id BIGINT NOT NULL,
    description VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    CONSTRAINT fk_bi_bill FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE CASCADE
);
