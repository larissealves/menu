import React, { useEffect, useState } from 'react';
import blankimage from '../assets/images/blank-image.png'

export default function ListImagesByDish({ dishId }) {
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (!dishId) return;

        const fetchImages = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/get/imagesByDishId/${dishId}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setImages(data);
                } else {
                    console.warn('Resposta inesperada:', data);
                    setImages([]);
                }
            } catch (error) {
                console.error('Erro ao buscar imagens:', error);
                setImages([]);
            }
        };

        fetchImages();
    }, [dishId]);



    return (
        <div className="flex gap-4 flex-wrap">
            {images.length === 0 ? (
                <img
                    src={blankimage}
                    alt={'blank image'}
                    className="w-32 h-32 object-cover rounded border"
                />
                ) : 
                <>
                    {images.map((img) => (
                    console.log('aaaa', img.imageUrl),
                    <img
                        key={img.id}
                        src={`http://localhost:5173${img.imageUrl}`}
                        alt={images.imageName}
                        className="w-32 h-32 object-cover rounded border"
                    />
                    ))} 
                </>
            }
        </div>
    );
}
