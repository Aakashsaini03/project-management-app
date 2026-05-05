# 🚀 Railway Deployment Guide

This guide walks you through deploying the Project Management App on Railway.

## Prerequisites

- GitHub account with the repository pushed
- Railway account (free tier available)
- PostgreSQL database (Railway provides this)

## Step-by-Step Deployment

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click "Start Free" or "Login"
3. Sign up using your GitHub account (recommended)
4. Authorize Railway to access your GitHub repositories

### Step 2: Create a New Project

1. Click **"New Project"** in your Railway dashboard
2. Select **"Deploy from GitHub repo"**
3. Select your GitHub organization/user and authorize if needed
4. Find and select the **`project-management-app`** repository
5. Click **"Deploy Now"**

### Step 3: Add PostgreSQL Database

1. In your Railway project, click **"Add a service"**
2. Search for and select **"PostgreSQL"**
3. Railway will automatically create a PostgreSQL instance
4. The `DATABASE_URL` environment variable will be auto-generated

### Step 4: Configure Environment Variables

1. In your Railway project dashboard, go to the **Node.js service**
2. Click on the **"Variables"** tab
3. Add the following environment variables:

| Key | Value | Example |
|-----|-------|----------|
| `JWT_SECRET` | Your secret key (change this!) | `your_super_secret_key_12345` |
| `NODE_ENV` | Set to production | `production` |
| `PORT` | (Optional) Leave empty - Railway sets this automatically | - |

**Important:** The `DATABASE_URL` is auto-injected by Railway when you add the PostgreSQL service.

### Step 5: Deploy

1. Railway automatically deploys on every GitHub push
2. Monitor deployment progress in the **"Deployments"** tab
3. Once deployed, you'll see a URL like: `https://project-management-app-production.up.railway.app`

### Step 6: Initialize Database

After deployment, you need to initialize the database tables:

#### Option A: Using Railway Shell (Recommended)

1. In your Railway project, click on the **Node.js service**
2. Go to the **"Terminal"** tab
3. Run the initialization script:
   ```bash
   npm run init-db
   ```

#### Option B: Using SSH/Remote Command

1. Get the deployment URL from Railway
2. Call the health endpoint to verify the app is running:
   ```bash
   curl https://your-railway-url/health
   ```
3. Access the Railway Metrics/Logs to ensure it's running

### Step 7: Verify Deployment

1. Test the health endpoint:
   ```bash
   curl https://your-railway-url/health
   ```

   Expected response:
   ```json
   {"status": "Server is running"}
   ```

2. Test signup:
   ```bash
   curl -X POST https://your-railway-url/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

3. You should receive a response with a token

## Environment Variables Reference

### Required Variables

```
DATABASE_URL=postgresql://user:password@host:port/database
  - Automatically provided by Railway PostgreSQL plugin

JWT_SECRET=your_super_secret_jwt_key
  - Set a strong, random string
  - Change from the default before production
  - Use a cryptographically secure random string

NODE_ENV=production
  - Set to "production" for Railway deployment
  - Enables SSL for database connections

JWT_EXPIRY=7d
  - Token expiration time (optional, defaults to 7d)
```

### Optional Variables

```
CORS_ORIGIN=https://your-frontend-url.com
  - If deploying a separate frontend
  - Defaults to allow all origins (not recommended for production)
```

## Troubleshooting

### Issue: 503 Service Unavailable

**Cause:** Database not initialized or connection error

**Solution:**
1. Check Railway logs: Go to your Node.js service → Logs
2. Verify DATABASE_URL is set in environment variables
3. Run `npm run init-db` in the Railway terminal

### Issue: Database Connection Error

**Cause:** Database not initialized or wrong connection string

**Solution:**
```bash
# In Railway Terminal
npm run init-db
```

### Issue: 401 Unauthorized on Protected Routes

**Cause:** Invalid or missing JWT token

**Solution:**
1. Get a valid token via login/signup
2. Include token in Authorization header: `Authorization: Bearer <token>`

### Issue: CORS Error from Frontend

**Cause:** Frontend URL not in CORS_ORIGIN

**Solution:**
1. Add your frontend URL to CORS_ORIGIN in Railway environment variables
2. Or update the CORS configuration in `src/index.js`

### Issue: Logs Show "Cannot Find Module"

**Cause:** Dependencies not installed

**Solution:**
Railway should auto-install dependencies from `package.json`. If not:
1. Check `package.json` is in the root directory
2. Trigger a redeploy from the Railway dashboard

## Production Best Practices

### 1. Security
- ✅ Use a strong, random `JWT_SECRET`
- ✅ Set `NODE_ENV=production`
- ✅ Enable CORS only for trusted domains
- ✅ Keep sensitive data in environment variables
- ✅ Never commit `.env` files to GitHub

### 2. Database
- ✅ Regular backups (Railway provides automated backups)
- ✅ Monitor database performance in Railway dashboard
- ✅ Use SSL for database connections (automatic on Railway)

### 3. Monitoring
- ✅ Check logs regularly for errors
- ✅ Monitor deployment status
- ✅ Set up alerts for service downtime
- ✅ Track API response times

### 4. Scaling
- ✅ Monitor resource usage
- ✅ Upgrade Railway plan if needed
- ✅ Optimize database queries
- ✅ Consider caching strategies

## Updating the App

Every time you push to GitHub:

1. Railway automatically detects changes
2. Pulls the latest code
3. Installs dependencies from `package.json`
4. Deploys the new version
5. App is live in ~2-3 minutes

No manual deployment steps needed!

## Viewing Logs

1. Go to your Railway project
2. Click on the **Node.js service**
3. Go to the **"Logs"** tab
4. Filter by:
   - Service
   - Timestamp
   - Log level

## Custom Domain (Optional)

1. Go to your Railway project → Domain
2. Click **"Add Domain"**
3. Choose between:
   - Railway domain: `your-app.railway.app`
   - Custom domain: Connect your own domain
4. Follow the DNS configuration instructions

## Rollback

If you need to go back to a previous version:

1. Go to **"Deployments"** tab
2. Find the deployment you want to rollback to
3. Click **"Redeploy"**

Railway will redeploy that specific version of your code.

## Support & Resources

- **Railway Docs:** https://docs.railway.app
- **Railway Community:** https://railway.app/community
- **GitHub Issues:** Report issues in your repository

## Cost Estimation

**Railway Pricing:**
- Free tier: $5/month credit (includes Node.js + PostgreSQL)
- Pay-as-you-go: After free tier is used
- Typical small project: $5-15/month

Check [railway.app/pricing](https://railway.app/pricing) for current rates.

---

**Your app is now live! 🎉**

Your Railway deployment URL: `https://project-management-app-production.up.railway.app`

Start using the API with the documented endpoints in [API.md](./API.md)
