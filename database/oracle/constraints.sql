-- FILE 3: constraints.sql

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

ALTER TABLE appointments ADD CONSTRAINT uq_appt_conflict UNIQUE (doctor_id, appointment_date, appointment_time);
