import axios, { AxiosError } from 'axios';

const client = axios.create({
    baseURL: 'https://backend-khaki-ten-18.vercel.app/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

// Custom error class for API errors
export class ApiError extends Error {
    statusCode?: number;
    originalError?: unknown;

    constructor(
        message: string,
        statusCode?: number,
        originalError?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.originalError = originalError;
    }
}

export interface Recipe {
    title: string;
    ingredients: string[];
    instructions: string[];
    prep_time: string;
    calories: number;
}

export interface RecommendationResponse {
    recipes: Recipe[];
    thought_process?: string;
}

export interface Preferences {
    meal_type: string;
    cuisine: string;
    ingredients?: string[];
    has_basic_spices?: boolean;
    has_cooking_oil?: boolean;
    has_salt_pepper?: boolean;
}

// Helper function to handle errors
const handleApiError = (error: unknown, defaultMessage: string): never => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        if (axiosError.code === 'ECONNABORTED') {
            throw new ApiError('Request timed out. Please try again.', 408, error);
        }
        
        if (!axiosError.response) {
            throw new ApiError('Looks like we’ve heroically hit OpenAI limit. Yep too broke to process more requests right now. Try again later.', 0, error);
        }
        
        const statusCode = axiosError.response.status;
        const errorMessage = (axiosError.response.data as any)?.message || 
                           (axiosError.response.data as any)?.error ||
                           defaultMessage;
        
        throw new ApiError(errorMessage, statusCode, error);
    }
    
    throw new ApiError(defaultMessage, undefined, error);
};

export const analyzeImage = async (file: File): Promise<string[]> => {
    try {
        // Validate file
        if (!file.type.startsWith('image/')) {
            throw new ApiError('Please upload a valid image file.');
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            throw new ApiError('Image size must be less than 10MB.');
        }
        
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await client.post<string[]>('/analyze-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        if (!response.data || !Array.isArray(response.data)) {
            throw new ApiError('Invalid response from server.');
        }
        
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to analyze image. Please try again.');
    }
};

export const getRecommendations = async (preferences: Preferences): Promise<RecommendationResponse> => {
    try {
        // Validate preferences
        if (!preferences.ingredients || preferences.ingredients.length === 0) {
            throw new ApiError('No ingredients provided. Please upload an image first.');
        }
        
        const response = await client.post<RecommendationResponse>('/recommend', preferences);
        
        if (!response.data || !response.data.recipes) {
            throw new ApiError('Invalid response from server.');
        }
        
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to get recipe recommendations. Please try again.');
    }
};

export default client;
