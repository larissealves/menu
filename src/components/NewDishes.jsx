import React, { useEffect, useState } from 'react';

export default function AddDishes({ propDishID, togglePopup, controlPopup }) {
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [tags, setTags] = useState([]);
  const [listTempImages, setListImageTemp] = useState([]);
  const [status, setStatus] = useState('');

  const [formDishes, setFormDishes] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: '',
    isActive: true,
    ingredients: [],
    tags: [],
    listImages: [],
  });

  useEffect(() => {
    if (propDishID) {
      const fetchDish = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/get/disheID/${propDishID}`);
          const data = await res.json();
          setFormDishes((prev) => ({
            ...prev,
            name: data.name || '',
            description: data.description || '',
            price: data.price || '',
            isActive: data.isActive ?? true,
            categoryId: data.categoryId || '',
          }));
        } catch (error) {
          console.error('Erro ao buscar dados do prato:', error);
        }
      };

      const fetchDishTags = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/get/filterTagByDishId/${propDishID}`);
          const data = await res.json();
          const tags = data.map((item) => item.tagId);
          setFormDishes((prev) => ({ ...prev, tags }));
        } catch (error) {
          console.error('Erro ao buscar tags do prato:', error);
        }
      };

      const fetchDishIngredients = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/get/filterIngredientsByDishId/${propDishID}`);
          const data = await res.json();
          const ingredients = data.map((item) => item.ingredient.id);
          setFormDishes((prev) => ({ ...prev, ingredients }));
        } catch (error) {
          console.error('Erro ao buscar ingredientes do prato:', error);
        }
      };

      fetchDish();
      fetchDishTags();
      fetchDishIngredients();
    }
  }, [propDishID]);

  // ================ TEMP IMAGE ========================
  const handleTempImage = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setListImageTemp((prev) => [...prev, { name: file.name, file, preview: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveTempImage = (index) => {
    setListImageTemp((prev) => prev.filter((_, i) => i !== index));
  };

  // ================ END TEMP IMAGE ========================

  const handleChange = (e) => {
    setStatus('');
    const { name, value, type, checked  } = e.target;
    setFormDishes((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value,

    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    const formData = new FormData();
    formData.append('name', formDishes.name);
    formData.append('price', formDishes.price);
    formData.append('description', formDishes.description);
    formData.append('categoryId', formDishes.categoryId);
    formData.append('tags', JSON.stringify(formDishes.tags));
    formData.append('isActive', String(formDishes.isActive));
    formData.append('ingredients', JSON.stringify(formDishes.ingredients));
    listTempImages.forEach((img) => {
      formData.append('images', img.file);
    });

    const endpoint = propDishID
      ? `http://localhost:5000/api/update/editDishes/${propDishID}`
      : `http://localhost:5000/api/new/addDishes`;

    const method = propDishID ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        body: formData,
      });

      if (res.ok) {
        setStatus('Dish saved successfully!');
        {! propDishID 
          setListImageTemp([]);
          setFormDishes({ name: '', price: '', description: '', categoryId: '', isActive: true, ingredients: [], tags: [], listImages: [] });
          togglePopup();
        }
        
        setStatus("");
      } else {
        setStatus('Error registering new dish');
        {! propDishID 
        setListImageTemp([]);
        setFormDishes({ ingredients: [], tags: [], listImages: [] });
        }
      }
    } catch (error) {
      console.error('FRONT new dish - Error in request:', error);
      setStatus('FRONT new dish - Error in request ');
    }
    fetchDishes(); 
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [catRes, ingRes, tagRes] = await Promise.all([
          fetch('http://localhost:5000/api/get/categoryList/active'),
          fetch('http://localhost:5000/api/get/ingredientList/active'),
          fetch('http://localhost:5000/api/get/tagList/active'),
        ]);
        setCategories(await catRes.json());
        setIngredients(await ingRes.json());
        setTags(await tagRes.json());
      } catch (error) {
        console.error('FRONT new dish - Error fetching initial data:', error);
      }
    };
    fetchAll();
  }, []);

  // ============= LIST IMAGES - EDIT ===============
