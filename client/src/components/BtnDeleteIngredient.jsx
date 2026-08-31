import React, { useEffect, useState } from 'react'

import Tooltip from './tooltip/Tooltip';

export default function BtnDeleteIngredient({ adminKey, ingredientID, onDelete }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';

  const TOKEN_FOR_API = import.meta.env.VITE_API_SECRET;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN_FOR_API}`,
    'x-admin-key': adminKey,
  }

  const [hasDishesLinked, setHasDishesLinked] = useState(false)
  const [loading, setLoading] = useState(false);

  // Buscar pratos com base na ingredientID
  useEffect(() => {
    setLoading(true);
    const fetchDishes = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/dishes/${ingredientID}/ingredients`);
        const data = await res.json();
        setHasDishesLinked(data.length > 0);
      } catch (error) {
        console.error('Erro ao buscar pratos vinculados à este ingrediente', error);
      }
      finally {
        setLoading(false);
      }
    };
    if (ingredientID) fetchDishes();
  }, [ingredientID]);

  const handleDeleteSubmit = async () => {
    setLoading(true);
    if (!adminKey) {
      alert('For this action, please provide the admin key.');
      setLoading(false);
      return;
    }
    const endpoint = `${API_BASE_URL}/api/ingredients/${ingredientID}`;

    try {
      const res = await fetch(endpoint, {
        headers,
        method: 'DELETE',
      });

      if (res.status === 403 ) {
        alert('For this action, please provide the admin key.');
        return;
      }

      onDelete();

    } catch (error) {
      console.error('Erro ao deletar esta ingrediente', error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {hasDishesLinked ? (
        <Tooltip className={'disable'} tooltipContent={'Not allowed. There are dishes linked to this ingredient'}>
          <button
            type="button"
            title={hasDishesLinked ? 'There are dishes linked to this ingredient' : ''}
            disabled={hasDishesLinked || loading}
            onClick={handleDeleteSubmit}
            className={`px-4 py-2 rounded text-white cursor-pointer ${hasDishesLinked ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
              }`}
          >
            Delete
          </button>
        </Tooltip>
      ) : (
        <button
          type="button"
          disabled={hasDishesLinked || loading}
          onClick={handleDeleteSubmit}
          className={`px-4 py-2 rounded text-white cursor-pointer ${hasDishesLinked ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
        >
          Delete
        </button>
      )}
    </div>
  );
}
