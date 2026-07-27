// Chief Alltechs Ventures - JavaScript Engine

document.addEventListener('DOMContentLoaded', () => {
    initHeroSlideshow();
    initMarquee();
    initModals();
    syncHomepageMembers();
    
    // Auth checks on specific pages
    if (window.location.pathname.includes('database.html')) {
        checkAuth();
        renderTable();
    }

    // Contact page: render past submissions
    if (window.location.pathname.includes('contact.html')) {
        renderSubmissions();
    }
});

// ==========================================
// 1. Hero Slideshow (Crossfade)
// ==========================================
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    let current = 0;
    
    setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 4000); // 4 seconds per slide
}

// ==========================================
// 2. Marquee Scrolling Text
// ==========================================
function initMarquee() {
    const content = document.getElementById('marqueeContent');
    if (!content) return;
    
    // Clone content for seamless looping
    const clone = content.cloneNode(true);
    clone.id = 'marqueeClone';
    content.parentElement.appendChild(clone);
    
    let position = 0;
    const speed = 1; // Pixels per frame
    
    function animate() {
        position -= speed;
        if (position <= -content.offsetWidth) {
            position = 0;
        }
        
        content.style.transform = `translateX(${position}px)`;
        clone.style.transform = `translateX(${position}px)`;
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ==========================================
// 3. Dialog Modals
// ==========================================
function initModals() {
    // Close modal when clicking outside the card
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
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
    }
}

// ==========================================
// 4. Data Initialization for 4 Team Members
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
        if (cards[i] && window.location.pathname.includes('index.html') || window.location.pathname === '/') {
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
// 5. Authentication (Database Page)
// ==========================================
function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    
    if (user === 'admin' && pass === 'admin123') {
        localStorage.setItem('cav_auth', 'true');
        checkAuth();
    } else {
        alert('Invalid credentials. Hint: admin / admin123');
    }
}

function handleLogout() {
    localStorage.removeItem('cav_auth');
    checkAuth();
}

function checkAuth() {
    const isAuth = localStorage.getItem('cav_auth');
    const authSection = document.getElementById('authSection');
    const dashboardSection = document.getElementById('dashboardSection');
    
    if (authSection && dashboardSection) {
        if (isAuth) {
            authSection.style.display = 'none';
            dashboardSection.style.display = 'flex'; // Use flex for the dashboard layout
            renderTable();
        } else {
            authSection.style.display = 'flex';
            dashboardSection.style.display = 'none';
        }
    }
}

// ==========================================
// 6. Database CRUD Operations
// ==========================================
function getRecords() {
    return JSON.parse(localStorage.getItem('cav_records') || '[]');
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
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No records found.</td></tr>';
        return;
    }
    
    records.forEach(r => {
        tbody.innerHTML += `
            <tr>
                <td>${r.id}</td>
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

function addRecord() {
    const name = document.getElementById('empName').value;
    const role = document.getElementById('empRole').value;
    const dept = document.getElementById('empDepartment').value;
    
    if (!name || !role || !dept) {
        alert("Please fill all fields.");
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
    renderTable();
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
    const name = document.getElementById('empName').value;
    const role = document.getElementById('empRole').value;
    const dept = document.getElementById('empDepartment').value;
    
    let records = getRecords();
    const idx = records.findIndex(x => x.id === id);
    
    if (idx > -1) {
        records[idx] = { id, name, role, dept };
        saveRecords(records);
        resetForm();
        renderTable();
    }
}

function deleteRecord(id) {
    if (confirm("Are you sure you want to delete this record?")) {
        let records = getRecords();
        records = records.filter(x => x.id !== id);
        saveRecords(records);
        renderTable();
    }
}

function resetForm() {
    document.getElementById('recordId').value = '';
    document.getElementById('empName').value = '';
    document.getElementById('empRole').value = '';
    document.getElementById('empDepartment').value = 'IT';
    
    document.getElementById('btnAdd').style.display = 'inline-block';
    document.getElementById('btnUpdate').style.display = 'none';
}

// ==========================================
// 7. Contact Form (Validation + Storage + Success)
// ==========================================
function handleContactSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const message = document.getElementById('contactMessage');

    const nameErr = document.getElementById('nameError');
    const emailErr = document.getElementById('emailError');
    const msgErr = document.getElementById('messageError');

    // Clear previous errors
    [nameErr, emailErr, msgErr].forEach(el => el.textContent = '');
    [name, email, message].forEach(el => el.classList.remove('input-error'));

    let isValid = true;

    // Name validation
    if (name.value.trim().length < 2) {
        nameErr.textContent = 'Name must be at least 2 characters.';
        name.classList.add('input-error');
        isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        emailErr.textContent = 'Please enter a valid email address.';
        email.classList.add('input-error');
        isValid = false;
    }

    // Message validation
    if (message.value.trim().length < 10) {
        msgErr.textContent = 'Message must be at least 10 characters.';
        message.classList.add('input-error');
        isValid = false;
    }

    if (!isValid) return false;

    // Store in localStorage
    const submissions = JSON.parse(localStorage.getItem('cav_contact') || '[]');
    submissions.unshift({
        id: 'INQ-' + Date.now().toString().slice(-6),
        name: name.value.trim(),
        email: email.value.trim(),
        message: message.value.trim(),
        date: new Date().toLocaleString()
    });
    localStorage.setItem('cav_contact', JSON.stringify(submissions));

    // Show success banner
    const successBanner = document.getElementById('contactSuccess');
    successBanner.style.display = 'flex';

    // Reset form
    document.getElementById('contactForm').reset();

    // Hide success after 5 seconds
    setTimeout(() => {
        successBanner.style.display = 'none';
    }, 5000);

    // Re-render submissions list
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
                    <span class="body-strong">${s.name}</span>
                    <span class="caption">${s.date}</span>
                </div>
                <p class="caption" style="margin-bottom: 4px;">${s.email}</p>
                <p style="font-size: 14px;">${s.message}</p>
            </div>
        `;
    });
}
