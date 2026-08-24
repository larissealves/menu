import React, { useEffect, useState } from 'react';
import blankimage from '../assets/images/blank-image.png'

export default function ListImagesByDish({ dishId, refresh }) {
  const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';

  const TOKEN_FOR_API = import.meta.env.VITE_API_SECRET;
  const headers = {
      Authorization: `Bearer ${TOKEN_FOR_API}`,
    };

  
  const [imagesEditDish, setImagesEditDish] = useState([]);
    
    useEffect(() => {
      if (!dishId) return;
      const fetchImagesEditDish = async () => {
        try { 
          const res = await fetch(`${API_BASE_URL}/api/get/imagesByDishId/${dishId}`, {headers,});
          const data = await res.json();
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
            //NENHUMA IMAGEM VINCULADA AO PRATO
            setImagesEditDish([]);
          }
        } catch (error) {
          setImagesEditDish([]);
        }
      };
    
      fetchImagesEditDish();
    }, [dishId, refresh]);
    

  return (
    <div className="w-full flex flex-wrap sm:flex-nowrap gap-4">
      {imagesEditDish.map((img) => (
        <img
          key={img.id}
          src={img.previewUrl}
          alt={img.imageName}
          className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded border transition duration-300 hover:scale-180"
        />
      ))}
    </div>
  );
}
