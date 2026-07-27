// ==========================================================================
// Chief Alltechs Ventures - Luxury Scrollytelling Engine & Core Logic
// with Light-Dark Mode Theme Support & Performance Optimizations
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme from localStorage or system preference
    initTheme();
    
    // Initialize mobile navigation
    initMobileNavigation();
    
    // Initialize scrollytelling with performance optimizations
    initCanvasScrollytelling();
    
    // Initialize pillar switcher
    initPillarSwitcher();
    
    // Initialize marquee
    initMarquee();
    
    // Initialize modals
    initModals();
    
    // Sync homepage members
    syncHomepageMembers();
    
    // Auth checks on database portal
    if (window.location.pathname.includes('database.html')) {
        checkAuth();
        renderTable();
    }

    // Contact page render past submissions
    if (window.location.pathname.includes('contact.html')) {
        renderSubmissions();
    }
    
    // Check for canvas support and add fallback class
    if (!document.createElement('canvas').getContext) {
        document.body.classList.add('no-canvas');
    }
});

// ==========================================
// THEME MANAGEMENT (Light/Dark Mode)
// ==========================================

function initTheme() {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('cav_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // Default to dark for this luxury aesthetic
    if (!savedTheme) {
        theme = 'dark';
    }
    
    setTheme(theme, false);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('cav_theme')) {
            setTheme(e.matches ? 'dark' : 'light', false);
        }
    });
}

function setTheme(mode, save = true) {
    const html = document.documentElement;
    
    // Update data-theme attribute
    html.setAttribute('data-theme', mode);
    
    // Update button active states
    const lightBtn = document.getElementById('themeLight');
    const darkBtn = document.getElementById('themeDark');
    
    if (lightBtn && darkBtn) {
        if (mode === 'light') {
            lightBtn.classList.add('active');
            darkBtn.classList.remove('active');
        } else {
            lightBtn.classList.remove('active');
            darkBtn.classList.add('active');
        }
    }
    
    // Update theme-accent based on mode
    const root = document.documentElement;
    if (mode === 'light') {
        // Use gold as primary accent for light mode
        root.style.setProperty('--theme-accent', '#D8B36A');
        root.style.setProperty('--theme-accent-rgb', '216, 179, 106');
    } else {
        // Keep existing pillar-based accent system for dark mode
        const currentPillar = root.style.getPropertyValue('--theme-accent') || '#D8B36A';
        root.style.setProperty('--theme-accent', currentPillar);
    }
    
    // Save preference
    if (save) {
        localStorage.setItem('cav_theme', mode);
    }
}

// ==========================================
// MOBILE NAVIGATION
// ==========================================

function initMobileNavigation() {
    const hamburgers = document.querySelectorAll('.hamburger');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    
    hamburgers.forEach(hamburger => {
        hamburger.addEventListener('click', () => {
            toggleMobileNav();
        });
    });
    
    // Close when clicking on links
    if (mobileOverlay) {
        const links = mobileOverlay.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileNav();
            });
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileOverlay.contains(e.target) && 
                !Array.from(hamburgers).some(h => h.contains(e.target))) {
                closeMobileNav();
            }
        });
    }
}

function toggleMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    
    if (hamburger && mobileOverlay) {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    }
}

function openMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    
    if (hamburger && mobileOverlay) {
        hamburger.classList.add('active');
        mobileOverlay.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileNav() {
    const hamburgers = document.querySelectorAll('.hamburger');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    
    hamburgers.forEach(hamburger => {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
    
    if (mobileOverlay) {
        mobileOverlay.classList.remove('active');
    }
    
    document.body.style.overflow = '';
}

// ==========================================
// 1. Pillar Data & State Machine
// ==========================================
const PILLARS = {
    network: {
        id: "network",
        name: "Network Architecture",
        tagline: "Regal. Rare. Unbreakable.",
        color: "#D8B36A",
        colorRgb: "216, 179, 106",
        gradient: "linear-gradient(135deg, #0B0B0F 0%, #1a160d 50%, #0B0B0F 100%)",
        stage1Title: "Architecting the digital future.",
        stage1Sub: "Chief Alltechs Ventures delivers high-end network architecture, unbreachable cybersecurity, and expert systems administration.",
        stage2Title: "Unbreakable topology by design.",
        stage2Sub: "High-availability routing, BGP/OSPF core optimization, and zero-latency interconnects built for global scale.",
        stage3Title: "A signature that lingers in uptime.",
        stage3Sub: "99.999% availability crafted with high-jewelry precision and enterprise rigor.",
        stage4Title: "Unrivaled Digital Presence.",
        stage4Sub: "You just enter the market—and the standard is set."
    },
    security: {
        id: "security",
        name: "Cyber Security",
        tagline: "Zero-Trust. High-Shield. Unbreachable.",
        color: "#3FE3D1",
        colorRgb: "63, 227, 209",
        gradient: "linear-gradient(135deg, #041012 0%, #08262a 50%, #0B0B0F 100%)",
        stage1Title: "Zero-Trust Defense Systems.",
        stage1Sub: "Quantum-grade encryption, continuous threat intelligence, and immutable security perimeters.",
        stage2Title: "Shielding enterprise assets.",
        stage2Sub: "Proactive penetration testing, real-time SOC monitoring, and endpoint vulnerability annihilation.",
        stage3Title: "Silent, impenetrable authority.",
        stage3Sub: "Security that operates with surgical precision—eliminating vectors before exploit.",
        stage4Title: "Fortress-Level Confidence.",
        stage4Sub: "Operate in hostile digital environments without compromise."
    },
    systems: {
        id: "systems",
        name: "Systems Administration",
        tagline: "High-Availability. Cloud Velocity. Unrivaled.",
        color: "#2B57FF",
        colorRgb: "43, 87, 255",
        gradient: "linear-gradient(135deg, #050A18 0%, #0d1a45 50%, #0B0B0F 100%)",
        stage1Title: "Orchestrating Cloud Velocity.",
        stage1Sub: "Automated multi-cloud infrastructure, Linux kernel optimization, and resilient enterprise DevOps.",
        stage2Title: "Hyper-scalable server clusters.",
        stage2Sub: "Kubernetes orchestration, automated failovers, and low-overhead server management.",
        stage3Title: "Engineered operational mastery.",
        stage3Sub: "Continuous integration pipelines that turn complex infrastructure into seamless execution.",
        stage4Title: "Peak Infrastructure Performance.",
        stage4Sub: "Powering enterprise workloads at global velocity."
    }
};

let currentPillarKey = "network";

function switchPillar(key) {
    if (!PILLARS[key]) return;
    currentPillarKey = key;
    const data = PILLARS[key];

    // Morph Root CSS Variables
    document.documentElement.style.setProperty('--theme-accent', data.color);
    document.documentElement.style.setProperty('--theme-accent-rgb', data.colorRgb);
    document.documentElement.style.setProperty('--theme-gradient', data.gradient);

    // Update Switcher Pills Active State
    document.querySelectorAll('.pillar-pill').forEach(btn => {
        if (btn.dataset.pillar === key) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update Text Content on Hero Stages
    const s1Title = document.getElementById('stage1Title');
    const s1Sub = document.getElementById('stage1Sub');
    const s2Title = document.getElementById('stage2Title');
    const s2Sub = document.getElementById('stage2Sub');
    const s3Title = document.getElementById('stage3Title');
    const s3Sub = document.getElementById('stage3Sub');
    const s4Title = document.getElementById('stage4Title');
    const s4Sub = document.getElementById('stage4Sub');

    if (s1Title) s1Title.textContent = data.stage1Title;
    if (s1Sub) s1Sub.textContent = data.stage1Sub;
    if (s2Title) s2Title.textContent = data.stage2Title;
    if (s2Sub) s2Sub.textContent = data.stage2Sub;
    if (s3Title) s3Title.textContent = data.stage3Title;
    if (s3Sub) s3Sub.textContent = data.stage3Sub;
    if (s4Title) s4Title.textContent = data.stage4Title;
    if (s4Sub) s4Sub.textContent = data.stage4Sub;
}

function initPillarSwitcher() {
    const pills = document.querySelectorAll('.pillar-pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            switchPillar(pill.dataset.pillar);
        });
    });
}

// ==========================================
// 2. Interactive Canvas 3D Particle Scrollytelling Engine
// with Performance Optimizations & Accessibility
// ==========================================
function initCanvasScrollytelling() {
    const canvas = document.getElementById('scrollyCanvas');
    const wrapper = document.getElementById('scrollyWrapper');
    if (!canvas || !wrapper) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        return;
    }

    // Performance optimization: reduce particle count on mobile
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 50 : 140;
    const connectionSkip = isMobile ? 10 : 6;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Animation state for performance
    let isAnimating = true;
    let lastFrameTime = 0;
    let animationId = null;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Create particles
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: (Math.random() - 0.5) * 2000,
            y: (Math.random() - 0.5) * 2000,
            z: (Math.random() - 0.5) * 2000,
            radius: Math.random() * 2.5 + 1
        });
    }

    let scrollProgress = 0;

    function updateStageClasses() {
        const stages = [
            { id: 'stage1', start: 0.00, end: 0.22 },
            { id: 'stage2', start: 0.25, end: 0.48 },
            { id: 'stage3', start: 0.52, end: 0.75 },
            { id: 'stage4', start: 0.78, end: 1.00 }
        ];

        stages.forEach(st => {
            const el = document.getElementById(st.id);
            if (el) {
                if (scrollProgress >= st.start && scrollProgress <= st.end) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            }
        });
    }

    function render(timestamp) {
        // Throttle frame rate for performance on mobile
        if (isMobile && timestamp - lastFrameTime < 16) {
            animationId = requestAnimationFrame(render);
            return;
        }
        lastFrameTime = timestamp;

        const rect = wrapper.getBoundingClientRect();
        const maxScroll = rect.height - window.innerHeight;
        if (maxScroll > 0) {
            scrollProgress = Math.min(Math.max(-rect.top / maxScroll, 0), 1);
        }

        // Update stage classes
        updateStageClasses();

        // Only render if canvas is visible
        const canvasRect = canvas.getBoundingClientRect();
        if (canvasRect.width === 0 || canvasRect.height === 0) {
            animationId = requestAnimationFrame(render);
            return;
        }

        ctx.clearRect(0, 0, width, height);

        const currentData = PILLARS[currentPillarKey] || PILLARS.network;
        const colorRgb = currentData.colorRgb;

        const rotationAngle = scrollProgress * Math.PI * 4;
        const cosAngle = Math.cos(rotationAngle);
        const sinAngle = Math.sin(rotationAngle);
        const focalLength = 400;

        ctx.lineWidth = 0.5;

        for (let i = 0; i < particleCount; i++) {
            const p = particles[i];

            const rx = p.x * cosAngle - p.z * sinAngle;
            const rz = p.x * sinAngle + p.z * cosAngle + 800 - (scrollProgress * 200);
            const ry = p.y + Math.sin(scrollProgress * Math.PI * 2 + i) * 50;

            if (rz > 0) {
                const scale = focalLength / rz;
                const projX = width / 2 + rx * scale;
                const projY = height / 2 + ry * scale;

                const alpha = Math.min(Math.max((1 - rz / 1600), 0.1), 0.85);

                ctx.beginPath();
                ctx.arc(projX, projY, Math.max(p.radius * scale, 0.8), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${colorRgb}, ${alpha})`;
                ctx.fill();

                for (let j = i + 1; j < particleCount; j += connectionSkip) {
                    const p2 = particles[j];
                    const rx2 = p2.x * cosAngle - p2.z * sinAngle;
                    const rz2 = p2.x * sinAngle + p2.z * cosAngle + 800 - (scrollProgress * 200);
                    const ry2 = p2.y + Math.sin(scrollProgress * Math.PI * 2 + j) * 50;

                    if (rz2 > 0) {
                        const projX2 = width / 2 + rx2 * scale;
                        const projY2 = height / 2 + ry2 * scale;
                        const dist = Math.hypot(projX - projX2, projY - projY2);

                        if (dist < 120) {
                            ctx.beginPath();
                            ctx.moveTo(projX, projY);
                            ctx.lineTo(projX2, projY2);
                            ctx.strokeStyle = `rgba(${colorRgb}, ${0.15 * (1 - dist / 120)})`;
                            ctx.stroke();
                        }
                    }
                }
            }
        }

        animationId = requestAnimationFrame(render);
    }

    // Start animation
    animationId = requestAnimationFrame(render);
    
    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        } else {
            animationId = requestAnimationFrame(render);
        }
    });
}

// ==========================================
// 3. Marquee Scrolling Text (CSS-based)
// ==========================================
function initMarquee() {
    // Marquee is handled by CSS animation
    // This function is kept for backwards compatibility
    const content = document.getElementById('marqueeContent');
    if (!content) return;
    
    // Clone content for seamless CSS animation
    const clone = content.cloneNode(true);
    clone.id = 'marqueeClone';
    content.parentElement.appendChild(clone);
}

// ==========================================
// 4. Modals Engine
// ==========================================
function initModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

function showModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

// ==========================================
// 5. Team Members Initialization & Homepage Sync
// ==========================================
const DEFAULT_MEMBERS = [
    { id: "MS/ITE/25/0041", name: "Ebenezer Nana Annan", role: "Network Administrator", photo: "images/member1.jpg" },
    { id: "MS/ITE/25/0044", name: "Okyere-Darko Addai", role: "System Administrator", photo: "images/member2.jpg" },
    { id: "MS/ITE/25/0051", name: "Frank Akrasi Antwi", role: "Cyber Security Specialist", photo: "images/member3.jpg" },
    { id: "MS/ITE/25/0053", name: "Michael Essel", role: "IT Consultant", photo: "images/member4.jpg" }
];

function initMembers() {
    if (!localStorage.getItem('cav_members')) {
        localStorage.setItem('cav_members', JSON.stringify(DEFAULT_MEMBERS));
    }
}

function syncHomepageMembers() {
    initMembers();
    const members = JSON.parse(localStorage.getItem('cav_members'));

    members.forEach((m, i) => {
        const cards = document.querySelectorAll('.store-utility-card');
        if (cards[i] && (window.location.pathname.includes('index.html') || window.location.pathname === '/')) {
            const img = cards[i].querySelector('img');
            const name = cards[i].querySelector('h3');
            const p = cards[i].querySelector('p.caption');

            if (img) img.src = m.photo;
            if (name) name.textContent = m.name;
            if (p) p.innerHTML = `ID: ${m.id}<br>${m.role}`;
        }
    });
}

// ==========================================
// 6. Authentication & Registration (Database Portal)
// ==========================================
function switchAuthTab(tab) {
    const loginCard = document.getElementById('loginCard');
    const registerCard = document.getElementById('registerCard');
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabRegisterBtn = document.getElementById('tabRegisterBtn');

    if (!loginCard || !registerCard) return;

    if (tab === 'login') {
        loginCard.style.display = 'block';
        registerCard.style.display = 'none';
        tabLoginBtn.style.background = 'rgba(255,255,255,0.15)';
        tabLoginBtn.style.color = 'white';
        tabRegisterBtn.style.background = 'transparent';
        tabRegisterBtn.style.color = 'rgba(255,255,255,0.7)';
    } else {
        loginCard.style.display = 'none';
        registerCard.style.display = 'block';
        tabRegisterBtn.style.background = 'rgba(255,255,255,0.15)';
        tabRegisterBtn.style.color = 'white';
        tabLoginBtn.style.background = 'transparent';
        tabLoginBtn.style.color = 'rgba(255,255,255,0.7)';
    }
}

function handleLogin(event) {
    if (event) event.preventDefault();

    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    const errorEl = document.getElementById('loginError');
    if (errorEl) errorEl.textContent = '';

    const users = JSON.parse(localStorage.getItem('cav_users') || '[]');
    const registeredUser = users.find(u => u.username === user && u.password === pass);

    if ((user === 'admin' && pass === 'admin123') || registeredUser) {
        const currentUser = registeredUser ? registeredUser.fullName : 'Administrator';
        localStorage.setItem('cav_auth', 'true');
        localStorage.setItem('cav_current_user', currentUser);
        checkAuth();
    } else {
        if (errorEl) errorEl.textContent = 'Invalid credentials. Hint: admin / admin123';
        else alert('Invalid credentials. Hint: admin / admin123');
    }
    return false;
}

function handleRegister(event) {
    if (event) event.preventDefault();

    const fullName = document.getElementById('regFullName').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    const errorEl = document.getElementById('regError');

    if (errorEl) errorEl.textContent = '';

    if (password !== confirm) {
        if (errorEl) errorEl.textContent = 'Passkeys do not match.';
        return false;
    }

    const users = JSON.parse(localStorage.getItem('cav_users') || '[]');
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        if (errorEl) errorEl.textContent = 'System ID / Username is already registered.';
        return false;
    }

    users.push({ fullName, username, password });
    localStorage.setItem('cav_users', JSON.stringify(users));

    alert('Registration successful! You may now log in.');
    switchAuthTab('login');
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
    return false;
}

function handleLogout() {
    localStorage.removeItem('cav_auth');
    localStorage.removeItem('cav_current_user');
    checkAuth();
}

function checkAuth() {
    const isAuth = localStorage.getItem('cav_auth');
    const authSection = document.getElementById('authSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const logoutBtn = document.getElementById('logoutBtn');
    const userWelcome = document.getElementById('userWelcome');

    if (authSection && dashboardSection) {
        if (isAuth) {
            authSection.style.display = 'none';
            dashboardSection.style.display = 'flex';
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
            if (userWelcome) {
                const currentUser = localStorage.getItem('cav_current_user') || 'Administrator';
                userWelcome.textContent = `Authenticated Session: ${currentUser}`;
            }
            renderTable();
        } else {
            authSection.style.display = 'flex';
            dashboardSection.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }
}

// ==========================================
// 7. Database CRUD Operations & Retrieve Records
// ==========================================
const DEFAULT_RECORDS = [
    { id: "EMP-0041", name: "Ebenezer Nana Annan", role: "Network Administrator", dept: "Network Ops" },
    { id: "EMP-0044", name: "Okyere-Darko Addai", role: "System Administrator", dept: "IT Infrastructure" },
    { id: "EMP-0051", name: "Frank Akrasi Antwi", role: "Cyber Security Specialist", dept: "Cyber Security" },
    { id: "EMP-0053", name: "Michael Essel", role: "IT Consultant", dept: "Administration" }
];

function getRecords() {
    let raw = localStorage.getItem('cav_records');
    if (!raw) {
        localStorage.setItem('cav_records', JSON.stringify(DEFAULT_RECORDS));
        return DEFAULT_RECORDS;
    }
    return JSON.parse(raw);
}

function saveRecords(records) {
    localStorage.setItem('cav_records', JSON.stringify(records));
}

function renderTable() {
    const tbody = document.getElementById('dataTableBody');
    if (!tbody) return;

    const records = getRecords();
    tbody.innerHTML = '';

    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No records found in database.</td></tr>';
        return;
    }

    records.forEach(r => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${r.id}</strong></td>
                <td>${r.name}</td>
                <td>${r.role}</td>
                <td>${r.dept}</td>
                <td>
                    <button class="button-utility" onclick="editRecord('${r.id}')">Edit</button>
                    <button class="button-utility" style="background: #ff3b30;" onclick="deleteRecord('${r.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

function retrieveRecords() {
    renderTable();
    const records = getRecords();
    const statusBanner = document.getElementById('retrieveStatus');
    const statusText = document.getElementById('retrieveStatusText');

    if (statusBanner && statusText) {
        statusText.textContent = `Successfully retrieved ${records.length} record(s) from database.`;
        statusBanner.style.display = 'flex';
        setTimeout(() => {
            statusBanner.style.display = 'none';
        }, 4000);
    } else {
        alert(`Retrieved ${records.length} record(s) from database.`);
    }
}

function addRecord() {
    const name = document.getElementById('empName').value.trim();
    const role = document.getElementById('empRole').value.trim();
    const dept = document.getElementById('empDepartment').value;

    if (!name || !role) {
        alert("Please fill in Name and Role fields.");
        return;
    }

    const records = getRecords();
    records.push({
        id: 'EMP-' + Date.now().toString().slice(-4),
        name: name,
        role: role,
        dept: dept
    });

    saveRecords(records);
    resetForm();
    retrieveRecords();
}

function editRecord(id) {
    const records = getRecords();
    const r = records.find(x => x.id === id);
    if (!r) return;

    document.getElementById('recordId').value = r.id;
    document.getElementById('empName').value = r.name;
    document.getElementById('empRole').value = r.role;
    document.getElementById('empDepartment').value = r.dept;

    document.getElementById('btnAdd').style.display = 'none';
    document.getElementById('btnUpdate').style.display = 'inline-block';
}

function updateRecord() {
    const id = document.getElementById('recordId').value;
    const name = document.getElementById('empName').value.trim();
    const role = document.getElementById('empRole').value.trim();
    const dept = document.getElementById('empDepartment').value;

    let records = getRecords();
    const idx = records.findIndex(x => x.id === id);

    if (idx > -1) {
        records[idx] = { id, name, role, dept };
        saveRecords(records);
        resetForm();
        retrieveRecords();
    }
}

function deleteRecord(id) {
    if (confirm("Are you sure you want to delete this record?")) {
        let records = getRecords();
        records = records.filter(x => x.id !== id);
        saveRecords(records);
        retrieveRecords();
    }
}

function resetForm() {
    document.getElementById('recordId').value = '';
    document.getElementById('empName').value = '';
    document.getElementById('empRole').value = '';
    document.getElementById('empDepartment').value = 'IT Infrastructure';

    document.getElementById('btnAdd').style.display = 'inline-block';
    document.getElementById('btnUpdate').style.display = 'none';
}

// ==========================================
// 8. Contact Form Logic (Validation + localStorage)
// ==========================================
function handleContactSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const message = document.getElementById('contactMessage');

    const nameErr = document.getElementById('nameError');
    const emailErr = document.getElementById('emailError');
    const msgErr = document.getElementById('messageError');

    [nameErr, emailErr, msgErr].forEach(el => el.textContent = '');
    [name, email, message].forEach(el => el.classList.remove('input-error'));

    let isValid = true;

    if (name.value.trim().length < 2) {
        nameErr.textContent = 'Name must be at least 2 characters.';
        name.classList.add('input-error');
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        emailErr.textContent = 'Please enter a valid email address.';
        email.classList.add('input-error');
        isValid = false;
    }

    if (message.value.trim().length < 10) {
        msgErr.textContent = 'Message must be at least 10 characters.';
        message.classList.add('input-error');
        isValid = false;
    }

    if (!isValid) return false;

    const submissions = JSON.parse(localStorage.getItem('cav_contact') || '[]');
    submissions.unshift({
        id: 'INQ-' + Date.now().toString().slice(-6),
        name: name.value.trim(),
        email: email.value.trim(),
        message: message.value.trim(),
        date: new Date().toLocaleString()
    });
    localStorage.setItem('cav_contact', JSON.stringify(submissions));

    const successBanner = document.getElementById('contactSuccess');
    if (successBanner) {
        successBanner.style.display = 'flex';
        setTimeout(() => { successBanner.style.display = 'none'; }, 5000);
    }

    document.getElementById('contactForm').reset();
    renderSubmissions();
    return false;
}

function renderSubmissions() {
    const section = document.getElementById('submissionsSection');
    const list = document.getElementById('submissionsList');
    if (!section || !list) return;

    const submissions = JSON.parse(localStorage.getItem('cav_contact') || '[]');
    if (submissions.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    list.innerHTML = '';
    submissions.forEach(s => {
        list.innerHTML += `
            <div class="submission-card">
                <div class="submission-meta">
                    <span class="body-strong" style="color: var(--ink-dark);">${s.name}</span>
                    <span class="caption">${s.date}</span>
                </div>
                <p class="caption" style="margin-bottom: 4px;">${s.email}</p>
                <p style="font-size: 14px; color: var(--ink-dark);">${s.message}</p>
            </div>
        `;
    });
}
