import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import mainImage from '../assets/images/sakura.png';

import Settings from '../pages/Settings.jsx'

import '../styles/base.css'

export default function HeroSection() {
    const targetRef = useRef(null);
    const targetRefDivHeader = useRef(null);
    const controls = useAnimation();

    useEffect(() => {
        const handleScroll = () => {
            if (!targetRef.current || !targetRefDivHeader.current) return;
            const targetTop = targetRef.current.getBoundingClientRect().top;
            const headerBottom = targetRefDivHeader.current.getBoundingClientRect().bottom;

            if (targetTop <= 0 || headerBottom <= 90) {
                controls.start({ scale: 0.5, y: 200, opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } });
            } else {
                controls.start({ scale: 1, y: 0, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } });
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [controls]);

    return (
        <div className="flex flex-col items-center px-4 py-8 md:px-8 md:py-12 max-w-6xl mx-auto gap-12">
            <Settings />
            {/* === Header / Hero === */}
            <section className="flex flex-col w-full gap-8">
                <div className="flex flex-col sm:flex-row items-center gap-6" ref={targetRefDivHeader}>
                    <motion.img
                        src={mainImage}
                        alt="main image"
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg"
                        animate={controls}
                        initial={{ opacity: 0, scale: 0.8, y: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-700">YOLK TH</h1>
                </div>

                {/* === Popular Section === */}
                <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-4 uppercase">Popular</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="p-4 text-center bg-white rounded-lg shadow">
                                <p className="font-semibold text-gray-700">Prato {i + 1}</p>
                                <img src={mainImage} alt="popular" className="w-full h-24 object-cover rounded-md mt-2" />
                                <span className="text-sm text-gray-500 block mt-1">R$ 21,00</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === Filters & Menu === */}
            <section className="w-full flex flex-col gap-8">
                <div className="flex flex-wrap justify-between gap-4">
                    <input
                        type="text"
                        placeholder="Search by name"
                        className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700">Category:</label>
                        <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                            <option>Lanches</option>
                            <option>Doces</option>
                            <option>Bolos</option>
                            <option>Almoço</option>
                        </select>
                    </div>
                </div>

                <div className="w-full">
                    {[...Array(3)].map((_, catIndex) => (
                        <div key={`category-${catIndex}`}>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-4 uppercase">
                                Category Name {catIndex + 1}
                            </h3>

                            {[...Array(4)].map((_, itemIndex) => (
                                <div
                                    key={`item-${catIndex}-${itemIndex}`}
                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-gray-200 rounded-lg p-4 mb-4 bg-white"
                                >
                                    <div className="w-full sm:w-36">
                                        <img src={mainImage} alt="dish" className="w-full h-30 object-cover rounded-md" />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1">
                                        <p className="font-semibold text-lg text-gray-800">Macarrão ao molho</p>
                                        <p className="text-gray-500 text-sm">R$ 12,00</p>
                                        <p className="text-sm text-gray-600">macarrão, molho, tomate, alho e óleo</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

            </section>
        </div>
    );
}
