import React, {useState} from 'react'

import AddDishes from "../components/NewDishes"
import AddCategory from "../components/NewCategory"
import AddIngredient from '../components/NewIngredient'
import ListCategories from "../components/ListCategories"
import ListAllDishes from '../components/ListDishes'
import ListIngredient from '../components/ListIngredient'

export default function Settings() {

    {/*===========POPUP CATEGORY=========== */}
    const [controlPopupCategory, setControlPopupCategory ] = useState(false)

    const handletoggleControlPopupCategory = () => {
        setControlPopupCategory(!controlPopupCategory)
    }

    {/*===========POPUP DISH=========== */}
    const [controlPopupDish, setControlPopupDish ] = useState(false)

    const handletoggleControlPopupDish = () => {
        setControlPopupDish(!controlPopupDish)
    }

    {/*===========POPUP INGREDIENT=========== */}
    const [controlPopupIngredient, setControlPopupIngredient ] = useState(false)

    const handletoggleControlPopupIngredient = () => {
        setControlPopupIngredient(!controlPopupIngredient)
    }

    return(
        <div>
            <AddDishes 
                togglePopup = {handletoggleControlPopupDish}
                controlPopup = {controlPopupDish}
            />

            <AddCategory 
                handletoggleControlPopup= {handletoggleControlPopupCategory} 
                controlPopup = {controlPopupCategory}
            />

            <AddIngredient
                handletoggleControlPopup = {handletoggleControlPopupIngredient}
                controlPopup = {controlPopupIngredient}
            />

            <ListCategories />
            <ListAllDishes />
            <ListIngredient />
        </div>
    );
}