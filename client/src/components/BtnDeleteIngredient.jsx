import React, { useEffect, useState } from 'react'

export default function BtnDeleteIngredient({ ingredientID, onDelete }) {
  const [hasDishesLinked, setHasDishesLinked] = useState(false)

  // Buscar pratos com base na ingredientID
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/get/filterDishesByIngredientId/${ingredientID}`);
        const data = await res.json();
        setHasDishesLinked(data.length > 0);
      } catch (error) {
        console.error('Erro ao buscar pratos vinculados à este ingrediente', error);
      }
    };
    if (ingredientID) fetchDishes();
  }, [ingredientID]);

  const handleDeleteSubmit = async () => {
    const endpoint = `http://localhost:5000/api/delete/ingredient/${ingredientID}`;

    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (res.ok) {
        console.log('Ingrediente deletado com sucesso');
        if (onDelete) onDelete(); 
      } else {
        console.error('Erro ao deletar ingrediente');
      }
    } catch (error) {
      console.error('Erro ao deletar esta ingrediente', error);
    }
  };

  return (
    <div>
      <button
        type="button"
        title={hasDishesLinked ? 'There are dishes linked to this ingredient' : ''}
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
