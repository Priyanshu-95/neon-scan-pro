-- Add new columns to attendance_records for face scan method
ALTER TABLE public.attendance_records 
ADD COLUMN IF NOT EXISTS method text DEFAULT 'authenticated',
ADD COLUMN IF NOT EXISTS student_name text,
ADD COLUMN IF NOT EXISTS enrollment_number text;