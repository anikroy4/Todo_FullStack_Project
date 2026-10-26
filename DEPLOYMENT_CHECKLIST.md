# Production Deployment Checklist

Use this checklist to ensure your Todo application is ready for production deployment.

## Pre-Deployment Security Review

### Backend Security
- [ ] `.env` file is NOT committed to git
- [ ] `.gitignore` includes `.env`, `node_modules/`, `*.log`
- [ ] `NODE_ENV` is set to `production`
- [ ] All secrets in `.env` are strong and unique (min 32 characters for JWT secrets)
- [ ] `CORS` configuration restricts to production frontend URL only
- [ ] `secure: true` is set for cookies in production environment
- [ ] HTTPS/SSL is enabled on production server
- [ ] Rate limiting is enforced on auth endpoints
- [ ] Input sanitization middleware is active
- [ ] Helmet.js security headers are enabled

### Frontend Security
- [ ] No credentials or secrets in code
- [ ] API base URL points to production backend
- [ ] Environment variables use `.env.production` or `.env` file
- [ ] JWT tokens are stored securely (localStorage/sessionStorage)
- [ ] No console.log statements in production code (or wrapped with dev check)
- [ ] Build has been tested: `npm run build`
- [ ] Dist folder contents are production-ready

## Database Preparation

### MongoDB
- [ ] Production MongoDB cluster is created and configured
- [ ] IP whitelist includes production server IP
- [ ] Database user has limited permissions (not admin)
- [ ] Connection string uses `retryWrites=true&w=majority`
- [ ] Database backups are configured
- [ ] Connection pooling is optimized
- [ ] Index on `user` field in todos collection for performance

```javascript
// Check indexes in MongoDB:
db.todos.createIndex({ user: 1 })
```

## Backend Deployment

### Server Preparation
- [ ] Node.js v16+ installed on production server
- [ ] npm or yarn installed and updated
- [ ] Process manager installed (PM2, systemd, or Docker)
- [ ] SSL/TLS certificate installed
- [ ] Firewall configured to allow port 80/443

### Environment Setup
```bash
# Create .env on production server with:
MONGO_URI=<production_mongodb_url>
ACCESS_TOKEN_SECRET=<strong_random_32char_secret>
REFRESH_TOKEN_SECRET=<strong_random_32char_secret>
EMAIL_USER=<production_email>
EMAIL_PASS=<production_email_password>
CLIENT_URL=https://yourdomain.com
PORT=8000
NODE_ENV=production
```

### Deployment Steps
- [ ] Clone or pull latest code from git
- [ ] Run `npm install --production` to install only production dependencies
- [ ] Test backend: `node index.js` (should start without errors)
- [ ] Configure process manager (PM2 example):

```bash
npm install -g pm2
pm2 start index.js --name "todo-backend"
pm2 save
pm2 startup
```

- [ ] Configure reverse proxy (Nginx):

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- [ ] Test backend health: `curl https://api.yourdomain.com/api/health`

## Frontend Deployment

### Build Production Bundle
- [ ] Run `npm run build` successfully
- [ ] Check dist/ folder contains:
  - [ ] index.html
  - [ ] assets/ folder with CSS and JS files
- [ ] Build size is reasonable (< 500 kB gzipped)
- [ ] No build warnings or errors

### Hosting Preparation
- [ ] Hosting provider selected (Vercel, Netlify, AWS, etc.)
- [ ] Custom domain configured
- [ ] SSL/TLS certificate provisioned
- [ ] Environment configured to use production backend URL

### Deployment Steps (Example for Vercel)
- [ ] Connect git repository to Vercel
- [ ] Configure environment variables:
  - [ ] `VITE_API_URL=https://api.yourdomain.com/api`
- [ ] Deploy: `vercel --prod` or push to git
- [ ] Test frontend loads correctly
- [ ] Test API calls reach production backend

### Deployment Steps (Example for Self-Hosted)
- [ ] Build frontend: `npm run build`
- [ ] Upload dist/ folder to web server
- [ ] Configure web server to serve dist/index.html for all routes
- [ ] Test all routes load correctly (refresh page should work)
- [ ] Configure redirect to HTTPS

