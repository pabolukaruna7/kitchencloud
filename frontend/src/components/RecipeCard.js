import React from "react";
import { Link } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  const imageUrl = recipe.image
    ? `http://localhost:5000/uploads/${recipe.image}`
    : "/api/placeholder/300/200";

  const difficultyColors = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/recipe/${recipe._id}`}>
        <div className="aspect-w-16 aspect-h-12">
          <img
            src={imageUrl}
            alt={recipe.name}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x200/f3f4f6/6b7280?text=Recipe+Image";
            }}
          />
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              difficultyColors[recipe.difficulty]
            }`}
          >
            {recipe.difficulty}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {recipe.cookingTime} min
          </div>
        </div>

        <Link to={`/recipe/${recipe._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
            {recipe.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {recipe.servings} servings
            </span>
            <span className="flex items-center text-red-500">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              {recipe.likesCount || 0}
            </span>
          </div>

          <div className="flex space-x-2">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {recipe.cuisineType}
            </span>
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
              {recipe.recipeType}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            By {recipe.author?.name || "Unknown"} •{" "}
            {new Date(recipe.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
