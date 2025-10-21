import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    try {
      setLoading(true);
      const response = await API.get("/recipes/user/my-recipes");
      setRecipes(response.data.data);
    } catch (error) {
      setError("Failed to load your recipes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recipeId) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }

    try {
      await API.delete(`/recipes/${recipeId}`);
      setRecipes(recipes.filter((recipe) => recipe._id !== recipeId));
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
          <p className="text-gray-600 mt-2">Manage and view all your recipes</p>
        </div>
        <Link
          to="/add-recipe"
          className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add New Recipe
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No recipes yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start sharing your delicious recipes with the world!
          </p>
          <Link
            to="/add-recipe"
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Create Your First Recipe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-12">
                <img
                  src={
                    recipe.image
                      ? `http://localhost:5000/uploads/${recipe.image}`
                      : "https://via.placeholder.com/300x200/f3f4f6/6b7280?text=Recipe+Image"
                  }
                  alt={recipe.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x200/f3f4f6/6b7280?text=Recipe+Image";
                  }}
                />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {recipe.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {recipe.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {recipe.cookingTime} min
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
                  <Link
                    to={`/recipe/${recipe._id}`}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-center text-sm hover:bg-gray-200 transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    to={`/edit-recipe/${recipe._id}`}
                    className="flex-1 bg-primary-100 text-primary-700 py-2 px-3 rounded text-center text-sm hover:bg-primary-200 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(recipe._id)}
                    className="flex-1 bg-red-100 text-red-700 py-2 px-3 rounded text-sm hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Created {new Date(recipe.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
