import React from 'react';

import { Footer } from '../components/Footer';
import { useEffect, useState } from 'react';
import { getCategories } from '../data/source';
import type { Category } from '../types';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { RevealOnScroll } from '../components/ui/RevealOnScroll';

export const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        let alive = true;
        getCategories().then((c) => alive && setCategories(c));
        return () => { alive = false; };
    }, []);

    return (
        <div className="min-h-screen bg-black flex flex-col relative">
            {/* Header removed */}

            <main className="flex-1 pt-32 pb-24 px-6 max-w-[1400px] mx-auto w-full">


                <div className="mb-12">
                    <SectionHeading
                        title="All Categories"
                        subtitle="Explore our curated collections to find exactly what you're looking for."
                        light={true}
                    />
                </div>

                <RevealOnScroll className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" delay={100}>
                    {categories.map((cat) => (
                        <Link
                            to={`/category/${cat.slug}`}
                            key={cat.id}
                            className="group relative h-[320px] rounded-[32px] overflow-hidden cursor-pointer block"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90"></div>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className={`w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 text-white shadow-lg`}>
                                        <cat.icon size={24} strokeWidth={1.5} />
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h3 className="text-3xl font-bold text-white mb-2">{cat.name}</h3>
                                            <p className="text-gray-300 font-medium flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                {cat.count}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </RevealOnScroll>
            </main>

            <Footer />
        </div>
    );
};
