const BASE_URL = "http://localhost:8082";

// Simple Toast Notification
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `position-fixed bottom-0 end-0 p-3`;
    toast.style.zIndex = "9999";
    
    toast.innerHTML = `
        <div class="toast show align-items-center text-white bg-${type === 'success' ? 'success' : type === 'danger' ? 'danger' : 'primary'}" role="alert">
            <div class="d-flex">
                <div class="toast-body fw-medium">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ---------------- LOAD USERS FOR DROPDOWN (Improved) ----------------
async function loadUsers() {
    const select = document.getElementById("assignedTo");
    if (!select) return;

    try {
        select.innerHTML = `<option value="">Loading team members...</option>`;

        const response = await fetch(`${BASE_URL}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("Users API Response Status:", response.status); // For debugging

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const users = await response.json();
        console.log("Users loaded:", users); // For debugging

        select.innerHTML = `<option value="">Select Member</option>`;

        const members = users.filter(user => user.role === "MEMBER" || user.role === "member");

        if (members.length === 0) {
            select.innerHTML = `<option value="">No members found</option>`;
            showToast("No team members found", "warning");
            return;
        }

        members.forEach(user => {
            const option = document.createElement("option");
            option.value = user.id;
            option.textContent = `${user.name} (${user.email})`;
            select.appendChild(option);
        });

    } catch (err) {
        console.error("Load Users Error:", err);
        select.innerHTML = `<option value="">Error loading users</option>`;
        showToast("Failed to load users. Check if backend /users endpoint is running.", "danger");
    }
}

// ---------------- SIGNUP ----------------
async function signup() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (!name || !email || !password) {
        showToast("All fields are required!", "danger");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role })
        });

        if (response.ok) {
            showToast("Account created successfully!", "success");
            setTimeout(() => window.location.href = "/login.html", 1500);
        } else {
            const error = await response.text();
            showToast(error || "Signup failed!", "danger");
        }
    } catch (err) {
        showToast("Network error. Please try again.", "danger");
    }
}

// ---------------- LOGIN ----------------
async function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        showToast("Email and password are required!", "danger");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const user = await response.json();

        if (response.ok && user?.id) {
            localStorage.setItem("userId", user.id);
            localStorage.setItem("userRole", user.role);
            localStorage.setItem("userName", user.name);

            showToast(`Welcome back, ${user.name}!`, "success");

            setTimeout(() => {
                window.location.href = "/dashboard.html";
            }, 1200);
        } else {
            showToast("Invalid email or password!", "danger");
        }
    } catch (err) {
        showToast("Login failed. Please try again.", "danger");
    }
}

// ---------------- LOGOUT ----------------
function logout() {
    localStorage.clear();
    showToast("Logged out successfully", "success");
    setTimeout(() => window.location.href = "/login.html", 800);
}

// ---------------- DASHBOARD ----------------
async function loadDashboard() {
    try {
        const response = await fetch(`${BASE_URL}/dashboard`);
        if (!response.ok) throw new Error("Failed to load dashboard");

        const data = await response.json();

        document.getElementById("pendingCount").innerText = data.Pending || 0;
        document.getElementById("progressCount").innerText = data["In Progress"] || 0;
        document.getElementById("doneCount").innerText = data.Done || 0;
    } catch (err) {
        console.error(err);
        showToast("Could not load dashboard data", "danger");
    }
}

