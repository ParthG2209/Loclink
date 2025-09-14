// API Configuration
const API_BASE_URL = 'https://loclink-git-main-parth-guptas-projects-502efc4b.vercel.app/api';

// Sample services data
const servicesData = [
    {
        id: 1,
        title: "Plumbing Services",
        description: "Expert plumbing solutions for homes and offices",
        price: "₹500/hr",
        rating: "4.8",
        available: true
    },
    {
        id: 2,
        title: "Electrical Repairs", 
        description: "Certified electricians for all your wiring needs",
        price: "₹600/hr",
        rating: "4.9",
        available: true
    },
    {
        id: 3,
        title: "Home Cleaning",
        description: "Professional cleaning services for your home", 
        price: "₹300/hr",
        rating: "4.7",
        available: false
    },
    {
        id: 4,
        title: "Tutoring",
        description: "Personalized tutoring for all subjects and levels",
        price: "₹400/hr", 
        rating: "4.9",
        available: true
    },
    {
        id: 5,
        title: "Moving Help",
        description: "Reliable assistance for your moving needs",
        price: "₹250/hr",
        rating: "4.6",
        available: true
    },
    {
        id: 6,
        title: "Gardening",
        description: "Landscaping and garden maintenance services",
        price: "₹350/hr",
        rating: "4.5",
        available: false
    }
];

// Global variables to track current user
let currentUser = null;

// Render services function
function renderServices(services) {
    const containers = [
        document.getElementById('servicesGrid'),
        document.querySelector('.services-grid'),
        document.querySelector('.service-cards'),
        document.querySelector('.popular-services'),
        document.querySelector('#services .container > div'),
        document.querySelector('.services .container > div')
    ];
    
    const servicesGrid = containers.find(el => el !== null);
    
    if (!servicesGrid) {
        console.log('Services container not found');
        return;
    }
    
    let html = '';
    services.forEach(service => {
        html += `
            <div class="service-card">
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <div class="service-meta">
                    <span class="price">${service.price}</span>
                    <span class="rating">⭐ ${service.rating}</span>
                    <span class="availability ${service.available ? 'available' : 'unavailable'}">
                        ${service.available ? 'Available' : 'Unavailable'}
                    </span>
                </div>
                <button class="service-btn ${service.available ? '' : 'disabled'}" 
                        data-service-id="${service.id}"
                        ${!service.available ? 'disabled' : ''}>
                    ${service.available ? 'Contact Provider' : 'Not Available'}
                </button>
            </div>
        `;
    });
    
    servicesGrid.innerHTML = html;
    
    // Add event listeners to contact buttons (no inline handlers)
    servicesGrid.querySelectorAll('.service-btn:not(.disabled)').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const serviceId = e.target.dataset.serviceId;
            contactProvider(serviceId);
        });
    });
    
    console.log('Services rendered successfully');
}

// Contact provider function
function contactProvider(serviceId) {
    if (!currentUser) {
        alert('Please login first to contact providers!');
        return;
    }
    alert(`Contacting provider for service ${serviceId}. Direct messaging feature coming soon!`);
}

// Dashboard function
function showUserDashboard() {
    if (!currentUser) {
        alert('Please login first!');
        return;
    }
    
    const dashboardContent = currentUser.role === 'provider' ? 
        `Provider Dashboard - ${currentUser.name}
        
You can:
- View your service bookings
- Manage your services  
- Update your profile
- Track your earnings
- Add new services

This feature is coming soon!` :
        `Customer Dashboard - ${currentUser.name}
        
You can:
- View your bookings
- Track service requests
- Rate completed services
- Update your profile
- Manage payments

This feature is coming soon!`;
    
    alert(dashboardContent);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        currentUser = null;
        alert('Logged out successfully!');
        location.reload();
    }
}

