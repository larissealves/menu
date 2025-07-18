import React, { useState, useEffect } from 'react';

export default function ListTagsByDisheId({ propDishId, refreshTable }) {
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [listTags, setListTags] = useState([]);


  const fetchDishes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/get/filterTagByDishId/${propDishId}`);
      const data = await res.json();
      setListTags(data);
    } catch (error) {
      console.log('Erro ao buscar a lista de tags', error);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, [propDishId, refreshTable]);


  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {listTags.length > 0 && listTags.map((item) => (
        <span
          key={item.id}
          className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full"
        >
          {item.tag?.name}
        </span>
      ))}
    </div>
  );
}
