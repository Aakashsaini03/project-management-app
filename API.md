# 📚 API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### 1. Signup
**POST** `/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation Rules:**
- `email`: Must be a valid email
- `password`: Minimum 6 characters
- `name`: Required, non-empty string

---

### 2. Login
**POST** `/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

### 3. Get Current User
**GET** `/auth/me`

Get the current authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

## 📁 Project Endpoints

### 1. Create Project
**POST** `/projects`

Create a new project. Creator is automatically added as admin.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Website Redesign",
  "description": "Redesign company website with new UI/UX"
}
```

**Response (201):**
```json
{
  "message": "Project created successfully",
  "project": {
    "id": 1,
    "name": "Website Redesign",
    "description": "Redesign company website with new UI/UX",
    "created_by": 1,
    "created_at": "2025-05-05T10:30:00Z",
    "updated_at": "2025-05-05T10:30:00Z"
  }
}
```

**Validation Rules:**
- `name`: Required, non-empty string
- `description`: Optional string

---

### 2. Get All Projects
**GET** `/projects`

Get all projects the user is a member of.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Website Redesign",
    "description": "Redesign company website with new UI/UX",
    "created_by": 1,
    "created_at": "2025-05-05T10:30:00Z"
  },
  {
    "id": 2,
    "name": "Mobile App",
    "description": "Build mobile application",
    "created_by": 2,
    "created_at": "2025-05-05T11:00:00Z"
  }
]
```

---

### 3. Get Single Project
**GET** `/projects/:projectId`

Get details of a specific project. User must be a member.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Website Redesign",
  "description": "Redesign company website with new UI/UX",
  "created_by": 1,
  "created_at": "2025-05-05T10:30:00Z",
  "updated_at": "2025-05-05T10:30:00Z"
}
```

**Error Response (403):**
```json
{
  "error": "Not a member of this project"
}
```

---

### 4. Update Project
**PUT** `/projects/:projectId`

Update project details. Only project admins can perform this action.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Website Redesign v2",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "message": "Project updated successfully",
  "project": {
    "id": 1,
    "name": "Website Redesign v2",
    "description": "Updated description",
    "created_by": 1,
    "created_at": "2025-05-05T10:30:00Z",
    "updated_at": "2025-05-05T12:00:00Z"
  }
}
```

**Error Response (403):**
```json
{
  "error": "Only admins can perform this action"
}
```

---

### 5. Get Project Members
**GET** `/projects/:projectId/members`

Get all members of a project. User must be a member.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "joined_at": "2025-05-05T10:30:00Z"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "member",
    "joined_at": "2025-05-05T11:00:00Z"
  }
]
```

---

### 6. Add Member to Project
**POST** `/projects/:projectId/members`

Add a new member to the project. Only project admins can perform this action.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "jane@example.com",
  "role": "member"
}
```

**Response (201):**
```json
{
  "message": "Member added successfully",
  "member": {
    "id": 1,
    "project_id": 1,
    "user_id": 2,
    "role": "member",
    "joined_at": "2025-05-05T12:00:00Z"
  }
}
```

**Validation Rules:**
- `email`: Must be valid email of existing user
- `role`: Must be "admin" or "member"

**Error Response (404):**
```json
{
  "error": "User not found"
}
```

---

## 📋 Task Endpoints

### 1. Create Task
**POST** `/tasks`

Create a new task in a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "project_id": 1,
  "title": "Design homepage",
  "description": "Create mockups for homepage redesign",
  "assigned_to": 2,
  "priority": "high",
  "status": "todo",
  "due_date": "2025-05-15T23:59:59Z"
}
```

**Response (201):**
```json
{
  "message": "Task created successfully",
  "task": {
    "id": 1,
    "project_id": 1,
    "title": "Design homepage",
    "description": "Create mockups for homepage redesign",
    "assigned_to": 2,
    "priority": "high",
    "status": "todo",
    "due_date": "2025-05-15T23:59:59Z",
    "created_by": 1,
    "created_at": "2025-05-05T10:30:00Z",
    "updated_at": "2025-05-05T10:30:00Z"
  }
}
```

**Validation Rules:**
- `project_id`: Required, integer
- `title`: Required, non-empty string
- `priority`: "low", "medium", or "high"
- `status`: "todo", "in_progress", or "completed"
- `due_date`: Optional, ISO 8601 format

---

### 2. Get Tasks for Project
**GET** `/tasks/project/:projectId`

Get all tasks in a project. User must be a member.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "project_id": 1,
    "title": "Design homepage",
    "description": "Create mockups for homepage redesign",
    "assigned_to": 2,
    "assigned_to_name": "Jane Smith",
    "assigned_to_email": "jane@example.com",
    "priority": "high",
    "status": "in_progress",
    "due_date": "2025-05-15T23:59:59Z",
    "created_by": 1,
    "created_at": "2025-05-05T10:30:00Z",
    "updated_at": "2025-05-05T11:00:00Z"
  }
]
```

