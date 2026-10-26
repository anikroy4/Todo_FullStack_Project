# Getting Started - Todo FullStack Application

## Quick Start (Development Mode)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server (with hot reload via nodemon)
npm start
```

The backend will start on `http://localhost:8000` and will automatically restart when files change.

### 2. Frontend Setup (New Terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 3. Open in Browser

Open `http://localhost:5173` in your browser.

## Initial Setup Checklist

- [ ] Clone or download the project
- [ ] Copy `.env.example` to `.env` (if provided) or create `.env` with required variables
- [ ] MongoDB Atlas account created with cluster
- [ ] Gmail account with app password generated (optional, for email features)
- [ ] Backend dependencies installed (`npm install` in backend/)
- [ ] Frontend dependencies installed (`npm install` in frontend/)
- [ ] Backend started (`npm start` in backend/)
- [ ] Frontend started (`npm run dev` in frontend/)

## Environment Setup

### Backend .env File

Create `backend/.env` with these variables:

```env
# MongoDB Connection (Atlas recommended)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/todo_app?retryWrites=true&w=majority

# JWT Secrets (use strong random strings, min 32 chars each)
ACCESS_TOKEN_SECRET=your_long_random_access_secret_key_here_min_32_chars
REFRESH_TOKEN_SECRET=your_long_random_refresh_secret_key_here_min_32_chars

# Email Configuration (Gmail + App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password_from_gmail

# Frontend URL
CLIENT_URL=http://localhost:5173

# Server Port
PORT=8000

# Environment
NODE_ENV=development
```

### Get MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster
4. Click "Connect" → "Drivers" → "Node.js"
5. Copy the connection string and replace `<password>` and `<username>`

### Get Gmail App Password

1. Go to [Google Account](https://myaccount.google.com)
2. Click "Security" in the left menu
3. Enable 2-Step Verification if not done
4. Go back to Security → App passwords
5. Select Mail and Windows Computer
6. Copy the 16-character password (spaces removed)

## Test the Application

### User Registration Flow

1. Go to `http://localhost:5173/register`
2. Fill in: Username, Email, Password
3. Click "Create Account"
4. Check console for verification link (or email if configured)
5. Click verification link or go to provided link

### User Login

1. Go to `http://localhost:5173/login`
2. Enter email and password
3. Click "Sign In"
4. Should redirect to todo dashboard

### Todo Management

1. Click "+ Add a new task..."
2. Enter task title and click "Add Task"
3. Click task to expand and add:
   - Description
   - Priority (Low/Medium/High)
   - Due Date
4. Use checkboxes to mark complete/incomplete
5. Use filters to view All/Active/Completed
6. Search for specific todos
7. Click delete icon to remove todo

### Password Reset Flow

1. Click "Forgot?" on login page
2. Enter email
3. Check console for reset link (or email)
4. Click reset link
5. Enter new password twice
6. Click "Update Password"
7. Login with new password

## Development Commands

### Backend

```bash
# Start server with hot reload
npm start

# Run without nodemon (one-time execution)
node index.js

# Check health endpoint
curl http://localhost:8000/api/health
```

### Frontend

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

## API Testing

Use Postman, Insomnia, or curl to test endpoints.

### Example: Register User

```bash
curl -X POST http://localhost:8000/api/auth/registration \
  -H "Content-Type: application/json" \
  -d '{
    "username": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Example: Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

Response will include `accessToken` to use in subsequent requests.

### Example: Get Todos (Authenticated)

```bash
curl -X GET http://localhost:8000/api/todos \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Common Issues

### "Port 8000 already in use"
- Kill process on port 8000: `netstat -ano | findstr :8000` then `taskkill /PID <PID> /F`
- Or change PORT in `.env`

### "MongoDB connection failed"
- Check MONGO_URI is correct
- Check IP whitelist in MongoDB Atlas
- Verify internet connection

### "Email not sending"
- Verify EMAIL_USER and EMAIL_PASS are correct
- Check Gmail is using App Password (not regular password)
- Try disabling 2FA temporarily and using regular password

### "CORS error in browser"
- Frontend URL must be in `allowedOrigins` in `backend/index.js`
- Check CLIENT_URL in `.env` matches frontend port

### "404 on todo creation"
- Ensure you're authenticated (have access token)
- Check Authorization header format: `Bearer TOKEN`
- Verify backend is running on correct port

## File Structure Quick Reference

```
backend/
├── index.js              ← Main server file
├── .env                  ← Environment variables
├── controller/           ← Business logic
├── routes/               ← API endpoints
├── model/                ← Database schemas
└── middleware/           ← Auth, rate limit, sanitization

frontend/
├── src/
│   ├── pages/            ← Page components
│   ├── components/       ← Reusable components
│   ├── features/         ← Redux slices
│   ├── utils/            ← Helper functions
│   └── api.js            ← API client config
└── dist/                 ← Production build (after npm run build)
```

## Next Steps

1. **Explore the UI** - Understand the design and user flows
2. **Review the code** - Read through components to understand architecture
3. **Modify settings** - Adjust styling, add features
4. **Production deployment** - Follow deployment guide for live deployment
5. **Add features** - Extend with categories, tags, sharing, etc.

## Production Deployment

For deployment to production, see README.md section "Production Deployment" for:
- Environment variable configuration
- Database setup on production server
- Frontend build and hosting
- Backend server deployment
- HTTPS/SSL setup
- Security configuration

## Support & Documentation

- **Full API Documentation**: See README.md
- **Architecture Overview**: See README.md "Tech Stack"
- **Security Considerations**: See README.md "Security Features"
- **Troubleshooting**: See this document's "Common Issues" section

## Need Help?

- Check console errors (browser F12 or terminal)
- Verify .env file has all required variables
- Ensure ports 5173 (frontend) and 8000 (backend) are available
- Check that MongoDB is accessible
- Review error messages in server console
