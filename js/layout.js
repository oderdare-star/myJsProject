// ========================================
// 🚀 LAYOUT.JS - Dashboard Logic (Enhanced)
// ========================================

const API_BASE_URL = "https://69ecc98baf4ff533142b610f.mockapi.io/Stagiaire";

// ========== SESSION ==========
const getCurrentUser = () => {
  try {
    const userData = sessionStorage.getItem("user");
    if (!userData) return null;
    return JSON.parse(userData);
  } catch (error) {
    console.error("Error parsing user:", error);
    return null;
  }
};

const requireAuth = () => {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
  }
  return user;
};

const logout = () => {
  sessionStorage.clear();
  window.location.href = "login.html";
};

// ========== UI HELPERS ==========
const showMessage = (id, message, isError = false) => {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = message;
    el.className = `alert alert-${isError ? 'error' : 'success'}`;
    el.style.display = 'block';
    el.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s ease';
      setTimeout(() => el.style.display = 'none', 300);
    }, 3000);
  }
};

const setContent = (html) => {
  const content = document.getElementById("content");
  content.innerHTML = html;
  // Re-trigger animation
  content.style.animation = 'none';
  requestAnimationFrame(() => {
    content.style.animation = 'fadeIn 0.4s ease';
  });
};

// ========== NAVIGATION ==========
const getMenuItems = (user) => {
  const baseItems = {
    admin: [
      { name: " Home", page: "home", icon: "fa-home" },
      { name: " Profile", page: "profile", icon: "fa-user" },
      { name: " Users", page: "users", icon: "fa-users" },
      { name: " Add User", page: "addUser", icon: "fa-user-plus" },
      { name: " Requests", page: "adminRequests", icon: "fa-clipboard-list" }
    ],
    visitor: [
      { name: " Home", page: "home", icon: "fa-home" },
      { name: " Profile", page: "profile", icon: "fa-user" },
      { name: " My Requests", page: "requests", icon: "fa-file-alt" },
      { name: " New Request", page: "addRequest", icon: "fa-plus-circle" }
    ]
  };
  return user.admin ? baseItems.admin : baseItems.visitor;
};

const buildNavigation = (user) => {
  const navBar = document.getElementById("navBar");
  const bottomNav = document.getElementById("mobileBottomNav");
  const menu = getMenuItems(user);
  
  // Desktop navigation
  navBar.innerHTML = menu.map(item => 
    `<button class="nav-btn" data-page="${item.page}">
      <i class="fas ${item.icon}"></i> ${item.name}
    </button>`
  ).join('');
  
  // Mobile bottom navigation (shorter labels)
  bottomNav.innerHTML = menu.map(item => {
    const shortName = item.name.split(' ').slice(1).join(' ') || item.name;
    return `<button class="nav-btn" data-page="${item.page}">
      <i class="fas ${item.icon}"></i>
      <span>${shortName}</span>
    </button>`;
  }).join('');
  
  // Add click listeners to all nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showPage(btn.dataset.page);
      // Close mobile menu if open
      closeMobileMenu();
    });
  });
};

// ========== MOBILE MENU ==========
const toggleMobileMenu = () => {
  const nav = document.getElementById('navBar');
  const overlay = document.getElementById('mobileOverlay');
  nav.classList.toggle('open');
  overlay.classList.toggle('active');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
};

const closeMobileMenu = () => {
  const nav = document.getElementById('navBar');
  const overlay = document.getElementById('mobileOverlay');
  nav.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
};

// ========== PAGE ROUTER ==========
let currentPage = 'home';

const showPage = async (page) => {
  const user = getCurrentUser();
  if (!user) return;

  currentPage = page;

  // Mark active nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });

  // Show loading state
  setContent(`
    <div class="loading-spinner">
      <i class="fas fa-spinner fa-spin"></i> Loading...
    </div>
  `);

  const pages = {
    home: () => renderHome(user),
    profile: () => renderProfile(user),
    users: () => renderUsersList(),
    addUser: () => renderAddUserForm(),
    requests: () => renderMyRequests(user),
    addRequest: () => renderAddRequestForm(user),
    adminRequests: () => renderAllRequests()
  };

  try {
    if (pages[page]) {
      await pages[page]();
    } else {
      setContent('<div class="alert alert-error">Page not found</div>');
    }
  } catch (error) {
    console.error("Error rendering page:", error);
    setContent(`
      <div class="alert alert-error">
        <i class="fas fa-exclamation-circle"></i> Error loading page. Please try again.
      </div>
    `);
  }
};

