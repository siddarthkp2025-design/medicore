-- FILE 6: procedures.sql

CREATE OR REPLACE PROCEDURE sp_admit_patient (
    p_patient_id IN NUMBER,
    p_room_id IN NUMBER,
    p_doctor_id IN NUMBER,
    p_diagnosis IN VARCHAR2,
    p_expected_discharge_date IN DATE
)
IS
    v_room_status VARCHAR2(20);
BEGIN
    SELECT status INTO v_room_status FROM rooms WHERE room_id = p_room_id FOR UPDATE;
    
    IF v_room_status != 'Available' THEN
        RAISE_APPLICATION_ERROR(-20001, 'Room is not available for admission.');
    END IF;
    
    INSERT INTO admissions (
        admission_id, patient_id, room_id, doctor_id, admission_date, expected_discharge_date, diagnosis, status
    ) VALUES (
        admission_seq.NEXTVAL, p_patient_id, p_room_id, p_doctor_id, SYSDATE, p_expected_discharge_date, p_diagnosis, 'Admitted'
    );
    
    -- The trigger trg_room_occupy will handle updating the room status.
    COMMIT;
END sp_admit_patient;
/

CREATE OR REPLACE PROCEDURE sp_discharge_patient (
    p_admission_id IN NUMBER
)
IS
BEGIN
    UPDATE admissions
    SET actual_discharge_date = SYSDATE,
        status = 'Discharged'
    WHERE admission_id = p_admission_id;
    
    -- The trigger trg_room_release will handle updating the room status.
    COMMIT;
END sp_discharge_patient;
/

CREATE OR REPLACE FUNCTION fn_calculate_room_charges (
    p_admission_id IN NUMBER
) RETURN NUMBER
IS
    v_admission_date DATE;
    v_discharge_date DATE;
    v_daily_charge NUMBER;
    v_days NUMBER;
    v_total NUMBER;
BEGIN
    SELECT a.admission_date, NVL(a.actual_discharge_date, SYSDATE), r.daily_charge
    INTO v_admission_date, v_discharge_date, v_daily_charge
    FROM admissions a
    JOIN rooms r ON a.room_id = r.room_id
    WHERE a.admission_id = p_admission_id;
    
    v_days := CEIL(v_discharge_date - v_admission_date);
    IF v_days = 0 THEN
        v_days := 1;
    END IF;
    
    v_total := v_days * v_daily_charge;
    RETURN v_total;
END fn_calculate_room_charges;
/

CREATE OR REPLACE FUNCTION fn_calculate_bill_total (
    p_bill_id IN NUMBER
) RETURN NUMBER
IS
    v_total NUMBER;
BEGIN
    SELECT (consultation_charge + room_charge + medicine_charge + other_charges - discount + tax)
    INTO v_total
    FROM bills
    WHERE bill_id = p_bill_id;
    
    RETURN v_total;
END fn_calculate_bill_total;
/

CREATE OR REPLACE PROCEDURE sp_generate_bill (
    p_patient_id IN NUMBER,
    p_appointment_id IN NUMBER,
    p_admission_id IN NUMBER,
    p_consultation_charge IN NUMBER,
    p_medicine_charge IN NUMBER,
    p_other_charges IN NUMBER,
    p_discount IN NUMBER,
    p_tax IN NUMBER
)
IS
    v_room_charge NUMBER := 0;
    v_total_amount NUMBER := 0;
    v_bill_id NUMBER;
BEGIN
    IF p_admission_id IS NOT NULL THEN
        v_room_charge := fn_calculate_room_charges(p_admission_id);
    END IF;
    
    v_total_amount := p_consultation_charge + v_room_charge + p_medicine_charge + p_other_charges - p_discount + p_tax;
    
    v_bill_id := bill_seq.NEXTVAL;
    
    INSERT INTO bills (
        bill_id, patient_id, appointment_id, admission_id, consultation_charge, room_charge, medicine_charge, other_charges, discount, tax, total_amount, payment_status, billing_date
    ) VALUES (
        v_bill_id, p_patient_id, p_appointment_id, p_admission_id, p_consultation_charge, v_room_charge, p_medicine_charge, p_other_charges, p_discount, p_tax, v_total_amount, 'Pending', SYSDATE
    );
    
    COMMIT;
END sp_generate_bill;
/

CREATE OR REPLACE FUNCTION fn_get_doctor_appt_count (
    p_doctor_id IN NUMBER,
    p_start_date IN DATE,
    p_end_date IN DATE
) RETURN NUMBER
IS
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM appointments
    WHERE doctor_id = p_doctor_id
      AND appointment_date BETWEEN p_start_date AND p_end_date;
      
    RETURN v_count;
END fn_get_doctor_appt_count;
/
