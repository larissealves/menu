import React, { useEffect, useState } from 'react'

export default function BtnDeleteCategory({ categoryID, onDelete }) {
  const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';

  
  const [hasDishesLinked, setHasDishesLinked] = useState(false)

  // Buscar pratos com base na categoryID
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/get/filterDishesByCategoryId/${categoryID}`);
        const data = await res.json();
        console.log('AAAAAAAAAAAAAAAA', res.json)
        setHasDishesLinked(data.length > 0);
      } catch (error) {
        console.error('Erro ao buscar pratos vinculados à categoria:', error);
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

      if (res.ok) {
        if (onDelete) onDelete(); 
      } else {
        console.error('Erro ao deletar categoria');
      }
    } catch (error) {
      console.error('Erro ao deletar esta categoria', error);
    }
  };

  return (
    <div>
      <button
        type="button"
        title={hasDishesLinked ? 'There are dishes linked to this category' : ''}
        disabled={hasDishesLinked} 
        onClick={handleDeleteSubmit}
        className={`px-4 py-2 rounded text-white cursor-pointer ${
          hasDishesLinked ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        Delete
      </button>
    </div>
  );
}
