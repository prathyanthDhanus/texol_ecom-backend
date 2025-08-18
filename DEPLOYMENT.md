# 🚀 Vercel Backend Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Git repository set up
- Vercel account
- MongoDB Atlas database (for production)
- Cloudinary account

## Environment Variables Required

Set these in your Vercel dashboard:

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
CLIENT_URL=https://your-frontend-domain.netlify.app
```

## Deployment Steps

### Method 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Method 2: Deploy via Vercel UI

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your repository

3. **Configure Project**
   - **Framework Preset**: Node.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Set Environment Variables**
   - Add all required environment variables
   - Ensure MongoDB URL is from Atlas
   - Set CLIENT_URL to your Netlify frontend URL

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## Post-Deployment Configuration

### 1. Update Frontend API URL
Update your frontend's environment variable:
```
VITE_API_BASE_URL=https://your-vercel-backend-url.vercel.app/api/v1
```

### 2. Update CORS Configuration
Ensure your backend allows requests from your frontend domain.

### 3. Test API Endpoints
Verify all API endpoints are working correctly.

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
- Check Node.js version
- Verify all dependencies are installed
- Check for TypeScript errors

### Database Connection Issues
- Verify MongoDB Atlas connection string
- Check IP whitelist settings
- Ensure database user has correct permissions

### CORS Errors
- Update CORS configuration to allow frontend domain
- Check environment variables

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

## Security

### 1. Environment Variables
- Never commit sensitive data
- Use Vercel environment variables
- Rotate secrets regularly

### 2. HTTPS
- Vercel provides free SSL certificates
- Force HTTPS in production

### 3. API Security
- Implement rate limiting
- Use proper authentication
- Validate all inputs

## Monitoring

### 1. Vercel Analytics
- Monitor function execution times
- Track API usage
- Set up alerts

### 2. Error Tracking
- Implement proper error logging
- Monitor for failures
- Set up notifications

## Support

If you encounter issues:
1. Check Vercel documentation
2. Review build logs
3. Verify configuration files
4. Test locally first
5. Contact Vercel support if needed
