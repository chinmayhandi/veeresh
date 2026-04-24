// supabase-config.js

// IMPORTANT: Replace these with your actual Supabase Project URL and Anon Key
// You can find these in your Supabase Dashboard under Settings -> API
const SUPABASE_URL = 'https://edhaqdswnheyrctlviju.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkaGFxZHN3dmhleXJjdGx2aWp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMTMxNTQsImV4cCI6MjA5MjU4OTE1NH0.30cEDx44jb3P5_RJE_g030XYjfLIaEtbdOGad1bajgI';

// Initialize the Supabase client
// The supabase object comes from the CDN script included in HTML
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
