import React, { useEffect, useState } from "react"

export default function AddCategory() {
    const [ controlPopup, setControlPopup ] = useState(false)

    const toggleControlPopup = () => {
        setControlPopup(!controlPopup)
    }

    const [formNewCategory, setFormNewCategory] = useState({
        name: '',
        isActive: '',
        updateAt: '',
    })

    const handleChange = (e) => {
        setFormNewCategory({
            ...formNewCategory,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventEventDefault()
        console.log('e category: ', e)
        console.log('Form category: ', formNewCategory)
        const res = await fetch('/api/new/addCategory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formNewCategory),
        })
        toggleControlPopup()
        if (res.ok) {
            setFormNewCategory({ name: '', isActive: '', updateAt: '' })
        } else {
            console.log('erro')
        }
    }


    return (
        <div className="main-content">
            <button onClick={toggleControlPopup}>
                Add category
            </button>

            {controlPopup && (
                <>
                    <h2> Create New Category </h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            name='name'
                            placeholder="Category name"
                            value={formNewCategory.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name='isActive'
                            type='radio'
                            value={formNewCategory.isActive}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit"> Create</button>
                    </form>
                </>
            )}
        </div>
    );

}