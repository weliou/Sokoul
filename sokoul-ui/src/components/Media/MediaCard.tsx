import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { clsx } from 'clsx';
import type { Media } from '../../types';

interface MediaCardProps {
  media: Media;
  onSelect: (media: Media) => void;
  // NOUVEAU : On ajoute cette prop pour le scrolling
  onFocus?: (layout: { x: number; width: number }) => void;
}

export function MediaCard({ media, onSelect, onFocus }: MediaCardProps) {
  const { ref, focused } = useFocusable({
    onEnterPress: () => onSelect(media),
    // NOUVEAU : C'est ici que la magie opère
    onFocus: (layout) => {
      if (onFocus) {
        onFocus(layout);
      }
    },
  });

  const imageUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w342${media.poster_path}`
    : 'https://via.placeholder.com/342x513?text=No+Image';

  return (
    <div
      ref={ref}
      className={clsx(
        'media-card relative rounded-lg overflow-hidden cursor-pointer',
        'transition-all duration-300 ease-out',
        'w-48 h-72 flex-shrink-0', // Taille fixe importante pour le layout
        focused && 'scale-110 z-10 ring-4 ring-blue-500 shadow-2xl'
      )}
    >
      <img
        src={imageUrl}
        alt={media.title || media.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {focused && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-bold text-sm truncate">
              {media.title || media.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-400 text-xs">
                ⭐ {media.vote_average?.toFixed(1) || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}