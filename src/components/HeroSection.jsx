import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { motion, useAnimation } from 'framer-motion';

import mainImage from '../assets/images/sakura.png';
import Settings from '../pages/Settings.jsx';
import ListTagsByDisheId from './ListTagsbyDish';
import ListIngredientsByDisheId from './ListIngredientsbyDish';
import ListImagesByDish from './ListImagesbyDish';

import '../styles/base.css';

export default function HeroSection() {
  const [filters, setFilters] = useState({ name: '', category: '', tag: '' });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [dishes, setDishes] = useState([]);

  const headerRef = useRef(null);
  const controls = useAnimation();
  const navigate = useNavigate();

  // Animação no scroll
  useEffect(() => {
    const onScroll = () => {
      if (!headerRef.current) return;
      const headerBottom = headerRef.current.getBoundingClientRect().bottom;
      controls.start({
        scale: headerBottom <= 90 ? 0.5 : 1,
        y: headerBottom <= 90 ? 200 : 0,
        opacity: headerBottom <= 90 ? 0 : 1,
        transition: { duration: 0.8, ease: 'easeInOut' },
      });
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [controls]);

  // Busca inicial de categorias, tags e pratos
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, tagRes, dishRes] = await Promise.all([
          fetch('http://localhost:5000/api/get/categoryList/active'),
          fetch('http://localhost:5000/api/get/tagList/active'),
          fetch('http://localhost:5000/api/get/dishes-id-relations')
        ]);
        setCategories(await catRes.json());
        setTags(await tagRes.json());
        const data = await dishRes.json();
        setDishes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro ao buscar dados iniciais:', err);
      }
    };
    fetchInitialData();
  }, []);

  // Filtro local
  const filtered = dishes.filter(dish => {
    const matchesName = dish.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesCategory = filters.category ? dish.categoryId === +filters.category : true;
    const matchesTag = filters.tag
      ? dish.tags?.some(tag => tag.tagId === +filters.tag)
      : true;
    return matchesName && matchesCategory && matchesTag;
  });

  return (
    <div className="flex flex-col items-center px-4 py-8 md:px-8 md:py-12 max-w-6xl mx-auto gap-12">
      {/* Header */}
      <section className="w-full flex flex-row justify-between gap-16">
        <div className="flex flex-col sm:flex-row items-center   gap-16" ref={headerRef}>
          <img
            src={mainImage}
            alt="main image"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg"
          />
            <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-700">Saboré</h1>
                <p className="text-1xl font-bold text-gray-700">MENU</p>
            </div>
        </div>
        <Link to="/settings" target="_blank" className="text-blue-600 underline font-bold">SETTINGS</Link>
      </section>

      {/* Filtros */}
      <section className="w-full flex flex-col gap-8">
        <div className="flex flex-wrap justify-between gap-8">
          <input
            type="text"
            placeholder="Buscar por nome"
            value={filters.name}
            onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
            className=" flex-1 sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm"
          />
          <div className="flex gap-4 flex-wrap items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Categoria:</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Todas</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Tag:</label>
              <select
                value={filters.tag}
                onChange={(e) => setFilters(prev => ({ ...prev, tag: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Todas</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>{tag.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pratos organizados por categoria */}
        <div className="w-full">
          {categories.map((category) => {
            const categoryDishes = filtered.filter(d => d.categoryId === category.id);
            if (categoryDishes.length === 0) return null;

            return (
              <div key={category.id} className="mb-6">
                <h3 className="text-xl font-semibold text-gray-600 mb-3 uppercase">{category.name}</h3>
                {categoryDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="flex flex-col w-full gap-4 border border-gray-200 rounded-lg p-4 bg-white mb-4"
                  >
                    <div className="flex-1 flex flex-col gap-1">
                      <p className="font-semibold text-lg text-gray-800">{dish.name}</p>
                      <p className="text-gray-500 text-sm">R$ {dish.price}</p>
                      <p className="text-gray-500 text-sm">{dish.description}</p>
                      <ListIngredientsByDisheId propDishId={dish.id} showInList />
                      <ListTagsByDisheId propDishId={dish.id} showInList />
                    </div> 

                    <div className="w-full  sm:w-36">
                      <ListImagesByDish dishId={dish.id} />
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
 