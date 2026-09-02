/* ==== IMPORTS ==== */
import React, { useEffect, useState } from 'react';
import AddCategory from './NewCategory';
import BtnDeleteCategory from './BtnDeleteCategory';

export default function ListCategories({ adminKey, categoriesControlPopup, onClose }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || import.meta.env.API_URL_PROD;

  const TOKEN_FOR_API = import.meta.env.API_SECRET;
  const headers = {
    Authorization: `Bearer ${TOKEN_FOR_API}`,
    'x-admin-key': adminKey,
  };


  /* ==== STATES ==== */
  const [filters, setFilters] = useState({ option: 'null' });
  const [listCategories, setCategories] = useState([]);
  const [categoryEditID, setCategoryEditID] = useState(null);
  const [controlPopup, setControlPopup] = useState(false);
  const [loading, setLoading] = useState(false);


  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  /* ==== HANDLERS ==== */
  const editCategory = (id) => {
    setCategoryEditID(id);
    onClose();
  };

  const closePopup = () => {
    if (categoryEditID) setCategoryEditID(0);
    onClose();
  }

  /* ==== FETCH DATA ==== */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/categories?onlyActives=${filters.option}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`, { headers, });
      const data = await res.json();
      setCategories(data.data);
      setCurrentPage(data.paginationDetails.currentPage);
      setTotalPages(data.paginationDetails.totalPages);
    } catch (error) {
      console.log('Error fetching category list:', error);
    }
    finally {
      setLoading(false);
    }
  };

  /* ==== EFFECT ==== */
  useEffect(() => {
    if (!controlPopup) {
      fetchCategories();
    }
  }, [controlPopup, currentPage, filters]);

  useEffect(() => {
    setControlPopup(categoriesControlPopup);
  }, [categoriesControlPopup]);


  /* ==== RENDER ==== */
  return (
    <div>
      {/* ==== TITLE ==== */}
      <h2 className="text-xl font-semibold mb-6 border-b pb-3 text-gray-700">
        Categories
      </h2>

      {/* ==== ALERT ==== */}
      <p className="text-orange-600 font-bold mb-4">
        Alert: <br />
        All dishes linked to categories with 'Disabled' status will become
        unavailable on the menu. <br />
        Before deactivating a category, make sure to refresh the dish list.
      </p>

      {/* ==== FILTER ==== */}
      <div className="mb-4">
        <select
          value={filters.option}
          disabled={loading}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, option: e.target.value }),
              setCurrentPage(1))
          }
          className={`capitalize px-3 py-2 border border-gray-300 
            rounded-md text-sm  w-full md:w-[30%]
            ${loading ? "cursor-not-allowed" : ""}`
          }
        >
          <option value="null">All items</option>
          <option value="true">Active items</option>
          <option value="false">Disabled items</option>
        </select>
      </div>

      {/* ==== LIST ==== */}
      <div className="space-y-3">
        {listCategories.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-1 md:grid-cols-5 items-center border rounded px-4 py-3 bg-gray-50 hover:bg-gray-100 transition gap-2"
          >
            <span className="font-medium text-gray-800 break-all capitalize  ">
              {item.name}
            </span>
            <span className="text-sm text-gray-500">
              Created: {new Date(item.createdAt).toLocaleDateString('en-US')}
            </span>
            <span className="text-sm text-gray-500">
              Last update:{' '}
              {new Date(item.updatedAt).toLocaleDateString('en-US')}
            </span>

            <span
              className={`text-sm font-medium px-2.5 py-0.5 rounded-full w-fit 
              ${item.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800'
                }`}
            >
              {item.isActive ? 'Active' : 'Disabled'}
            </span>

            {/* ==== ACTIONS ==== */}
            <div className="flex gap-4 mt-2 md:mt-0 justify-end">
              <button
                onClick={() => editCategory(item.id)}
                className="px-3 py-1 text-sm bg-fuchsia-600 hover:bg-violet-700 text-white rounded cursor-pointer"
              >
                Edit
              </button>

              <BtnDeleteCategory
                adminKey={adminKey}
                categoryID={item.id}
                onDelete={fetchCategories}
              />
            </div>
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
      {categoriesControlPopup && (
        <AddCategory
          adminKey={adminKey}
          propsCategoryID={categoryEditID}
          handleToggleControlPopup={closePopup}
          controlPopup={categoriesControlPopup}
        />
      )}
    </div>
  );
}
