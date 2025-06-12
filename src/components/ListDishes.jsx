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
  <div>
    <h2 className="text-xl font-semibold mb-6 border-b pb-3 text-gray-800">Pratos</h2>

    <div className="space-y-4">
      {listAllDishes.map((item) => (
        <div
          key={item.id}
          className="border rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
        >
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-700 mt-1">
                Price: <span className="font-medium">R$ {parseFloat(item.price).toFixed(2)}</span>
              </p>

              <div className="mt-2">
                <p className="text-sm text-gray-700 font-medium">Description:</p>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>

              <div className="text-sm text-gray-500 mt-3 space-y-1">
                <p>Created: {new Date(item.createdAt).toLocaleDateString('pt-BR')}</p>
                <p>Last update: {new Date(item.updatedAt).toLocaleDateString('pt-BR')}</p>
                <p>
                  Status:{' '}
                  <span className={item.isActive ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                    {item.isActive ? 'Active' : 'Disabled'}
                  </span>
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <ListIngredientsByDisheId propDishId={item.id} />
                <ListTagsByDisheId propDishId={item.id} />
              </div>
            </div>

            <div className="flex md:flex-col justify-end gap-2">
              <button
                onClick={() => clickButtonEdit(item.id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-sm rounded"
              >
                Edit
              </button>
              <BtnDeleteDish 
                dishID={item.id} 
                onDelete = {fetchDishes }
              />
            </div>
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
