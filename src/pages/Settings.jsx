import React, {useState} from 'react'
import AddDishes from "../components/NewDishes"
import AddCategory from "../components/NewCategory"
import ListCategories from "../components/ListCategories"
import ListAllDishes from '../components/ListDishes'

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

    return(
        <div>
            <AddDishes 
                togglePopup = {handletoggleControlPopupDish}
                controlPopup = {controlPopupDish}
            />

            <AddCategory 
            handletoggleControlPopupCategory= {handletoggleControlPopupCategory} 
            controlPopupCategory = {controlPopupCategory}
            />
            <ListCategories />
            <ListAllDishes />
        </div>
    );
}