import React, {useState, useEffect  } from 'react'
export default function AddCategory({ propsCategoryID, toggleControlPopup }) {
  const [controlPopup, setControlPopup] = useState(false)
  const [formNewCategory, setFormNewCategory] = useState({
    name: '',
    isActive: true,
  })

  const handleTogglePopup = () => setControlPopup(!controlPopup)

  useEffect(() => {
    if (propsCategoryID) {
      const fetchCategory = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/update/category/${propsCategoryID}`)
          const data = await res.json()
          setFormNewCategory({
            name: data.name || '',
            isActive: data.isActive ?? true,
          })
        } catch (error) {
          console.error('Failed to fetch category:', error)
        }
      }
      fetchCategory()
    } else {
      setFormNewCategory({ name: '', isActive: true })
    }
  }, [propsCategoryID])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormNewCategory((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const endpoint = propsCategoryID
      ? `http://localhost:5000/api/update/category/${propsCategoryID}`
      : `http://localhost:5000/api/new/category`

    const method = propsCategoryID ? 'PUT' : 'POST'

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formNewCategory),
      })

      if (res.ok) {
        setFormNewCategory({ name: '', isActive: true })
        handleTogglePopup()
      } else {
        console.error('Erro ao salvar categoria')
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
    }
  }

  return (
    <div className="main-content">
      <button onClick={handleTogglePopup}>
        {propsCategoryID ? 'Edit Category' : 'Add Category'}
      </button>

      {controlPopup && (
        <>
          <h2>{propsCategoryID ? 'Edit' : 'Create'} Category</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Category name"
              value={formNewCategory.name}
              onChange={handleChange}
              required
            />
            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={formNewCategory.isActive}
                onChange={handleChange}
              />
              Active
            </label>
            <button type="submit">{propsCategoryID ? 'Update' : 'Create'}</button>
          </form>
        </>
      )}
    </div>
  )
}
