# 📋 Project Management App

A full-featured project management application with role-based access control, task tracking, and real-time collaboration features.

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Project Management**: Create projects and manage team members
- **Task Tracking**: Create, assign, and track task progress
- **Role-Based Access Control**: Admin and Member roles with fine-grained permissions
- **Dashboard**: Real-time stats on projects, tasks, and overdue items
- **Input Validation**: Comprehensive server-side validation
- **Security**: Password hashing, SQL injection prevention, CORS support

## 📋 Requirements

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aakashsaini03/project-management-app.git
   cd project-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database credentials:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/project_management
   JWT_SECRET=your_super_secret_key
   PORT=5000
   ```

4. **Initialize database**
   ```bash
   npm run init-db
   ```

5. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

See [API.md](./API.md) for complete API documentation with examples.

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step deployment instructions on Railway.

## 📁 Project Structure

```
project-management-app/
├── src/
│   ├── index.js                 # Main server file
│   ├── config/
│   │   └── database.js         # Database configuration
│   ├── middleware/
│   │   └── auth.js             # Authentication and RBAC middleware
│   ├── routes/
│   │   ├── auth.js            # Authentication endpoints
│   │   ├── projects.js        # Project management endpoints
│   │   ├── tasks.js           # Task management endpoints
│   │   └── dashboard.js       # Dashboard endpoints
│   └── scripts/
│       └── initDb.js          # Database initialization script
├── package.json
├── .env.example
├── README.md
├── API.md
└── DEPLOYMENT.md
```

## 🔐 Database Schema

### Users Table
- id (Primary Key)
- name
- email (Unique)
- password (hashed)
- created_at
- updated_at

### Projects Table
- id (Primary Key)
- name
- description
- created_by (Foreign Key → Users)
- created_at
- updated_at

### Project Members Table
- id (Primary Key)
- project_id (Foreign Key → Projects)
- user_id (Foreign Key → Users)
- role (admin/member)
- joined_at

### Tasks Table
- id (Primary Key)
- project_id (Foreign Key → Projects)
- title
- description
- status (todo/in_progress/completed)
- priority (low/medium/high)
- assigned_to (Foreign Key → Users)
- created_by (Foreign Key → Users)
- due_date
- created_at
- updated_at

## 🔑 Key Technologies

- **Runtime**: Node.js + Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: cors

## 🛡️ Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT token-based authentication
- Parameterized SQL queries (SQL injection prevention)
- Input validation on all endpoints
- CORS configuration
- Role-based access control (RBAC)
- Project-level access verification

## 📝 Environment Variables

```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/project_management
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Aakash Saini**
- GitHub: [@Aakashsaini03](https://github.com/Aakashsaini03)

## 📞 Support

For support, email aakashsaini@example.com or open an issue in the repository.
