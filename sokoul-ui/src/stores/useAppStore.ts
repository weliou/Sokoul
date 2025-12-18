import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, PlaybackPosition } from '../types';

interface AppState {
  // Navigation
  currentSection: string;
  setSection: (section: string) => void;

  // Profils
  currentProfile: UserProfile | null;
  setCurrentProfile: (profile: UserProfile) => void;

  // Positions de lecture
  playbackPositions: Record<string, PlaybackPosition[]>;
  updatePlaybackPosition: (mediaId: number, position: number, duration: number) => void;
  getPlaybackPosition: (mediaId: number) => PlaybackPosition | undefined;

  // Provider actif
  activeProvider: string;
  setActiveProvider: (provider: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      currentSection: 'home',
      setSection: (section) => set({ currentSection: section }),

      // Profils
      currentProfile: { id: '1', name: 'Principal', avatar: '👤' },
      setCurrentProfile: (profile) => set({ currentProfile: profile }),

      // Positions de lecture
      playbackPositions: {},
      updatePlaybackPosition: (mediaId, position, duration) => {
        const { currentProfile, playbackPositions } = get();
        if (!currentProfile) return;

        const profileId = currentProfile.id;
        const existing = playbackPositions[profileId] || [];
        const filtered = existing.filter((p) => p.mediaId !== mediaId);

        set({
          playbackPositions: {
            ...playbackPositions,
            [profileId]: [
              ...filtered,
              { mediaId, position, duration, updatedAt: Date.now() },
            ],
          },
        });
      },
      getPlaybackPosition: (mediaId) => {
        const { currentProfile, playbackPositions } = get();
        if (!currentProfile) return undefined;
        return playbackPositions[currentProfile.id]?.find((p) => p.mediaId === mediaId);
      },

      // Provider
      activeProvider: 'debrid',
      setActiveProvider: (provider) => set({ activeProvider: provider }),
    }),
    {
      name: 'sokoul-storage',
    }
  )
);