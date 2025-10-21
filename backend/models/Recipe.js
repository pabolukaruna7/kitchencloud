const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: [true, "Comment text is required"],
    trim: true,
    maxlength: [500, "Comment cannot exceed 500 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Recipe name is required"],
    trim: true,
    maxlength: [100, "Recipe name cannot exceed 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Recipe description is required"],
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },
  ingredients: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  steps: {
    type: String,
    required: [true, "Cooking steps are required"],
    trim: true,
  },
  image: {
    type: String,
    default: "",
  },
  servings: {
    type: Number,
    required: [true, "Number of servings is required"],
    min: [1, "Servings must be at least 1"],
    max: [50, "Servings cannot exceed 50"],
  },
  cookingTime: {
    type: Number,
    required: [true, "Cooking time is required"],
    min: [1, "Cooking time must be at least 1 minute"],
  },
  cuisineType: {
    type: String,
    required: [true, "Cuisine type is required"],
    enum: [
      "Indian",
      "Italian",
      "Chinese",
      "Mexican",
      "Thai",
      "American",
      "French",
      "Japanese",
      "Mediterranean",
      "Other",
    ],
  },
  recipeType: {
    type: String,
    required: [true, "Recipe type is required"],
    enum: [
      "Veg",
      "Non-Veg",
      "Vegan",
      "Dessert",
      "Appetizer",
      "Main Course",
      "Beverage",
    ],
  },
  difficulty: {
    type: String,
    required: [true, "Difficulty level is required"],
    enum: ["Easy", "Medium", "Hard"],
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  likesCount: {
    type: Number,
    default: 0,
  },
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
recipeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Update likes count when likes array changes
recipeSchema.pre("save", function (next) {
  this.likesCount = this.likes.length;
  next();
});

module.exports = mongoose.model("Recipe", recipeSchema);
