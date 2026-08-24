import React, { useEffect, useState } from 'react';
import { PlusCircle, LayoutGrid, Utensils, Tag, List } from 'lucide-react';
import { useNavigate, Link } from "react-router-dom";

import ListCategories from '../components/ListCategories';
import ListAllDishes from '../components/ListDishes';
import ListIngredient from '../components/ListIngredient';
import ListTags from '../components/ListTags';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('categories');

  const [controlPopupDish, setControlPopupDish] = useState(false);
  const [controlPopupCategory, setControlPopupCategory] = useState(false);
  const [controlPopupIngredient, setControlPopupIngredient] = useState(false);
  const [controlPopupTag, setControlPopupTag] = useState(false);


  const tabs = [
    { key: 'categories', label: 'Categories', icon: <LayoutGrid size={16} /> },
    { key: 'tags', label: 'Tags', icon: <Tag size={16} /> },
    { key: 'ingredients', label: 'Ingredients', icon: <List size={16} /> },
    { key: 'dishes', label: 'Dishes', icon: <Utensils size={16} /> },

  ];

  const toggleCategoryPopup = () => {
    setControlPopupCategory((prev) => !prev);
  }

  const toggleTagPopup = () => {
    setControlPopupTag((prev) => !prev);
  }

  const toggleIngredientsPopup = () => {
    setControlPopupIngredient((prev) => !prev);
  }

  const toggleControlPopup = () => {
    setControlPopupDish((prev) => !prev);
  };
  

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <Link to="/" className="text-blue-600 underline font-bold"> ← BACK TO HOME </Link>
      <br></br>
      <br></br>
      <Link to="/ProjectDocumentation" target="_blank" className="text-blue-600 underline font-bold">
        Project Documentation → </Link>
      {/* Ações */}
      <div className="flex flex-wrap gap-4 justify-end mt-4">
        <button onClick={() =>{ setControlPopupCategory(true); setActiveTab('categories')}} className="bg-purple-400 hover:bg-purple-700 text-white  font-semibold cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2">
          <PlusCircle size={18} /> Category
        </button>
        <button onClick={() => {setControlPopupTag(true); setActiveTab('tags')}} className="bg-purple-400 hover:bg-purple-700 text-white font-semibold  cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2">
          <PlusCircle size={18} /> Tag
        </button>
        <button onClick={() => {setControlPopupIngredient(true), setActiveTab('ingredients')}} className="bg-purple-400 hover:bg-purple-700 text-white  cursor-pointer font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
          <PlusCircle size={18} /> Ingredient
        </button>
        <button onClick={() => {setControlPopupDish(true), setActiveTab('dishes')}} className="bg-pink-600 hover:bg-pink-700 text-white font-semibold cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2">
          <PlusCircle size={18} /> Dish
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2 text-sm font-medium text-gray-600  w-full md:w-auto flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1 px-3 py-1 border-b-2 transition cursor-pointer w-full md:w-auto ${activeTab === tab.key
                ? 'border-fuchsia-600 text-fuchsia-600 font-semibold  '
                : 'border-transparent hover:text-violet'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="bg-white rounded-xl shadow p-6 ">

        {activeTab === 'categories' &&
          <ListCategories categoriesControlPopup={controlPopupCategory} onClose={toggleCategoryPopup}
          />
        }

        {activeTab === 'tags' &&
          <ListTags tagControlPopup={controlPopupTag} onClose={toggleTagPopup}
          />
        }

        {activeTab === 'ingredients' && 
          <ListIngredient ingredientControlPopup={controlPopupIngredient} onClose={toggleIngredientsPopup}
          />
        }
        
        {activeTab === 'dishes' && 
            <ListAllDishes dishcontrolPopup={controlPopupDish} onClose={toggleControlPopup} 
          />
        }

      </div>      
    </div>
  );
}
