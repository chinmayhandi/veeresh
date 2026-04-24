// script.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle & Navigation Link Handling
    const menuBtn = document.querySelector('.menu-btn');
    const navLinksList = document.querySelector('.nav-links');
    const header = document.querySelector('.header');

    // Toggle Mobile Menu
    menuBtn.addEventListener('click', () => {
        navLinksList.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        if (navLinksList.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinksList.classList.remove('active');
            menuBtn.querySelector('i').classList.remove('fa-times');
            menuBtn.querySelector('i').classList.add('fa-bars');
        });
    });

    // Header Background on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active Navigation Link Update on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Add a little offset for better UX
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 2. Animated Skill Bars on Scroll (Intersection Observer)
    const skillBars = document.querySelectorAll('.progress-bar');
    
    // Observer options
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when half of the element is visible
    };

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
                // Stop observing once animated
                observer.unobserve(bar);
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // 3. Contact Form Submission (Basic Simulation)
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.querySelector('.form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation check
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name && email && message) {
                const submitBtn = document.querySelector('.submit-btn');
                const originalText = submitBtn.innerHTML;
                
                // Simulate loading state
                submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;

                // Simulate network request
                setTimeout(() => {
                    formMessage.textContent = "Thank you! Your message has been sent successfully. I will get back to you soon.";
                    formMessage.className = 'form-message success';
                    contactForm.reset();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;

                    // Clear message after 5 seconds
                    setTimeout(() => {
                        formMessage.textContent = '';
                    }, 5000);
                }, 1500);
            } else {
                formMessage.textContent = "Please fill in all required fields.";
                formMessage.className = 'form-message error';
            }
        });
    }

    // 4. AI Chatbot Logic
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    // Toggle Chatbot Window
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            setTimeout(() => chatInput.focus(), 300);
        }
    });

    // Close Chatbot Window
    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    // Chatbot Knowledge Base
    const knowledgeBase = {
        'services': 'I offer a range of video editing services including YouTube Video Editing, Wedding Cinematics, Social Media Reels (TikTok/Instagram), Commercial Ads, and Motion Graphics. You can see details in the Services section.',
        'hire': 'To hire me, you can fill out the connection form in the "Contact" section below, or email me directly at editor@example.com.',
        'portfolio': 'My portfolio is available in the "Works" section above. It features a grid of my latest projects across various styles. Feel free to click on them to view the thumbnails!',
        'pricing': 'My rates vary depending on the scope of the project, raw footage length, and required deliverables. Please use the contact form to provide details for a custom quote.',
        'software': 'I primarily work with Adobe Premiere Pro and After Effects for editing and motion graphics, along with DaVinci Resolve for professional color grading.',
        'default': "I'm a simple AI assistant for VideoPro. I can answer basic questions about services, hiring, or the portfolio. Could you try rephrasing your question?"
    };

    // Add Message to Chat Interface
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        msgDiv.textContent = text;
        
        // Append message
        chatbotMessages.appendChild(msgDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Process Chat Logic
    function handleChat() {
        const userText = chatInput.value.trim();
        if (!userText) return;

        // 1. Add User Message
        addMessage(userText, 'user');
        chatInput.value = '';

        // 2. Determine Response (Simple Keyword Matching)
        const lowerCaseInput = userText.toLowerCase();
        let replyKey = 'default';

        if (lowerCaseInput.includes('service') || lowerCaseInput.includes('offer') || lowerCaseInput.includes('do you do')) {
            replyKey = 'services';
        } else if (lowerCaseInput.includes('hire') || lowerCaseInput.includes('contact') || lowerCaseInput.includes('book')) {
            replyKey = 'hire';
        } else if (lowerCaseInput.includes('portfolio') || lowerCaseInput.includes('work') || lowerCaseInput.includes('examples') || lowerCaseInput.includes('videos')) {
            replyKey = 'portfolio';
        } else if (lowerCaseInput.includes('price') || lowerCaseInput.includes('cost') || lowerCaseInput.includes('rate') || lowerCaseInput.includes('how much')) {
            replyKey = 'pricing';
        } else if (lowerCaseInput.includes('software') || lowerCaseInput.includes('program') || lowerCaseInput.includes('app') || lowerCaseInput.includes('edit with')) {
            replyKey = 'software';
        }

        // 3. Simulate Thinking Delay then Add AI Message
        setTimeout(() => {
            addMessage(knowledgeBase[replyKey], 'ai');
        }, 800);
    }

    // Send on Button Click
    chatSend.addEventListener('click', handleChat);

    // Send on Enter Key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleChat();
        }
    });

    // Handle Suggestion Buttons
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const queryKey = btn.getAttribute('data-query');
            const predefinedText = btn.textContent;
            
            // Add user message visually
            addMessage(predefinedText, 'user');
            
            // Simulate AI reply
            setTimeout(() => {
                addMessage(knowledgeBase[queryKey], 'ai');
            }, 800);
        });
    });

    // 5. Fetch and Render Supabase Portfolio Videos
    async function fetchPortfolioVideos() {
        const grid = document.getElementById('portfolio-grid');
        if (!grid) return;

        try {
            // Check if Supabase is configured
            if (typeof supabaseClient === 'undefined' || SUPABASE_URL === 'YOUR_SUPABASE_URL') {
                grid.innerHTML = `
                    <div style="text-align: center; width: 100%; grid-column: 1 / -1; padding: 40px;">
                        <h3 style="color: var(--accent-red); margin-bottom: 10px;">Supabase Not Configured</h3>
                        <p style="color: #ccc;">Please configure your Supabase URL and Key in <code>supabase-config.js</code> to load videos.</p>
                    </div>`;
                return;
            }

            const { data: videos, error } = await supabaseClient
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!videos || videos.length === 0) {
                grid.innerHTML = `
                    <div style="text-align: center; width: 100%; grid-column: 1 / -1; padding: 40px;">
                        <p style="color: #ccc;">No videos available yet. Admin needs to upload some!</p>
                    </div>`;
                return;
            }

            // Render videos
            grid.innerHTML = videos.map(video => `
                <div class="portfolio-item glass-panel">
                    <div class="video-container">
                        <video class="portfolio-video" controls preload="metadata" playsinline ${video.poster_url ? `poster="${video.poster_url}"` : ''}>
                            <source src="${video.video_url}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div class="portfolio-info">
                        <h3>${video.title}</h3>
                        ${video.description ? `<p>${video.description}</p>` : ''}
                    </div>
                </div>
            `).join('');

        } catch (err) {
            console.error('Error fetching videos:', err);
            grid.innerHTML = `
                <div style="text-align: center; width: 100%; grid-column: 1 / -1; padding: 40px;">
                    <p style="color: var(--accent-red);">Failed to load portfolio videos. Please try again later.</p>
                </div>`;
        }
    }

    // Initialize fetch
    fetchPortfolioVideos();

});
