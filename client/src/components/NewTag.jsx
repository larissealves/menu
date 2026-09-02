import React, { useState, useEffect } from 'react'

export default function NewTag({ adminKey, propsTagID, handletoggleControlPopup, controlPopup }) {

    const API_BASE_URL =
        import.meta.env.VITE_API_URL || import.meta.env.API_URL_PROD;

    const TOKEN_FOR_API = import.meta.env.API_SECRET;
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN_FOR_API}`,
        'x-admin-key': adminKey,
    }

    const isEdit = (propsTagID != null);
    const [loading, setLoading] = useState(false);

    const [formNewTag, setFormNewTag] = useState({
        name: '',
        isActive: true,
    })

    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            const fetchTag = async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/tags/${propsTagID}`, {headers})
                    const data = await res.json()
                    setFormNewTag({
                        name: data.name || '',
                        isActive: data.isActive ?? true,
                    })
                } catch (error) {
                    console.error('Failed to fetch tag', error)
                } finally {
                    setLoading(false);
                }
            }
            fetchTag()
        } else {
            setFormNewTag({ name: '', isActive: true })
        }
    }, [propsTagID, isEdit])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormNewTag((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);

        if (!adminKey) {
            alert('For this action, please provide the admin key.');
            setLoading(false);
            return;
        }

        const endpoint = isEdit
            ? `${API_BASE_URL}/api/tags/${propsTagID}`
            : `${API_BASE_URL}/api/tags`

        const method = isEdit ? 'PUT' : 'POST'

        try {
            const res = await fetch(endpoint, {
                method,
                headers,
                body: JSON.stringify(formNewTag),
            })

            if (res.status === 403) {
                alert('For this action, please provide the admin key.');
                setLoading(false);
                return;
            }

            setFormNewTag({ name: '', isActive: true })
            handletoggleControlPopup();

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
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center  p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-xl font-semibold">
                                {isEdit ? 'Edit' : 'Create'} Tag
                            </h2>
                            {!loading && (
                                <button
                                    onClick={handletoggleControlPopup}
                                    className="text-gray-500 cursor-pointer hover:text-gray-800 text-2xl font-bold leading-none"
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
                                value={formNewTag.name}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formNewTag.isActive}
                                    onChange={handleChange}
                                    className="accent-blue-600"
                                />
                                <span>{formNewTag.isActive ? 'Active' : 'Disabled'}</span>
                            </label>
                            <div className="flex justify-end pt-4 border-t">

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`cursor-pointer text-white px-4 py-2 rounded transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {loading ? 'Loading...'
                                        : isEdit ? 'Update' : 'Create'
                                    }
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}
