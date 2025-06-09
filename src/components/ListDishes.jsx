import React, { useState, useEffect } from 'react';

import AddDishes from './NewDishes'
import ListTagsByDisheId from './ListTagsbyDish'
import ListIngredientsByDisheId from './ListIngredientsbyDish'
import BtnDeleteDish from './BtnDeleteDish'

export default function ListAllDishes() {
    const [dishEditId, setdishEditId] = useState(null);
    const [listAllDishes, setListAllDishes] = useState([])

    const [controlPopup, setControlPopup] = useState(false);
    const toggleControlPopup = () => {
        setControlPopup(!controlPopup);
    };

    const clickButtonEdit = (id) => {
        setdishEditId(id);
        toggleControlPopup();
    }

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/get/dishes');
                const data = await res.json();
                setListAllDishes(data);
            } catch (error) {
                console.log('Erro ao buscar a lista de pratos', error);
            }
        };
        fetchDishes();
    }, []);

    return (
        <div>
            {listAllDishes.map((item) => (
                <div key={item.id} className="mb-2 flex items-center gap-4">
                    <span>{item.name}</span>
                    <span>{item.price}</span>
                    <span>{item.description}</span>
                    <span>{item.isActive}</span>
                    <ListIngredientsByDisheId 
                        propDishId = {item.id}
                    />

                    < ListTagsByDisheId 
                        propDishId = {item.id}
                    />
                    <button onClick={() => clickButtonEdit(item.id)}
                        className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                        Edit
                    </button>

                    <BtnDeleteDish
                        dishID = {item.id} 
                    />
                    
                </div>
            ))}

            {controlPopup && (
                < AddDishes
                    propDishID={dishEditId}
                    togglePopup={toggleControlPopup}
                    controlPopup={controlPopup}
                />
            )}

        </div>
    );
}