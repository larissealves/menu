import React, { useEffect, useState } from 'react';

import AddIngredient from './NewIngredient';
import BtnDeleteIngredient from './BtnDeleteIngredient';

export default function ListIngredient({ showInList }) {
  const [listIngredient, setIngredient] = useState([]);
  const [ingredientEditID, setIngredientEditID] = useState(null);
  const [controlPopup, setControlPopup] = useState(false);

  const toggleControlPopup = () => setControlPopup(!controlPopup);

  const editIngredient = (id) => {
    setIngredientEditID(id);
    setControlPopup(true);
  };

  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/get/ingredientList');
        const data = await res.json();
        setIngredient(data);
      } catch (error) {
        console.log('Erro ao buscar a lista de ingredientes', error);
      }
    };
    fetchIngredient();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      {!showInList && (
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Ingredientes</h2>
      )}

      <div className="space-y-2">
        {listIngredient.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between border p-2 rounded ${
              showInList ? 'bg-gray-50' : 'hover:bg-gray-50'
            }`}
          >
            <span className="text-sm">{item.name}</span>

            {!showInList && (
              <div className="flex gap-2">
                <button
                  onClick={() => editIngredient(item.id)}
                  className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Editar
                </button>
                <BtnDeleteIngredient ingredientID={item.id} />
              </div>
            )}
          </div>
        ))}
      </div>

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
