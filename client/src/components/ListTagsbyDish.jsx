import React, { useState, useEffect } from 'react';

export default function ListTagsByDisheId({ propDishId, refreshTable }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_PROD;

  const TOKEN_FOR_API = import.meta.env.VITE_API_SECRET;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN_FOR_API}`
  };

  const [listTags, setListTags] = useState([]);


  const fetchDishes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tags/${propDishId}/dishes`, { headers });
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
          className="bg-blue-100 text-blue-800 text-center text-sm font-medium px-2.5 py-0.5 rounded-full 
          w-fit mb-4 lowercase"
        >
          {item.tag?.name}
        </span>
      ))}
    </div>
  );
}
