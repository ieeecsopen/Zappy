import React from 'react';

import { Footer } from '../components/Footer';
import { Heart, Sparkles, Trash2 } from 'lucide-react';
import { MediaCard } from '../components/ui/MediaCard';
import { RevealOnScroll } from '../components/ui/RevealOnScroll';
import { useSavedPlaces } from '../hooks/useSavedPlaces';

export const Saved: React.FC = () => {
  const { savedPlaces, toggleSaved, clearAll } = useSavedPlaces();

  return (
    <div className="min-h-screen bg-[#fafcff] flex flex-col relative">
      {/* Header removed */}

      <main className="flex-1 pt-32 px-6 max-w-[1400px] mx-auto w-full pb-20">
        <RevealOnScroll className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center shadow-sm border border-red-100">
            <Heart className="text-red-500 fill-red-500" size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#00053d]">Saved Places</h1>
            <p className="text-gray-500 font-medium">Your personal collection of favorites</p>
          </div>
        </RevealOnScroll>

        {savedPlaces.length === 0 ? (
          <RevealOnScroll className="bg-white rounded-[32px] p-16 text-center border border-gray-100 shadow-sm mb-16 relative overflow-hidden" delay={100}>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 to-pink-500"></div>

            <div className="relative z-10">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <Heart size={40} className="text-gray-300" />
                <div className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-lg">0</span>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Nothing saved yet</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Tap the heart on any place while browsing and it will wait for you here — even after
                a refresh.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm text-gray-400">
                <Sparkles size={16} /> Try searching for coffee shops nearby
              </div>
            </div>
          </RevealOnScroll>
        ) : (
          <>
            <RevealOnScroll className="flex items-center justify-between mb-6" delay={50}>
              <p className="text-gray-600 font-medium">
                {savedPlaces.length} place{savedPlaces.length === 1 ? '' : 's'} saved
              </p>
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 rounded px-2 py-1 transition-colors"
              >
                <Trash2 size={12} /> Clear all
              </button>
            </RevealOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPlaces.map(place => (
                <div key={place.id} className="relative">
                  <a href={`#/place/${place.id}`}>
                    <MediaCard
                      place={place}
                      variant="light"
                      className="h-full hover:shadow-xl transition-shadow"
                    />
                  </a>
                  <button
                    onClick={() => toggleSaved(place)}
                    aria-label={`Remove ${place.title} from saved places`}
                    aria-pressed
                    className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    <Heart size={18} className="text-red-500 fill-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};
