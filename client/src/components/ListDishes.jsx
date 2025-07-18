/* ==== IMPORTS ==== */
import React, { useState, useEffect } from 'react';
import AddDishes from './NewDishes';
import ListTagsByDisheId from './ListTagsbyDish';
import ListIngredientsByDisheId from './ListIngredientsbyDish';
import BtnDeleteDish from './BtnDeleteDish';

export default function ListAllDishes() {
  /* ==== STATES ==== */
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    tag: '',
    ingredients: '',
    isActive: false,
  });

  const [dishEditId, setDishEditId] = useState(null);
  const [controlPopup, setControlPopup] = useState(false);
  const [refreshListsAux, setRefreshListAux] = useState(false);

  const [listAllDishes, setListAllDishes] = useState([]);
  const [listCategories, setCategories] = useState([]);
  const [listTags, setTags] = useState([]);
  const [listIngredients, setIngredients] = useState([]);

  /* ==== PAGINATION STATES ==== */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Quantos itens por página

  /* ==== HANDLERS ==== */
  const toggleControlPopup = () => {
    setControlPopup((prev) => !prev);
  };

  const clickButtonEdit = (id) => {
    setDishEditId(id);
    setControlPopup((prev) => !prev);
  };

  /* ==== FETCH DATA ==== */
  const fetchDishes = async () => {
    try {
      const [dishRes, catRes, tagRes, ingredientsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/get/dishes-id-relations/${false}`),
        fetch('http://localhost:5000/api/get/categoryList/active'),
        fetch('http://localhost:5000/api/get/tagList/active'),
        fetch('http://localhost:5000/api/get/ingredientList/active'),
      ]);

      setCategories(await catRes.json());
      setTags(await tagRes.json());
      setIngredients(await ingredientsRes.json());

      const data = await dishRes.json();
      setListAllDishes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log('Error fetching dish list:', error);
    }
  };

  useEffect(() => {
    if (!controlPopup) {
      fetchDishes();
      setRefreshListAux((prev) => prev + 1);
    }
  }, [controlPopup]);

  /* ==== LOCAL FILTER ==== */
  const filteredList = listAllDishes.filter((dish) => {
    const matchesName = dish.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesCategory = filters.category ? dish.categoryId === +filters.category : true;
    const matchesTag = filters.tag
      ? dish.tags?.some((tag) => tag.tagId === +filters.tag)
      : true;

    const matchesIngredients = filters.ingredients
      ? dish.ingredients?.some((ing) => ing.ingredientId === +filters.ingredients)
      : true;

    const matchesDishIsActive = filters.isActive ? dish.isActive === true : true;

    return matchesName && matchesCategory && matchesTag && matchesIngredients && matchesDishIsActive;
  });

  /* ==== PAGINATE ==== */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  /* ==== RENDER ==== */
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 border-b pb-3 text-gray-800">
        Dishes
      </h2>

      {/* ==== FILTERS ==== */}
      <section>
        <div className="flex flex-wrap justify-between gap-8 pb-4">
          <input
            type="text"
            placeholder="Search by name"
            value={filters.name}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, name: e.target.value }))
            }
            className="capitalize flex-1 sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm"
          />

          <div className="flex gap-4 flex-wrap items-center">
            {listCategories.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Category:</label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="capitalize px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All categories</option>
                  {listCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {listIngredients.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">
                  Ingredients / side dishes:
                </label>
                <select
                  value={filters.ingredients}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      ingredients: e.target.value,
                    }))
                  }
                  className="capitalize px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All options</option>
                  {listIngredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {listTags.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Highlights:</label>
                <select
                  value={filters.tag}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, tag: e.target.value }))
                  }
                  className="capitalize px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Other highlights</option>
                  {listTags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* ==== FILTER: ACTIVE ONLY ==== */}
          <div className="flex items-center flex-col md:flex-row justify-between gap-4">
            <label>Show only active items?</label>
            <span className="flex items-center flex-col md:flex-row justify-start gap-2">
              <input
                type="checkbox"
                checked={filters.isActive}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
              />
              {filters.isActive ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </section>

      {/* ==== LIST ==== */}
      <div className="space-y-4">
        {currentItems.length > 0 ? (
          <>
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
              >
                <div className="flex items-start flex-col md:flex-row justify-between gap-6">
                  <h3 className="flex-2 text-lg uppercase font-bold text-gray-800 break-all">
                    {item.name}
                  </h3>
                  <div className="flex-1 items-center flex md:flex-col justify-end gap-2 flex-col md:flex-row justify-between gap-6">
                    <p>
                      <span
                        className={`text-sm font-medium px-2.5 py-0.5 rounded-full w-fit
                ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}
                      >
                        {item.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </p>

                    <button
                      onClick={() => {
                        clickButtonEdit(item.id);
                        setControlPopup(true);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-sm rounded"
                    >
                      Edit
                    </button>
                    <BtnDeleteDish dishID={item.id} onDelete={fetchDishes} />
                  </div>
                </div>

                <p className="text-lg text-gray-700 mt-1">
                  Price:{' '}
                  <span className="font-medium">
                    R$ {parseFloat(item.price).toFixed(2)}
                  </span>
                </p>

                <div className="mt-2">
                  <p className="text-lg text-gray-700 font-medium">
                    Description:
                  </p>
                  <p className="text-lg text-gray-600 mt-1">{item.description}</p>
                </div>

                <div className="text-lg text-gray-500 mt-3 space-y-1">
                  <p>Category: {item.category.name}</p>
                  <p>
                    Created:{' '}
                    {new Date(item.createdAt).toLocaleDateString('en-US')}
                  </p>
                  <p>
                    Last update:{' '}
                    {new Date(item.updatedAt).toLocaleDateString('en-US')}
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  <ListIngredientsByDisheId
                    propDishId={item.id}
                    refreshTable={refreshListsAux}
                  />
                  <ListTagsByDisheId
                    propDishId={item.id}
                    refreshTable={refreshListsAux}
                  />
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>No items registered</p>
        )}

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
      </div>

      {/* ==== POPUP ==== */}
      {controlPopup && (
        <AddDishes
          propDishID={dishEditId}
          handleToggleControlPopup={toggleControlPopup}
          controlPopup={controlPopup}
        />
      )}
    </div>
  );
}
