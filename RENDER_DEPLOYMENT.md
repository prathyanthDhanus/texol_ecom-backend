# 🚀 Render Backend Deployment Guide

## Prerequisites
- Node.js 18+ compatible
- Git repository set up
- Render account
- MongoDB Atlas database
- Cloudinary account

## Environment Variables Required

Set these in your Render dashboard:

### Database
```
MONGODB_URL=your_mongodb_atlas_connection_string
```

### JWT Secrets
```
ADMIN_SECRET_KEY=your_admin_secret_key_here
USER_SECRET_KEY=your_user_secret_key_here
```

### Cloudinary Configuration
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Server Configuration
```
NODE_ENV=production
CLIENT_URL=https://superlative-seahorse-a01c14.netlify.app
PORT=10000
```

## Deployment Steps

### Method 1: Deploy via Render Dashboard

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Sign up/Login with your GitHub account
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository

3. **Configure the Web Service**
   - **Name**: `texol-ecom-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose a paid plan)

4. **Set Environment Variables**
   - Click "Environment" tab
   - Add all required environment variables listed above

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete

### Method 2: Deploy via render.yaml (Infrastructure as Code)

1. **Ensure render.yaml is in your repository**
   - The file is already created in the root directory

2. **Deploy via Render Dashboard**
   - Go to Render dashboard
   - Click "New +" and select "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect and use the render.yaml file

## Post-Deployment Configuration

### 1. Update Frontend API URL
Update your frontend's environment variable in Netlify:
```
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com/api/v1
```

### 2. Test API Endpoints
- Health check: `https://your-render-backend-url.onrender.com/api/v1/health`
- Test your frontend connection

## Important Notes

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace `<password>` with your database password
5. Add your IP address to the whitelist (or use 0.0.0.0/0 for all IPs)

### Cloudinary Setup
1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Set these in your environment variables

### JWT Secrets
Generate strong, unique secrets for both admin and user tokens.

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies are installed
- Check for TypeScript errors

### Database Connection Issues
- Verify MongoDB Atlas connection string
- Check IP whitelist settings
- Ensure database user has correct permissions

### Environment Variables
- Ensure all required variables are set
- Check for typos in variable names
- Verify values are correct

## Performance Optimization

### 1. Database Optimization
- Use MongoDB Atlas for better performance
- Implement proper indexing
- Use connection pooling

### 2. Caching
- Implement Redis for session storage
- Cache frequently accessed data

### 3. CDN
- Use Cloudinary CDN for images
- Configure proper cache headers

## Monitoring

### 1. Render Analytics
- Monitor function execution times
- Track API usage
- Set up alerts

### 2. Error Tracking
- Implement proper error logging
- Monitor for failures
- Set up notifications

## Support

If you encounter issues:
1. Check Render documentation
2. Review build logs
3. Verify configuration files
4. Test locally first
5. Contact Render support if needed
