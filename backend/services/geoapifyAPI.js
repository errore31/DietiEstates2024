export async function geoapifySuggestion(text) { // Aggiungi req e res
    const MY_API_KEY = process.env.GEOAPIFY;
    text = encodeURIComponent(text);
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&type=city&limit=10&lang=it&filter=countrycode%3Ait&format=json&apiKey=${MY_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        //console.log(data);
        // Invece di console.log, invia i dati al browser/client
        return(data); 
    } catch (err) {
        console.error("Errore:", err.message);
    }
}