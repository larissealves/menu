/* ==== IMPORTS ==== */
import React, { useEffect, useState } from 'react';
import AddIngredient from './NewIngredient';
import BtnDeleteIngredient from './BtnDeleteIngredient';

export default function ListIngredient({ showInList, ingredientControlPopup, onClose }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';
  
  const TOKEN_FOR_API = import.meta.env.VITE_API_SECRET;

  /* ==== STATES ==== */
  const [filters, setFilters] = useState({ option: 'null' });
  const [listIngredient, setIngredient] = useState([]);
  const [ingredientEditID, setIngredientEditID] = useState(null);
  const [loading, setLoading ] = useState(false);

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  /* ==== FETCH DATA ==== */
  const fetchIngredient = async () => {
    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${TOKEN_FOR_API}`,
      };
      const res = await fetch(`${API_BASE_URL}/api/get/ingredientList/${filters.option}/${itemsPerPage}/${currentPage}`,{headers,});
      const data = await res.json();
      setIngredient(data.data);
      setCurrentPage(data.paginationDetails.currentPage);
      setTotalPages(data.paginationDetails.totalPages);
    } catch (error) {
      console.log('Error fetching ingredient list:', error);
    }finally{
      setLoading(false);
    }
  };

  /* ==== HANDLERS ==== */
  const toggleControlPopup = () => {
    fetchIngredient();
    setIngredientEditID(null);
    onClose();
  };

  const editIngredient = (id) => {
    setIngredientEditID(id);
    onClose();
  };

  /* ==== FILTER ==== 
  const filteredList = listIngredient.filter((item) => {
    const matchIsActive =
      filters.option !== ''
        ? item.isActive === (filters.option === 'true')
        : true;
    return matchIsActive;
  });*/

  /* ==== EFFECT ==== */
  useEffect(() => {
    fetchIngredient();
  }, [currentPage, filters]);

  /* ==== RENDER ==== */
  return (
    <div>
      {/* ==== TITLE ==== */}
      {!showInList && (
        <h2 className="text-xl font-semibold mb-6 border-b pb-3 text-gray-700">
          Ingredients
        </h2>
      )}

      {/* ==== FILTER ==== */}
      <div className="mb-4">
        <select
          value={filters.option}
          disabled={loading}
          onChange={(e) => {
            setFilters((prev) => ({
              ...prev,
              option: e.target.value,
            }));

            setCurrentPage(1);
          }}
          className="capitalize px-3 py-2 border border-gray-300 rounded-md text-sm  w-full md:w-[30%] "
        >
          <option value="null">All items</option>
          <option value="true">Active items</option>
          <option value="false">Disabled items</option>
        </select>
      </div>

      {/* ==== LIST ==== */}
      <div className="space-y-2">
        {listIngredient.map((item) => (
          <div
            key={item.id}
            className={`grid grid-cols-1 md:grid-cols-5 items-center border px-4 py-3 rounded-md  capitalize gap-2 ${showInList ? 'bg-gray-50' : 'hover:bg-gray-100'
              } transition`}
          >
            <span className="text-sm text-gray-800 font-medium break-all">
              {item.name}
            </span>
            <span className="text-sm text-gray-500 hidden md:block">
              Created: {new Date(item.createdAt).toLocaleDateString('en-US')}
            </span>
            <span className="text-sm text-gray-500 hidden md:block">
              Last update: {new Date(item.updatedAt).toLocaleDateString('en-US')}
            </span>

            <span className="text-sm text-gray-500">
              Created: {new Date(item.createdAt).toLocaleDateString('en-US')}
            </span>
            <span className="text-sm text-gray-500">
              Last update:{' '}
              {new Date(item.updatedAt).toLocaleDateString('en-US')}
            </span>

            <span
              className={`text-sm font-medium px-2.5 py-0.5 rounded-full w-fit ${item.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
                }`}
            >
              {item.isActive ? 'Active' : 'Disabled'}
            </span>

            {/* ==== ACTIONS ==== */}
            {!showInList && (
              <div className="flex gap-2 justify-end mt-2 md:mt-0">
                <button
                  onClick={() => editIngredient(item.id)}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
                >
                  Edit
                </button>
                <BtnDeleteIngredient ingredientID={item.id} onDelete={fetchIngredient} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ==== PAGINATION ==== */}
      <div className="flex gap-2 mt-4 justify-center items-center md:justify-end  ">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || loading}
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

      {/* ==== POPUP ==== */}
      {ingredientControlPopup && (
        <AddIngredient
          propsIngredientID={ingredientEditID}
          handletoggleControlPopup={toggleControlPopup}
          controlPopup={ingredientControlPopup}
        />
      )}
    </div>
  );
}
