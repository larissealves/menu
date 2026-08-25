import React, { useEffect, useState } from 'react'

import Tooltip from './tooltip/Tooltip';

export default function BtnDeleteTag({adminKey, tagID, onDelete }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';
  const TOKEN_FOR_API = import.meta.env.VITE_API_SECRET;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN_FOR_API}`,
    'x-admin-key': adminKey,
  }

  const [hasDishesLinked, setHasDishesLinked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Buscar pratos com tag
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/get/filterDishesByTag/${tagID}}`);
        const data = await res.json();
        setHasDishesLinked(data.length > 0);
      } catch (error) {
        console.error('Erro ao buscar pratos vinculados à tag informada', error);
      }
      finally {
        setLoading(false);
      }
    };
    if (tagID) fetchDishes();
  }, [tagID]);

  const handleDeleteSubmit = async () => {
    setLoading(true);
    if (!adminKey) {
      alert('For this action, please provide the admin key.');
      setLoading(false);
      return;
    }
    const endpoint = `${API_BASE_URL}/api/delete/tag/${tagID}`;

    try {
      const res = await fetch(endpoint, {
        headers,
        method: 'DELETE',
      });

      onDelete();

      if (res.status === 403) {
        alert('For this action, please provide the admin key.');
        setLoading(false);
        return;
      }

    } catch (error) {
      console.error('Erro ao deletar esta tag', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {hasDishesLinked ?
        (
          <Tooltip className={'disable'} tooltipContent={'Not allowed. There are dishes linked to this tag'}>
            <button
              type="button"
              disabled={hasDishesLinked || loading}
              onClick={handleDeleteSubmit}
              className={`px-4 py-2 rounded text-white cursor-pointer ${hasDishesLinked ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                }`}
            >
              Delete
            </button>
          </Tooltip>
        )
        : (
          <button
            type="button"
            title={hasDishesLinked ? 'There are dishes linked to this tag' : ''}
            disabled={hasDishesLinked || loading}
            onClick={handleDeleteSubmit}
            className={`px-4 py-2 rounded text-white cursor-pointer ${hasDishesLinked ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
              }`}
          >
            Delete
          </button>
        )
      }
    </div>
  );
}
