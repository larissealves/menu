import React, { useEffect, useState } from 'react';

import AddTag from './NewTag';
import BtnDeleteTag from '../components/BtnDeleteTag'

export default function ListTags({ showInList }) {

    const [listTags, setTags] = useState([]);
    const [tagsEditID, setTagsEditID] = useState(null);

    const [controlPopup, setControlPopup] = useState(false);

    const toggleControlPopup = () => {
        setControlPopup(!controlPopup)
    }

    // Abre modal com o ID da categoria para edição
    const editTag = (id) => {
        setTagsEditID(id);
        setControlPopup(true);
    };

    // Buscar categorias ao carregar o componente
    useEffect(() => {
        const fetchTag = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/get/tagList');
                const data = await res.json();
                setTags(data);
            } catch (error) {
                console.log('Erro ao buscar a lista de tags', error);
            }
        };
        fetchTag();
    }, []);

    return (
        <div>
            {showInList ? "" : <h2 className="text-xl font-bold mb-4">Tags</h2>}

            {listTags.map((item) => (
                <div key={item.id} className="mb-2 flex items-center gap-4">
                    {showInList ? (
                        <div className='list-tags'>
                            <span>{item.name}</span>
                        </div>

                    ) : (
                        <>
                            <span>{item.name}</span>
                            <span>{item.id}</span>
                            <button
                                onClick={() => editTag(item.id)}
                                className="px-2 py-1 bg-blue-500 text-white rounded"
                            >
                                Edit
                            </button>
                            <BtnDeleteTag
                                tagID={item.id}
                                onDelete={() => {
                                    toggleControlPopup();
                                }}
                            />
                        </>
                    )}


                </div>
            ))}

            {/* Popup do formulário */}
            {controlPopup && (
                <AddTag
                    propsTagID={tagsEditID}
                    handletoggleControlPopup={toggleControlPopup}
                    controlPopup={controlPopup}
                />
            )}
        </div>
    );
}
