import React, {useState} from 'react'
import AddDishes from "../components/NewDishes"
import AddCategory from "../components/NewCategory"
import ListCategories from '../components/listCategories'

export default function Settings() {
    const [controlPopup, setControlPopup ] = useState(false)

    const handletoggleControlPopup = () => {
        setControlPopup(!controlPopup)
    }

    return(
        <div>
            <AddDishes />
            <AddCategory 
            handletoggleControlPopup= {handletoggleControlPopup} 
            controlPopup = {controlPopup}
            />
            <ListCategories />
        </div>
    );
}