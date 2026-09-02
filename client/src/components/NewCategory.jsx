import React, { useState, useEffect } from 'react'

export default function AddCategory({ adminKey, propsCategoryID, handleToggleControlPopup, controlPopup }) {
    
    const API_BASE_URL =
        import.meta.env.VITE_API_URL || import.meta.env.API_URL_PROD;

    const TOKEN_FOR_API = import.meta.env.API_SECRET;
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN_FOR_API}`,
        "x-admin-key": adminKey,
    };

    const [formNewCategory, setFormNewCategory] = useState({
        name: '',
        isActive: true,
    })

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (propsCategoryID) {
            setLoading(true);
            const fetchCategory = async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/categories/${propsCategoryID}`,{headers})
                    const data = await res.json()
                    setFormNewCategory({
                        name: data.data.name || '',
                        isActive: data.data.isActive ?? true,
                    })
                } catch (error) {
                    console.error('Failed to fetch category:', error)
                }
                finally {
                    setLoading(false);
                }
            }
            fetchCategory();
        } else {
            setFormNewCategory({ name: '', isActive: true })
            setLoading(false);
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

        if (!adminKey) {
            alert('For this action, please provide the admin key.');
            return;
        }

        setLoading(true);
        const endpoint = propsCategoryID
            ? `${API_BASE_URL}/api/categories/${propsCategoryID}`
            : `${API_BASE_URL}/api/categories`

        const method = propsCategoryID ? 'PUT' : 'POST'

        try {
            const res = await fetch(endpoint, {
                method,
                headers,
                body: JSON.stringify(formNewCategory),
            })

            if (res.status === 403) {
                alert('For this action, please provide the admin key.');
                setLoading(fals);
                return;
            }

            setFormNewCategory({ name: '', isActive: true })
            handleToggleControlPopup();

        } catch (error) {
            console.error('Erro na requisição:', error)
            setLoading(false);
        }
        finally {
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