// Show Add Service Modal - FIXED (No inline handlers)
function showAddServiceModal() {
    if (!currentUser || currentUser.role !== 'provider') {
        alert('Only service providers can add services!');
        return;
    }
    
    const modalHTML = `
        <div class="modal" id="addServiceModal" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;">
            <div class="modal-content" style="background: white; margin: auto; padding: 25px; border-radius: 8px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333;">Add New Service</h2>
                    <span id="closeAddServiceBtn" style="font-size: 28px; font-weight: bold; cursor: pointer; color: #999; padding: 5px;">&times;</span>
                </div>
                
                <form id="addServiceForm" style="display: flex; flex-direction: column; gap: 15px;">
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">Service Title *</label>
                        <input type="text" id="serviceTitle" placeholder="e.g., Professional Home Plumbing" required 
                               style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">Description *</label>
                        <textarea id="serviceDescription" placeholder="Describe your service in detail..." required 
                                  style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; height: 100px; resize: vertical; font-size: 14px; font-family: inherit; box-sizing: border-box;"></textarea>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">Category *</label>
                        <select id="serviceCategory" required 
                                style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                            <option value="">Select Category</option>
                            <option value="plumbing">Plumbing</option>
                            <option value="electrical">Electrical</option>
                            <option value="cleaning">Cleaning</option>
                            <option value="tutoring">Tutoring</option>
                            <option value="moving">Moving & Transportation</option>
                            <option value="gardening">Gardening & Landscaping</option>
                            <option value="painting">Painting & Decoration</option>
                            <option value="carpentry">Carpentry & Furniture</option>
                            <option value="beauty">Beauty & Personal Care</option>
                            <option value="fitness">Fitness & Training</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <div style="flex: 1;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">Price *</label>
                            <input type="number" id="servicePrice" placeholder="Amount" min="1" required 
                                   style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                        </div>
                        <div style="flex: 1;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">Per</label>
                            <select id="priceType" required 
                                    style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                                <option value="hourly">Per Hour</option>
                                <option value="fixed">Fixed Price</option>
                                <option value="daily">Per Day</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">Tags (Optional)</label>
                        <input type="text" id="serviceTags" placeholder="e.g., emergency, 24/7, certified, experienced"
                               style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                        <small style="color: #666; font-size: 12px;">Separate tags with commas</small>
                    </div>
                    
                    <button type="submit" id="addServiceSubmitBtn"
                            style="width: 100%; padding: 15px; background: #4CAF50; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 10px;">
                        Add Service
                    </button>
                </form>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('addServiceModal');
    if (existingModal) existingModal.remove();
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners (no inline handlers)
    document.getElementById('closeAddServiceBtn').addEventListener('click', closeAddServiceModal);
    document.getElementById('addServiceForm').addEventListener('submit', handleAddServiceSubmit);
    
    // Close modal when clicking outside
    document.getElementById('addServiceModal').addEventListener('click', (e) => {
        if (e.target.id === 'addServiceModal') {
            closeAddServiceModal();
        }
    });
}

// Handle form submission - ENHANCED DEBUGGING VERSION
async function handleAddServiceSubmit(e) {
    e.preventDefault();
    
    console.log('=== FORM SUBMITTED ===');
    
    // Get form values
    const title = document.getElementById('serviceTitle').value.trim();
    const description = document.getElementById('serviceDescription').value.trim();
    const category = document.getElementById('serviceCategory').value;
    const price = document.getElementById('servicePrice').value;
    const type = document.getElementById('priceType').value;
    const tagsInput = document.getElementById('serviceTags').value.trim();
    
    console.log('Form values:', { title, description, category, price, type, tagsInput });
    
    // Validate required fields
    if (!title || !description || !category || !price) {
        alert('Please fill in all required fields!');
        return;
    }
    
    if (parseFloat(price) <= 0) {
        alert('Please enter a valid price!');
        return;
    }
    
    // Prepare service data
    const serviceData = {
        title: title,
        description: description,
        category: category,
        price: {
            amount: parseFloat(price),
            type: type
        },
        tags: tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : []
    };
    
    console.log('=== SENDING TO API ===');
    console.log('Service ', serviceData);
    
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('Please login first!');
            return;
        }
        
        console.log('Token exists:', !!token);
        console.log('API URL:', `${API_BASE_URL}/services`);
        
        const response = await fetch(`${API_BASE_URL}/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(serviceData)
        });
        
        console.log('=== API RESPONSE ===');
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        const data = await response.json();
        console.log('Response ', data);
        
        if (response.ok && data.success) {
            console.log('=== SUCCESS! ===');
            alert('🎉 Service added successfully!');
            
            // Create new service for immediate display
            const newService = {
                id: data.data?._id || Date.now(),
                title: serviceData.title,
                description: serviceData.description,
                price: `₹${serviceData.price.amount}/${serviceData.price.type}`,
                rating: "New",
                available: true
            };
            
            console.log('=== ADDING TO LOCAL ARRAY ===');
            console.log('New service:', newService);
            console.log('Services before:', servicesData.length);
            
            // Add to beginning of array
            servicesData.unshift(newService);
            
            console.log('Services after:', servicesData.length);
            console.log('First service:', servicesData[0]);
            
            // Close modal
            closeAddServiceModal();
            
            // Re-render services
            console.log('=== RE-RENDERING SERVICES ===');
            renderServices(servicesData);
            
            console.log('=== COMPLETE ===');
            
        } else {
            console.log('=== API ERROR ===');
            const errorMessage = data.error || data.message || 'Failed to add service';
            alert('❌ Error: ' + errorMessage);
            console.error('API Error:', data);
        }
        
    } catch (error) {
        console.log('=== NETWORK ERROR ===');
        console.error('Network Error:', error);
        alert('❌ Network error: ' + error.message);
    }
}

