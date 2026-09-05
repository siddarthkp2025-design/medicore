-- ============================================================
-- MediCore HMS — Supabase PostgreSQL Indexes & Additional Constraints
-- Script 03: 03_constraints.sql
-- ============================================================

-- Performance Indexes
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

-- Unique Constraint to prevent appointment booking conflicts
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_appt_conflict'
    ) THEN
        ALTER TABLE appointments ADD CONSTRAINT uq_appt_conflict UNIQUE (doctor_id, appointment_date, appointment_time);
    END IF;
END $$;
