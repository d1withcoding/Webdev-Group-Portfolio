// Chief Alltechs Ventures - Main JavaScript

// Initialize on load
initializeMembers();


// ======================
// NAVIGATION
// ======================
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// ======================
// POP-UP MODALS
// ======================
function showPopup(popupId) {
    const modal = document.getElementById(popupId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closePopup(popupId) {
    const modal = document.getElementById(popupId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let i = 0; i < modals.length; i++) {
        if (event.target === modals[i]) {
            modals[i].style.display = 'none';
        }
    }
}

// ======================
// IMAGE SWAP ON HOMEPAGE
// ======================
let currentImageIndex = 0;
const heroImages = [
    'images/hero1.jpg',
    'images/hero2.jpg',
    'images/hero3.jpg',
    'images/hero4.jpg',
    'images/hero5.jpg'
];

function initImageSwap() {
    const swapImg = document.getElementById('swapImg');
    if (swapImg) {
        // Start image swap interval
        setInterval(function() {
            currentImageIndex = (currentImageIndex + 1) % heroImages.length;
            swapImg.src = heroImages[currentImageIndex];
        }, 4000); // Swap every 4 seconds
    }
}

// ======================
// CONTACT FORM VALIDATION
// ======================
function validateContactForm(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    let isValid = true;

    // Clear previous errors
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('subjectError').textContent = '';
    document.getElementById('messageError').textContent = '';

    // Validate full name
    if (fullName.length < 2) {
        document.getElementById('nameError').textContent = 'Name must be at least 2 characters.';
        isValid = false;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    // Validate subject
    if (subject.length < 3) {
        document.getElementById('subjectError').textContent = 'Subject must be at least 3 characters.';
        isValid = false;
    }

    // Validate message
    if (message.length < 10) {
        document.getElementById('messageError').textContent = 'Message must be at least 10 characters.';
        isValid = false;
    }

    if (isValid) {
        document.getElementById('formSuccess').textContent = 'Message sent successfully! We will get back to you soon.';
        document.getElementById('contactForm').reset();
        setTimeout(function() {
            document.getElementById('formSuccess').textContent = '';
        }, 5000);
    }

    return false;
}

// ======================
// AUTHENTICATION
// ======================
function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('loginError').textContent = '';
}

function showLogin() {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerError').textContent = '';
    document.getElementById('registerSuccess').textContent = '';
}

function handleRegister(event) {
    event.preventDefault();

    const fullName = document.getElementById('regFullName').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    const errorDiv = document.getElementById('registerError');
    const successDiv = document.getElementById('registerSuccess');

    errorDiv.textContent = '';
    successDiv.textContent = '';

    // Validation
    if (fullName.length < 2) {
        errorDiv.textContent = 'Full name must be at least 2 characters.';
        return false;
    }

    if (username.length < 3) {
        errorDiv.textContent = 'Username must be at least 3 characters.';
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        errorDiv.textContent = 'Please enter a valid email address.';
        return false;
    }

    if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters.';
        return false;
    }

    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match.';
        return false;
    }

    // Check if username already exists
    const users = JSON.parse(localStorage.getItem('cav_users') || '[]');
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        errorDiv.textContent = 'Username already exists. Please choose another.';
        return false;
    }

    // Save user
    const newUser = {
        id: Date.now(),
        fullName: fullName,
        username: username,
        email: email,
        password: password // In production, hash this
    };

    users.push(newUser);
    localStorage.setItem('cav_users', JSON.stringify(users));

    successDiv.textContent = 'Registration successful! Please login.';
    document.getElementById('registerForm').querySelector('form').reset();

    setTimeout(function() {
        showLogin();
    }, 2000);

    return false;
}

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    errorDiv.textContent = '';

    const users = JSON.parse(localStorage.getItem('cav_users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Create session
        const session = {
            username: user.username,
            fullName: user.fullName,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('cav_session', JSON.stringify(session));
        window.location.href = 'dashboard.html';
    } else {
        errorDiv.textContent = 'Invalid username or password.';
    }

    return false;
}

function checkAuth() {
    const session = localStorage.getItem('cav_session');
    if (!session) {
        window.location.href = 'login.html';
    }
}

function logout() {
    localStorage.removeItem('cav_session');
    window.location.href = 'login.html';
}

// ======================
// PRODUCT CRUD OPERATIONS
// ======================
function getProducts() {
    return JSON.parse(localStorage.getItem('cav_products') || '[]');
}

function saveProducts(products) {
    localStorage.setItem('cav_products', JSON.stringify(products));
}

function generateProductId() {
    return 'PRD-' + Date.now();
}

function saveProduct(event) {
    event.preventDefault();

    const productId = document.getElementById('productId').value;
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const brand = document.getElementById('productBrand').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const quantity = parseInt(document.getElementById('productQuantity').value);
    const description = document.getElementById('productDescription').value.trim();

    let products = getProducts();

    if (productId) {
        // Update existing
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products[index] = {
                id: productId,
                name: name,
                category: category,
                brand: brand,
                price: price,
                quantity: quantity,
                description: description
            };
        }
    } else {
        // Add new
        const newProduct = {
            id: generateProductId(),
            name: name,
            category: category,
            brand: brand,
            price: price,
            quantity: quantity,
            description: description
        };
        products.push(newProduct);
    }

    saveProducts(products);
    resetForm();
    displayProducts(products);

    return false;
}

