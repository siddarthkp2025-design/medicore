-- ============================================================
-- MediCore HMS — Supabase PostgreSQL Triggers
-- Script 05: 05_triggers.sql
-- ============================================================

-- Function: update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all entity tables
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

-- Function & Trigger: Room Occupy on Admission Insert
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

-- Function & Trigger: Room Release on Admission Discharge
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
