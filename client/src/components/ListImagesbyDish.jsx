import React, { useEffect, useState } from 'react';
import blankimage from '../assets/images/blank-image.png'

export default function ListImagesByDish({ dishId }) {
  const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';

  
  const [imagesEditDish, setImagesEditDish] = useState([]);
    
    useEffect(() => {
      if (!dishId) return;
      const fetchImagesEditDish = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/get/imagesByDishId/${dishId}`);
          const data = await res.json();
          console.log('teste imagem', data)
          console.log('api link', API_BASE_URL)
          if (Array.isArray(data)) {
            const imagesWithPreview = data.map((img) => {
              const byteArray = Object.values(img.binaryData); // transforma objeto em array de bytes
              const uint8 = new Uint8Array(byteArray);
              const blob = new Blob([uint8], { type: img.imageType });
              const previewUrl = URL.createObjectURL(blob);
              return { ...img, previewUrl};
            });
    
            setImagesEditDish(imagesWithPreview);
          } else {
            console.warn('Resposta inesperada:', data);
            setImagesEditDish([]);
          }
        } catch (error) {
          console.error('Erro ao buscar imagens:', error);
          setImagesEditDish([]);
        }
      };
    
      fetchImagesEditDish();
    }, [dishId]);
    


    return (
        <div className="flex gap-4 w-full flex-row ">
           {/* {imagesEditDish.length === 0 ? (
                <img
                    src={blankimage}
                    alt={'blank image'}
                    className="w-32 h-32 object-cover rounded border"
                />
                ) : 
                <>*/}
                    {imagesEditDish.map((img) => (
                    <img
                        src={img.previewUrl}
                        key={img.id}
                        alt={img.imageName}
                        className="w-32 h-32 object-cover rounded border"
                    />
                    ))} 
        </div>
    );
}