function retrieveAllRecords() {
    const products = getProducts();
    displayProducts(products);
}

function displayProducts(products) {
    const tbody = document.getElementById('productsTableBody');
    const noRecords = document.getElementById('noRecords');

    if (!tbody) return;

    tbody.innerHTML = '';

    if (products.length === 0) {
        if (noRecords) noRecords.style.display = 'block';
        return;
    }

    if (noRecords) noRecords.style.display = 'none';

    products.forEach(function(product) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.brand || '-'}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>
                <button class="btn btn-edit" onclick="editProduct('${product.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editProduct(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);

    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productBrand').value = product.brand;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productQuantity').value = product.quantity;
        document.getElementById('productDescription').value = product.description;

        document.getElementById('formTitle').textContent = 'Update Product';
        document.getElementById('saveBtn').textContent = 'Update Record';
        document.getElementById('cancelBtn').style.display = 'inline-block';
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        saveProducts(products);
        displayProducts(products);
    }
}

function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('formTitle').textContent = 'Add New Product';
    document.getElementById('saveBtn').textContent = 'Add Record';
    document.getElementById('cancelBtn').style.display = 'none';
}

function searchRecords() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const products = getProducts();
    const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm));
    displayProducts(filtered);
}

// ======================
// INITIALIZATION
// ======================
document.addEventListener('DOMContentLoaded', function() {
    initImageSwap();
});

// ======================
// MEMBER PROFILE SYSTEM
// ======================

