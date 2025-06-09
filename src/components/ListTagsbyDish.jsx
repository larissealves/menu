import React, { useState, useEffect} from 'react';

export default function ListTagsByDisheId ({propDishId}) {
    const [listTags, setListTags] = useState([])

    useEffect(() => {
            const fetchDishes = async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/get/filterTagByDishId/${propDishId}`);
                    const data = await res.json();
                    setListTags(data);
                    console.log(data)
                } catch (error) {
                    console.log('Erro ao buscar a lista de tags', error);
                }
            };
            fetchDishes();
        }, []);

    return(
        <div>
            {listTags.length > 0 &&(
                 <div>
                {listTags.map((item) => (
                    <div key={item.id} >
                    <span> {item.tag.name} </span>
                    </div>
                ))}
                </div>
            )}

        </div>
    );
}