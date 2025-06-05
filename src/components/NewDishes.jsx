import React, { useEffect, useState } from 'react';

export default function AddDishes() {
  const [controlPopup, setControlPopup] = useState(false);
  const togglePopup = () => {
    setControlPopup(!controlPopup);
  };

  const [categories, setCategories] = useState([]);
  const [formDishes, setFormDishes] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: '',
  });
  const [status, setStatus] = useState('');

  // Buscar categorias do backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/get/categoryList');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.log('Failed to fetch categories: ', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormDishes({
      ...formDishes,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/new/addDishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formDishes),
    });

    if (res.ok) {
      setStatus('Dish created successfully!');
      setFormDishes({ name: '', price: '', description: '', categoryId: '' });
    } else {
      setStatus('Failed to create dish.');
    }
  };

  return (
    <div className="main-content">
      <button onClick={togglePopup}>
        {controlPopup ? 'Close Form' : 'Add Dish'}
      </button>

      {controlPopup && (
        <div>
          <h2>Create New Dish</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Dish name"
              value={formDishes.name}
              onChange={handleChange}
              required
            />
            <input
              name="price"
              placeholder="Price"
              value={formDishes.price}
              onChange={handleChange}
              required
              type="number"
              step="0.01"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formDishes.description}
              onChange={handleChange}
              required
            />
            <select
              name="categoryId"
              value={formDishes.categoryId}
              onChange={handleChange}
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button type="submit">Create</button>
          </form>
          {status && <p>{status}</p>}
        </div>
      )}
    </div>
  );
}
