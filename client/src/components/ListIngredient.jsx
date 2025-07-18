/* ==== IMPORTS ==== */
import React, { useEffect, useState } from 'react';
import AddIngredient from './NewIngredient';
import BtnDeleteIngredient from './BtnDeleteIngredient';

export default function ListIngredient({ showInList }) {
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  /* ==== STATES ==== */
  const [filters, setFilters] = useState({ option: '' });
  const [listIngredient, setIngredient] = useState([]);
  const [ingredientEditID, setIngredientEditID] = useState(null);
  const [controlPopup, setControlPopup] = useState(false);

  /* ==== FETCH DATA ==== */
  const fetchIngredient = async () => {
    try {
      const res = await fetch('${API_BASE_URL}/api/get/ingredientList');
      const data = await res.json();
      setIngredient(data);
    } catch (error) {
      console.log('Error fetching ingredient list:', error);
    }
  };

  /* ==== HANDLERS ==== */
  const toggleControlPopup = () => {
    if (controlPopup) {
      fetchIngredient();
    }
    setControlPopup(!controlPopup);
  };

  const editIngredient = (id) => {
    setIngredientEditID(id);
    setControlPopup(true);
  };

  /* ==== FILTER ==== */
  const filteredList = listIngredient.filter((item) => {
    const matchIsActive =
      filters.option !== ''
        ? item.isActive === (filters.option === 'true')
        : true;
    return matchIsActive;
  });

  /* ==== EFFECT ==== */
  useEffect(() => {
    if (!controlPopup) {
      fetchIngredient();
    }
  }, [controlPopup]);

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
      <div className="space-y-2">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className={`grid grid-cols-1 md:grid-cols-5 items-center border px-4 py-3 rounded-md ${
              showInList ? 'bg-gray-50' : 'hover:bg-gray-100'
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
            {!showInList && (
              <div className="flex gap-2 justify-end mt-2 md:mt-0">
                <button
                  onClick={() => editIngredient(item.id)}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
                >
                  Edit
                </button>
                <BtnDeleteIngredient ingredientID={item.id} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ==== POPUP ==== */}
      {controlPopup && (
        <AddIngredient
          propsIngredientID={ingredientEditID}
          handletoggleControlPopup={toggleControlPopup}
          controlPopup={controlPopup}
        />
      )}
    </div>
  );
}