// ========== PAGE RENDERERS ==========
const renderHome = (user) => {
  setContent(`
    <div style="text-align:center;padding:40px 20px;">
      <div style="font-size:48px;margin-bottom:16px;">🎉</div>
      <h2 style="font-size:28px;font-weight:700;margin:0;">Welcome back, ${user.prenom}!</h2>
      <p style="color:var(--gray);margin-top:8px;font-size:16px;">
        You are logged in as <span class="badge ${user.admin ? 'badge-success' : 'badge-info'}">${user.admin ? 'Administrator' : 'User'}</span>
      </p>
      <div style="margin-top:28px;display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
        <div class="dash-card" style="min-width:140px;flex:1;max-width:200px;">
          <div style="font-size:28px;">👤</div>
          <p style="font-weight:600;margin:8px 0 4px;">${user.nom} ${user.prenom}</p>
          <p style="color:var(--gray);font-size:12px;word-break:break-all;">${user.email}</p>
        </div>
        <div class="dash-card" style="min-width:140px;flex:1;max-width:200px;">
          <div style="font-size:28px;">📊</div>
          <p style="font-weight:600;margin:8px 0 4px;">Status</p>
          <p style="color:var(--gray);font-size:12px;">${user.admin ? 'Full Access' : 'Limited Access'}</p>
        </div>
      </div>
    </div>
  `);
};

const renderProfile = (user) => {
  setContent(`
    <div class="dash-form-container">
      <h2>👤 My Profile</h2>
      <div style="text-align:center;margin-bottom:20px;">
        <img src="${user.photo || 'https://i.pravatar.cc/150'}" 
             style="width:80px;height:80px;border-radius:50%;border:3px solid var(--dash-primary);object-fit:cover;">
      </div>
      <div class="dash-form-group"><label>Full Name</label><p style="padding:10px;background:var(--dash-bg);border-radius:var(--dash-radius-sm);margin:0;">${user.nom} ${user.prenom}</p></div>
      <div class="dash-form-group"><label>Email</label><p style="padding:10px;background:var(--dash-bg);border-radius:var(--dash-radius-sm);margin:0;word-break:break-all;">${user.email}</p></div>
      <div class="dash-form-group"><label>Username</label><p style="padding:10px;background:var(--dash-bg);border-radius:var(--dash-radius-sm);margin:0;">${user.pseudo}</p></div>
      <div class="dash-form-group"><label>Age</label><p style="padding:10px;background:var(--dash-bg);border-radius:var(--dash-radius-sm);margin:0;">${user.age || 'Not specified'}</p></div>
      <div class="dash-form-group"><label>Role</label>
        <p style="padding:10px;background:var(--dash-bg);border-radius:var(--dash-radius-sm);margin:0;">
          <span class="badge ${user.admin ? 'badge-success' : 'badge-info'}">${user.admin ? 'Administrator' : 'User'}</span>
        </p>
      </div>
    </div>
  `);
};

// ========== USERS LIST ==========
const renderUsersList = async () => {
  setContent(`
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
      <h2 style="margin:0;">👥 Users List</h2>
      <button class="dash-btn dash-btn-primary" onclick="showPage('addUser')">
        <i class="fas fa-user-plus"></i> Add User
      </button>
    </div>
    <div class="dash-table-wrapper">
      <table class="dash-table">
        <thead><tr><th>User</th><th>Email</th><th>Role</th><th style="text-align:center;">Actions</th></tr></thead>
        <tbody id="usersBody"></tbody>
      </table>
    </div>
  `);
  await loadUsers();
};

