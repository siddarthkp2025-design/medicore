-- ============================================================
-- MediCore HMS — Supabase PostgreSQL Demonstration Queries
-- Script 08: 08_queries.sql
-- 31 Domain Queries covering Basic, Aggregates, Group By, Joins, Subqueries, and Date Arithmetic
-- ============================================================

-- ============================================================
-- 1. BASIC QUERIES (5)
-- ============================================================
-- 1. SELECT all patients ordered by registration date
SELECT * FROM patients ORDER BY registration_date DESC;

-- 2. SELECT appointments with WHERE, LIKE, BETWEEN
SELECT * FROM appointments 
WHERE reason ILIKE '%checkup%' 
  AND appointment_date BETWEEN CURRENT_DATE - INTERVAL '30 days' AND CURRENT_DATE;

-- 3. SELECT medicines with IN clause
SELECT * FROM medicines 
WHERE category IN ('Analgesic', 'Antibiotic', 'NSAID');

-- 4. SELECT patients by blood group
SELECT * FROM patients WHERE blood_group = 'O+';

-- 5. SELECT doctors by status
SELECT * FROM doctors WHERE status = 'Active';

-- ============================================================
-- 2. AGGREGATE QUERIES (5)
-- ============================================================
-- 6. COUNT patients by gender
SELECT gender, COUNT(*) AS patient_count FROM patients GROUP BY gender;

-- 7. SUM of total revenue from paid bills
SELECT SUM(total_amount) AS total_revenue FROM bills WHERE payment_status = 'Paid';

-- 8. AVG bill amount
SELECT ROUND(AVG(total_amount), 2) AS average_bill FROM bills;

-- 9. MAX/MIN medicine prices
SELECT MAX(unit_price) AS max_price, MIN(unit_price) AS min_price FROM medicines;

-- 10. COUNT appointments by status
SELECT status, COUNT(*) AS status_count FROM appointments GROUP BY status;

-- ============================================================
-- 3. GROUP BY / HAVING QUERIES (5)
-- ============================================================
-- 11. Appointments grouped by department
SELECT department_id, COUNT(*) AS num_appointments 
FROM appointments GROUP BY department_id;

-- 12. Revenue grouped by month
SELECT TO_CHAR(billing_date, 'YYYY-MM') AS bill_month, SUM(total_amount) AS monthly_revenue 
FROM bills GROUP BY TO_CHAR(billing_date, 'YYYY-MM');

-- 13. Doctors grouped by department with HAVING count > 1
SELECT department_id, COUNT(*) AS doc_count 
FROM doctors GROUP BY department_id HAVING COUNT(*) > 1;

-- 14. Medicine categories with average price
SELECT category, ROUND(AVG(unit_price), 2) AS avg_price 
FROM medicines GROUP BY category;

-- 15. Patients grouped by blood group
SELECT blood_group, COUNT(*) AS num_patients FROM patients GROUP BY blood_group;

-- ============================================================
-- 4. JOIN QUERIES (5)
-- ============================================================
-- 16. Patients with their appointments (INNER JOIN)
SELECT p.first_name, p.last_name, a.appointment_date, a.reason 
FROM patients p INNER JOIN appointments a ON p.patient_id = a.patient_id;

-- 17. All rooms with occupancy info (LEFT JOIN)
SELECT r.room_number, a.patient_id, a.admission_date 
FROM rooms r LEFT JOIN admissions a ON r.room_id = a.room_id AND a.status = 'Admitted';

-- 18. Prescriptions with medicine details (multi-table join)
SELECT pr.prescription_id, m.name AS medicine_name, pi.dosage, pi.frequency, pi.duration 
FROM prescriptions pr 
JOIN prescription_items pi ON pr.prescription_id = pi.prescription_id 
JOIN medicines m ON pi.medicine_id = m.medicine_id;

-- 19. Bills with patient and appointment info
SELECT b.bill_id, p.first_name, p.last_name, a.appointment_date, b.total_amount, b.payment_status 
FROM bills b 
JOIN patients p ON b.patient_id = p.patient_id 
LEFT JOIN appointments a ON b.appointment_id = a.appointment_id;

-- 20. Doctors with department and appointment count
SELECT d.first_name, d.last_name, dept.name AS department_name, COUNT(a.appointment_id) AS appt_count
FROM doctors d 
LEFT JOIN departments dept ON d.department_id = dept.department_id 
LEFT JOIN appointments a ON d.doctor_id = a.doctor_id 
GROUP BY d.doctor_id, d.first_name, d.last_name, dept.name;

-- ============================================================
-- 5. SUBQUERIES (5)
-- ============================================================
-- 21. Patients whose bill is above average
SELECT first_name, last_name FROM patients 
WHERE patient_id IN (SELECT patient_id FROM bills WHERE total_amount > (SELECT AVG(total_amount) FROM bills));

-- 22. Doctor with highest appointment count
SELECT doctor_id, COUNT(*) AS appointment_count 
FROM appointments 
GROUP BY doctor_id 
ORDER BY COUNT(*) DESC LIMIT 1;

-- 23. Departments with more than 5 appointments
SELECT department_id, name FROM departments 
WHERE department_id IN (
    SELECT department_id FROM appointments GROUP BY department_id HAVING COUNT(*) > 5
);

-- 24. Most frequently prescribed medicine
SELECT medicine_id, COUNT(*) AS prescription_count 
FROM prescription_items 
GROUP BY medicine_id 
ORDER BY COUNT(*) DESC LIMIT 1;

-- 25. Patients who have never had an appointment
SELECT * FROM patients 
WHERE patient_id NOT IN (SELECT patient_id FROM appointments WHERE patient_id IS NOT NULL);

-- ============================================================
-- 6. DATE/TIME QUERIES (6)
-- ============================================================
-- 26. Today's appointments
SELECT * FROM appointments WHERE appointment_date = CURRENT_DATE;

-- 27. Appointments in the last 7 days
SELECT * FROM appointments WHERE appointment_date >= CURRENT_DATE - INTERVAL '7 days';

-- 28. Medicines expiring within 90 days
SELECT * FROM medicines WHERE expiry_date <= CURRENT_DATE + INTERVAL '90 days';

-- 29. Patient age calculation using AGE() in PostgreSQL
SELECT first_name, last_name, EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth))::INTEGER AS age 
FROM patients;

-- 30. Revenue for current month
SELECT SUM(total_amount) AS current_month_revenue 
FROM bills 
WHERE DATE_TRUNC('month', billing_date) = DATE_TRUNC('month', CURRENT_DATE);

-- 31. Admissions longer than 5 days
SELECT admission_id, patient_id, admission_date, actual_discharge_date,
       (COALESCE(actual_discharge_date, CURRENT_DATE) - admission_date) AS length_of_stay
FROM admissions 
WHERE (COALESCE(actual_discharge_date, CURRENT_DATE) - admission_date) > 5;
