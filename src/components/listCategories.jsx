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
   <div className="">
  <h2 className="text-xl font-semibold mb-6 border-b pb-3 text-gray-700">Categories</h2>

  <div className="space-y-3">
    {listCategories.map((item) => (
      <div
        key={item.id}
        className="grid grid-cols-1 md:grid-cols-5 items-center border rounded px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
      >
        <span className="font-medium text-gray-800">{item.name}</span>
        <span className="text-sm text-gray-500">
          Created: {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </span>
        <span className="text-sm text-gray-500">
          Last update:  {new Date(item.updatedAt).toLocaleDateString('pt-BR')}
        </span>
        <span
          className={`text-sm font-semibold ${
            item.isActive ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {item.isActive ? 'Active' : 'Disabled'}
        </span>
        <div className="flex justify-end gap-4 mt-2 md:mt-0">
          <button
            onClick={() => editCategory(item.id)}
            className="px-3 py-1 text-sm bg-fuchsia-600 hover:bg-violet-700 text-white rounded cursor-pointer"
          >
            Edit
          </button>
          <BtnDeleteCategory
            categoryID={item.id}
            onDelete={fetchCategories}
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
