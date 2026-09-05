-- ============================================================
-- MediCore HMS — Supabase PostgreSQL Views
-- Script 04: 04_views.sql
-- ============================================================

-- 1. Patient Appointments View
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

-- 2. Room Status View
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

-- 3. Bill Summary View
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

-- 4. Doctor Schedule View
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

-- 5. Medicine Stock Alert View
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

-- 6. Department Statistics View
CREATE OR REPLACE VIEW v_department_statistics AS
SELECT dept.name AS department_name,
       COUNT(a.appointment_id) AS total_appointments,
       SUM(CASE WHEN a.status = 'Completed' THEN 1 ELSE 0 END) AS completed_count,
       SUM(CASE WHEN a.status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled_count,
       (SELECT COUNT(*) FROM doctors d WHERE d.department_id = dept.department_id) AS doctor_count
FROM departments dept
LEFT JOIN appointments a ON dept.department_id = a.department_id
GROUP BY dept.department_id, dept.name;
