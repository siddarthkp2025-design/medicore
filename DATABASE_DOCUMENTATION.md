# MediCore HMS — Database Design & DBMS Viva Documentation

> **Complete Technical Guide, Normalization Proofs, and PL/SQL Reference for Academic Evaluation.**

---

## 📑 Table of Contents

1. [Database Overview](#1-database-overview)
2. [Entities, Attributes & Data Types](#2-entities-attributes--data-types)
3. [Relational Schema & Key Constraints](#3-relational-schema--key-constraints)
4. [Entity Relationship (ER) Model & Cardinality](#4-entity-relationship-er-model--cardinality)
5. [Database Normalization Analysis (1NF to 3NF)](#5-database-normalization-analysis-1nf-to-3nf)
6. [Integrity Constraints & Business Rules](#6-integrity-constraints--business-rules)
7. [Indexes & Performance Optimization](#7-indexes--performance-optimization)
8. [Oracle Database Views](#8-oracle-database-views)
9. [Oracle PL/SQL Triggers](#9-oracle-plsql-triggers)
10. [Oracle Stored Procedures & Functions](#10-oracle-stored-procedures--functions)
11. [Transaction Management & ACID Compliance](#11-transaction-management--acid-compliance)
12. [Comprehensive SQL Demonstration Queries](#12-comprehensive-sql-demonstration-queries)
13. [Common DBMS Viva Questions & Model Answers](#13-common-dbms-viva-questions--model-answers)

---

## 1. Database Overview

- **Database Engine**: Oracle Database (Oracle 23ai / 21c XE / Cloud)
- **SQL Standard**: Oracle SQL (PL/SQL Dialect)
- **Schema Name**: `MEDICORE`
- **Total Relations (Tables)**: 13
- **Total Sequences**: 13
- **Design Paradigm**: Fully Normalized Relational Model (3NF)

---

## 2. Entities, Attributes & Data Types

| Table Name | Attributes (Columns) | Oracle Data Types | Description |
|---|---|---|---|
| `USERS` | `user_id`, `username`, `password_hash`, `email`, `role`, `is_active`, `created_at`, `updated_at` | `NUMBER`, `VARCHAR2(50/100/255)`, `NUMBER(1)`, `TIMESTAMP` | Authentication & role-based credentials (`ADMIN`, `DOCTOR`, `PATIENT`). |
| `DEPARTMENTS` | `department_id`, `name`, `description`, `location`, `phone`, `is_active`, `created_at`, `updated_at` | `NUMBER`, `VARCHAR2(100/500/200/20)`, `NUMBER(1)`, `TIMESTAMP` | Clinical departments (Cardiology, Neurology, etc.). |
| `PATIENTS` | `patient_id`, `user_id`, `first_name`, `last_name`, `date_of_birth`, `gender`, `blood_group`, `phone`, `email`, `address`, `emergency_contact_name`, `emergency_contact_phone`, `registration_date`, `created_at`, `updated_at` | `NUMBER`, `VARCHAR2(50/10/5/20/100/500)`, `DATE`, `TIMESTAMP` | Patient demographics, blood groups, and emergency contacts. |
| `DOCTORS` | `doctor_id`, `user_id`, `first_name`, `last_name`, `email`, `phone`, `specialization`, `department_id`, `qualification`, `experience_years`, `joining_date`, `status`, `created_at`, `updated_at` | `NUMBER`, `VARCHAR2(50/100/20/200)`, `NUMBER`, `DATE`, `TIMESTAMP` | Medical practitioners with specialization and department links. |
| `APPOINTMENTS` | `appointment_id`, `patient_id`, `doctor_id`, `department_id`, `appointment_date`, `appointment_time`, `reason`, `status`, `notes`, `created_at`, `updated_at` | `NUMBER`, `VARCHAR2(10/500/20/1000)`, `DATE`, `TIMESTAMP` | Outpatient appointment bookings and scheduling status. |
| `ROOMS` | `room_id`, `room_number`, `room_type`, `floor_number`, `daily_charge`, `status`, `created_at`, `updated_at` | `NUMBER`, `VARCHAR2(20/30)`, `NUMBER(10,2)`, `TIMESTAMP` | Hospital beds/rooms (General Ward, Semi Private, Private, ICU, Emergency). |
| `ADMISSIONS` | `admission_id`, `patient_id`, `room_id`, `doctor_id`, `admission_date`, `expected_discharge_date`, `actual_discharge_date`, `diagnosis`, `status`, `created_at`, `updated_at` | `NUMBER`, `VARCHAR2(500/20)`, `DATE`, `TIMESTAMP` | Inpatient admission records, stay duration, and discharge states. |
| `MEDICAL_RECORDS`| `record_id`, `patient_id`, `doctor_id`, `visit_date`, `symptoms`, `diagnosis`, `treatment`, `notes`, `created_at`, `updated_at` | `NUMBER`, `VARCHAR2(1000)`, `DATE`, `CLOB`, `TIMESTAMP` | Clinical notes, patient diagnoses, and visit history. |
| `MEDICINES` | `medicine_id`, `name`, `category`, `manufacturer`, `unit_price`, `stock_quantity`, `expiry_date`, `reorder_level`, `created_at`, `updated_at` | `NUMBER`, `VARCHAR2(200/100)`, `NUMBER(10,2)`, `NUMBER`, `DATE`, `TIMESTAMP` | Pharmacy stock inventory with pricing and reorder triggers. |
| `PRESCRIPTIONS` | `prescription_id`, `patient_id`, `doctor_id`, `record_id`, `prescription_date`, `notes`, `created_at`, `updated_at` | `NUMBER`, `VARCHAR2(500)`, `DATE`, `TIMESTAMP` | Master prescription record created by doctor for a patient. |
| `PRESCRIPTION_ITEMS` | `item_id`, `prescription_id`, `medicine_id`, `dosage`, `frequency`, `duration`, `instructions` | `NUMBER`, `VARCHAR2(100/500)` | Detail/junction table resolving Many-to-Many between Prescriptions and Medicines. |
| `BILLS` | `bill_id`, `patient_id`, `appointment_id`, `admission_id`, `consultation_charge`, `room_charge`, `medicine_charge`, `other_charges`, `discount`, `tax`, `total_amount`, `payment_status`, `payment_method`, `billing_date`, `payment_date`, `created_at`, `updated_at` | `NUMBER`, `NUMBER(10,2)`, `VARCHAR2(20)`, `DATE`, `TIMESTAMP` | Financial invoices with itemized charges, discounts, and payments. |
| `BILL_ITEMS` | `bill_item_id`, `bill_id`, `description`, `category`, `amount`, `quantity` | `NUMBER`, `VARCHAR2(200/50)`, `NUMBER(10,2)`, `NUMBER` | Itemized charges linked to a specific bill. |

---

## 3. Relational Schema & Key Constraints

### Primary Keys & Sequences
Every table uses an Oracle Sequence to generate unique, surrogate primary keys:
- `users`: `user_seq` (Starts at 1)
- `patients`: `patient_seq` (Starts at 1001)
- `doctors`: `doctor_seq` (Starts at 2001)
- `departments`: `department_seq` (Starts at 1)
- `appointments`: `appointment_seq` (Starts at 3001)
- `rooms`: `room_seq` (Starts at 1)
- `admissions`: `admission_seq` (Starts at 4001)
- `medical_records`: `medical_record_seq` (Starts at 5001)
- `medicines`: `medicine_seq` (Starts at 1)
- `prescriptions`: `prescription_seq` (Starts at 6001)
- `prescription_items`: `prescription_item_seq` (Starts at 1)
- `bills`: `bill_seq` (Starts at 7001)
- `bill_items`: `bill_item_seq` (Starts at 1)

### Foreign Key Constraints Matrix

```text
PATIENTS.user_id              ──> USERS.user_id
DOCTORS.user_id               ──> USERS.user_id
DOCTORS.department_id         ──> DEPARTMENTS.department_id
APPOINTMENTS.patient_id       ──> PATIENTS.patient_id
APPOINTMENTS.doctor_id        ──> DOCTORS.doctor_id
APPOINTMENTS.department_id    ──> DEPARTMENTS.department_id
ADMISSIONS.patient_id         ──> PATIENTS.patient_id
ADMISSIONS.room_id            ──> ROOMS.room_id
ADMISSIONS.doctor_id          ──> DOCTORS.doctor_id
MEDICAL_RECORDS.patient_id    ──> PATIENTS.patient_id
MEDICAL_RECORDS.doctor_id     ──> DOCTORS.doctor_id
PRESCRIPTIONS.patient_id      ──> PATIENTS.patient_id
PRESCRIPTIONS.doctor_id       ──> DOCTORS.doctor_id
PRESCRIPTIONS.record_id       ──> MEDICAL_RECORDS.record_id
PRESCRIPTION_ITEMS.prescription_id ──> PRESCRIPTIONS.prescription_id (ON DELETE CASCADE)
PRESCRIPTION_ITEMS.medicine_id     ──> MEDICINES.medicine_id
BILLS.patient_id              ──> PATIENTS.patient_id
BILLS.appointment_id          ──> APPOINTMENTS.appointment_id
BILLS.admission_id            ──> ADMISSIONS.admission_id
BILL_ITEMS.bill_id            ──> BILLS.bill_id (ON DELETE CASCADE)
```

---

## 4. Entity Relationship (ER) Model & Cardinality

### Cardinality Mapping

| Relationship | Cardinality | Explanation |
|---|:---:|---|
| **Department to Doctor** | `1 : N` | One department has many doctors; each doctor belongs to one primary department. |
| **Patient to Appointment** | `1 : N` | A patient can book multiple appointments over time. |
| **Doctor to Appointment** | `1 : N` | A doctor attends to multiple scheduled appointments. |
| **Patient to Admission** | `1 : N` | A patient can have multiple hospital admissions across their lifetime. |
| **Room to Admission** | `1 : N` | A single room accommodates different admissions over time (one at a time when occupied). |
| **Patient to Medical Record** | `1 : N` | A patient accumulates a chronological history of medical records. |
| **Prescription to Medicine** | `M : N` | A prescription includes multiple medicines; a medicine appears in many prescriptions (resolved via `PRESCRIPTION_ITEMS`). |
| **Bill to Bill Items** | `1 : N` | A bill contains multiple itemized charge lines. |

---

## 5. Database Normalization Analysis (1NF to 3NF)

### First Normal Form (1NF)
*Requirement: All column values must be atomic (no repeating groups, no comma-separated arrays, unique row identifier).*
- **Resolution**: In a prescription, multiple medicines are **never** stored as comma-delimited strings (e.g., `'Paracetamol, Amoxicillin'`). Instead, each prescribed item is stored as an individual row in `PRESCRIPTION_ITEMS`.
- Every table has an immutable numeric Primary Key generated by a dedicated Oracle sequence.

### Second Normal Form (2NF)
*Requirement: Table must be in 1NF, and all non-key attributes must be fully functionally dependent on the entire Primary Key (no partial dependency on composite keys).*
- **Resolution**: All composite relationships (e.g., Many-to-Many between Prescriptions and Medicines, Bills and Items) use surrogate primary keys (`item_id`, `bill_item_id`). Non-key attributes like `dosage`, `frequency`, and `duration` depend solely on the single-attribute primary key `item_id`.

### Third Normal Form (3NF)
*Requirement: Table must be in 2NF, and no transitive dependencies must exist (non-key attributes must depend only on the Primary Key: $X \to Y$ where $Y$ is not dependent on another non-key attribute $Z$).*
- **Resolution**:
  - `APPOINTMENTS` stores only `doctor_id` and `department_id`. It does **not** store `doctor_name` or `department_name`. These are fetched dynamically through relational `JOIN` operations.
  - `PATIENTS` stores `user_id` as foreign key rather than duplicating `username` or `password_hash`.
  - `BILLS` references `patient_id` rather than duplicating patient phone or address.

---

## 6. Integrity Constraints & Business Rules

1. **Domain & Enum Integrity (`CHECK` Constraints)**:
   - `chk_user_role`: `role IN ('ADMIN', 'DOCTOR', 'PATIENT')`
   - `chk_patient_gender`: `gender IN ('Male', 'Female', 'Other')`
   - `chk_blood_group`: `blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')`
   - `chk_doctor_status`: `status IN ('Active', 'On Leave', 'Inactive')`
   - `chk_appt_status`: `status IN ('Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No Show')`
   - `chk_room_type`: `room_type IN ('General Ward', 'Semi Private', 'Private', 'ICU', 'Emergency')`
   - `chk_room_status`: `status IN ('Available', 'Occupied', 'Maintenance')`
   - `chk_payment_status`: `payment_status IN ('Pending', 'Partially Paid', 'Paid')`
   - `chk_payment_method`: `payment_method IN ('Cash', 'Card', 'UPI', 'Insurance')`

2. **Numerical & Financial Integrity**:
   - `chk_daily_charge`: `daily_charge > 0`
   - `chk_med_price`: `unit_price > 0`
   - `chk_med_stock`: `stock_quantity >= 0`

3. **Uniqueness Constraints**:
   - `users(username)`: UNIQUE
   - `users(email)`: UNIQUE
   - `doctors(email)`: UNIQUE
   - `departments(name)`: UNIQUE
   - `rooms(room_number)`: UNIQUE

---

## 7. Indexes & Performance Optimization

To guarantee rapid lookups on large healthcare datasets, B-Tree indexes are created on frequently queried and joined attributes:

```sql
CREATE INDEX idx_patient_name ON patients(last_name, first_name);
CREATE INDEX idx_patient_phone ON patients(phone);
CREATE INDEX idx_doctor_dept ON doctors(department_id);
CREATE INDEX idx_doctor_spec ON doctors(specialization);
CREATE INDEX idx_appt_date ON appointments(appointment_date);
CREATE INDEX idx_appt_patient ON appointments(patient_id);
CREATE INDEX idx_appt_doctor ON appointments(doctor_id);
CREATE INDEX idx_appt_status ON appointments(status);
CREATE INDEX idx_admission_patient ON admissions(patient_id);
CREATE INDEX idx_admission_status ON admissions(status);
CREATE INDEX idx_mr_patient ON medical_records(patient_id);
CREATE INDEX idx_medicine_name ON medicines(name);
CREATE INDEX idx_medicine_expiry ON medicines(expiry_date);
CREATE INDEX idx_presc_patient ON prescriptions(patient_id);
CREATE INDEX idx_bill_patient ON bills(patient_id);
CREATE INDEX idx_bill_status ON bills(payment_status);
```

---

## 8. Oracle Database Views

### View 1: `V_PATIENT_APPOINTMENTS`
Consolidates patient, doctor, and department details for quick schedule generation.
```sql
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
```

### View 2: `V_ROOM_STATUS`
Shows live occupancy status of all rooms and attending patient info.
```sql
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
```

### View 3: `V_MEDICINE_STOCK_ALERT`
Identifies medicines requiring immediate reordering or nearing expiration (within 90 days).
```sql
CREATE OR REPLACE VIEW v_medicine_stock_alert AS
SELECT name,
       category,
       stock_quantity,
       reorder_level,
       expiry_date,
       CASE
           WHEN expiry_date < SYSDATE THEN 'Expired'
           WHEN expiry_date <= SYSDATE + 90 THEN 'Expiring Soon'
           WHEN stock_quantity <= reorder_level THEN 'Low Stock'
       END AS alert_type
FROM medicines
WHERE stock_quantity <= reorder_level OR expiry_date <= SYSDATE + 90;
```

---

## 9. Oracle PL/SQL Triggers

### 1. Inpatient Admission Trigger: Automatic Room Status
```sql
CREATE OR REPLACE TRIGGER trg_room_occupy
AFTER INSERT ON admissions
FOR EACH ROW
BEGIN
    UPDATE rooms 
    SET status = 'Occupied', updated_at = SYSTIMESTAMP 
    WHERE room_id = :NEW.room_id;
END;
/
```

### 2. Inpatient Discharge Trigger: Automatic Room Release
```sql
CREATE OR REPLACE TRIGGER trg_room_release
AFTER UPDATE OF status ON admissions
FOR EACH ROW
WHEN (NEW.status = 'Discharged')
BEGIN
    UPDATE rooms 
    SET status = 'Available', updated_at = SYSTIMESTAMP 
    WHERE room_id = :NEW.room_id;
END;
/
```

### 3. Audit Timestamp Trigger
```sql
CREATE OR REPLACE TRIGGER trg_patients_updated_at
BEFORE UPDATE ON patients
FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/
```

---

## 10. Oracle Stored Procedures & Functions

### Function: Calculate Inpatient Bed Charges
```sql
CREATE OR REPLACE FUNCTION fn_calculate_room_charges (
    p_admission_id IN NUMBER
) RETURN NUMBER IS
    v_days NUMBER;
    v_daily_charge NUMBER;
    v_admission_date DATE;
    v_discharge_date DATE;
BEGIN
    SELECT a.admission_date, NVL(a.actual_discharge_date, SYSDATE), r.daily_charge
    INTO v_admission_date, v_discharge_date, v_daily_charge
    FROM admissions a
    JOIN rooms r ON a.room_id = r.room_id
    WHERE a.admission_id = p_admission_id;

    v_days := CEIL(v_discharge_date - v_admission_date);
    IF v_days <= 0 THEN
        v_days := 1;
    END IF;

    RETURN v_days * v_daily_charge;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 0;
END;
/
```

### Procedure: Atomic Patient Discharge
```sql
CREATE OR REPLACE PROCEDURE sp_discharge_patient (
    p_admission_id IN NUMBER
) IS
    v_room_id NUMBER;
BEGIN
    SELECT room_id INTO v_room_id 
    FROM admissions 
    WHERE admission_id = p_admission_id;

    UPDATE admissions
    SET actual_discharge_date = SYSDATE,
        status = 'Discharged',
        updated_at = SYSTIMESTAMP
    WHERE admission_id = p_admission_id;

    UPDATE rooms
    SET status = 'Available',
        updated_at = SYSTIMESTAMP
    WHERE room_id = v_room_id;

    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
/
```

---

## 11. Transaction Management & ACID Compliance

- **Atomicity**: Multi-table operations (e.g., patient admission updating both `ADMISSIONS` and `ROOMS`) are encapsulated inside Spring `@Transactional` boundaries and PL/SQL transactions. If any step fails, the entire transaction is rolled back.
- **Consistency**: Relational integrity is enforced at the database level via `FOREIGN KEY`, `NOT NULL`, `CHECK`, and `UNIQUE` constraints.
- **Isolation**: Read Committed isolation level prevents dirty reads while allowing high concurrent throughput for doctor and receptionist operations.
- **Durability**: All committed transactions are persisted in Oracle redo logs and datafiles.

---

## 12. Comprehensive SQL Demonstration Queries

*(Refer to `database/queries.sql` for all 31 executable queries spanning Basic, Aggregate, Group By/Having, Multi-table Joins, Correlated Subqueries, and Date Arithmetic).*

---

## 13. Common DBMS Viva Questions & Model Answers

### Q1: Why did you choose Oracle SQL instead of MySQL?
> **Answer**: Oracle Database provides enterprise-grade robustness, built-in sequence generators (`sequence.NEXTVAL`), powerful PL/SQL stored procedures, granular transactional control, and native analytical capabilities (`MONTHS_BETWEEN`, `SYSTIMESTAMP`) well-suited for high-concurrency mission-critical applications like healthcare.

### Q2: How is 3NF achieved in your prescription schema?
> **Answer**: Rather than storing multiple medicines as a multivalued attribute in `PRESCRIPTIONS` (which violates 1NF) or creating repeating columns (e.g., `med1`, `med2`), we decoupled the prescription into a master table `PRESCRIPTIONS` and a junction detail table `PRESCRIPTION_ITEMS`. Non-key dosage instructions depend solely on the surrogate `item_id`, eliminating partial and transitive dependencies.

### Q3: How do you prevent double-booking for doctors?
> **Answer**: On the database level, an index and constraint validate uniqueness on `(doctor_id, appointment_date, appointment_time)`. On the backend service layer, `AppointmentService` performs a pre-flight query checking for existing non-cancelled bookings before persisting new appointments.

### Q4: What is the purpose of database triggers in this project?
> **Answer**: Triggers enforce automatic state transitions. For example, `trg_room_occupy` automatically flips a room's status to `Occupied` when an admission is logged, and `trg_room_release` resets it to `Available` upon discharge, preventing human error or inconsistent room availability states.
