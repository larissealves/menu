import React, { useState, useEffect } from 'react';

export default function ListIngredientsByDisheId({ propDishId, refreshTable }) {
  const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';


    const [listIngredients, setListIngredients] = useState([])
    
    const fetchDishes = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/get/filterIngredientsByDishId/${propDishId}`);
            const data = await res.json();
            setListIngredients(data);
        } catch (error) {
            console.log('Front: erro ao buscar a lista de ingredientes', error);
        }
    };

    useEffect(() => {
        fetchDishes();
    }, [propDishId, refreshTable]);

    return (
        <div>
            {listIngredients.length > 0 && (
                <>
                    <p> Ingredients / side dishes: </p>
                    <div>
                        <span className='text-gray-500 capitalize'>
                            {listIngredients
                                .map((item) => item.ingredient?.name)
                                .filter(Boolean)
                                .join(', ')}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}