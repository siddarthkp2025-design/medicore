-- ==============================================================================
-- MediCore HMS — Consolidated Supabase PostgreSQL Setup Script
-- File: setup_all.sql
-- 1-Click Execution for Supabase SQL Editor
-- Includes: Schema, Sequences, Constraints, Views, Triggers, Procedures, Seed Data
-- ==============================================================================

-- ==============================================================================
-- 1. SCHEMA DDL (Tables)
-- ==============================================================================
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

CREATE TABLE bill_items (
    bill_item_id BIGINT PRIMARY KEY,
    bill_id BIGINT NOT NULL,
    description VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    CONSTRAINT fk_bi_bill FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE CASCADE
);

-- ==============================================================================
-- 2. SEQUENCES
-- ==============================================================================
DROP SEQUENCE IF EXISTS user_seq CASCADE;
DROP SEQUENCE IF EXISTS department_seq CASCADE;
DROP SEQUENCE IF EXISTS patient_seq CASCADE;
DROP SEQUENCE IF EXISTS doctor_seq CASCADE;
DROP SEQUENCE IF EXISTS appointment_seq CASCADE;
DROP SEQUENCE IF EXISTS room_seq CASCADE;
DROP SEQUENCE IF EXISTS admission_seq CASCADE;
DROP SEQUENCE IF EXISTS medical_record_seq CASCADE;
DROP SEQUENCE IF EXISTS medicine_seq CASCADE;
DROP SEQUENCE IF EXISTS prescription_seq CASCADE;
DROP SEQUENCE IF EXISTS prescription_item_seq CASCADE;
DROP SEQUENCE IF EXISTS bill_seq CASCADE;
DROP SEQUENCE IF EXISTS bill_item_seq CASCADE;

CREATE SEQUENCE user_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE department_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE patient_seq START WITH 1001 INCREMENT BY 1;
CREATE SEQUENCE doctor_seq START WITH 2001 INCREMENT BY 1;
CREATE SEQUENCE appointment_seq START WITH 3001 INCREMENT BY 1;
CREATE SEQUENCE room_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE admission_seq START WITH 4001 INCREMENT BY 1;
CREATE SEQUENCE medical_record_seq START WITH 5001 INCREMENT BY 1;
CREATE SEQUENCE medicine_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE prescription_seq START WITH 6001 INCREMENT BY 1;
CREATE SEQUENCE prescription_item_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE bill_seq START WITH 7001 INCREMENT BY 1;
CREATE SEQUENCE bill_item_seq START WITH 1 INCREMENT BY 1;

-- ==============================================================================
-- 3. INDEXES & CONSTRAINTS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_patient_name ON patients(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_patient_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_doctor_dept ON doctors(department_id);
CREATE INDEX IF NOT EXISTS idx_doctor_spec ON doctors(specialization);
CREATE INDEX IF NOT EXISTS idx_appt_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appt_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appt_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appt_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_admission_patient ON admissions(patient_id);
CREATE INDEX IF NOT EXISTS idx_admission_status ON admissions(status);
CREATE INDEX IF NOT EXISTS idx_mr_patient ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medicine_name ON medicines(name);
CREATE INDEX IF NOT EXISTS idx_medicine_expiry ON medicines(expiry_date);
CREATE INDEX IF NOT EXISTS idx_presc_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_bill_patient ON bills(patient_id);
CREATE INDEX IF NOT EXISTS idx_bill_status ON bills(payment_status);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_appt_conflict'
    ) THEN
        ALTER TABLE appointments ADD CONSTRAINT uq_appt_conflict UNIQUE (doctor_id, appointment_date, appointment_time);
    END IF;
END $$;

-- ==============================================================================
-- 4. VIEWS
-- ==============================================================================
CREATE OR REPLACE VIEW v_patient_appointments AS
SELECT p.first_name || ' ' || p.last_name AS patient_name,
       d.first_name || ' ' || d.last_name AS doctor_name,
       dept.name AS department_name,
       a.appointment_date,
       a.appointment_time,
       a.reason,
       a.status
FROM appointments a
JOIN patients p ON a.patient_id = p.patient_id
JOIN doctors d ON a.doctor_id = d.doctor_id
LEFT JOIN departments dept ON a.department_id = dept.department_id;

CREATE OR REPLACE VIEW v_room_status AS
SELECT r.room_number,
       r.room_type,
       r.floor_number,
       r.daily_charge,
       r.status AS room_status,
       p.first_name || ' ' || p.last_name AS patient_name,
       a.admission_date