## Post-Deployment Verification

### Functional Testing
- [ ] Frontend loads without errors
- [ ] User can register
- [ ] Email verification works (or auto-verifies)
- [ ] User can login
- [ ] User can create todo
- [ ] User can edit todo
- [ ] User can mark todo complete/incomplete
- [ ] User can delete todo
- [ ] User can filter todos
- [ ] User can search todos
- [ ] User can logout
- [ ] User can reset password
- [ ] All 13 API endpoints respond correctly

### Performance Testing
- [ ] Page load time is acceptable (< 3 seconds)
- [ ] Frontend bundle size is optimized
- [ ] API response times are acceptable (< 500ms)
- [ ] Database queries are fast (< 200ms)
- [ ] No memory leaks in browser console

### Security Testing
- [ ] HTTPS works and redirects HTTP
- [ ] No sensitive data in browser console
- [ ] Rate limiting works (try rapid login attempts)
- [ ] CORS rejects cross-origin requests
- [ ] XSS attack attempts are blocked
- [ ] CSRF protection is active

### Error Handling
- [ ] Errors display user-friendly messages
- [ ] No sensitive error details in UI
- [ ] Server errors are logged on backend
- [ ] 404 errors handled gracefully
- [ ] Network errors have retry mechanism

## Monitoring & Maintenance

### Logging
- [ ] Server logs are captured and archived
- [ ] Error monitoring tool installed (Sentry, LogRocket, etc.)
- [ ] Performance monitoring enabled
- [ ] User analytics configured (optional)

### Backups
- [ ] Automated database backups scheduled
- [ ] Backup retention policy set (7-30 days)
- [ ] Code repository backed up
- [ ] Disaster recovery plan documented

### Updates
- [ ] Security patches monitoring enabled
- [ ] Dependency updates tracked
- [ ] Update schedule established
- [ ] Testing procedure for updates documented

## Scaling Preparation

### High Traffic Readiness
- [ ] Database connection pooling configured
- [ ] Redis caching considered for sessions/tokens
- [ ] CDN configured for static assets
- [ ] Load balancer configured (if needed)
- [ ] Auto-scaling rules set up (cloud deployment)

### Optimization
- [ ] Images compressed and optimized
- [ ] Code splitting implemented
- [ ] Caching headers configured
- [ ] Gzip compression enabled
- [ ] Database indexes optimized

## Post-Deployment Maintenance Schedule

### Daily
- [ ] Check error logs for critical issues
- [ ] Verify application is accessible
- [ ] Monitor uptime status

### Weekly
- [ ] Review user reports and feedback
- [ ] Check performance metrics
- [ ] Review security logs

### Monthly
- [ ] Update dependencies
- [ ] Review and optimize database
- [ ] Backup verification
- [ ] Security audit
- [ ] Performance analysis

### Quarterly
- [ ] Full security review
- [ ] Load testing
- [ ] Disaster recovery drill
- [ ] Capacity planning review

## Rollback Plan

In case of deployment issues:

1. **Identify Issue**
   - Check error logs
   - Test API endpoints
   - Check frontend functionality

2. **Quick Fix**
   - Hotfix if issue is simple (usually in frontend)
   - Redeploy updated code

3. **Rollback if Critical**
   ```bash
   # For PM2 backend:
   pm2 restart todo-backend
   
   # For Git-based deployment:
   git revert <commit-hash>
   npm run build
   # Redeploy
   ```

4. **Post-Incident Review**
   - Document what went wrong
   - Update deployment procedures
   - Add tests to prevent recurrence

## Support Contacts

| Role | Contact | Phone |
|------|---------|-------|
| DevOps | | |
| Database Admin | | |
| Frontend Lead | | |
| Backend Lead | | |

## Sign-off

- [ ] Project Lead: _________________ Date: _______
- [ ] DevOps/SysAdmin: _________________ Date: _______
- [ ] QA: _________________ Date: _______

## Notes

_Add any additional notes or considerations for your specific deployment:_

```
[Your notes here]
```

---

**Last Updated**: [Date]
**Deployed Version**: [Version]
**Production URL**: [URL]
