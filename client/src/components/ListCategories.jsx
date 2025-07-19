/* ==== IMPORTS ==== */
import React, { useEffect, useState } from 'react';
import AddCategory from './NewCategory';
import BtnDeleteCategory from './BtnDeleteCategory';

export default function ListCategories() {
  const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';


  /* ==== STATES ==== */
  const [filters, setFilters] = useState({ option: '' });
  const [listCategories, setCategories] = useState([]);
  const [categoryEditID, setCategoryEditID] = useState(null);
  const [controlPopup, setControlPopup] = useState(false);

  /* ==== HANDLERS ==== */
  const toggleControlPopup = () => {
    setControlPopup(!controlPopup);
    fetchCategories();
  };

  const editCategory = (id) => {
    setCategoryEditID(id);
    setControlPopup(true);
  };

  /* ==== FETCH DATA ==== */
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/get/categoryList`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.log('Error fetching category list:', error);
    }
  };

  /* ==== FILTER ==== */
  const filteredList = listCategories.filter((item) => {
    const matchIsActive =
      filters.option !== ''
        ? item.isActive === (filters.option === 'true')
        : true;
    return matchIsActive;
  });

  /* ==== EFFECT ==== */
  useEffect(() => {
    if (!controlPopup) {
      fetchCategories();
    }
  }, [controlPopup]);

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
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, option: e.target.value }))
          }
          className="capitalize px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All items</option>
          <option value="true">Active items</option>
          <option value="false">Disabled items</option>
        </select>
      </div>

      {/* ==== LIST ==== */}
      <div className="space-y-3">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-1 md:grid-cols-5 items-center border rounded px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
          >
            <span className="font-medium text-gray-800 break-all capitalize ">
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
              className={`text-sm font-medium px-2.5 py-0.5 rounded-full w-fit ${
                item.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800'
              }`}
            >
              {item.isActive ? 'Active' : 'Disabled'}
            </span>

            {/* ==== ACTIONS ==== */}
            <div className="flex justify-end gap-4 mt-2 md:mt-0">
              <button
                onClick={() => editCategory(item.id)}
                className="px-3 py-1 text-sm bg-fuchsia-600 hover:bg-violet-700 text-white rounded cursor-pointer"
              >
                Edit
              </button>
              <BtnDeleteCategory
                categoryID={item.id}
                onDelete={fetchCategories}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ==== POPUP ==== */}
      {controlPopup && (
        <AddCategory
          propsCategoryID={categoryEditID}
          handleToggleControlPopup={toggleControlPopup}
          controlPopup={controlPopup}
        />
      )}
    </div>
  );
}
