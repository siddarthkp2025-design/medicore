-- FILE 5: triggers.sql

CREATE OR REPLACE TRIGGER trg_room_occupy
AFTER INSERT ON admissions
FOR EACH ROW
BEGIN
    UPDATE rooms
    SET status = 'Occupied'
    WHERE room_id = :NEW.room_id;
END;
/

CREATE OR REPLACE TRIGGER trg_room_release
AFTER UPDATE ON admissions
FOR EACH ROW
BEGIN
    IF :NEW.status = 'Discharged' AND :OLD.status = 'Admitted' THEN
        UPDATE rooms
        SET status = 'Available'
        WHERE room_id = :NEW.room_id;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_patients_updated_at
BEFORE UPDATE ON patients
FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_doctors_updated_at
BEFORE UPDATE ON doctors
FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_departments_updated_at
BEFORE UPDATE ON departments
FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_rooms_updated_at
BEFORE UPDATE ON rooms
FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_admissions_updated_at
BEFORE UPDATE ON admissions
FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_medical_rec_updated_at
BEFORE UPDATE ON medical_records
FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_medicines_updated_at
BEFORE UPDATE ON medicines
FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_prescriptions_updated_at
BEFORE UPDATE ON prescriptions
FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_bills_updated_at
BEFORE UPDATE ON bills
FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/
