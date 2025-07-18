import React, { useState, useEffect } from 'react'

export default function AddIngredient({ propsTagID, handletoggleControlPopup, controlPopup }) {

    const [formNewTag, setFormNewTag] = useState({
        name: '',
        isActive: true,
    })

    useEffect(() => {
        if (propsTagID) {
            const fetchTag = async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/get/tagID/${propsTagID}`)
                    const data = await res.json()
                    setFormNewTag({
                        name: data.name || '',
                        isActive: data.isActive ?? true,
                    })
                } catch (error) {
                    console.error('Failed to fetch tag', error)
                }
            }
            fetchTag()
        } else {
            setFormNewTag({ name: '', isActive: true })
        }
    }, [propsTagID])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormNewTag((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const endpoint = propsTagID
            ? `http://localhost:5000/api/update/tag/${propsTagID}`
            : `http://localhost:5000/api/new/tag`

        const method = propsTagID ? 'PUT' : 'POST'

        try {
            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formNewTag),
            })

            if (res.ok) {
                setFormNewTag({ name: '', isActive: true })
                handletoggleControlPopup()
            } else {
                console.error('Erro ao cadastrar a tag')
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
                                {propsTagID ? 'Edit' : 'Create'} Tag
                            </h2>
                            <button
                                onClick={handletoggleControlPopup}
                                className="text-gray-500 cursor-pointer hover:text-gray-800 text-2xl font-bold leading-none"
                                aria-label="Close"
                            >
                                ×
                            </button>
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
                                    className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                >
                                    {propsTagID ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}
