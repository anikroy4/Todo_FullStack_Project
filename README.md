# Todo FullStack Application

A modern, full-featured Todo application built with React, Redux, Express.js, MongoDB, and Tailwind CSS. Includes user authentication, email verification, password reset, and advanced todo management features.

## Features

### Authentication
- User registration with email verification
- Secure login with JWT tokens
- Password reset via email
- Forgot password workflow
- Automatic token refresh
- Session management with refresh tokens

### Todo Management
- Create, read, update, delete (CRUD) operations
- Mark todos as complete/incomplete
- Filter by status (all, active, completed)
- Search by title and description
- Sort by date, priority, or creation time
- Priority levels (low, medium, high)
- Due date tracking
- Bulk delete completed todos
- Real-time progress tracking

### Security Features
- Helmet.js for security headers
- CORS protection (restricted origins)
- Input sanitization with XSS prevention
- Rate limiting on auth endpoints
- JWT-based authentication
- Secure password hashing with bcryptjs
- Protected API routes

### User Experience
- Responsive design (mobile, tablet, desktop)
- Debounced search with 500ms delay
- Error boundaries for graceful error handling
- Toast notifications for user feedback
- Loading states for all async operations
- Clean, modern UI with Tailwind CSS

## Tech Stack

### Frontend
- **Framework**: React 19
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v7
- **Authentication**: JWT (jwt-decode)
- **Build Tool**: Vite 7

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Password Hashing**: bcryptjs
- **Email Service**: Nodemailer
- **Security**: Helmet, express-rate-limit, xss
- **Environment**: dotenv

## Installation

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB
- Gmail account (for email functionality, optional)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/todo_app?retryWrites=true&w=majority
ACCESS_TOKEN_SECRET=your_access_token_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
PORT=8000
NODE_ENV=development
```

**Note**: For Gmail, generate an [App Password](https://support.google.com/accounts/answer/185833) for the EMAIL_PASS.

Start the backend:

```bash
npm start
```

Backend will run on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/registration` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/verify/:token` | Verify email |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user (protected) |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password/:token` | Reset password |

### Todo Routes (All Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get todos (supports filtering, searching, sorting) |
| POST | `/api/todos` | Create new todo |
| PUT | `/api/todos/:id` | Update todo |
| PATCH | `/api/todos/:id/toggle` | Toggle todo completion |
| DELETE | `/api/todos/:id` | Delete todo |
| DELETE | `/api/todos/clear-completed` | Delete all completed todos |

## Project Structure

```
Todo_FullStack_Project/
├── backend/
│   ├── config/
│   │   └── databaseConfig.js
│   ├── controller/
│   │   ├── authController.js
│   │   └── todoController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── sanitizationMiddleware.js
│   │   └── rateLimitMiddleware.js
│   ├── model/
│   │   ├── userModel.js
│   │   └── todoModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── todoRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── index.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   └── store.js
    │   ├── components/
    │   │   ├── ErrorBoundary.jsx
    │   │   ├── FormInput.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── Toast.jsx
    │   │   ├── TodoForm.jsx
    │   │   └── TodoItem.jsx
    │   ├── context/
    │   │   └── ToastContext.jsx
    │   ├── features/
    │   │   ├── auth/
    │   │   │   ├── authApi.js
    │   │   │   └── authSlice.js
    │   │   └── todos/
    │   │       ├── todoApi.js
    │   │       └── todoSlice.js
    │   ├── pages/
    │   │   ├── ForgotPassword.jsx
    │   │   ├── Login.jsx
    │   │   ├── Registration.jsx
    │   │   ├── ResetPassword.jsx
    │   │   ├── Todos.jsx
    │   │   └── VerifyEmail.jsx
    │   ├── utils/
    │   │   ├── debounce.js
    │   │   └── validation.js
    │   ├── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    └── package.json
```

## Security Considerations

1. **Secrets Management**: Never commit `.env` files. Use environment variables in production.
2. **HTTPS**: Always use HTTPS in production.
3. **Rate Limiting**: Auth endpoints are rate-limited (5 attempts per 15 minutes for login).
4. **Input Sanitization**: All inputs are sanitized to prevent XSS attacks.
5. **CORS**: Configured to only accept requests from allowed origins.
6. **Password Hashing**: Passwords are hashed with bcryptjs (10 salt rounds).
7. **Token Management**: Access tokens expire in 24 hours, refresh tokens in 365 days.

## Usage

### Registration
1. Go to `/register`
2. Fill in username, email, and password
3. Check email for verification link
4. Click link or use auto-verify fallback
5. Login with credentials

### Login
1. Go to `/login`
2. Enter email and password
3. Click "Sign In"

### Managing Todos
1. Add a new todo by typing in the input field
2. Click "Add Task" or press Enter
3. Click expand icon to add description, priority, and due date
4. Click checkbox to mark complete/incomplete
5. Use filters to view all, active, or completed todos
6. Use search to find specific todos
7. Use sort to organize by date, priority, etc.

## Environment Variables

### Backend (.env)

```
MONGO_URI          # MongoDB connection string (Atlas SRV recommended)
ACCESS_TOKEN_SECRET     # Secret key for access tokens (min 32 chars)
REFRESH_TOKEN_SECRET    # Secret key for refresh tokens (min 32 chars)
EMAIL_USER         # Email address for sending emails (Gmail recommended)
EMAIL_PASS         # App password for Gmail (not regular password)
CLIENT_URL         # Frontend URL (http://localhost:5173 for dev)
PORT               # Backend port (default: 8000)
NODE_ENV           # Environment (development/production)
```

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use environment variables from your hosting platform
3. Enable HTTPS
4. Set secure cookies: `secure: true`
5. Configure CORS for your production frontend URL
6. Use strong, unique secrets for tokens

### Frontend
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting
3. Update API base URL to production backend

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure DNS servers are configured (Windows users especially)

### Email Not Sending
- Check Gmail app password is correct
- Enable "Less secure app access" or use app password
- Verify EMAIL_USER and EMAIL_PASS in .env

### CORS Errors
- Ensure frontend URL is in `allowedOrigins` in backend/index.js
- Check CLIENT_URL environment variable

### Token Expiration
- Access token expires in 24 hours
- Refresh token in 365 days
- Frontend automatically refreshes access token

## Contributing

Pull requests welcome! Please ensure:
- Code follows existing style
- All features are tested
- Security best practices are followed
- Documentation is updated

## License

MIT

## Support

For issues, please create a GitHub issue with:
- Description of the problem
- Steps to reproduce
- Error messages or screenshots
- Environment details (OS, Node version, etc.)
