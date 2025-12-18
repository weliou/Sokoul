import { useEffect, useState, useCallback } from 'react';
import { init, useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { Sidebar } from './components/Navigation/Sidebar';
import { MediaRow } from './components/Media/MediaRow';
import { useAppStore } from './stores/useAppStore';
// 1. AJOUT de searchMedia ici
import { getTrendingMovies, getPopularTVShows, getTopRatedMovies, searchMedia } from './services/tmdb';
import type { Media } from './types';

init({
  debug: false,
  visualDebug: false,
  throttle: 0,
});

function App() {
  const { ref, focusKey, focusSelf } = useFocusable({
    trackChildren: true,
  });
  
  const currentSection = useAppStore((state) => state.currentSection);
  const [movies, setMovies] = useState<Media[]>([]);
  const [series, setSeries] = useState<Media[]>([]);
  const [topRated, setTopRated] = useState<Media[]>([]);

  // 2. NOUVEAUX ÉTATS pour la recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Media[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [m, s, t] = await Promise.all([
        getTrendingMovies(),
        getPopularTVShows(),
        getTopRatedMovies()
      ]);
      setMovies(m);
      setSeries(s);
      setTopRated(t);
    };
    loadData();

    const handleKeyDown = (event: KeyboardEvent) => {
      // On autorise les flèches dans l'input de recherche si besoin, sinon on bloque
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        // Petit hack : si on est dans l'input, on laisse les flèches gauche/droite pour éditer le texte
        if (document.activeElement?.tagName === 'INPUT' && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
          return; 
        }
        event.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    focusSelf();

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusSelf]);

  // 3. FONCTION DE RECHERCHE
  // Déclenchée quand on tape dans l'input (avec un petit délai idéalement, mais direct ici pour simplifier)
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 2) {
      setIsSearching(true);
      const results = await searchMedia(query);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectMedia = (media: Media) => {
    console.log('Demande de lecture pour :', media.title || media.name);
    
    // 👇 ICI : On vise le port 5678 car c'est là que votre n8n fonctionne
    const n8nUrl = 'http://localhost:5679/webhook-test/stream'; 
    
    const type = media.title ? 'movie' : 'tv';
    
    // On construit l'URL avec les paramètres
    const url = `${n8nUrl}?id=${media.id}&type=${type}&title=${encodeURIComponent(media.title || media.name || '')}`;
      
    // Appel silencieux vers n8n
    fetch(url, { method: 'GET' }).catch(err => console.error("Erreur appel n8n:", err));
      
    alert(`🚀 Signal envoyé à n8n (Port 5678) pour : ${media.title || media.name}`);
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="app-container flex bg-[#0f0f0f] overflow-hidden">
        <Sidebar />
        <main className="main-content flex-1 overflow-y-auto bg-gradient-to-r from-gray-900 to-[#0f0f0f]">
          
          {/* ACCUEIL */}
          {currentSection === 'home' && (
            <div className="pt-8">
              {movies.length > 0 && <MediaRow title="🔥 Films Tendances" medias={movies} onSelectMedia={handleSelectMedia} />}
              {series.length > 0 && <MediaRow title="📺 Séries Populaires" medias={series} onSelectMedia={handleSelectMedia} />}
              {topRated.length > 0 && <MediaRow title="⭐ Les Mieux Notés" medias={topRated} onSelectMedia={handleSelectMedia} />}
            </div>
          )}
          
          {/* CATALOGUES */}
          {currentSection === 'movies' && (
            <div className="pt-8">
              <MediaRow title="🎬 Catalogue Films" medias={movies} onSelectMedia={handleSelectMedia} />
            </div>
          )}

          {currentSection === 'tv' && (
            <div className="pt-8">
              <MediaRow title="📺 Catalogue Séries" medias={series} onSelectMedia={handleSelectMedia} />
            </div>
          )}

          {/* 4. SECTION RECHERCHE MISE À JOUR */}
          {currentSection === 'search' && (
            <div className="p-8 pt-12">
              <h2 className="text-3xl font-bold text-white mb-8">🔍 Recherche</h2>
              
              {/* Barre de recherche */}
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Tapez un titre de film ou série..."
                className="w-full max-w-2xl bg-gray-800 text-white text-xl px-6 py-4 rounded-xl border-2 border-transparent focus:border-blue-500 focus:outline-none mb-12 placeholder-gray-500"
                autoFocus
              />

              {/* Résultats */}
              {isSearching ? (
                <p className="text-gray-400 animate-pulse">Recherche en cours...</p>
              ) : searchResults.length > 0 ? (
                <div className="space-y-8">
                  <MediaRow 
                    title={`Résultats pour "${searchQuery}"`} 
                    medias={searchResults} 
                    onSelectMedia={handleSelectMedia} 
                  />
                </div>
              ) : searchQuery.length > 2 ? (
                <p className="text-gray-400">Aucun résultat trouvé.</p>
              ) : (
                <p className="text-gray-600">Commencez à taper pour rechercher.</p>
              )}
            </div>
          )}

          {/* PARAMÈTRES (Toujours vide pour l'instant) */}
          {currentSection === 'settings' && (
            <div className="p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">⚙️ Paramètres</h2>
              <p className="text-gray-400">Configuration du serveur, profils et gestion du cache.</p>
              <div className="mt-8 p-4 bg-gray-800 rounded-lg max-w-md">
                <p className="font-mono text-sm text-green-400">Statut Système : EN LIGNE</p>
                <p className="font-mono text-sm text-gray-400 mt-2">Version : 0.1.0 Beta</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </FocusContext.Provider>
  );
}

export default App;