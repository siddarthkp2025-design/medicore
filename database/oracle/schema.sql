-- FILE 1: schema.sql

BEGIN EXECUTE IMMEDIATE 'DROP TABLE bill_items CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE bills CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE prescription_items CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE prescriptions CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE medicines CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE medical_records CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE admissions CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE rooms CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE appointments CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE doctors CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE patients CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE departments CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE users CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

-- TABLE: USERS
CREATE TABLE users (
    user_id NUMBER PRIMARY KEY,
    username VARCHAR2(50) NOT NULL UNIQUE,
    password_hash VARCHAR2(255) NOT NULL,
    email VARCHAR2(100) NOT NULL UNIQUE,
    role VARCHAR2(20) NOT NULL,
    is_active NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT chk_user_role CHECK (role IN ('ADMIN', 'DOCTOR', 'PATIENT'))
);

-- TABLE: DEPARTMENTS
CREATE TABLE departments (
    department_id NUMBER PRIMARY KEY,
    name VARCHAR2(100) NOT NULL UNIQUE,
    description VARCHAR2(500),
    location VARCHAR2(200),
    phone VARCHAR2(20),
    is_active NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP
);

-- TABLE: PATIENTS
CREATE TABLE patients (
    patient_id NUMBER PRIMARY KEY,
    user_id NUMBER UNIQUE,
    first_name VARCHAR2(50) NOT NULL,
    last_name VARCHAR2(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR2(10) NOT NULL,
    blood_group VARCHAR2(5),
    phone VARCHAR2(20) NOT NULL,
    email VARCHAR2(100),
    address VARCHAR2(500),
    emergency_contact_name VARCHAR2(100),
    emergency_contact_phone VARCHAR2(20),
    registration_date DATE DEFAULT SYSDATE,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_patient_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT chk_patient_gender CHECK (gender IN ('Male', 'Female', 'Other')),
    CONSTRAINT chk_blood_group CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'))
);

-- TABLE: DOCTORS
CREATE TABLE doctors (
    doctor_id NUMBER PRIMARY KEY,
    user_id NUMBER UNIQUE,
    first_name VARCHAR2(50) NOT NULL,
    last_name VARCHAR2(50) NOT NULL,
    email VARCHAR2(100) NOT NULL UNIQUE,
    phone VARCHAR2(20) NOT NULL,
    specialization VARCHAR2(100) NOT NULL,
    department_id NUMBER,
    qualification VARCHAR2(200),
    experience_years NUMBER,
    joining_date DATE DEFAULT SYSDATE,
    status VARCHAR2(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_doctor_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_doctor_dept FOREIGN KEY (department_id) REFERENCES departments(department_id),
    CONSTRAINT chk_doctor_status CHECK (status IN ('Active', 'On Leave', 'Inactive'))
);

-- TABLE: APPOINTMENTS
CREATE TABLE appointments (
    appointment_id NUMBER PRIMARY KEY,
    patient_id NUMBER NOT NULL,
    doctor_id NUMBER NOT NULL,
    department_id NUMBER,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR2(10) NOT NULL,
    reason VARCHAR2(500),
    status VARCHAR2(20) DEFAULT 'Scheduled',
    notes VARCHAR2(1000),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_appt_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    CONSTRAINT fk_appt_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    CONSTRAINT fk_appt_dept FOREIGN KEY (department_id) REFERENCES departments(department_id),
    CONSTRAINT chk_appt_status CHECK (status IN ('Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No Show'))
);

-- TABLE: ROOMS
CREATE TABLE rooms (
    room_id NUMBER PRIMARY KEY,
    room_number VARCHAR2(20) NOT NULL UNIQUE,
    room_type VARCHAR2(30) NOT NULL,
    floor_number NUMBER NOT NULL,
    daily_charge NUMBER(10,2) NOT NULL,
    status VARCHAR2(20) DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT chk_room_type CHECK (room_type IN ('General Ward', 'Semi Private', 'Private', 'ICU', 'Emergency')),
    CONSTRAINT chk_room_status CHECK (status IN ('Available', 'Occupied', 'Maintenance')),
    CONSTRAINT chk_daily_charge CHECK (daily_charge > 0)
);

-- TABLE: ADMISSIONS
CREATE TABLE admissions (
    admission_id NUMBER PRIMARY KEY,
    patient_id NUMBER NOT NULL,
    room_id NUMBER NOT NULL,
    doctor_id NUMBER NOT NULL,
    admission_date DATE DEFAULT SYSDATE NOT NULL,
    expected_discharge_date DATE,
    actual_discharge_date DATE,
    diagnosis VARCHAR2(500),
    status VARCHAR2(20) DEFAULT 'Admitted',
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_adm_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    CONSTRAINT fk_adm_room FOREIGN KEY (room_id) REFERENCES rooms(room_id),
    CONSTRAINT fk_adm_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    CONSTRAINT chk_adm_status CHECK (status IN ('Admitted', 'Discharged'))
);

-- TABLE: MEDICAL_RECORDS
CREATE TABLE medical_records (
    record_id NUMBER PRIMARY KEY,
    patient_id NUMBER NOT NULL,
    doctor_id NUMBER NOT NULL,
    visit_date DATE DEFAULT SYSDATE NOT NULL,
    symptoms VARCHAR2(1000),
    diagnosis VARCHAR2(1000) NOT NULL,
    treatment VARCHAR2(1000),
    notes CLOB,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_mr_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    CONSTRAINT fk_mr_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

-- TABLE: MEDICINES
CREATE TABLE medicines (
    medicine_id NUMBER PRIMARY KEY,
    name VARCHAR2(200) NOT NULL,
    category VARCHAR2(100),
    manufacturer VARCHAR2(200),
    unit_price NUMBER(10,2) NOT NULL,
    stock_quantity NUMBER DEFAULT 0,
    expiry_date DATE,
    reorder_level NUMBER DEFAULT 10,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT chk_med_price CHECK (unit_price > 0),
    CONSTRAINT chk_med_stock CHECK (stock_quantity >= 0)
);

-- TABLE: PRESCRIPTIONS
CREATE TABLE prescriptions (
    prescription_id NUMBER PRIMARY KEY,
    patient_id NUMBER NOT NULL,
    doctor_id NUMBER NOT NULL,
    record_id NUMBER,
    prescription_date DATE DEFAULT SYSDATE NOT NULL,
    notes VARCHAR2(500),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_presc_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    CONSTRAINT fk_presc_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    CONSTRAINT fk_presc_record FOREIGN KEY (record_id) REFERENCES medical_records(record_id)
);

-- TABLE: PRESCRIPTION_ITEMS
CREATE TABLE prescription_items (
    item_id NUMBER PRIMARY KEY,
    prescription_id NUMBER NOT NULL,
    medicine_id NUMBER NOT NULL,
    dosage VARCHAR2(100) NOT NULL,
    frequency VARCHAR2(100) NOT NULL,
    duration VARCHAR2(100) NOT NULL,
    instructions VARCHAR2(500),
    CONSTRAINT fk_pi_prescription FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE,
    CONSTRAINT fk_pi_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(medicine_id)
);

-- TABLE: BILLS
CREATE TABLE bills (
    bill_id NUMBER PRIMARY KEY,
    patient_id NUMBER NOT NULL,
    appointment_id NUMBER,
    admission_id NUMBER,
    consultation_charge NUMBER(10,2) DEFAULT 0,
    room_charge NUMBER(10,2) DEFAULT 0,
    medicine_charge NUMBER(10,2) DEFAULT 0,
    other_charges NUMBER(10,2) DEFAULT 0,
    discount NUMBER(10,2) DEFAULT 0,
    tax NUMBER(10,2) DEFAULT 0,
    total_amount NUMBER(10,2) NOT NULL,
    payment_status VARCHAR2(20) DEFAULT 'Pending',
    payment_method VARCHAR2(20),
    billing_date DATE DEFAULT SYSDATE NOT NULL,
    payment_date DATE,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_bill_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    CONSTRAINT fk_bill_appt FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
    CONSTRAINT fk_bill_adm FOREIGN KEY (admission_id) REFERENCES admissions(admission_id),
    CONSTRAINT chk_payment_status CHECK (payment_status IN ('Pending', 'Partially Paid', 'Paid')),
    CONSTRAINT chk_payment_method CHECK (payment_method IN ('Cash', 'Card', 'UPI', 'Insurance'))
);

-- TABLE: BILL_ITEMS
CREATE TABLE bill_items (
    bill_item_id NUMBER PRIMARY KEY,
    bill_id NUMBER NOT NULL,
    description VARCHAR2(200) NOT NULL,
    category VARCHAR2(50) NOT NULL,
    amount NUMBER(10,2) NOT NULL,
    quantity NUMBER DEFAULT 1,
    CONSTRAINT fk_bi_bill FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE CASCADE
);
