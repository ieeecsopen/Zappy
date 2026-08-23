
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPlace, getPlaces } from '../data/source';
import type { Category, Place } from '../types';

import { Footer } from '../components/Footer';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { MapPin, Star, Clock, Globe, Phone, Share2, Heart, CheckCircle2, ArrowLeft } from 'lucide-react';

const PlaceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [place, setPlace] = useState<Place | null>(null);
    const [placeCategory, setPlaceCategory] = useState<Category | undefined>();
    const [related, setRelated] = useState<Place[]>([]);
    const [loaded, setLoaded] = useState(false);

    // Find place across all categories
    useEffect(() => {
        let alive = true;
        setLoaded(false);
        getPlace(id ?? '').then((hit) => {
            if (!alive) return;
            if (hit) {
                setPlace(hit.place);
                setPlaceCategory(hit.category);
                getPlaces(hit.category?.slug ?? 'hotels').then((ps) => {
                    if (alive) setRelated(ps.filter((p) => p.id !== hit.place.id).slice(0, 3));
                });
            }
            setLoaded(true);
        });
        return () => { alive = false; };
    }, [id]);

    if (loaded && !place) return <div>Place not found</div>;
    if (!place) return null;

    const breadcrumbItems = [
        { label: 'Categories', href: '/categories' },
        { label: placeCategory?.name || 'Category', href: `/category/${placeCategory?.slug}` },
        { label: place.title }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full">
                <img src={place.image} loading="lazy" className="w-full h-full object-cover" alt={place.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-24 left-6 md:left-12 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Go back"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium border border-white/20">
                            {place.category}
                        </span>
                        {place.isOpen ? (
                            <span className="px-3 py-1 rounded-full bg-green-500/20 backdrop-blur-md text-green-300 text-sm font-medium border border-green-500/30 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Open Now
                            </span>
                        ) : (
                            <span className="px-3 py-1 rounded-full bg-red-500/20 backdrop-blur-md text-red-300 text-sm font-medium border border-red-500/30">
                                Closed
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{place.title}</h1>

                    <div className="flex flex-wrap items-center gap-6 text-white/90">
                        <div className="flex items-center gap-2">
                            <MapPin size={20} className="text-white/70" />
                            {place.location}
                        </div>
                        <div className="flex items-center gap-2">
                            <Star size={20} className="text-yellow-400 fill-yellow-400" />
                            <span className="font-bold">{place.rating}</span>
                            <span className="text-white/60">({place.reviews} reviews)</span>
                        </div>
                        {place.priceRange && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{place.priceRange}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-12">
                {/* Breadcrumbs */}
                <Breadcrumbs items={breadcrumbItems} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                {place.description || `Experience the best of ${place.category} at ${place.title}. Known for its exceptional service and vibrant atmosphere, it's a favorite among locals and travelers alike.`}
                            </p>

                            {/* Amenities / Tags */}
                            {place.amenities && (
                                <div className="flex flex-wrap gap-3">
                                    {place.amenities.map(item => (
                                        <span key={item} className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium text-sm flex items-center gap-2">
                                            <CheckCircle2 size={16} className="text-green-600" />
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Menu Section (Restaurants & Cafes) */}
                            {place.menu && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Menu Highlights</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {place.menu.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                                                <span className="font-medium text-gray-800">{item.item}</span>
                                                <span className="font-bold text-gray-900">{item.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Education Specifics */}
                            {(place.staff || place.tuitionFees) && (
                                <div className="space-y-6">
                                    {place.tuitionFees && (
                                        <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
                                            <h4 className="text-indigo-900 font-bold mb-2">Tuition Information</h4>
                                            <p className="text-indigo-700">{place.tuitionFees}</p>
                                        </div>
                                    )}
                                    {place.staff && (
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Staff</h3>
                                            <div className="flex gap-4">
                                                {place.staff.map((member, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200">
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                                            {member[0]}
                                                        </div>
                                                        <span className="font-medium text-gray-800">{member}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Attraction Specifics */}
                            {place.entryFee && (
                                <div className="p-6 rounded-2xl bg-orange-50 border border-orange-100 flex justify-between items-center">
                                    <div>
                                        <h4 className="text-orange-900 font-bold">Entry Fee</h4>
                                        <p className="text-orange-700 text-sm">General Admission</p>
                                    </div>
                                    <span className="text-2xl font-bold text-orange-600">{place.entryFee}</span>
                                </div>
                            )}
                        </div>

                        {/* Location Placeholder */}
                        <div className="rounded-3xl overflow-hidden h-[400px] bg-gray-100 relative group">
                            <img
                                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop"
                                loading="lazy"
                                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                alt="Map Placeholder"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button className="bg-white text-black px-6 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform">
                                    View on Map
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 sticky top-24 bg-white">
                            <h3 className="text-xl font-bold mb-6">Info & Contact</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-4 text-gray-600">
                                    <Clock className="w-5 h-5" />
                                    <span>{place.openingHours || 'Mon - Sun: 9:00 AM - 10:00 PM'}</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <Globe className="w-5 h-5" />
                                    <a href="#" className="hover:text-indigo-600">www.website.com</a>
                                </div>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <Phone className="w-5 h-5" />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                                    Book Now
                                </button>
                                <button className="w-14 h-14 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button className="w-14 h-14 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Items Section */}
            <div className="max-w-[1400px] mx-auto px-6 pb-24">
                <h2 className="text-3xl font-bold mb-8">You Might Also Like</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {related.map(rel => (
                            <Link to={`/place/${rel.id}`} key={rel.id} className="block group">
                                <div className="relative h-[240px] rounded-2xl overflow-hidden mb-4">
                                    <img src={rel.image} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                </div>
                                <h3 className="font-bold text-lg mb-1">{rel.title}</h3>
                                <p className="text-gray-500 text-sm">{rel.location}</p>
                            </Link>
                        ))
                    }
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PlaceDetail;
