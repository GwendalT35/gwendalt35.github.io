import { options, handleApiRequest, apiUrlDiscover, apiUrlSearch } from "../utilsApiCall.js";

class TmdbApi {
    #token;

    constructor(token) {
        this.#token = token;
    }

    get token() {
        return this.#token;
    }

    set token(token) {
        this.#token = token;
    }

    discoverMovies(page, langue) {
        return handleApiRequest(() => fetch(apiUrlDiscover(page, langue), options(this.token)));
    }
    
    searchMovies(query, page, language) {
        return handleApiRequest(() => fetch(apiUrlSearch(query, page, language), options(this.token)));
    }
    
}

export default TmdbApi;