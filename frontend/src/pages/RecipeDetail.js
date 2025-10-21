import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";

const RecipeDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/recipes/${id}`);
      const recipeData = response.data.data;
      setRecipe(recipeData);
      setLikesCount(recipeData.likesCount || 0);

      if (isAuthenticated && user) {
        setIsLiked(recipeData.likes.includes(user.id));
      }
    } catch (error) {
      setError("Recipe not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-center py-12 text-red-600">{error}</div>;
  if (!recipe) return <div className="text-center py-12">Recipe not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.name}</h1>
        <p className="text-gray-600 mb-6">{recipe.description}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3"></span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Instructions
            </h2>
            <div className="whitespace-pre-wrap text-gray-700">
              {recipe.steps}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              By {recipe.author?.name} • {recipe.cookingTime} min •{" "}
              {recipe.servings} servings
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {recipe.cuisineType}
              </span>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                {recipe.recipeType}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
