import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { useSavedPlaces } from '../hooks/useSavedPlaces';
import { Search as SearchIcon, MapPin, ArrowRight, TrendingUp, Mic, X, Clock, Loader2, Heart } from 'lucide-react';
import { MediaCard } from '../components/ui/MediaCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import { PLACES_DATA } from '../data/mockData';
import { RevealOnScroll } from '../components/ui/RevealOnScroll';
import { Place } from '../types';

const RECENT_SEARCHES_KEY = 'zappy_recent_searches';
const MAX_RECENT_SEARCHES = 5;

// Flatten all places for searching
const ALL_PLACES: Place[] = [
    ...PLACES_DATA.hotels,
    ...PLACES_DATA.restaurants,
    ...PLACES_DATA.cafes,
    ...PLACES_DATA.education,
    ...PLACES_DATA.attractions,
];

export const Search: React.FC = () => {
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const { isSaved, toggleSaved } = useSavedPlaces();
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [results, setResults] = useState<Place[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Save recent searches to localStorage
    const saveRecentSearch = (term: string) => {
        if (!term.trim()) return;
        const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, MAX_RECENT_SEARCHES);
        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    };

    // Autocomplete suggestions based on query
    const suggestions = useMemo(() => {
        if (!query.trim() || query.length < 2) return [];
        const lowerQuery = query.toLowerCase();
        return ALL_PLACES
            .filter(p =>
                p.title.toLowerCase().includes(lowerQuery) ||
                p.category.toLowerCase().includes(lowerQuery)
            )
            .slice(0, 5);
    }, [query]);

    // Handle search
    const handleSearch = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        setHasSearched(true);
        saveRecentSearch(query);
        setShowAutocomplete(false);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const lowerQuery = query.toLowerCase();
        const lowerLocation = location.toLowerCase();

        const filtered = ALL_PLACES.filter(p => {
            const matchesQuery = p.title.toLowerCase().includes(lowerQuery) ||
                p.category.toLowerCase().includes(lowerQuery);
            const matchesLocation = !lowerLocation || p.location.toLowerCase().includes(lowerLocation);
            return matchesQuery && matchesLocation;
        });

        setResults(filtered);
        setIsLoading(false);
    };

    // Handle voice search
    const handleVoiceSearch = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice search is not supported in your browser');
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            searchInputRef.current?.focus();
        };

        recognition.start();
    };

    // Handle pressing a suggestion
    const handleSelectSuggestion = (place: Place) => {
        setQuery(place.title);
        setShowAutocomplete(false);
        handleSearch();
    };

    // Handle pressing a recent search
    const handleRecentSearchClick = (term: string) => {
        setQuery(term);
        setShowAutocomplete(false);
        setTimeout(() => handleSearch(), 100);
    };

    // Clear recent searches
    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem(RECENT_SEARCHES_KEY);
    };

    const trendingTags = ['Coffee Shop', 'Sushi Spot', 'Luxury Hotel', 'Art Museum', 'Hiking Trails', 'Coworking'];

    return (
        <div className="min-h-screen bg-[#fafcff] flex flex-col relative">
            <main id="main-content" className="flex-1 pt-32 px-6 max-w-[1400px] mx-auto w-full pb-20">
                <RevealOnScroll className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#00053d]">What are you looking for?</h1>
                    <p className="text-lg text-gray-600 mb-8">Discover top-rated places, local favorites, and hidden gems.</p>

                    {/* Search Input */}
                    <div className="relative">
                        <div className="bg-white p-2 rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 flex flex-col md:flex-row gap-2 items-center">
                            <div className="flex-1 flex items-center gap-3 w-full px-5 h-14 bg-gray-50/50 rounded-xl border border-transparent focus-within:bg-white focus-within:border-blue-100 focus-within:shadow-sm transition-all relative">
                                <SearchIcon className="text-gray-400 flex-shrink-0" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setShowAutocomplete(true);
                                    }}
                                    onFocus={() => setShowAutocomplete(true)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Search for restaurants, hotels, etc..."
                                    className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium"
                                    aria-label="Search query"
                                />
                                {query && (
                                    <button
                                        onClick={() => setQuery('')}
                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        aria-label="Clear search"
                                    >
                                        <X size={16} className="text-gray-400" />
                                    </button>
                                )}
                                <button
                                    onClick={handleVoiceSearch}
                                    className={`p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${isListening
                                            ? 'bg-red-100 text-red-500 animate-pulse'
                                            : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                                        }`}
                                    aria-label="Voice search"
                                >
                                    <Mic size={18} />
                                </button>
                            </div>
                            <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
                            <div className="flex-1 flex items-center gap-3 w-full px-5 h-14 bg-gray-50/50 rounded-xl border border-transparent focus-within:bg-white focus-within:border-blue-100 focus-within:shadow-sm transition-all">
                                <MapPin className="text-gray-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Location"
                                    className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium"
                                    aria-label="Location"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={isLoading}
                                className="bg-[#0b5cff] text-white h-14 px-8 rounded-xl font-bold hover:bg-blue-700 transition-colors w-full md:w-auto shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500 disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Search'}
                            </button>
                        </div>

                        {/* Autocomplete Dropdown */}
                        {showAutocomplete && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                {suggestions.map((place) => (
                                    <button
                                        key={place.id}
                                        onClick={() => handleSelectSuggestion(place)}
                                        className="w-full flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors text-left focus:outline-none focus:bg-blue-50"
                                    >
                                        <img src={place.image} alt="" className="w-12 h-12 rounded-lg object-cover" loading="lazy" />
                                        <div>
                                            <p className="font-medium text-gray-900">{place.title}</p>
                                            <p className="text-sm text-gray-500">{place.category} • {place.location}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </RevealOnScroll>

                {/* Recent Searches */}
                {recentSearches.length > 0 && !hasSearched && (
                    <RevealOnScroll className="max-w-4xl mx-auto mb-8" delay={50}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                                <Clock size={14} /> Recent Searches
                            </div>
                            <button
                                onClick={clearRecentSearches}
                                className="text-xs text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                            >
                                Clear all
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {recentSearches.map((term, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleRecentSearchClick(term)}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-600 font-medium hover:border-blue-300 hover:text-blue-600 transition-all text-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <Clock size={12} className="text-gray-400" />
                                    {term}
                                </button>
                            ))}
                        </div>
                    </RevealOnScroll>
                )}

                {/* Trending Searches */}
                {!hasSearched && (
                    <RevealOnScroll className="max-w-4xl mx-auto mb-20 text-center" delay={100}>
                        <div className="flex items-center justify-center gap-2 mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            <TrendingUp size={14} /> Trending Searches
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            {trendingTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => handleRecentSearchClick(tag)}
                                    className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-gray-600 font-medium hover:border-[#0b5cff] hover:text-[#0b5cff] hover:shadow-md transition-all text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </RevealOnScroll>
                )}

                {/* Search Results */}
                {hasSearched && (
                    <RevealOnScroll delay={100}>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-[#00053d]">
                                {isLoading ? 'Searching...' : `${results.length} Results Found`}
                            </h2>
                            {!isLoading && results.length > 0 && (
                                <button className="text-[#0b5cff] font-semibold hover:text-blue-700 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">
                                    View all <ArrowRight size={16} />
                                </button>
                            )}
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <CardSkeleton key={i} />
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && results.length === 0 && (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <SearchIcon size={24} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
                                <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                                <button
                                    onClick={() => { setHasSearched(false); setQuery(''); }}
                                    className="text-[#0b5cff] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                                >
                                    Clear search
                                </button>
                            </div>
                        )}

                        {/* Results Grid */}
                        {!isLoading && results.length > 0 && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {results.map(place => (
                                    <div key={place.id} className="relative">
                                        <Link to={`/place/${place.id}`}>
                                            <MediaCard
                                                place={place}
                                                variant="light"
                                                className="h-full hover:shadow-xl transition-shadow"
                                            />
                                        </Link>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleSaved(place);
                                            }}
                                            aria-label={isSaved(place.id) ? `Remove ${place.title} from saved places` : `Save ${place.title}`}
                                            aria-pressed={isSaved(place.id)}
                                            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <Heart size={18} className={isSaved(place.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </RevealOnScroll>
                )}

                {/* Recommended Section - Only show when not searched */}
                {!hasSearched && (
                    <RevealOnScroll delay={200}>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-[#00053d]">Recommended for you</h2>
                            <button className="text-[#0b5cff] font-semibold hover:text-blue-700 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">
                                View all <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ALL_PLACES.slice(0, 3).map(place => (
                                <div key={place.id} className="relative">
                                    <Link to={`/place/${place.id}`}>
                                        <MediaCard
                                            place={place}
                                            variant="light"
                                            className="h-full hover:shadow-xl transition-shadow"
                                        />
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleSaved(place);
                                        }}
                                        aria-label={isSaved(place.id) ? `Remove ${place.title} from saved places` : `Save ${place.title}`}
                                        aria-pressed={isSaved(place.id)}
                                        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <Heart size={18} className={isSaved(place.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </RevealOnScroll>
                )}
            </main>
            <Footer />
        </div>
    );
};
