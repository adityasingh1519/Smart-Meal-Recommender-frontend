import React, { useState, type ChangeEvent } from 'react';
import { compressImage, formatFileSize } from '../utils/imageCompression';

interface ImageUploadProps {
    onImageUpload: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [compressionInfo, setCompressionInfo] = useState<string | null>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Reset state
            setError(null);
            setCompressionInfo(null);
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file (PNG, JPG, or GIF)');
                return;
            }
            
            setIsCompressing(true);
            try {
                const originalSize = file.size;
                // Compress image
                const compressedFile = await compressImage(file, 1200, 1200, 0.8);
                const compressedSize = compressedFile.size;
                
                // Validate compressed file size (5MB limit for safety)
                if (compressedSize > 5 * 1024 * 1024) {
                    setError('Even after compression, image is too large. Please choose a different image.');
                    setIsCompressing(false);
                    return;
                }
                
                // Show compression info
                const ratio = Math.round((1 - compressedSize / originalSize) * 100);
                setCompressionInfo(`Compressed: ${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)} (${ratio}% reduction)`);
                
                setPreview(URL.createObjectURL(compressedFile));
                onImageUpload(compressedFile);
            } catch (err) {
                setError('Failed to process image. Please try another image.');
                console.error('Image compression error:', err);
            } finally {
                setIsCompressing(false);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            {error && (
                <div className="mb-4 w-full bg-red-500/20 backdrop-blur-sm border-l-4 border-red-500 text-white p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}
            {compressionInfo && (
                <div className="mb-4 w-full bg-blue-500/20 backdrop-blur-sm border-l-4 border-blue-500 text-white p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm">{compressionInfo}</p>
                    </div>
                </div>
            )}
            <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-56 sm:h-64 border-2 border-green-500/30 border-dashed rounded-xl sm:rounded-2xl cursor-pointer bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 group ${isCompressing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                    {isCompressing ? (
                        <>
                            <div className="w-14 h-14 sm:w-16 sm:h-16 mb-3 sm:mb-4 bg-gradient-to-br from-green-500 to-lime-500 rounded-full flex items-center justify-center animate-spin">
                                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="mb-2 text-sm sm:text-base text-white font-semibold text-center">
                                Compressing image...
                            </p>
                        </>
                    ) : preview ? (
                        <img src={preview} alt="Preview" className="h-40 sm:h-48 object-contain rounded-lg shadow-2xl" />
                    ) : (
                        <>
                            <div className="w-14 h-14 sm:w-16 sm:h-16 mb-3 sm:mb-4 bg-gradient-to-br from-green-500 to-lime-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <p className="mb-2 text-sm sm:text-base text-white font-semibold text-center">
                                <span className="text-green-300">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs sm:text-sm text-gray-400 text-center">PNG, JPG or GIF (Auto-compressed for mobile)</p>
                        </>
                    )}
                </div>
                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" disabled={isCompressing} />
            </label>
        </div>
    );
};

export default ImageUpload;

