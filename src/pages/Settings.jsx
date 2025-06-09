import React, {useState} from 'react'

import AddDishes from "../components/NewDishes"
import AddCategory from "../components/NewCategory"
import AddIngredient from '../components/NewIngredient'
import AddTag from '../components/NewTag'
import ListCategories from "../components/ListCategories"
import ListAllDishes from '../components/ListDishes'
import ListIngredient from '../components/ListIngredient'
import ListTags from '../components/ListTags'

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

    {/*===========POPUP TAG=========== */}
    const [controlPopupTag, setControlPopupTag ] = useState(false)

    const handletoggleControlPopupTag = () => {
        setControlPopupTag(!controlPopupTag)
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

            <AddTag
                handletoggleControlPopup = {handletoggleControlPopupTag}
                controlPopup = {controlPopupTag}
            />


            <ListCategories />
            <ListAllDishes />
            <ListIngredient />
            <ListTags />
        </div>
    );
}