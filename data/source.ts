import { CATEGORIES, PLACES_DATA } from './mockData';
import type { Category, Place } from '../types';

/**
 * The single data seam. Pages call these async functions instead of importing
 * `mockData` directly, so swapping the mock store for a real backend later is
 * a rewrite of this file — no page changes.
 *
 * All functions resolve immediately with the current mock data but are async
 * from day one, so callers are already written against a promise-based API.
 */

/** All categories, in display order. */
export async function getCategories(): Promise<Category[]> {
  return CATEGORIES;
}

/** Places in one category slug; empty array for an unknown slug. */
export async function getPlaces(categorySlug: string): Promise<Place[]> {
  return PLACES_DATA[categorySlug] ?? [];
}

/** Every place across all categories. */
export async function getAllPlaces(): Promise<Place[]> {
  return Object.values(PLACES_DATA).flat();
}

/** One place by id, searched across every category; null when absent. */
export async function getPlace(id: string): Promise<{ place: Place; category?: Category } | null> {
  for (const [slug, places] of Object.entries(PLACES_DATA)) {
    const found = places.find((p) => p.id === id);
    if (found) {
      const category = CATEGORIES.find((c) => c.slug === slug);
      return { place: found, category };
    }
  }
  return null;
}

/**
 * Case-insensitive search across title, category, location, and tags; location
 * acts as an additional AND filter when non-empty (the contract Search.tsx
 * uses). An empty query returns every place — the caller decides what "no
 * results" looks like.
 */
export async function searchPlaces(query: string, location = ''): Promise<Place[]> {
  const all = await getAllPlaces();
  const lowerQuery = query.trim().toLowerCase();
  const lowerLocation = location.trim().toLowerCase();

  return all.filter((p) => {
    const haystacks: string[] = [p.title.toLowerCase(), p.category.toLowerCase()];
    if (p.tags) haystacks.push(...p.tags.map((t) => t.toLowerCase()));
    const matchesQuery =
      !lowerQuery || haystacks.some((h) => h.includes(lowerQuery));
    const matchesLocation = !lowerLocation || p.location.toLowerCase().includes(lowerLocation);
    return matchesQuery && matchesLocation;
  });
}
