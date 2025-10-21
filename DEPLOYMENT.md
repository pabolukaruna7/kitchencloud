# Deployment Configuration

## Frontend (React)
- Platform: Netlify
- Build command: npm run build
- Publish directory: frontend/build
- Base directory: frontend

## Backend (Node.js/Express)
- Platform: Railway/Vercel
- Build command: npm install
- Start command: npm start

## Environment Variables Needed:
- MONGODB_URI: Your MongoDB Atlas connection string
- JWT_SECRET: Your JWT secret key
- NODE_ENV: production