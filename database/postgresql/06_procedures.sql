-- ============================================================
-- MediCore HMS — Supabase PostgreSQL Procedures & Functions
-- Script 06: 06_procedures.sql
-- ============================================================

-- 1. Procedure: Admit Patient
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

-- 2. Procedure: Discharge Patient
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

-- 3. Function: Calculate Room Charges
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

-- 4. Function: Calculate Bill Total
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

-- 5. Procedure: Generate Bill
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

-- 6. Function: Get Doctor Appointment Count
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
