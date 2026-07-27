document.addEventListener('DOMContentLoaded', () => {
    const DOM = {
        html: document.documentElement,
        themeLight: document.getElementById('themeLight'),
        themeDark: document.getElementById('themeDark'),
        hamburgers: document.querySelectorAll('.hamburger'),
        mobileOverlay: document.getElementById('mobile-nav-overlay') || document.getElementById('mobileNavOverlay'),
        wrapper: document.getElementById('scrollyWrapper'),
        canvas: document.getElementById('scrollyCanvas'),
        pillarPills: document.querySelectorAll('.pillar-pill'),
        marqueeContent: document.getElementById('marqueeContent'),
        modals: document.querySelectorAll('.modal-overlay'),
        memberCards: document.querySelectorAll('.store-utility-card, .member-portfolio-card'),
        authSection: document.getElementById('authSection'),
        dashboardSection: document.getElementById('dashboardSection'),
        logoutBtn: document.getElementById('logoutBtn'),
        userWelcome: document.getElementById('userWelcome'),
        loginCard: document.getElementById('loginCard'),
        registerCard: document.getElementById('registerCard'),
        tabLoginBtn: document.getElementById('tabLoginBtn'),
        tabRegisterBtn: document.getElementById('tabRegisterBtn'),
        dataTableBody: document.getElementById('dataTableBody'),
        recordId: document.getElementById('recordId'),
        empName: document.getElementById('empName'),
        empRole: document.getElementById('empRole'),
        empDepartment: document.getElementById('empDepartment'),
        btnAdd: document.getElementById('btnAdd'),
        btnUpdate: document.getElementById('btnUpdate'),
        retrieveStatus: document.getElementById('retrieveStatus'),
        retrieveStatusText: document.getElementById('retrieveStatusText'),
        contactForm: document.getElementById('contactForm'),
        contactName: document.getElementById('contactName'),
        contactEmail: document.getElementById('contactEmail'),
        contactMessage: document.getElementById('contactMessage'),
        nameError: document.getElementById('nameError'),
        emailError: document.getElementById('emailError'),
        messageError: document.getElementById('messageError'),
        contactSuccess: document.getElementById('contactSuccess'),
        submissionsSection: document.getElementById('submissionsSection'),
        submissionsList: document.getElementById('submissionsList')
    };
    
    initTheme();
    initMobileNavigation(DOM);
    initCanvasScrollytelling(DOM);
    initPillarSwitcher();
    initMarqueeJS(DOM);
    initModals(DOM);
    syncHomepageMembers(DOM);
    initImageSwap();
    
    if (window.location.pathname.includes('database.html')) {
        checkAuth(DOM);
        renderTable(DOM);
    }
    
    if (window.location.pathname.includes('contact.html')) {
        renderSubmissions(DOM);
    }
    
    if (!document.createElement('canvas').getContext) {
        document.body.classList.add('no-canvas');
    }
});

function initTheme() {
    const savedTheme = localStorage.getItem('cav_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(theme, false);
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('cav_theme')) {
            setTheme(e.matches ? 'dark' : 'light', false);
        }
    });
}

function setTheme(mode, save = true) {
    const html = document.documentElement;
    html.setAttribute('data-theme', mode);
    
    const lightBtns = document.querySelectorAll('#themeLight, .theme-light-btn');
    const darkBtns = document.querySelectorAll('#themeDark, .theme-dark-btn');
    
    lightBtns.forEach(btn => {
        if (mode === 'light') btn.classList.add('active');
        else btn.classList.remove('active');
    });
    
    darkBtns.forEach(btn => {
        if (mode === 'dark') btn.classList.add('active');
        else btn.classList.remove('active');
    });

    if (save) {
        localStorage.setItem('cav_theme', mode);
    }
}

function initMobileNavigation(DOM) {
    const hamburgers = DOM && DOM.hamburgers && DOM.hamburgers.length ? DOM.hamburgers : document.querySelectorAll('.hamburger');
    const mobileOverlay = (DOM && DOM.mobileOverlay) ? DOM.mobileOverlay : (document.getElementById('mobile-nav-overlay') || document.getElementById('mobileNavOverlay'));
    
    if (!hamburgers.length || !mobileOverlay) return;
    
    hamburgers.forEach(hamburger => {
        hamburger.addEventListener('click', () => toggleMobileNav());
    });
    
    const links = mobileOverlay.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => closeMobileNav());
    });
    
    document.addEventListener('click', (e) => {
        if (mobileOverlay && !mobileOverlay.contains(e.target) && 
            !Array.from(hamburgers).some(h => h.contains(e.target))) {
            closeMobileNav();
        }
    });
}

function toggleMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileOverlay = document.getElementById('mobile-nav-overlay') || document.getElementById('mobileNavOverlay');
    if (hamburger && mobileOverlay) {
        const isExpanded = hamburger.classList.contains('active');
        isExpanded ? closeMobileNav() : openMobileNav();
    }
}

function openMobileNav() {
    const hamburgers = document.querySelectorAll('.hamburger');
    const mobileOverlay = document.getElementById('mobile-nav-overlay') || document.getElementById('mobileNavOverlay');
    hamburgers.forEach(h => {
        h.classList.add('active');
        h.setAttribute('aria-expanded', 'true');
    });
    if (mobileOverlay) {
        mobileOverlay.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
    const hamburgers = document.querySelectorAll('.hamburger');
    const mobileOverlay = document.getElementById('mobile-nav-overlay') || document.getElementById('mobileNavOverlay');
    hamburgers.forEach(h => {
        h.classList.remove('active');
        h.setAttribute('aria-expanded', 'false');
    });
    if (mobileOverlay) {
        mobileOverlay.classList.remove('active');
    }
    document.body.style.overflow = '';
}

const PILLARS = {
    network: {
        id: "network",
        name: "Network Architecture",
        tagline: "Regal. Rare. Unbreakable.",
        color: "#143A72",
        colorRgb: "20, 58, 114",
        gradient: "linear-gradient(135deg, #F7F9FC 0%, #EEF3F9 50%, #F7F9FC 100%)",
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
        color: "#143A72",
        colorRgb: "20, 58, 114",
        gradient: "linear-gradient(135deg, #F7F9FC 0%, #EEF3F9 50%, #F7F9FC 100%)",
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
        color: "#143A72",
        colorRgb: "20, 58, 114",
        gradient: "linear-gradient(135deg, #F7F9FC 0%, #EEF3F9 50%, #F7F9FC 100%)",
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

    document.documentElement.style.setProperty('--theme-accent', data.color);
    document.documentElement.style.setProperty('--theme-accent-rgb', data.colorRgb);

    document.querySelectorAll('.pillar-pill').forEach(btn => {
        if (btn.dataset.pillar === key) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

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

function initCanvasScrollytelling(DOM) {
    const canvas = DOM.canvas || document.getElementById('scrollyCanvas');
    const wrapper = DOM.wrapper || document.getElementById('scrollyWrapper');
    if (!canvas || !wrapper) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 50 : 140;
    const connectionSkip = isMobile ? 10 : 6;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let lastFrameTime = 0;
    let animationId = null;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

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

        updateStageClasses();

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

    animationId = requestAnimationFrame(render);
    
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

/* =========================================
   JavaScript-Driven Scrolling Marquee
   Uses requestAnimationFrame for smooth scroll
   ========================================= */
function initMarqueeJS(DOM) {
    const marqueeContent = DOM.marqueeContent || document.getElementById('marqueeContent');
    if (!marqueeContent) return;
    
    // Clone items to create seamless loop
    if (marqueeContent.children.length === 6) {
        const items = Array.from(marqueeContent.children);
        items.forEach(item => {
            const clone = item.cloneNode(true);
            marqueeContent.appendChild(clone);
        });
    }

    // Switch from CSS animation to JS-driven scroll
    marqueeContent.classList.add('js-driven');

    let scrollPosition = 0;
    let isPaused = false;
    const scrollSpeed = 0.8; // pixels per frame
    let marqueeAnimId = null;

    // Get the width of the original items (first half)
    function getHalfWidth() {
        const items = marqueeContent.children;
        let totalWidth = 0;
        for (let i = 0; i < items.length / 2; i++) {
            totalWidth += items[i].offsetWidth;
        }
        // Add gaps (48px gap between items)
        totalWidth += (items.length / 2) * 48;
        return totalWidth;
    }

    function animateMarquee() {
        if (!isPaused) {
            scrollPosition += scrollSpeed;
            const halfWidth = getHalfWidth();
            if (scrollPosition >= halfWidth) {
                scrollPosition = 0;
            }
            marqueeContent.style.transform = `translateX(-${scrollPosition}px)`;
        }
        marqueeAnimId = requestAnimationFrame(animateMarquee);
    }

    // Pause on hover
    marqueeContent.parentElement.addEventListener('mouseenter', () => {
        isPaused = true;
    });

    marqueeContent.parentElement.addEventListener('mouseleave', () => {
        isPaused = false;
    });

    // Start the JS-driven animation
    marqueeAnimId = requestAnimationFrame(animateMarquee);

    // Pause when page is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && marqueeAnimId) {
            cancelAnimationFrame(marqueeAnimId);
            marqueeAnimId = null;
        } else if (!document.hidden && !marqueeAnimId) {
            marqueeAnimId = requestAnimationFrame(animateMarquee);
        }
    });
}

/* =========================================
   Image Swap Carousel (5 images)
   Auto-rotates every 4 seconds with crossfade
   ========================================= */
let currentImageIndex = 0;
let imageSwapInterval = null;

const IMAGE_LABELS = [
    'Network Architecture Infrastructure',
    'Cybersecurity Operations Center',
    'Cloud Systems Dashboard',
    'Server Cluster Management',
    'Enterprise Data Center'
];

function initImageSwap() {
    const viewport = document.getElementById('imageSwapViewport');
    if (!viewport) return;

    const images = viewport.querySelectorAll('img');
    if (images.length === 0) return;

    // Set first image as active
    currentImageIndex = 0;
    updateImageDisplay();

    // Auto-rotate every 4 seconds
    startAutoRotation();

    // Pause auto-rotation on hover
    viewport.addEventListener('mouseenter', () => {
        if (imageSwapInterval) {
            clearInterval(imageSwapInterval);
            imageSwapInterval = null;
        }
    });

    viewport.addEventListener('mouseleave', () => {
        startAutoRotation();
    });
}

function startAutoRotation() {
    if (imageSwapInterval) clearInterval(imageSwapInterval);
    imageSwapInterval = setInterval(() => {
        swapImage(1);
    }, 4000);
}

function swapImage(direction) {
    const viewport = document.getElementById('imageSwapViewport');
    if (!viewport) return;

    const images = viewport.querySelectorAll('img');
    const totalImages = images.length;

    currentImageIndex = (currentImageIndex + direction + totalImages) % totalImages;
    updateImageDisplay();

    // Reset auto-rotation timer
    startAutoRotation();
}

function goToImage(index) {
    currentImageIndex = index;
    updateImageDisplay();
    startAutoRotation();
}

function updateImageDisplay() {
    const viewport = document.getElementById('imageSwapViewport');
    if (!viewport) return;

    const images = viewport.querySelectorAll('img');
    const dots = document.querySelectorAll('.swap-dot');
    const label = document.getElementById('imageSwapLabel');

    // Update images (crossfade)
    images.forEach((img, i) => {
        if (i === currentImageIndex) {
            img.classList.add('active');
        } else {
            img.classList.remove('active');
        }
    });

    // Update dots
    dots.forEach((dot, i) => {
        if (i === currentImageIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Update label
    if (label && IMAGE_LABELS[currentImageIndex]) {
        label.textContent = `Image ${currentImageIndex + 1} of ${images.length} \u2014 ${IMAGE_LABELS[currentImageIndex]}`;
    }
}

function initModals(DOM) {
    const modals = DOM.modals || document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal.id));
        }
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal.id);
                }
            });
        }
    });
}

