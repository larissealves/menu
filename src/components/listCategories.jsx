import React, { useEffect, useState } from 'react';
import AddCategory from './NewCategory';
import BtnDeleteCategory from './BtnDeleteCategory';

export default function ListCategories() {
  const [listCategories, setCategories] = useState([]);
  const [categoryEditID, setCategoryEditID] = useState(null);
  const [controlPopup, setControlPopup] = useState(false);

  const toggleControlPopup = () => {
    setControlPopup(!controlPopup);
  };

  const editCategory = (id) => {
    setCategoryEditID(id);
    setControlPopup(true);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/get/categoryList');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.log('Erro ao buscar a lista de categorias', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2">Categorias</h2>

      <div className="space-y-3">
        {listCategories.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border rounded px-3 py-2 hover:bg-gray-50"
          >
            <span className="font-medium">{item.name}</span>
            <span className="font-medium">{item.updatedAt}</span>
            <span className="font-medium">{item.isActive}</span>
            <div className="flex gap-2">
              <button
                onClick={() => editCategory(item.id)}
                className="px-2 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                Editar
              </button>
              <BtnDeleteCategory
                categoryID={item.id}
                onDelete={fetchCategories} // atualiza após delete
              />
            </div>
          </div>
        ))}
      </div>

      {controlPopup && (
        <AddCategory
          propsCategoryID={categoryEditID}
          handletoggleControlPopup={toggleControlPopup}
          controlPopup={controlPopup}
        />
      )}
    </div>
  );
}