// Test function to manually add a service
function testAddService() {
    console.log('=== MANUAL TEST ===');
    
    const testService = {
        id: Date.now(),
        title: "Test Service - " + new Date().toLocaleTimeString(),
        description: "This is a test service added manually",
        price: "₹100/hr",
        rating: "New",
        available: true
    };
    
    console.log('Adding test service:', testService);
    console.log('Services before:', servicesData.length);
    
    servicesData.unshift(testService);
    
    console.log('Services after:', servicesData.length);
    
    renderServices(servicesData);
    
    alert('Test service added! Check if it appears on the page.');
}

// Close Add Service Modal
function closeAddServiceModal() {
    const modal = document.getElementById('addServiceModal');
    if (modal) modal.remove();
}

// Update UI after login
function updateUIAfterLogin(userData) {
    currentUser = userData;
    
    // Hide login/register buttons
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    
    // Add user menu to navigation
    const nav = document.querySelector('nav') || document.querySelector('.navbar');
    if (nav) {
        // Remove existing user menu
        const existingMenu = nav.querySelector('.user-menu');
        if (existingMenu) existingMenu.remove();
        
        // Create user menu
        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-left: auto;';
        
        const welcomeText = document.createElement('span');
        welcomeText.textContent = `Welcome, ${userData.name}!`;
        welcomeText.style.cssText = 'color: #333; font-weight: bold; margin-right: 10px;';
        
        const dashboardBtn = document.createElement('button');
        dashboardBtn.textContent = 'Dashboard';
        dashboardBtn.style.cssText = 'padding: 8px 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;';
        dashboardBtn.addEventListener('click', showUserDashboard);
        
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.style.cssText = 'padding: 8px 15px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;';
        logoutBtn.addEventListener('click', logout);
        
        userMenu.appendChild(welcomeText);
        userMenu.appendChild(dashboardBtn);
        
        // Add "Add Service" button for providers
        if (userData.role === 'provider') {
            const addServiceBtn = document.createElement('button');
            addServiceBtn.textContent = 'Add Service';
            addServiceBtn.style.cssText = 'padding: 8px 15px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;';
            addServiceBtn.addEventListener('click', showAddServiceModal);
            userMenu.appendChild(addServiceBtn);
        }
        
        userMenu.appendChild(logoutBtn);
        nav.appendChild(userMenu);
    }
    
    console.log('UI updated for user:', userData.name, 'Role:', userData.role);
}

