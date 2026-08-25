/* ==== IMPORTS ==== */
import React, { useState, useEffect } from 'react';
import AddDishes from './NewDishes';
import ListTagsByDisheId from './ListTagsbyDish';
import ListIngredientsByDisheId from './ListIngredientsbyDish';
import ListImagesByDish from './ListImagesbyDish';
import BtnDeleteDish from './BtnDeleteDish';

export default function ListAllDishes({adminKey, dishcontrolPopup, onClose}) {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';

  const TOKEN_FOR_API = import.meta.env.VITE_API_SECRET;


  /* ==== STATES ==== */
  const [filters, setFilters] = useState({
    name: '',
    category: '0',
    tag: '0',
    ingredients: '0',
    isActive: null,
  });

  const [dishEditId, setDishEditId] = useState(null);
  const [refreshListsAux, setRefreshListAux] = useState(false);

  const [listAllDishes, setListAllDishes] = useState([]);
  const [listCategories, setCategories] = useState([]);
  const [listTags, setTags] = useState([]);
  const [listIngredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ==== PAGINATION STATES ==== */
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  /* ==== HANDLERS ==== */
  const toggleControlPopup = () => {
    setDishEditId(null);
    onClose();
  };

  const clickButtonEdit = (id) => {
    setDishEditId(id);
    onClose();
  };


  /* ==== FETCH DATA ==== */
  const fetchDishes = async () => {
    try {
      setLoading(true);
      const filterOnlyByActives = filters.isActive === 'true' ? 'true' : null;

      const headers = {
        Authorization: `Bearer ${TOKEN_FOR_API}`
      };
      
      const [dishRes, catRes, tagRes, ingredientsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/get/dishes-id-relations/${filterOnlyByActives}/${itemsPerPage}/${currentPage}/${filters.category}/${filters.ingredients}/${filters.tag}`, {
          headers
        }),
        fetch(`${API_BASE_URL}/api/get/categoryList/active`,{headers}),
        fetch(`${API_BASE_URL}/api/get/tagList/active`,{headers}),
        fetch(`${API_BASE_URL}/api/get/ingredientList/active`,{headers}),
      ]);

      setCategories(await catRes.json());
      setTags(await tagRes.json());
      setIngredients(await ingredientsRes.json());

      const data = await dishRes.json();
      setListAllDishes(Array.isArray(data.dishes) ? data.dishes : []);
      setCurrentPage(data.paginationDetais.currentPage);
      setItemsPerPage(data.paginationDetais.ItemsPerPage);
      setTotalPages(data.paginationDetais.totalPages);


    } catch (error) {
      console.log('Error fetching dish list:', error);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchDishes();
      //setRefreshListAux((prev) => prev + 1);
  }, [dishcontrolPopup ,filters, currentPage, itemsPerPage]);

  
  /* ==== LOCAL FILTER ==== */
  /*const filteredList = listAllDishes.filter((dish) => {
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

 ==== PAGINATE ==== 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage); */

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
            placeholder="DISABLE... Search by name"
            value={filters.name}
            disabled={true}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, name: e.target.value }))
            }
            className="capitalize flex-1 sm:w-auto 
            px-4 py-2 border background-gray-300 border-gray-300 rounded-md 
            text-sm w-full md:w-60 cursor-not-allowed"
          />

          <div className="flex flex-wrap gap-4 items-center w-full">
            {listCategories.length > 0 && (
              <div className="flex items-center flex-wrap gap-2 w-full">
                <label className="text-sm w-30 md:w-full text-gray-700">Category:</label>
                <select
                  value={filters.category}
                  disabled={loading}
                  onChange={(e) =>{
                    setFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                    })),
                  setCurrentPage(1);
                }}
                  className="
                    capitalize px-3 py-2 border border-gray-300 
                    rounded-md text-sm w-full cursor-pointer "
                >
                  <option value="0">All categories</option>
                  {listCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {listIngredients.length > 0 && (
              <div className="flex items-center flex-wrap gap-2 w-full">
                <label className="text-sm text-gray-700 w-30 md:w-full ">
                  Ingredients / side dishes:
                </label>
                <select
                  value={filters.ingredients}
                  disabled={loading}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      ingredients: e.target.value,
                    }))
                  }
                  className="
                    capitalize px-3 py-2 border border-gray-300 
                    rounded-md text-sm w-full cursor-pointer"
                >
                  <option value="0">All options</option>
                  {listIngredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {listTags.length > 0 && (
              <div className="flex items-center flex-wrap gap-2 w-full">
                <label className="text-sm text-gray-700 w-30  md:w-full ">Highlights:</label>
                <select
                  value={filters.tag}
                  disabled={loading}
                  onChange={(e) =>{
                    setFilters((prev) => ({ ...prev, tag: e.target.value })),
                    setCurrentPage(1);
                  }}
                  className="capitalize px-3 py-2 border border-gray-300 
                  rounded-md text-sm w-full cursor-pointer "
                >
                  <option value="0">Other highlights</option>
                  {listTags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* ==== FILTER: ACTIVE ONLY ==== */}
        <div className="flex items-center flex-wrap justify-between gap-4 mb-4 w-30 md:w-full ">
          <label>Show only active items?</label>
          <span className="flex items-center justify-start gap-2 w-full ">
            <input
              type="checkbox"
              disabled={loading}
              checked={filters.isActive}
              className='cursor-pointer'
              onChange={(e) =>{
                setFilters((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                })),
              setCurrentPage(1)}
              }
            />
            {filters.isActive ? 'Yes' : 'No'}
          </span>
        </div>
      </section>

      {/* ==== LIST ==== */}
      <div className="space-y-4">
        {listAllDishes.length > 0 ? (
          <>
            {listAllDishes.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
              >
                <div className="flex items-start flex-col md:flex-row justify-between gap-6">
                  <h3 className="flex-2 text-lg uppercase font-bold text-gray-800 break-all ">
                    {item.name}
                  </h3>
                </div>

                <p className="text-lg text-gray-700 mt-1">
                  Price:{' '}
                  <span className="font-medium">
                    R$ {parseFloat(item.price).toFixed(2)}
                  </span>
                </p>

                <div className="mt-2 text-wrap break-all">
                  <p className="text-lg text-gray-700 font-medium text-wrap break-all ">
                    Description:
                  </p>
                  <p className="text-lg text-gray-600 mt-1 ">{item.description}</p>
                </div>

                <div className="text-lg text-gray-500 mt-3 space-y-1">
                  <p>Category: {item.category.name}</p>
                  <p>
                    {item.createdAt && !isNaN(new Date(item.createdAt).getTime())
                      ? 'Created: ' + new Date(item.createdAt).toLocaleDateString('en-US')
                      : ''}
                  </p>

                </div>

                <div className="mt-4 space-y-2 text-wrap ">
                  <ListIngredientsByDisheId
                    propDishId={item.id}
                    refreshTable={refreshListsAux}
                  />

                  <ListTagsByDisheId
                    propDishId={item.id}
                    refreshTable={refreshListsAux}
                  />
                </div>

                <div className='w-full justify-end mb-2'>
                    <span
                      className={`text-sm font-medium px-2.5 py-0.5 rounded-full w-fit
                        ${item.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'}`
                      }
                    >
                      {item.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                <div className="w-full sm:w-36 mb-2">
                  <ListImagesByDish dishId={item.id} refresh={dishcontrolPopup}/>
                </div>

                <div className="flex gap-2 justify-end  gap-6  flex-wrap ">
                  <div className='w-full flex flex-wrap gap-4 justify-end'>
                    <button
                      onClick={() => {
                        clickButtonEdit(item.id)
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-sm rounded md:w-30 w-auto "
                    >
                      Edit
                    </button>

                    <BtnDeleteDish adminKey={adminKey} dishID={item.id} onDelete={fetchDishes} />
                  </div>
                </div>

              </div>
            ))}
          </>
        ) : (
          <p>No items registered</p>
        )}

        {/* ==== PAGINATION ==== */}
        <div className="flex gap-2 mt-4 md:justify-end justify-center ">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1  || loading}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

      {/* ==== POPUP ==== */}
      {dishcontrolPopup && (
        <AddDishes
          adminKey={adminKey}
          propDishID={dishEditId}
          handleToggleControlPopup={toggleControlPopup}
          controlPopup={dishcontrolPopup}
        />
      )}
    </div>
  );
}
