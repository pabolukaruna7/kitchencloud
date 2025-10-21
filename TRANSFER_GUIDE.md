# KitchenCloud Project Transfer Guide

## 📦 Files to Transfer (Copy These Folders/Files)

### ✅ **ROOT LEVEL FILES** (Copy All)

```
📁 kc/
├── 📁 .github/              # GitHub workflows
├── 📁 backend/              # Backend server code
├── 📁 frontend/             # React frontend code
├── 📄 .gitignore            # Git ignore rules
├── 📄 DEPLOYMENT.md         # Deployment instructions
├── 📄 README.md             # Project documentation
├── 📄 package.json          # Root package.json
├── 📄 vercel.json           # Vercel deployment config
├── 📄 netlify.toml          # Netlify deployment config
└── 📄 TRANSFER_GUIDE.md     # This file
```

### ✅ **BACKEND FILES** (Copy All Except node_modules)

```
📁 backend/
├── 📁 middleware/           # Auth middleware
├── 📁 models/              # MongoDB models
├── 📁 routes/              # API routes
├── 📁 uploads/             # Uploaded recipe images
├── 📄 .env                 # Environment variables
├── 📄 .env.example         # Environment template
├── 📄 package.json         # Backend dependencies
├── 📄 package-lock.json    # Dependency lock file
├── 📄 server.js            # Main server file
└── 📄 Procfile            # Heroku deployment
```

### ✅ **FRONTEND FILES** (Copy All Except node_modules)

```
📁 frontend/
├── 📁 public/              # Static files
├── 📁 src/                 # React source code
├── 📄 .gitignore           # Frontend gitignore
├── 📄 package.json         # Frontend dependencies
├── 📄 package-lock.json    # Dependency lock file
├── 📄 postcss.config.js    # PostCSS config
└── 📄 tailwind.config.js   # Tailwind CSS config
```

## ❌ **DO NOT COPY** (These Will Be Reinstalled)

```
📁 backend/node_modules/     # Backend packages (1.2GB+)
📁 frontend/node_modules/    # Frontend packages (800MB+)
📁 .venv/                   # Python virtual environment
📁 .vscode/                 # VS Code settings (optional)
```

## 🚀 **Setup Instructions for New Laptop**

### **Step 1: Prerequisites Installation**

```bash
# Install Node.js (v18 or higher)
# Download from: https://nodejs.org/

# Install Git
# Download from: https://git-scm.com/

# Verify installations
node --version
npm --version
git --version
```

### **Step 2: Copy Project Files**

1. Copy the entire `kc` folder to your new laptop
2. Exclude `node_modules` folders (they're huge!)
3. Place in: `C:\Users\[YourName]\Desktop\ReactProject\kc`

### **Step 3: Install Dependencies**

Open terminal in the project folder and run:

```bash
# Navigate to project
cd C:\Users\[YourName]\Desktop\ReactProject\kc

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Go back to root
cd ..
```

### **Step 4: Environment Setup**

The `.env` file is already included with your MongoDB credentials:

```
MONGODB_URI=mongodb+srv://recipeapp:RecipePass123@cluster0.b99cxke.mongodb.net/kitchencloud
JWT_SECRET=recipe-sharing-app-super-secret-jwt-key-2025-production-ready-secure-token-12345
NODE_ENV=development
PORT=5000
```

### **Step 5: Run the Application**

**Terminal 1 - Backend Server:**

```bash
cd backend
npm run dev
# Or: node server.js
```

**Terminal 2 - Frontend Server:**

```bash
cd frontend
npm start
```

**Access URLs:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📋 **Transfer Checklist**

- [ ] Copy entire `kc` folder (except node_modules)
- [ ] Install Node.js on new laptop
- [ ] Install Git on new laptop
- [ ] Run `npm install` in backend folder
- [ ] Run `npm install` in frontend folder
- [ ] Test backend: `cd backend && npm run dev`
- [ ] Test frontend: `cd frontend && npm start`
- [ ] Verify website works at http://localhost:3000
- [ ] Test user registration/login
- [ ] Test recipe creation with image upload

## 🛠 **If You Encounter Issues**

**Problem: "npm not found"**

- Install Node.js from nodejs.org

**Problem: "Cannot connect to MongoDB"**

- Check internet connection
- Verify .env file has correct MONGODB_URI

**Problem: "Port 5000 already in use"**

- Kill existing processes: `taskkill /F /IM node.exe`

**Problem: Missing dependencies**

- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

## 📁 **File Size Information**

- Project without node_modules: ~50MB
- Project with node_modules: ~2GB+
- Transfer time: 2-5 minutes (without node_modules)

## 🎯 **Quick Start Commands**

After copying files to new laptop:

```bash
# One-time setup
cd backend && npm install && cd ../frontend && npm install && cd ..

# Start both servers (run in separate terminals)
cd backend && npm run dev
cd frontend && npm start
```

Your KitchenCloud app will be ready in 5-10 minutes!