// Check if user is already logged in
function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
        try {
            const userData = JSON.parse(userStr);
            updateUIAfterLogin(userData);
            return userData;
        } catch (error) {
            console.error('Error parsing user ', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function() {
    // Check login status first
    checkLoginStatus();
    
    // Always show services
    renderServices(servicesData);
    
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'flex';
        });
    }
    
    // Register button  
    const registerBtn = document.getElementById('registerBtn');
    const registerModal = document.getElementById('registerModal');
    if (registerBtn && registerModal) {
        registerBtn.addEventListener('click', () => {
            registerModal.style.display = 'flex';
        });
    }
    
    // Close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });
    
    // Setup forms
    setTimeout(() => {
        setupRegistrationForm();
        setupLoginForm();
    }, 1000);
});

// Setup registration form
function setupRegistrationForm() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const newForm = registerForm.cloneNode(true);
        registerForm.parentNode.replaceChild(newForm, registerForm);
        
        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const inputs = Array.from(newForm.querySelectorAll('input, select'));
            let name = '', email = '', password = '', phone = '', role = 'customer';
            
            inputs.forEach((input, index) => {
                const value = input.value.trim();
                if (!value) return;
                
                const placeholder = (input.placeholder || '').toLowerCase();
                const type = input.type;
                
                if (input.tagName.toLowerCase() === 'select') {
                    if (value.toLowerCase().includes('find')) {
                        role = 'customer';
                    } else if (value.toLowerCase().includes('offer')) {
                        role = 'provider';
                    } else {
                        role = value;
                    }
                } else if (type === 'email') {
                    email = value;
                } else if (type === 'password') {
                    password = value;
                } else if (type === 'tel' || placeholder.includes('phone')) {
                    phone = value;
                } else if (placeholder.includes('name')) {
                    name = value;
                } else if (index === 0 && !name) {
                    name = value;
                }
            });
            
            if (!name || !email || !password || !phone) {
                alert('Please fill in all fields');
                return;
            }
            
            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, phone, role })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user || data.data));
                    alert('Registration successful! 🎉');
                    document.getElementById('registerModal').style.display = 'none';
                    updateUIAfterLogin(data.user || data.data);
                } else {
                    alert('Registration failed: ' + (data.error || data.message));
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Registration failed. Please try again.');
            }
        });
    }
}

// Setup login form
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const newForm = loginForm.cloneNode(true);
        loginForm.parentNode.replaceChild(newForm, loginForm);
        
        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const inputs = Array.from(newForm.querySelectorAll('input'));
            let email = '', password = '';
            
            inputs.forEach((input, index) => {
                const value = input.value.trim();
                if (!value) return;
                
                const type = input.type;
                const placeholder = (input.placeholder || '').toLowerCase();
                
                if (type === 'email' || placeholder.includes('email')) {
                    email = value;
                } else if (type === 'password' || placeholder.includes('password')) {
                    password = value;
                } else if (index === 0 && !email) {
                    email = value;
                } else if (index === 1 && !password) {
                    password = value;
                }
            });
            
            if (!email || !password) {
                alert('Please fill in both email and password');
                return;
            }
            
            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user || data.data));
                    alert('Login successful! 🎉');
                    document.getElementById('loginModal').style.display = 'none';
                    updateUIAfterLogin(data.user || data.data);
                } else {
                    alert('Login failed: ' + (data.error || data.message));
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed. Please try again.');
            }
        });
    }
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Make functions globally available (for console debugging only)
window.showUserDashboard = showUserDashboard;
window.logout = logout;
window.contactProvider = contactProvider;
window.showAddServiceModal = showAddServiceModal;
window.closeAddServiceModal = closeAddServiceModal;
window.testAddService = testAddService;

