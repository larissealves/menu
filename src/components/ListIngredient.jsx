import React, { useEffect, useState } from 'react';

import AddIngredient from './NewIngredient';
import BtnDeleteIngredient from './BtnDeleteIngredient';

export default function ListIngredient({ showInList }) {
const [listIngredient, setIngredient] = useState([]);
const [ingredientEditID, setIngredientEditID] = useState(null);
const [controlPopup, setControlPopup] = useState(false);


const fetchIngredient = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/get/ingredientList');
    const data = await res.json();
    setIngredient(data);
  } catch (error) {
    console.log('Erro ao buscar a lista de ingredientes', error);
  }
};

const toggleControlPopup = () => {
  if (controlPopup) {
    fetchIngredient(); 
  }
  setControlPopup(!controlPopup);
};

const editIngredient = (id) => {
  setIngredientEditID(id);
  setControlPopup(true);
};

useEffect(() => {
  if (!controlPopup) {
    fetchIngredient(); 
  }
}, [fetchIngredient]);

  return (
  <div className="">
    {!showInList && (
      <h2 className="text-xl font-semibold mb-6 border-b pb-3 text-gray-700">Ingredientes</h2>
    )}

    <div className="space-y-2">
      {listIngredient.map((item) => (
        <div
          key={item.id}
          className={`grid grid-cols-1 md:grid-cols-5 items-center border px-4 py-3 rounded-md ${
            showInList ? 'bg-gray-50' : 'hover:bg-gray-100'
          } transition`}
        >
          <span className="text-sm text-gray-800 font-medium break-all">{item.name}</span>
          <span className="text-sm text-gray-500 hidden md:block">
           Created:  {new Date(item.createdAt).toLocaleDateString('pt-BR')}
          </span>
          <span className="text-sm text-gray-500 hidden md:block">
           Last update:   {new Date(item.updatedAt).toLocaleDateString('pt-BR')}
          </span>
           <span className={
              `text-sm font-medium px-2.5 py-0.5 rounded-full w-fit
                ${item.isActive ? 'bg-green-100 text-green-800'
                :
                'bg-orange-100 text-orange-800'
              }`
            }>

              {item.isActive ? 'Active' : 'Disabled'}
            </span>
          {!showInList && (
            <div className="flex gap-2 justify-end mt-2 md:mt-0">
              <button
                onClick={() => editIngredient(item.id)}
                className="px-3 py-1  cursor-pointer text-sm bg-blue-600 hover:bg-blue-700 cursor-point  text-white rounded"
              >
                Edit
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
