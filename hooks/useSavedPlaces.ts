import { useCallback, useEffect, useState } from 'react';
import type { Place } from '../types';

const STORAGE_KEY = 'zappy.saved-places';

function readStore(): Place[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupt or unavailable storage behaves like an empty collection.
    return [];
  }
}

function writeStore(places: Place[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
  } catch {
    // Quota errors or private-mode restrictions: the in-memory list still works
    // for this session; persistence resumes when storage allows.
  }
}

/**
 * Saved-places collection backed by localStorage.
 *
 * Read on mount, written on every change, so components stay storage-agnostic:
 * swapping localStorage for a backend later means rewriting only this file.
 *
 * Cross-tab consistent: storage events refresh the list when another tab saves
 * or unsaves.
 */
export function useSavedPlaces() {
  const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);

  useEffect(() => {
    setSavedPlaces(readStore());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setSavedPlaces(readStore());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const persist = useCallback((next: Place[]) => {
    setSavedPlaces(next);
    writeStore(next);
  }, []);

  const isSaved = useCallback(
    (placeId: string) => savedPlaces.some((p) => p.id === placeId),
    [savedPlaces],
  );

  const toggleSaved = useCallback(
    (place: Place) => {
      if (isSaved(place.id)) {
        persist(savedPlaces.filter((p) => p.id !== place.id));
        return;
      }
      persist([...savedPlaces, place]);
    },
    [isSaved, savedPlaces, persist],
  );

  const clearAll = useCallback(() => persist([]), [persist]);

  return { savedPlaces, isSaved, toggleSaved, clearAll };
}
