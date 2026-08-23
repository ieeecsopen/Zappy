
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCategories, getPlaces } from '../data/source';
import type { Category, Place } from '../types';

import { Footer } from '../components/Footer';
import { MediaCard } from '../components/ui/MediaCard';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Star, MapPin, DollarSign, SlidersHorizontal, ChevronDown, Utensils, BookOpen, ArrowLeft, Map, Grid, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export const CategoryListing: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [category, setCategory] = useState<Category | undefined>();
    const [places, setPlaces] = useState<Place[]>([]);

    useEffect(() => {
        let alive = true;
        getCategories().then((cats) => {
            if (alive) setCategory(cats.find(c => c.slug === slug));
        });
        if (slug) {
            getPlaces(slug).then((ps) => alive && setPlaces(ps));
        }
        return () => { alive = false; };
    }, [slug]);
    const [priceFilter, setPriceFilter] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

    // Mock filtering logic - extensible
    const filteredPlaces = useMemo(() => {
        if (!priceFilter) return places;
        return places.filter(p => p.priceRange?.includes(priceFilter));
    }, [places, priceFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredPlaces.length / ITEMS_PER_PAGE);
    const paginatedPlaces = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredPlaces.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredPlaces, currentPage]);

    if (!category) {
        return <div className="min-h-screen flex items-center justify-center bg-black text-white">Category not found</div>;
    }

    const breadcrumbItems = [
        { label: 'Categories', href: '/categories' },
        { label: category.name }
    ];

    return (
        <div className="min-h-screen bg-[#fafcff] flex flex-col relative">
            {/* Header Banner */}
            <div className={`relative h-[400px] w-full overflow-hidden`}>
                <img src={category.image} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#000428]/90 to-[#004e92]/80 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-24 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Go back"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 flex flex-col justify-center text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <category.icon size={32} className="text-white/80" />
                        <span className="text-sm font-bold uppercase tracking-widest text-white/70">Category</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">{category.name}</h1>
                    <p className="text-xl text-white/80 max-w-2xl">{category.count} available options near you</p>
                </div>
            </div>

            <main className="flex-1 max-w-[1400px] mx-auto px-6 py-12 w-full">
                {/* Breadcrumbs */}
                <Breadcrumbs items={breadcrumbItems} />

                {/* Search Bar */}
                <div className="mb-12">
                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row gap-4 items-center max-w-4xl mx-auto -mt-32 relative z-20">
                        <div className="flex-1 flex items-center gap-3 w-full px-4">
                            <category.icon className="text-gray-400" />
                            <input
                                type="text"
                                placeholder={`Search ${category.name.toLowerCase()}...`}
                                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
                            />
                        </div>
                        <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
                        <div className="flex-1 flex items-center gap-3 w-full px-4">
                            <MapPin className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Location..."
                                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
                            />
                        </div>
                        <button className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors w-full md:w-auto">
                            Search
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Filters Sidebar */}
                    <div className="w-full lg:w-[300px] shrink-0 space-y-8">
                        <div className="flex items-center gap-2 mb-6">
                            <SlidersHorizontal size={20} className="text-gray-500" />
                            <h3 className="font-bold text-lg text-gray-800">Filters</h3>
                        </div>

                        {/* Price Range Filter */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                <DollarSign size={16} /> Price Range
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {['$', '$$', '$$$', '$$$$'].map((price) => (
                                    <button
                                        key={price}
                                        onClick={() => setPriceFilter(price === priceFilter ? null : price)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${price === priceFilter
                                            ? 'bg-black text-white border-black'
                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {price}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hotels Filters */}
                        {slug === 'hotels' && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                    <Star size={16} /> Star Rating
                                </h4>
                                <div className="space-y-2">
                                    {[5, 4, 3].map((star) => (
                                        <label key={star} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" />
                                            <span className="text-gray-600 group-hover:text-black transition-colors">{star} Stars</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Restaurants Filters */}
                        {slug === 'restaurants' && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                    <Utensils size={16} /> Cuisine
                                </h4>
                                <div className="space-y-2">
                                    {['Italian', 'Japanese', 'Indian', 'Mexican'].map((cuisine) => (
                                        <label key={cuisine} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" />
                                            <span className="text-gray-600 group-hover:text-black transition-colors">{cuisine}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education Filters */}
                        {slug === 'education' && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                    <BookOpen size={16} /> Course Type
                                </h4>
                                <div className="space-y-2">
                                    {['Business', 'Science', 'Arts', 'Technology'].map((type) => (
                                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" />
                                            <span className="text-gray-600 group-hover:text-black transition-colors">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Results Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">{filteredPlaces.length} Results Found</h2>
                            <div className="flex items-center gap-3">
                                {/* View Toggle */}
                                <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        aria-label="Grid view"
                                    >
                                        <Grid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('map')}
                                        className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${viewMode === 'map' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        aria-label="Map view"
                                    >
                                        <Map size={18} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300">
                                    Sort by: Recommended <ChevronDown size={14} />
                                </div>
                            </div>
                        </div>

                        {/* Map View Placeholder */}
                        {viewMode === 'map' && (
                            <div className="h-[500px] bg-gray-100 rounded-3xl flex items-center justify-center mb-8 border border-gray-200">
                                <div className="text-center">
                                    <Map size={48} className="mx-auto mb-4 text-gray-400" />
                                    <p className="text-gray-600 font-medium">Map view coming soon</p>
                                    <p className="text-gray-400 text-sm">Interactive map with all locations</p>
                                </div>
                            </div>
                        )}

                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {paginatedPlaces.map(place => (
                                        <Link to={`/place/${place.id}`} key={place.id} className="block group">
                                            <MediaCard
                                                place={place}
                                                variant="light"
                                                className="h-full hover:shadow-xl transition-shadow duration-300"
                                            />
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-12">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-medium hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <ChevronLeft size={16} /> Previous
                                        </button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-10 h-10 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${page === currentPage
                                                        ? 'bg-black text-white'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-medium hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            Next <ChevronRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {filteredPlaces.length === 0 && (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <p className="text-gray-500">No places found matching your filters.</p>
                                <button onClick={() => setPriceFilter(null)} className="mt-4 text-indigo-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">Clear all filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
