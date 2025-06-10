import { image } from 'framer-motion/client';
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
    ingredients: [],
    tags: [],
    listImages: [],
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDishes((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', formDishes.name);
    formData.append('price', formDishes.price);
    formData.append('description', formDishes.description);
    formData.append('categoryId', formDishes.categoryId);
    formData.append('tags', JSON.stringify(formDishes.tags));
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
        setStatus('Prato salvo com sucesso!');
        setListImageTemp([]);
        setFormDishes({ name: '', price: '', description: '', categoryId: '', ingredients: [], tags: [], listImages: [] });
        togglePopup();
      } else {
        setStatus('Erro ao salvar prato.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setStatus('Erro de conexão ao tentar salvar prato.');
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [catRes, ingRes, tagRes] = await Promise.all([
          fetch('http://localhost:5000/api/get/categoryList'),
          fetch('http://localhost:5000/api/get/ingredientList'),
          fetch('http://localhost:5000/api/get/tagList'),
        ]);
        setCategories(await catRes.json());
        setIngredients(await ingRes.json());
        setTags(await tagRes.json());
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="main-content">
      <button onClick={togglePopup}>{controlPopup ? 'Fechar Formulário' : 'Adicionar Prato'}</button>

      {controlPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{propDishID ? 'Editar Prato' : 'Criar Novo Prato'}</h2>
              <button onClick={togglePopup} className="text-gray-600 hover:text-red-600 text-xl font-bold">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="name" placeholder="Nome do prato" value={formDishes.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              <input name="price" type="number" step="0.01" placeholder="Preço" value={formDishes.price} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              <textarea name="description" placeholder="Descrição" value={formDishes.description} onChange={handleChange} required className="w-full border rounded px-3 py-2" />

              <select name="categoryId" value={formDishes.categoryId} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                <option value="">-- Selecione uma categoria --</option>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>

              <select multiple name="ingredients" value={formDishes.ingredients} onChange={(e) => setFormDishes(prev => ({ ...prev, ingredients: Array.from(e.target.selectedOptions, opt => Number(opt.value)) }))} className="w-full border rounded px-3 py-2">
                <option value="">-- Selecione ingredientes --</option>
                {ingredients.map((item) => <option key={item.id} value={item.id}>{item.name || item.ingredient?.name || 'Sem nome'}</option>)}
              </select>

              <select multiple name="tags" value={formDishes.tags} onChange={(e) => setFormDishes(prev => ({ ...prev, tags: Array.from(e.target.selectedOptions, opt => Number(opt.value)) }))} className="w-full border rounded px-3 py-2">
                <option value="">-- Selecione tags --</option>
                {tags.map((item) => <option key={item.id} value={item.id}>{item.name || item.tag?.name || 'Sem nome'}</option>)}
              </select>

              <input type="file" name="image" multiple accept="image/*" onChange={handleTempImage} />

              {listTempImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {listTempImages.map((item, index) => (
                    <div key={index} className="relative border p-2 rounded">
                      <img src={item.preview} alt={`preview-${index}`} className="w-full h-32 object-cover rounded" />
                      <button type="button" onClick={() => handleRemoveTempImage(index)} className="absolute top-1 right-1 text-white bg-red-500 rounded-full px-2">×</button>
                      <p className="text-xs mt-1 truncate text-center">{item.name}</p>
                    </div>
                  ))}
                </div>
              )}

              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">{propDishID ? 'Atualizar' : 'Criar'}</button>
              {status && <p className="text-sm text-center text-green-600">{status}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
