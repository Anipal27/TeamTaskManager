# TeamFlow – Team Task Manager (Full-Stack)

## Live Demo
[Add your Railway Live URL here]

---

# Overview
TeamFlow is a full-stack role-based Team Task Manager web application where Admins can create projects, assign tasks, and monitor progress, while Members can view assigned tasks and update statuses.

This project was built as part of a Full-Stack Assessment using:

- Frontend: HTML, CSS, Bootstrap, JavaScript
- Backend: Java Spring Boot
- Database: MySQL
- Deployment: Railway

---

# Features

## Authentication
- User Signup
- User Login
- Role-Based Access (Admin / Member)

## Admin Features
- Create Projects
- Assign Tasks to Team Members
- View All Tasks
- Dashboard Analytics
  - Pending Tasks
  - In Progress Tasks
  - Completed Tasks

## Member Features
- View Assigned Tasks
- Update Task Status
- Dashboard Access
- Project Visibility

---

# Tech Stack

## Frontend
- HTML5
- CSS3
- Bootstrap 5
- JavaScript

## Backend
- Java 17
- Spring Boot
- Spring MVC
- Spring Data JPA

## Database
- MySQL

## Deployment
- Railway

---

# Project Structure

TEAMTASKMANAGER/
│
├── src/
│   └── main/
│       ├── java/com/teamtaskmanager/
│       │   ├── Config/
│       │   ├── Controller/
│       │   ├── Entity/
│       │   ├── Repository/
│       │   └── Service/
│       │
│       └── resources/
│           ├── static/
│           │   ├── index.html
│           │   ├── login.html
│           │   ├── signup.html
│           │   ├── dashboard.html
│           │   └── js/script.js
│           │
│           └── application.properties
│
├── pom.xml
├── nixpacks.toml
└── README.md

---

# Installation (Local Setup)

## Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd TEAMTASKMANAGER