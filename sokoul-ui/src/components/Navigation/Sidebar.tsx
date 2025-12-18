import { useEffect } from 'react';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { clsx } from 'clsx';
import { useAppStore } from '../../stores/useAppStore';
import { FocusableButton } from './FocusableButton';

const menuItems = [
  { id: 'home', label: '🏠 Accueil' },
  { id: 'movies', label: '🎬 Films' },
  { id: 'tv', label: '📺 Séries' },
  { id: 'search', label: '🔍 Recherche' },
  { id: 'settings', label: '⚙️ Paramètres' },
];

export function Sidebar() {
  const { ref, focusKey, focusSelf } = useFocusable({
    focusable: true, // CHANGEMENT CLÉ : On rend le conteneur focusable
    saveLastFocusedChild: false,
    trackChildren: true,
    autoRestoreFocus: true,
    preferredChildFocusKey: 'menu-home', // On cible l'accueil par défaut
  });

  const currentSection = useAppStore((state) => state.currentSection);
  const setSection = useAppStore((state) => state.setSection);

  // Force le focus d'entrée
  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return (
    <FocusContext.Provider value={focusKey}>
      <nav ref={ref} className="w-64 bg-gray-900 h-screen p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">🎬 SOKOUL</h1>
          <p className="text-gray-500 text-sm">Home Streaming</p>
        </div>
        <ul className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <FocusableButton
                focusKey={`menu-${item.id}`} // On donne un ID unique pour la navigation
                onPress={() => setSection(item.id)}
                className={clsx(
                  'w-full text-left px-4 py-3 rounded-lg text-white outline-none', // Ajout outline-none
                  currentSection === item.id
                    ? 'bg-blue-600'
                    : 'bg-gray-800 hover:bg-gray-700'
                )}
                focusedClassName="ring-4 ring-blue-400 bg-blue-700 scale-105 z-10"
              >
                {item.label}
              </FocusableButton>
            </li>
          ))}
        </ul>
        <div className="text-gray-600 text-xs">
          v0.1.0 - Dev Mode
        </div>
      </nav>
    </FocusContext.Provider>
  );
}