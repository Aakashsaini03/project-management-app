# Project Management App - Frontend

React-based frontend for the Project Management App with RBAC.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file in the client directory:

```bash
cp .env.example .env
```

Update the API URL if needed:

```env
VITE_API_URL=http://localhost:5000/api
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build

```bash
npm run build
```

Output will be in the `dist` folder.

## 📁 Project Structure

```
src/
├── api/
│   ├── axios.js          # Axios instance with interceptors
│   └── endpoints.js      # All API endpoints
├── components/
│   └── ProtectedRoute.jsx  # Route guard component
├── context/
│   └── AuthContext.jsx   # Authentication context
├── pages/
│   ├── SignUp.jsx        # Sign up page
│   ├── Login.jsx         # Login page
│   └── Dashboard.jsx     # Dashboard page
├── App.jsx               # Main component with routing
├── main.jsx              # Entry point
└── index.css             # Global styles
```

## 🎨 Features

- ✅ User Authentication (Signup/Login)
- ✅ Protected Routes
- ✅ JWT Token Management
- ✅ Context API for State Management
- ✅ Form Validation
- ✅ Error Handling
- ✅ Dashboard with Stats
- ✅ Responsive Design with Tailwind CSS
- ✅ Loading States and Animations

## 🔑 Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## 📦 Dependencies

- **react** - UI library
- **react-router-dom** - Routing
- **axios** - HTTP client
- **tailwindcss** - Styling
- **lucide-react** - Icons
- **date-fns** - Date utilities

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 Notes

- Make sure the backend is running on `http://localhost:5000`
- JWT token is automatically stored in localStorage
- Unauthorized requests (401) will redirect to login
- All API calls include the JWT token in headers

## 🚀 Deployment

The frontend can be deployed to any static hosting service (Vercel, Netlify, etc.):

```bash
npm run build
```

Then deploy the `dist` folder.
