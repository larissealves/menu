import React, { useEffect, useState } from 'react'

import Tooltip from './tooltip/Tooltip';

export default function BtnDeleteTag({ tagID, onDelete }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';

  const [hasDishesLinked, setHasDishesLinked] = useState(false)

  // Buscar pratos com tag
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/get/filterDishesByTag/${tagID}}`);
        const data = await res.json();
        setHasDishesLinked(data.length > 0);
      } catch (error) {
        console.error('Erro ao buscar pratos vinculados à tag informada', error);
      }
    };
    if (tagID) fetchDishes();
  }, [tagID]);

  const handleDeleteSubmit = async () => {
    const endpoint = `${API_BASE_URL}/api/delete/tag/${tagID}`;

    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
      });

      onDelete();
      
    } catch (error) {
      console.error('Erro ao deletar esta tag', error);
    }
  };

  return (
    <div>
      {hasDishesLinked ?
        (
          <Tooltip className={'disable'} tooltipContent={'Not allowed. There are dishes linked to this tag'}>
            <button
              type="button"
              disabled={hasDishesLinked}
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
            disabled={hasDishesLinked}
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
