import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { motion, useAnimation } from 'framer-motion';

import mainImage from '../assets/images/sakura.png';
import ListTagsByDisheId from './ListTagsbyDish';
import ListIngredientsByDisheId from './ListIngredientsbyDish';
import ListImagesByDish from './ListImagesbyDish';
import Loading from './loading/Loading';

import '../styles/base.css';

export default function HeroSection() {

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';


  const [filters, setFilters] = useState({ 
    name: '', 
    category: 0, 
    tag: 0, 
    ingredients: 0 
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [dishes, setDishes] = useState([]);

  const [loading, setLoading] = useState();

  // ========== PAGINATION =============
  const [limitItemsPerPage, setLimitPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  
  // Busca inicial de categorias, tags e pratos
  useEffect(() => {
    setLoading(true);

    const fetchInitialData = async () => {
      try {

        const token = import.meta.env.VITE_API_SECRET;

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [catRes, tagRes, ingredientsRes, dishRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/get/categoryList/active`),
          fetch(`${API_BASE_URL}/api/get/tagList/active`),
          fetch(`${API_BASE_URL}/api/get/ingredientList/active`),
          fetch(`${API_BASE_URL}/api/get/dishes-id-relations/${true}/${limitItemsPerPage}/${currentPage}/${filters.category}/${filters.ingredients}/${filters.tag}`,
            {
              headers,
            })
        ]);

        setCategories(await catRes.json());
        setTags(await tagRes.json());
        setIngredients(await ingredientsRes.json());

        const data = await dishRes.json();
        setDishes(Array.isArray(data.dishes) ? data.dishes : []);
        setCurrentPage(data.paginationDetais.currentPage);
        console.log(data.paginationDetais.currentPage);
        setTotalPages(data.paginationDetais.totalPages);
        setLimitPerPage(data.paginationDetais.ItemsPerPage);

      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [currentPage, filters]);

  // LOCAL FILTERS
  const filtered = dishes.filter(dish => {
    const matchesName = dish.name.toLowerCase().includes(filters.name.toLowerCase());
    /*const matchesCategory = filters.category ? dish.categoryId === +filters.category : true;
    const matchesTag = filters.tag
      ? dish.tags?.some(tag => tag.tagId === +filters.tag)
      : true;

    const matchesIngredients = filters.ingredients
      ? dish.ingredients?.some(ing => ing.ingredientId === + filters.ingredients)
      : true;
      */
    return matchesName;
  });

  return (
    <div className="flex flex-col items-center px-4 py-8 md:px-8 md:py-12 max-w-6xl mx-auto gap-12">

      <Loading loadingIsActive={loading} />

      {/* Header */}
      <section className=" justify-between gap-16 ">
        <div className="flex flex-row items-center gap-6 mb-4 max-sm:flex-col max-sm:text-center">
          <div>
            <img
              src={mainImage}
              alt="main image"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg"
            />
          </div>

          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-700">
              Saboré
            </h1>
            <p className="text-xl font-bold text-gray-700">
              MENU
            </p>
          </div>
        </div>

        <div className="w-full flex flex-wrap gap-4  sm:flex-1 justify-center">
          <Link to="https://github.com/larissealves/" target="_blank" className="text-blue-600 underline font-bold">
            Github - Larisse Alves → </Link>
          <Link to="/ProjectDocumentation" target="_blank" className="text-blue-600 underline font-bold">
            Project Documentation → </Link>
          <Link to="/settings" target="_blank" className="text-blue-600 underline font-bold">
            SETTINGS  → </Link>
        </div>
      </section>

      {/* ======================
      START - SECTION FILTERS
      ========================= */}
      <section className="w-full flex flex-col gap-6">
        <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-end sm:gap-6 ">
          <input
            type="text"
            placeholder="Search by name"
            value={filters.name}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, name: e.target.value }), setCurrentPage(1))
              }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm w-full sm:max-w-xs"
          />

          <div className="flex gap-4 w-full items-end sm:flex-1">
            {categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 w-full sm:flex-row">
                <label className="text-sm text-gray-700">Category:</label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, category: e.target.value }), setCurrentPage(1))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full"
                >
                  <option value="">All categories</option>
                  {categories.map((cat) => (
                    <option
                      className="capitalize w-full"
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
              <div className="flex flex-wrap items-center gap-2 w-full sm:flex-row">
                <label className="text-sm text-gray-700">
                  Ingredients / Side dishes:
                </label>
                <select
                  value={filters.ingredients}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      ingredients: e.target.value,
                    }), setCurrentPage(1))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full"
                >
                  <option value="">All options</option>
                  {ingredients.map((ing) => (
                    <option
                      className="capitalize w-full"
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
              <div className="flex flex-wrap items-center gap-2 w-full sm:flex-row">
                <label className="text-sm text-gray-700">Tags:</label>
                <select
                  value={filters.tag}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, tag: e.target.value }), setCurrentPage(1))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full"
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
            ====================== 
        */}


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
                      <p className="font-semibold text-lg text-gray-800 break-all dish-name !capitalize">{dish.name.toLowerCase()}</p>
                      <p className="text-gray-500 text-lg">R$ {dish.price}</p>
                      <p className="text-gray-500 text-lg text-justify first-letter:uppercase ">{dish.description}</p>
                      <>
                        <ListIngredientsByDisheId propDishId={dish.id} />
                      </>
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

        
        {/* ==== PAGINATION ==== */}
        <div className="flex gap-2 mt-4 justify-end items-center ">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>

      </section>
    </div >
  );
}
