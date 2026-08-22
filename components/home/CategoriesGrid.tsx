import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { useEffect, useState } from 'react';
import { getCategories } from '../../data/source';
import type { Category } from '../../types';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RevealOnScroll } from '../ui/RevealOnScroll';

export const CategoriesGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let alive = true;
    getCategories().then((c) => alive && setCategories(c));
    return () => { alive = false; };
  }, []);

  return (
    <section className="py-24 px-6 bg-black relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[128px] pointer-events-none -translate-y-1/2"></div>

      <RevealOnScroll className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <SectionHeading
            title="Explore by Category"
            subtitle="Curated collections to help you discover the best local experiences."
            light={true}
          />
          <Link to="/categories" className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all text-white font-medium mb-12 group">
            View all categories <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[240px] gap-5">
          {categories.map((cat, index) => {
            // Determine span classes
            let spanClass = "";
            if (index === 0) spanClass = "md:col-span-2 md:row-span-2"; // First Item: Large Square
            else spanClass = "md:col-span-1"; // Others: Standard

            return (
              <Link
                to={`/category/${cat.slug}`}
                key={cat.id}
                className={`group relative rounded-[32px] overflow-hidden cursor-pointer ${spanClass}`}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                </div>

                {/* Content Container */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">

                  {/* Top Row: Icon & Arrow */}
                  <div className="flex justify-between items-start">
                    <div className={`rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-1 shadow-lg ${index === 0 ? 'w-16 h-16' : 'w-12 h-12'}`}>
                      <div className={`w-full h-full rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${cat.color} opacity-90`}>
                        <cat.icon size={index === 0 ? 32 : 22} strokeWidth={1.5} />
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                      <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Bottom Row: Text */}
                  <div className="transform group-hover:-translate-y-1 transition-transform duration-300">
                    <h3 className={`font-heading font-bold text-white mb-1.5 leading-tight ${index === 0 ? 'text-4xl' : 'text-xl'}`}>
                      {cat.name}
                    </h3>
                    <p className="text-gray-300 font-medium text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
                      {cat.count}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <Link to="/categories" className="md:hidden mt-8 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-all text-white font-medium">
          View all categories <ArrowRight size={18} />
        </Link>
      </RevealOnScroll>
    </section>
  );
};