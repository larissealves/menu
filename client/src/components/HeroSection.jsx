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

  const TOKEN_FOR_API = import.meta.env.VITE_API_SECRET;
  const headers = {
    Authorization: `Bearer ${TOKEN_FOR_API}`,
  };

  const [filterByName, setFilterByName] = useState("");
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

    const fetchFilters = async () => {
      try {
        const [catRes, tagRes, ingRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/categories?onlyActives=${true}`,
            { headers, }
          ),
          fetch(`${API_BASE_URL}/api/tags?onlyActives=${true}`,
            { headers, }
          ),
          fetch(`${API_BASE_URL}/api/ingredients?onlyActives=${true}`,
            { headers, }
          ),
        ]);

        const dataCat = await catRes.json();
        const dataTag = await tagRes.json();
        const dataIng = await ingRes.json();

        setCategories(dataCat.data);
        setTags(dataTag.data);
        setIngredients(dataIng.data);

      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchListDishes = async () => {
      try {
        const dishRes = await fetch(`${API_BASE_URL}/api/dishes?onlyActives=${true}&itemPerPage=${limitItemsPerPage}&currentPage=${currentPage}&categoryId=${filters.category}&listIngredients=${filters.ingredients}&listTags=${filters.tag}&name=${filters.name}`,
          { headers, }
        )

        const data = await dishRes.json();
        setDishes(Array.isArray(data.dishes) ? data.dishes : []);
        setTotalPages(data.paginationDetais.totalPages);
        setLimitPerPage(data.paginationDetais.ItemsPerPage);

      } catch (error) {
        console.error('Erro ao buscar a lista de pratos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListDishes();
  }, [currentPage, limitItemsPerPage, filters]);

  const hasActiveFilters =
    filterByName ||
    filters.name ||
    filters.category !== "0" ||
    filters.ingredients !== "0" ||
    filters.tag !== "0";

  const handleSearch = () => {
    setFilters({ ...filters, name: filterByName });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({
      name: '',
      category: 0,
      tag: 0,
      ingredients: 0
    });
    setFilterByName('');
    setCurrentPage(1);
  }

  return (
    <div className="flex flex-col items-center px-4 py-8 md:px-8 md:py-12 max-w-6xl 
    mx-auto gap-12">

      <Loading loadingIsActive={loading} />

      {/* Header */}
      <section className="flex flex-col items-center gap-6">
        <div className="flex flex-row items-center gap-6 mb-2 max-sm:flex-col max-sm:text-center">
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

        <div className="flex flex-wrap justify-center items-center gap-2">
          <Link
            to="/settings"
            className="group px-4 py-2 rounded-full bg-violet-100 text-violet-700 font-semibold text-sm hover:bg-violet-200 transition"
          >
            ⚙ Back Office
            <span className="ml-1 transition-transform group-hover:translate-x-1 inline-block">
              →
            </span>
          </Link>

          <Link
            to="/ProjectDocumentation"
            target="_blank"
            className="px-4 py-2 rounded-full text-gray-600 font-medium text-sm hover:bg-gray-100 hover:text-gray-900 transition"
          >
            Project Documentation ↗
          </Link>

          <a
            href="https://github.com/larissealves/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full text-gray-600 font-medium text-sm hover:bg-gray-100 hover:text-gray-900 transition"
          >
            GitHub ↗
          </a>
        </div>
      </section>

      {/* ======================
      START - SECTION FILTERS
      ========================= */}
      <section className="w-full flex flex-col gap-6">
        <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-end sm:gap-6 ">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Search by name"
              value={filterByName}
              onChange={(e) => setFilterByName(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md text-sm 
              focus:outline-none focus:ring-2 focus:ring-violet-200"
            />

            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              title={'Click for search by name'}
              className="absolute right-0 top-0 h-full px-3 flex items-center text-gray-500 
              hover:text-gray-800 cursor-pointer"
              aria-label="Search"
            >
              🔍
            </button>

          </div>


          <div className="flex gap-4 w-full items-end sm:flex-1">
            {categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 w-full sm:flex-row">
                <label className="text-sm text-gray-700">Category:</label>
                <select
                  value={filters.category}
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, category: e.target.value })), setCurrentPage(1)
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full truncate"
                >
                  <option value="0">All categories</option>
                  {categories.map((cat) => (
                    <option
                      className="capitalize text-wrap break-all "
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
                  onChange={(e) => {
                    setFilters((prev) => ({
                      ...prev,
                      ingredients: e.target.value,
                    })), setCurrentPage(1)
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full truncate"
                >
                  <option value="0">All options</option>
                  {ingredients.map((ing) => (
                    <option
                      className="capitalize text-wrap break-all "
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
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, tag: e.target.value })), setCurrentPage(1)
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full truncate"
                >
                  <option value="0">Other highlights</option>
                  {tags.map((tag) => (
                    <option
                      className="capitalize text-wrap break-all "
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

          {(hasActiveFilters) && (
              <button type="button"
                onClick={handleReset}
                disabled={loading}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 
                hover:text-gray-900 cursor-pointer disabled:cursor-not-allowed"
              >
                ↻ Reset Filters
              </button>
            )}

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
            const categoryDishes = dishes.filter(d => d.categoryId === category.id);
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
                      <p className="font-semibold text-lg text-gray-800 dish-name text-wrap break-all !capitalize">{dish.name.toLowerCase()}</p>
                      <p className="text-gray-500 text-lg">R$ {dish.price}</p>
                      <p className="text-gray-500 text-lg text-justify  text-wrap break-all first-letter:uppercase ">{dish.description}</p>
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
