import React, { useEffect, useState } from 'react';
import AddCategory from './NewCategory';

export default function ListCategories() {

  const [listCategories, setCategories] = useState([]);
  const [categoryEditID, setCategoryEditID] = useState(null);

  const [controlPopup, setControlPopup] = useState(false);
  
  const toggleControlPopup = () => {
    setControlPopup(!controlPopup)
  }

  // Abre modal com o ID da categoria para edição
  const editCategory = (id) => {
    setCategoryEditID(id);
    setControlPopup(true);
  };

  // Buscar categorias ao carregar o componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/get/categoryList');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.log('Erro ao buscar a lista de categorias', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      {listCategories.map((item) => (
        <div key={item.id} className="mb-2 flex items-center gap-4">
          <span>{item.name}</span>
          <button
            onClick={() => editCategory(item.id)}
            className="px-2 py-1 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
        </div>
      ))}

      {/* Popup do formulário */}
      {controlPopup && (
        <AddCategory
          propsCategoryID={categoryEditID}
          handletoggleControlPopup={toggleControlPopup}
          controlPopup = { controlPopup}
        />
      )}
    </div>
  );
}