FROM rooms r
LEFT JOIN admissions a ON r.room_id = a.room_id AND a.status = 'Admitted'
LEFT JOIN patients p ON a.patient_id = p.patient_id;

CREATE OR REPLACE VIEW v_bill_summary AS
SELECT b.bill_id,
       p.first_name || ' ' || p.last_name AS patient_name,
       b.billing_date,
       b.consultation_charge,
       b.room_charge,
       b.medicine_charge,
       b.other_charges,
       b.discount,
       b.tax,
       b.total_amount,
       b.payment_status,
       b.payment_method
FROM bills b
JOIN patients p ON b.patient_id = p.patient_id;

CREATE OR REPLACE VIEW v_doctor_schedule AS
SELECT d.first_name || ' ' || d.last_name AS doctor_name,
       d.specialization,
       dept.name AS department_name,
       p.first_name || ' ' || p.last_name AS patient_name,
       a.appointment_date,
       a.appointment_time,
       a.status
FROM doctors d
JOIN appointments a ON d.doctor_id = a.doctor_id
JOIN patients p ON a.patient_id = p.patient_id
LEFT JOIN departments dept ON d.department_id = dept.department_id
WHERE a.appointment_date >= CURRENT_DATE;

CREATE OR REPLACE VIEW v_medicine_stock_alert AS
SELECT name,
       category,
       stock_quantity,
       reorder_level,
       expiry_date,
       CASE
           WHEN expiry_date < CURRENT_DATE THEN 'Expired'
           WHEN expiry_date <= CURRENT_DATE + INTERVAL '90 days' THEN 'Expiring Soon'
           WHEN stock_quantity <= reorder_level THEN 'Low Stock'
       END AS alert_type
FROM medicines
WHERE stock_quantity <= reorder_level OR expiry_date <= CURRENT_DATE + INTERVAL '90 days';

