import React, { useState, useEffect } from 'react'

export default function AddIngredient({ propsIngredientID, handletoggleControlPopup, controlPopup }) {
  const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';


    const [formNewIngredient, setFormNewIngredient] = useState({
        name: '',
        isActive: true,
    })

    useEffect(() => {
        if (propsIngredientID) {
            const fetchIngredient = async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/get/ingredientID/${propsIngredientID}`)
                    const data = await res.json()
                    setFormNewIngredient({
                        name: data.name || '',
                        isActive: data.isActive ?? true,
                    })
                } catch (error) {
                    console.error('Failed to fetch ingredient:', error)
                }
            }
            fetchIngredient()
        } else {
            setFormNewIngredient({ name: '', isActive: true })
        }
    }, [propsIngredientID])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormNewIngredient((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const endpoint = propsIngredientID
            ? `${API_BASE_URL}/api/update/ingredient/${propsIngredientID}`
            : `${API_BASE_URL}/api/new/ingredient`

        const method = propsIngredientID ? 'PUT' : 'POST'

        try {
            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formNewIngredient),
            })

            if (res.ok) {
                setFormNewIngredient({ name: '', isActive: true })
                handletoggleControlPopup()
            } else {
                console.error('Erro ao cadastrar o ingrediente')
            }
        } catch (error) {
            console.error('Erro na requisição:', error)
        }
    }



    return (
        <div className="main-content">
            {controlPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-xl font-semibold">
                                {propsIngredientID ? 'Edit' : 'Create'} Ingredient
                            </h2>
                            <button
                                onClick={handletoggleControlPopup}
                                className="text-gray-500 cursor-pointer  hover:text-gray-800 text-2xl font-bold leading-none"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                name="name"
                                placeholder="Ingredient name"
                                value={formNewIngredient.name}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formNewIngredient.isActive}
                                    onChange={handleChange}
                                    className="accent-blue-600"
                                />
                                <span>{formNewIngredient.isActive ? 'Active' : 'Disabled'}</span>
                            </label>
                            <div className="flex justify-end pt-4 border-t">
                                <button
                                    type="submit"
                                    className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                >
                                    {propsIngredientID ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}
