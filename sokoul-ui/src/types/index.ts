export interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: 'movie' | 'tv';
  progress?: number;
}

export interface StreamSource {
  url: string;
  quality: string;
  provider: string;
  tier: 'tier1' | 'tier2' | 'tier3';
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
}

export interface PlaybackPosition {
  mediaId: number;
  position: number;
  duration: number;
  updatedAt: number;
}