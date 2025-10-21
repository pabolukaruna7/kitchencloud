# KitchenCloud - MERN Stack

A comprehensive cloud-based recipe sharing application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring JWT authentication, recipe management, and social interactions. Store and access your recipes anywhere with KitchenCloud!

## 🌟 Features

- **User Authentication**: JWT-based secure login and signup
- **Recipe Management**: Create, read, update, and delete recipes
- **Social Features**: Like recipes, add comments, and share
- **Search & Filter**: Find recipes by name, ingredients, cuisine, type, and difficulty
- **Responsive Design**: Beautiful UI with Tailwind CSS
- **File Upload**: Upload recipe photos using Multer
- **Real-time Interactions**: Like and comment on recipes

## 🛠 Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### Frontend

- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Context API** - State management

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd kc
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env file with your configuration
```

#### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/recipe-sharing
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_EXPIRE=30d

# Optional: Cloudinary (for cloud storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

### 4. Database Setup

Make sure MongoDB is running on your system:

- **Local MongoDB**: Start MongoDB service
- **MongoDB Atlas**: Update the MONGODB_URI in your .env file

### 5. Running the Application

#### Option 1: Using VS Code Tasks (Recommended)

1. Open the project in VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Tasks: Run Task"
4. Select "Start Full Stack App"

This will start both backend and frontend servers simultaneously.

#### Option 2: Manual Start

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📱 Usage Guide

### User Authentication

1. **Register**: Create a new account with name, email, and password
2. **Login**: Sign in with your credentials
3. **Protected Routes**: Add recipes, like, and comment features require authentication

### Recipe Management

1. **View Recipes**: Browse all recipes on the homepage
2. **Search & Filter**: Use the search bar and filters to find specific recipes
3. **Add Recipe**: Click "Add Recipe" to create a new recipe with:

   - Recipe name and description
   - Ingredients list (comma-separated)
   - Cooking instructions
   - Photo upload
   - Servings and cooking time
   - Cuisine type, recipe type, and difficulty level

4. **Edit Recipe**: Recipe owners can edit their recipes
5. **Delete Recipe**: Recipe owners can delete their recipes

### Social Features

1. **Like Recipes**: Click the heart icon to like/unlike recipes
2. **Comment**: Add comments to recipes (requires login)
3. **Share**: Share recipe links via social media or copy to clipboard

## 🗂 Project Structure

```
kc/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Recipe.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── recipes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/          # Recipe images
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── Navbar.js
│   │   │   └── RecipeCard.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── AddRecipe.js
│   │   │   ├── EditRecipe.js
│   │   │   ├── RecipeDetail.js
│   │   │   └── MyRecipes.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Recipes

- `GET /api/recipes` - Get all recipes (with search/filter)
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create new recipe (auth required)
- `PUT /api/recipes/:id` - Update recipe (auth required)
- `DELETE /api/recipes/:id` - Delete recipe (auth required)
- `PUT /api/recipes/:id/like` - Toggle like (auth required)
- `POST /api/recipes/:id/comment` - Add comment (auth required)
- `GET /api/recipes/user/my-recipes` - Get user's recipes (auth required)

## 🔍 Search & Filter Options

- **Search**: By recipe name or ingredients
- **Cuisine Type**: Indian, Italian, Chinese, Mexican, Thai, American, French, Japanese, Mediterranean, Other
- **Recipe Type**: Vegetarian, Non-Vegetarian, Vegan, Dessert, Appetizer, Main Course, Beverage
- **Difficulty Level**: Easy, Medium, Hard

## 🚨 Troubleshooting

### Common Issues

1. **"Server Error" During Authentication**

   **Symptom**: Getting "server error" when trying to sign in/register users

   **Cause**: MongoDB connection failure (ECONNREFUSED error)

   **Solutions**:

   **Option A: Use MongoDB Atlas (Recommended - No Installation Required)**

   ```bash
   # 1. Visit https://www.mongodb.com/atlas
   # 2. Create a free account and cluster
   # 3. Get your connection string
   # 4. Update backend/.env file:
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/recipe-sharing?retryWrites=true&w=majority
   ```

   **Option B: Install MongoDB Locally**

   ```bash
   # Windows:
   # Download from https://www.mongodb.com/try/download/community
   # After installation, start service as Administrator:
   net start MongoDB

   # macOS:
   brew tap mongodb/brew && brew install mongodb-community
   brew services start mongodb/brew/mongodb-community

   # Linux (Ubuntu/Debian):
   sudo apt-get install mongodb
   sudo systemctl start mongod
   ```

2. **Port Already in Use Error**

   ```bash
   # Windows - Find and kill process using port 5000:
   netstat -ano | findstr :5000
   taskkill /F /PID <process-id>

   # macOS/Linux:
   lsof -ti:5000 | xargs kill -9
   ```

   Alternative: Change PORT in backend/.env file to use different port

3. **MongoDB Connection Error**

   - Ensure MongoDB is running locally or Atlas connection string is correct
   - Check the MONGODB_URI in your .env file
   - For MongoDB Atlas, ensure your IP is whitelisted
   - Verify network connectivity

4. **CORS Issues**

   - Ensure the backend CORS is configured correctly
   - Check the proxy setting in frontend package.json

5. **File Upload Issues**

   - Ensure the uploads/ directory exists in backend
   - Check file size limits (default: 5MB)

6. **JWT Token Issues**
   - Ensure JWT_SECRET is set in .env
   - Check token expiration settings

### Development Tips

- Use VS Code with ES7+ React/Redux/React-Native snippets extension
- Install MongoDB Compass for database management
- Use Postman for API testing
- Check browser console for frontend errors
- Check terminal logs for backend errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed information

## 🎯 Future Enhancements

- [ ] Recipe rating system
- [ ] User profiles and following
- [ ] Recipe collections/favorites
- [ ] Advanced search with nutritional information
- [ ] Recipe recommendations
- [ ] Mobile app development
- [ ] Email notifications
- [ ] Recipe printing functionality
- [ ] Ingredient shopping list generation

---

**Happy Cooking! 👨‍🍳👩‍🍳**
