// sokoul-ui/src/services/tmdb.ts
import type { Media } from '../types';

// On utilise import.meta.env pour Vite
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchTMDB = async (endpoint: string): Promise<Media[]> => {
  if (!API_KEY) {
    console.error("ERREUR CRITIQUE : Clé API manquante dans sokoul-ui/.env");
    return [];
  }
  try {
    // On ajoute include_adult=false pour filtrer le contenu
    const res = await fetch(`${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}&language=fr-FR`);
    
    if (!res.ok) {
        console.error(`Erreur HTTP TMDB: ${res.status}`);
        return [];
    }

    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Erreur Fetch TMDB:", error);
    return [];
  }
};

export const getTrendingMovies = () => fetchTMDB('/trending/movie/week');
export const getPopularTVShows = () => fetchTMDB('/tv/popular');
export const getTopRatedMovies = () => fetchTMDB('/movie/top_rated');

// C'est cette fonction qui manquait peut-être :
export const searchMedia = (query: string) => 
  fetchTMDB(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false`);