---

### 3. Get Single Task
**GET** `/tasks/:taskId`

Get details of a specific task. User must be a project member.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "project_id": 1,
  "project_name": "Website Redesign",
  "title": "Design homepage",
  "description": "Create mockups for homepage redesign",
  "assigned_to": 2,
  "assigned_to_name": "Jane Smith",
  "assigned_to_email": "jane@example.com",
  "priority": "high",
  "status": "in_progress",
  "due_date": "2025-05-15T23:59:59Z",
  "created_by": 1,
  "created_by_name": "John Doe",
  "created_at": "2025-05-05T10:30:00Z",
  "updated_at": "2025-05-05T11:00:00Z"
}
```

---

### 4. Update Task
**PUT** `/tasks/:taskId`

Update task details. User must be a project member.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "completed",
  "priority": "medium"
}
```

**Response (200):**
```json
{
  "message": "Task updated successfully",
  "task": {
    "id": 1,
    "project_id": 1,
    "title": "Design homepage",
    "description": "Create mockups for homepage redesign",
    "assigned_to": 2,
    "priority": "medium",
    "status": "completed",
    "due_date": "2025-05-15T23:59:59Z",
    "created_by": 1,
    "created_at": "2025-05-05T10:30:00Z",
    "updated_at": "2025-05-05T12:00:00Z"
  }
}
```

---

### 5. Delete Task
**DELETE** `/tasks/:taskId`

Delete a task. Only task creator or project admin can delete.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

**Error Response (403):**
```json
{
  "error": "Not authorized to delete this task"
}
```

---

## 📊 Dashboard Endpoints

### 1. Get Dashboard Stats
**GET** `/dashboard/stats`

Get summary statistics for the user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "total_projects": 5,
  "total_assigned_tasks": 12,
  "overdue_tasks": 2,
  "tasks_by_status": {
    "todo": 4,
    "in_progress": 6,
    "completed": 2
  }
}
```

---

### 2. Get User's Tasks
**GET** `/dashboard/my-tasks?status=<status>`

Get all tasks assigned to the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status ("todo", "in_progress", "completed")

**Response (200):**
```json
[
  {
    "id": 1,
    "project_id": 1,
    "project_name": "Website Redesign",
    "title": "Design homepage",
    "status": "in_progress",
    "priority": "high",
    "due_date": "2025-05-15T23:59:59Z",
    "created_by": 1,
    "created_by_name": "John Doe",
    "created_at": "2025-05-05T10:30:00Z"
  }
]
```

---

### 3. Get Overdue Tasks
**GET** `/dashboard/overdue`

Get all overdue tasks assigned to the user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 2,
    "project_id": 1,
    "project_name": "Website Redesign",
    "title": "Fix navigation bugs",
    "status": "todo",
    "priority": "high",
    "due_date": "2025-05-01T23:59:59Z",
    "created_by": 1,
    "created_by_name": "John Doe",
    "created_at": "2025-05-02T10:30:00Z"
  }
]
```

---

## ❌ Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "errors": [
    {
      "param": "email",
      "msg": "Invalid value"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Not authorized to perform this action"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Resource already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

---

## 🔄 Example Workflow

### Step 1: Create User (Signup)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Step 2: Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "My Project",
    "description": "Project description"
  }'
```

### Step 3: Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "project_id": 1,
    "title": "Task title",
    "priority": "high",
    "status": "todo"
  }'
```

### Step 4: Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer <token>"
```
