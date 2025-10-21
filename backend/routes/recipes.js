const express = require("express");
const multer = require("multer");
const path = require("path");
const { body, validationResult } = require("express-validator");
const Recipe = require("../models/Recipe");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "recipe-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// @route   GET /api/recipes
// @desc    Get all recipes with search and filter
// @access  Public
router.get("/", async (req, res) => {
  try {
    const {
      search,
      cuisine,
      type,
      difficulty,
      page = 1,
      limit = 12,
    } = req.query;

    // Build query
    let query = {};

    // Search by name or ingredients
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { ingredients: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Filter by cuisine type
    if (cuisine && cuisine !== "all") {
      query.cuisineType = cuisine;
    }

    // Filter by recipe type
    if (type && type !== "all") {
      query.recipeType = type;
    }

    // Filter by difficulty
    if (difficulty && difficulty !== "all") {
      query.difficulty = difficulty;
    }

    // Calculate pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Get recipes with pagination
    const recipes = await Recipe.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    // Get total count for pagination
    const total = await Recipe.countDocuments(query);
    const totalPages = Math.ceil(total / limitNumber);

    res.json({
      success: true,
      data: recipes,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/recipes/:id
// @desc    Get single recipe
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("author", "name email")
      .populate("comments.user", "name");

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/recipes
// @desc    Create new recipe
// @access  Private
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    console.log("Received recipe data:", req.body);
    console.log("Received file:", req.file);

    const {
      name,
      description,
      ingredients,
      steps,
      servings,
      cookingTime,
      cuisineType,
      recipeType,
      difficulty,
    } = req.body;

    // Handle ingredients array (if sent as string)
    let ingredientsArray = ingredients;
    if (typeof ingredients === "string") {
      try {
        // First clean up escaped newlines and other escape characters
        const cleanIngredients = ingredients
          .replace(/\\n/g, "\n")
          .replace(/\\\\/g, "\\");
        ingredientsArray = JSON.parse(cleanIngredients);

        // Clean up each ingredient by removing extra newlines and trimming
        ingredientsArray = ingredientsArray
          .map((ingredient) => ingredient.replace(/\n/g, " ").trim())
          .filter((ingredient) => ingredient.length > 0);

        console.log("Parsed ingredients:", ingredientsArray);
      } catch (e) {
        console.log("JSON parse failed, trying comma split:", e.message);
        ingredientsArray = ingredients
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
      }
    } // Manual validation after parsing ingredients
    const validationErrors = [];

    if (!name || name.trim().length < 2 || name.trim().length > 100) {
      validationErrors.push({
        field: "name",
        message: "Recipe name must be between 2 and 100 characters",
      });
    }

    if (
      !description ||
      description.trim().length < 10 ||
      description.trim().length > 1000
    ) {
      validationErrors.push({
        field: "description",
        message: "Description must be between 10 and 1000 characters",
      });
    }

    if (
      !ingredientsArray ||
      !Array.isArray(ingredientsArray) ||
      ingredientsArray.length === 0
    ) {
      validationErrors.push({
        field: "ingredients",
        message: "At least one ingredient is required",
      });
    }

    if (!steps || steps.trim().length < 10) {
      validationErrors.push({
        field: "steps",
        message: "Cooking steps must be at least 10 characters",
      });
    }

    const servingsNum = parseInt(servings);
    if (!servingsNum || servingsNum < 1 || servingsNum > 50) {
      validationErrors.push({
        field: "servings",
        message: "Servings must be between 1 and 50",
      });
    }

    const cookingTimeNum = parseInt(cookingTime);
    if (!cookingTimeNum || cookingTimeNum < 1) {
      validationErrors.push({
        field: "cookingTime",
        message: "Cooking time must be at least 1 minute",
      });
    }

    const validCuisines = [
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
    ];
    if (!validCuisines.includes(cuisineType)) {
      validationErrors.push({
        field: "cuisineType",
        message: "Please select a valid cuisine type",
      });
    }

    const validTypes = [
      "Veg",
      "Non-Veg",
      "Vegan",
      "Dessert",
      "Appetizer",
      "Main Course",
      "Beverage",
    ];
    if (!validTypes.includes(recipeType)) {
      validationErrors.push({
        field: "recipeType",
        message: "Please select a valid recipe type",
      });
    }

    const validDifficulties = ["Easy", "Medium", "Hard"];
    if (!validDifficulties.includes(difficulty)) {
      validationErrors.push({
        field: "difficulty",
        message: "Please select a valid difficulty level",
      });
    }

    if (validationErrors.length > 0) {
      console.log("Validation errors found:", validationErrors);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    } // Create recipe object
    const recipeData = {
      name: name.trim(),
      description: description.trim(),
      ingredients: ingredientsArray,
      steps: steps.trim(),
      servings: parseInt(servings),
      cookingTime: parseInt(cookingTime),
      cuisineType,
      recipeType,
      difficulty,
      author: req.user.id,
    };

    // Add image if uploaded
    if (req.file) {
      recipeData.image = req.file.filename;
    }

    const recipe = await Recipe.create(recipeData);

    // Populate author information
    await recipe.populate("author", "name email");

    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      data: recipe,
    });
  } catch (error) {
    console.error("Recipe creation error:", error);

    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   PUT /api/recipes/:id
// @desc    Update recipe
// @access  Private
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    // Check if user owns the recipe
    if (recipe.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this recipe",
      });
    }

    // Update recipe data
    const updateData = { ...req.body };

    // Handle ingredients array
    if (updateData.ingredients && typeof updateData.ingredients === "string") {
      updateData.ingredients = updateData.ingredients
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
    }

    // Add new image if uploaded
    if (req.file) {
      updateData.image = req.file.filename;
    }

    recipe = await Recipe.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("author", "name email");

    res.json({
      success: true,
      message: "Recipe updated successfully",
      data: recipe,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   DELETE /api/recipes/:id
// @desc    Delete recipe
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    // Check if user owns the recipe
    if (recipe.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this recipe",
      });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/recipes/:id/like
// @desc    Toggle like on recipe
// @access  Private
router.put("/:id/like", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    // Check if user already liked the recipe
    const likeIndex = recipe.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      // Remove like
      recipe.likes.splice(likeIndex, 1);
    } else {
      // Add like
      recipe.likes.push(req.user.id);
    }

    await recipe.save();

    res.json({
      success: true,
      message: likeIndex > -1 ? "Like removed" : "Recipe liked",
      likesCount: recipe.likesCount,
      liked: likeIndex === -1,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/recipes/:id/comment
// @desc    Add comment to recipe
// @access  Private
router.post(
  "/:id/comment",
  auth,
  [
    body("text")
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage("Comment must be between 1 and 500 characters"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const recipe = await Recipe.findById(req.params.id);

      if (!recipe) {
        return res.status(404).json({
          success: false,
          message: "Recipe not found",
        });
      }

      const newComment = {
        user: req.user.id,
        text: req.body.text,
      };

      recipe.comments.push(newComment);
      await recipe.save();

      // Populate the new comment with user info
      await recipe.populate("comments.user", "name");

      res.status(201).json({
        success: true,
        message: "Comment added successfully",
        comment: recipe.comments[recipe.comments.length - 1],
      });
    } catch (error) {
      console.error(error);
      if (error.name === "CastError") {
        return res.status(404).json({
          success: false,
          message: "Recipe not found",
        });
      }
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   GET /api/recipes/user/my-recipes
// @desc    Get current user's recipes
// @access  Private
router.get("/user/my-recipes", auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user.id })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: recipes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