const DEFAULT_MEMBERS = [
    {
        id: "001",
        username: "ebenezer",
        fullName: "Ebenezer Nana Annan",
        role: "Network Administrator",
        email: "ebenezer.annan@chiefalltechs.com",
        phone: "+233 XX XXX XXXX",
        bio: "Experienced network administrator with expertise in designing and maintaining enterprise network infrastructures.",
        skills: "Cisco Routing, Network Security, VPN Configuration, Firewall Management",
        linkedIn: "",
        github: "",
        picture: "images/member1.jpg"
    },
    {
        id: "002",
        username: "okyere",
        fullName: "Okyere-Darko Addai",
        role: "System Administrator",
        email: "okyere.addai@chiefalltechs.com",
        phone: "+233 XX XXX XXXX",
        bio: "Skilled system administrator specializing in Windows and Linux server environments, virtualization, and cloud services.",
        skills: "Linux Administration, Windows Server, VMware, AWS, Azure",
        linkedIn: "",
        github: "",
        picture: "images/member2.jpg"
    },
    {
        id: "003",
        username: "frank",
        fullName: "Frank Akrasi Antwi",
        role: "Cyber Security Specialist",
        email: "frank.antwi@chiefalltechs.com",
        phone: "+233 XX XXX XXXX",
        bio: "Cyber security professional dedicated to protecting organizations from digital threats through proactive security measures.",
        skills: "Penetration Testing, Ethical Hacking, SIEM, Incident Response, Risk Assessment",
        linkedIn: "",
        github: "",
        picture: "images/member3.jpg"
    },
    {
        id: "004",
        username: "michael",
        fullName: "Michael Essel",
        role: "IT Consultant",
        email: "michael.essel@chiefalltechs.com",
        phone: "+233 XX XXX XXXX",
        bio: "Strategic IT consultant helping businesses leverage technology for growth, efficiency, and competitive advantage.",
        skills: "IT Strategy, Digital Transformation, Project Management, Business Analysis",
        linkedIn: "",
        github: "",
        picture: "images/member4.jpg"
    }
];

function initMembers() {
    if (!localStorage.getItem('cav_members')) {
        localStorage.setItem('cav_members', JSON.stringify(DEFAULT_MEMBERS));
    }
}

function getAllMembers() {
    initMembers();
    return JSON.parse(localStorage.getItem('cav_members'));
}

function storeMembers(members) {
    localStorage.setItem('cav_members', JSON.stringify(members));
}

function getLoggedInUser() {
    return JSON.parse(localStorage.getItem('cav_session') || '{}');
}

function findMemberByUsername(username) {
    var members = getAllMembers();
    for (var i = 0; i < members.length; i++) {
        if (members[i].username === username) {
            return { member: members[i], index: i };
        }
    }
    return null;
}

function createNewMember(username) {
    var members = getAllMembers();
    var users = JSON.parse(localStorage.getItem('cav_users') || '[]');
    var user = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            user = users[i];
            break;
        }
    }

    var newId = String(members.length + 1).padStart(3, '0');
    var newMember = {
        id: newId,
        username: username,
        fullName: user ? user.fullName : username,
        role: 'Team Member',
        email: user ? user.email : '',
        phone: '',
        bio: '',
        skills: '',
        linkedIn: '',
        github: '',
        picture: 'images/member1.jpg'
    };

    members.push(newMember);
    storeMembers(members);
    return newMember;
}

function loadMemberProfile() {
    var session = getLoggedInUser();
    if (!session.username) {
        alert('Please login first.');
        window.location.href = 'login.html';
        return;
    }

    var result = findMemberByUsername(session.username);
    var member;
    if (!result) {
        member = createNewMember(session.username);
    } else {
        member = result.member;
    }

    var fn = document.getElementById('profileFullName');
    var idf = document.getElementById('profileID');
    var rl = document.getElementById('profileRole');
    var em = document.getElementById('profileEmail');
    var ph = document.getElementById('profilePhone');
    var bi = document.getElementById('profileBio');
    var sk = document.getElementById('profileSkills');
    var li = document.getElementById('profileLinkedIn');
    var gh = document.getElementById('profileGithub');

    if (fn) fn.value = member.fullName || '';
    if (idf) idf.value = member.id || '';
    if (rl) rl.value = member.role || '';
    if (em) em.value = member.email || '';
    if (ph) ph.value = member.phone || '';
    if (bi) bi.value = member.bio || '';
    if (sk) sk.value = member.skills || '';
    if (li) li.value = member.linkedIn || '';
    if (gh) gh.value = member.github || '';

    var pic = document.getElementById('profilePicture');
    if (pic && member.picture) pic.src = member.picture;

    updatePreview(member);
}

