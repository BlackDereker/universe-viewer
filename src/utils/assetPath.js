// Utility to get the correct asset path with base URL
// This handles GitHub Pages deployment where the app is at /universe-viewer/
const BASE_URL = import.meta.env.BASE_URL || '/';

export const getAssetPath = (path) => {
    // Remove leading slash if present and prepend base URL
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${BASE_URL}${cleanPath}`;
};
