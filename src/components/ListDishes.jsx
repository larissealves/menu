import React, { useState, useEffect} from 'react';

export default function ListAllDishes() {
    const [listAllDishes, setListAllDishes] = useState([])

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

    return(
        <div>
        {listAllDishes.map((item) => (
                        <div key={item.id} className="mb-2 flex items-center gap-4">
                            <span>{item.name}</span>
                            <span>{item.price}</span>
                            <span>{item.description}</span>
                            <span>{item.isActive}</span>
                        </div>
                    ))}

        </div>
    );
}