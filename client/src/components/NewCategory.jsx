import React, { useState, useEffect } from 'react'

export default function AddCategory({ propsCategoryID, handleToggleControlPopup, controlPopup}) {
    const API_BASE_URL =
        import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';


    const [formNewCategory, setFormNewCategory] = useState({
        name: '',
        isActive: true,
    })

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (propsCategoryID) {
            const fetchCategory = async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/get/categoryID/${propsCategoryID}`)
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
        setLoading(true);
        const endpoint = propsCategoryID
            ? `${API_BASE_URL}/api/update/category/${propsCategoryID}`
            : `${API_BASE_URL}/api/new/category`

        const method = propsCategoryID ? 'PUT' : 'POST'

        try {
            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formNewCategory),
            })

        } catch (error) {
            console.error('Erro na requisição:', error)
            setLoading(false);
        }
        finally {
            setFormNewCategory({ name: '', isActive: true })
            handleToggleControlPopup();
            setLoading(false);
        }
    }



    return (
        <div className="main-content">

            {controlPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50  p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-xl font-semibold">
                                {propsCategoryID ? 'Edit' : 'Create'} Category
                            </h2>
                            {!loading &&
                                <button
                                    onClick={handleToggleControlPopup}
                                    className="text-gray-500 hover:text-gray-800 cursor-pointer text-2xl font-bold leading-none"
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                            }
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
                                    disabled={loading}
                                    className={`cursor-pointer text-white px-4 py-2 rounded transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {loading ? "Loading..." : propsCategoryID ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}
