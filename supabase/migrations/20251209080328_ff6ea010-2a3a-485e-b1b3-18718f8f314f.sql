-- Create storage bucket for face images
INSERT INTO storage.buckets (id, name, public)
VALUES ('face-images', 'face-images', false);

-- Storage policies for face images
CREATE POLICY "Users can upload their own face image"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'face-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own face image"
ON storage.objects FOR SELECT
USING (bucket_id = 'face-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own face image"
ON storage.objects FOR UPDATE
USING (bucket_id = 'face-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add face_image_url and roll_number to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS face_image_url TEXT;