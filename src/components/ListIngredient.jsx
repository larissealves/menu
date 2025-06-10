import React, { useEffect, useState } from 'react';

import AddIngredient from './NewIngredient';
import BtnDeleteIngredient from '../components/BtnDeleteIngredient'

export default function ListIngredient({ showInList }) {

    const [listIngredient, setIngredient] = useState([]);
    const [ingredientEditID, setIngredientEditID] = useState(null);

    const [controlPopup, setControlPopup] = useState(false);

    const toggleControlPopup = () => {
        setControlPopup(!controlPopup)
    }

    // Abre modal com o ID da categoria para edição
    const editCategory = (id) => {
        setIngredientEditID(id);
        setControlPopup(true);
    };

    // Buscar categorias ao carregar o componente
    useEffect(() => {
        const fetchIngredient = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/get/ingredientList');
                const data = await res.json();
                setIngredient(data);
            } catch (error) {
                console.log('Erro ao buscar a lista de ingredientes', error);
            }
        };
        fetchIngredient();
    }, []);

    return (
        <div>
            {showInList ? "" : <h2 className="text-xl font-bold mb-4">Ingredients</h2>}
            {listIngredient.map((item) => (
                <div key={item.id} className="mb-2 flex items-center gap-4">
                    {showInList ? (
                        <div className='list-tags'>
                            <span>{item.name}</span>
                        </div>
                    ) :
                        <>
                            <span>{item.name}</span>
                            <span>{item.id}</span>
                            <button
                                onClick={() => editCategory(item.id)}
                                className="px-2 py-1 bg-blue-500 text-white rounded"
                            >
                                Edit
                            </button>

                            <BtnDeleteIngredient
                                ingredientID={item.id}
                                onDelete={() => {
                                    toggleControlPopup();
                                }}
                            />
                        </>
                    }
                </div>
            ))}

            {/* Popup do formulário */}
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