const loadUsers = async () => {
  try {
    const res = await fetch(API_BASE_URL);
    const users = await res.json();
    const tbody = document.getElementById("usersBody");
    
    if (!users.length) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:40px;color:var(--gray);">No users found</td></tr>`;
      return;
    }
    
    tbody.innerHTML = users.map(user => `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${user.photo || 'https://i.pravatar.cc/150'}" 
                 style="width:32px;height:32px;border-radius:50%;object-fit:cover;">
            <span>${user.nom} ${user.prenom}</span>
          </div>
        </td>
        <td style="word-break:break-all;">${user.email}</td>
        <td><span class="badge ${user.admin ? 'badge-success' : 'badge-info'}">${user.admin ? 'Admin' : 'User'}</span></td>
        <td style="text-align:center;white-space:nowrap;">
          <button class="dash-btn dash-btn-primary dash-btn-sm" onclick="window.showDetails('${user.id}')" aria-label="View details">
            <i class="fas fa-eye"></i>
          </button>
          <button class="dash-btn dash-btn-warning dash-btn-sm" onclick="window.editUser('${user.id}')" aria-label="Edit user">
            <i class="fas fa-edit"></i>
          </button>
          <button class="dash-btn dash-btn-danger dash-btn-sm" onclick="window.deleteUser('${user.id}')" aria-label="Delete user">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error("Error loading users:", error);
    const tbody = document.getElementById("usersBody");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:40px;color:var(--gray);">
        <i class="fas fa-exclamation-circle"></i> Error loading users
      </td></tr>`;
    }
  }
};

// ========== CRUD OPERATIONS ==========
window.deleteUser = async (id) => {
  if (!confirm("⚠️ Delete this user? This action cannot be undone.")) return;
  try {
    await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
    showMessage('msg', '✅ User deleted successfully');
    await showPage("users");
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("❌ Error deleting user. Please try again.");
  }
};

