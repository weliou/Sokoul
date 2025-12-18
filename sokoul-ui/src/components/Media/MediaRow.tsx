import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { useRef, useCallback } from 'react';
import { MediaCard } from './MediaCard';
import type { Media } from '../../types';

interface MediaRowProps {
  title: string;
  medias: Media[];
  onSelectMedia: (media: Media) => void;
}

export function MediaRow({ title, medias, onSelectMedia }: MediaRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Cette fonction sera appelée par la MediaCard quand elle reçoit le focus
  const handleCardFocus = useCallback(({ x }: { x: number }) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: x - 60, // Décalage pour garder un peu de marge à gauche
        behavior: 'smooth',
      });
    }
  }, []);

  const { ref, focusKey } = useFocusable({
    trackChildren: true,
    // On a supprimé 'onUpdateFocus' qui causait l'erreur
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="media-row mb-8 relative">
        <h2 className="text-xl font-bold text-white mb-4 px-8">{title}</h2>
        <div
          ref={scrollRef}
          className="flex gap-4 px-8 overflow-x-auto scrollbar-hide pb-4 py-4"
        >
          {medias.map((media) => (
            <MediaCard
              key={media.id}
              media={media}
              onSelect={onSelectMedia}
              onFocus={handleCardFocus} // On connecte le scroll ici
            />
          ))}
        </div>
      </div>
    </FocusContext.Provider>
  );
}