function updatePreview(member) {
    var pic = document.getElementById('previewPicture');
    var name = document.getElementById('previewName');
    var role = document.getElementById('previewRole');
    var idEl = document.getElementById('previewID');
    var bio = document.getElementById('previewBio');
    var skills = document.getElementById('previewSkills');
    var li = document.getElementById('previewLinkedIn');
    var gh = document.getElementById('previewGithub');

    if (pic && member.picture) pic.src = member.picture;
    if (name) name.textContent = member.fullName || 'Member Name';
    if (role) role.textContent = member.role || 'Role';
    if (idEl) idEl.textContent = 'ID: ' + (member.id || '---');
    if (bio) bio.textContent = member.bio || 'Bio will appear here...';

    if (skills) {
        skills.innerHTML = '';
        if (member.skills) {
            var skillList = member.skills.split(',');
            for (var i = 0; i < skillList.length; i++) {
                var s = skillList[i].trim();
                if (s) {
                    var span = document.createElement('span');
                    span.className = 'skill-tag';
                    span.textContent = s;
                    skills.appendChild(span);
                }
            }
        }
    }

    if (li) {
        if (member.linkedIn) {
            li.href = member.linkedIn;
            li.style.display = 'inline-block';
        } else {
            li.style.display = 'none';
        }
    }

    if (gh) {
        if (member.github) {
            gh.href = member.github;
            gh.style.display = 'inline-block';
        } else {
            gh.style.display = 'none';
        }
    }
}

function saveProfile(event) {
    event.preventDefault();
    console.log("SAVE CLICKED");

    var session = getLoggedInUser();
    if (!session.username) {
        showMsg('You must be logged in.', 'error');
        return false;
    }

    var members = getAllMembers();
    var memberIndex = -1;
    for (var i = 0; i < members.length; i++) {
        if (members[i].username === session.username) {
            memberIndex = i;
            break;
        }
    }

    if (memberIndex === -1) {
        createNewMember(session.username);
        members = getAllMembers();
        for (var j = 0; j < members.length; j++) {
            if (members[j].username === session.username) {
                memberIndex = j;
                break;
            }
        }
    }

    var fn = document.getElementById('profileFullName');
    var idf = document.getElementById('profileID');
    var rl = document.getElementById('profileRole');
    var em = document.getElementById('profileEmail');
    var ph = document.getElementById('profilePhone');
    var bi = document.getElementById('profileBio');
    var sk = document.getElementById('profileSkills');
    var li = document.getElementById('profileLinkedIn');
    var gh = document.getElementById('profileGithub');

    if (fn) members[memberIndex].fullName = fn.value.trim();
    if (idf) members[memberIndex].id = idf.value.trim();
    if (rl) members[memberIndex].role = rl.value.trim();
    if (em) members[memberIndex].email = em.value.trim();
    if (ph) members[memberIndex].phone = ph.value.trim();
    if (bi) members[memberIndex].bio = bi.value.trim();
    if (sk) members[memberIndex].skills = sk.value.trim();
    if (li) members[memberIndex].linkedIn = li.value.trim();
    if (gh) members[memberIndex].github = gh.value.trim();

    storeMembers(members);
    console.log("SAVED:", members[memberIndex]);

    updatePreview(members[memberIndex]);

    session.fullName = members[memberIndex].fullName;
    localStorage.setItem('cav_session', JSON.stringify(session));

    showMsg('Profile saved successfully.', 'success');
    return false;
}

function resetProfileForm() {
    loadMemberProfile();
    showMsg('Form reset.', 'success');
}

function showMsg(message, type) {
    var successDiv = document.getElementById('profileSuccess');
    var errorDiv = document.getElementById('profileError');

    if (successDiv) successDiv.textContent = '';
    if (errorDiv) errorDiv.textContent = '';

    if (type === 'success' && successDiv) {
        successDiv.textContent = message;
        setTimeout(function() { successDiv.textContent = ''; }, 5000);
    } else if (type === 'error' && errorDiv) {
        errorDiv.textContent = message;
        setTimeout(function() { errorDiv.textContent = ''; }, 5000);
    }
}

