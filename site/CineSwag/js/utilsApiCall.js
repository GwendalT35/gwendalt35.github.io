const baseApiUrl = "https://api.themoviedb.org/3"

// Exporting the 'options' function
export const options = (token) => {
    return {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
    };
};

export async function handleApiRequest(apiCall) {
    try {
        const response = await apiCall();
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de l'appel API :", error);
        return null;
    }
}



// Exporting the 'apiUrlDiscover' function correctly
export const apiUrlDiscover = (pageNumber, langue) => {
    return `${baseApiUrl}/discover/movie?language=${langue}&page=${pageNumber}`;
};


export const apiUrlSearch = (query, pageNumber, language) => {   
    return `${baseApiUrl}/search/movie?query=${query}&language=${language}&page=${pageNumber}`
}