import React, { useEffect, useState } from 'react';

export default function AddDishes({ propDishID, togglePopup, controlPopup }) {
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [tags, setTags] = useState([]);

  // ============== IMAGE - TEMP LIST ===================
  const [listTempImages, setListImageTemp] = useState([]);

  const handleTempImage = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setListImageTemp((prev) => [...prev, { name: file.name, file, preview: reader.result }]);
      };
      reader.readAsDataURL(file); // gera base64 para preview
    });
  };

  // Remover= 
  const handleRemoveTempImage = (index) => {
    setListImageTemp((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearTempImage = () => {
    setListImageTemp([]);
  }

  // ============== END IMAGE  ===================

  const [formDishes, setFormDishes] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: '',
    ingredients: [],
    tags: [],
  });

  const [status, setStatus] = useState('');

  // Buscar tags vinculados ao prato se for edição
  useEffect(() => {
    if (propDishID) {
      const fetchTagEditDish = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/get/filterTagByDishId/${propDishID}`);
          const data = await res.json();
          console.log('FRONT - Lista de tags', data)
          const extractTags = data.map((item) => item.tagId);
          setFormDishes((prev) => ({
            ...prev,
            tags: extractTags,
          }));
        } catch (error) {
          console.error('Front - Erro ao buscar pelas tags vinculadas ao prato', error);
        }
      };
      fetchTagEditDish();
    } else {
      setFormDishes((prev) => ({
        ...prev,
        tags: [],
      }));
    }
  }, [propDishID]);


  // Buscar ingredientes vinculados ao prato se for edição
  useEffect(() => {
    if (propDishID) {
      const fetchIngredientsEditDish = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/get/filterIngredientsByDishId/${propDishID}`);
          const data = await res.json();
          const extractIngredients = data.map((item) => item.ingredient.id);
          setFormDishes((prev) => ({
            ...prev,
            ingredients: extractIngredients,
          }));
        } catch (error) {
          console.error('Front - Erro ao buscar pelos ingredientes do prato', error);
        }
      };
      fetchIngredientsEditDish();
    } else {
      setFormDishes((prev) => ({
        ...prev,
        ingredients: [],
      }));
    }
  }, [propDishID]);

  // Buscar dados do prato se for edição
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
            price: data.price || 0,
            categoryId: data.categoryId || '',
          }));
        } catch (error) {
          console.error('Erro ao buscar pelos dados do prato', error);
        }
      };
      fetchDish();
    } else {
      setFormDishes({
        name: '',
        price: '',
        description: '',
        categoryId: '',
        ingredients: [],
        tags: [],
      });
    }
  }, [propDishID]);

  // Buscar categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/get/categoryList');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Erro ao buscar categorias', error);
      }
    };
    fetchCategories();
  }, []);

  // Buscar ingredientes
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/get/ingredientList');
        const data = await res.json();
        setIngredients(data);
      } catch (error) {
        console.error('Front - Erro ao buscar ingredientes', error);
      }
    };
    fetchIngredients();
  }, []);

  // Buscar tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/get/tagList');
        const data = await res.json();
        setTags(data);
      } catch (error) {
        console.error('Front - Erro ao buscar tags', error);
      }
    };
    fetchTags();
    console.log('Lista tags:', tags)
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDishes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = propDishID
      ? `http://localhost:5000/api/update/editDishes/${propDishID}`
      : `http://localhost:5000/api/new/addDishes`;

    const method = propDishID ? 'PUT' : 'POST';
    console.log('Formulário add dish', JSON.stringify(formDishes),)
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDishes),
      });

      if (res.ok) {
        setStatus('Prato salvo com sucesso!');
        setFormDishes({
          name: '',
          price: '',
          description: '',
          categoryId: '',
          ingredients: [],
        });
        togglePopup();
      } else {
        setStatus('Erro ao salvar prato.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  return (
    <div className="main-content">
      <button onClick={togglePopup}>
        {controlPopup ? 'Fechar Formulário' : 'Adicionar Prato'}
      </button>

      {controlPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {propDishID ? 'Editar Prato' : 'Criar Novo Prato'}
              </h2>
              <button
                onClick={togglePopup}
                className="text-gray-600 hover:text-red-600 text-xl font-bold"
                title="Fechar"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                placeholder="Nome do prato"
                value={formDishes.name}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="price"
                placeholder="Preço"
                value={formDishes.price}
                onChange={handleChange}
                required
                type="number"
                step="0.01"
                className="w-full border rounded px-3 py-2"
              />
              <textarea
                name="description"
                placeholder="Descrição"
                value={formDishes.description}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
              <select
                name="categoryId"
                value={formDishes.categoryId}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Selecione uma categoria --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {/*----- SELECT INGREDIENTS ----- */}
              <select
                multiple
                name="ingredients"
                value={formDishes.ingredients}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions, (opt) => Number(opt.value));
                  setFormDishes((prev) => ({ ...prev, ingredients: options }));
                }}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Selecione um ingrediente --</option>
                {ingredients.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name || item.ingredient?.name || 'Sem nome'}
                  </option>
                ))}
              </select>
              {/*----- SELECT TAGS ----- */}
              <select
                multiple
                name="tags"
                value={formDishes.tags}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions, (opt) => Number(opt.value));
                  setFormDishes((prev) => ({ ...prev, tags: options }));
                }}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Selecione as tags --</option>
                {tags.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name || item.tags?.name || 'Sem nome'}
                  </option>
                ))}
              </select>

              {/* =========== INSERT IMAGEM =========== */}
              <form enctype="multipart/form-data">
                <input
                  type="file"
                  name="image"
                  multiple
                  accept="image/*"
                  onChange={handleTempImage}
                />
              </form>

              {listTempImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {listTempImages.map((item, index) => (
                    <div key={index} className="relative border p-2 rounded">
                      <img
                        src={item.preview}
                        alt={`preview-${index}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTempImage(index)}
                        className="absolute top-1 right-1 text-white bg-red-500 rounded-full px-2"
                      >
                        ×
                      </button>
                      <p className="text-xs mt-1 truncate text-center">{item.name}</p>
                    </div>
                  ))}
                </div>
              )}
              {/* =========== END - INSERT IMAGEM =========== */}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                {propDishID ? 'Atualizar' : 'Criar'}
              </button>

              {status && <p className="text-sm text-center text-green-600">{status}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
