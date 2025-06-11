import React, { useState, useEffect} from 'react';

export default function ListIngredientsByDisheId ({propDishId}) {
    const [listIngredients, setListIngredients] = useState([])

    useEffect(() => {
            const fetchDishes = async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/get/filterIngredientsByDishId/${propDishId}`);
                    const data = await res.json();
                    setListIngredients(data);
                    console.log(data)
                } catch (error) {
                    console.log('Front: erro ao buscar a lista de ingredientes', error);
                }
            };
            fetchDishes();
        }, []);

    return(
        <div>
            {listIngredients.length > 0 &&(
                 <div>
                {listIngredients.map((item) => (
                    <span>
          {listIngredients
            .map((item) => item.ingredient?.name)
            .filter(Boolean)
            .join(', ')}
        </span>
                ))}
                </div>
            )}

        </div>
    );
}