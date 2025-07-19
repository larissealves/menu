import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { motion, useAnimation } from 'framer-motion';

import mainImage from '../assets/images/sakura.png';
import ListTagsByDisheId from './ListTagsbyDish';
import ListIngredientsByDisheId from './ListIngredientsbyDish';
import ListImagesByDish from './ListImagesbyDish';

import '../styles/base.css';

export default function HeroSection() {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';


  const [filters, setFilters] = useState({ name: '', category: '', tag: '', ingredients: '' });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [dishes, setDishes] = useState([]);

  const headerRef = useRef(null);
  const controls = useAnimation();

  // Busca inicial de categorias, tags e pratos
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, tagRes, ingredientsRes, dishRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/get/categoryList/active`),
          fetch(`${API_BASE_URL}/api/get/tagList/active`),
          fetch(`${API_BASE_URL}/api/get/ingredientList/active`),
          fetch(`${API_BASE_URL}/api/get/dishes-id-relations/${true}`)
        ]);
        setCategories(await catRes.json());
        setTags(await tagRes.json());
        setIngredients(await ingredientsRes.json());
        const data = await dishRes.json();
        setDishes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
      }
    };
    fetchInitialData();
  }, []);

  // LOCAL FILTERS
  const filtered = dishes.filter(dish => {
    const matchesName = dish.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesCategory = filters.category ? dish.categoryId === +filters.category : true;
    const matchesTag = filters.tag
      ? dish.tags?.some(tag => tag.tagId === +filters.tag)
      : true;

    const matchesIngredients = filters.ingredients
      ? dish.ingredients?.some(ing => ing.ingredientId === + filters.ingredients)
      : true;
    return matchesName && matchesCategory && matchesTag && matchesIngredients;
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
        <Link to="https://github.com/larissealves/" target="_blank" className="text-blue-600 underline font-bold">
          Github - Larisse Alves → </Link>
        <Link to="/ProjectDocumentation" target="_blank" className="text-blue-600 underline font-bold">
          Project Documentation → </Link>
        <Link to="/settings" target="_blank" className="text-blue-600 underline font-bold">
          SETTINGS  → </Link>
      </section>

      {/* ======================
      START - SECTION FILTERS
      ========================= */}
      <section className="w-full flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 w-full">
          <input
            type="text"
            placeholder="Search by name"
            value={filters.name}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, name: e.target.value }))
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm w-full sm:max-w-xs"
          />

          <div className="flex flex-wrap gap-4 w-full sm:flex-1">
            {categories.length > 0 && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-sm text-gray-700">Category:</label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full sm:w-auto"
                >
                  <option value="">All categories</option>
                  {categories.map((cat) => (
                    <option
                      className="capitalize"
                      key={cat.id}
                      value={cat.id}
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {ingredients.length > 0 && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-sm text-gray-700">
                  Ingredients / Side dishes:
                </label>
                <select
                  value={filters.ingredients}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      ingredients: e.target.value,
                    }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full sm:w-auto"
                >
                  <option value="">All options</option>
                  {ingredients.map((ing) => (
                    <option
                      className="capitalize"
                      key={ing.id}
                      value={ing.id}
                    >
                      {ing.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {tags.length > 0 && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-sm text-gray-700">Tags:</label>
                <select
                  value={filters.tag}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, tag: e.target.value }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full sm:w-auto"
                >
                  <option value="">Other highlights</option>
                  {tags.map((tag) => (
                    <option
                      className="capitalize"
                      key={tag.id}
                      value={tag.id}
                    >
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      {/* ====================
      END - SECTION FILTERS
      ====================== */}


      {/* ==================================================
          START - SECTION LIST DISH
        =======================================================*/}
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
                    <p className="font-semibold text-lg text-gray-800 break-all capitalize">{dish.name}</p>
                    <p className="text-gray-500 text-lg">R$ {dish.price}</p>
                    <p className="text-gray-500 text-lg text-justify first-letter:uppercase ">{dish.description}</p>
                    <p>
                      <ListIngredientsByDisheId propDishId={dish.id} />
                    </p>
                    <ListTagsByDisheId propDishId={dish.id} />
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
      {/* ==================================================
          END - SECTION LIST DISH
        =======================================================*/}
    </section>
    </div >
  );
}