function uploadProfilePicture(event) {
    var file = event.target.files[0];
    if (!file) return;

    var validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (validTypes.indexOf(file.type) === -1) {
        alert('Please select JPG, PNG, or GIF.');
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        alert('File must be under 2MB.');
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        var imageData = e.target.result;

        var profilePic = document.getElementById('profilePicture');
        var previewPic = document.getElementById('previewPicture');
        if (profilePic) profilePic.src = imageData;
        if (previewPic) previewPic.src = imageData;

        var session = getLoggedInUser();
        if (!session.username) {
            showMsg('Login required.', 'error');
            return;
        }

        var members = getAllMembers();
        var memberIndex = -1;
        for (var i = 0; i < members.length; i++) {
            if (members[i].username === session.username) {
                memberIndex = i;
                break;
            }
        }

        if (memberIndex === -1) {
            createNewMember(session.username);
            members = getAllMembers();
            for (var j = 0; j < members.length; j++) {
                if (members[j].username === session.username) {
                    memberIndex = j;
                    break;
                }
            }
        }

        members[memberIndex].picture = imageData;
        storeMembers(members);

        updatePreview(members[memberIndex]);
        showMsg('Picture updated.', 'success');
    };
    reader.readAsDataURL(file);
}

function syncHomepageMembers() {
    var members = getAllMembers();
    for (var i = 0; i < members.length; i++) {
        var member = members[i];
        var card = document.querySelector('[data-member-id="' + member.id + '"]');
        if (card) {
            var img = card.querySelector('img');
            var nameEl = card.querySelector('h3');
            var ps = card.querySelectorAll('p');
            var roleEl = ps[ps.length - 1];

            if (img && member.picture) img.src = member.picture;
            if (nameEl && member.fullName) nameEl.textContent = member.fullName;
            if (roleEl && member.role) roleEl.textContent = member.role;
        }
    }
}

function updateHomepageMembers() {
    syncHomepageMembers();
}

function updateHomepageMemberPicture(memberId, imageData) {
    var pics = JSON.parse(localStorage.getItem('cav_member_pictures') || '{}');
    pics[memberId] = imageData;
    localStorage.setItem('cav_member_pictures', JSON.stringify(pics));
}

// ======================
// ADMIN / CONTACT INFO
// ======================

var DEFAULT_CONTACT = {
    companyName: "Chief Alltechs Ventures",
    email: "info@chiefalltechs.com",
    phone: "+233 XX XXX XXXX",
    address: "Ghana",
    hours: "Monday - Friday, 8:00 AM - 5:00 PM",
    description: "Chief Alltechs Ventures is a leading IT firm dedicated to providing comprehensive technology solutions for businesses of all sizes."
};

function getContactInfo() {
    var stored = localStorage.getItem('cav_contact_info');
    if (stored) return JSON.parse(stored);
    return DEFAULT_CONTACT;
}

function saveContactInfoToStorage(info) {
    localStorage.setItem('cav_contact_info', JSON.stringify(info));
}

function loadContactInfo() {
    var info = getContactInfo();
    var cn = document.getElementById('adminCompanyName');
    var em = document.getElementById('adminEmail');
    var ph = document.getElementById('adminPhone');
    var ad = document.getElementById('adminAddress');
    var hr = document.getElementById('adminHours');
    var dc = document.getElementById('adminDescription');

    if (cn) cn.value = info.companyName || '';
    if (em) em.value = info.email || '';
    if (ph) ph.value = info.phone || '';
    if (ad) ad.value = info.address || '';
    if (hr) hr.value = info.hours || '';
    if (dc) dc.value = info.description || '';

    updateContactPreview(info);
}

