import React, { useState, type FormEvent } from 'react';
import { type Preferences } from '../api/client';

interface PreferencesFormProps {
    onSubmit: (preferences: Omit<Preferences, 'ingredients'>) => void;
    isLoading: boolean;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ onSubmit, isLoading }) => {
    const [mealType, setMealType] = useState<string>('dinner');
    const [cuisine, setCuisine] = useState<string>('any');
    const [hasBasicSpices, setHasBasicSpices] = useState<boolean>(false);
    const [hasCookingOil, setHasCookingOil] = useState<boolean>(false);
    const [hasSaltPepper, setHasSaltPepper] = useState<boolean>(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({ 
            meal_type: mealType, 
            cuisine,
            has_basic_spices: hasBasicSpices,
            has_cooking_oil: hasCookingOil,
            has_salt_pepper: hasSaltPepper
        });
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div>
                    <label className="block text-white font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base" htmlFor="meal-type">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Meal Type
                    </label>
                    <select
                        className="w-full bg-white/10 backdrop-blur-sm border-2 border-green-500/30 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl leading-tight focus:outline-none focus:border-green-400 focus:bg-white/20 transition-all duration-200 text-sm sm:text-base"
                        id="meal-type"
                        value={mealType}
                        onChange={(e) => setMealType(e.target.value)}
                    >
                        <option value="breakfast" className="bg-slate-800">🌅 Breakfast</option>
                        <option value="lunch" className="bg-slate-800">☀️ Lunch</option>
                        <option value="dinner" className="bg-slate-800">🌙 Dinner</option>
                        <option value="snack" className="bg-slate-800">🍿 Snack</option>
                    </select>
                </div>
                <div>
                    <label className="block text-white font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base" htmlFor="cuisine">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                        Cuisine Style
                    </label>
                    <select
                        className="w-full bg-white/10 backdrop-blur-sm border-2 border-green-500/30 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl leading-tight focus:outline-none focus:border-green-400 focus:bg-white/20 transition-all duration-200 text-sm sm:text-base"
                        id="cuisine"
                        value={cuisine}
                        onChange={(e) => setCuisine(e.target.value)}
                    >
                        <option value="any" className="bg-slate-800">🌍 Any Cuisine</option>
                        <option value="italian" className="bg-slate-800">🇮🇹 Italian</option>
                        <option value="mexican" className="bg-slate-800">🇲🇽 Mexican</option>
                        <option value="indian" className="bg-slate-800">🇮🇳 Indian</option>
                        <option value="chinese" className="bg-slate-800">🇨🇳 Chinese</option>
                        <option value="american" className="bg-slate-800">🇺🇸 American</option>
                    </select>
                </div>
            </div>

            {/* Pantry Staples Section */}
            <div className="mb-6 sm:mb-8">
                <h3 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-lime-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    I have these pantry staples:
                </h3>
                <div className="space-y-2 sm:space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={hasBasicSpices}
                            onChange={(e) => setHasBasicSpices(e.target.checked)}
                            className="w-5 h-5 rounded border-2 border-green-500/30 bg-white/10 checked:bg-green-600 checked:border-green-600 focus:ring-2 focus:ring-green-500/50 transition-all cursor-pointer"
                        />
                        <span className="text-white text-sm sm:text-base group-hover:text-green-300 transition-colors">
                            🌶️ Basic Spices (cumin, paprika, garlic powder, etc.)
                        </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={hasCookingOil}
                            onChange={(e) => setHasCookingOil(e.target.checked)}
                            className="w-5 h-5 rounded border-2 border-green-500/30 bg-white/10 checked:bg-green-600 checked:border-green-600 focus:ring-2 focus:ring-green-500/50 transition-all cursor-pointer"
                        />
                        <span className="text-white text-sm sm:text-base group-hover:text-green-300 transition-colors">
                            🫒 Cooking Oil (olive oil, vegetable oil)
                        </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={hasSaltPepper}
                            onChange={(e) => setHasSaltPepper(e.target.checked)}
                            className="w-5 h-5 rounded border-2 border-green-500/30 bg-white/10 checked:bg-green-600 checked:border-green-600 focus:ring-2 focus:ring-green-500/50 transition-all cursor-pointer"
                        />
                        <span className="text-white text-sm sm:text-base group-hover:text-green-300 transition-colors">
                            🧂 Salt & Pepper
                        </span>
                    </label>
                </div>
            </div>

            <button
                className="w-full bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating Recipes...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Get Recommendations
                    </>
                )}
            </button>
        </form>
    );
};

export default PreferencesForm;
