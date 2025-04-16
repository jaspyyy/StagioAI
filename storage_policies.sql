-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for public viewing of files
CREATE POLICY "Allow public viewing" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'virtual-staging');

-- Policy for authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'virtual-staging' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy for authenticated users to update their own files
CREATE POLICY "Allow authenticated updates" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'virtual-staging' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy for authenticated users to delete their own files
CREATE POLICY "Allow authenticated deletes" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'virtual-staging' AND auth.uid()::text = (storage.foldername(name))[1]); 