import React, { useEffect, useState } from 'react'

import Tooltip from "../components/tooltip/Tooltip"

export default function BtnDeleteCategory({ categoryID, onDelete }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';


  const [hasDishesLinked, setHasDishesLinked] = useState(false);
  const [loading, setLoading] = useState();

  // Buscar pratos com base na categoryID
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/get/filterDishesByCategoryId/${categoryID}`);
        const data = await res.json();
        setHasDishesLinked(data.length > 0);
      }

      catch (error) {
        console.error('Erro ao buscar pratos vinculados à categoria:', error);
      }

      finally {
        setLoading(false);
      }
    };
    if (categoryID) fetchDishes();
  }, [categoryID]);

  const handleDeleteSubmit = async () => {
    const endpoint = `${API_BASE_URL}/api/delete/category/${categoryID}`;

    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
      });

      onDelete();

    } catch (error) {
      console.error('Erro ao deletar esta categoria', error);
    }
  };

  return (
    <div>
      {!loading && (
        <>{hasDishesLinked ? (
          <Tooltip className={'disabled'} tooltipContent={'Not allowed. There are dishes linked to this category'}>
            <button type="button"
              disabled={true}
              className={
                `px-4 py-2 rounded text-white cursor-pointer bg-gray-400 cursor-not-allowed'`
              }
            >
              Delete
            </button>
          </Tooltip>

        ) : (
          <button type="button"
            disabled={hasDishesLinked}
            onClick={handleDeleteSubmit}
            className={
              `px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white cursor-pointer`
            }
          >
            Delete
          </button>
        )}</>
      )}
    </div>
  );
}
