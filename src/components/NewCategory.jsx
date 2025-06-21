import React, { useState, useEffect } from 'react'

import BtnDeleteCategory from './BtnDeleteCategory'

export default function AddCategory({ propsCategoryID, handleToggleControlPopup, controlPopup }) {

    const [formNewCategory, setFormNewCategory] = useState({
        name: '',
        isActive: true,
    })

    useEffect(() => {
        if (propsCategoryID) {
            const fetchCategory = async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/get/categoryID/${propsCategoryID}`)
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
                handleToggleControlPopup()
            } else {
                console.error('Erro ao salvar categoria')
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
                                {propsCategoryID ? 'Edit' : 'Create'} Category
                            </h2>
                            <button
                                onClick={handleToggleControlPopup}
                                className="text-gray-500 hover:text-gray-800 cursor-pointer text-2xl font-bold leading-none"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                name="name"
                                placeholder="Category name"
                                value={formNewCategory.name}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formNewCategory.isActive}
                                    onChange={handleChange}
                                    className="accent-blue-600"
                                />
                                <span>{formNewCategory.isActive ? 'Active' : 'Disabled'}</span>
                            </label>
                            <div className="flex justify-end pt-4 gap-4 border-t">
                                <button
                                    type="submit"
                                    className="bg-blue-600  cursor-pointer  text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                >
                                    {propsCategoryID ? 'Update' : 'Create'}
                                </button>

                                {/*propsCategoryID && (
                                    <BtnDeleteCategory
                                        categoryID={propsCategoryID}
                                        onDelete={() => {
                                            toggleControlPopup();
                                        }}
                                    />
                                )*/}
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}
