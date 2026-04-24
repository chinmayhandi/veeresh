// admin.js

document.addEventListener('DOMContentLoaded', async () => {
    const authView = document.getElementById('auth-view');
    const dashboardView = document.getElementById('dashboard-view');
    const loginForm = document.getElementById('login-form');
    const uploadForm = document.getElementById('upload-form');
    const logoutBtn = document.getElementById('logout-btn');
    const authError = document.getElementById('auth-error');
    const uploadMessage = document.getElementById('upload-message');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('upload-progress');
    const uploadBtn = document.getElementById('upload-btn');

    // 1. Check Auth State
    async function checkSession() {
        if (typeof supabaseClient === 'undefined' || SUPABASE_URL === 'YOUR_SUPABASE_URL') {
            authError.innerHTML = `Supabase not configured. Please edit <code>supabase-config.js</code>`;
            return;
        }

        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            authView.classList.add('hidden');
            dashboardView.classList.remove('hidden');
        } else {
            authView.classList.remove('hidden');
            dashboardView.classList.add('hidden');
        }
    }

    // Initialize
    checkSession();

    // Listen for auth state changes
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            authView.classList.add('hidden');
            dashboardView.classList.remove('hidden');
        } else if (event === 'SIGNED_OUT') {
            authView.classList.remove('hidden');
            dashboardView.classList.add('hidden');
        }
    });

    // 2. Handle Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = loginForm.querySelector('button');
        const originalText = btn.textContent;

        try {
            btn.textContent = 'Logging in...';
            btn.disabled = true;
            authError.textContent = '';

            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            
        } catch (error) {
            authError.textContent = error.message;
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });

    // 3. Handle Logout
    logoutBtn.addEventListener('click', async () => {
        await supabaseClient.auth.signOut();
    });

    // 4. Handle Video Upload
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('video-title').value;
        const description = document.getElementById('video-description').value;
        const fileInput = document.getElementById('video-file');
        const file = fileInput.files[0];

        if (!file) return;

        try {
            uploadBtn.disabled = true;
            uploadBtn.textContent = 'Uploading...';
            progressContainer.style.display = 'block';
            progressBar.style.width = '10%';
            uploadMessage.className = 'form-message';
            uploadMessage.textContent = 'Uploading to storage...';

            // Clean filename to prevent issues
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            // 4a. Upload to Storage
            const { error: uploadError } = await supabaseClient.storage
                .from('videos')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            progressBar.style.width = '60%';
            uploadMessage.textContent = 'Getting public URL...';

            // 4b. Get Public URL
            const { data: { publicUrl } } = supabaseClient.storage
                .from('videos')
                .getPublicUrl(filePath);

            progressBar.style.width = '80%';
            uploadMessage.textContent = 'Saving to database...';

            // 4c. Insert into Database
            const { error: dbError } = await supabaseClient
                .from('videos')
                .insert([
                    { 
                        title: title, 
                        description: description, 
                        video_url: publicUrl 
                    }
                ]);

            if (dbError) throw dbError;

            progressBar.style.width = '100%';
            uploadMessage.className = 'form-message success';
            uploadMessage.textContent = 'Video uploaded and saved successfully!';
            
            // Reset form
            setTimeout(() => {
                uploadForm.reset();
                progressContainer.style.display = 'none';
                progressBar.style.width = '0%';
                setTimeout(() => uploadMessage.textContent = '', 3000);
            }, 2000);

        } catch (error) {
            console.error(error);
            uploadMessage.className = 'form-message error';
            uploadMessage.textContent = `Error: ${error.message}`;
            progressBar.style.background = 'var(--accent-red)';
        } finally {
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Upload Video';
        }
    });
});