const [imagesEditDish, setImagesEditDish] = useState([]);

useEffect(() => {
  if (!propDishID) return;

  const fetchImagesEditDish = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/get/imagesByDishId/${propDishID}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        const imagesWithPreview = data.map((img) => {
          const byteArray = Object.values(img.binaryData); // transforma objeto em array de bytes
          const uint8 = new Uint8Array(byteArray);
          const blob = new Blob([uint8], { type: img.imageType });
          const previewUrl = URL.createObjectURL(blob);
          return { ...img, previewUrl };
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
}, [propDishID]);


// DELETE imagem e atualiza lista
const handleDeleteImage = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/delete/imageByDishId/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      console.log('Imagem deletada com sucesso');
      setImagesEditDish((prev) => prev.filter((img) => img.id !== id));
    } else {
      console.error('Erro ao deletar imagem');
    }
  } catch (error) {
    console.error('Erro ao deletar esta imagem', error);
  }
};

    // ============= END LIST IMAGES - EDIT ===============  

  return (
    <div>
     
      {controlPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] p-6 relative flex flex-col">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2">
              <h2 className="text-xl font-semibold ">{propDishID ? 'Edit Dish' : 'Create Dish'}</h2>
              <button onClick={togglePopup} className="text-gray-600 hover:text-red-600 text-xl  cursor-pointer   font-bold">×</button>
            </div>

            <div className="overflow-y-auto flex-grow">
              <div className="flex flex-col md:flex-row gap-10">
                <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                  <input name="name" placeholder="Nome do prato" value={formDishes.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                  <input name="price" type="number" step="0.01" placeholder="Preço" value={formDishes.price} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                  <textarea name="description" placeholder="Descrição" value={formDishes.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                  <div className='flex flex-row gap-4'>
                  <select name="categoryId" value={formDishes.categoryId} 
                  onChange={handleChange} className="w-full flex-2 border rounded px-3 py-2">
                    <option value="">-- Selecione uma categoria --</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>

                  <label className="flex flex-1 items-center gap-2">
                    <input type="checkbox" name="isActive" checked={formDishes.isActive} onChange={handleChange} />
                    <span>{formDishes.isActive ? 'Active Dish' : 'Disabled Dish'}</span>
                  </label>
                  </div>
                  <select multiple name="ingredients" value={formDishes.ingredients} onChange={(e) => setFormDishes((prev) => ({ ...prev, ingredients: Array.from(e.target.selectedOptions, o => Number(o.value)) }))} className="w-full border rounded px-3 py-2">
                    <option value="">-- Selecione ingredientes --</option>
                    {ingredients.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>

                  <select multiple name="tags" value={formDishes.tags} onChange={(e) => setFormDishes((prev) => ({ ...prev, tags: Array.from(e.target.selectedOptions, o => Number(o.value)) }))} className="w-full border rounded px-3 py-2">
                    <option value="">-- Selecione tags --</option>
                    {tags.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>

                  <div className="sticky bottom-0 bg-white py-2">
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded  cursor-pointer ">{propDishID ? 'Update' : 'Create'}</button>
                    {status && <p className="text-red-600 text-center mt-2">{status}</p>}
                  </div>
                </form>

                <div className="flex-1">
                  <label htmlFor="image-upload" className="cursor-pointer inline-block px-4 py-2 mb-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full text-center">
                    Attach new images
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleTempImage}
                      className="hidden"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[...imagesEditDish, ...listTempImages].map((item, index) => (
                      <div key={index} className="relative border p-2 rounded">
                        <img src={item.preview || item.previewUrl} alt={`img-${index}`} className="w-full h-32 object-cover rounded" />
                        <button type="button" onClick={() => item.id ? handleDeleteImage(item.id) : handleRemoveTempImage(index)} className="absolute  cursor-pointer  top-1 right-1 text-white bg-red-500 rounded-full px-2">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