function updateContactPreview(info) {
    var pcn = document.getElementById('previewCompanyName');
    var pem = document.getElementById('previewEmail');
    var pph = document.getElementById('previewPhone');
    var pad = document.getElementById('previewAddress');
    var phr = document.getElementById('previewHours');

    if (pcn) pcn.textContent = info.companyName || '-';
    if (pem) pem.textContent = info.email || '-';
    if (pph) pph.textContent = info.phone || '-';
    if (pad) pad.textContent = info.address || '-';
    if (phr) phr.textContent = info.hours || '-';
}

function saveContactInfo(event) {
    if (event) event.preventDefault();

    var cn = document.getElementById('adminCompanyName');
    var em = document.getElementById('adminEmail');
    var ph = document.getElementById('adminPhone');
    var ad = document.getElementById('adminAddress');
    var hr = document.getElementById('adminHours');
    var dc = document.getElementById('adminDescription');

    var info = {
        companyName: cn ? cn.value.trim() : DEFAULT_CONTACT.companyName,
        email: em ? em.value.trim() : DEFAULT_CONTACT.email,
        phone: ph ? ph.value.trim() : DEFAULT_CONTACT.phone,
        address: ad ? ad.value.trim() : DEFAULT_CONTACT.address,
        hours: hr ? hr.value.trim() : DEFAULT_CONTACT.hours,
        description: dc ? dc.value.trim() : DEFAULT_CONTACT.description
    };

    saveContactInfoToStorage(info);
    updateContactPreview(info);

    var sDiv = document.getElementById('contactInfoSuccess');
    var eDiv = document.getElementById('contactInfoError');
    if (sDiv) sDiv.textContent = 'Contact information saved.';
    if (eDiv) eDiv.textContent = '';
    setTimeout(function() { if (sDiv) sDiv.textContent = ''; }, 5000);

    return false;
}

function resetContactInfo() {
    saveContactInfoToStorage(DEFAULT_CONTACT);
    loadContactInfo();
    var sDiv = document.getElementById('contactInfoSuccess');
    if (sDiv) sDiv.textContent = 'Reset to default.';
    setTimeout(function() { if (sDiv) sDiv.textContent = ''; }, 5000);
}

function loadContactInfoToPage() {
    var info = getContactInfo();
    var cn = document.getElementById('contactCompanyName');
    var em = document.getElementById('contactEmail');
    var ph = document.getElementById('contactPhone');
    var ad = document.getElementById('contactAddress');
    var hr = document.getElementById('contactHours');

    if (cn) cn.textContent = info.companyName;
    if (em) em.textContent = info.email;
    if (ph) ph.textContent = info.phone;
    if (ad) ad.textContent = info.address;
    if (hr) hr.textContent = info.hours;
}

function loadAboutInfo() {
}

function loadAllMembers() {
    var members = getAllMembers();
    var tbody = document.getElementById('membersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    for (var i = 0; i < members.length; i++) {
        var m = members[i];
        var row = document.createElement('tr');
        row.innerHTML = '<td>' + (m.id || '-') + '</td>' +
            '<td>' + (m.username || '-') + '</td>' +
            '<td>' + (m.fullName || '-') + '</td>' +
            '<td>' + (m.role || '-') + '</td>' +
            '<td>' + (m.email || '-') + '</td>' +
            '<td>' + (m.phone || '-') + '</td>';
        tbody.appendChild(row);
    }
}

function loadAllUsers() {
    var users = JSON.parse(localStorage.getItem('cav_users') || '[]');
    var tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    for (var i = 0; i < users.length; i++) {
        var u = users[i];
        var row = document.createElement('tr');
        row.innerHTML = '<td>' + (u.id || '-') + '</td>' +
            '<td>' + (u.fullName || '-') + '</td>' +
            '<td>' + (u.username || '-') + '</td>' +
            '<td>' + (u.email || '-') + '</td>';
        tbody.appendChild(row);
    }
}