let confirmCallback = null;

function showAlert(message, title = 'Notice') {
    const modal = document.getElementById('alertModal');
    const msgEl = document.getElementById('alertModalMessage');
    const titleEl = document.getElementById('alertModalTitle');
    if (!modal) { window.alert(message); return; }
    if (msgEl) msgEl.textContent = message;
    if (titleEl) titleEl.textContent = title;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAlert() {
    const modal = document.getElementById('alertModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function showConfirm(message, onConfirm, title = 'Confirm Action') {
    const modal = document.getElementById('confirmModal');
    const msgEl = document.getElementById('confirmModalMessage');
    const titleEl = document.getElementById('confirmModalTitle');
    if (!modal) {
        if (window.confirm(message)) onConfirm();
        return;
    }
    if (msgEl) msgEl.textContent = message;
    if (titleEl) titleEl.textContent = title;
    confirmCallback = onConfirm;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeConfirm(accepted) {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    if (accepted && typeof confirmCallback === 'function') {
        confirmCallback();
    }
    confirmCallback = null;
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

const DEFAULT_MEMBERS = [
    { id: 'CAV-001', studentId: 'MS/ITE/25/0041', name: 'Ebenezer Nana Annan', role: 'Lead Network Infrastructure Architect', department: 'Network Ops', location: 'UCC Campus (Cape Coast)' },
    { id: 'CAV-002', studentId: 'MS/ITE/25/0044', name: 'Okyere-Darko Addai', role: 'Chief Systems & Cloud Architect', department: 'IT Infrastructure', location: 'UCC Campus (Cape Coast)' },
    { id: 'CAV-003', studentId: 'MS/ITE/25/0051', name: 'Frank Akrasi Antwi', role: 'Cyber Security Operations Head', department: 'Cyber Security', location: 'UCC Campus (Cape Coast)' },
    { id: 'CAV-004', studentId: 'MS/ITE/25/0053', name: 'Michael Essel', role: 'Full-Stack & Systems Engineer', department: 'Systems Administration', location: 'UCC Campus (Cape Coast)' }
];

function getRecords() {
    const stored = localStorage.getItem('cav_records');
    if (!stored) {
        localStorage.setItem('cav_records', JSON.stringify(DEFAULT_MEMBERS));
        return DEFAULT_MEMBERS;
    }
    try {
        return JSON.parse(stored);
    } catch (e) {
        return DEFAULT_MEMBERS;
    }
}

function saveRecords(records) {
    localStorage.setItem('cav_records', JSON.stringify(records));
}

function syncHomepageMembers(DOM) {
    const cards = DOM && DOM.memberCards && DOM.memberCards.length ? DOM.memberCards : document.querySelectorAll('.store-utility-card, .member-portfolio-card');
    if (!cards.length) return;
    
    const records = DEFAULT_MEMBERS;
    cards.forEach((card, index) => {
        if (records[index]) {
            const member = records[index];
            const h3 = card.querySelector('h3');
            const caption = card.querySelector('.caption');
            const tagline = card.querySelector('.tagline');
            const badge = card.querySelector('.student-id-badge');
            
            if (h3) h3.textContent = member.name;
            if (caption) caption.textContent = `${member.role} • ${member.location || 'UCC Campus (Cape Coast)'}`;
            if (tagline) tagline.textContent = member.department.toUpperCase();
            if (badge) badge.textContent = member.studentId || `MS/ITE/25/004${member.id}`;
        }
    });
}

function checkAuth(DOM) {
    const loggedInUser = localStorage.getItem('cav_logged_user');
    const authSection = DOM.authSection || document.getElementById('authSection');
    const dashboardSection = DOM.dashboardSection || document.getElementById('dashboardSection');
    const logoutBtn = DOM.logoutBtn || document.getElementById('logoutBtn');
    const userWelcome = DOM.userWelcome || document.getElementById('userWelcome');

    if (loggedInUser && dashboardSection && authSection) {
        authSection.style.display = 'none';
        dashboardSection.style.display = 'flex';
        if (logoutBtn) logoutBtn.style.display = 'inline-flex';
        if (userWelcome) userWelcome.textContent = `Welcome back, ${loggedInUser}`;
    } else if (dashboardSection && authSection) {
        authSection.style.display = 'flex';
        dashboardSection.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

function switchAuthTab(tab) {
    const loginCard = document.getElementById('loginCard');
    const registerCard = document.getElementById('registerCard');
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabRegisterBtn = document.getElementById('tabRegisterBtn');

    if (tab === 'login') {
        if (loginCard) loginCard.style.display = 'flex';
        if (registerCard) registerCard.style.display = 'none';
        if (tabLoginBtn) {
            tabLoginBtn.style.borderColor = 'var(--theme-accent)';
            tabLoginBtn.style.background = 'var(--glass-bg)';
        }
        if (tabRegisterBtn) {
            tabRegisterBtn.style.borderColor = 'var(--glass-border)';
            tabRegisterBtn.style.background = 'transparent';
        }
    } else {
        if (loginCard) loginCard.style.display = 'none';
        if (registerCard) registerCard.style.display = 'flex';
        if (tabRegisterBtn) {
            tabRegisterBtn.style.borderColor = 'var(--theme-accent)';
            tabRegisterBtn.style.background = 'var(--glass-bg)';
        }
        if (tabLoginBtn) {
            tabLoginBtn.style.borderColor = 'var(--glass-border)';
            tabLoginBtn.style.background = 'transparent';
        }
    }
}

function handleLogin(e) {
    if (e) e.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();
    const err = document.getElementById('loginError');

    const users = JSON.parse(localStorage.getItem('cav_users') || '[]');
    const found = users.find(user => user.username === u && user.password === p) || (u === 'admin' && p === 'admin123');

    if (found) {
        localStorage.setItem('cav_logged_user', u);
        if (err) err.textContent = '';
        showAlert('Authentication successful. Redirecting to portal…', 'Welcome');
        setTimeout(() => { window.location.href = 'database.html'; }, 600);
    } else {
        if (err) err.textContent = 'Invalid credentials. Try admin / admin123';
    }
    return false;
}

function handleRegister(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('regFullName').value.trim();
    const u = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const p = document.getElementById('regPassword').value.trim();
    const c = document.getElementById('regConfirm').value.trim();
    const err = document.getElementById('regError');

    if (!name || !u || !email.includes('@')) {
        if (err) err.textContent = 'Enter full name, username, and valid email address.';
        return false;
    }

    if (p !== c) {
        if (err) err.textContent = 'Passwords do not match.';
        return false;
    }

    if (p.length < 6) {
        if (err) err.textContent = 'Password must be at least 6 characters.';
        return false;
    }

    const users = JSON.parse(localStorage.getItem('cav_users') || '[]');
    if (users.some(user => user.username === u)) {
        if (err) err.textContent = 'Username already taken.';
        return false;
    }

    users.push({ name, username: u, email, password: p });
    localStorage.setItem('cav_users', JSON.stringify(users));
    localStorage.setItem('cav_logged_user', u);
    if (err) err.textContent = '';

    showAlert(`Account created successfully for ${name}. Redirecting to portal…`, 'Welcome');
    setTimeout(() => { window.location.href = 'database.html'; }, 600);
    return false;
}

function handleLogout() {
    localStorage.removeItem('cav_logged_user');
    checkAuth({});
}

function retrieveRecords() {
    const status = document.getElementById('retrieveStatus');
    const text = document.getElementById('retrieveStatusText');
    const recordId = (document.getElementById('recordId')?.value || '').trim();
    renderTable({}, recordId);
    if (status && text) {
        text.textContent = recordId ? 'Matching record retrieved.' : 'All employee records retrieved in table.';
        status.style.display = 'flex';
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }
}

function renderTable(DOM, requestedId = '') {
    const tbody = (DOM && DOM.dataTableBody) ? DOM.dataTableBody : document.getElementById('dataTableBody');
    if (!tbody) return;

    const records = getRecords();
    const visibleRecords = requestedId ? records.filter(record => record.id.toLowerCase() === requestedId.toLowerCase()) : records;
    tbody.innerHTML = '';

    if (!visibleRecords.length) {
        tbody.innerHTML = '<tr><td colspan="5">No employee record found. Clear Employee ID, then choose Retrieve Record to view all records.</td></tr>';
        return;
    }

    visibleRecords.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${r.id}</td>
            <td><strong>${r.name}</strong></td>
            <td>${r.role}</td>
            <td><span class="tagline">${r.department}</span></td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="button-utility" onclick="editRecord('${r.id}')">Load</button>
                    <button class="button-utility button-danger" onclick="deleteRecord('${r.id}')">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function addRecord() {
    const id = document.getElementById('recordId').value.trim().toUpperCase();
    const name = document.getElementById('empName').value.trim();
    const role = document.getElementById('empRole').value.trim();
    const dept = document.getElementById('empDepartment').value;

    if (!id || !name || !role) {
        showAlert('Enter Employee ID, name, role, and department before adding.', 'Required Fields');
        return;
    }

    const records = getRecords();
    if (records.some(record => record.id.toLowerCase() === id.toLowerCase())) {
        showAlert('Employee ID already exists. Use Update Record instead.', 'Duplicate ID');
        return;
    }
    records.push({ id, name, role, department: dept });
    saveRecords(records);
    resetForm();
    retrieveRecords();
}

function editRecord(id) {
    const records = getRecords();
    const r = records.find(item => item.id === id);
    if (r) {
        document.getElementById('recordId').value = r.id;
        document.getElementById('empName').value = r.name;
        document.getElementById('empRole').value = r.role;
        document.getElementById('empDepartment').value = r.department;
        document.getElementById('recordId').focus();
    }
}

function updateRecord() {
    const id = document.getElementById('recordId').value;
    const name = document.getElementById('empName').value.trim();
    const role = document.getElementById('empRole').value.trim();
    const dept = document.getElementById('empDepartment').value;

    if (!id || !name || !role) {
        showAlert('Enter Employee ID, name, role, and department before updating.', 'Required Fields');
        return;
    }

    let records = getRecords();
    if (!records.some(record => record.id.toLowerCase() === id.toLowerCase())) {
        showAlert('Employee ID not found. Add it as a new record instead.', 'Record Not Found');
        return;
    }
    records = records.map(r => r.id.toLowerCase() === id.toLowerCase() ? { ...r, name, role, department: dept } : r);
    saveRecords(records);
    resetForm();
    retrieveRecords();
}

function deleteRecord(selectedId = '') {
    const id = selectedId || document.getElementById('recordId').value.trim();
    if (!id) {
        showAlert('Enter or load an Employee ID before deleting.', 'Required Fields');
        return;
    }
    showConfirm('Confirm permanent deletion of this system record?', () => {
        let records = getRecords();
        records = records.filter(r => r.id.toLowerCase() !== id.toLowerCase());
        saveRecords(records);
        resetForm();
        retrieveRecords();
    }, 'Delete Record');
}

function resetForm() {
    document.getElementById('recordId').value = '';
    document.getElementById('empName').value = '';
    document.getElementById('empRole').value = '';
}

function handleContactSubmit(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const message = document.getElementById('contactMessage');
    const success = document.getElementById('contactSuccess');
    
    const nameErr = document.getElementById('nameError');
    const emailErr = document.getElementById('emailError');
    const msgErr = document.getElementById('messageError');

    let valid = true;

    if (!name.value.trim()) {
        if (nameErr) nameErr.textContent = 'Name is required.';
        valid = false;
    } else {
        if (nameErr) nameErr.textContent = '';
    }

    if (!email.value.trim() || !email.value.includes('@')) {
        if (emailErr) emailErr.textContent = 'Valid corporate email required.';
        valid = false;
    } else {
        if (emailErr) emailErr.textContent = '';
    }

    if (!message.value.trim()) {
        if (msgErr) msgErr.textContent = 'Project requirements details required.';
        valid = false;
    } else {
        if (msgErr) msgErr.textContent = '';
    }

    if (!valid) return false;

    const submissions = JSON.parse(localStorage.getItem('cav_submissions') || '[]');
    submissions.unshift({
        id: Date.now(),
        name: name.value.trim(),
        email: email.value.trim(),
        message: message.value.trim(),
        date: new Date().toLocaleDateString()
    });
    localStorage.setItem('cav_submissions', JSON.stringify(submissions));

    if (success) success.style.display = 'flex';
    name.value = '';
    email.value = '';
    message.value = '';

    setTimeout(() => {
        if (success) success.style.display = 'none';
    }, 4000);

    renderSubmissions({});
    openModal('contactConfirmModal');
    return false;
}

function renderSubmissions(DOM) {
    const list = (DOM && DOM.submissionsList) ? DOM.submissionsList : document.getElementById('submissionsList');
    const section = (DOM && DOM.submissionsSection) ? DOM.submissionsSection : document.getElementById('submissionsSection');
    if (!list) return;

    const submissions = JSON.parse(localStorage.getItem('cav_submissions') || '[]');
    if (!submissions.length) {
        if (section) section.style.display = 'none';
        return;
    }

    if (section) section.style.display = 'block';
    list.innerHTML = '';

    submissions.forEach(s => {
        const div = document.createElement('div');
        div.className = 'submission-card';
        div.innerHTML = `
            <div class="submission-meta">
                <span class="body-strong">${s.name} (${s.email})</span>
                <span class="caption">${s.date}</span>
            </div>
            <p>${s.message}</p>
        `;
        list.appendChild(div);
    });
}
