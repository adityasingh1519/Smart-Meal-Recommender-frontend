import { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import PreferencesForm from './components/PreferencesForm';
import RecipeCard from './components/RecipeCard';
import { analyzeImage, getRecommendations, type Recipe, type Preferences, ApiError } from './api/client';

function App() {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<number>(1); // 1: Upload, 2: Preferences, 3: Results

    const handleImageUpload = async (file: File) => {
        setLoading(true);
        setError(null);
        try {
            const detectedIngredients = await analyzeImage(file);
            if (detectedIngredients.length === 0) {
                setError('No ingredients detected in the image. Please try another image.');
                return;
            }
            setIngredients(detectedIngredients);
            setStep(2);
        } catch (err) {
            console.error("Error analyzing image:", err);
            const errorMessage = err instanceof ApiError 
                ? err.message 
                : 'Failed to analyze image. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handlePreferencesSubmit = async (preferences: Omit<Preferences, 'ingredients'>) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getRecommendations({
                ingredients: ingredients,
                ...preferences
            });
            if (!data.recipes || data.recipes.length === 0) {
                setError('No recipes found. Please try different preferences.');
                return;
            }
            setRecipes(data.recipes);
            setStep(3);
        } catch (err) {
            console.error("Error getting recommendations:", err);
            const errorMessage = err instanceof ApiError 
                ? err.message 
                : 'Failed to get recommendations. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-950 via-lime-950 to-yellow-950 py-4 px-3 sm:py-8 sm:px-4">
            <div className={`${step === 3 ? 'max-w-7xl' : 'max-w-2xl'} mx-auto transition-all duration-500`}>
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="text-4xl sm:text-5xl">🍳</span>
                        <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-green-400 via-lime-400 to-yellow-400 bg-clip-text text-transparent">
                            Smart Meal Recommender
                        </h1>
                        <span className="text-4xl sm:text-5xl">🍽️</span>
                    </div>
                    <p className="text-gray-300 text-base sm:text-lg px-4">Snap a photo of your fridge, get delicious meal ideas</p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 bg-red-500/20 backdrop-blur-sm border-l-4 border-red-500 text-white p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                                <p className="font-semibold mb-1">Error</p>
                                <p className="text-sm">{error}</p>
                            </div>
                            <button 
                                onClick={() => setError(null)}
                                className="text-white/70 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-green-500/30">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2 sm:gap-3">
                                <span className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-lime-500 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                <span className="text-base sm:text-2xl">Upload Ingredients</span>
                            </h2>
                        </div>
                        <ImageUpload onImageUpload={handleImageUpload} />
                        {loading && (
                            <div className="mt-6 flex items-center justify-center gap-3">
                                <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-green-300 font-medium text-sm sm:text-base">Analyzing your ingredients...</p>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-green-500/30">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2 sm:gap-3">
                                <span className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-lime-500 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                <span className="text-base sm:text-2xl">Set Preferences</span>
                            </h2>
                            <button 
                                onClick={() => setStep(1)}
                                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg sm:rounded-xl border border-white/20 transition-all duration-200 text-sm sm:text-base"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span className="hidden sm:inline">Back</span>
                            </button>
                        </div>
                        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-l-4 border-green-400 text-white p-4 sm:p-6 mb-6 rounded-lg backdrop-blur-sm">
                            <p className="font-bold text-base sm:text-lg mb-2">✨ Detected Ingredients:</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {ingredients.map((ing, idx) => (
                                    <span key={idx} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm border border-white/30">
                                        {ing}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <PreferencesForm onSubmit={handlePreferencesSubmit} isLoading={loading} />
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
                                <span className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-lime-500 rounded-full flex items-center justify-center text-base sm:text-lg font-bold">3</span>
                                <span className="text-xl sm:text-3xl">Your Recipes</span>
                            </h2>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button 
                                    onClick={() => setStep(2)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg sm:rounded-xl border border-white/20 transition-all duration-200 text-sm sm:text-base"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back
                                </button>
                                <button 
                                    onClick={() => { setStep(1); setError(null); }}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 text-white rounded-lg sm:rounded-xl transition-all duration-200 font-semibold text-sm sm:text-base"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Start Over
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {recipes.map((recipe, index) => (
                                <RecipeCard key={index} recipe={recipe} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 sm:mt-16 text-center pb-4">
                    <p className="text-gray-400 text-sm sm:text-base">
                        Made by{' '}
                        <a 
                            href="https://instagram.com/adityastale" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text font-semibold hover:opacity-80 transition-opacity duration-200"
                        >
                            @adityastale
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default App;
