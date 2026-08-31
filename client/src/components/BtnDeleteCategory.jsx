import React, { useEffect, useState } from 'react'

import Tooltip from "../components/tooltip/Tooltip"

export default function BtnDeleteCategory({ adminKey, categoryID, onDelete }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';

  const TOKEN_FOR_API = import.meta.env.VITE_API_SECRET;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN_FOR_API}`,
    'x-admin-key': adminKey,
  }

  const [hasDishesLinked, setHasDishesLinked] = useState(false);
  const [loading, setLoading] = useState();

  // Buscar pratos com base na categoryID
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/dishes/${categoryID}/categories`);
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
    setLoading(true);

    if (!adminKey) {
      alert('For this action, please provide the admin key.');
      setLoading(false);
      return;
    }

    const endpoint = `${API_BASE_URL}/api/categories/${categoryID}`;

    try {
      const res = await fetch(endpoint, {
        headers,
        method: 'DELETE',
      });

      if (res.status === 403) {
        alert('For this action, please provide the admin key.');
        setLoading(false);
        return;
      }

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
            disabled={hasDishesLinked || loading}
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
