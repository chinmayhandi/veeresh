-- 1. Create the `videos` table
CREATE TABLE videos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    poster_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- 3. Create Policy: Public can view videos
CREATE POLICY "Public can view videos"
    ON videos FOR SELECT
    USING (true);

-- 4. Create Policy: Only Authenticated admins can insert videos
CREATE POLICY "Admins can insert videos"
    ON videos FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- 5. Create Policy: Only Authenticated admins can update videos
CREATE POLICY "Admins can update videos"
    ON videos FOR UPDATE
    USING (auth.role() = 'authenticated');

-- 6. Create Policy: Only Authenticated admins can delete videos
CREATE POLICY "Admins can delete videos"
    ON videos FOR DELETE
    USING (auth.role() = 'authenticated');

-- Instructions for Storage:
-- 1. Go to your Supabase Dashboard -> Storage
-- 2. Create a new bucket named "videos"
-- 3. Set it to "Public"
-- 4. Go to Storage Policies and allow public SELECT on the "videos" bucket.
-- 5. Allow authenticated INSERT/UPDATE on the "videos" bucket.