// ---------------- CREATE PROJECT ----------------
async function createProject() {
    const name = document.getElementById("projectName").value.trim();
    const description = document.getElementById("projectDescription").value.trim();
    const userId = localStorage.getItem("userId");

    if (!name) {
        showToast("Project name is required!", "danger");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/projects`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                description,
                createdBy: { id: userId }
            })
        });

        if (response.ok) {
            showToast("Project created successfully!", "success");
            document.getElementById("projectName").value = "";
            document.getElementById("projectDescription").value = "";
        } else {
            showToast("Failed to create project", "danger");
        }
    } catch (err) {
        showToast("Something went wrong", "danger");
    }
}

// ---------------- CREATE TASK ----------------
async function createTask() {
    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();
    const deadline = document.getElementById("deadline").value;
    const assignedToId = document.getElementById("assignedTo").value;
    const userId = localStorage.getItem("userId");

    if (!title || !assignedToId || !deadline) {
        showToast("Title, deadline, and assigned user are required!", "danger");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                description,
                status: "Pending",
                deadline,
                assignedTo: { id: assignedToId },
                createdBy: { id: userId }
            })
        });

        if (response.ok) {
            showToast("Task assigned successfully!", "success");
            document.getElementById("taskTitle").value = "";
            document.getElementById("taskDescription").value = "";
            document.getElementById("deadline").value = "";
            document.getElementById("assignedTo").value = "";
        } else {
            showToast("Failed to assign task", "danger");
        }
    } catch (err) {
        showToast("Network error while assigning task", "danger");
    }
}

// ---------------- LOAD MEMBER TASKS ----------------
async function loadMemberTasks() {
    const userId = localStorage.getItem("userId");
    const tableBody = document.getElementById("taskTableBody");

    if (!tableBody) return;

    try {
        const response = await fetch(`${BASE_URL}/tasks/user/${userId}`);
        const tasks = await response.json();

        tableBody.innerHTML = "";

        if (tasks.length === 0) {
            tableBody.innerHTML = `
                <tr><td colspan="5" class="text-center py-4 text-muted">No tasks assigned yet.</td></tr>
            `;
            return;
        }

        tasks.forEach(task => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="fw-medium">${task.title}</td>
                <td>${task.description || '-'}</td>
                <td>
                    <span class="badge bg-${task.status === 'Done' ? 'success' : task.status === 'In Progress' ? 'primary' : 'warning'}">
                        ${task.status}
                    </span>
                </td>
                <td>${task.deadline || '-'}</td>
                <td>
                    <select onchange="updateTaskStatus(${task.id}, this.value)" class="form-select form-select-sm">
                        <option value="">Change Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        console.error(err);
        showToast("Failed to load tasks", "danger");
    }
}

// ---------------- UPDATE TASK STATUS ----------------
async function updateTaskStatus(taskId, status) {
    if (!status) return;

    try {
        const response = await fetch(`${BASE_URL}/tasks/${taskId}/status?status=${status}`, {
            method: "PUT"
        });

        if (response.ok) {
            showToast("Task status updated successfully!", "success");
            loadMemberTasks();
        } else {
            showToast("Failed to update status", "danger");
        }
    } catch (err) {
        showToast("Error updating task", "danger");
    }
}

// ---------------- AUTO LOAD FUNCTIONS ----------------
window.onload = function () {
    const path = window.location.pathname;

    setupUserWelcome();

    if (path.includes("dashboard.html")) {
        loadDashboard();
        loadProjects();
        setupDashboardByRole();
    }

    if (path.includes("admin.html")) {
        loadUsers();
    }
};
// ---------------- LOAD PROJECTS ----------------
async function loadProjects() {
    const projectList = document.getElementById("projectList");
    if (!projectList) return;

    try {
        const response = await fetch(`${BASE_URL}/projects/all`);

        if (!response.ok) throw new Error("Failed to fetch projects");

        const projects = await response.json();

        projectList.innerHTML = "";

        if (projects.length === 0) {
            projectList.innerHTML = `
                <li class="list-group-item text-muted">No projects available yet.</li>
            `;
            return;
        }

        projects.forEach(project => {
            const li = document.createElement("li");
            li.className = "list-group-item";

            li.innerHTML = `
                <strong>${project.name}</strong>
                <br>
                <small class="text-muted">${project.description || "No description"}</small>
            `;

            projectList.appendChild(li);
        });

    } catch (err) {
        console.error(err);
        projectList.innerHTML = `
            <li class="list-group-item text-danger">Failed to load projects</li>
        `;
    }
}

// ---------------- SETUP USER NAME ----------------
function setupUserWelcome() {
    const welcomeUser = document.getElementById("welcomeUser");

    if (welcomeUser) {
        const userName = localStorage.getItem("userName") || "User";
        const role = localStorage.getItem("userRole") || "";
        welcomeUser.innerText = `${userName} (${role})`;
    }
}

// ---------------- ROLE-BASED DASHBOARD ----------------
function setupDashboardByRole() {
    const role = localStorage.getItem("userRole");

    const adminControls = document.getElementById("adminControls");
    const taskTitle = document.getElementById("taskSectionTitle");
    const taskActionHeader = document.getElementById("taskActionHeader");

    if (role === "ADMIN") {
        // SHOW ADMIN CONTROLS
        if (adminControls) {
            adminControls.style.display = "block";
        }

        // CHANGE TASK SECTION TITLE
        if (taskTitle) {
            taskTitle.innerText = "All Tasks";
        }

        // ADMIN TASK TABLE HEADER
        if (taskActionHeader) {
            taskActionHeader.innerText = "Assigned To";
        }

        // LOAD USERS FOR DROPDOWN
        loadUsers();

        // LOAD ALL TASKS
        loadAllTasks();

    } else {
        // MEMBER VIEW
        if (taskTitle) {
            taskTitle.innerText = "My Tasks";
        }

        if (taskActionHeader) {
            taskActionHeader.innerText = "Action";
        }

        loadMemberTasks();
    }
}

// ---------------- LOAD ALL TASKS FOR ADMIN ----------------
async function loadAllTasks() {
    const tableBody = document.getElementById("taskTableBody");
    if (!tableBody) return;

    try {
        const response = await fetch(`${BASE_URL}/tasks`);

        if (!response.ok) throw new Error("Failed to load tasks");

        const tasks = await response.json();

        tableBody.innerHTML = "";

        if (tasks.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">
                        No tasks available yet.
                    </td>
                </tr>
            `;
            return;
        }

        tasks.forEach(task => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td class="fw-medium">${task.title}</td>
                <td>${task.description || "-"}</td>
                <td>
                    <span class="badge bg-${
                        task.status === "Done"
                            ? "success"
                            : task.status === "In Progress"
                            ? "primary"
                            : "warning"
                    }">
                        ${task.status}
                    </span>
                </td>
                <td>${task.deadline || "-"}</td>
                <td>${task.assignedTo ? task.assignedTo.name : "-"}</td>
            `;

            tableBody.appendChild(row);
        });

    } catch (err) {
        console.error(err);
        showToast("Failed to load admin tasks", "danger");
    }
}