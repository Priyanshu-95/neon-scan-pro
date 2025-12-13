-- Create index for faster duplicate checking (using immutable timezone function)
CREATE INDEX IF NOT EXISTS idx_attendance_user_marked_at ON public.attendance_records (user_id, marked_at);