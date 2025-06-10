import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import mainImage from '../assets/images/sakura.png';

import Settings from '../pages/Settings.jsx';
import ListTagsByDisheId from './ListTagsbyDish'
import ListIngredientsByDisheId from './ListIngredientsbyDish'

import '../styles/base.css';

export default function HeroSection() {
    const [filterName, setFilterName] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterTag, setFilterTag] = useState('');

    const [listCategories, setCategories] = useState([]);
    const [listTags, setTags] = useState([]);
    const [listAllDishes, setListAllDishes] = useState([]);

    const targetRef = useRef(null);
    const targetRefDivHeader = useRef(null);
    const controls = useAnimation();

    // Scroll animation
    useEffect(() => {
        const handleScroll = () => {
            if (!targetRef.current || !targetRefDivHeader.current) return;
            const targetTop = targetRef.current.getBoundingClientRect().top;
            const headerBottom = targetRefDivHeader.current.getBoundingClientRect().bottom;

            if (targetTop <= 0 || headerBottom <= 90) {
                controls.start({
                    scale: 0.5,
                    y: 200,
                    opacity: 0,
                    transition: { duration: 0.8, ease: 'easeInOut' },
                });
            } else {
                controls.start({
                    scale: 1,
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.8, ease: 'easeOut' },
                });
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [controls]);

    // Buscar categorias
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/get/categoryList');
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.log('Erro ao buscar a lista de categorias', error);
            }
        };
        fetchCategories();
    }, []);

    // Buscar tags
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/get/tagList');
                const data = await res.json();
                setTags(data);
            } catch (error) {
                console.log('Erro ao buscar a lista de tags', error);
            }
        };
        fetchTags();
    }, []);

    // Buscar pratos
    const fetchDishes = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/get/dishes-id-relations');
            const data = await res.json();
            console.log('RESPOSTA DISHES:', data); // veja se retorna um array
            setListAllDishes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.log('Erro ao buscar a lista de pratos', error);
            setListAllDishes([]);
        }

    };
    useEffect(() => {
        fetchDishes();
    }, []);

    // Aplicar filtros
    const filteredDishes = Array.isArray(listAllDishes)
        ? listAllDishes.filter((dish) => {
            const matchName = dish.name.toLowerCase().includes(filterName.toLowerCase());
            const matchCategory = filterCategory ? dish.categoryId === Number(filterCategory) : true;
            const matchTag = filterTag
                ? dish.dishTag?.some((tag) => tag.tagId === Number(filterTag))
                : true;
            return matchName && matchCategory && matchTag;
        })
        : [];


    return (
        <div className="flex flex-col items-center px-4 py-8 md:px-8 md:py-12 max-w-6xl mx-auto gap-12">
            <Settings />

            {/* === Hero Header === */}
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
            </section>

            {/* === Filtros === */}
            <section className="w-full flex flex-col gap-8">
                <div className="flex flex-wrap justify-between gap-4">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm"
                    />

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700">Category:</label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                            <option value="">Todas</option>
                            {listCategories.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700">Tag:</label>
                        <select
                            value={filterTag}
                            onChange={(e) => setFilterTag(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                            <option value="">Todas</option>
                            {listTags.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* === Lista de pratos organizados por categoria === */}
                <div className="w-full">
                    {listCategories.map((catIndex) => {
                        const dishesInCategory = filteredDishes.filter(
                            (dish) => dish.categoryId === catIndex.id
                        );

                        if (dishesInCategory.length === 0) return null;

                        return (
                            <div key={`category-${catIndex.id}`}>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-4 uppercase">
                                    {catIndex.name}
                                </h3>

                                {dishesInCategory.map((item) => (
                                    <div
                                        key={`dish-${item.id}`}
                                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-gray-200 rounded-lg p-4 mb-4 bg-white"
                                    >
                                        <div className="w-full sm:w-36">
                                            <img
                                                src={mainImage}
                                                alt="dish"
                                                className="w-full h-30 object-cover rounded-md"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col gap-1">
                                            <p className="font-semibold text-lg text-gray-800">{item.name}</p>
                                            <p className="text-gray-500 text-sm">R$ {item.price}</p>

                                            <ListIngredientsByDisheId
                                                propDishId={item.id}
                                                showInList={true}
                                            />

                                            < ListTagsByDisheId
                                                propDishId={item.id}
                                                showInList={true}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