CREATE OR REPLACE VIEW v_department_statistics AS
SELECT dept.name AS department_name,
       COUNT(a.appointment_id) AS total_appointments,
       SUM(CASE WHEN a.status = 'Completed' THEN 1 ELSE 0 END) AS completed_count,
       SUM(CASE WHEN a.status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled_count,
       (SELECT COUNT(*) FROM doctors d WHERE d.department_id = dept.department_id) AS doctor_count
FROM departments dept
LEFT JOIN appointments a ON dept.department_id = a.department_id
GROUP BY dept.department_id, dept.name;

-- ==============================================================================
-- 5. TRIGGERS
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_departments_updated_at ON departments;
CREATE TRIGGER trg_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_patients_updated_at ON patients;
CREATE TRIGGER trg_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_doctors_updated_at ON doctors;
CREATE TRIGGER trg_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_appointments_updated_at ON appointments;
CREATE TRIGGER trg_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_rooms_updated_at ON rooms;
CREATE TRIGGER trg_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_admissions_updated_at ON admissions;
CREATE TRIGGER trg_admissions_updated_at BEFORE UPDATE ON admissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_medical_records_updated_at ON medical_records;
CREATE TRIGGER trg_medical_records_updated_at BEFORE UPDATE ON medical_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_medicines_updated_at ON medicines;
CREATE TRIGGER trg_medicines_updated_at BEFORE UPDATE ON medicines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_prescriptions_updated_at ON prescriptions;
CREATE TRIGGER trg_prescriptions_updated_at BEFORE UPDATE ON prescriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_bills_updated_at ON bills;
CREATE TRIGGER trg_bills_updated_at BEFORE UPDATE ON bills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION trg_fn_room_occupy()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE rooms
    SET status = 'Occupied'
    WHERE room_id = NEW.room_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_room_occupy ON admissions;
CREATE TRIGGER trg_room_occupy
AFTER INSERT ON admissions
FOR EACH ROW
EXECUTE FUNCTION trg_fn_room_occupy();

CREATE OR REPLACE FUNCTION trg_fn_room_release()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Discharged' AND OLD.status = 'Admitted' THEN
        UPDATE rooms
        SET status = 'Available'
        WHERE room_id = NEW.room_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_room_release ON admissions;
CREATE TRIGGER trg_room_release
AFTER UPDATE ON admissions
FOR EACH ROW
EXECUTE FUNCTION trg_fn_room_release();

-- ==============================================================================
-- 6. PROCEDURES & FUNCTIONS
-- ==============================================================================
CREATE OR REPLACE PROCEDURE sp_admit_patient (
    p_patient_id BIGINT,
    p_room_id BIGINT,
    p_doctor_id BIGINT,
    p_diagnosis VARCHAR,
    p_expected_discharge_date DATE
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_room_status VARCHAR(20);
BEGIN
    SELECT status INTO v_room_status FROM rooms WHERE room_id = p_room_id FOR UPDATE;
    
    IF v_room_status IS NULL OR v_room_status != 'Available' THEN
        RAISE EXCEPTION 'Room is not available for admission.';
    END IF;
    
    INSERT INTO admissions (
        admission_id, patient_id, room_id, doctor_id, admission_date, expected_discharge_date, diagnosis, status
    ) VALUES (
        nextval('admission_seq'), p_patient_id, p_room_id, p_doctor_id, CURRENT_DATE, p_expected_discharge_date, p_diagnosis, 'Admitted'
    );
END;
$$;

CREATE OR REPLACE PROCEDURE sp_discharge_patient (
    p_admission_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE admissions
    SET actual_discharge_date = CURRENT_DATE,
        status = 'Discharged'
    WHERE admission_id = p_admission_id;
END;
$$;

CREATE OR REPLACE FUNCTION fn_calculate_room_charges (
    p_admission_id BIGINT
)
RETURNS NUMERIC(10,2)
LANGUAGE plpgsql
AS $$
DECLARE
    v_admission_date DATE;
    v_discharge_date DATE;
    v_daily_charge NUMERIC(10,2);
    v_days INTEGER;
    v_total NUMERIC(10,2);
BEGIN
    SELECT a.admission_date, COALESCE(a.actual_discharge_date, CURRENT_DATE), r.daily_charge
    INTO v_admission_date, v_discharge_date, v_daily_charge
    FROM admissions a
    JOIN rooms r ON a.room_id = r.room_id
    WHERE a.admission_id = p_admission_id;
    
    IF NOT FOUND THEN
        RETURN 0.00;
    END IF;
    
    v_days := (v_discharge_date - v_admission_date);
    IF v_days <= 0 THEN
        v_days := 1;
    END IF;
    
    v_total := v_days * v_daily_charge;
    RETURN v_total;
END;
$$;

CREATE OR REPLACE FUNCTION fn_calculate_bill_total (
    p_bill_id BIGINT
)
RETURNS NUMERIC(10,2)
LANGUAGE plpgsql
AS $$
DECLARE
    v_total NUMERIC(10,2);
BEGIN
    SELECT (consultation_charge + room_charge + medicine_charge + other_charges - discount + tax)
    INTO v_total
    FROM bills
    WHERE bill_id = p_bill_id;
    
    RETURN COALESCE(v_total, 0.00);
END;
$$;

CREATE OR REPLACE PROCEDURE sp_generate_bill (
    p_patient_id BIGINT,
    p_appointment_id BIGINT,
    p_admission_id BIGINT,
    p_consultation_charge NUMERIC,
    p_medicine_charge NUMERIC,
    p_other_charges NUMERIC,
    p_discount NUMERIC,
    p_tax NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_room_charge NUMERIC(10,2) := 0.00;
    v_total_amount NUMERIC(10,2) := 0.00;
    v_bill_id BIGINT;
BEGIN
    IF p_admission_id IS NOT NULL THEN
        v_room_charge := fn_calculate_room_charges(p_admission_id);
    END IF;
    
    v_total_amount := COALESCE(p_consultation_charge, 0.00) + v_room_charge + COALESCE(p_medicine_charge, 0.00) + COALESCE(p_other_charges, 0.00) - COALESCE(p_discount, 0.00) + COALESCE(p_tax, 0.00);
    
    v_bill_id := nextval('bill_seq');
    
    INSERT INTO bills (
        bill_id, patient_id, appointment_id, admission_id, consultation_charge, room_charge, medicine_charge, other_charges, discount, tax, total_amount, payment_status, billing_date
    ) VALUES (
        v_bill_id, p_patient_id, p_appointment_id, p_admission_id, COALESCE(p_consultation_charge, 0.00), v_room_charge, COALESCE(p_medicine_charge, 0.00), COALESCE(p_other_charges, 0.00), COALESCE(p_discount, 0.00), COALESCE(p_tax, 0.00), v_total_amount, 'Pending', CURRENT_DATE
    );
END;
$$;

CREATE OR REPLACE FUNCTION fn_get_doctor_appt_count (
    p_doctor_id BIGINT,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_count BIGINT;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM appointments
    WHERE doctor_id = p_doctor_id
      AND appointment_date BETWEEN p_start_date AND p_end_date;
      
    RETURN COALESCE(v_count, 0);
END;
$$;

-- ==============================================================================
-- 7. SEED DATA & SEQUENCE SYNC
-- ==============================================================================
-- 1. DEPARTMENTS
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

-- 2. USERS (Exactly 3 Demo Accounts, password: Demo@123)
INSERT INTO users (user_id, username, password_hash, email, role, is_active) VALUES
(1, 'demo.admin', '$2a$10$ct0lWSNWnqV2.GVn2sjICekFOGmlH/lbCY5kMVkJ3m5zLGNh4joHS', 'admin@medicore.com', 'ADMIN', 1),
(2, 'demo.doctor', '$2a$10$ct0lWSNWnqV2.GVn2sjICekFOGmlH/lbCY5kMVkJ3m5zLGNh4joHS', 'doctor@medicore.com', 'DOCTOR', 1),
(3, 'demo.patient', '$2a$10$ct0lWSNWnqV2.GVn2sjICekFOGmlH/lbCY5kMVkJ3m5zLGNh4joHS', 'patient@medicore.com', 'PATIENT', 1);

-- 3. DOCTORS
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

-- 4. PATIENTS
INSERT INTO patients (patient_id, user_id, first_name, last_name, date_of_birth, gender, blood_group, phone, email, address, emergency_contact_name, emergency_contact_phone, registration_date) VALUES
(1001, 3, 'Amit', 'Sharma', '1988-05-15', 'Male', 'O+', '9876543210', 'patient@medicore.com', '42 MG Road, Bangalore', 'Pooja Sharma', '9876543211', '2024-01-10');

-- 5. ROOMS
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

-- 6. MEDICINES
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

-- 7. APPOINTMENTS
INSERT INTO appointments (appointment_id, patient_id, doctor_id, department_id, appointment_date, appointment_time, reason, status, notes) VALUES
(3001, 1001, 2001, 1, CURRENT_DATE + 2, '10:00 AM', 'Cardiac Routine Follow-up', 'Scheduled', 'Patient advised to bring previous ECG reports'),
(3002, 1001, 2001, 1, CURRENT_DATE - 10, '11:30 AM', 'Chest Tightness Consultation', 'Completed', 'ECG Normal, blood pressure monitoring advised');

-- 8. MEDICAL RECORDS
INSERT INTO medical_records (record_id, patient_id, doctor_id, visit_date, symptoms, diagnosis, treatment, notes) VALUES
(5001, 1001, 2001, CURRENT_DATE - 10, 'Mild chest tightness after exercise, occasional headache',
 'Essential Hypertension Stage 1', 'Low sodium diet, daily aerobic walking 30 min, Amlodipine 5mg OD',
 'Patient advised regular BP monitoring and lifestyle modifications. Return in 2 weeks.');

-- 9. PRESCRIPTIONS & ITEMS
INSERT INTO prescriptions (prescription_id, patient_id, doctor_id, record_id, prescription_date, notes) VALUES
(6001, 1001, 2001, 5001, CURRENT_DATE - 10, 'Take medication strictly in the morning after breakfast');

INSERT INTO prescription_items (item_id, prescription_id, medicine_id, dosage, frequency, duration, instructions) VALUES
(1, 6001, 9, '5mg', 'Once Daily', '30 Days', 'Take with water after breakfast'),
(2, 6001, 1, '500mg', 'As Needed', '5 Days', 'Take for headache if required, max 2 tablets daily');

-- 10. BILLS & ITEMS
INSERT INTO bills (bill_id, patient_id, appointment_id, consultation_charge, room_charge, medicine_charge, other_charges, discount, tax, total_amount, payment_status, payment_method, billing_date, payment_date) VALUES
(7001, 1001, 3002, 800.00, 0.00, 400.00, 100.00, 0.00, 117.00, 1417.00, 'Paid', 'UPI', CURRENT_DATE - 10, CURRENT_DATE - 10);

INSERT INTO bill_items (bill_item_id, bill_id, description, category, amount, quantity) VALUES
(1, 7001, 'Senior Cardiologist Specialist Consultation', 'Consultation', 800.00, 1),
(2, 7001, 'Amlodipine 5mg (30 Tabs) and Paracetamol', 'Pharmacy', 400.00, 1),
(3, 7001, 'Resting ECG and Blood Pressure Screening', 'Diagnostic', 100.00, 1);

-- 11. SYNCHRONIZE POSTGRESQL SEQUENCES
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
