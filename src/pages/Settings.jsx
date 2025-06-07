import AddDishes from "../components/NewDishes"
import AddCategory from "../components/NewCategory"
import ListCategories from '../components/listCategories'

export default function Settings() {

    return(
        <div>
            <AddDishes />
            <AddCategory />
            <ListCategories />
        </div>
    );
}