import React, { useState } from 'react';
import { type Recipe } from '../api/client';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="group relative bg-gradient-to-br from-white to-green-50 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-green-100">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-green-400/20 to-lime-400/20 rounded-bl-full transform translate-x-6 -translate-y-6 sm:translate-x-8 sm:-translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="relative p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300 leading-tight">
                        {recipe.title}
                    </h3>
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-green-100 px-2 sm:px-3 py-1 rounded-full flex-shrink-0">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                        <span className="text-xs sm:text-sm font-semibold text-green-600">{recipe.prep_time}</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-lime-100 to-green-100 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg flex-1">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs sm:text-sm font-semibold text-lime-700">{recipe.calories}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg flex-1">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs sm:text-sm font-semibold text-amber-700">{recipe.ingredients.length}</span>
                    </div>
                </div>

                {/* Ingredients */}
                <div className="mb-4 sm:mb-6">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide mb-2 sm:mb-3 flex items-center gap-2">
                        <span className="w-1 h-3 sm:h-4 bg-gradient-to-b from-green-500 to-lime-500 rounded-full"></span>
                        Ingredients
                    </h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {recipe.ingredients.slice(0, expanded ? undefined : 4).map((ing, index) => (
                            <span 
                                key={index} 
                                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-green-50 to-lime-50 text-green-700 text-xs sm:text-sm rounded-full border border-green-200 hover:border-green-400 transition-colors duration-200"
                            >
                                {ing}
                            </span>
                        ))}
                        {!expanded && recipe.ingredients.length > 4 && (
                            <button 
                                onClick={() => setExpanded(true)}
                                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-green-600 text-white text-xs sm:text-sm rounded-full hover:bg-green-700 transition-colors duration-200"
                            >
                                +{recipe.ingredients.length - 4}
                            </button>
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide mb-2 sm:mb-3 flex items-center gap-2">
                        <span className="w-1 h-3 sm:h-4 bg-gradient-to-b from-lime-500 to-green-500 rounded-full"></span>
                        Instructions
                    </h4>
                    <ol className="space-y-1.5 sm:space-y-2">
                        {recipe.instructions.map((inst, index) => (
                            <li key={index} className="flex gap-2 sm:gap-3 group/item">
                                <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-green-500 to-lime-500 text-white rounded-full flex items-center justify-center text-xs font-bold group-hover/item:scale-110 transition-transform duration-200">
                                    {index + 1}
                                </span>
                                <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">{inst}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Action Button */}
                <button className="mt-4 sm:mt-6 w-full bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base">
                    🍳 Start Cooking
                </button>
            </div>
        </div>
    );
};

export default RecipeCard;

