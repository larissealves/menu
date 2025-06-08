import React, { useEffect, useState } from 'react'

export default function BtnDeleteCategory({ categoryID, onDelete }) {
  const [hasDishesLinked, setHasDishesLinked] = useState(false)

  // Buscar pratos com base na categoryID
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/get/filterDishesById/${categoryID}`);
        const data = await res.json();
        setHasDishesLinked(data.length > 0);
      } catch (error) {
        console.error('Erro ao buscar pratos vinculados à categoria:', error);
      }
    };
    if (categoryID) fetchDishes();
  }, [categoryID]);

  const handleDeleteSubmit = async () => {
    const endpoint = `http://localhost:5000/api/delete/category/${categoryID}`;

    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (res.ok) {
        console.log('Categoria deletada com sucesso');
        if (onDelete) onDelete(); // callback opcional para atualizar a lista
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
        title={hasDishesLinked ? 'Há pratos vinculados a esta categoria' : ''}
        disabled={hasDishesLinked} // <-- corrigido
        onClick={handleDeleteSubmit}
        className={`px-4 py-2 rounded text-white ${
          hasDishesLinked ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        Delete
      </button>
    </div>
  );
}
