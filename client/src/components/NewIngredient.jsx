import React, { useState, useEffect } from 'react'

export default function AddIngredient({ adminKey, propsIngredientID, handletoggleControlPopup, controlPopup }) {

    const API_BASE_URL =
        import.meta.env.VITE_API_URL || import.meta.env.API_URL_PROD;
    const TOKEN_FOR_API = import.meta.env.API_SECRET;
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN_FOR_API}`,
        "x-admin-key": adminKey,
    };

    const [loading, setLoading] = useState(false);
    const [formNewIngredient, setFormNewIngredient] = useState({
        name: '',
        isActive: true,
    })

    useEffect(() => {
        if (propsIngredientID) {
            setLoading(true);
            const fetchIngredient = async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/ingredients/${propsIngredientID}`, {headers})
                    const data = await res.json()
                    setFormNewIngredient({
                        name: data.name || '',
                        isActive: data.isActive ?? true,
                    })
                } catch (error) {
                    console.error('Failed to fetch ingredient:', error)
                }
                finally {
                    setLoading(false);
                }
            }
            fetchIngredient();
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

        if (!adminKey) {
            alert('For this action, please provide the admin key.');
            return;
        }

        setLoading(true);

        const endpoint = propsIngredientID
            ? `${API_BASE_URL}/api/ingredients/${propsIngredientID}`
            : `${API_BASE_URL}/api/ingredients`

        const method = propsIngredientID ? 'PUT' : 'POST'

        try {
            const res = await fetch(endpoint, {
                method,
                headers,
                body: JSON.stringify(formNewIngredient),
            })

            if (res.status === 403) {
                alert('For this action, please provide the admin key.');
                setLoading(fals);
                return;
            }
            handletoggleControlPopup()
            
            setFormNewIngredient({ name: '', isActive: true })

        } catch (error) {
            console.error('Erro na requisição:', error)
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
                                {propsIngredientID ? 'Edit' : 'Create'} Ingredient
                            </h2>
                            {!loading && (
                                <button
                                    onClick={handletoggleControlPopup}
                                    className="text-gray-500 cursor-pointer  hover:text-gray-800 text-2xl font-bold leading-none"
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                            )}
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
                                    disabled={loading}
                                    className={`cursor-pointer text-white px-4 py-2 rounded transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {loading ? "loading..." : propsIngredientID ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}
