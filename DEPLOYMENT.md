# Frontend Deployment Guide for Render

## Prerequisites

1. **Backend API**: Ensure your backend is deployed and accessible
2. **GitHub Repository**: Your code should be in a GitHub repository

## Deployment Steps

### 1. Prepare Your Repository

Make sure your frontend code is in the `prokrishi-dev/frontend` directory of your repository.

### 2. Set Up Environment Variables

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `prokrishi-frontend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3. Add Environment Variables

In your Render service dashboard, go to "Environment" tab and add:

```
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://your-backend-app-name.onrender.com/api
```

**Important**: Replace `your-backend-app-name` with your actual backend service name.

### 4. Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Wait for the build to complete (this may take several minutes)
4. Your frontend will be available at: `https://your-app-name.onrender.com`

### 5. Test the Deployment

1. Visit your frontend URL
2. Test the main functionality:
   - Homepage loads correctly
   - Product browsing works
   - User registration/login works
   - Cart functionality works
   - Checkout process works

## Important Notes

- **Build Time**: Next.js builds can take 5-10 minutes on Render's free plan
- **Cold Starts**: Free plan services may have cold starts
- **API URL**: Ensure your backend URL is correct and accessible
- **Environment Variables**: Only variables prefixed with `NEXT_PUBLIC_` are accessible in the browser

## Troubleshooting

1. **Build Failures**: 
   - Check the build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **API Connection Issues**:
   - Verify `NEXT_PUBLIC_API_BASE_URL` is correct
   - Check that your backend is running
   - Test API endpoints directly

3. **CORS Issues**:
   - Ensure your backend CORS configuration includes your frontend URL
   - Check that both services are using HTTPS

4. **Image Loading Issues**:
   - Verify Cloudinary configuration in backend
   - Check image URLs in browser developer tools

## Post-Deployment Checklist

- [ ] Homepage loads without errors
- [ ] Product images display correctly
- [ ] User registration works
- [ ] User login works
- [ ] Product search works
- [ ] Add to cart functionality works
- [ ] Checkout process works
- [ ] Payment integration works (if applicable)
- [ ] Admin dashboard is accessible
- [ ] Mobile responsiveness works

## Performance Optimization

1. **Image Optimization**: Next.js automatically optimizes images
2. **Code Splitting**: Next.js handles this automatically
3. **Caching**: Render provides basic caching
4. **CDN**: Consider upgrading to a paid plan for better performance

## Next Steps

After successful deployment:
1. Set up a custom domain (optional)
2. Configure SSL certificates (automatic on Render)
3. Set up monitoring and analytics
4. Configure backup strategies
5. Set up CI/CD pipelines 