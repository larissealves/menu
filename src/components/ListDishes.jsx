import React, { useState, useEffect } from 'react';
import AddDishes from './NewDishes';
import ListTagsByDisheId from './ListTagsbyDish';
import ListIngredientsByDisheId from './ListIngredientsbyDish';
import BtnDeleteDish from './BtnDeleteDish';

export default function ListAllDishes() {
  const [dishEditId, setDishEditId] = useState(null);
  const [listAllDishes, setListAllDishes] = useState([]);
  const [controlPopup, setControlPopup] = useState(false);

  const toggleControlPopup = () => setControlPopup(!controlPopup);

  const clickButtonEdit = (id) => {
    setDishEditId(id);
    toggleControlPopup();
  };

  const fetchDishes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/get/dishes');
      const data = await res.json();
      setListAllDishes(data);
    } catch (error) {
      console.log('Erro ao buscar a lista de pratos', error);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2">Pratos</h2>

      <div className="space-y-4">
        {listAllDishes.map((item) => (
          <div key={item.id} className="border rounded p-4 shadow-sm hover:bg-gray-50 transition">
            <div className="flex justify-between items-start flex-wrap">
              <div>
                <h3 className="text-md font-bold">{item.name}</h3>
                <p className="text-sm text-gray-700 mb-1">Preço: R$ {item.price}</p>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <p className="text-xs text-gray-500">Ativo: {item.isActive ? 'Sim' : 'Não'}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => clickButtonEdit(item.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Editar
                </button>
                <BtnDeleteDish dishID={item.id} />
              </div>
            </div>

            <div className="mt-3">
              <ListIngredientsByDisheId propDishId={item.id} />
              <ListTagsByDisheId propDishId={item.id} />
            </div>
          </div>
        ))}
      </div>

      {controlPopup && (
        <AddDishes
          propDishID={dishEditId}
          togglePopup={toggleControlPopup}
          controlPopup={controlPopup}
        />
      )}
    </div>
  );
}
