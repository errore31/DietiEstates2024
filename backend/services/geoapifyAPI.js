export async function geoapifySuggestion(text) {
    const MY_API_KEY = process.env.GEOAPIFY;
    text = encodeURIComponent(text);
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&limit=10&lang=it&filter=countrycode%3Ait&format=json&apiKey=${MY_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.results) {
            data.results = data.results.map(result => ({
                ...result,
                bbox: result.bbox || null
            }));
        }

        return data;
    } catch (err) {
        console.error("Errore Geoapify:", err.message);
    }
}

/**
 * @param {string}
 * @returns {Promise<{lon1, lat1, lon2, lat2}|null>} 
 */
export async function geoapifyGeocode(text) {
    const MY_API_KEY = process.env.GEOAPIFY;
    const encodedText = encodeURIComponent(text);
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodedText}&limit=1&lang=it&filter=countrycode%3Ait&format=json&apiKey=${MY_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.results && data.results.length > 0) {
            const result = data.results[0];
            if (result.bbox) {
                return {
                    lon1: result.bbox.lon1,
                    lat1: result.bbox.lat1,
                    lon2: result.bbox.lon2,
                    lat2: result.bbox.lat2
                };
            }
        }
        return null;
    } catch (err) {
        console.error("Errore Geoapify geocode:", err.message);
        return null;
    }
}