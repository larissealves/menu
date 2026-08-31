import React, { useEffect, useState } from 'react';

export default function AddDishes({ adminKey, propDishID, handleToggleControlPopup, controlPopup }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';

  const TOKEN_FOR_API = import.meta.env.VITE_API_SECRET;
  const headers = {
    Authorization: `Bearer ${TOKEN_FOR_API}`,
    "x-admin-key": adminKey,
  };

  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const [listTempImages, setListImageTemp] = useState([]);
  const [imagesEditDish, setImagesEditDish] = useState([]);

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
          const res = await fetch(`${API_BASE_URL}/api/dishes/${propDishID}`);
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
          const res = await fetch(`${API_BASE_URL}/api/tags/${propDishID}/dishes`);
          const data = await res.json();
          const tags = data.map((item) => item.tagId);
          setFormDishes((prev) => ({ ...prev, tags }));
        } catch (error) {
          console.error('Erro ao buscar tags do prato:', error);
        }
      };

      const fetchDishIngredients = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/ingredients/${propDishID}/dishes`);
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



  /* ================= FLOW IMAGES - FOR DATA BASE =========================== */
  useEffect(() => {
    if (!propDishID) return;

    const fetchImagesEditDish = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/images/${propDishID}/dishes`, { headers, });
        const data = await res.json();

        if (Array.isArray(data)) {
          const imagesWithPreview = data.map((img) => {
            const byteArray = Object.values(img.binaryData);
            const uint8 = new Uint8Array(byteArray);
            const blob = new Blob([uint8], { type: img.imageType });
            const previewUrl = URL.createObjectURL(blob);
            return { ...img, previewUrl };
          });

          setImagesEditDish(imagesWithPreview);
        } else {
          setImagesEditDish([]);
        }
      } catch (error) {
        console.error('Erro ao buscar imagens:', error);
        setImagesEditDish([]);
      }
      finally {
        setLoading(false);
      }
    };

    fetchImagesEditDish();
  }, [propDishID]);

  const handleDeleteImage = async (id) => {
    if (!adminKey) {
      setStatus('For delete image, please provide the admin key.');
      return;
    }
    setStatus("");
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/delete/imageByDishId/${id}`, {
        headers,
        method: 'DELETE',
      });

      if (!res.ok) {
        setStatus('For delete image, please provide the admin key.');
        return;
      }

      setImagesEditDish((prev) => prev.filter((img) => img.id !== id));

    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
       setStatus('Erro ao deletar imagem:');
    }
    finally {
      setLoading(false);
    }
  };

  /* ================= (END) FLOW IMAGES - FOR DATA BASE =========================== */

  /* ================= FLOW IMAGES - ONLY FORM =========================== */
  const handleTempImage = (e) => {
    const files = Array.from(e.target.files);

    const sizeAvaliable = 4 - listTempImages.length;
    const selectedFiles = files.slice(0, sizeAvaliable);

    if (sizeAvaliable <= 0) {
      e.target.value = "";
      return;
    }

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setListImageTemp((prev) => [...prev, { name: file.name, file, preview: reader.result }]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleRemoveTempImage = (index) => {
    setListImageTemp((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setStatus('');
    const { name, value, type, checked } = e.target;
    setFormDishes((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /* ================= (END) FLOW IMAGES- ONLY FORM =========================== */

  useEffect(() => {
    setLoading(true);
    const fetchAll = async () => {
      try {
        const [catRes, ingRes, tagRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/categories?onlyActives=${true}`, { headers, }),
          fetch(`${API_BASE_URL}/api/ingredients?onlyActives=${true}`, { headers, }),
          fetch(`${API_BASE_URL}/api/tags?onlyActives=${true}`, { headers, }),
        ]);

        const dataCat = await catRes.json();
        const dataTag = await tagRes.json();
        const dataIng =  await ingRes.json();

        setCategories(dataCat.data);
        setTags(dataTag.data);
        setIngredients(dataIng.data);
        
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
      }finally{
        setLoading(false);
      }
    };
    fetchAll();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!adminKey) {
      setStatus('Error. For this action, please provide the admin key');
      return;
    }

    setStatus('');

    if (!formDishes.name.trim() || !formDishes.price || !formDishes.categoryId) {
      setStatus('Nome, Preço e Categoria são obrigatórios.');
      return;
    }

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
      ? `${API_BASE_URL}/api/dishes/${propDishID}`
      : `${API_BASE_URL}/api/dishes`;
    const method = propDishID ? 'PUT' : 'POST';

    try {
      setLoading(true);
      const res = await fetch(endpoint, {
        method,
        headers,
        body: formData,
      });

      if (!res.ok) {
        console.error('Erro da API', res.statusText)
        setStatus(`Error. 
          ${res.status === 403
            ? 'For this action, please provide the admin key.'
            : 'Status:' `${res.status}`
          }`);
        return;
      }

      setStatus(propDishID ? "Prato editado com sucesso!" : 'Prato salvo com sucesso!');
      setListImageTemp([]);
      setFormDishes({
        name: '',
        price: '',
        description: '',
        categoryId: '',
        isActive: true,
        ingredients: [],
        tags: [],
        listImages: [],
      });


      handleToggleControlPopup();

    } catch (error) {
      console.error('Erro na requisição:', error);
      setStatus('Erro na requisição.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      {controlPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] p-6 relative flex flex-col ">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2">
              <h2 className="text-xl font-semibold">{propDishID ? 'Edit Dish' : 'New Dish'}</h2>

              {!loading && (
                <button onClick={handleToggleControlPopup}
                  className="text-gray-600 cursor-pointer hover:text-gray-400 text-xl font-bold">
                  ×
                </button>
              )}
            </div>

            <div className="overflow-y-auto flex-grow">
              <div className="flex flex-col md:flex-row gap-10">
                <form onSubmit={handleSubmit} className="flex-1 space-y-4">

                  <input name="name" placeholder="Name"
                    value={formDishes.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 capitalize border-gray-300 
                    rounded-md text-l" required />

                  <input name="price" type="number" step="0.01" placeholder="Price"
                    value={formDishes.price}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 border-gray-300 
                    rounded-md text-l" required />

                  <textarea name="description" placeholder="Description..."
                    value={formDishes.description}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 border-gray-300 
                    rounded-md text-l" required />

                  <div className='flex flex-row gap-4'>
                    <select name="categoryId" value={formDishes.categoryId}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2 capitalize border-gray-300 
                    rounded-md text-l  w-full " required>
                      <option value="">-- Categories --</option>
                      {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>

                  <select
                    multiple
                    name="ingredients"
                    value={formDishes.ingredients}
                    onChange={(e) =>
                      setFormDishes((prev) => ({
                        ...prev,
                        ingredients: Array.from(e.target.selectedOptions, o => Number(o.value)),
                      }))
                    }
                    className="w-full cursor-pointer border rounded px-3 py-2 capitalize border-gray-300 
                    rounded-md text-l w-full ">
                    <option value="">-- Ingredients --</option>
                    {ingredients.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>

                  <select multiple name="tags" value={formDishes.tags} onChange={(e) => setFormDishes((prev) => ({ ...prev, tags: Array.from(e.target.selectedOptions, o => Number(o.value)) }))}
                    className="w-full border rounded px-3 py-2 capitalize border-gray-300 
                    rounded-md text-l w-full cursor-pointer">
                    <option value="">-- Tags --</option>
                    {tags.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>

                  <div>
                    <label className="flex flex-1 items-center gap-2">
                      <input type="checkbox" name="isActive"
                        checked={formDishes.isActive}
                        onChange={handleChange} />
                      <span>{formDishes.isActive ? 'Ativo' : 'Dish disabled'}</span>
                    </label>
                  </div>


                  <div className="flex-1">
                    {[...imagesEditDish, ...listTempImages].length < 4 && !loading && (
                      <label htmlFor="image-upload"
                        className="cursor-pointer inline-block px-4 py-2 mb-4 bg-blue-600 text-white rounded 
                        hover:bg-blue-700 transition w-auto text-center">
                        Anexar Imagens
                        <input id="image-upload" type="file" multiple accept="image/*"
                          onChange={handleTempImage} className="hidden" />
                      </label>
                    )}

                    <div className="grid grid-cols-4 gap-2">
                      {[...imagesEditDish, ...listTempImages].map((item, index) => (
                        <div key={index} className="relative border p-2 rounded w-fit">
                          <img src={item.id ? item.previewUrl : item.preview} alt={`img-${index}`}
                            className=" h-fit object-cover rounded  w-fit" />
                          {!loading && (
                            <button type="button"
                              disabled={loading}
                              onClick={() => item.id
                                ? handleDeleteImage(item.id)
                                : handleRemoveTempImage(index)
                              }
                              className="absolute cursor-pointer top-1 right-1 text-white
                              bg-red-500 rounded-full px-2">
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sticky bottom-0 bg-white py-2">
                    <button type="submit" disabled={loading}
                      className={`w-full cursor-pointer py-2 rounded text-white 
                      ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                      {loading ? 'Loading...' : propDishID ? 'Update' : 'Create'}
                    </button>
                    {status && <p className="text-red-600 text-center mt-2">{status}</p>}
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div >
      )
      }
    </div >
  );
}