window.showDetails = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`);
    if (!res.ok) throw new Error('User not found');
    const user = await res.json();
    setContent(`
      <div class="dash-form-container">
        <h2>📋 User Details</h2>
        <div style="text-align:center;margin-bottom:16px;">
          <img src="${user.photo || 'https://i.pravatar.cc/150'}" 
               style="width:80px;height:80px;border-radius:50%;border:3px solid var(--dash-primary);object-fit:cover;">
        </div>
        <div class="dash-form-group"><label>ID</label><p style="padding:10px;background:var(--dash-bg);border-radius:var(--dash-radius-sm);margin:0;word-break:break-all;">${user.id}</p></div>
        <div class="dash-form-group"><label>Name</label><p style="padding:10px;background:var(--dash-bg);border-radius:var(--dash-radius-sm);margin:0;">${user.nom} ${user.prenom}</p></div>
        <div class="dash-form-group"><label>Email</label><p style="padding:10px;background:var(--dash-bg);border-radius:var(--dash-radius-sm);margin:0;word-break:break-all;">${user.email}</p></div>
        <div class="dash-form-group"><label>Age</label><p style="padding:10px;background:var(--dash-bg);border-radius:var(--dash-radius-sm);margin:0;">${user.age || 'Not specified'}</p></div>
        <div class="dash-form-group"><label>Username</label><p style="padding:10px;background:var(--dash-bg);border-radius:var(--dash-radius-sm);margin:0;">${user.pseudo}</p></div>
        <div class="dash-form-group"><label>Role</label><p style="padding:10px;background:var(--dash-bg);border-radius:var(--dash-radius-sm);margin:0;">
          <span class="badge ${user.admin ? 'badge-success' : 'badge-info'}">${user.admin ? 'Admin' : 'User'}</span>
        </p></div>
        <button class="dash-btn dash-btn-primary" onclick="showPage('users')">
          <i class="fas fa-arrow-left"></i> Back
        </button>
      </div>
    `);
  } catch (error) {
    console.error("Error loading details:", error);
    alert("❌ Error loading user details. Please try again.");
  }
};

window.editUser = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`);
    if (!res.ok) throw new Error('User not found');
    const user = await res.json();
    
    setContent(`
      <div class="dash-form-container">
        <h2>✏️ Edit User</h2>
        <form id="editForm">
          <div class="dash-form-group"><label>Photo URL</label><input type="text" id="photo" value="${user.photo || ''}" placeholder="https://i.pravatar.cc/150"></div>
          <div class="dash-form-group"><label>First Name</label><input type="text" id="nom" value="${user.nom}" required></div>
          <div class="dash-form-group"><label>Last Name</label><input type="text" id="prenom" value="${user.prenom}" required></div>
          <div class="dash-form-group"><label>Email</label><input type="email" id="email" value="${user.email}" required></div>
          <div class="dash-form-group"><label>Age</label><input type="number" id="age" value="${user.age || ''}" min="1" max="120"></div>
          <div class="dash-form-group"><label>Role</label>
            <select id="admin">
              <option value="false">User</option>
              <option value="true" ${user.admin ? 'selected' : ''}>Admin</option>
            </select>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;">
            <button type="submit" class="dash-btn dash-btn-primary">
              <i class="fas fa-save"></i> Save
            </button>
            <button type="button" class="dash-btn" onclick="showPage('users')">
              <i class="fas fa-times"></i> Cancel
            </button>
          </div>
          <div id="msg" style="display:none;"></div>
        </form>
      </div>
    `);
    
    document.getElementById("editForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = e.target.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
      
      const updatedUser = {
        nom: document.getElementById("nom").value.trim(),
        prenom: document.getElementById("prenom").value.trim(),
        email: document.getElementById("email").value.trim(),
        age: parseInt(document.getElementById("age").value) || null,
        admin: document.getElementById("admin").value === "true",
        photo: document.getElementById("photo").value.trim() || "https://i.pravatar.cc/150"
      };
      
      try {
        await fetch(`${API_BASE_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser)
        });
        showMessage('msg', '✅ User updated successfully');
        await showPage("users");
      } catch (error) {
        console.error("Error updating user:", error);
        showMessage('msg', '❌ Error updating user. Please try again.', true);
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save';
      }
    });
  } catch (error) {
    console.error("Error loading user:", error);
    alert("❌ Error loading user data. Please try again.");
  }
};

// ========== ADD USER ==========
const renderAddUserForm = () => {
  setContent(`
    <div class="dash-form-container">
      <h2>➕ Add User</h2>
      <form id="registerForm">
        <div class="dash-form-group"><label>Photo URL</label><input type="text" id="photo" placeholder="https://i.pravatar.cc/150"></div>
        <div class="dash-form-group"><label>First Name *</label><input type="text" id="nom" required placeholder="John"></div>
        <div class="dash-form-group"><label>Last Name *</label><input type="text" id="prenom" required placeholder="Doe"></div>
        <div class="dash-form-group"><label>Age</label><input type="number" id="age" min="1" max="120" placeholder="25"></div>
        <div class="dash-form-group"><label>Email *</label><input type="email" id="email" required placeholder="john@example.com"></div>
        <div class="dash-form-group"><label>Username *</label><input type="text" id="pseudo" required placeholder="johndoe"></div>
        <div class="dash-form-group"><label>Password *</label><input type="password" id="MotDePasse" required placeholder="••••••••"></div>
        <div class="dash-form-group"><label>Color</label><input type="color" id="couleur" value="#6C63FF"></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;">
          <button type="submit" class="dash-btn dash-btn-primary">
            <i class="fas fa-user-plus"></i> Add User
          </button>
          <button type="button" class="dash-btn" onclick="showPage('users')">
            <i class="fas fa-times"></i> Cancel
          </button>
        </div>
        <div id="msg" style="display:none;"></div>
      </form>
    </div>
  `);
  
  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    
    const newUser = {
      nom: document.getElementById("nom").value.trim(),
      prenom: document.getElementById("prenom").value.trim(),
      age: parseInt(document.getElementById("age").value) || null,
      email: document.getElementById("email").value.trim(),
      pseudo: document.getElementById("pseudo").value.trim(),
      MotDePasse: document.getElementById("MotDePasse").value,
      couleur: document.getElementById("couleur").value || "#6C63FF",
      admin: false,
      photo: document.getElementById("photo").value.trim() || "https://i.pravatar.cc/150"
    };
    
    try {
      await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      showMessage('msg', '✅ User added successfully');
      await showPage("users");
    } catch (error) {
      console.error("Error adding user:", error);
      showMessage('msg', '❌ Error adding user. Please try again.', true);
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Add User';
    }
  });
};

// ========== REQUESTS ==========
const renderMyRequests = async (user) => {
  setContent(`
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
      <h2 style="margin:0;">📝 My Requests</h2>
      <button class="dash-btn dash-btn-primary" onclick="showPage('addRequest')">
        <i class="fas fa-plus"></i> New Request
      </button>
    </div>
    <div id="reqList"></div>
  `);
  await loadMyRequests(user);
};

const loadMyRequests = async (user) => {
  try {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch');
    const all = await res.json();
    const myReqs = all.filter(r => String(r.userId) === String(user.id));
    const container = document.getElementById("reqList");
    
    if (myReqs.length === 0) {
      container.innerHTML = `
        <div class="dash-card" style="text-align:center;padding:40px;">
          <div style="font-size:48px;margin-bottom:12px;">📭</div>
          <p style="color:var(--gray);">No requests found. Create your first request!</p>
          <button class="dash-btn dash-btn-primary" onclick="showPage('addRequest')" style="margin-top:12px;">
            <i class="fas fa-plus"></i> New Request
          </button>
        </div>
      `;
      return;
    }
    
    container.innerHTML = myReqs.map(req => `
      <div class="dash-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
          <h3 style="margin:0;">📌 ${req.titre || 'Untitled'}</h3>
          <span class="badge badge-${req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'}">${req.status || 'Pending'}</span>
        </div>
        <p style="margin-top:8px;color:var(--gray);">${req.description || 'No description'}</p>
        ${req.status === 'pending' ? `
          <button class="dash-btn dash-btn-danger dash-btn-sm" onclick="window.cancelRequest('${req.id}')" style="margin-top:8px;">
            <i class="fas fa-times"></i> Cancel
          </button>
        ` : ''}
      </div>
    `).join('');
  } catch (error) {
    console.error("Error loading requests:", error);
    const container = document.getElementById("reqList");
    if (container) {
      container.innerHTML = `
        <div class="dash-card" style="text-align:center;padding:40px;color:var(--gray);">
          <i class="fas fa-exclamation-circle"></i> Error loading requests
        </div>
      `;
    }
  }
};

window.cancelRequest = async (id) => {
  if (!confirm("⚠️ Cancel this request?")) return;
  try {
    await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
    showMessage('msg', '✅ Request cancelled');
    const user = getCurrentUser();
    if (user) await loadMyRequests(user);
  } catch (error) {
    console.error("Error cancelling request:", error);
    alert("❌ Error cancelling request. Please try again.");
  }
};

const renderAddRequestForm = (user) => {
  setContent(`
    <div class="dash-form-container">
      <h2>➕ New Request</h2>
      <form id="reqForm">
        <div class="dash-form-group"><label>Title *</label><input type="text" id="titre" required placeholder="Request title"></div>
        <div class="dash-form-group"><label>Description</label><textarea id="desc" rows="4" placeholder="Describe your request in detail..."></textarea></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;">
          <button type="submit" class="dash-btn dash-btn-primary">
            <i class="fas fa-paper-plane"></i> Submit
          </button>
          <button type="button" class="dash-btn" onclick="showPage('requests')">
            <i class="fas fa-times"></i> Cancel
          </button>
        </div>
        <div id="msg" style="display:none;"></div>
      </form>
    </div>
  `);
  
  document.getElementById("reqForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    const user = getCurrentUser();
    const request = {
      userId: user.id,
      titre: document.getElementById("titre").value.trim(),
      description: document.getElementById("desc").value.trim(),
      status: "pending"
    };
    
    try {
      await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      });
      showMessage('msg', '✅ Request submitted successfully');
      await showPage("requests");
    } catch (error) {
      console.error("Error submitting request:", error);
      showMessage('msg', '❌ Error submitting request. Please try again.', true);
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit';
    }
  });
};

// ========== ADMIN REQUESTS ==========
const renderAllRequests = async () => {
  setContent(`
    <h2 style="margin-bottom:20px;">📋 All Requests (Admin)</h2>
    <div id="reqList"></div>
  `);
  await loadAllRequests();
};

const loadAllRequests = async () => {
  try {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch');
    const requests = await res.json();
    const container = document.getElementById("reqList");
    
    if (!requests.length) {
      container.innerHTML = `
        <div class="dash-card" style="text-align:center;padding:40px;">
          <div style="font-size:48px;margin-bottom:12px;">📭</div>
          <p style="color:var(--gray);">No requests found</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = requests.map(req => `
      <div class="dash-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
          <h3 style="margin:0;">📌 ${req.titre || 'Untitled'}</h3>
          <span class="badge badge-${req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'}">${req.status || 'Pending'}</span>
        </div>
        <p style="margin-top:8px;color:var(--gray);">${req.description || 'No description'}</p>
        <p style="font-size:12px;color:var(--gray);margin:4px 0 8px;">
          <i class="fas fa-user"></i> User ID: ${req.userId}
        </p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="dash-btn dash-btn-success dash-btn-sm" onclick="window.updateStatus('${req.id}','approved')">
            <i class="fas fa-check"></i> Approve
          </button>
          <button class="dash-btn dash-btn-danger dash-btn-sm" onclick="window.updateStatus('${req.id}','rejected')">
            <i class="fas fa-times"></i> Reject
          </button>
          <button class="dash-btn dash-btn-warning dash-btn-sm" onclick="window.deleteRequest('${req.id}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error("Error loading requests:", error);
    const container = document.getElementById("reqList");
    if (container) {
      container.innerHTML = `
        <div class="dash-card" style="text-align:center;padding:40px;color:var(--gray);">
          <i class="fas fa-exclamation-circle"></i> Error loading requests
        </div>
      `;
    }
  }
};

window.updateStatus = async (id, status) => {
  try {
    await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    showMessage('msg', `✅ Request ${status}`);
    await loadAllRequests();
  } catch (error) {
    console.error("Error updating status:", error);
    alert("❌ Error updating status. Please try again.");
  }
};

window.deleteRequest = async (id) => {
  if (!confirm("⚠️ Delete this request?")) return;
  try {
    await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
    showMessage('msg', '✅ Request deleted');
    await loadAllRequests();
  } catch (error) {
    console.error("Error deleting request:", error);
    alert("❌ Error deleting request. Please try again.");
  }
};

// ========== INIT ==========
document.addEventListener("DOMContentLoaded", () => {
  const user = requireAuth();
  
  // Set background color
  document.body.style.backgroundColor = user.couleur || "#F5F6FA";
  
  // Update user info
  document.getElementById("userAvatar").src = user.photo || "https://i.pravatar.cc/150";
  document.getElementById("userName").textContent = `${user.prenom} ${user.nom}`;
  
  // Logout
  document.getElementById("logoutBtn").addEventListener("click", logout);
  
  // Mobile menu toggle
  document.getElementById("mobileMenuToggle").addEventListener("click", toggleMobileMenu);
  document.getElementById("mobileOverlay").addEventListener("click", closeMobileMenu);
  
  // Close mobile menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileMenu();
  });
  
  // Build nav
  buildNavigation(user);
  
  // Load default page
  showPage("home");
});

// Expose functions globally
window.showPage = showPage;
window.showDetails = window.showDetails;
window.editUser = window.editUser;
window.deleteUser = window.deleteUser;
window.cancelRequest = window.cancelRequest;
window.updateStatus = window.updateStatus;
window.deleteRequest = window.deleteRequest;
window.closeMobileMenu = closeMobileMenu;
window.toggleMobileMenu = toggleMobileMenu;